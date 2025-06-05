"use server";

import { auth } from "@/auth";
import prisma, { UserRoles } from "@repo/db/client";

export async function updateClinicLogo(
    clinicId: string, 
    logoUrl: string
): Promise<{ ok: boolean; error?: string; msg?: string }> {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return { ok: false, error: "No credentials provided" };
        }

        // Check if user is admin or clinic head
        //@ts-ignore
        const userRole = session.user.role;
        //@ts-ignore
        const userId = session.user.id;

        if (userRole === UserRoles.ADMIN) {
            // Admin can update any clinic logo
            //@ts-ignore
            const adminId = session.user.adminId;
            
            const clinic = await prisma.clinic.findFirst({
                where: {
                    id: clinicId,
                    adminId: adminId
                }
            });

            if (!clinic) {
                return { ok: false, error: "Clinic not found or unauthorized" };
            }
        } else if (userRole === UserRoles.CLINIC_HEAD) {
            // Clinic head can only update their own clinic logo
            const clinic = await prisma.clinic.findFirst({
                where: {
                    id: clinicId,
                    clinicHeads: {
                        some: {
                            userId: userId
                        }
                    }
                }
            });

            if (!clinic) {
                return { ok: false, error: "Clinic not found or unauthorized" };
            }
        } else {
            return { ok: false, error: "Unauthorized" };
        }

        // Update the clinic logo
        await prisma.clinic.update({
            where: {
                id: clinicId
            },
            data: {
                logo: logoUrl
            }
        });

        return { ok: true, msg: "Logo updated successfully" };
    } catch (error) {
        console.error("Error updating clinic logo:", error);
        return { ok: false, error: "Something went wrong" };
    }
}
