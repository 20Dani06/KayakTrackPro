import type { Session } from "@shared/schema";

export interface PerformanceInsight {
  type: "success" | "info" | "tip";
  title: string;
  description: string;
}

export function generatePerformanceInsights(sessions: Session[]): PerformanceInsight[] {
  const insights: PerformanceInsight[] = [];
  
  if (sessions.length === 0) {
    return insights;
  }
  
  // Sort sessions by date (newest first)
  const sortedSessions = sessions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Recent sessions (last 7 days)
  const recentSessions = sortedSessions.filter(session => {
    const sessionDate = new Date(session.date);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate >= weekAgo;
  });
  
  // Efficiency analysis
  if (recentSessions.length >= 2) {
    const latest = recentSessions[0];
    const previous = recentSessions[1];
    
    if (latest.heartRate && previous.heartRate && latest.power && previous.power) {
      const latestEfficiency = latest.power / latest.heartRate;
      const previousEfficiency = previous.power / previous.heartRate;
      
      if (latestEfficiency > previousEfficiency * 1.05) {
        insights.push({
          type: "success",
          title: "Efficiency Improving",
          description: `Your power per heartbeat has increased ${((latestEfficiency / previousEfficiency - 1) * 100).toFixed(1)}% since last week. You're getting more efficient at converting effort to speed.`
        });
      }
    }
  }
  
  // Endurance analysis
  if (sessions.length >= 3) {
    const longSessions = sessions.filter(s => s.duration >= 40);
    
    if (longSessions.length >= 2) {
      insights.push({
        type: "info",
        title: "Endurance Building",
        description: "Your longer sessions show consistent pacing. Your endurance capacity is improving steadily."
      });
    }
  }
  
  // Stroke rate optimization
  const latestSession = sortedSessions[0];
  if (latestSession.strokeRate && latestSession.strokeRate < 70) {
    insights.push({
      type: "tip",
      title: "Stroke Rate Optimization",
      description: `Consider experimenting with a slightly higher stroke rate (70-72 spm) for your next threshold session. Current rate: ${latestSession.strokeRate} spm.`
    });
  }
  
  // Training consistency
  if (recentSessions.length >= 3) {
    insights.push({
      type: "success",
      title: "Great Consistency",
      description: `You've completed ${recentSessions.length} sessions this week. Consistent training is key to improvement!`
    });
  }
  
  // Power progression
  const powerSessions = sessions.filter(s => s.power).slice(0, 5);
  if (powerSessions.length >= 3) {
    const avgRecentPower = powerSessions.slice(0, 2).reduce((sum, s) => sum + (s.power || 0), 0) / 2;
    const avgOlderPower = powerSessions.slice(2).reduce((sum, s) => sum + (s.power || 0), 0) / (powerSessions.length - 2);
    
    if (avgRecentPower > avgOlderPower * 1.03) {
      insights.push({
        type: "success",
        title: "Power Increasing",
        description: `Your average power has increased ${((avgRecentPower / avgOlderPower - 1) * 100).toFixed(1)}% compared to previous sessions. Keep up the strength work!`
      });
    }
  }
  
  // Recovery recommendations
  const highIntensitySessions = recentSessions.filter(s => 
    s.perceivedEffort && s.perceivedEffort >= 8
  );
  
  if (highIntensitySessions.length >= 2) {
    insights.push({
      type: "tip",
      title: "Recovery Focus",
      description: "You've had several high-intensity sessions recently. Consider adding an easy recovery session to optimize adaptation."
    });
  }
  
  return insights;
}
