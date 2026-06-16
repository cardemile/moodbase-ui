// Masthead.jsx — sticky top bar: logo, semantic search, actions.
import { useState, useRef, useEffect } from "react";
import Icon from "./Icon.jsx";

export default function Masthead({
  query, setQuery, suggestions, onPickSuggest,
  onToggleChat, chatOpen, dark, onToggleTheme, onToggleRail,
}) {
  const [focused, setFocused] = useState(false);
  const wrap = useRef(null);

  useEffect(() => {
    function h(e) { if (wrap.current && !wrap.current.contains(e.target)) setFocused(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header className="mb-masthead">
      <button className="mb-icon-btn mb-hamburger" onClick={onToggleRail} aria-label="Menu">
        <Icon name="menu" />
      </button>

      <div className="mb-logo">
        <div className="mb-badge"><Icon name="spark" size={18} fill="currentColor" /></div>
        <div className="mb-word">Moodbase</div>
      </div>

      <div className="mb-search" ref={wrap}>
        <span className="mb-search-ico"><Icon name="search" size={16} /></span>
        <input
          className="mb-search-input"
          value={query}
          onFocus={() => setFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by meaning, feeling, or vibe…"
        />
        {query && (
          <button className="mb-search-clear" onClick={() => setQuery("")}>
            <Icon name="x" size={15} />
          </button>
        )}
        {focused && !query && (
          <div className="mb-suggest">
            <div className="mb-suggest-h kicker">Search by feeling — try</div>
            {suggestions.map((s) => (
              <button key={s} className="mb-suggest-chip"
                onMouseDown={() => { onPickSuggest(s); setFocused(false); }}>
                <span style={{ color: "var(--accent)" }}>
                  <Icon name="spark" size={14} fill="currentColor" />
                </span>
                <span>{s}</span>
                <span className="q">semantic</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-mast-actions">
        <button className="mb-capture">
          <Icon name="plus" size={16} /><span className="lbl">Capture</span>
        </button>
        <button className={"mb-icon-btn" + (chatOpen ? " on" : "")}
          onClick={onToggleChat} aria-label="Ask your brain">
          <Icon name="chat" />
        </button>
        <button className="mb-icon-btn" onClick={onToggleTheme} aria-label="Theme">
          {dark ? <Icon name="sun" /> : <Icon name="moon" />}
        </button>
        <div className="mb-avatar">PR</div>
      </div>
    </header>
  );
}
