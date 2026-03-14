import { useState, useCallback } from "react";
import { optimizeImage, isGif } from "../utils/heroIO";
import { MAX_VIRTUES } from "../data/defaultHero";
import { THEME_PRESETS, deriveThemeFromBaseColor, resolveTheme, validateThemeData } from "../data/themes";
import CollapsibleSection from "./CollapsibleSection";
import VirtueEditor from "./VirtueEditor";
import ConfirmDialog from "./ConfirmDialog";
import { useConfirm } from "../hooks/useConfirm";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const inputClass =
  "mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500";

const PRESET_ENTRIES = Object.entries(THEME_PRESETS);

function ThemeSection({ hero, updateHero }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [themeStatus, setThemeStatus] = useState(null);
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();

  const showThemeMsg = (text, type = "success") => {
    setThemeStatus({ text, type });
    setTimeout(() => setThemeStatus(null), 3000);
  };

  const selectPreset = useCallback(async (id) => {
    if (hero.theme === 'custom') {
      const ok = await confirm({
        title: 'Switch Theme?',
        message: 'Your custom theme changes will be lost. Switch to a preset theme?',
        confirmLabel: 'Switch Theme',
        cancelLabel: 'Keep Custom',
        destructive: true,
      });
      if (!ok) return;
    }
    updateHero("theme", id);
    updateHero("customTheme", null);
  }, [hero.theme, updateHero, confirm]);

  const handleBaseColor = useCallback((e) => {
    const derived = deriveThemeFromBaseColor(e.target.value);
    updateHero("theme", "custom");
    updateHero("customTheme", derived);
  }, [updateHero]);

  const updateCustomField = useCallback((field, value) => {
    const current = hero.customTheme || THEME_PRESETS[hero.theme] || THEME_PRESETS.orphaned_scion;
    const next = { ...current, [field]: value };
    updateHero("theme", "custom");
    updateHero("customTheme", next);
  }, [hero.theme, hero.customTheme, updateHero]);

  const handleCopyTheme = async () => {
    const theme = resolveTheme(hero.theme, hero.customTheme);
    try {
      await navigator.clipboard.writeText(JSON.stringify(theme, null, 2));
      showThemeMsg("Theme copied to clipboard");
    } catch {
      showThemeMsg("Copy failed", "error");
    }
  };

  const handlePasteTheme = () => {
    const textarea = document.getElementById("theme-paste-textarea");
    if (!textarea) return;
    const text = textarea.value.trim();
    if (!text) {
      showThemeMsg("Paste a theme JSON first", "error");
      return;
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      showThemeMsg("Invalid JSON", "error");
      return;
    }
    const result = validateThemeData(data);
    if (!result.valid) {
      showThemeMsg(result.error, "error");
      return;
    }
    updateHero("theme", "custom");
    updateHero("customTheme", result.theme);
    setShowPaste(false);
    showThemeMsg(`Loaded theme: ${result.theme.name}`);
  };

  const activeTheme = hero.theme || "orphaned_scion";
  const currentColors = hero.customTheme || THEME_PRESETS[activeTheme] || THEME_PRESETS.orphaned_scion;

  return (
    <div className="space-y-3">
      {/* Preset selector */}
      <div className="flex items-stretch gap-1">
        <button
          type="button"
          onClick={() => {
            const idx = PRESET_ENTRIES.findIndex(([id]) => id === activeTheme);
            const prevIdx = idx <= 0 ? PRESET_ENTRIES.length - 1 : idx - 1;
            selectPreset(PRESET_ENTRIES[prevIdx][0]);
          }}
          className="shrink-0 rounded bg-gray-700 border border-gray-600 px-1.5 py-1 text-xs text-gray-100 hover:border-amber-500 hover:text-amber-400 transition-colors"
        >
          ◀
        </button>
        <select
          value={activeTheme === "custom" ? "custom" : activeTheme}
          onChange={(e) => {
            if (e.target.value === "custom") return;
            selectPreset(e.target.value);
          }}
          className="min-w-0 flex-1 rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
        >
          {PRESET_ENTRIES.map(([id, preset]) => (
            <option key={id} value={id}>
              {preset.name}
            </option>
          ))}
          {activeTheme === "custom" && (
            <option value="custom">Custom</option>
          )}
        </select>
        <button
          type="button"
          onClick={() => {
            const idx = PRESET_ENTRIES.findIndex(([id]) => id === activeTheme);
            const nextIdx = idx < 0 || idx >= PRESET_ENTRIES.length - 1 ? 0 : idx + 1;
            selectPreset(PRESET_ENTRIES[nextIdx][0]);
          }}
          className="shrink-0 rounded bg-gray-700 border border-gray-600 px-1.5 py-1 text-xs text-gray-100 hover:border-amber-500 hover:text-amber-400 transition-colors"
        >
          ▶
        </button>
      </div>

      {/* Base color picker */}
      <div className="flex items-center gap-2">
        <label className="text-gray-400 text-xs shrink-0">Base Color</label>
        <input
          type="color"
          value={currentColors.boardColors[0]}
          onChange={handleBaseColor}
          className="w-8 h-6 rounded border border-gray-600 bg-gray-700 cursor-pointer"
        />
        <span className="text-gray-500 text-xs font-mono">{currentColors.boardColors[0]}</span>
      </div>

      {/* Advanced toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced((s) => !s)}
        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        {showAdvanced ? "▲ Hide Advanced" : "▼ Advanced Colors"}
      </button>

      {showAdvanced && (
        <div className="space-y-2 pl-1">
          <ColorRow
            label="Main Background"
            value={currentColors.boardColors[0]}
            onChange={(hex) => {
              const derived = deriveThemeFromBaseColor(hex);
              updateHero("theme", "custom");
              updateHero("customTheme", derived);
            }}
          />
          <ColorRow
            label="Header Background"
            value={currentColors.headerBgColor}
            onChange={(hex) => updateCustomField("headerBgColor", hex)}
          />
          <ColorRow
            label="Board Text"
            value={currentColors.headerTextColor}
            onChange={(hex) => updateCustomField("headerTextColor", hex)}
          />
          <ColorRow
            label="Icon Color"
            value={currentColors.iconColor || '#f0e9dc'}
            onChange={(hex) => updateCustomField("iconColor", hex)}
          />
          <ColorRow
            label="Flavor Text Opacity"
            value={currentColors.flavorOpacity}
            isOpacity
            onChange={(val) => updateCustomField("flavorOpacity", val)}
          />
        </div>
      )}

      {/* Copy / Paste theme */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopyTheme}
          className="flex-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-1.5 uppercase tracking-wider transition-colors"
        >
          Copy Theme
        </button>
        <button
          type="button"
          onClick={() => setShowPaste((s) => !s)}
          className="flex-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-1.5 uppercase tracking-wider transition-colors"
        >
          Paste Theme
        </button>
      </div>

      {showPaste && (
        <div className="space-y-2">
          <textarea
            id="theme-paste-textarea"
            rows={6}
            placeholder="Paste theme JSON here..."
            autoFocus
            className="w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-xs text-gray-100 font-mono focus:outline-none focus:border-amber-500 resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowPaste(false)}
              className="rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-3 py-1 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePasteTheme}
              className="rounded bg-amber-700 hover:bg-amber-600 text-white text-xs px-3 py-1 font-bold transition-colors"
            >
              Load
            </button>
          </div>
        </div>
      )}

      {themeStatus && (
        <div
          className={`text-xs text-center py-1 rounded ${
            themeStatus.type === "error"
              ? "text-red-400 bg-red-900/30"
              : "text-green-400 bg-green-900/30"
          }`}
        >
          {themeStatus.text}
        </div>
      )}
      <ConfirmDialog confirmState={confirmState} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
}

function ColorRow({ label, value, onChange, isOpacity = false }) {
  if (isOpacity) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-xs w-28 shrink-0">{label}</span>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-amber-500"
        />
        <span className="text-gray-500 text-xs font-mono w-8 text-right">
          {Math.round(value * 100)}%
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-xs w-28 shrink-0">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-6 rounded border border-gray-600 bg-gray-700 cursor-pointer"
      />
      <span className="text-gray-500 text-xs font-mono">{value}</span>
    </div>
  );
}

export default function HeroForm({
  hero,
  updateHero,
  updateVirtue,
  addVirtue,
  removeVirtue,
  reorderVirtues,
  portraitQuality,
  setPortraitQuality,
  storageWarning,
  storageBytes,
}) {
  const [dragging, setDragging] = useState(false);
  const [dropError, setDropError] = useState(null);
  const [openSections, setOpenSections] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("rtdt-v2-sections"));
      if (saved) return saved;
    } catch {}
    return { identity: true, banner: true, virtues: true, theme: true, author: true };
  });

  const toggle = (key) =>
    setOpenSections((s) => {
      const next = { ...s, [key]: !s[key] };
      localStorage.setItem("rtdt-v2-sections", JSON.stringify(next));
      return next;
    });

  const loadPortraitFile = async (file) => {
    if (!file || !ALLOWED_IMAGE_TYPES.has(file.type)) return;
    if (isGif(file)) {
      const reader = new FileReader();
      reader.onload = (evt) => updateHero("portraitDataUrl", evt.target.result);
      reader.readAsDataURL(file);
      return;
    }
    try {
      const dataUrl = await optimizeImage(file, { quality: portraitQuality });
      updateHero("portraitDataUrl", dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = (evt) => updateHero("portraitDataUrl", evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRecompress = () => {
    if (!hero.portraitDataUrl) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      updateHero("portraitDataUrl", canvas.toDataURL("image/jpeg", portraitQuality));
    };
    img.src = hero.portraitDataUrl;
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadPortraitFile(e.dataTransfer.files[0]);
      return;
    }
    const url =
      e.dataTransfer.getData("text/uri-list") ||
      e.dataTransfer.getData("text/plain");
    if (url) {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        if (blob.type.startsWith("image/")) {
          loadPortraitFile(new File([blob], "dropped-image", { type: blob.type }));
        }
      } catch {
        const html = e.dataTransfer.getData("text/html");
        const match = html && html.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match) {
          try {
            const res = await fetch(match[1]);
            const blob = await res.blob();
            loadPortraitFile(new File([blob], "dropped-image", { type: blob.type }));
            return;
          } catch {
            /* fall through to error */
          }
        }
        setDropError("Could not load image — please save it locally first");
        setTimeout(() => setDropError(null), 3500);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  return (
    <div className="space-y-6 text-sm">
      {/* Hero Identity */}
      <CollapsibleSection
        title="Hero Identity"
        isOpen={openSections.identity}
        onToggle={() => toggle("identity")}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block">
              <span className="text-gray-400 text-xs">Name</span>
              <input
                type="text"
                value={hero.name}
                maxLength={20}
                onChange={(e) => updateHero("name", e.target.value)}
                className={inputClass}
              />
            </label>
            <div className="flex gap-3">
              <label className="flex-1">
                <span className="text-gray-400 text-xs">Starting Warriors</span>
                <input
                  type="number"
                  value={hero.warriors}
                  min={1}
                  max={99}
                  onChange={(e) =>
                    updateHero(
                      "warriors",
                      Math.max(1, Math.min(99, parseInt(e.target.value) || 1)),
                    )
                  }
                  className={inputClass}
                />
              </label>
              <label className="flex-1">
                <span className="text-gray-400 text-xs">Starting Spirit</span>
                <input
                  type="number"
                  value={hero.spirit}
                  min={0}
                  max={9}
                  onChange={(e) =>
                    updateHero(
                      "spirit",
                      Math.max(0, Math.min(9, parseInt(e.target.value) || 0)),
                    )
                  }
                  className={inputClass}
                />
              </label>
            </div>
          </div>

          {/* Portrait */}
          <div className="space-y-2">
            <span className="text-gray-400 text-xs">Portrait</span>
            {hero.portraitDataUrl ? (
              <div
                className="space-y-2"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div
                  className={`relative rounded transition-colors ${dragging ? "ring-2 ring-amber-400" : ""}`}
                >
                  <img
                    src={hero.portraitDataUrl}
                    alt="Hero portrait preview"
                    className="w-full h-28 object-cover rounded border border-gray-600"
                  />
                  {dragging && (
                    <div className="absolute inset-0 bg-amber-900/40 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-amber-200">
                        Drop to replace
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => updateHero("portraitDataUrl", null)}
                  className="w-full text-xs text-gray-400 hover:text-red-400 border border-gray-600 hover:border-red-700 rounded py-1 transition-colors"
                >
                  Remove portrait
                </button>
              </div>
            ) : (
              <label
                className="block cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div
                  className={`border-2 border-dashed rounded p-4 text-center transition-colors ${dragging ? "border-amber-400 text-gray-200 bg-amber-900/20" : "border-gray-600 hover:border-amber-600 text-gray-500 hover:text-gray-300"}`}
                >
                  <div className="text-2xl mb-1">+</div>
                  <div className="text-xs">
                    {dragging ? "Drop image here" : "Click or drag image here"}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    JPG, PNG, GIF, WEBP
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => loadPortraitFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}

            {/* Quality controls */}
            <div className="space-y-1 pt-1">
              <p
                className={`text-xs text-right ${storageWarning === "danger" ? "text-red-400" : storageWarning === "warn" ? "text-yellow-400" : "text-gray-600"}`}
              >
                storage size:{" "}
                {storageBytes < 1048576
                  ? `${Math.round(storageBytes / 1024)} KB`
                  : `${(storageBytes / 1048576).toFixed(1)} MB`}
              </p>
              {storageWarning && (
                <>
                  <div
                    className={`text-xs rounded p-2 ${
                      storageWarning === "danger"
                        ? "bg-red-900/40 border border-red-700 text-red-300"
                        : "bg-yellow-900/40 border border-yellow-700 text-yellow-300"
                    }`}
                  >
                    {storageWarning === "danger"
                      ? `Storage nearly full. Reduce portrait quality to avoid data loss.${isGif(hero.portraitDataUrl) ? " Recompressing will convert to static JPEG." : ""}`
                      : `Portrait is large. Consider recompressing at a lower quality.${isGif(hero.portraitDataUrl) ? " Recompressing will convert to static JPEG." : ""}`}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">
                      Quality: {Math.round(portraitQuality * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={portraitQuality}
                    onChange={(e) => setPortraitQuality(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  {hero.portraitDataUrl && (
                    <button
                      type="button"
                      onClick={handleRecompress}
                      className="w-full text-xs text-gray-400 hover:text-amber-400 border border-gray-600 hover:border-amber-600 rounded py-1 transition-colors"
                    >
                      {isGif(hero.portraitDataUrl)
                        ? `Convert to JPEG at ${Math.round(portraitQuality * 100)}% (loses animation)`
                        : `Recompress at ${Math.round(portraitQuality * 100)}%`}
                    </button>
                  )}
                </>
              )}
            </div>
            {dropError && (
              <p className="text-xs text-red-400 bg-red-900/30 border border-red-800 rounded px-2 py-1.5 animate-pulse">
                {dropError}
              </p>
            )}
          </div>

          {/* Flavor Text */}
          <label className="block">
            <span className="text-gray-400 text-xs">Flavor Text</span>
            <textarea
              value={hero.flavorText}
              maxLength={120}
              rows={4}
              onChange={(e) => updateHero("flavorText", e.target.value)}
              className={`${inputClass} resize-none`}
            />
            <span className="text-gray-500 text-xs text-right block mt-0.5">
              {(hero.flavorText ?? "").length}/120
            </span>
          </label>
        </div>
      </CollapsibleSection>

      {/* Banner Action */}
      <CollapsibleSection
        title="Banner Action"
        isOpen={openSections.banner}
        onToggle={() => toggle("banner")}
      >
        <label className="block">
          <span className="text-gray-400 text-xs">Action Text</span>
          <input
            type="text"
            value={hero.bannerAction}
            maxLength={40}
            onChange={(e) => updateHero("bannerAction", e.target.value)}
            className={inputClass}
          />
        </label>
      </CollapsibleSection>

      {/* Virtues */}
      <CollapsibleSection
        title={`Virtues (${hero.virtues.length}/${MAX_VIRTUES})`}
        isOpen={openSections.virtues}
        onToggle={() => toggle("virtues")}
      >
        <VirtueEditor
          hero={hero}
          updateVirtue={updateVirtue}
          removeVirtue={removeVirtue}
          reorderVirtues={reorderVirtues}
          addVirtue={addVirtue}
        />
      </CollapsibleSection>

      {/* Board Theme */}
      <CollapsibleSection
        title="Board Theme"
        isOpen={openSections.theme}
        onToggle={() => toggle("theme")}
      >
        <ThemeSection hero={hero} updateHero={updateHero} />
      </CollapsibleSection>

      {/* Author Info */}
      <CollapsibleSection
        title="Author Info"
        isOpen={openSections.author}
        onToggle={() => toggle("author")}
      >
        <div className="space-y-3">
          <label className="block">
            <div className="flex justify-between mb-1">
              <span className="text-gray-400 text-xs">Author Name</span>
              <span className="text-gray-600 text-xs">
                {(hero.author_name || "").length}/50
              </span>
            </div>
            <input
              type="text"
              value={hero.author_name || ""}
              maxLength={50}
              onChange={(e) => updateHero("author_name", e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-gray-400 text-xs">Revision</span>
            <input
              type="text"
              value={hero.revision_no || ""}
              maxLength={8}
              onChange={(e) => updateHero("revision_no", e.target.value)}
              placeholder="e.g. 1.0, v2, draft"
              className={inputClass}
            />
          </label>
          <label className="block">
            <div className="flex justify-between mb-1">
              <span className="text-gray-400 text-xs">Description</span>
              <span className="text-gray-600 text-xs">
                {(hero.description || "").length}/1000
              </span>
            </div>
            <textarea
              value={hero.description || ""}
              maxLength={1000}
              rows={4}
              onChange={(e) => updateHero("description", e.target.value)}
              placeholder="Notes about this hero board..."
              className={inputClass + " resize-none"}
            />
          </label>
          <label className="block">
            <div className="flex justify-between mb-1">
              <span className="text-gray-400 text-xs">Contact</span>
              <span className="text-gray-600 text-xs">
                {(hero.contact || "").length}/250
              </span>
            </div>
            <input
              type="text"
              value={hero.contact || ""}
              maxLength={250}
              onChange={(e) => updateHero("contact", e.target.value)}
              placeholder="Email, URL, or handle"
              className={inputClass}
            />
          </label>
        </div>
      </CollapsibleSection>

      <div className="h-4" />
    </div>
  );
}
