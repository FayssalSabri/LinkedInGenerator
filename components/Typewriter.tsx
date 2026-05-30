'use client';

import { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export default function Typewriter({
  text,
  speed = 10,
  onComplete,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const displayedText = text.slice(0, index);

  useEffect(() => {
    if (index >= text.length) {
      onComplete?.();
      return;
    }

    const timeout = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, text, speed, onComplete, text.length]);

  return <>{displayedText}</>;
}
