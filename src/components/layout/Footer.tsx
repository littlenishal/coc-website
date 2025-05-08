export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col md:h-24 md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            © 2025 Captains of Commerce. All rights reserved.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm"
          >
            Instagram
          </a>
          <a href="mailto:contact@example.com" className="text-sm">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
