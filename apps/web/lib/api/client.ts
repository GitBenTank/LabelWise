import type {
  Product,
  LabelWiseReport,
  UserProfile,
} from '@labelwise/shared';

const API_BASE = '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Unknown error',
      message: response.statusText,
    }));
    throw new ApiError(
      error.message || error.error || 'Request failed',
      response.status,
      error.code
    );
  }
  return response.json();
}

export const api = {
  /**
   * Look up a product by barcode
   */
  async lookupProduct(barcode: string): Promise<Product> {
    const response = await fetch(
      `${API_BASE}/products/lookup?barcode=${encodeURIComponent(barcode)}`
    );
    return handleResponse<Product>(response);
  },

  /**
   * Upload a label image
   */
  async uploadLabel(
    file: File,
    productId?: string
  ): Promise<{ id: string; imageUrl: string; confidence: 'high' | 'medium' | 'low'; message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (productId) {
      formData.append('productId', productId);
    }

    const response = await fetch(`${API_BASE}/labels/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  /**
   * Generate an analysis report
   */
  async generateAnalysis(
    params: {
      barcode?: string;
      productId?: string;
      labelUploadId?: string;
      profileId?: string;
    }
  ): Promise<LabelWiseReport> {
    const response = await fetch(`${API_BASE}/analyses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    return handleResponse<LabelWiseReport>(response);
  },

  /**
   * Get current user's profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE}/profiles`);
    return handleResponse<UserProfile>(response);
  },

  /**
   * Update user's profile
   */
  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    const response = await fetch(`${API_BASE}/profiles`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    return handleResponse<UserProfile>(response);
  },
};

