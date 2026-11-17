import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      q: "How do I rent an item?",
      a: "Simply browse or search for an item, select your desired dates, and click 'Rent Now'. You'll need to create an account and add a payment method if you haven't already. Once the owner approves your request, your payment is processed."
    },
    {
      q: "What if an item is damaged during my rental?",
      a: "If an item is damaged, report it immediately through our resolution center. The RENTABLE Guarantee provides coverage for owners, and renters are responsible for the deductible up to the value of the item."
    },
    {
      q: "How do I list my items?",
      a: "Click on 'List Your Product' in the top right corner. You'll need to upload clear photos, write a description, set your daily price, and establish your rental rules."
    },
    {
      q: "When do owners get paid?",
      a: "Payments are held securely in escrow during the rental period and are released to the owner's linked bank account 24 hours after the rental is successfully completed."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Help Center</h1>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input className="pl-12 h-14 text-lg rounded-full bg-secondary/20" placeholder="Search for articles, questions, or topics..." />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-secondary/10 border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-colors">
              <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
              <p className="text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Still need help?</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Our support team is available 24/7 to assist you with rentals, escrow inquiries, or technical support.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center rounded-xl px-6 h-11 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-colors text-sm"
          >
            Contact Support
          </Link>
          <Link 
            href="/disputes" 
            className="inline-flex items-center justify-center rounded-xl px-6 h-11 font-semibold border border-border bg-card hover:bg-secondary transition-colors text-sm text-foreground"
          >
            Dispute Resolution Center
          </Link>
        </div>
      </div>
    </div>
  );
}
