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
    // const handleDelete = () => {
    //     // Clear the uploaded image and file name
    //     setPreviewSrc(null);
    //     setFileName(null);
    //     setError(null);

    //     // Reset the file input value
    //     if (fileInputRef.current) {
    //         fileInputRef.current.value = "";
    //     }
    // };

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
        // <div className="flex flex-col items-start space-y-4">
        //     {/* Title above the circle */}
        //     <p className="text-lg font-medium text-gray-700">Add Clinic Logo</p>

        //     {/* Circle and right-side content in a horizontal row */}
        //     <div className="flex items-center space-x-4">
        //         {/* Circle with image or placeholder */}
        //         <div
        //             className={`relative flex items-center justify-center h-24 w-24 border-2 border-dashed border-[#b5cddb] rounded-full transition-all duration-300 ${
        //                 dragOver ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-[#f4f6fa]"
        //             }`}
        //             onDragOver={(e) => {
        //                 e.preventDefault();
        //                 setDragOver(true);
        //             }}
        //             onDragLeave={() => setDragOver(false)}
        //             onDrop={handleDrop}
        //         >
        //             {previewSrc ? (
        //                 /* Dynamically display uploaded image */
        //                 <Image src={previewSrc} alt="Preview" className="h-full w-full rounded-full object-cover" />
        //             ) : (
        //                 /* Default placeholder image */
        //                 <Image
        //                     src="/medical.png" /* Replace with your placeholder image path */
        //                     alt="Placeholder"
        //                     className="h-12 w-12"
        //                 />
        //             )}

        //             {/* Hidden Input for File Upload */}
        //             <Input
        //                 {...field}
        //                 ref={fileInputRef}
        //                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        //                 type="file"
        //                 accept=".png, .jpg, .jpeg, .webp"
        //                 onChange={handleFileChange}
        //                 disabled={isPending}
        //             />
        //         </div>

        //         {/* Content on the right side */}
        //         <div className="flex items-center space-x-4">
        //             {/* Upload Logo Content */}
        //             <div className="flex flex-col space-y-2">
        //                 {/* File size hint */}
        //                 {error ? (
        //                     <p className="text-red-500 text-sm">{error}</p>
        //                 ) : (
        //                     <p className="text-sm text-gray-500">in PNG, JPEG max. 5MB</p>
        //                 )}

        //                 {/* Upload Button */}
        //                 <button
        //                     type="button"
        //                     onClick={() => fileInputRef.current?.click()}
        //                     className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700"
        //                 >
        //                     Upload Logo
        //                 </button>
        //             </div>

        //             {/* Delete Button */}
        //             {previewSrc && (
        //                 <button
        //                     type="button"
        //                     onClick={handleDelete} // Function to clear the image
        //                     className="flex items-center justify-center w-6 h-6 bg-white text-white rounded-full shadow hover:bg-red-700"
        //                 >
        //                     <Image
        //                         src="/delete.png" /* Replace with your delete icon path */
        //                         alt="Delete"
        //                         className="h-full w-full object-cover rounded-full"
        //                     />
        //                 </button>
        //             )}
        //         </div>
        //     </div>
        // </div>

        // new one
        <div className="flex flex-col w-full">
            <div
                className={`relative flex flex-col items-center justify-center h-64 border-2 border-[#b5cddb] rounded-lg cursor-pointer transition-all duration-300 ${
                    dragOver ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-[#bfc8e2]"
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
                            <Image
                                src={previewSrc}
                                alt="Preview"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-md"
                            />
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
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    type="button"
                    className="px-6 py-3 text-sm font-medium text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-700 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                    Upload Logo
                </button>
                <button
                    type="button"
                    className="px-6 py-3 text-sm font-medium text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-700 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                    Delete Logo
                </button>
            </div>
        </div>
    );
};

export default DragAndDrop;
