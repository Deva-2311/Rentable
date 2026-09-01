export default function CancellationPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Cancellation Policy</h1>
        <p className="text-muted-foreground">Last updated: August 17, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary">
        <h2>Understanding Cancellations on RENTABLE</h2>
        <p>We understand that plans change. Our cancellation policies are designed to be fair to both Borrowers, who may have unforeseen circumstances, and Owners, who reserve their items and turn down other potential renters.</p>
        
        <h2>Borrower Cancellations</h2>
        <ul>
          <li><strong>More than 48 hours before rental start:</strong> Full refund minus a small processing fee.</li>
          <li><strong>24 to 48 hours before rental start:</strong> 50% refund of the rental fee. The RENTABLE service fee is non-refundable.</li>
          <li><strong>Less than 24 hours before rental start:</strong> No refund for the rental fee. The RENTABLE service fee is non-refundable.</li>
        </ul>
        
        <h2>Owner Cancellations</h2>
        <p>If an Owner cancels a confirmed booking, the Borrower will receive a full 100% refund immediately.</p>
        <p>Owners who cancel frequently or without valid reason may face penalties, including demotion in search rankings, temporary suspension, or permanent removal from the Platform, to maintain trust in our marketplace.</p>
        
        <h2>Extenuating Circumstances</h2>
        <p>If you need to cancel due to severe weather, natural disasters, or other serious unforeseen circumstances, please contact our Support team immediately. We review these on a case-by-case basis and may override the standard policy.</p>
      </div>
    </div>
  );
}
