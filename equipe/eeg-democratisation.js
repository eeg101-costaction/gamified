// ════════════════════════════════════════════════════════════════════════════
// STEP 1 — RESEARCHER DATA
// 4 qualities: ERP Expert | Artifact Detective | AI / Signal Processing | Innovative Paradigm
// ════════════════════════════════════════════════════════════════════════════

const CHARACTERS = [
  { id: 9,  name: "Raj – AI Engineer",               quality: "AI / Signal Processing", qualityLabel: "🤖 ML models applied to EEG signals",          avatar: "👨‍💻", role: "India",        description: "Uses machine learning to detect complex patterns in EEG signals." },
  { id: 6,  name: "Sophie – Lab Technician",          quality: "Artifact Detective",     qualityLabel: "🔍 Eye-blink artifacts (EOG)",                  avatar: "👩‍💼", role: "France",       description: "Specialist in ocular artifacts (eye blinks and movements), keeps ERP signals intact." },
  { id: 15, name: "Aisha – Project Manager",          quality: "Innovative Paradigm",    qualityLabel: "💡 Inclusive experiment design",                 avatar: "👩‍🦱", role: "Kenya",        description: "Designs inclusive protocols so all participants can be included in EEG studies." },
  { id: 2,  name: "Dr. Hiroshi – Senior Researcher",  quality: "ERP Expert",             qualityLabel: "🎓 Social cognition ERP",                       avatar: "👨‍🏫", role: "Japan",        description: "Expert in social cognition ERP, detects subtle neural signals linked to human interaction." },
  { id: 5,  name: "Miguel – EEG Engineer",            quality: "Artifact Detective",     qualityLabel: "🔍 Muscle artifacts and eye-tracking",           avatar: "👨‍💼", role: "Spain",        description: "Detects and corrects muscle artifacts and movements, ensuring clean EEG signals." },
  { id: 14, name: "Koji – EEG Technician",            quality: "Innovative Paradigm",    qualityLabel: "💡 Innovative paradigms in social cognition",    avatar: "🧑‍⚖️", role: "Japan",        description: "Develops innovative social cognition paradigms to capture original ERP signals." },
  { id: 3,  name: "Hugo – PhD Student",               quality: "ERP Expert",             qualityLabel: "🎓 Decision-making and attention ERP",           avatar: "👨‍💼", role: "France",       description: "Works on attention-related ERP and develops experimental paradigms." },
  { id: 12, name: "Omar – Data Scientist",            quality: "AI / Signal Processing", qualityLabel: "🤖 Deep learning and pattern detection",         avatar: "🧑‍💼", role: "Egypt",        description: "Detects complex EEG patterns using advanced deep learning algorithms." },
  { id: 8,  name: "Kamal – PhD Student",              quality: "Artifact Detective",     qualityLabel: "🔍 High-density EEG signal cleaning",           avatar: "👩‍💻", role: "India",        description: "Cleans high-density EEG signals and prepares data for robust analyses." },
  { id: 1,  name: "Dr. Amina – Postdoc",              quality: "ERP Expert",             qualityLabel: "🎓 Visual and auditory ERP",                     avatar: "👩‍🔬", role: "North Africa", description: "Specialist in visual and auditory ERP, quickly identifies neural responses linked to stimuli." },
  { id: 11, name: "Isabella – Postdoc",               quality: "AI / Signal Processing", qualityLabel: "🤖 Spectral analysis and connectivity",          avatar: "👩‍⚕️", role: "Argentina",   description: "Expert in spectral analysis and brain connectivity, reveals hidden links between regions." },
  { id: 13, name: "Yara – R&D Engineer",              quality: "Innovative Paradigm",    qualityLabel: "💡 High-density EEG and virtual reality",        avatar: "👩‍💼", role: "Lebanon",      description: "Designs VR EEG experiments to explore new cognitive dimensions." },
];

const QUALITY_COLORS = {
  "ERP Expert":             { bg: "#e8f4f8", accent: "#1a6e94", badge: "#1a6e94" },
  "Artifact Detective":     { bg: "#fdf0e8", accent: "#c4621a", badge: "#c4621a" },
  "AI / Signal Processing": { bg: "#edf5ec", accent: "#2e7d32", badge: "#2e7d32" },
  "Innovative Paradigm":    { bg: "#f3edf9", accent: "#6a1b9a", badge: "#6a1b9a" },
};

// ════════════════════════════════════════════════════════════════════════════
// STEP 2 — PARTICIPANT DATA
// Each participant has: age, gender, origin, health, cognitive task
// underrepresented: true = underrepresented profile in classic EEG
// dimensionLabel: diversity dimension represented
// ════════════════════════════════════════════════════════════════════════════

const PARTICIPANTS = [
  // ── Classic profiles (overrepresented)
  {
    id: 101, name: "Thomas", avatar: "🧑‍🎓",
    underrepresented: false, dimensionLabel: null,
    age: "25 years old", genre: "Male", origine: "Western Europe",
    sante: "Healthy", tache: "Word memorization",
    description: "Psychology student, right-handed, no medical history. The classic 'standard' EEG participant.",
    profile: "Classic profile"
  },
  {
    id: 102, name: "Emma", avatar: "👩‍🎓",
    underrepresented: false, dimensionLabel: null,
    age: "23 years old", genre: "Female", origine: "Northern Europe",
    sante: "Healthy", tache: "Sustained attention task",
    description: "Neuroscience student recruited through her university. A very common profile in Western EEG studies.",
    profile: "Classic profile"
  },
  {
    id: 103, name: "Liam", avatar: "🧑‍💼",
    underrepresented: false, dimensionLabel: null,
    age: "28 years old", genre: "Male", origine: "North America",
    sante: "Healthy", tache: "Economic decision-making",
    description: "Young professional, English-speaking, familiar with experimental protocols. Heavily represented in EEG literature.",
    profile: "Classic profile"
  },
  // ── Underrepresented — Age
  {
    id: 104, name: "Moussa", avatar: "👦",
    underrepresented: true, dimensionLabel: "age",
    age: "9 years old", genre: "Boy", origine: "Senegal",
    sante: "Healthy", tache: "Face recognition",
    description: "9-year-old child. Pediatric EEG studies are rare: signals differ and protocols must be adapted.",
    profile: "Underrepresented · Age (child)"
  },
  {
    id: 105, name: "Marguerite", avatar: "👵",
    underrepresented: true, dimensionLabel: "age",
    age: "78 years old", genre: "Female", origine: "Rural France",
    sante: "Mild hearing loss", tache: "Episodic memory",
    description: "78-year-old retiree. Older adults are almost absent from reference EEG datasets.",
    profile: "Underrepresented · Age (senior)"
  },
  // ── Underrepresented — Cultural origin
  {
    id: 106, name: "Aiyana", avatar: "👩",
    underrepresented: true, dimensionLabel: "origin",
    age: "31 years old", genre: "Female", origine: "Indigenous community (Canada)",
    sante: "Healthy", tache: "Spatial navigation",
    description: "Member of a Canadian indigenous community. Non-Western populations are highly underrepresented in EEG research.",
    profile: "Underrepresented · Cultural origin"
  },
  {
    id: 107, name: "Priya", avatar: "👩‍💼",
    underrepresented: true, dimensionLabel: "origin",
    age: "34 years old", genre: "Female", origine: "South India",
    sante: "Healthy", tache: "Multilingual reading",
    description: "Trilingual speaker. Cultural biases in EEG stimuli are rarely measured outside a Western context.",
    profile: "Underrepresented · Cultural origin"
  },
  // ── Underrepresented — Health condition
  {
    id: 108, name: "Julien", avatar: "🧑‍🦽",
    underrepresented: true, dimensionLabel: "health",
    age: "27 years old", genre: "Male", origine: "Belgium",
    sante: "Partial quadriplegia", tache: "Brain-computer interface (BCI)",
    description: "Paraplegic, potential BCI user. EEG studies applied to motor disabilities remain marginal.",
    profile: "Underrepresented · Health condition (disability)"
  },
  {
    id: 109, name: "Fatou", avatar: "👩‍🦱",
    underrepresented: true, dimensionLabel: "health",
    age: "19 years old", genre: "Female", origine: "Mali",
    sante: "Controlled epilepsy", tache: "Response inhibition",
    description: "Young woman with epilepsy. Neurological conditions are rarely studied in standard EEG protocols.",
    profile: "Underrepresented · Health condition (epilepsy)"
  },
  // ── Underrepresented — Neurocognitive diversity
  {
    id: 110, name: "Noah", avatar: "🧑",
    underrepresented: true, dimensionLabel: "neurocognitive",
    age: "22 years old", genre: "Non-binary", origine: "Netherlands",
    sante: "Autism level 1", tache: "Facial expression processing",
    description: "High-functioning autistic person. Neurodiversity opens new EEG perspectives that remain largely unexplored.",
    profile: "Underrepresented · Neurocognitive diversity (autism)"
  },
  {
    id: 111, name: "Sara", avatar: "👩",
    underrepresented: true, dimensionLabel: "neurocognitive",
    age: "16 years old", genre: "Girl", origine: "Mexico",
    sante: "Diagnosed ADHD", tache: "Attentional control",
    description: "Teenager with ADHD. Yet EEG studies of ADHD in adolescent girls are virtually non-existent.",
    profile: "Underrepresented · Neurocognitive diversity (ADHD)"
  },
  // ── Underrepresented — Cognitive task type
  {
    id: 112, name: "Kaito", avatar: "🧑‍🎨",
    underrepresented: true, dimensionLabel: "task",
    age: "41 years old", genre: "Male", origine: "Japan",
    sante: "Healthy", tache: "Musical improvisation",
    description: "Professional jazz musician. Creative tasks in naturalistic conditions are rarely studied in EEG.",
    profile: "Underrepresented · Task type (creativity)"
  },
];

// ════════════════════════════════════════════════════════════════════════════
// PARTICIPANT COLOR MAP
// ════════════════════════════════════════════════════════════════════════════

const PARTICIPANT_COLORS = {
  classic:        { bg: "#f5f5f5", accent: "#607d8b", badge: "#607d8b" },
  age:            { bg: "#fff8e1", accent: "#f57f17", badge: "#f57f17" },
  origin:         { bg: "#e8f5e9", accent: "#2e7d32", badge: "#2e7d32" },
  health:         { bg: "#fce4ec", accent: "#ad1457", badge: "#ad1457" },
  neurocognitive: { bg: "#e8eaf6", accent: "#283593", badge: "#283593" },
  task:           { bg: "#f3e5f5", accent: "#6a1b9a", badge: "#6a1b9a" },
};

const DIMENSION_LABELS = {
  age:            "🟠 Underrepresented · Age",
  origin:         "🟢 Underrepresented · Origin",
  health:         "🔴 Underrepresented · Health",
  neurocognitive: "🔵 Underrepresented · Neurocognitive",
  task:           "🟣 Underrepresented · Task type",
};

function getParticipantColors(p) {
  if (!p.underrepresented) return PARTICIPANT_COLORS.classic;
  return PARTICIPANT_COLORS[p.dimensionLabel] || PARTICIPANT_COLORS.classic;
}

// ════════════════════════════════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════════════════════════════════

let selectedTeamIds = [];
let selectedParticipantIds = [];

// ════════════════════════════════════════════════════════════════════════════
// STEP 1 — RENDER CHARACTERS
// ════════════════════════════════════════════════════════════════════════════

function renderCharacters() {
  const grid = document.getElementById("characters-grid");
  grid.innerHTML = "";
  CHARACTERS.forEach(char => {
    const colors = QUALITY_COLORS[char.quality];
    const isSelected = selectedTeamIds.includes(char.id);
    const isFull = selectedTeamIds.length >= 4 && !isSelected;
    const card = document.createElement("div");
    card.className = `char-card${isSelected ? " selected" : ""}${isFull ? " disabled" : ""}`;
    card.style.setProperty("--accent", colors.accent);
    card.style.setProperty("--bg", colors.bg);
    card.innerHTML = `
      <div class="quality-strip" style="background:${colors.badge}">${char.qualityLabel}</div>
      <div class="avatar">${char.avatar}</div>
      <h3 class="char-name">${char.name}</h3>
      <span class="char-role">${char.role}</span>
      <p class="char-desc">${char.description}</p>
      <button class="choose-btn${isSelected ? " chosen" : ""}"
              onclick="toggleTeam(${char.id})"
              ${isFull ? "disabled" : ""}>
        ${isSelected ? "✓ Selected" : "Choose"}
      </button>`;
    grid.appendChild(card);
  });
}

function toggleTeam(id) {
  if (selectedTeamIds.includes(id)) {
    selectedTeamIds = selectedTeamIds.filter(x => x !== id);
  } else {
    if (selectedTeamIds.length >= 4) return;
    selectedTeamIds.push(id);
  }
  renderCharacters();
  renderTeamSlots();
  document.getElementById("team-counter").textContent = `${selectedTeamIds.length} / 4`;
  document.getElementById("validate-team-btn").disabled = selectedTeamIds.length !== 4;
}

function renderTeamSlots() {
  const slots = document.querySelectorAll("#team-slots .slot");
  const tagsRow = document.getElementById("tags-row");
  tagsRow.innerHTML = "";
  slots.forEach((slot, i) => {
    const char = CHARACTERS.find(c => c.id === selectedTeamIds[i]);
    if (char) {
      const colors = QUALITY_COLORS[char.quality];
      slot.className = "slot filled";
      slot.style.setProperty("--accent", colors.accent);
      slot.innerHTML = `
        <div class="slot-avatar">${char.avatar}</div>
        <div class="slot-name">${char.name.split(" – ")[0]}</div>
        <button class="remove-btn" onclick="toggleTeam(${char.id})">×</button>`;
      const tag = document.createElement("span");
      tag.className = "quality-tag";
      tag.style.background = colors.badge;
      tag.textContent = char.quality;
      tagsRow.appendChild(tag);
    } else {
      slot.className = "slot empty";
      slot.style.removeProperty("--accent");
      slot.innerHTML = `<span class="slot-hint">+</span>`;
    }
  });
}

// ════════════════════════════════════════════════════════════════════════════
// STEP 1 — VALIDATION
// ════════════════════════════════════════════════════════════════════════════

document.getElementById("validate-team-btn").addEventListener("click", () => {
  const selected = CHARACTERS.filter(c => selectedTeamIds.includes(c.id));
  const qualities = new Set(selected.map(c => c.quality));
  const allQualities = ["ERP Expert", "Artifact Detective", "AI / Signal Processing", "Innovative Paradigm"];
  const missing = allQualities.filter(q => !qualities.has(q));

  if (missing.length === 0) {
    showModal(
      true,
      "Great team!",
      "Your team covers all 4 key EEG competencies: ERP Expert, Artifact Detective, AI / Signal Processing, and Innovative Paradigm. This diverse team can correct artifacts and obtain reliable P300s!",
      "Proceed to Step 2 →",
      () => {
        document.getElementById("step-1").classList.remove("active");
        document.getElementById("step-2").classList.add("active");
        renderParticipants();
        renderParticipantSlots();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    );
  } else {
    showModal(
      false,
      "Team too homogeneous!",
      `Your team is missing: ${missing.join(", ")}. You need one researcher from each of the 4 competency areas.`,
      "Try again",
      () => { resetTeam(); }
    );
  }
});

function resetTeam() {
  selectedTeamIds = [];
  renderCharacters();
  renderTeamSlots();
  document.getElementById("team-counter").textContent = "0 / 4";
  document.getElementById("validate-team-btn").disabled = true;
}

// ════════════════════════════════════════════════════════════════════════════
// STEP 2 — RENDER PARTICIPANTS
// ════════════════════════════════════════════════════════════════════════════

function renderParticipants() {
  const grid = document.getElementById("participants-grid");
  grid.innerHTML = "";
  PARTICIPANTS.forEach(p => {
    const colors = getParticipantColors(p);
    const isSelected = selectedParticipantIds.includes(p.id);
    const isFull = selectedParticipantIds.length >= 4 && !isSelected;
    const card = document.createElement("div");
    card.className = `char-card${isSelected ? " selected" : ""}${isFull ? " disabled" : ""}`;
    card.style.setProperty("--accent", colors.accent);
    card.style.setProperty("--bg", colors.bg);

    const stripLabel = p.underrepresented
      ? (DIMENSION_LABELS[p.dimensionLabel] || "🌟 Underrepresented")
      : "⬜ Classic profile";

    card.innerHTML = `
      <div class="quality-strip" style="background:${colors.badge}">${stripLabel}</div>
      <div class="avatar">${p.avatar}</div>
      <h3 class="char-name">${p.name}</h3>
      <span class="char-role">${p.age} · ${p.genre}</span>
      <div class="participant-tags">
        <span class="ptag">🌍 ${p.origine}</span>
        <span class="ptag">❤️ ${p.sante}</span>
        <span class="ptag">🧠 ${p.tache}</span>
      </div>
      <p class="char-desc">${p.description}</p>
      <button class="choose-btn${isSelected ? " chosen" : ""}"
              onclick="toggleParticipant(${p.id})"
              ${isFull ? "disabled" : ""}>
        ${isSelected ? "✓ Included" : "Include"}
      </button>`;
    grid.appendChild(card);
  });
}

function toggleParticipant(id) {
  if (selectedParticipantIds.includes(id)) {
    selectedParticipantIds = selectedParticipantIds.filter(x => x !== id);
  } else {
    if (selectedParticipantIds.length >= 4) return;
    selectedParticipantIds.push(id);
  }
  renderParticipants();
  renderParticipantSlots();
  document.getElementById("participants-counter").textContent = `${selectedParticipantIds.length} / 4`;
  document.getElementById("validate-participants-btn").disabled = selectedParticipantIds.length !== 4;
}

function renderParticipantSlots() {
  const slots = document.querySelectorAll("#participants-slots .slot");
  const tagsRow = document.getElementById("participants-tags-row");
  tagsRow.innerHTML = "";
  slots.forEach((slot, i) => {
    const p = PARTICIPANTS.find(x => x.id === selectedParticipantIds[i]);
    if (p) {
      const colors = getParticipantColors(p);
      slot.className = "slot filled";
      slot.style.setProperty("--accent", colors.accent);
      slot.innerHTML = `
        <div class="slot-avatar">${p.avatar}</div>
        <div class="slot-name">${p.name}</div>
        <button class="remove-btn" onclick="toggleParticipant(${p.id})">×</button>`;
      const tag = document.createElement("span");
      tag.className = "quality-tag";
      tag.style.background = colors.badge;
      tag.textContent = p.underrepresented
        ? (DIMENSION_LABELS[p.dimensionLabel] || "🌟 Underrepresented")
        : "⬜ Classic";
      tagsRow.appendChild(tag);
    } else {
      slot.className = "slot empty";
      slot.style.removeProperty("--accent");
      slot.innerHTML = `<span class="slot-hint">+</span>`;
    }
  });
}

// ════════════════════════════════════════════════════════════════════════════
// STEP 2 — VALIDATION
// ════════════════════════════════════════════════════════════════════════════

document.getElementById("validate-participants-btn").addEventListener("click", () => {
  const selected = PARTICIPANTS.filter(p => selectedParticipantIds.includes(p.id));
  const underDimensions = new Set(
    selected.filter(p => p.underrepresented).map(p => p.dimensionLabel)
  );
  const allDimensions = ["age", "origin", "health", "neurocognitive", "task"];
  const coveredDimensions = allDimensions.filter(d => underDimensions.has(d));

  if (coveredDimensions.length >= 3) {
    showModal(
      true,
      "🎉 Your study is inclusive!",
      `Your research team is diverse, and your participants cover ${coveredDimensions.length} underrepresented dimensions in EEG. Congratulations — you are contributing to a more inclusive EEG science!`,
      "Close",
      () => { document.getElementById("modal-overlay").classList.remove("active"); }
    );
  } else {
    const missing = allDimensions
      .filter(d => !underDimensions.has(d))
      .map(d => DIMENSION_LABELS[d] || d)
      .join(", ");
    showModal(
      false,
      "Population too homogeneous!",
      `Your selection only covers ${coveredDimensions.length} underrepresented dimension(s) out of 5. Try including more varied profiles. Missing dimensions: ${missing}.`,
      "Try again",
      () => { resetParticipants(); }
    );
  }
});

function resetParticipants() {
  selectedParticipantIds = [];
  renderParticipants();
  renderParticipantSlots();
  document.getElementById("participants-counter").textContent = "0 / 4";
  document.getElementById("validate-participants-btn").disabled = true;
}

// ════════════════════════════════════════════════════════════════════════════
// MODAL
// ════════════════════════════════════════════════════════════════════════════

function showModal(success, title, message, btnLabel, onClose) {
  const overlay = document.getElementById("modal-overlay");
  const modal   = document.getElementById("modal");
  document.getElementById("modal-icon").textContent    = success ? "🎉" : "⚠️";
  document.getElementById("modal-title").textContent   = title;
  document.getElementById("modal-message").textContent = message;
  const btn = document.getElementById("modal-btn");
  btn.textContent = btnLabel;
  btn.onclick = () => {
    overlay.classList.remove("active");
    if (onClose) onClose();
  };
  modal.classList.toggle("success", success);
  modal.classList.toggle("failure", !success);
  overlay.classList.add("active");
}

// ════════════════════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════════════════════

renderCharacters();
renderTeamSlots();