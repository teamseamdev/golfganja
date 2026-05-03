function EpisodeCard({ episode }) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow =
          "0 15px 50px rgba(0,0,0,0.8)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 40px rgba(0,0,0,0.6)";
      }}
    >
      <iframe
        width="100%"
        height="220"
        src={episode.videoUrl}
        title={episode.title}
        frameBorder="0"
        allowFullScreen
      />

      <div style={{ padding: "18px" }}>
        <h3 style={{ marginBottom: "10px" }}>{episode.title}</h3>
        <p>{episode.description}</p>
      </div>
    </div>
  );
}

export default EpisodeCard;