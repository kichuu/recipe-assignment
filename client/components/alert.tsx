"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface AlertProps {
  title: string;
  message: string;
  type: "success" | "error" | "info";
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function Alert({
  title,
  message,
  type = "info",
  onClose,
  autoClose = true,
  duration = 2000,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`
      fixed bottom-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg
      ${type === "success" ? "bg-green-50 border border-green-200" : ""}
      ${type === "error" ? "bg-red-50 border border-red-200" : ""}
      ${type === "info" ? "bg-blue-50 border border-blue-200" : ""}
    `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === "success" && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
          {type === "info" && <AlertCircle className="h-5 w-5 text-blue-500" />}
        </div>
        <div className="ml-3">
          <h3
            className={`text-sm font-medium 
            ${type === "success" ? "text-green-800" : ""}
            ${type === "error" ? "text-red-800" : ""}
            ${type === "info" ? "text-blue-800" : ""}
          `}
          >
            {title}
          </h3>
          <div
            className={`mt-1 text-sm 
            ${type === "success" ? "text-green-700" : ""}
            ${type === "error" ? "text-red-700" : ""}
            ${type === "info" ? "text-blue-700" : ""}
          `}
          >
            {message}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={() => {
                setIsVisible(false);
                if (onClose) onClose();
              }}
              className={`inline-flex rounded-md p-1.5
                ${
                  type === "success"
                    ? "bg-green-50 text-green-500 hover:bg-green-100"
                    : ""
                }
                ${
                  type === "error"
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : ""
                }
                ${
                  type === "info"
                    ? "bg-blue-50 text-blue-500 hover:bg-blue-100"
                    : ""
                }
              `}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
