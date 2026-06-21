// Dashboard.jsx — top-level layout, state, and filtering.
// Props: { projects, tags, saves, signature }  (see data.js for shapes)
import { useState, useMemo } from "react";
import Masthead from "./components/Masthead.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TasteSignature from "./components/TasteSignature.jsx";
import Toolbar from "./components/Toolbar.jsx";
import Grid from "./components/Grid.jsx";
import ChatPanel from "./components/ChatPanel.jsx";
import DetailOverlay from "./components/DetailOverlay.jsx";
import { deleteItem, updateItemProject } from "./data.js";

const SEARCH_SUGGESTIONS = [
  "warm analog packaging", "nostalgic film grain", "golden hour interiors",
  "handmade lettering", "sun-faded paper textures",
];

const tokenize = (str) =>
  (str || "").toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);

export default function Dashboard({ projects, tags, saves, signature, userId }) {
  const [localSaves, setLocalSaves] = useState(saves);
  const [query, setQuery] = useState("");
  const [activeProj, setActiveProj] = useState("all");
  const [activeTags, setActiveTags] = useState([]);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [chatOpen, setChatOpen] = useState(false);
  const [railOpen, setRailOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [detail, setDetail] = useState(null);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hey — I can see everything you've saved. Ask me about patterns, projects, or what to explore next." },
  ]);
  const [typing, setTyping] = useState(false);

  const counts = useMemo(() => {
    const byProj = {};
    localSaves.forEach((s) => { byProj[s.project] = (byProj[s.project] || 0) + 1; });
    return { total: localSaves.length, byProj };
  }, [localSaves]);

  const toggleTag = (tag) =>
    setActiveTags((a) => (a.includes(tag) ? a.filter((x) => x !== tag) : [...a, tag]));
  const clearAll = () => { setQuery(""); setActiveProj("all"); setActiveTags([]); };

  // Filtering + lightweight keyword "semantic" match.
  // PRODUCTION: replace the `if (query.trim())` block with your pgvector query.
  const { list, matchIds, filtered, shown } = useMemo(() => {
    let l = localSaves.filter((s) =>
      (activeProj === "all" || s.project === activeProj) &&
      (activeTags.length === 0 || s.tags.some((tg) => activeTags.includes(tg))));

    const cmp = {
      newest: (a, b) => a.days - b.days,
      oldest: (a, b) => b.days - a.days,
      title: (a, b) => a.title.localeCompare(b.title),
    }[sort];
    l = [...l].sort(cmp);

    const mIds = new Set();
    if (query.trim()) {
      const qs = tokenize(query);
      l.forEach((s) => {
        const hay = (s.title + " " + s.dek + " " + s.tags.join(" ") + " " + (s.vibe || "")).toLowerCase();
        if (qs.some((q) => hay.includes(q))) mIds.add(s.id);
      });
      const matched = l.filter((s) => mIds.has(s.id));
      const rest = l.filter((s) => !mIds.has(s.id));
      l = [...matched, ...rest];
    }

    const isFiltered = !!query.trim() || activeProj !== "all" || activeTags.length > 0;
    const shownN = query.trim() ? mIds.size : l.length;
    return { list: l, matchIds: mIds, filtered: isFiltered, shown: shownN };
  }, [localSaves, activeProj, activeTags, sort, query]);

  const title = activeProj === "all"
    ? "All Saves"
    : (projects.find((p) => p.key === activeProj) || {}).name;

  async function askBrain(text) {
    const q = (text || "").trim();
    if (!q) return;

    const history = messages
      .filter((m) => m.role === "user" || m.role === "ai")
      .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));

    setMessages((m) => [...m, { role: "user", text: q }]);
    setTyping(true);

    const context = localSaves
      .slice(0, 60)
      .map((s) => `"${s.title}" — ${s.dek || ""} Tags: ${(s.tags || []).join(", ")} URL: ${s.source_url || ""}`)
      .join("\n");

    const systemPrompt = `You are a creative thinking partner with access to everything this person has saved in Moodbase. Help them find patterns, make creative decisions, and think through ideas.\n\nHere is their saved content:\n${context}`;

    try {
      const res = await fetch("https://moodbase.vercel.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          messages: [...history, { role: "user", content: q }],
          userId,
        }),
      });
      const data = await res.json();
      const reply = data?.content?.[0]?.text || "No response — try again.";
      setMessages((m) => [...m, { role: "ai", text: reply }]);
    } catch (err) {
      console.error("askBrain error:", err);
      setMessages((m) => [...m, { role: "ai", text: "Couldn't reach Moodbase. Check your connection." }]);
    } finally {
      setTyping(false);
    }
  }
  const openChatAsk = (text) => { setChatOpen(true); setRailOpen(false); askBrain(text); };

  function findSimilar(s) {
    setActiveProj("all"); setActiveTags([]);
    setQuery((s.vibe || s.title).split(" ").slice(0, 3).join(" "));
    setDetail(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function handleDelete(s) {
    if (!window.confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
    try {
      await deleteItem(s.id);
      setLocalSaves((prev) => prev.filter((x) => x.id !== s.id));
      setDetail(null);
    } catch (err) {
      console.error("delete failed", err);
      alert("Could not delete this save. Try again.");
    }
  }
  async function handleMoveProject(save, projectKey) {
    const newProjectId = projectKey === "uncat" ? null : projectKey;
    try {
      await updateItemProject(save.id, newProjectId);
      setLocalSaves((prev) => prev.map((x) => x.id === save.id ? { ...x, project: projectKey } : x));
      setDetail((prev) => prev && prev.id === save.id ? { ...prev, project: projectKey } : prev);
    } catch (err) {
      console.error("move project failed", err);
      alert("Could not move this save. Try again.");
    }
  }
  // Dock the chat as a real grid column on wide screens; overlay on narrow.
  const docked = chatOpen && typeof window !== "undefined" && window.innerWidth > 1180;

  return (
    <div className={"mb-app mb-grain" + (dark ? "" : " mb-light")}
         style={{ "--chat-w": docked ? "380px" : "0px" }}>
      <Masthead
        query={query} setQuery={setQuery} suggestions={SEARCH_SUGGESTIONS}
        onPickSuggest={setQuery} onToggleChat={() => setChatOpen((v) => !v)} chatOpen={chatOpen}
        dark={dark} onToggleTheme={() => setDark((v) => !v)}
        onToggleRail={() => setRailOpen((v) => !v)} />

      <div className="mb-body">
        <div className={"mb-rail-scrim" + (railOpen ? " show" : "")} onClick={() => setRailOpen(false)} />
        <Sidebar
          open={railOpen} projects={projects} activeProj={activeProj}
          setActiveProj={(k) => { setActiveProj(k); setRailOpen(false); }}
          tags={tags} activeTags={activeTags} toggleTag={toggleTag} counts={counts} />

        <main className="mb-main">
          <TasteSignature sig={signature} onMotif={setQuery}
            onAsk={() => openChatAsk("Build a creative direction from my taste signature")} />
          <Toolbar
            title={title} total={activeProj === "all" ? localSaves.length : list.length} shown={shown}
            filtered={filtered} onClear={clearAll}
            sort={sort} setSort={setSort} view={view} setView={setView} />
          <Grid
            items={list} allMatch={!!query.trim()} matchIds={matchIds} view={view} projects={projects}
            onOpen={setDetail} onSimilar={findSimilar} onClear={clearAll} />
        </main>

        <ChatPanel
          open={chatOpen} docked={docked} onClose={() => setChatOpen(false)}
          messages={messages} typing={typing} onAsk={askBrain} />
      </div>

      {detail && (
        <DetailOverlay
          save={detail} all={localSaves} projects={projects} onDelete={handleDelete} onMoveProject={handleMoveProject}
          onClose={() => setDetail(null)} onSimilar={findSimilar} onOpen={setDetail}
          onAsk={(s) => { setDetail(null); openChatAsk(`What does "${s.title}" say about my taste?`); }} />
      )}
    </div>
  );
}
