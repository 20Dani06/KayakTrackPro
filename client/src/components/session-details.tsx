import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, MapPin, Activity, Zap, Heart, Power, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Session, UserSettings } from "@shared/schema";
import { estimateEpoc } from "@/lib/kayak-calculations";

interface SessionDetailsProps {
  session: Session;
  onClose: () => void;
}

export default function SessionDetails({ session, onClose }: SessionDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Parse FIT file data if available
  const hasDetailedData = session.speedData || session.heartRateData || session.strokeRateData || session.powerData;
  const gpsCoordinates = session.gpsCoordinates ? session.gpsCoordinates : [];
  
  // Parse chart data
  const getChartData = (dataType: 'speed' | 'heartRate' | 'strokeRate' | 'power') => {
    let rawData: number[] = [];
    
    switch (dataType) {
      case 'speed':
        rawData = session.speedData ? JSON.parse(session.speedData) : [];
        break;
      case 'heartRate':
        rawData = session.heartRateData ? JSON.parse(session.heartRateData) : [];
        break;
      case 'strokeRate':
        rawData = session.strokeRateData ? JSON.parse(session.strokeRateData) : [];
        break;
      case 'power':
        rawData = session.powerData ? JSON.parse(session.powerData) : [];
        break;
    }
    
    return rawData.map((value, index) => ({
      time: index,
      value: Number(value.toFixed(1)),
    }));
  };

  const speedData = getChartData('speed');
  const heartRateData = getChartData('heartRate');
  const strokeRateData = getChartData('strokeRate');
  const powerData = getChartData('power');

  const { data: settings } = useQuery<UserSettings | undefined>({
    queryKey: ["/api/user-settings"],
  });

  const epocValue = useMemo(() => {
    if (!settings || !session.powerData || !session.heartRateData) return null;
    try {
      const pArr: number[] = JSON.parse(session.powerData);
      const hrArr: number[] = JSON.parse(session.heartRateData);
      if (pArr.length === 0 || hrArr.length === 0) return null;
      const pVo2max = Math.max(...pArr);
      const result = estimateEpoc(
        pArr,
        hrArr,
        pVo2max,
        settings.restingHeartRate ?? 60,
        settings.maxHeartRate ?? 190
      );
      return Number(result.total.toFixed(1));
    } catch {
      return null;
    }
  }, [settings, session.powerData, session.heartRateData]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatTime = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!hasDetailedData) {
    return (
      <Card className="fixed inset-0 z-50 bg-white m-4 overflow-auto">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Session Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Detailed Data Available</h3>
            <p className="text-gray-600">This session was manually entered. Import FIT files to view detailed charts and GPS data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">{session.sessionType} Session</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{formatTime(session.date)}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Session Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-ocean-blue">{session.distance.toFixed(2)} km</div>
              <div className="text-sm text-gray-600">Distance</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{formatDuration(session.duration)}</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{session.heartRate || '--'}</div>
              <div className="text-sm text-gray-600">Avg HR (bpm)</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{session.avgSpeed?.toFixed(1) || '--'}</div>
              <div className="text-sm text-gray-600">Avg Speed (km/h)</div>
            </div>
          </div>

          {/* Detailed Charts */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="power">Power & Stroke</TabsTrigger>
              <TabsTrigger value="map">Route Map</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {speedData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-ocean-blue" />
                        Speed Over Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={speedData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} km/h`, 'Speed']} />
                          <Line type="monotone" dataKey="value" stroke="hsl(207, 90%, 54%)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {heartRateData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-red-500" />
                        Heart Rate Over Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={heartRateData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} bpm`, 'Heart Rate']} />
                          <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {strokeRateData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-green-500" />
                        Stroke Rate (Cadence) Over Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={strokeRateData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} spm`, 'Stroke Rate']} />
                          <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-lg font-bold">{session.maxSpeed?.toFixed(1) || '--'} km/h</div>
                      <div className="text-sm text-gray-600">Max Speed</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-lg font-bold">{session.strokeRate || '--'} spm</div>
                      <div className="text-sm text-gray-600">Avg Stroke Rate</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-lg font-bold">{session.elevation?.toFixed(0) || '--'} m</div>
                      <div className="text-sm text-gray-600">Elevation</div>
                    </CardContent>
                  </Card>
                  {epocValue !== null && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-lg font-bold">{epocValue} ml/kg</div>
                        <div className="text-sm text-gray-600">EPOC</div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="power" className="space-y-6">
              {powerData.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Power className="w-4 h-4 mr-2 text-orange-500" />
                      Power Output Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={powerData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} W`, 'Power']} />
                        <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12">
                  <Power className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Power Data Available</h3>
                  <p className="text-gray-600">Power data requires a paddle power meter during your session.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="map" className="space-y-6">
              {gpsCoordinates.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      GPS Route Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Map visualization coming soon</p>
                        <p className="text-sm text-gray-500">{gpsCoordinates.length} GPS points recorded</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No GPS Data Available</h3>
                  <p className="text-gray-600">GPS tracking was not enabled during this session.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}