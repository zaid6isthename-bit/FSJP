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
          <div className="p-8 text-center text-[#5C6672] font-mono text-xs">
            Interactive demo ready for experiment #{num}.
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-[#5C6672] flex items-center justify-center font-mono text-xs">
        Loading experiment details...
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-[#5C6672] flex flex-col items-center justify-center gap-4">
        <h2 className="text-lg font-bold text-[#101418] font-display">Syllabus Experiment Not Found</h2>
        <Link to="/syllabus" className="text-xs text-[#0E6E5C] hover:underline font-bold">
          ← Return to Syllabus Map
        </Link>
      </div>
    );
  }

  const expNum = experiment.experimentNumber;
  const lines = experiment.code ? experiment.code.split('\n') : [];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#101418] pb-20">
      {/* Header Bar */}
      <div className="border-b border-[#E6E4DC] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          <div className="flex items-center gap-2 mb-3">
            <Link
              to="/syllabus"
              className="text-xs font-mono text-[#5C6672] hover:text-[#101418] flex items-center gap-1 font-semibold"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Syllabus Lab
            </Link>
            <span className="text-[#8C96A2]">/</span>
            <span className="text-xs font-mono text-[#0E6E5C] font-bold">
              Experiment {expNum < 10 ? `0${expNum}` : expNum}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8] font-bold">
                  EXP {expNum < 10 ? `0${expNum}` : expNum}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FAFAF8] text-[#5C6672] border border-[#E6E4DC]">
                  {experiment.technology}
                </span>
                {experiment.jvmVisualizable ? (
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-[#EFF5F2] text-[#0E6E5C] border border-[#CFE0D8] flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    ✓ JVM Visualizable
                  </span>
                ) : (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAFAF8] text-[#5C6672] border border-[#E6E4DC]">
                    Interactive Demo
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#101418] tracking-tight font-display">
                {experiment.title}
              </h1>
              <p className="text-xs text-[#5C6672] mt-1 max-w-3xl leading-relaxed">
                {experiment.description}
              </p>
            </div>

            {/* Top Actions */}
            <div className="flex items-center gap-3">
              {/* Beginner vs Technical View Toggle */}
              <div className="p-1 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC] flex shadow-subtle">
                <button
                  onClick={() => setViewMode('beginner')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    viewMode === 'beginner'
                      ? 'bg-[#101418] text-white shadow-subtle'
                      : 'text-[#5C6672] hover:text-[#101418]'
                  }`}
                >
                  Beginner
                </button>
                <button
                  onClick={() => setViewMode('technical')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    viewMode === 'technical'
                      ? 'bg-[#101418] text-white shadow-subtle'
                      : 'text-[#5C6672] hover:text-[#101418]'
                  }`}
                >
                  Technical
                </button>
              </div>

              {experiment.jvmVisualizable && (
                <button
                  onClick={handleVisualize}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0E6E5C] hover:bg-[#0A4A3F] text-white shadow-subtle transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Visualize in JVM VISION
                </button>
              )}
            </div>
          </div>

          {/* 5 Standard Tabs */}
          <div className="flex gap-2 mt-6 border-b border-[#E6E4DC] -mb-6">
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
                className={`px-4 py-2.5 text-xs font-mono transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#0E6E5C] text-[#0E6E5C] font-bold bg-[#EFF5F2]'
                    : 'border-transparent text-[#5C6672] hover:text-[#101418]'
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
        <div className="mb-6 p-3 rounded-xl bg-white border border-[#E6E4DC] text-xs flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-2 text-[#101418]">
            <span className="material-symbols-outlined text-sm text-[#0E6E5C]">info</span>
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
          <span className="text-[11px] font-mono text-[#8C96A2]">
            University of Mumbai · Sem III Lab
          </span>
        </div>

        {/* Tab 1: Interactive Demo */}
        {activeTab === 'demo' && (
          <div className="p-6 rounded-2xl bg-white border border-[#E6E4DC] shadow-card">
            {renderDemoComponent(expNum)}
          </div>
        )}

        {/* Tab 2: Code with Clickable Line Explanations */}
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-[#E6E4DC] space-y-3 font-mono text-xs shadow-card">
              <div className="flex items-center justify-between pb-2 border-b border-[#E6E4DC] text-[#5C6672]">
                <span className="font-bold text-[#101418]">{experiment.title} ({experiment.language})</span>
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
                            ? 'bg-[#EFF5F2] text-[#0A4A3F] font-bold'
                            : 'hover:bg-[#FAFAF8] text-[#101418]'
                        }`}
                      >
                        <td className="w-10 py-1 pr-3 text-right text-[#8C96A2] select-none font-mono text-[11px]">
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
            <div className="p-6 rounded-2xl bg-white border border-[#E6E4DC] space-y-4 shadow-card">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] flex items-center gap-2 font-bold font-display">
                <span className="material-symbols-outlined text-sm text-[#0E6E5C]">lightbulb</span>
                Line-by-Line Inspector
              </h4>
              {selectedLine ? (
                <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC] font-mono text-xs space-y-3 animate-fadeIn">
                  <div className="text-[#0E6E5C] font-bold border-b border-[#E6E4DC] pb-1">
                    Line {selectedLine.index}
                  </div>
                  <pre className="text-[#101418] text-[11px] whitespace-pre-wrap font-semibold">
                    {selectedLine.content}
                  </pre>
                  <div className="text-xs font-sans text-[#5C6672] leading-relaxed pt-2 border-t border-[#E6E4DC]">
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
                <div className="py-12 text-center text-[#8C96A2] font-mono text-xs rounded-xl bg-[#FAFAF8] border border-dashed border-[#E6E4DC]">
                  Click any line on the left to inspect its role.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Execution & Memory */}
        {activeTab === 'execution' && (
          <div className="p-6 rounded-2xl bg-white border border-[#E6E4DC] space-y-6 shadow-card">
            <h3 className="text-base font-bold text-[#101418] font-display">Execution Lifecycle & State Transitions</h3>
            <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC] font-mono text-xs space-y-2">
              <div className="text-[#0E6E5C] font-bold">1. Aim of the Practical:</div>
              <p className="text-[#101418] font-sans font-medium">{experiment.aim}</p>
              <div className="text-[#0E6E5C] font-bold pt-2">2. Expected Standard Output:</div>
              <pre className="p-3 rounded-lg bg-white border border-[#E6E4DC] text-[#101418] overflow-x-auto whitespace-pre-wrap font-semibold">
                {experiment.expectedOutput}
              </pre>
            </div>
            {experiment.jvmVisualizable && (
              <div className="p-4 rounded-xl bg-[#EFF5F2] border border-[#CFE0D8] flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#0A4A3F] font-mono">Live JVM Execution Supported</h4>
                  <p className="text-xs text-[#5C6672]">
                    This program can be simulated directly in JVM VISION to inspect real stack frames, variables, and heap objects.
                  </p>
                </div>
                <button
                  onClick={handleVisualize}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0E6E5C] hover:bg-[#0A4A3F] text-white shadow-subtle transition-all cursor-pointer"
                >
                  Launch in Visualizer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Concept Guide */}
        {activeTab === 'concept' && (
          <div className="p-8 rounded-2xl bg-white border border-[#E6E4DC] space-y-6 leading-relaxed shadow-card">
            <h3 className="text-lg font-bold text-[#101418] font-display">Conceptual Overview: {experiment.title}</h3>
            
            <div className="space-y-4 text-xs text-[#5C6672]">
              <p className="text-[#101418] leading-relaxed font-normal">
                {viewMode === 'beginner'
                  ? `In simple terms, ${experiment.title} teaches you the foundational building blocks of modern full-stack development. It ensures you understand how data flows between different layers of software.`
                  : `From an architectural perspective, ${experiment.title} emphasizes strict adherence to industry design patterns, separation of concerns, and structured execution runtime guarantees.`}
              </p>

              <h4 className="font-bold text-[#101418] text-sm pt-2 font-display">Prescribed Learning Outcomes:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-[#5C6672]">
                {experiment.concepts &&
                  experiment.concepts.map((concept, i) => (
                    <li key={i}>
                      <strong className="text-[#101418]">{concept}:</strong> Essential competency requirement for Mumbai University Sem III.
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 5: Syllabus Alignment */}
        {activeTab === 'syllabus' && (
          <div className="p-8 rounded-2xl bg-white border border-[#E6E4DC] space-y-6 font-mono text-xs shadow-card">
            <h3 className="text-base font-bold text-[#101418] font-display">
              Mumbai University Syllabus Alignment Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC]">
                <span className="text-[#5C6672] font-sans">Course Code:</span>
                <div className="text-[#101418] font-bold mt-1">CS301 (Full Stack Java Programming)</div>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC]">
                <span className="text-[#5C6672] font-sans">Semester / Academic Year:</span>
                <div className="text-[#101418] font-bold mt-1">Semester III · University of Mumbai</div>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC]">
                <span className="text-[#5C6672] font-sans">Experiment Identifier:</span>
                <div className="text-[#0E6E5C] font-bold mt-1">Practical #{expNum}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC]">
                <span className="text-[#5C6672] font-sans">Primary Technology Stack:</span>
                <div className="text-[#101418] font-bold mt-1">{experiment.technology}</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
