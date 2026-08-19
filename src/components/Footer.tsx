export function Footer() {
  return (
    <footer className="mt-auto border-t border-line px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="eyebrow">&copy; {new Date().getFullYear()}</span>
        <span className="eyebrow">Designed &amp; built in-house</span>
      </div>
    </footer>
  );
}
