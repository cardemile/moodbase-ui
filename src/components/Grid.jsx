// Grid.jsx — masonry of cards, or an empty state.
import { useEffect, useRef, useState } from "react";
import Card from "./Card.jsx";

const INITIAL_COUNT = 30;
const STEP_COUNT = 20;

export default function Grid({
  items, allMatch, matchIds, view, projects, onOpen, onSimilar, onClear,
}) {
  const [limit, setLimit] = useState(INITIAL_COUNT);
  const sentinelRef = useRef(null);

  // Reset the render limit whenever the underlying item list changes
  // (e.g. new search, filter, or project switch).
  useEffect(() => {
    setLimit(INITIAL_COUNT);
  }, [items]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLimit((prev) => prev + STEP_COUNT);
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

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

  const visible = items.slice(0, limit);

  return (
    <div className={"mb-grid" + (view === "list" ? " list" : "")}>
      {visible.map((s) => (
        <Card key={s.id} s={s} projects={projects}
          dim={allMatch && !matchIds.has(s.id)}
          match={allMatch && matchIds.has(s.id)}
          onOpen={onOpen} onSimilar={onSimilar} />
      ))}
      {limit < items.length && (
        <div ref={sentinelRef} style={{ height: 1, breakInside: "avoid" }} />
      )}
    </div>
  );
}
