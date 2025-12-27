import type { LabelWiseReport } from '@labelwise/shared';

interface IngredientDetailProps {
  ingredient: LabelWiseReport['ingredients'][0];
}

export function IngredientDetail({ ingredient }: IngredientDetailProps) {
  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'text-red-700 bg-red-50 border-red-200';
    if (severity === 'med') return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-blue-700 bg-blue-50 border-blue-200';
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">
            <span className="font-medium">Normalized:</span> {ingredient.normalized}
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-medium">Confidence:</span>{' '}
            {ingredient.confidence}%
          </p>
        </div>

        {ingredient.concerns.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Concerns:</p>
            <div className="space-y-2">
              {ingredient.concerns.map((concern, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border text-xs ${getSeverityColor(
                    concern.severity
                  )}`}
                >
                  <p className="font-medium mb-1">{concern.type}</p>
                  <p>{concern.message}</p>
                  {concern.evidence.length > 0 && (
                    <div className="mt-1 text-xs opacity-75">
                      <span className="font-medium">Source: </span>
                      {concern.evidence
                        .map((e) => e.source)
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {ingredient.concerns.length === 0 && (
          <p className="text-xs text-gray-600 italic">
            No known concerns for this ingredient
          </p>
        )}
      </div>
    </div>
  );
}

