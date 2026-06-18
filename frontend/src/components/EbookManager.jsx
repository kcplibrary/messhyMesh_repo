import { useState } from "react";
import axios from "axios";
import { DeleteIcon } from "./Icons.jsx";
import SearchFilters from "./SearchFilters";

export default function EbookManager({
  user,
  collections, // 🌟 Changed from communities
  ebooksList,
  fetchEbooks,
  fetchStats,
  setToast,
  setConfirmModal,
  API_BASE,
  handleViewEbook,
}) {
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookYear, setBookYear] = useState("");
  const [subjectTags, setSubjectTags] = useState("");
  const [selectedTargetColl, setSelectedTargetColl] = useState(""); // 🌟 Updated state variable pointer
  const [isUploading, setIsUploading] = useState(false);
  const [ebookSearch, setEbookSearch] = useState("");
  const [ebookCollectionFilter, setEbookCollectionFilter] = useState(""); // 🌟 Updated state variable pointer

  // Search filter node logic
  const filteredEbooks = (ebooksList || []).filter((b) => {
    const searchTerm = ebookSearch.toLowerCase();
    const matchesSearch =
      (b.filename || "").toLowerCase().includes(searchTerm) ||
      (b.book_title || "").toLowerCase().includes(searchTerm) ||
      (b.book_author || "").toLowerCase().includes(searchTerm) ||
      (b.subject_tags || "").toLowerCase().includes(searchTerm);

    // 🌟 Check matches against collection_id metadata instead of community_id
    const matchesCollection =
      ebookCollectionFilter === "" ||
      String(b.collection_id) === String(ebookCollectionFilter);

    return matchesSearch && matchesCollection;
  });

  const handleEbookUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedTargetColl) {
      setToast({
        message: "SYSTEM_REJECTION: Select a Target Collection and load a valid document asset first.",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploader", user.username);
    formData.append("collection_id", String(selectedTargetColl)); // 🌟 Updated field flag to collection_id
    formData.append("book_title", bookTitle);
    formData.append("book_author", bookAuthor);
    formData.append("book_year", bookYear);
    formData.append("subject_tags", subjectTags);

    try {
      setIsUploading(true);
      const res = await axios.post(`${API_BASE}/upload_ebook.php`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status === "success") {
        setBookTitle("");
        setBookAuthor("");
        setBookYear("");
        setSubjectTags("");
        setSelectedTargetColl("");
        setToast({ message: res.data.message, type: "success" });
        if (typeof fetchEbooks === "function") await fetchEbooks();
        if (typeof fetchStats === "function") await fetchStats();
      } else {
        setToast({
          message: res.data.message || "Archive Refused.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || "Archive Failed: Server exception.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const fileUrl = `${API_BASE}/download_ebook.php?file=${encodeURIComponent(filename)}&action=download`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToast({
        message: `Download initiated successfully for '${filename}'.`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({ message: "Download failed.", type: "error" });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-200 -mt-12">
      {/* Upload Manager Panel - Visible only to staff Nodes */}
      {(user.role === "admin" || user.role === "employee") && (
        <div className="bg-slate-900/70 backdrop-blur-xl p-5 sm:p-8 rounded-2xl md:rounded-3xl border border-slate-800/80 hover:border-indigo-500/30 flex flex-col justify-between relative overflow-hidden shadow-2xl w-full max-w-5xl mx-auto">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-600 to-transparent opacity-60" />
          <div>
            <span className="font-black text-lg sm:text-xl tracking-tight uppercase text-white">
              Manage Digital Ebooks
            </span>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 sm:mt-2 leading-relaxed max-w-xl">
              Index textbook assets, append structural classifications, and archive data clusters into specific collections.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              placeholder="EBOOK OR TEXTBOOK TITLE"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white p-2.5 sm:p-3 rounded-xl text-[11px] sm:text-xs font-bold outline-none focus:ring-2 ring-indigo-500 transition-all placeholder:text-slate-500"
            />
            <input
              type="text"
              placeholder="PRIMARY AUTHOR / COMPILER"
              value={bookAuthor}
              onChange={(e) => setBookAuthor(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white p-2.5 sm:p-3 rounded-xl text-[11px] sm:text-xs font-bold outline-none focus:ring-2 ring-indigo-500 transition-all placeholder:text-slate-500"
            />
            <input
              type="text"
              placeholder="YEAR OF RELEASE (YYYY)"
              value={bookYear}
              onChange={(e) => setBookYear(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white p-2.5 sm:p-3 rounded-xl text-[11px] sm:text-xs font-bold outline-none focus:ring-2 ring-indigo-500 transition-all placeholder:text-slate-500"
            />
            <input
              type="text"
              placeholder="SUBJECT TAGS / KNOWLEDGE LABELS (COMMA SEPARATED)"
              value={subjectTags}
              onChange={(e) => setSubjectTags(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white p-2.5 sm:p-3 rounded-xl text-[11px] sm:text-xs font-bold outline-none focus:ring-2 ring-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="mt-3">
            {/* 🌟 Drops down options built directly from collections array maps */}
            <select
              value={selectedTargetColl}
              onChange={(e) => setSelectedTargetColl(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-300 p-2.5 sm:p-3 rounded-xl text-[11px] sm:text-xs font-bold outline-none focus:ring-2 ring-indigo-500 transition-all cursor-pointer appearance-none"
            >
              <option value="">SELECT ASSIGNED COLLECTION</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <label
            className={`mt-4 p-3 sm:p-4 rounded-2xl font-black text-[11px] sm:text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest border active:scale-[0.98] w-full max-w-xs mx-auto ${
              isUploading
                ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed animate-pulse"
                : selectedTargetColl
                  ? "bg-white text-indigo-600 border-white hover:bg-slate-100 cursor-pointer"
                  : "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-50"
            }`}
          >
            {isUploading
              ? "Uploading Ebook..."
              : selectedTargetColl
                ? "Upload Ebook"
                : "Choose Collection First"}
            <input
              type="file"
              className="hidden"
              onChange={handleEbookUpload}
              disabled={!selectedTargetColl || isUploading}
            />
          </label>
        </div>
      )}

      {/* Main ebook library display module */}
      <div className="bg-slate-800/30 rounded-2xl md:rounded-[2rem] border border-slate-700 p-4 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Ebook Library ({filteredEbooks.length})
          </h3>
        </div>

        {/* 🌟 Pass collections data parameters to filter bar dropdown layouts */}
        <SearchFilters
          searchTerm={ebookSearch}
          setSearchTerm={setEbookSearch}
          selectedSector={ebookCollectionFilter}
          setSelectedSector={setEbookCollectionFilter}
          communities={collections} 
          type="Ebooks"
        />

        {filteredEbooks.length === 0 ? (
          <div className="py-16 text-center border-2 border-slate-800 border-dashed rounded-2xl">
            <p className="text-slate-600 font-mono text-xs tracking-widest uppercase">
              No Ebook Items Located
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredEbooks.map((book) => (
              /* 🟢 FIXED: Outer wrapper forced into strict flex-col layout configuration */
              <div
                key={book.id}
                className="flex flex-col bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-all group gap-4 w-full overflow-hidden"
              >
                {/* 📁 TOP CONTAINER: Book Metadata Fields */}
                <div className="flex items-start gap-3 sm:gap-4 min-w-0 w-full">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-200 text-sm sm:text-base break-all sm:break-words">
                      {book.book_title || book.filename}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                      By {book.book_author || "Unknown"} ({book.book_year || "N/A"})
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                      <p className="text-[9px] font-mono text-slate-500 uppercase break-all">
                        Tags: {book.subject_tags || "None"}
                      </p>
                      <span className="hidden sm:inline text-slate-700 text-[10px]">
                        •
                      </span>
                      {/* 🌟 Displays collection names dynamically mapped from the join */}
                      <span className="px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-bold rounded uppercase">
                        Collection: {book.collection_name || "General Library"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ⚡ BOTTOM CONTAINER: Actions interface block aligned layout safely stacked underneath */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 w-full gap-2">
                  
                  {/* Primary Functional Action Buttons Group */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleViewEbook(book.filename)}
                      className="px-4 py-2 bg-slate-700 hover:bg-indigo-600 rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all text-center text-slate-200 hover:text-white whitespace-nowrap"
                    >
                      READ
                    </button>

                    {/* DOWNLOAD BUTTON */}
                    {(user.role === "admin" || user.role === "employee") && (
                      <button
                        onClick={() => handleDownload(book.filename)}
                        className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all text-center whitespace-nowrap"
                      >
                        Download
                      </button>
                    )}
                  </div>

                  {/* Standalone administrative delete system anchor */}
                  {(user.role === "admin" || user.role === "employee") && (
                    <button
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          targetId: book.id,
                          type: "ebook",
                        })
                      }
                      className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-800 rounded-lg transition-all flex items-center justify-center shrink-0"
                      title="Purge Ebook Asset"
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
    </div>
  );
}