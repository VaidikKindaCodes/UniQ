"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OperatorHomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/operator/queues");
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[var(--surface-highlight)]" />
    </div>
  );
}
