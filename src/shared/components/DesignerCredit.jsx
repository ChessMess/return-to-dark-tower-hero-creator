export default function DesignerCredit({ label, name, revision }) {
  if (!name && !revision) return null;
  return (
    <span className="text-xs text-gray-400 tracking-wider">
      {name && (
        <>
          {label}:{" "}
          <span className="text-amber-200 font-semibold">{name}</span>
        </>
      )}
      {name && revision && (
        <span className="mx-1.5 text-gray-600">·</span>
      )}
      {revision && (
        <span className="font-mono text-gray-300">{revision}</span>
      )}
    </span>
  );
}
