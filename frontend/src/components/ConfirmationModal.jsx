// import React from "react";

const ConfirmationModal = ({ isOpen, title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel, isDestructive = false }) => {
  if (!isOpen) return null;

  // Change theme colors based on whether this action is dangerous/destructive
  const accentColors = isDestructive
    ? {
        border: "border-rose-500/30 shadow-rose-500/10",
        badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        btnConfirm: "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20 focus:ring-rose-500",
      }
    : {
        border: "border-sky-500/30 shadow-sky-500/10",
        badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        btnConfirm: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/20 focus:ring-sky-500",
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      
      {/* 1. Backdrop Blur Overlay Layer */}
      <div 
        onClick={onCancel}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
      />

      {/* 2. Core Dialog Card Container */}
      <div className={`relative max-w-md w-full bg-slate-900/90 border ${accentColors.border} p-6 rounded-2xl shadow-2xl flex flex-col gap-4 text-left animate-in zoom-in-95 slide-in-from-bottom-4 duration-300`}>
        
        {/* Header Header Row */}
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded border ${accentColors.badge}`}>
            {isDestructive ? "CRITICAL OVERRIDE" : "SYSTEM VERIFICATION"}
          </span>
        </div>

        {/* Messaging Block */}
        <div>
          <h3 className="text-sm font-mono font-bold text-slate-100 leading-snug">
            {title}
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-2 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions Button Footprint Bar */}
        <div className="flex items-center justify-end gap-3 font-mono text-xs mt-2 pt-2 border-t border-slate-800/60">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700/80 text-slate-300 rounded-xl transition-all hover:text-slate-100 border border-slate-700/50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-xl font-bold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${accentColors.btnConfirm}`}
          >
            {confirmText}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ConfirmationModal;