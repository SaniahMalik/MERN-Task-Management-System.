import React, { useState } from 'react';

export default function Profile({ user, setUser, showToast, setCurrentPage }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedUser = { ...user, name, email };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showToast('Profile configuration saved successfully!', 'success');
      setCurrentPage('dashboard');
    } catch (err) {
      showToast('Failed to save profile configurations', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden transition-all animate-scale-up">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Profile Configuration</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage security credentials and registry parameters</p>
      </div>

      <form onSubmit={handleProfileSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Registry Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Registered Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Security Passcode Update</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Current Password PIN</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">New Target Passcode PIN</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => setCurrentPage('dashboard')}
            className="px-5 py-3 text-xs font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-xl transition hover:opacity-90 shadow-lg shadow-blue-500/15"
          >
            {loading ? 'Saving...' : 'Deploy updates'}
          </button>
        </div>
      </form>
    </div>
  );
}