// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";

const ToastNotification = ({ message, type = "success", onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isError = type === "error";
  
  // Custom theme mappings for neon accents
  const colors = isError 
    ? {
        border: "border-rose-500/20",
        glow: "shadow-rose-500/10",
        bar: "bg-rose-500",
        text: "text-rose-400",
        bg: "bg-rose-950/20 text-rose-400 border-rose-500/30"
      }
    : {
        border: "border-emerald-500/20",
        glow: "shadow-emerald-500/10",
        bar: "bg-emerald-500",
        text: "text-emerald-400",
        bg: "bg-emerald-950/20 text-emerald-400 border-emerald-500/30"
      };

  return (
    <div className={`fixed top-6 right-6 z-50 max-w-sm w-full bg-slate-900/70 backdrop-blur-xl border ${colors.border} rounded-xl shadow-2xl ${colors.glow} flex items-stretch gap-4 overflow-hidden animate-in slide-in-from-right-8 fade-in-0 duration-300 select-none`}>
      
      {/* Cool Feature: Vertical Accent Status Tracker Bar */}
      <div className={`w-1.5 ${colors.bar} shrink-0`} />
      
      {/* Main Panel Content */}
      <div className="flex-1 py-4 pr-1">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${colors.bg}`}>
            {isError ? "System Alert" : "Success"}
          </span>
        </div>
        <p className="text-xs font-mono text-slate-200 mt-2.5 pr-4 leading-relaxed font-medium">
          {message}
        </p>
      </div>

      {/* Dismiss Axis */}
      <button 
        onClick={onClose}
        className="text-slate-500 hover:text-slate-300 text-xs font-mono px-4 border-l border-slate-800/60 hover:bg-slate-800/20 transition-all shrink-0 flex items-center justify-center"
      >
        ✕
      </button>
    </div>
  );
};

export default ToastNotification;