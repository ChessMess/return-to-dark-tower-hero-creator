import { useState, useRef } from "react";
import { loadHero, saveHero, getStorageBytes } from "../utils/heroIO";
import { defaultHero, MAX_VIRTUES, createEmptyVirtue } from "../data/defaultHero";

export function useHeroState() {
  const [hero, setHero] = useState(loadHero);
  const [portraitQuality, setPortraitQuality] = useState(1.0);
  const [storageWarning, setStorageWarning] = useState(null);
  const [storageBytes, setStorageBytes] = useState(() => getStorageBytes());
  const savedHeroRef = useRef(JSON.stringify(loadHero()));

  const markSaved = (h) => {
    savedHeroRef.current = JSON.stringify(h);
  };

  const hasUnsavedChanges = () => {
    return JSON.stringify(hero) !== savedHeroRef.current;
  };

  const saveAndCheck = (next) => {
    saveHero(next);
    const bytes = getStorageBytes();
    setStorageBytes(bytes);
    if (bytes > 4_500_000) setStorageWarning("danger");
    else if (bytes > 3_000_000) setStorageWarning("warn");
    else setStorageWarning(null);
  };

  const updateHero = (field, value) =>
    setHero((prev) => {
      const next = { ...prev, [field]: value };
      saveAndCheck(next);
      return next;
    });

  const updateVirtue = (index, field, value) =>
    setHero((prev) => {
      const virtues = [...prev.virtues];
      virtues[index] = { ...virtues[index], [field]: value };
      const next = { ...prev, virtues };
      saveAndCheck(next);
      return next;
    });

  const addVirtue = () =>
    setHero((prev) => {
      if (prev.virtues.length >= MAX_VIRTUES) return prev;
      const next = {
        ...prev,
        virtues: [
          ...prev.virtues,
          createEmptyVirtue(`VIRTUE ${prev.virtues.length + 1}`),
        ],
      };
      saveAndCheck(next);
      return next;
    });

  const removeVirtue = (index) =>
    setHero((prev) => {
      const virtues = prev.virtues.filter((_, i) => i !== index);
      const next = { ...prev, virtues };
      saveAndCheck(next);
      return next;
    });

  const reorderVirtues = (from, to) =>
    setHero((prev) => {
      const virtues = [...prev.virtues];
      const [moved] = virtues.splice(from, 1);
      virtues.splice(to, 0, moved);
      const next = { ...prev, virtues };
      saveAndCheck(next);
      return next;
    });

  const hasChanges = () => JSON.stringify(hero) !== JSON.stringify(defaultHero);

  return {
    hero,
    setHero,
    portraitQuality,
    setPortraitQuality,
    storageWarning,
    storageBytes,
    markSaved,
    hasUnsavedChanges,
    saveAndCheck,
    updateHero,
    updateVirtue,
    addVirtue,
    removeVirtue,
    reorderVirtues,
    hasChanges,
  };
}
