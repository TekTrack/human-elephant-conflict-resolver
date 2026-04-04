import type { ReactNode } from "react";
import { useTheme } from "../context/ThemeContext.tsx";

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold">{title}</h1>
                {description && (
                    <p className={`text-sm mt-1 ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}`}>
                        {description}
                    </p>
                )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}