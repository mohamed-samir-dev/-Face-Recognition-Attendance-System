import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, setDoc, getDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { LeaveRequest } from "@/components/admin";

export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const leaveCollection = collection(db, "leaveRequests");
    const q = query(leaveCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const allRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
    
    if (user.accountType === 'Supervisor') {
      return allRequests.filter(req => req.supervisorId === user.id);
    }
    
    if (user.accountType === 'Admin') {
      return allRequests.filter(req => req.routeToAdmin === true);
    }
    
    return allRequests;
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return [];
  }
};

export const submitLeaveRequest = async (requestData: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  try {
    const { getUsers } = await import('../user/userService');
    const users = await getUsers();
    const employee = users.find(u => u.id === requestData.employeeId || u.numericId?.toString() === requestData.employeeId);
    
    let supervisorId, supervisorName, routeToAdmin = false, requesterAccountType;
    
    if (employee) {
      requesterAccountType = employee.accountType;
      
      // Supervisor and Manager requests go to Admin
      if (requesterAccountType === 'Supervisor' || requesterAccountType === 'Manager') {
        routeToAdmin = true;
      } 
      // Employee requests go to their department supervisor
      else if (requesterAccountType === 'Employee') {
        const empDept = employee.department || employee.Department;
        const supervisor = users.find(u => 
          (u.department === empDept || u.Department === empDept) &&
          u.accountType === 'Supervisor'
        );
        if (supervisor) {
          supervisorId = supervisor.id;
          supervisorName = supervisor.name;
        }
      }
    }
    
    const now = new Date().toISOString();
    const timestamp = new Date().getTime();
    const documentId = `leave_req_${requestData.employeeId}_${timestamp}`;
    const requestRef = doc(db, "leaveRequests", documentId);
    
    const leaveData: any = {
      id: documentId,
      ...requestData,
      createdAt: now,
      updatedAt: now,
      routeToAdmin,
      requesterAccountType
    };
    
    if (supervisorId) leaveData.supervisorId = supervisorId;
    if (supervisorName) leaveData.supervisorName = supervisorName;
    
    await setDoc(requestRef, leaveData);
    
    // Dispatch event to update pending leave requests
    window.dispatchEvent(new CustomEvent('leaveRequestUpdated'));
  } catch (error) {
    console.error("Error submitting leave request:", error);
    throw new Error("Failed to submit leave request");
  }
};

export const updateLeaveRequestStatus = async (requestId: string, status: 'Pending' | 'Approved' | 'Rejected'): Promise<void> => {
  try {
    const requestRef = doc(db, "leaveRequests", requestId);
    await updateDoc(requestRef, {
      status,
      updatedAt: new Date().toISOString()
    });
    
    // Dispatch event to update pending leave requests
    window.dispatchEvent(new CustomEvent('leaveRequestUpdated'));
    
    if (status === 'Approved') {
      const leaveRequests = await getLeaveRequests();
      const request = leaveRequests.find(req => req.id === requestId);
      
      if (request) {
        const { addLeaveDaysRecord } = await import('./leaveDaysService');
        await addLeaveDaysRecord({
          employeeId: request.employeeId,
          employeeName: request.employeeName,
          leaveRequestId: request.id,
          leaveDays: request.leaveDays,
          leaveType: request.leaveType,
          startDate: request.startDate,
          endDate: request.endDate,
          approvedAt: new Date().toISOString()
        });
        
        const { getUsers } = await import('../user/userService');
        const users = await getUsers();
        const user = users.find(u => u.numericId?.toString() === request.employeeId || u.id === request.employeeId);
        
        if (user) {
          await updateEmployeeStatusForLeave(user.id, request.startDate, request.endDate);
        }
      }
    } else if (status === 'Rejected') {
      const leaveRequests = await getLeaveRequests();
      const request = leaveRequests.find(req => req.id === requestId);
      
      if (request) {
        const { getUsers } = await import('../user/userService');
        const users = await getUsers();
        const user = users.find(u => u.numericId?.toString() === request.employeeId || u.id === request.employeeId);
        
        if (user && user.status === 'OnLeave') {
          const employeeRef = doc(db, "users", user.id);
          await updateDoc(employeeRef, { status: "Inactive" });
        }
      }
    }
  } catch (error) {
    console.error("Error updating leave request status:", error);
    throw new Error("Failed to update leave request status");
  }
};

const updateEmployeeStatusForLeave = async (employeeId: string, startDate: string, endDate: string): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const leaveStart = new Date(startDate);
    leaveStart.setHours(0, 0, 0, 0);
    const leaveEnd = new Date(endDate);
    leaveEnd.setHours(23, 59, 59, 999);
    
    const employeeRef = doc(db, "users", employeeId);
    const employeeDoc = await getDoc(employeeRef);
    
    if (!employeeDoc.exists()) {
      console.error(`Employee not found in Firebase: ${employeeId}`);
      return;
    }
    
    if (leaveStart <= today && today <= leaveEnd) {
      await updateDoc(employeeRef, { status: "OnLeave" });
      console.log(`Updated status to OnLeave for employee: ${employeeId}`);
    }
  } catch (error) {
    console.error("Error updating employee status for leave:", error);
  }
};

export const checkAndUpdateEmployeeStatuses = async (): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const approvedLeaves = await getLeaveRequests();
    
    const activeLeaves = approvedLeaves.filter(req => {
      if (req.status !== 'Approved') return false;
      const start = new Date(req.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(req.endDate);
      end.setHours(23, 59, 59, 999);
      return start <= today && today <= end;
    });
    
    const expiredLeaves = approvedLeaves.filter(req => {
      if (req.status !== 'Approved') return false;
      const end = new Date(req.endDate);
      end.setHours(23, 59, 59, 999);
      return end < today;
    });
    
    console.log(`Checking leave statuses: ${activeLeaves.length} active, ${expiredLeaves.length} expired`);
    
    const { getUsers } = await import('../user/userService');
    const users = await getUsers();
    
    for (const leave of activeLeaves) {
      const user = users.find(u => u.numericId?.toString() === leave.employeeId || u.id === leave.employeeId);
      if (user && user.status !== 'OnLeave') {
        const employeeRef = doc(db, "users", user.id);
        await updateDoc(employeeRef, { status: "OnLeave" });
        console.log(`Set OnLeave: ${user.id}`);
      }
    }
    
    for (const leave of expiredLeaves) {
      const user = users.find(u => u.numericId?.toString() === leave.employeeId || u.id === leave.employeeId);
      if (user && user.status === 'OnLeave') {
        const hasOtherActiveLeave = activeLeaves.some(l => 
          (l.employeeId === leave.employeeId || l.employeeId === user.numericId?.toString()) && l.id !== leave.id
        );
        if (!hasOtherActiveLeave) {
          const employeeRef = doc(db, "users", user.id);
          await updateDoc(employeeRef, { status: "Active" });
          console.log(`Set Active: ${user.id}`);
        }
      }
    }
  } catch (error) {
    console.error("Error checking and updating employee statuses:", error);
  }
};

export const deleteLeaveRequest = async (requestId: string): Promise<void> => {
  try {
    // Get the leave request to find the employee ID
    const leaveRequests = await getLeaveRequests();
    const request = leaveRequests.find(req => req.id === requestId);
    
    // If the request was approved, delete the corresponding leave days record first
    if (request && request.status === 'Approved') {
      const { deleteLeaveDaysRecord } = await import('./leaveDaysService');
      await deleteLeaveDaysRecord(requestId);
      
      // Dispatch event to update leave days in UI
      window.dispatchEvent(new CustomEvent('leaveDaysUpdated', {
        detail: { employeeId: request.employeeId }
      }));
      
      // Revert employee status to Active if currently OnLeave
      const { getUsers } = await import('../user/userService');
      const users = await getUsers();
      const user = users.find(u => u.numericId?.toString() === request.employeeId || u.id === request.employeeId);
      
      if (user && user.status === 'OnLeave') {
        const approvedLeaves = await getLeaveRequests();
        const hasOtherActiveLeave = approvedLeaves.some(l => 
          l.id !== requestId &&
          l.status === 'Approved' &&
          (l.employeeId === request.employeeId || l.employeeId === user.numericId?.toString())
        );
        
        if (!hasOtherActiveLeave) {
          const employeeRef = doc(db, "users", user.id);
          // Only change status if currently OnLeave
          if (user.status === 'OnLeave') {
            await updateDoc(employeeRef, { status: "Inactive" });
          }
        }
      }
    }
    
    // Delete the leave request
    const requestRef = doc(db, "leaveRequests", requestId);
    await deleteDoc(requestRef);
    
    // Dispatch event to update pending leave requests
    window.dispatchEvent(new CustomEvent('leaveRequestUpdated'));
  } catch (error) {
    console.error("Error deleting leave request:", error);
    throw new Error("Failed to delete leave request");
  }
};