"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchAvgWaitTimeAnalytics, AvgWaitTime } from "@/lib/api/admin";
import ChartWrapper from "./ChartWrapper";

export default function WaitTimeChart() {
  const [data, setData] = useState<AvgWaitTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const analyticsData = await fetchAvgWaitTimeAnalytics();
        setData(analyticsData);
      } catch (err) {
        console.error("Failed to load wait time analytics:", err);
        setError("Failed to load wait time data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <ChartWrapper
        title="Average Waiting Time per Queue"
        description="Shows the average time users wait in different queues."
      >
        <div className="flex items-center justify-center h-[280px]">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </ChartWrapper>
    );
  }

  if (error) {
    return (
      <ChartWrapper
        title="Average Waiting Time per Queue"
        description="Shows the average time users wait in different queues."
      >
        <div className="flex items-center justify-center h-[280px]">
          <p className="text-red-500">{error}</p>
        </div>
      </ChartWrapper>
    );
  }

  if (data.length === 0) {
    return (
      <ChartWrapper
        title="Average Waiting Time per Queue"
        description="Shows the average time users wait in different queues."
      >
        <div className="flex items-center justify-center h-[280px]">
          <p className="text-gray-500">No wait time data available</p>
        </div>
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper
      title="Average Waiting Time per Queue"
      description="Shows the average time users wait in different queues."
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: "rgba(255, 255, 255, 0.4)", fontFamily: "monospace" }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.05)" }}
          />
          <YAxis
            dataKey="queue"
            type="category"
            width={110}
            tick={{ fontSize: 10, fill: "rgba(255, 255, 255, 0.6)", fontWeight: 700 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.05)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#140c08",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
            labelStyle={{
              fontWeight: 800,
              color: "#ffd88d",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontFamily: "monospace",
            }}
            itemStyle={{
              color: "#ffffff",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
            formatter={(value) =>
              value !== undefined ? [`${value} min`, "Avg Wait Time"] : ["", ""]
            }
          />
          <Bar
            dataKey="avgWaitMinutes"
            fill="#ffd88d"
            radius={[0, 4, 4, 0]}
            animationDuration={700}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
