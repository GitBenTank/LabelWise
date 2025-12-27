import type { LabelWiseReport } from '@labelwise/shared';

interface ScoreDisplayProps {
  score: number;
  summary: LabelWiseReport['summary'];
}

export function ScoreDisplay({ score, summary }: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict === 'good') return 'bg-green-100 text-green-800';
    if (verdict === 'mixed') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">LabelWise Score</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getVerdictColor(
            summary.verdict
          )}`}
        >
          {summary.verdict.charAt(0).toUpperCase() + summary.verdict.slice(1)}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div
          className={`text-6xl font-bold ${getScoreColor(score)} rounded-lg px-6 py-4`}
        >
          {score}
        </div>
        <div className="flex-1">
          <p className="text-lg text-gray-900 font-medium mb-2">
            {summary.headline}
          </p>
          <p className="text-sm text-gray-600">
            Score out of 100 based on ingredients, nutrition, and your preferences
          </p>
        </div>
      </div>
    </div>
  );
}

