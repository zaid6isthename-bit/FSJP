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
      <div className="border-b border-[#E6E4DC] pb-4">
        <h3 className="text-base font-bold text-[#101418] font-display">JSP Implicit Objects Inspector</h3>
        <p className="text-xs text-[#5C6672]">
          Inspect the 9 container-instantiated implicit objects automatically available in every JSP scriptlet and expression
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Object Selector */}
        <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] px-2 mb-2 font-bold font-display">Implicit Objects</h4>
          {jspObjects.map((obj) => (
            <button
              key={obj.name}
              onClick={() => setSelectedObject(obj.name)}
              className={`w-full p-2.5 rounded-xl text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer border ${
                selectedObject === obj.name
                  ? 'bg-[#EFF5F2] text-[#0A4A3F] border-2 border-[#0E6E5C] font-bold shadow-subtle'
                  : 'bg-white text-[#5C6672] border-[#E6E4DC] hover:text-[#101418]'
              }`}
            >
              <span>{obj.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAFAF8] text-[#5C6672] border border-[#E6E4DC] font-sans font-semibold">
                {obj.scope}
              </span>
            </button>
          ))}
        </div>

        {/* Object Details & Live State */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DC] flex-wrap gap-2">
            <div>
              <span className="text-base font-mono font-bold text-[#0E6E5C]">{currentObj.name}</span>
              <span className="ml-2 text-xs font-mono text-[#5C6672]">({currentObj.scope})</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-[#101418] border border-[#E6E4DC] font-semibold">
              {currentObj.type}
            </span>
          </div>

          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] mb-1 font-bold font-display">Architectural Role</h5>
            <p className="text-xs text-[#101418] leading-relaxed font-medium">{currentObj.purpose}</p>
          </div>

          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] mb-2 font-bold font-display">Simulated Runtime State</h5>
            <div className="p-4 rounded-xl bg-white border border-[#E6E4DC] font-mono text-xs space-y-2 shadow-subtle">
              {Object.entries(currentObj.liveState).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1 px-2.5 rounded bg-[#FAFAF8] border border-[#EFEEE8]">
                  <span className="text-[#5C6672]">{key}:</span>
                  <span className="text-[#0E6E5C] font-bold">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
