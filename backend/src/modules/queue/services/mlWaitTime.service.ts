import axios from "axios";
import { env } from "../../../config/env.js";

const ML_SERVICE_URL = env.ML_SERVICE_URL;

export async function getPredictedWaitTime(features: {
  tokensAhead: number;
  activeCounters: number;
  hoursOfDay: number;
  dayOfWeek: number;
  avgServiceTime: number;
}): Promise<number | null> {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, features, {
      timeout: 2000,
    });
    return response.data.estimatedWaitMinutes;
  } catch (err) {
    // Log error and degrade gracefully
    if (err instanceof Error) {
      console.error("ML service unavailable or error:", err.message);
    } else {
      console.error("ML service unavailable or error:", err);
    }
    return null;
  }
}
