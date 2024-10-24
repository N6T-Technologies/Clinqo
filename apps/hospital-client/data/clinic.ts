import prisma, { type ClinicType } from "@repo/db/client";

export const getClinicByGSTIN = async (gstin: string): Promise<ClinicType | null> => {
    const clinic = await prisma.clinic.findUnique({
        where: { gstin: gstin },
    });

    return clinic;
};

// export const getDoctorClinics = async (id: string) => {};

export const getClinicsByAdminId = async (id: string) => {
    const clinics = await prisma.clinic.findMany({
        where: {
            adminId: id,
        },
        select: {
            id: true,
            name: true,
            clinicHeads: {
                select: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });

    return clinics;
};
