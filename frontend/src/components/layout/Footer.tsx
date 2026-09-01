import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-secondary/20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <span className="font-bold text-xl tracking-tight text-primary">RENTABLE</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Rent what you need. When you need it. Discover quality products from people around you.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Categories</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/categories/bikes" className="hover:text-foreground">Bikes</Link></li>
              <li><Link href="/categories/cameras" className="hover:text-foreground">Cameras</Link></li>
              <li><Link href="/categories/electronics" className="hover:text-foreground">Electronics</Link></li>
              <li><Link href="/categories/gaming" className="hover:text-foreground">Gaming</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">About</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-foreground">How It Works</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/cancellation" className="hover:text-foreground">Cancellation Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RENTABLE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
