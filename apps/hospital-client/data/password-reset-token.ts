import prisma from "@repo/db/client";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import { ResetPassEmail } from "@/components/templates/reset-pass-email-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.RESEND_DOMAIN;
const url = process.env.URL;

export async function getPasswordResetTokenByToken(token: string) {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({
            where: { token },
        });

        return passwordResetToken;
    } catch (e) {
        return null;
    }
}

export async function getPasswordResetTokenByEmail(email: string) {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({
            where: { email },
        });

        return passwordResetToken;
    } catch (error) {
        return null;
    }
}

export const generatePasswordResetToken = async (email: string) => {
    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id },
        });
    }

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return passwordResetToken;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${url}/auth/new-password?token=${token}`;
    const res = await resend.emails.send({
        from: `Clinqo <noreply@${domain}>`,
        to: email,
        subject: "Change your password",
        react: ResetPassEmail({ resetLink }),
    });

    console.log(res);
};

export const sendClinicWelcomeEmail = async (
    email: string, 
    firstName: string, 
    password: string,
    clinicName: string
) => {
    try {
        const res = await resend.emails.send({
            from: `Clinqo <noreply@${domain}>`,
            to: email,
            subject: "Welcome to Clinqo - Your Clinic Account Created",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #3297F5;">Welcome to Clinqo!</h2>
                    <p>Dear ${firstName},</p>
                    <p>Your clinic account for <strong>${clinicName}</strong> has been successfully created.</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3>Your Login Credentials:</h3>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Password:</strong> ${password}</p>
                    </div>
                    <p>Please log in to your account and change your password for security purposes.</p>
                    <p>
                        <a href="${url}/auth/login" 
                           style="background-color: #3297F5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                           Login to Your Account
                        </a>
                    </p>
                    <p>Best regards,<br>The Clinqo Team</p>
                </div>
            `,
        });

        console.log("Clinic welcome email sent:", res);
        return res;
    } catch (error) {
        console.error("Failed to send clinic welcome email:", error);
        throw error;
    }
};

// export const sendVerificationEmail = async (email: string, token: string) => {
//     const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
//
//     await resend.emails.send({
//         from: "onboarding@resend.dev",
//         to: email,
//         subject: "Confirm your email",
//         react: `<p>Click <a href = "${confirmLink}">here</a> to confirm email. </p>`,
//     });
// };
