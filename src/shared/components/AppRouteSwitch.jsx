import { Link, useLocation } from "react-router-dom";

export default function AppRouteSwitch() {
  const loc = useLocation();
  const isRtdt = loc.pathname.startsWith("/rtdt");
  const isTrv = loc.pathname.startsWith("/trv");
  return (
    <div className="flex flex-col gap-1">
      <Link
        to="/rtdt"
        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-colors text-center ${isRtdt ? "bg-amber-700 border-amber-600 text-white" : "bg-gray-900/80 border-gray-700 text-gray-400 hover:text-amber-400 hover:border-amber-600"}`}
      >
        RTDT
      </Link>
      <Link
        to="/trv"
        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-colors text-center ${isTrv ? "bg-amber-700 border-amber-600 text-white" : "bg-gray-900/80 border-gray-700 text-gray-400 hover:text-amber-400 hover:border-amber-600"}`}
      >
        TRV
      </Link>
    </div>
  );
}
