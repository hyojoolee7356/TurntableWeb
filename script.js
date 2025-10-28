// ===== Intro → Inside (타이밍 조절 포함) =====
document.addEventListener('DOMContentLoaded', () => {
  const intro = document.querySelector('.intro');
  const inside = document.querySelector('.inside');
  const closed = document.getElementById('turntablec');
  const open = document.getElementById('turntablep');
  const exit = document.getElementById('exit-btn');
  if (!intro || !inside || !closed || !open) return;

  // 타이밍 (ms) — 숫자만 바꾸면 속도 조절 가능
  const DUR_OPEN_FADE = 1400; // 닫힘→열림 스르륵
  const OPEN_HOLD = 2000; // 열림 그대로 보여주는 시간
  const DUR_BLACKOUT = 1600; // 암흑으로 서서히
  const DUR_INSIDE_FADE = 900; // inside 스르륵 등장 (CSS와 맞춤)

  let locked = false;

  function goInside() {
    if (locked) return;
    locked = true;

    // 1) 닫힘 사라짐 → 열림 등장(천천히)
    intro.classList.add('fade-closed');
    setTimeout(() => intro.classList.add('show-open'), 100);

    // 2) 열림 상태 유지 후, 화면 전체 암흑으로 서서히
    setTimeout(() => {
      intro.classList.add('blackout'); // ::after 오버레이가 1.6s로 천천히 올라옴
    }, DUR_OPEN_FADE + OPEN_HOLD);

    // 3) 암흑 완료 직전 inside를 켜고 스르륵 보이기
    setTimeout(() => {
      intro.style.display = 'none';
      inside.style.display = 'flex';
      // 다음 프레임에 show 붙여서 트랜지션 작동
      requestAnimationFrame(() => inside.classList.add('show'));
    }, DUR_OPEN_FADE + OPEN_HOLD + DUR_BLACKOUT - 50);
  }

  // 인트로 어디를 눌러도 진행 (이미지에도 중복 연결)
  intro.style.cursor = 'pointer';
  intro.addEventListener('click', goInside);
  closed.addEventListener('click', goInside);
  open.addEventListener('click', goInside);

  // 비상: Enter로도 진행
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') goInside();
  });

  // ===== INSIDE: 트랙 전환(이미지 교체 + 바늘 각도) =====
  document.addEventListener('DOMContentLoaded', () => {
    const intro = document.querySelector('.intro');
    const inside = document.getElementById('inside');
    const panel = document.getElementById('panel');
    const lp = document.getElementById('lp');
    const needle = document.getElementById('needle');
    const buttons = Array.from(document.querySelectorAll('.track-btn'));
    const exitBtn = document.getElementById('exit-btn');

    if (!inside || !panel || !lp || !needle || buttons.length === 0) return;

    // 트랙 메타 — 파일명은 네가 준비한 것으로 그대로 바꿔도 됨
    const TRACKS = {
      default: {
        panelBg: 'images/bg_default.jpg',
        lpImg: 'images/lp_default.png',
        deg: 9,
      },
      leisure: {
        panelBg: 'images/bg_leisure.jpg',
        lpImg: 'images/lp_leisure.png',
        deg: 38,
      },
      calm: {
        panelBg: 'images/bg_calm.jpg',
        lpImg: 'images/lp_calm.png',
        deg: 38,
      },
      memory: {
        panelBg: 'images/bg_memory.jpg',
        lpImg: 'images/lp_memory.png',
        deg: 38,
      },
      nature: {
        panelBg: 'images/bg_nature.jpg',
        lpImg: 'images/lp_nature.png',
        deg: 42,
      },
    };

    // 초기 상태(기본 화면)
    function applyTrack(meta) {
      panel.style.backgroundImage = `url('${meta.panelBg}')`;
      lp.src = meta.lpImg;
      document.documentElement.style.setProperty(
        '--needle-angle',
        meta.deg + 'deg'
      );
    }
    applyTrack(TRACKS.default);

    // 버튼 클릭 → 해당 트랙으로 전환
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        console.log(
          'buttons found:',
          buttons.length,
          buttons.map?.((b) => b.dataset.track)
        );
        const key = btn.dataset.track;
        const meta = TRACKS[key];
        if (!meta) return;

        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        applyTrack(meta);
      });
    });
  });

  // Exit → 인트로 초기상태로 복귀
  exit.addEventListener('click', () => {
    inside.classList.remove('show');
    inside.style.display = 'none';

    intro.style.display = 'flex';
    intro.classList.remove('fade-closed', 'show-open', 'blackout');
    // 상태 리셋
    locked = false;
  });

  const TRACKS = {
    default: {
      panelBg: 'images/bg_default.jpg',
      lpImg: 'images/lp_default.png',
      deg: 8,
      audio: null,
      textImg: 'images/text/text_default.png',
    },
    leisure: {
      panelBg: 'images/bg_leisure.jpg',
      lpImg: 'images/lp_leisure.png',
      deg: 11,
      audio: 'audio/leisure.mp3',
      textImg: 'images/text/text_leisure.png',
    },
    calm: {
      panelBg: 'images/bg_calm.jpg',
      lpImg: 'images/lp_calm.png',
      deg: 16,
      audio: 'audio/calm.mp3',
      textImg: 'images/text/text_calm.png',
    },
    memory: {
      panelBg: 'images/bg_memory.jpg',
      lpImg: 'images/lp_memory.png',
      deg: 21,
      audio: 'audio/memory.mp3',
      textImg: 'images/text/text_memory.png',
    },
    nature: {
      panelBg: 'images/bg_nature.jpg',
      lpImg: 'images/lp_nature.png',
      deg: 25,
      audio: 'audio/nature.mp3',
      textImg: 'images/text/text_nature.png',
    },
  };

  // ===== 트랙 텍스트!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! PNG 전환 =====
  const textImgEl = document.getElementById('track-text-img');
  if (textImgEl) {
    textImgEl.classList.remove('show'); // 먼저 숨김
    textImgEl.style.opacity = 0;

    // 새 이미지 설정
    textImgEl.src = TRACKS[key].textImg;

    // 1.5초 후 서서히 나타남
    setTimeout(() => {
      textImgEl.classList.add('show');
    }, 1500);
  }

  const _player = new Audio();
  _player.preload = 'auto';
  _player.loop = true;

  let _currentKey = null;

  function _applyVisual(meta) {
    const panel = document.getElementById('panel');
    const lp = document.getElementById('lp');
    if (panel) panel.style.backgroundImage = `url('${meta.panelBg}')`;
    if (lp) lp.src = meta.lpImg;
    document.documentElement.style.setProperty(
      '--needle-angle',
      meta.deg + 'deg'
    );

    // 버튼 active 표시
    document.querySelectorAll('.inside .track-btn').forEach((b) => {
      b.classList.toggle(
        'active',
        b.getAttribute('onclick')?.includes(metaKey)
      );
    });
  }

  function applyText(key) {
    const t = TRACK_TEXTS[key] || TRACK_TEXTS.base || { en: '', ko: '' };
    const el = document.getElementById('track-text');
    if (!el) return;
    el.innerHTML = `<span class="t-en">${t.en}</span><br><span class="t-ko">${t.ko}</span>`;
  }

  // 부드러운 오디오 전환(간단 페이드)
  function _fadeTo(src) {
    if (!_player.src) {
      _player.src = src;
      _player.volume = 1;
      _player.currentTime = 0;
      _player.play().catch(() => {});
      return;
    }
    const FADE = 200;
    const start = _player.volume ?? 1;
    const t0 = performance.now();
    const out = (t) => {
      const p = Math.min(1, (t - t0) / FADE);
      if (p < 1) return requestAnimationFrame(out);
      _player.pause();
      _player.src = src;
      _player.currentTime = 0;
      _player.volume = 0;
      _player.play().catch(() => {});
      const t1 = performance.now();
      const inc = (ti) => {
        const p2 = Math.min(1, (ti - t1) / FADE);
        _player.volume = p2;
        if (p2 < 1) requestAnimationFrame(inc);
      };
      requestAnimationFrame(inc);
    };
    requestAnimationFrame(out);
  }

  // ===== 전역으로 노출: HTML onclick이 직접 호출 =====
  window.setTrack = function (metaKey) {
    const meta = TRACKS[metaKey];
    if (!meta) {
      console.warn('[unknown track]', metaKey);
      return;
    }

    _currentKey = metaKey;
    // 비주얼
    const panel = document.getElementById('panel');
    const lp = document.getElementById('lp');
    if (panel) panel.style.backgroundImage = `url('${meta.panelBg}')`;
    if (lp) lp.src = meta.lpImg;
    document.documentElement.style.setProperty(
      '--needle-angle',
      meta.deg + 'deg'
    );
    document.getElementById('lp')?.classList.add('lp-spin');

    // 버튼 active
    document
      .querySelectorAll('.inside .track-btn')
      .forEach((b) => b.classList.remove('active'));
    // (선택) 마지막 클릭된 버튼 강조
    // 이벤트 위임이 아니므로 closest 못 쓰니 생략해도 됨

    // 오디오
    _fadeTo(meta.audio);
    console.log('[track]', metaKey);
  };

  window.exitInside = function () {
    const inside = document.getElementById('inside');
    const intro = document.querySelector('.intro');
    if (inside) inside.style.display = 'none';
    if (intro) intro.style.display = 'flex';
    try {
      _player.pause();
    } catch {}
    console.log('[exit -> intro]');
    document.getElementById('lp')?.classList.remove('lp-spin');
    document.getElementById('track-text-img').classList.remove('show');
  };

  // 기본 트랙 세팅(원하면 바꿔도 됨)
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('inside')) {
      setTrack('default');
    }
  });
});
