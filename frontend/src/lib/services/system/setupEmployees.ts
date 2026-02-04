import { db } from "@/lib/firebase/config";
import {doc, setDoc } from "firebase/firestore";
interface Employee {
  name: string;
  email: string;
  department: string;
  position: string;
  photoUrl?: string;
  phone?: string;
  address?: string;
  salary?: number;
  hireDate: string;
}

// Sample employee data - replace with your actual employees
const sampleEmployees: Employee[] = [
  {
    name: "ahmed",
    email: "ahmed@company.com",
    department: "Engineering",
    position: "Software Developer",
    phone: "+1234567890",
    address: "123 Main St, City",
    salary: 75000,
    hireDate: "2023-01-15",
    photoUrl: "https://example.com/photos/ahmed.jpg" // Replace with actual photo URL
  },
  {
    name: "mohamed",
    email: "mohamed@company.com",
    department: "Engineering",
    position: "Senior Developer",
    phone: "+1234567891",
    address: "456 Oak Ave, City",
    salary: 85000,
    hireDate: "2022-06-10",
    photoUrl: "https://example.com/photos/mohamed.jpg" // Replace with actual photo URL
  },
  {
    name: "samier",
    email: "samier@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    phone: "+1234567892",
    address: "789 Pine St, City",
    salary: 70000,
    hireDate: "2023-03-20",
    photoUrl: "https://example.com/photos/samier.jpg" // Replace with actual photo URL
  },
  {
    name: "elkholy",
    email: "elkholy@company.com",
    department: "HR",
    position: "HR Specialist",
    phone: "+1234567893",
    address: "321 Elm St, City",
    salary: 65000,
    hireDate: "2023-05-01",
    photoUrl: "https://example.com/photos/elkholy.jpg" // Replace with actual photo URL
  }
];

export async function setupEmployeesInFirebase() {
  try {
    console.log("Setting up employees in Firebase...");
    
    for (const employee of sampleEmployees) {
      // Use employee name as document ID for easy lookup
      const employeeRef = doc(db, "employees", employee.name.toLowerCase());
      await setDoc(employeeRef, {
        ...employee,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log(`Added employee: ${employee.name}`);
    }
    
    console.log("All employees added successfully!");
    return { success: true, message: "Employees setup completed" };
    
  } catch (error) {
    console.error("Error setting up employees:", error);
    return { success: false, error: error };
  }
}

// Function to add a single employee
export async function addEmployee(employee: Employee) {
  try {
    const employeeRef = doc(db, "employees", employee.name.toLowerCase());
    await setDoc(employeeRef, {
      ...employee,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, message: `Employee ${employee.name} added successfully` };
  } catch (error) {
    console.error("Error adding employee:", error);
    return { success: false, error: error };
  }
}