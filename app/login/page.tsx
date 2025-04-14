'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    });

    if (res.ok) {
      localStorage.setItem('user_id', email);
      router.push('/admin');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 text-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Нэвтрэх</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Нэвтрэх нэр"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-white/10 placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            placeholder="Нууц үг"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-white/10 placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 rounded-md transition"
          >
            Нэвтрэх
          </button>
        </form>
        <p className="text-center mt-6 text-sm">
          Бүртгэлгүй юу?{' '}
          <a
            href="/register"
            className="underline text-white hover:text-blue-200"
          >
            Шинээр бүртгүүлэх
          </a>
        </p>
      </div>
    </div>
  );
}
