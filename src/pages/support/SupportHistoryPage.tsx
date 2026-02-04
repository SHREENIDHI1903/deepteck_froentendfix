import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { helpDeskApi, api } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Paperclip, MessageSquare, ChevronRight, ExternalLink, Send, User as UserIcon, Headphones } from "lucide-react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Ticket {
    id: string;
    ticket_type: string;
    subject: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed';
    priority: string;
    created_at: string;
    admin_reply?: string;
    attachments: Array<{
        file_name: string;
        file_path: string;
    }> | null;
}

interface TicketMessage {
    id: string;
    ticket_id: string;
    sender_profile_id: string | null;
    sender_type: 'user' | 'admin';
    message: string;
    created_at: string;
    sender_username?: string;
    sender_first_name?: string;
    sender_last_name?: string;
    sender_avatar?: string;
}

export default function SupportHistoryPage() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [searchParams] = useSearchParams();
    const ticketIdParam = searchParams.get('ticketId');
    const [replyMessage, setReplyMessage] = useState('');
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [showReopenConfirm, setShowReopenConfirm] = useState(false);

    const queryClient = useQueryClient();
    const { data: tickets, isLoading } = useQuery({
        queryKey: ["my-tickets"],
        queryFn: async () => {
            const res = await helpDeskApi.getMyTickets(token!);
            return res.tickets as Ticket[];
        },
        enabled: !!token,
    });

    // Fetch messages for selected ticket
    const { data: messages, isLoading: messagesLoading } = useQuery({
        queryKey: ["ticket-messages", selectedTicket?.id],
        queryFn: async () => {
            const res = await api.get(`/help-desk/${selectedTicket!.id}/messages`, token!) as { messages: TicketMessage[] };
            return res.messages;
        },
        enabled: !!selectedTicket?.id && !!token,
    });

    // Auto-open ticket from URL if available
    useEffect(() => {
        if (ticketIdParam && tickets) {
            const found = tickets.find(t => t.id === ticketIdParam);
            if (found) {
                setSelectedTicket(found);
            }
        }
    }, [ticketIdParam, tickets]);

    const closeTicketMutation = useMutation({
        mutationFn: async (ticketId: string) => {
            return api.patch(`/help-desk/${ticketId}/status`, {
                status: 'closed',
                admin_reply: 'Closed by user'
            }, token!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
            // Update the selected ticket state immediately
            if (selectedTicket) {
                setSelectedTicket({ ...selectedTicket, status: 'closed' });
            }
            toast({
                title: "Ticket closed successfully",
                description: "Your support ticket has been closed."
            });
        },
    });

    const reopenTicketMutation = useMutation({
        mutationFn: async (ticketId: string) => {
            return api.patch(`/help-desk/${ticketId}/status`, {
                status: 'open'
            }, token!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
            // Update the selected ticket state immediately
            if (selectedTicket) {
                setSelectedTicket({ ...selectedTicket, status: 'open' });
            }
            toast({
                title: "Ticket reopened successfully",
                description: "Your support ticket has been reopened. You can now send new messages."
            });
        },
    });

    const replyMutation = useMutation({
        mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
            return api.post(`/help-desk/${ticketId}/user-reply`, { message }, token!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ticket-messages", selectedTicket?.id] });
            setReplyMessage('');
            toast({ title: "Reply Sent", description: "Your message has been sent to support." });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to send reply. Please try again.", variant: "destructive" });
        }
    });

    const handleSendReply = () => {
        if (!selectedTicket || !replyMessage.trim()) return;
        replyMutation.mutate({ ticketId: selectedTicket.id, message: replyMessage.trim() });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "open": return <Badge variant="destructive" className="bg-red-500/15 text-red-600 hover:bg-red-500/25 border-none">Open</Badge>;
            case "in_progress": return <Badge variant="secondary" className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-none">In Progress</Badge>;
            case "resolved": return <Badge variant="default" className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-none">Resolved</Badge>;
            case "closed": return <Badge variant="outline" className="text-muted-foreground">Closed</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    if (isLoading) return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin h-8 w-8 text-primary mb-4" />
                <p className="text-muted-foreground">Loading your tickets...</p>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="container max-w-5xl mx-auto py-10 px-4 space-y-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Support History</h1>
                    <p className="text-muted-foreground">
                        View the status of your support requests and communicate with our team.
                    </p>
                </div>

                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>My Tickets</CardTitle>
                        <CardDescription>
                            You have {tickets?.filter(t => t.status !== 'closed').length || 0} active tickets.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {tickets && tickets.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ticket ID</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tickets.map((ticket) => (
                                        <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedTicket(ticket)}>
                                            <TableCell className="font-mono text-xs text-muted-foreground">#{ticket.id.slice(0, 8)}</TableCell>
                                            <TableCell className="font-medium">
                                                {ticket.subject}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize font-normal text-xs">{ticket.ticket_type}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {format(new Date(ticket.created_at), "MMM d, yyyy p")}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">No tickets yet</h3>
                                <p className="text-muted-foreground max-w-sm mb-4">
                                    You haven't submitted any support tickets yet. Use the help widget in the bottom right to start a conversation.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {selectedTicket && (
                    <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
                        <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] flex flex-col">
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    {getStatusBadge(selectedTicket.status)}
                                    <span className="text-xs text-muted-foreground font-mono">#{selectedTicket.id}</span>
                                </div>
                                <DialogTitle className="text-xl">{selectedTicket.subject}</DialogTitle>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    Submitted on {format(new Date(selectedTicket.created_at), "PPP p")}
                                </p>
                            </DialogHeader>

                            <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-4">
                                {/* Attachments Section */}
                                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium leading-none text-muted-foreground">Attachments</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTicket.attachments.map((att, i) => (
                                                <a
                                                    key={i}
                                                    href={att.file_path}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 text-xs bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary px-3 py-2 rounded-md transition-colors"
                                                >
                                                    <Paperclip className="h-3 w-3" />
                                                    {att.file_name}
                                                    <ExternalLink className="h-3 w-3 opacity-50" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Conversation Thread */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium leading-none text-muted-foreground">Conversation</h4>
                                    {messagesLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : messages && messages.length > 0 ? (
                                        <div className="space-y-3">
                                            {messages.map((msg) => (
                                                <div key={msg.id} className={`flex gap-3 ${msg.sender_type === 'admin' ? 'flex-row' : 'flex-row-reverse'}`}>
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender_type === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                        {msg.sender_type === 'admin' ? <Headphones className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                                                    </div>
                                                    <div className={`flex-1 space-y-1 ${msg.sender_type === 'user' ? 'text-right' : ''}`}>
                                                        <div className="flex items-center gap-2">
                                                            <p className={`text-xs font-semibold ${msg.sender_type === 'admin' ? 'text-blue-600' : 'text-emerald-600'}`}>
                                                                {msg.sender_type === 'admin' ? 'Support Team' : 'You'}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {format(new Date(msg.created_at), "MMM d, p")}
                                                            </p>
                                                        </div>
                                                        <div className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.sender_type === 'admin' ? 'bg-blue-50/50 border border-blue-100' : 'bg-emerald-50/50 border border-emerald-100'}`}>
                                                            {msg.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center p-6 bg-muted/20 rounded-lg border border-dashed">
                                            <p className="text-sm text-muted-foreground">No messages yet</p>
                                        </div>
                                    )}
                                </div>

                                {/* Reply Input */}
                                {selectedTicket.status !== 'closed' && (
                                    <div className="space-y-2 p-2 border-t">
                                        <h4 className="text-sm font-medium leading-none text-muted-foreground">Send a Reply</h4>
                                        <div className="flex gap-2">
                                            <Textarea
                                                placeholder="Type your message here..."
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                className="min-h-[80px] resize-none"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                                        handleSendReply();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-muted-foreground">Press Ctrl+Enter to send</p>
                                            <Button
                                                onClick={handleSendReply}
                                                disabled={!replyMessage.trim() || replyMutation.isPending}
                                                size="sm"
                                            >
                                                {replyMutation.isPending ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Send className="h-4 w-4 mr-2" />
                                                )}
                                                Send Reply
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {selectedTicket.status !== 'closed' && (
                                    <div className="border-t pt-4 flex justify-end">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setShowCloseConfirm(true)}
                                            disabled={closeTicketMutation.isPending}
                                        >
                                            Close Ticket
                                        </Button>

                                        <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Close this ticket?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to close this support ticket? Once closed, you won't be able to send further replies.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            closeTicketMutation.mutate(selectedTicket.id);
                                                            setShowCloseConfirm(false);
                                                        }}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Close Ticket
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}

                                {selectedTicket.status === 'closed' && (
                                    <div className="border-t pt-4 flex justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowReopenConfirm(true)}
                                            disabled={reopenTicketMutation.isPending}
                                        >
                                            Reopen Ticket
                                        </Button>

                                        <AlertDialog open={showReopenConfirm} onOpenChange={setShowReopenConfirm}>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Reopen this ticket?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to reopen this support ticket? This will allow you to send new messages and continue the conversation.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            reopenTicketMutation.mutate(selectedTicket.id);
                                                            setShowReopenConfirm(false);
                                                        }}
                                                    >
                                                        Reopen Ticket
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </Layout>
    );
}
