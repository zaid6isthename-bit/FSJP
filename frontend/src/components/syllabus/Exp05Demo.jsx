import React, { useState } from 'react';

export default function Exp05Demo() {
  const [email, setEmail] = useState('zaid@college.edu');
  const [password, setPassword] = useState('password123');
  const [flowStep, setFlowStep] = useState(0);
  const [authStatus, setAuthStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('demo');

  const demoAccounts = [
    { email: 'zaid@college.edu', password: 'password123', name: 'Zaid Mohammed', role: 'Student' },
    { email: 'rahul@college.edu', password: 'secret456', name: 'Rahul Sharma', role: 'Student' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setFlowStep(1); // JSP submits form
    setAuthStatus(null);

    setTimeout(() => setFlowStep(2), 350); // Servlet receives doPost()
    setTimeout(() => setFlowStep(3), 700); // JDBC executes PreparedStatement

    setTimeout(() => {
      setFlowStep(4); // DB responds
      const match = demoAccounts.find((acc) => acc.email === email && acc.password === password);
      if (match) {
        setAuthStatus({
          success: true,
          user: match.name,
          message: `Authentication Succeeded! HttpSession created with session ID: JSESSIONID_994F_${Math.floor(Math.random()*8999+1000)}`,
        });
      } else {
        setAuthStatus({
          success: false,
          user: null,
          message: 'Invalid credentials. PreparedStatement returned empty ResultSet.',
        });
      }
    }, 1100);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-canvas-border pb-4">
        <h3 className="text-base font-semibold text-white">JSP + Servlet + JDBC MVC Authentication Architecture</h3>
        <p className="text-xs text-slate-400">
          Trace how JSP forms submit data to a Servlet controller, which invokes JDBC PreparedStatements against the database
        </p>
      </div>

      {/* Internal Tabs */}
      <div className="flex gap-2 border-b border-canvas-border pb-3">
        {[
          { id: 'demo', label: 'Live Demo' },
          { id: 'flow', label: 'MVC Architecture Flow' },
          { id: 'db', label: 'Database Schema' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'demo' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JSP Login Form Card */}
          <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-canvas-border">
              <span className="text-xs font-mono text-cyan-400">login.jsp (View)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">
                POST /LoginServlet
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Student Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
                />
              </div>

              <div className="text-[11px] text-slate-500">
                Demo Account: <code className="text-slate-400">zaid@college.edu</code> / <code className="text-slate-400">password123</code>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-glow-sm transition-all"
              >
                Submit Form to LoginServlet
              </button>
            </form>
          </div>

          {/* Execution Pipeline Steps */}
          <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border space-y-3 font-mono text-xs">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-brand-cyan">timeline</span>
              MVC Execution Pipeline
            </h4>

            <div className="space-y-2">
              {[
                { step: 1, name: '1. JSP Form Submit', detail: 'HTML Form dispatched HTTP POST request' },
                { step: 2, name: '2. LoginServlet.doPost()', detail: 'Reads req.getParameter("email") & password' },
                { step: 3, name: '3. JDBC PreparedStatement', detail: 'SELECT id, name FROM students WHERE email=? AND password=?' },
                { step: 4, name: '4. HttpSession & Redirect', detail: 'Creates session.setAttribute("user", name) -> dashboard.jsp' },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`p-2.5 rounded-xl border transition-all ${
                    flowStep === item.step
                      ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 shadow-glow-sm'
                      : flowStep > item.step
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="font-bold flex justify-between">
                    <span>{item.name}</span>
                    {flowStep === item.step && <span className="text-[10px] text-blue-400">EXECUTING</span>}
                    {flowStep > item.step && <span className="text-[10px] text-emerald-400">✓</span>}
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-0.5">{item.detail}</div>
                </div>
              ))}
            </div>

            {authStatus && (
              <div
                className={`mt-3 p-3 rounded-xl border ${
                  authStatus.success
                    ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-950/30 text-rose-300 border-rose-500/30'
                }`}
              >
                <div className="font-bold">{authStatus.success ? '✓ Welcome, ' + authStatus.user : '✕ Login Failed'}</div>
                <div className="text-[11px] mt-1 font-sans">{authStatus.message}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'flow' && (
        <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border font-mono text-xs text-slate-300 space-y-4">
          <h4 className="text-sm font-bold text-white">Classic J2EE Model-View-Controller Flow</h4>
          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 overflow-x-auto whitespace-pre">
{`Browser (Client)
      │
      │ 1. HTTP POST (email, password)
      ▼
LoginServlet (Controller)
      │
      │ 2. PreparedStatement ps = conn.prepareStatement(sql);
      ▼
JDBC Driver (Connection)
      │
      │ 3. Execute SQL Query against Database
      ▼
students Table (Model / DB)
      │
      │ 4. ResultSet rs = ps.executeQuery();
      ▼
LoginServlet
      │
      │ 5. if (rs.next()) session.setAttribute("user", name);
      ▼
dashboard.jsp (View Response)`}
          </pre>
        </div>
      )}

      {activeTab === 'db' && (
        <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border font-mono text-xs space-y-4">
          <h4 className="text-sm font-bold text-white">Database Table: students</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-canvas-border text-slate-400">
                  <th className="py-2 px-3">id</th>
                  <th className="py-2 px-3">name</th>
                  <th className="py-2 px-3">email</th>
                  <th className="py-2 px-3">role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="py-2 px-3 text-cyan-400">1</td>
                  <td className="py-2 px-3 text-white">Zaid Mohammed</td>
                  <td className="py-2 px-3 text-slate-300">zaid@college.edu</td>
                  <td className="py-2 px-3 text-emerald-400">Student</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-cyan-400">2</td>
                  <td className="py-2 px-3 text-white">Rahul Sharma</td>
                  <td className="py-2 px-3 text-slate-300">rahul@college.edu</td>
                  <td className="py-2 px-3 text-emerald-400">Student</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
