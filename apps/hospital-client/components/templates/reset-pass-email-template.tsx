import * as React from "react";

export function ResetPassEmail({ resetLink }: { resetLink: string }) {
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

            <header className="text-center pb-4 border-b border-gray-300">
                <h1 className="text-2xl font-semibold text-gray-800">Reset Your Password</h1>
                <p className="text-gray-600">N6T Technologies - Secure Account Access</p>
            </header>

            <main className="py-6 text-center">
                <p className="text-gray-700 mb-4">Hello,</p>
                <p className="text-gray-600 mb-4">
                    We received a request to reset the password for your Clinqo account. To reset your password, please
                    click the button below:
                </p>
                <a
                    href={resetLink}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 ease-in-out mt-4"
                >
                    Reset Password
                </a>
                <p className="text-gray-500 text-sm mt-6">
                    This link will expire in 24 hours. If you did not request a password reset, you can safely ignore
                    this email.
                </p>
            </main>

            <footer className="pt-4 mt-6 border-t border-gray-300 text-center">
                <p className="text-gray-500 text-sm">For support, contact N6T Technologies at support@n6t.in</p>
            </footer>
        </div>
    );
}
