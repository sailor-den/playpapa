(() => {
  document.querySelectorAll(".referrals-faq-item").forEach((item) => {
    const trigger = item.querySelector(".referrals-faq-trigger");
    trigger?.addEventListener("click", () => {
      const open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  const defaultBanner = document.querySelector('[data-referral-state="default"]');
  const appliedBanner = document.querySelector('[data-referral-state="applied"]');
  const applyButton = document.querySelector("[data-referral-apply]");
  const copyButton = document.querySelector("[data-referral-copy]");

  const setReferralState = (state) => {
    const applied = state === "applied";
    defaultBanner?.toggleAttribute("hidden", applied);
    defaultBanner?.toggleAttribute("inert", applied);
    appliedBanner?.toggleAttribute("hidden", !applied);
    appliedBanner?.toggleAttribute("inert", !applied);
  };

  if (new URLSearchParams(window.location.search).get("state") === "applied") {
    setReferralState("applied");
  }

  applyButton?.addEventListener("click", () => {
    setReferralState("applied");
  });

  copyButton?.addEventListener("click", async () => {
    const referralLink =
      copyButton.getAttribute("data-referral-link") ||
      document.querySelector(".referrals-link-text")?.textContent?.trim() ||
      "";

    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
    } catch {
      /* clipboard unavailable */
    }
  });
})();
