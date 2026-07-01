"use client";

import { useState } from "react";
import { SearchForm } from "@/components/analysis/search-form";
import { ScoreCard, AnalysisDetails } from "@/components/analysis/score-card";
import { DataCards, CompetitorList } from "@/components/analysis/data-cards";
import { KakaoMap } from "@/components/map/kakao-map";
import type { AIAnalysisResult, LocationAnalysisInput } from "@/types";
import { Sparkles, MapPin, BarChart3, Brain } from "lucide-react";

interface AnalysisResponse {
  location: { address: string; lat: number; lng: number };
  inputData: LocationAnalysisInput;
  result: AIAnalysisResult;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  const handleAnalyze = async (address: string, businessType: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, businessType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        return;
      }

      setAnalysis(data);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="container mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI 기반 상권 분석
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            창업, 어디서 시작할까?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            주소만 입력하면 AI가 유동인구, 경쟁업체, 임대료, 관광객, 개발계획을
            분석하여 100점 만점 창업 점수를 알려드립니다.
          </p>

          <div className="pt-4">
            <SearchForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>

          {process.env.NEXT_PUBLIC_MOCK_MODE === "true" && !analysis && (
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {["강남역", "홍대", "성수"].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => handleAnalyze(sample, "카페")}
                  disabled={isLoading}
                  className="text-sm px-3 py-1 rounded-full border bg-white hover:bg-slate-50 text-muted-foreground"
                >
                  {sample} 카페 분석
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto p-4 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      {!analysis && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: MapPin,
                  title: "입지 분석",
                  desc: "유동인구, 경쟁업체, 프랜차이즈 비율을 지도에서 한눈에 확인",
                },
                {
                  icon: BarChart3,
                  title: "데이터 기반",
                  desc: "공정위, 소상공인365, 국토부 실거래가, KOSIS, 기상청, TourAPI 연동",
                },
                {
                  icon: Brain,
                  title: "AI 점수화",
                  desc: "GPT가 종합 분석하여 100점 만점 창업 점수와 추천 이유 제공",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="text-center space-y-3 p-6">
                    <div className="inline-flex p-3 rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {analysis && (
        <section id="results" className="py-12 px-4 bg-slate-50">
          <div className="container mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">분석 결과</h2>
              <p className="text-muted-foreground">
                {analysis.location.address} · {analysis.inputData.businessType}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ScoreCard result={analysis.result} />
              </div>
              <div className="lg:col-span-2">
                <KakaoMap
                  lat={analysis.location.lat}
                  lng={analysis.location.lng}
                  className="w-full h-[300px] rounded-xl border overflow-hidden"
                />
              </div>
            </div>

            <DataCards data={analysis.inputData} />

            <div className="grid lg:grid-cols-2 gap-6">
              <CompetitorList competitors={analysis.inputData.competitors} />
              <AnalysisDetails result={analysis.result} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
