import assert from 'node:assert/strict';
import test from 'node:test';

import {
  GUIDE_HUBS,
  guideGroups,
  guideHub,
  relatedGuides,
  guideSort,
} from '../src/lib/guide-catalog.js';
import { GUIDE_DIRECTORY_UI, guideHubLabel } from '../src/i18n/guide-directory.js';
import { isPublishedGuideData } from '../src/lib/guide-publication.js';

const legacyHubCases = {
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

function guide(slug, data = {}) {
  return { slug, entry: { data: { title: slug, description: slug, ...data } } };
}

test('guide publication requires either legacy metadata or an explicit published status', () => {
  assert.equal(isPublishedGuideData({}), true);
  assert.equal(isPublishedGuideData({ review_status: 'editorial draft' }), false);
  assert.equal(isPublishedGuideData({ publication_status: 'clinical-review-required' }), false);
  assert.equal(
    isPublishedGuideData({
      review_status: 'editorial draft',
      publication_status: 'published',
    }),
    true
  );
});

test('all retained legacy URLs receive the approved editorial hub', () => {
  for (const [slug, expected] of Object.entries(legacyHubCases)) {
    assert.equal(guideHub(guide(slug)), expected, slug);
  }
});

test('handoff hub names normalize case without translating or inventing a category', () => {
  assert.equal(guideHub(guide('clonazepam', { content_hub: 'benzodiazepines' })), 'Benzodiazepines');
  assert.equal(
    guideHub(guide('cbti', { content_hub: 'Sleep & CBT-I' })),
    'Sleep & CBT-I'
  );
  assert.equal(
    guideHub(guide('unknown', { content_hub: 'not-a-real-hub' })),
    'Start Here & Tapering Fundamentals'
  );
});

test('localized handoff hub names resolve to the same canonical category', () => {
  assert.equal(guideHub(guide('zh', { content_hub: '抗憂鬱劑' })), 'Antidepressants');
  assert.equal(guideHub(guide('ja', { content_hub: '睡眠とCBT-I' })), 'Sleep & CBT-I');
  assert.equal(guideHub(guide('de', { content_hub: 'Andere Medikamente' })), 'Other Medications');
  assert.equal(guideHub(guide('es', { content_hub: 'Síntomas y recuperación' })), 'Symptoms & Recovery');
  assert.equal(guideHub(guide('fr', { content_hub: 'Outils pratiques de réduction progressive' })), 'Practical Tapering Tools');
  assert.equal(guideHub(guide('id', { content_hub: 'Riset dan Bukti Baru' })), 'Research & Emerging Evidence');
  assert.equal(guideHub(guide('pt', { content_hub: 'Medicamentos para o sono' })), 'Sleep Medications');
});

test('guide groups always follow the nine-hub editorial order and retain empty hubs', () => {
  const groups = guideGroups([
    guide('research', { content_hub: 'Research & Emerging Evidence' }),
    guide('sleep', { content_hub: 'Sleep Medications' }),
  ]);
  assert.deepEqual(groups.map((group) => group.hub), GUIDE_HUBS);
  assert.deepEqual(groups.find((group) => group.hub === 'Sleep Medications').guides.map((g) => g.slug), ['sleep']);
  assert.deepEqual(groups.find((group) => group.hub === 'Antidepressants').guides, []);
});

test('all nine locales expose a label for every canonical guide category', () => {
  assert.equal(Object.keys(GUIDE_DIRECTORY_UI).length, 9);
  for (const locale of Object.keys(GUIDE_DIRECTORY_UI)) {
    for (const hub of GUIDE_HUBS) assert.ok(guideHubLabel(locale, hub), `${locale}: ${hub}`);
  }
});

test('guide ordering promotes decision-critical priorities then uses locale-aware titles', () => {
  const input = [
    guide('p3', { title: 'Zulu', priority: 'P3' }),
    guide('p1-b', { title: 'Beta', priority: 'P1' }),
    guide('research', { title: 'Alpha', priority: 'Research' }),
    guide('p0', { title: 'Omega', priority: 'P0' }),
    guide('p1-a', { title: 'Alpha', priority: 'P1' }),
  ];
  assert.deepEqual(input.sort((a, b) => guideSort(a, b, 'en')).map((g) => g.slug), [
    'p0',
    'p1-a',
    'p1-b',
    'research',
    'p3',
  ]);
});

test('related guides prefer the same category and shared medication context', () => {
  const current = guide('current', {
    content_hub: 'Antidepressants',
    medication_class: 'SSRI',
    tags: ['withdrawal'],
  });
  const candidates = [
    guide('other-hub', { content_hub: 'Sleep Medications', medication_class: 'SSRI' }),
    guide('same-hub', { content_hub: 'Antidepressants' }),
    guide('best-match', { content_hub: 'Antidepressants', medication_class: 'SSRI' }),
    current,
  ];

  assert.deepEqual(relatedGuides(current, candidates, 3).map((g) => g.slug), [
    'best-match',
    'same-hub',
    'other-hub',
  ]);
});
