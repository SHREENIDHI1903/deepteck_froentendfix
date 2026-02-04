import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRespondToInvitation } from '@/hooks/useInvitations';
import { formatDistanceToNow, format } from 'date-fns';
import { Check, X, Clock, Briefcase, Filter, ArrowUpDown, Loader2, MessageSquare, ChevronRight, Calendar, TrendingUp, CheckCircle2, XCircle, AlertCircle, Mail, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';

export default function IncomingInvitations({ invitations, isLoading }: { invitations: any[], isLoading: boolean }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { convertAndFormat } = useCurrency();
  const respondMutation = useRespondToInvitation();
  
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [sortOrder, setSortOrder] = useState<string>('newest');

  const handleResponse = async (invitationId: string, status: 'accepted' | 'declined') => {
    try {
      const response: any = await respondMutation.mutateAsync({ invitationId, status });
      toast({
        title: status === 'accepted' ? 'Invitation Accepted' : 'Invitation Declined',
        description: status === 'accepted' ? 'Redirecting to contract setup...' : 'The client will be notified.',
        variant: status === 'accepted' ? 'default' : 'destructive',
      });
      if (status === 'accepted') {
        navigate(response?.contractId ? `/contracts/${response.contractId}` : '/contracts');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to process request.', variant: 'destructive' });
    }
  };

  const filteredList = invitations
    .filter(inv => statusFilter === 'all' ? true : inv.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const getPaymentDetails = (invitation: any) => {
    const terms = typeof invitation.payment_terms === 'string' 
      ? JSON.parse(invitation.payment_terms) 
      : (invitation.payment_terms || {});
    
    const currency = terms.currency || invitation.project?.currency || 'INR';
    const model = invitation.engagement_model || 'fixed';
    
    // Parse payment terms based on engagement model
    if (model === 'hourly') {
      return {
        amount: terms.hourly_rate || 0,
        label: '/hr',
        subLabel: 'Hourly Rate',
        currency,
        duration: terms.estimated_hours ? `${terms.estimated_hours} hrs` : null,
      };
    }
    
    if (model === 'sprint') {
      return {
        amount: terms.sprint_rate || 0,
        label: '/sprint',
        subLabel: 'Per Sprint',
        currency,
        duration: terms.total_sprints ? `${terms.total_sprints} sprints` : null,
        sprintDays: terms.sprint_duration_days ? `${terms.sprint_duration_days} days/sprint` : null,
      };
    }
    
    if (model === 'daily') {
      return {
        amount: terms.daily_rate || 0,
        label: '/day',
        subLabel: 'Daily Rate',
        currency,
        duration: terms.total_days ? `${terms.total_days} days` : null,
      };
    }
    
    // Fixed price
    return {
      amount: terms.total_amount || invitation.project?.budget_min || 0,
      label: '',
      subLabel: 'Fixed Price',
      currency,
      duration: null,
    };
  };

  const getEngagementIcon = (model: string) => {
    const variants: Record<string, { icon: any, bg: string, iconColor: string }> = {
      hourly: { icon: Clock, bg: 'bg-blue-50 border-blue-200', iconColor: 'text-blue-600' },
      sprint: { icon: TrendingUp, bg: 'bg-purple-50 border-purple-200', iconColor: 'text-purple-600' },
      daily: { icon: Calendar, bg: 'bg-orange-50 border-orange-200', iconColor: 'text-orange-600' },
      fixed: { icon: Briefcase, bg: 'bg-green-50 border-green-200', iconColor: 'text-green-600' },
    };
    return variants[model] || variants.fixed;
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'accepted': 
        return {
          badge: <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 border-emerald-300 border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            Accepted
          </Badge>,
          accent: 'from-emerald-500 to-teal-500'
        };
      case 'declined': 
        return {
          badge: <Badge className="bg-gradient-to-r from-red-100 to-rose-100 text-red-700 hover:from-red-100 hover:to-rose-100 border-red-300 border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm">
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            Declined
          </Badge>,
          accent: 'from-red-500 to-rose-500'
        };
      default: 
        return {
          badge: null,
          accent: 'from-indigo-500 via-purple-500 to-pink-500'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500 h-10 w-10 mb-4" />
        <p className="text-zinc-500 text-sm">Loading invitations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Incoming Invitations</h2>
          <p className="text-zinc-500 text-sm mt-1">
            {filteredList.length} {filteredList.length === 1 ? 'invitation' : 'invitations'} found
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-[160px] bg-white border-zinc-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 shadow-sm hover:border-zinc-300 transition-colors">
              <Filter className="h-4 w-4 mr-2 text-zinc-500" /> 
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-10 w-[160px] bg-white border-zinc-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 shadow-sm hover:border-zinc-300 transition-colors">
              <ArrowUpDown className="h-4 w-4 mr-2 text-zinc-500" /> 
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty State */}
      {filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 rounded-2xl bg-gradient-to-b from-zinc-50/50 to-white">
          <div className="h-16 w-16 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl flex items-center justify-center shadow-sm mb-5 border border-indigo-100">
             <Mail className="h-7 w-7 text-indigo-600" />
          </div>
          <h3 className="text-zinc-900 font-bold text-xl">No invitations found</h3>
          <p className="text-zinc-500 mt-2 max-w-md text-sm leading-relaxed">
            Invitations matching your current filters will appear here. Check back soon or adjust your filters.
          </p>
        </div>
      ) : (
        /* 2 Column Grid - Responsive */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredList.map((invitation) => {
            const payment = getPaymentDetails(invitation);
            const engagementConfig = getEngagementIcon(invitation.engagement_model || 'fixed');
            const EngagementIcon = engagementConfig.icon;
            const isPending = invitation.status === 'pending';
            const statusConfig = getStatusConfig(invitation.status);

            return (
              <Card 
                key={invitation.id} 
                className="group relative overflow-hidden border-zinc-200 bg-white hover:shadow-lg hover:border-zinc-300 transition-all duration-300"
              >
                {/* Gradient accent bar - dynamic based on status */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusConfig.accent}`} />
                
                <div className="p-5">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Engagement Icon */}
                      <div className={`h-11 w-11 rounded-xl ${engagementConfig.bg} border flex items-center justify-center shrink-0 shadow-sm`}>
                        <EngagementIcon className={`h-5 w-5 ${engagementConfig.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col xs:flex-row xs:items-center gap-1.5 xs:gap-2 mb-1.5">
                          <Badge variant="secondary" className="inline-flex w-auto max-w-max shrink-0 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 px-2.5 py-0.5 rounded-md font-semibold text-[10px] uppercase">
                            {invitation.project?.type || 'Web Dev'}
                          </Badge>
                          <span className="text-zinc-400 text-[10px] flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <h3 
                          className="text-base font-bold text-zinc-900 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2 group-hover:text-indigo-600"
                          onClick={() => navigate(`/projects/${invitation.project_id}`)}
                        >
                          {invitation.project?.title || 'Untitled Project'}
                        </h3>
                      </div>
                    </div>

                    {/* Status Badge - Only show if not pending */}
                    {!isPending && (
                      <div className="mt-2 sm:mt-0 sm:ml-2 flex-shrink-0">{statusConfig.badge}</div>
                    )}
                  </div>

                  {/* Message Box */}
                  <div className="bg-gradient-to-br from-zinc-50 to-zinc-100/50 border border-zinc-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="text-zinc-700 text-[10px] font-bold uppercase tracking-wide">
                        Message
                      </span>
                    </div>
                    <p className="text-zinc-600 text-xs leading-relaxed line-clamp-2 italic">
                      "{invitation.message || 'We would like to invite you to this project.'}"
                    </p>
                  </div>

                  {/* Payment Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">{payment.subLabel}</p>
                      </div>
                      <p className="text-base font-bold text-emerald-700">
                        {convertAndFormat(payment.amount, payment.currency)}
                        <span className="text-xs font-semibold ml-0.5">{payment.label}</span>
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-zinc-50 to-zinc-100/50 border border-zinc-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">Duration</p>
                      </div>
                      <p className="text-sm font-bold text-zinc-900 capitalize">
                        {payment.duration || payment.sprintDays || 'Flexible'}
                      </p>
                    </div>
                  </div>


                  {/* Footer Actions */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-zinc-200">
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200">
                          <Calendar className="h-3 w-3 text-zinc-400" />
                          <span className="font-medium text-[11px]">
                            {invitation.project?.end_date ? format(new Date(invitation.project.end_date), 'MMM d') : 'Flexible'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200 capitalize">
                          <span className="font-medium text-[11px]">{invitation.engagement_model || 'Fixed'}</span>
                        </div>
                      </div>
                      {invitation.status === 'accepted' && invitation.contract_id ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="default"
                            className="border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50 hover:border-zinc-400 font-semibold transition-all h-8 text-xs px-3 py-1"
                            onClick={() => navigate(`/contracts/${invitation.contract_id}`)}
                          >
                            <Briefcase className="h-4 w-4 mr-1" />
                            View Contract
                          </Button>
                          <Button
                            variant="outline"
                            size="default"
                            className="border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50 hover:border-zinc-400 font-semibold transition-all h-8 text-xs px-3 py-1"
                            onClick={() => navigate(`/projects/${invitation.project_id}`)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View Project
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="default"
                          className="border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50 hover:border-zinc-400 font-semibold transition-all h-8 text-xs px-3 py-1"
                          onClick={() => navigate(`/projects/${invitation.project_id}`)}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Project
                        </Button>
                      )}
                    </div>

                    {/* Action Buttons - Only show if pending */}
                    {isPending && (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          className="border-zinc-300 text-zinc-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all flex-1 h-9 font-semibold text-sm"
                          onClick={() => handleResponse(invitation.id, 'declined')} 
                          disabled={respondMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Decline
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all flex-1 h-9 font-semibold text-sm"
                          onClick={() => handleResponse(invitation.id, 'accepted')} 
                          disabled={respondMutation.isPending}
                        >
                          {respondMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 mr-1.5" />
                          )}
                          Accept
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}