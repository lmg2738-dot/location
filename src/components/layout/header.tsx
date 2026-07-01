"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, BarChart3, History, Shield, LogIn, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

const navItems = [
  { href: "/", label: "분석", icon: MapPin },
  { href: "/dashboard", label: "대시보드", icon: BarChart3 },
  { href: "/history", label: "히스토리", icon: History },
  { href: "/pricing", label: "요금제", icon: Shield },
  ...(isMock ? [{ href: "/admin", label: "관리자", icon: Settings }] : []),
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <MapPin className="h-6 w-6 text-primary" />
          <span>LocationAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2",
                    pathname === item.href && "bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isMock ? (
            <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
              Demo
            </span>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                로그인
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
