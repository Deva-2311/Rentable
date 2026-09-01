import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">
            Have a question or need assistance? Our team is here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          <div className="md:col-span-2 space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center shrink-0 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Live Support</h3>
                <p className="text-muted-foreground text-sm">Available Mon-Fri, 9am - 5pm EST.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center shrink-0 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                <p className="text-muted-foreground text-sm">support@rentable.com<br/>We reply within 24 hours.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center shrink-0 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">HQ Address</h3>
                <p className="text-muted-foreground text-sm">123 Market Street, Suite 400<br/>San Francisco, CA 94105</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 bg-secondary/10 p-8 rounded-3xl border border-border/50">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input placeholder="John" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input placeholder="Doe" className="bg-background" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input type="email" placeholder="john@example.com" className="bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea 
                  className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <Button size="lg" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
