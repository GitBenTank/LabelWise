'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            LabelWise
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/scan"
              className={`px-4 py-2 rounded-lg transition ${
                isActive('/scan')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Scan
            </Link>
            <Link
              href="/upload"
              className={`px-4 py-2 rounded-lg transition ${
                isActive('/upload')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upload
            </Link>
            <Link
              href="/profile"
              className={`px-4 py-2 rounded-lg transition ${
                isActive('/profile')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

