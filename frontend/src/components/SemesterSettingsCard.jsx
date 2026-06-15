// import React from "react";

function SemesterSettingsCard({
  showSettings,
  setShowSettings,
  semLabel,
  setSemLabel,
  semStart,
  setSemStart,
  semEnd,
  setSemEnd,
  settingsLoading,
  handleUpdateSemester,
}) {
  return (
    <>
      {/* Dashboard control element */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={`w-full p-6 sm:p-8 rounded-3xl border text-left flex flex-col justify-between items-start group transition-all duration-300 relative overflow-hidden active:scale-[0.98] ${
          showSettings
            ? "bg-slate-800/90 border-indigo-500 shadow-lg shadow-indigo-950/20 text-indigo-400"
            : "bg-slate-800/40 border-slate-700/60 text-slate-200 hover:border-slate-600 hover:bg-slate-800/70"
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-[3px] transition-all ${
            showSettings
              ? "bg-indigo-500"
              : "bg-transparent group-hover:bg-slate-500"
          }`}
        />

        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex justify-between items-center w-full">
            <span
              className={`text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-all ${
                showSettings
                  ? "text-indigo-400"
                  : "text-slate-500 group-hover:text-slate-400"
              }`}
            >
              TERM CONFIGURATION
            </span>
            <span
              className={`text-lg sm:text-xl transition-transform duration-300 ${
                showSettings ? "rotate-45" : "group-hover:translate-x-1"
              }`}
            >
              {showSettings ? "✖" : "📅"}
            </span>
          </div>
          <span className="font-black text-lg sm:text-xl tracking-tight uppercase">
            {showSettings ? "Close Control" : "Manage Semester"}
          </span>
          <p className="text-xs text-slate-400 font-normal mt-2 leading-relaxed max-w-full sm:max-w-[240px]">
            Adjust active institutional semester boundaries, update tracking
            labels, and sync calendar timelines.
          </p>
        </div>

        <div
          className={`mt-6 px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest border transition-all ${
            showSettings
              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 animate-pulse"
              : "bg-slate-800 border-slate-700 text-slate-400 group-hover:text-slate-200 group-hover:border-slate-500"
          }`}
        >
          {showSettings ? "• CONFIG PANEL ACTIVE" : "CLICK TO CONFIGURE TERM"}
        </div>
      </button>

      {/* Dynamic input configuration panel window */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
          <form
            onSubmit={handleUpdateSemester}
            className="bg-slate-800 border border-slate-700 p-5 sm:p-6 rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl flex flex-col gap-4 relative my-auto max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin"
          >
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
              title="Close Panel"
            >
              ✖
            </button>

            <div>
              <h3 className="text-base sm:text-lg font-black uppercase text-slate-100 tracking-tight">
                System Term Configuration
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Modify active bounds to align document upload metrics.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:gap-3">
              <label className="flex flex-col gap-1 text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-0.5">
                Semester Label
                <input
                  type="text"
                  placeholder="e.g., 1st Semester 2025-2026"
                  value={semLabel}
                  onChange={(e) => setSemLabel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 p-2.5 sm:p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-indigo-500 transition-all placeholder:text-slate-600 h-[42px]"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <label className="flex flex-col gap-1 text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-0.5">
                  Start Date
                  <input
                    type="date"
                    value={semStart}
                    onChange={(e) => setSemStart(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 p-2.5 sm:p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-indigo-500 transition-all min-h-[42px] appearance-none"
                  />
                </label>

                <label className="flex flex-col gap-1 text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-0.5">
                  End Date
                  <input
                    type="date"
                    value={semEnd}
                    onChange={(e) => setSemEnd(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 p-2.5 sm:p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-indigo-500 transition-all min-h-[42px] appearance-none"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={settingsLoading}
              className="mt-2 w-full p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-indigo-400 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] h-[44px] shrink-0"
            >
              {settingsLoading
                ? "Syncing to Database..."
                : "Save System Bounds"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default SemesterSettingsCard;
