"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fetchTokenStatusAnalytics, TokenStatusCount } from "@/lib/api/admin";
import ChartWrapper from "./ChartWrapper";

const COLORS = ["#ffd88d", "#ffe2b5", "#f59e0b", "#a8a29e"];

export default function ServiceEfficiencyChart() {
  const [data, setData] = useState<TokenStatusCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const analyticsData = await fetchTokenStatusAnalytics();
        setData(analyticsData);
      } catch (err) {
        console.error("Failed to load token status analytics:", err);
        setError("Failed to load token status data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <ChartWrapper
        title="Service Efficiency"
        description="Distribution of token statuses across the system."
      >
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </ChartWrapper>
    );
  }

  if (error) {
    return (
      <ChartWrapper
        title="Service Efficiency"
        description="Distribution of token statuses across the system."
      >
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-red-500">{error}</p>
        </div>
      </ChartWrapper>
    );
  }

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  if (totalCount === 0) {
    return (
      <ChartWrapper
        title="Service Efficiency"
        description="Distribution of token statuses across the system."
      >
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-500">No token status data available</p>
        </div>
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper
      title="Service Efficiency"
      description="Distribution of token statuses across the system."
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            outerRadius={85}
            innerRadius={50}
            paddingAngle={3}
            labelLine={{ stroke: "rgba(255, 255, 255, 0.15)" }}
            label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
              const RADIAN = Math.PI / 180;
              const radius = (outerRadius ?? 0) + 22;
              const angle = midAngle ?? 0;
              const x = (cx ?? 0) + radius * Math.cos(-angle * RADIAN);
              const y = (cy ?? 0) + radius * Math.sin(-angle * RADIAN);
              const pct = (percent ?? 0) * 100;
              return (
                <text
                  x={x}
                  y={y}
                  fill="rgba(255, 255, 255, 0.6)"
                  textAnchor={x > (cx ?? 0) ? "start" : "end"}
                  dominantBaseline="central"
                  className="text-[9px] font-mono uppercase tracking-wider"
                >
                  {`${name}: ${pct.toFixed(0)}%`}
                </text>
              );
            }}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#140c08",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
            itemStyle={{
              color: "#ffffff",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ paddingTop: "15px", fontSize: "10px", fontFamily: "monospace" }}
            formatter={(value) => <span className="text-white/60 uppercase tracking-widest">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
