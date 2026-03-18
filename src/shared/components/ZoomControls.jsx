export default function ZoomControls({ zoom, onZoom, min = 0.25, max = 3, step = 0.25 }) {
  return (
    <div className="flex items-center gap-1 bg-gray-800/80 border border-gray-700 rounded-lg px-1 py-0">
      <button
        type="button"
        onClick={() => onZoom((z) => Math.max(min, +(z - step).toFixed(2)))}
        className="px-2 py-1 flex items-center justify-center rounded text-gray-300 hover:bg-gray-700 text-xs font-bold transition-colors"
      >
        −
      </button>
      <button
        type="button"
        onClick={() => onZoom(1)}
        className="px-1.5 py-1 flex items-center justify-center rounded text-gray-400 hover:bg-gray-700 text-xs tabular-nums transition-colors"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        type="button"
        onClick={() => onZoom((z) => Math.min(max, +(z + step).toFixed(2)))}
        className="px-2 py-1 flex items-center justify-center rounded text-gray-300 hover:bg-gray-700 text-xs font-bold transition-colors"
      >
        +
      </button>
    </div>
  );
}
