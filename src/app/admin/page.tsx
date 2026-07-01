"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BarChart3, FileText } from "lucide-react";

interface AdminData {
  stats: {
    totalUsers: number;
    totalAnalyses: number;
    planStats: { free: number; premium: number; enterprise: number };
  };
  users: Array<{
    id: string;
    email: string;
    full_name: string | null;
    plan: string;
    daily_usage: number;
    created_at: string;
  }>;
  recentAnalyses: Array<{
    id: string;
    address: string;
    business_type: string;
    score: number;
    created_at: string;
  }>;
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin")
      .then((res) => {
        if (!res.ok) throw new Error("관리자 권한이 필요합니다.");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-red-600">{error}</p>
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

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold">관리자 페이지</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              총 사용자
            </CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              총 분석
            </CardTitle>
            <BarChart3 className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalAnalyses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              플랜 분포
            </CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>무료: {data.stats.planStats.free}</div>
              <div>프리미엄: {data.stats.planStats.premium}</div>
              <div>기업: {data.stats.planStats.enterprise}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">사용자</TabsTrigger>
          <TabsTrigger value="analyses">분석 기록</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">이메일</th>
                      <th className="text-left py-2 px-3">이름</th>
                      <th className="text-left py-2 px-3">플랜</th>
                      <th className="text-left py-2 px-3">오늘 사용</th>
                      <th className="text-left py-2 px-3">가입일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-2 px-3">{user.email}</td>
                        <td className="py-2 px-3">{user.full_name || "-"}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                            {user.plan}
                          </span>
                        </td>
                        <td className="py-2 px-3">{user.daily_usage}</td>
                        <td className="py-2 px-3">
                          {new Date(user.created_at).toLocaleDateString("ko-KR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyses" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {data.recentAnalyses.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">{a.address}</div>
                      <div className="text-sm text-muted-foreground">
                        {a.business_type} · {new Date(a.created_at).toLocaleString("ko-KR")}
                      </div>
                    </div>
                    <div className="text-lg font-bold">{a.score}점</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
