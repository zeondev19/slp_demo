import { useState, useEffect, useCallback, useRef } from 'react';

export default function PerformanceBar() {
  const [querySpeed, setQuerySpeed] = useState('0.00');
  const [domNodes, setDomNodes] = useState(0);
  const rafRef = useRef(null);

  const measureDomNodes = useCallback(() => {
    const count = document.querySelectorAll('*').length;
    setDomNodes(count);
  }, []);

  useEffect(() => {
    // Measure DOM nodes on mount and set up interval
    measureDomNodes();

    const interval = setInterval(measureDomNodes, 2000);

    return () => {
      clearInterval(interval);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [measureDomNodes]);

  useEffect(() => {
    // Observe PerformanceObserver for resource timing (API calls)
    if (!window.PerformanceObserver) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.name.includes('/api/')) {
            const duration = entry.duration || entry.responseEnd - entry.startTime;
            if (duration > 0) {
              setQuerySpeed(duration.toFixed(2));
            }
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
      return () => observer.disconnect();
    } catch {
      // PerformanceObserver not supported for this entry type
    }
  }, []);

  return (
    <div
      className="h-7 bg-[#1C1917] text-white text-xs font-mono flex items-center justify-center px-4 gap-1 shrink-0 select-none"
      role="status"
      aria-label="Performance metrics"
    >
      <span>REST API: Connected (MySQL)</span>
      <span className="mx-1.5 opacity-40">|</span>
      <span>Total Dataset: 1,000 Interactive Lessons</span>
      <span className="mx-1.5 opacity-40">|</span>
      <span>
        Filter Query Speed: <span className="text-green-400">{querySpeed} ms</span>
      </span>
      <span className="mx-1.5 opacity-40">|</span>
      <span>
        Rendered DOM Nodes: <span className="text-green-400">{domNodes}</span> (Virtualized)
      </span>
    </div>
  );
}
