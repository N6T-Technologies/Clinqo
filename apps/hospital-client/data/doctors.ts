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

export const getDoctorProfile = async (doctorId: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            id: doctorId,
        },
        select: {
            id: true,
            mciNumber: true,
            specialisation: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    contactNumber: true,
                    countryCode: true,
                    dateOfBirth: true,
                    gender: true,
                },
            },
            clinics: {
                select: {
                    id: true,
                    name: true,
                    gstin: true,
                    address: {
                        select: {
                            addressLine1: true,
                            addressLine2: true,
                            city: true,
                            state: true,
                            country: true,
                            pincode: true,
                        },
                    },
                },
            },
        },
    });

    return doctor;
};

export const deleteDoctorById = async (doctorId: string) => {
    try {
        // First, remove the doctor from all clinics (disconnect relationships)
        await prisma.doctor.update({
            where: { id: doctorId },
            data: {
                clinics: {
                    set: [], // This disconnects the doctor from all clinics
                },
            },
        });

        // Then delete the doctor record
        const deletedDoctor = await prisma.doctor.delete({
            where: { id: doctorId },
        });

        return { success: true, doctor: deletedDoctor };
    } catch (error) {
        console.error("Error deleting doctor:", error);
        return { success: false, error: "Failed to delete doctor" };
    }
};
