(() => {
  'use strict';

  const pads = Array.from(document.querySelectorAll('.pad'));
  const startBtn = document.getElementById('startBtn');
  const levelEl = document.getElementById('level');
  const statusEl = document.getElementById('status');

  const state = {
    sequence: [],
    playerIndex: 0,
    level: 0,
    isShowing: false,
    acceptInput: false,
    gameActive: false
  };

  const timers = new Set();
  let playbackToken = 0;

  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(index, duration = 0.15) {
    if (!audioCtx) return;

    const frequencies = [329.63, 261.63, 392.0, 196.0];
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequencies[index] || 440;

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration + 0.02);
  }

  function setManagedTimeout(callback, delay) {
    const id = window.setTimeout(() => {
      timers.delete(id);
      callback();
    }, delay);

    timers.add(id);
    return id;
  }

  function clearManagedTimers() {
    for (const id of timers) {
      clearTimeout(id);
    }
    timers.clear();
  }

  function stopPlaybackAndInput() {
    clearManagedTimers();
    playbackToken += 1;

    state.isShowing = false;
    state.acceptInput = false;

    pads.forEach((pad) => pad.classList.remove('active'));
  }

  function randomIndex() {
    return Math.floor(Math.random() * pads.length);
  }

  function updateLevel() {
    levelEl.textContent = String(state.level);
  }

  function updateStatus(text) {
    statusEl.textContent = text;
  }

  function flashPad(index, duration = 180) {
    const pad = pads[index];
    if (!pad) return;

    pad.classList.add('active');
    playTone(index, 0.12);

    setManagedTimeout(() => {
      pad.classList.remove('active');
    }, duration);
  }

  function playSequence() {
    stopPlaybackAndInput();

    const token = playbackToken;
    state.isShowing = true;
    state.acceptInput = false;
    state.playerIndex = 0;

    updateStatus('Показ последовательности...');

    let i = 0;

    function showNext() {
      if (token !== playbackToken) return;

      if (i >= state.sequence.length) {
        state.isShowing = false;
        state.acceptInput = true;
        updateStatus('Ваш ход');
        return;
      }

      const pad = pads[state.sequence[i]];
      pad.classList.add('active');
      playTone(state.sequence[i], 0.16);

      setManagedTimeout(() => {
        if (token !== playbackToken) return;

        pad.classList.remove('active');

        setManagedTimeout(() => {
          if (token !== playbackToken) return;

          i += 1;
          showNext();
        }, 250);
      }, 500);
    }

    showNext();
  }

  function nextRound() {
    if (!state.gameActive) return;

    state.level += 1;
    updateLevel();

    state.sequence.push(randomIndex());
    playSequence();
  }

  function startGame() {
    initAudio();
    stopPlaybackAndInput();

    state.sequence = [];
    state.playerIndex = 0;
    state.level = 0;
    state.gameActive = true;

    updateLevel();
    updateStatus('Игра началась');

    nextRound();
  }

  function endGame() {
    state.gameActive = false;
    state.acceptInput = false;

    stopPlaybackAndInput();

    updateStatus(`Вы дошли до уровня ${state.level}. Игра окончена.`);
  }

  function handlePadClick(event) {
    const pad = event.currentTarget;
    const index = Number(pad.dataset.index);

    if (!state.gameActive || !state.acceptInput || state.isShowing) {
      return;
    }

    flashPad(index);

    if (index === state.sequence[state.playerIndex]) {
      state.playerIndex += 1;

      if (state.playerIndex === state.sequence.length) {
        state.acceptInput = false;
        updateStatus('Верно! Следующий раунд...');

        setManagedTimeout(() => {
          if (!state.gameActive) return;
          nextRound();
        }, 700);
      } else {
        updateStatus(`Ваш ход (${state.playerIndex}/${state.sequence.length})`);
      }
    } else {
      endGame();
    }
  }

  pads.forEach((pad) => {
    pad.addEventListener('click', handlePadClick);
  });

  startBtn.addEventListener('click', startGame);

  updateLevel();
  updateStatus('Нажмите «Старт»');
})();