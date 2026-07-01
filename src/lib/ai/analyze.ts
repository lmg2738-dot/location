import OpenAI from "openai";
import type { AIAnalysisResult, LocationAnalysisInput } from "@/types";

const SYSTEM_PROMPT = `너는 대한민국 상권분석 전문가이다.
아래 데이터를 기반으로 창업성공확률을 100점 만점으로 평가한다.

반드시 다음을 포함하여 JSON 형식으로 응답한다:
- score: 0-100 정수
- recommendation: "강력 추천" | "추천" | "보통" | "비추천" | "강력 비추천"
- strengths: 장점 배열 (3-5개)
- weaknesses: 단점 배열 (2-4개)
- cautions: 주의사항 배열 (2-3개)
- recommendedBusinessTypes: 추천 업종 배열 (2-3개)
- summary: 2-3문장 요약

평가 기준:
1. 경쟁업체 밀도 (적을수록 좋음, 프랜차이즈 비율 고려)
2. 유동인구 및 관광객 수
3. 임대료 대비 예상 매출
4. 상권 성장성 및 개발계획
5. 업종 적합성

객관적이고 실용적인 분석을 제공하라.`;

interface OpenRouterModel {
  id: string;
  name?: string;
  pricing?: { prompt?: string; completion?: string };
  context_length?: number;
  architecture?: { modality?: string };
}

let cachedFreeModels: string[] | null = null;
let cacheExpiresAt = 0;
const blockedModels = new Set<string>();

const CACHE_TTL_MS = 60 * 60 * 1000;

function isFreeModel(model: OpenRouterModel): boolean {
  const prompt = parseFloat(model.pricing?.prompt ?? "1");
  const completion = parseFloat(model.pricing?.completion ?? "1");
  return prompt === 0 && completion === 0;
}

function isChatModel(model: OpenRouterModel): boolean {
  const modality = model.architecture?.modality ?? "text->text";
  return modality.includes("text");
}

async function fetchFreeModels(apiKey: string): Promise<string[]> {
  const now = Date.now();
  if (cachedFreeModels && now < cacheExpiresAt) {
    return cachedFreeModels.filter((id) => !blockedModels.has(id));
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`models fetch failed: ${res.status}`);

    const json = (await res.json()) as { data?: OpenRouterModel[] };
    const models = (json.data ?? [])
      .filter(isFreeModel)
      .filter(isChatModel)
      .filter((m) => !blockedModels.has(m.id))
      .sort((a, b) => (b.context_length ?? 0) - (a.context_length ?? 0));

    cachedFreeModels = models.map((m) => m.id);
    cacheExpiresAt = now + CACHE_TTL_MS;

    return cachedFreeModels;
  } catch {
    return getFallbackFreeModels();
  }
}

function getFallbackFreeModels(): string[] {
  const fallbacks = [
    "google/gemma-3-27b-it:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen3-4b:free",
    "google/gemma-3-12b-it:free",
    "meta-llama/llama-3.2-3b-instruct:free",
  ];
  return fallbacks.filter((id) => !blockedModels.has(id));
}

function isModelUnavailableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("404") ||
    msg.includes("model not found") ||
    msg.includes("no endpoints found") ||
    msg.includes("does not exist") ||
    msg.includes("not available") ||
    msg.includes("deprecated") ||
    msg.includes("invalid model")
  );
}

function createOpenRouterClient(apiKey: string): OpenAI {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:60001",
      "X-Title": "LocationAI",
    },
  });
}

function buildUserPrompt(data: LocationAnalysisInput): string {
  const franchiseCount = data.competitors.filter((c) => c.isFranchise).length;
  const franchiseRatio =
    data.competitors.length > 0
      ? (franchiseCount / data.competitors.length) * 100
      : 0;

  return `## 분석 요청
- 주소: ${data.address}
- 희망 업종: ${data.businessType}
- 좌표: ${data.coordinates.lat}, ${data.coordinates.lng}

## 경쟁업체 (반경 500m 내 ${data.competitors.length}개)
${data.competitors
  .slice(0, 10)
  .map((c) => `- ${c.name} (${c.distance}m, ${c.isFranchise ? "프랜차이즈" : "개인"})`)
  .join("\n")}
- 프랜차이즈 비율: ${franchiseRatio.toFixed(1)}%

## 부동산 (실거래가)
- 평균 보증금: ${data.realEstate.avgDeposit.toLocaleString()}원
- 평균 월세: ${data.realEstate.avgMonthlyRent.toLocaleString()}원
- 최근 거래건수: ${data.realEstate.recentTransactions}건
- ㎡당 임대료: ${data.realEstate.pricePerSqm.toLocaleString()}원

## 상권 정보
- 상권명: ${data.commercialDistrict.districtName}
- 유동인구: ${data.commercialDistrict.footTraffic.toLocaleString()}명/일
- 상권지수: ${data.commercialDistrict.salesIndex}
- 평균 월매출: ${data.commercialDistrict.avgMonthlySales.toLocaleString()}원
- 점포수: ${data.commercialDistrict.businessCount}개

## 관광
- 월 관광객: ${data.tourism.monthlyVisitors.toLocaleString()}명
- 추세: ${data.tourism.trend === "up" ? "증가" : data.tourism.trend === "down" ? "감소" : "유지"}
- 주변 관광지: ${data.tourism.nearbyAttractions.join(", ")}

## 기상
- 평균 기온: ${data.weather.avgTemperature}°C
- 강수일: ${data.weather.precipitationDays}일
- 계절성: ${data.weather.seasonality}

## 개발계획
${data.developmentPlans
  .map((p) => `- ${p.title} (${p.expectedCompletion}): ${p.description}`)
  .join("\n")}`;
}

function parseAnalysisResult(content: string): AIAnalysisResult | null {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch?.[0] ?? content) as AIAnalysisResult;
    parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));
    return parsed;
  } catch {
    return null;
  }
}

async function tryAnalyzeWithModel(
  client: OpenAI,
  model: string,
  userPrompt: string
): Promise<AIAnalysisResult | null> {
  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;
  return parseAnalysisResult(content);
}

export function getMockAnalysis(data: LocationAnalysisInput): AIAnalysisResult {
  const competitorCount = data.competitors.length;
  const franchiseRatio =
    data.competitors.filter((c) => c.isFranchise).length /
    Math.max(competitorCount, 1);

  let score = 70;
  if (competitorCount < 10) score += 10;
  if (competitorCount > 20) score -= 15;
  if (franchiseRatio < 0.5) score += 5;
  if (data.commercialDistrict.footTraffic > 100000) score += 8;
  if (data.tourism.trend === "up") score += 5;
  if (data.realEstate.avgMonthlyRent > 5000000) score -= 10;

  score = Math.max(20, Math.min(95, score));

  return {
    score,
    recommendation:
      score >= 80
        ? "강력 추천"
        : score >= 65
          ? "추천"
          : score >= 50
            ? "보통"
            : "비추천",
    strengths: [
      competitorCount < 15
        ? "경쟁업체가 상대적으로 적음"
        : "상권이 성숙하여 안정적 수요 확보 가능",
      data.tourism.trend === "up"
        ? "관광객 증가 추세"
        : "배후 주거·업무 수요 안정적",
      data.realEstate.avgMonthlyRent < 4000000
        ? "임대료가 적정 수준"
        : "프리미엄 상권으로 브랜드 가치 높음",
      "대중교통 접근성 우수",
    ],
    weaknesses: [
      franchiseRatio > 0.5
        ? "프랜차이즈 점포 비율이 높아 차별화 필요"
        : "상권 내 인지도 구축에 시간 소요",
      data.realEstate.avgMonthlyRent > 4000000
        ? "임대료 부담이 큰 편"
        : "유동인구 대비 매출 전환율 검증 필요",
    ],
    cautions: [
      "초기 6개월은 적자 가능성을 감안한 자금 계획 필요",
      "주말·평일 매출 편차가 클 수 있음",
    ],
    recommendedBusinessTypes: [
      data.businessType,
      data.businessType === "카페" ? "베이커리" : "카페",
      "디저트 전문점",
    ],
    summary: `${data.address} 일대는 ${data.commercialDistrict.districtName} 상권에 속하며, 일 유동인구 ${data.commercialDistrict.footTraffic.toLocaleString()}명 규모입니다. ${data.businessType} 창업 시 경쟁 강도와 임대료를 고려하면 ${score}점 수준의 입지로 평가됩니다.`,
  };
}

export async function analyzeLocation(
  data: LocationAnalysisInput
): Promise<AIAnalysisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return getMockAnalysis(data);
  }

  const client = createOpenRouterClient(apiKey);
  const userPrompt = buildUserPrompt(data);
  const models = await fetchFreeModels(apiKey);

  if (models.length === 0) {
    return getMockAnalysis(data);
  }

  for (const model of models) {
    try {
      const result = await tryAnalyzeWithModel(client, model, userPrompt);
      if (result) return result;
    } catch (error) {
      if (isModelUnavailableError(error)) {
        blockedModels.add(model);
        continue;
      }
      continue;
    }
  }

  return getMockAnalysis(data);
}
