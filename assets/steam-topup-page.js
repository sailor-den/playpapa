(() => {
  const selectOne = (items, selected, onSelect) => {
    items.forEach((item) => {
      item.addEventListener("click", () => {
        items.forEach((node) => {
          const active = node === item;
          node.classList.toggle("is-active", active);
          node.classList.toggle("is-selected", active);
          if (node.matches('[role="radio"]')) {
            node.setAttribute("aria-checked", active ? "true" : "false");
          }
        });
        onSelect?.(item);
      });
    });
  };

  const tabs = document.querySelectorAll(".steam-topup-tab");
  const panels = document.querySelectorAll(".steam-topup-form-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach((node) => {
        const active = node === tab;
        node.classList.toggle("is-active", active);
        node.setAttribute("aria-selected", active ? "true" : "false");
      });
      panels.forEach((panel) => {
        const active = panel.dataset.tabPanel === target;
        panel.hidden = !active;
        panel.toggleAttribute("inert", !active);
      });
    });
  });

  const initialTab = new URLSearchParams(window.location.search).get("tab");
  if (initialTab === "gift") {
    document.querySelector('.steam-topup-tab[data-tab="gift"]')?.click();
  }

  document.querySelectorAll(".steam-topup-regions").forEach((group) => {
    selectOne(Array.from(group.querySelectorAll(".steam-topup-region")));
  });

  document.querySelectorAll(".steam-topup-gift-grid").forEach((grid) => {
    selectOne(Array.from(grid.querySelectorAll(".steam-topup-gift-card")));
  });

  document.querySelectorAll(".steam-topup-sidebar .topup-payment-methods").forEach((group) => {
    selectOne(Array.from(group.querySelectorAll(".topup-payment-method")));
  });

  document.querySelectorAll(".steam-topup-quick-amounts").forEach((group) => {
    selectOne(Array.from(group.querySelectorAll("button")));
  });

  document.querySelectorAll(".steam-topup-currency-tabs").forEach((group) => {
    selectOne(Array.from(group.querySelectorAll("button")));
  });

  document.querySelectorAll(".steam-topup-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("is-on");
      toggle.setAttribute("aria-pressed", toggle.classList.contains("is-on") ? "true" : "false");
    });
  });

  document.querySelectorAll(".steam-topup-faq-item").forEach((item) => {
    const trigger = item.querySelector(".steam-topup-faq-trigger");
    trigger?.addEventListener("click", () => {
      const open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
})();
