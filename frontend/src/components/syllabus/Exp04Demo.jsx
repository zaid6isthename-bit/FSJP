import React, { useState } from 'react';

export default function Exp04Demo() {
  const [method, setMethod] = useState('GET');
  const [studentName, setStudentName] = useState('Zaid');
  const [course, setCourse] = useState('Full Stack Java Programming');
  const [activeStep, setActiveStep] = useState(0);
  const [response, setResponse] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateRequest = () => {
    setIsSimulating(true);
    setActiveStep(1); // Browser sends request
    setResponse(null);

    setTimeout(() => {
      setActiveStep(2); // Servlet Container routes request
    }, 400);

    setTimeout(() => {
      setActiveStep(3); // HttpServlet executes doGet / doPost
    }, 800);

    setTimeout(() => {
      setActiveStep(4); // Response returned
      setIsSimulating(false);
      if (method === 'GET') {
        setResponse({
          status: '200 OK',
          contentType: 'text/html',
          body: `<html><body><h1>Welcome, ${studentName || 'Guest'}</h1><p>Processed by StudentServlet.doGet()</p></body></html>`,
        });
      } else {
        setResponse({
          status: '201 Created',
          contentType: 'application/json',
          body: JSON.stringify({ message: `Enrolled student '${studentName}' into '${course}'`, method: 'doPost()' }, null, 2),
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-canvas-border pb-4">
        <h3 className="text-base font-semibold text-white">Servlet Container & HTTP Request Simulator</h3>
        <p className="text-xs text-slate-400">
          Visualize how Jakarta Servlet containers dispatch requests to GenericServlet (service()) and HttpServlet (doGet() / doPost())
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Configuration */}
        <div className="p-5 rounded-2xl bg-canvas-card border border-canvas-border space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-brand-blue">http</span>
            HTTP Request Constructor
          </h4>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMethod('GET')}
              className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                method === 'GET'
                  ? 'bg-blue-600 text-white shadow-glow-sm'
                  : 'bg-slate-900 text-slate-400 border border-canvas-border'
              }`}
            >
              GET Request (doGet)
            </button>
            <button
              type="button"
              onClick={() => setMethod('POST')}
              className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                method === 'POST'
                  ? 'bg-emerald-600 text-white shadow-glow-sm'
                  : 'bg-slate-900 text-slate-400 border border-canvas-border'
              }`}
            >
              POST Request (doPost)
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Target Endpoint URL</label>
              <div className="px-3 py-2 rounded-xl bg-slate-900 border border-canvas-border text-cyan-400">
                http://localhost:8080/StudentServlet
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Parameter: name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
              />
            </div>

            {method === 'POST' && (
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Parameter: course</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
                />
              </div>
            )}

            <button
              onClick={simulateRequest}
              disabled={isSimulating}
              className="w-full py-2.5 rounded-xl font-sans font-semibold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-glow-sm transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Dispatch HTTP {method} to Servlet
            </button>
          </div>
        </div>

        {/* Lifecycle Flow Pipeline */}
        <div className="p-5 rounded-2xl bg-canvas-card border border-canvas-border space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-brand-cyan">alt_route</span>
            Servlet Lifecycle Pipeline
          </h4>

          <div className="space-y-2.5 font-mono text-xs">
            {[
              { step: 1, label: 'Client (Browser)', desc: `Sends HTTP ${method} to /StudentServlet` },
              { step: 2, label: 'Servlet Container (Tomcat / Jetty)', desc: 'Inspects web.xml / @WebServlet mapping' },
              { step: 3, label: 'HttpServlet Dispatcher', desc: `service() dispatches to ${method === 'GET' ? 'doGet()' : 'doPost()'}` },
              { step: 4, label: 'Response Generated', desc: 'Streams HTML/JSON back to client connection' },
            ].map((item) => (
              <div
                key={item.step}
                className={`p-3 rounded-xl border transition-all ${
                  activeStep === item.step
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 shadow-glow-sm'
                    : activeStep > item.step
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{item.step}. {item.label}</span>
                  {activeStep === item.step && <span className="text-[10px] text-blue-400 animate-pulse">PROCESSING</span>}
                  {activeStep > item.step && <span className="text-[10px] text-emerald-400">DONE</span>}
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>

          {response && (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 font-mono text-xs space-y-1.5 animate-fadeIn">
              <div className="flex justify-between text-emerald-400 font-bold border-b border-slate-800 pb-1">
                <span>Status: {response.status}</span>
                <span>{response.contentType}</span>
              </div>
              <pre className="text-slate-300 text-[11px] overflow-x-auto whitespace-pre-wrap pt-1">
                {response.body}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
