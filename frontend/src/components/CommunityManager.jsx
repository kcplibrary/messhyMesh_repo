// import React from "react";
import { EditIcon, DeleteIcon } from "./Icons.jsx";

const CommunityManager = ({
  handleCreateCommunity,
  newCommName,
  setNewCommName,
  communities,
  editingId,
  setEditingId,
  editName,
  setEditName,
  handleRename,
  handleDeleteCommunity,
}) => {
  return (
    // Adjusted padding: p-4 on phones, p-8 on medium/desktop screens (md:p-8)
    <div className="mb-12 bg-slate-800/50 p-4 sm:p-6 md:p-8 rounded-[2rem] border border-emerald-500/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
      <h2 className="text-lg sm:text-xl font-black mb-6 sm:mb-8 text-white uppercase">
        Create Community
      </h2>

      {/* FORM: Shifts from a stacked layout on mobile to a clean row on small screens (sm:flex-row) */}
      <form
        onSubmit={handleCreateCommunity}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Community/Department Name"
          className="bg-slate-900 border border-slate-700 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl outline-none flex-1 focus:border-emerald-500 text-white text-sm"
          value={newCommName}
          onChange={(e) => setNewCommName(e.target.value)}
        />
        <button className="bg-emerald-600 hover:bg-emerald-500 py-3.5 sm:py-0 sm:px-8 rounded-xl sm:rounded-2xl font-black uppercase text-sm transition-all shadow-lg shadow-emerald-600/20 text-white">
          CREATE
        </button>
      </form>

      {/* EXISTING SECTORS PANEL */}
      <div className="space-y-2 border-t border-slate-700 pt-6">
        <h3 className="text-[10px] font-mono text-slate-500 uppercase mb-4 tracking-widest">
          Existing Communities
        </h3>

        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
          {communities.length > 0 ? (
            communities.map((c) => (
              <div
                key={c.id}
                // Row Card: Stacks items into columns on mobile, restores row tracking on tablets/desktop
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700 hover:border-emerald-500/30 transition-all group gap-3 sm:gap-2"
              >
                {/* LEFT SIDE: Name Display / Edit Field */}
                <div className="flex items-center gap-3 w-full sm:flex-1 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  {editingId === c.id ? (
                    <input
                      type="text"
                      className="bg-slate-800 border border-emerald-500/50 rounded-lg px-3 py-1.5 text-white text-sm outline-none w-full max-w-full sm:max-w-[260px]"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleRename(c.id)}
                    />
                  ) : (
                    <span className="font-bold text-sm sm:text-base text-slate-200 tracking-tight break-all">
                      {c.name}
                    </span>
                  )}
                </div>

                {/* RIGHT SIDE: Interactive Actions Controls */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t border-slate-800/60 sm:border-t-0">
                  {editingId === c.id ? (
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleRename(c.id)}
                        className="text-xs font-black text-emerald-400 uppercase hover:text-white transition-colors bg-emerald-500/10 px-3 py-1 rounded-md sm:bg-transparent sm:p-0"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs font-black text-slate-400 uppercase hover:text-white transition-colors bg-slate-800 px-3 py-1 rounded-md sm:bg-transparent sm:p-0"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Badge hides on small screens if space is premium, stays persistent on tablet/desktops */}
                      <span className="hidden xs:inline text-emerald-400 font-mono uppercase text-[9px] sm:text-[10px] bg-emerald-400/10 px-3 py-1 rounded-md border border-emerald-400/20 group-hover:bg-emerald-400 group-hover:text-slate-900 transition-all cursor-default tracking-wide">
                        Department
                      </span>

                      <div className="flex items-center gap-1 ml-auto sm:ml-0">
                        <button
                          onClick={() => {
                            setEditingId(c.id);
                            setEditName(c.name);
                          }}
                          className="text-slate-500 hover:text-emerald-400 hover:bg-slate-800 p-2 rounded-lg transition-all"
                          title="Edit Node"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteCommunity(c.id)}
                          className="text-slate-500 hover:text-red-500 hover:bg-slate-800 p-2 rounded-lg transition-all"
                          title="Terminate Node"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 border border-dashed border-slate-700 rounded-xl">
              <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">
                [ No Active Nodes Found ]
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityManager;
