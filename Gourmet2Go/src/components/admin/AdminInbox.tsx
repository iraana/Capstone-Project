import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../supabase-client';
import { CheckCircle, MailOpen, Filter } from 'lucide-react';
import { useState } from 'react';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  created_at: string;
};

type FilterType = 'all' | 'unread' | 'read' | 'responded';

export const AdminInbox = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>('all');


  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['contact_messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    },
  });


  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_messages'] });
    },
  });

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  if (isLoading) {
    return <div className="p-6 text-center text-zinc-500">Loading messages...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* filter bar + header*/}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          User Messages
          <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-sm px-3 py-1 rounded-full font-medium">
            {filteredMessages.length}
          </span>
        </h2>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter size={18} className="text-zinc-400 mr-2 hidden sm:block" />
          {(['all', 'unread', 'read', 'responded'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* empty check*/}
      {messages.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
          No messages in your inbox!
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
          No messages found for the filter "{filter}".
        </div>
      ) : (
        /* messages list */
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-6 rounded-2xl border transition-all ${
                msg.status === 'unread' 
                  ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-md' 
                  : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4 gap-2">
                <div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center flex-wrap gap-2">
                    {msg.name}
                    {msg.status === 'unread' && (
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] uppercase font-bold tracking-wider rounded-full">New</span>
                    )}
                    {msg.status === 'responded' && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] uppercase font-bold tracking-wider rounded-full">Responded</span>
                    )}
                  </h3>
                  <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {msg.email}
                  </a>
                </div>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg w-fit">
                  {new Date(msg.created_at).toLocaleDateString()} at {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-wrap mb-5 leading-relaxed">
                {msg.message}
              </div>

              <div className="flex flex-wrap gap-3">
                {msg.status === 'unread' && (
                  <button
                    onClick={() => updateStatus.mutate({ id: msg.id, status: 'read' })}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-all active:scale-95"
                  >
                    <MailOpen size={16} /> Mark Read
                  </button>
                )}
                {msg.status !== 'responded' && (
                  <button
                    onClick={() => updateStatus.mutate({ id: msg.id, status: 'responded' })}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-md shadow-blue-500/20 rounded-xl transition-all active:scale-95"
                  >
                    <CheckCircle size={16} /> Mark Responded
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};