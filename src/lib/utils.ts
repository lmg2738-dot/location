import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("ko-KR").format(num);
}

export function getStarRating(score: number): string {
  if (score >= 90) return "★★★★★";
  if (score >= 75) return "★★★★☆";
  if (score >= 60) return "★★★☆☆";
  if (score >= 40) return "★★☆☆☆";
  return "★☆☆☆☆";
}

export function getRecommendationLabel(score: number): string {
  if (score >= 80) return "강력 추천";
  if (score >= 65) return "추천";
  if (score >= 50) return "보통";
  if (score >= 35) return "비추천";
  return "강력 비추천";
}
