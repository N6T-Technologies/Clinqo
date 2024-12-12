"use client";

import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Mail, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

interface QRCodeGeneratorProps {
    clinicId: string;
    clinicName: string;
    email: string;
    defaultUrl?: string;
}

type DownloadType = "png" | "svg";

interface QRCodeSettings {
    color: string;
    bgColor: string;
    size: number;
}

interface LogoSettings {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ clinicId, clinicName, email }) => {
    const DEMO_URL = `http://localhost:3000/${clinicId}`;
    const qrSettings: QRCodeSettings = {
        color: "#ffffff",
        bgColor: "#2182D9",
        size: 256,
    };

    const logo = "/n6t-logo.jpg";
    const qrCodeRef = useRef<HTMLDivElement>(null);

    console.log(email);

    const handleDownload = async (type: DownloadType): Promise<void> => {
        if (!qrCodeRef.current) return;

        try {
            if (type === "png") {
                const dataUrl = await toPng(qrCodeRef.current);
                saveAs(dataUrl, "qr-code.png");
            } else if (type === "svg") {
                const svgElem = qrCodeRef.current.querySelector("svg");
                if (svgElem) {
                    const saveData = new Blob([svgElem.outerHTML], {
                        type: "image/svg+xml;charset=utf-8",
                    });
                    saveAs(saveData, "qr-code.svg");
                }
            }
        } catch (err: unknown) {
            console.error("Error generating QR code:", err instanceof Error ? err.message : err);
        }
    };

    const handleEmailShare = async (): Promise<void> => {
        if (!qrCodeRef.current) return;

        try {
            const dataUrl = await toPng(qrCodeRef.current);
            const mailtoLink = `mailto:?subject=QR Code&body=Here's your QR Code for ${DEMO_URL}`;
            window.location.href = mailtoLink;
        } catch (err: unknown) {
            console.error("Error generating QR code for email:", err instanceof Error ? err.message : err);
        }
    };

    const getLogoSettings = (): { imageSettings?: LogoSettings } => ({
        imageSettings: logo
            ? {
                  src: logo,
                  height: 50,
                  width: 50,
                  excavate: true,
              }
            : undefined,
    });

    return (
        <div className="h-full w-full flex justify-center items-center">
            <Card className="w-full max-w-md mx-4 shadow-lg mb-16 p-6">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">QR Code Generator</CardTitle>
                    <p className="text-sm text-gray-500 text-center">
                        Scan to book Appointment at {clinicName} Hospital
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div
                        ref={qrCodeRef}
                        className="bg-[#2182D9] rounded-xl p-8 flex justify-center items-center transform hover:scale-105 transition-transform duration-200 shadow-md"
                    >
                        <QRCodeSVG
                            value={DEMO_URL}
                            size={qrSettings.size}
                            fgColor={qrSettings.color}
                            bgColor={qrSettings.bgColor}
                            {...getLogoSettings()}
                            className="rounded-lg"
                        />
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 text-center">Download or share the QR code</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Button
                                variant="outline"
                                onClick={() => handleDownload("png")}
                                className="w-full hover:bg-gray-100"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                PNG
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleDownload("svg")}
                                className="w-full hover:bg-gray-100"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                SVG
                            </Button>
                            <Button variant="outline" onClick={handleEmailShare} className="w-full hover:bg-gray-100">
                                <Mail className="w-4 h-4 mr-2" />
                                Email
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default QRCodeGenerator;
