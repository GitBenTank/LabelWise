'use client';

import { useState } from 'react';
import type { LabelWiseReport } from '@labelwise/shared';

interface SaveAnalysisButtonProps {
  report: LabelWiseReport;
  barcode?: string;
  productId?: string;
  labelId?: string;
}

export function SaveAnalysisButton({
  report,
  barcode,
  productId,
  labelId,
}: SaveAnalysisButtonProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check if already saved in localStorage
  const checkSaved = () => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('labelwise_saved_analyses');
    if (!saved) return false;
    const analyses = JSON.parse(saved);
    const key = barcode || productId || labelId;
    return analyses.some((a: { key: string }) => a.key === key);
  };

  const [isSaved, setIsSaved] = useState(checkSaved());

  const handleSave = () => {
    if (typeof window === 'undefined') return;

    setSaving(true);
    const saved = localStorage.getItem('labelwise_saved_analyses');
    const analyses = saved ? JSON.parse(saved) : [];
    const key = barcode || productId || labelId || Date.now().toString();

    const analysis = {
      key,
      barcode,
      productId,
      labelId,
      report,
      savedAt: new Date().toISOString(),
    };

    if (isSaved) {
      // Remove from saved
      const filtered = analyses.filter((a: { key: string }) => a.key !== key);
      localStorage.setItem('labelwise_saved_analyses', JSON.stringify(filtered));
      setIsSaved(false);
      setSaved(false);
    } else {
      // Add to saved
      analyses.push(analysis);
      localStorage.setItem('labelwise_saved_analyses', JSON.stringify(analyses));
      setIsSaved(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }

    setSaving(false);
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
        isSaved
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      {saving ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Saving...</span>
        </>
      ) : isSaved ? (
        <>
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{saved ? 'Saved!' : 'Saved'}</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <span>Save Analysis</span>
        </>
      )}
    </button>
  );
}

