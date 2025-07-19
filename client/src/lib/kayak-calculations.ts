import type { Session } from "@shared/schema";

export function calculateWeeklyStats(sessions: Session[]) {
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const thisWeekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= weekStart && sessionDate < weekEnd;
  });
  
  const totalDistance = thisWeekSessions.reduce((sum, session) => sum + session.distance, 0);
  
  // Calculate improvement (simplified - would need historical data for real calculation)
  const improvement = Math.random() * 20 - 5; // Mock improvement between -5% and +15%
  
  return {
    totalDistance,
    improvement,
    sessionsCount: thisWeekSessions.length,
  };
}

export function calculateVO2Max(session: Session): number {
  if (!session.heartRate || !session.distance || !session.duration) {
    return 0;
  }
  
  // Simplified kayak-specific VO₂ max calculation
  // Based on distance, time, and heart rate
  const speed = session.distance / (session.duration / 60); // km/h
  const intensity = session.heartRate / 220; // Rough intensity percentage
  
  // Kayak-specific formula (simplified)
  const vo2Max = (speed * 15) + (intensity * 30) + (session.power ? session.power * 0.1 : 0);
  
  return Math.max(25, Math.min(75, vo2Max)); // Clamp between reasonable values
}

export function calculateVO2MaxFromPerformance(data: {
  distance: number;
  time: number;
  heartRate: number;
  weight: number;
}): number {
  const { distance, time, heartRate, weight } = data;
  
  // Convert to consistent units
  const speedKmh = distance / (time / 60);
  const speedMs = speedKmh / 3.6;
  
  // Kayak-specific VO₂ max estimation
  // Based on metabolic equivalent of kayaking and performance
  const met = 3.5 + (speedMs * 2.2); // Base MET for kayaking + speed factor
  const vo2Max = (met * 3.5 * weight) / weight; // Normalize by weight
  
  // Adjust for heart rate intensity
  const hrFactor = Math.min(1.2, heartRate / 180);
  const adjustedVO2Max = vo2Max * hrFactor;
  
  return Math.max(25, Math.min(75, adjustedVO2Max));
}

export function predictRaceTime(session: Session, raceDistance: number): number {
  if (!session.distance || !session.duration) {
    return 0;
  }
  
  // Calculate average speed from session
  const avgSpeed = session.distance / (session.duration / 60); // km/h
  
  // Adjust for race distance (shorter races are faster)
  let paceAdjustment = 1.0;
  if (raceDistance <= 200) {
    paceAdjustment = 0.75; // 25% faster for sprints
  } else if (raceDistance <= 500) {
    paceAdjustment = 0.85; // 15% faster for 500m
  } else if (raceDistance <= 1000) {
    paceAdjustment = 0.95; // 5% faster for 1000m
  }
  
  // Factor in stroke rate and power if available
  if (session.strokeRate && session.strokeRate > 70) {
    paceAdjustment *= 0.95; // Higher stroke rate indicates sprint capability
  }
  
  if (session.power && session.power > 200) {
    paceAdjustment *= 0.92; // Higher power indicates better performance
  }
  
  const raceSpeed = avgSpeed / paceAdjustment;
  const raceTimeMinutes = (raceDistance / 1000) / raceSpeed * 60;
  
  return raceTimeMinutes * 60; // Convert to seconds
}

export function calculateTrainingZoneDistribution(sessions: Session[]) {
  const zones = {
    zone1: 0,
    zone2: 0,
    zone3: 0,
    zone4: 0,
    zone5: 0,
  };
  
  sessions.forEach(session => {
    if (!session.heartRate) return;
    
    // Simple zone distribution based on heart rate
    // These would normally be based on user's specific HR zones
    if (session.heartRate < 140) {
      zones.zone1 += session.duration * 0.6; // Assume 60% of time in zone 1
      zones.zone2 += session.duration * 0.4; // 40% in zone 2
    } else if (session.heartRate < 160) {
      zones.zone2 += session.duration * 0.7;
      zones.zone3 += session.duration * 0.3;
    } else if (session.heartRate < 175) {
      zones.zone3 += session.duration * 0.6;
      zones.zone4 += session.duration * 0.4;
    } else if (session.heartRate < 190) {
      zones.zone4 += session.duration * 0.7;
      zones.zone5 += session.duration * 0.3;
    } else {
      zones.zone5 += session.duration;
    }
  });
  
  return {
    zone1: Math.round(zones.zone1),
    zone2: Math.round(zones.zone2),
    zone3: Math.round(zones.zone3),
    zone4: Math.round(zones.zone4),
    zone5: Math.round(zones.zone5),
  };
}

export function estimateEpoc(
  power: number[],
  hr: number[],
  pVo2max: number,
  hrRest: number,
  hrMax: number,
  options?: {
    kDown?: number;
    kUp?: number;
    n?: number;
    beta?: number;
    I0?: number;
    dt?: number;
  }
): { total: number; series: number[] } {
  const {
    kDown = 1,
    kUp = 15,
    n = 2,
    beta = 0.05,
    I0 = 0.4,
    dt = 5 / 60,
  } = options || {};

  let E = 0;
  const series: number[] = [];

  const steps = Math.min(power.length, hr.length);
  for (let i = 0; i < steps; i++) {
    const p = power[i] ?? 0;
    const h = hr[i] ?? hrRest;
    const I_W = pVo2max ? p / pVo2max : 0;
    const denom = hrMax - hrRest;
    const I_HR = denom ? (h - hrRest) / denom : 0;
    const I = Math.max(I_W, I_HR);

    let dE: number;
    if (I <= I0) {
      dE = -kDown * E * dt;
    } else {
      dE = (kUp / (1 + beta * E)) * Math.pow(I - I0, n) * dt;
    }

    E = Math.max(0, E + dE);
    series.push(E);
  }

  return { total: E, series };
}
