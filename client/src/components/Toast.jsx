


import React from 'react';

export default function Toast({ message, type, show }) {
  if (!show) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3.5 rounded-2xl shadow-xl border text-white transition-all transform duration-300 animate-scale-up ${
      type === 'error' 
        ? 'bg-rose-600 border-rose-500' 
        : type === 'info' 
        ? 'bg-slate-800 border-slate-700' 
        : 'bg-emerald-600 border-emerald-500'
    }`}>
      <span className="text-base">
        {type === 'error' ? '🚫' : type === 'info' ? 'ℹ️' : '✨'}
      </span>
      <p className="text-xs font-bold tracking-wide">{message}</p>
    </div>
  );
}