import { useState } from "react";
import { MAX_VIRTUES } from "../data/defaultHero";

const inputClass =
  "mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500";

export default function VirtueEditor({
  hero,
  updateVirtue,
  removeVirtue,
  reorderVirtues,
  addVirtue,
}) {
  const [activeVirtue, setActiveVirtue] = useState(0);
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  // Clamp active virtue when virtues are removed
  const clampedActive = Math.min(
    activeVirtue,
    Math.max(0, hero.virtues.length - 1),
  );
  if (clampedActive !== activeVirtue) setActiveVirtue(clampedActive);

  const virtue = hero.virtues[clampedActive];

  const handleAddVirtue = () => {
    const newVirtueIndex = hero.virtues.length;
    addVirtue();
    setActiveVirtue(newVirtueIndex);
  };

  return (
    <div className="space-y-2">
      {hero.virtues.length > 0 ? (
        <>
          {/* Navigation */}
          <div className="flex items-stretch gap-1">
            <button
              type="button"
              onClick={() =>
                setActiveVirtue((v) =>
                  v === 0 ? hero.virtues.length - 1 : v - 1,
                )
              }
              className="shrink-0 rounded bg-gray-700 border border-gray-600 px-1.5 py-1 text-xs text-gray-100 hover:border-amber-500 hover:text-amber-400 transition-colors"
            >
              ◀
            </button>
            <select
              value={clampedActive}
              onChange={(e) => setActiveVirtue(Number(e.target.value))}
              className="min-w-0 flex-1 rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
            >
              {hero.virtues.map((v, i) => (
                <option key={i} value={i}>
                  Virtue {i + 1} — {v.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                setActiveVirtue((v) =>
                  v === hero.virtues.length - 1 ? 0 : v + 1,
                )
              }
              className="shrink-0 rounded bg-gray-700 border border-gray-600 px-1.5 py-1 text-xs text-gray-100 hover:border-amber-500 hover:text-amber-400 transition-colors"
            >
              ▶
            </button>
          </div>

          {/* Virtue editor */}
          {virtue && (
            <div className="space-y-2 bg-gray-750 rounded p-2 border border-gray-700">
              <label className="block">
                <span className="text-gray-400 text-xs">Virtue Name</span>
                <input
                  type="text"
                  value={virtue.name}
                  maxLength={12}
                  onChange={(e) =>
                    updateVirtue(clampedActive, "name", e.target.value)
                  }
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="text-gray-400 text-xs">Type</span>
                <select
                  value={virtue.type}
                  onChange={(e) =>
                    updateVirtue(clampedActive, "type", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="standard">Standard</option>
                  <option value="standard_default">Standard Default</option>
                  <option value="advantage">Advantage</option>
                  <option value="advantage_default">Advantage Default</option>
                  <option value="champion">Champion</option>
                </select>
              </label>

              {virtue.type === "champion" && (
                <label className="block">
                  <span className="text-gray-400 text-xs">Kingdom</span>
                  <select
                    value={virtue.kingdom}
                    onChange={(e) =>
                      updateVirtue(clampedActive, "kingdom", e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">ALL</option>
                    <option value="NORTH">NORTH</option>
                    <option value="SOUTH">SOUTH</option>
                    <option value="EAST">EAST</option>
                    <option value="WEST">WEST</option>
                  </select>
                </label>
              )}

              <label className="block">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-xs">
                    Ability Description
                  </span>
                  <span className="text-gray-600 text-xs">
                    {(virtue.description || "").length}/80
                  </span>
                </div>
                <textarea
                  value={virtue.description}
                  maxLength={80}
                  rows={3}
                  onChange={(e) =>
                    updateVirtue(clampedActive, "description", e.target.value)
                  }
                  className={inputClass + " resize-none"}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  removeVirtue(clampedActive);
                  setActiveVirtue((v) => Math.max(0, v - 1));
                }}
                className="w-full text-xs text-gray-400 hover:text-red-400 border border-gray-600 hover:border-red-700 rounded py-1 transition-colors"
              >
                Remove Virtue
              </button>
            </div>
          )}

          {/* Reorder */}
          {hero.virtues.length > 1 && (
            <div className="pt-1 space-y-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                Drag to reorder · click to select
              </p>
              <div className="flex flex-wrap gap-1">
                {hero.virtues.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    draggable
                    onDragStart={() => setDragFrom(i)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(i);
                    }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragFrom !== null && dragFrom !== i) {
                        reorderVirtues(dragFrom, i);
                        setActiveVirtue(i);
                      }
                      setDragFrom(null);
                      setDragOver(null);
                    }}
                    onDragEnd={() => {
                      setDragFrom(null);
                      setDragOver(null);
                    }}
                    onClick={() => setActiveVirtue(i)}
                    className={[
                      "flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors cursor-grab active:cursor-grabbing select-none",
                      clampedActive === i
                        ? "border-amber-500 text-amber-300 bg-gray-700"
                        : "border-gray-600 text-gray-300 bg-gray-800 hover:border-amber-600 hover:text-gray-100",
                      dragFrom === i ? "opacity-40" : "",
                      dragOver === i && dragFrom !== i
                        ? "border-amber-400 bg-amber-900/20"
                        : "",
                    ].join(" ")}
                  >
                    <span className="text-gray-500 text-[10px]">⠿</span>
                    <span>{v.name || "—"}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-xs italic">No virtues. Add one below.</p>
      )}

      {hero.virtues.length < MAX_VIRTUES && (
        <button
          type="button"
          onClick={handleAddVirtue}
          className="w-full rounded bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-amber-500 text-gray-300 hover:text-amber-400 text-xs py-1.5 transition-colors"
        >
          + Add Virtue ({hero.virtues.length}/{MAX_VIRTUES})
        </button>
      )}
    </div>
  );
}
