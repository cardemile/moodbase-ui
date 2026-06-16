// TasteSignature.jsx — the editorial hero band synthesizing the library.
import Icon from "./Icon.jsx";

export default function TasteSignature({ sig, onMotif, onAsk }) {
  return (
    <section className="mb-sig">
      <div className="mb-sig-top">
        <span className="kicker">Your taste signature · synthesized today</span>
      </div>

      {/* Static headline for the demo. In production, render your synthesized
          copy here; wrap emphasized phrases in <em> for the accent color. */}
      <h2 className="mb-sig-line">
        This month your taste leans into <em>sun-bleached analog warmth</em>,
        handmade packaging, and the soft imperfection of <em>degraded film</em>.
      </h2>

      <div className="mb-sig-row">
        <div className="mb-sig-block">
          <span className="kicker">Extracted palette</span>
          <div className="mb-palette">
            {sig.palette.map((c, i) => <i key={i} style={{ background: c }} />)}
          </div>
        </div>
        <div className="mb-sig-block">
          <span className="kicker">Recurring motifs</span>
          <div className="mb-motifs">
            {sig.motifs.map((m) => (
              <button key={m} className="mb-motif" onClick={() => onMotif(m)}>{m}</button>
            ))}
          </div>
        </div>
        <button className="mb-sig-ask" onClick={onAsk}>
          Ask your brain about this <Icon name="arrow" size={15} />
        </button>
      </div>
    </section>
  );
}
