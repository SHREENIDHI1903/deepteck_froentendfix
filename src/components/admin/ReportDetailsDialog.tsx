import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  User,
  Clock,
  ShieldAlert,
  CheckCircle,
  Ban,
  FileText,
  ExternalLink
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAdminUser } from "@/hooks/useAdmin";
import { useState } from "react";

interface ReportDetailsDialogProps {
  report: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss: (id: string) => void;
  onAction: (id: string, action: string) => void;
  isActing: boolean;
}

const UserInfoDisplay = ({ userId, label, role }: { userId: string; label: string, role?: string }) => {
  const { data: user, isLoading } = useAdminUser(userId);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
        <User className="h-3 w-3" /> {label}
      </h4>
      <div className="bg-zinc-50 p-3 rounded-md border border-zinc-100">
        {isLoading ? (
          <div className="h-10 flex items-center text-xs text-zinc-400">Loading...</div>
        ) : user ? (
          <div>
            <div className="flex justify-between items-start">
              <p className="font-medium text-sm text-zinc-900">{user.first_name} {user.last_name}</p>
            </div>
            <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
            <p className="text-[10px] text-zinc-400 mt-1 font-mono">{userId}</p>
          </div>
        ) : (
          <p className="text-sm text-zinc-500 italic">Unknown User</p>
        )}
      </div>
    </div>
  );
};

export function ReportDetailsDialog({
  report,
  open,
  onOpenChange,
  onDismiss,
  onAction,
  isActing
}: ReportDetailsDialogProps) {
  const [note, setNote] = useState("");

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold leading-tight flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-zinc-500" />
                Report Details
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Submitted {formatDistanceToNow(new Date(report.created_at))} ago
                </span>
              </div>
            </div>
            <Badge variant="outline" className={`capitalize text-sm px-3 py-1 ${report.type === 'harassment' ? 'border-red-200 text-red-700 bg-red-50' :
              report.type === 'scam' ? 'border-purple-200 text-purple-700 bg-purple-50' : 'bg-gray-50'
              }`}>
              {report.type}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <UserInfoDisplay userId={report.reporter_id} label="Reporter" />
              <UserInfoDisplay userId={report.reported_id} label="Reported User" />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Description
              </h4>
              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {report.description}
              </div>
            </div>

            {report.evidence && Array.isArray(report.evidence) && report.evidence.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-zinc-900">Evidence</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {report.evidence.map((item: any, idx: number) => {
                    const url = typeof item === 'string' ? item : item?.url;
                    if (!url) return null;

                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square bg-zinc-100 rounded-md overflow-hidden border border-zinc-200 block"
                      >
                        <img
                          src={url}
                          alt={`Evidence ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center');
                            const icon = document.createElement('div');
                            icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text h-8 w-8 text-zinc-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>';
                            (e.target as HTMLImageElement).parentElement?.appendChild(icon);
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <ExternalLink className="absolute top-2 right-2 h-4 w-4 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {report.status !== 'pending' && report.resolution_note && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-zinc-900">Resolution Note</h4>
                <p className="text-sm text-zinc-600 italic border-l-2 border-zinc-300 pl-3">
                  "{report.resolution_note}"
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter className="p-6 bg-zinc-50/50 flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {report.status === 'pending' ? (
            <>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <div className="flex-1" />
              <Button
                variant="outline"
                onClick={() => { onDismiss(report.id); onOpenChange(false); }}
                disabled={isActing}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Dismiss
              </Button>
              <Button
                variant="default"
                className="bg-amber-600 hover:bg-amber-700 gap-2"
                onClick={() => {
                  const message = prompt('Enter a warning message for the user:', 'Please adhere to our community guidelines.');
                  if (message) {
                    onAction(report.id, `warning:${message.trim()}`);
                    onOpenChange(false);
                  }
                }}
                disabled={isActing}
              >
                <ShieldAlert className="h-4 w-4" />
                Warn
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                disabled={isActing}
                onClick={async () => {
                  let days = prompt('Suspend user for how many days?', '7');
                  if (days && !isNaN(Number(days)) && Number(days) > 0) {
                    onAction(report.id, `suspend:${days}`);
                    onOpenChange(false);
                  }
                }}
              >
                <ShieldAlert className="h-4 w-4 text-blue-600" />
                Suspend
              </Button>
              <Button
                variant="destructive"
                className="gap-2"
                onClick={() => { onAction(report.id, 'ban'); onOpenChange(false); }}
                disabled={isActing}
              >
                <Ban className="h-4 w-4" />
                Ban User
              </Button>
            </>
          ) : (
            <Button className="w-full" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}