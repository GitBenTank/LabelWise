'use client';

import { useState } from 'react';
import type { LabelWiseReport } from '@labelwise/shared';
import { IngredientDetail } from './IngredientDetail';

interface IngredientsListProps {
  ingredients: LabelWiseReport['ingredients'];
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(
    null
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Ingredients
        </h2>
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => {
            const hasConcerns = ingredient.concerns.length > 0;
            return (
              <button
                key={index}
                onClick={() =>
                  setSelectedIngredient(
                    selectedIngredient === ingredient.normalized
                      ? null
                      : ingredient.normalized
                  )
                }
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  hasConcerns
                    ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">
                      {ingredient.name}
                    </span>
                    {hasConcerns && (
                      <span className="ml-2 text-xs text-yellow-700 bg-yellow-200 px-2 py-0.5 rounded">
                        {ingredient.concerns.length} concern
                        {ingredient.concerns.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      selectedIngredient === ingredient.normalized
                        ? 'transform rotate-180'
                        : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {selectedIngredient === ingredient.normalized && (
                  <IngredientDetail ingredient={ingredient} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

