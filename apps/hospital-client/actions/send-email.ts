"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail<T>(to: string, emailData: T, template: (emailData: T) => React.JSX.Element) {
    try {
        const { data, error } = await resend.emails.send({
            from: "Clinqo <noreply@l3xlabs.com>",
            to: [to],
            subject: "Login Credentials",
            react: template(emailData),
        });

        if (error) {
            return { ok: false, error, status: 500 };
        }

        return { ok: true, data: data };
    } catch (error) {
        console.log(error);
        return { ok: false, error, status: 500 };
    }
}
