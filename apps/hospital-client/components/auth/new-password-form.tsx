"use client";

import { newPassword } from "@/actions/new-password";
import { NewPasswordSchema, NewPasswordSchemaType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { CardWrapper } from "./card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../ui/form-error";
import { FormSuccess } from "../ui/form-success";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";

function PassForm() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const form = useForm<NewPasswordSchemaType>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    const onSubmit = (values: NewPasswordSchemaType) => {
        startTransition(async () => {
            const res = await newPassword(values, token);
            setSuccess(res.success);
            setError(res.error);
        });
    };

    return (
        <>
            <CardWrapper headerLabel="New Password" title="New Password">
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel className="font-normal">Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        className="py-6 pr-10 "
                                                        {...field}
                                                        disabled={isPending}
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="******"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOffIcon className="h-5 w-5 text-gray-500" />
                                                        ) : (
                                                            <EyeIcon className="h-5 w-5 text-gray-500" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <Button size="sm" variant="link" asChild className="px-0 font-normal">
                                                <Link href="/auth/login">Go back to Login</Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        <FormError message={error?.toString()} />
                        <FormSuccess message={success} />
                        <Button variant="clinqo" type="submit" disabled={isPending} className="py-5 w-full">
                            Reset Password
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </>
    );
}

export function NewPasswordForm() {
    return (
        <Suspense>
            <PassForm />
        </Suspense>
    );
}
