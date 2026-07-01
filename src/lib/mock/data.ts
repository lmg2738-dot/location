export const mockDashboardData = {
  profile: {
    plan: "free",
    daily_usage: 1,
    email: "demo@location-ai.local",
    full_name: "데모 사용자",
  },
  stats: {
    totalAnalyses: 3,
    avgScore: 78,
    dailyUsage: 1,
    plan: "free",
  },
  recentAnalyses: [
    {
      id: "mock-1",
      address: "서울특별시 강남구 강남대로 396",
      business_type: "카페",
      score: 82,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "mock-2",
      address: "서울특별시 마포구 양화로 160",
      business_type: "카페",
      score: 74,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "mock-3",
      address: "서울특별시 성동구 성수이로",
      business_type: "음식점",
      score: 79,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
};

export const mockAdminData = {
  stats: {
    totalUsers: 128,
    totalAnalyses: 1542,
    planStats: { free: 98, premium: 24, enterprise: 6 },
  },
  users: [
    {
      id: "u1",
      email: "demo@location-ai.local",
      full_name: "데모 사용자",
      plan: "free",
      daily_usage: 1,
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: "u2",
      email: "premium@example.com",
      full_name: "김창업",
      plan: "premium",
      daily_usage: 12,
      created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
    {
      id: "u3",
      email: "corp@example.com",
      full_name: "기업담당자",
      plan: "enterprise",
      daily_usage: 45,
      created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    },
  ],
  recentAnalyses: mockDashboardData.recentAnalyses,
};
