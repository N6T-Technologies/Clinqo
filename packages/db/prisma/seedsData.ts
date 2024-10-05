const seedsData: any = {
    users: [
        {
            id: "user1",
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: new Date("1980-01-01"),
            gender: "MALE",
            email: "john.doe@example.com",
            contactNumber: "1234567890",
            countryCode: "+1",
            password: "hashed_password_1",
            role: "DOCTOR",
        },
        {
            id: "user2",
            firstName: "Jane",
            lastName: "Doe",
            dateOfBirth: new Date("1990-02-02"),
            gender: "FEMALE",
            email: "jane.doe@example.com",
            contactNumber: "0987654321",
            countryCode: "+1",
            password: "hashed_password_2",
            role: "PATIENT",
        },
    ],
    clinics: [
        {
            id: "clinic1",
            name: "Health Clinic",
            logo: "https://clinic-logo-url.com",
            gstin: "29ABCDE1234F2Z5",
            adminId: "user1", // Admin linked to the clinic
        },
    ],
    employees: [
        {
            id: "employee1",
            userId: "user1",
            clinicId: "clinic1",
            employeeStatus: "ACTIVE",
        },
    ],
    appointments: [
        {
            id: 1,
            doctorId: "doctor1",
            clinicId: "clinic1",
            patientId: "patient1",
            bookTime: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            symptoms: "Fever and Cough",
            paymentMethod: "UPI",
            appointmentStatus: "COMPLETED",
            prescription: "Rest and hydration",
        },
    ],
};
export default seedsData;
