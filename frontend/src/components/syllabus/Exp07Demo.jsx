import React, { useState } from 'react';

export default function Exp07Demo() {
  const [activeTab, setActiveTab] = useState('preview');
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const htmlSource = `<!-- Student Profile Structure -->
<div class="student-profile-card">
  <div class="avatar-box">ZM</div>
  <h2>Zaid Mohammed</h2>
  <p class="subtitle">Semester III · Full Stack Java Programming</p>
  
  <table class="academic-table">
    <thead>
      <tr>
        <th>Course Module</th>
        <th>Grade</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Core Java & OOP</td><td>A+</td></tr>
      <tr><td>Servlets & JSP</td><td>A</td></tr>
      <tr><td>Spring Boot & REST</td><td>A+</td></tr>
    </tbody>
  </table>
  
  <button id="themeBtn" onclick="toggleTheme()">Change Theme</button>
</div>`;

  const cssSource = `/* Modern Clean Card Styles */
.student-profile-card {
  padding: 24px;
  border-radius: 16px;
  max-width: 420px;
  margin: 0 auto;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.dark-mode {
  background: #0f172a;
  color: #f8fafc;
  border: 1px solid #1e293b;
}

.light-mode {
  background: #ffffff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.academic-table {
  width: 100%;
  margin: 16px 0;
  border-collapse: collapse;
}`;

  const jsSource = `// Dynamic DOM Theme Manipulator
function toggleTheme() {
  const card = document.querySelector('.student-profile-card');
  card.classList.toggle('dark-mode');
  card.classList.toggle('light-mode');
  console.log("Theme dynamically modified via JavaScript DOM API");
}`;

  return (
    <div className="space-y-6">
      <div className="border-b border-canvas-border pb-4">
        <h3 className="text-base font-semibold text-white">Integrated Web Stack: HTML + CSS + JavaScript</h3>
        <p className="text-xs text-slate-400">
          Inspect HTML semantic markup, CSS styling, and client-side JavaScript DOM manipulation in one sandbox
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-canvas-border pb-3">
        {[
          { id: 'preview', label: 'Live Preview', icon: 'visibility' },
          { id: 'html', label: 'HTML', icon: 'html' },
          { id: 'css', label: 'CSS', icon: 'css' },
          { id: 'js', label: 'JavaScript', icon: 'javascript' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'preview' && (
        <div className="py-8 flex flex-col items-center justify-center">
          {/* The Mini Webpage Card */}
          <div
            className={`w-full max-w-md p-6 rounded-2xl transition-all duration-300 ${
              isDarkTheme
                ? 'bg-slate-900 border border-slate-700 text-white shadow-xl'
                : 'bg-white border border-slate-200 text-slate-900 shadow-2xl'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  isDarkTheme ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                }`}
              >
                ZM
              </div>
              <div>
                <h4 className="font-bold text-base">Zaid Mohammed</h4>
                <p className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  Semester III · Full Stack Java Programming
                </p>
              </div>
            </div>

            <table className="w-full text-xs text-left mb-5">
              <thead>
                <tr className={`border-b ${isDarkTheme ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="py-2">Course Module</th>
                  <th className="py-2 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                <tr>
                  <td className="py-2">Core Java & OOP</td>
                  <td className="py-2 text-right font-bold text-emerald-500">A+</td>
                </tr>
                <tr>
                  <td className="py-2">Servlets & JSP</td>
                  <td className="py-2 text-right font-bold text-emerald-500">A</td>
                </tr>
                <tr>
                  <td className="py-2">Spring Boot & REST</td>
                  <td className="py-2 text-right font-bold text-emerald-500">A+</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                isDarkTheme
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {isDarkTheme ? 'light_mode' : 'dark_mode'}
              </span>
              Change Theme ({isDarkTheme ? 'Switch to Light' : 'Switch to Dark'})
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Clicking "Change Theme" executes JavaScript DOM manipulation to toggle theme CSS classes.
          </p>
        </div>
      )}

      {activeTab === 'html' && (
        <div className="p-5 rounded-2xl bg-canvas-card border border-canvas-border font-mono text-xs">
          <pre className="text-cyan-300 overflow-x-auto whitespace-pre-wrap">{htmlSource}</pre>
        </div>
      )}

      {activeTab === 'css' && (
        <div className="p-5 rounded-2xl bg-canvas-card border border-canvas-border font-mono text-xs">
          <pre className="text-amber-300 overflow-x-auto whitespace-pre-wrap">{cssSource}</pre>
        </div>
      )}

      {activeTab === 'js' && (
        <div className="p-5 rounded-2xl bg-canvas-card border border-canvas-border font-mono text-xs">
          <pre className="text-emerald-300 overflow-x-auto whitespace-pre-wrap">{jsSource}</pre>
        </div>
      )}
    </div>
  );
}
