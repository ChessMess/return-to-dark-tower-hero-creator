export default function GalleryCard({ hero, onLoad, onDownload, onDelete, onRemoveOwn }) {
  const virtueNames = (hero.virtues || []).map((v) => v.name).join(", ");

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-amber-500/50 transition-colors">
      {/* Portrait / placeholder */}
      <div className="h-32 bg-gray-900 flex items-center justify-center overflow-hidden">
        {hero.portraitDataUrl ? (
          <img
            src={hero.portraitDataUrl}
            alt={hero.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-12 h-12 text-gray-700"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-bold text-amber-400 truncate">
          {hero.name || "HERO NAME"}
        </h3>

        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span>W:{hero.warriors}</span>
          <span>S:{hero.spirit}</span>
          {hero.virtues && (
            <span>{hero.virtues.length} virtue{hero.virtues.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {hero.author_name && (
          <p className="text-[10px] text-gray-500 truncate">
            by {hero.author_name}
            {hero.revision_no ? ` v${hero.revision_no}` : ""}
          </p>
        )}

        {virtueNames && (
          <p className="text-[10px] text-gray-500 truncate">{virtueNames}</p>
        )}

        {/* Actions */}
        <div className="flex gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => onLoad(hero)}
            className="flex-1 rounded bg-amber-700 hover:bg-amber-600 text-white text-[10px] py-1 uppercase tracking-wider font-bold transition-colors"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onDownload(hero)}
            className="flex-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-[10px] py-1 uppercase tracking-wider transition-colors"
          >
            Save
          </button>
          {onRemoveOwn && (
            <button
              type="button"
              onClick={() => onRemoveOwn(hero)}
              className="rounded bg-gray-600 hover:bg-red-700 text-gray-300 hover:text-white text-[10px] py-1 px-2 uppercase tracking-wider transition-colors"
              title="Remove your hero from the gallery"
            >
              Remove
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(hero)}
              className="rounded bg-red-800 hover:bg-red-700 text-white text-[10px] py-1 px-2 uppercase tracking-wider transition-colors"
            >
              &times;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
