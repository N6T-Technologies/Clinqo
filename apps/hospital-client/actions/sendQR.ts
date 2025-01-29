"use server"
import { QREmailTemplate, QREmailTemplateProps } from "@/components/templates/qr-generator-email-template";
import { auth } from "@/auth";
import { sendEmail } from "@/actions/send-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendQR(email: string, data: QREmailTemplateProps) {
    try {
        const session = await auth();
        if (!session?.user) {
            return { ok: false, error: "Unauthorized access" };
        }

        const result = await resend.emails.send({
        from: `onboarding@resend.dev`,
        to: [email],
        subject:"Scan to book Appointment at Clinqo",
        react: QREmailTemplate(data),
    });


        if (!result.ok) {
            return { ok: false, error: result.error || "Failed to send email" };
        }

        return { ok: true, msg: `Email sent successfully to ${email}` };
    } catch (error) {
        console.error("Error in sendQR:", error);
        return { 
            ok: false, 
            error: error instanceof Error ? error.message : "Failed to send QR code email" 
        };
    }
}