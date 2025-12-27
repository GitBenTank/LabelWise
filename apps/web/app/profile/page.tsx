'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api/client';
import type { UserProfile, Allergen, DietPreference } from '@labelwise/shared';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const allergens: Allergen[] = [
    'peanut',
    'tree-nut',
    'milk',
    'egg',
    'soy',
    'wheat',
    'fish',
    'shellfish',
    'sesame',
  ];

  const dietPreferences: DietPreference[] = [
    'vegan',
    'vegetarian',
    'keto',
    'halal',
    'low-sodium',
    'low-sugar',
    'paleo',
    'none',
  ];

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const result = await api.getProfile();
        setProfile(result);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setError('Please sign in to view your profile');
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleAllergenToggle = (allergen: Allergen) => {
    if (!profile) return;
    setProfile({
      ...profile,
      allergens: profile.allergens.includes(allergen)
        ? profile.allergens.filter((a) => a !== allergen)
        : [...profile.allergens, allergen],
    });
  };

  const handleDietToggle = (diet: DietPreference) => {
    if (!profile) return;
    setProfile({
      ...profile,
      dietPreferences: profile.dietPreferences.includes(diet)
        ? profile.dietPreferences.filter((d) => d !== diet)
        : [...profile.dietPreferences, diet],
    });
  };

  const handleSeverityChange = (severity: 'strict' | 'moderate' | 'info-only') => {
    if (!profile) return;
    setProfile({ ...profile, severity });
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.updateProfile(profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to save profile');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || 'Profile not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600">
            Customize your preferences to get personalized product analysis
          </p>
        </div>

        <div className="space-y-6">
          {/* Allergens */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Allergens
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Select allergens you need to avoid
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allergens.map((allergen) => (
                <label
                  key={allergen}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={profile.allergens.includes(allergen)}
                    onChange={() => handleAllergenToggle(allergen)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 capitalize">
                    {allergen.replace(/-/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Diet Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Diet Preferences
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Select your dietary preferences
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dietPreferences.map((diet) => (
                <label
                  key={diet}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={profile.dietPreferences.includes(diet)}
                    onChange={() => handleDietToggle(diet)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 capitalize">
                    {diet.replace(/-/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sensitivity Level
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              How strictly should we flag potential issues?
            </p>
            <div className="space-y-2">
              {(['strict', 'moderate', 'info-only'] as const).map((severity) => (
                <label
                  key={severity}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                >
                  <input
                    type="radio"
                    name="severity"
                    value={severity}
                    checked={profile.severity === severity}
                    onChange={() => handleSeverityChange(severity)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 capitalize">
                    {severity.replace(/-/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">Profile saved!</p>
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

