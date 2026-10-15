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
      <div className="border-b border-[#E6E4DC] pb-4">
        <h3 className="text-base font-bold text-[#101418] font-display">JSP + Servlet + JDBC MVC Authentication Architecture</h3>
        <p className="text-xs text-[#5C6672]">
          Trace how JSP forms submit data to a Servlet controller, which invokes JDBC PreparedStatements against the database
        </p>
      </div>

      {/* Internal Tabs */}
      <div className="flex gap-2 border-b border-[#E6E4DC] pb-3 overflow-x-auto">
        {[
          { id: 'demo', label: 'Live Demo' },
          { id: 'flow', label: 'MVC Architecture Flow' },
          { id: 'db', label: 'Database Schema' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
              activeTab === tab.id
                ? 'bg-[#101418] text-white border-[#101418] shadow-subtle'
                : 'bg-white text-[#5C6672] hover:text-[#101418] border-[#E6E4DC]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'demo' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JSP Login Form Card */}
          <div className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E4DC]">
              <span className="text-xs font-mono font-bold text-[#0E6E5C]">login.jsp (View)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#101418] border border-[#E6E4DC] font-semibold">
                POST /LoginServlet
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#101418] mb-1">Student Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:border-[#0E6E5C] focus:outline-none shadow-subtle font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101418] mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:border-[#0E6E5C] focus:outline-none shadow-subtle font-medium"
                />
              </div>

              <div className="text-[11px] text-[#5C6672] font-mono">
                Demo Account: <code className="text-[#101418] font-bold">zaid@college.edu</code> / <code className="text-[#101418] font-bold">password123</code>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#0E6E5C] hover:bg-[#0A4A3F] text-white shadow-subtle transition-all cursor-pointer"
              >
                Submit Form to LoginServlet
              </button>
            </form>
          </div>

          {/* Execution Pipeline Steps */}
          <div className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-3 font-mono text-xs">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] flex items-center gap-2 font-bold font-display">
              <span className="material-symbols-outlined text-sm text-[#0E6E5C]">timeline</span>
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
                      ? 'bg-[#EFF5F2] border-2 border-[#0E6E5C] text-[#0A4A3F] shadow-subtle'
                      : flowStep > item.step
                      ? 'bg-white border-[#CFE0D8] text-[#101418]'
                      : 'bg-white border-[#E6E4DC] text-[#8C96A2]'
                  }`}
                >
                  <div className="font-bold flex justify-between">
                    <span>{item.name}</span>
                    {flowStep === item.step && <span className="text-[10px] text-[#0E6E5C]">EXECUTING</span>}
                    {flowStep > item.step && <span className="text-[10px] text-[#0E6E5C]">✓</span>}
                  </div>
                  <div className="text-[11px] text-[#5C6672] font-sans mt-0.5">{item.detail}</div>
                </div>
              ))}
            </div>

            {authStatus && (
              <div
                className={`mt-3 p-3.5 rounded-xl border shadow-subtle ${
                  authStatus.success
                    ? 'bg-[#EFF5F2] text-[#0A4A3F] border-[#CFE0D8]'
                    : 'bg-[#FAF0EC] text-[#A93226] border-[#E4C4B2]'
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
        <div className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] font-mono text-xs text-[#101418] space-y-4">
          <h4 className="text-sm font-bold text-[#101418] font-display">Classic J2EE Model-View-Controller Flow</h4>
          <pre className="p-4 rounded-xl bg-white border border-[#E6E4DC] text-[#0E6E5C] overflow-x-auto whitespace-pre font-bold leading-relaxed shadow-subtle">
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
        <div className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] font-mono text-xs space-y-4">
          <h4 className="text-sm font-bold text-[#101418] font-display">Database Table: students</h4>
          <div className="overflow-x-auto bg-white rounded-xl border border-[#E6E4DC] shadow-subtle">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E4DC] text-[#5C6672] font-bold">
                  <th className="py-2.5 px-3">id</th>
                  <th className="py-2.5 px-3">name</th>
                  <th className="py-2.5 px-3">email</th>
                  <th className="py-2.5 px-3">role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEEE8]">
                <tr>
                  <td className="py-2.5 px-3 text-[#0E6E5C] font-bold">1</td>
                  <td className="py-2.5 px-3 text-[#101418] font-bold">Zaid Mohammed</td>
                  <td className="py-2.5 px-3 text-[#5C6672]">zaid@college.edu</td>
                  <td className="py-2.5 px-3 text-[#0E6E5C] font-semibold">Student</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#0E6E5C] font-bold">2</td>
                  <td className="py-2.5 px-3 text-[#101418] font-bold">Rahul Sharma</td>
                  <td className="py-2.5 px-3 text-[#5C6672]">rahul@college.edu</td>
                  <td className="py-2.5 px-3 text-[#0E6E5C] font-semibold">Student</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
