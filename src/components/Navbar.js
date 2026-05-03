import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        padding: "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(10px)",
        background: "rgba(10,10,10,0.7)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}
    >
      <h2 style={{ margin: 0, letterSpacing: "1px" }}>
        ⛳ Golf Ganja
      </h2>

      <div style={{ display: "flex", gap: "25px" }}>
        <Link to="/">Home</Link>
        <Link to="/episodes">Episodes</Link>
        <Link to="/socials">Socials</Link>
      </div>
    </nav>
  );
}

export default Navbar;