import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./index.css";
import Dashboard from "./Dashboard";
import Spline from "@splinetool/react-spline";

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
  const [isRegistering, setIsRegistering] = useState(false); // Toggles between Login and Registration views
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("mesh_session");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (!message) return;

    const messageTimer = setTimeout(() => {
      setMessage("");
    }, 4000);

    return () => clearTimeout(messageTimer);
  }, [message]);

  const fetchCommunities = useCallback(async () => {
    try {
      const targetUrl =
        "https://explain-banana-bucked.ngrok-free.dev/api/get_communities.php";
      const response = await axios.get(targetUrl, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });

      if (Array.isArray(response.data)) {
        setCommunities(response.data);
      } else if (
        response.data &&
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        setCommunities(response.data.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setCommunities(response.data.data);
      }
    } catch (err) {
      console.error("Failed to load sectors registry framework:", err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCommunities();
  }, [fetchCommunities]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await axios.post(
        "https://explain-banana-bucked.ngrok-free.dev/api/login.php",
        formData,
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!selectedCommunity) {
      setMessage(
        "Registration Refused: Please select your designated academic community track.",
      );
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("community_id", selectedCommunity);

    try {
      const response = await axios.post(
        "https://explain-banana-bucked.ngrok-free.dev/api/register_student.php",
        formData,
      );

      if (response.data.status === "success") {
        setMessage(response.data.message);
        setIsRegistering(false);
        setPassword("");
        setSelectedCommunity("");
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Registration Failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mesh_session");
    setUser(null);
    setUsername("");
    setPassword("");
    setMessage("Logged out.");
  };

  // Helper toggle to reset statuses cleanly when moving back and forth
  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setMessage("");
    setUsername("");
    setPassword("");
    setSelectedCommunity("");
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <Spline scene="https://prod.spline.design/8z1DQ8eWmkaOnZ4z/scene.splinecode" />

        {/* Soft atmospheric radial & linear dark gradients to ensure the inputs stay readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-slate-950/20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-32 bg-gradient-to-br from-transparent via-slate-950/100 to-slate-950 pointer-events-none filter blur-sm" />
      </div>

      {/* FOREGROUND GLASSMORPHIC LOGIN CARD (Raised above 3D scene using relative z-10) */}
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-10 relative z-10">
        <h1 className="text-5xl font-black text-center mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent select-none">
          KCPLIBRARY
        </h1>

        <p className="text-center text-slate-400 mb-10 uppercase tracking-widest text-xs font-bold select-none">
          {isRegistering ? "Register Account" : "School Archive Repository"}
        </p>

        <form
          onSubmit={isRegistering ? handleRegister : handleLogin}
          className="space-y-6"
        >
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-4 bg-slate-950/80 border border-slate-800/80 rounded-xl outline-none text-white focus:ring-2 ring-blue-500/40 transition-all font-sans"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-4 bg-slate-950/80 border border-slate-800/80 rounded-xl outline-none text-white focus:ring-2 ring-blue-500/40 transition-all font-sans"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isRegistering && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="relative group">
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-950/80 border border-slate-800/80 rounded-xl outline-none text-slate-300 focus:ring-2 ring-blue-500/40 focus:border-blue-500/50 transition-all font-sans cursor-pointer appearance-none pr-12 font-medium tracking-wide"
                  required
                >
                  <option
                    value=""
                    disabled
                    className="bg-slate-950 text-slate-500"
                  >
                    Select Community
                  </option>
                  {communities.map((comm) => (
                    <option
                      key={comm.id}
                      value={comm.id}
                      className="bg-slate-950 text-white uppercase font-mono text-xs tracking-wider"
                    >
                      {comm.name || comm.community_name}
                    </option>
                  ))}
                </select>

                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="w-4 h-4 transition-transform duration-300 group-focus-within:rotate-180"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* ⚡ CONDITIONAL BUTTON TEXT */}
          <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-black rounded-xl shadow-lg transition-all text-white tracking-wide active:scale-[0.99] uppercase text-sm">
            {isRegistering ? "Register" : "LOGIN"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={toggleAuthMode}
            className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-blue-400 transition-colors bg-transparent border-none outline-none cursor-pointer"
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>

        {message && (
          <div className="mt-8 p-4 rounded-xl text-center font-bold border-2 border-slate-700 bg-slate-950/90 text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

// DON'T DELETE THIS DEFAULT SETUP BELOW

// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./index.css";
// import Dashboard from "./Dashboard";
// import Spline from "@splinetool/react-spline";

// const InactivityHandler = ({ timeoutInSeconds, onLogout }) => {
//   useEffect(() => {
//     let timer;
//     const resetTimer = () => {
//       if (timer) clearTimeout(timer);
//       timer = setTimeout(onLogout, timeoutInSeconds * 1000);
//     };

//     const events = ["mousemove", "mousedown", "keypress", "scroll"];
//     events.forEach((e) => window.addEventListener(e, resetTimer));
//     resetTimer();

//     return () => {
//       if (timer) clearTimeout(timer);
//       events.forEach((e) => window.removeEventListener(e, resetTimer));
//     };
//   }, [onLogout, timeoutInSeconds]);
//   return null;
// };

// function App() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("mesh_session");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("username", username);
//     formData.append("password", password);

//     try {
//       const response = await axios.post(
//         "https://customer-yahoo-outing.ngrok-free.dev/backend/api/login.php",
//         formData,
//       );

//       if (response.data.status === "connection success") {
//         const userData = { username: username, role: response.data.role };
//         localStorage.setItem("mesh_session", JSON.stringify(userData));
//         setUser(userData);
//       } else {
//         setMessage(response.data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("Connection Failed.");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("mesh_session");
//     setUser(null);
//     setUsername("");
//     setPassword("");
//     setMessage("Logged out.");
//   };

//   if (user) {
//     return (
//       <>
//         <InactivityHandler timeoutInSeconds={900} onLogout={handleLogout} />
//         <Dashboard user={user} logout={handleLogout} />
//       </>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 relative overflow-hidden">
//       <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
//         <Spline scene="https://prod.spline.design/8z1DQ8eWmkaOnZ4z/scene.splinecode" />

//         {/* Soft atmospheric radial & linear dark gradients to ensure the inputs stay readable */}
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 pointer-events-none" />
//         <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-slate-950/20 pointer-events-none" />
//         <div className="absolute bottom-0 right-0 w-72 h-32 bg-gradient-to-br from-transparent via-slate-950/100 to-slate-950 pointer-events-none filter blur-sm" />
//         </div>

//       {/* FOREGROUND GLASSMORPHIC LOGIN CARD (Raised above 3D scene using relative z-10) */}
//       <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-10 relative z-10">
//         <h1 className="text-5xl font-black text-center mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
//           KCPLIBRARY
//         </h1>

//         <p className="text-center text-slate-400 mb-10 uppercase tracking-widest text-xs font-bold">
//           School Archive Repository
//         </p>

//         <form onSubmit={handleLogin} className="space-y-6">
//           <input
//             type="text"
//             placeholder="Username"
//             className="w-full px-4 py-4 bg-slate-950/80 border border-slate-800/80 rounded-xl outline-none text-white focus:ring-2 ring-blue-500/40 transition-all"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             autoComplete="off"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full px-4 py-4 bg-slate-950/80 border border-slate-800/80 rounded-xl outline-none text-white focus:ring-2 ring-blue-500/40 transition-all"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-black rounded-xl shadow-lg transition-all text-white tracking-wide active:scale-[0.99]">
//             LOGIN
//           </button>
//         </form>

//         {message && (
//           <div className="mt-8 p-4 rounded-xl text-center font-bold border-2 border-slate-700 bg-slate-950/90">
//             {message}
//           </div>
//         )}
//       </div>

//     </div>
//   );
// }

// export default App;
