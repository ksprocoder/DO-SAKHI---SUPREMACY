'use client';

import { useState } from 'react';
import { CustomTailoringProfile } from '../tailoring/tailoring-types';
import {
  countMeasurements,
  getFitProfileLabel,
  measurementLabel,
  preferenceLabel,
} from './checkout-utils';

interface CustomFitSummaryProps {
  profile: CustomTailoringProfile;
}

export function CustomFitSummary({ profile }: CustomFitSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  const measurementCount = countMeasurements(profile.measurements);
  const profileLabel = getFitProfileLabel(profile.fitProfile);
  const hasNotes = profile.notes && profile.notes.trim().length > 0;

  // Collect non-empty preference entries
  const preferenceEntries = Object.entries(profile.preferences || {}).filter(
    ([, v]) => v !== undefined && v !== null && String(v).trim() !== ''
  );

  // Collect non-empty measurements
  const measurementEntries = Object.entries(profile.measurements || {}).filter(
    ([, v]) => v !== undefined && v !== null && String(v).trim() !== ''
  );

  return (
    <div className="mt-3 rounded-sm border border-ds-soft-sage bg-ds-soft-sage/20 px-3 py-3">
      {/* Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ds-emerald/10 px-2.5 py-0.5">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4" stroke="var(--ds-emerald)" strokeWidth="1.2" />
            <path d="M3 5l1.5 1.5L7 3.5" stroke="var(--ds-emerald)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="ds-label text-[9px] text-ds-emerald" style={{ letterSpacing: '0.15em' }}>
            CUSTOM FIT ADDED
          </span>
        </span>
      </div>

      {/* Summary lines */}
      <div className="flex flex-col gap-0.5">
        <p className="font-sans text-[12px] text-ds-charcoal">
          <span className="text-ds-muted-text">Fit Profile: </span>
          {profileLabel}
        </p>
        {measurementCount > 0 && (
          <p className="font-sans text-[12px] text-ds-charcoal">
            <span className="text-ds-muted-text">Measurements: </span>
            {measurementCount} shared
          </p>
        )}
        {preferenceEntries.length > 0 && (
          <p className="font-sans text-[12px] text-ds-charcoal">
            <span className="text-ds-muted-text">Preferences: </span>
            {preferenceEntries.length} added
          </p>
        )}
        {hasNotes && (
          <p className="font-sans text-[12px] text-ds-charcoal">
            <span className="text-ds-muted-text">Notes: </span>
            {profile.notes!.length > 60
              ? profile.notes!.slice(0, 60).trim() + '…'
              : profile.notes}
          </p>
        )}
      </div>

      {/* Expand toggle */}
      {(measurementCount > 0 || preferenceEntries.length > 0) && (
        <button
          type="button"
          onClick={() => setExpanded((p) => !p)}
          className="mt-2 inline-flex items-center gap-1 font-sans text-[11px] text-ds-emerald underline-offset-2 hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-ds-emerald"
          aria-expanded={expanded}
          aria-controls="fit-details-panel"
        >
          {expanded ? 'Hide fit details' : 'View fit details'}
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          >
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Expanded details */}
      {expanded && (
        <div
          id="fit-details-panel"
          className="mt-3 border-t border-ds-border/50 pt-3 flex flex-col gap-1"
        >
          {measurementEntries.length > 0 && (
            <>
              <p className="ds-label text-[9px] text-ds-muted-text mb-1" style={{ letterSpacing: '0.15em' }}>
                MEASUREMENTS ({profile.unit.toUpperCase()})
              </p>
              {measurementEntries.map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-sans text-[12px] text-ds-muted-text">{measurementLabel(key)}</span>
                  <span className="font-sans text-[12px] text-ds-charcoal">
                    {value} {profile.unit}
                  </span>
                </div>
              ))}
            </>
          )}

          {preferenceEntries.length > 0 && (
            <>
              <p className="ds-label text-[9px] text-ds-muted-text mt-2 mb-1" style={{ letterSpacing: '0.15em' }}>
                PREFERENCES
              </p>
              {preferenceEntries.map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-sans text-[12px] text-ds-muted-text">{preferenceLabel(key)}</span>
                  <span className="font-sans text-[12px] text-ds-charcoal capitalize">{String(value)}</span>
                </div>
              ))}
            </>
          )}

          {hasNotes && (
            <>
              <p className="ds-label text-[9px] text-ds-muted-text mt-2 mb-1" style={{ letterSpacing: '0.15em' }}>
                NOTES
              </p>
              <p className="font-sans text-[12px] text-ds-charcoal leading-relaxed">{profile.notes}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
