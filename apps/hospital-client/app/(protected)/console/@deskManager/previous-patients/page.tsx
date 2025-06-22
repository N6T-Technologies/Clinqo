import { auth } from "@/auth";
import { getEmployeeByUserId } from "@/data/employees";
import PreviousPatientsTable from "@/components/previous-patients-table";

export default async function PreviousPatientsPage() {
    const session = await auth();
    
    if (!session?.user?.id) {
        return <div>Unauthorized</div>;
    }

    // Get employee information to get clinic ID
    const employee = await getEmployeeByUserId(session.user.id);
    
    if (!employee?.clinicId) {
        return <div>Clinic not found</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Previous Patients</h1>
                <p className="text-gray-600">View completed appointments and patient history</p>
            </div>
            <PreviousPatientsTable clinicId={employee.clinicId} />
        </div>
    );
}
