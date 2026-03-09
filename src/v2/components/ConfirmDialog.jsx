import { useEffect } from "react";

export default function ConfirmDialog({ confirmState, onConfirm, onCancel }) {
  useEffect(() => {
    if (!confirmState) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (confirmState.cancelLabel !== null) onCancel();
        else onConfirm();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [confirmState, onCancel, onConfirm]);

  if (!confirmState) return null;

  const { title, message, confirmLabel, cancelLabel, destructive } = confirmState;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-amber-700/60 rounded-lg p-6 w-80 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">{title}</h2>
        <p className="text-xs text-gray-300">{message}</p>
        <div className="flex gap-2 justify-end pt-1">
          {cancelLabel !== null && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-4 py-1.5 transition-colors"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded text-white text-xs px-4 py-1.5 font-bold transition-colors ${
              destructive
                ? "bg-red-800 hover:bg-red-700"
                : "bg-amber-700 hover:bg-amber-600"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
