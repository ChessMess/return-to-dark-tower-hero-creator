import { useState } from 'react';
import jsPDF from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';
import HeroCard from './components/HeroCard';
import HeroForm from './components/HeroForm';
import { defaultHero } from './data/defaultHero';

export default function App() {
  const [hero, setHero] = useState(defaultHero);
  const [downloading, setDownloading] = useState(false);

  const updateHero = (field, value) =>
    setHero((prev) => ({ ...prev, [field]: value }));

  const updateVirtue = (index, field, value) =>
    setHero((prev) => {
      const virtues = [...prev.virtues];
      virtues[index] = { ...virtues[index], [field]: value };
      return { ...prev, virtues };
    });

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const svgEl = document.querySelector('#hero-card-container svg');
      const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [910, 606] });
      await svg2pdf(svgEl, doc, { x: 0, y: 0, width: 910, height: 606 });
      const filename = hero.name && hero.name !== 'HERO NAME'
        ? `${hero.name.toLowerCase().replace(/\s+/g, '-')}-hero-card.pdf`
        : 'hero-card.pdf';
      doc.save(filename);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Editor panel */}
      <aside className="w-80 flex flex-col bg-gray-800 border-r border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-700 bg-gray-900 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-sm font-bold text-amber-400 tracking-wider uppercase">Hero Creator</h1>
            <p className="text-xs text-gray-500">Return to Dark Tower</p>
          </div>
        </div>

        {/* Form scroll area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <HeroForm hero={hero} updateHero={updateHero} updateVirtue={updateVirtue} />
        </div>

        {/* Download button */}
        <div className="px-4 py-3 border-t border-gray-700 bg-gray-900 shrink-0">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="w-full rounded bg-amber-700 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-2.5 text-sm uppercase tracking-widest transition-colors"
          >
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </aside>

      {/* Preview panel */}
      <main className="flex-1 overflow-auto bg-gray-950 flex items-center justify-center p-8">
        <div className="shadow-2xl" style={{ maxWidth: '100%', maxHeight: '100%' }}>
          <div style={{ transform: 'scale(1)', transformOrigin: 'top left' }}>
            <HeroCard hero={hero} />
          </div>
        </div>
      </main>
    </div>
  );
}
