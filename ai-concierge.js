// Gaúcho — website AI concierge (desktop widget, matches gaucho.js aesthetic/pattern)

const AI_GREETING = "I'm Gaúcho. I can help you schedule a reservation, book a large party, answer menu questions, suggest a wine pairing, or fill you in on Fogo Rewards. What can I help with?";

const AI_RESPONSES = [
  {
    hit: ['reservation', 'reserve', 'table', 'book'],
    reply: "I can help with that — head to our reservations page to pick a time, or tell me the party size and date and I'll flag it for our host stand.",
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
  return (AI_RESPONSES.find((r) => r.hit.some((h) => q.includes(h))) || { reply: AI_FALLBACK }).reply;
}

const aiBackdrop = document.getElementById('aiBackdrop');
const aiPanel = document.getElementById('aiPanel');
const aiMessages = document.getElementById('aiMessages');
const aiForm = document.getElementById('aiForm');
const aiInput = document.getElementById('aiInput');
const aiCloseBtn = document.getElementById('aiCloseBtn');
const navAiBtn = document.getElementById('navAiBtn');
const aiQuickReplies = document.getElementById('aiQuickReplies');

let aiStarted = false;

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

function aiReplyTo(userText) {
  showAiTyping();
  setTimeout(() => {
    hideAiTyping();
    addAiMessage(matchAiConcierge(userText), 'ai');
  }, 700 + Math.random() * 500);
}

function sendAiUserMessage(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return;
  addAiMessage(trimmed, 'user');
  aiInput.value = '';
  aiReplyTo(trimmed);
}

function openAiPanel() {
  aiBackdrop.classList.add('active');
  aiPanel.classList.add('active');
  if (!aiStarted) {
    aiStarted = true;
    aiMessages.innerHTML = '<h2 class="ai-hola">Hola!</h2>';
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
  aiQuickReplies.querySelectorAll('.ai-chip').forEach((chip) => {
    chip.addEventListener('click', () => sendAiUserMessage(chip.dataset.q));
  });
}
