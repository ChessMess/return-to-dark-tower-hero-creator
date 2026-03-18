export default function StatusMessage({ message }) {
  if (!message) return null;
  return (
    <div
      className={`text-xs text-center py-1 rounded ${
        message.type === "error"
          ? "text-red-400 bg-red-900/30"
          : "text-green-400 bg-green-900/30"
      }`}
    >
      {message.text}
    </div>
  );
}
