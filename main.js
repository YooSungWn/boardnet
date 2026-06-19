document.addEventListener("DOMContentLoaded", () => {
const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const menuLinks = document.querySelectorAll(".menu a");
const hashLinks = document.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll("section[id], footer[id]");
const gameCards = document.querySelectorAll(".game-card");

function setHeaderState() {
if (!topbar) return;

```
if (window.scrollY > 10) {
  topbar.classList.add("is-scrolled");
} else {
  topbar.classList.remove("is-scrolled");
}
```

}

function closeMobileMenu() {
if (!topbar || !menuToggle) return;

```
topbar.classList.remove("is-open");
menuToggle.setAttribute("aria-expanded", "false");
```

}

function toggleMobileMenu() {
if (!topbar || !menuToggle) return;

```
const isOpen = topbar.classList.toggle("is-open");
menuToggle.setAttribute("aria-expanded", String(isOpen));
```

}

if (menuToggle) {
menuToggle.addEventListener("click", toggleMobileMenu);
}

hashLinks.forEach((link) => {
link.addEventListener("click", (event) => {
const targetId = link.getAttribute("href");

```
  if (!targetId || targetId === "#") {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    closeMobileMenu();
    return;
  }

  const target = document.querySelector(targetId);

  if (!target) {
    return;
  }

  event.preventDefault();

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  closeMobileMenu();
});
```

});

if ("IntersectionObserver" in window && sections.length > 0) {
const observer = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (!entry.isIntersecting) return;

```
      const currentId = entry.target.getAttribute("id");

      menuLinks.forEach((link) => {
        const linkTarget = link.getAttribute("href");
        link.classList.toggle("active", linkTarget === `#${currentId}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  }
);

sections.forEach((section) => {
  observer.observe(section);
});
```

}

gameCards.forEach((card) => {
card.addEventListener("click", () => {
gameCards.forEach((item) => {
item.classList.remove("is-selected");
});

```
  card.classList.add("is-selected");
});
```

});

window.addEventListener("scroll", setHeaderState, {
passive: true
});

setHeaderState();

console.log("BoardNet main.js 연결 완료");
});
