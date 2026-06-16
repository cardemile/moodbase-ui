// Icon.jsx — single stroke-based icon component used across the dashboard.
const ICONS = {
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-3.6-3.6",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z",
  grid: ["M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"],
  list: ["M8 6h12M8 12h12M8 18h12", "M4 6h.01M4 12h.01M4 18h.01"],
  chat: "M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12Z",
  sun: ["M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z", "M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"],
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z",
  plus: "M12 5v14M5 12h14",
  x: "M6 6l12 12M18 6L6 18",
  menu: ["M4 7h16M4 12h16M4 17h16"],
  similar: ["M12 3v18M3 12h18", "M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"],
  send: "M5 12h14M13 6l6 6-6 6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  export: ["M12 3v12", "M8 7l4-4 4 4", "M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"],
  open: ["M14 4h6v6", "M20 4l-9 9", "M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"],
};

export default function Icon({ name, size = 18, fill }) {
  const d = ICONS[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"}
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

// Build a gradient style from a [from, to] color pair (placeholder art).
export const grad = (c) => ({ background: `linear-gradient(150deg, ${c[0]}, ${c[1]})` });
