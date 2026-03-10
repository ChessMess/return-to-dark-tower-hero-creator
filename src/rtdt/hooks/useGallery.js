import { useState } from "react";
import { submitHero, withdrawPendingHero, isPendingHashValid } from "../utils/firebase";
import { savePendingRef, getPendingRef, clearPendingRef } from "../utils/heroIO";

const SHARE_DEFAULT_NAMES = ["HERO NAME", ""];
const SHARE_DEFAULT_VIRTUE_NAMES = [
  "VIRTUE",
  "VIRTUE 1",
  "VIRTUE 2",
  "VIRTUE 3",
  "VIRTUE 4",
  "VIRTUE 5",
  "VIRTUE 6",
];

const getShareIssues = (h) => {
  const issues = [];
  if (SHARE_DEFAULT_NAMES.includes((h.name || "").trim().toUpperCase()))
    issues.push("Give your hero a unique name.");
  const virtues = h.virtues || [];
  if (virtues.length === 0) issues.push("Add at least one virtue.");
  else if (
    virtues.every((v) =>
      SHARE_DEFAULT_VIRTUE_NAMES.includes((v.name || "").trim().toUpperCase()),
    )
  )
    issues.push("Customize your virtue names (don't use the defaults).");
  if (!(h.author_name || "").trim())
    issues.push("Add your author name (Author Info section).");
  if (!(h.revision_no || "").trim())
    issues.push("Add a revision number (Author Info section).");
  if (!(h.contact || "").trim())
    issues.push("Add contact info (Author Info section).");
  return issues;
};

export function useGallery({ heroState, clearFileHandle, confirm, showAlert, showStatus }) {
  const { hero, replaceHero, hasUnsavedChanges } = heroState;
  const [submitting, setSubmitting] = useState(false);
  const [shareWarning, setShareWarning] = useState(null);

  const handleShareToGallery = async () => {
    const issues = getShareIssues(hero);
    if (issues.length > 0) {
      setShareWarning(issues);
      return;
    }
    const ok = await confirm({
      title: "Share to Gallery",
      message:
        "This hero will be reviewed before appearing in the community gallery.",
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
            message: `You have a pending submission for "${prior.heroName}" awaiting review. Replace it with this updated version?`,
            confirmLabel: "Replace",
            cancelLabel: "Cancel",
          });
          if (!replace) return;
          try {
            await withdrawPendingHero(prior.hash);
          } catch {
            /* already gone */
          }
          clearPendingRef();
          isReplacement = true;
        }
      }
      const hash = await submitHero(hero);
      savePendingRef(hash, hero.name);
      showStatus(
        isReplacement ? "Hero submission updated!" : "Hero submitted for review!",
      );
    } catch (err) {
      console.error("Submit failed:", err);
      showAlert({ title: "Share Failed", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadFromGallery = async (galleryHero) => {
    if (hasUnsavedChanges()) {
      const ok = await confirm({
        title: "Load Gallery Hero",
        message: "Current unsaved changes will be lost.",
        confirmLabel: "Load",
        destructive: true,
      });
      if (!ok) return;
    }
    clearFileHandle();
    replaceHero(galleryHero);
    showStatus("Hero loaded from gallery");
  };

  return {
    submitting,
    shareWarning,
    setShareWarning,
    handleShareToGallery,
    handleLoadFromGallery,
  };
}
