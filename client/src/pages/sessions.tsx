import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { Calendar, Clock, Heart, Zap, Power, BarChart3, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SessionForm from "@/components/session-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import SessionDetails from "@/components/session-details";
import type { Session } from "@shared/schema";

export default function Sessions() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const filteredSessions = (sessions || [])
    .filter((s) => filterType === "All" || s.sessionType === filterType)
    .filter((s) =>
      search
        ? (s.notes || "").toLowerCase().includes(search.toLowerCase()) ||
          s.sessionType.toLowerCase().includes(search.toLowerCase())
        : true
    )

    .slice()
    .sort((a, b) =>
      sortDir === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  const summary = filteredSessions.reduce(
    (acc, s) => {
      acc.distance += s.distance;
      acc.duration += s.duration;
      return acc;
    },
    { distance: 0, duration: 0 }
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/sessions/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Session deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions/recent"] });
    },
    onError: () => {
      toast({ title: "Failed to delete", variant: "destructive" });
    },
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getSessionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "race":
        return "bg-red-100 text-red-800";
      case "training":
        return "bg-blue-100 text-blue-800";
      case "recovery":
        return "bg-green-100 text-green-800";
      case "technique":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions logged yet</h3>
          <p className="text-gray-600 mb-4">Start tracking your kayaking sessions to see your progress</p>
          <Button className="bg-white text-black hover:bg-gray-100 border border-gray-300">
            Log Your First Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Training Sessions</h1>
        <p className="text-gray-600">Track your progress and analyze your performance</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex space-x-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Training">Training</SelectItem>
              <SelectItem value="Race">Race</SelectItem>
              <SelectItem value="Recovery">Recovery</SelectItem>
              <SelectItem value="Technique">Technique</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortDir} onValueChange={(v) => setSortDir(v as "asc" | "desc") }>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest</SelectItem>
              <SelectItem value="asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-40"
          />

        </div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-600">
          {filteredSessions.length} sessions &bull; {summary.distance.toFixed(1)} km &bull; {summary.duration} min
        </div>
      </div>

      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{session.sessionType}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(session.date), "MMM dd, yyyy")}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSessionTypeColor(session.sessionType)}>
                    {session.sessionType}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => setEditingSession(session)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("Delete this session?")) {
                        deleteMutation.mutate(session.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-ocean-blue rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-medium">📏</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ocean-blue">{session.distance} km</div>
                    <div className="text-xs text-gray-500">Distance</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{formatDuration(session.duration)}</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                </div>

                {session.heartRate && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{session.heartRate} bpm</div>
                      <div className="text-xs text-gray-500">Avg HR</div>
                    </div>
                  </div>
                )}

                {session.strokeRate && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{session.strokeRate} spm</div>
                      <div className="text-xs text-gray-500">Stroke Rate</div>
                    </div>
                  </div>
                )}
              </div>

              {session.power && (
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-paddle-orange rounded-full flex items-center justify-center mr-3">
                    <Power className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{session.power}w</div>
                    <div className="text-xs text-gray-500">Average Power</div>
                  </div>
                </div>
              )}

              {session.notes && (
                <div className="text-sm text-gray-600 italic mb-4">
                  "{session.notes}"
                </div>
              )}

              {/* Show detailed view button for FIT file sessions */}
              {(session.speedData || session.heartRateData || session.gpsCoordinates) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-black border-gray-300 bg-white hover:bg-gray-100"
                  onClick={() => setSelectedSession(session)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Detailed Charts
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <SessionDetails
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      {editingSession && (
        <Dialog open onOpenChange={() => setEditingSession(null)}>
          <DialogContent>
            <SessionForm
              session={editingSession}
              onSuccess={() => setEditingSession(null)}
              onCancel={() => setEditingSession(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
