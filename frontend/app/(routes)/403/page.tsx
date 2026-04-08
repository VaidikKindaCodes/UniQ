"use client";

import { toastBus } from "@/app/utils/toastBus";
import Link from "next/link";
import { useEffect } from "react";

export default function ForbiddenPage() {
  useEffect(() => {
    toastBus.error("Role access denied");
  }, []);

  return (
    <main className="theme-page flex min-h-screen items-center justify-center px-4">
      <div className="theme-card max-w-lg w-full rounded-3xl p-8 text-center">
        <p className="mb-2 text-lg font-semibold text-sky-600">Access denied</p>
        <p className="theme-text-muted mb-6">
          You don&apos;t have permission to view this page. If you think this is a mistake,
          please sign in with an account that has the right role.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="theme-primary-button rounded-full px-4 py-2 font-semibold transition-colors"
          >
            Go to login
          </Link>
          <Link
            href="/"
            className="theme-outline-button rounded-full px-4 py-2 font-semibold transition-colors"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
