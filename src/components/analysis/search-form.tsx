"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS_TYPES } from "@/types";

interface SearchFormProps {
  onAnalyze: (address: string, businessType: string) => void;
  isLoading?: boolean;
}

export function SearchForm({ onAnalyze, isLoading }: SearchFormProps) {
  const [address, setAddress] = useState("");
  const [businessType, setBusinessType] = useState("카페");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    onAnalyze(address.trim(), businessType);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">창업 희망 지역</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="address"
            placeholder="예: 강남역, 홍대입구, 성수동"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="pl-10 h-12 text-base"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>업종</Label>
        <Select value={businessType} onValueChange={setBusinessType} disabled={isLoading}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" size="lg" className="w-full h-12 text-base" disabled={isLoading || !address.trim()}>
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            AI 분석 중...
          </>
        ) : (
          "창업 입지 분석 시작"
        )}
      </Button>
    </form>
  );
}
