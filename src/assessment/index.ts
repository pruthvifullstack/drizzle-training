import { db } from "../db";
import { designations, employees } from "../db/schema";
import { count, eq, isNull } from "drizzle-orm";

export const assessment = async () => {
  // Insert a new designation into the designations table
  const designationsList = [
    { title: "Backend Dev" },
    { title: "Frontend Dev" },
  ];
  await db.insert(designations).values(designationsList).returning({ id: designations.id });

  // Insert multiple employees into the employees table
  const staffList = [
    {
      name: "Arjun",
      designationId: 1,
      email: "arjun@example.com",
      phone: "9876543210",
    },
    {
      name: "Neha",
      designationId: 1,
      email: "neha@example.com",
      phone: "8765432109",
    },
    {
      name: "Rohan",
      designationId: 2,
      email: "rohan@example.com",
      phone: "7654321098",
    },
  ];
  await db.insert(employees).values(staffList).returning({ id: employees.id });

  // Retrieve all employees along with their respective designations
  const employeeDetails = await db
    .select({
      name: employees.name,
      role: designations.title,
      email: employees.email,
      phone: employees.phone,
    })
    .from(employees)
    .innerJoin(designations, eq(employees.designationId, designations.id));
  console.log("employeeDetails -> ", employeeDetails);

  // Update the designation of a specific employee
  const modifiedEmpRole = await db
    .update(employees)
    .set({ designationId: 2 })
    .where(eq(employees.id, 2))
    .returning();

  console.log("modifiedEmpRole: ", modifiedEmpRole[0]);

  // Remove an employee from the employees table by their ID
  const removedEmployee = await db
    .delete(employees)
    .where(eq(employees.id, 2))
    .returning();
  console.log("removedEmployee: ", removedEmployee[0]);

  // Fetch employees based on a specific designation
  const staffByRole = await db
    .select({
      name: employees.name,
      role: designations.title,
      email: employees.email,
      phone: employees.phone,
    })
    .from(employees)
    .innerJoin(designations, eq(employees.designationId, designations.id))
    .where(eq(designations.title, "Backend Dev"));
  console.log("staffByRole: ", staffByRole);

  // Count the number of employees assigned to each designation
  const roleCount = await db
    .select({
      roleName: designations.title,
      employeeCount: count(employees.id),
    })
    .from(employees)
    .innerJoin(designations, eq(employees.designationId, designations.id))
    .groupBy(designations.id);
  console.log("roleCount: ", roleCount);

  // Retrieve a list of designations that currently have no employees assigned
  const vacantRoles = await db
    .select({ name: designations.title })
    .from(designations)
    .leftJoin(employees, eq(designations.id, employees.designationId))
    .where(isNull(employees.id));
  console.log("vacantRoles -> ", vacantRoles.map((e) => e.name));
};
assessment();
