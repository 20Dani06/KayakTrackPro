import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, CheckCircle, Info, Lightbulb } from "lucide-react";
import { generatePerformanceInsights } from "@/lib/kayak-insights";
import type { Session } from "@shared/schema";

export default function PerformanceInsights() {
  const { data: sessions } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const insights = generatePerformanceInsights(sessions || []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      case "tip":
        return <Lightbulb className="w-5 h-5 text-orange-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getInsightStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-700";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "tip":
        return "bg-orange-50 border-orange-200 text-orange-700";
      default:
        return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="w-5 h-5 text-ocean-blue mr-2" />
          Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Log more sessions to get insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getInsightStyles(insight.type)}`}>
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <div className="font-medium">{insight.title}</div>
                    <div className="text-sm mt-1">{insight.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sessions && sessions.length > 0 && (
          <div className="mt-6 p-4 bg-ocean-blue text-white rounded-lg">
            <div className="font-medium mb-2">This Week's Achievement</div>
            <div className="text-sm opacity-90">
              🏆 Keep up the great work! Your consistency in training is showing positive results.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
