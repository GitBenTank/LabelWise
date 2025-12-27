/**
 * OCR interface for label text extraction
 */
export interface OCRService {
  /**
   * Extract text from an image URL or buffer
   */
  extractText(imageUrl: string): Promise<{
    text: string;
    confidence: number;
  }>;
}

