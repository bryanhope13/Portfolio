(() => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  if (!toggle || !panel) return;

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
      // Hiding the panel in the same tick can cancel mailto: navigation.
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
})();

// Contact chooser: email links open a small dialog with reliable options,
// because a plain mailto: link does nothing when no desktop mail app is set up.
(() => {
  const links = document.querySelectorAll('a[href^="mailto:"]');
  if (!links.length || typeof HTMLDialogElement !== "function") return;

  const email = links[0].getAttribute("href").replace("mailto:", "").split("?")[0];
  const subject = "Hello from your portfolio";
  const enc = encodeURIComponent;

  const dialog = document.createElement("dialog");
  dialog.className = "contact-dialog";
  dialog.setAttribute("aria-labelledby", "contact-dialog-title");
  dialog.innerHTML = `
    <form method="dialog" class="contact-close-form">
      <button class="contact-close" aria-label="Close">×</button>
    </form>
    <h2 id="contact-dialog-title">Let’s talk</h2>
    <p class="contact-address">${email}</p>
    <div class="contact-options">
      <a class="btn btn-primary" target="_blank" rel="noopener"
         href="https://mail.google.com/mail/?view=cm&fs=1&to=${enc(email)}&su=${enc(subject)}">Open in Gmail</a>
      <a class="btn btn-ghost" target="_blank" rel="noopener"
         href="https://outlook.live.com/mail/0/deeplink/compose?to=${enc(email)}&subject=${enc(subject)}">Open in Outlook</a>
      <a class="btn btn-ghost" data-contact-native
         href="mailto:${email}?subject=${enc(subject)}">Use my email app</a>
      <button class="btn btn-ghost" type="button" data-contact-copy>Copy email address</button>
    </div>
    <p class="contact-status" role="status" aria-live="polite"></p>
  `;
  document.body.appendChild(dialog);

  const status = dialog.querySelector(".contact-status");
  const copyBtn = dialog.querySelector("[data-contact-copy]");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const t = document.createElement("textarea");
      t.value = email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    copyBtn.textContent = "Copied ✓";
    status.textContent = "Email address copied to your clipboard.";
    window.setTimeout(() => (copyBtn.textContent = "Copy email address"), 2000);
  };
  copyBtn.addEventListener("click", copy);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close(); // click on the backdrop
  });
  dialog.addEventListener("close", () => (status.textContent = ""));

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      dialog.showModal();
    });
  });
})();
