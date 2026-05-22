// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

const StatsBar = ({ stats }) => {
  const [activeTab, setActiveTab] = useState("daily");

  const totalUsers = stats.nodes || 0;
  
  const activeCount = 
    activeTab === "daily" ? stats.dailyUsers || 0 :
    activeTab === "weekly" ? stats.weeklyUsers || 0 :
    activeTab === "monthly" ? stats.monthlyUsers || 0 :
    stats.yearlyUsers || 0;

  const activePercentage = totalUsers > 0 ? Math.min(Math.round((activeCount / totalUsers) * 100), 100) : 0;
  const inactivePercentage = 100 - activePercentage;
  const strokeDasharray = `${activePercentage} ${inactivePercentage}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
      
      {/* LEFT SIDE: CORE STAT CARDS (3/5 Width) */}
      <div className="lg:col-span-3 flex flex-col gap-4 justify-between">
        
        {/* Node Stat */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-sm group hover:border-blue-500/40 transition-all flex justify-between items-center h-full">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total numbers of users</p>
            <span className="text-3xl font-black text-white block mt-1">{totalUsers}</span>
          </div>
          <span className="text-xl bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">👥</span>
        </div>

        {/* Archive Stat */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-sm group hover:border-blue-500/40 transition-all flex justify-between items-center h-full">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Collections</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{stats.archives || 0}</span>
              <span className="text-xs text-blue-400 font-mono uppercase tracking-wider">Collections</span>
            </div>
          </div>
          <span className="text-xl bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">📁</span>
        </div>

        {/* Sector Stat */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-sm group hover:border-blue-500/40 transition-all flex justify-between items-center h-full">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Communities</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{stats.sectors || 0}</span>
              <span className="text-xs text-indigo-400 font-mono uppercase tracking-wider">Zones</span>
            </div>
          </div>
          <span className="text-xl bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">🌐</span>
        </div>
      </div>

      {/* RIGHT SIDE: RESTYLED RETENTION ENGINE (2/5 Width) */}
      <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700 p-6 rounded-3xl backdrop-blur-sm flex flex-col justify-between gap-5">
        
        {/* Module Header & Tab Controls */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">SYSTEM UTILIZATION</h4>
            <span className="text-xs font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-lg uppercase font-bold tracking-wider">
              {activeTab} Index
            </span>
          </div>

          {/* Clean Horizontal Navigation Tab Bar - RESTORED FULL STRING LENGTHS */}
          <div className="grid grid-cols-4 bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/50 gap-1">
            {["daily", "weekly", "monthly", "yearly"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Graph Section & Metrics Overlay */}
        <div className="grid grid-cols-2 gap-4 items-center bg-slate-900/30 border border-slate-700/30 p-5 rounded-2xl h-full">
          
          {/* Dynamic SVG Ring */}
          <div className="relative w-28 h-28 mx-auto">
            <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="15.91549430918954"
                fill="transparent"
                className="stroke-slate-800"
                strokeWidth="3.5"
              />
              <circle
                cx="16"
                cy="16"
                r="15.91549430918954"
                fill="transparent"
                className="stroke-blue-500 transition-all duration-500 ease-in-out"
                strokeWidth="3.5"
                strokeDasharray={strokeDasharray}
                strokeDashoffset="0"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-white tracking-tight">{activePercentage}%</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">Ratio</span>
            </div>
          </div>

          {/* Detailed Readout & Labels */}
          <div className="flex flex-col gap-3 justify-center pl-2">
            <div>
              <span className="text-3xl font-black text-white tracking-tight">{activeCount}</span>
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider ml-2">Active</span>
            </div>
            
            <div className="flex flex-col gap-1.5 font-mono text-[10px] border-t border-slate-800 pt-3">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-sm"></span>
                <span>ENGAGED ({activeCount})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <span className="w-2 h-2 bg-slate-800 rounded-sm"></span>
                <span>IDLE ({totalUsers - activeCount})</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StatsBar;