import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { useSubmitReport } from '@/hooks/useReports';

import { reportsApi } from '@/lib/api'; // Added import

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportedId: string;
  reportedName: string;
  type?: 'user' | 'project';
}

export function ReportDialog({
  open,
  onOpenChange,
  reportedId,
  reportedName,
  type = 'user'
}: ReportDialogProps) {
  const submitReport = useSubmitReport();
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false); // Added
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]); // Added

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Added
    if (e.target.files) {
      setEvidenceFiles(Array.from(e.target.files).slice(0, 3));
    }
  };

  const handleSubmit = async () => {
    if (!reason || !description) return;

    // Map non-standard reasons to DB-supported types
    const apiType = (reason === 'inappropriate' || reason === 'other') ? 'other' : reason;
    const finalReason = reason === 'inappropriate' ? 'Inappropriate Content' : reason;

    // Construct description with clear context
    const contextPrefix = `[Reported ${type === 'user' ? 'User' : 'Project'}: ${reportedName}]`;
    const reasonPrefix = reason === 'inappropriate' ? `[Reason: ${finalReason}]` : '';
    const finalDescription = `${contextPrefix} ${reasonPrefix} ${description}`.trim();

    try {
      setUploading(true); // Added
      const evidenceUrls: string[] = []; // Added
      const token = localStorage.getItem('token'); // Added

      if (token && evidenceFiles.length > 0) { // Added
        for (const file of evidenceFiles) {
          try {
            const res = await reportsApi.uploadEvidence(token, file);
            if (res.success) evidenceUrls.push(res.data.url);
          } catch (err) {
            console.error("Failed to upload evidence", err);
          }
        }
      }

      await submitReport.mutateAsync({
        reportedId,
        type: apiType,
        description: finalDescription,
        evidence: evidenceUrls.length > 0 ? evidenceUrls : undefined, // Modified
      });

      setReason('');
      setDescription('');
      setEvidenceFiles([]); // Modified
      onOpenChange(false);
    } catch (error) { // Added
      console.error(error);
    } finally { // Added
      setUploading(false); // Added
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Report {type === 'user' ? 'User' : 'Project'}
          </DialogTitle>
          <DialogDescription>
            Report <strong>{reportedName}</strong> for violating community guidelines.
            This report will be reviewed by our safety team.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Reason for reporting</Label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scam">Scam / Fraudulent Activity</SelectItem>
                <SelectItem value="harassment">Harassment / Abusive Behavior</SelectItem>
                <SelectItem value="spam">Spam / Advertising</SelectItem>
                <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                <SelectItem value="other">Other Violation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Please provide specific details about the violation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-32 resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label>Evidence (Screenshots/Images) - Max 3</Label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={handleFileChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {evidenceFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {evidenceFiles.map((file, idx) => (
                  <div key={idx} className="relative group aspect-square bg-zinc-100 rounded-md overflow-hidden border border-zinc-200">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 font-medium p-1 text-center break-words">
                        {file.name}
                      </div>
                    )}
                    <button
                      onClick={() => setEvidenceFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 opacity-100 transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!reason || !description || submitReport.isPending || uploading}
          >
            {(submitReport.isPending || uploading) ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? 'Uploading...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}