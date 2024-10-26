import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import WeeklyClinicChart from "@/components/ui/weekly-clinics";
// import { TrendingUp } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="h-[calc(100%-4rem)] w-full grid grid-cols-2 p-4 space-x-4">
            <div className="h-full w-full space-y-4">
                <Card className="h-[calc(50%-0.5rem)] border border-gray-300 shadow-md hover:shadow-lg hover:bg-slate-50">
                    <CardHeader className="m-0 p-6">
                        <CardTitle>Weekly Clinics Registered</CardTitle>
                        <CardDescription>Last 5 weeks</CardDescription>
                    </CardHeader>
                    <CardContent className="m-0 p-0">
                        <WeeklyClinicChart />
                    </CardContent>
                    {/* <CardFooter className="flex-col items-start gap-2 text-sm"> */}
                    {/*     <div className="flex gap-2 font-medium leading-none"> */}
                    {/*         Trending up by 11.9% this week <TrendingUp className="h-4 w-4" /> */}
                    {/*     </div> */}
                    {/*     <div className="leading-none text-muted-foreground"> */}
                    {/*         Showing total clinic visits for the last 5 weeks */}
                    {/*     </div> */}
                    {/* </CardFooter> */}
                </Card>
                <Card className="h-[calc(50%-0.5rem)] border border-gray-300 shadow-md hover:shadow-lg hover:bg-slate-50">
                    <CardHeader>
                        <CardTitle>Recent Clinics</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <Card className="h-full border border-gray-300 shadow-md hover:shadow-lg hover:bg-slate-50">
                <CardHeader className="text-2xl font-bold">Messages</CardHeader>
                <CardContent className="h-[30rem] flex justify-center items-center">Coming Soon..</CardContent>
            </Card>
        </div>
    );
}
