import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { api } from '../services/api';
import CodeEditor from '../components/editor/CodeEditor';
import CallStack from '../components/runtime/CallStack';
import HeapView from '../components/runtime/HeapView';
import VariablesPanel from '../components/runtime/VariablesPanel';
import OutputConsole from '../components/runtime/OutputConsole';
import EventInspector from '../components/runtime/EventInspector';
import PlaybackControls from '../components/playback/PlaybackControls';
import TimelineScrubber from '../components/playback/TimelineScrubber';
import FailureForensicsPanel from '../components/forensics/FailureForensicsPanel';

const DEFAULT_CODE = `class Student {
    String name;
    int marks;

    Student(String name) {
        this.name = name;
        this.marks = 0;
    }

    void study() {
        marks = marks + 10;
    }
}

class Main {
    public static void main(String[] args) {
        Student student = new Student("Zaid");
        student.study();
        System.out.println("Marks: " + student.marks);
    }
}`;

export default function Visualizer() {
  const [searchParams] = useSearchParams();
  const { sessionId: routeSessionId } = useParams();

  const [code, setCode] = useState(DEFAULT_CODE);
  const [title, setTitle] = useState('Object Creation & Method Call');
  const [examples, setExamples] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [toast, setToast] = useState(null);

  // Execution Trace & Events
  const [trace, setTrace] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Highlighting & Inspection
  const [highlightedObjectId, setHighlightedObjectId] = useState(null);
  const [showForensics, setShowForensics] = useState(false);

  // Load Examples on mount
  useEffect(() => {
    async function loadExamples() {
      const res = await api.getExamples();
      if (res.success && res.data) {
        setExamples(res.data);
        const exampleKey = searchParams.get('example');
        if (exampleKey) {
          const match = res.data.find((e) => e.id === exampleKey);
          if (match) {
            setCode(match.code);
            setTitle(match.title);
          }
        }
      }
    }
    loadExamples();
  }, [searchParams]);

  // Load Session if route param present
  useEffect(() => {
    if (routeSessionId) {
      async function loadSession() {
        const res = await api.getSessionTrace(routeSessionId);
        if (res.success && res.data) {
          setTrace(res.data);
          setEvents(res.data.events || []);
          setCurrentIndex(0);
          if (res.data.status === 'FAILED') {
            setShowForensics(true);
          }
        }
      }
      loadSession();
    }
  }, [routeSessionId]);

  const showToastMsg = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSelectExample = async (id) => {
    const ex = examples.find((e) => e.id === id);
    if (ex) {
      setCode(ex.code);
      setTitle(ex.title);
      setTrace(null);
      setEvents([]);
      setCurrentIndex(0);
      setIsPlaying(false);
      setShowForensics(false);
      showToastMsg(`Loaded example: ${ex.title}`, 'success');
    }
  };

  const handleValidate = async () => {
    const res = await api.validateCode(code);
    if (res.success) {
      showToastMsg('Java syntax is valid!', 'success');
    } else {
      showToastMsg(res.message || 'Syntax error detected', 'error');
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setIsPlaying(false);
    setShowForensics(false);

    const res = await api.runCode(code, title);
    setIsRunning(false);

    if (res.success && res.data) {
      const traceData = res.data;
      setTrace(traceData);
      setEvents(traceData.events || []);
      setCurrentIndex(0);

      if (traceData.status === 'FAILED') {
        showToastMsg(`Execution stopped: ${traceData.errorType}`, 'error');
        setShowForensics(true);
      } else {
        showToastMsg(`Execution complete: ${traceData.totalEvents} events recorded`, 'success');
      }

      // Auto-start playback
      setIsPlaying(true);
    } else {
      showToastMsg(res.message || 'Failed to simulate execution', 'error');
    }
  };

  // Playback Loop
  useEffect(() => {
    if (!isPlaying) return;

    if (events.length === 0 || currentIndex >= events.length - 1) {
      setIsPlaying(false);
      return;
    }

    const intervalMs = Math.max(150, Math.floor(650 / speed));
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => {
        if (prev < events.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, events, speed]);

  // Current State Snapshot Reconstructed from Event at currentIndex
  const currentEvent = events[currentIndex] || null;
  const activeLine = currentEvent?.line || null;
  const errorLine = (trace?.status === 'FAILED' && (currentIndex === events.length - 1 || showForensics)) ? trace.errorLine : null;
  const stackFrames = currentEvent?.stackFrames || [];
  const heapObjects = currentEvent?.heapObjects || [];
  const heapArrays = currentEvent?.heapArrays || [];
  const localVariables = stackFrames.length > 0 ? stackFrames[0].localVariables : [];
  const output = currentEvent?.output || '';
  const highlightedVariable = currentEvent?.highlightedVariable || null;

  const handleReplayFailure = () => {
    setCurrentIndex(0);
    setIsPlaying(true);
    setShowForensics(false);
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl border text-xs font-semibold shadow-2xl flex items-center gap-2 animate-slide-down ${
            toast.type === 'error'
              ? 'bg-red-950/90 text-red-300 border-red-500/40 shadow-glow-error'
              : toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-glow-sm'
              : 'bg-blue-950/90 text-sky-300 border-blue-500/40 shadow-glow-sm'
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {toast.type === 'error' ? 'error' : toast.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Main Workbench Container */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 flex flex-col gap-4">
        
        {/* Forensics Panel Alert if Failure Occurred */}
        {showForensics && trace?.status === 'FAILED' && (
          <FailureForensicsPanel
            forensics={trace.failureForensics}
            errorType={trace.errorType}
            errorMessage={trace.errorMessage}
            errorLine={trace.errorLine}
            onReplayFailure={handleReplayFailure}
            onClose={() => setShowForensics(false)}
          />
        )}

        {/* Primary Split Screen: Code Editor (Left) & Runtime Canvas (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[520px]">
          
          {/* Left Column: Code Editor */}
          <div className="lg:col-span-6 h-full flex flex-col">
            <CodeEditor
              code={code}
              onChange={setCode}
              activeLine={activeLine}
              errorLine={errorLine}
              isRunning={isRunning}
              onRun={handleRun}
              onValidate={handleValidate}
              examples={examples}
              onSelectExample={handleSelectExample}
              title={title}
              onTitleChange={setTitle}
            />
          </div>

          {/* Right Column: Call Stack & Heap Memory */}
          <div className="lg:col-span-6 h-full grid grid-rows-2 gap-4">
            {/* Top Right: Call Stack */}
            <div className="h-full">
              <CallStack stackFrames={stackFrames} />
            </div>

            {/* Bottom Right: Heap Memory View */}
            <div className="h-full">
              <HeapView
                heapObjects={heapObjects}
                heapArrays={heapArrays}
                highlightedObjectId={highlightedObjectId || currentEvent?.highlightedObjectId}
              />
            </div>
          </div>
        </div>

        {/* Secondary Bottom Grid: Variables, Output, and Event Inspector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[190px]">
          <VariablesPanel
            variables={localVariables}
            highlightedVariable={highlightedVariable}
            onHoverObject={setHighlightedObjectId}
          />

          <OutputConsole output={output} />

          <EventInspector currentEvent={currentEvent} />
        </div>

        {/* Bottom Control Bar: Playback Transport & Time Travel Timeline */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-auto">
              <PlaybackControls
                currentIndex={currentIndex}
                totalEvents={events.length}
                isPlaying={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onStepForward={() => {
                  setIsPlaying(false);
                  if (currentIndex < events.length - 1) setCurrentIndex(currentIndex + 1);
                }}
                onStepBackward={() => {
                  setIsPlaying(false);
                  if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
                }}
                onRestart={() => {
                  setIsPlaying(false);
                  setCurrentIndex(0);
                }}
                onJumpToEnd={() => {
                  setIsPlaying(false);
                  if (events.length > 0) setCurrentIndex(events.length - 1);
                }}
                speed={speed}
                onSpeedChange={setSpeed}
              />
            </div>

            <div className="flex-1 w-full">
              <TimelineScrubber
                currentIndex={currentIndex}
                totalEvents={events.length}
                events={events}
                onScrub={(index) => {
                  setIsPlaying(false);
                  setCurrentIndex(index);
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
