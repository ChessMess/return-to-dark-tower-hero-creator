import AppRouteSwitch from "./AppRouteSwitch";

export default function SidebarHeader({ title, subtitle, version, onReset, onAdminClick }) {
  return (
    <div className="px-4 py-3 border-b border-gray-700 bg-gray-900 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-sm font-bold text-amber-400 tracking-wider uppercase">
          {title}
        </h1>
        <p className="text-xs text-gray-500">
          {subtitle}
          {version && (
            <span className="ml-1 text-gray-600 font-mono">v{version}</span>
          )}
          <button
            type="button"
            onClick={onAdminClick}
            className="ml-1.5 text-gray-600 hover:text-amber-400 transition-colors"
            title="Admin"
          >
            &bull;
          </button>
        </p>
      </div>
      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={onReset}
          className="text-[10px] px-2 py-0.5 border border-gray-600 rounded text-gray-500 hover:text-red-400 hover:border-red-400 transition-colors"
        >
          Reset
        </button>
        <AppRouteSwitch />
      </div>
    </div>
  );
}
