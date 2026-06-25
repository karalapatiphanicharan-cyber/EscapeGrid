import { useEffect } from 'react';

export const useKeyboard = (onKeyDown: (key: string) => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      const validKeys = [
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'w', 'a', 's', 'd',
        'W', 'A', 'S', 'D'
      ];

      if (validKeys.includes(key)) {
        event.preventDefault();
        onKeyDown(key.toLowerCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyDown]);
};
