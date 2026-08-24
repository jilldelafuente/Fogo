// Gaúcho — in-restaurant AI meal assistant (mobile experience)

const GAUCHO_GREETING = "Hey there! I'm Gaúcho, your table's meal assistant tonight. Ask me about the menu, get a wine pairing, flag a dietary need, or just say hi. What can I help with?";

const GAUCHO_RESPONSES = [
  {
    hit: ['churrasco', 'what is churrasco', 'how does this work', 'how does churrasco work'],
    reply: "Churrasco is the Southern Brazilian tradition of fire-roasting seasoned cuts of meat and carving them tableside — continuously, until you say stop. Want to see tonight's cuts in more depth? Tap “See the Cuts” below.",
  },
  {
    hit: ['cut', 'cuts', 'picanha', 'meat'],
    reply: "Great choice — let's pull up tonight's cuts.",
    action: 'cuts',
  },
  {
    hit: ['wine', 'pairing', 'recommend a wine', 'malbec', 'red wine', 'white wine'],
    reply: "For the full churrasco, a Malbec holds up beautifully to the richer cuts like fraldinha and costela. If you'd rather stay lighter, ask your sommelier about our Argentine Torrontés — it's a great match for the Market Table.",
  },
  {
    hit: ['dietary', 'allergy', 'allergic', 'vegetarian', 'vegan', 'gluten', 'restriction'],
    reply: "Noted — I've flagged this for your server. Quick tip: our Market Table is naturally gluten-free and has 30+ vegetarian items, so there's always plenty to build a full meal from.",
  },
  {
    hit: ['$59', 'special', 'four course', 'promo', 'offer'],
    reply: "Tonight's special is $59 for four courses — a selection of our most popular fire-roasted cuts, the seasonal Market Table, authentic sides, and your choice of dessert. Want me to have your server walk you through it?",
  },
  {
    hit: ['call', 'server', 'waiter', 'help', 'check', 'bill'],
    reply: "On it — I've sent a notification to your server that your table needs a hand. They'll be over shortly.",
  },
  {
    hit: ['rewards', 'join', 'loyalty', 'points'],
    reply: "Smart move. Fogo Rewards gets you a complimentary charcuterie plate on every visit, plus $25 off on your birthday. Want the link to sign up before you leave?",
  },
  {
    hit: ['hi', 'hello', 'hey', 'sup', "what's up"],
    reply: "Hey! Good to have you at the table tonight. What can I help with — the menu, a pairing, or something else?",
  },
];

const GAUCHO_FALLBACK = "I'll pass that along to your server so they can take care of it in person. In the meantime, feel free to ask me about the menu, a wine pairing, or tonight's $59 special.";

function matchGaucho(text) {
  const q = text.toLowerCase();
  return GAUCHO_RESPONSES.find((r) => r.hit.some((h) => q.includes(h))) || { reply: GAUCHO_FALLBACK };
}

const gauchoWelcome = document.getElementById('gauchoWelcome');
const gauchoChat = document.getElementById('gauchoChat');
const gauchoMessages = document.getElementById('gauchoMessages');
const gauchoForm = document.getElementById('gauchoForm');
const gauchoInput = document.getElementById('gauchoInput');
const gauchoStartBtn = document.getElementById('gauchoStartBtn');
const gauchoEndBtn = document.getElementById('gauchoEndBtn');
const gauchoQuickReplies = document.getElementById('gauchoQuickReplies');

function scrollMessagesToBottom() {
  gauchoMessages.scrollTop = gauchoMessages.scrollHeight;
}

function addGauchoMessage(text, sender) {
  const bubble = document.createElement('div');
  bubble.className = `gaucho-msg ${sender}`;
  bubble.textContent = text;
  gauchoMessages.appendChild(bubble);
  scrollMessagesToBottom();
}

function showGauchoTyping() {
  const typing = document.createElement('div');
  typing.className = 'gaucho-typing';
  typing.id = 'gauchoTypingIndicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  gauchoMessages.appendChild(typing);
  scrollMessagesToBottom();
}

function hideGauchoTyping() {
  document.getElementById('gauchoTypingIndicator')?.remove();
}

function gauchoReplyTo(userText) {
  showGauchoTyping();
  setTimeout(() => {
    hideGauchoTyping();
    const match = matchGaucho(userText);
    addGauchoMessage(match.reply, 'ai');
    if (match.action === 'cuts') {
      setTimeout(() => openCutsPanel(), 500);
    }
  }, 700 + Math.random() * 500);
}

function sendGauchoUserMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  addGauchoMessage(trimmed, 'user');
  gauchoInput.value = '';
  gauchoReplyTo(trimmed);
}

function startGauchoChat() {
  gauchoWelcome.classList.add('hide');
  gauchoChat.classList.add('active');
  gauchoMessages.innerHTML = '';
  showGauchoTyping();
  setTimeout(() => {
    hideGauchoTyping();
    addGauchoMessage(GAUCHO_GREETING, 'ai');
  }, 900);
}

if (gauchoStartBtn) gauchoStartBtn.addEventListener('click', startGauchoChat);

if (gauchoEndBtn) {
  gauchoEndBtn.addEventListener('click', () => {
    gauchoChat.classList.remove('active');
    gauchoWelcome.classList.remove('hide');
    gauchoInput.value = '';
  });
}

if (gauchoForm) {
  gauchoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendGauchoUserMessage(gauchoInput.value);
  });
}

if (gauchoQuickReplies) {
  gauchoQuickReplies.querySelectorAll('.gaucho-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (chip.dataset.action === 'cuts') {
        openCutsPanel();
      } else {
        sendGauchoUserMessage(chip.dataset.q);
      }
    });
  });
}

/* ---------- Cuts education panel ---------- */
const BEEF_CUTS = [
  {
    name: 'Picanha',
    sub: 'Top Sirloin Cap',
    copy: "Picanha is the cut churrasco is built around. Lightly seasoned and sliced in front of you, it's tender with just enough marbling to stay juicy without being heavy.",
    chartTitle: 'Top Sirloin',
    chartDesc: 'It offers a bold, beefy flavor and a firm texture',
    richness: 'Moderate',
    seasoning: 'Rock Salt',
    method: 'Skewer',
  },
  {
    name: 'Filet Mignon',
    sub: 'Tenderloin',
    copy: "The most tender cut on the table. Filet mignon is lean, buttery-soft, and mild — a quiet counterpoint to picanha's boldness.",
    chartTitle: 'Tenderloin',
    chartDesc: 'Delicate texture with very little marbling',
    richness: 'Lean',
    seasoning: 'Sea Salt',
    method: 'Skewer',
  },
  {
    name: 'Alcatra',
    sub: 'Top Rump',
    copy: 'A Fogo staple since day one. Alcatra is cut thick and roasted whole, giving you a rich, traditional churrasco flavor in every slice.',
    chartTitle: 'Top Rump',
    chartDesc: 'Full-bodied flavor, roasted whole for depth',
    richness: 'Rich',
    seasoning: 'Garlic & Salt',
    method: 'Whole Roast',
  },
  {
    name: 'Fraldinha',
    sub: 'Bottom Sirloin Flap',
    copy: 'Loved for its marbling, fraldinha carries a bolder, more intense flavor than picanha — a favorite for guests who want more char and more fat.',
    chartTitle: 'Bottom Sirloin',
    chartDesc: 'Heavily marbled with a bold, beefy finish',
    richness: 'Bold',
    seasoning: 'Rock Salt',
    method: 'Skewer',
  },
  {
    name: 'Beef Ancho',
    sub: 'Ribeye Cap',
    copy: 'Grilled directly over open flame, beef ancho picks up a deep char and stays impossibly juicy underneath — one of the richest cuts we carve.',
    chartTitle: 'Ribeye Cap',
    chartDesc: 'Heavily marbled, char-forward, very rich',
    richness: 'Very Rich',
    seasoning: 'Cracked Pepper',
    method: 'Direct Flame',
  },
  {
    name: 'Costela',
    sub: 'Beef Ribs',
    copy: "Costela spends hours over the fire until it's falling off the bone. Slow-cooked, smoky, and worth the wait every time.",
    chartTitle: 'Beef Ribs',
    chartDesc: 'Slow-cooked for hours until fall-off-the-bone tender',
    richness: 'Rich',
    seasoning: 'Rock Salt',
    method: 'Slow Fire',
  },
];

const cutsPanel = document.getElementById('cutsPanel');
const cutsCloseBtn = document.getElementById('cutsCloseBtn');
const cutsTabs = document.getElementById('cutsTabs');
const cutsCarousel = document.getElementById('cutsCarousel');
const cutsSoon = document.getElementById('cutsSoon');
const cutsDots = document.getElementById('cutsDots');
const cutsPrefBtn = document.getElementById('cutsPrefBtn');
const cutsRequestBtn = document.getElementById('cutsRequestBtn');

let cutsIndex = 0;
const savedCuts = new Set();

function renderCuts() {
  const cut = BEEF_CUTS[cutsIndex];
  document.getElementById('cutsName').textContent = cut.name;
  document.getElementById('cutsSub').textContent = cut.sub;
  document.getElementById('cutsCopy').textContent = cut.copy;
  document.getElementById('cutsChartTitle').textContent = cut.chartTitle;
  document.getElementById('cutsChartDesc').textContent = cut.chartDesc;
  document.getElementById('cutsRichness').textContent = cut.richness;
  document.getElementById('cutsSeasoning').textContent = cut.seasoning;
  document.getElementById('cutsMethod').textContent = cut.method;

  cutsDots.innerHTML = BEEF_CUTS.map((_, i) =>
    `<button type="button" class="cuts-dot${i === cutsIndex ? ' active' : ''}" data-i="${i}" aria-label="Cut ${i + 1}"></button>`
  ).join('');
  cutsDots.querySelectorAll('.cuts-dot').forEach((dot) => {
    dot.addEventListener('click', () => { cutsIndex = Number(dot.dataset.i); renderCuts(); });
  });

  cutsPrefBtn.classList.toggle('on', savedCuts.has(cut.name));
  cutsPrefBtn.textContent = savedCuts.has(cut.name) ? 'Added ✓' : 'Add to Preferences';
  cutsRequestBtn.textContent = 'Request Cut';
}

function openCutsPanel() {
  cutsIndex = 0;
  renderCuts();
  cutsCarousel.style.display = 'block';
  cutsSoon.classList.remove('active');
  cutsTabs.querySelectorAll('.cuts-tab').forEach((t) => t.classList.toggle('active', t.dataset.cat === 'beef'));
  cutsPanel.classList.add('active');
}

function closeCutsPanel() {
  cutsPanel.classList.remove('active');
}

if (cutsCloseBtn) cutsCloseBtn.addEventListener('click', closeCutsPanel);

if (cutsTabs) {
  cutsTabs.querySelectorAll('.cuts-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      cutsTabs.querySelectorAll('.cuts-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.cat === 'beef') {
        cutsCarousel.style.display = 'block';
        cutsSoon.classList.remove('active');
        cutsIndex = 0;
        renderCuts();
      } else {
        cutsCarousel.style.display = 'none';
        cutsSoon.classList.add('active');
      }
    });
  });
}

if (cutsPrefBtn) {
  cutsPrefBtn.addEventListener('click', () => {
    const cut = BEEF_CUTS[cutsIndex];
    if (savedCuts.has(cut.name)) savedCuts.delete(cut.name);
    else savedCuts.add(cut.name);
    renderCuts();
  });
}

if (cutsRequestBtn) {
  cutsRequestBtn.addEventListener('click', () => {
    const cutName = BEEF_CUTS[cutsIndex].name;
    closeCutsPanel();
    addGauchoMessage(`Got it — I've let your server know you'd like the ${cutName} next.`, 'ai');
  });
}
