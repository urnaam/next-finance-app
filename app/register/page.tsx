'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error || 'Бүртгэл амжилтгүй');
        alert(data.error || 'Бүртгэл амжилтгүй');
      } else {
        console.log('Success:', data);
        router.push('/login'); // Бүртгүүлсний дараа нэвтрэх хуудас руу чиглүүлнэ
      }
    } catch (err) {
      console.error('Гэнэтийн алдаа:', err);
      alert('Гэнэтийн алдаа гарлаа');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-pink-500">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 text-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Бүртгүүлэх</h1>
        <div className="space-y-4">
          <input
            placeholder="Нэвтрэх нэр"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            onClick={handleRegister}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 rounded-md transition"
          >
            Бүртгүүлэх
          </button>
        </div>
        <p className="text-center mt-6 text-sm">
          Бүртгэлтэй юу?{' '}
          <a href="/login" className="underline text-white hover:text-blue-200">
            Нэвтрэх
          </a>
        </p>
      </div>
    </div>
  );
}
