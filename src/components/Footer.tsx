export function Footer() {
  return (
    <footer className="mt-auto border-t border-line px-6 py-10 md:px-12">
      <div className="mx-auto max-w-5xl">
        <span className="eyebrow">&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
