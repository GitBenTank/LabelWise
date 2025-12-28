import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure proper transpilation of workspace packages
  transpilePackages: ['@labelwise/shared', '@labelwise/core', '@labelwise/db'],
  
  // Fix for Tesseract.js on serverless/Vercel
  // Note: Tesseract.js has known issues on serverless platforms
  // Consider using a cloud OCR service for production
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Try to properly bundle tesseract.js
      config.resolve.alias = {
        ...config.resolve.alias,
      };
      
      // Mark tesseract.js as external to avoid bundling issues
      // This will require it to be available at runtime
      config.externals = config.externals || [];
      if (!config.externals.includes('tesseract.js')) {
        config.externals.push('tesseract.js');
      }
    }
    
    return config;
  },
  
  // Increase function timeout and body size for OCR
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
