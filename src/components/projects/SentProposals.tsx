import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { ExternalLink, Loader2, Filter, ArrowUpDown, Send, Calendar, Briefcase, Clock, FileText, TrendingUp, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/hooks/useCurrency';

export default function SentProposals({ proposals, isLoading }: { proposals: any[], isLoading: boolean }) {
  const navigate = useNavigate();
  const { convertAndFormat } = useCurrency();
  
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [sortOrder, setSortOrder] = useState<string>('newest');

  const filteredList = proposals
    .filter(p => statusFilter === 'all' ? true : p.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

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
      case 'rejected': 
        return {
          badge: <Badge className="bg-gradient-to-r from-red-100 to-rose-100 text-red-700 hover:from-red-100 hover:to-rose-100 border-red-300 border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm">
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            Rejected
          </Badge>,
          accent: 'from-red-500 to-rose-500'
        };
      default: 
        return {
          badge: <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 hover:from-amber-100 hover:to-yellow-100 border-amber-300 border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm">
            <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
            Pending
          </Badge>,
          accent: 'from-amber-500 to-yellow-500'
        };
    }
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

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500 h-10 w-10 mb-4" />
        <p className="text-zinc-500 text-sm">Loading proposals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Sent Proposals</h2>
          <p className="text-zinc-500 text-sm mt-1">
            {filteredList.length} {filteredList.length === 1 ? 'proposal' : 'proposals'} found
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
              <SelectItem value="rejected">Rejected</SelectItem>
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
             <Send className="h-7 w-7 text-indigo-600" />
          </div>
          <h3 className="text-zinc-900 font-bold text-xl">No proposals found</h3>
          <p className="text-zinc-500 mt-2 mb-6 text-sm max-w-md leading-relaxed">
            You haven't sent any proposals matching these filters. Browse the marketplace to find exciting projects.
          </p>
          <Button 
            variant="default" 
            size="lg" 
            onClick={() => navigate('/marketplace')} 
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all font-semibold"
          >
            <Send className="h-4 w-4 mr-2" />
            Browse Marketplace
          </Button>
        </div>
      ) : (
        /* 2 Column Grid - Responsive */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredList.map((proposal) => {
            const statusConfig = getStatusConfig(proposal.status);
            const engagementConfig = getEngagementIcon(proposal.engagement_model);
            const EngagementIcon = engagementConfig.icon;

            return (
              <Card 
                key={proposal.id} 
                className="group relative overflow-hidden border-zinc-200 bg-white hover:shadow-lg hover:border-zinc-300 transition-all duration-300"
              >
                {/* Gradient accent bar - dynamic based on status */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusConfig.accent}`} />
                
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Engagement Icon */}
                      <div className={`h-11 w-11 rounded-xl ${engagementConfig.bg} border flex items-center justify-center shrink-0 shadow-sm`}>
                        <EngagementIcon className={`h-5 w-5 ${engagementConfig.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 
                            className="text-base font-bold text-zinc-900 cursor-pointer hover:text-indigo-600 transition-colors truncate group-hover:text-indigo-600"
                            onClick={() => navigate(`/projects/${proposal.project_id}`)}
                          >
                            {proposal.project_title}
                          </h3>
                          <span className="text-[10px] text-zinc-400 font-mono bg-zinc-100 px-2 py-0.5 rounded">
                            #{proposal.project_id.slice(0, 8)}
                          </span>
                        </div>
                        <p className="text-zinc-500 text-xs">
                          Submitted {format(new Date(proposal.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {statusConfig.badge}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">Quote</p>
                      </div>
                      <p className="text-base font-bold text-emerald-700">
                        {convertAndFormat(proposal.quote_amount, proposal.currency || 'INR')}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-zinc-50 to-zinc-100/50 border border-zinc-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">Duration</p>
                      </div>
                      <p className="text-sm font-bold text-zinc-900">{proposal.duration_days} days</p>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-zinc-200">
                    {/* Meta Info */}
                    <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
                      <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200">
                        <Calendar className="h-3 w-3 text-zinc-400" />
                        <span className="font-medium text-[11px]">{format(new Date(proposal.created_at), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200 capitalize">
                        <span className="font-medium text-[11px]">{proposal.engagement_model}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {proposal.status === 'accepted' && proposal.contract_id ? (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="default"
                            className="w-full border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50 hover:border-zinc-400 font-semibold transition-all h-9 text-sm" 
                            onClick={() => navigate(`/projects/${proposal.project_id}`)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" /> 
                            View Project
                          </Button>
                          <Button 
                            variant="default" 
                            size="default"
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all font-semibold h-9 text-sm" 
                            onClick={() => navigate(`/contracts/${proposal.contract_id}`)}
                          >
                            <FileText className="h-4 w-4 mr-2" /> 
                            View Contract
                          </Button>
                        </div>
                      ) : proposal.contract_id ? (
                        <Button 
                          variant="default" 
                          size="default"
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all font-semibold h-9 text-sm" 
                          onClick={() => navigate(`/contracts/${proposal.contract_id}`)}
                        >
                          <FileText className="h-4 w-4 mr-2" /> 
                          View Contract
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="default"
                          className="w-full border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50 hover:border-zinc-400 font-semibold transition-all h-9 text-sm" 
                          onClick={() => navigate(`/projects/${proposal.project_id}`)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" /> 
                          View Project
                        </Button>
                      )}
                    </div>
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