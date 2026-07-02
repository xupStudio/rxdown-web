import { STRINGS, APP_STORE_URL, PLAY_STORE_URL } from '../i18n/locales.js';

/** Full-content companion to /llms.txt: the whole EN site as clean Markdown
 *  so AI agents can ingest RxDown's content without parsing HTML. */
export async function GET() {
  const t = STRINGS.en;
  const md = [];
  const push = (s) => md.push(s);

  push(`# RxDown — full site content (English)\n`);
  push(`> ${t.answerFirst}\n`);
  push(`Apps: ${APP_STORE_URL} (iOS) · ${PLAY_STORE_URL} (Android)`);
  push(`Localized site versions: /, /zh/, /ja/, /ko/, /de/, /es/, /fr/, /id/, /pt/\n`);

  push(`## ${t.how.heading}\n`);
  t.how.steps.forEach((s, i) => push(`${i + 1}. **${s.title}** — ${s.body}`));

  push(`\n## ${t.features.heading}\n`);
  t.features.cards.forEach((c) => push(`- **${c.title}**: ${c.body}`));

  push(`\n## ${t.evidence.heading}\n`);
  push(t.evidence.body1);
  push(t.evidence.body2);
  push(t.evidence.body3);
  push(`Sources: ${t.evidence.sources.join(' · ')}\n`);

  push(`## Taper calculator (https://rxdown.app/calculator/)\n`);
  push(t.calc.answerFirst);
  push(`\n### ${t.calc.methodHeading}\n`);
  push(t.calc.methodBody);
  t.calc.faq.forEach((f) => push(`\n**Q: ${f.q}**\n\nA: ${f.a}`));

  push(`\n## FAQ (https://rxdown.app/faq/)\n`);
  t.faqPage.items.forEach((f) => push(`\n**Q: ${f.q}**\n\nA: ${f.a}`));

  push(`\n## Privacy (https://rxdown.app/privacy/)\n`);
  t.privacyPage.sections.forEach((s) => push(`### ${s.h2}\n\n${s.body}\n`));

  push(`\n## Important disclaimer\n`);
  push(t.footer.disclaimer);

  return new Response(md.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
