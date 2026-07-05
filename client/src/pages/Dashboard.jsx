import React, { useState } from 'react';

export default function Dashboard({ 
  tasks, 
  loading, 
  fetchTasks, 
  apiCall, 
  showToast, 
  openCreateModal, 
  openEditModal, 
  triggerConfirmAction 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Change task status instantly on database and update list
  const toggleTaskStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await apiCall.put(`/tasks/${task._id}`, { status: nextStatus });
      const success = res.data.success || res.status === 200;
      if (success) {
        showToast(`Task status changed to ${nextStatus}`, 'success');
        fetchTasks();
      }
    } catch (err) {
      showToast('Status update failed', 'error');
    }
  };

  // Zero-offset parsing formatting to render date absolutely perfect
  const formatDate = (dateString) => {
    if (!dateString) return 'No Due Date';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return 'No Due Date';
    
    return dateObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  // Case insensitive filters to handle priorities seamlessly
  const filteredTasks = tasks.filter((t) => {
    const titleMatch = (t.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || descMatch;

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    
    const taskPriority = (t.priority || 'medium').toLowerCase();
    const matchesPriority = priorityFilter === 'all' || taskPriority === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate stats
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completionPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-scale-up">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Workspace</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Audit and organize active workflows</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase px-5 py-4 rounded-xl transition shadow-lg shadow-blue-500/15"
        >
          + Create Task
        </button>
      </div>

      {/* Dynamic Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Tasks</span>
            <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">{tasks.length}</h3>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 w-12 h-12 rounded-xl flex items-center justify-center text-lg">📂</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completed</span>
            <h3 className="text-3xl font-black mt-2 text-emerald-500">{completedCount}</h3>
          </div>
          <div className="bg-emerald-50 text-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center text-lg">✓</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pending</span>
            <h3 className="text-3xl font-black mt-2 text-amber-500">{pendingCount}</h3>
          </div>
          <div className="bg-amber-50 text-amber-500 w-12 h-12 rounded-xl flex items-center justify-center text-lg">⏳</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completion Sync</span>
            <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">{completionPercent}%</h3>
          </div>
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-100 dark:text-slate-800" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-blue-600 transition-all duration-500" strokeDasharray={`${completionPercent}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full px-4 py-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-blue-500"
            >
              <option value="all">ALL STATUS</option>
              <option value="pending">PENDING</option>
              <option value="completed">COMPLETED</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-blue-500"
            >
              <option value="all">ALL PRIORITY</option>
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid rendering with loading indicator */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
          <div className="animate-spin inline-block w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full mb-3"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Syncing database tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-16 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No active tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => {
            const currentPriority = (task.priority || 'medium').toUpperCase();

            return (
              <div 
                key={task._id} 
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                  task.status === 'completed'
                    ? 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-900 opacity-75 shadow-none'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md ${
                      currentPriority === 'HIGH' 
                        ? 'bg-rose-500/10 text-rose-500' 
                        : currentPriority === 'MEDIUM' 
                        ? 'bg-amber-500/10 text-amber-500' 
                        : 'bg-sky-500/10 text-sky-500'
                    }`}>
                      {currentPriority} Priority
                    </span>
                    
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase transition-all ${
                        task.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-950 text-slate-500 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {task.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                    </button>
                  </div>

                  <h3 className={`text-base font-black tracking-tight text-slate-900 dark:text-white ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {task.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Due Date</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      📝 Edit
                    </button>
                    <button
                      onClick={() => triggerConfirmAction(task._id)}
                      className="p-2 text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-500/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}