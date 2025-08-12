'use client';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string|undefined>();
  const [error, setError] = useState<string|undefined>();
  const [loading, setLoading] = useState(false);

  async function createUser(e: any) {
    e.preventDefault();
    setMessage(undefined); setError(undefined); setLoading(true);
    try {
      const res = await fetch('/api/auth/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data?.error || 'create_failed');
      setMessage('User created.');
      setName(''); setEmail(''); setPassword('');
    } catch (e: any) {
      setError(e?.message || 'Failed to create user');
    } finally { setLoading(false); }
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch {}
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-sm text-gray-500 mt-2">Manage users and session.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        {/* Create User */}
        <form onSubmit={createUser} className="space-y-4 bg-white dark:bg-surface rounded-2xl border border-gray-200 dark:border-border p-6 shadow-sm">
          <h2 className="font-semibold tracking-tight">Create User</h2>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">Name</label>
            <input className="w-full rounded-md border border-gray-300 dark:border-border px-3 py-2 text-sm bg-transparent" value={name} onChange={(e:any)=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">Email</label>
            <input type="email" className="w-full rounded-md border border-gray-300 dark:border-border px-3 py-2 text-sm bg-transparent" value={email} onChange={(e:any)=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">Password</label>
            <input type="password" className="w-full rounded-md border border-gray-300 dark:border-border px-3 py-2 text-sm bg-transparent" value={password} onChange={(e:any)=>setPassword(e.target.value)} />
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="rounded-md bg-brand text-white px-4 py-2 text-sm hover:bg-brand-dark disabled:opacity-50">Create</button>
          </div>
        </form>

        {/* Logout */}
        <div className="space-y-4 bg-white dark:bg-surface rounded-2xl border border-gray-200 dark:border-border p-6 shadow-sm">
          <h2 className="font-semibold tracking-tight">Session</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sign out of the dashboard.</p>
          <button onClick={logout} className="rounded-md border border-gray-300 dark:border-border px-4 py-2 text-sm bg-white dark:bg-surface hover:bg-gray-100 dark:hover:bg-surface/60">Logout</button>
        </div>
      </div>
    </div>
  );
}
