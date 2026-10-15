import React, { useState } from 'react';

// Reusable Component receiving Props
function StudentCard({ name, roll, division, semester, stream }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-[#E6E4DC] hover:border-[#0E6E5C]/50 hover:shadow-subtle transition-all">
      <div className="flex items-center justify-between pb-2 border-b border-[#EFEEE8]">
        <span className="font-bold text-[#101418] text-sm">{name}</span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF5F2] text-[#0E6E5C] border border-[#D0E2D9] font-medium">
          Roll #{roll}
        </span>
      </div>
      <div className="pt-2 text-xs space-y-1 text-[#5C6672]">
        <div>Stream: <span className="text-[#101418] font-medium">{stream}</span></div>
        <div>Division: <span className="text-[#101418] font-medium">{division}</span> | Semester: <span className="text-[#101418] font-medium">{semester}</span></div>
      </div>
    </div>
  );
}

export default function Exp11Demo() {
  const [currentRoute, setCurrentRoute] = useState('students');
  const [searchQuery, setSearchQuery] = useState('');

  const studentsData = [
    { id: 1, roll: 101, name: 'Zaid Mohammed', division: 'A', semester: 3, stream: 'Information Technology' },
    { id: 2, roll: 102, name: 'Aarav Patel', division: 'A', semester: 3, stream: 'Computer Engineering' },
    { id: 3, roll: 103, name: 'Priya Sharma', division: 'B', semester: 3, stream: 'Information Technology' },
    { id: 4, roll: 104, name: 'Rohan Verma', division: 'B', semester: 3, stream: 'Computer Engineering' },
  ];

  const filteredStudents = studentsData.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E6E4DC] pb-4">
        <h3 className="text-base font-semibold text-[#101418] font-display">Interactive React SPA (Routing, State & Props)</h3>
        <p className="text-xs text-[#5C6672]">
          A working Single Page Application sandbox demonstrating component hierarchies, client-side routing, and props delegation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* The SPA Container */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#E6E4DC] shadow-card space-y-4">
          {/* Simulated SPA Header & Navigation */}
          <div className="flex items-center justify-between pb-4 border-b border-[#EFEEE8]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0E6E5C] text-base">hub</span>
              <span className="font-bold text-[#101418] text-xs">Mini Campus Portal (SPA)</span>
            </div>
            <nav className="flex gap-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'students', label: 'Students' },
                { id: 'courses', label: 'Courses' },
                { id: 'about', label: 'About' },
              ].map((route) => (
                <button
                  key={route.id}
                  onClick={() => setCurrentRoute(route.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    currentRoute === route.id
                      ? 'bg-[#0E6E5C] text-white shadow-subtle'
                      : 'text-[#5C6672] hover:text-[#101418] hover:bg-[#FAFAF8]'
                  }`}
                >
                  {route.label}
                </button>
              ))}
            </nav>
          </div>

          {/* SPA Route Views */}
          <div className="min-h-[260px]">
            {currentRoute === 'home' && (
              <div className="py-8 text-center space-y-2">
                <h4 className="text-lg font-bold text-[#101418] font-display">Welcome to Mumbai University Portal</h4>
                <p className="text-xs text-[#5C6672] max-w-md mx-auto">
                  This sub-view is conditionally mounted in real time without refreshing the web browser.
                </p>
              </div>
            )}

            {currentRoute === 'students' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-[#5C6672] font-mono">
                    Showing {filteredStudents.length} Students (Rendering via &lt;StudentCard /&gt; props)
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student by name..."
                    className="px-3 py-1.5 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0E6E5C] w-48 shadow-subtle"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      name={student.name}
                      roll={student.roll}
                      division={student.division}
                      semester={student.semester}
                      stream={student.stream}
                    />
                  ))}
                </div>
              </div>
            )}

            {currentRoute === 'courses' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC] flex justify-between">
                  <span className="text-[#101418] font-medium">CS301: Full Stack Java Programming</span>
                  <span className="text-[#0E6E5C] font-bold">4 Credits</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC] flex justify-between">
                  <span className="text-[#101418] font-medium">CS302: Database Management Systems</span>
                  <span className="text-[#0E6E5C] font-bold">3 Credits</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC] flex justify-between">
                  <span className="text-[#101418] font-medium">CS303: Computer Networks</span>
                  <span className="text-[#0E6E5C] font-bold">3 Credits</span>
                </div>
              </div>
            )}

            {currentRoute === 'about' && (
              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC] text-xs text-[#5C6672] space-y-2">
                <h4 className="font-bold text-[#101418]">About Mini SPA Architecture</h4>
                <p>
                  Demonstrates React single-page client routing. Route changes mutate state or URL history without triggering full HTTP round-trips to the server.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* React Architecture Panel */}
        <div className="p-6 rounded-2xl bg-white border border-[#E6E4DC] shadow-card space-y-4 font-mono text-xs">
          <h4 className="text-xs uppercase tracking-wider text-[#5C6672] font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#0E6E5C]">schema</span>
            React Component Tree
          </h4>

          <div className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-1.5">
            <div className="text-[#0E6E5C] font-bold">&lt;App&gt;</div>
            <div className="pl-4 text-[#5C6672]">├── &lt;Navbar&gt; (Route Nav)</div>
            <div className="pl-4 text-[#5C6672]">├── &lt;Routes&gt;</div>
            <div className="pl-8 text-[#101418] font-medium">
              {currentRoute === 'students' ? '├── <StudentsView> (ACTIVE)' : '├── <StudentsView>'}
            </div>
            {currentRoute === 'students' && (
              <div className="pl-12 text-[#0E6E5C] font-semibold">
                └── &lt;StudentCard key={'{id}'} {...props} /&gt;
              </div>
            )}
            <div className="pl-8 text-[#5C6672]">
              {currentRoute === 'courses' ? '├── <CoursesView> (ACTIVE)' : '├── <CoursesView>'}
            </div>
            <div className="pl-8 text-[#5C6672]">
              {currentRoute === 'about' ? '└── <AboutView> (ACTIVE)' : '└── <AboutView>'}
            </div>
          </div>

          <div className="text-[11px] text-[#5C6672] font-sans leading-relaxed">
            <strong className="text-[#101418]">Props Pattern:</strong> Notice how the parent <code className="text-[#0E6E5C] font-mono">&lt;StudentsView&gt;</code> passes each student's name and division down as immutable props to reusable <code className="text-[#0E6E5C] font-mono">&lt;StudentCard /&gt;</code> children.
          </div>
        </div>
      </div>
    </div>
  );
}
