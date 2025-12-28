import { NextRequest } from 'next/server';
import { labelUploadRequestSchema } from '@labelwise/shared';
import { validateRequest } from '@/lib/api/validation';
import { handleApiError } from '@/lib/api/errors';
import { LabelService } from '@labelwise/core';
import { DrizzleLabelRepository } from '@labelwise/db';
import { TesseractOCRService } from '@/lib/ocr/tesseract';
import { createAdminClient } from '@/lib/supabase/server';
import { LocalFileStorage } from '@/lib/storage/local-storage';

/**
 * Sanitize filename for Supabase Storage
 * Removes spaces and unsafe characters that Supabase doesn't allow in object keys
 */
function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-') // spaces → dashes
    .replace(/[^a-z0-9.-]/g, ''); // remove unsafe chars
}

/**
 * POST /api/labels/upload
 * Upload and parse a label image
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const productId = formData.get('productId') as string | null;

    if (!file) {
      return Response.json(
        { error: 'Missing file', message: 'No file provided' },
        { status: 400 }
      );
    }

    // Use Supabase Storage if configured, otherwise use local file storage
    let imageUrl: string;
    
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Upload to Supabase Storage
      let supabase;
      try {
        supabase = createAdminClient();
      } catch (error) {
        return Response.json(
          {
            error: 'Configuration Error',
            message: error instanceof Error ? error.message : 'Failed to initialize Supabase client. Please check your .env.local file.',
          },
          { status: 500 }
        );
      }
      
      // Sanitize filename to prevent Supabase Storage key errors
      const safeName = sanitizeFilename(file.name);
      const fileName = `${Date.now()}-${safeName}`;
      const bucket = 'label-images';

      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        // Check if bucket doesn't exist
        if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('not found')) {
          return Response.json(
            {
              error: 'Storage Configuration Error',
              message: `Storage bucket "${bucket}" not found. Please create it in your Supabase dashboard under Storage.`,
            },
            { status: 500 }
          );
        }
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      // Get signed URL for private bucket (valid for 1 hour)
      // Note: For private buckets, we need signed URLs instead of public URLs
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(fileName, 3600); // 1 hour expiry
      
      if (signedUrlError || !signedUrlData) {
        // Fallback: if signed URL fails, use the object path
        // The OCR service will need to handle this, or we can retry with public URL
        throw new Error(`Failed to create signed URL: ${signedUrlError?.message || 'Unknown error'}`);
      }
      
      imageUrl = signedUrlData.signedUrl;
    } else {
      // Use local file storage for development
      const localStorage = new LocalFileStorage();
      const result = await localStorage.uploadFile(file);
      imageUrl = result.url;
    }

    // Process with OCR
    console.log('[Upload] Starting OCR processing for image:', imageUrl.substring(0, 100) + '...');
    
    const ocrService = new TesseractOCRService();
    const repository = new DrizzleLabelRepository();
    const labelService = new LabelService(ocrService, repository);

    let result;
    try {
      result = await labelService.processLabelImage(
        imageUrl,
        productId || null
      );
      console.log('[Upload] OCR processing completed, label ID:', result.id);
    } catch (ocrError) {
      console.error('[Upload] OCR processing failed:', ocrError);
      throw new Error(
        `OCR processing failed: ${ocrError instanceof Error ? ocrError.message : 'Unknown error'}. ` +
        `Please try again with a clearer image.`
      );
    }

    return Response.json({
      id: result.id,
      imageUrl,
      confidence: result.confidence,
      message: 'Label processed successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
