function Home() {
  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px"
      }}
    >
      <h1 style={{ fontSize: "3.5rem", marginBottom: "10px" }}>
        Golf Ganja Podcast
      </h1>

      <p style={{ fontSize: "1.3rem", maxWidth: "500px" }}>
        Where golf meets good vibes 🌿⛳  
        Stories, laughs, and elevated conversations.
      </p>

      <button
        style={{
          marginTop: "25px",
          padding: "12px 24px",
          borderRadius: "30px",
          border: "none",
          background: "linear-gradient(135deg, #1db954, #0f7a3f)",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(29,185,84,0.4)"
        }}
      >
        Watch Latest Episode
      </button>
    </div>
  );
}

export default Home;