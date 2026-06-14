'use client';

export function CheckoutTrustNote() {
  return (
    <div
      className="rounded-sm bg-ds-soft-sage/40 px-5 py-4 border-l-2"
      style={{ borderLeftColor: 'var(--ds-copper)' }}
    >
      <span className="ds-label text-[9px] text-ds-copper/70 mb-2 block" style={{ letterSpacing: '0.2em' }}>
        BOUTIQUE PROMISE
      </span>
      <p className="font-sans text-[13px] leading-relaxed text-ds-charcoal/80">
        Every order is reviewed with care before preparation. If custom fit details are added, 
        the Do Sakhi team will use them as guidance while reviewing your selected piece.
      </p>
      <p className="mt-2 font-sans text-[12px] leading-relaxed text-ds-muted-text">
        Final dispatch timelines may vary based on availability, finishing and address confirmation.
      </p>
    </div>
  );
}
