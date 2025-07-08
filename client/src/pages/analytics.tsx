import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Award, Activity } from "lucide-react";
import WeeklyDistanceChart from "@/components/weekly-distance-chart";
import SpeedHeartRateChart from "@/components/speed-heart-rate-chart";
import TrainingZones from "@/components/training-zones";
import PerformanceInsights from "@/components/performance-insights";

export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance Analytics</h1>
        <p className="text-gray-600">Detailed insights into your kayaking performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-ocean-blue" />
              Progress Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">+8.2%</div>
            <div className="text-sm text-green-600 mt-1">Performance improvement</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Target className="w-4 h-4 mr-2 text-ocean-blue" />
              Training Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">342</div>
            <div className="text-sm text-gray-600 mt-1">TSS this week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Award className="w-4 h-4 mr-2 text-ocean-blue" />
              Personal Best
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1:54.2</div>
            <div className="text-sm text-green-600 mt-1">500m time</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-ocean-blue" />
              Consistency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">87%</div>
            <div className="text-sm text-gray-600 mt-1">Training adherence</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <WeeklyDistanceChart />
        <SpeedHeartRateChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrainingZones />
        <PerformanceInsights />
      </div>
    </div>
  );
}
