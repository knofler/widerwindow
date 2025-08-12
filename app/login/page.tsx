'use client';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin/new';
  const error = searchParams.get('error');

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-serif text-3xl font-bold tracking-tight mb-6">Login</h1>
      <form method="POST" action={`/api/auth/login?next=${encodeURIComponent(next)}`} className="space-y-4 bg-white dark:bg-surface rounded-2xl border border-gray-200 dark:border-border p-6 shadow-sm">
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-500">Email</label>
          <input name="email" type="email" required className="w-full rounded-md border border-gray-300 dark:border-border px-3 py-2 text-sm bg-transparent" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-500">Password</label>
          <input name="password" type="password" required className="w-full rounded-md border border-gray-300 dark:border-border px-3 py-2 text-sm bg-transparent" />
        </div>
        {error && <p className="text-sm text-red-600">{error === 'invalid' ? 'Invalid credentials' : error === 'missing' ? 'Email and password are required' : 'Login failed'}</p>}
        <button type="submit" className="rounded-md bg-brand text-white px-4 py-2 text-sm hover:bg-brand-dark w-full">Sign in</button>
      </form>
    </div>
  );
}
