/**
 * Repository interface for analysis persistence
 */
export interface AnalysisRepository {
  /**
   * Create an analysis record
   */
  create(analysis: {
    labelId: string;
    profileId: string | null;
    score: number;
    summary: string;
    flags: unknown;
    reasons: unknown;
    confidence: 'high' | 'medium' | 'low';
    reportData: unknown; // Full report JSON
  }): Promise<{ id: string }>;
}

