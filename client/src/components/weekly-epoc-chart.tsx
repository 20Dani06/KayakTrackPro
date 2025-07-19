import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { estimateEpoc } from "@/lib/kayak-calculations";
import type { Session, UserSettings } from "@shared/schema";
import * as React from "react";

export default function WeeklyEpocChart() {
  const { data: sessions } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });
  const { data: settings } = useQuery<UserSettings | undefined>({
    queryKey: ["/api/user-settings"],
  });

  const data = React.useMemo(() => {
    if (!sessions || !settings) return [] as { week: string; epoc: number }[];
    const map = new Map<string, number>();
    sessions.forEach((s) => {
      if (!s.powerData || !s.heartRateData) return;
      try {
        const power: number[] = JSON.parse(s.powerData);
        const hr: number[] = JSON.parse(s.heartRateData);
        if (power.length === 0 || hr.length === 0) return;
        const pVo2max = Math.max(...power);
        const result = estimateEpoc(
          power,
          hr,
          pVo2max,
          settings.restingHeartRate ?? 60,
          settings.maxHeartRate ?? 190
        );
        const date = new Date(s.date);
        const weekStart = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - date.getDay()
        );
        const key = weekStart.toISOString().slice(0, 10);
        map.set(key, (map.get(key) || 0) + result.total);
      } catch {
        // ignore parsing errors
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([week, epoc]) => ({ week, epoc: Number(epoc.toFixed(1)) }));
  }, [sessions, settings]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HeartPulse className="w-4 h-4 mr-2 text-ocean-blue" />
          Weekly EPOC Load
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Log sessions with power and heart rate data to see EPOC trends
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(v) => [`${v} ml/kg`, "EPOC"]} />
              <Line
                type="monotone"
                dataKey="epoc"
                stroke="hsl(207, 90%, 54%)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
