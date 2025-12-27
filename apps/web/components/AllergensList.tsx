import type { LabelWiseReport } from '@labelwise/shared';

interface AllergensListProps {
  allergens: LabelWiseReport['allergens'];
}

export function AllergensList({ allergens }: AllergensListProps) {
  const getSourceBadge = (source: string) => {
    if (source === 'both') {
      return (
        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
          Verified
        </span>
      );
    }
    if (source === 'label') {
      return (
        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
          From Label
        </span>
      );
    }
    return (
      <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
        From Database
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-red-200 bg-red-50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-6 h-6 text-red-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900">Allergens</h2>
      </div>
      <div className="space-y-2">
        {allergens.map((allergen, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
          >
            <span className="font-medium text-gray-900 capitalize">
              {allergen.name.replace(/-/g, ' ')}
            </span>
            {getSourceBadge(allergen.detectedFrom)}
          </div>
        ))}
      </div>
    </div>
  );
}

