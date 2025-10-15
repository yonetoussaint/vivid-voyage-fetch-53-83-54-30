
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/RedirectAuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CommentReaction {
  id: string;
  comment_id: string;
  user_id: string;
  reaction_type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
  created_at: string;
}

export function useCommentReactions(commentId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's current reaction for this comment
  useEffect(() => {
    if (!user || !commentId) return;

    const fetchUserReaction = async () => {
      const { data, error } = await supabase
        .from('comment_reactions')
        .select('reaction_type')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user reaction:', error);
        return;
      }

      setUserReaction(data?.reaction_type || null);
    };

    fetchUserReaction();
  }, [user, commentId]);

  const toggleReaction = async (reactionType: string | null) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to react to comments",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (reactionType === null) {
        // Remove reaction
        const { error } = await supabase
          .from('comment_reactions')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (error) throw error;
        setUserReaction(null);
      } else if (userReaction === reactionType) {
        // Same reaction clicked - remove it
        const { error } = await supabase
          .from('comment_reactions')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (error) throw error;
        setUserReaction(null);
      } else if (userReaction) {
        // Update existing reaction
        const { error } = await supabase
          .from('comment_reactions')
          .update({ reaction_type: reactionType })
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (error) throw error;
        setUserReaction(reactionType);
      } else {
        // Add new reaction
        const { error } = await supabase
          .from('comment_reactions')
          .insert({
            comment_id: commentId,
            user_id: user.id,
            reaction_type: reactionType
          });

        if (error) throw error;
        setUserReaction(reactionType);
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userReaction,
    toggleReaction,
    isLoading
  };
}
