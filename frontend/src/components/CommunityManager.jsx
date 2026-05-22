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
    <div className="mb-12 bg-slate-800/50 p-8 rounded-3xl border border-emerald-500/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
      <h2 className="text-xl font-black mb-8 text-white uppercase">
        Initialize Community
      </h2>
      <form onSubmit={handleCreateCommunity} className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Community/Department Name"
          className="bg-slate-900 border border-slate-700 p-4 rounded-2xl outline-none flex-1 focus:border-emerald-500"
          value={newCommName}
          onChange={(e) => setNewCommName(e.target.value)}
        />
        <button className="bg-emerald-600 hover:bg-emerald-500 px-8 rounded-2xl font-black uppercase text-sm transition-all shadow-lg shadow-emerald-600/20">
          CREATE
        </button>
      </form>

      <div className="space-y-2 border-t border-slate-700 pt-6">
        <h3 className="text-[10px] font-mono text-slate-500 uppercase mb-4 tracking-widest">
          Existing_Sectors_In_Mesh
        </h3>
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
          {communities.length > 0 ? (
            communities.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {editingId === c.id ? (
                    <input
                      type="text"
                      className="bg-slate-800 border border-emerald-500/50 rounded-lg px-3 py-1 text-white text-sm outline-none w-full max-w-[200px]"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleRename(c.id)}
                    />
                  ) : (
                    <span className="font-bold text-slate-200 tracking-tight">
                      {c.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {editingId === c.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRename(c.id)}
                        className="text-[10px] font-black text-emerald-400 uppercase hover:text-white transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-emerald-400 font-mono uppercase text-[10px] bg-emerald-400/10 px-3 py-1 rounded-md border border-emerald-400/20 group-hover:bg-emerald-400 group-hover:text-slate-900 transition-all cursor-default">
                        Department
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(c.id);
                          setEditName(c.name);
                        }}
                        className="text-slate-500 hover:text-emerald-400 transition-colors p-1"
                        title="Edit Node"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteCommunity(c.id)}
                        className="text-slate-500 hover:text-red-500 transition-colors p-1"
                        title="Terminate Node"
                      >
                        <DeleteIcon />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 border border-dashed border-slate-700 rounded-xl">
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
