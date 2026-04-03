interface BadgeProps {
    variant: "critical" | "warning" | "info" | "success" | "neutral" | "purple";
    children: React.ReactNode;
    className?: string;
}

export function Badge({ variant, children, className = "" }: BadgeProps) {
    const styles = {
        critical: "bg-red-100 text-red-700",
        warning: "bg-yellow-100 text-yellow-700",
        info: "bg-blue-100 text-blue-700",
        success: "bg-green-100 text-green-700",
        neutral: "bg-gray-100 text-gray-700",
        purple: "bg-purple-100 text-purple-700",
    };

    return (
        <span className={`px-2 py-1 text-[10px] md:text-xs rounded-md font-medium uppercase tracking-wider ${styles[variant]} ${className}`}>
      {children}
    </span>
    );
}