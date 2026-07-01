export type SubscriptionPlan = "free" | "premium" | "enterprise";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AddressSearchResult {
  address: string;
  roadAddress?: string;
  lat: number;
  lng: number;
  regionCode?: string;
}

export interface CompetitorInfo {
  name: string;
  category: string;
  distance: number;
  isFranchise: boolean;
}

export interface RealEstateData {
  avgDeposit: number;
  avgMonthlyRent: number;
  recentTransactions: number;
  pricePerSqm: number;
}

export interface CommercialDistrictData {
  districtName: string;
  footTraffic: number;
  salesIndex: number;
  avgMonthlySales: number;
  businessCount: number;
  franchiseRatio: number;
}

export interface TourismData {
  monthlyVisitors: number;
  trend: "up" | "down" | "stable";
  nearbyAttractions: string[];
}

export interface WeatherData {
  avgTemperature: number;
  precipitationDays: number;
  seasonality: string;
}

export interface DevelopmentPlan {
  title: string;
  description: string;
  expectedCompletion: string;
  impact: "positive" | "negative" | "neutral";
}

export interface LocationAnalysisInput {
  address: string;
  businessType: string;
  coordinates: Coordinates;
  competitors: CompetitorInfo[];
  realEstate: RealEstateData;
  commercialDistrict: CommercialDistrictData;
  tourism: TourismData;
  weather: WeatherData;
  developmentPlans: DevelopmentPlan[];
}

export interface AIAnalysisResult {
  score: number;
  recommendation: string;
  strengths: string[];
  weaknesses: string[];
  cautions: string[];
  recommendedBusinessTypes: string[];
  summary: string;
}

export interface AnalysisRecord {
  id: string;
  user_id: string;
  address: string;
  business_type: string;
  lat: number;
  lng: number;
  score: number;
  input_data: LocationAnalysisInput;
  result_data: AIAnalysisResult;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  plan: SubscriptionPlan;
  daily_usage: number;
  usage_reset_at: string;
  is_admin: boolean;
  created_at: string;
}

export const PLAN_LIMITS: Record<SubscriptionPlan, number> = {
  free: 3,
  premium: 100,
  enterprise: 9999,
};

export const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  free: 0,
  premium: 39000,
  enterprise: 300000,
};

export const BUSINESS_TYPES = [
  "카페",
  "음식점",
  "편의점",
  "미용실",
  "학원",
  "헬스장",
  "의류매장",
  "약국",
  "베이커리",
  "주점",
] as const;
