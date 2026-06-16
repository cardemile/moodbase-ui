// ChatPanel.jsx — "Ask your brain" slide-out / docked column.
import { useState, useRef, useEffect } from "react";
import Icon from "./Icon.jsx";

const CHIPS = [
  "What patterns do you see?",
  "Summarize by project",
  "What should I explore next?",
  "Build a creative direction",
];

export default function ChatPanel({
  open, onClose, messages, typing, onAsk, docked,
}) {
  const [input, setInput] = useState("");
  const scroll = useRef(null);

  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messages, typing]);

  function ask(text) {
    const q = (text || "").trim();
    if (!q) return;
    onAsk(q);          // parent appends the user message + calls your model
    setInput("");
  }

  return (
    <aside className={"mb-chat" + (open ? " open" : "") + (docked ? " docked" : "")}>
      <div className="mb-chat-h">
        <span className="spark"><Icon name="spark" size={19} fill="currentColor" /></span>
        <span className="ttl">Ask your brain</span>
        <button className="mb-icon-btn" style={{ marginLeft: "auto" }} onClick={onClose}>
          <Icon name="x" size={17} />
        </button>
      </div>

      <div className="mb-chat-scroll" ref={scroll}>
        {messages.map((m, i) => (
          <div key={i} className={"mb-msg " + m.role}>
            {/* m.text may contain <em> emphasis. Sanitize model output before
                using dangerouslySetInnerHTML in production. */}
            <div className="bub" dangerouslySetInnerHTML={{ __html: m.text }} />
          </div>
        ))}
        {typing && (
          <div className="mb-msg ai">
            <div className="mb-typing"><i /><i /><i /></div>
          </div>
        )}
      </div>

      <div className="mb-chat-foot">
        <div className="mb-chips">
          {CHIPS.map((c) => <button key={c} className="mb-chip" onClick={() => ask(c)}>{c}</button>)}
        </div>
        <div className="mb-chat-input">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything…"
            onKeyDown={(e) => { if (e.key === "Enter") ask(input); }} />
          <button className="mb-send" onClick={() => ask(input)}>
            <Icon name="send" size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
