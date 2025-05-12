
export function Footer() {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container flex flex-col md:flex-row justify-between gap-8 px-4">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold mb-2">Captains of Commerce</h3>
            <p className="text-sm text-muted-foreground">
              Making a difference in Arlington County.
            </p>
          </div>
          <div>
            <a href="mailto:contact@example.com" className="text-sm hover:underline">
              contact@example.com
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <h4 className="font-medium mb-1">Follow Us</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm hover:underline"
              >
                Instagram
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm hover:underline"
              >
                Facebook
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm hover:underline"
              >
                Twitter
              </a>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h4 className="font-medium mb-1">Legal</h4>
            <div className="flex flex-col gap-2">
              <a href="/privacy" className="text-sm hover:underline">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm hover:underline">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container px-4 mt-8 pt-8 border-t">
        <p className="text-sm text-center text-muted-foreground">
          © {new Date().getFullYear()} Captains of Commerce. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
