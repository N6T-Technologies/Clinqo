"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { DoctorRegSchema, DoctorRegError, DoctorRegSchemaType, StepInfo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stepper } from "../ui/stepper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { registerDoctor } from "@/actions/register-doctor";

const formSteps: StepInfo[] = [
    {
        id: "Step 1",
        name: "Doctor Personal Details",
        fields: ["firstName", "lastName", "email", "dateOfBirth", "gender", "contactNumber"],
    },
    {
        id: "Step 2",
        name: "Doctor Profesional Details",
        fields: ["specialisation", "mciNumber"],
    },
    { id: "Step 3", name: "Complete" },
];

export default function DoctorRegForm() {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [error, setError] = useState<DoctorRegError | undefined>(undefined);

    const [isPending, startTransition] = useTransition();

    const form = useForm<DoctorRegSchemaType>({
        resolver: zodResolver(DoctorRegSchema),
    });

    const processForm: SubmitHandler<DoctorRegSchemaType> = (data) => {
        startTransition(async () => {
            const res = await registerDoctor(data);
            if (res.ok) {
                setSuccess(res.msg);
            } else {
                setError(res.error);
            }
        });
    };

    type FieldName = keyof DoctorRegSchemaType;

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
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Doctor Information</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Provide details of Doctor</p>
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
                                        name="email"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Email
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="block text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            type="email"
                                                            placeholder="johndoe@gmail.com"
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
                            <div>
                                <h2 className="text-base font-semibold leading-7 text-gray-900">
                                    Professional Information
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    Provide Professional Details of Doctor
                                </p>
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <FormField
                                        control={form.control}
                                        name="specialisation"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Specialisation
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
                                        name="mciNumber"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        MCI Number
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="block text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            type="text"
                                                            placeholder="MCI"
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
