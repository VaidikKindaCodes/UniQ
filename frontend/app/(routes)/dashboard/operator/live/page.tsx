"use client";

import { Suspense } from "react";
import LiveContent from "./LiveContent";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading live dashboard...</div>}>
      <LiveContent />
    </Suspense>
  );
}