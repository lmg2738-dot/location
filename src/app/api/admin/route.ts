import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabase, isMockMode } from "@/lib/config";
import { mockAdminData } from "@/lib/mock/data";

export async function GET(request: Request) {
  if (isMockMode() || !hasSupabase()) {
    return NextResponse.json(mockAdminData);
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
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data: users, count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data: analyses, count: analysisCount } = await supabase
    .from("analyses")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(50);

  const planStats = {
    free: users?.filter((u) => u.plan === "free").length || 0,
    premium: users?.filter((u) => u.plan === "premium").length || 0,
    enterprise: users?.filter((u) => u.plan === "enterprise").length || 0,
  };

  return NextResponse.json({
    stats: {
      totalUsers: userCount || 0,
      totalAnalyses: analysisCount || 0,
      planStats,
    },
    users: users || [],
    recentAnalyses: analyses || [],
  });
}
