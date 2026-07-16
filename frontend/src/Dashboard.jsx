/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Spline from "@splinetool/react-spline";
import CommunityManager from "./components/CommunityManager";
import UserManager from "./components/UserManager";
import { DeleteIcon } from "./components/Icons.jsx";
import StatsBar from "./components/StatsBar";
import SearchFilters from "./components/SearchFilters";
import CitationModal from "./components/CitationModal"; // Adjust path as needed
import { generateAPA7 } from "./components/utils/citationHelper.js";
import HeaderNav from "./components/HeaderNav.jsx";
import StudentHeaderNav from "./components/StudentHeaderNav.jsx";
import SemesterSettingsCard from "./components/SemesterSettingsCard.jsx";
import ToastNotification from "./components/ToastNotification.jsx";
import ConfirmationModal from "./components/ConfirmationModal.jsx";
import EbookManager from "./components/EbookManager.jsx";
import AbstractModal from "./components/AbstractModal.jsx";

// const API_BASE = "http://localhost:8000/api";
const API_BASE = "https://explain-banana-bucked.ngrok-free.dev/backend/api";

function Dashboard({ user, logout }) {
  const [currentView, setCurrentView] = useState("papers");
  const [activeSection, setActiveSection] = useState("home");
  const [files, setFiles] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [communities, setCommunities] = useState([]);
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
  const [toast, setToast] = useState({ message: null, type: "success" });
  const [selectedAbstractFile, setSelectedAbstractFile] = useState(null);
  const [showAbstractModal, setShowAbstractModal] = useState(false);
  const [abstract, setAbstract] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    targetId: null,
    type: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [ebooksList, setEbooksList] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newCollName, setNewCollName] = useState("");
  const [editingCollId, setEditingCollId] = useState(null);
  const [editCollName, setEditCollName] = useState("");

  // Stats check
  const [stats, setStats] = useState({
    nodes: 0,
    archives: 0,
    sectors: 0,
    dailyUsers: 0,
    weeklyUsers: 0,
    monthlyUsers: 0,
    yearlyUsers: 0,
    activeFilteredCount: null,
    dailyUploads: 0,
    weeklyUploads: 0,
    semesterLabel: "Active Semester",
    semesterUploads: 0,
  });

  // Calender modulation trigger engine
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
        fetchStats();
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

  // tunnel setup, don't delete
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

  const fetchEbooks = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_ebooks.php`, ngrokConfig);
      if (Array.isArray(res.data)) setEbooksList(res.data);
    } catch (err) {
      console.error(err);
      setStatusMsg("Ebook data synchronization failed.");
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

  const fetchCollections = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/get_collections.php`,
        ngrokConfig,
      );
      if (Array.isArray(res.data)) setCollections(res.data);
    } catch (err) {
      console.error("Collection Fetch Error:", err);
      setStatusMsg("Failed to sync collection registries.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = useCallback(async (filters = null) => {
    try {
      // Build dynamic params configuration object
      const config = {
        ...ngrokConfig,
        params: {},
      };

      // If StatsBar changed a dropdown, inject them into the query params
      if (filters && filters.timeframe) {
        config.params = {
          timeframe: filters.timeframe,
          day: filters.day,
          week: filters.week,
          month: filters.month,
          year: filters.year,
        };
      }

      const res = await axios.get(`${API_BASE}/get_stats.php`, config);
      if (res.data.status === "success") {
        setStats(res.data.stats); // This updates the state

        // Auto-seed text inputs with the active values from database
        if (res.data.stats.semesterLabel) {
          setSemLabel(res.data.stats.semesterLabel);
        }
        if (res.data.stats.semesterStart) {
          setSemStart(res.data.stats.semesterStart);
        }
        if (res.data.stats.semesterEnd) {
          setSemEnd(res.data.stats.semesterEnd);
        }
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
    fetchEbooks();
    fetchCollections();
  }, [fetchFiles, fetchUsers, fetchCommunities, fetchStats, fetchEbooks, fetchCollections]);

  const handleUpdateUser = async (id) => {
    if (!editUsername.trim()) {
      setToast({
        message: "Update failed: Username field cannot be empty.",
        type: "error",
      });
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/update_user.php`, {
        id: id,
        username: editUsername,
        role: editRole,
        community_id: editDept,
        password: editPassword,
      });

      if (res.data.status === "success") {
        // if (typeof fetchUsers === "function") await fetchUsers();
        // await fetchUsers();
        setEditingUserId(null);
        setEditPassword("");
        // setStatusMsg("User node reconfigured.");

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

        setToast({
          message:
            res.data.message ||
            `User profile for '${editUsername}' updated successfully.`,
          type: "success",
        });

        if (typeof fetchUsers === "function") await fetchUsers();
        if (typeof fetchStats === "function") await fetchStats();
      } else {
        setToast({
          message:
            res.data.message || "Failed to save configuration modifications.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      // setStatusMsg("Update failed.");

      setToast({
        message:
          "Update failed: Severe handshake exception with core database architecture.",
        type: "error",
      });
    }
  };

  const handleDeleteUser = async (id) => {
    if (!id) return;

    try {
      const res = await axios.post(`${API_BASE}/delete_user.php`, { id });
      if (res.data.status === "success") {
        if (typeof fetchUsers === "function") await fetchUsers();
        setUsersList(usersList.filter((u) => u.id !== id));

        setToast({
          message:
            res.data.message ||
            "User record successfully purged from repository.",
          type: "success",
        });
      } else {
        setToast({
          message:
            res.data.message ||
            "Termination request refused by repository core.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      // setStatusMsg("Delete failed.");
      setToast({
        message:
          err.response?.data?.message ||
          "Termination failed: Severe handshake exception with core server database.",
        type: "error",
      });
    }
  };

  const handleRename = async (id) => {
    if (!editName.trim()) {
      setToast({
        message: "Configuration rejected: Community name cannot be blank.",
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.post(
        // "http://localhost:8000/api/update_community.php",
        "https://explain-banana-bucked.ngrok-free.dev/backend/api/update_community.php",
        { id: id, name: editName },
      );
      if (response.data.status === "success") {
        setCommunities(
          communities.map((c) => (c.id === id ? { ...c, name: editName } : c)),
        );
        setEditingId(null);

        setToast({
          message:
            response.data.message ||
            `Community configuration node updated to '${editName}'.`,
          type: "success",
        });
      } else {
        setToast({
          message:
            response.data.message ||
            "Modification payload rejected by core repository.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        message:
          err.response?.data?.message ||
          "Reconfiguration failed: Severe handshake exception with core database architecture.",
        type: "error",
      });
    }
  };

  const handleDeleteCommunity = async (id) => {
    if (!id) return;

    try {
      const response = await axios.post(
        // "http://localhost:8000/api/delete_community.php",
        "https://explain-banana-bucked.ngrok-free.dev/backend/api/delete_community.php",
        { id },
      );
      if (response.data.status === "success") {
        if (typeof fetchCommunities === "function") await fetchCommunities();
        setCommunities(communities.filter((c) => c.id !== id));

        setToast({
          message:
            response.data.message ||
            "Sector records permanently purged from repository configuration.",
          type: "success",
        });
      } else {
        setToast({
          message:
            response.data.message ||
            "Termination request refused by repository core.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        message:
          err.response?.data?.message ||
          "Termination failed: Severe handshake exception with core server database.",
        type: "error",
      });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedTargetComm) {
      setToast({
        message:
          "SYSTEM_REJECTION: Select a Target Sector and load a file descriptor asset first.",
        type: "error",
      });
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
    formData.append("abstract", abstract);

    try {
      setIsUploading(true);

      const res = await axios.post(`${API_BASE}/upload.php`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status === "success") {
        fetchFiles();
        setPaperTitle("");
        setPaperAuthor("");
        setPaperYear("");
        setPaperKeywords("");
        setSelectedTargetComm("");
        setAbstract("");

        setToast({
          message:
            res.data.message ||
            "File uploaded and indexed into sector directory successfully!",
          type: "success",
        });
      } else {
        setToast({
          message:
            res.data.message ||
            "Archive Refused: File verification validation failed.",
          type: "error",
        });
      }

      fetchFiles();
      fetchStats();
    } catch (err) {
      console.error(err);
      setToast({
        message:
          err.response?.data?.message ||
          "Archive Failed: Severe network pipeline or server engine processing exception.",
        type: "error",
      });
    } finally {
      // UNLOCK BUTTON: Turn off loading state regardless of whether it succeeded or crashed
      setIsUploading(false);
    }
  };

  const handleViewFile = (filename) => {
    if (!filename) {
      setToast({
        message: "VIEW_ERROR: Collections identifier missing.",
        type: "error",
      });
      return;
    }

    // Added &ngrok-skip-browser-warning=true directly to the URL structure
    const fileUrl = `https://explain-banana-bucked.ngrok-free.dev/backend/api/view_file.php?file=${encodeURIComponent(filename)}&ngrok-skip-browser-warning=true`;
    window.open(fileUrl, "_blank");
  };

  // Dedicated Document Engine for Ebooks & Textbooks
  const handleViewEbook = (filename) => {
    if (!filename) {
      setToast({
        message: "VIEW_ERROR: Ebook identifier missing.",
        type: "error",
      });
      return;
    }
    // Connects directly to your view_ebooks.php backend script file.
    const fileUrl = `https://explain-banana-bucked.ngrok-free.dev/backend/api/view_ebooks.php?file=${encodeURIComponent(filename)}&ngrok-skip-browser-warning=true`;
    window.open(fileUrl, "_blank");
  };

const handleCreateCollection = async (e) => {
    e.preventDefault();

    if (!newCollName.trim()) {
      setToast({
        message: "Initialization rejected: Collection name cannot be empty.",
        type: "error",
      });
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/create_collection.php`, {
        name: newCollName.trim(),
      });

      if (res.data.status === "success") {
        setNewCollName(""); // Clear the text input instantly

        setToast({
          message: res.data.message || `Collection successfully initialized.`,
          type: "success",
        });

        // 🌟 SINGLE SOURCE OF TRUTH: Force a single fresh database pull
        if (typeof fetchCollections === "function") {
          await fetchCollections(); 
        }
        if (typeof fetchStats === "function") {
          await fetchStats();
        }

      } else {
        setToast({
          message: res.data.message || "Initialization aborted by engine.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || "System Error: Handshake exception.",
        type: "error",
      });
    }
  };

const handleRenameCollection = async (id) => {
  if (!editCollName.trim()) {
    setToast({
      message: "Modification aborted: Target value cannot be empty.",
      type: "error",
    });
    return;
  }

  try {
    const response = await axios.post(
      `${API_BASE}/update_collection.php`,
      { id: id, name: editCollName.trim() }
    );

    if (response.data.status === "success") {
      // Optimistically update frontend state list array array mapping
      setCollections(
        collections.map((c) =>
          c.id === id ? { ...c, name: editCollName.trim() } : c
        )
      );
      setEditingCollId(null); // Exit inline edit view mode

      setToast({
        message: response.data.message || "Collection name updated cleanly.",
        type: "success",
      });
    } else {
      setToast({
        message: response.data.message || "Modification payload rejected.",
        type: "error",
      });
    }
  } catch (err) {
    console.error("Rename Collection Error:", err);
    setToast({
      message: err.response?.data?.message || "System Error: Failed to rewrite collection asset data.",
      type: "error",
    });
  }
};

  const handleCreateCommunity = async (e) => {
    e.preventDefault();

    // Frontend data gating validation
    if (!newCommName.trim()) {
      setToast({
        message:
          "Initialization rejected: Sector parameter target name cannot be empty.",
        type: "error",
      });
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/create_community.php`, {
        name: newCommName.trim(),
      });

      // Success handling
      if (res.data.status === "success") {
        setNewCommName(""); // Reset text field cache immediately

        setToast({
          message:
            res.data.message ||
            `Sector '${newCommName}' successfully initialized.`,
          type: "success",
        });

        // Trigger dynamic system metrics data-sync refreshes
        if (typeof fetchCommunities === "function") await fetchCommunities();
        if (typeof fetchStats === "function") await fetchStats();

        // Backend rejection
      } else {
        setToast({
          message:
            res.data.message ||
            "Initialization aborted: Core database engine rejected the payload.",
          type: "error",
        });
      }

      // Hardware/network breakage handlers
    } catch (err) {
      console.error(err);
      setToast({
        message:
          err.response?.data?.message ||
          "System Error: Severe handshake exception during sector initialization.",
        type: "error",
      });
    }
  };

    const handleDeleteCollection = async (id) => {
    if (!id) return;

    try {
      const response = await axios.post(
        `${API_BASE}/delete_collection.php`,
        { id },
      );
      if (response.data.status === "success") {
        if (typeof fetchCollections === "function") await fetchCollections();
        setCollections(collections.filter((c) => c.id !== id));

        setToast({
          message:
            response.data.message ||
            "Collection records permanently purged from repository configuration.",
          type: "success",
        });
      } else {
        setToast({
          message:
            response.data.message ||
            "Termination request refused by repository core.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        message:
          err.response?.data?.message ||
          "Termination failed: Severe handshake exception with core server database.",
        type: "error",
      });
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!newUsername.trim() || !newPassword.trim()) {
      setToast({
        message:
          "Registration failed: Both username and password fields are required.",
        type: "error",
      });
      return;
    }

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

        setToast({
          message:
            res.data.message ||
            `Account successfully created for ${newUsername}!`,
          type: "success",
        });
      } else {
        setToast({
          message:
            res.data.message || "Registration refused by repository core.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);

      setToast({
        message:
          "Registration failed: Unable to communicate with authentication system.",
        type: "error",
      });
    }
  };

  const handleDeleteFile = async (id) => {
    if (!id) return;

    try {
      const res = await axios.post(`${API_BASE}/delete_file.php`, { id });
      if (res.data.status === "success") {
        setFiles(files.filter((f) => f.id !== id));

        setToast({
          message:
            res.data.message ||
            "Asset successfully purged from the repository vault.",
          type: "success",
        });

        // Trigger dynamic system metrics data-sync refreshes
        if (typeof fetchFiles === "function") await fetchFiles();
        if (typeof fetchStats === "function") await fetchStats();
      } else {
        setToast({
          message:
            res.data.message ||
            "Purge Refused: Target asset locked or write-protected.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);

      setToast({
        message:
          err.response?.data?.message ||
          "Purge Failed: Handshake exception with server core.",
        type: "error",
      });
    }
  };

  const handleDownload = async (filename) => {
    try {
      // Fixed the syntax error, removed leading backslash and trailing backtick
      // const fileUrl = `http://localhost:8000/api/download.php?file=${filename}`;
      const fileUrl = `https://explain-banana-bucked.ngrok-free.dev/backend/api/download.php?file=${filename}`;

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = fileUrl;

      // The PHP script handles the "attachment" headers, so this triggers the save dialog
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);

      setToast({
        message: `Download initiated successfully for '${filename}'.`,
        type: "success",
      });
    } catch (err) {
      console.error("Download error:", err);

      setToast({
        message:
          "Download failed: High-latency handshake rejection with data asset repository.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans selection:bg-blue-500/30 relative overflow-x-hidden">
      <ToastNotification
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: null, type: "success" })}
      />

<ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.type === "community"
            ? "TERMINATE COMMUNITY?"
            : confirmModal.type === "file"
              ? "PURGE ITEM FROM REPOSITORY?"
              : confirmModal.type === "collection"
                ? "TERMINATE COLLECTION?" // 🌟 Dynamic title update
                : "REMOVE?"
        }
        message={
          confirmModal.type === "community"
            ? "Warning: This process will permanently dissolve this community sector block. Any connection links mapped here will be severed. This action cannot be undone."
            : confirmModal.type === "file"
              ? "Warning: This process will permanently erase this file asset binary from server storage disks and wipe its metadata indexing data row. This action cannot be undone."
            : confirmModal.type === "collection"
              ? "Warning: This process will permanently dissolve this collection library. Attached assets will be de-referenced. This action cannot be undone." // 🌟 Warning context text
              : "Warning: This process will immediately de-provision this user asset and permanently revoke all repository access permissions. This action cannot be undone."
        }
        confirmText="Confirm"
        cancelText="Cancel"
        isDestructive={true}
        onCancel={() =>
          setConfirmModal({ isOpen: false, targetId: null, type: null })
        }
        onConfirm={async () => {
          if (confirmModal.type === "community") {
            await handleDeleteCommunity(confirmModal.targetId);
          } else if (confirmModal.type === "collection") {
            await handleDeleteCollection(confirmModal.targetId); // 🌟 Direct function trigger link
          } else if (confirmModal.type === "file") {
            await handleDeleteFile(confirmModal.targetId);
          } else if (confirmModal.type === "ebook") {
            try {
              const res = await axios.post(`${API_BASE}/delete_ebook.php`, {
                id: confirmModal.targetId,
              });
              if (res.data.status === "success") {
                setEbooksList(
                  ebooksList.filter((b) => b.id !== confirmModal.targetId),
                );
                setToast({
                  message: "Ebook deleted from vault.",
                  type: "success",
                });
                fetchStats();
              }
            } catch (err) {
              console.error(err);
              setToast({ message: "Purge execution failure.", type: "error" });
            }
          } else {
            await handleDeleteUser(confirmModal.targetId);
          }
          setConfirmModal({ isOpen: false, targetId: null, type: null });
        }}
      />

      <div className="fixed inset-0 w-full h-full z-0 pointer-events-auto">
        <Spline scene="https://prod.spline.design/fyKP5gxeJ0N1Ae9c/scene.splinecode" />

        {/* Overlays */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-32 bg-gradient-to-br from-transparent via-slate-950/100 to-slate-950 pointer-events-none filter blur-sm" />
      </div>

      {/* Foreground */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {activeSection === "collections" && (
          <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-40 mix-blend-screen animate-in fade-in duration-700">
            {/* <Spline scene="https://prod.spline.design/pvk98tA5U2ehsKYW/scene.splinecode" /> */}
            {/* <Spline scene="https://prod.spline.design/8Sx-RvYPYg4RFYj6/scene.splinecode" /> */}
            <Spline scene="https://prod.spline.design/y9kiQ0qCdATiQ1s0/scene.splinecode" />

            {/* Overlays */}
            <div className="absolute bottom-0 right-0 w-full sm:w-[50vw] h-[25vh] bg-gradient-to-br from-transparent via-slate-950/40 to-slate-950 pointer-events-none backdrop-blur-[2px]" />
            <div className="absolute bottom-0 right-0 w-full sm:w-96 h-25 bg-gradient-to-br from-transparent via-slate-950/80 to-slate-950 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full sm:w-80 h-48 bg-slate-950 pointer-events-none filter blur-xl opacity-90" />
          </div>
        )}

        {activeSection === "communities" && (
          <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-40 mix-blend-screen animate-in fade-in duration-700">
            {/* <Spline scene="https://prod.spline.design/pvk98tA5U2ehsKYW/scene.splinecode" /> */}
            <Spline scene="https://prod.spline.design/8Sx-RvYPYg4RFYj6/scene.splinecode" />
            {/* <Spline scene="https://prod.spline.design/y9kiQ0qCdATiQ1s0/scene.splinecode" /> */}

            {/* Overlays */}
            <div className="absolute bottom-0 right-0 w-full sm:w-[50vw] h-[40vh] sm:h-[50vh] bg-gradient-to-br from-transparent via-slate-950/20 sm:via-slate-950/40 to-slate-950 pointer-events-none backdrop-blur-[2px]" />
            <div className="absolute bottom-0 right-0 w-full sm:w-96 h-36 sm:h-48 bg-gradient-to-br from-transparent via-slate-950/60 sm:via-slate-950/80 to-slate-950 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full sm:w-80 h-36 sm:h-48 bg-slate-950 pointer-events-none filter blur-xl opacity-90" />
          </div>
        )}

        {activeSection === "patrons" && (
          <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-40 mix-blend-screen animate-in fade-in duration-700">
            <Spline scene="https://prod.spline.design/pvk98tA5U2ehsKYW/scene.splinecode" />
            {/* <Spline scene="https://prod.spline.design/8Sx-RvYPYg4RFYj6/scene.splinecode" /> */}
            {/* <Spline scene="https://prod.spline.design/y9kiQ0qCdATiQ1s0/scene.splinecode" /> */}

            {/* Overlays */}
            <div className="absolute bottom-0 right-0 w-full sm:w-[50vw] h-[40vh] sm:h-[50vh] bg-gradient-to-br from-transparent via-slate-950/20 sm:via-slate-950/40 to-slate-950 pointer-events-none backdrop-blur-[2px]" />
            <div className="absolute bottom-0 right-0 w-full sm:w-96 h-36 sm:h-48 bg-gradient-to-br from-transparent via-slate-950/60 sm:via-slate-950/80 to-slate-950 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full sm:w-80 h-36 sm:h-48 bg-slate-950 pointer-events-none filter blur-xl opacity-90" />
          </div>
        )}

        {/* Header for Admins and Employees */}
        {(user.role === "admin" || user.role === "employee") && (
          <HeaderNav
            currentView={currentView}
            setCurrentView={setCurrentView}
            adminUsername={user?.username || "admin"}
            onLogout={logout}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            userRole={user.role}
          />
        )}

        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 -mt-30 relative z-10 flex flex-col gap-6">
          {activeSection === "patrons" && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300"></div>
          )}
        </main>

        {/* Header for students only */}
        {user && user.role === "student" && (
          <StudentHeaderNav
            username={user.username}
            userRole={user.role}
            onLogout={logout}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        )}

        {user && user.role === "student" && (
          <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-40 mix-blend-screen animate-in fade-in duration-700">
            <Spline scene="https://prod.spline.design/pvk98tA5U2ehsKYW/scene.splinecode" />
            {/* <Spline scene="https://prod.spline.design/8Sx-RvYPYg4RFYj6/scene.splinecode" /> */}
            {/* <Spline scene="https://prod.spline.design/y9kiQ0qCdATiQ1s0/scene.splinecode" /> */}

            {/* Overlays */}
            <div className="absolute bottom-0 right-0 w-full sm:w-[50vw] h-[40vh] sm:h-[50vh] bg-gradient-to-br from-transparent via-slate-950/20 sm:via-slate-950/40 to-slate-950 pointer-events-none backdrop-blur-[2px]" />
            <div className="absolute bottom-0 right-0 w-full sm:w-96 h-36 sm:h-48 bg-gradient-to-br from-transparent via-slate-950/60 sm:via-slate-950/80 to-slate-950 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full sm:w-80 h-36 sm:h-48 bg-slate-950 pointer-events-none filter blur-xl opacity-90" />
          </div>
        )}

        {/* Home tab view */}
        {activeSection === "home" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Statistics: Shows only to Admins and employees */}
            {user && (user.role === "admin" || user.role === "employee") && (
              <StatsBar stats={stats} onFilterChange={fetchStats} />
            )}

            {/* Metrics timeline monitoring */}
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

                  {/* Progress Bar */}
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
                      <p className="text-[9px] text-slate-500 uppercase">
                        Today
                      </p>
                      <p className="text-xs text-blue-400 font-bold">
                        +{stats.dailyUploads || 0}
                      </p>
                    </div>
                    <div className="border-l border-slate-800 pl-4">
                      <p className="text-[9px] text-slate-500 uppercase">
                        Weekly
                      </p>
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
          </div>
        )}

        {/* Manage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 items-start">
          {/* Manage Collections Form Card */}
          {activeSection === "collections" &&
            (user.role === "admin" || user.role === "employee") && (
              <div className="bg-slate-900/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-black/50 border border-slate-800/80 hover:border-blue-500/30 flex flex-col justify-between relative overflow-hidden transition-all duration-500 md:col-span-2 w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-top-1.5 duration-200">
                <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none mix-blend-screen" />

                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-blue-600 to-transparent opacity-60" />
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex justify-between items-center w-full"></div>
                  <span className="font-black text-xl tracking-tight uppercase text-white">
                    Manage Collections
                  </span>
                  <p className="text-xs text-white font-normal mt-2 leading-relaxed w-full md:max-w-[70%] opacity-90">
                    Index raw thesis manuscripts, inject searchable metadata
                    tags, and route assets directly into secure sector vaults.
                  </p>
                </div>

                {/* Metadata input form */}
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

                  <textarea
                    placeholder="ABSTRACT / SUMMARY"
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white p-2.5 sm:p-3 rounded-xl text-[11px] sm:text-xs font-bold outline-none focus:ring-2 ring-blue-500 transition-all placeholder:text-slate-500 resize-none"
                  />
                </div>

                {/* Section selector*/}
                <div className="mt-3 relative">
                  <select
                    value={selectedTargetComm}
                    onChange={(e) => setSelectedTargetComm(e.target.value)}
                    className="w-full bg-blue-800 border border-blue-400/30 text-white p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-300 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">SELECT COMMUNITY</option>
                    {communities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit button */}
                <label
                  className={`mt-4 group p-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest border active:scale-[0.98] w-full max-w-xs mx-auto ${
                    isUploading
                      ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed animate-pulse" // 👈 Loading State Appearance
                      : selectedTargetComm
                        ? "bg-white text-blue-600 border-white hover:bg-blue-50 cursor-pointer" // 👈 Active State Appearance
                        : "bg-blue-800/40 text-blue-400/60 border-blue-700/40 cursor-not-allowed opacity-50" // 👈 Idle Guard Appearance
                  }`}
                >
                  {/* Traffic handler logic */}
                  {isUploading
                    ? "Routing to Sector Collections..."
                    : selectedTargetComm
                      ? "Upload Archive"
                      : "Choose Community First"}

                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={!selectedTargetComm || isUploading} // 👈 Locks up the file input handler completely during submission
                  />
                </label>
              </div>
            )}

          {/* Manage semester configuration settings */}
          {activeSection === "semester" && user.role === "admin" && (
            <div className="md:col-span-2 animate-in fade-in slide-in-from-top-1.5 duration-200">
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
            </div>
          )}
        </div>

        {/* Calling separate components */}
        {activeSection === "communities" &&
          (user.role === "admin" || user.role === "employee") && (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 -mt-5 animate-in fade-in duration-300 -mt-18">
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
                setConfirmModal={setConfirmModal}
                collections={collections}
                newCollName={newCollName}
                setNewCollName={setNewCollName}
                handleCreateCollection={handleCreateCollection}
                editingCollId={editingCollId}
                setEditingCollId={setEditingCollId}
                editCollName={editCollName}
                setEditCollName={setEditCollName}
                handleRenameCollection={handleRenameCollection}
                handleDeleteCollection={handleDeleteCollection}
              />
            </div>
          )}

        {/* Ebook section conditional trigger mount */}
        {activeSection === "ebooks" && (
          <div className="mb-12 animate-in fade-in duration-200">
            <EbookManager
              user={user}
              // communities={communities}
              collections={collections}
              ebooksList={ebooksList}
              fetchEbooks={fetchEbooks}
              fetchStats={fetchStats}
              setToast={setToast}
              setConfirmModal={setConfirmModal}
              API_BASE={API_BASE}
              handleViewEbook={handleViewEbook}
            />
          </div>
        )}

        {/* User section */}
        {activeSection === "patrons" && (
          <div className="mb-12 animate-in fade-in duration-200 -mt-15">
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
              setConfirmModal={setConfirmModal}
            />
          </div>
        )}

        {/* Edit rofile config */}
        {activeSection === "edit-profile" && (
          <div className="max-w-md mx-auto p-8 text-center bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl font-mono animate-in fade-in duration-200">
            <h3 className="text-slate-200 text-xs font-bold uppercase tracking-wider">
              Account Identity Config
            </h3>
            <p className="text-[11px] text-slate-500 mt-2">
              Operator User:{" "}
              <span className="text-blue-400 font-bold">{user?.username}</span>
            </p>
            <div className="mt-6 p-4 border border-dashed border-slate-800 rounded-xl text-xs text-slate-600">
              Profile Update UI Target Panel Container
            </div>
          </div>
        )}

        {/* System repository, "about" tab */}
        {activeSection === "about" && (
          <div className="max-w-xl mx-auto p-8 bg-slate-900/30 backdrop-blur-xl border border-slate-800 rounded-3xl text-center space-y-4 font-mono animate-in fade-in duration-200">
            <h3 className="text-slate-200 font-black text-sm uppercase tracking-widest">
              About Repositorium
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              KCPLibrary Repositorium is an enterprise-grade digital web vault
              designed for metadata filing, asset deployment encryption, and
              resource collection archives.
            </p>
            <div className="text-[10px] text-slate-600 border-t border-slate-800/80 pt-4">
              System Version v2.4.0-mesh
            </div>
          </div>
        )}

 {/* Repository / Collections view - Dynamic for Collections or active asset monitoring views */}
        {(activeSection === "collections" ||
          activeSection === "home" ||
          user.role === "student") &&
          activeSection !== "ebooks" && (
            <div className="bg-slate-800/30 rounded-2xl md:rounded-[2rem] border border-slate-700 p-4 sm:p-8 animate-in fade-in slide-in-from-top-1 duration-200 -mt-5">
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
                <div className="py-16 md:py-20 text-center border-2 border-slate-800 border-dashed rounded-2xl">
                  <p className="text-slate-600 font-mono text-xs sm:text-sm tracking-widest uppercase">
                    [ No Matching Records Found ]
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredFiles.map((file) => (
                    /* 🟢 FIXED: Forced to 'flex-col' unconditionally. Filename stays on top, buttons go below. */
                    <div
                      key={file.id}
                      className="flex flex-col bg-slate-800/50 p-4 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all group gap-4 w-full overflow-hidden"
                    >
                      {/* File details - Top Row */}
                      <div className="flex items-start gap-3 sm:gap-4 w-full min-w-0">
                        <span className="text-xl sm:text-2xl opacity-50 group-hover:opacity-100 shrink-0 mt-0.5">
                          📄
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm sm:text-base text-slate-200 break-all sm:break-words">
                            {
                              user && user.role === "student"
                                ? file.paper_title || file.filename
                                : file.filename
                            }
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                            <p className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                              UPLOADER: {file.uploaded_by}
                            </p>
                            <span className="hidden sm:inline text-slate-700 text-[10px]">
                              •
                            </span>
                            <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] sm:text-[9px] font-bold rounded uppercase tracking-tighter">
                              Sector: {file.community_name || "General_Mesh"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions interface container - Bottom Row */}
                      {/* 🟢 FIXED: Changed grid/flex combo to a clean flex-row with justify-between */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 w-full gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAbstractFile(file);
                              setShowAbstractModal(true);
                            }}
                            className="px-3 sm:px-4 py-2 bg-slate-700 hover:bg-blue-600 rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all text-center text-slate-200"
                          >
                            VIEW
                          </button>

                          {(user.role === "admin" ||
                            user.role === "employee") && (
                            <button
                              onClick={() => handleDownload(file.filename)}
                              className="px-3 sm:px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all text-center"
                            >
                              Download
                            </button>
                          )}

                          <button
                            onClick={() => {
                              const text = generateAPA7(file);
                              setActiveCitation(text);
                              setShowCiteModal(true);
                            }}
                            className="px-3 sm:px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all text-center"
                          >
                            Cite
                          </button>
                        </div>

                        {/* Delete icon perfectly aligned to the right side */}
                        {(user.role === "admin" ||
                          user.role === "employee") && (
                          <button
                            onClick={() =>
                              setConfirmModal({
                                isOpen: true,
                                targetId: file.id,
                                type: "file",
                              })
                            }
                            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-800 rounded-lg transition-all shrink-0"
                            title="Purge File Asset"
                          >
                            <DeleteIcon />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        <CitationModal
          isOpen={showCiteModal}
          citation={activeCitation}
          onClose={() => setShowCiteModal(false)}
        />

        <AbstractModal
          isOpen={showAbstractModal}
          file={selectedAbstractFile}
          onClose={() => {
            setShowAbstractModal(false);
            setSelectedAbstractFile(null);
          }}
          onOpenPdf={handleViewFile} // Seamlessly reuse your exact view_file.php system!
        />

        {statusMsg && (
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 font-mono text-xs max-w-fit animate-pulse">
            &gt; SYSTEM_RESPONSE: {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
