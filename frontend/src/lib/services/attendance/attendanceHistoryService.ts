import { collection, query, where, getDocs, orderBy, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { AttendanceHistoryRecord } from "@/lib/types/attendanceHistory";
import { getLeaveRequests } from "../leave/leaveService";

export async function recordAttendanceHistory(
  userId: string,
  userName: string,
  status: 'Present' | 'Late',
  checkInTime: string,
  isLate: boolean,
  lateMinutes: number = 0
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const leaveRequests = await getLeaveRequests();
    const onLeave = leaveRequests.find(req => 
      req.employeeId === userId &&
      req.status === 'Approved' &&
      req.startDate <= today &&
      req.endDate >= today
    );

    const { getUsers } = await import('../user/userService');
    const users = await getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) return;

    // Find department supervisor
    const userDept = user.department || user.Department;
    const supervisor = users.find(u => 
      (u.department === userDept || u.Department === userDept) &&
      u.accountType === 'Supervisor'
    );

    const historyData: any = {
      userId,
      employeeName: userName,
      date: today,
      checkIn: checkInTime,
      status: onLeave ? 'OnLeave' : status,
      isLate,
      lateMinutes: isLate ? lateMinutes : 0,
      wasOnLeave: !!onLeave,
      timestamp: new Date(),
      workedHours: 0
    };

    if (supervisor) {
      historyData.supervisorId = supervisor.id;
      historyData.supervisorName = supervisor.name;
      console.log('Recording attendance with supervisor:', {
        employee: userName,
        supervisor: supervisor.name,
        supervisorId: supervisor.id,
        department: userDept
      });
    } else {
      console.log('No supervisor found for employee:', userName, 'in department:', userDept);
    }

    if (user.department || user.Department) historyData.department = user.department || user.Department;
    if (user.jobTitle) historyData.jobTitle = user.jobTitle;
    if (user.email) historyData.email = user.email;
    if (user.phone) historyData.phone = user.phone;
    if (user.numericId) historyData.numericId = user.numericId;
    if (user.accountType) historyData.accountType = user.accountType;
    if (user.salary) historyData.salary = user.salary;
    if (user.status) historyData.employeeStatus = user.status;
    
    // Get real geolocation with reverse geocoding
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { 
            timeout: 15000, 
            enableHighAccuracy: true,
            maximumAge: 0
          });
        });
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Use OpenStreetMap Nominatim for reverse geocoding
        try {
          const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            { headers: { 'User-Agent': 'AttendanceSystem/1.0' } }
          );
          const geoData = await geoResponse.json();
          
          if (geoData.address) {
            const addr = geoData.address;
            const parts = [
              addr.road || addr.street || addr.pedestrian,
              addr.suburb || addr.neighbourhood || addr.quarter,
              addr.city || addr.town || addr.village,
              addr.state || addr.province,
              addr.country
            ].filter(Boolean);
            
            historyData.checkInLocation = parts.join(', ') || geoData.display_name;
          } else {
            historyData.checkInLocation = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
          }
        } catch (geoError) {
          historyData.checkInLocation = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
        }
      } catch (error) {
        historyData.checkInLocation = 'Location permission denied';
      }
    } else {
      historyData.checkInLocation = 'Geolocation not supported';
    }
    
    // Get detailed device information
    const ua = navigator.userAgent;
    const platform = navigator.platform || 'Unknown';
    let deviceInfo = 'Unknown Device';
    
    if (ua.includes('Windows NT 10.0')) deviceInfo = 'Windows 10/11 PC';
    else if (ua.includes('Windows NT 6.3')) deviceInfo = 'Windows 8.1 PC';
    else if (ua.includes('Windows NT 6.2')) deviceInfo = 'Windows 8 PC';
    else if (ua.includes('Windows NT 6.1')) deviceInfo = 'Windows 7 PC';
    else if (ua.includes('Windows')) deviceInfo = 'Windows PC';
    else if (ua.includes('Mac OS X')) {
      const version = ua.match(/Mac OS X ([\d_]+)/);
      deviceInfo = version ? `macOS ${version[1].replace(/_/g, '.')}` : 'macOS';
    }
    else if (ua.includes('iPhone')) {
      const version = ua.match(/iPhone OS ([\d_]+)/);
      deviceInfo = version ? `iPhone (iOS ${version[1].replace(/_/g, '.')})` : 'iPhone';
    }
    else if (ua.includes('iPad')) {
      const version = ua.match(/CPU OS ([\d_]+)/);
      deviceInfo = version ? `iPad (iOS ${version[1].replace(/_/g, '.')})` : 'iPad';
    }
    else if (ua.includes('Android')) {
      const version = ua.match(/Android ([\d.]+)/);
      deviceInfo = version ? `Android ${version[1]} Device` : 'Android Device';
    }
    else if (ua.includes('Linux')) deviceInfo = 'Linux PC';
    
    // Add browser info
    let browser = 'Unknown Browser';
    if (ua.includes('Edg/')) browser = 'Microsoft Edge';
    else if (ua.includes('Chrome/')) browser = 'Google Chrome';
    else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
    
    historyData.deviceInfo = `${deviceInfo} - ${browser}`;
    
    // Get real public IP address with geolocation data
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      historyData.ipAddress = ipData.ip;
      
      // Optional: Get IP geolocation for verification
      try {
        const ipGeoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const ipGeoData = await ipGeoResponse.json();
        if (ipGeoData.city && ipGeoData.country_name) {
          historyData.ipLocation = `${ipGeoData.city}, ${ipGeoData.country_name}`;
        }
      } catch {}
    } catch (error) {
      historyData.ipAddress = 'Unable to detect';
    }

    if (onLeave?.reason) {
      historyData.leaveReason = onLeave.reason;
    }

    await addDoc(collection(db, "attendanceHistory"), historyData);
  } catch (error) {
    console.error("Error recording attendance history:", error);
    throw error;
  }
}

export async function getUserAttendanceHistory(userId: string): Promise<AttendanceHistoryRecord[]> {
  try {
    const historyRef = collection(db, "attendanceHistory");
    const q = query(
      historyRef,
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
    } as AttendanceHistoryRecord));
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    return [];
  }
}

export async function checkIfOnLeaveToday(userId: string): Promise<{
  isOnLeave: boolean;
  leaveReason?: string;
}> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const leaveRequests = await getLeaveRequests();
    
    const activeLeave = leaveRequests.find(req => 
      req.employeeId === userId &&
      req.status === 'Approved' &&
      req.startDate <= today &&
      req.endDate >= today
    );

    return {
      isOnLeave: !!activeLeave,
      leaveReason: activeLeave?.reason
    };
  } catch (error) {
    console.error("Error checking leave status:", error);
    return { isOnLeave: false };
  }
}
