export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: August 17, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary">
        <h2>1. Information We Collect</h2>
        <p>We collect information that you provide directly to us, including your name, email address, physical address, phone number, payment information, and identity verification documents when you register or use the platform.</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to operate, maintain, and provide the features of the Platform. This includes processing transactions, verifying user identities to maintain a secure marketplace, and communicating with you about your account or rentals.</p>
        
        <h2>3. Information Sharing</h2>
        <p>We may share your information with other users (such as sharing your first name and general location with an owner when you request an item), or with third-party service providers who perform services on our behalf (like payment processing or identity verification).</p>
        
        <h2>4. Data Security</h2>
        <p>We use commercially reasonable physical, managerial, and technical safeguards to preserve the integrity and security of your personal information. However, no method of transmission over the Internet is 100% secure.</p>
        
        <h2>5. Your Choices</h2>
        <p>You may update or correct your account information and email preferences at any time by logging into your account settings.</p>
      </div>
    </div>
  );
}
