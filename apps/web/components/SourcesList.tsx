import type { LabelWiseReport } from '@labelwise/shared';

interface SourcesListProps {
  sources: LabelWiseReport['sources'];
}

export function SourcesList({ sources }: SourcesListProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-700 bg-green-100';
    if (confidence >= 50) return 'text-yellow-700 bg-yellow-100';
    return 'text-gray-700 bg-gray-100';
  };

  const getSourceLabel = (source: string) => {
    if (source === 'openfoodfacts') return 'Open Food Facts';
    if (source === 'label') return 'Product Label';
    return 'Curated Database';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Sources & Confidence
      </h2>
      <div className="space-y-3">
        {sources.map((source, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">
                  {getSourceLabel(source.source)}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${getConfidenceColor(
                    source.confidence
                  )}`}
                >
                  {source.confidence}% confidence
                </span>
              </div>
              {source.note && (
                <p className="text-sm text-gray-600">{source.note}</p>
              )}
              {source.ref && (
                <p className="text-xs text-gray-500 mt-1 break-all">
                  {source.ref}
                </p>
              )}
              {source.field && (
                <p className="text-xs text-gray-500 mt-1">
                  Field: {source.field}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

