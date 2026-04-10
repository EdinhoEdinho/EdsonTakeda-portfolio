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
    // Itens que devem aparecer no mobile apenas apos Experiencia
    const revealAfterExperienceItems = document.querySelectorAll(
        '.top-nav-list li[data-mobile-reveal="after-experiencia"]'
    );

    // Guarda a secao ativa atual para evitar atualizacoes desnecessarias
    let activeSectionId = '';
    // Controla a frequencia de atualizacao durante scroll
    let scrollTicking = false;
    // Define se o menu mobile ja foi expandido (nao volta a esconder na mesma sessao)
    let mobileMenuExpanded = false;

    // Define quando o menu mobile deve expandir
    const shouldExpandMobileMenu = (sectionId) => {
        return (
            sectionId === '#experiencia' ||
            sectionId === '#skills' ||
            sectionId === '#treinamentos' ||
            sectionId === '#projeto' ||
            sectionId === '#contato'
        );
    };

    // Aplica no menu mobile se os itens adicionais ficam visiveis ou ocultos
    const applyMobileRevealState = (sectionId) => {
        if (!mobileQuery.matches) {
            return;
        }

        if (shouldExpandMobileMenu(sectionId)) {
            mobileMenuExpanded = true;
        }

        revealAfterExperienceItems.forEach((item) => {
            item.classList.toggle('mobile-nav-hidden', !mobileMenuExpanded);
        });
    };

    // Centraliza o item ativo no menu horizontal do mobile (somente no clique)
    const centerActiveLinkInMenu = (activeLink) => {
        if (!topNavContainer || !activeLink || !mobileQuery.matches) {
            return;
        }

        activeLink.scrollIntoView({
            behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
            inline: 'center',
            block: 'nearest'
        });
    };

    // Marca o item ativo no menu e sincroniza visibilidade no mobile
    const setActiveNavLink = (sectionId, options = {}) => {
        const { fromClick = false } = options;

        if (!sectionId) {
            return;
        }

        if (sectionId !== activeSectionId) {
            activeSectionId = sectionId;

            navLinks.forEach((link) => {
                link.classList.toggle('active-nav', link.getAttribute('href') === sectionId);
            });
        }

        applyMobileRevealState(sectionId);

        if (fromClick) {
            const activeLink = navLinks.find((link) => link.getAttribute('href') === sectionId);
            centerActiveLinkInMenu(activeLink);
        }
    };

    // Identifica qual secao esta ativa com base na rolagem da pagina
    const getCurrentSectionId = () => {
        // Regra para ultima secao: ativa Contato quando ele entra de forma consistente na viewport
        const lastSection = sections.length > 0 ? sections[sections.length - 1] : null;
        const viewportBottom = window.innerHeight + window.scrollY;

        if (lastSection && viewportBottom >= lastSection.offsetTop + 40) {
            return `#${lastSection.id}`;
        }

        // Regra de seguranca para arredondamentos no final da pagina
        const nearPageBottom =
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

        if (nearPageBottom && sections.length > 0) {
            return `#${sections[sections.length - 1].id}`;
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
        setActiveNavLink(getCurrentSectionId(), { fromClick: false });
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
            setActiveNavLink(targetId, { fromClick: true });
            scrollToSection(targetSection);
        });
    });

    // Recalcula estado quando alterna entre mobile/desktop
    const handleViewportChange = () => {
        if (!mobileQuery.matches) {
            mobileMenuExpanded = true;
        } else {
            mobileMenuExpanded = false;
        }

        updateActiveByScroll();
    };

    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener('change', handleViewportChange);
    } else if (mobileQuery.addListener) {
        mobileQuery.addListener(handleViewportChange);
    }

    // Mantem item ativo sincronizado ao rolar e redimensionar
    window.addEventListener('scroll', scheduleUpdateActiveByScroll, { passive: true });
    window.addEventListener('resize', updateActiveByScroll);

    // Estado inicial ao carregar a pagina
    handleViewportChange();
});
