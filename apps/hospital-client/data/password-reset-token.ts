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
