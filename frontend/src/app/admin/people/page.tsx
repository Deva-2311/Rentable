'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Shield, Ban, CheckCircle, Eye, X, Phone, Mail, Calendar, UserCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { useAdminUsers, useAdminToggleUserStatus } from '@/features/admin/api/useAdminDashboard';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'react-hot-toast';

export default function PeopleManagementPage() {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ user: any; action: 'suspend' | 'activate' } | null>(null);

  const { data: users, isLoading } = useAdminUsers();
  const toggleStatusMutation = useAdminToggleUserStatus();

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((u: any) => {
      // Role filter
      if (roleFilter !== 'all' && u.role?.toLowerCase() !== roleFilter.toLowerCase()) {
        return false;
      }
      // Status filter
      if (statusFilter === 'active' && !u.isActive) return false;
      if (statusFilter === 'suspended' && u.isActive) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const nameMatch = u.fullName?.toLowerCase().includes(query);
        const emailMatch = u.email?.toLowerCase().includes(query);
        const phoneMatch = u.phone?.toLowerCase().includes(query);
        const idMatch = u._id?.toLowerCase().includes(query);
        return nameMatch || emailMatch || phoneMatch || idMatch;
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, searchTerm]);

  const initiateToggleStatus = (targetUser: any) => {
    // Prevent self-suspension
    if (currentUser?._id && String(currentUser._id) === String(targetUser._id) && targetUser.isActive) {
      toast.error('You cannot suspend your own administrative account');
      return;
    }
    const action = targetUser.isActive ? 'suspend' : 'activate';
    setConfirmAction({ user: targetUser, action });
  };

  const handleConfirmToggle = async () => {
    if (!confirmAction) return;
    const { user: targetUser, action } = confirmAction;
    try {
      await toggleStatusMutation.mutateAsync({ id: targetUser._id, action });
      toast.success(`User ${targetUser.fullName || targetUser.email} ${action === 'suspend' ? 'suspended' : 'activated'} successfully`);
      if (selectedUser && selectedUser._id === targetUser._id) {
        setSelectedUser({ ...selectedUser, isActive: action === 'activate' });
      }
      setConfirmAction(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || `Failed to ${action} user`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">People Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage borrowers, owners, admins, and account access permissions.</p>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex space-x-1 border-b border-border">
        {[
          { key: 'all', label: 'All Users' },
          { key: 'borrower', label: 'Borrowers' },
          { key: 'owner', label: 'Owners' },
          { key: 'admin', label: 'Administrators' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setRoleFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              roleFilter === tab.key
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, or ID..."
            className="w-full bg-secondary/50 border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter users by account status"
            className="bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/60 border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Registered</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Loading users from MongoDB...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No users match your criteria</td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user._id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center mr-3 font-semibold text-xs text-primary shrink-0 uppercase border border-border">
                          {user.fullName ? user.fullName.substring(0, 2) : (user.email ? user.email.substring(0, 2) : 'U')}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{user.fullName || 'Nameless User'}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                          {user.phone && <div className="text-[11px] text-muted-foreground">{user.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${
                        user.role?.toLowerCase() === 'admin'
                          ? 'bg-purple-500/15 text-purple-800 border border-purple-500/20'
                          : user.role?.toLowerCase() === 'owner'
                          ? 'bg-blue-500/15 text-blue-800 border border-blue-500/20'
                          : 'bg-secondary text-foreground border border-border'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-800 border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-red-500/15 text-red-800 border border-red-500/20">
                          <Ban className="w-3 h-3 mr-1" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-xs text-primary hover:text-primary/80 transition-colors px-2.5 py-1.5 border border-border rounded-md hover:bg-secondary flex items-center gap-1 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                        {currentUser?._id && String(currentUser._id) === String(user._id) ? (
                          <span className="text-[11px] font-semibold text-muted-foreground bg-secondary px-2.5 py-1.5 rounded-md border border-border">
                            Current Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => initiateToggleStatus(user)}
                            disabled={toggleStatusMutation.isPending}
                            className={`text-xs px-2.5 py-1.5 border rounded-md font-medium transition-colors disabled:opacity-50 ${
                              user.isActive
                                ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                                : 'border-emerald-600/30 text-emerald-800 hover:bg-emerald-500/10'
                            }`}
                          >
                            {user.isActive ? 'Suspend' : 'Reactivate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Real Count Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div>Showing {filteredUsers.length} of {users?.length || 0} registered accounts</div>
        </div>
      </div>

      {/* Inspect User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-lg text-primary border border-border">
                  {selectedUser.fullName ? selectedUser.fullName.substring(0, 2).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedUser.fullName || 'User Profile'}</h3>
                  <p className="text-xs text-muted-foreground font-mono">ID: {selectedUser._id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-secondary/40 p-3 rounded-lg border border-border">
                <span className="text-xs uppercase text-muted-foreground block mb-1">Email Address</span>
                <span className="font-medium text-foreground flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                  {selectedUser.email}
                </span>
              </div>
              <div className="bg-secondary/40 p-3 rounded-lg border border-border">
                <span className="text-xs uppercase text-muted-foreground block mb-1">Phone Number</span>
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                  {selectedUser.phone || 'Not provided'}
                </span>
              </div>
              <div className="bg-secondary/40 p-3 rounded-lg border border-border">
                <span className="text-xs uppercase text-muted-foreground block mb-1">Role</span>
                <span className="font-semibold uppercase tracking-wider text-primary">
                  {selectedUser.role}
                </span>
              </div>
              <div className="bg-secondary/40 p-3 rounded-lg border border-border">
                <span className="text-xs uppercase text-muted-foreground block mb-1">Status</span>
                <span className={selectedUser.isActive ? 'text-emerald-800 font-semibold' : 'text-red-700 font-semibold'}>
                  {selectedUser.isActive ? 'Active' : 'Suspended'}
                </span>
              </div>
              <div className="bg-secondary/40 p-3 rounded-lg border border-border">
                <span className="text-xs uppercase text-muted-foreground block mb-1">Joined Date</span>
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="bg-secondary/40 p-3 rounded-lg border border-border">
                <span className="text-xs uppercase text-muted-foreground block mb-1">Wallet Balance</span>
                <span className="font-medium text-foreground">
                  ₹{selectedUser.walletBalance !== undefined ? selectedUser.walletBalance.toLocaleString() : '0'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border">
              {currentUser?._id && String(currentUser._id) === String(selectedUser._id) ? (
                <span className="px-3 py-1.5 text-xs font-semibold bg-secondary text-muted-foreground border border-border rounded-md">
                  Your Account (Cannot Suspend Self)
                </span>
              ) : (
                <button
                  onClick={() => initiateToggleStatus(selectedUser)}
                  disabled={toggleStatusMutation.isPending}
                  className={`px-4 py-2 text-xs font-semibold rounded-md border transition-colors ${
                    selectedUser.isActive
                      ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                      : 'border-emerald-600/30 text-emerald-800 hover:bg-emerald-500/10'
                  }`}
                >
                  {selectedUser.isActive ? 'Suspend User' : 'Reactivate User'}
                </button>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-semibold bg-secondary text-foreground border border-border rounded-md hover:bg-secondary/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Status Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                confirmAction.action === 'suspend' ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/15 text-emerald-800'
              }`}>
                {confirmAction.action === 'suspend' ? <AlertTriangle className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {confirmAction.action === 'suspend' ? 'Confirm User Suspension' : 'Confirm User Reactivation'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {confirmAction.action === 'suspend'
                    ? 'Temporarily disable user access and privileges'
                    : 'Restore full marketplace and login access'}
                </p>
              </div>
            </div>

            <div className="bg-secondary/40 p-4 rounded-xl border border-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs uppercase font-medium">User:</span>
                <span className="font-semibold text-foreground">{confirmAction.user.fullName || 'Nameless User'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs uppercase font-medium">Email:</span>
                <span className="text-xs text-foreground font-mono">{confirmAction.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs uppercase font-medium">Role:</span>
                <span className="font-semibold text-primary uppercase text-xs">{confirmAction.user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs uppercase font-medium">Current Status:</span>
                <span className={`text-xs font-semibold ${confirmAction.user.isActive ? 'text-emerald-800' : 'text-destructive'}`}>
                  {confirmAction.user.isActive ? 'Active' : 'Suspended'}
                </span>
              </div>
            </div>

            <div className={`p-3 rounded-lg text-xs leading-relaxed border ${
              confirmAction.action === 'suspend'
                ? 'bg-destructive/10 border-destructive/20 text-destructive'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800'
            }`}>
              {confirmAction.action === 'suspend' ? (
                <>
                  <strong>Access Revocation:</strong> Suspending this account will immediately revoke login access, block active sessions, and freeze all product listings and booking abilities. This action can be reversed at any time.
                </>
              ) : (
                <>
                  <strong>Access Restoration:</strong> Reactivating this account will restore full marketplace access, allowing the user to sign in, rent gear, or manage items immediately.
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                disabled={toggleStatusMutation.isPending}
                className="px-4 py-2 text-xs font-semibold bg-secondary text-foreground border border-border rounded-md hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmToggle}
                disabled={toggleStatusMutation.isPending}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-colors disabled:opacity-50 ${
                  confirmAction.action === 'suspend'
                    ? 'bg-destructive text-white hover:bg-destructive/90'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {toggleStatusMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {toggleStatusMutation.isPending
                  ? 'Processing...'
                  : confirmAction.action === 'suspend'
                  ? 'Confirm Suspension'
                  : 'Confirm Reactivation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
