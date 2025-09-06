"use client";

import {
    AvailableDoctorTable,
    CreateAppointmentError,
    CreateAppointmentSchema,
    CreateAppointmentSchemaType,
    StepInfo,
} from "@/types";
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
import PrintPrescriptionButton from "@/components/ui/print-prescription-button-simple";
import SymptomChecker from "@/components/ui/symptom-checker";

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

export default function CreateAppointment({
    availableDoctors,
    clinicId,
    self = false,
}: {
    availableDoctors: AvailableDoctorTable[];
    clinicId: string;
    self?: boolean;
}) {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [error, setError] = useState<CreateAppointmentError | undefined>(undefined);
    const [newAvailableDoctors, setNewAvailableDoctor] = useState<AvailableDoctorTable[]>([]);

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setNewAvailableDoctor(availableDoctors);
        WsManger.getInstance().registerCallback(
            "doctors",
            (data: AvailableDoctorTable[]) => setNewAvailableDoctor(data),
            `doctors@${clinicId}`
        );

        WsManger.getInstance().sendMessage({ method: "SUBSCRIBE", params: [`doctors@${clinicId}`] });
        return () => {
            WsManger.getInstance().deRegisterCallback("doctors", `doctors@${clinicId}`);
            WsManger.getInstance().sendMessage({ method: "UNSUBSCRIBE", params: [`doctors@${clinicId}`] });
        };
    }, [clinicId, availableDoctors]);

    const form = useForm<CreateAppointmentSchemaType>({
        resolver: zodResolver(CreateAppointmentSchema),
    });

    const processForm: SubmitHandler<CreateAppointmentSchemaType> = (data) => {
        startTransition(async () => {
            const res = await createAppointment(data, { self: self, clinicId: clinicId });
            if (res.ok) {
                setSuccess(res.msg);
            } else {
                setError(res.error);
            }
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
        <div className="w-full flex flex-col px-4 pt-4 md:pt-8 md:px-16 pb-24">
            <div className="w-full max-w-5xl mx-auto">
                <div className="hidden md:block">
                    <Stepper formSteps={formSteps} currentStep={currentStep} />
                </div>
                <div className="md:hidden">
                    <h1 className="text-lg font-bold text-center mb-4">{formSteps[currentStep]?.name}</h1>
                    <div className="flex justify-center items-center mb-4">
                        <div className="flex space-x-2">
                            {formSteps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-2 w-2 rounded-full ${
                                        idx === currentStep ? "bg-sky-600" : "bg-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <Form {...form}>
                    <form
                        className="flex justify-center w-full mt-4 md:mt-12 py-4 md:py-12"
                        onSubmit={form.handleSubmit(processForm)}
                    >
                        {currentStep === 0 && (
                            <div className="w-full">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Patient Information</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Provide details of Patient</p>
                                <div className="mt-6 md:mt-10 grid grid-cols-1 gap-y-6 md:gap-y-8 md:gap-x-6 md:grid-cols-2">
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
                                                <FormItem className="col-span-1 md:col-span-2">
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
                                                        <SelectItem value="OTHER">Others</SelectItem>
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
                            <div className="w-full">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">
                                    Appointment Information
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Provide details of Appointment</p>
                                <div className="mt-6 md:mt-10 grid grid-cols-1 gap-y-6 md:gap-y-8 md:gap-x-6 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="symptoms"
                                        render={({ field }) => {
                                            const symptomData = field.value ? JSON.parse(field.value) : undefined;
                                            return (
                                                <FormItem className="col-span-1 md:col-span-2">
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Symptoms
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="w-full">
                                                            <SymptomChecker
                                                                initialData={symptomData}
                                                                onComplete={(data) => {
                                                                    field.onChange(JSON.stringify(data));
                                                                }}
                                                            />
                                                        </div>
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
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Doctor" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {newAvailableDoctors.map((ad: AvailableDoctorTable) => {
                                                                return (
                                                                    <SelectItem
                                                                        key={ad.doctorId}
                                                                        value={`${ad.doctorName}_${ad.doctorId}`}
                                                                    >
                                                                        {ad.doctorName}
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="followup"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-4">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className="text-sm font-medium leading-6 text-gray-900">
                                                    Follow up?
                                                </FormLabel>
                                                <FormDescription></FormDescription>
                                            </FormItem>
                                        )}
                                    />  

                                </div>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="w-full">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Payment Information</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Provide details about Payment</p>
                                <div className="mt-6 md:mt-10 grid grid-cols-1 gap-y-6 md:gap-y-8">
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
                        )}                        {currentStep === 3 && (
                            <div className="w-full text-center p-4">
                                {success ? (
                                    <div className="space-y-4">
                                        <div className="text-green-600 text-lg font-semibold p-4 bg-green-50 rounded-lg">
                                            {success}
                                        </div>
                                        {(() => {
                                            // Extract appointment ID from success message
                                            const match = success.match(/Appointment with id (\S+) created/);
                                            const appointmentId = match ? match[1] : null;
                                            
                                            if (appointmentId) {
                                                // Get patient and doctor names from form data
                                                const formValues = form.getValues();
                                                const patientName = `${formValues.firstName} ${formValues.lastName}`;
                                                const doctorName = formValues.doctor ? formValues.doctor.split("_")[0] : "";
                                                
                                                return (
                                                    <div className="flex flex-col items-center space-y-3">
                                                        <p className="text-gray-600 text-sm">
                                                            Appointment ID: <span className="font-mono font-semibold">{appointmentId}</span>
                                                        </p>                                                        <PrintPrescriptionButton
                                                            appointmentId={appointmentId}
                                                            patientName={patientName}
                                                            doctorName={doctorName}
                                                            variant="default"
                                                            size="default"
                                                            className="min-w-40"
                                                            showDownload={true}
                                                        />
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                ) : error ? (
                                    <div className="text-red-600 text-lg font-semibold p-4 bg-red-50 rounded-lg">
                                        {error}
                                    </div>
                                ) : (
                                    <div className="text-gray-600 text-lg font-semibold p-4">
                                        Processing your appointment...
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                </Form>
                {currentStep !== formSteps.length - 1 ? (
                    <div className="fixed bottom-0 left-0 right-0 md:left-[16.666667%] bg-white shadow-lg z-50">
                        <div className="flex justify-between max-w-5xl mx-auto px-4 py-4">
                            <Button variant="clinqo" className="px-6 py-2" onClick={() => prev()} disabled={currentStep === 0}>
                                <BsChevronLeft className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                                Back
                            </Button>

                            <Button
                                variant="clinqo"
                                className="px-6 py-2"
                                onClick={() => next()}
                                disabled={currentStep === formSteps.length - 1 || isPending}
                            >
                                {isPending ? "Processing..." : (
                                    <>
                                        Next
                                        <BsChevronRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
