import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { calculateTrainingZoneDistribution } from "@/lib/kayak-calculations";
import type { Session } from "@shared/schema";

export default function TrainingZones() {
  const { data: sessions } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const zoneDistribution = calculateTrainingZoneDistribution(sessions || []);

  const zones = [
    { name: "Zone 1 (Recovery)", color: "bg-gray-300", time: zoneDistribution.zone1 },
    { name: "Zone 2 (Aerobic)", color: "bg-blue-400", time: zoneDistribution.zone2 },
    { name: "Zone 3 (Tempo)", color: "bg-green-400", time: zoneDistribution.zone3 },
    { name: "Zone 4 (Threshold)", color: "bg-paddle-orange", time: zoneDistribution.zone4 },
    { name: "Zone 5 (VO₂ Max)", color: "bg-red-400", time: zoneDistribution.zone5 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 text-ocean-blue mr-2" />
          Training Zones Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {zones.map((zone) => (
            <div key={zone.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${zone.color}`}></div>
                <span className="text-sm font-medium text-gray-700">{zone.name}</span>
              </div>
              <div className="text-sm text-gray-600">{zone.time} min</div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-water-light rounded-lg">
          <div className="text-sm font-medium text-deep-water mb-1">
            Weekly Training Distribution
          </div>
          <div className="text-xs text-gray-600">
            {zoneDistribution.zone4 > 10 
              ? `Great endurance stimulus with ${zoneDistribution.zone4} min in Zone 4. Consider adding more Zone 2 volume for aerobic base.`
              : "Good balance of training zones. Consider adding some threshold work in Zone 4."
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
