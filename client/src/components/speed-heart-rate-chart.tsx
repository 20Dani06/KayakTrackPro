import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { Session } from "@shared/schema";
import * as React from "react";

export default function SpeedHeartRateChart() {
  const { data: sessions } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const data = React.useMemo(() => {
    if (!sessions) return [] as { date: string; speed: number; heartRate: number | null }[];
    return sessions
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((s) => {
        const speed = s.avgSpeed || (s.distance && s.duration ? s.distance / (s.duration / 60) : 0);
        return {
          date: new Date(s.date).toLocaleDateString(),
          speed: Number(speed.toFixed(1)),
          heartRate: s.heartRate || null,
        };
      });
  }, [sessions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="w-4 h-4 mr-2 text-ocean-blue" />
          Speed & Heart Rate Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Log sessions to view speed and heart rate trends
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="speed"
                name="Speed (km/h)"
                stroke="#0ea5e9"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="heartRate"
                name="Heart Rate (bpm)"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
