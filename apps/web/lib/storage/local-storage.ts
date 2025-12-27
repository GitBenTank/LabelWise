import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'labels');

/**
 * Local file storage for development (when Supabase is not configured)
 */
export class LocalFileStorage {
  private async ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }
  }

  async uploadFile(file: File): Promise<{ url: string; path: string }> {
    await this.ensureUploadDir();
    
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = join(UPLOAD_DIR, fileName);
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await writeFile(filePath, buffer);
    
    // Return a URL that Next.js can serve
    const url = `/uploads/labels/${fileName}`;
    
    return { url, path: filePath };
  }

  getPublicUrl(fileName: string): string {
    return `/uploads/labels/${fileName}`;
  }
}

