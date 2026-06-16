"use client";

import React from "react";

export default function ChartWrapper({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-transparent">
      {/* 
        We hide the duplicate title since the parent container already renders 
        a themed, styled title, allowing us to utilize space more efficiently.
      */}
      <div className="w-full">
        {children}
      </div>

      {description && (
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mt-4 leading-relaxed">
          // {description}
        </p>
      )}
    </div>
  );
}
