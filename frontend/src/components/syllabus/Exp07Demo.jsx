import React, { useState } from 'react';

export default function Exp07Demo() {
  const [activeTab, setActiveTab] = useState('preview');
  const [isAltStyle, setIsAltStyle] = useState(false);

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
  
  <button id="themeBtn" onclick="toggleStyle()">Toggle Card Style</button>
</div>`;

  const cssSource = `/* Modern Architectural Card Styles */
.student-profile-card {
  padding: 24px;
  border-radius: 16px;
  max-width: 420px;
  margin: 0 auto;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.style-default {
  background: #ffffff;
  color: #101418;
  border: 1px solid #e6e4dc;
  box-shadow: 0 4px 20px -2px rgba(16, 20, 24, 0.06);
}

.style-accent {
  background: #eff5f2;
  color: #0a4a3f;
  border: 2px solid #0e6e5c;
  box-shadow: 0 18px 48px rgba(16, 20, 24, 0.08);
}

.academic-table {
  width: 100%;
  margin: 16px 0;
  border-collapse: collapse;
}`;

  const jsSource = `// Dynamic DOM Style Manipulator
function toggleStyle() {
  const card = document.querySelector('.student-profile-card');
  card.classList.toggle('style-accent');
  card.classList.toggle('style-default');
  console.log("Card presentation dynamically modified via JavaScript DOM API");
}`;

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E6E4DC] pb-4">
        <h3 className="text-base font-bold text-[#101418] font-display">Integrated Web Stack: HTML + CSS + JavaScript</h3>
        <p className="text-xs text-[#5C6672]">
          Inspect HTML semantic markup, CSS styling, and client-side JavaScript DOM manipulation in one sandbox
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E6E4DC] pb-3 overflow-x-auto">
        {[
          { id: 'preview', label: 'Live Preview', icon: 'visibility' },
          { id: 'html', label: 'HTML', icon: 'html' },
          { id: 'css', label: 'CSS', icon: 'css' },
          { id: 'js', label: 'JavaScript', icon: 'javascript' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeTab === tab.id
                ? 'bg-[#101418] text-white border-[#101418] shadow-subtle'
                : 'bg-white text-[#5C6672] hover:text-[#101418] border-[#E6E4DC]'
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
              isAltStyle
                ? 'bg-[#EFF5F2] border-2 border-[#0E6E5C] text-[#101418] shadow-card'
                : 'bg-white border border-[#E6E4DC] text-[#101418] shadow-card'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white font-display ${
                  isAltStyle ? 'bg-[#0E6E5C]' : 'bg-[#101418]'
                }`}
              >
                ZM
              </div>
              <div>
                <h4 className="font-bold text-base text-[#101418] font-display">Zaid Mohammed</h4>
                <p className="text-xs text-[#5C6672]">
                  Semester III · Full Stack Java Programming
                </p>
              </div>
            </div>

            <table className="w-full text-xs text-left mb-5">
              <thead>
                <tr className="border-b border-[#E6E4DC] text-[#5C6672] font-display uppercase tracking-wider font-bold">
                  <th className="py-2">Course Module</th>
                  <th className="py-2 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEEE8]">
                <tr>
                  <td className="py-2.5 font-medium">Core Java & OOP</td>
                  <td className="py-2.5 text-right font-bold text-[#0E6E5C]">A+</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Servlets & JSP</td>
                  <td className="py-2.5 text-right font-bold text-[#0E6E5C]">A</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Spring Boot & REST</td>
                  <td className="py-2.5 text-right font-bold text-[#0E6E5C]">A+</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={() => setIsAltStyle(!isAltStyle)}
              className="w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-[#101418] hover:bg-[#252B33] text-white shadow-subtle cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">palette</span>
              Toggle Card Style via DOM API
            </button>
          </div>
          <p className="text-xs text-[#5C6672] mt-4 font-mono">
            Clicking "Toggle Card Style" executes JavaScript DOM manipulation to mutate component classes.
          </p>
        </div>
      )}

      {activeTab === 'html' && (
        <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] font-mono text-xs">
          <pre className="text-[#101418] overflow-x-auto whitespace-pre-wrap font-semibold">{htmlSource}</pre>
        </div>
      )}

      {activeTab === 'css' && (
        <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] font-mono text-xs">
          <pre className="text-[#101418] overflow-x-auto whitespace-pre-wrap font-semibold">{cssSource}</pre>
        </div>
      )}

      {activeTab === 'js' && (
        <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] font-mono text-xs">
          <pre className="text-[#0E6E5C] overflow-x-auto whitespace-pre-wrap font-semibold">{jsSource}</pre>
        </div>
      )}
    </div>
  );
}
