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

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
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
          <CardTitle>회원가입</CardTitle>
          <CardDescription>무료로 시작하고 하루 3회 분석을 이용하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">이름</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="홍길동"
              />
            </div>
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
                placeholder="8자 이상"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              로그인
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
