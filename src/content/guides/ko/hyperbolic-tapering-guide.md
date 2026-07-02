---
title: "쌍곡선형 감량: 비례 감량이 고정 감량을 이기는 이유"
description: "쌍곡선형 감량은 현재 용량의 일정 비율로 약을 줄여, 낮아질수록 각 감량이 작아집니다—수용체 점유율에 맞추어 금단을 완화합니다."
pubDate: 2026-07-02
tags: ["hyperbolic tapering", "deprescribing", "antidepressants", "withdrawal", "receptor occupancy"]
faq:
  - q: "쌍곡선형 감량을 간단히 말하면 무엇인가요?"
    a: "매번 같은 고정된 양이 아니라 현재 용량의 백분율만큼 약을 줄이는 것을 의미합니다. 항상 남은 것의 비율을 줄이기 때문에, 용량이 떨어질수록 절대적 감량량이 점점 더 작아집니다. 이는 뇌에 미치는 효과를 끝 무렵에 더 가혹해지는 대신 모든 단계에서 대략 균등하게 유지합니다."
  - q: "각 쌍곡선형 단계는 용량을 얼마나 줄여야 하나요?"
    a: "발표된 접근법은 흔히 가장 최근 용량의 약 10% 감량을 기술하며, 고용량에서는 더 큰 비례 감량(25~50%)을, 바닥 근처에서는 더 작은 감량을 사용하기도 합니다. 정확한 백분율과 속도는 처방의와 함께 정하고 당신이 느끼는 바에 맞춰 조정합니다. 목표는 밀리그램의 균등한 감소가 아니라 수용체 점유율의 대략 균등한 감소입니다."
  - q: "천천히 감량하려면 그냥 정제를 쪼개면 안 되나요?"
    a: "보통의 정제는 몇 밀리그램 아래로 정확하게 나누기 어렵고, 가장 작은 시판 용량도 흔히 마지막 단계에는 여전히 너무 높습니다. 처방의는 쌍곡선형 감량이 요구하는 아주 작고 정밀한 용량을 만들기 위해 액상 제형, 조제 캡슐, 또는 감량 스트립을 사용할 수 있습니다. 서방형이나 장용 코팅 제품은 약사의 조언 없이 절대 부수거나 쪼개지 마십시오."
sources:
  - label: "Horowitz MA, Taylor D. Tapering of SSRI treatment to mitigate withdrawal symptoms. Lancet Psychiatry (2019)"
    url: "https://pubmed.ncbi.nlm.nih.gov/30850328/"
  - label: "Meyer JH, et al. Serotonin Transporter Occupancy of Five SSRIs at Different Doses: A PET Study. Am J Psychiatry (2004)"
    url: "https://psychiatryonline.org/doi/full/10.1176/appi.ajp.161.5.826"
  - label: "Horowitz MA, Taylor D. The Maudsley Deprescribing Guidelines. Wiley-Blackwell (2024)"
    url: "https://onlinelibrary.wiley.com/doi/book/10.1002/9781394291052"
  - label: "Royal College of Psychiatrists. Stopping antidepressants (2020, patient resource)"
    url: "https://www.rcpsych.ac.uk/mental-health/treatments-and-wellbeing/stopping-antidepressants"
  - label: "NICE. Depression in adults: treatment and management (NG222) (2022)"
    url: "https://www.nice.org.uk/guidance/ng222"
  - label: "Groot PC, van Os J. Successful use of tapering strips for hyperbolic reduction of antidepressant dose: a cohort study. Ther Adv Psychopharmacol (2021)"
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8404667/"
  - label: "van Os J, Groot PC. Outcomes of hyperbolic tapering of antidepressants. Ther Adv Psychopharmacol (2023)"
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10185864/"
  - label: "Davies J, Read J. Incidence, severity and duration of antidepressant withdrawal effects. Addictive Behaviors (2019)"
    url: "https://doi.org/10.1016/j.addbeh.2018.08.027"
  - label: "Henssler J, et al. Incidence of antidepressant discontinuation symptoms: a systematic review and meta-analysis. Lancet Psychiatry (2024)"
    url: "https://doi.org/10.1016/S2215-0366%2824%2900133-0"
---

**TL;DR:** 쌍곡선형 감량이란 매번 같은 고정된 밀리그램 수가 아니라 *현재* 용량의 일정 비율로 약을 줄이는 것을 의미하며, 그래서 용량이 낮아질수록 각 감량의 크기가 작아집니다. 이는 약리학을 반영합니다. 뇌 수용체 점유율은 고용량을 줄일 때는 거의 변하지 않지만 바닥 근처에서는 가파르게 변하므로, 균등한 밀리그램 감량은 감량이 낮아질수록 점점 더 세게 부딪힙니다. 감량을 비례적으로 만들면 각 단계가 뇌에 미치는 효과가 대략 균등하게 유지되며, 이것이 모즐리 감약 지침과 갱신된 NICE 및 왕립정신과학회 권고가 모두 느리고 비례적이며 증상 주도적인 감량을 지지하는 이유입니다. 이는 고정 감량보다 빠르지 않으며 — 대개 더 느리지만 — 중단을 더 견딜 만하게 만들도록 설계되었습니다.

> 이 글은 교육 자료이며 의학적 조언이 아닙니다. 이는 연구 문헌의 발표된 접근법과 용량 범위를 설명하며, 무엇을 복용할지 알려주지 않습니다. 약물의 모든 변경은 처방의가 계획하고 감독해야 하며, 약물은 절대 갑자기 중단해서는 안 됩니다. 개인적 필요는 크게 다릅니다.

## 쌍곡선형 감량이란 무엇인가요?

쌍곡선형 감량은 각 단계가 고정된 밀리그램 수가 아니라 가장 최근 용량의 일정 *비율*을 제거하는 약물 감량 방식입니다. 항상 남은 것의 백분율을 줄이기 때문에, 용량이 떨어질수록 제거되는 절대량이 점진적으로 작아집니다. 그래프에 그려진 일정은 처음에 빠르게 떨어졌다가 0을 향해 길고 완만한 꼬리로 평탄해지는 곡선을 그립니다 — 수학자들이 쌍곡선형이라 부르는 형태입니다.

이 용어는 정신과 연구자 Mark Horowitz와 David Taylor가 SSRI 감량에 관한 2019년 *Lancet Psychiatry* 논문에서 대중화했습니다. 그들의 핵심 주장은 감량이 반올림된 밀리그램 수치가 아니라 약물의 *뇌에 대한 효과*를 중심으로 설계되어야 한다는 것입니다. 같은 개념은 임상의가 벤조디아제핀을 끊는 방식에 오랫동안 암묵적으로 있었으며, 2019년 연구는 항우울제에 대해 약리학적 근거를 명시하고 이후 다른 약물 계열로 확장된 틀을 제공했습니다.

실질적 결과는 쌍곡선형 감량이 낮은 끝에서 많은 작은 단계를 가진다는 것입니다. 치료 용량에서 그 절반까지 내려가는 것은 비교적 쉬울 수 있고, 작은 용량에서 0까지 내려가는 것이 대부분의 사람이 가장 미세하고 느린 단계를 필요로 하는 지점입니다.

## 왜 균등한 용량 감량이 바닥 근처에서 더 세게 부딪히나요?

그 근거는 수용체 점유율 — 주어진 용량에서 약물이 실제로 표적을 얼마나 차단하거나 결합하고 있는지 — 에서 나옵니다. SSRI의 경우 관련 표적은 세로토닌 수송체(SERT)입니다. 양전자 방출 단층촬영(PET) 연구가 이 관계를 직접 지도화했습니다. 널리 인용되는 Meyer와 동료들의 2004년 *American Journal of Psychiatry* 연구에서, 일반적 치료 용량에서 세로토닌 수송체의 약 80%가 점유되었으며, 시탈로프람 20 mg에서 약 77% 점유율이 측정되었습니다.

핵심 발견은 용량-점유율 곡선이 직선이 아니라는 것입니다. 점유율은 낮은 용량에서 가파르게 오르다가 높은 용량에서는 평평해집니다. 이는 다음을 의미합니다.

- 고용량에서 그 절반으로 줄이는 것은 점유율을 거의 움직이지 않습니다 — 곡선의 평평한 꼭대기를 따라 미끄러지고 있기 때문에 뇌가 거의 알아차리지 못합니다.
- 바닥 근처에서 같은 밀리그램 수를 줄이면 점유율이 크게 떨어집니다. 그곳에서는 곡선의 가파른 부분에 있기 때문입니다.

그래서 예를 들어 몇 주마다 5 mg씩 "꾸준한" 감량은 뇌의 관점에서 전혀 꾸준하지 않습니다. 초기 감량은 거의 아무것도 하지 않고, 같은 크기의 후기 감량은 가장 큰 약리학적 변화를 일으킵니다 — 많은 사람이 가장 심한 금단을 보고하는 바로 그때입니다. *효과*가 균등한 증분으로 변하게 하려면, *용량*을 점점 더 작은 양만큼 줄여야 합니다. 쌍곡선형 곡선입니다. 생물학에 대한 더 깊은 설명은 [수용체 점유율이 왜 중요한가](/ko/guides/receptor-occupancy-explained/)를 참고하십시오.

## 쌍곡선형 감량에서 각 단계는 얼마나 큰가요?

보편적인 단일 수치는 없지만, 발표된 접근법은 흔히 단계당 *가장 최근* 용량의 약 10%씩 줄이는 것을 기술하며, 위쪽에서는 더 큰 비례 감량을, 끝 무렵에는 더 작은 감량을 사용하기도 합니다. NICE 지침 NG222(2022)는 이를 "단계적 방식으로, 각 단계에서 이전 용량의 일정 비율(예: 이전 용량의 50%)을 처방"하고, 용량이 낮아질수록 "더 작은 감량(예: 25%)"을 사용하는 것으로 규정합니다. 모즐리 감약 지침은 이 원칙을 각 단계에서 수용체 점유율의 대략 균등한 감소를 목표로 하는 약물별 일정으로 옮깁니다.

아래 표는 산술의 예시일 뿐이며 — 용량 일정이 아닙니다 — 용량이 떨어질 때 비례 감량이 고정 감량과 왜 그토록 다르게 행동하는지 보여줍니다.

| 예시 현재 용량 | 5 mg 고정 감량(제거된 용량의 몫) | 약 10% 비례 감량(제거된 mg) |
|---|---|---|
| 40 mg | 5 mg(약 13%) | 4 mg |
| 20 mg | 5 mg(25%) | 2 mg |
| 10 mg | 5 mg(50%) | 1 mg |
| 5 mg | 5 mg(100% — 곧바로 0으로) | 0.5 mg |
| 2.5 mg | 5 mg 단계로는 불가능 | 0.25 mg |
| 1 mg | 5 mg 단계로는 불가능 | 0.1 mg |

고정 감량은 낮아질수록 남은 용량 — 그리고 수용체 점유율 — 의 점점 더 큰 *몫*을 제거하며, 결국 0으로의 갑작스러운 도약을 강요합니다. 비례 감량은 그 몫을 일정하게 유지하며, 이것이 각 단계의 뇌에 대한 영향을 대략 균등하게 유지하는 것입니다. 쌍곡선형 감량은 순수한 수학으로는 결코 0에 도달하지 않으므로, 실제 일정은 도달 가능한 가장 낮은 용량에서 정해진 마지막 작은 단계로 끝납니다.

## 단계 사이에 얼마나 기다려야 하나요?

간격은 대개 **단계당 2~4주**로 기술되지만, 속도는 달력이 아니라 증상이 주도하도록 되어 있습니다. 모즐리 감약 지침은 견딜 수 있는 정도에 따라 대략 2~4주마다 감량을 제안하며, NICE와 왕립정신과학회 모두 금단의 속도와 지속 기간을 당사자와 합의하고 그가 대처하는 방식에 맞춰 조정해야 한다고 강조합니다.

실제로 이는 다음 단계를 밟기 전에 마지막 감량으로 인한 금단증상이 가라앉을 때까지 한 용량에 머무는 것 — 그리고 단계가 너무 힘든 것으로 드러나면 멈추거나 이전 용량으로 잠시 돌아가는 것 — 을 의미합니다. 그 "유지" 전략은 실패가 아니라 감량의 정상적이고 계획된 부분입니다. [감량 중 유지와 재도입](/ko/guides/hold-and-reinstate-guide/)을 참고하십시오. 낮은 용량 단계가 가장 큰 점유율 변화를 일으키기 때문에, 많은 사람이 밀리그램 감량이 아주 작아지더라도 끝 무렵에는 간격을 늘려야 한다는 것을 알게 됩니다. 장기 약물의 전체 감량은 여러 달이 걸릴 수 있습니다.

## 누가 더 천천히 가야 하고, 누가 더 빨리 갈 수 있나요?

감량은 개인적이며, 몇 가지 요인이 신뢰성 있게 더 느린 일정 쪽으로 밀어붙입니다.

- **약물 복용 기간이 더 김.** Groot와 van Os의 2021년 감량 스트립 코호트에서, 중단 성공률은 사용 기간에 따라 떨어졌습니다 — 약을 1년 미만 복용한 사람은 약 78%인 반면 10년 이상 복용한 사람은 59%로 — 장기 사용자가 일반적으로 더 점진적인 감량을 필요로 함을 시사합니다.
- **단기 반감기, 더 높은 효력의 약물.** 파록세틴(Paxil, Seroxat)과 벤라팍신(Effexor) 같은 약물은 더 강한 중단 증상과 연관되며 대개 더 느리고 미세한 감량이 필요합니다.
- **금단 또는 실패한 시도의 병력.** van Os와 Groot의 2023년 608명 분석에서, 52.5%가 이전에 중단을 시도했다가 실패했으며, 가장 긴 감량을 필요로 한 사람들이 이전에 실패했을 가능성이 가장 높았습니다.

반대로, 체내에서 천천히 배출되면서 스스로 감량되는 플루옥세틴(Prozac) 같은 장기 반감기 약물을 복용하는 사람, 또는 짧게만 치료받은 사람은 더 빠른 감량을 견딜 수 있습니다. 솔직한 요약은 속도가 처방의와 함께 단계마다 확인하는 당신의 반응에 의해 정해지며 — 미리 고정되지 않는다는 것입니다. 이를 솔직하게 이야기하는 것이 중요합니다. [의사와 감약에 대해 대화하기](/ko/guides/talking-to-your-doctor-deprescribing/)를 참고하십시오.

## 정제가 그렇게 작게 쪼개지지 않을 때 어떻게 아주 작은 용량을 만드나요?

이것이 쌍곡선형 감량의 실질적 병목입니다. 마지막 단계는 흔히 가장 작은 시판 정제보다 훨씬 낮은 용량을 요구하며, 보통의 정제는 밀리그램의 분수로 정확하게 쪼갤 수 없습니다. 쪼개기는 서방형, 장용 코팅, 또는 캡슐 제품에는 특정 약사 지도 없이는 전혀 사용할 수 없습니다. 발표된 해법은 다음을 포함합니다.

- **액상 제형.** 많은 항우울제가 경구 용액이나 현탁액으로 나와, 경구 주사기로 정밀한 소량을 측정할 수 있게 합니다. 매우 낮은 용량에 가장 유연한 경로입니다.
- **감량 스트립.** Groot와 van Os가 개발하고 연구한 것으로, 각 봉지가 이전 것과 같거나 약간 낮은 용량을 담은 28일치 일일 봉지 두루마리이며, 미리 계획된 작은 증분으로 용량이 단계적으로 내려가게 합니다.
- **조제 용량.** 적절한 허가 제품이 존재하지 않는 경우, 조제 약국이 맞춤형 낮은 용량으로 캡슐이나 액상을 준비할 수 있습니다.

모즐리 감약 지침은 바로 이런 제형의 실질적 문제에 상당한 지면을 할애하는데, 약리학은 작은 용량을 실제로 만들 수 있어야만 작동하기 때문입니다. 정제가 충분히 낮게 내려가지 않아 감량이 "불가능하다"는 말을 들었다면, 이 접근법을 처방의와 약사에게 제기할 가치가 있습니다. [감량 계산기](/ko/calculator/)는 계획에 전념하기 전에 당신과 임상의가 낮은 끝의 단계가 어떻게 보이는지 시각화하는 데 도움이 될 수 있습니다.

## 이것이 어떻게 모즐리 감약 지침을 지탱하나요?

2024년 Wiley-Blackwell이 출판한 *The Maudsley Deprescribing Guidelines: Antidepressants, Benzodiazepines, Gabapentinoids and Z-drugs*(Horowitz와 Taylor)는 정신과 약물을 시작하는 것이 아니라 *중단하는* 것에 전념한 최초의 포괄적 전문 지침입니다. 쌍곡선형 감량이 그 조직 원리입니다. 이 책은 약리학적 논거를 펴는 에세이 — 금단과 재발의 구분, 그리고 밀리그램이 아니라 수용체 점유율로 생각하자는 주장을 포함 — 로 시작하고, 그다음 각 단계에서 대략 균등한 점유율 감소를 달성하도록 만들어진 상세한 약물별 일정을 제공합니다.

그 영향은 주류 지침 전반에 걸쳐 보입니다. NICE의 NG222는 이제 용량이 떨어질수록 더 작은 감량과 함께 이전 용량의 일정 비율만큼 단계적으로 줄이는 것을 권장하며, 왕립정신과학회의 2020년 환자 자료 "항우울제 중단하기"는 그 사람이 견딜 수 있는 것에 맞춰 점진적으로 더 작은 단계로 "몇 달 또는 그 이상"에 걸쳐 감량하라고 조언합니다. 다시 말해, 한때 주변부였던 비례적이고 점유율 기반의 감량이라는 개념이 안전한 금단의 기준 틀이 되었습니다.

## 쌍곡선형 감량의 근거는 얼마나 강한가요?

무엇이 입증되었고 무엇이 아닌지 정확히 하는 것이 가치가 있습니다. 이것이 활발한 논쟁 영역이기 때문입니다.

**약리학적 근거는 잘 확립되어 있습니다.** 쌍곡선형 용량-점유율 관계는 직접적인 PET 영상(Meyer et al., 2004)에 기반하며 심각하게 논쟁되지 않습니다. 치료 용량 SSRI를 절반으로 하는 것은 실제로 0 근처의 같은 감량보다 수용체 점유율을 훨씬 덜 변화시킵니다.

**임상 결과 데이터는 대부분 관찰적입니다.** 가장 강력한 실제 환경 뒷받침은 감량 스트립 코호트에서 나옵니다. 2,000명 이상을 모집한 세 개의 후향적 연구에 걸쳐, 중단을 시도한 사람의 약 70%가 쌍곡선형 감량 스트립을 사용해 중단할 수 있었으며(Groot와 van Os), 중앙값은 대략 두 달에 걸쳐 두 개의 28일치 스트립이었습니다. 이는 고무적이지만 관찰적입니다 — 감량 스트립을 찾은 사람들은 흔히 매우 동기가 높았고 더 빠른 방법으로 자주 실패했었습니다 — 그래서 무작위 시험에 의한 우월성의 입증이 아니라 실현 가능성을 보여줍니다.

**금단이 얼마나 흔하고 심한지는 여전히 논쟁적입니다.** 2019년 체계적 문헌고찰(Davies와 Read, *Addictive Behaviors*)은 항우울제를 끊을 때 약 56%가 금단증상을 경험하고 그중 거의 절반이 이를 심각하다고 기술한다고 보고했습니다. 이후의 메타분석(Henssler et al., *Lancet Psychiatry*, 2024)은 더 낮은 수치 — 위약과 노시보 효과를 차감하면 대략 15%, 6~7명 중 약 1명 — 를 추정하고 심한 증상이 비교적 드물다고 결론지었습니다. 둘 다 부분적으로 참일 수 있습니다. 평균은 넓은 변이를 감추며, 대부분은 아니더라도 소수는 오래되고 무력하게 만드는 금단을 경험합니다. 또한 환자 커뮤니티는 흔히 짧은 추적만 측정하는 공식 시험이 과소평가할 수 있는 지연성 증상을 일관되게 보고합니다. 이 커뮤니티 보고 패턴은 실제 신호이지만 대조 연구보다 낮은 강도의 근거입니다. 증상이 시간에 따라 대개 어떻게 전개되는지는 [항우울제 금단 타임라인](/ko/guides/antidepressant-withdrawal-timeline/)을, 둘을 구별하는 것은 [중단 vs 재발](/ko/guides/discontinuation-vs-relapse/)을 참고하십시오.

합리적 요점은 이것입니다. 쌍곡선형 감량은 더 빠른 감량으로 어려움을 겪는 사람에게 중단을 더 견딜 만하게 만드는, 생물학적으로 근거가 잘 잡히고 지침이 지지하는 전략입니다. 이는 금단에 대한 보장이 아니며, 일반적으로 더 빠른 것이 아니라 더 느립니다.

자신의 감량을 추적하고 있다면, 일기는 막연한 인상을 당신과 처방의가 행동할 수 있는 무언가로 바꿀 수 있습니다. RxDown은 용량, 증상, 수면을 매일 기록하고, 내장된 감량 계산기로 비례적(쌍곡선형) 일정을 시각화하며, 간결한 의사 보고서를 내보내어 속도에 대한 결정이 기억이 아니라 당신의 실제 데이터에 근거하게 합니다. 이는 기록 도구이며 의료 진료의 대체물이 아닙니다.

속도, 제형, 또는 증상에 대한 구체적 질문이 있나요? 우리의 [자주 묻는 질문](/ko/faq/)이 흔한 질문 중 다수를 다룹니다.

## Sources

1. [Horowitz MA, Taylor D. Tapering of SSRI treatment to mitigate withdrawal symptoms. *Lancet Psychiatry* (2019)](https://pubmed.ncbi.nlm.nih.gov/30850328/)
2. [Meyer JH, et al. Serotonin Transporter Occupancy of Five SSRIs at Different Doses: An [11C]DASB PET Study. *Am J Psychiatry* (2004)](https://psychiatryonline.org/doi/full/10.1176/appi.ajp.161.5.826)
3. [Horowitz MA, Taylor D. *The Maudsley Deprescribing Guidelines: Antidepressants, Benzodiazepines, Gabapentinoids and Z-drugs.* Wiley-Blackwell (2024)](https://onlinelibrary.wiley.com/doi/book/10.1002/9781394291052)
4. [Royal College of Psychiatrists. Stopping antidepressants — patient resource (2020)](https://www.rcpsych.ac.uk/mental-health/treatments-and-wellbeing/stopping-antidepressants)
5. [NICE. Depression in adults: treatment and management (NG222) (2022)](https://www.nice.org.uk/guidance/ng222)
6. [Groot PC, van Os J. Successful use of tapering strips for hyperbolic reduction of antidepressant dose: a cohort study. *Ther Adv Psychopharmacol* (2021)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8404667/)
7. [van Os J, Groot PC. Outcomes of hyperbolic tapering of antidepressants. *Ther Adv Psychopharmacol* (2023)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10185864/)
8. [Davies J, Read J. A systematic review into the incidence, severity and duration of antidepressant withdrawal effects. *Addictive Behaviors* (2019)](https://doi.org/10.1016/j.addbeh.2018.08.027)
9. [Henssler J, et al. Incidence of antidepressant discontinuation symptoms: a systematic review and meta-analysis. *Lancet Psychiatry* (2024)](https://doi.org/10.1016/S2215-0366%2824%2900133-0)
