import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Exp01Demo({ experiment }) {
  const navigate = useNavigate();
  const [name, setName] = useState('Zaid');
  const [marks, setMarks] = useState(85);
  const [studentObject, setStudentObject] = useState(null);
  const [output, setOutput] = useState('');
  const [isCallingMethod, setIsCallingMethod] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    const newObj = {
      id: Math.floor(Math.random() * 900) + 100,
      className: 'Student',
      fields: {
        name: name,
        marks: parseInt(marks, 10) || 0,
      },
      createdAt: new Date().toLocaleTimeString(),
    };
    setStudentObject(newObj);
    setOutput(`Instance created: Student #${newObj.id} [name="${name}", marks=${marks}]`);
  };

  const handleDisplay = () => {
    if (!studentObject) return;
    setIsCallingMethod(true);
    setTimeout(() => {
      setOutput(`Output: ${studentObject.fields.name} : ${studentObject.fields.marks}`);
      setIsCallingMethod(false);
    }, 400);
  };

  const handleVisualize = () => {
    navigate('/visualizer', { state: { code: experiment?.code } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-canvas-border pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Interactive Blueprint & Object Instantiator</h3>
          <p className="text-xs text-slate-400">Instantiate the Student class and invoke instance member methods</p>
        </div>
        <button
          onClick={handleVisualize}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all"
        >
          <span className="material-symbols-outlined text-sm">visibility</span>
          Visualize in JVM VISION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creation Controls */}
        <div className="p-5 rounded-2xl bg-canvas-card border border-canvas-border space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-brand-blue">tune</span>
            Constructor Parameters
          </h4>

          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Student Name (String)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white focus:outline-none focus:border-brand-blue"
                placeholder="e.g. Zaid"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Marks (int)</label>
              <input
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white focus:outline-none focus:border-brand-blue"
                placeholder="e.g. 85"
              />
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-glow-sm flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                new Student("{name}", {marks})
              </button>
            </div>
          </form>

          {studentObject && (
            <div className="pt-4 border-t border-canvas-border">
              <label className="block text-xs font-medium text-slate-400 mb-2">Member Function Invocation</label>
              <button
                onClick={handleDisplay}
                disabled={isCallingMethod}
                className="w-full py-2 text-xs font-semibold rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">play_arrow</span>
                s.display()
              </button>
            </div>
          )}
        </div>

        {/* Runtime State Visualization */}
        <div className="p-5 rounded-2xl bg-canvas-card border border-canvas-border space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-sm text-brand-cyan">memory</span>
              Simulated Heap Allocation
            </h4>

            {studentObject ? (
              <div className="p-4 rounded-xl bg-slate-900 border border-blue-500/30 shadow-glow-sm relative animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-canvas-border">
                  <span className="text-xs font-mono font-bold text-brand-cyan">Object #{studentObject.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    class {studentObject.className}
                  </span>
                </div>
                <div className="pt-3 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between py-1 px-2 rounded bg-slate-800/60">
                    <span className="text-slate-400">name (String):</span>
                    <span className="text-emerald-400">"{studentObject.fields.name}"</span>
                  </div>
                  <div className="flex justify-between py-1 px-2 rounded bg-slate-800/60">
                    <span className="text-slate-400">marks (int):</span>
                    <span className="text-amber-400">{studentObject.fields.marks}</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-blue-400">arrow_right_alt</span>
                  Reference <code className="text-white">s</code> points to <code className="text-cyan-300">Object #{studentObject.id}</code>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center rounded-xl bg-slate-900/50 border border-dashed border-canvas-border text-slate-500 text-xs">
                No object created yet. Fill the parameters and click "new Student(...)".
              </div>
            )}
          </div>

          {/* Console Output */}
          <div className="pt-3 border-t border-canvas-border">
            <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">terminal</span> Console Output:
            </div>
            <div className="p-2.5 rounded-lg bg-black/60 font-mono text-xs text-emerald-400 border border-slate-800 min-h-[36px]">
              {output || 'Ready.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
