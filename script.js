// === CONFIGURATION ===
const config = {
  loaderSpeed: 30,
  particleCount: 60,
  audioVolume: 0.001,
};

// === DOM ELEMENTS ===
const grid = document.getElementById("anime-grid");
const searchInput = document.getElementById("search-input");
const modal = document.getElementById("modal-overlay");
const closeModalBtn = document.getElementById("close-modal");
const loader = document.getElementById("loader");
const progressBar = document.getElementById("progress-bar");
const percentText = document.getElementById("loader-percent");
const loaderTextSpan = document.getElementById("loader-text");
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
let audioContext,
  analyser,
  dataArray,
  source,
  visualizerInitialized = false;

// Store fetched data here
let animeData = [];

// ============================
// === 1. STARTUP & FETCH ===
// ============================

// Initialize App: Fetch Data -> Render Grid -> Start Loader
function initApp() {
  // CACHE BUSTING: Add timestamp to prevent browser caching
  const timestamp = new Date().getTime();

  fetch(`data.json?v=${timestamp}`, {
    cache: "no-store", // Don't use cached version
    headers: {
      "Cache-Control": "no-cache",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log("✅ Data loaded successfully:", data.length, "items"); // Debug log
      animeData = data;
      renderGrid(animeData);
      initLoader();
    })
    .catch((error) => {
      console.error("❌ Database Error:", error);
      loaderTextSpan.innerHTML = `<span style="color:red;">DATABASE ERROR</span>`;
      percentText.style.color = "red";
    });
}

function renderGrid(data) {
  grid.innerHTML = "";

  if (data.length === 0) {
    grid.innerHTML =
      '<div style="grid-column: 1/-1; text-align: center; color: #666;">NO RECORDS FOUND.</div>';
    return;
  }

  data.forEach((anime) => {
    const card = document.createElement("div");
    card.className = "anime-card";

    const keyBtnHtml = anime.keyUrl
      ? `<a href="${anime.keyUrl}" target="_blank" rel="noopener noreferrer" class="card-key-btn" title="Get Key"><i data-lucide="key"></i> GET KEY</a>`
      : "";

    card.innerHTML = `
            <img src="${anime.image}" loading="lazy" alt="${anime.title}">
            <div class="card-overlay">
                <div class="card-title">${anime.title}</div>
                ${keyBtnHtml}
            </div>
        `;

    card.addEventListener("click", (e) => {
      if (!e.target.closest(".card-key-btn")) {
        openModal(anime);
      }
    });

    grid.appendChild(card);
  });

  lucide.createIcons();
  console.log("✅ Grid rendered with", data.length, "cards"); // Debug log
}

searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = animeData.filter((anime) =>
    anime.title.toLowerCase().includes(term)
  );
  renderGrid(filtered);
});

// ============================
// === 2. MODAL & VIDEO LOGIC ===
// ============================
function openModal(anime) {
  document.getElementById("modal-title").innerText = anime.title;
  document.getElementById("modal-id").innerText = anime.id;

  const wrapper = document.querySelector(".modal-image-wrapper");
  if (anime.youtubeId && anime.youtubeId !== "#") {
    wrapper.innerHTML = `
            <img id="modal-img" src="${anime.image}" alt="Cover">
            <div class="video-overlay" onclick="playVideo('${anime.youtubeId}')">
                <div class="play-icon-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
            </div>
        `;
  } else {
    wrapper.innerHTML = `<img id="modal-img" src="${anime.image}" alt="Cover">`;
  }

  const linksContainer = document.getElementById("modal-links");
  linksContainer.innerHTML = "";

  anime.links.forEach((link) => {
    const btn = document.createElement("a");
    btn.href = link.url;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    btn.className = "drive-btn";
    let html = `<span><i data-lucide="hard-drive"></i> ${link.label}</span>`;
    if (link.key) html += `<span class="key-btn">KEY: ${link.key}</span>`;
    btn.innerHTML = html;
    linksContainer.appendChild(btn);
  });

  lucide.createIcons();
  modal.classList.add("active");
  modal.classList.remove("hidden");
}

window.playVideo = (videoId) => {
  const bgMusic = document.getElementById("bg-music");
  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    updatePlayState(false);
  }

  const wrapper = document.querySelector(".modal-image-wrapper");
  wrapper.innerHTML = `
        <iframe class="youtube-frame" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
            allow="autoplay; encrypted-media" 
            allowfullscreen>
        </iframe>
    `;
};

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function closeModal() {
  modal.classList.remove("active");
  setTimeout(() => {
    modal.classList.add("hidden");
    document.querySelector(".modal-image-wrapper").innerHTML = "";
  }, 300);
}

// ============================
// === 3. LOADING & AUDIO ===
// ============================
let progress = 0;
function initLoader() {
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 1;
    if (progress > 100) progress = 100;
    progressBar.style.width = `${progress}%`;
    percentText.innerText = `${progress}%`;

    // Update loading text
    if (progress < 30) loaderTextSpan.innerText = "INITIALIZING...";
    else if (progress < 60) loaderTextSpan.innerText = "LOADING DATABASE...";
    else if (progress < 90) loaderTextSpan.innerText = "PREPARING INTERFACE...";
    else loaderTextSpan.innerText = "ALMOST READY...";

    if (progress === 100) {
      clearInterval(interval);
      promptUserClick();
    }
  }, config.loaderSpeed);
}

function promptUserClick() {
  percentText.innerText = "READY";
  loaderTextSpan.innerText = "CLICK TO ENTER";
  progressBar.style.boxShadow = "0 0 15px #00ff00";
  progressBar.style.backgroundColor = "#00ff00";
  document.querySelector(".loader-status").classList.add("ready");
  document.addEventListener("click", enterSite, { once: true });
}

function enterSite() {
  initAudioContext();
  const playPromise = audio.play();
  if (playPromise !== undefined)
    playPromise
      .then(() => updatePlayState(true))
      .catch((err) => console.error(err));
  loader.style.opacity = "0";
  loader.style.pointerEvents = "none";
  app.classList.remove("hidden");
}

function initAudioContext() {
  if (visualizerInitialized) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    if (audioContext.state === "suspended") audioContext.resume();
    source = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 64;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    setupVisualizerCanvas();
    visualizerInitialized = true;
    drawVisualizer();
  } catch (e) {
    console.warn("Audio Context Error:", e);
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
    if (audioContext && audioContext.state === "suspended")
      audioContext.resume();
    audio.play();
    updatePlayState(true);
  }
});

// ============================
// === 4. VISUALS (Particles & Cursor) ===
// ============================
document.addEventListener("mousemove", (e) => {
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;
  setTimeout(() => {
    cursorRing.style.left = `${e.clientX}px`;
    cursorRing.style.top = `${e.clientY}px`;
  }, 50);
});
const addHover = () => document.body.classList.add("hovering");
const removeHover = () => document.body.classList.remove("hovering");
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
  for (let i = 0; i < config.particleCount; i++) petals.push(new Petal());
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
setInterval(() => {
  document.querySelectorAll("a, button, input, .anime-card").forEach((el) => {
    el.removeEventListener("mouseenter", addHover);
    el.removeEventListener("mouseleave", removeHover);
    el.addEventListener("mouseenter", addHover);
    el.addEventListener("mouseleave", removeHover);
  });
}, 1000);

// === SECURITY ===
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && (e.key === "u" || e.key === "U")) e.preventDefault();
});

// START
initParticles();
initApp();
