"use client";

import { useEffect } from "react";

// Catches anything unhandled below it, rendered in the site's own design
// instead of falling through to Next's default error page. There's little
// left that can actually throw here — content is static JSON read at build
// time — but this costs nothing to keep as a safety net. error.tsx must be
// a Client Component; that's a framework requirement, not a design choice.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="display mt-6 text-3xl md:text-4xl">
        That didn&rsquo;t go through.
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
        An unexpected error interrupted the page. Trying again usually fixes it.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 cursor-pointer border border-ink px-4 py-2 text-sm transition-colors hover:bg-ink hover:text-bg"
      >
        Try again
      </button>
    </main>
  );
}
