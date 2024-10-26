"use client";

import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormControl, FormLabel, FormMessage, FormField } from "../ui/form";
import { useState, useTransition } from "react";
import { ResetSchema, ResetSchemaType } from "@/types";
import { Input } from "../ui/input";
import { FormError } from "../ui/form-error";
import { FormSuccess } from "../ui/form-success";
import { Button } from "../ui/button";
import { reset } from "@/actions/reset";

export function ResetForm() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<ResetSchemaType>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: ResetSchemaType) => {
        setError("");
        setSuccess("");
        startTransition(async () => {
            const res = await reset(values);
            setSuccess(res.success);
            setError(res.error);
        });
    };

    return (
        <CardWrapper headerLabel="Forgot your password?" title="Reset Password">
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button variant="clinqo" disabled={isPending} className="py-5 w-full">
                        Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
