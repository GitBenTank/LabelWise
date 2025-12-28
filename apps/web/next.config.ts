import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure proper transpilation of workspace packages
  transpilePackages: ['@labelwise/shared', '@labelwise/core', '@labelwise/db'],
  
  // Fix for Tesseract.js on serverless/Vercel
  webpack: (config, { isServer }) => {
    // Tesseract.js needs special handling for serverless environments
    if (isServer) {
      // Ensure tesseract.js is properly resolved
      config.resolve.alias = {
        ...config.resolve.alias,
        'tesseract.js': require.resolve('tesseract.js'),
      };
      
      // Don't externalize tesseract.js - we need it bundled
      // Remove it from externals if it's there
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter(
          (ext) => ext !== 'tesseract.js' && !(typeof ext === 'object' && ext && 'tesseract.js' in ext)
        );
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
