(() => {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const revealTargets = document.querySelectorAll(
    ".section .reveal, .work-item.reveal"
  );

  if (!("IntersectionObserver" in window) || !revealTargets.length) {
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    revealTargets.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.animation = "none";
    });
    return;
  }

  // Work items animate on scroll; hero already animates on load via CSS
  const scrollReveals = document.querySelectorAll(".work-item.reveal");

  scrollReveals.forEach((el) => {
    el.style.opacity = "0";
    el.style.animation = "none";
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = Number(getComputedStyle(el).getPropertyValue("--i")) || 0;
        el.style.animation = `rise-soft 650ms cubic-bezier(0.16, 1, 0.3, 1) forwards`;
        el.style.animationDelay = `${delay * 110}ms`;
        obs.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
  );

  scrollReveals.forEach((el) => observer.observe(el));
})();
