// import React from 'react';

const CitationModal = ({ isOpen, citation, onClose }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(citation);
    onClose(); // Close after copying
  };

  return (
    // Fixed modal layer: Handles content centering, scrolling on small screens via overflow-y-auto
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      {/* Container limits: Added max-h-[calc(100vh-2rem)] and secondary inner scroll to block device overflows */}
      <div className="bg-slate-900 border border-blue-500/30 w-full max-w-lg rounded-3xl shadow-2xl p-5 sm:p-8 my-auto max-h-[calc(100vh-2rem)] flex flex-col overflow-y-auto scrollbar-none animate-in fade-in zoom-in duration-200">
        
        {/* HEADER PANEL */}
        <div className="flex justify-between items-start mb-5 sm:mb-6 shrink-0">
          <div>
            <h3 className="text-blue-400 font-mono text-[10px] sm:text-xs uppercase tracking-widest">Citation Format</h3>
            <h2 className="text-white font-black text-lg sm:text-xl uppercase italic">APA 7th Edition</h2>
          </div>
          {/* Expanded button padding slightly for easier finger tapping */}
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-xl p-1"
            title="Close Panel"
          >
            ✕
          </button>
        </div>

        {/* CITATION CORE DISPLAY TEXT AREA */}
        {/* break-words handles wrapping, select-all makes mobile tapping instantly highlight the entire block */}
        <div className="bg-slate-800 border border-slate-700 p-4 sm:p-6 rounded-2xl mb-5 sm:mb-6 overflow-y-auto max-h-[220px] sm:max-h-none">
          <p className="text-slate-300 font-medium text-xs sm:text-sm leading-relaxed italic select-all break-words">
            {citation}
          </p>
        </div>

        {/* ACTIONS FOOTER INTERFACE */}
        {/* Flex direction changes dynamically: Rows on desktop, vertical stacking on mobile (flex-col sm:flex-row) */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full shrink-0">
          <button
            onClick={handleCopy}
            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl transition-all uppercase text-[10px] sm:text-xs tracking-widest shadow-lg shadow-blue-600/20 text-center"
          >
            Copy to Clipboard
          </button>
          {/* <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3.5 sm:py-0 rounded-xl sm:rounded-2xl transition-all uppercase text-[10px] sm:text-xs tracking-widest text-center"
          >
            Close
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default CitationModal;