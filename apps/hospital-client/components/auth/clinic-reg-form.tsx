"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import { ClininRegFormDataSchema, type ClininRegFormDataSchemaType, StepInfo } from "@/types";
import { Stepper } from "../ui/stepper";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";

const formSteps: StepInfo[] = [
    {
        id: "Step 1",
        name: "Clinic Head Details",
        fields: ["firstName", "lastName", "email", "dateOfBirth", "gender", "contactNumber"],
    },
    {
        id: "Step 2",
        name: "Clinic Info",
        fields: ["clinicName", "gstin", "addressLine1", "addressLine2", "city", "state", "pincode", "country"],
    },
    { id: "Step 3", name: "Upload Logo", fields: ["logo"] },
    { id: "Step 4", name: "Complete" },
];

export const ClinicRegForm = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);

    const [isPending, startTransition] = useTransition();

    const form = useForm<ClininRegFormDataSchemaType>({
        resolver: zodResolver(ClininRegFormDataSchema),
    });

    const processForm: SubmitHandler<ClininRegFormDataSchemaType> = (data) => {
        // startTransition(async () => {
        //     await new Promise((rej, res) => {
        //         setTimeout(() => {
        //             console.log(data);
        //             form.reset();
        //             res();
        //         }, 2000);
        //     });
        // });
        console.log(data);
        form.reset();
    };

    type FieldName = keyof ClininRegFormDataSchemaType;

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
                                <h2 className="text-base font-semibold leading-7 text-gray-900">
                                    Personal Information
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Provide details of Clinic Head</p>
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
                                                            autoComplete="given-name"
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
                                                            autoComplete="family-name"
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
                                                            autoComplete="email"
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
                                                            autoComplete="bday"
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
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Clinqo Information</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Provide details of Clinic.</p>
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <FormField
                                        control={form.control}
                                        name="clinicName"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Clinic Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            type="text"
                                                            placeholder="Clinqo Hospital"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="gstin"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        GSTIN
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            type="text"
                                                            placeholder="22AAAAA0000A1Z5"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="addressLine1"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Address Line 1
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            autoComplete="address-line1"
                                                            type="text"
                                                            placeholder="Address"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="addressLine2"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Address Line 2
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            autoComplete="address-line2"
                                                            type="text"
                                                            placeholder="Address"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        City
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            type="text"
                                                            placeholder="Aurangabad"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        State
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            autoComplete="country-name"
                                                            type="text"
                                                            placeholder="Maharashtra"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pincode"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Pincode
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="remove-arrow text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            autoComplete="postal-code"
                                                            type="number"
                                                            placeholder="431001"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                        Country
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            disabled={isPending}
                                                            autoComplete="country"
                                                            type="text"
                                                            placeholder="India"
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

                        {/* TODO:Complete the Logo upload field */}
                        {currentStep === 2 && (
                            <div className="w-full h-full">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Clinic Logo</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Add Clinic Logo</p>
                                <div className="flex justify-center">
                                    <div className="flex flex-col justify-center">
                                        <div className="pb-4">
                                            <FormField
                                                control={form.control}
                                                name="logo"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem>
                                                            <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                                                                Clinic Logo
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    className="text-gray-900 w-full border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                                                    {...field}
                                                                    disabled={isPending}
                                                                    type="file"
                                                                    accept=".png, .jpg, .jpeg, .webp"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        </div>
                                        <Button className="">Upload Image</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </Form>
            </div>
            <div>
                {currentStep != formSteps.length - 1 ? (
                    <div className="flex justify-between">
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
                    <div>Form submitted</div>
                )}
            </div>
        </div>
    );
};
