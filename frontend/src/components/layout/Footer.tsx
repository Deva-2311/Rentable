"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#121813] text-white border-t border-[#263027] pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="mb-6 inline-block">
              <span className="font-black text-2xl tracking-[0.3em] uppercase text-forest-mint">RENTABLE</span>
            </Link>
            <p className="text-sm text-forest-soft-sage max-w-sm leading-relaxed font-light">
              Rent what you need. Return when you&apos;re done. 
              Discover useful products from trusted owners around you, whenever you need them.
            </p>
          </div>
          
          <div>
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-forest-light-sage">Marketplace</h3>
            <ul className="space-y-4 text-sm text-forest-muted-sage">
              <li><Link href="/explore" className="hover:text-white transition-colors">For Borrowers</Link></li>
              <li><Link href="/owner" className="hover:text-white transition-colors">For Owners</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-forest-light-sage">Support</h3>
            <ul className="space-y-4 text-sm text-forest-muted-sage">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/disputes" className="hover:text-white transition-colors">Dispute Resolution</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-forest-light-sage">Legal</h3>
            <ul className="space-y-4 text-sm text-forest-muted-sage">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cancellation" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-forest-gray pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-forest-muted-sage">
          <p>&copy; {new Date().getFullYear()} RENTABLE. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
