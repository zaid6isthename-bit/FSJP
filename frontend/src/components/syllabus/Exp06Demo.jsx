import React, { useState } from 'react';

export default function Exp06Demo() {
  const [selectedObject, setSelectedObject] = useState('request');

  const jspObjects = [
    {
      name: 'request',
      type: 'jakarta.servlet.http.HttpServletRequest',
      scope: 'Request Scope',
      purpose: 'Contains HTTP headers, query parameters, cookies, and client IP info.',
      liveState: {
        method: 'GET',
        protocol: 'HTTP/1.1',
        remoteAddr: '127.0.0.1',
        queryString: 'user=zaid&sem=3',
        headerUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    },
    {
      name: 'response',
      type: 'jakarta.servlet.http.HttpServletResponse',
      scope: 'Page Scope',
      purpose: 'Assists in sending HTTP status codes, headers, cookies, and redirects back to the client.',
      liveState: {
        statusCode: 200,
        statusMessage: 'OK',
        contentType: 'text/html;charset=UTF-8',
        isCommitted: false,
      },
    },
    {
      name: 'session',
      type: 'jakarta.servlet.http.HttpSession',
      scope: 'Session Scope',
      purpose: 'Persists student user authentication and cart/state across multiple page navigations.',
      liveState: {
        id: 'JSESSIONID_99A2B44FE01',
        isNew: false,
        creationTime: new Date(Date.now() - 360000).toLocaleTimeString(),
        lastAccessed: new Date().toLocaleTimeString(),
        maxInactiveInterval: '1800 seconds (30 mins)',
      },
    },
    {
      name: 'application',
      type: 'jakarta.servlet.ServletContext',
      scope: 'Application Scope',
      purpose: 'Shared across all active users in the entire web application container.',
      liveState: {
        serverInfo: 'Apache Tomcat/10.1.20',
        contextPath: '/jvmvision',
        activeUserCount: 14,
        appGlobalVersion: 'v1.0-release',
      },
    },
    {
      name: 'out',
      type: 'jakarta.servlet.jsp.JspWriter',
      scope: 'Page Scope',
      purpose: 'Buffered character output stream writing directly into the client HTTP response body.',
      liveState: {
        bufferSize: '8192 bytes (8 KB)',
        remainingBuffer: '6420 bytes',
        autoFlush: true,
      },
    },
    {
      name: 'config',
      type: 'jakarta.servlet.ServletConfig',
      scope: 'Page Scope',
      purpose: 'Retrieves initialization parameters defined in web.xml or @WebServlet annotations.',
      liveState: {
        servletName: 'DashboardJspServlet',
        initParameters: '{ debugMode: true, maxTimeout: 5000 }',
      },
    },
  ];

  const currentObj = jspObjects.find((o) => o.name === selectedObject) || jspObjects[0];

  return (
    <div className="space-y-6">
      <div className="border-b border-canvas-border pb-4">
        <h3 className="text-base font-semibold text-white">JSP Implicit Objects Inspector</h3>
        <p className="text-xs text-slate-400">
          Inspect the 9 container-instantiated implicit objects automatically available in every JSP scriptlet and expression
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Object Selector */}
        <div className="p-4 rounded-2xl bg-canvas-card border border-canvas-border space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 px-2 mb-2">Implicit Objects</h4>
          {jspObjects.map((obj) => (
            <button
              key={obj.name}
              onClick={() => setSelectedObject(obj.name)}
              className={`w-full p-2.5 rounded-xl text-left font-mono text-xs transition-all flex items-center justify-between ${
                selectedObject === obj.name
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold shadow-glow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span>{obj.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-sans">
                {obj.scope}
              </span>
            </button>
          ))}
        </div>

        {/* Object Details & Live State */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-canvas-card border border-canvas-border space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-canvas-border">
            <div>
              <span className="text-base font-mono font-bold text-brand-cyan">{currentObj.name}</span>
              <span className="ml-2 text-xs font-mono text-slate-400">({currentObj.scope})</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {currentObj.type}
            </span>
          </div>

          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Architectural Role</h5>
            <p className="text-xs text-slate-300 leading-relaxed">{currentObj.purpose}</p>
          </div>

          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Simulated Runtime State</h5>
            <div className="p-4 rounded-xl bg-slate-900 border border-canvas-border font-mono text-xs space-y-2">
              {Object.entries(currentObj.liveState).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1 px-2 rounded bg-slate-800/40">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-emerald-400 font-semibold">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
