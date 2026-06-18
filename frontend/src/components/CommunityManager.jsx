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
  setConfirmModal,

  // Collections handlers & states
  handleCreateCollection,
  newCollName,
  setNewCollName,
  collections = [],
  editingCollId,
  setEditingCollId,
  editCollName,
  setEditCollName,
  handleRenameCollection,
}) => {
  return (
    <div className="space-y-6 mb-12">
      {/* 📊 DUAL CREATION PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 1: Create Community */}
        <div className="bg-slate-800/50 p-4 sm:p-6 md:p-8 rounded-[2rem] border border-emerald-500/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-lg sm:text-xl font-black mb-6 sm:mb-8 text-white uppercase tracking-wide">
            Create Community
          </h2>
          <form
            onSubmit={handleCreateCommunity}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <input
              type="text"
              placeholder="Community / Department Name"
              className="bg-slate-900 border border-slate-700 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl outline-none flex-1 focus:border-emerald-500 text-white text-sm transition-all"
              value={newCommName}
              onChange={(e) => setNewCommName(e.target.value)}
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 py-3.5 sm:py-0 sm:px-8 rounded-xl sm:rounded-2xl font-black uppercase text-sm transition-all shadow-lg shadow-emerald-600/20 text-white whitespace-nowrap"
            >
              CREATE
            </button>
          </form>
        </div>

        {/* PANEL 2: Create Collection */}
        <div className="bg-slate-800/50 p-4 sm:p-6 md:p-8 rounded-[2rem] border border-indigo-500/30 backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl font-black mb-6 sm:mb-8 text-white uppercase tracking-wide">
            Create Collection
          </h2>

          {/* 🌟 CRITICAL: Make sure onSubmit is bound to handleCreateCollection */}
          <form
            onSubmit={handleCreateCollection}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <input
              type="text"
              placeholder="Collection Community Name"
              className="bg-slate-900 border border-slate-700 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl outline-none flex-1 focus:border-indigo-500 text-white text-sm transition-all"
              value={newCollName}
              onChange={(e) => setNewCollName(e.target.value)}
            />
            {/* 🌟 CRITICAL: Make sure type is "submit" */}
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 py-3.5 sm:py-0 sm:px-8 rounded-xl sm:rounded-2xl font-black uppercase text-sm transition-all shadow-lg shadow-indigo-600/20 text-white whitespace-nowrap"
            >
              CREATE
            </button>
          </form>
        </div>
      </div>

      {/* 🗄️ MANAGEMENT LISTS PANEL */}
      <div className="bg-slate-800/40 p-4 sm:p-6 md:p-8 rounded-[2rem] border border-slate-700/60 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* COLUMN A: Existing Communities */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-mono text-slate-500 uppercase mb-4 tracking-widest">
              Existing Communities ({communities.length})
            </h3>

            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
              {communities.length > 0 ? (
                communities.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700 hover:border-emerald-500/30 transition-all group gap-3 sm:gap-2"
                  >
                    <div className="flex items-center gap-3 w-full sm:flex-1 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                      {editingId === c.id ? (
                        <input
                          type="text"
                          className="bg-slate-800 border border-emerald-500/50 rounded-lg px-3 py-1.5 text-white text-sm outline-none w-full max-w-full sm:max-w-[260px]"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleRename(c.id)
                          }
                        />
                      ) : (
                        <span className="font-bold text-sm sm:text-base text-slate-200 tracking-tight break-all">
                          {c.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t border-slate-800/60 sm:border-t-0">
                      {editingId === c.id ? (
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleRename(c.id)}
                            className="text-xs font-black text-emerald-400 uppercase hover:text-white transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs font-black text-slate-400 uppercase hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
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
                              onClick={() =>
                                setConfirmModal({
                                  isOpen: true,
                                  targetId: c.id,
                                  type: "community",
                                })
                              }
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
                    [ No Active Communities ]
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN B: Existing Collections */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-mono text-slate-500 uppercase mb-4 tracking-widest">
              Existing Collections ({collections.length})
            </h3>

            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
              {collections.length > 0 ? (
                collections.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700 hover:border-indigo-500/30 transition-all group gap-3 sm:gap-2"
                  >
                    <div className="flex items-center gap-3 w-full sm:flex-1 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0"></span>
                      {editingCollId === c.id ? (
                        <input
                          type="text"
                          className="bg-slate-800 border border-indigo-500/50 rounded-lg px-3 py-1.5 text-white text-sm outline-none w-full max-w-full sm:max-w-[260px]"
                          value={editCollName}
                          onChange={(e) => setEditCollName(e.target.value)}
                          autoFocus
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleRenameCollection(c.id)
                          }
                        />
                      ) : (
                        <span className="font-bold text-sm sm:text-base text-slate-200 tracking-tight break-all">
                          {c.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t border-slate-800/60 sm:border-t-0">
                      {editingCollId === c.id ? (
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleRenameCollection(c.id)}
                            className="text-xs font-black text-indigo-400 uppercase hover:text-white transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCollId(null)}
                            className="text-xs font-black text-slate-400 uppercase hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="hidden xs:inline text-indigo-400 font-mono uppercase text-[9px] sm:text-[10px] bg-indigo-400/10 px-3 py-1 rounded-md border border-indigo-400/20 group-hover:bg-indigo-400 group-hover:text-slate-900 transition-all cursor-default tracking-wide">
                            Collection
                          </span>
                          <div className="flex items-center gap-1 ml-auto sm:ml-0">
                            <button
                              onClick={() => {
                                setEditingCollId(c.id);
                                setEditCollName(c.name);
                              }}
                              className="text-slate-500 hover:text-indigo-400 hover:bg-slate-800 p-2 rounded-lg transition-all"
                              title="Edit Collection"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  isOpen: true,
                                  targetId: c.id,
                                  type: "collection",
                                })
                              }
                              className="text-slate-500 hover:text-red-500 hover:bg-slate-800 p-2 rounded-lg transition-all"
                              title="Terminate Collection"
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
                    [ No Active Collections ]
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityManager;
