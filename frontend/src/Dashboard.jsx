/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommunityManager from "./components/CommunityManager";
import UserManager from "./components/UserManager";
import { DeleteIcon } from "./components/Icons.jsx";
import StatsBar from "./components/StatsBar";
import SearchFilters from "./components/SearchFilters";
import CitationModal from "./components/CitationModal"; // Adjust path as needed
import { generateAPA7 } from "./components/utils/citationHelper.js";
import HeaderNav from "./components/HeaderNav.jsx";
import SemesterSettingsCard from "./components/SemesterSettingsCard.jsx";

// const API_BASE = "http://localhost:8000/api";
const API_BASE = "https://customer-yahoo-outing.ngrok-free.dev/backend/api";

function Dashboard({ user, logout }) {
  const [currentView, setCurrentView] = useState("papers");

  // --- ALL YOUR ORIGINAL STATES (UNTOUCHED) ---
  const [files, setFiles] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddComm, setShowAddComm] = useState(false);
  const [selectedTargetComm, setSelectedTargetComm] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("student");
  const [newCommName, setNewCommName] = useState("");
  const [selectedUserDept, setSelectedUserDept] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userSectorFilter, setUserSectorFilter] = useState("");
  const [fileSearch, setFileSearch] = useState("");
  const [fileSectorFilter, setFileSectorFilter] = useState("");
  const [paperTitle, setPaperTitle] = useState("");
  const [paperAuthor, setPaperAuthor] = useState("");
  const [paperYear, setPaperYear] = useState("");
  const [showCiteModal, setShowCiteModal] = useState(false);
  const [activeCitation, setActiveCitation] = useState("");
  const [paperKeywords, setPaperKeywords] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [semLabel, setSemLabel] = useState("");
  const [semStart, setSemStart] = useState("");
  const [semEnd, setSemEnd] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Stats check
  // const [stats, setStats] = useState({ nodes: 0, archives: 0, sectors: 0 });
  const [stats, setStats] = useState({
    nodes: 0,
    archives: 0,
    sectors: 0,
    dailyUsers: 0,
    weeklyUsers: 0,
    monthlyUsers: 0,
    yearlyUsers: 0,
    dailyUploads: 0,
    weeklyUploads: 0,
    semesterLabel: "Active Semester",
    semesterUploads: 0,
  });

  // --- CALENDAR MODULATION TRIGGER ENGINE ---
  const handleUpdateSemester = async (e) => {
    e.preventDefault();
    if (!semLabel || !semStart || !semEnd) {
      alert("Fields cannot be empty.");
      return;
    }

    setSettingsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/update_semester.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: semLabel,
          start: semStart,
          end: semEnd,
        }),
      });
      const data = await response.json();
      if (data.status === "success") {
        fetchStats(); // Instantly refresh system wide storage numbers
        alert("System terms updated successfully!");
        setShowSettings(false);
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Sync Interrupted: Check backend driver paths.");
    } finally {
      setSettingsLoading(false);
    }
  };

  // Filter Users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = u.username
      .toLowerCase()
      .includes(userSearch.toLowerCase());

    // Logic: Show all if filter is empty, otherwise match community_id
    const matchesSector =
      userSectorFilter === "" ||
      String(u.community_id) === String(userSectorFilter).trim();

    return matchesSearch && matchesSector;
  });

  // Filter Files (Upgraded with Metadata & Keyword Indexing)
  const filteredFiles = (files || []).filter((f) => {
    const searchTerm = fileSearch.toLowerCase();

    // Multidimensional Keyword Matching Engine
    const matchesSearch =
      (f.filename || "").toLowerCase().includes(searchTerm) ||
      (f.paper_title || "").toLowerCase().includes(searchTerm) ||
      (f.paper_author || "").toLowerCase().includes(searchTerm) ||
      (f.keywords || "").toLowerCase().includes(searchTerm); // <-- Scans comma-separated indexing keywords

    const matchesSector =
      fileSectorFilter === "" ||
      String(f.community_id) === String(fileSectorFilter);

    return matchesSearch && matchesSector;
  });
  // // Filter Files
  // const filteredFiles = files.filter((f) => {
  //   const matchesSearch = f.filename
  //     .toLowerCase()
  //     .includes(fileSearch.toLowerCase());

  //   const matchesSector =
  //     fileSectorFilter === "" ||
  //     String(f.community_id) === String(fileSectorFilter);

  //   return matchesSearch && matchesSector;
  // });

  // tunnel
  const ngrokConfig = {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  };

  const fetchFiles = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_files.php`, ngrokConfig);
      if (Array.isArray(res.data)) setFiles(res.data);
    } catch (err) {
      console.error(err);
      setStatusMsg("File sync failed.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_users.php`, ngrokConfig);
      if (Array.isArray(res.data)) setUsersList(res.data);
    } catch (err) {
      console.error(err);
      setStatusMsg("User sync failed.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCommunities = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/get_communities.php`,
        ngrokConfig,
      );
      if (Array.isArray(res.data)) setCommunities(res.data);
    } catch (err) {
      console.error("Community Fetch Error:", err);
      setStatusMsg("Failed to sync sectors.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_stats.php`, ngrokConfig);
      if (res.data.status === "success") {
        setStats(res.data.stats); // This updates the state

        // Auto-seed text inputs with the active values from database
        if (res.data.stats.semesterLabel) {
          setSemLabel(res.data.stats.semesterLabel);
        }
        // If your stats backend endpoint maps values for active dates:
        if (res.data.stats.semesterStart)
          setSemStart(res.data.stats.semesterStart);
        if (res.data.stats.semesterEnd) setSemEnd(res.data.stats.semesterEnd);
      }
    } catch (err) {
      console.error("Stats Fetch Error:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchFiles();
    fetchUsers();
    fetchCommunities();
    fetchStats();
  }, [fetchFiles, fetchUsers, fetchCommunities, fetchStats]);

  const handleUpdateUser = async (id) => {
    try {
      const res = await axios.post(`${API_BASE}/update_user.php`, {
        // id,
        id: id,
        username: editUsername,
        role: editRole,
        community_id: editDept,
        password: editPassword,
      });
      if (res.data.status === "success") {
        await fetchUsers();
        setEditingUserId(null);
        setEditPassword("");
        setStatusMsg("User node reconfigured.");

        setUsersList((prev) =>
          prev.map((u) =>
            u.id === id
              ? {
                  ...u,
                  username: editUsername,
                  role: editRole,
                  community_id: editDept,
                }
              : u,
          ),
        );
        // setUsersList(
        //   usersList.map((u) =>
        //     u.id === id ? { ...u, username: editUsername, role: editRole } : u,
        //   ),
        // );
        // setEditingUserId(null);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("Update failed.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (
      !window.confirm(
        "TERMINATE USER: This will revoke all access for this node. Continue?",
      )
    )
      return;
    try {
      const res = await axios.post(`${API_BASE}/delete_user.php`, { id });
      if (res.data.status === "success")
        setUsersList(usersList.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      setStatusMsg("Delete failed.");
    }
  };

  const handleRename = async (id) => {
    try {
      const response = await axios.post(
        // "http://localhost:8000/api/update_community.php",
        "https://customer-yahoo-outing.ngrok-free.dev/backend/api/update_community.php",
        { id: id, name: editName },
      );
      if (response.data.status === "success") {
        setCommunities(
          communities.map((c) => (c.id === id ? { ...c, name: editName } : c)),
        );
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
      alert("Rename failed.");
    }
  };

  const handleDeleteCommunity = async (id) => {
    if (
      !window.confirm("Are you sure you want to terminate this community node?")
    )
      return;
    try {
      const response = await axios.post(
        // "http://localhost:8000/api/delete_community.php",
        "https://customer-yahoo-outing.ngrok-free.dev/backend/api/delete_community.php",
        { id },
      );
      if (response.data.status === "success")
        setCommunities(communities.filter((c) => c.id !== id));
      else alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert("System Error: Could not delete community.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedTargetComm) {
      setStatusMsg("SYSTEM_REJECTION: Select a Target Sector first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploader", user.username);
    formData.append("community_id", String(selectedTargetComm));
    formData.append("paper_title", paperTitle);
    formData.append("paper_author", paperAuthor);
    formData.append("paper_year", paperYear);
    formData.append("keywords", paperKeywords);
    try {
      setStatusMsg("Routing to Sector Collection...");
      const res = await axios.post(`${API_BASE}/upload.php`, formData);
      if (res.data.status === "success") {
        setStatusMsg(res.data.message);
        fetchFiles();

        setPaperTitle("");
        setPaperAuthor("");
        setPaperYear("");
        setPaperKeywords("");

        setSelectedTargetComm("");
        setStatusMsg("File uploaded and indexed successfully!");
        fetchFiles();
        fetchStats();
      } else setStatusMsg("System Error: " + res.data.message);
    } catch (err) {
      console.error(err);
      setStatusMsg("Archive Failed: Network/Server Error");
    }
  };

  const handleViewFile = (filename) => {
    // Added &ngrok-skip-browser-warning=true directly to the URL structure
    const fileUrl = `https://customer-yahoo-outing.ngrok-free.dev/backend/api/view_file.php?file=${encodeURIComponent(filename)}&ngrok-skip-browser-warning=true`;

    window.open(fileUrl, "_blank");
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!newCommName.trim()) return;
    try {
      const res = await axios.post(`${API_BASE}/create_community.php`, {
        name: newCommName,
      });
      setStatusMsg(res.data.message);
      setNewCommName("");
      fetchCommunities();
    } catch (err) {
      setStatusMsg(
        "System Error: " + (err.response?.data?.message || "Check connection"),
      );
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append("username", newUsername);
    params.append("password", newPassword);
    params.append("role", newRole);
    params.append("community_id", selectedUserDept);

    try {
      const res = await axios.post(`${API_BASE}/register.php`, params);
      if (res.data.status === "connection success") {
        fetchUsers(); // Refresh the list
        // Clear inputs
        setNewUsername("");
        setNewPassword("");
        setSelectedUserDept("");
        setStatusMsg(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("Registration failed.");
    }
  };

  const handleDeleteFile = async (id) => {
    if (
      !window.confirm(
        "PURGE ARCHIVE: Are you sure you want to permanently delete this file?",
      )
    )
      return;
    try {
      const res = await axios.post(`${API_BASE}/delete_file.php`, { id });
      if (res.data.status === "success") {
        setFiles(files.filter((f) => f.id !== id));
        setStatusMsg("File successfully purged from vault.");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("Purge Failed: System error.");
    }
  };

  const handleDownload = async (filename) => {
    try {
      setStatusMsg("Preparing download...");

      // Fixed the syntax error (removed leading backslash and trailing backtick)
      // const fileUrl = `http://localhost:8000/api/download.php?file=${filename}`;
      const fileUrl = `https://customer-yahoo-outing.ngrok-free.dev/backend/api/download.php?file=${filename}`;

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = fileUrl;

      // The PHP script handles the "attachment" headers, so this triggers the save dialog
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      setStatusMsg("Download initiated.");
    } catch (err) {
      console.error("Download error:", err);
      setStatusMsg("Download failed: Connection error.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans selection:bg-blue-500/30">
      {/* Header */}
      {(user.role === "admin" || user.role === "employee") && (
        <HeaderNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          adminUsername={user?.username || "Administrator"}
          onLogout={logout}
        />
      )}

      {/* Header for students only */}
      {user && user.role === "student" && (
        <div className="flex justify-between items-center mb-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Hello, {user.username}
            </h1>

            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-1">
              Status: <span className="text-emerald-500 mr-2">Active</span>
              {/* Session_Role:{" "}
              <span className="text-emerald-400 font-bold">{user.role}</span> */}
            </p>
          </div>

          <button
            onClick={logout}
            className="px-5 py-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-600/20 rounded-xl font-bold text-xs transition-all tracking-widest uppercase"
          >
            LOGOUT
          </button>
        </div>
      )}

      {/* Statistics: Shows only to Admins and employees */}
      {user && (user.role === "admin" || user.role === "employee") && (
        <StatsBar stats={stats} />
      )}

      {/* METRIC PROGRESSIVE TIMELINE MONITORING BAR */}
      {user && (user.role === "admin" || user.role === "employee") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-3 bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-blue-500 animate-pulse" />

            <div className="flex flex-col gap-1 w-full md:w-auto">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                CATALOGUE METRIC
              </span>
              <h4 className="font-black text-sm uppercase text-slate-200 tracking-tight">
                Active Archive Footprint
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                Showing{" "}
                <span className="text-blue-400 font-bold">
                  {filteredFiles.length}
                </span>{" "}
                results out of{" "}
                <span className="text-slate-300 font-bold">
                  {stats.archives || files.length}
                </span>{" "}
                total uploaded files.
              </p>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full md:w-1/3 flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
                <span>Indexing Yield Capacity</span>
                <span className="text-blue-400 font-bold">
                  {stats.archives > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (filteredFiles.length / stats.archives) * 100,
                        ),
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out rounded-full"
                  style={{
                    width: `${stats.archives > 0 ? Math.min(100, Math.round((filteredFiles.length / stats.archives) * 100)) : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Chrono Metrics Readouts */}
            <div className="flex gap-4 bg-slate-900/50 border border-slate-800 p-3 rounded-2xl text-left font-mono">
              <div>
                <p className="text-[9px] text-slate-500 uppercase">Today</p>
                <p className="text-xs text-blue-400 font-bold">
                  +{stats.dailyUploads || 0}
                </p>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <p className="text-[9px] text-slate-500 uppercase">Weekly</p>
                <p className="text-xs text-indigo-400 font-bold">
                  +{stats.weeklyUploads || 0}
                </p>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <p className="text-[9px] text-slate-500 uppercase">
                  {stats.semesterLabel || "Active Sem"}
                </p>
                <p className="text-xs text-emerald-400 font-bold">
                  {stats.semesterUploads || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 items-start">
        {(user.role === "admin" || user.role === "employee") && (
          <div className="bg-gradient-to-b from-blue-600 to-blue-700 p-8 rounded-3xl shadow-xl shadow-blue-900/20 border border-blue-500/30 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
            {/* Visual Tech-Accent Bar to match the other cards */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-400" />

            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex justify-between items-center w-full">
                <span className="text-[10px] font-mono tracking-widest uppercase text-blue-200">
                  Add new collection
                </span>
                <span className="text-xl">🚀</span>
              </div>
              <span className="font-black text-xl tracking-tight uppercase text-white">
                Manage Collections
              </span>
              <p className="text-xs text-blue-100 font-normal mt-2 leading-relaxed max-w-[240px] opacity-80">
                Index raw thesis manuscripts, inject searchable metadata tags,
                and route assets directly into secure sector vaults.
              </p>
            </div>

            {/* METADATA INPUT ENGINE */}
            <div className="flex flex-col gap-2 mt-4">
              <input
                type="text"
                placeholder="FULL THESIS TITLE"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                className="w-full bg-blue-800/50 border border-blue-400/20 text-white p-3 rounded-xl text-[10px] font-bold outline-none focus:ring-2 ring-blue-300 placeholder:text-blue-300/50 transition-all"
              />
              <input
                type="text"
                placeholder="AUTHOR (LASTNAME, INITIALS)"
                value={paperAuthor}
                onChange={(e) => setPaperAuthor(e.target.value)}
                className="w-full bg-blue-800/50 border border-blue-400/20 text-white p-3 rounded-xl text-[10px] font-bold outline-none focus:ring-2 ring-blue-300 placeholder:text-blue-300/50 transition-all"
              />
              <input
                placeholder="PUBLICATION YEAR (YYYY)"
                value={paperYear}
                onChange={(e) => setPaperYear(e.target.value)}
                className="w-full bg-blue-800/50 border border-blue-400/20 text-white p-3 rounded-xl text-[10px] font-bold outline-none focus:ring-2 ring-blue-300 placeholder:text-blue-300/50 transition-all"
              />
              <input
                type="text"
                placeholder="KEYWORDS / TAGS (COMMA SEPARATED)"
                value={paperKeywords}
                onChange={(e) => setPaperKeywords(e.target.value)}
                className="w-full bg-blue-800/50 border border-blue-400/20 text-white p-3 rounded-xl text-[10px] font-bold outline-none focus:ring-2 ring-blue-300 placeholder:text-blue-300/50 transition-all"
              />
            </div>

            {/* SECTOR SELECTOR */}
            <div className="mt-3 relative">
              <select
                value={selectedTargetComm}
                onChange={(e) => setSelectedTargetComm(e.target.value)}
                className="w-full bg-blue-800 border border-blue-400/30 text-white p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-300 transition-all cursor-pointer appearance-none"
              >
                <option value="">-- SELECT COMMUNITY--</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBMIT BUTTON TRIGGER */}
            <label
              className={`mt-4 cursor-pointer group p-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest border active:scale-[0.98] ${
                selectedTargetComm
                  ? "bg-white text-blue-600 border-white hover:bg-blue-50"
                  : "bg-blue-800/40 text-blue-400/60 border-blue-700/40 cursor-not-allowed opacity-50"
              }`}
            >
              {selectedTargetComm ? "Upload Archive" : "Choose Community First"}
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={!selectedTargetComm}
              />
            </label>
          </div>
        )}

        {/* Manage Community */}
        {(user.role === "admin" || user.role === "employee") && (
          <button
            onClick={() => setShowAddComm(!showAddComm)}
            className={`p-8 rounded-3xl border text-left flex flex-col justify-between items-start group transition-all duration-300 relative overflow-hidden active:scale-[0.98] ${
              showAddComm
                ? "bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-950/20 text-emerald-400"
                : "bg-slate-800/40 border-slate-700/60 text-slate-200 hover:border-slate-600 hover:bg-slate-800/70"
            }`}
          >
            {/* Visual Tech-Accent Bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-[3px] transition-all ${showAddComm ? "bg-emerald-500" : "bg-transparent group-hover:bg-slate-500"}`}
            />

            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex justify-between items-center w-full">
                <span
                  className={`text-[10px] font-mono tracking-widest uppercase transition-all ${showAddComm ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-400"}`}
                >
                  CREATE COMMUNITY
                </span>
                <span
                  className={`text-xl transition-transform duration-300 ${showAddComm ? "rotate-45" : "group-hover:translate-x-1"}`}
                >
                  {showAddComm ? "✖" : "🌐"}
                </span>
              </div>
              <span className="font-black text-xl tracking-tight uppercase">
                {showAddComm ? "Close Sectors" : "Manage Community"}
              </span>
              <p className="text-xs text-slate-400 font-normal mt-2 leading-relaxed max-w-[240px]">
                Configure institutional departments, college branches, and
                specialized course domains for thesis classification.
              </p>
            </div>

            <div
              className={`mt-6 px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest border transition-all ${
                showAddComm
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 animate-pulse"
                  : "bg-slate-800 border-slate-700 text-slate-400 group-hover:text-slate-200 group-hover:border-slate-500"
              }`}
            >
              {showAddComm
                ? "• Click to close community"
                : "Click to manage community"}
            </div>
          </button>
        )}

        {/* Manage Patrons */}
        {user.role === "admin" && (
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className={`p-8 rounded-3xl border text-left flex flex-col justify-between items-start group transition-all duration-300 relative overflow-hidden active:scale-[0.98] ${
              showAddUser
                ? "bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-950/20 text-blue-400"
                : "bg-slate-800/40 border-slate-700/60 text-slate-200 hover:border-slate-600 hover:bg-slate-800/70"
            }`}
          >
            {/* Visual Tech-Accent Bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-[3px] transition-all ${showAddUser ? "bg-blue-500" : "bg-transparent group-hover:bg-slate-500"}`}
            />

            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex justify-between items-center w-full">
                <span
                  className={`text-[10px] font-mono tracking-widest uppercase transition-all ${showAddUser ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400"}`}
                >
                  CREATE PATRON
                </span>
                <span
                  className={`text-xl transition-transform duration-300 ${showAddUser ? "rotate-45" : "group-hover:translate-x-1"}`}
                >
                  {showAddUser ? "✖" : "👥"}
                </span>
              </div>
              <span className="font-black text-xl tracking-tight uppercase">
                {showAddUser ? "Close Patrons" : "Manage Patrons"}
              </span>
              <p className="text-xs text-slate-400 font-normal mt-2 leading-relaxed max-w-[240px]">
                Register incoming students and faculty, assign administrative
                privileges, and manage system login credentials.
              </p>
            </div>

            <div
              className={`mt-6 px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest border transition-all ${
                showAddUser
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400 animate-pulse"
                  : "bg-slate-800 border-slate-700 text-slate-400 group-hover:text-slate-200 group-hover:border-slate-500"
              }`}
            >
              {showAddUser
                ? "• CLICK TO CLOSE PATRONS"
                : "CLICK TO MANAGE PATRON"}
            </div>
          </button>
        )}

        {/* Manage Semester */}
        {user.role === "admin" && (
          <SemesterSettingsCard
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            semLabel={semLabel}
            setSemLabel={setSemLabel}
            semStart={semStart}
            setSemStart={setSemStart}
            semEnd={semEnd}
            setSemEnd={setSemEnd}
            settingsLoading={settingsLoading}
            setSettingsLoading={setSettingsLoading}
            handleUpdateSemester={handleUpdateSemester}
          />
        )}
      </div>

      {/* CALLING SEPARATE COMPONENTS */}
      {showAddComm && (
        <CommunityManager
          handleCreateCommunity={handleCreateCommunity}
          newCommName={newCommName}
          setNewCommName={setNewCommName}
          communities={communities}
          editingId={editingId}
          setEditingId={setEditingId}
          editName={editName}
          setEditName={setEditName}
          handleRename={handleRename}
          handleDeleteCommunity={handleDeleteCommunity}
        />
      )}

      {/* USER SECTION */}
      {showAddUser && (
        <div className="mb-12">
          <SearchFilters
            searchTerm={userSearch}
            setSearchTerm={setUserSearch}
            selectedSector={userSectorFilter}
            setSelectedSector={setUserSectorFilter}
            communities={communities}
            type="Patrons"
          />
          <UserManager
            handleCreateUser={handleCreateUser}
            newUsername={newUsername}
            setNewUsername={setNewUsername}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            newRole={newRole}
            setNewRole={setNewRole}
            usersList={filteredUsers}
            editingUserId={editingUserId}
            setEditingUserId={setEditingUserId}
            editUsername={editUsername}
            setEditUsername={setEditUsername}
            editRole={editRole}
            setEditRole={setEditRole}
            handleUpdateUser={handleUpdateUser}
            handleDeleteUser={handleDeleteUser}
            communities={communities}
            selectedUserDept={selectedUserDept}
            setSelectedUserDept={setSelectedUserDept}
            editDept={editDept}
            setEditDept={setEditDept}
            editPassword={editPassword}
            setEditPassword={setEditPassword}
          />
        </div>
      )}

      {/* REPOSITORY / VAULT VIEW */}
      <div className="bg-slate-800/30 rounded-[2rem] border border-slate-700 p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Repository Overview ({filteredFiles.length})
          </h3>
        </div>

        {/* Search UI for Files */}
        <SearchFilters
          searchTerm={fileSearch}
          setSearchTerm={setFileSearch}
          selectedSector={fileSectorFilter}
          setSelectedSector={setFileSectorFilter}
          communities={communities}
          type="Files"
        />

        {filteredFiles.length === 0 ? (
          <div className="py-20 text-center border-2 border-slate-800 border-dashed rounded-2xl">
            <p className="text-slate-600 font-mono text-sm tracking-widest uppercase">
              [ No Matching Records Found ]
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredFiles.map(
              (
                file, // <--- Use filtered list here
              ) => (
                <div
                  key={file.id}
                  className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl opacity-50 group-hover:opacity-100">
                      📄
                    </span>
                    <div>
                      <p className="font-bold text-slate-200">
                        {file.filename}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-[10px] font-mono text-slate-500 uppercase">
                          UPLOADER: {file.uploaded_by}
                        </p>
                        <span className="text-slate-700 text-[10px]">•</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded uppercase tracking-tighter">
                          Sector: {file.community_name || "General_Mesh"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <a
                      href={`http://localhost:8000/uploads/${file.filename}`}
                      href={`https://customer-yahoo-outing.ngrok-free.dev/backend/uploads/${file.filename}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-slate-700 hover:bg-blue-600 rounded-xl text-[10px] font-black uppercase transition-all"
                    >
                      View
                    </a> */}
                    <button
                      onClick={() => handleViewFile(file.file_name)}
                      className="px-4 py-2 bg-slate-700 hover:bg-blue-600 rounded-xl text-[10px] font-black uppercase transition-all"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleDownload(file.filename)}
                      className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all"
                    >
                      Download
                    </button>

                    {/* Citation */}
                    <button
                      onClick={() => {
                        const text = generateAPA7(file); // Runs your helper logic
                        setActiveCitation(text); // Saves the text to show in the pop-up
                        setShowCiteModal(true); // Opens the modal
                      }}
                      className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all"
                    >
                      Cite this (APA7)
                    </button>

                    {(user.role === "admin" || user.role === "employee") && (
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="p-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      <CitationModal
        isOpen={showCiteModal}
        citation={activeCitation}
        onClose={() => setShowCiteModal(false)}
      />

      {statusMsg && (
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 font-mono text-xs max-w-fit animate-pulse">
          &gt; SYSTEM_RESPONSE: {statusMsg}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
