'use client';

import React, { useState } from 'react';
import { Save, ShieldAlert, Globe, CreditCard, Mail, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'fees' | 'security' | 'notifications'>('general');
  const [platformName, setPlatformName] = useState('RENTABLE');
  const [supportEmail, setSupportEmail] = useState('support@rentable.com');
  const [platformFee, setPlatformFee] = useState(10);
  const [taxRate, setTaxRate] = useState(18);
  const [securityDepositHoldDays, setSecurityDepositHoldDays] = useState(7);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuration saved to active admin session');
  };

  const handleToggleMaintenance = () => {
    if (!maintenanceMode) {
      if (confirm('Enable Maintenance Mode? Only administrators will be able to perform operations.')) {
        setMaintenanceMode(true);
        toast.success('Maintenance mode flag set for active session');
      }
    } else {
      setMaintenanceMode(false);
      toast.success('Marketplace is now live to all users');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">System & Platform Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure marketplace policies, fees, escrow defaults, and platform identity (Admin Session Scope).
          </p>
        </div>
        <button
          onClick={handleSave}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-1.5">
          {[
            { id: 'general', label: 'General', icon: Globe },
            { id: 'fees', label: 'Fees & Escrow', icon: CreditCard },
            { id: 'security', label: 'Security & Auth', icon: Lock },
            { id: 'notifications', label: 'Alerts', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors border ${
                  isActive
                    ? 'bg-secondary text-primary border-primary/30 shadow-xs'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {activeTab === 'general' && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-bold font-heading text-foreground border-b border-border pb-3">
                Platform Identity & Support
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Platform Brand Name</label>
                  <input
                    type="text"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Contact & Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Operating Currency</label>
                  <input
                    type="text"
                    disabled
                    value="INR (₹) - Indian Rupee"
                    className="w-full bg-secondary/60 border border-border rounded-lg px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-bold font-heading text-foreground border-b border-border pb-3">
                Financial Escrow & Platform Commission
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Platform Commission Rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={platformFee}
                    onChange={(e) => setPlatformFee(Number(e.target.value))}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Charged to borrowers on booking checkout.</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">GST / Applicable Tax Rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Included in itemized rental invoice breakdown.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Deposit Escrow Release Window (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={securityDepositHoldDays}
                    onChange={(e) => setSecurityDepositHoldDays(Number(e.target.value))}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Days after rental return before security deposit is automatically unlocked if no dispute is opened.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-bold font-heading text-foreground border-b border-border pb-3">
                Security & Authentication Policies
              </h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 bg-secondary/50 rounded-lg border border-border">
                  <div>
                    <span className="font-semibold text-foreground text-sm block">JWT Token Expiry</span>
                    <span className="text-muted-foreground">Admin and user session length</span>
                  </div>
                  <span className="font-mono text-primary font-semibold text-xs">7 Days</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-secondary/50 rounded-lg border border-border">
                  <div>
                    <span className="font-semibold text-foreground text-sm block">Role-Based Access Control</span>
                    <span className="text-muted-foreground">Guarded by NestJS RolesGuard & JwtAuthGuard</span>
                  </div>
                  <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">Active & Enforced</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-secondary/50 rounded-lg border border-border">
                  <div>
                    <span className="font-semibold text-foreground text-sm block">Audit Trail Collection</span>
                    <span className="text-muted-foreground">Immutable MongoDB records for administrative actions</span>
                  </div>
                  <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">Logging Active</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-bold font-heading text-foreground border-b border-border pb-3">
                System Alerts & Event Notifications
              </h3>
              
              <div className="space-y-3 text-xs">
                {[
                  { title: 'New Product Submissions', desc: 'Notify admins when an owner submits equipment for listing approval' },
                  { title: 'Payment Declines', desc: 'Alert finance admins upon high-frequency payment gateway failures' },
                  { title: 'Dispute Escalations', desc: 'Trigger high-priority alert when a rental return condition dispute is filed' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-secondary/40 rounded-lg border border-border">
                    <div>
                      <span className="font-semibold text-foreground text-sm block">{item.title}</span>
                      <span className="text-muted-foreground">{item.desc}</span>
                    </div>
                    <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">Enabled</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-card border border-destructive/30 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold font-heading text-destructive mb-4 border-b border-destructive/20 pb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> Platform Safety Controls
            </h3>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-foreground">Maintenance Mode</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Temporarily restricts borrower checkout. Administrators retain full access.
                </div>
              </div>
              <button
                onClick={handleToggleMaintenance}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-lg border transition-colors ${
                  maintenanceMode
                    ? 'bg-destructive text-destructive-foreground border-destructive'
                    : 'border-destructive/40 text-destructive hover:bg-destructive/10'
                }`}
              >
                {maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

