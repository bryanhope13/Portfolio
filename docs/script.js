(() => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");

  if (toggle && panel) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      panel.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!open);
    });

    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        const href = link.getAttribute("href") || "";
        if (href.startsWith("mailto:")) {
          window.setTimeout(() => setOpen(false), 300);
          return;
        }
        setOpen(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  const stage = document.querySelector("[data-stage]");
  const img = stage?.querySelector("img");
  const items = document.querySelectorAll("[data-preview]");
  if (!stage || !img || !items.length) return;

  const setPreview = (src, alt) => {
    img.src = src;
    if (alt) img.alt = alt;
  };

  items.forEach((item) => {
    const activate = () => {
      items.forEach((el) => el.classList.remove("is-active"));
      item.classList.add("is-active");
      setPreview(item.getAttribute("data-preview") || "", item.getAttribute("data-alt") || "");
    };
    item.addEventListener("mouseenter", activate);
    item.addEventListener("focus", activate);
  });
})();
