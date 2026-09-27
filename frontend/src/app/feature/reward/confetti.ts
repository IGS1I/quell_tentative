/** Habit-loop reward: a burst of canvas confetti over the whole page. Resolves when it finishes. */
export function fireConfetti(durationMs = 2500): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1000';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  const colors = ['#7c9cff', '#ff8fab', '#ffd166', '#06d6a0', '#c792ea'];
  const pieces = Array.from({ length: 160 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 3,
    vx: (Math.random() - 0.5) * 16,
    vy: Math.random() * -14 - 4,
    size: 5 + Math.random() * 6,
    rot: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  return new Promise((resolve) => {
    const start = performance.now();
    const frame = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.vy += 0.35;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (t - start < durationMs) {
        requestAnimationFrame(frame);
      } else {
        canvas.remove();
        resolve();
      }
    };
    requestAnimationFrame(frame);
  });
}
