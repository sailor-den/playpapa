(() => {
  const screens = document.querySelectorAll("[data-account-screen]");
  const navItems = document.querySelectorAll("[data-account-nav]");
  const historyLinks = document.querySelectorAll("[data-account-go-history]");
  const historyTabs = document.querySelectorAll(".account-history-tab");

  const showScreen = (name) => {
    screens.forEach((screen) => {
      const active = screen.dataset.accountScreen === name;
      screen.hidden = !active;
      screen.toggleAttribute("inert", !active);
    });

    navItems.forEach((item) => {
      const active = item.dataset.accountNav === name;
      item.classList.toggle("is-active", active);
      if (item.matches("button, a")) {
        item.setAttribute("aria-current", active ? "page" : "false");
      }
    });
  };

  navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const target = item.dataset.accountNav;
      if (!target || target === "logout") return;
      event.preventDefault();
      showScreen(target);
    });
  });

  historyLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showScreen("history");
    });
  });

  historyTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      historyTabs.forEach((node) => {
        const active = node === tab;
        node.classList.toggle("is-active", active);
        node.setAttribute("aria-selected", active ? "true" : "false");
      });
    });
  });

  const initialScreen = new URLSearchParams(window.location.search).get("screen");
  if (initialScreen === "history" || initialScreen === "settings") {
    showScreen(initialScreen);
  }
})();
