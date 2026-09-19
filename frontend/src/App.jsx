import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Visualizer from './pages/Visualizer';
import Examples from './pages/Examples';
import History from './pages/History';
import About from './pages/About';

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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
