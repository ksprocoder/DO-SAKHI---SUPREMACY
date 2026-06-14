export default function CustomFitTeaser({ available }: { available: boolean }) {
  if (!available) {
    return (
      <div className="ds-panel-sage p-8 text-center my-16">
        <h3 className="font-serif text-2xl text-ds-emerald mb-2">Size Guidance</h3>
        <p className="ds-body text-ds-emerald/80 max-w-md mx-auto">
          Personal styling and size guidance is available for this piece to ensure your comfort.
        </p>
      </div>
    );
  }

  return (
    <div className="ds-panel-sage p-8 md:p-12 text-center my-16 ds-ornament-frame">
      <div className="relative z-10 max-w-2xl mx-auto">
        <span className="ds-label text-ds-emerald/70 mb-4 block">Boutique Service</span>
        <h3 className="font-serif text-3xl md:text-4xl text-ds-emerald mb-4">
          Custom Fit Guidance
        </h3>
        <p className="ds-body text-ds-emerald/90 mb-8 max-w-lg mx-auto">
          A more personal fit, prepared with care. For selected pieces, Do Sakhi can guide measurements such as length, shoulder, bust, waist and sleeve preferences before preparation.
        </p>
        
        <button 
          className="bg-transparent border border-ds-emerald text-ds-emerald px-8 py-3 ds-label tracking-widest hover:bg-ds-emerald hover:text-ds-ivory transition-colors duration-300"
          type="button"
        >
          Explore Fit Guidance
        </button>
      </div>
    </div>
  );
}
