document.addEventListener("DOMContentLoaded", () => {
const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const menuLinks = document.querySelectorAll(".menu a");
const hashLinks = document.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll("section[id], footer[id]");
const gameCards = document.querySelectorAll(".game-card");
const gameSearch = document.querySelector("#gameSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyMessage = document.querySelector("#emptyMessage");
const themeToggle = document.querySelector(".theme-toggle");
const topButton = document.querySelector(".top-button");

const modal = document.querySelector("#gameModal");
const modalTitle = document.querySelector("#modalTitle");
const modalDesc = document.querySelector("#modalDesc");
const modalGenre = document.querySelector("#modalGenre");
const modalPlayers = document.querySelector("#modalPlayers");
const modalTime = document.querySelector("#modalTime");
const modalClose = document.querySelector(".modal-close");

let currentFilter = "all";

function setHeaderState() {
if (!topbar) return;

```
topbar.classList.toggle("is-scrolled", window.scrollY > 10);

if (topButton) {
  topButton.classList.toggle("show", window.scrollY > 420);
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

function applyGameFilter() {
const keyword = gameSearch ? gameSearch.value.trim().toLowerCase() : "";
let visibleCount = 0;

```
gameCards.forEach((card) => {
  const title = (card.dataset.title || "").toLowerCase();
  const genre = (card.dataset.genre || "").toLowerCase();

  const matchKeyword = !keyword || title.includes(keyword) || genre.includes(keyword);
  const matchFilter = currentFilter === "all" || genre.includes(currentFilter.toLowerCase());

  const shouldShow = matchKeyword && matchFilter;

  card.classList.toggle("is-hidden", !shouldShow);

  if (shouldShow) {
    visibleCount += 1;
  }
});

if (emptyMessage) {
  emptyMessage.classList.toggle("show", visibleCount === 0);
}
```

}

function openGameModal(card) {
if (!modal) return;

```
const title = card.dataset.title || "게임명";
const genre = card.dataset.genre || "장르 정보 없음";
const players = card.dataset.players || "인원 정보 없음";
const time = card.dataset.time || "시간 정보 없음";
const desc = card.dataset.desc || "게임 설명이 없습니다.";

modalTitle.textContent = title;
modalDesc.textContent = desc;
modalGenre.textContent = `장르: ${genre}`;
modalPlayers.textContent = `인원: ${players}`;
modalTime.textContent = `시간: ${time}`;

modal.classList.add("show");
modal.setAttribute("aria-hidden", "false");
document.body.style.overflow = "hidden";
```

}

function closeGameModal() {
if (!modal) return;

```
modal.classList.remove("show");
modal.setAttribute("aria-hidden", "true");
document.body.style.overflow = "";
```

}

function setTheme(mode) {
if (mode === "light") {
document.body.classList.add("light");
localStorage.setItem("boardnet-theme", "light");
if (themeToggle) themeToggle.textContent = "다크";
} else {
document.body.classList.remove("light");
localStorage.setItem("boardnet-theme", "dark");
if (themeToggle) themeToggle.textContent = "라이트";
}
}

function initTheme() {
const savedTheme = localStorage.getItem("boardnet-theme");

```
if (savedTheme === "light") {
  setTheme("light");
} else {
  setTheme("dark");
}
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

  if (!target) return;

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

if (gameSearch) {
gameSearch.addEventListener("input", applyGameFilter);
}

filterButtons.forEach((button) => {
button.addEventListener("click", () => {
filterButtons.forEach((item) => item.classList.remove("active"));
button.classList.add("active");
currentFilter = button.dataset.filter || "all";
applyGameFilter();
});
});

gameCards.forEach((card) => {
card.addEventListener("click", () => {
gameCards.forEach((item) => {
item.classList.remove("is-selected");
});

```
  card.classList.add("is-selected");
  openGameModal(card);
});
```

});

if (modalClose) {
modalClose.addEventListener("click", closeGameModal);
}

if (modal) {
modal.addEventListener("click", (event) => {
if (event.target === modal) {
closeGameModal();
}
});
}

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
closeGameModal();
closeMobileMenu();
}
});

if (themeToggle) {
themeToggle.addEventListener("click", () => {
const isLight = document.body.classList.contains("light");
setTheme(isLight ? "dark" : "light");
});
}

if (topButton) {
topButton.addEventListener("click", () => {
window.scrollTo({
top: 0,
behavior: "smooth"
});
});
}

window.addEventListener("scroll", setHeaderState, {
passive: true
});

initTheme();
applyGameFilter();
setHeaderState();

console.log("BoardNet main.js 연결 완료");
});
