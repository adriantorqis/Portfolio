import { useEffect } from "react";

// Shared modal behaviour for the slide-in detail panels: Escape closes, Tab
// stays inside the dialog, the page behind doesn't scroll, and focus goes to
// the panel on open and back to whatever opened it on close.
export function useModalDrawer(
  panelRef: React.RefObject<HTMLElement | null>,
  onClose: () => void
) {
  useEffect(() => {
    // Restore focus to whatever opened the panel when it closes — otherwise a
    // keyboard user is dumped back at the top of the document.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      // Keep Tab inside the dialog; a modal that leaks focus to the page
      // behind it is worse than no modal.
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose, panelRef]);
}
