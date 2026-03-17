import { useState } from "react";
import { submitLeader, withdrawPendingLeader, isPendingHashValid } from "../utils/firebase";
import { savePendingRef, getPendingRef, clearPendingRef } from "../utils/leaderIO";

const SHARE_DEFAULT_NAMES = ["CREW LEADER", ""];
const SHARE_DEFAULT_EFFECT_NAMES = ["AIRSTRIKE", "NITRO", "DRIFT", "REPAIR"];

const getShareIssues = (leader) => {
  const issues = [];
  if (SHARE_DEFAULT_NAMES.includes((leader.crewLeaderName || "").trim().toUpperCase()))
    issues.push("Give your crew leader a unique name.");
  const slots = leader.slots || [];
  const allDefaultEffects = slots.every((s) =>
    SHARE_DEFAULT_EFFECT_NAMES.includes((s.effectName || "").trim().toUpperCase()),
  );
  const allEmptyDescs = slots.every((s) => !(s.description || "").trim());
  if (allDefaultEffects && allEmptyDescs)
    issues.push("Customize your effect slots (change names or add descriptions).");
  if (!(leader.author_name || "").trim())
    issues.push("Add your author name (Author Info section).");
  if (!(leader.revision_no || "").trim())
    issues.push("Add a revision number (Author Info section).");
  if (!(leader.contact_info || "").trim())
    issues.push("Add contact info (Author Info section).");
  return issues;
};

export function useGallery({ leaderState, clearFileHandle, confirm, showAlert, showStatus }) {
  const { leader, replaceLeader, hasUnsavedChanges } = leaderState;
  const [submitting, setSubmitting] = useState(false);
  const [shareWarning, setShareWarning] = useState(null);

  const handleShareToGallery = async () => {
    const issues = getShareIssues(leader);
    if (issues.length > 0) {
      setShareWarning(issues);
      return;
    }
    const ok = await confirm({
      title: "Share to Gallery",
      message:
        "This crew leader will be reviewed before appearing in the community gallery.",
      confirmLabel: "Share",
    });
    if (!ok) return;
    setSubmitting(true);
    try {
      let isReplacement = false;
      const prior = getPendingRef();
      if (prior) {
        const stillPending = await isPendingHashValid(prior.hash);
        if (!stillPending) {
          clearPendingRef();
        } else {
          const replace = await confirm({
            title: "Replace Pending Submission?",
            message: `You have a pending submission for "${prior.leaderName}" awaiting review. Replace it with this updated version?`,
            confirmLabel: "Replace",
            cancelLabel: "Cancel",
          });
          if (!replace) return;
          try {
            await withdrawPendingLeader(prior.hash);
          } catch {
            /* already gone */
          }
          clearPendingRef();
          isReplacement = true;
        }
      }
      const hash = await submitLeader(leader);
      savePendingRef(hash, leader.crewLeaderName);
      showStatus(
        isReplacement ? "Leader submission updated!" : "Leader submitted for review!",
      );
    } catch (err) {
      console.error("Submit failed:", err);
      showAlert({ title: "Share Failed", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadFromGallery = async (galleryLeader) => {
    if (hasUnsavedChanges()) {
      const ok = await confirm({
        title: "Load Gallery Leader",
        message: "Current unsaved changes will be lost.",
        confirmLabel: "Load",
        destructive: true,
      });
      if (!ok) return;
    }
    clearFileHandle();
    replaceLeader(galleryLeader);
    showStatus("Leader loaded from gallery");
  };

  return {
    submitting,
    shareWarning,
    setShareWarning,
    handleShareToGallery,
    handleLoadFromGallery,
  };
}
