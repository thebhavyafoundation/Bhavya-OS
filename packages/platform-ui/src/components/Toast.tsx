"use client";

/**
 * @bhavya/platform-ui — Toast
 *
 * Toast notification component for feedback.
 */

import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: "bg-accent-green/10",
    border: "border-accent-green/30",
    text: "text-accent-green",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-accent-red/10",
    border: "border-accent-red/30",
    text: "text-accent-red",
  },
  info: {
    icon: Info,
    bg: "bg-accent-blue/10",
    border: "border-accent-blue/30",
    text: "text-accent-blue",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-accent-yellow/10",
    border: "border-accent-yellow/30",
    text: "text-accent-yellow",
  },
};

export function Toast({
  message,
  type = "info",
  onClose,
  duration = 5000,
}: ToastProps) {
  const [visible, setVisible] = useState(true);
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-toast
        flex items-center gap-3 px-4 py-3
        ${config.bg} border ${config.border}
        rounded-lg shadow-lg
        transition-all duration-200
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      <Icon size={16} className={config.text} />
      <span className="text-sm text-text-primary">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 200);
        }}
        className="text-text-tertiary hover:text-text-primary transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
