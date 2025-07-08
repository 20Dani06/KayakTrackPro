import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, Activity, HeartPulse, BedDouble } from "lucide-react";
import { predictRaceTime } from "@/lib/kayak-calculations";
import type { Session } from "@shared/schema";

export default function FitnessStats() {
  const { data: sessions } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const predictions = sessions && sessions.length > 0 ? {
    "200m": predictRaceTime(sessions[0], 200),
    "500m": predictRaceTime(sessions[0], 500),
    "1000m": predictRaceTime(sessions[0], 1000),
  } : null;

  const distances = ["200m", "500m", "1000m"] as const;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % distances.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return minutes > 0
      ? `${minutes}:${String(Number(secs).toFixed(1)).padStart(4, "0")}`
      : `${secs}s`;
  };

  const currentDistance = distances[index];
  const prediction = predictions ? predictions[currentDistance] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Fitness Stats</h1>
        <p className="text-gray-600">Key metrics about your current fitness</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Flag className="w-5 h-5 text-ocean-blue mr-2" />
              Race Time Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!prediction ? (
              <div className="text-center py-8 text-gray-600">No data</div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <div className="text-xl font-bold text-gray-900">
                  {currentDistance}
                </div>
                <div className="text-3xl font-bold text-ocean-blue">
                  {formatTime(prediction)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 text-ocean-blue mr-2" />
              Training Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-600">Coming soon</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HeartPulse className="w-5 h-5 text-ocean-blue mr-2" />
              HRV Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-600">Coming soon</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BedDouble className="w-5 h-5 text-ocean-blue mr-2" />
              Recovery Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-600">Coming soon</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

