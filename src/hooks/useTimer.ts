import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (isActive: boolean) => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1000);
    }, 1000);
  }, []);

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    pauseTimer();
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
