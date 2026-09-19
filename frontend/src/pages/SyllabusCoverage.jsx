import React from 'react';
import { Link } from 'react-router-dom';

export default function SyllabusCoverage() {
  const coverageMatrix = [
    {
      syllabusTopic: 'Classes, Objects, Methods, Encapsulation',
      experiment: 'Exp 01: Classes & Objects',
      jvmVisionComponent: 'Lexer + Parser + Heap Object Card Model',
      tech: 'Java 21 / OOP',
      evidence: 'Interactive heap card visualization with field mutation tracking',
      link: '/syllabus/1',
    },
    {
      syllabusTopic: 'Method & Constructor Overloading',
      experiment: 'Exp 02: Overloading',
      jvmVisionComponent: 'Parser Overload Resolution & Parameter Type Matching',
      tech: 'Java / Polymorphism',
      evidence: 'Static signature matching between parameter list arity and types',
      link: '/syllabus/2',
    },
    {
      syllabusTopic: 'Inheritance, super, Exception Handling',
      experiment: 'Exp 03: Inheritance & Exceptions',
      jvmVisionComponent: 'Deterministic Failure Forensics & Stack Unwinding',
      tech: 'Java / OOP / Exceptions',
      evidence: 'ArithmeticException interception, try-catch lifecycle, and failure replay',
      link: '/syllabus/3',
    },
    {
      syllabusTopic: 'GenericServlet & HttpServlet, doGet / doPost',
      experiment: 'Exp 04: Generic & Http Servlets',
      jvmVisionComponent: 'Syllabus Lab: Interactive HTTP Request Simulator',
      tech: 'Jakarta EE / Servlets',
      evidence: 'Visual client -> container -> service() -> doGet/doPost request pipeline',
      link: '/syllabus/4',
    },
    {
      syllabusTopic: 'JSP Login, JDBC PreparedStatement, MVC',
      experiment: 'Exp 05: JSP Login + JDBC',
      jvmVisionComponent: 'Spring JDBC & PreparedStatement Architecture',
      tech: 'JSP / JDBC / SQL',
      evidence: 'Full MVC authentication flow with prepared query binding and session state',
      link: '/syllabus/5',
    },
    {
      syllabusTopic: 'JSP Implicit & Explicit Objects (request, session)',
      experiment: 'Exp 06: JSP Implicit Objects',
      jvmVisionComponent: 'Syllabus Lab: Live Object Inspector',
      tech: 'JSP Containers',
      evidence: 'Deep inspection of request, response, session, application, out properties',
      link: '/syllabus/6',
    },
    {
      syllabusTopic: 'HTML5, CSS3, DOM Event Listeners',
      experiment: 'Exp 07: HTML + CSS + JS',
      jvmVisionComponent: 'Syllabus Lab: Mini Web Sandbox',
      tech: 'HTML5 / CSS / Vanilla JS',
      evidence: 'Student profile card with live theme toggle and tabbed source code viewer',
      link: '/syllabus/7',
    },
    {
      syllabusTopic: 'JavaScript String Validation & Error Feedback',
      experiment: 'Exp 08: Email Validation',
      jvmVisionComponent: 'Syllabus Lab: Interactive Form Guard',
      tech: 'JavaScript / DOM',
      evidence: 'Real-time string parsing checking @ and dot positioning before submit',
      link: '/syllabus/8',
    },
    {
      syllabusTopic: 'DOM Dynamic Manipulation & Timers (setInterval)',
      experiment: 'Exp 09: DOM Background Color',
      jvmVisionComponent: 'Syllabus Lab: 5-Second Interval Engine',
      tech: 'JavaScript / Web APIs',
      evidence: 'Live countdown timer mutating document.body with animated DOM tree view',
      link: '/syllabus/9',
    },
    {
      syllabusTopic: 'React Functional Components & useState Hook',
      experiment: 'Exp 10: React Hooks Colors',
      jvmVisionComponent: 'JVM VISION React Frontend Core',
      tech: 'React 19 / Hooks',
      evidence: 'Color picker demonstrating useState dispatch and virtual DOM reconciliation',
      link: '/syllabus/10',
    },
    {
      syllabusTopic: 'React SPA, Router, Props Passing, Components',
      experiment: 'Exp 11: React SPA',
      jvmVisionComponent: 'React Router v6 SPA Architecture',
      tech: 'React / Client Routing',
      evidence: 'Multi-view campus portal with StudentCard props and component tree diagram',
      link: '/syllabus/11',
    },
    {
      syllabusTopic: 'Spring Boot Monolith (Controller, Service, Repo)',
      experiment: 'Exp 12: Spring Boot Monolith',
      jvmVisionComponent: 'Spring Boot 3.2.5 Backend Architecture',
      tech: 'Spring Boot / JDBC',
      evidence: 'Live Book CRUD connected to actual Spring Boot @RestController and DB',
      link: '/syllabus/12',
    },
    {
      syllabusTopic: 'Spring Boot RESTful APIs (GET, POST, PUT, DELETE)',
      experiment: 'Exp 13: Spring Boot REST APIs',
      jvmVisionComponent: 'JVM VISION RESTful Execution API',
      tech: 'REST / JSON / HTTP',
      evidence: 'Interactive REST console testing /api/books with real status codes and JSON',
      link: '/syllabus/13',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 pb-20">
      {/* Header */}
      <div className="border-b border-canvas-border bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-3">
            <Link to="/syllabus" className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Syllabus Lab
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-brand-cyan">Academic Alignment Matrix</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            How JVM VISION Covers Your Syllabus
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            A comprehensive mapping between the Mumbai University Semester III Full Stack Java Programming practical syllabus and the implemented JVM VISION software architecture.
          </p>
        </div>
      </div>

      {/* Coverage Matrix Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-canvas-border text-slate-400 font-mono">
                  <th className="py-3 px-4">Syllabus Practical Area</th>
                  <th className="py-3 px-4">Technology</th>
                  <th className="py-3 px-4">JVM VISION Project Module</th>
                  <th className="py-3 px-4">Observable Verification</th>
                  <th className="py-3 px-4 text-right">Demo Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {coverageMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white font-sans">{item.experiment}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{item.syllabusTopic}</div>
                    </td>
                    <td className="py-3 px-4 text-brand-cyan">{item.tech}</td>
                    <td className="py-3 px-4 text-slate-300 font-sans">{item.jvmVisionComponent}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] font-sans">{item.evidence}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={item.link}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-[11px] font-bold"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
