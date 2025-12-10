"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    // Check if mobile on mount and window resize
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  // Different animations for mobile vs desktop
  const modalVariants = {
    initial: isMobile
      ? { opacity: 0, y: "100%" }
      : { opacity: 0, scale: 0.95, y: 20 },
    animate: isMobile
      ? { opacity: 1, y: 0 }
      : { opacity: 1, scale: 1, y: 0 },
    exit: isMobile
      ? { opacity: 0, y: "100%" }
      : { opacity: 0, scale: 0.95, y: 20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden sm:overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop fixed inset-0"
            onClick={onClose}
          />
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "relative bg-white dark:bg-gray-900 shadow-xl z-10 w-full",
              // Mobile: bottom sheet with safe area for browser UI, use dvh for dynamic viewport
              "rounded-t-2xl max-h-[80dvh] overflow-y-auto",
              // Desktop: centered with full rounding and margin
              "sm:rounded-xl sm:max-h-[85vh] sm:my-8",
              {
                "sm:max-w-sm": size === "sm",
                "sm:max-w-md": size === "md",
                "sm:max-w-lg": size === "lg",
                "sm:max-w-2xl": size === "xl",
              }
            )}
          >
            {/* Mobile drag handle indicator */}
            <div className="sm:hidden w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-2 mb-1" />

            <div className="sticky top-0 flex items-center justify-between px-3 py-2 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-3 sm:p-4 pb-6 sm:pb-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
