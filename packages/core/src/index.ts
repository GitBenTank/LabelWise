// Export domain services
export * from './products';
export * from './labels';
export * from './ingredients';
export * from './profiles';
export * from './scoring';
export * from './reports';

// Export scoring types
export type { ScoringContext } from './scoring';

// Export adapters
export * from './adapters/product-data-source';
export * from './adapters/open-food-facts';

// Export repositories
export * from './repositories/product-repository';
export * from './repositories/ingredient-repository';
export * from './repositories/label-repository';
export * from './repositories/analysis-repository';
