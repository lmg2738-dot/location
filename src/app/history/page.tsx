"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStarRating } from "@/lib/utils";
import { History, Search } from "lucide-react";

interface AnalysisItem {
  id: string;
  address: string;
  business_type: string;
  score: number;
  created_at: string;
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("로그인이 필요합니다.");
        return res.json();
      })
      .then((data) => setAnalyses(data.recentAnalyses || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center space-y-4">
        <History className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">{error}</p>
        <Link href="/auth/login">
          <Button>로그인하기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">분석 히스토리</h1>
          <p className="text-muted-foreground">이전 분석 결과를 확인하세요</p>
        </div>
        <Link href="/">
          <Button className="gap-2">
            <Search className="h-4 w-4" />
            새 분석
          </Button>
        </Link>
      </div>

      {analyses.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">분석 기록이 없습니다.</p>
            <Link href="/">
              <Button>첫 분석 시작하기</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {analyses.map((a) => (
            <Card key={a.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{a.address}</CardTitle>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{a.score}점</span>
                    <div className="text-xs text-yellow-500">{getStarRating(a.score)}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{a.business_type}</span>
                  <span>{new Date(a.created_at).toLocaleString("ko-KR")}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
