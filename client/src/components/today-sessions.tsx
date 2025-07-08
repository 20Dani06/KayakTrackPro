import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "wouter";
import { format, isToday } from "date-fns";
import type { Session } from "@shared/schema";

export default function TodaySessions() {
  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });


  const today = new Date();
  const isSameDay = (date: Date) =>
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const todaysSessions = (sessions || []).filter((s) =>
    isSameDay(new Date(s.date))
  );

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="space-y-2 py-6">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (todaysSessions.length === 0) {
    return (
      <Card className="mb-8">
        <CardContent className="text-center py-6">
          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-700 mb-4">
            You haven't logged a session today
          </p>
          <Button
            asChild
            className="bg-white text-black hover:bg-gray-100 border border-gray-300"
          >
            <Link href="/sessions">Log Today's Session</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 text-ocean-blue mr-2" />
          Today's Training
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaysSessions.map((session) => (
            <div
              key={session.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-gray-900">
                    {session.sessionType}
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(new Date(session.date), "p")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-ocean-blue">
                    {session.distance} km
                  </div>
                  <div className="text-xs text-gray-500">
                    {session.duration} min
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
