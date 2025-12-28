# Tesseract.js Serverless Issue

## Problem

Tesseract.js doesn't work well on serverless platforms like Vercel because:

1. **Worker Script Path Issue**: 
   ```
   Error: Cannot find module '/ROOT/node_modules/tesseract.js/src/worker-script/node/index.js'
   ```
   Tesseract.js tries to load worker scripts from the filesystem, which doesn't work in serverless environments.

2. **Memory Constraints**: Tesseract.js is memory-intensive and can exceed Vercel Hobby plan limits.

3. **Timeout Issues**: OCR processing can take 30-60 seconds, exceeding Vercel's 10-second function timeout.

## Solutions

### Option 1: Use Cloud OCR Service (Recommended for Production)

Replace Tesseract.js with a cloud OCR service:

- **Google Cloud Vision API** - Best accuracy, pay-per-use
- **AWS Textract** - Good for structured documents
- **Azure Computer Vision** - Good alternative
- **OCR.space API** - Free tier available

### Option 2: Background Job Processing

Move OCR to a background job:

1. Upload image → Store in DB with `status: 'pending'`
2. Return immediately with label ID
3. Process OCR in background (cron job, queue, or edge function)
4. Update status when complete
5. Client polls for completion

### Option 3: Client-Side OCR (Current Workaround)

Process OCR in the browser instead of server:

- Tesseract.js works fine in the browser
- Upload already-processed text
- No server timeout issues

### Option 4: Use Vercel Pro Plan

Vercel Pro has:
- Longer function timeouts (up to 60s)
- More memory
- Better for CPU-intensive tasks

## Current Status

The app is deployed but OCR fails on Vercel serverless. For now, consider:

1. **Quick Fix**: Use client-side OCR (process in browser)
2. **Production Fix**: Integrate cloud OCR service
3. **Alternative**: Move to background processing

## Next Steps

1. Decide on OCR approach (cloud service vs background job)
2. Implement chosen solution
3. Update `TesseractOCRService` or create new `CloudOCRService`

