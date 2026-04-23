document.addEventListener('DOMContentLoaded', () => {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    const projectToggleButtons = document.querySelectorAll('.project-toggle');

    internalLinks.forEach((link) => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    projectToggleButtons.forEach((button) => {
        const targetId = button.getAttribute('aria-controls');
        const details = targetId ? document.getElementById(targetId) : null;

        if (!details) {
            return;
        }

        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                button.setAttribute('aria-expanded', 'false');
                button.textContent = 'Ver detalhes';
                details.classList.remove('is-open');
                return;
            }

            button.setAttribute('aria-expanded', 'true');
            button.textContent = 'Ocultar detalhes';
            details.classList.add('is-open');
        });
    });
});
