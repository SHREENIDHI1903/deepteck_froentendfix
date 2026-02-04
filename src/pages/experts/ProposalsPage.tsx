import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Inbox, Send, Sparkles, LayoutGrid, List } from 'lucide-react';
import { useExpertInvitations } from '@/hooks/useInvitations';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

import IncomingInvitations from '@/components/invitations/IncomingInvitations';
import SentProposals from '@/components/projects/SentProposals';

export default function ProposalsPage() {
  const [activeTab, setActiveTab] = useState('invitations');
  const { token } = useAuth();
  
  const { data: invitations, isLoading: loadingInvites } = useExpertInvitations();
  
  const { data: sentProposals, isLoading: loadingProposals } = useQuery({
    queryKey: ["my-sent-proposals"],
    queryFn: async () => {
      const res = await api.get("/proposals/expert/my-proposals", token!) as { data: any[] };
      return res.data;
    },
    enabled: !!token,
  });

  const pendingInvitations = invitations?.filter((i: any) => i.status === 'pending') || [];

  return (
    <Layout>
      <div className="min-h-screen bg-zinc-50/50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-7">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Workbench</h1>
              <p className="text-zinc-500 mt-2 text-base max-w-2xl">
                Manage your active pipeline. Review incoming project invitations and track the status of your sent proposals.
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
            <div className="flex items-center justify-between border-b border-zinc-200">
              <TabsList className="bg-transparent h-auto p-0 gap-8">
                <TabsTrigger 
                  value="invitations" 
                  className="relative rounded-none border-b-2 border-transparent px-1 py-4 font-medium text-sm text-zinc-500 hover:text-zinc-800 data-[state=active]:border-zinc-900 data-[state=active]:text-zinc-900 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Inbox className="h-4 w-4" />
                    <span>Invitations</span>
                    {pendingInvitations.length > 0 && (
                      <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                        {pendingInvitations.length}
                      </span>
                    )}
                  </div>
                </TabsTrigger>

                <TabsTrigger 
                  value="sent-proposals"
                  className="relative rounded-none border-b-2 border-transparent px-1 py-4 font-medium text-sm text-zinc-500 hover:text-zinc-800 data-[state=active]:border-zinc-900 data-[state=active]:text-zinc-900 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Send className="h-4 w-4" />
                    <span>Sent Proposals</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="min-h-[400px]">
              <TabsContent value="invitations" className="m-0 focus-visible:outline-none animate-in fade-in-10 slide-in-from-bottom-2 duration-300">
                <IncomingInvitations invitations={invitations || []} isLoading={loadingInvites} />
              </TabsContent>

              <TabsContent value="sent-proposals" className="m-0 focus-visible:outline-none animate-in fade-in-10 slide-in-from-bottom-2 duration-300">
                <SentProposals proposals={sentProposals || []} isLoading={loadingProposals} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}