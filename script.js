// Executa somente após o HTML estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Detecta modo mobile para controlar comportamento do menu superior
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    // Referência ao header para compensar altura no scroll
    const header = document.querySelector('header');
    // Todos os links internos do menu (âncoras)
    const navLinks = Array.from(document.querySelectorAll('.top-nav-list a[href^="#"]'));
    // Seções reais associadas aos links do menu
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    // Itens que devem aparecer no mobile apenas após chegar em Experiência
    const revealAfterExperienceItems = document.querySelectorAll(
        '.top-nav-list li[data-mobile-reveal="after-experiencia"]'
    );

    // Guarda a seção ativa atual para evitar atualizações desnecessárias
    let activeSectionId = '';

    // Define quando Skills/Treinamentos devem ser exibidos no mobile
    const shouldRevealMobileItems = (sectionId) => {
        return sectionId === '#experiencia' || sectionId === '#skills' || sectionId === '#treinamentos';
    };

    // Aplica no menu mobile se os itens adicionais ficam visíveis ou ocultos
    const applyMobileRevealState = (sectionId) => {
        if (!mobileQuery.matches) {
            return;
        }

        const reveal = shouldRevealMobileItems(sectionId);

        revealAfterExperienceItems.forEach((item) => {
            item.classList.toggle('mobile-nav-hidden', !reveal);
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

            if (activeLink) {
                activeLink.scrollIntoView({
                    behavior: 'auto',
                    inline: 'center',
                    block: 'nearest'
                });
            }
        }
    };

    // Identifica qual seção está ativa com base na rolagem da página
    const getCurrentSectionId = () => {
        // Regra para última seção: ao chegar no final da página, ativa Contato
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

    // Scroll suave para seção, compensando o header fixo
    const scrollToSection = (targetSection) => {
        const headerHeight = header ? header.offsetHeight : 0;
        const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
    };

    // Clique no menu: ativa item e navega para a seção correspondente
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

    // Mantém item ativo sincronizado ao rolar e redimensionar
    window.addEventListener('scroll', updateActiveByScroll, { passive: true });
    window.addEventListener('resize', updateActiveByScroll);

    // Estado inicial ao carregar a página
    updateActiveByScroll();
});
