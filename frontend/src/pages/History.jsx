import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    setLoading(true);
    const res = await api.getSessions();
    setLoading(false);
    if (res.success && res.data) {
      setSessions(res.data);
    }
  }

  const handleDelete = async (sessionId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await api.deleteSession(sessionId);
    if (res.success) {
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-canvas-border">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">
              Execution History
            </h1>
            <p className="text-xs text-slate-400">
              Review and replay previously recorded Java simulations and failure forensics.
            </p>
          </div>
          <Link
            to="/visualizer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-glow-sm transition-all self-start"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Simulation
          </Link>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            <span className="material-symbols-outlined text-3xl animate-spin mb-2">sync</span>
            <p>Loading saved executions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-[#0D121D] rounded-2xl border border-canvas-border p-12 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl mb-2 text-slate-600">history_toggle_off</span>
            <h3 className="text-base font-bold text-white mb-1">No execution sessions recorded yet</h3>
            <p className="text-xs max-w-sm mx-auto mb-6">
              Run any program in the Visualizer to automatically record its runtime trace, heap mutations, and failure forensics.
            </p>
            <Link
              to="/visualizer"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              Launch Visualizer
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => {
              const isFailed = s.status === 'FAILED';

              return (
                <div
                  key={s.sessionId}
                  className="bg-[#0D121D] rounded-xl border border-canvas-border hover:border-slate-600 p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                        isFailed
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isFailed ? 'error' : 'check_circle'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                          {s.title}
                        </h3>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            isFailed
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                        {isFailed && s.errorType && (
                          <span className="text-red-400 font-semibold">{s.errorType}</span>
                        )}
                        <span>{s.eventCount} events recorded</span>
                        <span>•</span>
                        <span>{new Date(s.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/visualizer/${s.sessionId}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#152033] hover:bg-blue-600 border border-canvas-border transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">visibility</span>
                      Reopen Trace
                    </Link>

                    <button
                      onClick={(e) => handleDelete(s.sessionId, e)}
                      title="Delete Session"
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/[0.05] transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
