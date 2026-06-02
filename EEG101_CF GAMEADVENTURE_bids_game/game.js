// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════
const HOLES = [
  { id:'h_taskname',    correct:['TASKNAME'],           hint:'Task name indicated in the EEG JSON file (TaskName field)',                cat:'json_eeg'   },
  { id:'h_eegref',     correct:['placed on Cz'],       hint:'EEG reference: on which electrode is it placed?',                         cat:'json_eeg'   },
  { id:'h_stim3',      correct:['stim3.png'],          hint:'Image file for the 3rd stimulus (same format as stim1.png/stim2.png)',     cat:'events'     },
  { id:'h_fc5status',  correct:['bad'],                hint:'Status of the FC5 channel which shows high-frequency noise',              cat:'channels'   },
  { id:'h_c3units',    correct:['microV'],             hint:'Unit of measurement common to all EEG channels in the file',              cat:'channels'   },
  { id:'h_cp5_y',      correct:['-0.30'],              hint:'Y coordinate of electrode CP5 (negative value, lateral axis)',            cat:'electrodes' },
  { id:'h_coordsys',   correct:['T1w'],                hint:'EEG coordinate system: anatomical reference used',                        cat:'coordsys'   },
  { id:'h_intendedfor',correct:['sub-01_T1w.nii.gz'], hint:'MRI file this coordinate system refers to (IntendedFor)',                  cat:'coordsys'   },
];

const PHASE2_BLOCKS = [
  { id:'p2_edf',      label:'sub-01_task-TASKNAME_eeg.edf'          },
  { id:'p2_json',     label:'sub-01_task-TASKNAME_eeg.json'         },
  { id:'p2_events',   label:'sub-01_task-TASKNAME_events.tsv'       },
  { id:'p2_channels', label:'sub-01_task-TASKNAME_channels.tsv'     },
  { id:'p2_elec',     label:'sub-01_task-TASKNAME_electrodes.tsv'   },
  { id:'p2_coord',    label:'sub-01_task-TASKNAME_coordsystem.json' },
];

// ══════════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════════
const state = {
  holes:        {},
  availBlocks:  [],
  dragId:       null,
  dragP2Id:     null,
  phase:        1,
  p2Slots:      {},
  p2Locked:     {},
  p2Pool:       [],
  p2Errors:     0,
  p2HintShown:  false,
};

HOLES.forEach(h => { state.holes[h.id] = { filled: false, value: null }; });
PHASE2_BLOCKS.forEach((_, i) => { state.p2Slots[i] = null; state.p2Locked[i] = false; });

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════
function getHole(id)    { return HOLES.find(h => h.id === id); }
function getP2Block(id) { return PHASE2_BLOCKS.find(b => b.id === id); }

function updateProgress() {
  const totalSlots  = HOLES.length + (state.phase === 2 ? 6 : 0);
  const filledHoles = HOLES.filter(h => state.holes[h.id].filled).length;
  const filledP2    = Object.values(state.p2Locked).filter(Boolean).length;
  const filled      = filledHoles + (state.phase === 2 ? filledP2 : 0);
  const pct         = Math.round(filled / totalSlots * 100);
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('prog-text').textContent  = filled + ' / ' + totalSlots;
}

function showFeedback(type, msg) {
  const fb = document.getElementById('feedback');
  fb.className   = 'feedback ' + type;
  fb.textContent = msg;
}

// ══════════════════════════════════════════════════════════════
// WELCOME POPUP
// ══════════════════════════════════════════════════════════════
function showWelcomePopup() {
  const overlay = document.getElementById('welcome-overlay');
  if (overlay) overlay.classList.add('show');
}

function closeWelcomePopup() {
  const overlay = document.getElementById('welcome-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    setTimeout(() => {
      const inp = document.getElementById('meta-input');
      if (inp) inp.focus();
    }, 300);
  }
}

// ══════════════════════════════════════════════════════════════
// BUILD BIDS HTML
// ══════════════════════════════════════════════════════════════
function makeSlotEl(hid) {
  const s = state.holes[hid];
  if (s.filled) {
    return `<span class="drop-slot correct">${s.value} ✓</span>`;
  }
  return `<span class="drop-slot droppable" data-hole="${hid}">_ _ _</span>`;
}

function buildBIDSHTML() {
  const sl = makeSlotEl;
  return `
  <div class="data-block">
    <div class="block-label">sub-01_task-TASKNAME_events.tsv</div>
    <table class="data-table">
      <tr><th>onset</th><th>duration</th><th>value</th><th>stim_file</th></tr>
      <tr><td>6</td><td>1</td><td>1</td><td>stim1.png</td></tr>
      <tr><td>10</td><td>1</td><td>2</td><td>stim2.png</td></tr>
      <tr><td>15</td><td>1</td><td>3</td><td>${sl('h_stim3')}</td></tr>
      <tr><td>24</td><td>1</td><td>1</td><td>stim1.png</td></tr>
    </table>
  </div>

  <div class="data-block" style="margin-top:1rem">
    <div class="block-label">sub-01_task-TASKNAME_eeg.json</div>
    <div class="json-body">
      {<br>
      &nbsp;&nbsp;"TaskName": ${sl('h_taskname')},<br>
      &nbsp;&nbsp;"SamplingFrequency": 1000,<br>
      &nbsp;&nbsp;"SoftwareFilters": "n/a",<br>
      &nbsp;&nbsp;"EEGChannelCount": 4,<br>
      &nbsp;&nbsp;"EOGChannelCount": 1,<br>
      &nbsp;&nbsp;"EEGReference": ${sl('h_eegref')},<br>
      &nbsp;&nbsp;"PowerLineFrequency": 50<br>
      }
    </div>
  </div>

  <div class="data-block">
    <div class="block-label">sub-01_task-TASKNAME_channels.tsv</div>
    <table class="data-table">
      <tr><th>name</th><th>type</th><th>units</th><th>status</th><th>status_description</th></tr>
      <tr><td>CP5</td><td>EEG</td><td>microV</td><td>good</td><td>n/a</td></tr>
      <tr><td>FC5</td><td>EEG</td><td>microV</td><td>${sl('h_fc5status')}</td><td>high freq noise</td></tr>
      <tr><td>FC1</td><td>EEG</td><td>microV</td><td>good</td><td>n/a</td></tr>
      <tr><td>C3</td><td>EEG</td><td>${sl('h_c3units')}</td><td>good</td><td>n/a</td></tr>
      <tr><td>VEOG</td><td>EOG</td><td>microV</td><td>good</td><td>n/a</td></tr>
    </table>
  </div>

  <div class="data-block">
    <div class="block-label">sub-01_task-TASKNAME_coordsystem.json</div>
    <div class="json-body">
      {<br>
      &nbsp;&nbsp;"EEGCoordinateSystem": ${sl('h_coordsys')},<br>
      &nbsp;&nbsp;"EEGCoordinateUnits": "mm",<br>
      &nbsp;&nbsp;"AnatomicalLandmarkCoordinates": {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;"LPA": [-0.067, 1.736e-09, -3.844e-09],<br>
      &nbsp;&nbsp;&nbsp;&nbsp;"NAS": [-4.11e-09, 0.091, -4.541e-10],<br>
      &nbsp;&nbsp;&nbsp;&nbsp;"RPA": [0.064, -6.435e-09, -4.566e-09]<br>
      &nbsp;&nbsp;},<br>
      &nbsp;&nbsp;"AnatomicalLandmarkCoordinateSystem": "T1w",<br>
      &nbsp;&nbsp;"AnatomicalLandmarkCoordinateUnits": "mm",<br>
      &nbsp;&nbsp;"IntendedFor": ${sl('h_intendedfor')}<br>
      }
    </div>
  </div>

  <div class="data-block">
    <div class="block-label">sub-01_task-TASKNAME_electrodes.tsv — incomplete CP5 row</div>
    <table class="data-table">
      <tr><th>name</th><th>x</th><th>y</th><th>z</th><th>impedance</th></tr>
      <tr class="missing-row">
        <td>CP5</td>
        <td>-0.77</td>
        <td>${sl('h_cp5_y')}</td>
        <td>0.57</td>
        <td>8</td>
      </tr>
      <tr><td>FC5</td><td>-0.77</td><td>0.30</td><td>0.57</td><td>12</td></tr>
      <tr><td>FC1</td><td>-0.29</td><td>0.31</td><td>0.91</td><td>2</td></tr>
      <tr><td>C3</td><td>-0.59</td><td>0.00</td><td>0.81</td><td>5</td></tr>
      <tr><td>VEOG</td><td>n/a</td><td>n/a</td><td>n/a</td><td>n/a</td></tr>
    </table>
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// RENDER FUNCTIONS
// ══════════════════════════════════════════════════════════════
function renderBIDS() {
  document.getElementById('bids-content').innerHTML = buildBIDSHTML();
  bindDropSlots();
  updateProgress();
}

function renderAvailBlocks() {
  const container = document.getElementById('avail-blocks');
  if (state.availBlocks.length === 0) {
    container.innerHTML = '<span class="avail-empty">Enter correct values to create blocks…</span>';
    return;
  }
  container.innerHTML = '';
  state.availBlocks.forEach(b => {
    const el = document.createElement('div');
    el.className  = 'avail-block';
    el.draggable  = true;
    el.dataset.bid = b.id;
    el.innerHTML  = `<span class="ab-dot"></span>${b.value}`;
    el.addEventListener('dragstart', () => {
      state.dragId = b.id;
      setTimeout(() => el.classList.add('dragging'), 0);
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      state.dragId = null;
    });
    container.appendChild(el);
  });
}

function renderHints() {
  const hl       = document.getElementById('hint-list');
  const unfilled = HOLES.filter(h => !state.holes[h.id].filled).slice(0, 6);
  hl.innerHTML   = unfilled.map(h =>
    `<div class="hint-item"><span class="hi">?</span>${h.hint}</div>`
  ).join('');
}

// ══════════════════════════════════════════════════════════════
// DROP SLOTS
// ══════════════════════════════════════════════════════════════
function bindDropSlots() {
  document.querySelectorAll('.drop-slot.droppable').forEach(el => {
    const hid = el.dataset.hole;
    el.addEventListener('dragover', e => {
      e.preventDefault();
      if (state.dragId) el.classList.add('drag-over');
    });
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('drag-over');
      handleDropOnHole(hid, el);
    });
  });
}

function handleDropOnHole(hid, slotEl) {
  if (!state.dragId) return;
  const block = state.availBlocks.find(b => b.id === state.dragId);
  if (!block) { state.dragId = null; return; }

  if (block.holeId === hid) {
    state.holes[hid] = { filled: true, value: block.value };
    state.availBlocks = state.availBlocks.filter(b => b.id !== block.id);
    showFeedback('ok', '✓ Correct! Data successfully placed.');
    renderBIDS();
    renderAvailBlocks();
    renderHints();
    checkPhase1Done();
  } else {
    slotEl.classList.add('wrong');
    setTimeout(() => slotEl.classList.remove('wrong'), 400);
    showFeedback('err', '✗ This block does not match this slot.');
  }
  state.dragId = null;
}

// ══════════════════════════════════════════════════════════════
// SUBMIT INPUT (Phase 1)
// ══════════════════════════════════════════════════════════════
function submitMeta() {
  const input = document.getElementById('meta-input');
  const val   = input.value.trim();
  if (!val) return;

  const alreadyInPool = state.availBlocks.some(b =>
    b.value.toLowerCase() === val.toLowerCase()
  );
  if (alreadyInPool) {
    showFeedback('err', '⚠ This block already exists — drag it into a slot!');
    return;
  }

  const match = HOLES.find(h =>
    !state.holes[h.id].filled &&
    !state.availBlocks.some(b => b.holeId === h.id) &&
    h.correct.some(c => c.toLowerCase() === val.toLowerCase())
  );

  if (match) {
    state.availBlocks.push({ id: 'ab_' + Date.now(), holeId: match.id, value: val });
    showFeedback('ok', '✓ Value recognised! Drag the block into the correct slot.');
    renderAvailBlocks();
    renderHints();
    input.value = '';
    input.focus();
  } else {
    const alreadyFilled = HOLES.find(h =>
      state.holes[h.id].filled &&
      h.correct.some(c => c.toLowerCase() === val.toLowerCase())
    );
    if (alreadyFilled) {
      showFeedback('err', '⚠ This value is already placed in the structure.');
    } else {
      showFeedback('err', '✗ Incorrect value. Check the hints below.');
    }
  }
}

// ══════════════════════════════════════════════════════════════
// PHASE 2 POPUP
// ══════════════════════════════════════════════════════════════
function showPhase2Popup() {
  const overlay = document.getElementById('phase2-overlay');
  if (overlay) overlay.classList.add('show');
}

function closePhase2Popup() {
  const overlay = document.getElementById('phase2-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    setTimeout(() => {
      const leftCol = document.querySelector('.left-col');
      if (leftCol) leftCol.scrollTop = 0;
    }, 300);
  }
}

// ══════════════════════════════════════════════════════════════
// HINT PHASE 2
// ══════════════════════════════════════════════════════════════
function askForHint() {
  if (state.p2HintShown) {
    revealHint();
    return;
  }
  const overlay = document.getElementById('hint-confirm-overlay');
  if (overlay) overlay.classList.add('show');
}

function closeHintConfirm(confirmed) {
  const overlay = document.getElementById('hint-confirm-overlay');
  if (overlay) overlay.classList.remove('show');
  if (confirmed) {
    state.p2HintShown = true;
    revealHint();
  }
}

function revealHint() {
  const card = document.getElementById('hint-order-card');
  if (card) {
    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function checkPhase1Done() {
  if (HOLES.every(h => state.holes[h.id].filled)) {
    setTimeout(startPhase2, 700);
  }
}

// ══════════════════════════════════════════════════════════════
// PHASE 2
// ══════════════════════════════════════════════════════════════
function startPhase2() {
  state.phase = 2;
  document.getElementById('pd2').classList.add('active');
  document.getElementById('phase1-panel').style.display = 'none';
  document.getElementById('phase2-panel').style.display = 'block';
  document.getElementById('phase2-zone').style.display  = 'block';
  document.getElementById('phase-title').innerHTML = `
    <div class="phase-title-tag">Phase 2</div>
    <strong>Sort the 6 files in the correct order</strong>
    <p>All slots are filled! Drag the files into the correct BIDS order (1→6).</p>`;

  state.p2Pool = [...PHASE2_BLOCKS].sort(() => Math.random() - 0.5).map(b => b.id);
  renderP2();

  const leftCol = document.querySelector('.left-col');
  if (leftCol) leftCol.scrollTop = 0;
  setTimeout(showPhase2Popup, 400);
}

function renderP2() {
  renderShuffleZone();
  renderOrderSlots();
  const locked = Object.values(state.p2Locked).filter(Boolean).length;
  document.getElementById('phase2-progress').textContent = locked + ' / 6 correctly placed';
  updateProgress();
}

function renderShuffleZone() {
  const zone = document.getElementById('shuffle-zone');
  zone.innerHTML = '';

  if (state.p2Pool.length === 0) {
    zone.innerHTML = '<span class="avail-empty">All blocks are placed!</span>';
  } else {
    state.p2Pool.forEach(id => {
      const b = getP2Block(id);
      if (!b) return;
      zone.appendChild(createP2BlockEl(b, false));
    });
  }

  zone.addEventListener('dragover', e => e.preventDefault());
  zone.addEventListener('drop', e => {
    e.preventDefault();
    if (!state.dragP2Id) return;
    const fromSlot = Object.keys(state.p2Slots).find(
      k => state.p2Slots[k] === state.dragP2Id && !state.p2Locked[k]
    );
    if (fromSlot !== undefined) {
      state.p2Slots[fromSlot] = null;
      state.p2Pool.push(state.dragP2Id);
      renderP2();
    }
    state.dragP2Id = null;
  });
}

function createP2BlockEl(b, locked, slotIdx) {
  const el = document.createElement('div');
  el.className = 'num-block' + (locked ? ' locked' : '');
  if (!locked) {
    el.draggable = true;
    el.addEventListener('dragstart', () => {
      state.dragP2Id = b.id;
      setTimeout(() => el.classList.add('dragging'), 0);
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      state.dragP2Id = null;
    });
  }
  const numSpan = document.createElement('span');
  numSpan.className   = 'block-num';
  numSpan.textContent = locked ? (slotIdx + 1) : '?';
  el.appendChild(numSpan);
  const labelSpan = document.createElement('span');
  labelSpan.textContent = b.label;
  el.appendChild(labelSpan);
  return el;
}

function renderOrderSlots() {
  const os = document.getElementById('order-slots');
  os.innerHTML = '';
  PHASE2_BLOCKS.forEach((_, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'order-slot-wrap';

    const num = document.createElement('div');
    num.className   = 'order-num';
    num.textContent = i + 1;
    wrap.appendChild(num);

    const slot = document.createElement('div');
    slot.className =
      'order-slot' +
      (state.p2Slots[i]  ? ' filled'        : '') +
      (state.p2Locked[i] ? ' correct-order' : '');

    if (state.p2Slots[i]) {
      const b = getP2Block(state.p2Slots[i]);
      if (b) slot.appendChild(createP2BlockEl(b, state.p2Locked[i], i));
    } else {
      slot.textContent = 'Drop here…';
    }

    slot.addEventListener('dragover',  e => { e.preventDefault(); if (!state.p2Locked[i]) slot.classList.add('drag-over'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
    slot.addEventListener('drop',      e => { e.preventDefault(); slot.classList.remove('drag-over'); handleP2Drop(i); });

    wrap.appendChild(slot);
    os.appendChild(wrap);
  });
}

function handleP2Drop(slotIdx) {
  if (!state.dragP2Id || state.p2Locked[slotIdx]) return;
  const bid      = state.dragP2Id;
  state.dragP2Id = null;

  const prevSlot = Object.keys(state.p2Slots).find(
    k => state.p2Slots[k] === bid && !state.p2Locked[k]
  );

  if (state.p2Slots[slotIdx] && !state.p2Locked[slotIdx]) {
    state.p2Pool.push(state.p2Slots[slotIdx]);
  }

  state.p2Pool = state.p2Pool.filter(id => id !== bid);
  if (prevSlot !== undefined) state.p2Slots[prevSlot] = null;
  state.p2Slots[slotIdx] = bid;

  if (bid === PHASE2_BLOCKS[slotIdx].id) {
    state.p2Locked[slotIdx] = true;
    renderP2();
    checkPhase2Done();
  } else {
    renderP2();
    setTimeout(() => {
      if (!state.p2Locked[slotIdx]) {
        state.p2Pool.push(state.p2Slots[slotIdx]);
        state.p2Slots[slotIdx] = null;
        state.p2Errors++;
        renderP2();
        if (state.p2Errors >= 3 && !state.p2HintShown) {
          setTimeout(() => {
            const overlay = document.getElementById('hint-confirm-overlay');
            if (overlay) overlay.classList.add('show');
          }, 400);
        }
      }
    }, 700);
  }
}

function checkPhase2Done() {
  if (PHASE2_BLOCKS.every((_, i) => state.p2Locked[i])) {
    setTimeout(showSuccess, 800);
  }
}

// ══════════════════════════════════════════════════════════════
// SUCCESS
// ══════════════════════════════════════════════════════════════
function showSuccess() {
  document.getElementById('success-overlay').classList.add('show');
}

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('meta-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitMeta();
  });
  renderBIDS();
  renderAvailBlocks();
  renderHints();
  updateProgress();
  showWelcomePopup();
});