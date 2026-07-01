import { formatCurrency, formatNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LocationAnalysisInput } from "@/types";
import {
  Users,
  Store,
  Building2,
  TrendingUp,
  Cloud,
  MapPin,
} from "lucide-react";

interface DataCardsProps {
  data: LocationAnalysisInput;
}

export function DataCards({ data }: DataCardsProps) {
  const franchiseCount = data.competitors.filter((c) => c.isFranchise).length;
  const franchiseRatio =
    data.competitors.length > 0
      ? ((franchiseCount / data.competitors.length) * 100).toFixed(1)
      : "0";

  const cards = [
    {
      title: "유동인구",
      value: `${formatNumber(data.commercialDistrict.footTraffic)}명/일`,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "경쟁업체",
      value: `${data.competitors.length}개 (500m 내)`,
      icon: Store,
      color: "text-orange-600",
    },
    {
      title: "프랜차이즈 비율",
      value: `${franchiseRatio}%`,
      icon: Building2,
      color: "text-purple-600",
    },
    {
      title: "평균 월매출",
      value: formatCurrency(data.commercialDistrict.avgMonthlySales),
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "평균 월세",
      value: formatCurrency(data.realEstate.avgMonthlyRent),
      icon: Building2,
      color: "text-red-600",
    },
    {
      title: "관광객",
      value: `${formatNumber(data.tourism.monthlyVisitors)}명/월`,
      icon: MapPin,
      color: "text-teal-600",
    },
    {
      title: "상권지수",
      value: `${data.commercialDistrict.salesIndex}점`,
      icon: TrendingUp,
      color: "text-indigo-600",
    },
    {
      title: "기온",
      value: `${data.weather.avgTemperature}°C`,
      icon: Cloud,
      color: "text-sky-600",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface CompetitorListProps {
  competitors: LocationAnalysisInput["competitors"];
}

export function CompetitorList({ competitors }: CompetitorListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">주변 경쟁업체</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {competitors.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{c.name}</span>
                {c.isFranchise && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                    프랜차이즈
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{c.distance}m</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
