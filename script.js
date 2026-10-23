document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initNavToggle();
  initActiveLinkOnScroll();
  initRevealOnScroll();
  initContactForm();
  initProjectModals();
  initHeroParallaxBlob();
  initHeroCursorDot();
  initHeroClickParticles();
  initHeroShapeMorph();
});

function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const storageKey = "portfolio-theme";

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch {
    savedTheme = null;
  }
  const initialTheme = root.getAttribute("data-theme") || savedTheme || "dark";

  applyTheme(initialTheme);

  toggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch {
      // stockage indisponible (navigation privée stricte) : le thème reste actif pour la session
    }
  });

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    toggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"
    );
  }
}

function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    toggle.classList.toggle("is-active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initActiveLinkOnScroll() {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.section === id);
        });
      });
    },
    { threshold: 0, rootMargin: "-50% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

function initRevealOnScroll() {
  const contents = document.querySelectorAll(".section__content");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -10% 0px" }
  );

  contents.forEach((content) => observer.observe(content));
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = form.querySelector("button[type=submit]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = "Veuillez remplir tous les champs correctement.";
      return;
    }

    submitBtn.disabled = true;
    status.textContent = "Envoi en cours...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          message: form.message.value,
          website: form.website.value,
        }),
      });

      if (!response.ok) throw new Error(`request-failed-${response.status}`);

      status.textContent = "Merci ! Votre message a été envoyé.";
      form.reset();
    } catch (error) {
      status.textContent = "Une erreur est survenue, réessayez ou écrivez-moi directement par email.";
    } finally {
      submitBtn.disabled = false;
    }
  });
}

const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M8.5 12.5l2.5 2.5 4.5-5"></path></svg>`;

const projectsData = {
  splashmap: {
    badge: "En production",
    title: "SplashMap - tout le lavage auto, sur une seule carte",
    meta: [
      { label: "Rôle", value: "Co-fondateur - Développeur" },
      { label: "Période", value: "Depuis fin 2025 et en production depuis juillet 2026" },
      { label: "Envergure", value: "≈14 000 stations référencées en France" },
    ],
    description:
      "SplashMap référence toutes les prestations de lavage automobile en France sur une carte interactive : stations self-service et prestations professionnelles, avec recherche par adresse ou géolocalisation. Objectif : trouver la station qui correspond à ses besoins en moins de 30 secondes.",
    images: [
      {
        src: "/assets/projects/splashmap/comment-ca-marche.jpg",
        alt: "Écran d'onboarding SplashMap « Comment ça marche ? » : étape 1, trouver une station via la recherche ou la géolocalisation",
        caption: "Un onboarding en 7 étapes pour prendre en main SplashMap rapidement.",
      },
      {
        src: "/assets/projects/splashmap/mockup-devices.webp",
        alt: "SplashMap sur ordinateur portable et sur mobile : la carte des stations autour de Nantes, avec la liste des résultats et les filtres",
        caption: "Une interface pensée pour le desktop comme pour le mobile.",
        framed: false,
      },
      {
        src: "/assets/projects/splashmap/map-desktop.jpg",
        alt: "Carte interactive SplashMap avec la liste des stations et les filtres par équipement",
        caption: "La carte principale : recherche par adresse ou géolocalisation, filtres par équipement.",
      },
      {
        src: "/assets/projects/splashmap/fiche-station-details.jpg",
        alt: "Fiche détaillée d'une station de lavage : note, types de lavage, équipements et actions (itinéraire, avis, signalement)",
        caption: "Fiche station : types de lavage, équipements, avis et signalement en un coup d'œil.",
      },
      {
        src: "/assets/projects/splashmap/form-proposer-lavage.jpg",
        alt: "Formulaire de contribution SplashMap pour proposer une station de lavage manquante",
        caption: "Contribution communautaire : proposer une station ou un professionnel absent de la carte.",
      },
      {
        src: "/assets/projects/splashmap/mes-contributions.jpg",
        alt: "Page « Mes contributions » listant les avis et signalements d'un utilisateur avec leur statut",
        caption: "Suivi des contributions et signalements par l'utilisateur, avec leur statut de résolution.",
      },
      {
        src: "/assets/projects/splashmap/admin-dashboard-stats.jpg",
        alt: "Tableau de bord d'administration SplashMap : visites, recherches, funnel de conversion et engagement",
        caption: "Backoffice : statistiques d'usage et funnel de conversion, du côté admin.",
      },
      {
        src: "/assets/projects/splashmap/admin-audience-map.jpg",
        alt: "Carte d'audience et statistiques en direct dans le backoffice SplashMap",
        caption: "Audience en direct et répartition géographique des visiteurs.",
      },
    ],
    highlights: [
      "Recherche de proximité PostGIS : filtres par équipement (aspirateur, rouleaux, karcher, souffleur…) appliqués directement en SQL",
      "Contributions communautaires modérées : avis, signalements, nouvelles stations, e-mail à l'auteur à la validation",
      "Portail propriétaire : un gérant revendique sa station via un lien d'invitation et suit ses statistiques",
      "Authentification Supabase (e-mail ou Google) : chaque contribution est rattachée à son auteur, le backoffice est réservé aux administrateurs",
      "Droits vérifiés jusque dans la base : politiques RLS sur l'identité et le rôle, et accès admin contrôlé à la fois dans le middleware et côté serveur",
      "Analytics en deux couches : produit anonyme pour tous (exemption CNIL), PostHog uniquement après consentement",
      "SEO : pages optimisées pour le référencement naturel des stations",
      "Backoffice interne pour administrer le contenu et suivre les statistiques d'usage",
      "Monorepo pnpm/Turborepo avec types partagés entre web et mobile, Vitest, CI GitHub Actions sur Vercel, Sentry",
    ],
    challenge:
      "Constituer puis fiabiliser un référentiel national. Une extension Chrome dédiée accélère la vérification des équipements, station par station. Une application Expo / React Native est en conception, après stabilisation du produit web.",
    stack: ["Next.js", "React", "TypeScript", "Supabase", "PostGIS", "MapLibre", "Vitest", "Sentry"],
    links: [{ label: "Explorer SplashMap", href: "https://splashmap.fr/", variant: "primary" }],
  },
  "hautier-intranet": {
    badge: "Groupe Hautier · 2024–2026 · 60 % du temps",
    title: "Intranet métier React / Node.js",
    meta: [
      { label: "Rôle", value: "Développeur fullstack (équipe de 3)" },
      { label: "Période", value: "2024 - 2026" },
      { label: "Envergure", value: "≈40 utilisateurs · 6 agences" },
    ],
    description:
      "L'outil central du groupe, et ma mission principale : gestion de parc, sinistres et données de transport, modules de comptabilité et de gestion documentaire, utilisés au quotidien par environ 40 personnes réparties sur 6 agences.",
    highlights: [
      "Gestion de parc et suivi des sinistres",
      "Centralisation et exploitation de données issues de grandes bases TMS",
      "Modules de comptabilité et de gestion documentaire",
      "Gestion des droits et des utilisateurs par service",
      "Adaptation des flux comptables lors de la migration vers Cegid",
      "Modélisation avec Prisma sur MariaDB, environnements Docker",
    ],
    challenge:
      "Centraliser et fiabiliser des données de trajets et de transport issues de bases TMS volumineuses et peu documentées, sans interrompre les applications en production.",
    stack: ["React", "Node.js", "TypeScript", "Prisma", "MariaDB", "Docker"],
    links: [],
  },
  "hautier-mobile": {
    badge: "Groupe Hautier · 2024–2026 · 20 % du temps",
    title: "Application mobile groupe",
    meta: [
      { label: "Rôle", value: "Développeur fullstack (équipe de 3)" },
      { label: "Période", value: "2024 - 2026" },
      { label: "Cible", value: "Conducteurs et sédentaires des 6 agences" },
      { label: "Méthode", value: "Agile · sprints de 3 semaines" },
    ],
    description:
      "L'application mobile du groupe, destinée aux conducteurs comme aux sédentaires : actualités du groupe, demandes de réparation et signalement d'incidents. Une application déjà existante à mon arrivée, sur laquelle j'ai repris le développement, les améliorations et le support.",
    highlights: [
      "Actualités du groupe, demandes de réparation et signalement d'incidents",
      "Reprise du développement, des améliorations et du support d'une application existante",
      "Sprints de 3 semaines en collaboration avec l'équipe communication",
      "Support utilisateurs via GLPI et prise en main à distance (AnyDesk)",
    ],
    challenge:
      "Reprendre en main une application déjà utilisée sur le terrain, et assurer son évolution et son support sans interrompre le service.",
    stack: ["Ionic", "Angular", "Capacitor"],
    links: [],
  },
  "hautier-php": {
    badge: "Groupe Hautier · 2024–2026 · 20 % du temps",
    title: "Intranet historique PHP",
    meta: [
      { label: "Rôle", value: "Développeur fullstack (équipe de 3)" },
      { label: "Période", value: "2024 - 2026" },
      { label: "Nature", value: "Maintenance et évolutions" },
    ],
    description:
      "L'intranet historique du groupe, en PHP 7 : le complément direct de l'application mobile, dont il expose l'API. Il sert les mêmes fonctionnalités que côté mobile — actualités du groupe, demandes de réparation — ainsi que l'administration, les statistiques et des exports Excel.",
    highlights: [
      "API consommée par l'application mobile du groupe",
      "Actualités du groupe, demandes de réparation et administration",
      "Statistiques et exports Excel pour le suivi métier",
      "Cohabitation avec le nouvel intranet pendant la transition",
    ],
    challenge:
      "Faire évoluer une API historique en PHP 7 sans casser l'application mobile qui en dépend, tout en préparant la succession de l'intranet.",
    stack: ["PHP 7", "MariaDB"],
    links: [],
  },
  madintec: {
    badge: "Stage développeur full-stack · 2020",
    title: "Madintec",
    meta: [
      { label: "Rôle", value: "Stagiaire développeur full-stack" },
      { label: "Période", value: "2020" },
    ],
    description:
      "Une solution de téléversement de fichiers de navigation (Next.js / NestJS) : les fichiers sont envoyés à des fonctions serverless en Go (FaaS) qui les traitent et analysent les données, puis les ajoutent en base. Les clients consultent ensuite ces données via un plugin Grafana que j'ai développé, avec une carte Leaflet retraçant le trajet du bateau.",
    highlights: [
      "Page de téléversement des fichiers de navigation (Next.js / NestJS)",
      "Traitement et analyse des données via des fonctions serverless (FaaS) en Go",
      "Ajout des données traitées en base pour consultation par les clients",
      "Plugin Grafana développé en interne, carte Leaflet retraçant le trajet du bateau",
    ],
    challenge:
      "Livrer un pipeline fiable, du téléversement à la visualisation, dans un contexte technique nouveau pour moi (Go, plugins Grafana).",
    stack: ["Next.js", "NestJS", "Go", "Grafana", "Leaflet"],
    links: [],
  },
  feedly: {
    badge: "Projet personnel · Code public",
    title: "Feedly to Notion",
    meta: [
      { label: "Rôle", value: "Développeur" },
      { label: "Contexte", value: "Projet personnel" },
    ],
    description:
      "Extension Chrome (Manifest V3) qui récupère le titre et l'URL de l'article Feedly actif, puis les envoie vers une base Notion choisie par l'utilisateur, pour centraliser ma veille technique.",
    highlights: [
      "Récupération du titre et de l'URL de l'article Feedly actif",
      "Sélection d'une base Notion autorisée",
      "Envoi de l'article vers l'API Notion",
    ],
    challenge:
      "Un petit outil personnel, fonctionnel à l'époque de son usage - non maintenu activement aujourd'hui.",
    stack: ["JavaScript", "Chrome Extensions", "Notion API"],
    links: [{ label: "Voir le code", href: "https://github.com/remypelletier/feedly-to-notion", variant: "primary" }],
  },
};

function initProjectModals() {
  const dialog = document.getElementById("projectModal");
  if (!dialog) return;

  const closeBtn = document.getElementById("projectModalClose");
  const badgeEl = document.getElementById("projectModalBadge");
  const titleEl = document.getElementById("projectModalTitle");
  const metaEl = document.getElementById("projectModalMeta");
  const descEl = document.getElementById("projectModalDesc");
  const highlightsEl = document.getElementById("projectModalHighlights");
  const challengeEl = document.getElementById("projectModalChallenge");
  const stackEl = document.getElementById("projectModalStack");
  const linksEl = document.getElementById("projectModalLinks");

  const gallery = initProjectGallery(dialog);

  function openProject(id) {
    const data = projectsData[id];
    if (!data) return;

    gallery.load(data.images, id);

    badgeEl.textContent = data.badge;
    titleEl.textContent = data.title;
    descEl.textContent = data.description;
    challengeEl.innerHTML = `<strong>Le défi :</strong> ${data.challenge}`;

    metaEl.innerHTML = "";
    data.meta.forEach((item) => {
      const div = document.createElement("div");
      div.className = "project-modal__meta-item";
      div.innerHTML = `<span class="project-modal__meta-label">${item.label}</span><span class="project-modal__meta-value">${item.value}</span>`;
      metaEl.appendChild(div);
    });

    highlightsEl.innerHTML = "";
    data.highlights.forEach((text) => {
      const li = document.createElement("li");
      li.innerHTML = `${CHECK_ICON}<span>${text}</span>`;
      highlightsEl.appendChild(li);
    });

    stackEl.innerHTML = "";
    data.stack.forEach((tech) => {
      const span = document.createElement("span");
      span.className = "tech-tag";
      span.textContent = tech;
      stackEl.appendChild(span);
    });

    linksEl.innerHTML = "";
    linksEl.style.display = data.links.length ? "" : "none";
    data.links.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.href;
      a.className = `btn btn--${link.variant}`;
      a.textContent = link.label;
      if (link.href.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      linksEl.appendChild(a);
    });

    if (!dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
  }

  document.querySelectorAll("[data-project]").forEach((el) => {
    el.addEventListener("click", () => openProject(el.dataset.project));

    if (el.getAttribute("role") === "button") {
      el.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProject(el.dataset.project);
        }
      });
    }
  });

  closeBtn.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
  });
}

function initProjectGallery(dialog) {
  const galleryEl = document.getElementById("projectGallery");
  const placeholderEl = document.getElementById("projectModalPlaceholder");
  const imageEl = document.getElementById("projectGalleryImage");
  const captionEl = document.getElementById("projectGalleryCaption");
  const counterEl = document.getElementById("projectGalleryCounter");
  const thumbsEl = document.getElementById("projectGalleryThumbs");
  const liveEl = document.getElementById("projectGalleryLive");
  const prevBtn = document.getElementById("projectGalleryPrev");
  const nextBtn = document.getElementById("projectGalleryNext");

  if (!galleryEl) return { load() {} };

  const defaultPlaceholder = placeholderEl.innerHTML;
  let images = [];
  let index = 0;

  function load(nextImages, projectId) {
    images = Array.isArray(nextImages) ? nextImages.filter((img) => img && img.src) : [];
    index = 0;

    const hasImages = images.length > 0;
    galleryEl.hidden = !hasImages;
    placeholderEl.hidden = hasImages;
    if (!hasImages) {
      renderPlaceholder(projectId);
      return;
    }

    const isCarousel = images.length > 1;
    prevBtn.hidden = !isCarousel;
    nextBtn.hidden = !isCarousel;
    counterEl.hidden = !isCarousel;
    thumbsEl.hidden = !isCarousel;

    thumbsEl.innerHTML = "";
    if (isCarousel) {
      images.forEach((image, i) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "project-gallery__thumb";
        button.setAttribute("aria-label", `Voir l'image ${i + 1} sur ${images.length}`);
        button.innerHTML = `<img src="${image.src}" alt="" loading="lazy">`;
        button.addEventListener("click", () => show(i));
        thumbsEl.appendChild(button);
      });
    }

    show(0);
    preload();
  }

  function show(nextIndex) {
    if (!images.length) return;
    index = (nextIndex + images.length) % images.length;
    const image = images[index];

    galleryEl.classList.toggle("is-bare", image.framed === false);

    imageEl.src = image.src;
    imageEl.alt = image.alt || "";
    captionEl.textContent = image.caption || "";
    captionEl.hidden = !image.caption;
    counterEl.textContent = `${index + 1} / ${images.length}`;

    thumbsEl.querySelectorAll(".project-gallery__thumb").forEach((thumb, i) => {
      const isActive = i === index;
      thumb.classList.toggle("is-active", isActive);
      thumb.setAttribute("aria-current", isActive ? "true" : "false");
    });

    if (images.length > 1) {
      liveEl.textContent = `Image ${index + 1} sur ${images.length}${image.alt ? ` : ${image.alt}` : ""}`;
    }
  }

  function renderPlaceholder(projectId) {
    const preview = document.querySelector(`.project-card[data-project="${projectId}"] .project-card__preview`);

    if (!preview) {
      placeholderEl.innerHTML = defaultPlaceholder;
      return;
    }

    const clone = preview.cloneNode(true);
    clone.setAttribute("class", "project-modal__illustration");

    clone.querySelectorAll("[id]").forEach((node) => {
      const oldId = node.id;
      const newId = `${oldId}-modal`;
      node.id = newId;
      clone.querySelectorAll(`[clip-path="url(#${oldId})"]`).forEach((el) => {
        el.setAttribute("clip-path", `url(#${newId})`);
      });
    });

    placeholderEl.replaceChildren(clone);
  }

  function preload() {
    images.slice(1).forEach((image) => {
      const img = new Image();
      img.src = image.src;
    });
  }

  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));

  dialog.addEventListener("keydown", (event) => {
    if (images.length < 2) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
    }
  });

  return { load };
}

function initHeroParallaxBlob() {
  const section = document.getElementById("accueil");
  const parallax = section?.querySelector(".hero-avatar__parallax");
  const avatar = section?.querySelector(".hero-avatar");
  if (!section || !parallax || !avatar) return;

  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!hasFinePointer) return;

  const maxOffset = 14;
  let frameRequest = null;

  section.addEventListener("pointermove", (event) => {
    if (reducedMotionQuery.matches) return;
    const sectionRect = section.getBoundingClientRect();
    const pointerX = event.clientX - sectionRect.left;
    const pointerY = event.clientY - sectionRect.top;

    if (frameRequest) return;
    frameRequest = requestAnimationFrame(() => {
      const avatarRect = avatar.getBoundingClientRect();
      const centerX = avatarRect.left + avatarRect.width / 2 - sectionRect.left;
      const centerY = avatarRect.top + avatarRect.height / 2 - sectionRect.top;
      const dx = clamp(((pointerX - centerX) / sectionRect.width) * maxOffset * 4, -maxOffset, maxOffset);
      const dy = clamp(((pointerY - centerY) / sectionRect.height) * maxOffset * 4, -maxOffset, maxOffset);
      parallax.style.setProperty("--mx", `${dx}px`);
      parallax.style.setProperty("--my", `${dy}px`);

      frameRequest = null;
    });
  });

  section.addEventListener("pointerleave", () => {
    parallax.style.setProperty("--mx", "0px");
    parallax.style.setProperty("--my", "0px");
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function initHeroCursorDot() {
  const section = document.getElementById("accueil");
  const dot = section?.querySelector(".cursor-dot");
  if (!section || !dot) return;

  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!hasFinePointer) return;

  function syncCustomCursor() {
    section.classList.toggle("has-custom-cursor", !reducedMotionQuery.matches);
  }
  syncCustomCursor();
  reducedMotionQuery.addEventListener("change", syncCustomCursor);

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = null;
  let isActive = false;

  function render() {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    dot.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(render);
  }

  section.addEventListener("pointermove", (event) => {
    const rect = section.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;

    const overInteractive = Boolean(event.target.closest("a, button"));
    if (overInteractive !== isActive) {
      isActive = overInteractive;
      dot.classList.toggle("is-active", isActive);
    }
  });

  section.addEventListener("pointerenter", (event) => {
    if (reducedMotionQuery.matches) return;
    const rect = section.getBoundingClientRect();
    currentX = targetX = event.clientX - rect.left;
    currentY = targetY = event.clientY - rect.top;
    dot.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    if (!rafId) rafId = requestAnimationFrame(render);
  });

  section.addEventListener("pointerleave", () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    isActive = false;
    dot.classList.remove("is-active");
  });
}
function initHeroShapeMorph() {
  const canvas = document.getElementById("shapeCanvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const CAMERA_Z = 4;
  const FOCAL = 3;
  const DURATION = 1100;
  const INTERVAL = 3000;
  const LIGHT = normalize([-0.4, 0.6, 0.7]);

  const phi = (1 + Math.sqrt(5)) / 2;
  const groups = [
    { name: "Cube", normals: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]] },
    { name: "Tétraèdre", normals: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]] },
    { name: "Octaèdre", normals: signCombinations([1, 1, 1]) },
    { name: "Dodécaèdre", normals: cyclicPermutations([0, 1, phi]) },
    { name: "Icosaèdre", normals: signCombinations([1, 1, 1]).concat(cyclicPermutations([0, 1 / phi, phi])) },
  ];

  const planes = [];
  const planeIndex = new Map();
  const groupPlanes = groups.map((group) => new Set(group.normals.map(registerPlane)));

  const shapes = groups.map((group, i) => buildShape(group.name, groupPlanes[i]));

  function registerPlane(normal) {
    const unit = normalize(normal);
    const key = unit.map((value) => value.toFixed(5)).join(",");
    if (!planeIndex.has(key)) {
      planeIndex.set(key, planes.length);
      planes.push(unit);
    }
    return planeIndex.get(key);
  }

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let distances = shapes[0].support.slice();
  let faces = buildSolid(distances);
  let accent = readAccent();
  let morphFrom = null;
  let morphTo = null;
  let morphStart = 0;
  let yaw = -0.7;
  let pitch = 0.3;
  let size = 0;
  let lastFrame = 0;
  let sinceChange = 0;
  let isRunning = false;
  let isVisible = true;

  resize();
  new ResizeObserver(resize).observe(canvas);

  new MutationObserver(() => {
    accent = readAccent();
    render();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  new IntersectionObserver((entries) => {
    isVisible = entries[entries.length - 1].isIntersecting;
    syncLoop();
  }).observe(canvas);

  reducedMotionQuery.addEventListener("change", () => {
    if (reducedMotionQuery.matches) render();
    syncLoop();
  });

  function syncLoop() {
    const shouldRun = isVisible && !reducedMotionQuery.matches;
    if (shouldRun && !isRunning) {
      isRunning = true;
      lastFrame = 0;
      requestAnimationFrame(loop);
    } else if (!shouldRun) {
      isRunning = false;
    }
  }

  function advance() {
    index = (index + 1) % shapes.length;
    morphFrom = distances.slice();
    morphTo = shapes[index].support;
    morphStart = performance.now();
  }

  if (reducedMotionQuery.matches) {
    render();
  } else {
    syncLoop();
  }

  function loop(now) {
    if (!isRunning) return;
    const elapsed = lastFrame ? Math.min(now - lastFrame, 64) : 16;
    lastFrame = now;

    yaw += elapsed * 0.0004;
    pitch = 0.28 + Math.sin(now * 0.00045) * 0.18;

    sinceChange += elapsed;
    if (sinceChange >= INTERVAL) {
      sinceChange = 0;
      advance();
    }

    if (morphTo) {
      const t = Math.min(1, (now - morphStart) / DURATION);
      const eased = easeInOutCubic(t);
      for (let i = 0; i < distances.length; i++) {
        distances[i] = morphFrom[i] + (morphTo[i] - morphFrom[i]) * eased;
      }
      faces = buildSolid(distances);
      if (t >= 1) {
        distances = morphTo.slice();
        morphTo = null;
      }
    }

    render();
    requestAnimationFrame(loop);
  }

  function render() {
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    const half = size / 2;

    const drawable = faces.map((face) => {
      const points = [];
      let depth = 0;

      for (const vertex of face) {
        const rx = vertex[0] * cosYaw + vertex[2] * sinYaw;
        const rz0 = vertex[2] * cosYaw - vertex[0] * sinYaw;
        const ry = vertex[1] * cosPitch - rz0 * sinPitch;
        const rz = vertex[1] * sinPitch + rz0 * cosPitch;

        const scale = (FOCAL / (CAMERA_Z - rz)) * size * 0.58;
        points.push([half + rx * scale, half - ry * scale]);
        depth += rz;
      }

      const view = rotatePoint(faceNormal(face), cosYaw, sinYaw, cosPitch, sinPitch);
      return { points, depth: depth / face.length, facing: view[2], light: Math.max(0, dot(view, LIGHT)) };
    });

    drawable.sort((one, other) => one.depth - other.depth);

    context.clearRect(0, 0, size, size);
    for (const { points, facing, light } of drawable) {
      const front = facing > 0;

      context.beginPath();
      context.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) context.lineTo(points[i][0], points[i][1]);
      context.closePath();

      context.fillStyle = `rgba(${accent}, ${(front ? 0.1 + light * 0.3 : 0.05).toFixed(3)})`;
      context.fill();
      context.strokeStyle = `rgba(${accent}, ${front ? 0.9 : 0.25})`;
      context.lineWidth = front ? 1.6 : 1;
      context.lineJoin = "round";
      context.stroke();
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const next = Math.round(Math.min(rect.width, rect.height));
    if (!next) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    size = next;
    canvas.width = next * ratio;
    canvas.height = next * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    render();
  }

  function readAccent() {
    const value = getComputedStyle(document.documentElement).getPropertyValue("--color-accent-rgb");
    return value.trim() || "91, 157, 255";
  }

  function buildShape(name, ownPlanes) {
    let solid = boundingCube(8);
    for (const plane of ownPlanes) solid = clipSolid(solid, planes[plane], 1);

    const vertices = solid.flat();
    const mean = vertices.reduce((total, v) => total + Math.hypot(v[0], v[1], v[2]), 0) / vertices.length;
    const scale = mean ? 1 / mean : 1;

    const support = planes.map((plane) => {
      let furthest = -Infinity;
      for (const vertex of vertices) furthest = Math.max(furthest, dot(plane, vertex));
      return furthest * scale;
    });

    return { name, support };
  }

  function buildSolid(currentDistances) {
    let solid = boundingCube(8);
    for (let i = 0; i < planes.length; i++) {
      solid = clipSolid(solid, planes[i], currentDistances[i]);
    }

    let radius = 0;
    for (const face of solid) {
      for (const vertex of face) radius = Math.max(radius, Math.hypot(vertex[0], vertex[1], vertex[2]));
    }

    if (radius > 0) {
      const scale = 1 / radius;
      solid = solid.map((face) => face.map((v) => [v[0] * scale, v[1] * scale, v[2] * scale]));
    }
    return solid;
  }
}


function boundingCube(extent) {
  const corner = (x, y, z) => [x * extent, y * extent, z * extent];
  return [
    [corner(1, -1, -1), corner(1, 1, -1), corner(1, 1, 1), corner(1, -1, 1)],
    [corner(-1, -1, 1), corner(-1, 1, 1), corner(-1, 1, -1), corner(-1, -1, -1)],
    [corner(-1, 1, -1), corner(-1, 1, 1), corner(1, 1, 1), corner(1, 1, -1)],
    [corner(-1, -1, 1), corner(-1, -1, -1), corner(1, -1, -1), corner(1, -1, 1)],
    [corner(-1, -1, 1), corner(1, -1, 1), corner(1, 1, 1), corner(-1, 1, 1)],
    [corner(1, -1, -1), corner(-1, -1, -1), corner(-1, 1, -1), corner(1, 1, -1)],
  ];
}

function clipSolid(faces, normal, distance) {
  const kept = [];
  const ring = [];

  for (const face of faces) {
    const clipped = clipPolygon(face, normal, distance);
    if (clipped.length < 3) continue;
    kept.push(clipped);

    for (const vertex of clipped) {
      if (Math.abs(dot(normal, vertex) - distance) < 1e-7) ring.push(vertex);
    }
  }

  const cap = orderRing(dedupe(ring), normal);
  if (cap.length >= 3) kept.push(cap);
  return kept;
}

function clipPolygon(points, normal, distance) {
  const output = [];

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const currentSide = dot(normal, current) - distance;
    const nextSide = dot(normal, next) - distance;

    if (currentSide <= 1e-9) output.push(current);

    if ((currentSide < -1e-9 && nextSide > 1e-9) || (currentSide > 1e-9 && nextSide < -1e-9)) {
      const t = currentSide / (currentSide - nextSide);
      output.push([
        current[0] + (next[0] - current[0]) * t,
        current[1] + (next[1] - current[1]) * t,
        current[2] + (next[2] - current[2]) * t,
      ]);
    }
  }

  return output;
}

function dedupe(points) {
  const seen = new Map();
  for (const point of points) {
    const key = point.map((value) => Math.round(value * 1e5)).join(",");
    if (!seen.has(key)) seen.set(key, point);
  }
  return [...seen.values()];
}

function orderRing(points, normal) {
  if (points.length < 3) return points;

  const center = points.reduce(
    (total, point) => [total[0] + point[0], total[1] + point[1], total[2] + point[2]],
    [0, 0, 0]
  ).map((value) => value / points.length);

  const reference = Math.abs(normal[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = normalize(cross(normal, reference));
  const v = cross(normal, u);

  return points
    .map((point) => {
      const offset = [point[0] - center[0], point[1] - center[1], point[2] - center[2]];
      return { point, angle: Math.atan2(dot(offset, v), dot(offset, u)) };
    })
    .sort((one, other) => one.angle - other.angle)
    .map((entry) => entry.point);
}

function faceNormal(face) {
  const [a, b, c] = face;
  const normal = normalize(cross(
    [b[0] - a[0], b[1] - a[1], b[2] - a[2]],
    [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  ));
  return dot(normal, a) < 0 ? [-normal[0], -normal[1], -normal[2]] : normal;
}

function rotatePoint([x, y, z], cosYaw, sinYaw, cosPitch, sinPitch) {
  const rx = x * cosYaw + z * sinYaw;
  const rz0 = z * cosYaw - x * sinYaw;
  return [rx, y * cosPitch - rz0 * sinPitch, y * sinPitch + rz0 * cosPitch];
}

function signCombinations([x, y, z]) {
  const result = [];
  for (const sx of [1, -1]) {
    for (const sy of [1, -1]) {
      for (const sz of [1, -1]) result.push([x * sx, y * sy, z * sz]);
    }
  }
  return result;
}

function cyclicPermutations([a, b, c]) {
  const result = [];
  for (const [x, y, z] of [[a, b, c], [b, c, a], [c, a, b]]) {
    for (const sx of x === 0 ? [1] : [1, -1]) {
      for (const sy of y === 0 ? [1] : [1, -1]) {
        for (const sz of z === 0 ? [1] : [1, -1]) result.push([x * sx, y * sy, z * sz]);
      }
    }
  }
  return result;
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalize([x, y, z]) {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function initHeroClickParticles() {
  const section = document.getElementById("accueil");
  if (!section) return;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const colors = ["var(--color-accent)", "var(--color-accent-strong)"];
  const particleCount = 10;

  section.addEventListener("click", (event) => {
    if (reducedMotionQuery.matches) return;
    const rect = section.getBoundingClientRect();
    const originX = event.clientX - rect.left;
    const originY = event.clientY - rect.top;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const distance = 40 + Math.random() * 50;
      const size = 4 + Math.random() * 5;

      const particle = document.createElement("span");
      particle.className = "hero-particle";
      particle.style.left = `${originX}px`;
      particle.style.top = `${originY}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = colors[i % colors.length];
      particle.style.setProperty("--px", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--py", `${Math.sin(angle) * distance}px`);

      particle.addEventListener("animationend", () => particle.remove());
      section.appendChild(particle);
    }
  });
}
