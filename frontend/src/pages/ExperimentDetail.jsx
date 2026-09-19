import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// Specialized Demos
import Exp01Demo from '../components/syllabus/Exp01Demo';
import Exp02Demo from '../components/syllabus/Exp02Demo';
import Exp03Demo from '../components/syllabus/Exp03Demo';
import Exp04Demo from '../components/syllabus/Exp04Demo';
import Exp05Demo from '../components/syllabus/Exp05Demo';
import Exp06Demo from '../components/syllabus/Exp06Demo';
import Exp07Demo from '../components/syllabus/Exp07Demo';
import Exp08Demo from '../components/syllabus/Exp08Demo';
import Exp09Demo from '../components/syllabus/Exp09Demo';
import Exp10Demo from '../components/syllabus/Exp10Demo';
import Exp11Demo from '../components/syllabus/Exp11Demo';
import Exp12Demo from '../components/syllabus/Exp12Demo';
import Exp13Demo from '../components/syllabus/Exp13Demo';

export default function ExperimentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('demo');
  const [viewMode, setViewMode] = useState('beginner'); // beginner vs technical
  const [selectedLine, setSelectedLine] = useState(null);

  const routeMap = {
    '/syllabus/java/classes-objects': '1',
    '/syllabus/java/overloading': '2',
    '/syllabus/java/inheritance-exceptions': '3',
    '/syllabus/servlets/generic-http': '4',
    '/syllabus/jsp/jdbc-login': '5',
    '/syllabus/jsp/objects': '6',
    '/syllabus/web/html-css-js': '7',
    '/syllabus/javascript/email-validation': '8',
    '/syllabus/javascript/dom-background': '9',
    '/syllabus/react/hooks-colors': '10',
    '/syllabus/react/spa': '11',
    '/syllabus/spring/monolith': '12',
    '/syllabus/spring/rest': '13',
  };

  useEffect(() => {
    async function loadExperiment() {
      setLoading(true);
      const targetId = id || routeMap[window.location.pathname] || '1';
      const res = await api.getSyllabusExperimentById(targetId);
      if (res.success && res.data) {
        setExperiment(res.data);
      }
      setLoading(false);
    }
    loadExperiment();
  }, [id]);

  const handleVisualize = () => {
    if (!experiment) return;
    navigate('/visualizer', { state: { code: experiment.code } });
  };

  const renderDemoComponent = (num) => {
    switch (num) {
      case 1:
        return <Exp01Demo experiment={experiment} />;
      case 2:
        return <Exp02Demo experiment={experiment} />;
      case 3:
        return <Exp03Demo experiment={experiment} />;
      case 4:
        return <Exp04Demo />;
      case 5:
        return <Exp05Demo />;
      case 6:
        return <Exp06Demo />;
      case 7:
        return <Exp07Demo />;
      case 8:
        return <Exp08Demo />;
      case 9:
        return <Exp09Demo />;
      case 10:
        return <Exp10Demo />;
      case 11:
        return <Exp11Demo />;
      case 12:
        return <Exp12Demo />;
      case 13:
        return <Exp13Demo />;
      default:
        return (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            Interactive demo ready for experiment #{num}.
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-slate-300 flex items-center justify-center font-mono text-xs">
        Loading experiment details...
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-slate-300 flex flex-col items-center justify-center gap-4">
        <h2 className="text-lg font-bold text-white">Syllabus Experiment Not Found</h2>
        <Link to="/syllabus" className="text-xs text-blue-400 hover:underline">
          ← Return to Syllabus Map
        </Link>
      </div>
    );
  }

  const expNum = experiment.experimentNumber;
  const lines = experiment.code ? experiment.code.split('\n') : [];

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 pb-20">
      {/* Header Bar */}
      <div className="border-b border-canvas-border bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          <div className="flex items-center gap-2 mb-3">
            <Link
              to="/syllabus"
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Syllabus Lab
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-brand-cyan">
              Experiment {expNum < 10 ? `0${expNum}` : expNum}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-brand-cyan border border-blue-500/20 font-bold">
                  EXP {expNum < 10 ? `0${expNum}` : expNum}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {experiment.technology}
                </span>
                {experiment.jvmVisualizable ? (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    ✓ JVM Visualizable
                  </span>
                ) : (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Interactive Demo
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {experiment.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                {experiment.description}
              </p>
            </div>

            {/* Top Actions */}
            <div className="flex items-center gap-3">
              {/* Beginner vs Technical View Toggle */}
              <div className="p-1 rounded-xl bg-slate-900 border border-canvas-border flex">
                <button
                  onClick={() => setViewMode('beginner')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    viewMode === 'beginner'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Beginner
                </button>
                <button
                  onClick={() => setViewMode('technical')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    viewMode === 'technical'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Technical
                </button>
              </div>

              {experiment.jvmVisualizable && (
                <button
                  onClick={handleVisualize}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-glow-sm hover:shadow-glow-md transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Visualize in JVM VISION
                </button>
              )}
            </div>
          </div>

          {/* 5 Standard Tabs */}
          <div className="flex gap-2 mt-6 border-b border-canvas-border -mb-6">
            {[
              { id: 'demo', label: 'Interactive Demo', icon: 'smart_toy' },
              { id: 'code', label: 'Source Code', icon: 'code' },
              { id: 'execution', label: 'Execution & Memory', icon: 'timeline' },
              { id: 'concept', label: 'Concept Guide', icon: 'menu_book' },
              { id: 'syllabus', label: 'Syllabus Alignment', icon: 'school' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs font-mono transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-brand-cyan text-brand-cyan font-bold bg-white/[0.02]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Mode Indicator Banner */}
        <div className="mb-6 p-3 rounded-xl bg-canvas-card border border-canvas-border text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="material-symbols-outlined text-sm text-brand-blue">info</span>
            {viewMode === 'beginner' ? (
              <span>
                <strong>Beginner View Active:</strong> Simplified descriptions, clear analogies, and guided explanations.
              </span>
            ) : (
              <span>
                <strong>Technical View Active:</strong> JVM activation records, heap dereferencing, RFC protocol semantics, and byte-level details.
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            University of Mumbai · Sem III Lab
          </span>
        </div>

        {/* Tab 1: Interactive Demo */}
        {activeTab === 'demo' && (
          <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border">
            {renderDemoComponent(expNum)}
          </div>
        )}

        {/* Tab 2: Code with Clickable Line Explanations */}
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-canvas-card border border-canvas-border space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-canvas-border text-slate-400">
                <span>{experiment.title} ({experiment.language})</span>
                <span className="text-[11px]">Click any line to inspect its architectural purpose</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody>
                    {lines.map((line, idx) => (
                      <tr
                        key={idx}
                        onClick={() => setSelectedLine({ index: idx + 1, content: line })}
                        className={`cursor-pointer transition-colors ${
                          selectedLine?.index === idx + 1
                            ? 'bg-blue-600/30 text-cyan-200'
                            : 'hover:bg-slate-900/60 text-slate-300'
                        }`}
                      >
                        <td className="w-10 py-1 pr-3 text-right text-slate-600 select-none font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-1 pl-2 font-mono text-xs whitespace-pre">
                          {line || ' '}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Line Explanation Sidebar */}
            <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-brand-cyan">lightbulb</span>
                Line-by-Line Inspector
              </h4>
              {selectedLine ? (
                <div className="p-4 rounded-xl bg-slate-900 border border-canvas-border font-mono text-xs space-y-3 animate-fadeIn">
                  <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1">
                    Line {selectedLine.index}
                  </div>
                  <pre className="text-slate-300 text-[11px] whitespace-pre-wrap">
                    {selectedLine.content}
                  </pre>
                  <div className="text-xs font-sans text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                    {selectedLine.content.includes('class ') &&
                      'Defines a class template blueprint. Memory is not allocated until instances are created with the new keyword.'}
                    {selectedLine.content.includes('new ') &&
                      'Allocates dynamic memory on the Heap for this object and invokes its constructor.'}
                    {selectedLine.content.includes('void ') &&
                      'Declares a member method that returns no explicit value to its caller.'}
                    {selectedLine.content.includes('System.out.println') &&
                      'Dispatches string output to the standard stdout stream.'}
                    {selectedLine.content.includes('try') &&
                      'Defines a guarded block of statements where runtime exceptions are monitored and intercepted.'}
                    {selectedLine.content.includes('catch') &&
                      'Catches and handles the specified exception class without aborting host execution.'}
                    {!selectedLine.content.includes('class ') &&
                      !selectedLine.content.includes('new ') &&
                      !selectedLine.content.includes('void ') &&
                      !selectedLine.content.includes('System.out') &&
                      !selectedLine.content.includes('try') &&
                      !selectedLine.content.includes('catch') &&
                      'Standard statement execution updating frame state or branch evaluation.'}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 font-mono text-xs rounded-xl bg-slate-900/50 border border-dashed border-canvas-border">
                  Click any line on the left to inspect its role.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Execution & Memory */}
        {activeTab === 'execution' && (
          <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border space-y-6">
            <h3 className="text-base font-bold text-white">Execution Lifecycle & State Transitions</h3>
            <div className="p-4 rounded-xl bg-slate-900 border border-canvas-border font-mono text-xs space-y-2">
              <div className="text-cyan-400 font-bold">1. Aim of the Practical:</div>
              <p className="text-slate-300 font-sans">{experiment.aim}</p>
              <div className="text-emerald-400 font-bold pt-2">2. Expected Standard Output:</div>
              <pre className="p-3 rounded-lg bg-black/60 text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                {experiment.expectedOutput}
              </pre>
            </div>
            {experiment.jvmVisualizable && (
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">Live JVM Execution Supported</h4>
                  <p className="text-xs text-slate-400">
                    This program can be simulated directly in JVM VISION to inspect real stack frames, variables, and heap objects.
                  </p>
                </div>
                <button
                  onClick={handleVisualize}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-glow-sm transition-all"
                >
                  Launch in Visualizer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Concept Guide */}
        {activeTab === 'concept' && (
          <div className="p-8 rounded-2xl bg-canvas-card border border-canvas-border space-y-6 leading-relaxed">
            <h3 className="text-lg font-bold text-white">Conceptual Overview: {experiment.title}</h3>
            
            <div className="space-y-4 text-xs text-slate-300">
              <p>
                {viewMode === 'beginner'
                  ? `In simple terms, ${experiment.title} teaches you the foundational building blocks of modern full-stack development. It ensures you understand how data flows between different layers of software.`
                  : `From an architectural perspective, ${experiment.title} emphasizes strict adherence to industry design patterns, separation of concerns, and structured execution runtime guarantees.`}
              </p>

              <h4 className="font-bold text-white text-sm pt-2">Prescribed Learning Outcomes:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                {experiment.concepts &&
                  experiment.concepts.map((concept, i) => (
                    <li key={i}>
                      <strong className="text-slate-200">{concept}:</strong> Essential competency requirement for Mumbai University Sem III.
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 5: Syllabus Alignment */}
        {activeTab === 'syllabus' && (
          <div className="p-8 rounded-2xl bg-canvas-card border border-canvas-border space-y-6 font-mono text-xs">
            <h3 className="text-base font-bold text-white font-sans">
              Mumbai University Syllabus Alignment Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-canvas-border">
                <span className="text-slate-400">Course Code:</span>
                <div className="text-white font-bold mt-1">CS301 (Full Stack Java Programming)</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-canvas-border">
                <span className="text-slate-400">Semester / Academic Year:</span>
                <div className="text-white font-bold mt-1">Semester III · University of Mumbai</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-canvas-border">
                <span className="text-slate-400">Experiment Identifier:</span>
                <div className="text-cyan-400 font-bold mt-1">Practical #{expNum}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-canvas-border">
                <span className="text-slate-400">Primary Technology Stack:</span>
                <div className="text-emerald-400 font-bold mt-1">{experiment.technology}</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
