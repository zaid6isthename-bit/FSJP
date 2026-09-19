import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Syllabus() {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [professorMode, setProfessorMode] = useState(false);
  const [exploredList, setExploredList] = useState(() => {
    try {
      const saved = localStorage.getItem('jvm_syllabus_explored');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await api.getSyllabusExperiments();
      if (res.success && res.data) {
        setExperiments(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const markExplored = (num) => {
    if (!exploredList.includes(num)) {
      const updated = [...exploredList, num];
      setExploredList(updated);
      try {
        localStorage.setItem('jvm_syllabus_explored', JSON.stringify(updated));
      } catch {}
    }
  };

  const filterOptions = [
    'All',
    'Java',
    'Servlet',
    'JSP',
    'JDBC',
    'HTML/CSS',
    'JavaScript',
    'React',
    'Spring Boot',
    'REST',
  ];

  const filteredExperiments = experiments.filter((exp) => {
    const matchesSearch =
      searchQuery === '' ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.technology.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.concepts && exp.concepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Java') return exp.technology.toLowerCase().includes('java');
    if (activeFilter === 'Servlet') return exp.technology.toLowerCase().includes('servlet');
    if (activeFilter === 'JSP') return exp.technology.toLowerCase().includes('jsp');
    if (activeFilter === 'JDBC') return exp.technology.toLowerCase().includes('jdbc');
    if (activeFilter === 'HTML/CSS') return exp.technology.toLowerCase().includes('html');
    if (activeFilter === 'JavaScript') return exp.technology.toLowerCase().includes('javascript') || exp.technology.toLowerCase().includes('dom');
    if (activeFilter === 'React') return exp.technology.toLowerCase().includes('react');
    if (activeFilter === 'Spring Boot') return exp.technology.toLowerCase().includes('spring');
    if (activeFilter === 'REST') return exp.technology.toLowerCase().includes('rest');

    return true;
  });

  const progressPercent = Math.round((exploredList.length / 13) * 100);

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 pb-20">
      {/* Top Banner / Academic Header */}
      <div className="border-b border-canvas-border bg-gradient-to-b from-blue-950/20 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-500/10 text-brand-cyan border border-blue-500/20">
                  Semester III · University of Mumbai
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Full Stack Java Programming Syllabus
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Java, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Visualized.</span>
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
                Explore the concepts covered in your Full Stack Java Programming syllabus through interactive examples, visual memory layouts, and executable demonstrations.
              </p>
            </div>

            {/* Progress & Academic Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Progress Card */}
              <div className="p-4 rounded-2xl bg-canvas-card border border-canvas-border min-w-[200px]">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400">Curriculum Progress</span>
                  <span className="text-brand-cyan font-bold">{exploredList.length} / 13 explored</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Professor Mode Toggle */}
              <button
                onClick={() => setProfessorMode(!professorMode)}
                className={`px-4 py-3.5 rounded-2xl text-xs font-semibold font-mono transition-all flex items-center gap-2 border ${
                  professorMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-sm'
                    : 'bg-canvas-card text-slate-300 border-canvas-border hover:border-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {professorMode ? 'school' : 'person'}
                </span>
                {professorMode ? 'Professor Mode: ON' : 'Professor Mode'}
              </button>
            </div>
          </div>

          {/* Professor Mode Academic Banner */}
          {professorMode && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs font-mono space-y-1.5 animate-fadeIn">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <span className="material-symbols-outlined text-sm">verified</span>
                Academic Alignment: Mumbai University Semester III Full Stack Java Programming (CS301)
              </div>
              <div className="text-[11px] text-amber-200/80 font-sans leading-relaxed">
                This project covers 100% of prescribed practical topics across 6 core competency modules: Object-Oriented Architecture, Exception Recovery, Jakarta EE Servlets & JSPs, Client-Side JavaScript/DOM, React SPAs, and Spring Boot JDBC REST microservices.
              </div>
              <div className="pt-2 flex gap-3">
                <Link
                  to="/syllabus/coverage"
                  className="text-xs font-bold text-amber-300 underline hover:text-white"
                >
                  View Full Syllabus Coverage Matrix →
                </Link>
                <Link
                  to="/demo"
                  className="text-xs font-bold text-amber-300 underline hover:text-white"
                >
                  Launch 10-Minute Viva Presentation Flow →
                </Link>
              </div>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="mt-8 space-y-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search syllabus experiments by topic, keyword (inheritance, JDBC, Servlet, React, REST)..."
                className="w-full pl-11 pr-4 py-3 text-xs rounded-xl bg-slate-900/80 border border-canvas-border text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-blue"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'bg-canvas-card text-slate-400 hover:text-white border border-canvas-border'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main Experiment Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Syllabus Practicals</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              ({filteredExperiments.length} matching)
            </span>
          </h2>

          <Link
            to="/syllabus/coverage"
            className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-mono"
          >
            <span>Syllabus Coverage Map</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 font-mono text-xs">
            Loading syllabus practicals...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((exp) => {
              const isExplored = exploredList.includes(exp.experimentNumber);
              return (
                <div
                  key={exp.id}
                  className="group p-6 rounded-2xl bg-canvas-card border border-canvas-border hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-glow-sm"
                >
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-cyan-400 transition-all" />

                  <div>
                    {/* Card Header: Experiment Number & Tech */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono font-bold text-brand-cyan bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                        Exp {exp.experimentNumber < 10 ? `0${exp.experimentNumber}` : exp.experimentNumber}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {exp.jvmVisualizable ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px]">check_circle</span>
                            JVM Visualizable
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            Interactive Demo
                          </span>
                        )}
                        {isExplored && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                            Explored
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight line-clamp-1">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Concepts Pills */}
                    {exp.concepts && exp.concepts.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {exp.concepts.slice(0, 3).map((concept, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800"
                          >
                            {concept}
                          </span>
                        ))}
                        {exp.concepts.length > 3 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md text-slate-500">
                            +{exp.concepts.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-5 mt-4 border-t border-canvas-border flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">
                      {exp.technology}
                    </span>
                    <button
                      onClick={() => {
                        markExplored(exp.experimentNumber);
                        navigate(`/syllabus/${exp.experimentNumber}`);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] group-hover:bg-blue-600 text-slate-300 group-hover:text-white border border-white/10 group-hover:border-blue-500 transition-all flex items-center gap-1.5"
                    >
                      <span>Open Experiment</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredExperiments.length === 0 && !loading && (
          <div className="py-24 text-center rounded-2xl bg-canvas-card border border-canvas-border space-y-2">
            <span className="material-symbols-outlined text-4xl text-slate-600">search_off</span>
            <h3 className="text-sm font-bold text-white">No syllabus practicals found</h3>
            <p className="text-xs text-slate-400">
              No experiments matched your search query "{searchQuery}". Try searching for Java, Servlet, or React.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
