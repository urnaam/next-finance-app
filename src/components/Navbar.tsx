'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user_id');
    router.push('/login');
  };

  const navItems = [
    { id: 'home', label: 'Нүүр', href: '/' },
    { id: 'transactions', label: 'Гүйлгээ', href: '/transactions' },
  ];

  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={typeof item.href === 'string' ? item.href : '/login'}
          className={`hover:underline ${
            pathname === item.href ? 'font-bold underline' : ''
          }`}
        >
          {item.label}
        </Link>
      ))}
      <button onClick={handleLogout} className="hover:underline">
        Гарах
      </button>
    </nav>
  );
}
