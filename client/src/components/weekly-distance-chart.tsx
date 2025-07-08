import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
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

export default function WeeklyDistanceChart() {
  const { data: sessions } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const data = React.useMemo(() => {
    if (!sessions) return [] as { week: string; distance: number }[];
    const map = new Map<string, number>();
    sessions.forEach((s) => {
      const date = new Date(s.date);
      const weekStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay()
      );
      const key = weekStart.toISOString().slice(0, 10);
      map.set(key, (map.get(key) || 0) + s.distance);
    });
    return Array.from(map.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([week, distance]) => ({ week, distance: Number(distance.toFixed(1)) }));
  }, [sessions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-ocean-blue" />
          Weekly Distance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Log sessions to see distance trends
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(v) => [`${v} km`, "Distance"]} />
              <Line
                type="monotone"
                dataKey="distance"
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
