
// ─── ÉTAT DU JEU ───────────────────────────────
const state = {
  step: 0,
  scores: { reach: 0, equity: 0, science: 0 },
  populations: {
    researchers: 0,
    clinicians: 0,
    patients: 0,
    citizens: 0,
    policymakers: 0,
    'global-south': 0,
  },
  continents: {
    europe: false,
    'north-america': false,
    'south-america': false,
    africa: false,
    asia: false,
    oceania: false,
  },
  chainState: { pub: false, clinic: false, society: false },
  choices: [],
  history: [], // snapshot avant chaque choix
};

function snapshotState() {
  return {
    step: state.step,
    scores: { ...state.scores },
    populations: { ...state.populations },
    continents: { ...state.continents },
    chainState: { ...state.chainState },
    choices: [...state.choices],
  };
}

function restoreState(snap) {
  state.step       = snap.step;
  state.scores     = { ...snap.scores };
  state.populations = { ...snap.populations };
  state.continents  = { ...snap.continents };
  state.chainState  = { ...snap.chainState };
  state.choices     = [...snap.choices];
}

// ─── ÉTAPES DU JEU ─────────────────────────────
const steps = [
  {
    id: 'publication',
    stepLabel: 'Step 1 / 6 — Publication',
    title: 'Where do you publish your findings?',
    text: 'Your EEG study is completed. The data is solid, the conclusions clear. It is time to share these results with the world… but which one?',
    jeanjmi: '"I spent 3 years on this study. I want it to be useful. But where should I publish?"',
    choices: [
      {
        id: 'closed-journal',
        icon: '🔒',
        title: 'High-impact paywalled journal',
        desc: 'Nature Neuroscience, $4000/access. Maximum prestige, readership restricted to wealthy institutions.',
        tags: [{ t: '+Science', k: 'good' }, { t: '-Equity', k: 'bad' }, { t: '~Reach', k: 'neutral' }],
        delta: { reach: 10, equity: -15, science: 25 },
        populations: { researchers: 30, clinicians: 5, patients: 0, citizens: 0, policymakers: 5, 'global-south': 0 },
        continents: ['europe', 'north-america'],
        chain: { pub: true, clinic: false, society: false },
        feedback: {
          icon: '🔒',
          title: 'Prestige... but at what cost?',
          text: 'Your article is published in a renowned journal. A few hundred well-funded researchers will have access to it. Universities in the Global South? They cannot afford it. Field clinicians? They do not read these journals. Dissemination stops in the academic ivory towers.',
          lesson: '⚠️ A closed publication confines science to the most well-funded.',
        },
      },
      {
        id: 'open-access',
        icon: '🔓',
        title: 'Open Access',
        desc: 'PLOS ONE or PsyArXiv — accessible for free all over the world, forever.',
        tags: [{ t: '+Reach', k: 'good' }, { t: '+Equity', k: 'good' }, { t: '~Science', k: 'neutral' }],
        delta: { reach: 25, equity: 20, science: 15 },
        populations: { researchers: 60, clinicians: 20, patients: 5, citizens: 10, policymakers: 10, 'global-south': 25 },
        continents: ['europe', 'north-america', 'africa', 'asia'],
        chain: { pub: true, clinic: true, society: false },
        feedback: {
          icon: '🔓',
          title: 'Science opens up to the world!',
          text: 'By choosing open access, you allow anyone — a clinician in Tanzania, an independent researcher in São Paulo, a nurse in Lyon — to access your results. Dissemination expands immediately.',
          lesson: '✅ Open access multiplies reach and reduces inequalities in access.',
        },
      },
      {
        id: 'preprint',
        icon: '⚡',
        title: 'Immediate Preprint',
        desc: 'bioRxiv / medRxiv — published today, peer review in progress. Fast but not yet validated.',
        tags: [{ t: '+Speed', k: 'good' }, { t: '~Science', k: 'neutral' }, { t: '?Validity', k: 'neutral' }],
        delta: { reach: 20, equity: 15, science: 5 },
        populations: { researchers: 50, clinicians: 10, patients: 0, citizens: 5, policymakers: 5, 'global-south': 15 },
        continents: ['europe', 'north-america', 'asia'],
        chain: { pub: true, clinic: false, society: false },
        feedback: {
          icon: '⚡',
          title: 'Fast, but fragile.',
          text: 'The preprint allows immediate dissemination within the scientific community. But without peer review, clinicians remain wary. Results circulate quickly, but their credibility is partial — which can slow down adoption.',
          lesson: '⚡ Preprints speed up dissemination but can weaken clinical trust.',
        },
      },
    ],
  },
  {
    id: 'vulgarisation',
    stepLabel: 'Step 2 / 6 — Science Communication',
    title: 'Are you going to popularize your results?',
    text: 'Your article is published. But it is written for experts — technical jargon, complex statistics, academic format. The question arises: should it be translated for the public?',
    jeanjmi: '"My article is 8000 words long with ANOVA tables. Even my sister, who is a doctor, doesn\'t fully understand it."',
    choices: [
      {
        id: 'no-vulga',
        icon: '🙈',
        title: 'No, the article is enough',
        desc: 'The results are out there. It is up to the readers to make the effort to understand.',
        tags: [{ t: '-Reach', k: 'bad' }, { t: '-Impact', k: 'bad' }, { t: '~Time', k: 'good' }],
        delta: { reach: -5, equity: -10, science: 5 },
        populations: { researchers: 5, clinicians: -5, patients: -5, citizens: -10, policymakers: -5, 'global-south': -5 },
        continents: [],
        chain: { pub: true, clinic: false, society: false },
        feedback: {
          icon: '🙈',
          title: 'Science remains invisible.',
          text: 'Without science communication, the article remains invisible to everyone outside your specific field. Clinicians do not have time to decipher complex statistical analyses. Citizens and patients will never know this research exists.',
          lesson: '❌ Without translation, science stays in its tower — even when published.',
        },
      },
      {
        id: 'blog-post',
        icon: '✍️',
        title: 'Accessible blog post',
        desc: 'A summary in plain language on the lab website, easy to share on social media.',
        tags: [{ t: '+Citizens', k: 'good' }, { t: '+Clinicians', k: 'good' }, { t: '~Effort', k: 'neutral' }],
        delta: { reach: 20, equity: 15, science: 5 },
        populations: { researchers: 5, clinicians: 20, patients: 15, citizens: 30, policymakers: 15, 'global-south': 10 },
        continents: ['south-america', 'africa'],
        chain: { pub: true, clinic: true, society: true },
        feedback: {
          icon: '✍️',
          title: 'A bridge between the tower and the street!',
          text: 'A well-written blog post can be read by a clinician in 5 minutes, shared by a patient with their doctor, or picked up by a journalist. You have just built a bridge between research and society.',
          lesson: '✅ Science communication is both a scientific and a political act.',
        },
      },
      {
        id: 'media-kit',
        icon: '📢',
        title: 'Media kit + podcast + infographic',
        desc: 'Downloadable infographic, podcast episode, press release. Maximum effort, maximum impact.',
        tags: [{ t: '+Max Reach', k: 'good' }, { t: '+Equity', k: 'good' }, { t: '⏱ Costly', k: 'neutral' }],
        delta: { reach: 30, equity: 25, science: 10 },
        populations: { researchers: 10, clinicians: 30, patients: 35, citizens: 50, policymakers: 30, 'global-south': 25 },
        continents: ['south-america', 'africa', 'oceania'],
        chain: { pub: true, clinic: true, society: true },
        feedback: {
          icon: '📢',
          title: 'Maximum impact!',
          text: 'Bravo! The media kit reaches all audiences simultaneously. The infographic is shared on social media, the podcast reaches clinicians on the go, and the press release ends up in the hands of policymakers. Your research lives everywhere.',
          lesson: '🌟 A multi-format communication effort multiplies real-world impact.',
        },
      },
    ],
  },
  {
    id: 'partage',
    stepLabel: 'Step 3 / 6 — Targeted Sharing',
    title: 'Who are you sharing with directly?',
    text: 'You can now choose to actively send your results to specific groups. This step determines who hears about your work.',
    jeanjmi: '"I have contacts in different circles. Who should I write to?"',
    choices: [
      {
        id: 'researchers-only',
        icon: '🔬',
        title: 'Only the academic community',
        desc: 'Conferences, researcher mailing lists, ResearchGate. Dissemination stays within the scientific circle.',
        tags: [{ t: '+Citations', k: 'good' }, { t: '-Clinical', k: 'bad' }, { t: '-Society', k: 'bad' }],
        delta: { reach: 10, equity: -10, science: 20 },
        populations: { researchers: 20, clinicians: -5, patients: 0, citizens: -5, policymakers: 0, 'global-south': 0 },
        continents: [],
        chain: { pub: true, clinic: false, society: false },
        feedback: {
          icon: '🔬',
          title: 'Science stays in the lab.',
          text: 'By sharing only with researchers, you feed the scientific literature — which is important. But clinicians won\'t change their practices, patients won\'t know an EEG tool exists, and policymakers will never hear about you.',
          lesson: '⚠️ Intra-academic circulation is necessary but insufficient.',
        },
      },
      {
        id: 'clinicians',
        icon: '🩺',
        title: 'Clinicians and healthcare workers',
        desc: 'Medical societies, nurses, nursing homes, general practitioners.',
        tags: [{ t: '+Clinical Impact', k: 'good' }, { t: '+Patients', k: 'good' }, { t: '~Science', k: 'neutral' }],
        delta: { reach: 20, equity: 20, science: 10 },
        populations: { researchers: 5, clinicians: 40, patients: 25, citizens: 5, policymakers: 10, 'global-south': 5 },
        continents: [],
        chain: { pub: true, clinic: true, society: false },
        feedback: {
          icon: '🩺',
          title: 'From the lab to the patient\'s bedside!',
          text: 'By targeting clinicians, you cross the most important border: the one between research and practice. Your results can now influence care protocols, diagnoses, and therapies. This is where science changes lives.',
          lesson: '✅ The researcher → clinician bridge is the most transformative for patients.',
        },
      },
      {
        id: 'all-publics',
        icon: '🌐',
        title: 'All audiences at the same time',
        desc: 'Researchers + clinicians + patient associations + policymakers + media.',
        tags: [{ t: '+Everything', k: 'good' }, { t: '+Max Equity', k: 'good' }, { t: '⏱ Effort', k: 'neutral' }],
        delta: { reach: 30, equity: 30, science: 15 },
        populations: { researchers: 15, clinicians: 35, patients: 30, citizens: 40, policymakers: 35, 'global-south': 20 },
        continents: ['south-america', 'africa', 'oceania'],
        chain: { pub: true, clinic: true, society: true },
        feedback: {
          icon: '🌐',
          title: 'The complete chain!',
          text: 'By reaching all audiences simultaneously, you create a network effect: researchers cite, clinicians adopt, patients request, policymakers fund, and media amplifies. This is systemic dissemination.',
          lesson: '🌟 Multi-audience dissemination creates cascading effects.',
        },
      },
    ],
  },
  {
    id: 'donnees',
    stepLabel: 'Step 4 / 6 — Open Data',
    title: 'Do you share your raw data?',
    text: 'Beyond the article, your EEG data is a valuable scientific resource. Do you share it so others can reuse it?',
    jeanjmi: '"My data represents 3 years of work. Giving it away... isn\'t it risky?"',
    choices: [
      {
        id: 'no-data',
        icon: '🔐',
        title: 'No, I keep the data',
        desc: 'It contains sensitive information and represents my competitive advantage.',
        tags: [{ t: '-Reproducibility', k: 'bad' }, { t: '-Open Science', k: 'bad' }, { t: '~Security', k: 'neutral' }],
        delta: { reach: 0, equity: -5, science: -10 },
        populations: { researchers: -10, clinicians: 0, patients: 0, citizens: 0, policymakers: 0, 'global-south': -5 },
        continents: [],
        chain: { pub: true, clinic: true, society: false },
        feedback: {
          icon: '🔐',
          title: 'The black box.',
          text: 'Without access to raw data, no one can replicate your study, verify your analyses, or build new tools from your work. The reproducibility crisis in cognitive sciences is precisely fueled by this culture of secrecy.',
          lesson: '❌ Keeping data locked away stops the cumulative growth of science.',
        },
      },
      {
        id: 'open-data',
        icon: '📂',
        title: 'Yes, on OSF or Zenodo',
        desc: 'Anonymized data uploaded to an open platform under a Creative Commons license.',
        tags: [{ t: '+Reproducibility', k: 'good' }, { t: '+Science', k: 'good' }, { t: '+Reuse', k: 'good' }],
        delta: { reach: 20, equity: 15, science: 30 },
        populations: { researchers: 30, clinicians: 10, patients: 5, citizens: 5, policymakers: 5, 'global-south': 15 },
        continents: ['asia', 'south-america'],
        chain: { pub: true, clinic: true, society: true },
        feedback: {
          icon: '📂',
          title: 'Data lives beyond the article!',
          text: 'By sharing your data, you allow other researchers to replicate, analyze differently, build meta-analyses, or even develop diagnostic AI tools. Your study becomes a brick in a collective structure.',
          lesson: '✅ Open data transforms an article into scientific infrastructure.',
        },
      },
      {
        id: 'federated-data',
        icon: '🔗',
        title: 'Federated data with enhanced anonymization',
        desc: 'GDPR-compliant platform, controlled access for researchers, data is never centralized.',
        tags: [{ t: '+Security', k: 'good' }, { t: '+Science', k: 'good' }, { t: '+Ethics', k: 'good' }],
        delta: { reach: 25, equity: 20, science: 25 },
        populations: { researchers: 25, clinicians: 15, patients: 10, citizens: 5, policymakers: 15, 'global-south': 10 },
        continents: ['asia'],
        chain: { pub: true, clinic: true, society: true },
        feedback: {
          icon: '🔗',
          title: 'The perfect balance: openness + ethics.',
          text: 'Data federation allows scientific access while protecting participants. You demonstrate that openness and confidentiality are not contradictory — this is the future of responsible open science.',
          lesson: '🌟 Responsible open science reconciles access and protection.',
        },
      },
    ],
  },
  {
    id: 'conference',
    stepLabel: 'Step 5 / 6 — Conference',
    title: 'Where are you going to present your study?',
    text: 'Publishing is good. But presenting at a conference is another way to make science circulate: through exchanges, debates, and networking. Each congress attracts different communities.',
    jeanjmi: '"My abstract was accepted multiple times. I have to choose where to go. The budget is limited."',
    choices: [
      {
        id: 'sfn',
        icon: '🧠',
        title: 'SfN — Society for Neuroscience',
        desc: '30,000 neuroscientists in Chicago. The largest neuroscience congress in the world. Massive audience, but highly academic and dominated by the Anglo-Saxon world.',
        tags: [{ t: '+Academic Visibility', k: 'good' }, { t: '~Equity', k: 'neutral' }, { t: '-Clinical', k: 'bad' }],
        delta: { reach: 20, equity: 5, science: 25 },
        populations: { researchers: 35, clinicians: 5, patients: 0, citizens: 0, policymakers: 5, 'global-south': 5 },
        continents: ['north-america'],
        chain: { pub: true, clinic: false, society: false },
        feedback: {
          icon: '🧠',
          title: 'Maximum scientific visibility!',
          text: 'SfN is a machine for citations and academic collaborations. Thousands of researchers see your poster. But the audience is almost exclusively academic: no clinicians, no policymakers, and little representation from the Global South. Science circules... within its own bubble.',
          lesson: '⚠️ SfN amplifies academic reach but stays within the research ecosystem.',
        },
      },
      {
        id: 'ohbm',
        icon: '🗺️',
        title: 'OHBM — Organization for Human Brain Mapping',
        desc: 'The reference in neuroimaging: EEG, fMRI, MEG. An international methodological community, highly focused on tools and reproducibility.',
        tags: [{ t: '+Methods', k: 'good' }, { t: '+International', k: 'good' }, { t: '~Clinical Impact', k: 'neutral' }],
        delta: { reach: 22, equity: 15, science: 30 },
        populations: { researchers: 40, clinicians: 10, patients: 0, citizens: 0, policymakers: 5, 'global-south': 10 },
        continents: ['north-america', 'europe', 'asia'],
        chain: { pub: true, clinic: false, society: false },
        feedback: {
          icon: '🗺️',
          title: 'The community that builds the tools!',
          text: 'OHBM is the ideal congress for an EEG study: you talk to people who understand your methods, who can reuse your pipelines, and who will cite your approaches. The community is more international than SfN and very committed to open science. Excellent scientific choice.',
          lesson: '✅ OHBM connects directly to methodological and open science communities.',
        },
      },
      {
        id: 'cutting-gardens',
        icon: '✂️',
        title: 'Cutting Gardens',
        desc: 'An intimate conference (~150 people), multidisciplinary, deliberately inclusive. Brings together junior researchers, clinicians, artists, and citizens. Little known, but highly impactful.',
        tags: [{ t: '+Diversity', k: 'good' }, { t: '+Equity', k: 'good' }, { t: '~Prestige', k: 'neutral' }],
        delta: { reach: 15, equity: 35, science: 15 },
        populations: { researchers: 20, clinicians: 25, patients: 15, citizens: 30, policymakers: 20, 'global-south': 20 },
        continents: ['europe', 'south-america', 'africa'],
        chain: { pub: true, clinic: true, society: true },
        feedback: {
          icon: '✂️',
          title: 'The congress that shifts perspectives!',
          text: 'Cutting Gardens does something rare: it deliberately brings very different profiles to the table. Your presentation reaches not only researchers, but also curious clinicians, community workers, and representatives from underrepresented groups. Less prestige, but more real-world impact.',
          lesson: '🌟 Interdisciplinary and inclusive spaces create connections that are impossible anywhere else.',
        },
      },
    ],
  },
  {
    id: 'equite',
    stepLabel: 'Step 6 / 6 — Global Equity',
    title: 'Are you thinking about the Global South?',
    text: 'The final question is perhaps the most important. Most of the global burden of disease is in low-income countries. Does your research reach them?',
    jeanjmi: '"My data came from European participants. Are my findings universal?"',
    choices: [
      {
        id: 'ignore-south',
        icon: '🌐',
        title: 'I don\'t ask myself the question',
        desc: 'My research is published in open access, that\'s already good.',
        tags: [{ t: '-Equity', k: 'bad' }, { t: '-Relevance', k: 'bad' }, { t: '~Effort', k: 'neutral' }],
        delta: { reach: 0, equity: -20, science: -5 },
        populations: { researchers: 0, clinicians: 0, patients: -10, citizens: 0, policymakers: 0, 'global-south': -20 },
        continents: [],
        chain: { pub: true, clinic: true, society: false },
        feedback: {
          icon: '🌐',
          title: 'The blind spot of global science.',
          text: 'Open access alone is not enough to reach the Global South: language barriers, lack of infrastructure, unrepresentative data. By ignoring this question, your research unintentionally reinforces global health inequalities.',
          lesson: '❌ Dissemination without a decolonial perspective reproduces inequalities.',
        },
      },
      {
        id: 'translate',
        icon: '🌍',
        title: 'Translation into 3 languages + NGO sharing',
        desc: 'Summary in French, Spanish, and Swahili. Sent to global health NGOs and African universities.',
        tags: [{ t: '+Max Equity', k: 'good' }, { t: '+Reach', k: 'good' }, { t: '⏱ Effort', k: 'neutral' }],
        delta: { reach: 25, equity: 40, science: 10 },
        populations: { researchers: 15, clinicians: 20, patients: 25, citizens: 30, policymakers: 20, 'global-south': 50 },
        continents: ['africa', 'south-america'],
        chain: { pub: true, clinic: true, society: true },
        feedback: {
          icon: '🌍',
          title: 'Science crosses borders!',
          text: 'By translating and actively targeting actors in the Global South, you transform your research into a tool for reducing inequalities. A clinician in Dakar can now access your results, apply them, and discuss them with their patients.',
          lesson: '✅ Reaching the Global South is both a scientific AND a political act.',
        },
      },
      {
        id: 'collaborative',
        icon: '🤝',
        title: 'South-North collaboration from the start',
        desc: 'You onboard co-authors from the South, include multi-continent data, and publish under co-leadership.',
        tags: [{ t: '+Robust Science', k: 'good' }, { t: '+Equity', k: 'good' }, { t: '+Legitimacy', k: 'good' }],
        delta: { reach: 35, equity: 50, science: 30 },
        populations: { researchers: 30, clinicians: 30, patients: 35, citizens: 30, policymakers: 30, 'global-south': 70 },
        continents: ['africa', 'south-america', 'asia', 'oceania'],
        chain: { pub: true, clinic: true, society: true },
        feedback: {
          icon: '🤝',
          title: 'Global research at its finest!',
          text: 'By integrating partners from the South right from the design phase, your research is not only fairer — it is also scientifically more robust. Multi-continent data, decolonial perspectives, generalizable results. This is 21st-century science.',
          lesson: '🌟 South-North collaboration improves both equity AND scientific quality.',
        },
      },
    ],
  },
];

// ─── RÉSULTATS FINAUX ───────────────────────────
function getResult() {
  const total = state.scores.reach + state.scores.equity + state.scores.science;
  if (total >= 300) {
    return {
      icon: '🌍',
      title: 'Dissemination Champion!',
      subtitle: 'Your research traveled the world, reached all populations, and changed practices. You understood that science only has an impact if it circulates.',
      lesson: '🏆 You made every step an active choice to maximize the real impact of research. Dissemination ≠ just publishing — that is your philosophy.',
    };
  } else if (total >= 180) {
    return {
      icon: '📡',
      title: 'Good dissemination, some blind spots',
      subtitle: 'You made good choices, but some populations were left in the dark. Partial dissemination remains an inequality.',
      lesson: '📡 You master the basics of scientific dissemination. To go further: think about non-academic audiences and the Global South right from the start of your research.',
    };
  } else if (total >= 100) {
    return {
      icon: '🔒',
      title: 'Science stayed in its tower',
      subtitle: 'Your results are scientifically solid, but their real impact remained very limited. Many of those who needed it most never found out.',
      lesson: '⚠️ Publishing alone is not enough. Accessibility is a choice — often active, often costly, always necessary.',
    };
  } else {
    return {
      icon: '🧱',
      title: 'Minimal impact',
      subtitle: 'Your research exists, but it remained invisible. Even good results have no impact if they do not circulate.',
      lesson: '❌ The impact of research depends almost as much on its dissemination as on its intrinsic quality.',
    };
  }
}

// ─── FONCTIONS UTILITAIRES ──────────────────────
function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val));
}

function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function animateScore(id, newVal) {
  const el = document.getElementById(id);
  const start = parseInt(el.textContent) || 0;
  const end = newVal;
  const dur = 600;
  const t0 = Date.now();
  function tick() {
    const p = Math.min(1, (Date.now() - t0) / dur);
    el.textContent = Math.round(start + (end - start) * p);
    if (p < 1) requestAnimationFrame(tick);
  }
  tick();
}

// ─── MAP ────────────────────────────────────────
const continentPos = {
  europe:          { cx: 420, cy: 145 },
  'north-america': { cx: 210, cy: 145 },
  'south-america': { cx: 220, cy: 280 },
  africa:          { cx: 420, cy: 270 },
  asia:            { cx: 590, cy: 160 },
  oceania:         { cx: 660, cy: 295 },
};

function updateMap(newContinents) {
  const linesG = document.getElementById('diffusion-lines');
  const dotsG = document.getElementById('diffusion-dots');
  linesG.innerHTML = '';
  dotsG.innerHTML = '';

  newContinents.forEach(key => {
    state.continents[key] = true;
  });

  const activeKeys = Object.keys(state.continents).filter(k => state.continents[k]);
  const source = continentPos['europe'];

  // Reset all image opacities and border classes first
  Object.keys(continentPos).forEach(k => {
    const img = document.getElementById('c-' + k);
    const border = document.getElementById('c-' + k + '-border');
    if (img) {
      img.style.opacity = state.continents[k] ? '1' : '0.25';
    }
    if (border) {
      border.classList.remove('lit', 'partial');
      if (state.continents[k]) {
        border.classList.add('lit');
      } else {
        border.classList.add('partial');
      }
    }
  });

  activeKeys.forEach(key => {
    const pos = continentPos[key];

    // Draw lines from Europe to other active continents
    if (key !== 'europe' && source) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', source.cx);
      line.setAttribute('y1', source.cy);
      line.setAttribute('x2', pos.cx);
      line.setAttribute('y2', pos.cy);
      line.classList.add('diff-line');
      linesG.appendChild(line);
    }

    // Pulse dot
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.cx);
    circle.setAttribute('cy', pos.cy);
    circle.setAttribute('r', 5);
    circle.classList.add('diff-dot');
    dotsG.appendChild(circle);
  });
}

// ─── POPULATIONS ────────────────────────────────
function updatePopulations(delta) {
  Object.keys(delta).forEach(key => {
    state.populations[key] = clamp(state.populations[key] + delta[key]);
    const fill = document.querySelector(`#pop-${key} .pop-fill`);
    const card = document.getElementById(`pop-${key}`);
    if (fill) fill.style.width = state.populations[key] + '%';
    if (card) {
      if (state.populations[key] > 0) card.classList.add('active');
    }
  });
}

// ─── CHAIN ──────────────────────────────────────
function updateChain(chainState) {
  Object.keys(chainState).forEach(key => {
    if (chainState[key]) state.chainState[key] = true;
  });

  const mapping = {
    pub: { node: 'chain-pub', arrow: 'arrow-1' },
    clinic: { node: 'chain-clinic', arrow: 'arrow-2' },
    society: { node: 'chain-society', arrow: 'arrow-3' },
  };

  Object.keys(mapping).forEach(key => {
    const { node, arrow } = mapping[key];
    const nEl = document.getElementById(node);
    const aEl = document.getElementById(arrow);
    if (state.chainState[key]) {
      nEl.classList.add('active');
      nEl.classList.remove('blocked');
      aEl.classList.add('active');
      aEl.classList.remove('blocked');
    } else {
      nEl.classList.add('blocked');
      aEl.classList.add('blocked');
    }
  });
}

// ─── RENDER STEP ────────────────────────────────
function renderStep() {
  const step = steps[state.step];
  if (!step) { showResult(); return; }

  // Header
  document.getElementById('step-label').textContent = step.stepLabel;

  // Context card
  document.getElementById('context-step').textContent = `◆ ${step.id.toUpperCase()}`;
  document.getElementById('context-title').textContent = step.title;
  document.getElementById('context-text').textContent = step.text;
  document.getElementById('jean-mi-bubble').textContent = step.jeanjmi;

  // Choices
  const container = document.getElementById('choices-container');
  container.innerHTML = '';
  step.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `
      <div class="choice-title">
        <span class="choice-icon">${choice.icon}</span>
        ${choice.title}
      </div>
      <div class="choice-desc">${choice.desc}</div>
      <div class="choice-tags">
        ${choice.tags.map(t => `<span class="choice-tag tag-${t.k}">${t.t}</span>`).join('')}
      </div>
    `;
    btn.onclick = () => makeChoice(choice);
    container.appendChild(btn);
  });

  // Reset overlay
  const overlay = document.getElementById('feedback-overlay');
  overlay.classList.remove('active');
}

// ─── MAKE CHOICE ─────────────────────────────────
function makeChoice(choice) {
  // Save snapshot before applying this choice (for undo)
  const snapBefore = snapshotState();

  // Disable all buttons
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

  // Apply deltas
  state.scores.reach = clamp(state.scores.reach + choice.delta.reach, 0, 200);
  state.scores.equity = clamp(state.scores.equity + choice.delta.equity, 0, 200);
  state.scores.science = clamp(state.scores.science + choice.delta.science, 0, 200);

  animateScore('score-reach', state.scores.reach);
  animateScore('score-equity', state.scores.equity);
  animateScore('score-science', state.scores.science);

  updatePopulations(choice.populations);
  updateMap(choice.continents);
  updateChain(choice.chain);

  state.choices.push(choice.id);

  // Show feedback
  showFeedback(choice);

  state.history.push(snapBefore);
}

// ─── SHOW FEEDBACK ───────────────────────────────
function showFeedback(choice) {
  const overlay = document.getElementById('feedback-overlay');
  document.getElementById('feedback-icon').textContent = choice.feedback.icon;
  document.getElementById('feedback-title').textContent = choice.feedback.title;
  document.getElementById('feedback-text').textContent = choice.feedback.text;

  // Score display
  const scoresEl = document.getElementById('feedback-scores');
  scoresEl.innerHTML = '';
  const deltas = choice.delta;
  const scoreLabels = {
    reach: { icon: '🌍', name: 'Portée' },
    equity: { icon: '⚖️', name: 'Équité' },
    science: { icon: '🔬', name: 'Science' },
  };
  Object.keys(deltas).forEach(key => {
    const val = deltas[key];
    if (val === 0) return;
    const cls = val > 0 ? 'pos' : val < 0 ? 'neg' : 'neu';
    const sign = val > 0 ? '+' : '';
    const { icon, name } = scoreLabels[key];
    const el = document.createElement('div');
    el.className = `fscore ${cls}`;
    el.innerHTML = `${icon} ${name} ${sign}${val}`;
    scoresEl.appendChild(el);
  });

  const nextBtn = document.getElementById('btn-next');
  nextBtn.textContent = state.step < steps.length - 1 ? 'Continuer →' : 'Voir les résultats →';

  // Show/hide back button
  const backBtn = document.getElementById('btn-back');
  if (backBtn) backBtn.style.display = state.history.length > 0 ? 'inline-block' : 'none';

  overlay.classList.add('active');
}

// ─── GO BACK ─────────────────────────────────────
function goBack() {
  if (state.history.length === 0) return;

  const snap = state.history.pop();
  restoreState(snap);

  // IMPORTANT : on revient à l'étape précédente
  state.step = Math.max(0, state.step - 1);

  rebuildVisuals();

  document.getElementById('feedback-overlay').classList.remove('active');

  setTimeout(renderStep, 150);
}

function rebuildVisuals() {
  // Reset all visuals to zero
  Object.keys(state.populations).forEach(k => {
    const fill = document.querySelector(`#pop-${k} .pop-fill`);
    const card = document.getElementById(`pop-${k}`);
    if (fill) fill.style.width = state.populations[k] + '%';
    if (card) state.populations[k] > 0 ? card.classList.add('active') : card.classList.remove('active');
  });

  // Scores
  animateScore('score-reach',   state.scores.reach);
  animateScore('score-equity',  state.scores.equity);
  animateScore('score-science', state.scores.science);

  // Map — rebuild from continents state
  document.getElementById('diffusion-lines').innerHTML = '';
  document.getElementById('diffusion-dots').innerHTML = '';
  updateMap([]);  // redraws fully from current state.continents

  // Chain
  ['chain-pub', 'chain-clinic', 'chain-society'].forEach(id => {
    document.getElementById(id).classList.remove('active', 'blocked');
  });
  ['arrow-1', 'arrow-2', 'arrow-3'].forEach(id => {
    document.getElementById(id).classList.remove('active', 'blocked');
  });
  const mapping = {
    pub:     { node: 'chain-pub',     arrow: 'arrow-1' },
    clinic:  { node: 'chain-clinic',  arrow: 'arrow-2' },
    society: { node: 'chain-society', arrow: 'arrow-3' },
  };
  Object.keys(mapping).forEach(key => {
    const { node, arrow } = mapping[key];
    if (state.chainState[key]) {
      document.getElementById(node).classList.add('active');
      document.getElementById(arrow).classList.add('active');
    }
  });
}

// ─── NEXT STEP ───────────────────────────────────
function nextStep() {
  const overlay = document.getElementById('feedback-overlay');
  overlay.classList.remove('active');

  state.step++;
  if (state.step >= steps.length) {
    setTimeout(showResult, 300);
    return;
  }
  setTimeout(renderStep, 200);
}

// ─── SHOW RESULT ─────────────────────────────────
function showResult() {
  const gameScreen = document.getElementById('screen-game');
  gameScreen.classList.remove('active');
  gameScreen.style.display = 'none';

  // Also hide the feedback overlay in case it's still open
  document.getElementById('feedback-overlay').classList.remove('active');

  const screen = document.getElementById('screen-result');
  screen.style.display = 'flex';
  screen.classList.add('active');

  const result = getResult();
  document.getElementById('result-icon').textContent = result.icon;
  document.getElementById('result-title').textContent = result.title;
  document.getElementById('result-subtitle').textContent = result.subtitle;
  document.getElementById('lesson-box').innerHTML = result.lesson;

  // Animate bars
  setTimeout(() => {
    const maxScore = 200;
    const rPct = Math.min(100, (state.scores.reach / maxScore) * 100);
    const ePct = Math.min(100, (state.scores.equity / maxScore) * 100);
    const sPct = Math.min(100, (state.scores.science / maxScore) * 100);

    document.getElementById('r-reach-bar').style.width = rPct + '%';
    document.getElementById('r-equity-bar').style.width = ePct + '%';
    document.getElementById('r-science-bar').style.width = sPct + '%';

    document.getElementById('r-reach-val').textContent = state.scores.reach + ' pts';
    document.getElementById('r-equity-val').textContent = state.scores.equity + ' pts';
    document.getElementById('r-science-val').textContent = state.scores.science + ' pts';
  }, 300);
}

// ─── START / RESTART ─────────────────────────────
function startGame() {
  document.getElementById('screen-intro').classList.remove('active');
  document.getElementById('screen-intro').style.display = 'none';
  const gameScreen = document.getElementById('screen-game');
  gameScreen.classList.add('active');
  gameScreen.style.display = 'flex';
  renderStep();
}

function restartGame() {
  // Reset state
  state.step = 0;
  state.scores = { reach: 0, equity: 0, science: 0 };
  state.populations = {
    researchers: 0, clinicians: 0, patients: 0,
    citizens: 0, policymakers: 0, 'global-south': 0,
  };
  state.continents = {
    europe: false, 'north-america': false, 'south-america': false,
    africa: false, asia: false, oceania: false,
  };
  state.chainState = { pub: false, clinic: false, society: false };
  state.choices = [];
  state.history = [];

  // Reset UI
  animateScore('score-reach', 0);
  animateScore('score-equity', 0);
  animateScore('score-science', 0);

  // Reset populations
  Object.keys(state.populations).forEach(k => {
    const fill = document.querySelector(`#pop-${k} .pop-fill`);
    const card = document.getElementById(`pop-${k}`);
    if (fill) fill.style.width = '0%';
    if (card) card.classList.remove('active');
  });

  // Reset map
  Object.keys(continentPos).forEach(k => {
    const img = document.getElementById('c-' + k);
    const border = document.getElementById('c-' + k + '-border');
    if (img) img.style.opacity = '0.25';
    if (border) { border.classList.remove('lit', 'partial'); }
  });
  document.getElementById('diffusion-lines').innerHTML = '';
  document.getElementById('diffusion-dots').innerHTML = '';

  // Reset chain
  ['chain-pub', 'chain-clinic', 'chain-society'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('active', 'blocked');
  });
  ['arrow-1', 'arrow-2', 'arrow-3'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('active', 'blocked');
  });

  // Switch screens
  document.getElementById('screen-result').classList.remove('active');
  document.getElementById('screen-result').style.display = 'none';
  const gameScreen = document.getElementById('screen-game');
  gameScreen.classList.add('active');
  gameScreen.style.display = 'flex';

  renderStep();
}