import { useState } from 'react';
import { optimizeImage } from '../utils/heroIO';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif']);

export default function HeroForm({ hero, updateHero, updateVirtue }) {
  const [activeVirtue, setActiveVirtue] = useState(0);

  const [dragging, setDragging] = useState(false);

  const loadPortraitFile = async (file) => {
    if (!file || !ALLOWED_IMAGE_TYPES.has(file.type)) return;
    try {
      const dataUrl = await optimizeImage(file);
      updateHero('portraitDataUrl', dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = (evt) => updateHero('portraitDataUrl', evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePortraitUpload = (e) => {
    loadPortraitFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    loadPortraitFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
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
            <div
              className="space-y-2"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className={`relative rounded transition-colors ${dragging ? 'ring-2 ring-amber-400' : ''}`}>
                <img
                  src={hero.portraitDataUrl}
                  alt="Hero portrait preview"
                  className="w-full h-28 object-cover rounded border border-gray-600"
                />
                {dragging && (
                  <div className="absolute inset-0 bg-amber-900/40 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-amber-200">Drop to replace</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => updateHero('portraitDataUrl', null)}
                className="w-full text-xs text-gray-400 hover:text-red-400 border border-gray-600 hover:border-red-700 rounded py-1 transition-colors"
              >
                Remove portrait
              </button>
            </div>
          ) : (
            <label
              className="block cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className={`border-2 border-dashed rounded p-4 text-center transition-colors ${dragging ? 'border-amber-400 text-gray-200 bg-amber-900/20' : 'border-gray-600 hover:border-amber-600 text-gray-500 hover:text-gray-300'}`}>
                <div className="text-2xl mb-1">+</div>
                <div className="text-xs">{dragging ? 'Drop image here' : 'Click or drag image here'}</div>
                <div className="text-xs text-gray-600 mt-1">JPG, PNG, WEBP</div>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
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

      {/* Virtues */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 border-b border-amber-900 pb-1">
          Virtues
        </h2>
        <div className="space-y-2">
          <div className="flex items-stretch gap-1">
            <button
              type="button"
              onClick={() => setActiveVirtue((v) => (v === 0 ? 4 : v - 1))}
              className="shrink-0 rounded bg-gray-700 border border-gray-600 px-1.5 py-1 text-xs text-gray-100 hover:border-amber-500 hover:text-amber-400 transition-colors"
            >
              ◀
            </button>
            <select
              value={activeVirtue}
              onChange={(e) => setActiveVirtue(Number(e.target.value))}
              className="min-w-0 flex-1 rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
            >
              <option value={0}>Virtue 1 — Primary Advantage</option>
              <option value={1}>Virtue 2</option>
              <option value={2}>Virtue 3</option>
              <option value={3}>Virtue 4</option>
              <option value={4}>Virtue 5</option>
            </select>
            <button
              type="button"
              onClick={() => setActiveVirtue((v) => (v === 4 ? 0 : v + 1))}
              className="shrink-0 rounded bg-gray-700 border border-gray-600 px-1.5 py-1 text-xs text-gray-100 hover:border-amber-500 hover:text-amber-400 transition-colors"
            >
              ▶
            </button>
          </div>

          <label className="block">
            <span className="text-gray-400 text-xs">Virtue Name</span>
            <input
              type="text"
              value={hero.virtues[activeVirtue].name}
              maxLength={12}
              onChange={(e) => updateVirtue(activeVirtue, 'name', e.target.value)}
              className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
            />
          </label>

          {activeVirtue === 0 && (
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
          )}

          {activeVirtue > 0 && (
            <label className="block">
              <span className="text-gray-400 text-xs">Ability Description</span>
              <textarea
                value={hero.virtues[activeVirtue].description}
                maxLength={80}
                rows={3}
                onChange={(e) => updateVirtue(activeVirtue, 'description', e.target.value)}
                className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </label>
          )}
        </div>
      </section>

      {/* Champion */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 border-b border-amber-900 pb-1">
          Champion Ability
        </h2>
        <label className="block mb-3">
          <span className="text-gray-400 text-xs">Kingdom</span>
          <select
            value={hero.championKingdom}
            onChange={(e) => updateHero('championKingdom', e.target.value)}
            className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
          >
            <option value="NORTH">NORTH</option>
            <option value="SOUTH">SOUTH</option>
            <option value="EAST">EAST</option>
            <option value="WEST">WEST</option>
          </select>
        </label>
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

      {/* Author Info */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 border-b border-amber-900 pb-1">
          Author Info
        </h2>
        <label className="block mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-gray-400 text-xs">Author Name</span>
            <span className="text-gray-600 text-xs">{(hero.author_name || '').length}/50</span>
          </div>
          <input
            type="text"
            value={hero.author_name || ''}
            maxLength={50}
            onChange={(e) => updateHero('author_name', e.target.value)}
            placeholder="Your name"
            className="block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
          />
        </label>
        <label className="block mb-3">
          <span className="text-gray-400 text-xs">Revision</span>
          <input
            type="text"
            value={hero.revision_no || ''}
            maxLength={8}
            onChange={(e) => updateHero('revision_no', e.target.value)}
            placeholder="e.g. 1.0, v2, draft"
            className="mt-1 block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
          />
        </label>
        <label className="block mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-gray-400 text-xs">Description</span>
            <span className="text-gray-600 text-xs">{(hero.description || '').length}/1000</span>
          </div>
          <textarea
            value={hero.description || ''}
            maxLength={1000}
            rows={4}
            onChange={(e) => updateHero('description', e.target.value)}
            placeholder="Notes about this hero card..."
            className="block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500 resize-none"
          />
        </label>
        <label className="block">
          <div className="flex justify-between mb-1">
            <span className="text-gray-400 text-xs">Contact</span>
            <span className="text-gray-600 text-xs">{(hero.contact || '').length}/250</span>
          </div>
          <input
            type="text"
            value={hero.contact || ''}
            maxLength={250}
            onChange={(e) => updateHero('contact', e.target.value)}
            placeholder="Email, URL, or handle"
            className="block w-full rounded bg-gray-700 border border-gray-600 px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500"
          />
        </label>
      </section>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
}
