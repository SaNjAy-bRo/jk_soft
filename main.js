const mobileMenu = document.getElementById("mobileMenu");
const mobileNav = document.getElementById("mobileNav");
const servicesToggle = document.getElementById("servicesToggle");
const servicesMenu = document.getElementById("servicesMenu");
const siteHeader = document.getElementById("siteHeader");

if (mobileMenu && mobileNav) {
  mobileMenu.addEventListener("click", () => {
    mobileNav.classList.toggle("hidden");
  });
}

if (servicesToggle && servicesMenu) {
  servicesToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    servicesMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!servicesMenu.contains(target) && !servicesToggle.contains(target)) {
      servicesMenu.classList.add("hidden");
    }
  });
}

const mobileServicesToggle = document.querySelector("[data-mobile-services]");
const mobileServices = document.querySelector(".mobile-services");
if (mobileServicesToggle && mobileServices) {
  mobileServicesToggle.addEventListener("click", () => {
    mobileServices.classList.toggle("hidden");
  });
}

if (siteHeader) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  });
}

const heroCanvas = document.getElementById("heroCanvas");
if (heroCanvas) {
  const ctx = heroCanvas.getContext("2d");
  let width = 0;
  let height = 0;
  let gridSize = 90;
  let glowNodes = [];
  let streaks = [];
  let lastStreak = 0;

  const meshPoints = [
    { x: 0.2, y: 0.25, r: 480, color: "rgba(59, 130, 246, 0.18)", speed: 0.00012, phase: 0 },
    { x: 0.7, y: 0.2, r: 520, color: "rgba(6, 182, 212, 0.14)", speed: 0.0001, phase: 1.2 },
    { x: 0.5, y: 0.65, r: 540, color: "rgba(251, 146, 60, 0.08)", speed: 0.00008, phase: 2.1 }
  ];

  const resizeCanvas = () => {
    width = heroCanvas.offsetWidth;
    height = heroCanvas.offsetHeight;
    heroCanvas.width = width;
    heroCanvas.height = height;
    gridSize = width < 768 ? 110 : 90;
    buildGlowNodes();
  };

  const buildGlowNodes = () => {
    const cols = Math.floor(width / gridSize);
    const rows = Math.floor(height / gridSize);
    const nodes = [];
    for (let x = 1; x < cols - 1; x += 1) {
      for (let y = 1; y < rows - 1; y += 1) {
        nodes.push({
          x: x * gridSize,
          y: y * gridSize,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    const count = width < 768 ? 2 : 4;
    glowNodes = nodes.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const spawnStreak = (time) => {
    const length = 240 + Math.random() * 200;
    const x = -length;
    const y = height + Math.random() * height * 0.4;
    streaks.push({
      x,
      y,
      length,
      width: 2 + Math.random(),
      speed: 0.6 + Math.random() * 0.6,
      life: time
    });
  };

  const drawBackground = (time) => {
    ctx.clearRect(0, 0, width, height);
    const base = ctx.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, "#0a1628");
    base.addColorStop(0.5, "#0d1d35");
    base.addColorStop(1, "#0a1628");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    meshPoints.forEach((point) => {
      const px = (point.x + Math.sin(time * point.speed + point.phase) * 0.08) * width;
      const py = (point.y + Math.cos(time * point.speed + point.phase) * 0.08) * height;
      const gradient = ctx.createRadialGradient(px, py, 0, px, py, point.r);
      gradient.addColorStop(0, point.color);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });
  };

  const drawGrid = () => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawGlowNodes = (time) => {
    glowNodes.forEach((node) => {
      const pulse = 0.5 + Math.sin(time * 0.002 + node.phase) * 0.5;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6 + pulse * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 242, 254, ${0.15 + pulse * 0.35})`;
      ctx.fill();
    });
  };

  const updateStreaks = (time) => {
    if (time - lastStreak > (width < 768 ? 6000 : 4500)) {
      spawnStreak(time);
      lastStreak = time;
    }
    streaks = streaks.filter((streak) => time - streak.life < 14000);
    streaks.forEach((streak) => {
      streak.x += streak.speed * 2;
      streak.y -= streak.speed * 1.4;
      const grad = ctx.createLinearGradient(
        streak.x,
        streak.y,
        streak.x + streak.length,
        streak.y - streak.length
      );
      grad.addColorStop(0, "rgba(59, 130, 246, 0)");
      grad.addColorStop(0.5, "rgba(59, 130, 246, 0.18)");
      grad.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = streak.width;
      ctx.beginPath();
      ctx.moveTo(streak.x, streak.y);
      ctx.lineTo(streak.x + streak.length, streak.y - streak.length);
      ctx.stroke();
    });
  };

  const animateHero = (time) => {
    drawBackground(time);
    drawGrid();
    drawGlowNodes(time);
    updateStreaks(time);
    requestAnimationFrame(animateHero);
  };

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  requestAnimationFrame(animateHero);
}

const stickyBar = document.getElementById("stickyBar");
const trigger = document.getElementById("testimonials");
if (stickyBar && trigger) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stickyBar.classList.remove("translate-y-10", "opacity-0");
          stickyBar.classList.add("opacity-100");
        } else {
          stickyBar.classList.add("translate-y-10", "opacity-0");
          stickyBar.classList.remove("opacity-100");
        }
      });
    },
    { threshold: 0.15 }
  );
  observer.observe(trigger);
}

const statNumbers = document.querySelectorAll(".stat-number");
if (statNumbers.length > 0) {
  const animateStat = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(target * easeOut(progress));
      el.textContent = `${value}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          animateStat(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  statNumbers.forEach((el) => statsObserver.observe(el));
}

const faqItems = document.querySelectorAll(".faq-item");
if (faqItems.length > 0) {
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const panel = item.querySelector(".faq-panel");
    if (!trigger || !panel) return;
    trigger.addEventListener("click", () => {
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("open");
        }
      });
      item.classList.toggle("open");
    });
  });
}

const quoteModal = document.getElementById("quoteModal");
const quoteOpeners = document.querySelectorAll("[data-quote-open]");
const quoteClosers = document.querySelectorAll("[data-quote-close]");

if (quoteModal) {
  const openModal = () => {
    quoteModal.classList.remove("hidden");
    quoteModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    quoteModal.classList.add("hidden");
    quoteModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  quoteOpeners.forEach((btn) => btn.addEventListener("click", openModal));
  quoteClosers.forEach((btn) => btn.addEventListener("click", closeModal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !quoteModal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

const processCards = document.querySelectorAll(".process-card");
if (processCards.length > 0) {
  const updateProcessScroll = () => {
    const viewport = window.innerHeight;
    processCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
      const inner = card.querySelector(".process-card-inner");
      if (inner) {
        inner.style.setProperty("--progress", progress.toFixed(3));
      }
    });
  };

  updateProcessScroll();
  window.addEventListener("scroll", updateProcessScroll, { passive: true });
  window.addEventListener("resize", updateProcessScroll);
}

const heroScroll = document.querySelector(".hero-scroll");
if (heroScroll) {
  heroScroll.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.getElementById("services");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
}
