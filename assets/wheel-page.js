(() => {
  const SECTOR_COUNT = 8;
  const SECTOR_ANGLE = 360 / SECTOR_COUNT;
  const SPIN_DURATION_MS = 5200;
  const SPIN_EASING = "cubic-bezier(0.12, 0.85, 0.18, 1)";

  const SECTORS = [
    "secret",
    "minecraft",
    "gta",
    "bonus600",
    "battle",
    "bonus300",
    "apex",
    "sims",
  ];

  const rotor = document.getElementById("bonusWheelRotor");
  const spinButton = document.getElementById("bonusSpinButton");
  const timerNode = document.getElementById("bonusSpinTimer");
  const winnersNode = document.getElementById("bonusWinnersCount");
  const premiumModal = document.getElementById("bonusPremiumModal");
  const subscribeModal = document.getElementById("bonusSubscribeModal");
  const subscribeModalTitle = document.getElementById("bonusSubscribeModalTitle");

  let currentRotation = 0;
  let isSpinning = false;
  let activeAnimation = null;

  const normalizeIndex = (index) => {
    const value = Number(index);
    if (!Number.isInteger(value) || value < 0 || value >= SECTOR_COUNT) {
      throw new RangeError(`spinTo: index must be an integer from 0 to ${SECTOR_COUNT - 1}`);
    }
    return value;
  };

  const prefersReducedMotion = () =>
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const spinTo = (index, options = {}) => {
    if (!rotor) return Promise.reject(new Error("Bonus wheel is not mounted"));
    if (isSpinning) return Promise.reject(new Error("Bonus wheel is already spinning"));

    const targetIndex = normalizeIndex(index);
    const reduced = prefersReducedMotion();
    const extraSpins = reduced
      ? 1
      : Number.isFinite(options.spins)
        ? Math.max(1, options.spins)
        : 5;
    const duration = reduced
      ? 600
      : Number.isFinite(options.duration)
        ? options.duration
        : SPIN_DURATION_MS;

    const mod = (value, max) => ((value % max) + max) % max;
    const currentMod = mod(currentRotation, 360);
    const targetMod = mod(-targetIndex * SECTOR_ANGLE, 360);
    let delta = targetMod - currentMod;
    if (delta <= 0) delta += 360;
    delta += (extraSpins - 1) * 360;
    const nextRotation = currentRotation + delta;

    isSpinning = true;
    spinButton?.setAttribute("disabled", "true");
    spinButton?.setAttribute("aria-busy", "true");

    if (activeAnimation) {
      activeAnimation.cancel();
      activeAnimation = null;
    }

    activeAnimation = rotor.animate(
      [
        { transform: `rotate(${currentRotation}deg)` },
        { transform: `rotate(${nextRotation}deg)` },
      ],
      {
        duration,
        easing: SPIN_EASING,
        fill: "forwards",
      },
    );

    return activeAnimation.finished.then(() => {
      currentRotation = nextRotation;
      rotor.style.transform = `rotate(${currentRotation}deg)`;
      activeAnimation?.cancel();
      activeAnimation = null;
      isSpinning = false;
      spinButton?.removeAttribute("disabled");
      spinButton?.removeAttribute("aria-busy");
      return targetIndex;
    });
  };

  window.spinTo = spinTo;
  window.BONUS_WHEEL = {
    spinTo,
    SECTOR_COUNT,
    SECTORS,
  };

  spinButton?.addEventListener("click", () => {
    if (isSpinning) return;
    const detail = { spinTo };
    document.dispatchEvent(new CustomEvent("bonus-wheel-spin-request", { detail }));
    if (typeof window.onBonusWheelSpinClick === "function") {
      window.onBonusWheelSpinClick(detail);
    }
  });

  const padTime = (value) => String(value).padStart(2, "0");

  const updateDailyTimer = () => {
    if (!timerNode) return;
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();

    if (diff <= 0) {
      timerNode.textContent = "24:00:00";
      return;
    }

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    timerNode.textContent = `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
  };

  updateDailyTimer();
  window.setInterval(updateDailyTimer, 1000);

  if (winnersNode) {
    let winnersCount = 1248;
    let winnersStep = 2;
    winnersNode.textContent = String(winnersCount);
    window.setInterval(() => {
      winnersCount += winnersStep;
      winnersStep *= -1;
      winnersNode.textContent = String(winnersCount);
    }, 60000);
  }

  const initLiveTicker = () => {
    const track = document.querySelector(".bonus-live-ticker__track");
    if (!track || track.dataset.marqueeReady === "true") return;

    const items = [...track.children];
    items.forEach((item) => {
      track.appendChild(item.cloneNode(true));
    });

    track.dataset.marqueeReady = "true";
  };

  initLiveTicker();

  let lockedScrollY = 0;

  const lockPageScroll = () => {
    lockedScrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.classList.add("bonus-modal-open");
  };

  const unlockPageScroll = () => {
    document.body.classList.remove("bonus-modal-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, lockedScrollY);
  };

  const scrollToWheel = () => {
    const target = document.querySelector(".bonus-wheel-stage") ?? document.getElementById("bonusSpinButton");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const bindModal = (modal, openTriggers) => {
    if (!modal) return;
    const dialog = modal.querySelector(".bonus-modal-dialog");
    const setOpen = (open, returnFocusEl) => {
      modal.classList.toggle("is-open", open);
      modal.setAttribute("aria-hidden", open ? "false" : "true");
      modal.toggleAttribute("inert", !open);
      if (open) {
        lockPageScroll();
        window.setTimeout(() => modal.querySelector("[data-bonus-modal-close]")?.focus(), 60);
      } else {
        unlockPageScroll();
        if (returnFocusEl) {
          returnFocusEl.focus();
        }
      }
    };

    openTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const channel = trigger.dataset.subscribeChannel;
        if (channel && subscribeModalTitle) {
          subscribeModalTitle.textContent =
            channel === "vk" ? "Подписка VK" : "Подписка Telegram";
        }
        setOpen(true, trigger);
      });
    });

    modal.querySelectorAll("[data-bonus-modal-close]").forEach((trigger) => {
      trigger.addEventListener("click", () => setOpen(false));
    });

    modal.addEventListener("pointerdown", (event) => {
      if (event.target !== modal || dialog?.contains(event.target)) return;
      setOpen(false);
    });

    modal.querySelector("[data-bonus-modal-action]")?.addEventListener("click", () => {
      setOpen(false);
      if (modal !== premiumModal) return;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(scrollToWheel);
      });
    });
  };

  bindModal(premiumModal, document.querySelectorAll("[data-bonus-open-premium-modal]"));
  bindModal(subscribeModal, document.querySelectorAll("[data-bonus-open-subscribe-modal]"));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openModal = [premiumModal, subscribeModal].find((modal) => modal?.classList.contains("is-open"));
    if (!openModal) return;
    openModal.classList.remove("is-open");
    openModal.setAttribute("aria-hidden", "true");
    openModal.setAttribute("inert", "");
    unlockPageScroll();
  });
})();
