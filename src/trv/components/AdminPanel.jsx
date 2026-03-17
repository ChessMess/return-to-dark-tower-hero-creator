import { useState, useEffect } from "react";
import {
  signInWithGoogle,
  isAdmin,
  fetchPendingLeaders,
  approveLeader,
  rejectLeader,
} from "../utils/firebase";
import { signOutAdmin, onAuthChange } from "../../shared/utils/firebaseCore";
import { validateLeaderData } from "../utils/leaderIO";

export default function AdminPanel({ onClose, confirm }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const ok = await isAdmin();
        setAdmin(ok);
        if (ok) loadPending();
      } else {
        setAdmin(false);
        setPending([]);
      }
    });
    return unsub;
  }, []);

  const loadPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const leaders = await fetchPendingLeaders();
      setPending(leaders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await approveLeader(id);
      setPending((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    const ok = await confirm({
      title: "Reject Submission",
      message: "Reject this crew leader submission? This cannot be undone.",
      confirmLabel: "Reject",
      destructive: true,
    });
    if (!ok) return;
    setActionId(id);
    try {
      await rejectLeader(id);
      setPending((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const handlePreview = (leader) => {
    const result = validateLeaderData(leader);
    if (!result.valid) {
      setError("Leader data failed validation — may contain unsafe content.");
      return;
    }
    localStorage.setItem(
      "trv-leader-handoff",
      JSON.stringify({
        leader: result.leader,
        fileName: `${leader.crewLeaderName || "leader"} (review)`,
        timestamp: Date.now(),
      }),
    );
    const base = import.meta.env.BASE_URL || "/";
    const newWin = window.open(`${base}trv`, "_blank");
    if (!newWin) {
      localStorage.removeItem("trv-leader-handoff");
      setError("Pop-up blocked — allow pop-ups for this site to preview.");
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-[90vw] max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 shrink-0">
          <h2 className="text-sm font-bold text-amber-400 uppercase tracking-widest">
            Admin — Crew Leader Moderation
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-lg"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="text-red-400 text-xs bg-red-900/30 rounded p-2">
              {error}
            </div>
          )}

          {/* Not signed in */}
          {!user && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <p className="text-gray-400 text-sm">Sign in to access admin panel</p>
              <button
                type="button"
                onClick={handleSignIn}
                className="rounded bg-amber-700 hover:bg-amber-600 text-white text-xs px-5 py-2 font-bold uppercase tracking-wider transition-colors"
              >
                Sign in with Google
              </button>
            </div>
          )}

          {/* Signed in but not admin */}
          {user && !admin && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <p className="text-gray-400 text-sm">
                Signed in as {user.email}
              </p>
              <p className="text-red-400 text-xs">
                Not authorized. Admin claim not found.
              </p>
              <button
                type="button"
                onClick={() => signOutAdmin()}
                className="rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-4 py-1.5 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Admin view */}
          {user && admin && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Signed in as{" "}
                  <span className="text-amber-300">{user.email}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={loadPending}
                    className="rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-[10px] px-3 py-1 transition-colors"
                  >
                    Refresh
                  </button>
                  <button
                    type="button"
                    onClick={() => signOutAdmin()}
                    className="rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-[10px] px-3 py-1 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {loading && (
                <div className="text-gray-500 text-sm text-center py-8">
                  Loading pending submissions...
                </div>
              )}

              {!loading && pending.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-8">
                  No pending submissions
                </div>
              )}

              {!loading && pending.length > 0 && (
                <div className="space-y-3">
                  {pending.map((leader) => (
                    <div
                      key={leader.id}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-amber-400 truncate">
                            {leader.crewLeaderName || "CREW LEADER"}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-400 mt-1">
                            {leader.author_name && (
                              <span>by {leader.author_name}</span>
                            )}
                            {leader.revision_no && (
                              <span>{leader.revision_no}</span>
                            )}
                            {leader.slots && (
                              <span>
                                {leader.slots.length} slot{leader.slots.length !== 1 ? "s" : ""}
                                : {leader.slots.map((s) => s.effectName).join(", ")}
                              </span>
                            )}
                            {leader.commandTokens > 0 && (
                              <span>{leader.commandTokens} cmd tokens</span>
                            )}
                          </div>
                          {leader.author_description && (
                            <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                              {leader.author_description}
                            </p>
                          )}
                        </div>

                        {leader.portraitDataUrl && (
                          <img
                            src={leader.portraitDataUrl}
                            alt=""
                            className="w-16 h-16 rounded object-cover shrink-0 border border-gray-600"
                          />
                        )}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handlePreview(leader)}
                          className="rounded bg-blue-700 hover:bg-blue-600 text-white text-[10px] px-4 py-1 font-bold uppercase tracking-wider transition-colors"
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(leader.id)}
                          disabled={actionId === leader.id}
                          className="rounded bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white text-[10px] px-4 py-1 font-bold uppercase tracking-wider transition-colors"
                        >
                          {actionId === leader.id ? "..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(leader.id)}
                          disabled={actionId === leader.id}
                          className="rounded bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white text-[10px] px-4 py-1 font-bold uppercase tracking-wider transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-700 shrink-0 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-4 py-1.5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
