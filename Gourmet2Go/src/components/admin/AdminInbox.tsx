import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../supabase-client';
import { CheckCircle, MailOpen } from 'lucide-react';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  created_at: string;
};

export const AdminInbox = () => {
  const queryClient = useQueryClient();


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

  if (isLoading) {
    return <div className="p-6 text-center text-zinc-500">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return <div className="p-6 text-center text-zinc-500">No messages in your inbox!</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">User Messages</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-6 rounded-xl border transition-all ${
              msg.status === 'unread' 
                ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-md' 
                : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
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
              <span className="text-xs font-medium text-zinc-500">
                {new Date(msg.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-wrap mb-4">
              {msg.message}
            </div>

            <div className="flex gap-3">
              {msg.status === 'unread' && (
                <button
                  onClick={() => updateStatus.mutate({ id: msg.id, status: 'read' })}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-md transition-colors"
                >
                  <MailOpen size={16} /> Mark Read
                </button>
              )}
              {msg.status !== 'responded' && (
                <button
                  onClick={() => updateStatus.mutate({ id: msg.id, status: 'responded' })}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-[#00659B] text-white hover:bg-[#005082] rounded-md transition-colors"
                >
                  <CheckCircle size={16} /> Mark Responded
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};