import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Generator from "./pages/Generator";
import Terpenes from "./pages/Terpenes";
import Feedback from "./pages/Feedback";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [ageVerified, setAgeVerified] = useState(() => {
    return localStorage.getItem("terpivo_age_verified") === "true";
  });

  return (
    <div className="bg-black text-white min-h-screen">

      {/* AGE GATE */}
      {!ageVerified && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="bg-black border border-white/20 rounded-2xl p-6 w-[90%] max-w-sm text-center space-y-4">

            <h2 className="text-lg font-semibold">
              Are you 21 or older?
            </h2>

            <p className="text-sm opacity-70">
              You must be 21+ to use Terpivo.
            </p>

            <div className="flex gap-3 justify-center mt-4">

              <button
                onClick={() => {
                  localStorage.setItem("terpivo_age_verified", "true");
                  setAgeVerified(true);
                }}
                className="px-4 py-2 rounded-xl bg-green-500"
              >
                Yes
              </button>

              <button
                onClick={() => {
                  window.location.href = "https://www.google.com";
                }}
                className="px-4 py-2 rounded-xl bg-red-500"
              >
                No
              </button>

            </div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div className="flex justify-between items-center p-4 relative">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <img
            src="/terpivogrey.png"
            alt="Terpivo Logo"
            className="w-6 h-6"
          />
          <span>Terpivo</span>
        </h1>

        {/* 🍔 Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl"
        >
          ☰
        </button>

        {/* MENU */}
        {menuOpen && (
          <div className="absolute right-0 top-12 w-48 bg-black border border-white/10 rounded-2xl p-3 space-y-2 shadow-xl z-50">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-white/10 hover:bg-white/20 p-3 rounded-xl transition"
            >
              🧬 Generator
            </Link>

            <Link
              to="/terpenes"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-white/10 hover:bg-white/20 p-3 rounded-xl transition"
            >
              🧠 Terpenes
            </Link>

            <Link
              to="/feedback"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-white/10 hover:bg-white/20 p-3 rounded-xl transition"
            >
              ℹ️ Feedback
            </Link>

          </div>
        )}
      </div>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Generator />} />
        <Route path="/terpenes" element={<Terpenes />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>

    </div>
  );
}