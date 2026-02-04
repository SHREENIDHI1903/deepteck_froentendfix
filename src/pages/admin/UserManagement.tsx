import { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, ShieldCheck, Ban, Search, MailPlus, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAdminActions, useAdminStats, useAdminUsers } from '@/hooks/useAdmin';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function UserManagement() {
  const { banUser, unbanUser, verifyExpert, inviteAdmin, isActing } = useAdminActions();
  const { data: adminStats } = useAdminStats();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const [showBanDialog, setShowBanDialog] = useState(false);
  const [userToBan, setUserToBan] = useState<any>(null);
  const [banReason, setBanReason] = useState('');

  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [userToUnban, setUserToUnban] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('pending_first');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // When sort order changes, reset to page 1
  const handleSortChange = (newSort: string) => {
    setSortOrder(newSort);
    setCurrentPage(1);
  };

  const { data: responseData, isLoading } = useAdminUsers(debouncedSearch, roleFilter, currentPage, 50, sortOrder);
  const users = responseData?.users || [];
  const pagination = responseData?.pagination;
  const totalUsers = Number((adminStats as any)?.totalUsers || 0);
  const totalUsersLabel = adminStats ? totalUsers.toLocaleString() : '—';

  const handleBanClick = (user: any) => {
    setUserToBan(user);
    setBanReason('');
    setShowBanDialog(true);
  };

  const handleUnbanClick = (user: any) => {
    setUserToUnban(user);
    setShowUnbanDialog(true);
  };

  const confirmBan = async () => {
    if (!userToBan) return;
    const success = await banUser(userToBan.id, banReason || 'Violation of Terms of Service');
    if (success) {
      setShowBanDialog(false);
      setUserToBan(null);
    }
  };

  const confirmUnban = async () => {
    if (!userToUnban) return;
    const success = await unbanUser(userToUnban.id);
    if (success) {
      setShowUnbanDialog(false);
      setUserToUnban(null);
    }
  };

  const columns = [
    {
      header: 'User',
      accessorKey: 'name' as const,
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          {item.avatar_url ? (
            <img
              src={item.avatar_url}
              alt={item.name || 'User'}
              className="h-9 w-9 rounded-full object-cover border border-zinc-200 bg-zinc-100"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-lg">
              {(item.name || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900">{item.name || 'Unknown'}</span>
            <span className="text-xs text-zinc-500">{item.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Username',
      accessorKey: 'username' as const,
      cell: (item: any) => (
        <span className="font-mono text-xs text-zinc-600">
          {item.username ? `@${item.username}` : '-'}
        </span>
      )
    },
    {
      header: 'Role',
      accessorKey: 'role' as const,
      cell: (item: any) => {
        const roles: string[] = Array.isArray(item.roles)
          ? item.roles
          : (item.role ? [String(item.role)] : []);

        const unique = Array.from(new Set(roles.map((r) => String(r).toLowerCase())));
        return (
          <div className="flex flex-wrap gap-1">
            {(unique.length ? unique : ['buyer']).map((r) => (
              <Badge key={r} variant="outline" className="capitalize">
                {r}
              </Badge>
            ))}
          </div>
        );
      }
    },
    {
      header: 'Status',
      cell: (item: any) => {
        let statusLabel = 'Active';
        let style = "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200";

        const roles: string[] = Array.isArray(item.roles)
          ? item.roles
          : (item.role ? [String(item.role)] : []);
        const isExpert = roles.map((r) => String(r).toLowerCase()).includes('expert') || Boolean(item.expert_status);

        if (item.is_banned) {
          statusLabel = 'Banned';
          style = "bg-red-50 hover:bg-red-100 text-red-700 border-red-200";
        } else if (isExpert) {
          const status = item.expert_status || 'incomplete'; // Use new field

          if (status === 'verified') {
            statusLabel = 'Verified';
            style = "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-200";
          } else if (status === 'pending_review') {
            statusLabel = 'Pending Review';
            style = "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200";
          } else if (status === 'rejected') {
            statusLabel = 'Rejected';
            style = "bg-red-50 hover:bg-red-100 text-red-700 border-red-200";
          } else {
            statusLabel = 'Incomplete';
            style = "bg-zinc-50 hover:bg-zinc-50 text-zinc-500 border-zinc-200";
          }
        }

        return (
          <Badge className={style}>
            {statusLabel}
          </Badge>
        );
      }
    },
    {
      header: 'Volume',
      cell: (item: any) => (
        <span className="font-mono text-sm">
          ₹{Number(item.volume || 0).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      header: 'Joined',
      cell: (item: any) => item.joined ? format(new Date(item.joined), 'MMM d, yyyy, h:mm a') : '-'
    },
    {
      header: 'Last Login',
      cell: (item: any) => item.last_login ? format(new Date(item.last_login), 'MMM d, h:mm a') : 'Never'
    },
    {
      header: 'Actions',
      cell: (item: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Manage User</DropdownMenuLabel>

            {/* View Profile is the primary action now */}
            <DropdownMenuItem onClick={() => window.location.href = `/admin/users/${item.id}`}>
              <Eye className="mr-2 h-4 w-4 text-zinc-500" /> View Profile Details
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {item.is_banned ? (
              <DropdownMenuItem className="text-emerald-600 focus:text-emerald-600" onClick={() => handleUnbanClick(item)} disabled={isActing}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Activate / Unban
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleBanClick(item)} disabled={isActing}>
                <Ban className="mr-2 h-4 w-4" /> Ban / Suspend
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  // Removed client-side sorting memo, using backend sorted data directly
  const displayUsers = users;


  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-900">User Governance</h1>
              <Badge variant="secondary" className="bg-zinc-100 text-zinc-700">
                Total users: {totalUsersLabel}
              </Badge>
            </div>
            <p className="text-zinc-500">Manage buyers, experts, and platform administrators.</p>
          </div>

          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button>
                <MailPlus className="mr-2 h-4 w-4" /> Invite Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New Administrator</DialogTitle>
                <DialogDescription>
                  This will create a new admin account. The user will need to reset their password to log in.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    placeholder="admin@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={async () => {
                  await inviteAdmin(inviteEmail);
                  setShowInviteDialog(false);
                  setInviteEmail('');
                }} disabled={isActing}>
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Ban Dialog */}
        <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" /> Ban User
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to ban <strong>{userToBan?.name}</strong>? This action will revoke their access immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Ban</Label>
                <Textarea
                  id="reason"
                  placeholder="e.g. Repeated TOS violations, Fraudulent activity..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowBanDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmBan} disabled={isActing}>
                {isActing ? 'Banning...' : 'Confirm Ban'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Unban Dialog */}
        <Dialog open={showUnbanDialog} onOpenChange={setShowUnbanDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" /> Unban User
              </DialogTitle>
              <DialogDescription>
                This will restore access for <strong>{userToUnban?.name}</strong> immediately.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowUnbanDialog(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={confirmUnban} disabled={isActing}>
                {isActing ? 'Activating...' : 'Confirm Reactivation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortOrder} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending_first">Pending Review First</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="last_login_recent">Last Login (Recent)</SelectItem>
                <SelectItem value="last_login_old">Last Login (Oldest)</SelectItem>
                <SelectItem value="highest_volume">Volume (High → Low)</SelectItem>
                <SelectItem value="lowest_volume">Volume (Low → High)</SelectItem>
                <SelectItem value="banned_first">Banned First</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={(val) => {
              setRoleFilter(val);
              setCurrentPage(1); // Reset to page 1 on filter
            }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="expert">Experts Only</SelectItem>
                <SelectItem value="buyer">Buyers Only</SelectItem>
                <SelectItem value="admin">Admins Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable columns={columns} data={displayUsers || []} isLoading={isLoading} />

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
          <div className="text-sm text-zinc-500">
            Showing {((currentPage - 1) * 50) + 1} to {Math.min(currentPage * 50, pagination?.total || 0)} of {pagination?.total || 0} users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination?.totalPages || 1) }, (_, i) => {
                let pageNum = i + 1;
                // Simple logic to show current page surroundings if many pages (optional improvement later)
                // For now, simple 1-5 or if current is high, shift. 
                // Let's keep it simple: just Prev/Next for now, or minimal pages.

                // Better simple logic:
                // If total pages <= 7, show all.
                // Else show 1, ..., current-1, current, current+1, ..., last.
                // For MVP per request "page 1, 2 etc":

                // Simplified: Just show current page params for now to avoid complex logic in one go
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {(pagination?.totalPages || 0) > 5 && <span className="text-zinc-400">...</span>}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(pagination?.totalPages || 1, p + 1))}
              disabled={currentPage === (pagination?.totalPages || 1) || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}