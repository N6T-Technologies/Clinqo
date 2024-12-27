import { EmployeeRegSchemaType } from "@/types";
import prisma, { UserRoles, type UserType } from "@repo/db/client";

export const getUserByEmail = async (email: string): Promise<UserType | null> => {
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

export const createUser = async (
    data: EmployeeRegSchemaType,
    hashedPassword: string,
    role: UserRoles
): Promise<UserType | null> => {
    const countryCode = data.contactNumber.slice(0, 3);
    const number = data.contactNumber.slice(3);

    const newUser = await prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: new Date(data.dateOfBirth),
            email: data.email,
            contactNumber: number,
            countryCode: countryCode,
            password: hashedPassword,
            role: role,
            //@ts-ignore
            gender: data.gender,
        },
    });

    return newUser;
};
