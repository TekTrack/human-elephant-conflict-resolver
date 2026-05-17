import type {ReactNode} from "react";
import { useTheme } from "../context/ThemeContext.tsx";

interface CardProps {
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
    hoverable?: boolean;
    style?: React.CSSProperties;
}

export function Card({ children, className = "", noPadding = false, hoverable = false }: CardProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const baseStyles = `rounded-xl border transition-colors ${
        isDark
            ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)]"
            : "bg-white border-gray-200"
    }`;

    const hoverStyles = hoverable
        ? (isDark ? "hover:bg-[rgba(255,255,255,0.05)]" : "hover:bg-gray-50 cursor-pointer")
        : "";

    return (
        <div className={`${baseStyles} ${hoverStyles} ${noPadding ? "" : "p-4"} ${className}`}>
            {children}
        </div>
    );
}