"use client";

interface StatCardProps {
  title: string;
  value: string;
  color: "blue" | "green" | "amber" | "purple";
}

const colorMap = {
  blue: {
    chipBg: "rgba(255, 216, 141, 0.26)",
    chipText: "var(--surface-rust)",
    glow: "rgba(242, 176, 60, 0.18)",
  },
  green: {
    chipBg: "rgba(207, 235, 178, 0.32)",
    chipText: "#55712c",
    glow: "rgba(141, 184, 82, 0.16)",
  },
  amber: {
    chipBg: "rgba(255, 205, 120, 0.3)",
    chipText: "#8f4a11",
    glow: "rgba(233, 162, 48, 0.16)",
  },
  purple: {
    chipBg: "rgba(225, 196, 168, 0.34)",
    chipText: "#6d3c1f",
    glow: "rgba(129, 58, 16, 0.14)",
  },
};

export default function StatCard({ title, value, color }: StatCardProps) {
  const styles = colorMap[color];

  return (
    <div
      className="dashboard-panel rounded-[1.6rem] p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundImage: `radial-gradient(circle at top right, ${styles.glow}, transparent 34%), linear-gradient(180deg, color-mix(in srgb, var(--bg-surface-soft) 96%, white 4%), color-mix(in srgb, var(--bg-surface-muted) 90%, transparent 10%))`,
      }}
    >
      <div
        className="inline-block rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-[0.18em]"
        style={{ backgroundColor: styles.chipBg, color: styles.chipText }}
      >
        {title}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {value}
      </p>
    </div>
  );
}
