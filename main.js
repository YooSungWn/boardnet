// Configuration constants
const CONFIG = {
  SCROLL_THRESHOLD: 10,
  TOP_BUTTON_THRESHOLD: 420,
  SCROLL_OFFSET: 80,
  OFFSET_PADDING: 18,
  FILTER_TRANSITION_DELAY: 250,
  DEFAULT_FILTER: "전체",
  THEME_KEY: "boardnet-theme",
  SCROLL_DEBOUNCE: 100
};

// DOM elements cache
const DOM = {
  topbar: document.querySelector(".topbar"),
  menuToggle: document.querySelector(".menu-toggle"),
  navLinks: document.querySelectorAll("[data-nav]"),
  menuLinks: document.querySelectorAll(".menu a[data-nav]"),
  sections: document.querySelectorAll(".page-section[id]"),
  themeToggle: document.querySelector(".theme-toggle"),
  topButton: document.querySelector(".top-button"),
  gameCards: document.querySelectorAll(".game-card"),
  gameSearch: document.querySelector("#gameSearch"),
  filterButtons: document.querySelectorAll(".filter-btn"),
  emptyMessage: document.querySelector("#emptyMessage"),
  modal: document.querySelector("#gameModal"),
  modalVisual: document.querySelector("#modalVisual"),
  modalTitle: document.querySelector("#modalTitle"),
  modalDesc: document.querySelector("#modalDesc"),
  modalGenre: document.querySelector("#modalGenre"),
  modalPlayers: document.querySelector("#modalPlayers"),
  modalTime: document.querySelector("#modalTime"),
  modalDifficulty: document.querySelector("#modalDifficulty"),
  modalRules: document.querySelector("#modalRules"),
  modalClose: document.querySelector(".modal-close")
};

let currentFilter = CONFIG.DEFAULT_FILTER;

// Utility: Debounce function to prevent excessive event firing
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Utility: Validate element existence
function ensureElement(selector, name) {
  const el = document.querySelector(selector);
  if (!el) {
    console.warn(`Missing element: ${name}`);
  }
  return el;
}

// Get header height for scroll offset calculation
function getHeaderHeight() {
  return DOM.topbar ? DOM.topbar.offsetHeight : 0;
}

// Smooth scroll to target element
function scrollToTarget(targetId) {
  const target = document.querySelector(targetId);

  if (!target) return;

  const headerHeight = getHeaderHeight();
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - CONFIG.OFFSET_PADDING;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: "smooth"
  });
}

// Close mobile menu
function closeMobileMenu() {
  if (!DOM.topbar || !DOM.menuToggle) return;

  DOM.topbar.classList.remove("is-open");
  DOM.menuToggle.setAttribute("aria-expanded", "false");
}

// Toggle mobile menu
function toggleMobileMenu() {
  if (!DOM.topbar || !DOM.menuToggle) return;

  const isOpen = DOM.topbar.classList.toggle("is-open");
  DOM.menuToggle.setAttribute("aria-expanded", String(isOpen));
}

// Update header state on scroll
function setHeaderState() {
  if (DOM.topbar) {
    DOM.topbar.classList.toggle("is-scrolled", window.scrollY > CONFIG.SCROLL_THRESHOLD);
  }

  if (DOM.topButton) {
    DOM.topButton.classList.toggle("show", window.scrollY > CONFIG.TOP_BUTTON_THRESHOLD);
  }

  updateActiveMenu();
}

// Update active menu link based on scroll position
function updateActiveMenu() {
  const headerHeight = getHeaderHeight();
  const currentY = window.scrollY + headerHeight + CONFIG.SCROLL_OFFSET;
  let currentId = "home";

  DOM.sections.forEach((section) => {
    if (currentY >= section.offsetTop) {
      currentId = section.id;
    }
  });

  DOM.menuLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${currentId}`);
  });
}

// Set theme (light or dark)
function setTheme(mode) {
  const isLight = mode === "light";
  
  if (isLight) {
    document.body.classList.add("light");
    localStorage.setItem(CONFIG.THEME_KEY, "light");
    if (DOM.themeToggle) DOM.themeToggle.textContent = "다크";
  } else {
    document.body.classList.remove("light");
    localStorage.setItem(CONFIG.THEME_KEY, "dark");
    if (DOM.themeToggle) DOM.themeToggle.textContent = "라이트";
  }
}

// Initialize theme from localStorage
function initTheme() {
  const savedTheme = localStorage.getItem(CONFIG.THEME_KEY);
  setTheme(savedTheme === "light" ? "light" : "dark");
}

// Extract game data from card dataset
function extractGameData(card) {
  return {
    title: card.dataset.title || "게임명",
    genre: card.dataset.genre || "장르 정보 없음",
    image: card.dataset.image || "",
    players: card.dataset.players || "인원 정보 없음",
    time: card.dataset.time || "시간 정보 없음",
    difficulty: card.dataset.difficulty || "난이도 정보 없음",
    summary: card.dataset.summary || "게임 설명이 없습니다.",
    rules: (card.dataset.rules || "").split("|").filter(Boolean)
  };
}

// Apply game filter based on search keyword and filter selection
function applyGameFilter() {
  const keyword = DOM.gameSearch ? DOM.gameSearch.value.trim().toLowerCase() : "";
  let visibleCount = 0;

  DOM.gameCards.forEach((card) => {
    const title = (card.dataset.title || "").toLowerCase();
    const genre = (card.dataset.genre || "").toLowerCase();
    const summary = (card.dataset.summary || "").toLowerCase();

    const matchKeyword = !keyword || title.includes(keyword) || genre.includes(keyword) || summary.includes(keyword);
    const matchFilter = currentFilter === CONFIG.DEFAULT_FILTER || genre.includes(currentFilter.toLowerCase());

    const shouldShow = matchKeyword && matchFilter;

    card.classList.toggle("is-hidden", !shouldShow);

    if (shouldShow) {
      visibleCount += 1;
    }
  });

  if (DOM.emptyMessage) {
    DOM.emptyMessage.classList.toggle("show", visibleCount === 0);
  }
}

// Set active filter and update game display
function setFilter(filterName) {
  currentFilter = filterName;

  DOM.filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filterName);
  });

  applyGameFilter();
}

// Open game modal with game details
function openGameModal(card) {
  if (!DOM.modal) return;

  const data = extractGameData(card);

  if (DOM.modalVisual) {
    DOM.modalVisual.className = "modal-visual";
    if (data.image) {
      DOM.modalVisual.classList.add(data.image);
    }
  }

  if (DOM.modalTitle) DOM.modalTitle.textContent = data.title;
  if (DOM.modalDesc) DOM.modalDesc.textContent = data.summary;
  if (DOM.modalGenre) DOM.modalGenre.textContent = `장르: ${data.genre}`;
  if (DOM.modalPlayers) DOM.modalPlayers.textContent = `인원: ${data.players}`;
  if (DOM.modalTime) DOM.modalTime.textContent = `시간: ${data.time}`;
  if (DOM.modalDifficulty) DOM.modalDifficulty.textContent = `난이도: ${data.difficulty}`;

  if (DOM.modalRules) {
    DOM.modalRules.innerHTML = "";

    data.rules.forEach((rule) => {
      const li = document.createElement("li");
      li.textContent = rule;
      DOM.modalRules.appendChild(li);
    });
  }

  DOM.modal.classList.add("show");
  DOM.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

// Close game modal
function closeGameModal() {
  if (!DOM.modal) return;

  DOM.modal.classList.remove("show");
  DOM.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  if (DOM.menuToggle) {
    DOM.menuToggle.addEventListener("click", toggleMobileMenu);
  }

  // Navigation links
  DOM.navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) return;

      event.preventDefault();

      const filterMove = link.dataset.filterMove;

      closeMobileMenu();
      closeGameModal();

      scrollToTarget(href);

      if (filterMove) {
        setTimeout(() => {
          setFilter(filterMove);
        }, CONFIG.FILTER_TRANSITION_DELAY);
      }
    });
  });

  // Filter buttons
  DOM.filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterName = button.dataset.filter || CONFIG.DEFAULT_FILTER;
      setFilter(filterName);
    });
  });

  // Game search
  if (DOM.gameSearch) {
    DOM.gameSearch.addEventListener("input", applyGameFilter);
  }

  // Game cards - use event delegation
  document.addEventListener("click", (event) => {
    const card = event.target.closest(".game-card");
    if (card) {
      openGameModal(card);
    }
  });

  // Modal close button
  if (DOM.modalClose) {
    DOM.modalClose.addEventListener("click", closeGameModal);
  }

  // Modal background click
  if (DOM.modal) {
    DOM.modal.addEventListener("click", (event) => {
      if (event.target === DOM.modal) {
        closeGameModal();
      }
    });
  }

  // Keyboard close (Escape)
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeGameModal();
      closeMobileMenu();
    }
  });

  // Theme toggle
  if (DOM.themeToggle) {
    DOM.themeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light");
      setTheme(isLight ? "dark" : "light");
    });
  }

  // Top button
  if (DOM.topButton) {
    DOM.topButton.addEventListener("click", () => {
      scrollToTarget("#home");
    });
  }

  // Scroll and resize events with debouncing
  window.addEventListener("scroll", debounce(setHeaderState, CONFIG.SCROLL_DEBOUNCE), {
    passive: true
  });

  window.addEventListener("resize", setHeaderState);

  // Initialize
  initTheme();
  applyGameFilter();
  setHeaderState();
});
