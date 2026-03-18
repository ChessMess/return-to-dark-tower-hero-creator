export default function CollapsibleSection({ title, isOpen, onToggle, children }) {
  return (
    <section>
      <h2
        className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 border-b border-amber-900 pb-1 flex items-center justify-between cursor-pointer select-none"
        onClick={onToggle}
      >
        <span>{title}</span>
        <span className="w-6 h-6 inline-flex items-center justify-center rounded bg-gray-800 border border-gray-700 text-amber-600 hover:text-amber-400 hover:border-amber-500 transition-colors text-[10px] leading-[0]">
          {isOpen ? "▼" : "▲"}
        </span>
      </h2>
      {isOpen && children}
    </section>
  );
}
