const lights = Array.prototype.slice.call(document.querySelectorAll('.light-strip'));
const time = document.querySelector('.time');
const best = document.querySelector('.best span');
let bestTime = Number(localStorage.getItem('best')) || Infinity;
let started = false;
let lightsOutTime = 0;
let raf;
let timeout;


function formatTime(time) {
  time = Math.round(time);
  let outputTime = time / 1000;
  if (time < 10000) {
    outputTime = '0' + outputTime;
  }
  while (outputTime.length < 6) {
    outputTime += '0';
  }
  return outputTime;
}

if (bestTime != Infinity) {
  best.textContent = formatTime(bestTime);
}

function start() {
  for (const light of lights) {
    light.classList.remove('on');
  }

  time.textContent = '00.000';
  time.classList.remove('anim');

  lightsOutTime = 0;
  let lightsOn = 0;
  const lightsStart = performance.now();

  function frame(now) {
    const toLight = Math.floor((now - lightsStart) / 1000) + 1;

    if (toLight > lightsOn) {
      for (const light of lights.slice(0, toLight)) {
        light.classList.add('on');
      }
    }

    if (toLight < 5) {
      raf = requestAnimationFrame(frame);
    }
    else {
      const delay = Math.random() * 4000 + 1000;
      timeout = setTimeout(() => {
        for (const light of lights) {
          light.classList.remove('on');
        }
        lightsOutTime = performance.now();
      }, delay);
    }
  }

  raf = requestAnimationFrame(frame);
}

// Function to update badge color with the size change animation
function updateBadgeColor() {
  var badge = document.getElementById('floating-badge');

  badge.style.transition = 'transform 0.5s ease, opacity 0.5s ease'; // Smooth transition for size change
  badge.classList.add('size-change');

  // Remove animation class after the animation ends
  setTimeout(function() {
      badge.classList.remove('size-change');
  }, 500); // 500 milliseconds
}

// Call updateBadgeColor initially
updateBadgeColor();

// Interval to update badge color and trigger animation every 3 seconds
setInterval(updateBadgeColor, 3000); // Update every 3 seconds



function end(timeStamp) {
  cancelAnimationFrame(raf);
  clearTimeout(timeout);

  if (!lightsOutTime) {
    time.textContent = "Jump Start!";
    time.classList.add('anim');
    return;
  }
  else {
    const thisTime = timeStamp - lightsOutTime;
    time.textContent = formatTime(thisTime);

    if (thisTime < bestTime) {
      bestTime = thisTime;
      best.textContent = time.textContent;
      localStorage.setItem('best', thisTime);
    }

    time.classList.add('anim');
  }
}

function tap(event) {
  let timeStamp = performance.now();

  if (!started && event.target && event.target.closest && event.target.closest('a')) return;
  event.preventDefault();

  if (started) {
    end(timeStamp);
    started = false;
  }
  else {
    start();
    started = true;
  }
}

addEventListener('touchstart', tap, {passive: false});

addEventListener('mousedown', event => {
  if (event.button === 0) tap(event);
}, {passive: false});

addEventListener('keydown', event => {
  if (event.key == ' ') tap(event);
}, {passive: false});

