import prisma from "@repo/db/client";

export interface PrescriptionData {
  clinic: {
    name: string;
    logo?: string;
    address: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  };
  patient: {
    name: string;
    age: number;
    gender: string;
    phone: string;
  };
  doctor: {
    name: string;
    specialisation: string;
    mciNumber: string;
  };
  appointment: {
    id: string;
    bookTime: Date;
    symptoms: string;
  };
}

export async function getAppointmentForPrescription(
  doctorId: string,
  clinicId: string,
  patientId: string
): Promise<PrescriptionData | null> {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { 
        doctorId_clinicId_patientId: {
          doctorId,
          clinicId,
          patientId
        }
      },
      include: {
        clinic: {
          include: {
            address: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!appointment) {
      return null;
    }

    // Calculate age from date of birth
    const today = new Date();
    const birthDate = new Date(appointment.patient.user.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return {
      clinic: {
        name: appointment.clinic.name,
        logo: appointment.clinic.logo,
        address: {
          addressLine1: appointment.clinic.address?.addressLine1 || "",
          addressLine2: appointment.clinic.address?.addressLine2 || undefined,
          city: appointment.clinic.address?.city || "",
          state: appointment.clinic.address?.state || "",
          pincode: appointment.clinic.address?.pincode || "",
          country: appointment.clinic.address?.country || "",
        },
      },
      patient: {
        name: `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`,
        age,
        gender: appointment.patient.user.gender,
        phone: `${appointment.patient.user.countryCode} ${appointment.patient.user.contactNumber}`,
      },
      doctor: {
        name: `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
        specialisation: appointment.doctor.specialisation,
        mciNumber: appointment.doctor.mciNumber,
      },
      appointment: {
        id: appointment.id,
        bookTime: appointment.bookTime,
        symptoms: appointment.symptoms,
      },
    };
  } catch (error) {
    console.error("Error fetching appointment for prescription:", error);
    return null;
  }
}

// Alternative function for appointment ID based lookup
export async function getAppointmentForPrescriptionById(
  appointmentId: string
): Promise<PrescriptionData | null> {
  try {
    console.log("Fetching appointment with ID:", appointmentId);
    
    // Debug: Let's first see what appointments exist
    const allAppointments = await prisma.appointment.findMany({
      select: {
        id: true,
        doctorId: true,
        clinicId: true,
        patientId: true,
      },
      take: 5, // Just get first 5 for debugging
    });
    
    console.log("Sample appointments in database:", allAppointments);
    
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId },
      include: {
        clinic: {
          include: {
            address: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    console.log("Found appointment:", appointment ? "Yes" : "No");

    if (!appointment) {
      console.log("No appointment found with ID:", appointmentId);
      return null;
    }

    // Calculate age from date of birth
    const today = new Date();
    const birthDate = new Date(appointment.patient.user.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    console.log("Returning prescription data for patient:", appointment.patient.user.firstName);

    return {
      clinic: {
        name: appointment.clinic.name,
        logo: appointment.clinic.logo,
        address: {
          addressLine1: appointment.clinic.address?.addressLine1 || "",
          addressLine2: appointment.clinic.address?.addressLine2 || undefined,
          city: appointment.clinic.address?.city || "",
          state: appointment.clinic.address?.state || "",
          pincode: appointment.clinic.address?.pincode || "",
          country: appointment.clinic.address?.country || "",
        },
      },
      patient: {
        name: `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`,
        age,
        gender: appointment.patient.user.gender,
        phone: `${appointment.patient.user.countryCode} ${appointment.patient.user.contactNumber}`,
      },
      doctor: {
        name: `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
        specialisation: appointment.doctor.specialisation,
        mciNumber: appointment.doctor.mciNumber,
      },
      appointment: {
        id: appointment.id,
        bookTime: appointment.bookTime,
        symptoms: appointment.symptoms,
      },
    };
  } catch (error) {
    console.error("Error fetching appointment for prescription by ID:", error);
    return null;
  }
}

// Function to get prescription data for blank prescription (post-registration)
export async function getBlankPrescriptionData(
  clinicId: string,
  patientId: string,
  doctorId: string
): Promise<Partial<PrescriptionData> | null> {
  try {
    const [clinic, patient, doctor] = await Promise.all([
      prisma.clinic.findUnique({
        where: { id: clinicId },
        include: { address: true },
      }),
      prisma.patient.findUnique({
        where: { id: patientId },
        include: { user: true },
      }),
      prisma.doctor.findUnique({
        where: { id: doctorId },
        include: { user: true },
      }),
    ]);

    if (!clinic || !patient || !doctor) {
      return null;
    }

    // Calculate age from date of birth
    const today = new Date();
    const birthDate = new Date(patient.user.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return {
      clinic: {
        name: clinic.name,
        logo: clinic.logo,        address: {
          addressLine1: clinic.address?.addressLine1 || "",
          addressLine2: clinic.address?.addressLine2 || undefined,
          city: clinic.address?.city || "",
          state: clinic.address?.state || "",
          pincode: clinic.address?.pincode || "",
          country: clinic.address?.country || "",
        },
      },
      patient: {
        name: `${patient.user.firstName} ${patient.user.lastName}`,
        age,
        gender: patient.user.gender,
        phone: `${patient.user.countryCode} ${patient.user.contactNumber}`,
      },
      doctor: {
        name: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
        specialisation: doctor.specialisation,
        mciNumber: doctor.mciNumber,
      },
    };
  } catch (error) {
    console.error("Error fetching blank prescription data:", error);
    return null;
  }
}
