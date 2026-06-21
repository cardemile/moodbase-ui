import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qxgsaqvulfafqqxrkyob.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4Z3NhcXZ1bGZhZnFxeHJreW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDY5MzUsImV4cCI6MjA5MTIyMjkzNX0.ScmKdK5dI8xBv-35r0Zx0GwqyCVWT9MsqnIKlM7GGWg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchData(user) {
  const [{ data: itemsRaw }, { data: projectsRaw }] = await Promise.all([
    supabase.from("items").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
  ]);

  const projects = [
    { key: "all", name: "All Saves", dot: "#E8C266" },
    ...(projectsRaw || []).map((p) => ({
      key: p.id,
      name: p.name,
      dot: p.color || "#9A8F82",
    })),
    { key: "uncat", name: "Uncategorized", dot: "#9A8F82" },
  ];

  const saves = (itemsRaw || []).map((item) => ({
    id: item.id,
    project: item.project_id || "uncat",
    cat: projectsRaw?.find((p) => p.id === item.project_id)?.name || "Uncategorized",
    title: item.title || "Untitled",
    dek: item.summary || "",
    tags: item.tags || [],
    source: item.url ? (() => { try { return new URL(item.url).hostname.replace("www.", ""); } catch { return ""; } })() : "",
    days: Math.floor((Date.now() - new Date(item.created_at).getTime()) / 86400000),
    aspect: "tall",
    imageUrl: item.type === "image" ? item.url : null,
    sourceUrl: item.source_url || item.url,
    grad: ["#2A2438", "#C86A3E"],
    vibe: (item.tags || []).join(" ") + " " + (item.summary || ""),
    type: item.type,
    content: item.content,
  }));

  const tags = [...new Set(saves.flatMap((s) => s.tags))].sort();

  const SIGNATURE = {
    line: "Your taste is synthesized from your saved library.",
    motifs: tags.slice(0, 6),
    palette: ["#C86A3E", "#E0641F", "#E8C266", "#3C7C8C", "#9A2D2D", "#D9C18E"],
    newThisWeek: saves.filter((s) => s.days <= 7).length,
  };

  try {
    const context = saves.slice(0, 40).map((s) => `"${s.title}" — ${s.dek} Tags: ${s.tags.join(", ")}`).join("\n");
    const sigRes = await fetch("https://moodbase.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: "You synthesize a creative taste signature. Respond with exactly ONE sentence. No markdown, no asterisks, no headings. Start with 'Your taste' and name 2-3 specific aesthetic themes. Under 25 words.",
        messages: [{ role: "user", content: `Here are my saved references:\n${context}\n\nWrite my taste signature.` }],
        userId: user.id,
      }),
    });
    const sigData = await sigRes.json();
    const raw = sigData?.content?.[0]?.text || SIGNATURE.line;
    SIGNATURE.line = raw.replace(/^#.*?\n/gm, "").replace(/\*\*(.*?)\*\*/g, "<em>$1</em>").split(/[.!?]/)[0].trim() + ".";
  } catch (e) {
    console.warn("gnature generation failed", e);
  }
  return { projects, saves, tags, SIGNATURE };
}

export async function deleteItem(id) {
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw error;
  return true;
}
