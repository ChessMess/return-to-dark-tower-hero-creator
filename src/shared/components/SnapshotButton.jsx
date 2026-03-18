export default function SnapshotButton({
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  disabled,
  holding,
  flash,
}) {
  return (
    <button
      type="button"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
      disabled={disabled}
      className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none select-none touch-none ${
        holding
          ? "bg-amber-600 border-amber-400 text-white scale-110"
          : flash
            ? "bg-amber-500 border-amber-400 text-white scale-110"
            : "bg-gray-800/80 border-gray-700 text-gray-300 hover:text-amber-400 hover:border-amber-500"
      }`}
      title="Click to copy image · Hold 3s to copy & download"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-3.5 h-3.5"
      >
        <path
          fillRule="evenodd"
          d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
