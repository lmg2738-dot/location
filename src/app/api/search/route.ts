import { NextResponse } from "next/server";
import { searchAddress } from "@/lib/apis/location-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length > 200) {
    return NextResponse.json({ error: "검색어를 입력하세요." }, { status: 400 });
  }

  const result = await searchAddress(query);

  if (!result) {
    return NextResponse.json({ error: "검색 결과가 없습니다." }, { status: 404 });
  }

  return NextResponse.json(result);
}
