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
            email: "mayurpachpor2802@gmail.com",
            contactNumber: "8208669377",
            countryCode: "+91",
            password: "$2y$10$YeZ2u447qTKivjud7IcC7OROAqOq9C7dkXKQYldOy3CIhkR0aLaSW",
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
