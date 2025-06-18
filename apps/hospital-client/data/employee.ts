import prisma from "@repo/db/client";

export const getEmployeeByUserId = async (userId: string) => {
    try {
        const employee = await prisma.employee.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    }
                },
                clinic: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    }
                }
            }
        });
        return employee;
    } catch (error) {
        console.error("Error fetching employee:", error);
        return null;
    }
};

export const getEmployeesByClinicId = async (clinicId: string) => {
    try {
        const employees = await prisma.employee.findMany({
            where: { 
                clinicId,
                employeeStatus: 'ACTIVE'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    }
                }
            }
        });
        return employees;
    } catch (error) {
        console.error("Error fetching employees:", error);
        return [];
    }
};

export const verifyEmployeeSession = async (userId: string) => {
    try {
        const employee = await prisma.employee.findUnique({
            where: { userId },
            include: {
                clinic: true,
                user: true
            }
        });

        if (!employee) {
            return {
                isValid: false,
                error: "Employee record not found"
            };
        }

        if (employee.employeeStatus !== 'ACTIVE') {
            return {
                isValid: false,
                error: "Employee account is inactive"
            };
        }

        if (employee.employeeDesignation !== 'FRONT_DESK_MANAGER') {
            return {
                isValid: false,
                error: "Access restricted to front desk managers"
            };
        }

        return {
            isValid: true,
            employee: {
                id: employee.id,
                userId: employee.userId,
                clinicId: employee.clinicId,
                clinicName: employee.clinic.name,
                designation: employee.employeeDesignation,
                status: employee.employeeStatus,
                userEmail: employee.user.email
            }
        };
    } catch (error) {
        console.error("Error verifying employee session:", error);
        return {
            isValid: false,
            error: "Database error occurred"
        };
    }
};
