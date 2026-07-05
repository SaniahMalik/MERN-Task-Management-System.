
import React, { useState, useEffect } from 'react';
import API from './services/api';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentPage, setCurrentPage] = useState(user ? 'dashboard' : 'login');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: ''
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };


const fetchTasks = async () => {
  if (!token) return;
  setLoading(true);
  try {
    const res = await API.get('/tasks');
    console.log("API Response:", res.data); // Yahan check karein ke data aa raha hai
    if (res.data.success) {
      setTasks(res.data.data);
    }
  } catch (err) {
      showToast(err.response?.data?.error || 'Failed to sync with API database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentPage('login');
    showToast('User session terminated successfully', 'info');
  };

const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      showToast('Title parameter is missing', 'error');
      return;
    }
    setLoading(true);
    try {
      if (editingTask) {
        // Ye check karein ke taskForm ka data wahi hai jo server expect kar raha hai
        const res = await API.put(`/tasks/${editingTask._id}`, taskForm);
        if (res.data.success) {
          showToast('Task updated successfully!', 'success');
          await fetchTasks(); // Update ke baad fetch karein
          setShowTaskModal(false);
          setEditingTask(null);
        }
      } else {
        const res = await API.post('/tasks', taskForm);
        if (res.data.success) {
          showToast('New task created!', 'success');
          await fetchTasks();
          setShowTaskModal(false);
        }
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || 'Task submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const executeDeleteTask = async () => {
    if (!confirmDeleteId) return;
    setLoading(true);
    try {
      const res = await API.delete(`/tasks/${confirmDeleteId}`);
      if (res.data.success) {
        showToast('Task successfully purged', 'success');
        fetchTasks();
        setConfirmDeleteId(null);
      }
    } catch (err) {
      showToast('Failed to purge task', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: ''
    });
    setShowTaskModal(true);
  };

  
  const openEditModal = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setShowTaskModal(true);
  };

  return (
    <div className={`${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'} min-h-screen font-sans flex flex-col md:flex-row transition-colors duration-300`}>
      <Toast message={toast.message} type={toast.type} show={toast.show} />

      <Sidebar 
        user={user} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        handleLogout={handleLogout} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        {currentPage === 'login' && (
          <Login 
            setUser={setUser} 
            setToken={setToken} 
            setCurrentPage={setCurrentPage} 
            showToast={showToast} 
          />
        )}

        {currentPage === 'register' && (
          <Register 
            setUser={setUser} 
            setToken={setToken} 
            setCurrentPage={setCurrentPage} 
            showToast={showToast} 
          />
        )}

        {currentPage === 'dashboard' && (
  <Dashboard 
    tasks={tasks} 
    loading={loading} 
    fetchTasks={fetchTasks} 
    apiCall={API} 
    showToast={showToast} 
    openCreateModal={openCreateModal} 
    openEditModal={openEditModal} 
    triggerConfirmAction={setConfirmDeleteId} 
  />
)}

        {currentPage === 'profile' && (
          <Profile 
            user={user} 
            setUser={setUser} 
            showToast={showToast} 
            setCurrentPage={setCurrentPage} 
          />
        )}
      </main>

      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                {editingTask ? '📝 Update Task' : '🚀 Create New Task'}
              </h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600 font-extrabold text-sm">✕</button>
            </div>

            <form onSubmit={handleTaskSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design landing page"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
                <textarea
                  rows="3"
                  placeholder="Task description..."
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="low">LOW</option>
                    <option value="medium">MEDIUM</option>
                    <option value="high">HIGH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-5 py-3 text-xs font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-xl transition hover:opacity-90 shadow-lg shadow-blue-500/15"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up">
            <div className="p-6 text-center">
              <span className="text-3xl">⚠️</span>
              <h3 className="font-black text-slate-900 dark:text-white text-lg mt-3">Delete Task?</h3>
              <p className="text-xs text-slate-500 mt-2">Are you sure you want to permanently delete this task? This operation cannot be undone.</p>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteTask}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}