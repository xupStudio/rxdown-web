export const GUIDE_HUBS = [
  'Start Here & Tapering Fundamentals',
  'Antidepressants',
  'Benzodiazepines',
  'Sleep Medications',
  'Sleep & CBT-I',
  'Other Medications',
  'Symptoms & Recovery',
  'Practical Tapering Tools',
  'Research & Emerging Evidence',
];

export const GUIDE_HUB_IDS = {
  'Start Here & Tapering Fundamentals': 'start-here',
  Antidepressants: 'antidepressants',
  Benzodiazepines: 'benzodiazepines',
  'Sleep Medications': 'sleep-medications',
  'Sleep & CBT-I': 'sleep-cbti',
  'Other Medications': 'other-medications',
  'Symptoms & Recovery': 'symptoms-recovery',
  'Practical Tapering Tools': 'practical-tools',
  'Research & Emerging Evidence': 'research',
};

const hubAliases = {
  'Start Here & Tapering Fundamentals': [
    '從這裡開始與減藥基礎',
    'はじめに・減薬の基礎',
    '시작하기 및 감량 기초',
    'Einstieg und Grundlagen des Ausschleichens',
    'Primeros pasos y fundamentos de la reducción gradual',
    'Premiers pas et principes de la réduction',
    'Mulai di Sini dan Dasar Penurunan Dosis',
    'Começar aqui e fundamentos da redução',
  ],
  Antidepressants: [
    '抗憂鬱劑',
    '抗うつ薬',
    '항우울제',
    'Antidepressiva',
    'Antidepresivos',
    'Antidépresseurs',
    'Antidepresan',
  ],
  Benzodiazepines: [
    'benzodiazepines',
    'Benzodiazepine',
    'Benzodiazepinas',
    'Benzodiazépines',
  ],
  'Sleep Medications': [
    '睡眠藥物',
    '睡眠薬',
    '수면제',
    'Schlafmedikamente',
    'Medicamentos para dormir',
    'Médicaments du sommeil',
    'Obat Tidur',
    'Medicamentos para o sono',
  ],
  'Sleep & CBT-I': [
    '睡眠與 CBT-I',
    '睡眠とCBT-I',
    '수면과 CBT-I',
    'Schlaf und CBT-I',
    'sueño y CBT-I',
    'sommeil et CBT-I',
    'tidur dan CBT-I',
    'sono e CBT-I',
  ],
  'Other Medications': [
    '其他藥物',
    'その他の薬',
    '기타 약물',
    'Andere Medikamente',
    'Otros medicamentos',
    'Autres médicaments',
    'Obat Lain',
    'Outros medicamentos',
  ],
  'Symptoms & Recovery': [
    '症狀與復原',
    '症状と回復',
    '증상 및 회복',
    'Symptome und Erholung',
    'Síntomas y recuperación',
    'Symptômes et rétablissement',
    'Gejala dan Pemulihan',
    'Sintomas e recuperação',
  ],
  'Practical Tapering Tools': [
    '實用減藥工具',
    '実践的な減薬ツール',
    '실용적인 감량 도구',
    'Praktische Hilfen zum Ausschleichen',
    'Herramientas prácticas de reducción gradual',
    'Outils pratiques de réduction progressive',
    'Alat Praktis Penurunan Dosis',
    'Ferramentas práticas de redução gradual',
  ],
  'Research & Emerging Evidence': [
    '研究與新興證據',
    '研究と新たなエビデンス',
    '연구 및 최신 근거',
    'Forschung und neue Evidenz',
    'Investigación y evidencia emergente',
    'Recherche et données émergentes',
    'Riset dan Bukti Baru',
    'Investigação e evidência emergente',
  ],
};

const hubByNormalizedName = new Map(
  Object.entries(hubAliases).flatMap(([hub, aliases]) =>
    [hub, ...aliases].map((name) => [name.trim().toLocaleLowerCase(), hub])
  )
);

const legacyGuideHubs = {
  'antidepressant-withdrawal-timeline': 'Antidepressants',
  'benzodiazepines-z-drugs-doras-compared': 'Sleep Medications',
  'brain-zaps': 'Symptoms & Recovery',
  'discontinuation-vs-relapse': 'Antidepressants',
  'dora-sleep-medications-discontinuation': 'Sleep Medications',
  'hyperbolic-tapering-guide': 'Start Here & Tapering Fundamentals',
  'receptor-occupancy-explained': 'Research & Emerging Evidence',
  'sleeping-pills-vs-sedatives': 'Sleep Medications',
  'talking-to-your-doctor-deprescribing': 'Practical Tapering Tools',
  'when-and-how-to-taper': 'Start Here & Tapering Fundamentals',
  'windows-and-waves-recovery': 'Symptoms & Recovery',
  'z-drugs-dependence-reduction': 'Sleep Medications',
};

const priorityWeight = {
  P0: 0,
  P1: 1,
  Cancer: 2,
  P2: 3,
  Research: 4,
  P3: 5,
};

export function guideHub(guide) {
  const supplied = guide.entry.data.content_hub;
  if (typeof supplied === 'string') {
    const normalized = hubByNormalizedName.get(supplied.trim().toLowerCase());
    if (normalized) return normalized;
  }
  return legacyGuideHubs[guide.slug] ?? 'Start Here & Tapering Fundamentals';
}

export function guideSort(a, b, locale = 'en') {
  const aWeight = priorityWeight[a.entry.data.priority] ?? Number.MAX_SAFE_INTEGER;
  const bWeight = priorityWeight[b.entry.data.priority] ?? Number.MAX_SAFE_INTEGER;
  if (aWeight !== bWeight) return aWeight - bWeight;
  return a.entry.data.title.localeCompare(b.entry.data.title, locale, { sensitivity: 'base' });
}

export function guideGroups(guides, locale = 'en') {
  return GUIDE_HUBS.map((hub) => ({
    hub,
    id: GUIDE_HUB_IDS[hub],
    guides: guides.filter((guide) => guideHub(guide) === hub).sort((a, b) => guideSort(a, b, locale)),
  }));
}

function comparableTerms(guide) {
  const data = guide.entry.data;
  return new Set(
    [data.medication_class, ...(data.tags ?? [])]
      .filter((value) => typeof value === 'string')
      .map((value) => value.trim().toLocaleLowerCase())
  );
}

export function relatedGuides(current, candidates, limit = 3, locale = 'en') {
  const currentTerms = comparableTerms(current);
  const score = (candidate) => {
    let value = guideHub(candidate) === guideHub(current) ? 6 : 0;
    for (const term of comparableTerms(candidate)) {
      if (currentTerms.has(term)) value += 4;
    }
    return value;
  };

  return candidates
    .filter((candidate) => candidate.slug !== current.slug)
    .map((candidate) => ({ candidate, score: score(candidate) }))
    .sort((a, b) => b.score - a.score || guideSort(a.candidate, b.candidate, locale))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
