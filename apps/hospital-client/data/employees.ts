import prisma from "@repo/db/client";

export async function getEmployeesByClinicHeadId(id: string) {
    const employees = await prisma.employee.findMany({
        where: {
            clinic: {
                clinicHeads: {
                    some: {
                        id: id,
                    },
                },
            },
        },
        select: {
            id: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });

    // const employees = rawEmployees.map((re) => {
    //     return {
    //         id: re.id,
    //         name: `${re.user.firstName} ${re.user.lastName}`,
    //         email: re.user.email,
    //     };
    // });

    return employees;
}
