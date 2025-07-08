import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Activity,
  HeartPulse,
  BedDouble,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
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
  const [direction, setDirection] = useState(0);

  const cycle = (dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + distances.length) % distances.length);
  };

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
          <CardContent className="relative">
            {!prediction ? (
              <div className="text-center py-8 text-gray-600">No data</div>
            ) : (
              <div className="py-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                  onClick={() => cycle(-1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                  onClick={() => cycle(1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <div className="relative overflow-hidden">
                  <AnimatePresence custom={direction} initial={false} mode="wait">
                    <motion.div
                      key={currentDistance}
                      custom={direction}
                      variants={{
                        enter: (dir: number) => ({
                          x: dir > 0 ? 100 : -100,
                          opacity: 0,
                          position: "absolute",
                          width: "100%",
                        }),
                        center: { x: 0, opacity: 1, position: "static" },
                        exit: (dir: number) => ({
                          x: dir > 0 ? -100 : 100,
                          opacity: 0,
                          position: "absolute",
                          width: "100%",
                        }),
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-center space-y-2"
                    >
                      <div className="text-xl font-bold text-gray-900">
                        {currentDistance}
                      </div>
                      <div className="text-3xl font-bold text-ocean-blue">
                        {formatTime(prediction)}
                      </div>
                    </motion.div>
                  </AnimatePresence>
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

