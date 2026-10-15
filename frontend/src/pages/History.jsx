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
    <div className="min-h-screen bg-[#FAFAF8] text-[#101418] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E6E4DC]">
          <div>
            <h1 className="text-3xl font-black text-[#101418] tracking-tight mb-1 font-display">
              Execution History
            </h1>
            <p className="text-xs text-[#5C6672]">
              Review and replay previously recorded Java simulations and failure forensics.
            </p>
          </div>
          <Link
            to="/visualizer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0E6E5C] hover:bg-[#0A4A3F] shadow-subtle transition-all self-start"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Simulation
          </Link>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="text-center py-16 text-[#5C6672] text-xs">
            <span className="material-symbols-outlined text-3xl animate-spin mb-2 text-[#0E6E5C]">sync</span>
            <p>Loading saved executions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-12 text-center text-[#5C6672] shadow-card">
            <span className="material-symbols-outlined text-4xl mb-2 text-[#8C96A2]">history_toggle_off</span>
            <h3 className="text-base font-bold text-[#101418] mb-1 font-display">No execution sessions recorded yet</h3>
            <p className="text-xs max-w-sm mx-auto mb-6">
              Run any program in the Visualizer to automatically record its runtime trace, heap mutations, and failure forensics.
            </p>
            <Link
              to="/visualizer"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0E6E5C] hover:bg-[#0A4A3F] transition-all inline-flex items-center gap-1.5 shadow-subtle"
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
                  className="bg-white rounded-xl border border-[#E6E4DC] hover:border-[#101418] p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-subtle"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                        isFailed
                          ? 'bg-[#FAF0EC] text-[#A93226] border border-[#E4C4B2]'
                          : 'bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isFailed ? 'error' : 'check_circle'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#101418] group-hover:text-[#0E6E5C] transition-colors font-display">
                          {s.title}
                        </h3>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            isFailed
                              ? 'bg-[#FAF0EC] text-[#A93226] border border-[#E4C4B2]'
                              : 'bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8]'
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C6672] mt-1 font-mono">
                        {isFailed && s.errorType && (
                          <span className="text-[#A93226] font-semibold">{s.errorType}</span>
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
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#101418] bg-white hover:bg-[#101418] hover:text-white border border-[#E6E4DC] transition-all flex items-center gap-1 shadow-subtle"
                    >
                      <span className="material-symbols-outlined text-xs">visibility</span>
                      Reopen Trace
                    </Link>

                    <button
                      onClick={(e) => handleDelete(s.sessionId, e)}
                      title="Delete Session"
                      className="p-1.5 text-[#8C96A2] hover:text-[#A93226] rounded-lg hover:bg-[#FAF0EC] transition-colors cursor-pointer"
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
