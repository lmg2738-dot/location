import { NextResponse } from "next/server";
import { z } from "zod";
import { searchAddress, collectLocationData } from "@/lib/apis/location-data";
import { analyzeLocation } from "@/lib/ai/analyze";
import { createClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/config";
import { PLAN_LIMITS } from "@/types";

const analyzeSchema = z.object({
  address: z.string().min(1).max(200),
  businessType: z.string().min(1).max(50),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = analyzeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "잘못된 요청입니다." },
        { status: 400 }
      );
    }

    const { address, businessType } = parsed.data;

    const location = await searchAddress(address);
    if (!location) {
      return NextResponse.json(
        { error: "주소를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const supabase = hasSupabase() ? await createClient() : null;
    const {
      data: { user },
    } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    if (user && supabase) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        const today = new Date().toISOString().split("T")[0];
        const resetDate = profile.usage_reset_at?.split("T")[0];

        let dailyUsage = profile.daily_usage;
        if (resetDate !== today) {
          dailyUsage = 0;
          await supabase
            .from("profiles")
            .update({ daily_usage: 0, usage_reset_at: new Date().toISOString() })
            .eq("id", user.id);
        }

        const limit = PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS] || 3;
        if (dailyUsage >= limit) {
          return NextResponse.json(
            { error: "일일 분석 횟수를 초과했습니다. 요금제를 업그레이드하세요." },
            { status: 429 }
          );
        }
      }
    }

    const inputData = await collectLocationData(
      location.roadAddress || location.address,
      businessType,
      location.lat,
      location.lng,
      location.regionCode
    );

    const result = await analyzeLocation(inputData);

    const analysisRecord = {
      user_id: user?.id || null,
      address: location.roadAddress || location.address,
      business_type: businessType,
      lat: location.lat,
      lng: location.lng,
      score: result.score,
      input_data: inputData,
      result_data: result,
    };

    if (hasSupabase() && supabase) {
      await supabase.from("analyses").insert(analysisRecord);

      if (user) {
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("daily_usage")
          .eq("id", user.id)
          .single();

        await supabase
          .from("profiles")
          .update({ daily_usage: (currentProfile?.daily_usage || 0) + 1 })
          .eq("id", user.id);
      }
    }

    return NextResponse.json({
      location: {
        address: location.roadAddress || location.address,
        lat: location.lat,
        lng: location.lng,
      },
      inputData,
      result,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
