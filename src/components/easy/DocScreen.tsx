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
  const exec = (cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    setTimeout(() => {
      if (editorRef.current) onUpdate(editorRef.current.innerHTML);
    }, 0);
  };

  const applyBlock = (tag) => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const node = sel.getRangeAt(0).commonAncestorContainer;
      const block = node.nodeType === 3 ? node.parentElement : node;
      const current = block?.closest('h1,h2,h3,h4,blockquote,pre,p,div');
      if (current && current.tagName.toLowerCase() === tag) {
        document.execCommand('formatBlock', false, 'p');
      } else {
        document.execCommand('formatBlock', false, tag);
      }
    } else {
      document.execCommand('formatBlock', false, tag);
    }
    setTimeout(() => {
      if (editorRef.current) onUpdate(editorRef.current.innerHTML);
    }, 0);
  };

  const insertHR = () => {
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, '<hr style="border:none;border-top:1px solid #1a1a1a;margin:20px 0;"/>');
    setTimeout(() => { if (editorRef.current) onUpdate(editorRef.current.innerHTML); }, 0);
  };

  const Divider = () => (
    <div style={{ width: 1, height: 18, background: '#1e1e1e', margin: '0 3px', flexShrink: 0 }} />
  );

  const Btn = ({ title, onMouseDown, children, wide }) => (
    <button
      title={title}
      onMouseDown={onMouseDown}
      style={{
        background: 'transparent',
        border: '1px solid #181818',
        color: '#484848',
        width: wide ? 36 : 28,
        height: 26,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        fontFamily: "'Courier New', Courier, monospace",
        transition: 'border-color 0.12s, color 0.12s, background 0.12s',
        flexShrink: 0,
        padding: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = accent + '77';
        e.currentTarget.style.color = accent;
        e.currentTarget.style.background = accent + '0d';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#181818';
        e.currentTarget.style.color = '#484848';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{
      borderTop: '1px solid #111',
      marginTop: 16,
      paddingTop: 8,
      paddingBottom: 4,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
        className="toolbar-scroll"
      >
        {/* Text style */}
        <Btn title="Bold" onMouseDown={e => { e.preventDefault(); exec('bold'); }}>
          <span style={{ fontWeight: 800, fontFamily: 'serif', fontSize: 13 }}>B</span>
        </Btn>
        <Btn title="Italic" onMouseDown={e => { e.preventDefault(); exec('italic'); }}>
          <span style={{ fontStyle: 'italic', fontFamily: 'serif', fontSize: 13 }}>I</span>
        </Btn>
        <Btn title="Underline" onMouseDown={e => { e.preventDefault(); exec('underline'); }}>
          <span style={{ textDecoration: 'underline', fontSize: 12 }}>U</span>
        </Btn>
        <Btn title="Strikethrough" onMouseDown={e => { e.preventDefault(); exec('strikeThrough'); }}>
          <span style={{ textDecoration: 'line-through', fontSize: 12 }}>S</span>
        </Btn>
        <Btn title="Superscript" onMouseDown={e => { e.preventDefault(); exec('superscript'); }}>
          <span style={{ fontSize: 10 }}>x<sup style={{ fontSize: 8 }}>²</sup></span>
        </Btn>
        <Btn title="Subscript" onMouseDown={e => { e.preventDefault(); exec('subscript'); }}>
          <span style={{ fontSize: 10 }}>x<sub style={{ fontSize: 8 }}>₂</sub></span>
        </Btn>

        <Divider />

        {/* Headings */}
        <Btn title="Heading 1" wide onMouseDown={e => { e.preventDefault(); applyBlock('h1'); }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3 }}>H1</span>
        </Btn>
        <Btn title="Heading 2" wide onMouseDown={e => { e.preventDefault(); applyBlock('h2'); }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3 }}>H2</span>
        </Btn>
        <Btn title="Heading 3" wide onMouseDown={e => { e.preventDefault(); applyBlock('h3'); }}>
          <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.3 }}>H3</span>
        </Btn>
        <Btn title="Heading 4" wide onMouseDown={e => { e.preventDefault(); applyBlock('h4'); }}>
          <span style={{ fontSize: 10, fontWeight: 400, letterSpacing: 0.3 }}>H4</span>
        </Btn>
        <Btn title="Paragraph" wide onMouseDown={e => { e.preventDefault(); applyBlock('p'); }}>
          <span style={{ fontSize: 9, letterSpacing: 0.2 }}>¶ P</span>
        </Btn>

        <Divider />

        {/* Lists */}
        <Btn title="Bullet list" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <circle cx="2" cy="4" r="1.4" fill="currentColor"/>
            <circle cx="2" cy="8" r="1.4" fill="currentColor"/>
            <circle cx="2" cy="12" r="1.4" fill="currentColor"/>
            <rect x="5" y="3" width="10" height="1.8" rx="0.9" fill="currentColor"/>
            <rect x="5" y="7" width="10" height="1.8" rx="0.9" fill="currentColor"/>
            <rect x="5" y="11" width="10" height="1.8" rx="0.9" fill="currentColor"/>
          </svg>
        </Btn>
        <Btn title="Numbered list" onMouseDown={e => { e.preventDefault(); exec('insertOrderedList'); }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <text x="0" y="5" fontSize="5" fill="currentColor">1.</text>
            <text x="0" y="9.5" fontSize="5" fill="currentColor">2.</text>
            <text x="0" y="14" fontSize="5" fill="currentColor">3.</text>
            <rect x="6" y="3" width="9" height="1.8" rx="0.9" fill="currentColor"/>
            <rect x="6" y="7.5" width="9" height="1.8" rx="0.9" fill="currentColor"/>
            <rect x="6" y="12" width="9" height="1.8" rx="0.9" fill="currentColor"/>
          </svg>
        </Btn>
        <Btn title="Indent" onMouseDown={e => { e.preventDefault(); exec('indent'); }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="0" y="2" width="16" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="4" y="6" width="12" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="4" y="10" width="12" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="0" y="14" width="16" height="1.5" rx="0.75" fill="currentColor"/>
          </svg>
        </Btn>
        <Btn title="Outdent" onMouseDown={e => { e.preventDefault(); exec('outdent'); }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="0" y="2" width="16" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="0" y="6" width="12" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="0" y="10" width="12" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="0" y="14" width="16" height="1.5" rx="0.75" fill="currentColor"/>
          </svg>
        </Btn>

        <Divider />

        {/* Alignment */}
        <Btn title="Align left" onMouseDown={e => { e.preventDefault(); exec('justifyLeft'); }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="0" y="2" width="16" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="0" y="6" width="10" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="0" y="10" width="14" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="0" y="14" width="8" height="1.5" rx="0.75" fill="currentColor"/>
          </svg>
        </Btn>
        <Btn title="Align center" onMouseDown={e => { e.preventDefault(); exec('justifyCenter'); }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="0" y="2" width="16" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="3" y="6" width="10" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="1" y="10" width="14" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="4" y="14" width="8" height="1.5" rx="0.75" fill="currentColor"/>
          </svg>
        </Btn>
        <Btn title="Align right" onMouseDown={e => { e.preventDefault(); exec('justifyRight'); }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="0" y="2" width="16" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="6" y="6" width="10" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="2" y="10" width="14" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="8" y="14" width="8" height="1.5" rx="0.75" fill="currentColor"/>
          </svg>
        </Btn>
        <Btn title="Justify" onMouseDown={e => { e.preventDefault(); exec('justifyFull'); }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="0" y="2" width="16" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="0" y="6" width="16" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="0" y="10" width="16" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="0" y="14" width="10" height="1.5" rx="0.75" fill="currentColor"/>
          </svg>
        </Btn>

        <Divider />

        {/* Block formats */}
        <Btn title="Blockquote" wide onMouseDown={e => { e.preventDefault(); applyBlock('blockquote'); }}>
          <span style={{ fontSize: 14, lineHeight: 1 }}>"</span>
        </Btn>
        <Btn title="Code block" wide onMouseDown={e => { e.preventDefault(); applyBlock('pre'); }}>
          <span style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 0 }}>{`</>`}</span>
        </Btn>

        <Divider />

        {/* Font size */}
        <Btn title="Smaller text" onMouseDown={e => { e.preventDefault(); exec('fontSize', '2'); }}>
          <span style={{ fontSize: 9 }}>A</span>
        </Btn>
        <Btn title="Normal text" onMouseDown={e => { e.preventDefault(); exec('fontSize', '3'); }}>
          <span style={{ fontSize: 11 }}>A</span>
        </Btn>
        <Btn title="Larger text" onMouseDown={e => { e.preventDefault(); exec('fontSize', '5'); }}>
          <span style={{ fontSize: 14 }}>A</span>
        </Btn>

        <Divider />

        {/* Misc */}
        <Btn title="Horizontal rule" onMouseDown={e => { e.preventDefault(); insertHR(); }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="0" y="7" width="16" height="1.5" rx="0.75" fill="currentColor"/>
          </svg>
        </Btn>
      </div>
    </div>
  );
}

export function DocScreen({ noteId, initialContent = '', initialTitle = '', onContentChange, onTitleChange }) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const editorRef = useRef(null);
  const isMobile = useIsMobile();

  // Load initial content into editor
  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  const handleContentUpdate = (newContent) => {
    setContent(newContent);
    if (onContentChange) onContentChange(newContent);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (onTitleChange) onTitleChange(newTitle);
  };

  // Get accent color based on type
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