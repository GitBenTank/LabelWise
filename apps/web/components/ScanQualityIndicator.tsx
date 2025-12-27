interface ScanQualityIndicatorProps {
  confidence: 'high' | 'medium' | 'low';
  source?: 'ocr' | 'openfoodfacts' | 'label';
}

export function ScanQualityIndicator({
  confidence,
  source = 'ocr',
}: ScanQualityIndicatorProps) {
  const getConfidenceColor = (conf: string) => {
    if (conf === 'high') return 'bg-green-100 text-green-800 border-green-200';
    if (conf === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getConfidenceLabel = (conf: string) => {
    if (conf === 'high') return 'High Quality';
    if (conf === 'medium') return 'Medium Quality';
    return 'Low Quality';
  };

  const getSourceLabel = (src: string) => {
    if (src === 'openfoodfacts') return 'Open Food Facts';
    if (src === 'label') return 'Product Label';
    return 'OCR Scan';
  };

  return (
    <div
      className={`p-4 rounded-lg border ${getConfidenceColor(confidence)}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm mb-1">
            Scan Quality: {getConfidenceLabel(confidence)}
          </p>
          <p className="text-xs opacity-90">
            Source: {getSourceLabel(source)}
          </p>
        </div>
        {confidence === 'low' && (
          <div className="ml-4">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      {confidence === 'low' && (
        <p className="text-xs mt-2 opacity-90">
          The label image may be unclear. Some information might be missing or
          inaccurate.
        </p>
      )}
    </div>
  );
}

