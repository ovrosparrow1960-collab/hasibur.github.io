/* ==========================================================================
   render.js  —  builds the page from content.js.
   You normally DON'T need to touch this file. Edit content.js instead.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.CONTENT || {};

  /* ---- tiny helpers ---- */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function el(id) { return document.getElementById(id); }
  // Missing/blank image -> soft placeholder box, so nothing ever looks broken.
  var IMG_FALLBACK =
    "this.onerror=null;this.src='data:image/svg+xml;utf8," +
    encodeURIComponent(
      "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"400\">" +
      "<rect width=\"100%\" height=\"100%\" fill=\"%23e6e9f0\"/>" +
      "<text x=\"50%\" y=\"50%\" fill=\"%239aa3b2\" font-family=\"sans-serif\" " +
      "font-size=\"20\" text-anchor=\"middle\" dominant-baseline=\"middle\">Add your image</text></svg>"
    ) + "'";
  function img(src, alt, cls) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" class="' + (cls || "") +
           '" onerror="' + IMG_FALLBACK + '">';
  }
  function socialLinks(list, cls) {
    return (list || []).map(function (s) {
      var external = /^https?:/i.test(s.url);
      return '<a href="' + esc(s.url) + '" class="' + cls + '" aria-label="' + esc(s.label) + '"' +
        (external ? ' target="_blank" rel="noopener noreferrer"' : "") +
        '><i class="' + esc(s.icon) + '"></i></a>';
    }).join("");
  }
  function tags(list) {
    return '<div class="skill-tags">' +
      (list || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join("") +
      '</div>';
  }

  /* ---- meta: title, description, initials, footer ---- */
  function renderMeta() {
    var m = C.meta || {};
    if (m.siteTitle) document.title = m.siteTitle;
    if (m.description) {
      // Update the static <meta name="description"> if present, else create it
      // (avoids a duplicate tag; keeps the base HTML's SEO description in sync).
      var d = document.querySelector('meta[name="description"]');
      if (!d) { d = document.createElement("meta"); d.name = "description"; document.head.appendChild(d); }
      d.content = m.description;
    }
    document.querySelectorAll("[data-initials]").forEach(function (n) {
      n.textContent = m.initials || "";
    });
    var ft = document.querySelector("[data-footer-text]");
    if (ft) ft.textContent = (C.footer && C.footer.text) || "";
  }

  /* ---- navigation menu ---- */
  function renderNav() {
    var menu = el("nav-menu");
    if (!menu) return;
    menu.innerHTML = (C.nav || []).map(function (item) {
      return '<li class="nav-item"><a href="#' + esc(item.target) +
        '" class="nav-link">' + esc(item.label) + '</a></li>';
    }).join("");
  }

  /* ---- hero ---- */
  function renderHero() {
    var h = C.hero || {};
    var buttons =
      '<a href="#research" class="btn btn-primary">' + esc(h.primaryButtonLabel || "View My Work") + '</a>' +
      (h.resumeFile
        ? '<a href="' + esc(h.resumeFile) + '" class="btn btn-secondary" download>' +
            esc(h.resumeButtonLabel || "Download Resume") + '</a>'
        : "");

    el("home").innerHTML =
      '<div class="hero-container">' +
        '<div class="hero-content">' +
          '<p class="hero-greeting">' + esc(h.greeting) + '</p>' +
          '<h1 class="hero-name">' + esc(h.name) + '</h1>' +
          '<div class="hero-title-wrapper" aria-label="Professional title">' +
            '<span class="hero-title-static">I\'m </span>' +
            '<span class="hero-title" id="typed-text"></span>' +
            '<span class="cursor">|</span>' +
          '</div>' +
          '<p class="hero-description">' + esc(h.description) + '</p>' +
          '<div class="hero-buttons">' + buttons + '</div>' +
          '<div class="hero-socials">' + socialLinks(h.socials, "social-link") + '</div>' +
        '</div>' +
        '<div class="hero-image" aria-hidden="true">' +
          '<div class="hero-image-wrapper">' +
            '<div class="hero-blob"></div>' +
            '<div class="hero-avatar">' + img(h.photo, h.name, "profile-img") + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="scroll-indicator"><a href="#about">' +
        '<div class="mouse"><div class="wheel"></div></div><span>Scroll Down</span>' +
      '</a></div>';
  }

  /* ---- about ---- */
  function renderAbout() {
    var a = C.about || {};
    var paras = (a.paragraphs || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join("");
    var stats = (a.stats || []).length
      ? '<div class="about-stats">' + a.stats.map(function (s) {
          return '<div class="stat-item">' +
            '<span class="stat-number" data-count="' + esc(s.number) + '">0</span>' + esc(s.suffix || "") +
            '<span class="stat-label">' + esc(s.label) + '</span></div>';
        }).join("") + '</div>'
      : "";

    el("about").innerHTML =
      '<div class="container">' +
        '<h2 class="section-title">' + esc(a.title) + '</h2>' +
        '<p class="section-subtitle">' + esc(a.subtitle) + '</p>' +
        '<div class="about-content">' +
          '<div class="about-image" aria-hidden="true"><div class="about-image-wrapper">' +
            '<div class="about-shape"></div>' +
            '<div class="about-avatar">' + img(a.photo, a.heading, "profile-img") + '</div>' +
          '</div></div>' +
          '<div class="about-text">' +
            '<h3>' + esc(a.heading) + '</h3>' +
            paras + stats +
            '<a href="#contact" class="btn btn-primary">' + esc(a.ctaLabel || "Let's Connect") + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ---- skills ---- */
  function renderSkills() {
    var s = C.skills || {};
    var cards = (s.cards || []).map(function (c) {
      return '<div class="skill-card">' +
        '<div class="skill-icon"><i class="' + esc(c.icon) + '"></i></div>' +
        '<h3>' + esc(c.title) + '</h3>' +
        '<p class="skill-desc">' + esc(c.desc) + '</p>' +
        tags(c.tags) +
      '</div>';
    }).join("");

    el("skills").innerHTML =
      '<div class="container">' +
        '<h2 class="section-title">' + esc(s.title) + '</h2>' +
        '<p class="section-subtitle">' + esc(s.subtitle) + '</p>' +
        '<div class="skills-grid">' + cards + '</div>' +
      '</div>';
  }

  /* ---- experience ---- */
  function renderExperience() {
    var e = C.experience || {};
    var cards = (e.items || []).map(function (it) {
      var points = (it.points || []).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join("");
      return '<div class="experience-card">' +
        '<div class="experience-header">' +
          '<h3>' + esc(it.role) + '</h3>' +
          '<span class="experience-date">' + esc(it.date) + '</span>' +
        '</div>' +
        '<p class="experience-company">' + esc(it.company) + '</p>' +
        '<ul class="experience-points">' + points + '</ul>' +
      '</div>';
    }).join("");

    el("experience").innerHTML =
      '<div class="container">' +
        '<h2 class="section-title">' + esc(e.title) + '</h2>' +
        '<p class="section-subtitle">' + esc(e.subtitle) + '</p>' +
        '<div class="experience-grid">' + cards + '</div>' +
      '</div>';
  }

  /* ---- projects ---- */
  function projectVisual(p) {
    // 1) slideshow of several images
    if (p.images && p.images.length) {
      var slides = p.images.map(function (src, i) {
        return img(src, p.title, "project-preview-img project-slide" + (i === 0 ? " active" : ""));
      }).join("");
      return '<div class="project-slideshow" data-slideshow>' + slides + '</div>';
    }
    // 2) single image
    if (p.image) return img(p.image, p.title, "project-preview-img");
    // 3) plain icon tile
    if (p.icon) return '<div class="project-placeholder" aria-hidden="true"><i class="' + esc(p.icon) + '"></i></div>';
    return '<div class="project-placeholder" aria-hidden="true"><i class="fas fa-image"></i></div>';
  }

  function renderProjects() {
    var pr = C.projects || {};
    var cards = (pr.items || []).map(function (p) {
      var links = (p.links || []).map(function (l) {
        var external = /^https?:/i.test(l.url);
        return '<a href="' + esc(l.url) + '" class="project-link" title="' + esc(l.title) + '"' +
          (external ? ' target="_blank" rel="noopener noreferrer"' : "") +
          '><i class="' + esc(l.icon) + '"></i></a>';
      });
      if (p.video) {
        links.unshift('<a href="#" class="project-link" title="Watch Demo" data-video="' +
          esc(p.video) + '" aria-label="Watch demo video"><i class="fas fa-play"></i></a>');
      }
      return '<div class="project-card">' +
        '<div class="project-image">' + projectVisual(p) +
          '<div class="project-overlay"><div class="project-links">' + links.join("") + '</div></div>' +
        '</div>' +
        '<div class="project-content">' +
          '<h3>' + esc(p.title) + '</h3>' +
          '<p>' + esc(p.desc) + '</p>' +
          '<div class="project-tags">' +
            (p.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join("") +
          '</div>' +
        '</div>' +
      '</div>';
    }).join("");

    var cta = pr.ctaUrl
      ? '<div class="projects-cta"><a href="' + esc(pr.ctaUrl) +
          '" target="_blank" rel="noopener noreferrer" class="btn btn-primary">' +
          '<i class="fab fa-github"></i> ' + esc(pr.ctaLabel || "View GitHub") + '</a></div>'
      : "";

    el("projects").innerHTML =
      '<div class="container">' +
        '<h2 class="section-title">' + esc(pr.title) + '</h2>' +
        '<p class="section-subtitle">' + esc(pr.subtitle) + '</p>' +
        '<div class="projects-grid">' + cards + '</div>' +
        cta +
      '</div>';
  }

  /* ---- credentials ---- */
  function renderCredentials() {
    var cr = C.credentials || {};
    var cards = (cr.cards || []).map(function (c) {
      var items = (c.items || []).map(function (i) {
        // An item can be plain text, or { text, url } to make it a link.
        if (i && typeof i === "object") {
          return '<li>' + (i.url
            ? '<a class="credential-link" href="' + esc(i.url) + '" target="_blank" rel="noopener noreferrer">' +
                esc(i.text) + ' <i class="fas fa-external-link-alt"></i></a>'
            : esc(i.text)) + '</li>';
        }
        return '<li>' + esc(i) + '</li>';
      }).join("");
      // A card can show a logo image instead of a Font Awesome icon.
      var head = c.logo
        ? '<div class="credential-icon credential-logo">' + img(c.logo, c.title, "credential-logo-img") + '</div>'
        : '<div class="credential-icon"><i class="' + esc(c.icon) + '"></i></div>';
      return '<div class="credential-card">' +
        head +
        '<h3>' + esc(c.title) + '</h3>' +
        '<ul class="credential-list">' + items + '</ul>' +
      '</div>';
    }).join("");

    // Certificate upload gallery (optional).
    var certs = "";
    if (cr.certificates && cr.certificates.length) {
      var tiles = cr.certificates.map(function (ct) {
        var inner =
          img(ct.image, ct.title, "cert-img") +
          '<span class="cert-name">' + esc(ct.title) + '</span>' +
          '<span class="cert-view"><i class="fas fa-magnifying-glass-plus"></i></span>';
        var href = ct.url ? ct.url : ct.image;   // link out, or open the image itself
        return '<a class="cert-item" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' +
          inner + '</a>';
      }).join("");
      certs =
        '<div class="cert-section">' +
          '<h3 class="cert-heading">Certificates</h3>' +
          '<div class="cert-grid">' + tiles + '</div>' +
        '</div>';
    }

    el("credentials").innerHTML =
      '<div class="container">' +
        '<h2 class="section-title">' + esc(cr.title) + '</h2>' +
        '<p class="section-subtitle">' + esc(cr.subtitle) + '</p>' +
        '<div class="credentials-grid">' + cards + '</div>' +
        certs +
      '</div>';
  }

  /* ---- research (publications + interests) ---- */
  function renderResearch() {
    var r = C.research;
    var mount = el("research");
    if (!mount) return;
    if (!r) { mount.style.display = "none"; return; }

    var statement = r.statement
      ? '<p class="research-statement">' + esc(r.statement) + '</p>'
      : "";

    var interests = (r.interests && r.interests.length)
      ? '<h3 class="cert-heading">Research Interests</h3>' +
        '<div class="research-interests">' +
          r.interests.map(function (i) { return '<span class="research-chip">' + esc(i) + '</span>'; }).join("") +
        '</div>'
      : "";

    var pubs = "";
    if (r.publications && r.publications.length) {
      var rows = r.publications.map(function (p) {
        var meta = [p.venue, p.date, p.location].filter(Boolean).map(esc).join(" &middot; ");
        var link = p.url
          ? '<a class="pub-link" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">' +
              'Read Paper <i class="fas fa-external-link-alt"></i></a>'
          : "";
        return '<div class="pub-item">' +
          '<div class="pub-icon"><i class="fas fa-file-lines"></i></div>' +
          '<div class="pub-body">' +
            '<h4>' + esc(p.title) + '</h4>' +
            '<p class="pub-meta">' + meta + '</p>' +
            link +
          '</div>' +
        '</div>';
      }).join("");
      pubs =
        '<div class="pub-section">' +
          '<h3 class="cert-heading">Publications</h3>' +
          '<div class="pub-list">' + rows + '</div>' +
        '</div>';
    }

    mount.innerHTML =
      '<div class="container">' +
        '<h2 class="section-title">' + esc(r.title) + '</h2>' +
        '<p class="section-subtitle">' + esc(r.subtitle) + '</p>' +
        statement +
        interests +
        pubs +
      '</div>';
  }

  /* ---- contact ---- */
  function renderContact() {
    var ct = C.contact || {};
    var rows = "";
    if (ct.email) {
      rows += '<div class="contact-item"><div class="contact-icon"><i class="fas fa-envelope"></i></div>' +
        '<div class="contact-details"><h3>Email</h3><p><a class="contact-link" href="mailto:' +
        esc(ct.email) + '">' + esc(ct.email) + '</a></p></div></div>';
    }
    if (ct.location) {
      rows += '<div class="contact-item"><div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div>' +
        '<div class="contact-details"><h3>Location</h3><p>' + esc(ct.location) + '</p></div></div>';
    }
    if (ct.phone) {
      rows += '<div class="contact-item"><div class="contact-icon"><i class="fas fa-phone"></i></div>' +
        '<div class="contact-details"><h3>Phone</h3><p><a class="contact-link" href="tel:' +
        esc(ct.phone.replace(/\s+/g, "")) + '">' + esc(ct.phone) + '</a></p></div></div>';
    }

    el("contact").innerHTML =
      '<div class="container">' +
        '<h2 class="section-title">' + esc(ct.title) + '</h2>' +
        '<p class="section-subtitle">' + esc(ct.subtitle) + '</p>' +
        '<div class="contact-content">' +
          '<div class="contact-info">' + rows +
            '<div class="contact-socials">' + socialLinks(ct.socials, "contact-social-link") + '</div>' +
          '</div>' +
          '<form class="contact-form" id="contact-form" data-email="' + esc(ct.email) +
            '" data-firstname="' + esc(ct.firstName || "there") + '">' +
            '<div class="form-group"><input type="text" id="name" name="name" required placeholder=" "><label for="name">Your Name</label></div>' +
            '<div class="form-group"><input type="email" id="email" name="email" required placeholder=" "><label for="email">Your Email</label></div>' +
            '<div class="form-group"><input type="text" id="subject" name="subject" required placeholder=" "><label for="subject">Subject</label></div>' +
            '<div class="form-group"><textarea id="message" name="message" rows="5" required placeholder=" "></textarea><label for="message">Your Message</label></div>' +
            '<p class="form-note">This form opens your email app with a pre-filled message. ' +
              'Prefer email? <a class="contact-link" href="mailto:' + esc(ct.email) + '">' + esc(ct.email) + '</a></p>' +
            '<button type="submit" class="btn btn-primary btn-submit"><span>Send Message</span><i class="fas fa-paper-plane"></i></button>' +
          '</form>' +
        '</div>' +
      '</div>';
  }

  /* ---- run everything ---- */
  renderMeta();
  renderNav();
  renderHero();
  renderAbout();
  renderSkills();
  renderExperience();
  renderProjects();
  renderResearch();
  renderCredentials();
  renderContact();
})();
