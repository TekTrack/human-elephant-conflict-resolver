import type { ReactNode, ButtonHTMLAttributes } from "react";
import { useTheme } from "../context/ThemeContext.tsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    children: ReactNode;
}

export function Button({ variant = "secondary", children, className = "", ...props }: ButtonProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const baseStyles = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors font-medium";

    const variants = {
        primary: isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white",
        secondary: isDark ? "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white" : "bg-gray-200 hover:bg-gray-300 text-black",
        danger: "bg-red-500 hover:bg-red-600 text-white",
        ghost: isDark ? "hover:bg-[rgba(255,255,255,0.1)] text-white" : "hover:bg-gray-200 text-black",
        dangerIcon: isDark ? "hover:bg-[rgba(255,255,255,0.1)] text-red-500" : "hover:bg-gray-200 text-red-500",
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}