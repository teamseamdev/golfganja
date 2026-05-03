import episodes from "../data/episodes";
import EpisodeCard from "../components/EpisodeCard";

function Episodes() {
  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>Episodes</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "30px"
        }}
      >
        {episodes.map((ep) => (
          <EpisodeCard key={ep.id} episode={ep} />
        ))}
      </div>
    </div>
  );
}

export default Episodes;