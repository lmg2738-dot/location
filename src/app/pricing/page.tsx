import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLAN_PRICES } from "@/types";
import { Check, Crown, Building2, Zap } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "무료",
    price: PLAN_PRICES.free,
    description: "창업 입지를 가볍게 탐색해보세요",
    features: ["하루 3회 분석", "기본 상권 데이터", "AI 창업 점수", "지도 시각화"],
    icon: Zap,
    popular: false,
  },
  {
    id: "premium",
    name: "프리미엄",
    price: PLAN_PRICES.premium,
    description: "본격적인 창업 준비에 최적",
    features: [
      "하루 100회 분석",
      "전체 API 데이터",
      "AI 상세 분석 리포트",
      "분석 히스토리 저장",
      "PDF 리포트 다운로드",
      "이메일 알림",
    ],
    icon: Crown,
    popular: true,
  },
  {
    id: "enterprise",
    name: "기업",
    price: PLAN_PRICES.enterprise,
    description: "프랜차이즈 · 부동산 · 컨설팅 기업용",
    features: [
      "무제한 분석",
      "API 접근",
      "팀 계정 (10명)",
      "화이트라벨 리포트",
      "전담 매니저",
      "맞춤 데이터 연동",
    ],
    icon: Building2,
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-bold">요금제</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          창업 단계에 맞는 플랜을 선택하세요. 언제든 업그레이드할 수 있습니다.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? "border-primary border-2 shadow-lg" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  인기
                </div>
              )}
              <CardHeader className="text-center">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mx-auto mb-2">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold">무료</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">원/월</span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={plan.id === "free" ? "/" : "/auth/login"}>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.id === "free" ? "무료로 시작" : "시작하기"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
