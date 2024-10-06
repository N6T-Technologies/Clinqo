import prisma, { type UserType } from "@repo/db/client";

export const getUserByEmial = async (email: string): Promise<UserType | null> => {
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
