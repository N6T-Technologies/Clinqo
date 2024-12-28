"use server";

import { ResetSchema, ResetSchemaType } from "@/types";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/data/password-reset-token";
import { sendPasswordResetEmail } from "@/data/password-reset-token";

export async function reset(values: ResetSchemaType) {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid email!" };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Email not found" };
    }

    const resetPasswordToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(resetPasswordToken.email, resetPasswordToken.token);
    return { success: "Reset email sent!" };
}
