// import React from "react";

export default function AbstractModal({ isOpen, file, onClose, onOpenPdf }) {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl max-w-2xl w-full h-[85vh] sm:h-[75vh] max-h-[650px] p-4 sm:p-8 shadow-2xl relative flex flex-col overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-600" />

        {/* Header Section */}
        <div className="shrink-0 mb-2 sm:mb-4 pr-6">
          <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
            {file.community_name || "General Collection"}
          </span>
          <h2 className="text-sm sm:text-lg font-black text-slate-100 uppercase tracking-tight mt-1.5 sm:mt-2 break-words line-clamp-2">
            {file.paper_title || file.filename}
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 sm:mt-1 font-mono truncate">
            By {file.paper_author || "Unknown Author"} (
            {file.paper_year || "N/A"})
          </p>
        </div>

        <div className="flex-1 overflow-y-auto my-2 sm:my-4 pr-1 sm:pr-2 space-y-4 text-slate-300 font-sans border-y border-slate-800/60 py-3 sm:py-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div>
            <h4 className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-slate-500 tracking-wider mb-1.5">
              Abstract
            </h4>
            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-300 whitespace-pre-line bg-slate-950/30 p-6 rounded-xl border border-slate-800/40 font-normal text-justify break-words">
              {file.abstract ||
                file.summary ||
                "No custom abstract summary has been submitted or mapped for this repository document yet. Use the action keys below to request a manual index update or stream the file binary directly."}
            </p>
          </div>

          <div>
            <h4 className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-slate-500 tracking-wider mb-1">
              Keywords/Tags
            </h4>
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5">
              {file.keywords ? (
                file.keywords.split(/[\s,]+/).map((tag, idx) => {
                  const cleanedTag = tag.trim().replace(/^#/, "");
                  if (!cleanedTag) return null;
                  return (
                    <span
                      key={idx}
                      className="text-[9px] sm:text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded"
                    >
                      #{cleanedTag}
                    </span>
                  );
                })
              ) : (
                <span className="text-[10px] font-mono text-slate-600 italic">
                  No keywords specified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-row items-center justify-end gap-2 pt-2 border-t border-transparent">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
          >
            Close
          </button>
          <button
            onClick={() => {
              onOpenPdf(file.filename);
              onClose();
            }}
            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest transition-all shadow-md shadow-blue-600/20 active:scale-[0.98] truncate"
          >
            Read Document
          </button>
        </div>
      </div>
    </div>
  );
}
