"use server";

import { auth } from "@/auth";
import { RedisManger } from "@/lib/RedisManager";
import { CreateAppointmentError, CreateAppointmentSchema, CreateAppointmentSchemaType } from "@/types";
import { MessageFromEngine } from "@/types/fromEngine";
import { CREATE_RESHIPI, CreateAppointmentData } from "shefu/from-api";
import { RESHIPI_CREATED } from "shefu/to-api";
import prisma from "@repo/db/client";

// Helper function to save appointment data to database
async function saveAppointmentToDatabase(
    appointmentData: CreateAppointmentData,
    appointmentId: string,
    clinicId: string
) {    try {
        // Generate a unique email for the patient
        const patientEmail = `${appointmentData.patientFirstName.toLowerCase()}.${appointmentData.patientLastName.toLowerCase()}@patient.clinqo.com`;
        const simplePassword = "PATIENT_NO_LOGIN"; // Simple placeholder since patients don't login

        // Extract phone number without country code
        let phoneNumber = appointmentData.phoneNumber;
        if (phoneNumber.startsWith('+91')) {
            phoneNumber = phoneNumber.replace('+91', '').trim();
        } else if (phoneNumber.startsWith('91')) {
            phoneNumber = phoneNumber.replace('91', '').trim();
        }
        // Remove any remaining spaces or special characters
        phoneNumber = phoneNumber.replace(/\s+/g, '');

        // Check if user already exists by email or phone
        let existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: patientEmail },
                    { contactNumber: phoneNumber }
                ]
            }
        });

        let userId: string;
        let patientId: string;

        if (existingUser) {
            // User exists, use existing user
            userId = existingUser.id;
            
            // Check if patient record exists
            let existingPatient = await prisma.patient.findUnique({
                where: { userId: userId }
            });

            if (existingPatient) {
                patientId = existingPatient.id;
            } else {
                // Create patient record for existing user
                const newPatient = await prisma.patient.create({
                    data: {
                        userId: userId
                    }
                });
                patientId = newPatient.id;
            }        } else {
            // Create new user
            const newUser = await prisma.user.create({
                data: {
                    firstName: appointmentData.patientFirstName,
                    lastName: appointmentData.patientLastName,
                    dateOfBirth: appointmentData.patientDateOfBirth,
                    gender: appointmentData.gender,
                    email: patientEmail,
                    contactNumber: phoneNumber, // Use cleaned phone number
                    countryCode: "+91", // Default country code
                    password: simplePassword, // Simple placeholder
                    role: "PATIENT"
                }
            });
            userId = newUser.id;

            // Create patient record
            const newPatient = await prisma.patient.create({
                data: {
                    userId: userId
                }
            });
            patientId = newPatient.id;
        }

        // Extract doctor ID from clinic_doctor field
        const doctorIdParts = appointmentData.clinic_doctor.split("_");
        const doctorId = doctorIdParts.length > 1 ? doctorIdParts[1] : "";
        
        if (!doctorId) {
            throw new Error("Invalid doctor ID from clinic_doctor field");
        }

        // Create appointment record
        await prisma.appointment.create({
            data: {
                id: appointmentId,
                doctorId: doctorId,
                clinicId: clinicId,
                patientId: patientId,
                bookTime: new Date(),
                startTime: new Date(), // This should be set when appointment starts
                endTime: new Date(), // This should be set when appointment ends
                symptoms: appointmentData.symptoms,
                paymentMethod: appointmentData.paymentMethod,
                appointmentStatus: "COMPLETED", // Default status
                prescription: "" // Empty initially
            }
        });

        console.log(`Successfully saved appointment ${appointmentId} to database`);
        console.log(`Created/found patient: ${appointmentData.patientFirstName} ${appointmentData.patientLastName}`);
    } catch (error) {
        console.error("Error saving appointment to database:", error);
        // Don't throw error here to avoid breaking the Redis flow
        // Just log for debugging
    }
}

export async function createAppointment(
    data: CreateAppointmentSchemaType,
    selfData: { self: boolean; clinicId: string }
): Promise<{
    ok: boolean;
    error?: CreateAppointmentError;
    msg?: string;
}> {
    if (selfData.self) {
        const validatedFields = CreateAppointmentSchema.safeParse(data);

        if (!validatedFields.success) {
            return { ok: false, error: CreateAppointmentError.Invalid_Fields };
        }

        const { firstName, lastName, dateOfBirth, gender, contactNumber, symptoms, doctor, followup, paymentMethod } =
            validatedFields.data;

        const doctorName = doctor.split("_")[0];
        const doctorId = doctor.split("_")[1];

        const appointmentData: CreateAppointmentData = {
            patientFirstName: firstName,
            patientLastName: lastName,
            patientDateOfBirth: new Date(dateOfBirth),
            //@ts-ignore
            doctorName: doctorName,
            gender: gender,
            phoneNumber: contactNumber,
            symptoms: symptoms,
            //@ts-ignore
            clinic_doctor: `${selfData.clinicId}_${doctorId}`,
            followup: followup,
            paymentMethod: paymentMethod,
            //@ts-ignore
            managerId: selfData.clinicId,
        };

        const response: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
            type: CREATE_RESHIPI,
            data: appointmentData,
        });

        if (!response.payload.ok) {
            return { ok: false, error: CreateAppointmentError.Something_Went_Wrong };
        }

        if (response.type === RESHIPI_CREATED) {
            // Save appointment data to database
            await saveAppointmentToDatabase(appointmentData, response.payload.newReshipi.id, selfData.clinicId);
            
            return { ok: true, msg: `Appointment with id ${response.payload.newReshipi.id} created` };
        }

        return { ok: false, error: CreateAppointmentError.Something_Went_Wrong };
    }

    const session = await auth();

    if (!session || !session.user) {
        return { ok: false, error: CreateAppointmentError.No_Creadentials };
    }

    //@ts-ignore
    if (!session.user.employeeId) {
        return { ok: false, error: CreateAppointmentError.Unauthorized };
    }

    //@ts-ignore
    if (!session.user.clinicId) {
        return { ok: false, error: CreateAppointmentError.Clinic_Not_Found };
    }

    const validatedFields = CreateAppointmentSchema.safeParse(data);

    if (!validatedFields.success) {
        return { ok: false, error: CreateAppointmentError.Invalid_Fields };
    }

    const { firstName, lastName, dateOfBirth, gender, contactNumber, symptoms, doctor, followup, paymentMethod } =
        validatedFields.data;

    const doctorName = doctor.split("_")[0];
    const doctorId = doctor.split("_")[1];

    const appointmentData: CreateAppointmentData = {
        patientFirstName: firstName,
        patientLastName: lastName,
        patientDateOfBirth: new Date(dateOfBirth),
        //@ts-ignore
        doctorName: doctorName,
        gender: gender,
        phoneNumber: contactNumber,
        symptoms: symptoms,
        //@ts-ignore
        clinic_doctor: `${session.user.clinicId}_${doctorId}`,
        followup: followup,
        paymentMethod: paymentMethod,
        //@ts-ignore
        managerId: session.user.employeeId,
    };

    const response: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
        type: CREATE_RESHIPI,
        data: appointmentData,
    });

    if (!response.payload.ok) {
        return { ok: false, error: CreateAppointmentError.Something_Went_Wrong };
    }    if (response.type === RESHIPI_CREATED) {
        // Save appointment data to database
        await saveAppointmentToDatabase(
            appointmentData, 
            response.payload.newReshipi.id, 
            //@ts-ignore
            session.user.clinicId as string
        );
        
        return { ok: true, msg: `Appointment with id ${response.payload.newReshipi.id} created` };
    }

    return { ok: false, error: CreateAppointmentError.Something_Went_Wrong };
}
