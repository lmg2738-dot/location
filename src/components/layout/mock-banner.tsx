export function MockBanner() {
  if (process.env.NEXT_PUBLIC_MOCK_MODE !== "true") return null;

  return (
    <div className="bg-amber-500 text-amber-950 text-center text-sm py-1.5 px-4 font-medium">
      🧪 목업 모드 — API 키 없이 샘플 데이터로 동작합니다 (포트 60001)
    </div>
  );
}
