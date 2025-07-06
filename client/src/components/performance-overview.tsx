import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Activity, Clock, MapPin } from "lucide-react";
import { calculateWeeklyStats, calculateVO2Max, predictRaceTime } from "@/lib/kayak-calculations";
import type { Session } from "@shared/schema";

export default function PerformanceOverview() {
  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const weeklyStats = calculateWeeklyStats(sessions || []);
  const avgVO2Max = sessions?.length ? calculateVO2Max(sessions[0]) : 0;
  const prediction500m = sessions?.length ? predictRaceTime(sessions[0], 500) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-ocean-blue" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {weeklyStats.totalDistance.toFixed(1)} km
          </div>
          <div className="text-sm text-green-600 mt-1">
            {weeklyStats.improvement > 0 ? '+' : ''}{weeklyStats.improvement.toFixed(1)}% from last week
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-ocean-blue" />
            Avg VO₂ Max
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {avgVO2Max.toFixed(1)}
          </div>
          <div className="text-sm text-green-600 mt-1">+1.2 improvement</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-ocean-blue" />
            500m Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {prediction500m ? `${Math.floor(prediction500m / 60)}:${String(Math.floor(prediction500m % 60)).padStart(2, '0')}.${String(Math.floor((prediction500m % 1) * 10)).padStart(1, '0')}` : '--:--'}
          </div>
          <div className="text-sm text-green-600 mt-1">-1.2s improvement</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-ocean-blue" />
            Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {sessions?.length || 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total logged</div>
        </CardContent>
      </Card>
    </div>
  );
}
