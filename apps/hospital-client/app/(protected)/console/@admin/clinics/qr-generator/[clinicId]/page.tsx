import QRCodeGenerator from "@/components/ui/qr-code-generator";

export default async function GenerateQRCode({ params }: { params: Promise<{ clinicId: string }> }) {
    const clinicId = (await params).clinicId;

    return (
        <div className="h-full w-full">
            <QRCodeGenerator clinicId={clinicId} />
        </div>
    );
}
