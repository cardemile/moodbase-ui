// Card.jsx — a single save tile.
import { useState } from "react";
import Icon, { grad } from "./Icon.jsx";

function catDot(projKey, projects) {
  const p = (projects || []).find((x) => x.key === projKey);
  return p ? p.dot : "var(--accent)";
}

export default function Card({ s, dim, match, projects, onOpen, onSimilar }) {
  const [hoverTitle, setHoverTitle] = useState(false);
  const [hoverDek, setHoverDek] = useState(false);
  const cls = "mb-card"
    + (s.featured ? " feat" : "")
    + (dim ? " dim" : "")
    + (match ? " match" : "");

  return (
    <article className={cls} onClick={() => onOpen(s)}>
      <div className={"mb-card-img " + s.aspect}>
        {/* PLACEHOLDER ART. In production replace with:
            <img src={s.imageUrl} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} /> */}
        {s.imageUrl ? <img src={s.imageUrl} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} onError={(e)=>{e.target.style.display="none"}} /> : <div className="mb-card-grad" style={grad(s.grad)} />}
        {match && <span className="mb-match-badge">match</span>}
        <span className="mb-card-src">{s.source}</span>
        <div className="mb-card-actions">
          <button className="mb-act" onClick={(e) => { e.stopPropagation(); onOpen(s); }}>
            <Icon name="open" size={14} /> Open
          </button>
          <button className="mb-act" onClick={(e) => { e.stopPropagation(); onSimilar(s); }}>
            <Icon name="similar" size={14} /> Similar
          </button>
          <button className="mb-act round" onClick={(e) => e.stopPropagation()} aria-label="Add">
            <Icon name="plus" size={15} />
          </button>
        </div>
      </div>

      <div className="mb-card-body">
        <div className="mb-card-kick">
          <span className="mb-dot"
            style={{ background: catDot(s.project, projects), boxShadow: "none", width: 7, height: 7 }} />
          <span className="kicker">{s.cat}</span>
          {s.featured && <span className="mb-card-featured">★ Featured</span>}
        </div>
        <h3 className="mb-card-title" onMouseEnter={() => setHoverTitle(true)} onMouseLeave={() => setHoverTitle(false)}>
          {s.title}
          {hoverTitle && <span className="mb-tooltip">{s.title}</span>}
        </h3>
        <p className="mb-card-dek" onMouseEnter={() => setHoverDek(true)} onMouseLeave={() => setHoverDek(false)}>
          {s.dek}
          {hoverDek && <span className="mb-tooltip">{s.dek}</span>}
        </p>
        <div className="mb-card-tags">
          {s.tags.slice(0, 3).map((t) => <span key={t} className="mb-mini-tag">{t}</span>)}
        </div>
        <div className="mb-card-foot">
          <span>{s.source}</span><span>{s.days}d ago</span>
        </div>
      </div>
    </article>
  );
}
