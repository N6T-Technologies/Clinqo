"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { useEffect, useRef, useState } from "react";
import { DoctorAppointmentData } from "@/app/(protected)/console/@doctor/appointments/page";
import { useRecoilValue } from "recoil";
import { sessionAtom } from "@/store/atoms/sessionAtom";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { WsManger } from "@/lib/WsManager";
import { Reshipi } from "shefu/appointments";
import { nextAppointment } from "@/actions/next-appointment";
import { useToast } from "@/hooks/use-toast";
import { startAppointment } from "@/actions/start-appointment";

function getAge(dob: Date) {
    const birthYear = dob.getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    return age;
}

export default function AppointmentCard({
    data,
    doctorId,
    clinicId,
}: {
    data: DoctorAppointmentData[];
    doctorId: string;
    clinicId: string | undefined;
}) {
    const [appointments, setAppointment] = useState<DoctorAppointmentData[]>([]);
    const [currentAppointment, setCurrentAppointment] = useState<{
        index: number;
        info: DoctorAppointmentData | undefined;
    }>({ index: 0, info: appointments[0] });
    const [total, setTotal] = useState<number>(0);

    const currentSession = useRecoilValue(sessionAtom);

    const { toast } = useToast();
    console.log(clinicId);

    useEffect(() => {
        setAppointment(data);
        setCurrentAppointment({ index: 0, info: data[0] });
        setTotal(data.length);

        const fetchData = async () => {
            const res = await fetch("/api/appointment", {
                next: { revalidate: false },
                method: "POST",
                body: JSON.stringify({ title: `${clinicId}_${doctorId}` }),
            });

            const data = await res.json();
            if (!data.ok) {
                await startAppointment(clinicId || "");
            }
        };

        fetchData();

        console.log("featchData called");
        WsManger.getInstance().registerCallback(
            "new_doctor",
            (data: Reshipi) => {
                setAppointment((appointments) => {
                    return [
                        ...appointments,
                        {
                            id: data.id,
                            number: data.reshipiNumber,
                            patientName: `${data.patientFirstName} ${data.patientLastName}`,
                            gender: data.gender,
                            folloup: data.followup,
                            age: getAge(new Date(data.patientDateOfBirth)),
                            symtoms: data.symptoms,
                        },
                    ];
                });
            },
            `new_doctor@${clinicId}_${doctorId}`
        );

        WsManger.getInstance().registerCallback(
            "cancellation_doctor",
            (data: Reshipi) => {
                setAppointment((appointments) => {
                    return appointments.filter((a) => a.id != data.id);
                });
            },
            `cancellation_doctor@${clinicId}_${doctorId}`
        );

        WsManger.getInstance().registerCallback(
            "total",
            (totalNumber: number) => {
                setTotal(totalNumber);
            },
            `total@${clinicId}_${doctorId}`
        );

        WsManger.getInstance().sendMessage({
            method: "SUBSCRIBE",
            params: [
                `new_doctor@${clinicId}_${doctorId}`,
                `cancellation_doctor@${clinicId}_${doctorId}`,
                `total@${clinicId}_${doctorId}`,
            ],
        });

        return () => {
            console.log("component unmounted");
        };
    }, [currentSession]);

    return (
        <div className="w-full h-full flex justify-center items-center pb-24">
            {appointments.length > 0 && currentAppointment.info ? (
                <Card className="w-full h-[580px] mx-8 p-6">
                    <CardHeader>
                        <CardTitle className="flex text-2xl font-semibold">
                            <div>Appointment:</div>{" "}
                            <div className="pl-2">
                                {currentAppointment.info.number}/{total}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <fieldset className="border border-gray-300 rounded-md p-4">
                            <legend className="font-semibold text-gray-800">Patient Details</legend>
                            <div className="flex justify-between">
                                <div>
                                    <div className="flex gap-x-14">
                                        <div>
                                            <div className="flex">
                                                <div className="underline">Name:</div>{" "}
                                                <div className="pl-2">{currentAppointment.info.patientName}</div>
                                            </div>
                                            <div className="flex">
                                                <div className="underline">Gender:</div>{" "}
                                                <div className="pl-2">{currentAppointment.info.gender}</div>
                                            </div>
                                            <div className="flex">
                                                <div className="underline">Age:</div>{" "}
                                                <div className="pl-2">{currentAppointment.info.age}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <div className="underline">Symtoms:</div>{" "}
                                                <div className="pl-2">{currentAppointment.info.symtoms}</div>
                                            </div>
                                            <div className="flex">
                                                <div className="underline">Follow-Up:</div>
                                                <div className="pl-2">
                                                    {currentAppointment.info.folloup ? "Yes" : "No"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <figure className="max-w-md">
                                    <Image
                                        className="h-auto max-w-full rounded-md border border-gray-400"
                                        width={100}
                                        height={100}
                                        src="/images/avatar-placeholder.png"
                                        alt="img"
                                    />
                                </figure>
                            </div>
                        </fieldset>
                        <fieldset className="border border-gray-300 rounded-md mt-4 p-4">
                            <legend className="font-semibold text-gray-800">Appointment Details</legend>
                            <div>
                                <div className="flex mb-2">
                                    <div className="underline">Id:</div>{" "}
                                    <div className="pl-2">{currentAppointment.info.id}</div>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="remakrs" className="underline">
                                        Remarks:
                                    </Label>
                                    <Textarea placeholder="Type your remarks here." id="remarks" rows={3} />
                                    <p className="text-sm text-muted-foreground">
                                        Your remarks will be added in the appointment details as prescription.
                                    </p>
                                </div>
                            </div>
                            <div></div>
                        </fieldset>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-x-4">
                        <Button
                            variant="destructive"
                            size="lg"
                            // onClick={() => table.nextPage()}
                            // disabled={!table.getCanNextPage()}
                        >
                            Pause
                        </Button>
                        <Button
                            variant="clinqo"
                            size="lg"
                            onClick={async () => {
                                const result = await nextAppointment(clinicId || "");
                                console.log(result);
                                if (result.ok) {
                                    setCurrentAppointment((ca) => {
                                        return {
                                            index: ca.index + 1,
                                            info: appointments[ca.index + 1],
                                        };
                                    });
                                } else if (!result.ok) {
                                    toast({
                                        variant: "destructive",
                                        title: `${result.msg}`,
                                        description: "This error is not fetal. Try Reloading",
                                    });
                                }
                            }}
                            disabled={appointments.length === 0}
                        >
                            Next
                        </Button>
                    </CardFooter>
                </Card>
            ) : appointments.length > 0 && !currentAppointment ? (
                <Card className="w-full h-[580px] mx-8 flex justify-center items-center text-xl">
                    {/* //TODO: Replace this with skeleton loading page */}
                    Loading for appointments...
                </Card>
            ) : appointments.length === 0 && currentSession ? (
                <Card className="w-full h-[580px] mx-8 p-8 flex justify-center items-center text-xl">
                    {/* //TODO: Replace this with skeleton loading page */}
                    Waiting for appointments...
                </Card>
            ) : (
                <div className="text-2xl">Session Not Found</div>
            )}
        </div>
    );
}
