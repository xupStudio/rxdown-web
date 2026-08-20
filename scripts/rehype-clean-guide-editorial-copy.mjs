const editorialNotice =
  /Editorial status|Replacement draft|Redaktioneller Status|Ersatzentwurf|Estado editorial|Borrador (?:de )?sustituci[oó]n|Statut éditorial|(?:Projet|Version) de remplacement|Status editorial|Draf pengganti|編集状況|編集ステータス|編集状態|差し替え原稿|置き換える草稿|편집 상태|기존 RxDown URL.*대체|Rascunho de substituição|編輯狀態|(?:用於)?取代.*草稿|替換稿/i;

const replacements = [
  [/Use in this draft:/g, 'Use in this article:'],
  [/This draft prioritizes/g, 'This article prioritizes'],
  [/How it is used in this draft/g, 'How it is used in this article'],
  [/Specialist review and prominent emergency design are mandatory before publication\./g, 'Suspected pump failure requires urgent specialist assessment.'],
  [/Product labeling and current disease-specific guidelines must be checked before publication\./g, 'Product labeling and current disease-specific guidelines should be checked before making treatment changes.'],
  [/before publication or use/g, 'before use'],
  [/before publication or any formulation advice/g, 'before any formulation advice'],
  [/Fachärztliche Prüfung und ein deutliches Notfalldesign sind vor der Veröffentlichung verpflichtend\./g, 'Bei Verdacht auf Pumpenversagen oder schweren Symptomen ist eine sofortige fachärztliche Notfallbeurteilung erforderlich.'],
  [/Vor der Veröffentlichung müssen Fachinformation und aktuelle krankheitsspezifische Leitlinien geprüft werden\./g, 'Vor einer Therapieänderung müssen Fachinformation und aktuelle krankheitsspezifische Leitlinien geprüft werden.'],
  [/Dieser Entwurf priorisiert/g, 'Dieser Artikel priorisiert'],
  [/Verwendung in diesem Entwurf/g, 'Verwendung in diesem Artikel'],
  [/vor der Veröffentlichung oder Verwendung/g, 'vor der Verwendung'],
  [/vor der Veröffentlichung oder Beratung zu Darreichungsformen/g, 'vor einer Beratung zu Darreichungsformen'],
  [/Antes de publicar son obligatorios la revisión especializada y un diseño de emergencia destacado\./g, 'Si se sospecha un fallo de la bomba o hay síntomas graves, se requiere una evaluación urgente por un especialista.'],
  [/Antes de publicar deben comprobarse la ficha del producto y las guías actuales específicas de la enfermedad\./g, 'Antes de modificar el tratamiento deben comprobarse la ficha del producto y las guías actuales específicas de la enfermedad.'],
  [/Verifique etiqueta, fabricante, concentración, sistema de liberación y vía clínica local antes de publicar o usar\./g, 'Antes de usar esta información, verifique la etiqueta, el fabricante, la concentración, el sistema de liberación y la vía clínica local.'],
  [/Este borrador prioriza/g, 'Este artículo prioriza'],
  [/Uso en este borrador/g, 'Uso en este artículo'],
  [/Antes de publicar o utilizar la información,/g, 'Antes de utilizar esta información,'],
  [/antes de publicar o de asesorar sobre la formulación/g, 'antes de asesorar sobre la formulación'],
  [/antes de publicar o dar cualquier consejo sobre la formulación/g, 'antes de dar cualquier consejo sobre la formulación'],
  [/Une révision spécialisée et une présentation d’urgence très visible sont obligatoires avant publication\./g, 'En cas de suspicion de défaillance de pompe ou de symptômes graves, une évaluation spécialisée urgente est nécessaire.'],
  [/La notice du produit et les recommandations actuelles propres à la maladie doivent être vérifiées avant publication\./g, 'La notice du produit et les recommandations actuelles propres à la maladie doivent être vérifiées avant toute modification du traitement.'],
  [/Vérifier notice, fabricant, dosage, système de libération et parcours local avant publication ou usage\./g, 'Avant toute utilisation, vérifier la notice, le fabricant, le dosage, le système de libération et le parcours de soins local.'],
  [/Ce projet d’article privilégie/g, 'Cet article privilégie'],
  [/Ce projet privilégie/g, 'Cet article privilégie'],
  [/Utilisation dans ce projet/g, 'Utilisation dans cet article'],
  [/Avant publication ou utilisation,/g, 'Avant toute utilisation,'],
  [/avant publication ou tout conseil de formulation/g, 'avant tout conseil de formulation'],
  [/avant publication ou tout conseil relatif à la formulation/g, 'avant tout conseil relatif à la formulation'],
  [/Label produk dan literatur kasus menetapkan keadaan darurat, tetapi gejala dapat berkembang cepat dan tidak spesifik\. Tidak ada situs web atau algoritme gejala yang dapat menyingkirkan kegagalan pompa secara aman\. Tinjauan spesialis dan desain informasi darurat yang menonjol wajib dilakukan sebelum publikasi\./g, 'Jika diduga terjadi kegagalan pompa atau muncul gejala berat, diperlukan penilaian darurat segera oleh spesialis.'],
  [/Label produk dan pedoman terkini yang khusus untuk penyakit harus diperiksa sebelum publikasi\./g, 'Label produk dan pedoman terkini yang khusus untuk penyakit harus diperiksa sebelum perubahan pengobatan dibuat.'],
  [/Verifikasi label produk, produsen, kekuatan, sistem pelepasan, dan jalur klinis lokal sebelum publikasi atau penggunaan\./g, 'Sebelum menggunakan informasi ini, verifikasi label produk, produsen, kekuatan, sistem pelepasan, dan jalur klinis lokal.'],
  [/Draf ini memprioritaskan/g, 'Artikel ini memprioritaskan'],
  [/Cara digunakan dalam draf ini/g, 'Cara digunakan dalam artikel ini'],
  [/Sebelum publikasi atau penggunaan,/g, 'Sebelum penggunaan,'],
  [/sebelum publikasi atau saran formulasi/g, 'sebelum saran formulasi'],
  [/sebelum publikasi atau pemberian saran tentang formulasi/g, 'sebelum memberikan saran tentang formulasi'],
  [/製品表示と症例文献は緊急性を示していますが、症状は急速に進行し、非特異的です。ウェブサイトや症状アルゴリズムでポンプ故障を安全に除外することはできません。公開前に専門家レビューと目立つ緊急表示が必須です。/g, 'ポンプ故障が疑われる場合や重い症状がある場合は、直ちに専門家による緊急評価が必要です。'],
  [/公開前に製品表示と最新の疾患別ガイドラインを確認する必要があります。/g, '治療を変更する前に、製品表示と最新の疾患別ガイドラインを確認する必要があります。'],
  [/この草稿では/g, 'この記事では'],
  [/本草稿での使用方法/g, '本記事での使用方法'],
  [/公開または使用前に、/g, '使用前に、'],
  [/公開前または剤形に関する助言の前/g, '剤形に関する助言の前'],
  [/제품 설명서와 증례 문헌은 응급 위험을 확립하지만 증상은 빠르게 진행할 수 있고 비특이적입니다\. 어떤 웹사이트나 증상 알고리즘도 펌프 고장을 안전하게 배제할 수 없습니다\. 게시 전 전문의 검토와 눈에 띄는 응급 정보 설계가 필수입니다\./g, '펌프 고장이 의심되거나 심각한 증상이 있으면 즉시 전문의의 응급 평가가 필요합니다.'],
  [/게시 전에 제품 라벨과 최신 질환별 지침을 확인해야 합니다\./g, '치료를 변경하기 전에 제품 라벨과 최신 질환별 지침을 확인해야 합니다.'],
  [/체계적 문헌고찰은 소아 감량 연구의 큰 공백을 확인합니다\. 하나의 최적 속도를 정하거나 특정 제형 조작이 정확하다고 입증하거나 개인이 언제 치료 이득을 더 이상 얻지 못하는지 결정할 수는 없습니다\. 게시 전 최신 전문의 검토와 관할권별 보호 문구가 필요합니다\./g, '소아의 치료 변경은 최신 전문의 검토와 현지 규정을 고려한 개별 평가가 필요합니다.'],
  [/이 초안은/g, '이 글은'],
  [/이 초안에서의 활용 방식/g, '이 글에서의 활용 방식'],
  [/게시 또는 사용 전/g, '사용 전'],
  [/게시 전 또는 제형 관련 조언 전/g, '제형 관련 조언 전'],
  [/O resumo das características do medicamento e a literatura de casos estabelecem a emergência, mas os sintomas podem evoluir rapidamente e são inespecíficos\. Nenhum site ou algoritmo de sintomas pode excluir com segurança uma falha da bomba\. A revisão especializada e um desenho de emergência bem destacado são obrigatórios antes da publicação\./g, 'Em caso de suspeita de falha da bomba ou de sintomas graves, é necessária uma avaliação urgente por especialista.'],
  [/A informação do produto e as orientações atuais específicas da doença devem ser verificadas antes da publicação\./g, 'A informação do produto e as orientações atuais específicas da doença devem ser verificadas antes de alterar o tratamento.'],
  [/Verificar rótulo, fabricante, dosagem, sistema de libertação e percurso clínico local antes de publicar ou usar\./g, 'Antes de utilizar estas informações, verifique o rótulo, o fabricante, a dosagem, o sistema de libertação e o percurso clínico local.'],
  [/Este rascunho dá prioridade/g, 'Este artigo dá prioridade'],
  [/Utilização neste rascunho/g, 'Utilização neste artigo'],
  [/Antes da publicação ou utilização,/g, 'Antes de utilizar estas informações,'],
  [/antes da publicação ou de qualquer aconselhamento sobre formulação/g, 'antes de qualquer aconselhamento sobre formulação'],
  [/antes da publicação ou de qualquer conselho sobre a formulação/g, 'antes de dar qualquer conselho sobre a formulação'],
  [/本草稿優先/g, '本文優先'],
  [/本草稿如何使用/g, '本文如何使用'],
  [/發布或使用前，/g, '使用前，'],
  [/發布前或提供任何劑型建議前/g, '提供任何劑型建議前'],
  [/產品標示與病例文獻確立了此緊急風險，但症狀可能快速演變且不具特異性。任何網站或症狀演算法都無法安全排除幫浦故障。發布前必須由專科人員審查，並採用醒目的緊急資訊設計。/g, '若懷疑幫浦故障或出現嚴重症狀，請立即接受專科緊急評估。'],
  [/發布前必須查核產品標示及目前針對特定疾病的指引。/g, '在變更治療前，應查核產品標示及目前針對特定疾病的指引。'],
  [/系統性回顧證據指出兒科減藥研究存在重大缺口。它無法界定一種最佳速度、證明某種劑型操作精確，或判定個別患者何時已不再受益於治療。發布前需要現行專科審查及符合司法管轄區的保護措辭。/g, '兒童治療若要調整，應由熟悉當地規範的兒科專科團隊進行個別評估。'],
];

function plainText(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(plainText).join('');
}

function replaceInternalCopy(value) {
  return replacements.reduce((text, [from, to]) => text.replace(from, to), value);
}

function isEditorialNotice(node) {
  return node.type === 'element' && node.tagName === 'blockquote' && editorialNotice.test(plainText(node));
}

function isSuggestedLinks(node) {
  return node.type === 'element' && node.tagName === 'p' && plainText(node).trim().startsWith('Suggested internal links:');
}

function isInternalEditorialComment(node) {
  if (node.type !== 'comment' && node.type !== 'raw') return false;
  const value = node.value.trim().replace(/^<!--\s?/, '').replace(/\s?-->$/, '').trim();
  return /^(?:EDITORIAL IMPLEMENTATION NOTES|Suggested URL:|Preserve canonical URL:|Search record:)/i.test(value);
}

// The source library retains editorial provenance; only reader-facing copy is cleaned.
export default function rehypeCleanGuideEditorialCopy() {
  return (tree) => {
    const clean = (node) => {
      if (node.type === 'text') {
        node.value = replaceInternalCopy(node.value);
        return;
      }
      if (!node.children) return;

      let afterHeading = false;
      for (let index = 0; index < node.children.length; index += 1) {
        const child = node.children[index];
        if (child.type === 'text' && !child.value.trim()) {
          clean(child);
          continue;
        }
        if (afterHeading && isEditorialNotice(child)) {
          node.children.splice(index, 1);
          index -= 1;
          afterHeading = false;
          continue;
        }
        if (isInternalEditorialComment(child)) {
          node.children.splice(index, 1);
          index -= 1;
          continue;
        }
        if (isSuggestedLinks(child)) {
          node.children.splice(index, 1);
          index -= 1;
          continue;
        }

        clean(child);
        afterHeading = child.type === 'element' && child.tagName === 'h1';
      }
    };

    clean(tree);
  };
}
