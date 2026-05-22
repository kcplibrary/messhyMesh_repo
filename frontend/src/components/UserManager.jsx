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
  handleDeleteUser,
  communities,
  selectedUserDept,
  setSelectedUserDept,
  editDept,
  setEditDept,
  editPassword,
  setEditPassword,
}) => {
  return (
    <div className="mb-12 bg-slate-800/50 p-8 rounded-3xl border border-blue-500/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
      <h2 className="text-xl font-black mb-8 text-white uppercase">
        User Management
      </h2>
      <form
        onSubmit={handleCreateUser}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Username"
          className="bg-slate-900 border border-slate-700 p-4 rounded-2xl outline-none"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-slate-900 border border-slate-700 p-4 rounded-2xl outline-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <select
          className="bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        {/* NEW SECTOR DROPDOWN */}
        <select
          className="bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none cursor-pointer"
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

        <button className="bg-emerald-600 hover:bg-emerald-500 p-4 rounded-2xl font-black transition-all">
          CREATE
        </button>
      </form>

      <div className="space-y-2 border-t border-slate-700 pt-6">
        <h3 className="text-[10px] font-mono text-slate-500 uppercase mb-4 tracking-widest">
          Patron Overview
        </h3>
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
          {usersList.map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-all group"
            >
              {editingUserId === u.id ? (
                <div className="flex gap-2 flex-1 mr-4">
                  <input
                    className="bg-slate-800 border border-blue-500 rounded px-2 py-1 text-white text-[10px] w-full outline-none"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="New Pass (Leave blank to keep)"
                    className="bg-slate-800 border border-blue-500 rounded px-2 py-1 text-white text-[10px] w-32 outline-none"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                  />

                  <select
                    className="bg-slate-800 border border-blue-500 rounded text-[10px] text-white outline-none px-1"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                  >
                    <option value="student">student</option>
                    <option value="employee">employee</option>
                    <option value="admin">admin</option>
                  </select>

                  {/* --- NEW DROPDOWN INSIDE EDIT MODE --- */}
                  <select
                    className="bg-slate-800 border border-blue-500 rounded text-[10px] text-white outline-none px-1"
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

                  <button
                    onClick={() => handleUpdateUser(u.id)}
                    className="text-emerald-400 font-bold text-[10px] uppercase"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingUserId(null)}
                    className="text-slate-500 font-bold text-[10px] uppercase"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-bold text-slate-200 tracking-tight">
                    {u.username}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 font-mono uppercase text-[10px] bg-blue-400/10 px-2 py-1 rounded-md">
                      {u.role}
                    </span>

                    <span className="text-emerald-400 font-mono uppercase text-[10px] bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20 ml-2">
                      Sector: {u.department || "Unassigned"}
                    </span>

                    {u.id !== 1 && u.username !== "admin" ? (
                      <>
                        <button
                          onClick={() => {
                            setEditingUserId(u.id);
                            setEditUsername(u.username);
                            setEditRole(u.role);
                            setEditDept(u.community_id ? String(u.community_id) : "");
                            setEditPassword("");
                            
                            setEditPassword("");
                          }}
                          className="text-slate-600 hover:text-blue-400 transition-colors"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-slate-600 hover:text-rose-500 transition-colors"
                        >
                          <DeleteIcon />
                        </button>
                      </>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-600 border border-slate-800 px-2 py-0.5 rounded uppercase tracking-widest">
                        Root_Node
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManager;
