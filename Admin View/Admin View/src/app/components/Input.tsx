import type { InputHTMLAttributes } from "react";
import { useTheme } from "../context/ThemeContext";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="w-full">
            {label && (
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>
                    {label}
                </label>
            )}
            <input
                className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors ${
                    isDark
                        ? "bg-[#2a2a2a] border-[rgba(255,255,255,0.1)] text-white focus:border-blue-500 placeholder-[rgba(255,255,255,0.3)]"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 placeholder-gray-400"
                } ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}