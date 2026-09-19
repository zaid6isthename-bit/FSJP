import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Visualizer from './pages/Visualizer';
import Examples from './pages/Examples';
import History from './pages/History';
import About from './pages/About';
import Syllabus from './pages/Syllabus';
import ExperimentDetail from './pages/ExperimentDetail';
import SyllabusCoverage from './pages/SyllabusCoverage';
import DemoPage from './pages/DemoPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-sky-300">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visualizer" element={<Visualizer />} />
            <Route path="/visualizer/:sessionId" element={<Visualizer />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
            
            {/* Syllabus Lab Routes */}
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/syllabus/coverage" element={<SyllabusCoverage />} />
            <Route path="/syllabus/:id" element={<ExperimentDetail />} />
            
            {/* Direct Named Syllabus Routes */}
            <Route path="/syllabus/java/classes-objects" element={<ExperimentDetail />} />
            <Route path="/syllabus/java/overloading" element={<ExperimentDetail />} />
            <Route path="/syllabus/java/inheritance-exceptions" element={<ExperimentDetail />} />
            <Route path="/syllabus/servlets/generic-http" element={<ExperimentDetail />} />
            <Route path="/syllabus/jsp/jdbc-login" element={<ExperimentDetail />} />
            <Route path="/syllabus/jsp/objects" element={<ExperimentDetail />} />
            <Route path="/syllabus/web/html-css-js" element={<ExperimentDetail />} />
            <Route path="/syllabus/javascript/email-validation" element={<ExperimentDetail />} />
            <Route path="/syllabus/javascript/dom-background" element={<ExperimentDetail />} />
            <Route path="/syllabus/react/hooks-colors" element={<ExperimentDetail />} />
            <Route path="/syllabus/react/spa" element={<ExperimentDetail />} />
            <Route path="/syllabus/spring/monolith" element={<ExperimentDetail />} />
            <Route path="/syllabus/spring/rest" element={<ExperimentDetail />} />

            {/* Guided Presentation Sequence */}
            <Route path="/demo" element={<DemoPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
