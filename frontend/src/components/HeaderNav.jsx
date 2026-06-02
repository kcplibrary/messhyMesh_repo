// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";

const HeaderNav = ({
  adminUsername,
  userRole = "admin",
  onLogout,
  activeSection,
  setActiveSection,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "home", label: "Home", },
    { id: "collections", label: "Collections", role: "employee" },
    { id: "communities", label: "Communities",  role: "employee" },
    { id: "patrons", label: "Patrons", role: "admin" },
    // { id: "about", label: "About" },
  ];

  const shouldRenderItem = (item) => {
    if (!item.role) return true;
    if (userRole === "admin") return true;
    if (userRole === "employee" && item.role === "employee") return true;
    return false;
  };

  return (
    <header className="w-full bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 transition-all mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* LEFT COMPONENT: BRAND ANCHOR */}
        <div
          onClick={() => {
            setActiveSection("home");
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md shadow-black/30 overflow-hidden transition-transform group-hover:scale-105 p-1">
            <img
              src="/kcplibraries.png"
              alt="KCPLibrary Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.classList.add(
                  "bg-gradient-to-tr",
                  "from-blue-600",
                  "to-indigo-500",
                  "p-0",
                );
                e.target.parentNode.innerHTML =
                  '<span class="text-white font-mono font-black text-xs">MM</span>';
              }}
            />
          </div>

          <div>
            <h1 className="text-sm font-black tracking-widest text-slate-100 uppercase transition-colors group-hover:text-blue-400">
              KCPLIBRARY
            </h1>
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider leading-none mt-0.5">
              REPOSITORIUM
            </p>
          </div>
        </div>

        {/* CENTER COMPONENT: REFINED GLOWING ROUNDED CAPSULE NAVIGATION */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/20 border border-slate-800/30 px-2 py-1.5 rounded-2xl">
          {navItems.filter(shouldRenderItem).map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center gap-2 relative ${
                  isActive
                    ? "text-blue-400 bg-blue-500/10 border border-blue-500/10 shadow-sm shadow-blue-500/5 font-extrabold"
                    : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-800/30"
                }`}
              >
                <span className="text-xs opacity-80">{item.icon}</span>
                {item.label}

                {/* Subtle decorative dot metric indicating active tab status */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-lg shadow-blue-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT COMPONENT: USER PROFILE HUB & MOBILE TOGGLE */}
        <div className="flex items-center gap-4">
          {/* PROFILE HUBS BUTTON CONTAINER */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-3 text-left group bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/40 px-3 py-1.5 rounded-xl transition-all select-none"
            >
              {/* <div className="text-right hidden sm:block">
                <div className="text-[11px] font-mono font-bold text-slate-300 group-hover:text-white transition-colors leading-none">
                  {adminUsername || "OPERATOR"}
                </div>
                <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mt-1 leading-none font-bold">
                  {userRole}
                </div>
              </div> */}

              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-400/40 flex items-center justify-center font-mono font-bold text-blue-400 uppercase text-[11px] transition-all">
                {(adminUsername || "U").charAt(0)}
              </div>
            </button>

            {/* PROFILE OPTIONS DROPDOWN */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700/60 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1.5 duration-150 backdrop-blur-xl">
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                    Signed in as
                  </p>
                  <p className="text-xs font-bold text-slate-300 truncate font-mono mt-0.5">
                    {adminUsername}
                  </p>
                </div>

                {/* <button
                  onClick={() => {
                    setActiveSection("edit-profile");
                    setProfileDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                    activeSection === "edit-profile"
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  👤 Edit Profile
                </button> */}

                {userRole === "admin" && (
                  <button
                    onClick={() => {
                      setActiveSection("semester");
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[10px] font-mono font-bold uppercase tracking-wider transition-colors mt-0.5 ${
                      activeSection === "semester"
                        ? "bg-purple-500/10 text-purple-400"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    ⚙️ System Config
                  </button>
                )}

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 transition-all border-t border-slate-800 mt-1 pt-2"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE BURGER BUTTON (Visible on Mobile/Tablet Only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/80 text-slate-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU SLIDEOUT SIDE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 bg-slate-950/80 backdrop-blur-sm z-40 transition-all"
          ref={mobileMenuRef}
        >
          <div className="bg-slate-900 border-b border-slate-800 p-4 space-y-1 animate-in slide-in-from-top duration-200">
            {navItems.filter(shouldRenderItem).map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all ${
                    isActive
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderNav;
