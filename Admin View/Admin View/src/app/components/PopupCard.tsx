import { type ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTheme } from "../context/ThemeContext.tsx";

interface PopupCardProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  badge?: ReactNode;
  footer?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function PopupCard({
  children,
  open,
  onClose,
  title,
  description,
  badge,
  footer,
  maxWidth = "md",
  className = "",
}: PopupCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const cardStyles = isDark
    ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)]"
    : "bg-white border-gray-200";

  const dividerStyles = isDark ? "border-[rgba(255,255,255,0.1)]" : "border-gray-200";
  const closeBtnStyles = isDark
    ? "hover:bg-[rgba(255,255,255,0.08)] text-white/40 hover:text-white/70"
    : "hover:bg-gray-100 text-gray-400 hover:text-gray-600";
  const titleStyles = isDark ? "text-white" : "text-gray-900";
  const descStyles = isDark ? "text-white/40" : "text-gray-400";

  const hasHeader = title || badge;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "popup-card-title" : undefined}
    >
    <div className="bg-[#212121] rounded-lg">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidthMap[maxWidth]} rounded-xl border transition-colors shadow-2xl ${cardStyles} ${className}`}
      >
        <div className="p-6 space-y-5">

          {/* Header — only renders if title or badge is provided */}
          {hasHeader && (
            <div className={`flex items-start justify-between gap-3 pb-4 border-b ${dividerStyles}`}>
              <div className="min-w-0">
                {title && (
                  <h2
                    id="popup-card-title"
                    className={`text-xl font-bold truncate ${titleStyles}`}
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className={`text-sm mt-0.5 ${descStyles}`}>{description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {badge}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className={`p-1.5 rounded-lg transition-colors ${closeBtnStyles}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* If no header, show a floating close button in the top-right of the card */}
          {!hasHeader && (
            <div className="flex justify-end -mt-1 -mr-1">
              <button
                onClick={onClose}
                aria-label="Close"
                className={`p-1.5 rounded-lg transition-colors ${closeBtnStyles}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Body */}
          <div>{children}</div>

          {/* Footer */}
          {footer !== undefined && (
            <div className={`pt-4 border-t ${dividerStyles}`}>{footer}</div>
          )}

        </div>
      </div>
      </div>
    </div>
  );
}