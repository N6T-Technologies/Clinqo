import { Genders, Roles, User } from "@prisma/client";

const seedsData: {
    admins: Omit<User, "id" | "image" | "updatedAt" | "createdAt">[];
    clinicHeads: Omit<User, "id" | "image" | "updatedAt" | "createdAt">[];
} = {
    admins: [
        {
            firstName: "Ajay",
            lastName: "Deshmukh",
            dateOfBirth: new Date("2003-05-24"),
            gender: Genders.MALE,
            email: "ajayadeshmukh@gmail.com",
            contactNumber: "7387784759",
            countryCode: "+91",
            password: "$2y$10$XsmsQMcOnl.pIybi4xuzs.UsiHpjPZrfXeCbz2wENL0WssHbbFNtq",
            role: Roles.ADMIN,
        },
    ],

    clinicHeads: [
        {
            firstName: "Ajay",
            lastName: "Deshmukh",
            dateOfBirth: new Date("2003-05-24"),
            gender: Genders.MALE,
            email: "ajayadeshmukh@gmail.com",
            contactNumber: "7387784759",
            countryCode: "+91",
            password: "$2y$10$XsmsQMcOnl.pIybi4xuzs.UsiHpjPZrfXeCbz2wENL0WssHbbFNtq",
            role: Roles.CLINIC_HEAD,
        },
    ],
};
export default seedsData;
