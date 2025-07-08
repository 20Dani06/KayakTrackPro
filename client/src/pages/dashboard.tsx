import { Button } from "@/components/ui/button";
import { Plus, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import PerformanceOverview from "@/components/performance-overview";
import SessionForm from "@/components/session-form";
import FitFileUpload from "@/components/fit-file-upload";
import RecentSessions from "@/components/recent-sessions";
import RacePredictions from "@/components/race-predictions";
import TrainingZones from "@/components/training-zones";
import PerformanceInsights from "@/components/performance-insights";
import VO2Calculator from "@/components/vo2-calculator";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button className="flex-1 bg-white text-black hover:bg-gray-100 border border-gray-300" asChild>
            <Link href="/sessions">
              <Plus className="w-4 h-4 mr-2" />
              Log New Session
            </Link>
          </Button>
          <Button variant="outline" className="flex-1 text-black border-gray-300 bg-white hover:bg-gray-100" asChild>
            <Link href="/analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <PerformanceOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Session Form and FIT Upload */}
        <div className="lg:col-span-2 space-y-6">
          <FitFileUpload />
          <SessionForm />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RecentSessions />
          <RacePredictions />
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrainingZones />
        <PerformanceInsights />
      </div>

      {/* VO2 Calculator */}
      <VO2Calculator />
    </div>
  );
}
