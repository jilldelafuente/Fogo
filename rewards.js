// Fogo Rewards signup flow — 5-step form, adapted from the reference prototype

// Offset the fixed clay sidebar below the site nav, whatever its rendered height is
function syncHeaderHeight() {
  const header = document.getElementById('siteHeader');
  if (header) document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
}
syncHeaderHeight();
window.addEventListener('resize', syncHeaderHeight);

const REWARDS_SIDE = {
  1: ["Let’s start with the basics.", "This just gets your account set up."],
  2: ["Tell us how you gather.", "We’ll make sure Fogo fits, whether it’s a table for two or a table for twelve."],
  3: ["We’ll remember the dates.", "Anniversaries, birthdays, whatever’s worth celebrating — tell us once."],
  4: ["One last thing.", "This is how we make sure what we send you actually feels relevant."],
  5: ["Welcome to the table.", "Every visit starts here now."],
};

function updateLoyaltyTabs(step) {
  const activeTab = Math.min(step, 4);
  document.querySelectorAll('.loyalty-tab').forEach((tab) => {
    tab.classList.toggle('active', Number(tab.dataset.tab) === activeTab);
  });
}

// Restarts the step-enter / choice build-in animation for a step
function playStepEnter(stepEl) {
  stepEl.classList.remove('step-enter');
  // eslint-disable-next-line no-unused-expressions
  stepEl.offsetWidth; // force reflow so the animation restarts
  stepEl.classList.add('step-enter');
}

function rewardsGo(step) {
  document.querySelectorAll('.loyalty-step').forEach((s) => { s.style.display = 'none'; });
  const nextStep = document.querySelector(`.loyalty-step[data-step="${step}"]`);
  nextStep.style.display = 'block';
  playStepEnter(nextStep);

  const [head, sub] = REWARDS_SIDE[step];
  document.getElementById('loyaltySideHead').textContent = head;
  document.getElementById('loyaltySideSub').textContent = sub;
  updateLoyaltyTabs(step);

  if (step === 5) buildRewardsSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Single/multi-select choice pills. `rank` controls whether selections get numbered badges.
function rewardsChoiceGroup(containerId, options, multi, max, rank = true) {
  const el = document.getElementById(containerId);
  el.innerHTML = options
    .map((o) => `<button type="button" class="loyalty-choice" data-v="${o}">${o}</button>`)
    .join('');

  el.querySelectorAll('.loyalty-choice').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (multi) {
        const onNow = el.querySelectorAll('.loyalty-choice.on').length;
        if (!btn.classList.contains('on') && onNow >= max) return;
        btn.classList.toggle('on');
        if (rank) {
          el.querySelectorAll('.loyalty-choice.on').forEach((c, i) => {
            c.querySelector('.loyalty-rank-badge')?.remove();
            c.insertAdjacentHTML('afterbegin', `<span class="loyalty-rank-badge">${i + 1}</span>`);
          });
          el.querySelectorAll('.loyalty-choice:not(.on)').forEach((c) => {
            c.querySelector('.loyalty-rank-badge')?.remove();
          });
        }
        checkRewardsFinish();
      } else {
        el.querySelectorAll('.loyalty-choice').forEach((c) => c.classList.remove('on'));
        btn.classList.add('on');
      }
    });
  });
}

rewardsChoiceGroup('rwQ1', ['Just me', 'Partner', 'Kids at home', 'Extended family', 'Friends, usually a group', 'Other'], true, Infinity, false);
rewardsChoiceGroup('rwQ2', [
  'A real occasion — birthday, anniversary, milestone',
  'Work — clients or team',
  'A regular thing we do',
  'Whenever, no reason needed',
], false);
rewardsChoiceGroup('rwQ3', [
  'Something for everyone at the table',
  'Fast, easy, no fuss',
  'Feels special',
  'New things to try',
  'Reliable, we know what we’re getting',
], true, 2);

const rwOptin = document.getElementById('rwOptin');
if (rwOptin) rwOptin.addEventListener('change', checkRewardsFinish);

function checkRewardsFinish() {
  const finishBtn = document.getElementById('rwFinishBtn');
  if (finishBtn) finishBtn.disabled = !rwOptin.checked;
}

// Date rows (step 3)
function addRewardsDateRow() {
  const wrap = document.createElement('div');
  wrap.className = 'loyalty-dates-row';
  wrap.innerHTML = `
    <div class="loyalty-field"><label>What&rsquo;s the occasion?</label><input placeholder="e.g. Anniversary, Mia's birthday"></div>
    <div class="loyalty-field"><label>Date</label><input placeholder="MM/DD/YYYY"></div>`;
  document.getElementById('rwDateRows').appendChild(wrap);
}

const addDateBtn = document.getElementById('rwAddDate');
if (addDateBtn) addDateBtn.addEventListener('click', addRewardsDateRow);
addRewardsDateRow();

// Summary (step 5)
function buildRewardsSummary() {
  const who = [...document.querySelectorAll('#rwQ1 .loyalty-choice.on')].map((b) => b.dataset.v);
  const occasion = document.querySelector('#rwQ2 .loyalty-choice.on')?.dataset.v || '—';
  const dates = [...document.querySelectorAll('.loyalty-dates-row')]
    .map((row) => {
      const inputs = row.querySelectorAll('input');
      return inputs[0].value ? `${inputs[0].value} — ${inputs[1].value || 'no date set'}` : null;
    })
    .filter(Boolean);
  const priorities = [...document.querySelectorAll('#rwQ3 .loyalty-choice.on')].map((b) => b.dataset.v);
  const dietary = document.getElementById('rwDietary')?.value.trim();

  document.getElementById('rwSummary').innerHTML = `
    <div><b>Usually dining with:</b> ${who.length ? who.join(', ') : '—'}</div>
    <div><b>What brings you in:</b> ${occasion}</div>
    <div><b>Dates on file:</b> ${dates.length ? dates.join('; ') : 'None added'}</div>
    <div><b>Top priorities:</b> ${priorities.length ? priorities.join(' → ') : '—'}</div>
    <div><b>Dietary notes:</b> ${dietary ? dietary : 'None added'}</div>`;
}

updateLoyaltyTabs(1);
playStepEnter(document.querySelector('.loyalty-step[data-step="1"]'));
