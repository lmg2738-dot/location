import { getStarRating, getRecommendationLabel } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AIAnalysisResult } from "@/types";
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb } from "lucide-react";

interface ScoreCardProps {
  result: AIAnalysisResult;
}

export function ScoreCard({ result }: ScoreCardProps) {
  const stars = getStarRating(result.score);
  const label = getRecommendationLabel(result.score);

  const scoreColor =
    result.score >= 80
      ? "text-green-600"
      : result.score >= 65
        ? "text-blue-600"
        : result.score >= 50
          ? "text-yellow-600"
          : "text-red-600";

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg text-muted-foreground">창업 점수</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className={`text-7xl font-bold ${scoreColor}`}>{result.score}점</div>
        <div className="text-2xl tracking-widest text-yellow-500">{stars}</div>
        <div className={`text-xl font-semibold ${scoreColor}`}>{label}</div>
        <Progress value={result.score} className="h-3" />
        <p className="text-sm text-muted-foreground pt-2">{result.summary}</p>
      </CardContent>
    </Card>
  );
}

interface AnalysisDetailsProps {
  result: AIAnalysisResult;
}

export function AnalysisDetails({ result }: AnalysisDetailsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            장점
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.strengths.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            단점
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.weaknesses.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-red-500 mt-0.5">✘</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-5 w-5" />
            주의사항
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.cautions.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-yellow-500 mt-0.5">⚠</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-blue-600">
            <Lightbulb className="h-5 w-5" />
            추천 업종
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {result.recommendedBusinessTypes.map((type, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
