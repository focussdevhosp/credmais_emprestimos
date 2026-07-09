const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const cursorLight = document.querySelector(".cursor-light");
const whatsappNumber = "5500000000000";
const pageMotion = document.body.dataset.motion || "home";
const motionPresets = {
  commerce: {
    split: { y: 52, x: 0, opacity: 0, rotate: 0 },
    image: { yPercent: -8, xPercent: 2, scale: 1.08 },
    list: { x: -18, y: 18 },
    card: { y: 54, rotate: -1 },
  },
  micro: {
    split: { y: 18, x: 0, opacity: 0, scale: 0.96 },
    image: { yPercent: -5, xPercent: -2, scale: 1.14 },
    list: { x: 0, y: 24 },
    card: { y: 32, scale: 0.96 },
  },
  drive: {
    split: { y: 0, x: -54, opacity: 0 },
    image: { yPercent: -7, xPercent: 5, scale: 1.1 },
    list: { x: -46, y: 0 },
    card: { x: -68, rotate: 0 },
  },
  delivery: {
    split: { y: 34, x: 34, opacity: 0, rotate: 1.5 },
    image: { yPercent: -12, xPercent: -4, scale: 1.12 },
    list: { x: 34, y: 16 },
    card: { y: 46, rotate: 1.5 },
  },
  home: {
    split: { y: 34, opacity: 0 },
    image: { yPercent: -10, xPercent: 0, scale: 1.1 },
    list: { x: -34, y: 0 },
    card: { y: 80, rotate: 2 },
  },
};
const motion = motionPresets[pageMotion] || motionPresets.home;

document.addEventListener("mousemove", (event) => {
  if (!cursorLight) return;
  cursorLight.style.left = `${event.clientX}px`;
  cursorLight.style.top = `${event.clientY}px`;
});

document.querySelectorAll(".scenario-card, .journey-step, .detail-list article").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
});

menuToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const localHashLinks = navLinks.filter((link) => link.getAttribute("href")?.startsWith("#"));
const sections = localHashLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

const normalizePath = (path) => {
  const file = path.split("/").pop() || "index.html";
  return file === "" ? "index.html" : file;
};

const currentPage = normalizePath(window.location.pathname);

const setActiveLink = () => {
  const current = sections.findLast((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.34);
  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkUrl = new URL(href, window.location.href);
    const linkPage = normalizePath(linkUrl.pathname);
    const matchesPage = linkPage === currentPage && !href.includes("#");
    const matchesSection = current && href === `#${current.id}`;
    const matchesHomeHash =
      currentPage === "index.html" && linkPage === "index.html" && current && linkUrl.hash === `#${current.id}`;

    link.classList.toggle("is-active", Boolean(matchesPage || matchesSection || matchesHomeHash));
  });
};

window.addEventListener("scroll", setActiveLink);
setActiveLink();

document.querySelectorAll("[data-hero-carousel]").forEach((carousel) => {
  const images = [...carousel.querySelectorAll("[data-hero-slide]")];
  const copies = [...carousel.querySelectorAll("[data-hero-copy]")];
  const dots = [...carousel.querySelectorAll("[data-hero-dot]")];
  if (!images.length || images.length !== copies.length) return;

  let activeIndex = images.findIndex((image) => image.classList.contains("is-active"));
  activeIndex = activeIndex >= 0 ? activeIndex : 0;
  let timerId;

  const setSlide = (nextIndex) => {
    activeIndex = (nextIndex + images.length) % images.length;

    images.forEach((image, index) => {
      image.classList.toggle("is-active", index === activeIndex);
    });

    copies.forEach((copy, index) => {
      copy.classList.toggle("is-active", index === activeIndex);
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const start = () => {
    window.clearInterval(timerId);
    timerId = window.setInterval(() => setSlide(activeIndex + 1), 5200);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setSlide(index);
      start();
    });
  });

  carousel.addEventListener("mouseenter", () => window.clearInterval(timerId));
  carousel.addEventListener("mouseleave", start);

  setSlide(activeIndex);
  start();
});

const animateFallback = () => {
  document
    .querySelectorAll(
      [
        "[data-reveal]",
        ".split",
        ".solution-card",
        ".audience-copy",
        ".audience-copy > .btn",
        ".hero-actions .btn",
        ".hero-meter span",
        ".feature-list li",
        ".lead-form",
        ".rich-banner-content > *",
        ".scenario-card",
        ".motion-banner h2",
        ".motion-chip",
        ".stat-strip span",
        ".journey-step",
        ".detail-visual",
        ".detail-list article",
        ".trust-grid article",
        ".testimonial-grid blockquote",
        ".faq-list details",
      ].join(", "),
    )
    .forEach((element) => {
    element.style.opacity = 1;
    element.style.transform = "none";
    element.style.translate = "none";
    element.style.rotate = "none";
    element.style.scale = "none";
  });
};

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.defaults({ ease: "power3.out" });

  gsap.from(".site-header", {
    y: -40,
    opacity: 0,
    duration: 0.9,
  });

  gsap.utils.toArray(".split").forEach((element) => {
    gsap.from(element, {
      ...motion.split,
      duration: 1,
      delay: element.tagName === "H1" ? 0.18 : 0,
      scrollTrigger: {
        trigger: element,
        start: "top 86%",
      },
    });
  });

  const heroActionButtons = document.querySelectorAll(".hero-actions .btn, .audience-copy > .btn");
  if (heroActionButtons.length) {
    gsap.fromTo(
      heroActionButtons,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        delay: 0.35,
        clearProps: "transform,opacity",
      },
    );
  }

  const heroMeterItems = document.querySelectorAll(".hero-meter span");
  if (heroMeterItems.length) {
    gsap.from(heroMeterItems, {
      y: 40,
      opacity: 0,
      duration: 0.85,
      stagger: 0.08,
      delay: 0.52,
    });
  }

  gsap.utils.toArray("[data-count]").forEach((counter) => {
    const value = Number(counter.dataset.count);
    gsap.fromTo(
      counter,
      { innerText: 0 },
      {
        innerText: value,
        duration: 1.2,
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: counter,
          start: "top 90%",
        },
      },
    );
  });

  gsap.utils.toArray("[data-hero]").forEach((section) => {
    const image = section.querySelector("img");
    if (!image) return;

    gsap.to(image, {
      ...motion.image,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  gsap.utils.toArray("[data-reveal]").forEach((section) => {
    gsap.from(section.children, {
      y: 42,
      opacity: 0.38,
      duration: 0.85,
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: "top 72%",
      },
    });
  });

  gsap.utils.toArray(".detail-visual").forEach((visual) => {
    const image = visual.querySelector("img");

    gsap.from(visual, {
      clipPath:
        pageMotion === "drive"
          ? "inset(0 22% 0 0 round 8px)"
          : pageMotion === "delivery"
            ? "inset(10% 0 0 12% round 8px)"
            : "inset(12% 12% 12% 12% round 8px)",
      opacity: 0,
      duration: 1.05,
      scrollTrigger: {
        trigger: visual,
        start: "top 72%",
      },
    });

    gsap.to(image, {
      yPercent: pageMotion === "micro" ? -5 : -9,
      scale: pageMotion === "commerce" ? 1.1 : 1.08,
      ease: "none",
      scrollTrigger: {
        trigger: visual,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  gsap.utils.toArray(".detail-list article").forEach((article, index) => {
    gsap.from(article, {
      ...motion.card,
      opacity: 0,
      duration: 0.78,
      delay: index * 0.06,
      scrollTrigger: {
        trigger: article,
        start: "top 82%",
      },
    });
  });

  const track = document.querySelector("[data-horizontal]");
  if (track) {
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);
    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: ".solutions-track",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    gsap.from(".solution-card", {
      ...motion.card,
      opacity: 0.62,
      duration: 1,
      stagger: 0.12,
      scrollTrigger: {
        trigger: ".solutions-track",
        start: "top 58%",
      },
    });
  }

  gsap.utils.toArray(".audience-page").forEach((section) => {
    const copy = section.querySelector(".audience-copy");
    const listItems = section.querySelectorAll(".feature-list li");

    if (copy) {
      gsap.from(copy.children, {
        y: 42,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: "top 54%",
        },
      });
    }

    gsap.from(listItems, {
      x: section.classList.contains("align-right") ? Math.abs(motion.list.x) : motion.list.x,
      y: motion.list.y,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        start: "top 45%",
      },
    });
  });

  gsap.utils.toArray(".rich-banner").forEach((section) => {
    const image = section.querySelector("img");
    const content = section.querySelector(".rich-banner-content");

    gsap.to(image, {
      yPercent: -8,
      scale: pageMotion === "micro" ? 1.12 : 1.08,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.from(content.children, {
      ...motion.split,
      duration: 0.95,
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        start: "top 58%",
      },
    });
  });

  gsap.utils.toArray(".scenario-card").forEach((card, index) => {
    gsap.from(card, {
      ...motion.card,
      opacity: 0.68,
      duration: 0.85,
      delay: index * 0.035,
      scrollTrigger: {
        trigger: card,
        start: "top 82%",
      },
    });
  });

  gsap.utils.toArray(".motion-banner").forEach((banner) => {
    gsap.from(banner.querySelectorAll("h2, .motion-chip"), {
      x: pageMotion === "drive" ? -70 : pageMotion === "delivery" ? 70 : 0,
      y: pageMotion === "micro" ? 32 : 0,
      opacity: 0,
      scale: pageMotion === "micro" ? 0.94 : 1,
      duration: 0.9,
      stagger: 0.12,
      scrollTrigger: {
        trigger: banner,
        start: "top 74%",
      },
    });
  });

  gsap.utils.toArray(".stat-strip span").forEach((stat, index) => {
    gsap.from(stat, {
      y: pageMotion === "micro" ? 28 : 0,
      x: pageMotion === "drive" ? -46 : pageMotion === "delivery" ? 46 : 0,
      opacity: 0,
      scale: pageMotion === "commerce" ? 0.94 : 1,
      duration: 0.8,
      delay: index * 0.06,
      scrollTrigger: {
        trigger: stat,
        start: "top 84%",
      },
    });
  });

  gsap.utils.toArray(".journey-step").forEach((step, index) => {
    gsap.from(step, {
      x: pageMotion === "drive" ? -70 : pageMotion === "delivery" ? 70 : 0,
      y: pageMotion === "commerce" ? 52 : pageMotion === "micro" ? 26 : 0,
      opacity: 0,
      rotate: pageMotion === "delivery" ? 1.5 : pageMotion === "commerce" ? -1 : 0,
      duration: 0.85,
      delay: index * 0.08,
      scrollTrigger: {
        trigger: ".journey-section",
        start: "top 68%",
      },
    });
  });

  gsap.from(".lead-form", {
    y: 54,
    opacity: 0,
    duration: 0.9,
    scrollTrigger: {
      trigger: ".lead-section",
      start: "top 66%",
    },
  });

  gsap.utils.toArray(".trust-grid article, .testimonial-grid blockquote, .faq-list details").forEach((item, index) => {
    gsap.from(item, {
      y: 34,
      opacity: 0,
      duration: 0.72,
      delay: index * 0.045,
      scrollTrigger: {
        trigger: item,
        start: "top 86%",
      },
    });
  });
} else {
  animateFallback();
}

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document
      .querySelectorAll(".audience-copy > .btn, .hero-actions .btn, .split, .feature-list li")
      .forEach((element) => {
        if (Number(getComputedStyle(element).opacity) < 0.2) {
          element.style.opacity = 1;
          element.style.transform = "none";
          element.style.translate = "none";
          element.style.rotate = "none";
          element.style.scale = "none";
        }
      });
  }, 1400);
});

document.querySelectorAll("[data-form]").forEach((form) =>
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const originalLabel = button?.textContent;
    button?.classList.add("is-loading");
    if (button) button.textContent = "Preparando atendimento";

    const data = new FormData(event.currentTarget);
    const nome = data.get("nome");
    const perfil = data.get("perfil");
    const valor = data.get("valor");
    const cidade = data.get("cidade") || "não informado";
    const message = `Olá, sou ${nome}. Quero uma análise CredMais.\nPerfil: ${perfil}\nValor desejado: ${valor}\nCidade: ${cidade}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      button?.classList.remove("is-loading");
      if (button && originalLabel) button.textContent = originalLabel;
    }, 450);
  }),
);

