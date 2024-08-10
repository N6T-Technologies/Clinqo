import prisma from "@repo/db/client";
import { UserType } from "@repo/db/client";

export const getUserByEmial = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    return user;
};

export const getUserById = async (id: string): Promise<UserType | null> => {
    const user = await prisma.user.findUnique({
        where: { id: id },
    });

    return user;
};
