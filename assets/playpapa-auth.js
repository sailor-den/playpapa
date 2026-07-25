(() => {
  const jsonRequest = async (url, payload) => {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "Ошибка запроса");
    }
    return data;
  };

  const getInput = (form, name) => form.querySelector(`[name="${name}"]`)?.value.trim() || "";
  const getPassword = (form, name) => form.querySelector(`[name="${name}"]`)?.value || "";

  const messageFor = (form) => {
    let message = form.querySelector(".auth-local-message");
    if (!message) {
      message = document.createElement("div");
      message.className = "auth-local-message";
      message.setAttribute("role", "status");
      form.prepend(message);
    }
    return message;
  };

  const showFormMessage = (form, type, text) => {
    const message = messageFor(form);
    message.className = `auth-local-message is-${type}`;
    message.textContent = text;
  };

  const finishAuth = () => {
    if (window.location.pathname === "/login" || window.location.pathname === "/register") {
      window.location.assign("/profile");
      return;
    }
    window.location.reload();
  };

  const bindSubmit = (selector, handler) => {
    document.querySelectorAll(selector).forEach((form) => {
      form.addEventListener(
        "submit",
        async (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          const submit = form.querySelector('button[type="submit"]');
          if (submit) submit.disabled = true;
          try {
            await handler(form);
            finishAuth();
          } catch (error) {
            const message = error instanceof Error ? error.message : "Ошибка";
            showFormMessage(form, "error", message);
          } finally {
            if (submit) submit.disabled = false;
          }
        },
        true
      );
    });
  };

  bindSubmit('[data-auth-form="login"]', (form) =>
    jsonRequest("/auth/login", {
      login: getInput(form, "login"),
      password: getPassword(form, "password"),
    })
  );

  bindSubmit('[data-auth-form="register"]', (form) =>
    jsonRequest("/auth/register", {
      login: getInput(form, "register-login"),
      email: getInput(form, "register-email"),
      password: getPassword(form, "register-password"),
      passwordRepeat: getPassword(form, "register-password-repeat"),
    })
  );

  const logout = async () => {
    await jsonRequest("/auth/logout", {});
    window.location.assign("/");
  };

  document.querySelectorAll("[data-auth-logout]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      logout().catch(() => window.location.assign("/"));
    });
  });

  const updateProfileMenu = (user) => {
    const heading = document.querySelector(".profile-popover-heading");
    if (heading && user) {
      const title = heading.querySelector("h2");
      const lines = heading.querySelectorAll("p span");
      if (title) title.textContent = `Привет, ${user.login}`;
      if (lines[0]) lines[0].textContent = "Баланс";
      if (lines[1]) lines[1].textContent = `${Number(user.balance || 0).toFixed(2)} ₽`;
    }

    const profileButtons = document.querySelectorAll(".profile-menu-item");
    if (user) {
      profileButtons.forEach((button) => {
        button.disabled = false;
      });
      const first = document.querySelector(".profile-menu-item");
      first?.addEventListener("click", () => window.location.assign("/profile"), true);
    }

    document.querySelectorAll(".profile-login").forEach((button) => {
      button.addEventListener(
        "click",
        (event) => {
          if (user) {
            event.preventDefault();
            event.stopImmediatePropagation();
            logout().catch(() => window.location.assign("/"));
            return;
          }
          if (!document.getElementById("authModal")) {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.location.assign("/login");
          }
        },
        true
      );

      if (user) {
        button.querySelector("span") && (button.querySelector("span").textContent = "Выйти");
      }
    });

    document.querySelectorAll('[aria-label="Профиль"][data-auth-open]').forEach((link) => {
      if (user) {
        link.setAttribute("href", "/profile");
        link.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.location.assign("/profile");
          },
          true
        );
      } else if (!document.getElementById("authModal")) {
        link.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.location.assign("/login");
          },
          true
        );
      }
    });
  };

  fetch("/auth/me", { credentials: "same-origin", headers: { Accept: "application/json" } })
    .then((response) => response.json())
    .then((data) => updateProfileMenu(data.user || null))
    .catch(() => updateProfileMenu(null));
})();
