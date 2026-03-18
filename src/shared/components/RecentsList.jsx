export default function RecentsList({ label, onClearAll, children }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {label}
        </h3>
        <button
          type="button"
          onClick={onClearAll}
          className="w-4 h-4 flex items-center justify-center rounded text-gray-500 hover:text-red-400 hover:bg-gray-600 transition-colors text-xs leading-none"
          aria-label={`Clear all ${label.toLowerCase()}`}
          title="Clear all"
        >
          ×
        </button>
      </div>
      <div className="max-h-32 overflow-y-auto space-y-1">
        {children}
      </div>
    </div>
  );
}
