"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { useEffect, useState } from "react";
import { DoctorAppointmentData } from "@/types";
import { useRecoilState } from "recoil";
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
import { endAppointment } from "@/actions/end-appointment";

function getAge(dob: Date) {
    const birthYear = dob.getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    return age;
}

export default function AppointmentCard({ doctorId }: { doctorId: string }) {
    const [appointments, setAppointment] = useState<DoctorAppointmentData[]>([]);
    const [currentAppointment, setCurrentAppointment] = useState<DoctorAppointmentData | null>(null);

    const [lastIndex, setLastIndex] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [count, setCount] = useState<number>(1);
    //TODO: form to be added instead of the remarks
    const [remarks, setRemarks] = useState<string>("");

    const [message, setMessage] = useState<string>("");

    const [currentSession, setCurrentSession] = useRecoilState<string | null>(sessionAtom);

    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/appointment/doctor", {
                next: { revalidate: false },
                method: "POST",
                body: JSON.stringify({ doctorId: doctorId }),
            });

            const data = await res.json();
            if (!data.ok) {
                if (!currentSession) {
                    setCurrentSession(null);
                }
                setAppointment([]);
                setCurrentAppointment(null);
                setTotal(0);
                setLastIndex(0);

                setMessage(data.msg);
            } else if (data.ok && data.session && !data.depth && !data.ongoing) {
                if (!currentSession) {
                    setCurrentSession(data.currentSessionId);
                }
                setAppointment([]);
                setCurrentAppointment(null);
                setTotal(0);
                setLastIndex(0);
            } else if (data.ok && data.session && data.depth && !data.ongoing) {
                if (!currentSession) {
                    setCurrentSession(data.currentSessionId);
                }

                setAppointment(data.appointments);
                setCurrentAppointment(null);
                setTotal(data.appointments.length);
                setLastIndex(0);
            } else if (data.ok && data.session && data.depth && data.ongoing) {
                if (!currentSession) {
                    setCurrentSession(data.currentSessionId);
                }
                setAppointment(data.appointments);
                setCurrentAppointment({
                    id: data.currentAppointment.id,
                    number: data.currentAppointment.reshipiNumber,
                    patientName: `${data.currentAppointment.patientFirstName} ${data.currentAppointment.patientLastName}`,
                    gender: data.currentAppointment.gender,
                    folloup: data.currentAppointment.followup,
                    age: getAge(new Date(data.currentAppointment.patientDateOfBirth)),
                    symtoms: data.currentAppointment.symptoms,
                });
                setTotal(data.appointments.length);
                setLastIndex(0);
            }

            if (currentSession) {
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
                    `new_doctor@${currentSession}_${doctorId}`
                );

                WsManger.getInstance().registerCallback(
                    "cancellation_doctor",
                    (data: Reshipi) => {
                        setAppointment((appointments) => {
                            return appointments.filter((a) => a.id != data.id);
                        });
                    },
                    `cancellation_doctor@${currentSession}_${doctorId}`
                );

                WsManger.getInstance().registerCallback(
                    "total",
                    (totalNumber: number) => {
                        setTotal(totalNumber);
                    },
                    `total@${currentSession}_${doctorId}`
                );

                WsManger.getInstance().sendMessage({
                    method: "SUBSCRIBE",
                    params: [
                        `new_doctor@${currentSession}_${doctorId}`,
                        `cancellation_doctor@${currentSession}_${doctorId}`,
                        `total@${currentSession}_${doctorId}`,
                    ],
                });
            }
        };

        fetchData();

        return () => {
            console.log("component unmounted");
        };
    }, [currentSession]);

    console.log(appointments);
    console.log(currentAppointment);
    console.log(lastIndex);
    console.log(count);
    console.log(total);

    return (
        <div className="w-full h-full flex justify-center items-center pb-24">
            {currentSession && appointments.length > 0 && currentAppointment && currentAppointment ? (
                <Card className="w-full h-[580px] mx-8 p-6">
                    <CardHeader>
                        <CardTitle className="flex text-2xl font-semibold">
                            <div>Appointment:</div>{" "}
                            <div className="pl-2">
                                {count}/{total}
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
                                                <div className="pl-2">{currentAppointment.patientName}</div>
                                            </div>
                                            <div className="flex">
                                                <div className="underline">Gender:</div>{" "}
                                                <div className="pl-2">{currentAppointment.gender}</div>
                                            </div>
                                            <div className="flex">
                                                <div className="underline">Age:</div>{" "}
                                                <div className="pl-2">{currentAppointment.age}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <div className="underline">Symtoms:</div>{" "}
                                                <div className="pl-2">{currentAppointment.symtoms}</div>
                                            </div>
                                            <div className="flex">
                                                <div className="underline">Follow-Up:</div>
                                                <div className="pl-2">{currentAppointment.folloup ? "Yes" : "No"}</div>
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
                                <div className="flex gap-x-14">
                                    <div className="flex mb-2">
                                        <div className="underline">Number:</div>{" "}
                                        <div className="pl-2">{currentAppointment.number}</div>
                                    </div>
                                    <div className="flex mb-2">
                                        <div className="underline">Id:</div>{" "}
                                        <div className="pl-2">{currentAppointment.id}</div>
                                    </div>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="remakrs" className="underline">
                                        Remarks:
                                    </Label>
                                    <Textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Type your remarks here."
                                        id="remarks"
                                        rows={3}
                                    />
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
                                if (lastIndex === appointments.length - 1) {
                                    await endAppointment(currentSession);
                                    setAppointment([]);
                                    setLastIndex(0);
                                    setCurrentAppointment(null);
                                    setCount(1);
                                    setRemarks("");
                                    return;
                                }
                                if (!currentSession) {
                                    toast({
                                        variant: "destructive",
                                        title: "Session Id Not Found",
                                        description: "This error is not fetal. Try Reloading",
                                    });
                                    return;
                                }
                                const result = await nextAppointment(currentSession);
                                if (result.ok) {
                                    setLastIndex((li) => li + 1);
                                    setCount((c) => c + 1);
                                    setCurrentAppointment(() => {
                                        if (appointments[lastIndex]) {
                                            return appointments[lastIndex];
                                        }
                                        return null;
                                    });
                                    setRemarks("");
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
            ) : currentSession && appointments.length > 0 && !currentAppointment ? (
                <Card className="w-full h-[580px] mx-8 flex justify-center items-center text-xl">
                    <CardContent>
                        <Button
                            variant="clinqo"
                            onClick={async () => {
                                if (!currentSession) {
                                    toast({
                                        variant: "destructive",
                                        title: "Session Not Found",
                                        description: "This error is not fetal. Try Reloading",
                                    });
                                    return;
                                }
                                const data = await startAppointment(currentSession);

                                if (data.ok && data.currentAppointment) {
                                    setCurrentAppointment({
                                        id: data.currentAppointment.id,
                                        number: data.currentAppointment.reshipiNumber,
                                        patientName: `${data.currentAppointment.patientFirstName} ${data.currentAppointment.patientLastName}`,
                                        gender: data.currentAppointment.gender,
                                        folloup: data.currentAppointment.followup,
                                        age: getAge(new Date(data.currentAppointment.patientDateOfBirth)),
                                        symtoms: data.currentAppointment.symptoms,
                                    });
                                    return;
                                } else {
                                    toast({
                                        variant: "destructive",
                                        title: `${data.msg}`,
                                        description: "This error is not fetal. Try Reloading",
                                    });
                                    return;
                                }
                            }}
                        >
                            Start
                        </Button>
                    </CardContent>
                </Card>
            ) : currentSession && appointments.length === 0 ? (
                <Card className="w-full h-[580px] mx-8 p-8 flex justify-center items-center text-xl">
                    {/* //TODO: Replace this with skeleton loading page */}
                    Waiting for appointments...
                </Card>
            ) : (
                <div className="text-2xl">{message}</div>
            )}
        </div>
    );
}
