import { createWorker } from 'tesseract.js';
import type { OCRService } from '@labelwise/core';

/**
 * Tesseract.js implementation of OCRService
 */
export class TesseractOCRService implements OCRService {
  async extractText(imageUrl: string | Buffer): Promise<{
    text: string;
    confidence: number;
  }> {
    const worker = await createWorker('eng');
    
    try {
      // Handle Buffer directly, or fetch if it's a URL
      let imageData: Buffer;
      
      if (Buffer.isBuffer(imageUrl)) {
        imageData = imageUrl;
      } else if (typeof imageUrl === 'string' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        imageData = Buffer.from(arrayBuffer);
      } else {
        // Assume it's a file path or data URL - pass as string to tesseract
        imageData = imageUrl as unknown as Buffer;
      }

      const { data } = await worker.recognize(imageData);
      
      return {
        text: data.text,
        confidence: data.confidence || 0,
      };
    } finally {
      await worker.terminate();
    }
  }
}

