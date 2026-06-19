document.addEventListener("DOMContentLoaded", () => {
const games = [
{
id: "island-card",
title: "섬의 카드",
genre: ["전략", "카드"],
players: "2~10명",
time: "15~20분",
status: "무료",
thumb: "island",
short: "카드로 자원을 모아 섬을 확장하세요.",
desc: "자원 카드, 역할 카드, 심리전을 조합해 섬에서 마지막까지 살아남는 전략 카드 게임입니다. 짧은 시간 안에 판단과 협상이 모두 필요합니다."
},
{
id: "midnight-mystery",
title: "심야 추리전",
genre: ["심리전", "추리"],
players: "4~8명",
time: "10~15분",
status: "바로 플레이",
thumb: "mystery",
short: "당신의 한 마디로 판을 뒤집으세요.",
desc: "밤마다 사건이 발생하고, 플레이어는 서로의 발언과 행동을 분석해 범인을 찾아야 합니다. 거짓말, 침묵, 의심이 핵심입니다."
},
{
id: "code-breaker",
title: "코드 브레이커",
genre: ["전략", "추리"],
players: "1~4명",
time: "8~12분",
status: "무료",
thumb: "code",
short: "코드를 해독하고 시스템을 장악하세요.",
desc: "상대의 패턴을 읽고 숨겨진 코드를 해독하는 두뇌형 게임입니다. 추리력과 순서 계산이 중요합니다."
},
{
id: "round-battle",
title: "라운드 배틀",
genre: ["파티", "전략"],
players: "2~6명",
time: "5~10분",
status: "바로 플레이",
thumb: "round",
short: "카드를 조합해 최후의 팀이 되세요.",
desc: "짧은 라운드마다 다른 카드 조합으로 승부를 보는 빠른 파티 전략 게임입니다. 가볍지만 반복 플레이성이 높습니다."
},
{
id: "kingdom-order",
title: "킹덤 오더",
genre: ["전략", "턴제"],
players: "2~4명",
time: "20~30분",
status: "무료",
thumb: "kingdom",
short: "영지를 건설하고 세력을 확장하세요.",
desc: "영토 확장, 자원 관리, 턴제 전투가 결합된 전략 게임입니다. 장기적인 운영 판단이 승패를 가릅니다."
},
{
id: "hidden-signal",
title: "히든 시그널",
genre: ["심리전", "소셜"],
players: "4~10명",
time: "10~18분",
status: "바로 플레이",
thumb: "signal",
short: "비밀 신호로 팀플레이를 완성하세요.",
desc: "팀의 정체를 숨기면서 신호를 주고받는 소셜 심리전 게임입니다. 상대를 속이되 아군에게는 정보를 전달해야 합니다."
}
];

const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const menuLinks = document.querySelectorAll(".menu a");
const hashLinks = document.querySelectorAll('a[href^="#"]:not([data-open-catalog])');
const sections = document.querySelectorAll("section[id], footer[id]");
const themeToggle = document.querySelector(".theme-toggle");
const topButton = document.querySelector(".top-button");

const openCatalogButtons = document.querySelectorAll("[data-open-catalog]");
const catalog = document.querySelector("#gameCatalog");
const catalogClose = document.querySelector(".catalog-close");
const catalogList = document.querySelector("#catalogList");
const catalogSearch = document.querySelector("#catalogSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const catalogEmpty = document.querySelector("#catalogEmpty");

const detailTitle = document.querySelector("#detailTitle");
const detailDesc = document.querySelector("#detailDesc");
const detailGenre = document.querySelector("#detailGenre");
const detailPlayers = document.querySelector("#detailPlayers");
const detailTime = document.querySelector("#detailTime");
const detailStatus = document.querySelector("#detailStatus");

const homeGameCards = document.querySelectorAll(".game-card[data-game-id]");

let currentFilter = "all";
let currentSelectedGameId = games[0].id;

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

function getFilteredGames() {
const keyword = catalogSearch ? catalogSearch.value.trim().toLowerCase() : "";

```
return games.filter((game) => {
  const genreText = game.genre.join(" ");
  const searchableText = `${game.title} ${genreText} ${game.short} ${game.desc}`.toLowerCase();

  const matchKeyword = !keyword || searchableText.includes(keyword);
  const matchFilter = currentFilter === "all" || game.genre.includes(currentFilter);

  return matchKeyword && matchFilter;
});
```

}

function renderCatalog() {
if (!catalogList) return;

```
const filteredGames = getFilteredGames();

catalogList.innerHTML = "";

filteredGames.forEach((game) => {
  const item = document.createElement("button");
  item.type = "button";
  item.className = "catalog-item";
  item.dataset.gameId = game.id;

  if (game.id === currentSelectedGameId) {
    item.classList.add("active");
  }

  item.innerHTML = `
    <div class="catalog-thumb ${game.thumb}"></div>
    <div>
      <h3>${game.title}</h3>
      <p>${game.short}</p>
      <small>${game.genre.join(" · ")} / ${game.players}</small>
    </div>
  `;

  item.addEventListener("click", () => {
    selectGame(game.id);
  });

  catalogList.appendChild(item);
});

if (catalogEmpty) {
  catalogEmpty.classList.toggle("show", filteredGames.length === 0);
}

if (filteredGames.length > 0 && !filteredGames.some((game) => game.id === currentSelectedGameId)) {
  selectGame(filteredGames[0].id);
}
```

}

function selectGame(gameId) {
const game = games.find((item) => item.id === gameId);

```
if (!game) return;

currentSelectedGameId = game.id;

if (detailTitle) detailTitle.textContent = game.title;
if (detailDesc) detailDesc.textContent = game.desc;
if (detailGenre) detailGenre.textContent = `장르: ${game.genre.join(" · ")}`;
if (detailPlayers) detailPlayers.textContent = `인원: ${game.players}`;
if (detailTime) detailTime.textContent = `시간: ${game.time}`;
if (detailStatus) detailStatus.textContent = `상태: ${game.status}`;

document.querySelectorAll(".catalog-item").forEach((item) => {
  item.classList.toggle("active", item.dataset.gameId === game.id);
});
```

}

function openCatalog(gameId) {
if (!catalog) return;

```
if (gameId) {
  currentSelectedGameId = gameId;
}

renderCatalog();
selectGame(currentSelectedGameId);

catalog.classList.add("show");
catalog.setAttribute("aria-hidden", "false");
document.body.style.overflow = "hidden";
closeMobileMenu();

if (catalogSearch) {
  setTimeout(() => catalogSearch.focus(), 80);
}
```

}

function closeCatalog() {
if (!catalog) return;

```
catalog.classList.remove("show");
catalog.setAttribute("aria-hidden", "true");
document.body.style.overflow = "";
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

openCatalogButtons.forEach((button) => {
button.addEventListener("click", (event) => {
event.preventDefault();
openCatalog();
});
});

homeGameCards.forEach((card) => {
card.addEventListener("click", () => {
openCatalog(card.dataset.gameId);
});
});

if (catalogClose) {
catalogClose.addEventListener("click", closeCatalog);
}

if (catalog) {
catalog.addEventListener("click", (event) => {
if (event.target === catalog) {
closeCatalog();
}
});
}

if (catalogSearch) {
catalogSearch.addEventListener("input", renderCatalog);
}

filterButtons.forEach((button) => {
button.addEventListener("click", () => {
filterButtons.forEach((item) => item.classList.remove("active"));
button.classList.add("active");
currentFilter = button.dataset.filter || "all";
renderCatalog();
});
});

if ("IntersectionObserver" in window && sections.length > 0) {
const observer = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (!entry.isIntersecting) return;

```
      const currentId = entry.target.getAttribute("id");

      menuLinks.forEach((link) => {
        if (link.dataset.openCatalog !== undefined) return;

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

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
closeCatalog();
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
renderCatalog();
selectGame(currentSelectedGameId);
setHeaderState();

console.log("BoardNet catalog modal 연결 완료");
});
