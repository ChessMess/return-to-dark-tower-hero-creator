import { useState, useRef, useEffect } from "react";
import {
  heroToJson,
  validateHeroData,
  loadHeroFromHandle,
  loadRecents,
  addToRecents,
  removeFromRecents,
  clearAllRecents,
} from "../utils/heroIO";

export function useFileIO({ heroState, confirm, showPrompt, showStatus }) {
  const { hero, setHero, saveAndCheck, markSaved, hasUnsavedChanges } = heroState;
  const fileHandleRef = useRef(null);
  const [recents, setRecents] = useState([]);

  useEffect(() => {
    loadRecents().then(setRecents);
  }, []);

  const writeToFileHandle = async (handle, json) => {
    const writable = await handle.createWritable();
    await writable.write(json);
    await writable.close();
  };

  const handleSaveJson = async () => {
    const json = heroToJson(hero);

    if (fileHandleRef.current) {
      try {
        await writeToFileHandle(fileHandleRef.current, json);
        markSaved(hero);
        showStatus(`Saved to ${fileHandleRef.current.name}`);
        setRecents(await addToRecents(fileHandleRef.current, hero));
        return;
      } catch {
        fileHandleRef.current = null;
      }
    }

    if (window.showSaveFilePicker) {
      const defaultName =
        hero.name && hero.name !== "HERO NAME"
          ? hero.name.toLowerCase().replace(/\s+/g, "-")
          : "hero";
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: `${defaultName}.json`,
          types: [
            {
              description: "JSON file",
              accept: { "application/json": [".json"] },
            },
          ],
        });
        await writeToFileHandle(handle, json);
        fileHandleRef.current = handle;
        markSaved(hero);
        showStatus(`Saved to ${handle.name}`);
        setRecents(await addToRecents(handle, hero));
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    // Fallback: legacy download
    const defaultName =
      hero.name && hero.name !== "HERO NAME"
        ? hero.name.toLowerCase().replace(/\s+/g, "-")
        : "hero";
    const filename = await showPrompt({
      title: "Save Hero",
      message: "File name:",
      defaultValue: defaultName,
    });
    if (!filename) return;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".json") ? filename : `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
    markSaved(hero);
    showStatus("Hero saved to file");
  };

  const handleLoadJson = async () => {
    if (hasUnsavedChanges()) {
      const ok = await confirm({
        title: "Load Hero",
        message: "Current unsaved changes will be lost.",
        confirmLabel: "Load",
        destructive: true,
      });
      if (!ok) return;
    }

    if (window.showOpenFilePicker) {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [
            {
              description: "JSON file",
              accept: { "application/json": [".json"] },
            },
          ],
        });
        const file = await handle.getFile();
        const text = await file.text();
        const data = JSON.parse(text);
        const result = validateHeroData(data);
        if (result.valid) {
          fileHandleRef.current = handle;
          setHero(result.hero);
          saveAndCheck(result.hero);
          markSaved(result.hero);
          showStatus(`Loaded from ${handle.name}`);
          setRecents(await addToRecents(handle, result.hero));
        } else {
          showStatus(result.error, "error");
        }
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
        if (err instanceof SyntaxError) {
          showStatus("Invalid JSON file", "error");
          return;
        }
      }
    }

    // Fallback: legacy file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          const result = validateHeroData(data);
          if (result.valid) {
            fileHandleRef.current = null;
            setHero(result.hero);
            saveAndCheck(result.hero);
            markSaved(result.hero);
            showStatus("Hero loaded from file");
          } else {
            showStatus(result.error, "error");
          }
        } catch {
          showStatus("Invalid JSON file", "error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(heroToJson(hero));
      showStatus("Hero copied to clipboard");
    } catch {
      showStatus("Copy failed — check browser permissions", "error");
    }
  };

  // Returns true on success so the caller can close the paste modal
  const handlePasteSubmit = async (text) => {
    if (hasUnsavedChanges()) {
      const ok = await confirm({
        title: "Load Pasted Hero",
        message: "Current unsaved changes will be lost.",
        confirmLabel: "Load",
        destructive: true,
      });
      if (!ok) return false;
    }
    try {
      const data = JSON.parse(text);
      const result = validateHeroData(data);
      if (result.valid) {
        fileHandleRef.current = null;
        setHero(result.hero);
        saveAndCheck(result.hero);
        markSaved(result.hero);
        showStatus("Hero pasted successfully");
        return true;
      } else {
        showStatus(result.error, "error");
      }
    } catch {
      showStatus("Invalid JSON — check the pasted text", "error");
    }
    return false;
  };

  const handleLoadRecent = async (entry) => {
    if (hasUnsavedChanges()) {
      const ok = await confirm({
        title: "Load Hero",
        message: `"${entry.heroName || entry.fileName}" — current unsaved changes will be lost.`,
        confirmLabel: "Load",
        destructive: true,
      });
      if (!ok) return;
    }
    try {
      const data = await loadHeroFromHandle(entry.handle);
      const result = validateHeroData(data);
      if (result.valid) {
        fileHandleRef.current = entry.handle;
        setHero(result.hero);
        saveAndCheck(result.hero);
        markSaved(result.hero);
        showStatus(`Loaded from ${entry.fileName}`);
      } else {
        showStatus(result.error, "error");
      }
    } catch {
      showStatus("File could not be found", "error");
      setRecents(await removeFromRecents(entry.id));
    }
  };

  const handleRemoveRecent = async (e, id) => {
    e.stopPropagation();
    setRecents(await removeFromRecents(id));
  };

  const handleOpenRecentInNewWindow = async (entry) => {
    try {
      const data = await loadHeroFromHandle(entry.handle);
      const result = validateHeroData(data);
      if (!result.valid) {
        showStatus(result.error, "error");
        return;
      }
      localStorage.setItem(
        "rtdt-hero-handoff",
        JSON.stringify({
          hero: result.hero,
          fileName: entry.fileName,
          timestamp: Date.now(),
        }),
      );
      const newWin = window.open(import.meta.env.BASE_URL || "/", "_blank");
      if (!newWin) {
        localStorage.removeItem("rtdt-hero-handoff");
        showStatus("Pop-up blocked — allow pop-ups for this site", "error");
      }
    } catch {
      showStatus(
        "Could not open file — it may have been moved or deleted",
        "error",
      );
      setRecents(await removeFromRecents(entry.id));
    }
  };

  const handleClearRecents = async () => {
    setRecents(await clearAllRecents());
  };

  const formatTimeAgo = (ts) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return {
    fileHandleRef,
    recents,
    handleSaveJson,
    handleLoadJson,
    handleCopyToClipboard,
    handlePasteSubmit,
    handleLoadRecent,
    handleRemoveRecent,
    handleOpenRecentInNewWindow,
    handleClearRecents,
    formatTimeAgo,
  };
}
