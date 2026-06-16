"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchQueueLoadAnalytics, QueueLoad } from "@/lib/api/admin";
import ChartWrapper from "./ChartWrapper";

export default function QueueLoadChart() {
  const [data, setData] = useState<QueueLoad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const analyticsData = await fetchQueueLoadAnalytics();
        setData(analyticsData);
      } catch (err) {
        console.error("Failed to load queue load analytics:", err);
        setError("Failed to load queue load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <ChartWrapper
        title="Queue Load Throughout the Day"
        description="Displays how the number of active tokens changes across different time intervals."
      >
        <div className="flex items-center justify-center h-[260px]">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </ChartWrapper>
    );
  }

  if (error) {
    return (
      <ChartWrapper
        title="Queue Load Throughout the Day"
        description="Displays how the number of active tokens changes across different time intervals."
      >
        <div className="flex items-center justify-center h-[260px]">
          <p className="text-red-500">{error}</p>
        </div>
      </ChartWrapper>
    );
  }

  if (data.length === 0) {
    return (
      <ChartWrapper
        title="Queue Load Throughout the Day"
        description="Displays how the number of active tokens changes across different time intervals."
      >
        <div className="flex items-center justify-center h-[260px]">
          <p className="text-gray-500">No data available for today</p>
        </div>
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper
      title="Queue Load Throughout the Day"
      description="Displays how the number of active tokens changes across different time intervals."
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "rgba(255, 255, 255, 0.4)", fontFamily: "monospace" }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.05)" }}
          />

          <YAxis
            tick={{ fontSize: 10, fill: "rgba(255, 255, 255, 0.4)", fontFamily: "monospace" }}
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
            formatter={(value: number | undefined) => [`${value ?? 0}`, "Active Tokens"]}
          />

          <Line
            type="monotone"
            dataKey="activeTokens"
            stroke="#ffd88d"
            strokeWidth={3}
            dot={{ r: 3, strokeWidth: 2, fill: "#1a0f0a", stroke: "#ffd88d" }}
            activeDot={{ r: 6, fill: "#ffd88d", stroke: "#1a0f0a", strokeWidth: 2 }}
            animationDuration={900}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
