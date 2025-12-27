'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            LabelWise
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Calm clarity for what you eat.
          </p>
          <div className="space-y-4">
            <p className="text-gray-500">
              Know what&apos;s in it. Decide with confidence.
            </p>
            <div className="mt-8 space-x-4">
              <button
                onClick={() => router.push('/scan')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Scan Barcode
              </button>
              <button
                onClick={() => router.push('/upload')}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Upload Label
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
