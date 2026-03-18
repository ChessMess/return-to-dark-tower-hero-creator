export default function SidebarToggleButton({ open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle sidebar"
      aria-expanded={open}
      className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 border border-gray-700 text-gray-400 hover:text-amber-400 hover:border-amber-500 transition-colors text-sm"
    >
      {open ? "\u00AB" : "\u00BB"}
    </button>
  );
}
