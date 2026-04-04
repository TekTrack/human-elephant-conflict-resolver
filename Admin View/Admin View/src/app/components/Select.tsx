import type { SelectHTMLAttributes } from "react";
import { useTheme } from "../context/ThemeContext";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

export function Select({ label, children, className = "", ...props }: SelectProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="w-full">
            {label && (
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>
                    {label}
                </label>
            )}
            <select
                className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors ${
                    isDark
                        ? "bg-[#2a2a2a] border-[rgba(255,255,255,0.1)] text-white focus:border-blue-500"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500"
                } ${className}`}
                {...props}
            >
                {children}
            </select>
        </div>
    );
}