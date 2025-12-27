import type { LabelWiseReport } from '@labelwise/shared';

interface NutritionFactsProps {
  nutrition: NonNullable<LabelWiseReport['nutrition']>;
}

export function NutritionFacts({ nutrition }: NutritionFactsProps) {
  const formatValue = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'N/A';
    return value.toFixed(1);
  };

  const nutritionFields = [
    { key: 'energy-kcal_100g', label: 'Calories', unit: 'kcal' },
    { key: 'proteins_100g', label: 'Protein', unit: 'g' },
    { key: 'carbohydrates_100g', label: 'Carbs', unit: 'g' },
    { key: 'sugars_100g', label: 'Sugars', unit: 'g' },
    { key: 'fat_100g', label: 'Fat', unit: 'g' },
    { key: 'saturated-fat_100g', label: 'Saturated Fat', unit: 'g' },
    { key: 'salt_100g', label: 'Salt', unit: 'g' },
    { key: 'sodium_100g', label: 'Sodium', unit: 'g' },
    { key: 'fiber_100g', label: 'Fiber', unit: 'g' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Nutrition Facts
      </h2>

      {nutrition.novaGroup && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">NOVA Group:</span> {nutrition.novaGroup}
            {nutrition.novaGroup === 4 && (
              <span className="ml-2 text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                Ultra-processed
              </span>
            )}
          </p>
        </div>
      )}

      {nutrition.nutriScore && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Nutri-Score:</span> {nutrition.nutriScore}
          </p>
        </div>
      )}

      {nutrition.per100g && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Per 100g
          </h3>
          <div className="space-y-2">
            {nutritionFields.map((field) => {
              const value = nutrition.per100g?.[field.key];
              if (value === null || value === undefined) return null;
              return (
                <div
                  key={field.key}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-sm text-gray-700">{field.label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatValue(value)} {field.unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {nutrition.serving && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Per Serving</h3>
          <div className="space-y-2">
            {nutritionFields.map((field) => {
              const value = nutrition.serving?.[field.key];
              if (value === null || value === undefined) return null;
              return (
                <div
                  key={field.key}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-sm text-gray-700">{field.label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatValue(value)} {field.unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

