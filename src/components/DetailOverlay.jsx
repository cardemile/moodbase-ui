// DetailOverlay.jsx — fullscreen save detail modal (Esc / backdrop to close).
import { useEffect } from "react";
import Icon, { grad } from "./Icon.jsx";

export default function DetailOverlay({
  save, all, projects, onClose, onSimilar, onAsk, onOpen, onDelete,
}) {
  useEffect(() => {
    function k(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);

  if (!save) return null;

  const related = all
    .filter((x) => x.id !== save.id && x.tags.some((t) => save.tags.includes(t)))
    .slice(0, 3);
  const proj = (projects || []).find((p) => p.key === save.project);

  return (
    <div className="mb-overlay" onClick={onClose}>
      <div className="mb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mb-modal-img">
          {/* PLACEHOLDER ART — replace with <img src={save.imageUrl} /> in production. */}
          <div className="mb-card-grad" style={grad(save.grad)} />
          <span className="mb-card-src">{save.source}</span>
          <button className="mb-modal-close" onClick={onClose}><Icon name="x" size={17} /></button>
        </div>

        <div className="mb-modal-side">
          <div className="mb-modal-kick">
            <span className="mb-dot"
              style={{ background: proj ? proj.dot : "var(--accent)", boxShadow: "none", width: 8, height: 8 }} />
            <span className="kicker">{save.cat}</span>
          </div>
          <h2 className="mb-modal-title">{save.title}</h2>
          <p className="mb-modal-dek">{save.dek}</p>

          <dl className="mb-modal-meta">
            <dt>Saved</dt><dd>{save.days} days ago</dd>
            <dt>Source</dt><dd>{save.source}</dd>
            <dt>Project</dt><dd>{proj ? proj.name : "Uncategorized"}</dd>
            <dt>Tags</dt><dd>{save.tags.join(" · ")}</dd>
          </dl>

          <div className="mb-modal-acts">
            <button className="mb-mact primary" onClick={() => onSimilar(save)}>
              <Icon name="similar" size={15} /> Find similar
            </button>
            <button className="mb-mact" onClick={() => onAsk(save)}>
              <Icon name="spark" size={15} fill="currentColor" /> Ask about this
            </button>
            <button className="mb-mact"><Icon name="plus" size={15} /> Add to project</button>
            <button className="mb-mact danger" onClick={() => onDelete(save)}><Icon name="x" size={15} /> Delete</button>
          </div>

          <div className="mb-related">
            <span className="kicker">Related in your library</span>
            <div className="mb-related-row">
              {related.map((r) => (
                <div key={r.id} className="thumb" onClick={() => onOpen(r)}>
                  <div className="mb-card-grad" style={grad(r.grad)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
