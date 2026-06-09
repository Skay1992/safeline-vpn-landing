const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = document.querySelectorAll(".nav-panel a");
const placeholderLinks = document.querySelectorAll('a[href="#"]');
const demoToast = document.querySelector(".demo-toast");
let toastTimer;

if (navToggle && navPanel) {
  const toggleMenu = (open) => {
    const toggleLabel = navToggle.querySelector(".sr-only");

    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.classList.toggle("is-open", open);
    navPanel.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);

    if (toggleLabel) {
      toggleLabel.textContent = open ? "Закрыть меню" : "Открыть меню";
    }
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    toggleMenu(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";

    if (event.key === "Escape" && isOpen) {
      toggleMenu(false);
      navToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!navPanel.contains(event.target) && !navToggle.contains(event.target)) {
      toggleMenu(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      toggleMenu(false);
    }
  });
}

placeholderLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const scrollTarget = link.dataset.scroll;
    const placeholderMessage = link.dataset.placeholderMessage;

    if (scrollTarget) {
      document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth" });
    }

    if (placeholderMessage && demoToast) {
      window.clearTimeout(toastTimer);
      demoToast.textContent = placeholderMessage;
      demoToast.classList.add("is-visible");

      toastTimer = window.setTimeout(() => {
        demoToast.classList.remove("is-visible");
      }, 3600);
    }
  });
});
