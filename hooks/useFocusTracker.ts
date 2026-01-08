import { useState, useEffect, useCallback, useRef } from 'react';
import { AppStatus, AppState, TagType } from '../types';
import { db } from '../db';

const STORAGE_KEY = 'focus_tracker_state';

const getInitialState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    status: AppStatus.INACTIVE,
    currentDayId: null,
    currentSessionStart: null,
    pendingSessionEnd: null
  };
};

export const useFocusTracker = () => {
  const [state, setState] = useState<AppState>(getInitialState);
  
  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const startDay = useCallback(async () => {
    const id = await db.days.add({
      date: new Date().toISOString().split('T')[0],
      startTime: Date.now()
    });
    setState(prev => ({
      ...prev,
      status: AppStatus.PAUSED,
      currentDayId: Number(id)
    }));
  }, []);

  const startFocus = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: AppStatus.FOCUS,
      currentSessionStart: Date.now()
    }));
  }, []);

  const stopFocus = useCallback(() => {
    const now = Date.now();
    setState(prev => ({
      ...prev,
      status: AppStatus.TAGGING,
      pendingSessionEnd: now
    }));
  }, []);

  const submitTag = useCallback(async (tag: TagType) => {
    if (state.currentDayId && state.currentSessionStart && state.pendingSessionEnd) {
      await db.sessions.add({
        dayId: state.currentDayId,
        startTime: state.currentSessionStart,
        endTime: state.pendingSessionEnd,
        duration: state.pendingSessionEnd - state.currentSessionStart,
        tag
      });

      setState(prev => ({
        ...prev,
        status: AppStatus.PAUSED,
        currentSessionStart: null,
        pendingSessionEnd: null
      }));
    }
  }, [state]);

  const endDay = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: AppStatus.REVIEWING
    }));
  }, []);

  const submitReview = useCallback(async (input: number, output: number) => {
    if (state.currentDayId) {
      await db.days.update(state.currentDayId, {
        endTime: Date.now(),
        inputRating: input,
        outputRating: output
      });

      setState({
        status: AppStatus.INACTIVE,
        currentDayId: null,
        currentSessionStart: null,
        pendingSessionEnd: null
      });
    }
  }, [state]);

  return {
    state,
    actions: {
      startDay,
      startFocus,
      stopFocus,
      submitTag,
      endDay,
      submitReview
    }
  };
};
