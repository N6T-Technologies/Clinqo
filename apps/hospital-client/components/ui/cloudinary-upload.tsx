"use client";

import React, { useState, DragEvent, useRef, useCallback } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Upload, X, Loader2 } from "lucide-react";

interface CloudinaryUploadProps {
    field: any;
    isPending?: boolean;
    onUploadComplete?: (url: string) => void;
    onUploadError?: (error: string) => void;
}

const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];
const maxFileSize = 5 * 1024 * 1024; // 5MB

const isValidFileType = (fileName: string) => 
    allowedExtensions.includes(`.${fileName.split(".").pop()?.toLowerCase()}`);

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ 
    field, 
    isPending, 
    onUploadComplete,
    onUploadError 
}) => {
    const [dragOver, setDragOver] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const uploadToCloudinary = useCallback(async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }

            // Update the form field with the Cloudinary URL
            field.onChange(result.url);
            
            if (onUploadComplete) {
                onUploadComplete(result.url);
            }

            setPreviewSrc(result.url);
            setFileName(file.name);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';
            setError(errorMessage);
            
            if (onUploadError) {
                onUploadError(errorMessage);
            }
            
            setPreviewSrc(null);
            setFileName(null);
        } finally {
            setIsUploading(false);
        }
    }, [field, onUploadComplete, onUploadError]);

    const validateAndUpload = useCallback((file: File) => {
        if (!isValidFileType(file.name)) {
            setError("Invalid file type. Please upload PNG, JPG, JPEG, or WEBP files.");
            return;
        }

        if (file.size > maxFileSize) {
            setError("File too large. Maximum size is 5MB.");
            return;
        }

        uploadToCloudinary(file);
    }, [uploadToCloudinary]);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer?.files?.[0];
        if (file) {
            validateAndUpload(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target?.files?.[0];
        if (file) {
            validateAndUpload(file);
        }
    };

    const handleDelete = () => {
        setPreviewSrc(null);
        setFileName(null);
        setError(null);
        field.onChange("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-start space-y-4">
            <p className="text-lg font-medium text-gray-700">Add Clinic Logo</p>

            <div className="flex items-center space-x-4">
                {/* Circle with image or placeholder */}
                <div
                    className={`relative flex items-center justify-center h-24 w-24 border-2 border-dashed rounded-full transition-all duration-300 ${
                        dragOver 
                            ? "border-blue-600 bg-blue-50" 
                            : "border-gray-300 bg-gray-50"
                    }`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    ) : previewSrc ? (
                        <img
                            src={previewSrc}
                            alt="Logo Preview"
                            className="h-full w-full rounded-full object-cover"
                        />
                    ) : (
                        <img
                            src="/medical.png"
                            alt="Placeholder"
                            className="h-12 w-12 opacity-50"
                        />
                    )}

                    {/* Hidden Input for File Upload */}
                    <Input
                        ref={fileInputRef}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp"
                        onChange={handleFileChange}
                        disabled={isPending || isUploading}
                    />
                </div>

                {/* Content on the right side */}
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-2">
                        {error ? (
                            <p className="text-red-500 text-sm">{error}</p>
                        ) : fileName ? (
                            <p className="text-green-600 text-sm">✓ {fileName}</p>
                        ) : (
                            <p className="text-sm text-gray-500">PNG, JPEG, WEBP max. 5MB</p>
                        )}

                        <Button
                            type="button"
                            onClick={handleUploadClick}
                            disabled={isPending || isUploading}
                            className="flex items-center space-x-2"
                            variant="outline"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    <span>Upload Logo</span>
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Delete Button */}
                    {previewSrc && !isUploading && (
                        <Button
                            type="button"
                            onClick={handleDelete}
                            size="sm"
                            variant="destructive"
                            className="p-1 h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CloudinaryUpload;
