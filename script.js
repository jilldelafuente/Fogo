// Keeps the mega nav (and anything else) offset correctly below the actual nav height
function syncSiteHeaderHeight() {
  const header = document.getElementById('siteHeader');
  if (header) document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
}
syncSiteHeaderHeight();
window.addEventListener('resize', syncSiteHeaderHeight);

// Mega nav toggle
const menuBtn = document.getElementById('menuBtn');
const megaNav = document.getElementById('megaNav');
const menuLabel = menuBtn ? menuBtn.querySelector('.menu-label') : null;

function setMegaNavOpen(open) {
  megaNav.classList.toggle('open', open);
  menuBtn.classList.toggle('open', open);
  if (menuLabel) menuLabel.textContent = open ? 'Close' : 'Menu';
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

if (menuBtn && megaNav) {
  menuBtn.addEventListener('click', () => {
    setMegaNavOpen(!megaNav.classList.contains('open'));
  });

  megaNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMegaNavOpen(false));
  });
}

// "Fire is our beginning" CTAs — show a rotated preview image on hover
const ctaStack = document.querySelector('.cta-stack');
const ctaHoverImage = document.getElementById('ctaHoverImage');

if (ctaStack && ctaHoverImage) {
  const ctaButtons = ctaStack.querySelectorAll('.btn');

  ctaButtons.forEach((btn) => {
    if (btn.dataset.hoverImg) new Image().src = btn.dataset.hoverImg;

    btn.addEventListener('mouseenter', () => {
      ctaHoverImage.src = btn.dataset.hoverImg;
      ctaHoverImage.style.setProperty('--rot', `${btn.dataset.hoverRot}deg`);
      ctaHoverImage.classList.add('visible');
    });
  });

  ctaStack.addEventListener('mouseleave', () => {
    ctaHoverImage.classList.remove('visible');
  });
}

// "What's your reason to fogo?" — occasion data, typewriter ghost, and results panel
const REASON_DATA = {
  celebration: {
    answer: 'Here’s how Fogo does a <b>celebration</b>.',
    note: 'Full Churrasco, carved tableside, until the table says stop.',
    exp: 'Full Churrasco', expSub: 'Continuous carving, Market Table, the works.',
    table: 'Best for 6 to 12', tableSub: 'Round tables keep the room together.',
    slots: ['6:00', '7:15', '8:30'],
    adds: [['Cheesecake Brûlée for the table', true], ['Caipirinha toast', false], ['Wine pairing', false]],
    hit: ['celebrat', 'party', 'special occasion'],
  },
  anniversary: {
    answer: 'Here’s how Fogo does an <b>anniversary</b>.',
    note: 'A quieter corner, longer courses, nothing rushed.',
    exp: 'Full Churrasco + Four Course', expSub: 'Fire-roasted cuts, Market Table, dessert for two.',
    table: 'Table for two', tableSub: 'Ask for a booth along the wall.',
    slots: ['6:30', '7:45', '8:15'],
    adds: [['Decadent dessert to share', true], ['Wine pairing', false]],
    hit: ['anniversary', 'anniversaries'],
  },
  birthday: {
    answer: 'Here’s how Fogo does a <b>birthday</b>.',
    note: 'The gaúcho chefs will find your table. There’s no discreet option.',
    exp: 'Full Churrasco', expSub: 'Continuous carving, Market Table, the works.',
    table: 'Best for 6 to 12', tableSub: 'Round tables keep the room together.',
    slots: ['6:45', '7:15', '8:30'],
    adds: [['Birthday dessert', true], ['Caipirinha toast for the table', false]],
    hit: ['birthday', 'bday', 'turning'],
  },
  holiday: {
    answer: 'Here’s how Fogo does a <b>holiday party</b>.',
    note: 'Book the room, not the table. December fills up fast.',
    exp: 'Private Events', expSub: 'Buyouts and semi-private rooms.',
    table: '20 to 100 guests', tableSub: 'A dedicated event manager is assigned.',
    slots: ['5:00', '6:30', '8:00'],
    adds: [['Passed appetizers at Bar Fogo', true], ['Open bar package', false]],
    hit: ['holiday', 'christmas', 'new year', 'office party', 'xmas'],
  },
  client: {
    answer: 'Here’s how Fogo does a <b>client dinner</b>.',
    note: 'No menus to read, no orders to place. The conversation never stops.',
    exp: 'Full Churrasco', expSub: 'Tableside service means no ordering pauses.',
    table: 'Best for 4 to 8', tableSub: 'Private dining available on request.',
    slots: ['6:00', '6:30', '7:00'],
    adds: [['Wine pairing', true], ['One check, discreetly', true]],
    hit: ['client', 'business dinner', 'work dinner', 'prospect', 'deal'],
  },
  team: {
    answer: 'Here’s how Fogo does a <b>team dinner</b>.',
    note: 'Every dietary preference is already handled. Nobody has to ask.',
    exp: 'Full Churrasco', expSub: 'The Market Table is naturally gluten-free.',
    table: 'Best for 10 to 30', tableSub: 'Private room available at 15 or more.',
    slots: ['5:30', '6:30', '7:15'],
    adds: [['Pre-set bar tab', true], ['Dessert for the table', false]],
    hit: ['team', 'staff', 'colleague', 'offsite', 'coworker', 'company'],
  },
  date: {
    answer: 'Here’s how Fogo does a <b>date night</b>.',
    note: 'You don’t have to commit to the full churrasco. Most people don’t know that.',
    exp: 'Bar Fogo', expSub: 'À la carte plates, cocktails, no prix fixe.',
    table: 'Table for two', tableSub: 'Bar seating, walk-ins usually fine.',
    slots: ['7:30', '8:00', '8:45'],
    adds: [['Handcrafted cocktail flight', true], ['Charcuterie to share', false]],
    hit: ['date', 'romantic', 'first date', 'dinner for two'],
  },
  lunch: {
    answer: 'Here’s how Fogo does <b>lunch</b>.',
    note: 'The Market Table on its own is a full meal.',
    exp: 'Market Table only', expSub: 'Seasonal salads, imported cheeses, artisan meats.',
    table: 'Any size', tableSub: 'Bar seating, in and out in 45 minutes.',
    slots: ['11:30', '12:00', '1:00'],
    adds: [['Add a cut of the day', false], ['Espresso to finish', false]],
    hit: ['lunch', 'solo', 'quick', 'alone', 'myself'],
  },
  curious: {
    answer: 'Here’s how Fogo works, in short.',
    note: 'Fire-roasted cuts, carved tableside, for as long as you want.',
    exp: 'Full Churrasco', expSub: 'The experience that made Fogo famous.',
    table: 'Any size', tableSub: 'Two people or twenty.',
    slots: ['6:00', '7:00', '8:00'],
    adds: [['Start with the Market Table', false], ['Ask your server about pairings', false]],
    hit: ['curious', 'what is', 'how does', 'first time', 'new here'],
  },
  justbecause: {
    answer: 'Here’s how Fogo does a Tuesday.',
    note: 'No occasion required.',
    exp: 'Market Table only', expSub: 'A full meal without a single skewer.',
    table: 'Two to four', tableSub: 'Walk in, sit anywhere.',
    slots: ['6:00', '7:00', '8:15'],
    adds: [['Add the Full Churrasco later', false], ['Caipirinhas on Tuesdays', true]],
    hit: ['just because', 'nothing', 'random', 'tuesday', 'weeknight', 'no reason', 'casual', 'hungry'],
  },
};

const REASON_FALLBACK = {
  answer: 'Fogo can build around <b>that</b>.',
  note: 'Give us a headcount and a night, or start with one of the occasions below.',
  exp: 'Full Churrasco', expSub: 'The experience that made Fogo famous.',
  table: 'Any size', tableSub: 'Two people or two hundred.',
  slots: ['6:00', '7:00', '8:00'],
  adds: [['Market Table only', false], ['Bar Fogo, à la carte', false]],
};

const REASON_PLACEHOLDERS = ['Birthday.', 'Client dinner.', 'Just a Tuesday.', 'Date night.', 'Anniversary.'];

const reasonSection = document.getElementById('reason');
const reasonField = document.getElementById('reasonField');
const reasonInput = document.getElementById('reasonInput');
const reasonGhost = document.getElementById('reasonGhost');
const reasonGhostText = document.getElementById('reasonGhostText');
const reasonChipsWrap = document.getElementById('reasonChips');
const reasonResults = document.getElementById('reasonResults');
const reasonAnswer = document.getElementById('reasonAnswer');
const reasonNote = document.getElementById('reasonNote');
const reasonRail = document.getElementById('reasonRail');
const reasonReset = document.getElementById('reasonReset');
const reasonCta = document.getElementById('reasonCta');
const chips = document.querySelectorAll('.chip');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scrolls a target into view without letting the sticky header cover its top
function scrollBelowHeader(el) {
  const header = document.getElementById('siteHeader');
  const offset = (header ? header.offsetHeight : 0) + 16;
  el.style.scrollMarginTop = `${offset}px`;
  el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
}

// Animated placeholder — types and deletes through example occasions
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
let typeTimer;

function typePlaceholder() {
  if (reasonInput.value) return;
  const word = REASON_PLACEHOLDERS[phraseIndex];
  reasonGhostText.textContent = deleting ? word.slice(0, charIndex--) : word.slice(0, charIndex++);
  let delay = deleting ? 38 : 78;
  if (!deleting && charIndex > word.length) { deleting = true; delay = 1500; }
  if (deleting && charIndex < 0) { deleting = false; charIndex = 0; phraseIndex = (phraseIndex + 1) % REASON_PLACEHOLDERS.length; delay = 280; }
  typeTimer = setTimeout(typePlaceholder, delay);
}

if (reasonGhostText) {
  if (prefersReducedMotion) {
    reasonGhostText.textContent = REASON_PLACEHOLDERS[0];
  } else {
    typePlaceholder();
  }
}

if (reasonInput && reasonField && reasonGhost) {
  reasonInput.addEventListener('focus', () => reasonField.classList.add('lit'));
  reasonInput.addEventListener('blur', () => { if (!reasonInput.value) reasonField.classList.remove('lit'); });
  reasonInput.addEventListener('input', () => reasonGhost.classList.toggle('hide', !!reasonInput.value));
  reasonInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') showReasonResults(reasonInput.value); });
}

function matchReason(query) {
  if (REASON_DATA[query]) return REASON_DATA[query];
  const q = query.toLowerCase().trim();
  if (!q) return null;
  for (const key in REASON_DATA) {
    if (REASON_DATA[key].hit.some((h) => q.includes(h))) return REASON_DATA[key];
  }
  return REASON_FALLBACK;
}

// Builds the next 7 selectable days, OpenTable-style, starting today
function buildReasonDates() {
  const out = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    let label;
    if (i === 0) label = 'Today';
    else if (i === 1) label = 'Tomorrow';
    else label = `${d.toLocaleDateString('en-US', { weekday: 'short' })} ${d.getDate()}`;
    out.push(label);
  }
  return out;
}

function showReasonResults(query) {
  const data = matchReason(query);
  if (!data) return;
  clearTimeout(typeTimer);

  const dates = buildReasonDates();

  reasonSection.classList.add('showing-results');
  reasonAnswer.innerHTML = data.answer;
  reasonNote.textContent = data.note;
  reasonRail.innerHTML = `
    <div class="reason-card"><div class="reason-card-label">The Experience</div>
      <div class="reason-card-value">${data.exp}</div><div class="reason-card-sub">${data.expSub}</div></div>
    <div class="reason-card"><div class="reason-card-label">The Table</div>
      <div class="reason-card-value">${data.table}</div><div class="reason-card-sub">${data.tableSub}</div></div>
    <div class="reason-card"><div class="reason-card-label">When</div>
      <div class="reason-dates">${dates.map((d, i) => `<button class="reason-date${i === 0 ? ' picked' : ''}">${d}</button>`).join('')}</div>
      <div class="reason-slots">${data.slots.map((s, i) => `<button class="reason-slot${i === 1 ? ' picked' : ''}">${s}</button>`).join('')}</div></div>
    <div class="reason-card"><div class="reason-card-label">Make It More</div>
      ${data.adds.map((a) => `<div class="reason-add${a[1] ? ' on' : ''}"><span class="reason-add-box"></span><span>${a[0]}</span></div>`).join('')}</div>`;

  reasonRail.querySelectorAll('.reason-date').forEach((dateBtn) => {
    dateBtn.addEventListener('click', () => {
      reasonRail.querySelectorAll('.reason-date').forEach((d) => d.classList.remove('picked'));
      dateBtn.classList.add('picked');
    });
  });
  reasonRail.querySelectorAll('.reason-slot').forEach((slot) => {
    slot.addEventListener('click', () => {
      reasonRail.querySelectorAll('.reason-slot').forEach((s) => s.classList.remove('picked'));
      slot.classList.add('picked');
    });
  });
  reasonRail.querySelectorAll('.reason-add').forEach((add) => {
    add.addEventListener('click', () => add.classList.toggle('on'));
  });

}

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    if (reasonInput) {
      reasonInput.value = chip.textContent.trim();
      reasonGhost.classList.add('hide');
      reasonField.classList.add('lit');
    }
    showReasonResults(chip.dataset.k);
  });
});

if (reasonReset) {
  reasonReset.addEventListener('click', () => {
    reasonInput.value = '';
    reasonGhost.classList.remove('hide');
    reasonField.classList.remove('lit');
    reasonSection.classList.remove('showing-results');
    chips.forEach((c) => c.classList.remove('active'));
    charIndex = 0;
    deleting = false;
    if (!prefersReducedMotion) typePlaceholder();
    scrollBelowHeader(reasonSection);
  });
}

if (reasonCta) {
  reasonCta.addEventListener('click', (e) => {
    e.preventDefault();
    reasonCta.textContent = 'Table Held';
    reasonCta.classList.add('btn-black');
    setTimeout(() => {
      reasonCta.textContent = 'Reserve This Table';
      reasonCta.classList.remove('btn-black');
    }, 1800);
  });
}

// Build in section content (copy, then CTAs/imagery) on scroll into view
const revealSections = [
  document.getElementById('fireBeginning'),
  document.getElementById('culture'),
].filter(Boolean);

if (revealSections.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  revealSections.forEach((section) => revealObserver.observe(section));
}
