import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import Dashboard from "./Dashboard";

// const InactivityHandler = ({ timeoutInMinutes, onLogout }) => {
  const InactivityHandler = ({ timeoutInSeconds, onLogout }) => {
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      // timer = setTimeout(onLogout, timeoutInMinutes * 60 * 1000);
      timer = setTimeout(onLogout, timeoutInSeconds * 1000);
    };
    const events = ["mousemove", "mousedown", "keypress", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  // }, [onLogout, timeoutInMinutes]);
  }, [onLogout, timeoutInSeconds]);
  return null;
};

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  // const [user, setUser] = useState(null);

  // 1. AUTO-LOAD: Check if someone is already logged in when the page opens
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
      const response = await axios.post(
        "http://localhost:8000/api/login.php",
        formData,
      );

      if (response.data.status === "connection success") {
        const userData = { username: username, role: response.data.role };

        // 2. THE SAVE: Write to the browser's notebook
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

  // 3. THE CLEAN LOGOUT: Wipes everything
  const handleLogout = () => {
    localStorage.removeItem("mesh_session"); // Rip out the notebook page
    setUser(null); // Switch screen to Login
    setUsername(""); // Clear the text box
    setPassword(""); // Clear the text box
    setMessage("You have been logged out."); // Reset message
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-10">
        <h1 className="text-5xl font-black text-center mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          KCPLIBRARY
        </h1>
        <p className="text-center text-slate-400 mb-10 uppercase tracking-widest text-xs font-bold">
          Secure Archive Access
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-4 bg-slate-900 border border-slate-700 rounded-xl outline-none text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off" // Tells browser NOT to suggest old names
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-4 bg-slate-900 border border-slate-700 rounded-xl outline-none text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-black rounded-xl shadow-lg transition-all text-white">
            LOGIN
          </button>
        </form>

        {message && (
          <div className="mt-8 p-4 rounded-xl text-center font-bold border-2 border-slate-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
