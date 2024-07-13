document.addEventListener('DOMContentLoaded', function() {
  const lights = Array.from(document.querySelectorAll('.light-strip'));
  const timeDisplay = document.querySelector('.time');
  const bestTimeDisplay = document.querySelector('.best span');
  let bestTime = Number(localStorage.getItem('best')) || Infinity;
  let started = false;
  let lightsOutTime = 0;
  let raf, timeout;
  let reduceTime = false; // New variable to track if time should be reduced

  if (bestTime !== Infinity) {
    bestTimeDisplay.textContent = formatTime(bestTime);
  }

  function formatTime(time) {
    time = Math.round(time) / 1000;
    return time.toFixed(3).padStart(6, '0');
  }

  function start() {
    lights.forEach(light => light.classList.remove('on'));
    timeDisplay.textContent = '00.000';
    timeDisplay.classList.remove('anim');
    lightsOutTime = 0;
    reduceTime = false; // Reset the time reduction flag

    const lightsStart = performance.now();
    let lightsOn = 0;

    function frame(now) {
      const toLight = Math.floor((now - lightsStart) / 1000) + 1;

      if (toLight > lightsOn) {
        lights.slice(0, toLight).forEach(light => light.classList.add('on'));
      }

      if (toLight < 5) {
        raf = requestAnimationFrame(frame);
      } else {
        const delay = Math.random() * 4000 + 1000;
        timeout = setTimeout(() => {
          lights.forEach(light => light.classList.remove('on'));
          lightsOutTime = performance.now();
        }, delay);
      }
    }

    raf = requestAnimationFrame(frame);
  }

  function end(timeStamp) {
    cancelAnimationFrame(raf);
    clearTimeout(timeout);

    if (!lightsOutTime) {
      timeDisplay.textContent = "Jump Start!";
      timeDisplay.classList.add('anim');
      return;
    }

    let thisTime = timeStamp - lightsOutTime;
    if (reduceTime) {
      thisTime -= 200; // Reduce the time by 200ms if 'a' was pressed
    }

    timeDisplay.textContent = formatTime(thisTime);

    if (thisTime < bestTime) {
      bestTime = thisTime;
      bestTimeDisplay.textContent = timeDisplay.textContent;
      localStorage.setItem('best', thisTime);
    }

    timeDisplay.classList.add('anim');
  }

  function tap(event) {
    const timeStamp = performance.now();

    if (!started && event.target.closest && event.target.closest('a')) return;
    event.preventDefault();

    if (started) {
      end(timeStamp);
      started = false;
    } else {
      start();
      started = true;
    }
  }

  function handleKeyPress(event) {
    if (event.key === ' ') {
      tap(event);
    } else if (event.key === 'a' && started) {
      reduceTime = true; // Set the flag to reduce time
    }
  }

  addEventListener('touchstart', tap, { passive: false });
  addEventListener('mousedown', event => {
    if (event.button === 0) tap(event);
  }, { passive: false });
  addEventListener('keydown', handleKeyPress, { passive: false });

  document.getElementById('floating-badge').addEventListener('click', function() {
    window.open('https://www.youtube.com/watch?v=xvFZjo5PgG0', '_blank');
  });

  function updateBadgeColor() {
    const badge = document.getElementById('floating-badge');
    badge.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    badge.classList.add('size-change');
    setTimeout(() => {
      badge.classList.remove('size-change');
    }, 500);
  }

  updateBadgeColor();
  setInterval(updateBadgeColor, 3000);
});
