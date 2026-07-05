
import React, { useState } from 'react';
import API from '../services/api';

export default function Login({ setUser, setToken, setCurrentPage, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, data } = res.data;
        setUser(data);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', token);
        showToast('Login validation success!', 'success');
        setCurrentPage('dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authorization rejected');
      showToast('Login credentials rejected', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-xl transition-all">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Sign In</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-bold uppercase tracking-wider">Access Main Workspace</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold tracking-wide">
          {error}
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
          <input
            type="email"
            required
            placeholder="e.g. name@domain.com"
            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase py-4 rounded-xl transition shadow-lg shadow-blue-500/15"
        >
          {loading ? 'Validating...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
          New here?{' '}
          <button
            onClick={() => setCurrentPage('register')}
            className="text-blue-500 hover:underline focus:outline-none ml-1 uppercase tracking-wider text-[11px]"
          >
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
}