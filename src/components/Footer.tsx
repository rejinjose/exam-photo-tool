export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-surface">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p data-testid="privacy-line">Your photos never leave your device.</p>
        <a href="/privacy" className="text-brand-600 underline hover:text-brand-700">
          Privacy
        </a>
      </div>
    </footer>
  );
}
