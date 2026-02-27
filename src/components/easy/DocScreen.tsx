import { useState, useEffect, useRef } from 'react';
import { TYPE_META } from '@/data/typeMeta';
import { useIsMobile } from '@/hooks/useMobile';
import { Avatar } from '@/components/easy/Avatar';
import { ContactSection } from '@/components/easy/ContactSection';
import { AttachmentSection } from '@/components/easy/AttachmentSection';

function generateId() {
  return "ch_" + Math.random().toString(36).slice(2, 9);
}

// ── Formatting toolbar ───────────────────────────────────────────────────────
function FormattingToolbar({ editorRef, accent, onUpdate }) {
  // ... (keep all your existing toolbar code exactly as is)
  // The onUpdate prop is already here and working
}

export function DocScreen({ noteId, initialContent = '', initialTitle = '', onContentChange, onTitleChange }: DocScreenProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const isMobile = useIsMobile();

  // Load note content if noteId is provided
  useEffect(() => {
    if (!user || !noteId) return;

    const loadNote = async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('title, content')
        .eq('id', noteId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading note:', error);
      } else if (data) {
        setTitle(data.title || '');
        setContent(data.content || '');
        if (editorRef.current) {
          editorRef.current.innerHTML = data.content || '';
        }
        onTitleChange?.(data.title || '');
        onContentChange?.(data.content || '');
      }
    };

    loadNote();
  }, [noteId, user]);

  // Save content to Supabase
  const saveToSupabase = async (newTitle: string, newContent: string) => {
    if (!user || !noteId) return;

    setIsSaving(true);
    const { error } = await supabase
      .from('notes')
      .update({
        title: newTitle,
        content: newContent,
        updated_at: new Date().toISOString()
      })
      .eq('id', noteId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error saving note:', error);
    } else {
      setLastSaved(new Date());
    }
    setIsSaving(false);
  };

  // Debounced save handler
  const handleContentUpdate = (newContent: string) => {
    setContent(newContent);
    onContentChange?.(newContent);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToSupabase(title, newContent);
    }, 1000);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onTitleChange?.(newTitle);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToSupabase(newTitle, content);
    }, 1000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Get accent color based on type (you can customize this)
  const accent = '#4285f4';

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#000',
      color: '#fff',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #111',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: 16,
            fontWeight: 500,
            outline: 'none',
            padding: '4px 0',
          }}
        />
        {isSaving && (
          <span style={{ color: '#555', fontSize: 12 }}>Saving...</span>
        )}
        {lastSaved && !isSaving && (
          <span style={{ color: '#555', fontSize: 12 }}>
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => handleContentUpdate(e.currentTarget.innerHTML)}
        style={{
          flex: 1,
          padding: '20px 16px',
          overflowY: 'auto',
          outline: 'none',
          lineHeight: 1.6,
          fontSize: 15,
        }}
      />

      {/* Formatting Toolbar */}
      <FormattingToolbar
        editorRef={editorRef}
        accent={accent}
        onUpdate={handleContentUpdate}
      />
    </div>
  );
}