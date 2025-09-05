"use server";

import { deleteDoctorById } from "@/data/doctors";
import { revalidatePath } from "next/cache";

export const deleteDoctor = async (doctorId: string) => {
    try {
        const result = await deleteDoctorById(doctorId);
        
        if (result.success) {
            // Revalidate the doctors page to refresh the data
            revalidatePath("/console/doctors");
            return { success: true, message: "Doctor deleted successfully" };
        } else {
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error("Error in deleteDoctor action:", error);
        return { success: false, error: "Failed to delete doctor" };
    }
};
