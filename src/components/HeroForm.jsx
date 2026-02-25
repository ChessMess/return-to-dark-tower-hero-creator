export default function HeroForm({ hero, updateHero, updateVirtue }) {
  const handlePortraitUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => updateHero('portraitDataUrl', evt.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 text-sm">
      {/* Hero Identity */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 border-b border-amber-900 pb-1">
          Hero Identity
        </h2>
        <div className="space-y-2">
          <label className="block">
            <span className="text-gray-400 text-xs">Name</span>
            <input
              type="text"
              value={hero.name}
              maxLength={20}
              onChange={(e) => updateHero('name', e.target.value)}
              className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
            />
          </label>
          <div className="flex gap-3">
            <label className="flex-1">
              <span className="text-gray-400 text-xs">Starting Warriors</span>
              <input
                type="number"
                value={hero.warriors}
                min={1}
                max={99}
                onChange={(e) => updateHero('warriors', Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
              />
            </label>
            <label className="flex-1">
              <span className="text-gray-400 text-xs">Starting Spirit</span>
              <input
                type="number"
                value={hero.spirit}
                min={0}
                max={9}
                onChange={(e) => updateHero('spirit', Math.max(0, Math.min(9, parseInt(e.target.value) || 0)))}
                className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Portrait */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 border-b border-amber-900 pb-1">
          Portrait
        </h2>
        <div className="space-y-2">
          {hero.portraitDataUrl ? (
            <div className="space-y-2">
              <img
                src={hero.portraitDataUrl}
                alt="Hero portrait preview"
                className="w-full h-28 object-cover rounded border border-gray-600"
              />
              <button
                type="button"
                onClick={() => updateHero('portraitDataUrl', null)}
                className="w-full text-xs text-gray-400 hover:text-red-400 border border-gray-600 hover:border-red-700 rounded py-1 transition-colors"
              >
                Remove portrait
              </button>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-600 hover:border-amber-600 rounded p-4 text-center text-gray-500 hover:text-gray-300 transition-colors">
                <div className="text-2xl mb-1">+</div>
                <div className="text-xs">Click to upload portrait</div>
                <div className="text-xs text-gray-600 mt-1">JPG, PNG, WEBP</div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePortraitUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </section>

      {/* Flavor Text */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 border-b border-amber-900 pb-1">
          Flavor Text
        </h2>
        <div className="space-y-2">
          <label className="block">
            <span className="text-gray-400 text-xs">Line 1</span>
            <input
              type="text"
              value={hero.flavorLine1}
              maxLength={35}
              onChange={(e) => updateHero('flavorLine1', e.target.value)}
              className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-400 text-xs">Line 2</span>
            <input
              type="text"
              value={hero.flavorLine2}
              maxLength={35}
              onChange={(e) => updateHero('flavorLine2', e.target.value)}
              className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
            />
          </label>
        </div>
      </section>

      {/* Virtue 1 — Primary Advantage */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 border-b border-amber-900 pb-1">
          Virtue 1 — Primary Advantage
        </h2>
        <div className="space-y-2">
          <label className="block">
            <span className="text-gray-400 text-xs">Virtue Name</span>
            <input
              type="text"
              value={hero.virtues[0].name}
              maxLength={12}
              onChange={(e) => updateVirtue(0, 'name', e.target.value)}
              className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-400 text-xs">Advantage Type</span>
            <span className="text-gray-600 text-xs ml-1">(e.g. Stealth, Magic, Humanoid, Wild)</span>
            <input
              type="text"
              value={hero.virtues[0].advantageType}
              maxLength={15}
              onChange={(e) => updateVirtue(0, 'advantageType', e.target.value)}
              placeholder="TYPE"
              className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
            />
            <span className="text-gray-600 text-xs">Shows as: +1 {hero.virtues[0].advantageType || 'TYPE'} Advantage</span>
          </label>
        </div>
      </section>

      {/* Virtues 2–5 */}
      {[1, 2, 3, 4].map((i) => (
        <section key={i}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 border-b border-amber-900 pb-1">
            Virtue {i + 1}
          </h2>
          <div className="space-y-2">
            <label className="block">
              <span className="text-gray-400 text-xs">Virtue Name</span>
              <input
                type="text"
                value={hero.virtues[i].name}
                maxLength={12}
                onChange={(e) => updateVirtue(i, 'name', e.target.value)}
                className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
              />
            </label>
            <label className="block">
              <span className="text-gray-400 text-xs">Ability Line 1</span>
              <input
                type="text"
                value={hero.virtues[i].line1}
                maxLength={30}
                onChange={(e) => updateVirtue(i, 'line1', e.target.value)}
                className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
              />
            </label>
            <label className="block">
              <span className="text-gray-400 text-xs">Ability Line 2</span>
              <input
                type="text"
                value={hero.virtues[i].line2}
                maxLength={30}
                onChange={(e) => updateVirtue(i, 'line2', e.target.value)}
                className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
              />
            </label>
          </div>
        </section>
      ))}

      {/* Champion */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 border-b border-amber-900 pb-1">
          Champion Ability
        </h2>
        <label className="block">
          <span className="text-gray-400 text-xs">Terrain Type</span>
          <span className="text-gray-600 text-xs ml-1">(e.g. Forest, Mountain, Swamp)</span>
          <input
            type="text"
            value={hero.championTerrain}
            maxLength={15}
            onChange={(e) => updateHero('championTerrain', e.target.value)}
            placeholder="terrain"
            className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
          />
          <span className="text-gray-600 text-xs">Shows as: +2 Wild Advantages in {hero.championTerrain || 'terrain'}</span>
        </label>
      </section>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
}
