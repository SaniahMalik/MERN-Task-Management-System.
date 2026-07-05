import React from 'react';

export default function Sidebar({ user, currentPage, setCurrentPage, handleLogout, theme, toggleTheme }) {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📋' },
    { id: 'profile', name: 'Profile Settings', icon: '👤' }
  ];

  return (
    <aside className={`w-full md:w-64 flex flex-col border-r shrink-0 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
    }`}>
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white dark:bg-slate-100 dark:text-slate-900 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg tracking-wide shadow-md">
            TM
          </div>
          <span className="font-black text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            TaskManager
          </span>
        </div>
      </div>

      {/* User Card */}
      {user && (
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active User</p>
          <h4 className="font-extrabold text-sm mt-1 truncate">{user.name}</h4>
          <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
        </div>
      )}

      {/* Navigation list */}
      <nav className="flex-1 p-4 space-y-1.5">
        {user && navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-colors bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          <span>Appearance</span>
          <span>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>
        </button>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-500/10 transition-colors"
          >
            <span>🚪</span>
            <span>Sign Out Session</span>
          </button>
        )}
      </div>
    </aside>
  );
}