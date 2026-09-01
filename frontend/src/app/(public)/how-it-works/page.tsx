import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">How RENTABLE Works</h1>
        <p className="text-xl text-muted-foreground">
          Whether you need something for a weekend project or want to earn money from items gathering dust, we make it simple and secure.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
        {/* For Borrowers */}
        <div>
          <div className="bg-primary/10 w-fit px-4 py-1.5 rounded-full text-primary font-semibold mb-6">
            For Renters
          </div>
          <h2 className="text-3xl font-bold mb-8">Rent what you need</h2>
          
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-xl font-bold shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Find your item</h3>
                <p className="text-muted-foreground">Search our extensive catalog for the exact item you need. Filter by location, price, and availability dates.</p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-xl font-bold shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Request to book</h3>
                <p className="text-muted-foreground">Select your dates and send a request. Once approved by the owner, your secure payment is held in escrow.</p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-xl font-bold shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Pick up and enjoy</h3>
                <p className="text-muted-foreground">Meet the owner to grab the item, or have it delivered. Use it for your project, then return it safely.</p>
              </div>
            </div>
          </div>
          
          <Button className="mt-10 rounded-full px-8" size="lg">Explore Rentals</Button>
        </div>

        {/* For Owners */}
        <div>
          <div className="bg-purple-500/10 w-fit px-4 py-1.5 rounded-full text-purple-500 font-semibold mb-6">
            For Owners
          </div>
          <h2 className="text-3xl font-bold mb-8">Earn from your items</h2>
          
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-xl font-bold shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">List for free</h3>
                <p className="text-muted-foreground">Upload photos, set your daily price, and establish your own rules. Listing takes less than 5 minutes.</p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-xl font-bold shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Approve requests</h3>
                <p className="text-muted-foreground">Review borrower profiles and accept requests that work for you. You&apos;re always in control of who rents your gear.</p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-xl font-bold shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get paid securely</h3>
                <p className="text-muted-foreground">Payments are processed securely. Your items are protected by our RENTABLE Guarantee during every rental.</p>
              </div>
            </div>
          </div>
          
          <Button variant="secondary" className="mt-10 rounded-full px-8" size="lg">List an Item</Button>
        </div>
      </div>
    </div>
  );
}
