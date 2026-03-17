import { useState, useRef, useCallback } from "react";
import { loadLeader, saveLeader, clearLeaderStorage } from "../utils/leaderIO";
import { defaultCrewLeader } from "../data/defaultCrewLeader";

export function useLeaderState() {
  const initial = loadLeader();
  const [leader, setLeader] = useState(initial);
  const savedLeaderRef = useRef(JSON.stringify(initial));

  const markSaved = (l) => {
    savedLeaderRef.current = JSON.stringify(l);
  };

  const hasUnsavedChanges = () => {
    return JSON.stringify(leader) !== savedLeaderRef.current;
  };

  const updateLeader = useCallback((field, value) => {
    setLeader((prev) => {
      const next = { ...prev, [field]: value };
      saveLeader(next);
      return next;
    });
  }, []);

  const updateSlot = useCallback((slotIndex, field, value) => {
    setLeader((prev) => {
      const slots = [...prev.slots];
      slots[slotIndex] = { ...slots[slotIndex], [field]: value };
      const next = { ...prev, slots };
      saveLeader(next);
      return next;
    });
  }, []);

  const replaceLeader = (l) => {
    setLeader(l);
    saveLeader(l);
    markSaved(l);
  };

  const resetLeader = () => {
    clearLeaderStorage();
    const fresh = { ...defaultCrewLeader };
    setLeader(fresh);
    markSaved(fresh);
  };

  const isModifiedFromDefault = () =>
    JSON.stringify(leader) !== JSON.stringify(defaultCrewLeader);

  return {
    leader,
    setLeader,
    markSaved,
    hasUnsavedChanges,
    replaceLeader,
    updateLeader,
    updateSlot,
    resetLeader,
    isModifiedFromDefault,
  };
}
