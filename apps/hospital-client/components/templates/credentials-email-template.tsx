import * as React from "react";

export enum Title {
    Mrs = "Mrs",
    Ms = "Ms",
    Mr = "Mr",
    Dr = "Dr",
}

export type CredentialEmailTemplateProps = {
    title: Title;
    firstName: string;
    password: string;
};

export function CredentailEmailTemplate({ title, firstName, password }: CredentialEmailTemplateProps) {
    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6">
            <div className="text-center mb-4">
                <img
                    src="/n6t-logo.jpg"
                    alt="N6T Technologies Logo"
                    className="mx-auto"
                    style={{ width: "120px", height: "40px" }}
                />
            </div>

            <div className="mb-4">
                <img
                    src="/welcome-banner.webp"
                    alt="Welcome Banner"
                    className="w-full h-auto object-cover rounded-md"
                    style={{ width: "100%", height: "auto" }}
                />
            </div>

            <header className="text-center pb-4 border-b border-gray-300">
                <h1 className="text-2xl font-semibold text-gray-800">Welcome to N6T Technologies</h1>
                <p className="text-gray-600">Your Credentials for Clinqo</p>
            </header>

            <main className="py-6 text-center">
                <h2 className="text-xl font-medium text-gray-700 mb-2">{`${title}. ${firstName}`}</h2>
                <p className="text-gray-600">We’re excited to have you on board. Below are your login credentials:</p>
                <div className="mt-4 text-left">
                    <p className="font-semibold text-gray-800">Your Password:</p>
                    <p className="bg-gray-100 border border-gray-200 p-2 rounded-md text-gray-900">{password}</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Note: Your login ID is your email. We strongly recommend changing your password after logging in for
                    the first time.
                </p>
            </main>

            <footer className="pt-4 mt-6 border-t border-gray-300 text-center">
                <p className="text-gray-500 text-sm">For support, contact N6T Technologies at team@n6t.in</p>
            </footer>
        </div>
    );
}
