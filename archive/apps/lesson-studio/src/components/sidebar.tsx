'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◆' },
  { href: '/knowledge', label: 'Knowledge', icon: '🧠' },
  { href: '/courses', label: 'Courses', icon: '📚' },
  { href: '/lessons', label: 'Lessons', icon: '📝' },
  { href: '/provenance', label: 'Provenance', icon: '🔗' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-lg font-bold tracking-tight">Lesson Studio</h1>
        <p className="text-xs text-gray-400 mt-1">Mission Application 001</p>
      </div>
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/') && item.href !== '/';
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-700 pt-4 mt-4">
        <p className="text-xs text-gray-500">Bhavya AI Lab OS</p>
        <p className="text-xs text-gray-500">v3.0.0 — Engineering Frozen</p>
      </div>
    </aside>
  );
}
