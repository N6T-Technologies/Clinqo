import QRCodeGenerator from "@/components/ui/qr-code-generator";

export default async function GenerateQRCode({ params }: { params: Promise<{ clinicId_clinicName_mail: string }> }) {
    const data = (await params).clinicId_clinicName_mail;
    const clinicId = data.split("_")[0];
    const clinicName = data.split("_")[1];
    const mail = data.split("_")[2];

    const getEmail = (mail: string | undefined) => {
        if (!mail) {
            return "";
        }
        const prefix = mail.split("%")[0];
        const domain = mail.split("40")[1];

        return `${prefix}@${domain}`;
    };

    const email = getEmail(mail);

    if (!clinicId || !clinicName || !email) {
        return <div>Something went wrong</div>;
    }

    return (
        <div className="h-full w-full">
            <QRCodeGenerator clinicId={clinicId} clinicName={clinicName} email={email} />
        </div>
    );
}
