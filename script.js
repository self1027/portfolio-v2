let homeCache = "";

async function carregarProjeto(url) {
    const mainContent = document.querySelector('main');
    
    if (!homeCache) homeCache = mainContent.innerHTML;

    mainContent.style.opacity = 0;

    try {
        const response = await fetch(url);
        const html = await response.text();
        
        setTimeout(() => {
            mainContent.innerHTML = html;
            mainContent.style.opacity = 1;
            window.scrollTo(0, 0);
            
            const slug = "/" + url.replace('.html', '');
            window.history.pushState({ type: 'project', content: html }, '', slug);
        }, 300);
    } catch (e) {
        console.error("Erro ao carregar:", e);
        mainContent.style.opacity = 1;
    }
}

window.onpopstate = function(event) {
    const mainContent = document.querySelector('main');
    
    if (event.state && event.state.type === 'project') {
        mainContent.innerHTML = event.state.content;
    } else {
        mainContent.innerHTML = homeCache;
    }
    mainContent.style.opacity = 1;
};

function openImageModal(src) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImg');
    if (modal && img) {
        img.src = src;
        modal.style.display = 'flex';
    }
}