import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { predictRaceTime } from "@/lib/kayak-calculations";
import type { Session } from "@shared/schema";

export default function RacePredictions() {
  const { data: sessions } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}:${String(remainingSeconds.toFixed(1)).padStart(4, '0')}`;
    }
    return `${remainingSeconds.toFixed(1)}s`;
  };

  const getLatestSession = () => {
    if (!sessions || sessions.length === 0) return null;
    return sessions[0];
  };

  const latestSession = getLatestSession();

  const predictions = latestSession ? {
    time200m: predictRaceTime(latestSession, 200),
    time500m: predictRaceTime(latestSession, 500),
    time1000m: predictRaceTime(latestSession, 1000),
  } : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="w-5 h-5 text-paddle-orange mr-2" />
          Race Predictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!predictions ? (
          <div className="text-center py-8">
            <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Log sessions to see predictions</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">200m Sprint</div>
                <div className="text-sm text-gray-600">Based on recent power data</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-ocean-blue">
                  {formatTime(predictions.time200m)}
                </div>
                <div className="text-xs text-green-600">-0.5s</div>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">500m</div>
                <div className="text-sm text-gray-600">Current fitness level</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-ocean-blue">
                  {formatTime(predictions.time500m)}
                </div>
                <div className="text-xs text-green-600">-1.2s</div>
              </div>
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <div className="font-medium text-gray-900">1000m</div>
                <div className="text-sm text-gray-600">Endurance estimate</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-ocean-blue">
                  {formatTime(predictions.time1000m)}
                </div>
                <div className="text-xs text-green-600">-2.8s</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
