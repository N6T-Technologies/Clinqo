import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ClinicGenderDistribution from "@/components/ui/clinic-gender-distribution";

export default function Dashboard() {
    return (
        <div className="h-[calc(100%-4rem)] w-full grid grid-cols-2 p-4 space-x-4">
            <div className="h-full space-y-4">
                <ClinicGenderDistribution />
            </div>
            <Card className="h-full border border-gray-300 shadow-md hover:shadow-lg hover:bg-slate-50">
                <CardHeader className="text-2xl font-bold">Messages</CardHeader>
                <CardContent className="h-[30rem] flex justify-center items-center">Coming Soon..</CardContent>
            </Card>
        </div>
    );
}
