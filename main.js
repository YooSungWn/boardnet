document.addEventListener("DOMContentLoaded", () => {
const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll("[data-nav]");
const menuLinks = document.querySelectorAll(".menu a[data-nav]");
const sections = document.querySelectorAll(".page-section[id]");
const themeToggle = document.querySelector(".theme-toggle");
const topButton = document.querySelector(".top-button");

const gameCards = document.querySelectorAll(".game-card");
const gameSearch = document.querySelector("#gameSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyMessage = document.querySelector("#emptyMessage");

const modal = document.querySelector("#gameModal");
const modalTitle = document.querySelector("#modalTitle");
const modalDesc = document.querySelector("#modalDesc");
const modalGenre = document.querySelector("#modalGenre");
const modalPlayers = document.querySelector("#modalPlayers");
const modalTime = document.querySelector("#modalTime");
const modalClose = document.querySelector(".modal-close");

let currentFilter = "전체";

function getHeaderHeight() {
return topbar ? topbar.offsetHeight : 0;
}

function scrollToTarget(targetId) {
const target = document.querySelector(targetId);

```
if (!target) return;

const headerHeight = getHeaderHeight();
const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

window.scrollTo({
  top: Math.max(targetTop, 0),
  behavior: "smooth"
});
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

function setHeaderState() {
if (topbar) {
topbar.classList.toggle("is-scrolled", window.scrollY > 10);
}

```
if (topButton) {
  topButton.classList.toggle("show", window.scrollY > 420);
}

updateActiveMenu();
```

}

function updateActiveMenu() {
const headerHeight = getHeaderHeight();
const currentY = window.scrollY + headerHeight + 80;
let currentId = "home";

```
sections.forEach((section) => {
  if (currentY >= section.offsetTop) {
    currentId = section.id;
  }
});

menuLinks.forEach((link) => {
  const href = link.getAttribute("href");
  link.classList.toggle("active", href === `#${currentId}`);
});
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
setTheme(savedTheme === "light" ? "light" : "dark");
}

function applyGameFilter() {
const keyword = gameSearch ? gameSearch.value.trim().toLowerCase() : "";
let visibleCount = 0;

```
gameCards.forEach((card) => {
  const title = (card.dataset.title || "").toLowerCase();
  const genre = (card.dataset.genre || "").toLowerCase();
  const desc = (card.dataset.desc || "").toLowerCase();

  const matchKeyword = !keyword || title.includes(keyword) || genre.includes(keyword) || desc.includes(keyword);
  const matchFilter = currentFilter === "전체" || genre.includes(currentFilter.toLowerCase());

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

function setFilter(filterName) {
currentFilter = filterName;

```
filterButtons.forEach((button) => {
  button.classList.toggle("active", button.dataset.filter === filterName);
});

applyGameFilter();
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

if (modalTitle) modalTitle.textContent = title;
if (modalDesc) modalDesc.textContent = desc;
if (modalGenre) modalGenre.textContent = `장르: ${genre}`;
if (modalPlayers) modalPlayers.textContent = `인원: ${players}`;
if (modalTime) modalTime.textContent = `시간: ${time}`;

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

if (menuToggle) {
menuToggle.addEventListener("click", toggleMobileMenu);
}

navLinks.forEach((link) => {
link.addEventListener("click", (event) => {
const href = link.getAttribute("href");

```
  if (!href || !href.startsWith("#")) return;

  event.preventDefault();

  const filterMove = link.dataset.filterMove;

  closeMobileMenu();
  closeGameModal();

  scrollToTarget(href);

  if (filterMove) {
    setTimeout(() => {
      setFilter(filterMove);
    }, 250);
  }
});
```

});

filterButtons.forEach((button) => {
button.addEventListener("click", () => {
const filterName = button.dataset.filter || "전체";
setFilter(filterName);
});
});

if (gameSearch) {
gameSearch.addEventListener("input", applyGameFilter);
}

gameCards.forEach((card) => {
card.addEventListener("click", () => {
openGameModal(card);
});
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
scrollToTarget("#home");
});
}

window.addEventListener("scroll", setHeaderState, {
passive: true
});

window.addEventListener("resize", setHeaderState);

initTheme();
applyGameFilter();
setHeaderState();

console.log("BoardNet navigation and filter loaded");
});
