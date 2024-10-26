import { ResetForm } from "@/components/auth/reset-form";

export default function ResetPage() {
    return (
        <div className="h-full grid grid-cols-12">
            <div className="flex items-center justify-center col-span-5 bg-[linear-gradient(to_top_right,_var(--tw-gradient-stops))] from-[#3297F5] to-[#292E91]">
                <div className="border border-black rounded-full text-white bg-black h-[100px] w-[100px] mr-2 flex justify-center items-center">
                    logo
                </div>
                <div>
                    <div className="text-4xl text-white">Welcome!</div>
                    <div className="text-sm text-white">It's Clinqo! Power to every medico</div>
                </div>
            </div>
            <div className="flex items-center justify-center col-span-7">
                <ResetForm />
            </div>
        </div>
    );
}
