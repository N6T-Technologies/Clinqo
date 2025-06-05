"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Loader2, Upload, X, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateClinicLogo } from "@/actions/update-clinic-logo";
import Image from "next/image";

interface LogoManagerProps {
    clinicId: string;
    clinicName: string;
    currentLogo?: string;
    canEdit?: boolean;
    onLogoUpdate?: (newLogoUrl: string) => void;
}

const LogoManager: React.FC<LogoManagerProps> = ({
    clinicId,
    clinicName,
    currentLogo,
    canEdit = true,
    onLogoUpdate
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [logo, setLogo] = useState(currentLogo || "");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError("Please select a valid image file (PNG, JPEG, WEBP)");
            return;
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError("File size must be less than 5MB");
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            // Upload to Cloudinary
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

            // Update clinic logo in database
            const updateResult = await updateClinicLogo(clinicId, result.url);

            if (!updateResult.ok) {
                throw new Error(updateResult.error || 'Failed to update logo');
            }

            setLogo(result.url);
            setPreviewUrl(result.url);
            setIsEditing(false);

            toast({
                title: "Success",
                description: "Logo updated successfully",
                variant: "default",
            });

            // Notify parent component
            if (onLogoUpdate) {
                onLogoUpdate(result.url);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setError(null);
        setPreviewUrl(null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setError(null);
        setPreviewUrl(null);
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Clinic Logo</span>
                    {canEdit && !isEditing && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditClick}
                            className="flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                    )}
                </CardTitle>
                <CardDescription>
                    {clinicName} clinic logo
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Logo Display */}
                <div className="flex justify-center">
                    <div className="relative">
                        {logo || previewUrl ? (
                            <Image
                                src={previewUrl || logo}
                                alt={`${clinicName} Logo`}
                                width={120}
                                height={120}
                                className="rounded-full object-cover border-2 border-gray-200"
                            />
                        ) : (
                            <div className="w-30 h-30 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                                <span className="text-gray-500 text-sm">No Logo</span>
                            </div>
                        )}
                        
                        {isUploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload Interface */}
                {isEditing && canEdit && (
                    <div className="space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                            <Input
                                type="file"
                                accept=".png,.jpg,.jpeg,.webp"
                                onChange={handleFileSelect}
                                disabled={isUploading}
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            
                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}
                            
                            <p className="text-gray-500 text-xs text-center">
                                PNG, JPEG, WEBP format. Max size 5MB.
                            </p>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                disabled={isUploading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Current Logo Info */}
                {!isEditing && logo && (
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Logo uploaded and active
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LogoManager;
