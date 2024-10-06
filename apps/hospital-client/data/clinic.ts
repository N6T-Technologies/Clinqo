import prisma, { type ClinicType } from "@repo/db/client";

export const getClinicByGSTIN = async (gstin: string): Promise<ClinicType | null> => {
    const clinic = await prisma.clinic.findUnique({
        where: { gstin: gstin },
    });

    return clinic;
};
