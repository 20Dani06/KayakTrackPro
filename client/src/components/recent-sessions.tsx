import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Calendar, Heart, Zap, Power } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import type { Session } from "@shared/schema";

export default function RecentSessions() {
  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions/recent"],
    queryFn: async () => {
      const response = await fetch("/api/sessions/recent?limit=3");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 text-ocean-blue mr-2" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="w-5 h-5 text-ocean-blue mr-2" />
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!sessions || sessions.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">No sessions logged yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{session.sessionType}</div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(session.date), "MMM dd, yyyy")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-ocean-blue">{session.distance} km</div>
                    <div className="text-xs text-gray-500">{session.duration} min</div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  {session.heartRate && (
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {session.heartRate} bpm
                    </span>
                  )}
                  {session.strokeRate && (
                    <span className="flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      {session.strokeRate} spm
                    </span>
                  )}
                  {session.power && (
                    <span className="flex items-center">
                      <Power className="w-3 h-3 mr-1" />
                      {session.power}w
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Button variant="ghost" className="w-full mt-4 text-ocean-blue hover:bg-water-light" asChild>
          <Link href="/sessions">View All Sessions</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
