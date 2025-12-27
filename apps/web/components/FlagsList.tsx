import type { LabelWiseReport } from '@labelwise/shared';

interface FlagsListProps {
  flags: LabelWiseReport['flags'];
}

export function FlagsList({ flags }: FlagsListProps) {
  const getSeverityIcon = (severity: string) => {
    if (severity === 'high') {
      return (
        <svg
          className="w-5 h-5 text-red-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (severity === 'med') {
      return (
        <svg
          className="w-5 h-5 text-yellow-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-5 h-5 text-blue-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'border-red-200 bg-red-50';
    if (severity === 'med') return 'border-yellow-200 bg-yellow-50';
    return 'border-blue-200 bg-blue-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Things to Know
      </h2>
      <div className="space-y-3">
        {flags.map((flag, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${getSeverityColor(flag.severity)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getSeverityIcon(flag.severity)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{flag.title}</h3>
                <p className="text-sm text-gray-700">{flag.message}</p>
                {flag.evidence.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    <span className="font-medium">Source: </span>
                    {flag.evidence
                      .map((e) => e.source)
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

