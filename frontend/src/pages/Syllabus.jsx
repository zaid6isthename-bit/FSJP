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
    <div className="min-h-screen bg-[#FAFAF8] text-[#101418] pb-20">
      {/* Top Banner / Academic Header */}
      <div className="border-b border-[#E6E4DC] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8] font-bold">
                  Semester III · University of Mumbai
                </span>
                <span className="text-[11px] font-mono text-[#5C6672]">
                  Full Stack Java Programming Syllabus
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#101418] font-display">
                Java, <span className="underline decoration-4 decoration-[#0E6E5C] underline-offset-4">Visualized.</span>
              </h1>
              <p className="mt-2 text-sm text-[#5C6672] max-w-2xl leading-relaxed">
                Explore the concepts covered in your Full Stack Java Programming syllabus through interactive examples, visual memory layouts, and executable demonstrations.
              </p>
            </div>

            {/* Progress & Academic Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Progress Card */}
              <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] min-w-[200px] shadow-subtle">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-[#5C6672]">Curriculum Progress</span>
                  <span className="text-[#0E6E5C] font-bold">{exploredList.length} / 13 explored</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E6E4DC] overflow-hidden">
                  <div
                    className="h-full bg-[#0E6E5C] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Professor Mode Toggle */}
              <button
                onClick={() => setProfessorMode(!professorMode)}
                className={`px-4 py-3.5 rounded-2xl text-xs font-bold font-mono transition-all flex items-center gap-2 border cursor-pointer ${
                  professorMode
                    ? 'bg-[#FEF7EC] text-[#B7791F] border-[#F6E0B5] shadow-subtle'
                    : 'bg-[#FAFAF8] text-[#101418] border-[#E6E4DC] hover:border-[#101418]'
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
            <div className="mt-6 p-4 rounded-2xl bg-[#FEF7EC] border border-[#F6E0B5] text-[#7B4A12] text-xs font-mono space-y-1.5 animate-fadeIn">
              <div className="font-bold flex items-center gap-1.5 text-[#B7791F]">
                <span className="material-symbols-outlined text-sm">verified</span>
                Academic Alignment: Mumbai University Semester III Full Stack Java Programming (CS301)
              </div>
              <div className="text-[11px] text-[#7B4A12] font-sans leading-relaxed">
                This project covers 100% of prescribed practical topics across 6 core competency modules: Object-Oriented Architecture, Exception Recovery, Jakarta EE Servlets & JSPs, Client-Side JavaScript/DOM, React SPAs, and Spring Boot JDBC REST microservices.
              </div>
              <div className="pt-2 flex gap-4">
                <Link
                  to="/syllabus/coverage"
                  className="text-xs font-bold text-[#B7791F] underline hover:text-[#101418]"
                >
                  View Full Syllabus Coverage Matrix →
                </Link>
                <Link
                  to="/demo"
                  className="text-xs font-bold text-[#B7791F] underline hover:text-[#101418]"
                >
                  Launch 10-Minute Viva Presentation Flow →
                </Link>
              </div>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="mt-8 space-y-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C96A2] text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search syllabus experiments by topic, keyword (inheritance, JDBC, Servlet, React, REST)..."
                className="w-full pl-11 pr-4 py-3 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] placeholder:text-[#8C96A2] focus:outline-none focus:border-[#0E6E5C] shadow-subtle"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-[#101418] text-white shadow-subtle'
                      : 'bg-[#FAFAF8] text-[#5C6672] hover:text-[#101418] border border-[#E6E4DC]'
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
          <h2 className="text-lg font-bold text-[#101418] tracking-tight flex items-center gap-2 font-display">
            <span>Syllabus Practicals</span>
            <span className="text-xs font-mono text-[#5C6672] font-normal">
              ({filteredExperiments.length} matching)
            </span>
          </h2>

          <Link
            to="/syllabus/coverage"
            className="text-xs text-[#0E6E5C] hover:underline flex items-center gap-1 font-mono font-bold"
          >
            <span>Syllabus Coverage Map</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#5C6672] font-mono text-xs">
            Loading syllabus practicals...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((exp) => {
              const isExplored = exploredList.includes(exp.experimentNumber);
              return (
                <div
                  key={exp.id}
                  className="group p-6 rounded-2xl bg-white border border-[#E6E4DC] hover:border-[#101418] transition-all flex flex-col justify-between relative shadow-card hover:shadow-elevated"
                >
                  <div>
                    {/* Card Header: Experiment Number & Tech */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono font-bold text-[#0A4A3F] bg-[#EFF5F2] px-2.5 py-0.5 rounded border border-[#CFE0D8]">
                        Exp {exp.experimentNumber < 10 ? `0${exp.experimentNumber}` : exp.experimentNumber}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {exp.jvmVisualizable ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF5F2] text-[#0E6E5C] border border-[#CFE0D8] flex items-center gap-1 font-semibold">
                            <span className="material-symbols-outlined text-[11px]">check_circle</span>
                            JVM Visualizable
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAFAF8] text-[#5C6672] border border-[#E6E4DC]">
                            Interactive Demo
                          </span>
                        )}
                        {isExplored && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FEF7EC] text-[#B7791F] font-bold border border-[#F6E0B5]">
                            Explored
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#101418] group-hover:text-[#0E6E5C] transition-colors tracking-tight line-clamp-1 font-display">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-[#5C6672] mt-2 line-clamp-2 leading-relaxed font-normal">
                      {exp.description}
                    </p>

                    {/* Concepts Pills */}
                    {exp.concepts && exp.concepts.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {exp.concepts.slice(0, 3).map((concept, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAFAF8] text-[#5C6672] border border-[#E6E4DC]"
                          >
                            {concept}
                          </span>
                        ))}
                        {exp.concepts.length > 3 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md text-[#8C96A2]">
                            +{exp.concepts.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-5 mt-4 border-t border-[#E6E4DC] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#5C6672] font-semibold">
                      {exp.technology}
                    </span>
                    <button
                      onClick={() => {
                        markExplored(exp.experimentNumber);
                        navigate(`/syllabus/${exp.experimentNumber}`);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FAFAF8] group-hover:bg-[#101418] text-[#101418] group-hover:text-white border border-[#E6E4DC] transition-all flex items-center gap-1.5 cursor-pointer shadow-subtle"
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
          <div className="py-24 text-center rounded-2xl bg-white border border-[#E6E4DC] space-y-2 shadow-subtle">
            <span className="material-symbols-outlined text-4xl text-[#8C96A2]">search_off</span>
            <h3 className="text-sm font-bold text-[#101418] font-display">No syllabus practicals found</h3>
            <p className="text-xs text-[#5C6672]">
              No experiments matched your search query "{searchQuery}". Try searching for Java, Servlet, or React.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
