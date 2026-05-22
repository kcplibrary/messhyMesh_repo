// import React from 'react';

const CitationModal = ({ isOpen, citation, onClose }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(citation);
    onClose(); // Close after copying
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-blue-500/30 w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-blue-400 font-mono text-xs uppercase tracking-widest">Citation Format</h3>
            <h2 className="text-white font-black text-xl uppercase italic">APA 7th Edition</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl mb-6">
          <p className="text-slate-300 font-medium leading-relaxed italic select-all break-words">
            {citation}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all uppercase text-xs tracking-widest shadow-lg shadow-blue-600/20"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={onClose}
            className="px-6 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-2xl transition-all uppercase text-xs tracking-widest"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitationModal;