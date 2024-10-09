"use client";

import { CreateAppointmentError, CreateAppointmentSchema, CreateAppointmentSchemaType, StepInfo } from "@/types";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAppointment } from "@/actions/create-appointment";
import { Stepper } from "../ui/stepper";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";
import { Button } from "../ui/button";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Checkbox } from "../ui/checkbox";
import { PaymentMethod } from "@repo/db/client";
import { WsManger } from "@/lib/WsManager";
import { Errors } from "../../../shefu/src/state/ReshipiBook";
import { useRouter } from "next/navigation";

const formSteps: StepInfo[] = [
    {
        id: "Step 1",
        name: "Patient Personal Details",
        fields: ["firstName", "lastName", "dateOfBirth", "gender", "contactNumber"],
    },
    {
        id: "Step 2",
        name: "Appointment Details",
        fields: ["symptoms", "doctor", "followup"],
    },
    {
        id: "Step 3",
        name: "Payment Information",
        fields: ["paymentMethod"],
    },
    { id: "Step 4", name: "Complete" },
];

export type AvailableDoctor = {
    doctorId: string;
    doctorName: string;
};

export default function CreateAppointment({
    availableDoctors,
    clinicId,
}: {
    availableDoctors: AvailableDoctor[] | Errors;
    clinicId: string;
}) {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [error, setError] = useState<CreateAppointmentError | undefined>(undefined);
    const [newAvailableDoctors, setNewAvailableDoctor] = useState<AvailableDoctor[] | Errors>([]);

    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    useEffect(() => {
        setNewAvailableDoctor(availableDoctors);
        WsManger.getInstance().registerCallback(
            "doctors",
            (data: AvailableDoctor[]) => setNewAvailableDoctor(data),
            `doctors@${clinicId}`
        );

        WsManger.getInstance().sendMessage({ method: "SUBSCRIBE", params: [`doctors@${clinicId}`] });
        return () => {
            WsManger.getInstance().deRegisterCallback("doctors", `doctors@${clinicId}`);
            WsManger.getInstance().sendMessage({ method: "UNSUBSCRIBE", params: [`doctors@${clinicId}`] });
        };
    }, []);

    const form = useForm<CreateAppointmentSchemaType>({
        resolver: zodResolver(CreateAppointmentSchema),
    });

    const processForm: SubmitHandler<CreateAppointmentSchemaType> = (data) => {
        startTransition(async () => {
            const res = await createAppointment(data);
            if (res.ok) {
                setSuccess(res.msg);
            } else {
                setError(res.error);
            }

            router.push("/console/appointments");
        });
    };

    type FieldName = keyof CreateAppointmentSchemaType;

    const next = async () => {
        const fields = formSteps[currentStep]?.fields;
        const output = await form.trigger(fields as FieldName[], { shouldFocus: true });

        if (!output) return;

        if (currentStep < formSteps.length - 1) {
            if (currentStep === formSteps.length - 2) {
                await form.handleSubmit(processForm)();
            }
            setCurrentStep((step) => step + 1);
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            setCurrentStep((step) => step - 1);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-between pt-16 px-16">
            <div>
                <Stepper formSteps={formSteps} currentStep={currentStep} />
                <Form {...form}>
                    <form
                        className="flex justify-center w-full h-full mt-12 py-12"
                        onSubmit={form.handleSubmit(processForm)}
                    >
                        {currentStep === 0 && (
                            <div>
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Patient Information</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Provide details of Patient</p>
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        First name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            type="text"
                                                            placeholder="John"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Last name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="block text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            type="text"
                                                            placeholder="Doe"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="contactNumber"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Phone number
                                                    </FormLabel>
                                                    <FormControl>
                                                        <PhoneInput {...field} defaultCountry="IN" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                    Gender
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="MALE">Male</SelectItem>
                                                        <SelectItem value="FEMALE">Female</SelectItem>
                                                        <SelectItem value="OTHERS">Others</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dateOfBirth"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Date of Birth
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            type="date"
                                                            placeholder="2003/02/28"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                        {currentStep === 1 && (
                            <div>
                                <h2 className="text-base font-semibold leading-7 text-gray-900">
                                    Appointment Information
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Provide details of Appointment</p>
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <FormField
                                        control={form.control}
                                        name="symptoms"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Symptoms
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            type="text"
                                                            placeholder="Nuro"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="doctor"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Doctor
                                                    </FormLabel>
                                                    {newAvailableDoctors === Errors.NOT_FOUND ||
                                                    newAvailableDoctors === Errors.FORBIDDEN ||
                                                    newAvailableDoctors === Errors.BAD_REQUEST ? (
                                                        <div>No Doctors Found</div>
                                                    ) : (
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Doctor" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {newAvailableDoctors.map((ad: AvailableDoctor) => {
                                                                    return (
                                                                        <SelectItem
                                                                            value={`${ad.doctorName}_${ad.doctorId}`}
                                                                        >
                                                                            {ad.doctorName}
                                                                        </SelectItem>
                                                                    );
                                                                })}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="followup"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                    Follow up?
                                                </FormLabel>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormDescription></FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div>
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Payment Information</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Provide details about Payment</p>
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <FormField
                                        control={form.control}
                                        name="paymentMethod"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                    Payment Method
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Payment Method" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                                                        <SelectItem value={PaymentMethod.UPI}>UPI</SelectItem>
                                                        <SelectItem value={PaymentMethod.DEBIT_CARD}>
                                                            Debit Card
                                                        </SelectItem>
                                                        <SelectItem value={PaymentMethod.CREDIT_CARD}>
                                                            Credit Card
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </Form>
                {currentStep != formSteps.length - 1 ? (
                    <div className="flex justify-between fixed bottom-4 w-9/12">
                        <Button variant="clinqo" className="p-2" onClick={() => prev()} disabled={currentStep == 0}>
                            <BsChevronLeft className="h-6 w-6" />
                        </Button>

                        <Button
                            variant="clinqo"
                            className="p-2"
                            onClick={() => next()}
                            disabled={currentStep == formSteps.length - 1 || isPending}
                        >
                            <BsChevronRight className="h-6 w-6" />
                        </Button>
                    </div>
                ) : (
                    <div>{success ? success : error}</div>
                )}
            </div>
        </div>
    );
}
