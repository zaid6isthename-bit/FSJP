import React, { useState } from 'react';
import { api } from '../../services/api';

export default function Exp13Demo() {
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/api/books');
  const [requestBody, setRequestBody] = useState('{\n  "title": "Spring in Action",\n  "author": "Craig Walls",\n  "price": 550.0\n}');
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState(null);
  const [responseJson, setResponseJson] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseHeaders(null);
    setResponseJson(null);

    const startTime = performance.now();
    try {
      let res;
      if (method === 'GET') {
        if (endpoint === '/api/books') {
          res = await api.getBooks();
        } else {
          const id = endpoint.split('/').pop();
          res = await api.getBookById(id);
        }
      } else if (method === 'POST') {
        const payload = JSON.parse(requestBody);
        res = await api.createBook(payload);
      } else if (method === 'PUT') {
        const id = endpoint.split('/').pop();
        const payload = JSON.parse(requestBody);
        res = await api.updateBook(id, payload);
      } else if (method === 'DELETE') {
        const id = endpoint.split('/').pop();
        res = await api.deleteBook(id);
      }

      const elapsed = Math.round(performance.now() - startTime);
      setResponseStatus({
        code: res.success ? (method === 'POST' ? '201 Created' : '200 OK') : '404 Not Found',
        time: `${elapsed}ms`,
        ok: res.success,
      });
      setResponseHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Powered-By': 'Spring Boot 3.2',
        Server: 'Apache Tomcat/10.1.20',
      });
      setResponseJson(res);
    } catch (err) {
      setResponseStatus({ code: '400 Bad Request', time: '10ms', ok: false });
      setResponseJson({ error: err.message });
    }
    setLoading(false);
  };

  const setPreset = (m, ep, body = '') => {
    setMethod(m);
    setEndpoint(ep);
    if (body) setRequestBody(body);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-canvas-border pb-4">
        <h3 className="text-base font-semibold text-white">RESTful API Interactive Testing Console</h3>
        <p className="text-xs text-slate-400">
          Execute real HTTP requests (GET, POST, PUT, DELETE) against the Spring Boot REST controllers
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setPreset('GET', '/api/books')}
          className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-900 border border-canvas-border text-blue-400 hover:text-white"
        >
          GET /api/books (List)
        </button>
        <button
          onClick={() => setPreset('GET', '/api/books/1')}
          className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-900 border border-canvas-border text-blue-400 hover:text-white"
        >
          GET /api/books/1 (Detail)
        </button>
        <button
          onClick={() => setPreset('POST', '/api/books', '{\n  "title": "Design Patterns",\n  "author": "Gang of Four",\n  "price": 850.0\n}')}
          className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-900 border border-canvas-border text-emerald-400 hover:text-white"
        >
          POST /api/books (Create)
        </button>
        <button
          onClick={() => setPreset('DELETE', '/api/books/4')}
          className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-900 border border-canvas-border text-rose-400 hover:text-white"
        >
          DELETE /api/books/4
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Builder */}
        <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border space-y-4 font-mono text-xs">
          <h4 className="text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-brand-blue">send</span>
            HTTP Request Builder
          </h4>

          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-canvas-border text-cyan-400 font-bold focus:outline-none"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-canvas-border text-white focus:outline-none"
            />
          </div>

          {(method === 'POST' || method === 'PUT') && (
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">JSON Request Body</label>
              <textarea
                rows={5}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-canvas-border text-slate-200 font-mono text-xs"
              />
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-sans font-semibold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-glow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            {loading ? 'Dispatching...' : `Execute ${method} Request`}
          </button>
        </div>

        {/* Response Viewer */}
        <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-brand-cyan">terminal</span>
              Server Response
            </h4>
            {responseStatus && (
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    responseStatus.ok
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {responseStatus.code}
                </span>
                <span className="text-[11px] text-slate-500">{responseStatus.time}</span>
              </div>
            )}
          </div>

          {responseJson ? (
            <div className="space-y-3">
              {responseHeaders && (
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  {Object.entries(responseHeaders).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span>{k}:</span>
                      <span className="text-slate-300">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              <pre className="p-3.5 rounded-xl bg-slate-900 border border-canvas-border text-emerald-300 overflow-x-auto whitespace-pre-wrap max-h-64">
                {JSON.stringify(responseJson, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs rounded-xl bg-slate-900/50 border border-dashed border-canvas-border font-sans">
              Select an endpoint preset and press "Execute Request" to inspect live JSON payload and status codes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
