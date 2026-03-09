import { useState, useRef, useCallback } from "react";

export function useConfirm() {
  const [confirmState, setConfirmState] = useState(null);
  const resolverRef = useRef(null);

  const confirm = useCallback(
    ({ title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", destructive = false }) =>
      new Promise((resolve) => {
        resolverRef.current = resolve;
        setConfirmState({ title, message, confirmLabel, cancelLabel, destructive });
      }),
    [],
  );

  const handleConfirm = useCallback(() => {
    resolverRef.current?.(true);
    resolverRef.current = null;
    setConfirmState(null);
  }, []);

  const handleCancel = useCallback(() => {
    resolverRef.current?.(false);
    resolverRef.current = null;
    setConfirmState(null);
  }, []);

  return { confirmState, confirm, handleConfirm, handleCancel };
}
