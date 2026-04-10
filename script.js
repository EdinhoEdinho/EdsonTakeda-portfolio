// Executa somente apos o HTML estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Detecta modo mobile para controlar comportamento do menu superior
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    // Respeita preferencia do usuario por menos animacoes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Referencia ao header para compensar altura no scroll
    const header = document.querySelector('header');
    // Container com rolagem horizontal do menu
    const topNavContainer = document.querySelector('header nav');
    // Todos os links internos do menu (ancoras)
    const navLinks = Array.from(document.querySelectorAll('.top-nav-list a[href^="#"]'));
    // Secoes reais associadas aos links do menu
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    // Itens que devem aparecer no mobile apenas apos chegar em Experiencia
    const revealAfterExperienceItems = document.querySelectorAll(
        '.top-nav-list li[data-mobile-reveal="after-experiencia"]'
    );

    // Guarda a secao ativa atual para evitar atualizacoes desnecessarias
    let activeSectionId = '';
    // Controla a frequencia de atualizacao durante scroll
    let scrollTicking = false;

    // Define quando Skills/Treinamentos devem ser exibidos no mobile
    const shouldRevealMobileItems = (sectionId) => {
        return sectionId === '#experiencia' || sectionId === '#skills' || sectionId === '#treinamentos';
    };

    // Aplica no menu mobile se os itens adicionais ficam visiveis ou ocultos
    const applyMobileRevealState = (sectionId) => {
        if (!mobileQuery.matches) {
            return;
        }

        const reveal = shouldRevealMobileItems(sectionId);

        revealAfterExperienceItems.forEach((item) => {
            item.classList.toggle('mobile-nav-hidden', !reveal);
        });
    };

    // Centraliza o item ativo no menu horizontal do mobile
    const centerActiveLinkInMenu = (activeLink) => {
        if (!topNavContainer || !activeLink) {
            return;
        }

        const navRect = topNavContainer.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const deltaX = (linkRect.left - navRect.left) - (navRect.width - linkRect.width) / 2;
        const rawTargetLeft = topNavContainer.scrollLeft + deltaX;
        const maxScrollLeft = Math.max(0, topNavContainer.scrollWidth - topNavContainer.clientWidth);
        const targetLeft = Math.min(maxScrollLeft, Math.max(0, rawTargetLeft));

        topNavContainer.scrollTo({
            left: targetLeft,
            behavior: reducedMotionQuery.matches ? 'auto' : 'smooth'
        });
    };

    // Marca o item ativo no menu e sincroniza visibilidade no mobile
    const setActiveNavLink = (sectionId) => {
        if (!sectionId || sectionId === activeSectionId) {
            return;
        }

        activeSectionId = sectionId;

        navLinks.forEach((link) => {
            link.classList.toggle('active-nav', link.getAttribute('href') === sectionId);
        });

        applyMobileRevealState(sectionId);

        if (mobileQuery.matches) {
            const activeLink = navLinks.find((link) => link.getAttribute('href') === sectionId);
            centerActiveLinkInMenu(activeLink);
        }
    };

    // Identifica qual secao esta ativa com base na rolagem da pagina
    const getCurrentSectionId = () => {
        // Regra para ultima secao: ao chegar no final da pagina, ativa Contato
        const nearPageBottom =
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

        if (nearPageBottom && sections.length > 0) {
            const lastSection = sections[sections.length - 1];
            return `#${lastSection.id}`;
        }

        const headerHeight = header ? header.offsetHeight : 0;
        const scrollReference = window.scrollY + headerHeight + 24;

        let current = sections[0];

        sections.forEach((section) => {
            if (scrollReference >= section.offsetTop) {
                current = section;
            }
        });

        return current ? `#${current.id}` : '';
    };

    // Atualiza destaque do menu de acordo com o scroll
    const updateActiveByScroll = () => {
        setActiveNavLink(getCurrentSectionId());
    };

    // Evita excesso de calculos durante rolagem continua
    const scheduleUpdateActiveByScroll = () => {
        if (scrollTicking) {
            return;
        }

        scrollTicking = true;
        requestAnimationFrame(() => {
            scrollTicking = false;
            updateActiveByScroll();
        });
    };

    // Scroll suave para secao, compensando o header fixo
    const scrollToSection = (targetSection) => {
        const headerHeight = header ? header.offsetHeight : 0;
        const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
    };

    // Clique no menu: ativa item e navega para a secao correspondente
    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (!targetSection) {
                return;
            }

            event.preventDefault();
            setActiveNavLink(targetId);
            scrollToSection(targetSection);
        });
    });

    // Recalcula estado quando alterna entre mobile/desktop
    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener('change', updateActiveByScroll);
    } else if (mobileQuery.addListener) {
        mobileQuery.addListener(updateActiveByScroll);
    }

    // Mantem item ativo sincronizado ao rolar e redimensionar
    window.addEventListener('scroll', scheduleUpdateActiveByScroll, { passive: true });
    window.addEventListener('resize', updateActiveByScroll);

    // Estado inicial ao carregar a pagina
    updateActiveByScroll();
});
