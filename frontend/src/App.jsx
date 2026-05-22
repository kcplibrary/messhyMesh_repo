import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import Dashboard from "./Dashboard";

const InactivityHandler = ({ timeoutInSeconds, onLogout }) => {
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(onLogout, timeoutInSeconds * 1000);
    };
    const events = ["mousemove", "mousedown", "keypress", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [onLogout, timeoutInSeconds]);
  return null;
};

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("mesh_session");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      // const response = await axios.post(
      //   "http://localhost:8000/api/login.php",
      //   formData,
        const response = await axios.post(
        "https://customer-yahoo-outing.ngrok-free.dev/backend/api/login.php",
        formData
      );

      if (response.data.status === "connection success") {
        const userData = { username: username, role: response.data.role };
        localStorage.setItem("mesh_session", JSON.stringify(userData));
        setUser(userData);
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Connection Failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mesh_session");
    setUser(null);
    setUsername("");
    setPassword("");
    setMessage("You have been logged out.");
  };

  if (user) {
    return (
      <>
        <InactivityHandler timeoutInSeconds={900} onLogout={handleLogout} />
        <Dashboard user={user} logout={handleLogout} />
      </>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-900 flex items-center justify-center p-4 sm:p-6 md:p-8 text-slate-100 selection:bg-blue-500/30">
      <div className="w-full max-w-sm sm:max-w-md bg-slate-800 border border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 transition-all duration-300">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-1 sm:mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
          KCPLIBRARY
        </h1>
        <p className="text-center text-slate-400 mb-6 sm:mb-8 md:mb-10 uppercase tracking-[0.15em] text-[10px] sm:text-xs font-bold">
          School Repository
        </p>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 sm:py-4 bg-slate-900 border border-slate-700 rounded-xl outline-none text-white text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 sm:py-4 bg-slate-900 border border-slate-700 rounded-xl outline-none text-white text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] font-black rounded-xl shadow-lg transition-all text-white text-sm sm:text-base tracking-wide">
            LOGIN
          </button>
        </form>

        {message && (
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl text-center font-bold text-xs sm:text-sm border border-slate-600 bg-slate-900/40 text-slate-300">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;