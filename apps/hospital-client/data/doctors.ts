import prisma from "@repo/db/client";

export const getDoctorsUsingClinicHeadId = async (id: string) => {
    const doctors = await prisma.doctor.findMany({
        where: {
            clinics: {
                some: {
                    clinicHeads: {
                        some: {
                            id: id,
                        },
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

    return doctors;
};
