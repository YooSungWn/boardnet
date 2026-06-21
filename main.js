document.addEventListener("DOMContentLoaded", function () {
const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll("[data-nav]");
const menuLinks = document.querySelectorAll(".menu a[data-nav]");
const sections = document.querySelectorAll(".page-section[id]");
const themeToggle = document.querySelector(".theme-toggle");
const topButton = document.querySelector(".top-button");

const gameList = document.querySelector("#gameList");
const gameCards = Array.from(document.querySelectorAll(".game-card"));
const gameSearch = document.querySelector("#gameSearch");
const gameSort = document.querySelector("#gameSort");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyMessage = document.querySelector("#emptyMessage");
const resultCount = document.querySelector("#resultCount");

const modal = document.querySelector("#gameModal");
const modalVisual = document.querySelector("#modalVisual");
const modalTitle = document.querySelector("#modalTitle");
const modalDesc = document.querySelector("#modalDesc");
const modalGenre = document.querySelector("#modalGenre");
const modalPlayers = document.querySelector("#modalPlayers");
const modalTime = document.querySelector("#modalTime");
const modalDifficulty = document.querySelector("#modalDifficulty");
const modalGoal = document.querySelector("#modalGoal");
const modalFlow = document.querySelector("#modalFlow");
const modalWin = document.querySelector("#modalWin");
const modalTarget = document.querySelector("#modalTarget");
const modalRules = document.querySelector("#modalRules");
const modalClose = document.querySelector(".modal-close");

const noticeModal = document.querySelector("#noticeModal");
const noticeTitle = document.querySelector("#noticeTitle");
const noticeMessage = document.querySelector("#noticeMessage");
const noticeClose = document.querySelector(".notice-close");
const noticeOk = document.querySelector(".notice-ok");
const noticeButtons = document.querySelectorAll("[data-open-notice]");

let currentFilter = "전체";

function getHeaderHeight() {
if (topbar) {
return topbar.offsetHeight;
}

```
return 0;
```

}

function scrollToTarget(targetId) {
const target = document.querySelector(targetId);

```
if (!target) {
  return;
}

const headerHeight = getHeaderHeight();
const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

window.scrollTo({
  top: Math.max(targetTop, 0),
  behavior: "smooth"
});
```

}

function closeMobileMenu() {
if (!topbar || !menuToggle) {
return;
}

```
topbar.classList.remove("is-open");
menuToggle.setAttribute("aria-expanded", "false");
```

}

function toggleMobileMenu() {
if (!topbar || !menuToggle) {
return;
}

```
const isOpen = topbar.classList.toggle("is-open");
menuToggle.setAttribute("aria-expanded", String(isOpen));
```

}

function updateActiveMenu() {
const headerHeight = getHeaderHeight();
const currentY = window.scrollY + headerHeight + 80;
let currentId = "home";

```
sections.forEach(function (section) {
  if (currentY >= section.offsetTop) {
    currentId = section.id;
  }
});

menuLinks.forEach(function (link) {
  const href = link.getAttribute("href");

  if (href === "#" + currentId) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});
```

}

function setHeaderState() {
if (topbar) {
if (window.scrollY > 10) {
topbar.classList.add("is-scrolled");
} else {
topbar.classList.remove("is-scrolled");
}
}

```
if (topButton) {
  if (window.scrollY > 420) {
    topButton.classList.add("show");
  } else {
    topButton.classList.remove("show");
  }
}

updateActiveMenu();
```

}

function setTheme(mode) {
if (mode === "light") {
document.body.classList.add("light");
localStorage.setItem("boardnet-theme", "light");

```
  if (themeToggle) {
    themeToggle.textContent = "다크";
  }
} else {
  document.body.classList.remove("light");
  localStorage.setItem("boardnet-theme", "dark");

  if (themeToggle) {
    themeToggle.textContent = "라이트";
  }
}
```

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

function getVisibleCards() {
const keyword = gameSearch ? gameSearch.value.trim().toLowerCase() : "";

```
return gameCards.filter(function (card) {
  const title = (card.dataset.title || "").toLowerCase();
  const genre = (card.dataset.genre || "").toLowerCase();
  const summary = (card.dataset.summary || "").toLowerCase();
  const tags = (card.dataset.tags || "").toLowerCase();

  const matchKeyword =
    !keyword ||
    title.includes(keyword) ||
    genre.includes(keyword) ||
    summary.includes(keyword) ||
    tags.includes(keyword);

  const matchFilter =
    currentFilter === "전체" ||
    genre.includes(currentFilter.toLowerCase());

  return matchKeyword && matchFilter;
});
```

}

function sortCards(cards) {
const sortValue = gameSort ? gameSort.value : "popular";

```
return cards.slice().sort(function (a, b) {
  if (sortValue === "popular") {
    return Number(b.dataset.popularity || 0) - Number(a.dataset.popularity || 0);
  }

  if (sortValue === "short") {
    return Number(a.dataset.minutes || 999) - Number(b.dataset.minutes || 999);
  }

  if (sortValue === "beginner") {
    return Number(b.dataset.beginner || 0) - Number(a.dataset.beginner || 0);
  }

  if (sortValue === "name") {
    return (a.dataset.title || "").localeCompare(b.dataset.title || "", "ko");
  }

  return 0;
});
```

}

function applyGameFilter() {
if (!gameList) {
return;
}

```
const visibleCards = sortCards(getVisibleCards());

gameCards.forEach(function (card) {
  card.classList.add("is-hidden");
});

visibleCards.forEach(function (card) {
  card.classList.remove("is-hidden");
  gameList.appendChild(card);
});

if (emptyMessage) {
  if (visibleCards.length === 0) {
    emptyMessage.classList.add("show");
  } else {
    emptyMessage.classList.remove("show");
  }
}

if (resultCount) {
  const label = currentFilter === "전체" ? "전체 게임" : currentFilter + " 게임";
  resultCount.textContent = label + " " + visibleCards.length + "개";
}
```

}

function setFilter(filterName) {
currentFilter = filterName;

```
filterButtons.forEach(function (button) {
  if (button.dataset.filter === filterName) {
    button.classList.add("active");
  } else {
    button.classList.remove("active");
  }
});

applyGameFilter();
```

}

function openGameModal(card) {
if (!modal || !card) {
return;
}

```
const title = card.dataset.title || "게임명";
const genre = card.dataset.genre || "장르 정보 없음";
const image = card.dataset.image || "";
const players = card.dataset.players || "인원 정보 없음";
const time = card.dataset.time || "시간 정보 없음";
const difficulty = card.dataset.difficulty || "난이도 정보 없음";
const summary = card.dataset.summary || "게임 설명이 없습니다.";
const goal = card.dataset.goal || "목표 정보가 없습니다.";
const flow = card.dataset.flow || "진행 방식 정보가 없습니다.";
const win = card.dataset.win || "승리 조건 정보가 없습니다.";
const target = card.dataset.target || "추천 대상 정보가 없습니다.";
const rules = (card.dataset.rules || "").split("|").filter(function (item) {
  return item.length > 0;
});

if (modalVisual) {
  modalVisual.className = "modal-visual";

  if (image) {
    modalVisual.classList.add(image);
  }
}

if (modalTitle) {
  modalTitle.textContent = title;
}

if (modalDesc) {
  modalDesc.textContent = summary;
}

if (modalGenre) {
  modalGenre.textContent = "장르: " + genre;
}

if (modalPlayers) {
  modalPlayers.textContent = "인원: " + players;
}

if (modalTime) {
  modalTime.textContent = "시간: " + time;
}

if (modalDifficulty) {
  modalDifficulty.textContent = "난이도: " + difficulty;
}

if (modalGoal) {
  modalGoal.textContent = goal;
}

if (modalFlow) {
  modalFlow.textContent = flow;
}

if (modalWin) {
  modalWin.textContent = win;
}

if (modalTarget) {
  modalTarget.textContent = target;
}

if (modalRules) {
  modalRules.innerHTML = "";

  rules.forEach(function (rule) {
    const li = document.createElement("li");
    li.textContent = rule;
    modalRules.appendChild(li);
  });
}

modal.classList.add("show");
modal.setAttribute("aria-hidden", "false");
document.body.style.overflow = "hidden";
```

}

function closeGameModal() {
if (!modal) {
return;
}

```
modal.classList.remove("show");
modal.setAttribute("aria-hidden", "true");

if (!noticeModal || !noticeModal.classList.contains("show")) {
  document.body.style.overflow = "";
}
```

}

function openNotice(title, message) {
if (!noticeModal) {
return;
}

```
if (noticeTitle) {
  noticeTitle.textContent = title || "준비 중";
}

if (noticeMessage) {
  noticeMessage.textContent = message || "현재 준비 중인 기능입니다.";
}

noticeModal.classList.add("show");
noticeModal.setAttribute("aria-hidden", "false");
document.body.style.overflow = "hidden";
```

}

function closeNotice() {
if (!noticeModal) {
return;
}

```
noticeModal.classList.remove("show");
noticeModal.setAttribute("aria-hidden", "true");

if (!modal || !modal.classList.contains("show")) {
  document.body.style.overflow = "";
}
```

}

if (menuToggle) {
menuToggle.addEventListener("click", toggleMobileMenu);
}

navLinks.forEach(function (link) {
link.addEventListener("click", function (event) {
const href = link.getAttribute("href");

```
  if (!href || !href.startsWith("#")) {
    return;
  }

  event.preventDefault();

  const filterMove = link.dataset.filterMove;

  closeMobileMenu();
  closeGameModal();
  closeNotice();

  scrollToTarget(href);

  if (filterMove) {
    setTimeout(function () {
      setFilter(filterMove);
    }, 250);
  }
});
```

});

filterButtons.forEach(function (button) {
button.addEventListener("click", function () {
const filterName = button.dataset.filter || "전체";
setFilter(filterName);
});
});

if (gameSearch) {
gameSearch.addEventListener("input", applyGameFilter);
}

if (gameSort) {
gameSort.addEventListener("change", applyGameFilter);
}

gameCards.forEach(function (card) {
card.addEventListener("click", function () {
openGameModal(card);
});
});

if (modalClose) {
modalClose.addEventListener("click", closeGameModal);
}

if (modal) {
modal.addEventListener("click", function (event) {
if (event.target === modal) {
closeGameModal();
}
});
}

noticeButtons.forEach(function (button) {
button.addEventListener("click", function (event) {
event.preventDefault();

```
  const title = button.dataset.noticeTitle || "준비 중";
  const message = button.dataset.noticeMessage || "현재 준비 중인 기능입니다.";

  openNotice(title, message);
});
```

});

if (noticeClose) {
noticeClose.addEventListener("click", closeNotice);
}

if (noticeOk) {
noticeOk.addEventListener("click", closeNotice);
}

if (noticeModal) {
noticeModal.addEventListener("click", function (event) {
if (event.target === noticeModal) {
closeNotice();
}
});
}

document.addEventListener("keydown", function (event) {
if (event.key === "Escape") {
closeGameModal();
closeNotice();
closeMobileMenu();
}
});

if (themeToggle) {
themeToggle.addEventListener("click", function () {
const isLight = document.body.classList.contains("light");

```
  if (isLight) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
});
```

}

if (topButton) {
topButton.addEventListener("click", function () {
scrollToTarget("#home");
});
}

window.addEventListener("scroll", function () {
setHeaderState();
});

window.addEventListener("resize", function () {
setHeaderState();
});

initTheme();
applyGameFilter();
setHeaderState();

console.log("BoardNet full feature version loaded");
});
