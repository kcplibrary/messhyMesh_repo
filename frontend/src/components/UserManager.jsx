// import React from "react";
import { EditIcon, DeleteIcon } from "./Icons.jsx";

const UserManager = ({
  handleCreateUser,
  newUsername,
  setNewUsername,
  newPassword,
  setNewPassword,
  newRole,
  setNewRole,
  usersList,
  editingUserId,
  setEditingUserId,
  editUsername,
  setEditUsername,
  editRole,
  setEditRole,
  handleUpdateUser,
  // handleDeleteUser,
  communities,
  selectedUserDept,
  setSelectedUserDept,
  editDept,
  setEditDept,
  editPassword,
  setEditPassword,
  setConfirmModal,
}) => {
  return (
    // Adjusted container padding: p-4 on phones, p-8 on medium/desktop screens (md:p-8)
    <div className="mb-12 bg-slate-800/50 p-4 sm:p-6 md:p-8 rounded-[2rem] border border-blue-500/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
      <h2 className="text-lg sm:text-xl font-black mb-6 sm:mb-8 text-white uppercase">
        User Management
      </h2>

      {/* CREATION FORM: Scaled intelligently across breakpoints (1 col -> 2 cols -> 5 cols) */}
      <form
        onSubmit={handleCreateUser}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Username"
          className="bg-slate-900 border border-slate-700 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl outline-none text-white text-sm"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-slate-900 border border-slate-700 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl outline-none text-white text-sm"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <select
          className="bg-slate-900 border border-slate-700 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-white text-sm outline-none cursor-pointer"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <select
          className="bg-slate-900 border border-slate-700 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-white text-sm outline-none cursor-pointer"
          value={selectedUserDept}
          onChange={(e) => setSelectedUserDept(e.target.value)}
        >
          <option value="">-- ASSIGN COMMUNITY --</option>
          {communities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Create Button: Spans across full width on mobile viewports */}
        <button className="col-span-1 sm:col-span-2 md:col-span-1 bg-emerald-600 hover:bg-emerald-500 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl font-black transition-all text-white text-sm tracking-wide">
          CREATE
        </button>
      </form>

      {/* OVERVIEW PANEL */}
      <div className="space-y-2 border-t border-slate-700 pt-6">
        <h3 className="text-[10px] font-mono text-slate-500 uppercase mb-4 tracking-widest">
          Patron Overview
        </h3>

        <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1">
          {usersList.map((u) => (
            <div
              key={u.id}
              className="bg-slate-900/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700 hover:border-blue-500/30 transition-all group"
            >
              {editingUserId === u.id ? (
                /* INLINE EDIT MODE - Responsive Flex/Grid structure prevents layout collapse */
                <div className="flex flex-col gap-3 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider pl-1">
                        Username
                      </label>
                      <input
                        className="bg-slate-800 border border-blue-500 rounded-lg px-3 py-2 text-white text-xs w-full outline-none"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider pl-1">
                        Password Upgrade
                      </label>
                      <input
                        type="password"
                        placeholder="Leave blank to preserve"
                        className="bg-slate-800 border border-blue-500 rounded-lg px-3 py-2 text-white text-xs w-full outline-none"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 items-end gap-2 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider pl-1">
                        Role Type
                      </label>
                      <select
                        className="bg-slate-800 border border-blue-500 rounded-lg text-xs text-white outline-none px-2 py-2 cursor-pointer h-[34px]"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                      >
                        <option value="student">student</option>
                        <option value="employee">employee</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider pl-1">
                        Sector Link
                      </label>
                      <select
                        className="bg-slate-800 border border-blue-500 rounded-lg text-xs text-white outline-none px-2 py-2 cursor-pointer h-[34px]"
                        value={editDept ? String(editDept) : ""}
                        onChange={(e) => setEditDept(e.target.value)}
                      >
                        <option value="">No Sector</option>
                        {communities.map((c) => (
                          <option key={c.id} value={String(c.id)}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* ACTIONS SUB-WRAPPER */}
                    <button
                      onClick={() => handleUpdateUser(u.id)}
                      className="bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/20 text-emerald-400 hover:text-white rounded-lg font-bold text-xs uppercase transition-all h-[34px]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingUserId(null)}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg font-bold text-xs uppercase transition-all h-[34px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* VIEW RECORD MODE - Stacks beautifully into rows on phones */
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
                  <span className="font-bold text-sm sm:text-base text-slate-200 tracking-tight break-all">
                    {u.username}
                  </span>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
                    <span className="text-blue-400 font-mono uppercase text-[9px] sm:text-[10px] bg-blue-400/10 px-2 py-1 rounded-md border border-blue-500/10 tracking-wide">
                      {u.role}
                    </span>

                    <span className="text-emerald-400 font-mono uppercase text-[9px] sm:text-[10px] bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20 max-w-[180px] truncate">
                      Sector: {u.department || "Unassigned"}
                    </span>

                    {u.id !== 1 && u.username !== "admin" ? (
                      <div className="flex items-center gap-1 ml-auto sm:ml-2 pt-2 sm:pt-0 border-t border-slate-800 sm:border-0 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => {
                            setEditingUserId(u.id);
                            setEditUsername(u.username);
                            setEditRole(u.role);
                            setEditDept(
                              u.community_id ? String(u.community_id) : "",
                            );
                            setEditPassword("");
                          }}
                          className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all"
                          title="Edit User"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmModal({ isOpen: true, targetId: u.id })
                          }
                          className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-800 rounded-lg transition-all"
                          title="Delete User"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-600 border border-slate-800 px-2 py-1 rounded uppercase tracking-widest ml-auto sm:ml-2">
                        ADMIN
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManager;
