// Adiciona um listener para quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os links internos que começam com '#'
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    // Itera sobre cada link interno encontrado
    internalLinks.forEach(link => {
        // Adiciona um evento de clique a cada link
        link.addEventListener('click', function(event) {
            // Previne o comportamento padrão do link (salto instantâneo)
            event.preventDefault();

            // Obtém o atributo 'href' do link, que é o ID da seção de destino
            const targetId = this.getAttribute('href');

            // Encontra o elemento de destino usando o ID
            const targetSection = document.querySelector(targetId);

            // Verifica se a seção de destino existe
            if (targetSection) {
                // Rola suavemente até a seção de destino
                // 'behavior: smooth' garante a animação suave
                // 'block: start' alinha o topo da seção com o topo da viewport
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});