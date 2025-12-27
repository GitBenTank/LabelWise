/**
 * Repository interface for label persistence
 */
export interface LabelRepository {
  /**
   * Create a label record
   */
  create(label: {
    productId: string | null;
    rawText: string;
    ingredients: string[];
    nutrition: Record<string, number | null>;
    allergenStatements: string[];
    mayContain: string[];
    photoUrl: string | null;
    confidence: 'high' | 'medium' | 'low';
  }): Promise<{ id: string; confidence: 'high' | 'medium' | 'low' }>;
}

