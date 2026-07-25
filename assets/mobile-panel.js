(() => {
  const mount = document.querySelector("[data-mobile-panel]");
  if (!mount) return;

  const pageName = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isHome = pageName === "index.html" || pageName === "";
  const isCatalog = pageName === "catalog.html";
  const opensCatalogPanel = isHome || isCatalog;
  const active = (state) => (state ? ' class="is-active" aria-current="page"' : "");
  const catalogHref = opensCatalogPanel ? "#catalogMegaMenu" : "./catalog.html";
  const catalogAttrs = `${active(isCatalog)}${opensCatalogPanel ? ' data-catalog-trigger aria-expanded="false" aria-controls="catalogMegaMenu"' : ""}`;

  mount.outerHTML = `
    <nav class="mobile-bottom-nav" aria-label="Мобильное меню">
      <a href="./index.html" aria-label="Главная"${active(isHome)}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 10.8 12 4l8 6.8V20a1 1 0 0 1-1 1h-4.2v-5.8H9.2V21H5a1 1 0 0 1-1-1v-9.2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
        </svg>
        <span>Главная</span>
      </a>
      <a href="${catalogHref}" aria-label="Каталог"${catalogAttrs}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="6" height="6" rx="1.8" fill="currentColor" />
          <rect x="14" y="4" width="6" height="6" rx="1.8" fill="currentColor" />
          <rect x="4" y="14" width="6" height="6" rx="1.8" fill="currentColor" />
          <rect x="14" y="14" width="6" height="6" rx="1.8" fill="currentColor" />
        </svg>
        <span>Каталог</span>
      </a>
      <a href="#mobileSearch" aria-label="Поиск" data-mobile-search-trigger aria-expanded="false" aria-controls="mobileSearch">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" />
        </svg>
        <span>Поиск</span>
      </a>
      <a href="#" aria-label="Бонусы">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 10h16v10H4V10Zm0-4h16v4H4V6Zm8 0v14M12 6c-1.7-3.1-5.2-2.8-5.2-.5C6.8 7.2 9 7.5 12 6Zm0 0c1.7-3.1 5.2-2.8 5.2-.5C17.2 7.2 15 7.5 12 6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
        </svg>
        <span>Бонусы</span>
      </a>
      <a href="#" aria-label="Профиль" data-auth-open="login">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Zm-7 7.1c.5-3.6 3.3-5.6 7-5.6s6.5 2 7 5.6c.1.7-.5 1.2-1.2 1.2H6.2c-.7 0-1.3-.5-1.2-1.2Z" fill="currentColor" />
        </svg>
        <span>Профиль</span>
      </a>
    </nav>
  `;
})();
