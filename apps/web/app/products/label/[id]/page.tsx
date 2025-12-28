'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api/client';
import type { LabelWiseReport } from '@labelwise/shared';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { FlagsList } from '@/components/FlagsList';
import { IngredientsList } from '@/components/IngredientsList';
import { AllergensList } from '@/components/AllergensList';
import { NutritionFacts } from '@/components/NutritionFacts';
import { SourcesList } from '@/components/SourcesList';
import { ScanQualityIndicator } from '@/components/ScanQualityIndicator';
import { SaveAnalysisButton } from '@/components/SaveAnalysisButton';

export default function LabelAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const labelId = params?.id as string | undefined;

  const [report, setReport] = useState<LabelWiseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [labelConfidence, setLabelConfidence] = useState<'high' | 'medium' | 'low'>('medium');

  useEffect(() => {
    async function loadAnalysis() {
      try {
        setLoading(true);
        setError(null);
        console.log('[LabelPage] Starting analysis for label ID:', labelId);
        const result = await api.generateAnalysis({ labelUploadId: labelId });
        console.log('[LabelPage] Analysis completed, score:', result.score);
        setReport(result);
        
        // Extract label confidence from sources
        const labelSource = result.sources.find(s => s.source === 'label');
        if (labelSource) {
          const conf = labelSource.note?.match(/\((high|medium|low) quality\)/i)?.[1]?.toLowerCase();
          if (conf === 'high' || conf === 'medium' || conf === 'low') {
            setLabelConfidence(conf);
          }
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load label analysis');
        }
      } finally {
        setLoading(false);
      }
    }

    if (labelId) {
      loadAnalysis();
    } else {
      setError('Label ID is required');
      setLoading(false);
    }
  }, [labelId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing label...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || 'Analysis not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Label Analysis
          </h1>
          <p className="text-gray-600">From uploaded label image</p>
        </div>

        {/* Scan Quality Indicator */}
        <div className="mb-6">
          <ScanQualityIndicator confidence={labelConfidence} source="ocr" />
        </div>

        {/* Score Display */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <ScoreDisplay
                score={report.score}
                summary={report.summary}
              />
            </div>
            <div className="flex-shrink-0">
              <SaveAnalysisButton report={report} labelId={labelId} />
            </div>
          </div>
        </div>

        {/* Flags */}
        {report.flags.length > 0 && (
          <div className="mb-8">
            <FlagsList flags={report.flags} />
          </div>
        )}

        {/* Ingredients */}
        <div className="mb-8">
          <IngredientsList ingredients={report.ingredients} />
        </div>

        {/* Allergens */}
        {report.allergens.length > 0 && (
          <div className="mb-8">
            <AllergensList allergens={report.allergens} />
          </div>
        )}

        {/* Nutrition */}
        {report.nutrition && (
          <div className="mb-8">
            <NutritionFacts nutrition={report.nutrition} />
          </div>
        )}

        {/* Sources */}
        <div className="mb-8">
          <SourcesList sources={report.sources} />
        </div>
      </div>
    </div>
  );
}

