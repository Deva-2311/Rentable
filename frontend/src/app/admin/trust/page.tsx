'use client';

import React, { useState, useMemo } from 'react';
import { Search, Shield, Filter, Clock, Activity, User, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAdminAuditLogs } from '@/features/admin/api/useAdminDashboard';

export default function TrustAndSafetyPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const { data: auditLogs, isLoading } = useAdminAuditLogs();

  const filteredLogs = useMemo(() => {
    if (!auditLogs) return [];
    return auditLogs.filter((log: any) => {
      if (actionFilter !== 'all' && log.action !== actionFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const adminObj = log.adminId || log.admin;
        const actorName = adminObj?.fullName?.toLowerCase() || '';
        const actorEmail = adminObj?.email?.toLowerCase() || '';
        const targetType = log.targetType?.toLowerCase() || '';
        const targetId = log.targetId?.toString()?.toLowerCase() || '';
        const reason = log.reason?.toLowerCase() || '';
        return actorName.includes(q) || actorEmail.includes(q) || targetType.includes(q) || targetId.includes(q) || reason.includes(q);
      }
      return true;
    });
  }, [auditLogs, actionFilter, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trust, Safety & Audit Trail</h1>
          <p className="text-muted-foreground text-sm mt-1">Immutable administrative change log and compliance monitoring.</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by admin name, target ID, action..."
            className="w-full bg-secondary/50 border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            aria-label="Filter audit logs by action type"
            className="bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Actions</option>
            <option value="BOOKING_STATUS_TRANSITION">Booking Status Transitions</option>
            <option value="USER_SUSPENDED">User Suspensions</option>
            <option value="USER_ACTIVATED">User Activations</option>
            <option value="PRODUCT_AVAILABILITY_TOGGLED">Product Visibility Toggles</option>
            <option value="PRODUCT_UPDATED">Product Edits</option>
            <option value="CATEGORY_CREATED">Category Created</option>
            <option value="CATEGORY_UPDATED">Category Updated</option>
            <option value="CATEGORY_DELETED">Category Deleted</option>
            <option value="REVIEW_DELETED">Review Moderations</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/60 border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Administrator</th>
                <th className="p-4 font-medium">Action Performed</th>
                <th className="p-4 font-medium">Target Entity</th>
                <th className="p-4 font-medium">Reason / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Loading live audit trail...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No administrative audit records found matching criteria
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: any) => (
                  <tr key={log._id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
                      {new Date(log.timestamp || log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-secondary text-primary border border-border flex items-center justify-center text-xs font-bold uppercase">
                          {(log.adminId?.fullName || log.admin?.fullName || 'Admin').substring(0, 1)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{log.adminId?.fullName || log.admin?.fullName || 'Administrator'}</div>
                          <div className="text-[11px] text-muted-foreground">{log.adminId?.email || log.admin?.email || log.adminRole || 'System'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                        log.action?.includes('SUSPEND') || log.action?.includes('REJECT')
                          ? 'bg-red-500/15 text-red-800 border border-red-500/20'
                          : log.action?.includes('ACTIVATE') || log.action?.includes('CONFIRM')
                          ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/20'
                          : 'bg-secondary text-foreground border border-border'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-xs font-mono">
                      <span className="text-muted-foreground uppercase">{log.targetType}: </span>
                      <span className="text-foreground font-semibold">{log.targetId?.substring(0, 12)}...</span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground max-w-md">
                      {log.reason ? (
                        <span className="text-foreground italic">&quot;{log.reason}&quot;</span>
                      ) : (
                        <span className="text-muted-foreground/60">No explicit note recorded</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div>Displaying {filteredLogs.length} audit trail event(s)</div>
          <div className="flex items-center gap-1.5 text-primary font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> MongoDB Audit Collection Active
          </div>
        </div>
      </div>
    </div>
  );
}
