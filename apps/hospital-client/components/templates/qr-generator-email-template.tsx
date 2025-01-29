import React from "react";

export interface QREmailTemplateProps {
    clinicName: string;
    clinicId: string;
    demoUrl: string;
    qrCodeImage: string;
}

export const QREmailTemplate: React.FC<QREmailTemplateProps> = ({
    clinicName,
    clinicId,
    demoUrl,
    qrCodeImage,
}) => {
    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#ffffff'
        }}>
            <h1 style={{ 
                color: '#2182D9',
                fontSize: '24px',
                marginBottom: '20px'
            }}>
                Welcome to {clinicName}!
            </h1>
            <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
                Here is your QR code to book an appointment:
            </p>
            <p style={{ 
                fontSize: '14px',
                color: '#666666',
                marginBottom: '10px'
            }}>
                Clinic ID: {clinicId}
            </p>
            <p style={{ 
                fontSize: '14px',
                color: '#666666',
                marginBottom: '20px'
            }}>
                URL: <a href={demoUrl} style={{ color: '#2182D9' }}>{demoUrl}</a>
            </p>
            <div style={{
                backgroundColor: '#f5f5f5',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center' as const
            }}>
                <img 
                    src={qrCodeImage} 
                    alt="QR Code"
                    style={{
                        width: "256px",
                        height: "256px",
                        display: "block",
                        margin: "0 auto"
                    }}
                />
            
            </div>
        </div>
    );
};