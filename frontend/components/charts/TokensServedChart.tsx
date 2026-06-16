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
import { fetchTokensServedAnalytics, TokensServed } from "@/lib/api/admin";
import ChartWrapper from "./ChartWrapper";

export default function TokensServedChart() {
  const [data, setData] = useState<TokensServed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const analyticsData = await fetchTokensServedAnalytics();
        setData(analyticsData);
      } catch (err) {
        console.error("Failed to load tokens served analytics:", err);
        setError("Failed to load tokens served data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <ChartWrapper
        title="Tokens Served Per Hour"
        description="Shows how many tokens were successfully served during each hourly interval."
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
        title="Tokens Served Per Hour"
        description="Shows how many tokens were successfully served during each hourly interval."
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
        title="Tokens Served Per Hour"
        description="Shows how many tokens were successfully served during each hourly interval."
      >
        <div className="flex items-center justify-center h-[280px]">
          <p className="text-gray-500">No tokens served data for today</p>
        </div>
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper
      title="Tokens Served Per Hour"
      description="Shows how many tokens were successfully served during each hourly interval."
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis
            dataKey="hour"
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
          />
          <Bar
            dataKey="served"
            fill="#ffe2b5"
            radius={[4, 4, 0, 0]}
            animationDuration={700}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
