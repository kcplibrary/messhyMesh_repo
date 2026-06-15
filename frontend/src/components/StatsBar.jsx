// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

const StatsBar = ({ stats, onFilterChange }) => {
  const [activeTab, setActiveTab] = useState("daily");

  const today = new Date();
  const currentRealDay = today.getDate();
  const currentRealMonth = String(today.getMonth() + 1).padStart(2, "0");
  const currentRealYear = today.getFullYear();

  const [selectedDay, setSelectedDay] = useState(currentRealDay);
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [selectedMonth, setSelectedMonth] = useState(currentRealMonth);
  const [selectedYear, setSelectedYear] = useState(String(currentRealYear));

  const monthsList = [
    { value: "01", name: "January" },
    { value: "02", name: "February" },
    { value: "03", name: "March" },
    { value: "04", name: "April" },
    { value: "05", name: "May" },
    { value: "06", name: "June" },
    { value: "07", name: "July" },
    { value: "08", name: "August" },
    { value: "09", name: "September" },
    { value: "10", name: "October" },
    { value: "11", name: "November" },
    { value: "12", name: "December" },
  ];

  const yearsList = Array.from({ length: 6 }, (_, i) =>
    String(currentRealYear - 2 + i),
  );
  const weeksInMonthList = [
    "Week 1",
    "Week 2",
    "Week 3",
    "Week 4",
    "Week 5",
    "Week 6",
  ];

  const getDaysInMonth = (monthStr, yearStr) => {
    return new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 0).getDate();
  };

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        timeframe: activeTab,
        day: selectedDay,
        week: selectedWeek,
        month: selectedMonth,
        year: selectedYear,
      });
    }
  }, [
    activeTab,
    selectedDay,
    selectedWeek,
    selectedMonth,
    selectedYear,
    onFilterChange,
  ]);

  const totalUsers = stats.nodes || 0;

  // Explicitly check for null/undefined so that a mathematical 0 is treated as valid.
  const activeCount =
    stats.activeFilteredCount !== null &&
    stats.activeFilteredCount !== undefined
      ? parseInt(stats.activeFilteredCount, 10)
      : activeTab === "daily"
        ? stats.dailyUsers || 0
        : activeTab === "weekly"
          ? stats.weeklyUsers || 0
          : activeTab === "monthly"
            ? stats.monthlyUsers || 0
            : stats.yearlyUsers || 0;

  const activePercentage =
    totalUsers > 0
      ? Math.min(Math.round((activeCount / totalUsers) * 100), 100)
      : 0;
  const inactivePercentage = 100 - activePercentage;
  const strokeDasharray = `${activePercentage} ${inactivePercentage}`;

  const inlineSelect =
    "bg-slate-900/80 border border-slate-700 text-blue-400 font-bold px-1.5 py-0.5 rounded mx-1 text-[11px] focus:outline-none cursor-pointer tracking-normal normal-case inline-block align-middle focus:border-blue-500/50 transition-colors";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
      {/* Left side: core stats */}
      <div className="lg:col-span-3 flex flex-col gap-4 justify-between">
        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-sm group hover:border-blue-500/40 transition-all flex justify-between items-center h-full">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Total numbers of users
            </p>
            <span className="text-3xl font-black text-white block mt-1">
              {totalUsers}
            </span>
          </div>
          <span className="text-xl bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
            👥
          </span>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-sm group hover:border-blue-500/40 transition-all flex justify-between items-center h-full">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Total Collections
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">
                {stats.archives || 0}
              </span>
              <span className="text-xs text-blue-400 font-mono uppercase tracking-wider">
                Collections
              </span>
            </div>
          </div>
          <span className="text-xl bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
            📁
          </span>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-sm group hover:border-blue-500/40 transition-all flex justify-between items-center h-full">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Total Communities
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">
                {stats.sectors || 0}
              </span>
              <span className="text-xs text-indigo-400 font-mono uppercase tracking-wider">
                Zones
              </span>
            </div>
          </div>
          <span className="text-xl bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
            🌐
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: SYSTEM UTILIZATION CONTROLS */}
      <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700 p-6 rounded-3xl backdrop-blur-sm flex flex-col justify-between gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">
              SYSTEM UTILIZATION
            </h4>
            <span className="text-xs font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-lg uppercase font-bold tracking-wider">
              {activeTab} Index
            </span>
          </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-900/30 border border-slate-700/30 p-5 rounded-2xl h-full">
          {/* Circular graph ring */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto shrink-0">
            <svg
              viewBox="0 0 32 32"
              className="w-full h-full transform -rotate-90"
            >
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
              <span className="text-xl font-black text-white tracking-tight">
                {activePercentage}%
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                Ratio
              </span>
            </div>
          </div>

          {/* Details readout text */}
          <div className="flex flex-col gap-3 justify-center pl-0 sm:pl-2 w-full">
            <div>
              <span className="text-3xl font-black text-white tracking-tight">
                {activeCount}
              </span>

              <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider mt-1 leading-relaxed block">
                <span>Active </span>

                {activeTab === "daily" && (
                  <>
                    <span>on Day</span>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(Number(e.target.value))}
                      className={inlineSelect}
                    >
                      {Array.from(
                        { length: getDaysInMonth(selectedMonth, selectedYear) },
                        (_, i) => i + 1,
                      ).map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <span>of</span>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className={inlineSelect}
                    >
                      {monthsList.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className={inlineSelect}
                    >
                      {yearsList.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {activeTab === "weekly" && (
                  <>
                    <span>during</span>
                    <select
                      value={selectedWeek}
                      onChange={(e) => setSelectedWeek(e.target.value)}
                      className={inlineSelect}
                    >
                      {weeksInMonthList.map((wk) => (
                        <option key={wk} value={wk}>
                          {wk}
                        </option>
                      ))}
                    </select>
                    <span>of</span>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className={inlineSelect}
                    >
                      {monthsList.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className={inlineSelect}
                    >
                      {yearsList.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {activeTab === "monthly" && (
                  <>
                    <span>for</span>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className={inlineSelect}
                    >
                      {monthsList.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className={inlineSelect}
                    >
                      {yearsList.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {activeTab === "yearly" && (
                  <>
                    <span>for Year</span>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className={inlineSelect}
                    >
                      {yearsList.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 font-mono text-[10px] border-t border-slate-800 pt-3">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-sm"></span>
                <span className="truncate">ENGAGED ({activeCount})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <span className="w-2 h-2 bg-slate-800 rounded-sm"></span>
                <span className="truncate">
                  IDLE ({Math.max(0, totalUsers - activeCount)})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
