// import React from "react";

const HeaderNav = ({ adminUsername, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/70 backdrop-blur-md border-b border-slate-800 px-6 py-4 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* APP LOGO / IDENTITY */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-black text-sm tracking-tighter">MM</span>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-slate-200 uppercase">KCLPIBRARY</h1>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Repository</p>
          </div>
        </div>

        {/* USER PROFILE / SESSION OUT */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-bold text-slate-300">{adminUsername || "Administrator"}</div>
            <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">ACTIVE</div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 bg-slate-800 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-900/50 rounded-xl transition-all"
            title="Sign Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
};

export default HeaderNav;