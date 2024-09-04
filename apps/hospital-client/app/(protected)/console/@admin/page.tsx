import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Console() {
    return (
        <div className="h-[calc(100%-4rem)] w-full grid grid-cols-2 p-4 space-x-4">
            <div className="h-full space-y-4">
                <Card className="h-[calc(50%-0.5rem)] border border-gray-300 shadow-md hover:shadow-lg hover:bg-slate-50">
                    <CardHeader className="text-2xl font-bold">Revenue</CardHeader>
                </Card>
                <Card className="h-[calc(50%-0.5rem)] border border-gray-300 shadow-md hover:shadow-lg hover:bg-slate-50">
                    <CardHeader className="text-2xl font-bold">Recent Clinics</CardHeader>
                </Card>
            </div>
            <Card className="h-full border border-gray-300 shadow-md hover:shadow-lg hover:bg-slate-50">
                <CardHeader className="text-2xl font-bold">Messages</CardHeader>
                <CardContent></CardContent>
            </Card>
        </div>
    );
}
