import React, { useState, useEffect, useRef } from 'react';
import { useFocusTracker } from './hooks/useFocusTracker';
import { AppStatus } from './types';
import { Button } from './components/Button';
import { TagModal } from './components/TagModal';
import { ReviewModal } from './components/ReviewModal';
import { Analytics } from './components/Analytics';
import { getGreeting } from './utils';
import { BarChart2, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const { state, actions } = useFocusTracker();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const pauseStartRef = useRef<number | null>(null);
  
  // Keyboard Shortcut (Spacebar) Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !showAnalytics) {
        // Prevent default scrolling
        e.preventDefault();
        
        switch (state.status) {
          case AppStatus.INACTIVE:
            actions.startDay();
            break;
          case AppStatus.PAUSED:
            actions.startFocus();
            break;
          case AppStatus.FOCUS:
            actions.stopFocus();
            break;
          default:
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.status, actions, showAnalytics]);

  useEffect(() => {
    if (state.status === AppStatus.PAUSED) {
      pauseStartRef.current = Date.now();
      setNow(Date.now());
    }
  }, [state.status]);

  useEffect(() => {
    if (state.status !== AppStatus.FOCUS && state.status !== AppStatus.PAUSED) {
      return;
    }

    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(id);
  }, [state.status]);

  const formatTimer = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (value: number) => String(value).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const focusElapsedMs =
    state.status === AppStatus.FOCUS && state.currentSessionStart
      ? now - state.currentSessionStart
      : 0;
  const pauseElapsedMs =
    state.status === AppStatus.PAUSED && pauseStartRef.current
      ? now - pauseStartRef.current
      : 0;

  // Background Color Logic based on State
  const getBackgroundClass = () => {
    switch (state.status) {
      case AppStatus.FOCUS:
        return 'bg-focus-bg text-focus-text transition-colors duration-700';
      case AppStatus.PAUSED:
      case AppStatus.TAGGING:
        return 'bg-paused-bg text-paused-text transition-colors duration-700';
      default:
        return 'bg-inactive-bg text-inactive-text transition-colors duration-700';
    }
  };

  if (showAnalytics) {
    return <Analytics onClose={() => setShowAnalytics(false)} />;
  }

  return (
    <div className={`min-h-screen w-full flex flex-col relative ${getBackgroundClass()}`}>
      
      {/* Top Bar (Hidden in Focus Mode) */}
      {state.status !== AppStatus.FOCUS && (
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
          <h1 className="text-xl font-bold tracking-tight opacity-50">FocusFlow</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowAnalytics(true)}
              className="p-3 rounded-full hover:bg-black/5 transition-colors"
              title="Analytics"
            >
              <BarChart2 size={24} />
            </button>
            {state.status === AppStatus.PAUSED && (
              <button 
                onClick={actions.endDay}
                className="p-3 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                title="End Day"
              >
                <LogOut size={24} />
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Interaction Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-0">
        
        {/* INACTIVE STATE */}
        {state.status === AppStatus.INACTIVE && (
          <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center gap-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-light text-gray-400">{getGreeting()}</h2>
              <p className="text-gray-500">Ready for deep work?</p>
            </div>
            <Button variant="primary" size="xl" onClick={actions.startDay}>
              Start Day
            </Button>
            <p className="text-sm text-gray-400 mt-4 font-mono">[Spacebar]</p>
          </div>
        )}

        {/* PAUSED STATE */}
        {state.status === AppStatus.PAUSED && (
          <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center gap-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-medium text-blue-900/50">Resting / Idle</h2>
              <p className="text-blue-900/40">Enter the flow state when ready.</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-blue-900/40">
              <span className="text-xs uppercase tracking-[0.35em] opacity-60">Pause Timer</span>
              <span className="text-2xl font-mono tabular-nums tracking-widest transition-opacity duration-700">
                {formatTimer(pauseElapsedMs)}
              </span>
            </div>
            <Button 
              variant="primary" 
              size="xl" 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
              onClick={actions.startFocus}
            >
              Focus
            </Button>
            <p className="text-sm opacity-50 font-mono">[Spacebar]</p>
          </div>
        )}

        {/* FOCUS STATE */}
        {state.status === AppStatus.FOCUS && (
          <div className="flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-1000">
            <div className="absolute inset-0 pointer-events-none -z-10">
              <div className="absolute -inset-24 bg-[radial-gradient(circle_at_50%_40%,rgba(255,214,179,0.9),rgba(255,214,179,0.25),transparent_65%)] blur-3xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,232,210,0.65),transparent_55%)]"></div>
            </div>
            {/* Subtle Pulse Indicator */}
            <div className="mb-12">
               <div className="w-4 h-4 bg-amber-400 rounded-full animate-pulse-slow mx-auto mb-4"></div>
               <p className="text-amber-900/60 text-sm tracking-[0.3em] uppercase">Deep Work Session Active</p>
            </div>
            <div className="mb-10 flex flex-col items-center gap-2 text-amber-900/70">
              <span className="text-xs uppercase tracking-[0.4em] opacity-60">Focus Timer</span>
              <span className="text-3xl font-mono tabular-nums tracking-widest transition-opacity duration-700">
                {formatTimer(focusElapsedMs)}
              </span>
            </div>

            <Button 
              variant="secondary" 
              size="xl" 
              className="bg-[radial-gradient(circle_at_30%_20%,rgba(255,248,237,0.95),rgba(253,236,212,0.9),rgba(246,220,189,0.9)),linear-gradient(135deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_42%),linear-gradient(45deg,rgba(120,53,15,0.06)_0%,rgba(120,53,15,0)_55%)] hover:bg-[radial-gradient(circle_at_30%_20%,rgba(255,252,245,0.98),rgba(253,236,212,0.95),rgba(244,210,170,0.9)),linear-gradient(135deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_42%),linear-gradient(45deg,rgba(120,53,15,0.07)_0%,rgba(120,53,15,0)_55%)] text-amber-950 border border-amber-300/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_16px_28px_-20px_rgba(120,53,15,0.6)] ring-1 ring-amber-200/60 font-['Cormorant_Garamond',serif] tracking-[0.45em] uppercase"
              onClick={actions.stopFocus}
            >
              Stop
            </Button>
            <p className="text-amber-900/70 mt-8 text-sm font-mono">[Spacebar]</p>
          </div>
        )}
      </main>

      {/* Modals */}
      {state.status === AppStatus.TAGGING && (
        <TagModal onSelect={actions.submitTag} />
      )}

      {state.status === AppStatus.REVIEWING && (
        <ReviewModal onSubmit={actions.submitReview} />
      )}
    </div>
  );
};

export default App;
