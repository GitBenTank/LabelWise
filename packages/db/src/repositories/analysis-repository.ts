import { db } from '../client';
import { analyses } from '../schema/analyses';
import type { AnalysisRepository } from '@labelwise/core';

/**
 * Drizzle implementation of AnalysisRepository
 */
export class DrizzleAnalysisRepository implements AnalysisRepository {
  async create(analysis: {
    labelId: string;
    profileId: string | null;
    score: number;
    summary: string;
    flags: unknown;
    reasons: unknown;
    confidence: 'high' | 'medium' | 'low';
    reportData: unknown;
  }): Promise<{ id: string }> {
    const [created] = await db
      .insert(analyses)
      .values({
        labelId: analysis.labelId,
        profileId: analysis.profileId,
        score: analysis.score,
        summary: analysis.summary,
        flags: analysis.flags as Array<unknown>,
        reasons: analysis.reasons as Array<unknown>,
        confidence: analysis.confidence,
      })
      .returning({ id: analyses.id });

    // Store full report in a separate field if needed (for now, we'll store in flags/reasons)
    // TODO: Add reportData field to schema if needed

    return { id: created.id };
  }
}

