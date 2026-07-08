//change something, redeploy

document.querySelectorAll('.particle-hover').forEach(el => {
  const spots = el.querySelectorAll('.particle-spot');

  el.addEventListener('mouseenter', () => {
    spots.forEach(spot => {
      const x = Math.random() * el.offsetWidth;
      const y = Math.random() * el.offsetHeight;
      const dx = (Math.random() - 0.5) * 40;
      const dy = (Math.random() - 0.5) * 40;
      const size = 4 + Math.random() * 3;

      spot.style.width = spot.style.height = size + 'px';
      spot.style.left = x + 'px';
      spot.style.top = y + 'px';
      spot.style.backgroundColor = spot.style.backgroundColor; // keep SCSS color

      spot.animate([
        { transform: 'translate(0,0)', opacity: 0.7 },
        { transform: `translate(${dx}px,${dy}px)`, opacity: 0 }
      ], {
        duration: 800 + Math.random() * 400,
        iterations: 1,
        fill: 'forwards'
      });
    });
  });
});

