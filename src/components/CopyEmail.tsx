"use client";

import { useEffect, useState } from "react";

// The email was a bare mailto:, which is a coin flip — plenty of people have
// no desktop mail client wired up and the click just does nothing. Keep the
// mailto for those who do, and add copy-to-clipboard for everyone else.
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!copied && !failed) return;
    const timer = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied, failed]);

  async function copy() {
    try {
      // Undefined on non-secure origins, so this can genuinely be missing.
      if (!navigator.clipboard) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      setFailed(true);
    }
  }

  return (
    <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2">
      <a
        href={`mailto:${email}`}
        className="link-underline inline-block break-all text-xl md:text-2xl"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="cursor-pointer text-sm text-muted transition-colors hover:text-ink"
      >
        {copied ? "Copied" : failed ? "Press ⌘C to copy" : "Copy"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
