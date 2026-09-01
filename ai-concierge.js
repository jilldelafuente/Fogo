// Gaúcho — website AI concierge (desktop widget, matches gaucho.js aesthetic/pattern)

const AI_GREETING = "I'm Selma. I can help you schedule a reservation, book a large party, answer menu questions, suggest a wine pairing, or fill you in on Fogo Rewards. What can I help with?";

const AI_RESPONSES = [
  {
    hit: ['reservation', 'reserve', 'table', 'book'],
    reply: "Happy to help — let's get your table booked.",
    action: 'reserve',
  },
  {
    hit: ['churrasco', 'how does this work'],
    reply: "Churrasco is the Southern Brazilian tradition of fire-roasting seasoned cuts of meat and carving them tableside — continuously, until you say stop.",
  },
  {
    hit: ['menu', 'highlight', 'picanha', 'cut', 'meat'],
    reply: "Picanha is the cut churrasco is built around, but the seasonal Market Table and our fire-roasted sides are just as popular. Want the full menu?",
  },
  {
    hit: ['rewards', 'loyalty', 'points', 'join'],
    reply: "Fogo Rewards gets you a complimentary charcuterie plate on every visit, plus $25 off on your birthday. Want the link to sign up?",
  },
  {
    hit: ['private', 'event', 'group', 'party', 'catering'],
    reply: "We host private dining and catering for groups of all sizes. Want me to connect you with our events team?",
  },
  {
    hit: ['hour', 'location', 'address', 'open', 'near'],
    reply: "Hours vary by location — let me know which restaurant you're asking about and I'll pull up the details.",
  },
  {
    hit: ['hi', 'hello', 'hey', "what's up"],
    reply: "Hey there! What can I help with — a reservation, the menu, or something else?",
  },
];

const AI_FALLBACK = "Great question — I'll make sure our team follows up. In the meantime, feel free to ask about the menu, reservations, or Fogo Rewards.";

function matchAiConcierge(text) {
  const q = text.toLowerCase();
  return AI_RESPONSES.find((r) => r.hit.some((h) => q.includes(h))) || { reply: AI_FALLBACK };
}

const aiBackdrop = document.getElementById('aiBackdrop');
const aiPanel = document.getElementById('aiPanel');
const aiMessages = document.getElementById('aiMessages');
const aiForm = document.getElementById('aiForm');
const aiInput = document.getElementById('aiInput');
const aiCloseBtn = document.getElementById('aiCloseBtn');
const navAiBtn = document.getElementById('navAiBtn');
const aiQuickReplies = document.getElementById('aiQuickReplies');

const DEFAULT_QUICK_REPLIES_HTML = aiQuickReplies ? aiQuickReplies.innerHTML : '';
const DEFAULT_INPUT_PLACEHOLDER = aiInput ? aiInput.placeholder : '';

let aiStarted = false;
let reservation = null; // { step: 'party' | 'date' | 'time' | 'name', party, date, time, name }

function scrollAiToBottom() {
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function addAiMessage(text, sender) {
  const bubble = document.createElement('div');
  bubble.className = `ai-msg ${sender}`;
  bubble.textContent = text;
  aiMessages.appendChild(bubble);
  scrollAiToBottom();
}

function showAiTyping() {
  const typing = document.createElement('div');
  typing.className = 'ai-typing';
  typing.id = 'aiTypingIndicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  aiMessages.appendChild(typing);
  scrollAiToBottom();
}

function hideAiTyping() {
  document.getElementById('aiTypingIndicator')?.remove();
}

function setAiQuickReplies(chips) {
  if (!aiQuickReplies) return;
  aiQuickReplies.innerHTML = chips
    .map((c) => `<button type="button" class="ai-chip" data-q="${c.value}">${c.label}</button>`)
    .join('');
}

function restoreDefaultQuickReplies() {
  if (aiQuickReplies) aiQuickReplies.innerHTML = DEFAULT_QUICK_REPLIES_HTML;
  if (aiInput) aiInput.placeholder = DEFAULT_INPUT_PLACEHOLDER;
}

// Next 6 selectable days, OpenTable-style, starting today
function buildReservationDates() {
  const out = [];
  const today = new Date();
  for (let i = 0; i < 6; i++) {
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

const RESERVATION_TIMES = ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'];

function startReservationFlow() {
  reservation = { step: 'party' };
  showAiTyping();
  setTimeout(() => {
    hideAiTyping();
    addAiMessage('First — how many people in your party?', 'ai');
    setAiQuickReplies(
      ['2', '3', '4', '5', '6', '8 or more'].map((v) => ({ label: v, value: v }))
    );
  }, 500);
}

function cancelReservationFlow() {
  reservation = null;
  addAiMessage("No problem — let me know whenever you're ready to book.", 'ai');
  restoreDefaultQuickReplies();
}

function advanceReservation(value) {
  showAiTyping();
  setTimeout(() => {
    hideAiTyping();
    const step = reservation.step;

    if (step === 'party') {
      reservation.party = value;
      reservation.step = 'date';
      addAiMessage(`Party of ${value} — got it. What day works?`, 'ai');
      setAiQuickReplies(buildReservationDates().map((d) => ({ label: d, value: d })));
    } else if (step === 'date') {
      reservation.date = value;
      reservation.step = 'time';
      addAiMessage(`${value} it is. What time?`, 'ai');
      setAiQuickReplies(RESERVATION_TIMES.map((t) => ({ label: t, value: t })));
    } else if (step === 'time') {
      reservation.time = value;
      reservation.step = 'name';
      addAiMessage("Perfect. What name should we put the reservation under?", 'ai');
      setAiQuickReplies([]);
      if (aiInput) aiInput.placeholder = 'Type the name for your reservation…';
    } else if (step === 'name') {
      reservation.name = value;
      reservation.step = 'notes';
      addAiMessage(
        "Last thing — anything specific we should know? Dietary considerations, allergies, or anything about the guest experience that'd make the visit better.",
        'ai'
      );
      setAiQuickReplies([{ label: 'Nothing to add', value: 'Nothing to add' }]);
      if (aiInput) aiInput.placeholder = 'Type any details…';
    } else if (step === 'notes') {
      reservation.notes = value;
      finishReservation();
    }
  }, 700 + Math.random() * 500);
}

function finishReservation() {
  const { party, date, time, name, notes } = reservation;
  const hasNotes = notes && notes.toLowerCase() !== 'nothing to add';
  const noteLine = hasNotes ? ` I've noted: "${notes}."` : '';
  addAiMessage(
    `You're all set, ${name} — party of ${party} on ${date} at ${time}.${noteLine} We'll have your table ready. See you soon!`,
    'ai'
  );
  reservation = null;
  restoreDefaultQuickReplies();
}

function aiReplyTo(userText) {
  showAiTyping();
  setTimeout(() => {
    hideAiTyping();
    const match = matchAiConcierge(userText);
    addAiMessage(match.reply, 'ai');
    if (match.action === 'reserve') {
      setTimeout(() => startReservationFlow(), 500);
    }
  }, 700 + Math.random() * 500);
}

function sendAiUserMessage(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return;
  addAiMessage(trimmed, 'user');
  aiInput.value = '';

  if (reservation) {
    if (['cancel', 'never mind', 'nevermind', 'stop'].includes(trimmed.toLowerCase())) {
      cancelReservationFlow();
    } else {
      advanceReservation(trimmed);
    }
  } else {
    aiReplyTo(trimmed);
  }
}

function openAiPanel() {
  aiBackdrop.classList.add('active');
  aiPanel.classList.add('active');
  if (!aiStarted) {
    aiStarted = true;
    aiMessages.innerHTML = '<h2 class="ai-hola">Ola!</h2>';
    showAiTyping();
    setTimeout(() => {
      hideAiTyping();
      addAiMessage(AI_GREETING, 'ai');
    }, 700);
  }
}

function closeAiPanel() {
  aiBackdrop.classList.remove('active');
  aiPanel.classList.remove('active');
  aiMessages.innerHTML = '';
  aiInput.value = '';
  aiStarted = false;
  reservation = null;
  restoreDefaultQuickReplies();
}

if (navAiBtn) navAiBtn.addEventListener('click', openAiPanel);
if (aiCloseBtn) aiCloseBtn.addEventListener('click', closeAiPanel);
if (aiBackdrop) aiBackdrop.addEventListener('click', closeAiPanel);

if (aiForm) {
  aiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendAiUserMessage(aiInput.value);
  });
}

if (aiQuickReplies) {
  aiQuickReplies.addEventListener('click', (e) => {
    const chip = e.target.closest('.ai-chip');
    if (!chip) return;
    sendAiUserMessage(chip.dataset.q);
  });
}
