import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabase, isMockMode } from "@/lib/config";
import { mockDashboardData } from "@/lib/mock/data";

export async function GET() {
  if (isMockMode() || !hasSupabase()) {
    return NextResponse.json(mockDashboardData);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: analyses, count } = await supabase
    .from("analyses")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const avgScore =
    analyses && analyses.length > 0
      ? Math.round(
          analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length
        )
      : 0;

  return NextResponse.json({
    profile,
    stats: {
      totalAnalyses: count || 0,
      avgScore,
      dailyUsage: profile?.daily_usage || 0,
      plan: profile?.plan || "free",
    },
    recentAnalyses: analyses || [],
  });
}
