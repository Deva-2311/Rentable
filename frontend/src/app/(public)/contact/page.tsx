"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MessageSquare, MapPin, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    // Simulate support ticket submission / network request
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Support ticket created. Our team will contact you shortly.");
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">
            Have a question, dispute concern, or need rental assistance? We are here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-2 space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-foreground">Live Support</h3>
                <p className="text-muted-foreground text-sm">Available Mon-Fri, 9am - 7pm IST.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-foreground">Email Us</h3>
                <p className="text-muted-foreground text-sm">support@rentable.com<br/>Priority responses within 4 hours.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-foreground">Operations Center</h3>
                <p className="text-muted-foreground text-sm">KRCE Campus Hub, Sem V<br/>Tiruchirappalli, Tamil Nadu</p>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Dispute Case?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If you have an active rental issue, damage claim, or security deposit hold, file a formal dispute directly in the Dispute Resolution Center.
              </p>
              <Link href="/disputes" className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-colors">
                <span>Go to Dispute Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-3 bg-card p-8 rounded-3xl border border-border shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-foreground">Message Received</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{form.firstName}</strong>. A support ticket has been dispatched to our desk. We will respond to <strong>{form.email}</strong> shortly.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ firstName: "", lastName: "", email: "", subject: "General Inquiry", message: "" });
                  }}
                  className="mt-4"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name *</label>
                    <Input
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="Jane"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</label>
                    <Input
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Doe"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address *</label>
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
                  <Input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Rental question, Escrow, Verification..."
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message *</label>
                  <textarea 
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-3 rounded-lg border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Please explain how our support team can assist you..."
                  />
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full font-semibold">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Ticket...
                    </>
                  ) : (
                    "Send Support Message"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

