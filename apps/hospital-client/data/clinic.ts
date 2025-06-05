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
            logo: true,
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

export const getClinicById = async (id: string) => {
    const clinic = await prisma.clinic.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            logo: true,
            gstin: true,
            address: {
                select: {
                    addressLine1: true,
                    addressLine2: true,
                    city: true,
                    state: true,
                    pincode: true,
                    country: true,
                },
            },
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

    if (!clinic) return null;

    // Transform the data to match the expected format
    const clinicHead = clinic.clinicHeads[0]?.user;
    return {
        id: clinic.id,
        name: clinic.name,
        logo: clinic.logo,
        gstin: clinic.gstin,
        addressLine1: clinic.address?.addressLine1 || '',
        addressLine2: clinic.address?.addressLine2 || '',
        city: clinic.address?.city || '',
        state: clinic.address?.state || '',
        pincode: clinic.address?.pincode || '',
        country: clinic.address?.country || '',
        headName: clinicHead ? `${clinicHead.firstName} ${clinicHead.lastName}` : 'N/A',
        headEmail: clinicHead?.email || 'N/A',
    };
};

export const getClinicHeadProfile = async (clinicHeadId: string) => {
    const clinicHead = await prisma.clinicHead.findUnique({
        where: {
            id: clinicHeadId,
        },
        select: {
            id: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    contactNumber: true,
                    countryCode: true,
                    dateOfBirth: true,
                    gender: true,
                },
            },
            clinic: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    gstin: true,
                    address: {
                        select: {
                            addressLine1: true,
                            addressLine2: true,
                            city: true,
                            state: true,
                            pincode: true,
                            country: true,
                        },
                    },
                },
            },
        },
    });

    if (!clinicHead) return null;

    return {
        id: clinicHead.id,
        user: clinicHead.user,
        clinic: {
            id: clinicHead.clinic.id,
            name: clinicHead.clinic.name,
            logo: clinicHead.clinic.logo,
            gstin: clinicHead.clinic.gstin,
            addressLine1: clinicHead.clinic.address?.addressLine1 || '',
            addressLine2: clinicHead.clinic.address?.addressLine2 || '',
            city: clinicHead.clinic.address?.city || '',
            state: clinicHead.clinic.address?.state || '',
            pincode: clinicHead.clinic.address?.pincode || '',
            country: clinicHead.clinic.address?.country || '',
        },
    };
};

export const getClinicLogoByClinicHeadId = async (clinicHeadId: string) => {
    const clinicHead = await prisma.clinicHead.findUnique({
        where: {
            id: clinicHeadId,
        },
        select: {
            clinic: {
                select: {
                    logo: true,
                    name: true,
                },
            },
        },
    });

    if (!clinicHead) return null;

    return {
        logo: clinicHead.clinic.logo,
        name: clinicHead.clinic.name,
    };
};
