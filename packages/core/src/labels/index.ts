/**
 * Label OCR and parsing service
 */

import type { ProductLabel } from '@labelwise/shared';
import { extractAndNormalizeIngredients } from '../ingredients/parser';
import type { LabelRepository } from '../repositories/label-repository';

export type { OCRService } from './ocr';
import type { OCRService } from './ocr';
import type { LabelRepository } from '../repositories/label-repository';

/**
 * Label service for OCR and parsing
 */
export class LabelService {
  constructor(
    private readonly ocrService: OCRService,
    private readonly repository: LabelRepository
  ) {}

  /**
   * Extract text from a label image
   */
  async extractTextFromImage(imageUrl: string): Promise<{
    text: string;
    confidence: 'high' | 'medium' | 'low';
  }> {
    const result = await this.ocrService.extractText(imageUrl);
    
    // Map numeric confidence to our levels
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    if (result.confidence >= 80) {
      confidence = 'high';
    } else if (result.confidence < 50) {
      confidence = 'low';
    }

    return {
      text: result.text,
      confidence,
    };
  }

  /**
   * Parse label text into structured data
   */
  parseLabelText(text: string): Partial<ProductLabel> {
    const ingredients = extractAndNormalizeIngredients(text);

    // Extract allergen statements (simple pattern matching)
    const allergenPatterns = [
      /may contain[:\s]+([^.]+)/gi,
      /contains[:\s]+([^.]+)/gi,
      /allergen[:\s]+([^.]+)/gi,
    ];

    const allergenStatements: string[] = [];
    allergenPatterns.forEach((pattern) => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          allergenStatements.push(match[1].trim());
        }
      }
    });

    // Extract "may contain" statements
    const mayContainPattern = /may contain[:\s]+([^.]+)/gi;
    const mayContain: string[] = [];
    const mayContainMatches = text.matchAll(mayContainPattern);
    for (const match of mayContainMatches) {
      if (match[1]) {
        mayContain.push(match[1].trim());
      }
    }

    // TODO: Extract nutrition facts (more complex, can be enhanced later)

    return {
      rawText: text,
      ingredients,
      allergenStatements: allergenStatements.length > 0 ? allergenStatements : undefined,
      mayContain: mayContain.length > 0 ? mayContain : undefined,
      nutrition: {},
    };
  }

  /**
   * Process a label image: OCR + parse + store
   */
  async processLabelImage(
    imageUrl: string,
    productId: string | null = null
  ): Promise<{ id: string; confidence: 'high' | 'medium' | 'low' }> {
    // Extract text
    const { text, confidence } = await this.extractTextFromImage(imageUrl);

    // Parse
    const parsed = this.parseLabelText(text);

    // Store
    return this.repository.create({
      productId,
      rawText: parsed.rawText || text,
      ingredients: parsed.ingredients || [],
      nutrition: parsed.nutrition || {},
      allergenStatements: parsed.allergenStatements || [],
      mayContain: parsed.mayContain || [],
      photoUrl: imageUrl,
      confidence,
    });
  }
}
