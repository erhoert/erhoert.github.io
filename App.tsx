import React, { useState, useEffect } from 'react';
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

  // Background Color Logic based on State
  const getBackgroundClass = () => {
    switch (state.status) {
      case AppStatus.FOCUS:
        return 'bg-focus-bg text-focus-text'; // Tunnel Vision
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
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
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
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        
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
            {/* Subtle Pulse Indicator */}
            <div className="mb-12">
               <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse-slow mx-auto mb-4"></div>
               <p className="text-red-200/20 text-sm tracking-[0.3em] uppercase">Deep Work Session Active</p>
            </div>

            <Button 
              variant="danger" 
              size="xl" 
              className="bg-red-900/20 hover:bg-red-900/40 text-red-500 border-2 border-red-900/50 backdrop-blur-sm"
              onClick={actions.stopFocus}
            >
              Stop
            </Button>
            <p className="text-red-900/30 mt-8 text-sm font-mono">[Spacebar]</p>
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
