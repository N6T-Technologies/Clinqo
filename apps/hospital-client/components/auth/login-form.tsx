"use client";

import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormItem, FormControl, FormLabel, FormMessage, FormField } from "../ui/form";
import { LoginSchema, type LoginSchemaType } from "@/types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../ui/form-error";
import { FormSuccess } from "../ui/form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import Link from "next/link";
import { LoginActionsError } from "@/types";

export const LoginForm = () => {
    const [error, setError] = useState<LoginActionsError | undefined>();
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: LoginSchemaType) => {
        startTransition(async () => {
            const res = await login(values);
            setSuccess(res.msg);
            setError(res.error);
        });
    };

    return (
        <CardWrapper headerLabel="Welcome back">
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className="font-normal">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="py-6"
                                                {...field}
                                                disabled={isPending}
                                                type="email"
                                                placeholder="john.doe@example.com"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className="font-normal">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="py-6"
                                                {...field}
                                                disabled={isPending}
                                                type="password"
                                                placeholder="******"
                                            />
                                        </FormControl>
                                        <Button size="sm" variant="link" asChild className="px-0 font-normal">
                                            <Link href="/auth/reset">Forgot password?</Link>
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
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
