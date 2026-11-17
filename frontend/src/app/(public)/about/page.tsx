export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">About RENTABLE</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We are on a mission to reduce overconsumption by making access to high-quality products easy, secure, and affordable.
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-secondary/30 p-8 md:p-16 mb-16 border border-border/50">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
          <p>
            RENTABLE started with a simple realization: our homes are filled with incredible tools, gear, and equipment that we only use a few times a year. Meanwhile, our neighbors are buying those exact same items for a single weekend project.
          </p>
          <p>
            We built this platform to bridge that gap. By connecting people who have things with people who need things, we&apos;re building a more sustainable, community-driven economy.
          </p>
          <p>
            Today, RENTABLE is the premier marketplace for renting everything from high-end cameras to heavy-duty power tools, all backed by secure payments and verified users.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-card border border-border/50 p-8 rounded-2xl">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-6"></div>
          <h3 className="text-xl font-bold mb-3">Sustainability</h3>
          <p className="text-muted-foreground">Renting reduces manufacturing demand and keeps perfectly good items out of landfills.</p>
        </div>
        <div className="bg-card border border-border/50 p-8 rounded-2xl">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full mb-6"></div>
          <h3 className="text-xl font-bold mb-3">Community</h3>
          <p className="text-muted-foreground">We foster trust and connection between neighbors through shared resources.</p>
        </div>
        <div className="bg-card border border-border/50 p-8 rounded-2xl">
          <div className="w-12 h-12 bg-amber-500/20 rounded-full mb-6"></div>
          <h3 className="text-xl font-bold mb-3">Security</h3>
          <p className="text-muted-foreground">Every user is verified and every transaction is protected by our secure escrow system.</p>
        </div>
      </div>
    </div>
  );
}
