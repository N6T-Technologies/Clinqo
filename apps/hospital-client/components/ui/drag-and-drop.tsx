"use client";

import React, { useState, DragEvent, useRef } from "react";
import { Input } from "./input";
import Image from "next/image";

interface DragAndDropProps {
    field: any;
    isPending?: boolean;
}

const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];

const isValidFileType = (fileName: string) => allowedExtensions.includes(`.${fileName.split(".").pop()}`);

const DragAndDrop: React.FC<DragAndDropProps> = ({ field, isPending }) => {
    const [dragOver, setDragOver] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null); // For preview
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer?.files?.[0];
        if (file && isValidFileType(file.name)) {
            setFileName(file.name);
            setError(null);
            previewImage(file); // Preview the image
        } else {
            setFileName(null);
            setError("Invalid file type.");
            setPreviewSrc(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target?.files?.[0];
        if (file && isValidFileType(file.name)) {
            setFileName(file.name);
            setError(null);
            previewImage(file); // Preview the image
        } else {
            setFileName(null);
            setError("Invalid file type.");
            setPreviewSrc(null);
        }
    };

    const previewImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => setPreviewSrc(reader.result as string);
        reader.readAsDataURL(file); // Convert file to Base64
    };

    return (
        <div
            className={`relative flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                dragOver
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 hover:border-sky-600 hover:bg-gray-50"
            }`}
            onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
        >
            <Input
                {...field}
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                type="file"
                accept=".png, .jpg, .jpeg, .webp"
                onChange={handleFileChange}
                disabled={isPending}
            />
            <div className="relative z-10 text-center">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {previewSrc ? (
                    <div className="w-32 h-32 relative">
                        <Image src={previewSrc} alt="Preview" layout="fill" objectFit="cover" className="rounded-md" />
                    </div>
                ) : fileName ? (
                    <p className="text-lg font-medium">File: {fileName}</p>
                ) : (
                    <>
                        <p className="text-lg font-medium">Drag and Drop file</p>
                        <p className="mt-2 text-sm">or</p>
                    </>
                )}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700"
                >
                    Browse
                </button>
            </div>
        </div>
    );
};

export default DragAndDrop;
