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
        // Fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        try {
          const response = await fetch(imageUrl, {
            signal: controller.signal,
            headers: {
              'Accept': 'image/*',
            },
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
          }
          
          const arrayBuffer = await response.arrayBuffer();
          imageData = Buffer.from(arrayBuffer);
        } catch (error) {
          clearTimeout(timeoutId);
          if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Image fetch timeout: The image took too long to download');
          }
          throw error;
        }
      } else {
        // Assume it's a file path or data URL - pass as string to tesseract
        imageData = imageUrl as unknown as Buffer;
      }

      // Add timeout for OCR processing
      const ocrPromise = worker.recognize(imageData);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('OCR processing timeout: The image took too long to process')), 60000); // 60 second timeout
      });

      const { data } = await Promise.race([ocrPromise, timeoutPromise]);
      
      return {
        text: data.text,
        confidence: data.confidence || 0,
      };
    } catch (error) {
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`OCR failed: ${error.message}`);
      }
      throw error;
    } finally {
      await worker.terminate();
    }
  }
}

