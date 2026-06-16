// Sidebar.jsx — Projects list + Tags (collapsible).
import { useState } from "react";

export default function Sidebar({
  open, projects, activeProj, setActiveProj,
  tags, activeTags, toggleTag, counts,
}) {
  const [showAll, setShowAll] = useState(false);
  const shownTags = showAll ? tags : tags.slice(0, 12);

  return (
    <aside className={"mb-rail" + (open ? " open" : "")}>
      <div className="mb-rail-sec">
        <div className="mb-rail-h kicker"><span>Projects</span></div>
        {projects.map((p) => (
          <button key={p.key}
            className={"mb-proj" + (activeProj === p.key ? " active" : "")}
            onClick={() => setActiveProj(p.key)}>
            <span className="mb-dot" style={{ background: p.dot }} />
            <span className="nm">{p.name}</span>
            <span className="ct">
              {p.key === "all" ? counts.total : (counts.byProj[p.key] || 0)}
            </span>
          </button>
        ))}
        <button className="mb-newproj"><span className="ic">＋</span> New project</button>
      </div>

      <div className="mb-rail-sec">
        <div className="mb-rail-h kicker">
          <span>Tags</span>
          {activeTags.length > 0 && (
            <button className="mb-rail-clear"
              onClick={() => activeTags.slice().forEach(toggleTag)}>Clear</button>
          )}
        </div>
        <div className="mb-tags">
          {shownTags.map((t) => (
            <button key={t}
              className={"mb-tag" + (activeTags.includes(t) ? " on" : "")}
              onClick={() => toggleTag(t)}>{t}</button>
          ))}
        </div>
        {tags.length > 12 && (
          <button className="mb-tags-more" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show less" : "Show all " + tags.length}
          </button>
        )}
      </div>
    </aside>
  );
}
