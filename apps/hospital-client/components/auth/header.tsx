import { cn } from "@/lib/utils";

interface HeaderProps {
    label: string;
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-2 justify-center">
            <h1 className={cn("text-4xl font-semibold")}>Login</h1>
            <p className="text-muted-foreground text-sm">{label}</p>
        </div>
    );
};
