// Toolbar.jsx — section title, result count, sort/view/export controls.
import Icon from "./Icon.jsx";

export default function Toolbar({
  title, total, shown, filtered, onClear, sort, setSort, view, setView,
}) {
  return (
    <div className="mb-tbar">
      <div>
        <div className="mb-tbar-title">{title}</div>
        <div className="mb-tbar-sub">
          {filtered
            ? <span>Showing <b>{shown}</b> of {total} items</span>
            : <span>{total} items</span>}
          {filtered && (
            <button className="mb-clear" onClick={onClear} style={{ marginLeft: 10 }}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="mb-tbar-r">
        <select className="mb-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">A–Z</option>
        </select>
        <div className="mb-seg">
          <button className={view === "grid" ? "on" : ""}
            onClick={() => setView("grid")} aria-label="Grid"><Icon name="grid" size={16} /></button>
          <button className={view === "list" ? "on" : ""}
            onClick={() => setView("list")} aria-label="List"><Icon name="list" size={16} /></button>
        </div>
        <button className="mb-select"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, paddingRight: 14 }}>
          <Icon name="export" size={15} /> Export
        </button>
      </div>
    </div>
  );
}
