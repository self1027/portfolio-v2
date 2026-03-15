let homeCache = null;
let savedScrollPosition = 0;
let currentView = 'home';

history.scrollRestoration = 'manual';

async function carregarProjeto(url) {
    const mainContent = document.querySelector('main');

    if (currentView === 'home') {
        savedScrollPosition = window.scrollY;
    }

    if (!homeCache) homeCache = mainContent.innerHTML;

    mainContent.style.opacity = 0;

    try {
        const response = await fetch(url);
        const html = await response.text();

        setTimeout(() => {
            mainContent.innerHTML = html;
            mainContent.style.opacity = 1;
            currentView = 'project';

            requestAnimationFrame(() => {
                const target = document.querySelector('.hero-section');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });

            const slug = "/" + url.replace('.html', '');
            window.history.pushState({ type: 'project', content: html }, '', slug);
        }, 400);
    } catch (e) {
        console.error("Erro ao carregar:", e);
        mainContent.style.opacity = 1;
    }
}

function voltarParaHome() {
    if (window.history.length <= 1) {
        const mainContent = document.querySelector('main');
        if (homeCache) {
            mainContent.style.opacity = 0;
            setTimeout(() => {
                mainContent.innerHTML = homeCache;
                mainContent.style.opacity = 1;
                currentView = 'home';
                window.scrollTo({ top: savedScrollPosition, behavior: 'smooth' });
                window.history.replaceState({ type: 'home' }, '', '/');
            }, 400);
        }
    } else {
        window.history.back();
    }
}

window.onpopstate = function(event) {
    const mainContent = document.querySelector('main');
    if (event.state && event.state.type === 'project') {
        mainContent.innerHTML = event.state.content;
        currentView = 'project';
        window.scrollTo(0, 0);
    } else {
        mainContent.innerHTML = homeCache;
        currentView = 'home';
        const scrollTop = typeof savedScrollPosition === 'number' ? savedScrollPosition : 0;
        console.log('onpopstate: agendando scroll para', scrollTop);
        setTimeout(() => {
            window.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }, 0);
    }
    mainContent.style.opacity = 1;
};

function openImageModal(src) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImg');
    
    if (modal && img) {
        img.src = src;
        modal.style.display = 'flex';
        modal.style.backgroundColor = 'white';
    }
}