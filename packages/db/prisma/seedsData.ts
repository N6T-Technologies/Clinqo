import { Genders, Roles, User } from "@prisma/client";

const seedsData: {
    admins: Omit<User, "id" | "image" | "updatedAt" | "createdAt">[];
    clinicHeads: Omit<User, "id" | "image" | "updatedAt" | "createdAt">[];
} = {
    admins: [
        {
            firstName: "Mayur",
            lastName: "Pachpor",
            dateOfBirth: new Date("2003-02-28"),
            gender: Genders.MALE,
            email: "mayurpachpor45@gmail.com",
            contactNumber: "7417041977",
            countryCode: "+91",
            password: "$2y$10$8FIYJYS3HXgF/w7.mJ5UiugjrjX3QzC4del5RoYDxfmvLxlYrf0Oy",
            role: Roles.ADMIN,
        },
    ],

    clinicHeads: [
        {
            firstName: "Mayur",
            lastName: "Pachpor",
            dateOfBirth: new Date("2003-02-28"),
            gender: Genders.MALE,
            email: "mayurpachpor45@gmail.com",
            contactNumber: "8208669377",
            countryCode: "+91",
            password: "$2y$10$YeZ2u447qTKivjud7IcC7OROAqOq9C7dkXKQYldOy3CIhkR0aLaSW",
            role: Roles.CLINIC_HEAD,
        },
    ],
};
export default seedsData;
