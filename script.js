const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = document.querySelectorAll(".nav-panel a");
const actionLinks = document.querySelectorAll("a[data-scroll], a[data-placeholder-message]");
const demoToast = document.querySelector(".demo-toast");
const heroSection = document.querySelector(".hero");
const finalCtaSection = document.querySelector(".final-cta");
let toastTimer;

if (heroSection && finalCtaSection && "IntersectionObserver" in window) {
  let heroVisible = true;
  let finalCtaVisible = false;

  const updateSpaceStage = () => {
    document.body.dataset.spaceStage = finalCtaVisible
      ? "cta"
      : heroVisible
        ? "hero"
        : "content";
  };

  const spaceStageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === heroSection) {
          heroVisible = entry.isIntersecting && entry.intersectionRatio >= 0.18;
        }

        if (entry.target === finalCtaSection) {
          finalCtaVisible = entry.isIntersecting && entry.intersectionRatio >= 0.18;
        }
      });

      updateSpaceStage();
    },
    { threshold: [0, 0.18, 0.35] },
  );

  spaceStageObserver.observe(heroSection);
  spaceStageObserver.observe(finalCtaSection);
  updateSpaceStage();
}

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

actionLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const scrollTarget = link.dataset.scroll;
    const placeholderMessage = link.dataset.placeholderMessage;

    if (scrollTarget) {
      const targetElement = document.getElementById(scrollTarget);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });

        if (link.hash === `#${scrollTarget}`) {
          history.pushState(null, "", link.hash);
        }
      }
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
