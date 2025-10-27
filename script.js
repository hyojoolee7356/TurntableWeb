document.addEventListener('DOMContentLoaded', () => {
  const intro = document.querySelector('.intro');
  const inside = document.querySelector('.inside');
  const turntableWrap = document.getElementById('turntableWrap');
  const closedImg = document.getElementById('turntableClosed');
  const openImg = document.getElementById('turntableOpen');
  let locked = false;

  turntableWrap.addEventListener('click', async () => {
    if (locked) return;
    locked = true;

    // 닫힌 테이블 천천히 사라짐
    intro.classList.add('fade-closed');

    // 1초 후 열린 테이블 등장
    setTimeout(() => {
      intro.classList.add('show-open');
    }, 1000);

    // 열린 테이블 충분히 보여줌 (감성 유지)
    setTimeout(() => {
      intro.classList.add('blackout');
    }, 2500); // 암전 시작

    // 암전 후 메인 전환
    setTimeout(() => {
      intro.style.display = 'none';
      inside.style.opacity = 1;
      inside.style.pointerEvents = 'auto';
    }, 4000);
  });

  // Exit 버튼
  document.getElementById('exit-btn').addEventListener('click', () => {
    window.location.reload();
  });
});
