import type {
  AddressSearchResult,
  CompetitorInfo,
  CommercialDistrictData,
  DevelopmentPlan,
  LocationAnalysisInput,
  RealEstateData,
  TourismData,
  WeatherData,
} from "@/types";

const KAKAO_REST_KEY = process.env.KAKAO_REST_API_KEY;

export async function searchAddress(
  query: string
): Promise<AddressSearchResult | null> {
  if (!KAKAO_REST_KEY) {
    return getMockAddress(query);
  }

  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `KakaoAK ${KAKAO_REST_KEY}` },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return getMockAddress(query);

    const data = await res.json();
    const doc = data.documents?.[0];
    if (!doc) return getMockAddress(query);

    return {
      address: doc.address?.address_name || doc.address_name,
      roadAddress: doc.road_address?.address_name,
      lat: parseFloat(doc.y),
      lng: parseFloat(doc.x),
      regionCode: doc.address?.b_code,
    };
  } catch {
    return getMockAddress(query);
  }
}

function getMockAddress(query: string): AddressSearchResult {
  const mockLocations: Record<string, AddressSearchResult> = {
    강남역: {
      address: "서울특별시 강남구 역삼동",
      roadAddress: "서울특별시 강남구 강남대로 396",
      lat: 37.4979,
      lng: 127.0276,
      regionCode: "1168010100",
    },
    홍대: {
      address: "서울특별시 마포구 서교동",
      roadAddress: "서울특별시 마포구 양화로 160",
      lat: 37.5563,
      lng: 126.922,
      regionCode: "1144012000",
    },
    성수: {
      address: "서울특별시 성동구 성수동",
      roadAddress: "서울특별시 성동구 성수이로",
      lat: 37.5445,
      lng: 127.0557,
      regionCode: "1120011400",
    },
  };

  for (const [key, value] of Object.entries(mockLocations)) {
    if (query.includes(key)) return value;
  }

  return {
    address: query,
    roadAddress: query,
    lat: 37.5665,
    lng: 126.978,
    regionCode: "1100000000",
  };
}

export async function fetchCompetitors(
  lat: number,
  lng: number,
  businessType: string
): Promise<CompetitorInfo[]> {
  if (!KAKAO_REST_KEY) {
    return getMockCompetitors(businessType);
  }

  try {
    const categoryMap: Record<string, string> = {
      카페: "CE7",
      음식점: "FD6",
      편의점: "CS2",
      미용실: "HP8",
    };

    const category = categoryMap[businessType] || "CE7";
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${category}&x=${lng}&y=${lat}&radius=500&sort=distance`,
      {
        headers: { Authorization: `KakaoAK ${KAKAO_REST_KEY}` },
        next: { revalidate: 1800 },
      }
    );

    if (!res.ok) return getMockCompetitors(businessType);

    const data = await res.json();
    return (data.documents || []).slice(0, 15).map(
      (doc: { place_name: string; category_name: string; distance: string }) => ({
        name: doc.place_name,
        category: doc.category_name,
        distance: parseInt(doc.distance, 10),
        isFranchise: isFranchiseBrand(doc.place_name),
      })
    );
  } catch {
    return getMockCompetitors(businessType);
  }
}

function isFranchiseBrand(name: string): boolean {
  const franchises = [
    "스타벅스", "투썸", "이디야", "메가", "컴포즈",
    "GS25", "CU", "세븐일레븐", "이마트24",
    "맥도날드", "버거킹", "KFC", "롯데리아",
  ];
  return franchises.some((f) => name.includes(f));
}

function getMockCompetitors(businessType: string): CompetitorInfo[] {
  const base: CompetitorInfo[] = [
    { name: "스타벅스 강남역점", category: businessType, distance: 120, isFranchise: true },
    { name: "로컬 카페 무드", category: businessType, distance: 250, isFranchise: false },
    { name: "투썸플레이스", category: businessType, distance: 380, isFranchise: true },
    { name: "카페 드림", category: businessType, distance: 450, isFranchise: false },
    { name: "이디야커피", category: businessType, distance: 520, isFranchise: true },
    { name: "베이커리 하우스", category: businessType, distance: 680, isFranchise: false },
    { name: "메가커피", category: businessType, distance: 750, isFranchise: true },
    { name: "커피빈", category: businessType, distance: 890, isFranchise: true },
  ];
  return base;
}

export async function fetchRealEstateData(
  lat: number,
  lng: number,
  regionCode?: string
): Promise<RealEstateData> {
  const apiKey = process.env.MOLIT_REAL_ESTATE_API_KEY;

  if (!apiKey) {
    return {
      avgDeposit: 50000000,
      avgMonthlyRent: 3500000,
      recentTransactions: 12,
      pricePerSqm: 85000,
    };
  }

  try {
    const today = new Date();
    const dealYmd = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}`;
    const lawdCd = regionCode?.substring(0, 5) || "11680";

    const res = await fetch(
      `https://apis.data.go.kr/1613000/RTMSDataSvcSilvTrade/getSilvTrade?serviceKey=${apiKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&numOfRows=50&pageNo=1`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) throw new Error("API error");

    const text = await res.text();
    const deposits = extractNumbers(text, "deposit");
    const rents = extractNumbers(text, "monthlyRent");

    if (deposits.length === 0) throw new Error("No data");

    return {
      avgDeposit: Math.round(average(deposits) * 10000),
      avgMonthlyRent: Math.round(average(rents) * 10000),
      recentTransactions: deposits.length,
      pricePerSqm: Math.round(average(rents) * 10000 / 33),
    };
  } catch {
    return {
      avgDeposit: 50000000,
      avgMonthlyRent: 3500000,
      recentTransactions: 12,
      pricePerSqm: 85000,
    };
  }
}

function extractNumbers(xml: string, tag: string): number[] {
  const regex = new RegExp(`<${tag}>(\\d+)</${tag}>`, "g");
  const results: number[] = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    results.push(parseInt(match[1], 10));
  }
  return results;
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export async function fetchCommercialDistrict(
  lat: number,
  lng: number,
  businessType: string
): Promise<CommercialDistrictData> {
  const apiKey = process.env.SMALL_BUSINESS_API_KEY;

  if (!apiKey) {
    return getMockCommercialDistrict(businessType);
  }

  try {
    const res = await fetch(
      `https://apis.data.go.kr/B553077/api/open/sd/sal?serviceKey=${apiKey}&divId=ctprvnCd&key=11&format=json`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    const items = data.body?.items || [];

    return {
      districtName: items[0]?.signguNm || "강남구",
      footTraffic: items[0]?.thsmonSelngAmt || 85000,
      salesIndex: items[0]?.thsmonSelngCo || 72,
      avgMonthlySales: items[0]?.thsmonSelngAmt || 45000000,
      businessCount: items[0]?.storCo || 342,
      franchiseRatio: 0.35,
    };
  } catch {
    return getMockCommercialDistrict(businessType);
  }
}

function getMockCommercialDistrict(businessType: string): CommercialDistrictData {
  return {
    districtName: "강남구 역삼동",
    footTraffic: 125000,
    salesIndex: 78,
    avgMonthlySales: 52000000,
    businessCount: 287,
    franchiseRatio: 0.42,
  };
}

export async function fetchTourismData(
  lat: number,
  lng: number
): Promise<TourismData> {
  const apiKey = process.env.TOUR_API_KEY;

  if (!apiKey) {
    return {
      monthlyVisitors: 45000,
      trend: "up",
      nearbyAttractions: ["강남역", "코엑스", "봉은사", "선릉"],
    };
  }

  try {
    const res = await fetch(
      `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${apiKey}&mapX=${lng}&mapY=${lat}&radius=1000&arrange=E&MobileOS=ETC&MobileApp=LocationAI&_type=json&numOfRows=10`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    const items = data.response?.body?.items?.item || [];

    return {
      monthlyVisitors: items.length * 5000,
      trend: "up",
      nearbyAttractions: items
        .slice(0, 5)
        .map((item: { title: string }) => item.title),
    };
  } catch {
    return {
      monthlyVisitors: 45000,
      trend: "up",
      nearbyAttractions: ["강남역", "코엑스", "봉은사"],
    };
  }
}

export async function fetchWeatherData(
  lat: number,
  lng: number
): Promise<WeatherData> {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return {
      avgTemperature: 14.2,
      precipitationDays: 8,
      seasonality: "사계절 유동인구 변동 큼, 봄·가을 성수기",
    };
  }

  try {
    const grid = convertToGrid(lat, lng);
    const res = await fetch(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${apiKey}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${getToday()}&base_time=0600&nx=${grid.nx}&ny=${grid.ny}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    const items = data.response?.body?.items?.item || [];
    const temp = items.find(
      (i: { category: string }) => i.category === "T1H"
    );

    return {
      avgTemperature: temp ? parseFloat(temp.obsrValue) : 14.2,
      precipitationDays: 8,
      seasonality: "사계절 유동인구 변동 큼",
    };
  } catch {
    return {
      avgTemperature: 14.2,
      precipitationDays: 8,
      seasonality: "사계절 유동인구 변동 큼",
    };
  }
}

function convertToGrid(lat: number, lng: number) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;

  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lng * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  return {
    nx: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
  };
}

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

export async function fetchDevelopmentPlans(
  address: string
): Promise<DevelopmentPlan[]> {
  return [
    {
      title: "강남역 역세권 개발",
      description: "지하공간 확충 및 보행환경 개선 사업 진행 중",
      expectedCompletion: "2027년",
      impact: "positive",
    },
    {
      title: "테헤란로 업무지구 재건축",
      description: "노후 오피스 빌딩 재건축으로 배후 수요 증가 예상",
      expectedCompletion: "2028년",
      impact: "positive",
    },
  ];
}

export async function collectLocationData(
  address: string,
  businessType: string,
  lat: number,
  lng: number,
  regionCode?: string
): Promise<LocationAnalysisInput> {
  const [competitors, realEstate, commercialDistrict, tourism, weather, developmentPlans] =
    await Promise.all([
      fetchCompetitors(lat, lng, businessType),
      fetchRealEstateData(lat, lng, regionCode),
      fetchCommercialDistrict(lat, lng, businessType),
      fetchTourismData(lat, lng),
      fetchWeatherData(lat, lng),
      fetchDevelopmentPlans(address),
    ]);

  return {
    address,
    businessType,
    coordinates: { lat, lng },
    competitors,
    realEstate,
    commercialDistrict,
    tourism,
    weather,
    developmentPlans,
  };
}
