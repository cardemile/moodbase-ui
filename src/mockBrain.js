// mockBrain.js — fake "Ask your brain" responses so the LOCAL PREVIEW works
// without a backend. DELETE this file and point askBrain() at your Claude
// endpoint when you merge into the real app.
export function mockBrainReply(q) {
  const t = q.toLowerCase();
  if (t.includes("pattern"))
    return "Three threads keep surfacing. First, a strong pull toward <em>warm analog</em> — golden-hour interiors, sun-faded paper, Super-8 grain. Second, a taste for <em>handmade imperfection</em> in branding: riso misregistration, ghost signs, the Mountain Hippie soda system. Third, you gravitate to <em>motion as texture</em> — long-exposure smears and dragged shutters. Cool tones only show up as deliberate contrast.";
  if (t.includes("summar") || t.includes("project"))
    return "Across your projects: <em>Bali Water</em> (16) is your most active — product photography and warm beverage branding. <em>Textures</em> (10) collects film, paper and metal surfaces. <em>Brand Identity</em> (2) is small but sharp, focused on hand-lettering and riso print. The 22 <em>Uncategorized</em> saves actually cluster tightly around nostalgia — I can file them for you.";
  if (t.includes("explore") || t.includes("next"))
    return "You're rich on <em>mood</em> but thin on <em>typography</em> — only one editorial-serif website. To brief from this taste, I'd capture 4–5 type specimens that match the warmth (Caslon-ish, a little aged). I'd also chase the <em>halation</em> thread you bookmarked but haven't built on — it could become a signature treatment.";
  if (t.includes("direction") || t.includes("brief") || t.includes("creative"))
    return "Here's a direction your saves are pointing at: <em>“Sun-cured.”</em> A warm, analog identity — terracotta and faded amber, glass and condensation, hand-drawn 70s wave motifs, everything finished with film grain and gentle halation. Type set in an aged Caslon. It threads Bali Water, Mountain Hippie, and your nostalgia saves into one coherent world.";
  if (t.includes("warm") || t.includes("analog") || t.includes("nostalg") || t.includes("film"))
    return "Your warm-analog cluster is the heart of the library — 11 of your last 16 saves live here. The unifying quality is <em>aged light</em>: low sun, soft halation, degraded stock. If you're briefing toward this, lead with the CRT interior and the market color study — they set the temperature best.";
  if (t.includes("packaging") || t.includes("brand"))
    return "Your packaging saves share a <em>handmade-retro</em> logic: the Mountain Hippie wave motif, ghost-sign lettering, riso texture. None of it is clean or corporate — it's warmth and imperfection as the value proposition. Good reference set for a craft-beverage or wellness brand.";
  return "Looking across all 57 saves, the through-line is <em>warm, analog, handmade</em> — sun-bleached light, film grain, and imperfect print. Ask me to find patterns, summarize a project, or build a creative direction from what you've collected.";
}
