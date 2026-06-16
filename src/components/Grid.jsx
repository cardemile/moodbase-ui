// Grid.jsx — masonry of cards, or an empty state.
import Card from "./Card.jsx";

export default function Grid({
  items, allMatch, matchIds, view, projects, onOpen, onSimilar, onClear,
}) {
  if (!items.length) {
    return (
      <div className="mb-empty">
        <div className="mb-display">Nothing matches that feeling — yet.</div>
        <p>Try a looser vibe, or{" "}
          <button className="mb-clear" onClick={onClear}>clear your filters</button>.
        </p>
      </div>
    );
  }
  return (
    <div className={"mb-grid" + (view === "list" ? " list" : "")}>
      {items.map((s) => (
        <Card key={s.id} s={s} projects={projects}
          dim={allMatch && !matchIds.has(s.id)}
          match={allMatch && matchIds.has(s.id)}
          onOpen={onOpen} onSimilar={onSimilar} />
      ))}
    </div>
  );
}
