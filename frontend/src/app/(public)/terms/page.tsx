export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: August 17, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary">
        <h2>1. Agreement to Terms</h2>
        <p>By accessing or using the RENTABLE marketplace (&quot;Platform&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service.</p>
        
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on RENTABLE&apos;s website for personal, non-commercial transitory viewing only.</p>
        
        <h2>3. Rental Agreements</h2>
        <p>When renting an item through our Platform, a legally binding contract is formed directly between the Owner and the Borrower. RENTABLE acts solely as an intermediary platform and is not a party to the rental agreement.</p>
        
        <h2>4. User Obligations</h2>
        <ul>
          <li><strong>For Borrowers:</strong> You agree to treat rented items with care, use them only for their intended purpose, and return them in the same condition by the agreed-upon date.</li>
          <li><strong>For Owners:</strong> You agree that items listed are safe, properly maintained, and exactly as described in your listing.</li>
        </ul>
        
        <h2>5. Fees and Payments</h2>
        <p>RENTABLE charges a service fee on completed transactions. All payments must be processed through the Platform&apos;s secure payment gateway. Attempting to bypass the payment system will result in account suspension.</p>
      </div>
    </div>
  );
}
