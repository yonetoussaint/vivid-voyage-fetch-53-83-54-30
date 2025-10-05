
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

interface UserSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}

export function UserSelectionDialog({ open, onOpenChange, currentUserId }: UserSelectionDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            (user.full_name || '').toLowerCase().includes(query) ||
            (user.email || '').toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .neq('id', currentUserId)
        .order('full_name', { ascending: true });

      if (error) throw error;

      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUserSelect = async (selectedUserId: string) => {
    try {
      // Get all conversations where current user is a participant
      const { data: myConversations, error: fetchError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', currentUserId);

      if (fetchError) {
        console.error('Error fetching conversations:', fetchError);
        throw fetchError;
      }

      // Check if any of my conversations includes the selected user
      if (myConversations && myConversations.length > 0) {
        const conversationIds = myConversations.map(c => c.conversation_id);
        
        // Find if selected user is in any of these conversations
        const { data: sharedConversation, error: sharedError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', selectedUserId)
          .in('conversation_id', conversationIds)
          .limit(1)
          .single();

        if (sharedConversation && !sharedError) {
          // Conversation exists, navigate to it
          console.log('Existing conversation found:', sharedConversation.conversation_id);
          navigate(`/messages/${sharedConversation.conversation_id}`);
          onOpenChange(false);
          return;
        }
      }

      // No existing conversation found, create a new one
      console.log('Creating new conversation...');
      
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          last_message_at: new Date().toISOString(),
          is_archived: false,
        })
        .select()
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw conversationError;
      }

      console.log('New conversation created:', newConversation.id);

      // Add both participants to the conversation
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          {
            conversation_id: newConversation.id,
            user_id: currentUserId,
            last_read_at: new Date().toISOString(),
          },
          {
            conversation_id: newConversation.id,
            user_id: selectedUserId,
            last_read_at: new Date().toISOString(),
          },
        ]);

      if (participantsError) {
        console.error('Error adding participants:', participantsError);
        throw participantsError;
      }

      console.log('Participants added successfully');

      // Navigate to the new conversation
      navigate(`/messages/${newConversation.id}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleUserSelect:', error);
      // You could add a toast notification here to inform the user
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-gray-500">
                {searchQuery ? 'No users found' : 'No users available'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className="w-full px-6 py-3 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={user.avatar_url || ''} />
                    <AvatarFallback className="bg-black text-white text-sm">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-sm font-medium truncate">{user.full_name || 'No name'}</h3>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
