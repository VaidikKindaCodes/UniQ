"use client";

import { Suspense } from "react";
import VerifyEmailContent from "./VerifyContent";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Verifying...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}