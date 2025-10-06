const turntable = document.getElementById('turntable');
const intro = document.querySelector('.intro');
const inside = document.querySelector('.inside');
const exitBtn = document.getElementById('exit-btn');
const trackBtns = document.querySelectorAll('.track-btn');
const needle = document.getElementById('needle');
const effect = document.getElementById('effect');

turntable.addEventListener('click', () => {
  intro.style.opacity = 0;
  setTimeout(() => {
    intro.style.display = 'none';
    inside.style.opacity = 1;
    inside.style.pointerEvents = 'auto';
  }, 1000);
});

exitBtn.addEventListener('click', () => {
  inside.style.opacity = 0;
  inside.style.pointerEvents = 'none';
  setTimeout(() => {
    intro.style.display = 'flex';
    intro.style.opacity = 1;
  }, 500);
});

trackBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const track = btn.getAttribute('data-track');
    const angles = { leisure: -30, calm: -10, memory: 10, nature: 30 };
    needle.style.transform = `rotate(${angles[track]}deg)`;
    effect.className = 'effect ' + track;

    // 음악 재생
    const audio = new Audio(`audio/${track}.mp3`);
    audio.play();
  });
});
