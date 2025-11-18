// Parametri
const PX_PER_SECOND =
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--speed")
  ) || 120;

const PX_PER_SECOND_SINGLE =
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--speed-single"
    )
  ) || 120;

// Funzione generica per riempire track
function fillTrack(trackEl) {
  if (!trackEl) return 0;

  const original = Array.from(trackEl.children).map((n) => n.cloneNode(true));
  const vw = trackEl.parentElement.clientWidth;
  let contentWidth = trackEl.scrollWidth;

  while (contentWidth < vw * 2) {
    original.forEach((n) => trackEl.appendChild(n.cloneNode(true)));
    contentWidth = trackEl.scrollWidth;
  }
  return contentWidth;
}

// Funzione generica per avviare ticker
function startTicker(trackEl, speed, animationName, distanceVar) {
  if (!trackEl) return;

  trackEl.style.animation = "none";
  const totalWidth = fillTrack(trackEl);
  const distance = totalWidth / 2;
  const duration = distance / speed;

  trackEl.style.setProperty(distanceVar, `-${distance}px`);
  trackEl.style.animation = `${animationName} ${duration}s linear infinite`;
}

// Inizializza tutti i ticker
function initTickers() {
  const track = document.getElementById("tickerTrack");
  const trackSingle = document.getElementById("tickerSingleTrack");

  if (track) {
    startTicker(track, PX_PER_SECOND, "ticker-scroll", "--scroll-distance");
  }

  if (trackSingle) {
    startTicker(
      trackSingle,
      PX_PER_SECOND_SINGLE,
      "ticker-single-scroll",
      "--single-scroll-distance"
    );
  }
}

// Reset track per resize
function resetTrack(trackEl) {
  if (!trackEl) return;
  const children = Array.from(trackEl.children);
  const half = Math.ceil(children.length / 2);
  while (trackEl.children.length > half) {
    trackEl.removeChild(trackEl.lastElementChild);
  }
}

// Avvia quando i font sono caricati
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(initTickers);
} else {
  window.addEventListener("load", initTickers);
}

// Ricalcola su resize
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const track = document.getElementById("tickerTrack");
    const trackSingle = document.getElementById("tickerSingleTrack");

    if (track) {
      resetTrack(track);
      startTicker(track, PX_PER_SECOND, "ticker-scroll", "--scroll-distance");
    }

    if (trackSingle) {
      resetTrack(trackSingle);
      startTicker(
        trackSingle,
        PX_PER_SECOND_SINGLE,
        "ticker-single-scroll",
        "--single-scroll-distance"
      );
    }
  }, 150);
});

// Navbar scroll effect
document.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  }
});

// ========================================
// SCALING FLUIDO TRAMITE REM
// ========================================
function setRootFontSize() {
  const viewportWidth = window.innerWidth;
  const html = document.documentElement;

  // Larghezza di riferimento desktop
  const desktopWidth = 1920;
  // Font-size di riferimento desktop
  const desktopFontSize = 16;
  // Font-size minimo (per mobile molto piccoli)
  const minFontSize = 10;
  // Font-size massimo (per desktop molto grandi)
  const maxFontSize = 16;

  // Calcola scaling proporzionale
  // Usa clamp per limitare tra min e max
  let baseFontSize = (viewportWidth / desktopWidth) * desktopFontSize;

  // Applica clamp
  baseFontSize = Math.max(minFontSize, Math.min(maxFontSize, baseFontSize));

  html.style.fontSize = `${baseFontSize}px`;
}

// Inizializza
setRootFontSize();

// Aggiorna su resize
let rootFontSizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(rootFontSizeTimer);
  rootFontSizeTimer = setTimeout(setRootFontSize, 100);
});

window.addEventListener("orientationchange", () => {
  setTimeout(setRootFontSize, 100);
});
