export type DiseaseKey = "pneumonia" | "stroke" | "diabetes";

export interface DiseaseStats {
  total: number;
  positive: number;
  negative: number;
  history: Array<{ date: string; disease: DiseaseKey; result: "positive" | "negative" }>; // for bar chart over time
}

export interface AppStats {
  pneumonia: DiseaseStats;
  stroke: DiseaseStats;
  diabetes: DiseaseStats;
}

const DEFAULT_STATS: AppStats = {
  pneumonia: { total: 0, positive: 0, negative: 0, history: [] },
  stroke: { total: 0, positive: 0, negative: 0, history: [] },
  diabetes: { total: 0, positive: 0, negative: 0, history: [] },
};

const KEY = "ai-health-stats";

export function getStats(): AppStats {
  const raw = localStorage.getItem(KEY);
  if (!raw) return DEFAULT_STATS;
  try {
    const parsed = JSON.parse(raw) as AppStats;
    return {
      pneumonia: { history: [], ...DEFAULT_STATS.pneumonia, ...parsed.pneumonia },
      stroke: { history: [], ...DEFAULT_STATS.stroke, ...parsed.stroke },
      diabetes: { history: [], ...DEFAULT_STATS.diabetes, ...parsed.diabetes },
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function recordResult(disease: DiseaseKey, isPositive: boolean) {
  const stats = getStats();
  const s = stats[disease];
  s.total += 1;
  if (isPositive) s.positive += 1; else s.negative += 1;
  s.history.push({ date: new Date().toISOString().slice(0, 10), disease, result: isPositive ? "positive" : "negative" });
  localStorage.setItem(KEY, JSON.stringify(stats));
}
