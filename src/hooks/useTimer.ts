import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (isActive: boolean) => {
  const [time, setTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  const update = useCallback(() => {
    if (startTimeRef.current !== null) {
      const now = Date.now();
      setTime(accumulatedTimeRef.current + (now - startTimeRef.current));
    }
    requestRef.current = requestAnimationFrame(update);
  }, []);

  const startTimer = useCallback(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      requestRef.current = requestAnimationFrame(update);
    }
  }, [update]);

  const pauseTimer = useCallback(() => {
    if (startTimeRef.current !== null) {
      accumulatedTimeRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    pauseTimer();
    accumulatedTimeRef.current = 0;
    setTime(0);
    if (isActive) {
      startTimer();
    }
  }, [isActive, pauseTimer, startTimer]);

  useEffect(() => {
    if (isActive) {
      startTimer();
    } else {
      pauseTimer();
    }

    return () => pauseTimer();
  }, [isActive, startTimer, pauseTimer]);

  return { time, resetTimer };
};
