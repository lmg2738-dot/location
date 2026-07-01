"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="inline-flex items-center gap-2 mx-auto mb-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">LocationAI</span>
          </div>
          <CardTitle>로그인</CardTitle>
          <CardDescription>계정에 로그인하여 분석 히스토리를 관리하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            계정이 없으신가요?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              회원가입
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
