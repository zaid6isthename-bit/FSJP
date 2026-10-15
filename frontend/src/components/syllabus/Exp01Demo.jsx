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
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E6E4DC] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#101418] font-display">Interactive Blueprint & Object Instantiator</h3>
          <p className="text-xs text-[#5C6672]">Instantiate the Student class and invoke instance member methods</p>
        </div>
        <button
          onClick={handleVisualize}
          className="flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FAFAF8] text-[#0E6E5C] border border-[#CFE0D8] transition-all shadow-subtle cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm text-[#0E6E5C]">visibility</span>
          Visualize in JVM VISION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creation Controls */}
        <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] flex items-center gap-2 font-bold font-display">
            <span className="material-symbols-outlined text-sm text-[#0E6E5C]">tune</span>
            Constructor Parameters
          </h4>

          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#101418] mb-1">Student Name (String)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:outline-none focus:border-[#0E6E5C] shadow-subtle font-medium"
                placeholder="e.g. Zaid"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#101418] mb-1">Marks (int)</label>
              <input
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:outline-none focus:border-[#0E6E5C] shadow-subtle font-medium"
                placeholder="e.g. 85"
              />
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#0E6E5C] hover:bg-[#0A4A3F] text-white transition-all shadow-subtle flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                new Student("{name}", {marks})
              </button>
            </div>
          </form>

          {studentObject && (
            <div className="pt-4 border-t border-[#E6E4DC]">
              <label className="block text-xs font-bold text-[#5C6672] mb-2 font-display">Member Function Invocation</label>
              <button
                onClick={handleDisplay}
                disabled={isCallingMethod}
                className="w-full py-2.5 text-xs font-bold rounded-xl bg-white text-[#101418] border border-[#E6E4DC] hover:bg-[#101418] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-subtle"
              >
                <span className="material-symbols-outlined text-sm">play_arrow</span>
                s.display()
              </button>
            </div>
          )}
        </div>

        {/* Runtime State Visualization */}
        <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] flex items-center gap-2 mb-3 font-bold font-display">
              <span className="material-symbols-outlined text-sm text-[#0E6E5C]">memory</span>
              Simulated Heap Allocation
            </h4>

            {studentObject ? (
              <div className="p-4 rounded-xl bg-white border-2 border-[#0E6E5C] shadow-card relative animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-[#E6E4DC]">
                  <span className="text-xs font-mono font-bold text-[#0E6E5C]">Object #{studentObject.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF5F2] text-[#0A4A3F] font-bold">
                    class {studentObject.className}
                  </span>
                </div>
                <div className="pt-3 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between py-1 px-2 rounded bg-[#FAFAF8] border border-[#E6E4DC]">
                    <span className="text-[#5C6672]">name (String):</span>
                    <span className="text-[#101418] font-bold">"{studentObject.fields.name}"</span>
                  </div>
                  <div className="flex justify-between py-1 px-2 rounded bg-[#FAFAF8] border border-[#E6E4DC]">
                    <span className="text-[#5C6672]">marks (int):</span>
                    <span className="text-[#B7791F] font-bold">{studentObject.fields.marks}</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-[#E6E4DC] text-[11px] text-[#5C6672] flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs text-[#0E6E5C]">arrow_right_alt</span>
                  Reference <code className="text-[#101418] font-bold">s</code> points to <code className="text-[#0E6E5C] font-bold">Object #{studentObject.id}</code>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center rounded-xl bg-white border border-dashed border-[#E6E4DC] text-[#8C96A2] text-xs">
                No object created yet. Fill the parameters and click "new Student(...)".
              </div>
            )}
          </div>

          {/* Console Output */}
          <div className="pt-3 border-t border-[#E6E4DC]">
            <div className="text-[11px] font-mono text-[#5C6672] mb-1 flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-xs">terminal</span> Console Output:
            </div>
            <div className="p-2.5 rounded-lg bg-white font-mono text-xs text-[#101418] border border-[#E6E4DC] min-h-[36px] font-semibold">
              {output || 'Ready.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
