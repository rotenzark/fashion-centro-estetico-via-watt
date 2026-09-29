/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'fashion-centro-estetico-via-watt',
    /* niente WhatsApp: il fisso (Google) e Treatwell per prenotare online */
    whatsapp: {
      number: '',
      message: '',
      ids: [],
    },
    /* Google = Treatwell (29/9/2026): lunedì 10–20, martedì e giovedì 9–20, mercoledì e venerdì 9–20:30, sabato 9–19, domenica chiuso */
    hours: {
      0: [],
      1: [['10:00', '20:00']],
      2: [['09:00', '20:00']],
      3: [['09:00', '20:30']],
      4: [['09:00', '20:00']],
      5: [['09:00', '20:30']],
      6: [['09:00', '19:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Fashion Centro Estetico Boutique: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.trattamenti": "Treatments",
      "n.sei": "The six",
      "n.salone": "The salon",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.prenota": "Book on Treatwell",
      "t.prenotabreve": "Book",
      "t.indicazioni": "Directions",
      "h.sopra": "Beauty centre · Via Giacomo Watt 1 · corner of Via Binda",
      "h.titolo": "As <em>always</em>, a safe bet.",
      "h.chi": "on Treatwell",
      "h.testo": "Waxing and laser, nails, lashes and brows, face and body; next door is their hair salon, and at the back of the salon, the boutique. All six in the team have 4.9 on Treatwell.",
      "h.treatwell": "on Treatwell, 1,037 reviews · Top Rated 2025",
      "h.google": "on Google, 90 reviews",
      "f.invito": "Tap the card to stamp it.",
      "f.didascalia": "Five sessions, the sixth on the house: that is how their massage and pressotherapy packages work, with bandages too.",
      "f.titolo": "The “five plus one” card",
      "f.desc": "A charcoal card like their business card, with “Fashion” in script and six boxes: a stamp comes down on each one and leaves in gold a tool from their logo, the nail polish, the scissors, the hairdryer, the lipstick, the comb; on the sixth, the free one, the mirror.",
      "f.omaggio": "free",
      "f.cinque": "five plus one",
      "l.etichetta": "Treatments",
      "l.titolo": "The list, without prices",
      "l.sotto": "The treatments as they list them on Treatwell, where you will also find prices, durations and bookings. Each department has a tool from the crest of their logo.",
      "r.1": "Waxing and laser",
      "r.1a": "Face waxing: upper lip, chin, eyebrows, sideburns or the full face",
      "r.1b": "Body waxing: legs, arms, underarms, bikini line, back",
      "r.1c": "Full-body waxing",
      "r.1d": "Brazilian resin, for the face, underarms and bikini line",
      "r.1e": "Diode laser 818, face and body: it starts with a consultation",
      "r.2": "Nails",
      "r.2a": "Manicure and pedicure, also with semi-permanent polish",
      "r.2b": "Semi-permanent polish, applied and removed",
      "r.2c": "Gel extensions and refills, extensions with forms",
      "r.2d": "Nail reconstruction for bitten nails",
      "r.2e": "Cosmetic and specific pedicure, paraffin for hands and feet",
      "r.3": "Lashes and brows",
      "r.3a": "Eyelash extensions, and touch-ups",
      "r.3b": "Lash lift",
      "r.3c": "Brow lamination",
      "r.3d": "Lash and brow tint",
      "r.4": "Semi-permanent make-up",
      "r.4a": "Eyebrows, with a shaded effect or microblading",
      "r.4b": "Eyeliner",
      "r.4c": "Lips",
      "r.4d": "Touch-ups; and make-up for an occasion",
      "r.5": "Face",
      "r.5a": "Facial cleansing",
      "r.5b": "Treatments with hyaluronic, glycolic or mandelic acid, or with vitamin C",
      "r.5c": "Relaxing massage with a mask, manual lifting",
      "r.5d": "Ultrasound, Multi360 and the face machine",
      "r.6": "Body",
      "r.6a": "Massage of 30, 50 or 60 minutes; with an aromatic candle",
      "r.6b": "Pressotherapy, also with a bandage; bandages",
      "r.6c": "Exfoliating scrub, back cleansing, foot reflexology",
      "r.6d": "Chinese cupping, lipolaser, ultrasound and Multi360 body",
      "p.titolo": "The five-plus-one packages",
      "p.testo": "The massage package, pressotherapy and pressotherapy with bandages: five sessions, and the sixth on the house.",
      "s.etichetta": "The six",
      "s.titolo": "Six names, all at 4.9",
      "s.sotto": "On Treatwell each one has their own rating and reviews, and photos of their work.",
      "s.r210": "· 210 reviews",
      "s.r166": "· 166 reviews",
      "s.r143": "· 143 reviews",
      "s.r138": "· 138 reviews",
      "s.r114": "· 114 reviews",
      "s.r99": "· 99 reviews",
      "s.alice": "In the photos: lashes and brows.",
      "s.moira": "In the photos: massages and bandages.",
      "s.gaia": "In the photos: massages and nails.",
      "s.miao": "In the photos: lashes, brows, lips and nails.",
      "s.oriana": "In the photos: massages, cupping and bandages.",
      "s.vanessa": "In the photos: massages, nails and bandages.",
      "v.etichetta": "The salon",
      "v.titolo": "Stripes, velvet and a boutique",
      "v.sotto": "Striped walls, grey velvet chairs with gold legs, a mosaic rosette on the floor; and at the back, on the gold rails, the clothes and bags of the boutique.",
      "a.salone": "The salon: grey and white striped walls, two gold arched rails with clothes and bags, grey velvet chairs with gold legs and a mosaic rosette on the floor.",
      "c.salone": "The salon and, at the back, the boutique.",
      "a.postazioni": "The two nail stations: an oval white marble table, two grey velvet chairs with gold legs, the wheel of polish colours.",
      "c.postazioni": "The nail stations.",
      "a.unghie": "Milky, glossy nails on the card with the words Fashion centro.",
      "c.unghie": "Work by Miao, from Miao’s own photos.",
      "a.biglietto": "Their charcoal business card with a hand mirror drawn in white, the word Fashion and below it Estetica, Parrucchiere, Solarium; beside it, two hands with nail polish.",
      "c.biglietto": "Their business card.",
      "a.pressoterapia": "The silver pressotherapy leggings laid out on the treatment bed, with the machine panel beside them.",
      "c.pressoterapia": "Pressotherapy.",
      "a.laser": "The laser, white, with its screen and handpiece, beside the treatment bed.",
      "c.laser": "The diode laser.",
      "d.etichetta": "Reviews",
      "d.titolo": "For years, and people come back",
      "d.treatwell": "on Treatwell, 1,037 reviews",
      "d.google": "on Google, 90 reviews",
      "d.g2m": "Google, 2 months ago",
      "d.g2a": "Google, 2 years ago",
      "d.tw": "Treatwell, 8 days ago",
      "d.g6a": "Google, 6 years ago",
      "d.g3a": "Google, 3 years ago",
      "d.nota": "From the reviews on Google and Treatwell, as they were written (in Italian); cuts are marked […]. The title at the top comes from another review on Treatwell.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "Monday to Saturday",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "o.nota": "Open all day; on Mondays from 10 am.",
      "o.mappa": "Map: Fashion Centro Estetico Boutique, Via Giacomo Watt 1, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Giacomo Watt 1, corner of Via Binda, 20143 Milan",
      "o.bus": "By bus",
      "o.busv": "The 47, Via Watt – Via Tosi stop, about 60 metres away",
      "o.tram": "By tram",
      "o.tramv": "The 2, Via Lodovico il Moro – Via Pestalozzi stop, about 350 metres away",
      "o.metro": "By metro",
      "o.metrov": "M2 Romolo, about a kilometre away",
      "o.tel": "Phone",
      "o.accanto": "The hair salon, next door.",
      "o.accantot": "Fashion Parrucchiere is at the same address, with its own hours: cuts, colour, highlights, hair lamination and blow-dries. It is booked separately.",
      "o.accantol": "Its Treatwell page (4.9 from 285 reviews)",
      "q.etichetta": "Questions",
      "q.titolo": "Before you book",
      "q.1": "How do I book?",
      "q.1r": "Online on Treatwell (the “Book online” button on their Google listing leads there) or by phone on +39 02 8918 1156.",
      "q.2": "Do you also do hair?",
      "q.2r": "Yes: next door is their hair salon, Fashion Parrucchiere, at the same address. It is booked separately, on its own Treatwell page.",
      "q.3": "How do the five-plus-one packages work?",
      "q.3r": "They are available for massages, pressotherapy and pressotherapy with bandages: five sessions, and the sixth on the house. That is how they appear in their list on Treatwell.",
      "q.4": "Are you open on Mondays?",
      "q.4r": "Yes, from 10 am to 8 pm. From Tuesday to Saturday they open at 9 am; on Wednesdays and Fridays they close at 8:30 pm, on Saturdays at 7 pm. Closed on Sundays.",
      "q.5": "Where do you start with the laser?",
      "q.5r": "With a consultation: it is in their list for exactly that, before laser hair removal on the face and body (a diode laser 818).",
      "q.6": "How do I get there?",
      "q.6r": "Via Giacomo Watt 1, corner of Via Binda. Bus 47 stops at Via Watt – Via Tosi, about 60 metres away; tram 2 at Via Lodovico il Moro – Via Pestalozzi, about 350 metres away; M2 Romolo is about a kilometre away.",
      "f.orario": "Monday 10 am–8 pm · Tuesday and Thursday 9 am–8 pm · Wednesday and Friday 9 am–8:30 pm · Saturday 9 am–7 pm · closed on Sunday",
      "f.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are theirs, from their Treatwell page and their Google listing; hours, treatments and reviews from Google and Treatwell (September 2026). We drew the card ourselves on their business card: the five-plus-one packages are the ones in their list.",
      "f.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ FASHION CENTRO ESTETICO BOUTIQUE — «Come sempre una garanzia.» ══════════
     La pagina è il loro biglietto: antracite, il disegno bianco, «Fashion» in corsivo; il salone dà le righe e l'oro.
     la FIRMA — la tessera «cinque più una» dei loro pacchetti (massaggi, pressoterapia, pressoterapia con bendaggi: 5+1 omaggio).
     Lo stato è S, i timbri fatti (0…6), più la posizione del timbro (la base della piastra, x e y) e lo schiacciamento del corpo nel
     telaio (c, 0…1). Senza JS e alla fine: S = 6, il timbro a riposo (l'HTML). L'attesa (classe nell'head): le impronte nascoste, il
     timbro a riposo, cioè S = 0 nello stesso posto. L'intro timbra le sei caselle una per una: il timbro vola sopra la casella,
     scende, il corpo si schiaccia (lì il timbro autoinchiostrante si gira dal tampone alla carta) e l'impronta c'è, sotto; sale, e
     alla fine torna a riposo. Poi: «Timbra» (o toccare la tessera) timbra la casella dopo; a tessera piena, «Nuova tessera» la svuota.
     Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante
     l'animazione la ferma dov'è (#244). I dati vengono da _fce_firma.mjs. */
  var DATI = {"g":{"vb":[560,440],"carta":{"x":40,"y":120,"w":480,"h":300,"rx":18},"riga":305,"r":28,"passo":72,"primo":100,"n":6,"riposo":{"x":466,"y":114},"sospeso":262,"premuto":333,"schiaccia":9,"centri":[100,172,244,316,388,460]},"rot":[-8,6,-4,9,-6,3],"tempi":{"inizio":300,"vola":300,"scendi":150,"tieni":70,"sali":170,"sposta":170,"rientra":380},"timbri":["smalto","forbici","phon","rossetto","pettine","specchio"]};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('tessera'), svgF = prendi('tesseraSvg'), timbroF = prendi('tesseraTimbro'), corpoF = prendi('tesseraCorpo');
  var tastoF = prendi('tesseraTasto'), leggiF = prendi('tesseraLeggi');
  var GF = DATI.g, TF = DATI.tempi, NF = GF.n, RIP = GF.riposo;
  var IMPRONTE = [].slice.call(document.querySelectorAll('#tesseraSvg .impronta'));
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var SF = NF, XF = RIP.x, YF = RIP.y, CF = 0, VF = 1;
  var finaleF = { s: NF, x: RIP.x, y: RIP.y }, destinazioneF = finaleF;
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    giu: function (u) { return u * u; },
    su: function (u) { return 1 - (1 - u) * (1 - u); },
    lineare: function (u) { return u; }
  };
  var PAROLE = {
    it: { timbra: 'Timbra', nuova: 'Nuova tessera', timbro: function (k) { return 'Timbro ' + k + ' di ' + NF; }, piena: 'Sesta casella: l\u2019omaggio. La tessera è piena.', vuota: 'Nuova tessera, nessun timbro.' },
    en: { timbra: 'Stamp', nuova: 'New card', timbro: function (k) { return 'Stamp ' + k + ' of ' + NF; }, piena: 'Sixth box: the free one. The card is full.', vuota: 'New card, no stamps.' }
  };
  function linguaF() { return (root.getAttribute('lang') || 'it').slice(0, 2) === 'en' ? 'en' : 'it'; }
  function annunciaF(t) { if (leggiF) leggiF.textContent = t || ''; }
  function aggiornaTasto() { if (tastoF) tastoF.textContent = SF >= NF ? PAROLE[linguaF()].nuova : PAROLE[linguaF()].timbra; }
  /* il disegno dello stato: le impronte fatte (visibili; «v» è la loro opacità mentre una tessera si svuota), il timbro, il corpo;
     allo stato finale nessun attributo in più di quelli dell'HTML */
  function disegnaF(s, x, y, c, v) {
    var cambia = s !== SF;
    SF = s; XF = x; YF = y; CF = c || 0; VF = v === undefined ? 1 : v;
    /* il tasto dice «Timbra» finché la tessera non è piena (anche durante l'intro), poi «Nuova tessera» */
    if (cambia) aggiornaTasto();
    IMPRONTE.forEach(function (el, k) {
      if (k < s && VF >= 1) el.removeAttribute('opacity');
      else el.setAttribute('opacity', k < s ? String(r3(VF)) : '0');
    });
    if (Math.abs(x - RIP.x) < 1e-9 && Math.abs(y - RIP.y) < 1e-9) timbroF.setAttribute('transform', 'translate(' + RIP.x + ' ' + RIP.y + ')');
    else timbroF.setAttribute('transform', 'translate(' + r3(x) + ' ' + r3(y) + ')');
    if (CF > 1e-9) corpoF.setAttribute('transform', 'translate(0 ' + r3(CF * GF.schiaccia) + ')'); else corpoF.removeAttribute('transform');
  }
  /* un piano: tratti { da, a, s, x0, y0, x1, y1, curva, schiaccia?, svuota? } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var u = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](u);
    var c = cur.schiaccia && u < 1 ? Math.sin(Math.PI * u) : 0;
    var v = cur.svuota ? 1 - u : undefined;
    if (cur.svuota && u >= 1) { disegnaF(0, cur.x1, cur.y1, 0); return; }
    disegnaF(cur.s, cur.x0 + (cur.x1 - cur.x0) * e, cur.y0 + (cur.y1 - cur.y0) * e, c, v);
  }
  /* timbrare le caselle da…a-1 partendo da (x0, y0), e poi tornare a riposo */
  function pianoTimbra(inizio, da, a, x0, y0) {
    var P = [], t = inizio, x = x0, y = y0;
    for (var k = da; k < a; k++) {
      var cx = GF.centri[k], dm = k === da ? TF.vola : TF.sposta;
      P.push({ da: t, a: t + dm, s: k, x0: x, y0: y, x1: cx, y1: GF.sospeso, curva: 'dolce' }); t += dm;
      P.push({ da: t, a: t + TF.scendi, s: k, x0: cx, y0: GF.sospeso, x1: cx, y1: GF.premuto, curva: 'giu' }); t += TF.scendi;
      P.push({ da: t, a: t + TF.tieni, s: k + 1, x0: cx, y0: GF.premuto, x1: cx, y1: GF.premuto, curva: 'lineare', schiaccia: true }); t += TF.tieni;
      P.push({ da: t, a: t + TF.sali, s: k + 1, x0: cx, y0: GF.premuto, x1: cx, y1: GF.sospeso, curva: 'su' }); t += TF.sali;
      x = cx; y = GF.sospeso;
    }
    P.push({ da: t, a: t + TF.rientra, s: a, x0: x, y0: y, x1: RIP.x, y1: RIP.y, curva: 'dolce' }); t += TF.rientra;
    return { piano: P, fine: t };
  }
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    var d = destinazioneF || finaleF;
    disegnaF(d.s, d.x, d.y, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
    aggiornaTasto();
  }
  /* un gesto durante un'animazione (o nell'attesa): la tessera si ferma dov'è (#244); dall'attesa lo stato è S = 0, a riposo */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(0, RIP.x, RIP.y, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(SF, XF, YF, 0, VF < 1 ? VF : undefined);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: S = 0, il timbro a riposo */
    disegnaF(0, RIP.x, RIP.y, 0);
    destinazioneF = finaleF;
    avviaF('intro', pianoTimbra(TF.inizio, 0, NF, RIP.x, RIP.y));
  }
  /* il gesto: timbrare la casella dopo; a tessera piena, svuotarla. Un clic mentre il timbro sta già andando a una casella ne
     AGGIUNGE una (due clic = due timbri: la destinazione avanza e il timbro riparte da dov'è); mentre la tessera si svuota, niente. */
  function azioneF() {
    if (faseF === 'corre' && modoF === 'svuota') return;
    var gia = faseF === 'corre' && modoF === 'timbra' ? destinazioneF.s : -1;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    if (gia >= 0) {
      var meta = Math.min(NF, gia + 1);
      destinazioneF = { s: meta, x: RIP.x, y: RIP.y };
      annunciaF(meta >= NF ? PAROLE[linguaF()].piena : PAROLE[linguaF()].timbro(meta));
      avviaF('timbra', pianoTimbra(0, SF, meta, XF, YF));
      return;
    }
    if (SF >= NF) {
      destinazioneF = { s: 0, x: XF, y: YF };
      annunciaF(PAROLE[linguaF()].vuota);
      if (reducedMotion) { destinazioneF = { s: 0, x: RIP.x, y: RIP.y }; chiudiF(); return; }
      avviaF('svuota', { piano: [{ da: 0, a: 320, s: NF, x0: XF, y0: YF, x1: XF, y1: YF, curva: 'lineare', svuota: true }], fine: 320 });
      aggiornaTasto();
      return;
    }
    var k = SF;
    destinazioneF = { s: k + 1, x: RIP.x, y: RIP.y };
    annunciaF(k + 1 >= NF ? PAROLE[linguaF()].piena : PAROLE[linguaF()].timbro(k + 1));
    if (reducedMotion) { chiudiF(); return; }
    avviaF('timbra', pianoTimbra(0, k, k + 1, XF, YF));
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche accanto alla settimana */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la tessera è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è
     quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && timbroF && corpoF && tastoF && IMPRONTE.length === NF) {
    try { clearTimeout(window.__attesaTessera); } catch (e) {}
    window.__tessera = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, s: SF, x: XF, y: YF, c: CF, v: VF, tasto: tastoF.textContent };
      },
      tempi: TF,
    };
    aggiornaTasto();
    /* il cambio di lingua rinomina il tasto (il plumbing traduce solo ciò che ha data-i18n) */
    [].slice.call(document.querySelectorAll('[data-lang]')).forEach(function (b) {
      b.addEventListener('click', function () { aggiornaTasto(); });
    });
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__tessera.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la tessera sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora resta senza timbri */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__tessera.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    tastoF.addEventListener('click', azioneF);
    /* toccare la tessera fa lo stesso del tasto (un tocco, niente trascinamenti: la pagina scorre anche partendo dalla tessera) */
    svgF.addEventListener('click', azioneF);
  }
})();
