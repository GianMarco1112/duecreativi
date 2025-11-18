// Parametri
const PX_PER_SECOND = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--speed')) || 120;

const track = document.getElementById('tickerTrack');

// Duplica il contenuto finché la lunghezza totale supera 2x la larghezza della viewport
function fillTrack(trackEl) {
    const original = Array.from(trackEl.children).map(n => n.cloneNode(true));
    const vw = trackEl.parentElement.clientWidth;
    let contentWidth = trackEl.scrollWidth;

    while (contentWidth < vw * 2) {
        original.forEach(n => trackEl.appendChild(n.cloneNode(true)));
        contentWidth = trackEl.scrollWidth;
    }
    return contentWidth;
}

function startTicker() {
    // Primo, assicurati che non ci sia un'animazione precedente
    track.style.animation = 'none';

    // Riempie e calcola durata in base alla lunghezza totale
    const totalWidth = fillTrack(track);

    // Distanza da scorrere = larghezza totale del contenuto / 2 (perché abbiamo duplicati)
    const distance = totalWidth / 2;

    // Durata = distanza / velocità (px/s)
    const duration = distance / PX_PER_SECOND;

    // Imposta variabili CSS e avvia animazione
    track.style.setProperty('--scroll-distance', `-${distance}px`);
    track.style.animation = `ticker-scroll ${duration}s linear infinite`;
}

// Avvia quando i font sono caricati/layout pronto
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startTicker);
} else {
    window.addEventListener('load', startTicker);
}

// Ricalcola su resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Ripristina al contenuto originale (prima metà)
        const children = Array.from(track.children);
        const half = Math.ceil(children.length / 2);
        // Mantieni solo la prima metà (l’originale dopo il riempimento iniziale)
        while (track.children.length > half) track.removeChild(track.lastElementChild);
        startTicker();
    }, 150);
});

// Navbar scroll effect
document.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
