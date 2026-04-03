import type { ReactNode } from "react";
import { useTheme } from "../context/ThemeContext.tsx";
import { Card } from "./Card";

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: ReactNode;
    iconBgClass?: string;
    valueColorClass?: string;
    customBgColor?: string;
}

export function StatCard({ label, value, icon, iconBgClass, valueColorClass = "", customBgColor }: StatCardProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const content = (
        <div className="flex items-center gap-3">
            {icon && (
                <div className={`p-2 rounded-lg ${iconBgClass}`}>
                    {icon}
                </div>
            )}
            <div className="space-y-1">
                <p className={`text-sm ${isDark && !customBgColor ? "text-[rgba(255,255,255,0.6)]" : "text-gray-700"}`}>
                    {label}
                </p>
                <p className={`text-xl md:text-2xl font-semibold ${valueColorClass || (isDark && !customBgColor ? "text-white" : "text-black")}`}>
                    {value}
                </p>
            </div>
        </div>
    );

    if (customBgColor) {
        return (
            <div className="rounded-[20px] p-6" style={{ backgroundColor: customBgColor }}>
                {content}
            </div>
        );
    }

    return <Card>{content}</Card>;
}