import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DemoPage() {
  const navigate = useNavigate();
  const [currentChapter, setCurrentChapter] = useState(1);

  const chapters = [
    {
      num: 1,
      title: 'Java Execution: Blueprint & Instantiation',
      tagline: 'Code is not just text — it is a living state machine.',
      summary: 'Demonstrates parsing a Java class, constructor execution, and member method invocation.',
      visualCode: `Student s = new Student("Zaid", 85);
s.display();`,
      highlights: [
        'Parser creates ProgramNode -> ClassNode -> ConstructorNode',
        'Stack frame for main() initialized with line 1',
        'Constructor frame pushes onto stack, sets fields, and returns',
      ],
      actionLabel: 'Try in Visualizer',
      actionRoute: '/visualizer',
    },
    {
      num: 2,
      title: 'Call Stack & Heap Memory Model',
      tagline: 'See the physical separation between Stack frames and Heap objects.',
      summary: 'Observes dynamic allocation of Object #1 on the Heap and pointer connection from local variable s.',
      visualCode: `// Local Variable in Stack Frame
s ──────────────► Object #1 (Student)
                  ├── name = "Zaid"
                  └── marks = 85`,
      highlights: [
        'Stack frames are strictly ephemeral LIFO structures',
        'Heap objects hold persistent instance state with stable IDs',
        'Field mutations trigger real-time visual highlight pulses',
      ],
      actionLabel: 'Inspect Student Demo',
      actionRoute: '/syllabus/1',
    },
    {
      num: 3,
      title: 'Failure Forensics: NullPointerException',
      tagline: 'Crashes become educational forensic investigations.',
      summary: 'Evaluates field access on null reference, intercepts failure, and diagnoses root cause deterministically without AI.',
      visualCode: `Student student = null;
System.out.println(student.name); // 💥 NullPointerException`,
      highlights: [
        'Simulator detects null reference dereference before host crash',
        'Forensics engine isolates variable: "student", field: "name"',
        'Interactive "Replay Failure" animates exact failure chain',
      ],
      actionLabel: 'Launch Crash Demo',
      actionRoute: '/visualizer',
    },
    {
      num: 4,
      title: 'Time-Travel Execution Timeline',
      tagline: 'Drag time backward and watch memory unwind.',
      summary: 'Immutable state snapshots at every event enable instant O(1) bidirectional execution scrubbing.',
      visualCode: `Step 1 ──► Step 2 ──► Step 3 ──► Step 4 (Current)
  ▲                      │
  └─────── Scrubbing ────┘`,
      highlights: [
        'Every ExecutionEvent stores complete stack and heap snapshots',
        'Scrubbing backward restores exact historic variable values',
        'Code editor active execution line tracks scrubber position',
      ],
      actionLabel: 'Test Time Travel',
      actionRoute: '/visualizer',
    },
    {
      num: 5,
      title: 'JavaScript & DOM Manipulation',
      tagline: 'Syllabus Practical 09: Dynamic background color timers.',
      summary: 'Demonstrates asynchronous browser Web APIs mutating the Document Object Model tree every 5 seconds.',
      visualCode: `setInterval(() => {
  document.body.style.backgroundColor = nextColor;
}, 5000);`,
      highlights: [
        'Web API timer queue schedules intervals via Event Loop',
        'Dynamic mutation of document.body style properties',
        'DOM tree node highlight animation',
      ],
      actionLabel: 'Open DOM Experiment',
      actionRoute: '/syllabus/9',
    },
    {
      num: 6,
      title: 'React Functional Components & Hooks',
      tagline: 'Syllabus Practical 10: Declarative state with useState.',
      summary: 'Shows component reactive re-rendering upon state dispatch without full browser reloads.',
      visualCode: `const [color, setColor] = useState('BLUE');
// Button click -> setColor('GREEN') -> Re-render view`,
      highlights: [
        'Declarative state management via useState hook',
        'Virtual DOM diffing updates only modified DOM nodes',
        'Clean separation between state, logic, and UI view',
      ],
      actionLabel: 'Open React Hooks Demo',
      actionRoute: '/syllabus/10',
    },
    {
      num: 7,
      title: 'Spring Boot Monolith & RESTful APIs',
      tagline: 'Syllabus Practicals 12 & 13: Enterprise Layered Architecture.',
      summary: 'Demonstrates @RestController, @Service, and @Repository layers handling real HTTP CRUD verbs.',
      visualCode: `GET    /api/books     (200 OK)
POST   /api/books     (201 Created)
DELETE /api/books/1   (200 OK)`,
      highlights: [
        'Inversion of Control (IoC) & Dependency Injection',
        'Standard HTTP verbs and idempotent status codes',
        'Live REST console sending actual network requests',
      ],
      actionLabel: 'Open REST Console',
      actionRoute: '/syllabus/13',
    },
    {
      num: 8,
      title: 'Spring JDBC & Database Persistence',
      tagline: 'Pure JdbcTemplate with 100% prepared statements.',
      summary: 'Persists execution sessions, historical traces, and book records safely with zero SQL injection risk.',
      visualCode: `jdbcTemplate.update(
  "INSERT INTO books (title, author, price) VALUES (?, ?, ?)",
  title, author, price
);`,
      highlights: [
        'Spring JdbcTemplate over HikariCP connection pool',
        'Prepared statements ensure 100% SQL injection immunity',
        'Seamless dual-profile support for local H2 and cloud PostgreSQL',
      ],
      actionLabel: 'View Database Practical',
      actionRoute: '/syllabus/12',
    },
  ];

  const chapter = chapters.find((c) => c.num === currentChapter) || chapters[0];

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 pb-20">
      {/* Header */}
      <div className="border-b border-canvas-border bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-widest font-bold">
                5–10 Minute Viva Demonstration Flow
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mt-2">
                JVM VISION Guided Presentation
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Walk the professor through the 8 core chapters covering Java execution, memory models, web fundamentals, React, and Spring Boot.
              </p>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentChapter((c) => Math.max(1, c - 1))}
                disabled={currentChapter === 1}
                className="px-3 py-1.5 rounded-xl text-xs font-mono bg-canvas-card border border-canvas-border text-slate-300 disabled:opacity-40 hover:text-white"
              >
                ← Previous Chapter
              </button>
              <span className="text-xs font-mono text-brand-cyan px-2">
                Chapter {currentChapter} of 8
              </span>
              <button
                onClick={() => setCurrentChapter((c) => Math.min(8, c + 1))}
                disabled={currentChapter === 8}
                className="px-3 py-1.5 rounded-xl text-xs font-mono bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-glow-sm disabled:opacity-40"
              >
                Next Chapter →
              </button>
            </div>
          </div>

          {/* Stepper Dots Bar */}
          <div className="grid grid-cols-8 gap-2 mt-6">
            {chapters.map((ch) => (
              <button
                key={ch.num}
                onClick={() => setCurrentChapter(ch.num)}
                className={`p-2 rounded-xl text-left transition-all border ${
                  currentChapter === ch.num
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-glow-sm'
                    : currentChapter > ch.num
                    ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    : 'bg-slate-900/30 border-slate-800/60 text-slate-600 hover:text-slate-400'
                }`}
              >
                <div className="text-[10px] font-mono font-bold">Ch. 0{ch.num}</div>
                <div className="text-[11px] font-sans truncate">{ch.title.split(':')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chapter Content Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="p-8 rounded-3xl bg-canvas-card border border-canvas-border space-y-8 shadow-xl">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-canvas-border pb-6">
            <div>
              <span className="text-xs font-mono font-bold text-brand-cyan">
                DEMONSTRATION CHAPTER 0{chapter.num}
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                {chapter.title}
              </h2>
              <p className="text-sm text-cyan-300 font-mono mt-1">
                "{chapter.tagline}"
              </p>
              <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
                {chapter.summary}
              </p>
            </div>

            <button
              onClick={() => navigate(chapter.actionRoute)}
              className="px-5 py-3 rounded-2xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-glow-sm hover:shadow-glow-md transition-all flex items-center gap-2 whitespace-nowrap self-start lg:self-center"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              {chapter.actionLabel}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visual Code Artifact */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-brand-blue">code</span>
                Prescribed Code / Architectural Pattern
              </h4>
              <div className="p-5 rounded-2xl bg-slate-900 border border-canvas-border font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre">
                {chapter.visualCode}
              </div>
            </div>

            {/* Presentation Viva Points */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-brand-cyan">record_voice_over</span>
                Viva Defense Key Talking Points
              </h4>
              <div className="space-y-3">
                {chapter.highlights.map((point, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-sm text-blue-400 mt-0.5">
                      check_circle
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
