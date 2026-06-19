(() => {
  const topbar = document.querySelector(".topbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuLinks = document.querySelectorAll(".menu a");
  const hashLinks = document.querySelectorAll('a[href^="#"]');
  const sections = document.querySelectorAll("section[id], footer[id]");
  const gameCards = document.querySelectorAll(".game-card");

  const setHeaderState = () => {
    if (!topbar) return;
    topbar.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  const closeMobileMenu = () => {
    if (!topbar || !menuToggle) return;
    topbar.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  if (menuToggle && topbar) {
    menuToggle.addEventListener("click", () => {
      const isOpen = topbar.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  hashLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        closeMobileMenu();
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMobileMenu();
    });
  });

  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.getAttribute("id");
          menuLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  gameCards.forEach((card) => {
    card.addEventListener("click", () => {
      gameCards.forEach((item) => item.classList.remove("is-selected"));
      card.classList.add("is-selected");
    });
  });

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();
})();
