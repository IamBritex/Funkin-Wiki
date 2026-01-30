// --- 1. DICCIONARIO DE TRADUCCIONES ---
const translations = {
    es: {
        "hero-badge": "No Oficial",
        "hero-title": "Documentación V-Slice",
        "hero-subtitle": "Guía de referencia comunitaria para entender la estructura y modding de Friday Night Funkin' (V-Slice).",
        "search-placeholder": "Buscar archivo o carpeta (ej. assets/songs)...",
        
        "card-1-title": "Estructura de Archivos",
        "card-1-desc": "Aprende dónde colocar tus canciones, imágenes y data. Entiende la jerarquía assets/ y mods/.",
        
        "card-2-title": "Scripting (HScript)",
        "card-2-desc": "Próximamente: Guía de eventos y scripts en Haxe para niveles personalizados.",
        
        "card-3-title": "Arte y Sprites",
        "card-3-desc": "Próximamente: Cómo optimizar hojas de sprites XML y animaciones.",
        
        "card-4-title": "Audio y Charts",
        "card-4-desc": "Próximamente: Formatos de audio soportados y JSONs de chart.",
        
        "card-5-title": "Compilación",
        "card-5-desc": "Próximamente: Guía para compilar el código fuente del juego.",
        
        "card-6-title": "Recursos",
        "card-6-desc": "Próximamente: Herramientas de la comunidad y enlaces útiles.",
        
        "no-results": "No se encontraron resultados para"
    },
    en: {
        "hero-badge": "Unofficial",
        "hero-title": "V-Slice Documentation",
        "hero-subtitle": "Community reference guide to understand file structure and modding for Friday Night Funkin' (V-Slice).",
        "search-placeholder": "Search file or folder (e.g. assets/songs)...",
        
        "card-1-title": "File Structure",
        "card-1-desc": "Learn where to place songs, images, and data. Understand the assets/ and mods/ hierarchy.",
        
        "card-2-title": "Scripting (HScript)",
        "card-2-desc": "Coming Soon: Haxe script events guide for custom levels.",
        
        "card-3-title": "Art & Sprites",
        "card-3-desc": "Coming Soon: How to optimize XML sprite sheets and animations.",
        
        "card-4-title": "Audio & Charts",
        "card-4-desc": "Coming Soon: Supported audio formats and Chart JSONs.",
        
        "card-5-title": "Compiling",
        "card-5-desc": "Coming Soon: Guide to compiling the game source code.",
        
        "card-6-title": "Resources",
        "card-6-desc": "Coming Soon: Community tools and useful links.",
        
        "no-results": "No results found for"
    },
    pt: {
        "hero-badge": "Não Oficial",
        "hero-title": "Documentação V-Slice",
        "hero-subtitle": "Guia de referência da comunidade para entender estrutura e modding de Friday Night Funkin' (V-Slice).",
        "search-placeholder": "Buscar arquivo ou pasta (ex. assets/songs)...",
        
        "card-1-title": "Estrutura de Arquivos",
        "card-1-desc": "Aprenda onde colocar músicas, imagens e dados. Entenda a hierarquia assets/ e mods/.",
        
        "card-2-title": "Scripting (HScript)",
        "card-2-desc": "Em Breve: Guia de eventos e scripts Haxe para níveis personalizados.",
        
        "card-3-title": "Arte e Sprites",
        "card-3-desc": "Em Breve: Como otimizar sprites XML e animações.",
        
        "card-4-title": "Áudio e Charts",
        "card-4-desc": "Em Breve: Formatos de áudio suportados e JSONs de chart.",
        
        "card-5-title": "Compilação",
        "card-5-desc": "Em Breve: Guia para compilar o código fonte do jogo.",
        
        "card-6-title": "Recursos",
        "card-6-desc": "Em Breve: Ferramentas da comunidade e links úteis.",
        
        "no-results": "Nenhum resultado encontrado para"
    }
};

// --- 2. GESTIÓN DE IDIOMA ---
const langSelect = document.getElementById('langSelect');
let currentLang = localStorage.getItem('fnf-wiki-lang') || 'es';

// Inicializar idioma
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('fnf-wiki-lang', lang);
    langSelect.value = lang;

    // Actualizar textos
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Actualizar placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
setLanguage(currentLang);


// --- 3. GESTIÓN DE TEMA ---
const themeBtns = document.querySelectorAll('.theme-btn');
let currentTheme = localStorage.getItem('fnf-wiki-theme') || 'dark';

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('fnf-wiki-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Actualizar estado activo de botones
    themeBtns.forEach(btn => {
        if (btn.getAttribute('data-set-theme') === theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Reiniciar partículas con nuevos colores
    initParticles(); 
}

themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setTheme(btn.getAttribute('data-set-theme'));
    });
});

setTheme(currentTheme);


// --- 4. BUSCADOR ---
const searchInput = document.getElementById('searchInput');
const cards = document.querySelectorAll('.searchable');
const noResults = document.getElementById('noResults');
const queryText = document.getElementById('queryText');
const searchBox = document.querySelector('.search-box');

// Ctrl + K
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchBox.style.borderColor = 'var(--accent)';
        setTimeout(() => { if(document.activeElement !== searchInput) searchBox.style.borderColor = 'var(--border)'; }, 300);
    }
});

searchInput.addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
        // Buscar en el texto actual (ya traducido)
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('p').textContent.toLowerCase();

        if (title.includes(term) || desc.includes(term)) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    if (visibleCount === 0) {
        noResults.classList.remove('hidden');
        queryText.textContent = term;
    } else {
        noResults.classList.add('hidden');
    }
});

searchInput.addEventListener('focus', () => searchBox.style.borderColor = 'var(--accent)');
searchInput.addEventListener('blur', () => searchBox.style.borderColor = 'var(--border)');


// --- 5. PARTÍCULAS ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray = [];

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() * 0.4) - 0.2;
        this.speedY = (Math.random() * 0.4) - 0.2;
        
        // Colores dinámicos según el tema
        if (currentTheme === 'light') {
            this.color = Math.random() > 0.5 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(8, 145, 178, 0.2)';
        } else if (currentTheme === 'funkin') {
            this.color = Math.random() > 0.5 ? 'rgba(255, 42, 109, 0.6)' : 'rgba(77, 76, 255, 0.6)';
        } else {
            // Dark Default
            this.color = Math.random() > 0.5 ? 'rgba(255, 42, 109, 0.3)' : 'rgba(5, 217, 232, 0.3)';
        }
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.x = Math.random() * canvas.width;
        if (this.y < 0 || this.y > canvas.height) this.y = Math.random() * canvas.height;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Vibración
document.querySelectorAll('.vibrate-btn').forEach(btn => {
    btn.addEventListener('click', () => { if (navigator.vibrate) navigator.vibrate(150); });
});