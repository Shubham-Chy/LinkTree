// === CONFIGURATION ===
const config = {
  loaderSpeed: 30,
  particleCount: 60,
  audioVolume: 0.1,
};

// === DOM ELEMENTS ===
const loader = document.getElementById("loader");
const progressBar = document.getElementById("progress-bar");
const percentText = document.getElementById("loader-percent");
const loaderText = document.querySelector(".loader-text");
const app = document.getElementById("app");
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

// === AUDIO SETUP ===
const audio = document.getElementById("bg-music");
const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");
const musicContainer = document.querySelector(".music-player");

audio.volume = config.audioVolume;

let isPlaying = false;
let audioContext, analyser, dataArray, source;
let visualizerInitialized = false;

// === 1. LOADING LOGIC ===
let progress = 0;

function initLoader() {
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 1;
    if (progress > 100) progress = 100;

    progressBar.style.width = `${progress}%`;
    percentText.innerText = `${progress}%`;

    if (progress === 100) {
      clearInterval(interval);
      promptUserClick();
    }
  }, config.loaderSpeed);
}

function promptUserClick() {
  percentText.innerText = "READY";
  percentText.classList.add("blink");
  progressBar.style.boxShadow = "0 0 15px #00ff00";
  progressBar.style.backgroundColor = "#00ff00";

  loaderText.innerHTML = `<span style="color:#00ff00; font-weight:bold; letter-spacing: 2px;">> SYSTEM READY. CLICK TO INITIALIZE.</span>`;

  document.addEventListener("click", enterSite, { once: true });
}

function enterSite() {
  initAudioContext();
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        updatePlayState(true);
      })
      .catch((err) => {
        console.error("Audio playback error:", err);
      });
  }

  loader.style.opacity = "0";
  loader.style.pointerEvents = "none";
  app.classList.remove("hidden");
}

// === 2. AUDIO VISUALIZER ===
function initAudioContext() {
  if (visualizerInitialized) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    source = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    setupVisualizerCanvas();
    visualizerInitialized = true;
    drawVisualizer();
  } catch (e) {
    console.warn("Web Audio API issue:", e);
  }
}

let visCanvas, visCtx;
function setupVisualizerCanvas() {
  const musicInfo = document.querySelector(".music-info");
  visCanvas = document.createElement("canvas");
  visCanvas.width = 50;
  visCanvas.height = 20;
  visCanvas.style.marginBottom = "4px";
  visCanvas.style.opacity = "0.8";

  musicInfo.insertBefore(visCanvas, musicInfo.firstChild);
  visCtx = visCanvas.getContext("2d");
}

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);
  if (!visualizerInitialized || !isPlaying) return;

  analyser.getByteFrequencyData(dataArray);
  visCtx.clearRect(0, 0, visCanvas.width, visCanvas.height);

  const barWidth = visCanvas.width / 6;
  let x = 0;

  for (let i = 0; i < 6; i++) {
    const value = dataArray[i + 2];
    const barHeight = (value / 255) * visCanvas.height;

    visCtx.fillStyle = `rgba(255, 255, 255, 0.9)`;
    visCtx.fillRect(x, visCanvas.height - barHeight, barWidth - 2, barHeight);

    x += barWidth;
  }
}

// === 3. PLAYBACK CONTROLS ===
function updatePlayState(playing) {
  if (playing) {
    playIcon.setAttribute("data-lucide", "pause");
    musicContainer.classList.add("playing");
    isPlaying = true;
  } else {
    playIcon.setAttribute("data-lucide", "play");
    musicContainer.classList.remove("playing");
    isPlaying = false;
    if (visCtx) visCtx.clearRect(0, 0, visCanvas.width, visCanvas.height);
  }
  lucide.createIcons();
}

playBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (isPlaying) {
    audio.pause();
    updatePlayState(false);
  } else {
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume();
    }
    audio.play();
    updatePlayState(true);
  }
});

// === 4. VISUALS (Cursor & Particles) ===
document.addEventListener("mousemove", (e) => {
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;
  setTimeout(() => {
    cursorRing.style.left = `${e.clientX}px`;
    cursorRing.style.top = `${e.clientY}px`;
  }, 50);
});

const interactiveElements = document.querySelectorAll("a, button");
interactiveElements.forEach((el) => {
  el.addEventListener("mouseenter", () =>
    document.body.classList.add("hovering")
  );
  el.addEventListener("mouseleave", () =>
    document.body.classList.remove("hovering")
  );
});

const canvas = document.getElementById("canvas-bg");
const ctx = canvas.getContext("2d");
let width, height;
const petals = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class Petal {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 1;
    this.speedY = Math.random() * 1 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.3;
  }
  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.y * 0.005) + this.speedX;
    if (this.y > height) {
      this.y = -10;
      this.x = Math.random() * width;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  resize();
  for (let i = 0; i < config.particleCount; i++) {
    petals.push(new Petal());
  }
  animate();
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  petals.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);

// === 5. SECURITY (DISABLE RIGHT CLICK) ===
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  if (
    e.ctrlKey &&
    (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S")
  ) {
    e.preventDefault();
  }
});

// INIT
initParticles();
initLoader();
