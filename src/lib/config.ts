export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_MOCK_MODE === "true";
}

export function hasSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
