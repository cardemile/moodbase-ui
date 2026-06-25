// DetailOverlay.jsx — fullscreen save detail modal (Esc / backdrop to close).
import { useEffect, useState } from "react";
import Icon, { grad } from "./Icon.jsx";

export default function DetailOverlay({
  save, all, projects, onClose, onSimilar, onAsk, onOpen, onDelete, onMoveProject,
}) {
  const [showProjectPicker, setShowProjectPicker] = useState(false);
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
          {save.videoUrl ? (
            <video
              src={save.videoUrl}
              poster={save.posterUrl || undefined}
              autoPlay
              muted
              loop
              playsInline
              controls
              style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}
              onError={(e)=>{e.target.style.display="none"}}
            />
          ) : save.imageUrl ? (
            <img src={save.imageUrl} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} onError={(e)=>{e.target.style.display="none"}} />
          ) : (
            <div className="mb-card-grad" style={grad(save.grad)} />
          )}
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
          <p className="mb-modal-dek">{save.content || save.dek}</p>

          <dl className="mb-modal-meta">
            <dt>Saved</dt><dd>{save.days} days ago</dd>
            <dt>Source</dt><dd>{save.sourceUrl ? <a href={save.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>{save.source} ↗</a> : save.source}</dd>
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
            <div style={{ position: "relative" }}>
              <button className="mb-mact" onClick={() => setShowProjectPicker((v) => !v)}>
                <Icon name="plus" size={15} /> Add to project
              </button>
              {showProjectPicker && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 60,
                  background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: "10px",
                  padding: "6px", minWidth: "180px", boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                }}>
                  {(projects || []).filter((p) => p.key !== "all").map((p) => (
                    <button
                      key={p.key}
                      onClick={() => { onMoveProject(save, p.key); setShowProjectPicker(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: "8px", width: "100%",
                        padding: "8px 10px", borderRadius: "7px", textAlign: "left",
                        background: save.project === p.key ? "var(--hover)" : "transparent",
                        color: "var(--ink)", fontSize: "13px",
                      }}
                    >
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.dot, flexShrink: 0 }} />
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="mb-mact danger" onClick={() => onDelete(save)}><Icon name="x" size={15} /> Delete</button>
          </div>

          <div className="mb-related">
            <span className="kicker">Related in your library</span>
            <div className="mb-related-row">
              {related.map((r) => (
                <div key={r.id} className="thumb" onClick={() => onOpen(r)}>
                  {r.imageUrl ? <img src={r.imageUrl} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} onError={(e)=>{e.target.style.display="none"}} /> : <div className="mb-card-grad" style={grad(r.grad)} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
