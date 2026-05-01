/**
 * A simple, dependency-free confetti effect for celebrations.
 */
export const triggerConfetti = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  // Since we couldn't install canvas-confetti via npm easily, 
  // we'll try to load it from a CDN or use a fallback.
  // For this prototype, we'll try to use the global window.confetti if available,
  // or just provide a placeholder that we can enhance later.
  
  if (typeof window !== 'undefined' && (window as any).confetti) {
    (window as any).confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d97757', '#8b5cf6', '#3b82f6', '#f59e0b']
    });
  } else {
    // Fallback: simple CSS animation or just log for now
    console.log("🎊 Celebration triggered! (Confetti placeholder)");
    // In a real app we'd inject the script or fix the npm issue.
    // Let's try to inject the script tag if not present.
    const scriptId = 'canvas-confetti-script';
    if (typeof document !== 'undefined' && !document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
      script.onload = () => {
         (window as any).confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d97757', '#8b5cf6', '#3b82f6', '#f59e0b']
        });
      };
      document.head.appendChild(script);
    }
  }
};
