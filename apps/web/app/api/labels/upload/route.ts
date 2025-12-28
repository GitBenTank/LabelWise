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
    let buffer: Buffer | null = null;
    
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
      buffer = Buffer.from(arrayBuffer);

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

      // Store the object path for database storage
      // For OCR, we'll use the buffer directly (already have it from upload)
      // For display later, we'll generate signed URLs on-demand
      imageUrl = `${bucket}/${fileName}`;
      
      // Note: We have the buffer already, so we can pass it directly to OCR
      // instead of fetching from the signed URL. This is more efficient.
    } else {
      // Use local file storage for development
      const localStorage = new LocalFileStorage();
      const result = await localStorage.uploadFile(file);
      imageUrl = result.url;
    }

    // Process with OCR
    // Use the buffer directly if we have it (Supabase upload), otherwise use the URL
    console.log('[UPLOAD] Step 1: Starting OCR processing...');
    console.log('[UPLOAD] Step 1: Image URL:', imageUrl.substring(0, 100));
    
    const ocrService = new TesseractOCRService();
    const repository = new DrizzleLabelRepository();
    const labelService = new LabelService(ocrService, repository);
    
    // If we uploaded to Supabase, we already have the buffer - use it directly
    let ocrInput: string | Buffer;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && buffer) {
      // Use buffer directly - more efficient than fetching from URL
      ocrInput = buffer;
      console.log('[UPLOAD] Step 1: Using buffer directly for OCR (size:', buffer.length, 'bytes)');
    } else {
      // Use URL for local storage
      ocrInput = imageUrl;
      console.log('[UPLOAD] Step 1: Using URL for OCR:', imageUrl.substring(0, 100) + '...');
    }

    console.log('[UPLOAD] Step 2: Calling OCR service...');
    let result;
    try {
      // Extract text first
      const ocrStartTime = Date.now();
      const { text, confidence } = await ocrService.extractText(ocrInput);
      const ocrDuration = Date.now() - ocrStartTime;
      console.log('[UPLOAD] Step 2: OCR completed in', ocrDuration, 'ms');
      console.log('[UPLOAD] Step 2: Extracted text length:', text.length, 'confidence:', confidence);
      
      // Parse and store
      console.log('[UPLOAD] Step 3: Parsing label text...');
      const parsed = labelService.parseLabelText(text);
      console.log('[UPLOAD] Step 3: Parsed ingredients:', parsed.ingredients?.length || 0);
      
      const nutritionRecord: Record<string, number | null> = {};
      if (parsed.nutrition) {
        Object.entries(parsed.nutrition).forEach(([key, value]) => {
          nutritionRecord[key] = value ?? null;
        });
      }
      
      console.log('[UPLOAD] Step 4: Storing label in database...');
      const dbStartTime = Date.now();
      result = await repository.create({
        productId: productId || null,
        rawText: parsed.rawText || text,
        ingredients: parsed.ingredients || [],
        nutrition: nutritionRecord,
        allergenStatements: parsed.allergenStatements || [],
        mayContain: parsed.mayContain || [],
        photoUrl: imageUrl,
        confidence: confidence >= 80 ? 'high' : confidence >= 50 ? 'medium' : 'low',
      });
      const dbDuration = Date.now() - dbStartTime;
      console.log('[UPLOAD] Step 4: Database write completed in', dbDuration, 'ms');
      console.log('[UPLOAD] Step 4: Label stored, ID:', result.id);
      
      console.log('[UPLOAD] Step 5: Returning response...');
    } catch (ocrError) {
      console.error('[UPLOAD] ERROR: OCR processing failed:', ocrError);
      console.error('[UPLOAD] ERROR: Stack:', ocrError instanceof Error ? ocrError.stack : 'No stack');
      throw new Error(
        `OCR processing failed: ${ocrError instanceof Error ? ocrError.message : 'Unknown error'}. ` +
        `Please try again with a clearer image.`
      );
    }

    console.log('[UPLOAD] SUCCESS: Returning response with label ID:', result.id);
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
