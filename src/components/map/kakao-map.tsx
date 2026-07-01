"use client";

import { useEffect, useRef } from "react";

interface KakaoMapProps {
  lat: number;
  lng: number;
  markers?: Array<{ lat: number; lng: number; title: string }>;
  className?: string;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (container: HTMLElement, options: object) => {
          setCenter: (latlng: unknown) => void;
          setLevel: (level: number) => void;
        };
        Marker: new (options: object) => {
          setMap: (map: unknown) => void;
        };
      };
    };
  }
}

export function KakaoMap({ lat, lng, markers = [], className }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      if (!window.kakao?.maps || !mapRef.current) return;

      window.kakao.maps.load(() => {
        const center = new window.kakao.maps.LatLng(lat, lng);
        const map = new window.kakao.maps.Map(mapRef.current!, {
          center,
          level: 3,
        });

        new window.kakao.maps.Marker({ position: center, map });

        markers.forEach((m) => {
          const pos = new window.kakao.maps.LatLng(m.lat, m.lng);
          new window.kakao.maps.Marker({ position: pos, map });
        });
      });
    };

    if (window.kakao?.maps) {
      initMap();
      return;
    }

    if (!mapKey) {
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#f1f5f9;color:#64748b;flex-direction:column;gap:8px;">
            <div style="font-size:48px;">🗺️</div>
            <div>지도 미리보기 (${lat.toFixed(4)}, ${lng.toFixed(4)})</div>
            <div style="font-size:12px;">Kakao Map API 키를 설정하세요</div>
          </div>
        `;
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${mapKey}&autoload=false`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [lat, lng, markers, mapKey]);

  return (
    <div
      ref={mapRef}
      className={className || "w-full h-[400px] rounded-xl border overflow-hidden"}
    />
  );
}
