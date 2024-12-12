"use client";

import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, LayoutGrid } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

export default function QRCodeGenerator({ clinicId: string }) {
    // Constant URL instead of input
    const DEMO_URL = "https://example.com";

    const color = "#ffffff";
    const bgColor = "#057FFF";
    const [logo, setLogo] = React.useState<string | null>(null);

    const qrCodeRef = useRef<HTMLDivElement>(null);

    const handleDownload = (type: "png" | "svg") => {
        if (!qrCodeRef.current) return;

        if (type === "png") {
            toPng(qrCodeRef.current)
                .then((dataUrl) => {
                    saveAs(dataUrl, "qr-code.png");
                })
                .catch((err) => {
                    console.log("Error generating QR code", err);
                });
        } else if (type === "svg") {
            const svgElem = qrCodeRef.current.querySelector("svg");
            if (svgElem) {
                const saveData = new Blob([svgElem.outerHTML], {
                    type: "image/svg+xml;charset=utf-8",
                });
                saveAs(saveData, "qr-code.svg");
            }
        }
    };

    return (
        <div className="flex justify-center h-full w-full">
            <Card className="h-[82%] w-[50%] m-8">
                <CardHeader>
                    <CardTitle className="flex justify-center text-3xl">QR Code</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                        <div>
                            <div ref={qrCodeRef} className="bg-[#037FFF] rounded-lg p-4 flex justify-center">
                                <div>
                                    <QRCodeSVG
                                        value={DEMO_URL}
                                        size={256}
                                        fgColor={color}
                                        bgColor={bgColor}
                                        imageSettings={
                                            logo ? { src: logo, height: 50, width: 50, excavate: true } : undefined
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center pb-6">
                                <Button variant="outline" onClick={() => handleDownload("png")}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PNG
                                </Button>
                                <Button variant="outline" onClick={() => handleDownload("svg")}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download SVG
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
