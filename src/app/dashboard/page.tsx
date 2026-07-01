"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PLAN_LIMITS } from "@/types";
import { BarChart3, TrendingUp, Calendar, Crown } from "lucide-react";
import { getStarRating } from "@/lib/utils";

interface DashboardData {
  profile: {
    plan: string;
    daily_usage: number;
    email: string;
    full_name: string | null;
  };
  stats: {
    totalAnalyses: number;
    avgScore: number;
    dailyUsage: number;
    plan: string;
  };
  recentAnalyses: Array<{
    id: string;
    address: string;
    business_type: string;
    score: number;
    created_at: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("로그인이 필요합니다.");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center space-y-4">
        <p className="text-muted-foreground">{error}</p>
        <Link href="/auth/login">
          <Button>로그인하기</Button>
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto py-20 text-center text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  const planLimit = PLAN_LIMITS[data.stats.plan as keyof typeof PLAN_LIMITS] || 3;
  const usagePercent = (data.stats.dailyUsage / planLimit) * 100;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">
            {data.profile.full_name || data.profile.email}님, 환영합니다
          </p>
        </div>
        <Link href="/pricing">
          <Button variant="outline" className="gap-2">
            <Crown className="h-4 w-4" />
            {data.stats.plan === "free" ? "업그레이드" : data.stats.plan}
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              총 분석 횟수
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalAnalyses}회</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              평균 창업 점수
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.avgScore}점</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              오늘 사용량
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {data.stats.dailyUsage} / {planLimit}
            </div>
            <Progress value={usagePercent} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>최근 분석</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentAnalyses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>아직 분석 기록이 없습니다.</p>
              <Link href="/">
                <Button className="mt-4">첫 분석 시작하기</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentAnalyses.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <div className="font-medium">{a.address}</div>
                    <div className="text-sm text-muted-foreground">
                      {a.business_type} · {new Date(a.created_at).toLocaleDateString("ko-KR")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{a.score}점</div>
                    <div className="text-xs text-yellow-500">{getStarRating(a.score)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
