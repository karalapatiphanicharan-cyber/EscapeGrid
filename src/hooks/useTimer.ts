import { useState, useEffect, useRef } from 'react';

export const useTimer = (isActive: boolean) => {
  const [time, setTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      startTimeRef.current = Date.now();
      interval = setInterval(() => {
        if (startTimeRef.current) {
          setTime(accumulatedTimeRef.current + (Date.now() - startTimeRef.current));
        }
      }, 10);
    } else {
      if (startTimeRef.current) {
        accumulatedTimeRef.current += Date.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const resetTimer = () => {
    setTime(0);
    startTimeRef.current = null;
    accumulatedTimeRef.current = 0;
  };

  return { time, resetTimer };
};
