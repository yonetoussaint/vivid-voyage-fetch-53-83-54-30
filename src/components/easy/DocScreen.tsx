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
        <Btn title="Remove formatting" onMouseDown={e => { e.preventDefault(); exec('removeFormat'); }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M3 13L13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </Btn>
        <Btn title="Undo" onMouseDown={e => { e.preventDefault(); exec('undo'); }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 7 C3 4 6 2 9 2 C12 2 14 4 14 7 C14 10 12 12 9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
            <path d="M3 7 L1 4.5 M3 7 L5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Btn>
        <Btn title="Redo" onMouseDown={e => { e.preventDefault(); exec('redo'); }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M13 7 C13 4 10 2 7 2 C4 2 2 4 2 7 C2 10 4 12 7 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
            <path d="M13 7 L15 4.5 M13 7 L10.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Btn>
      </div>
    </div>
  );
}

// ── Read Mode View ───────────────────────────────────────────────────────────
function ReadMode({ chapters, ev, accent, onExit }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: '#0a0c0e',
      overflowY: 'auto',
      fontFamily: 'Georgia, "Times New Roman", serif',
      animation: 'readFadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes readFadeIn { from { opacity:0; } to { opacity:1; } }
        .read-content h1 { font-size: 26px; font-weight: 700; color: #d4d4d8; margin: 32px 0 12px; letter-spacing: -0.5px; line-height: 1.25; }
        .read-content h2 { font-size: 19px; font-weight: 600; color: #aaa; margin: 28px 0 10px; line-height: 1.3; }
        .read-content p { margin: 0 0 16px; color: #7a7a7a; }
        .read-content ul { padding-left: 22px; margin: 0 0 16px; }
        .read-content li { color: #7a7a7a; margin-bottom: 6px; }
        .read-content strong { color: #bbb; }
        .read-content em { color: #888; font-style: italic; }
        .read-content u { text-decoration-color: #444; }
      `}</style>

      {/* Exit bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 48,
        background: 'linear-gradient(to bottom, #0a0c0e, transparent)',
      }}>
        <span style={{ fontSize: 9, color: accent + '66', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {TYPE_META[ev.type]?.icon || '§'} reading mode
        </span>
        <div
          onClick={onExit}
          style={{
            fontSize: 10, color: '#333', cursor: 'pointer',
            border: '1px solid #1a1a1a', padding: '4px 12px',
            letterSpacing: 0.8, textTransform: 'uppercase',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = accent; e.currentTarget.style.borderColor = accent + '66'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#333'; e.currentTarget.style.borderColor = '#1a1a1a'; }}
        >
          ✕ Exit
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 40px 120px' }}>
        {/* Book title */}
        <div style={{ marginBottom: 60, paddingBottom: 32, borderBottom: `1px solid #111` }}>
          <div style={{ fontSize: 9, color: accent + '55', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            {ev.type}
          </div>
          <h1 style={{
            fontSize: 38, fontWeight: 700, color: '#d4d4d8', margin: 0,
            letterSpacing: -1, lineHeight: 1.15,
            fontFamily: 'Georgia, serif',
          }}>{ev.title}</h1>
        </div>

        {/* Chapters */}
        {chapters.map((ch, ci) => {
          const hasContent = ch.content && ch.content.trim() && ch.content.trim() !== '<br>' && ch.content.trim() !== '<p><br></p>';
          const hasSubs = ch.subs && ch.subs.length > 0;
          if (!hasContent && !hasSubs) return null;

          return (
            <div key={ch.id} style={{ marginBottom: 64 }}>
              {/* Chapter title */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 9, color: accent + '44', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
                  Chapter {ci + 1}
                </div>
                <div style={{
                  fontSize: 24, fontWeight: 700, color: '#888',
                  letterSpacing: -0.3, lineHeight: 1.2,
                  fontFamily: 'Georgia, serif',
                }}>{ch.title}</div>
                <div style={{ width: 32, height: 1, background: accent + '44', marginTop: 14 }} />
              </div>

              {/* Chapter body */}
              {hasContent && (
                <div
                  className="read-content"
                  style={{ fontSize: 16, lineHeight: 1.9 }}
                  dangerouslySetInnerHTML={{ __html: ch.content }}
                />
              )}

              {/* Sub-sections */}
              {hasSubs && ch.subs.map((sub, si) => {
                const subHasContent = sub.content && sub.content.trim() && sub.content.trim() !== '<br>' && sub.content.trim() !== '<p><br></p>';
                if (!subHasContent) return null;
                return (
                  <div key={sub.id} style={{ marginTop: 36, paddingLeft: 20, borderLeft: `1px solid ${accent}22` }}>
                    <div style={{
                      fontSize: 11, fontWeight: 600, color: '#555',
                      letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 16,
                    }}>{ci + 1}.{si + 1} — {sub.title}</div>
                    <div
                      className="read-content"
                      style={{ fontSize: 15, lineHeight: 1.85 }}
                      dangerouslySetInnerHTML={{ __html: sub.content }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

export function DocScreen({ ev, accent, text, setText, onClose }) {
  const isMobile = useIsMobile();

  const initChapters = () => {
    if (text && text.trim().startsWith("[CHAPTERS]")) {
      try { return JSON.parse(text.slice("[CHAPTERS]".length)); } catch(e) {}
    }
    if (text && text.trim()) {
      return [{ id: generateId(), title: "Chapter 1", content: text, subs: [] }];
    }
    return [{ id: generateId(), title: "Introduction", content: "", subs: [] }];
  };

  const [chapters, setChapters] = useState(initChapters);
  const [activeChapterId, setActiveChapterId] = useState(() => initChapters()[0]?.id || null);
  const [activeSubId, setActiveSubId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitleVal, setEditingTitleVal] = useState("");
  const [expandedIds, setExpandedIds] = useState({});
  const [readMode, setReadMode] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    setText("[CHAPTERS]" + JSON.stringify(chapters));
  }, [chapters]);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  // Focus editor when switching chapters
  useEffect(() => {
    editorRef.current?.focus();
  }, [activeChapterId, activeSubId]);

  const totalWords = chapters.reduce((acc, ch) => {
    const stripHtml = h => h.replace(/<[^>]*>/g, ' ').trim();
    const cw = ch.content ? stripHtml(ch.content).split(/\s+/).filter(Boolean).length : 0;
    const sw = ch.subs.reduce((a, s) => a + (s.content ? stripHtml(s.content).split(/\s+/).filter(Boolean).length : 0), 0);
    return acc + cw + sw;
  }, 0);
  const progress = Math.min(100, Math.round((totalWords / (ev.wordGoal || 500)) * 100));
  const readTime = Math.max(1, Math.ceil(totalWords / 200));

  // ── Chapter mutations ──
  const addChapter = () => {
    const id = generateId();
    const ch = { id, title: `Chapter ${chapters.length + 1}`, content: "", subs: [] };
    setChapters(p => [...p, ch]);
    setActiveChapterId(id);
    setActiveSubId(null);
    setExpandedIds(p => ({ ...p, [id]: true }));
  };

  const addSub = (chId) => {
    const id = generateId();
    setChapters(p => p.map(ch => ch.id === chId
      ? { ...ch, subs: [...ch.subs, { id, title: `Section ${ch.subs.length + 1}`, content: "" }] }
      : ch
    ));
    setActiveChapterId(chId);
    setActiveSubId(id);
    setExpandedIds(p => ({ ...p, [chId]: true }));
  };

  const deleteChapter = (chId) => {
    setChapters(p => {
      const next = p.filter(c => c.id !== chId);
      if (next.length === 0) {
        const fallback = { id: generateId(), title: "Chapter 1", content: "", subs: [] };
        setActiveChapterId(fallback.id);
        setActiveSubId(null);
        return [fallback];
      }
      if (activeChapterId === chId) {
        setActiveChapterId(next[0].id);
        setActiveSubId(null);
      }
      return next;
    });
  };

  const deleteSub = (chId, subId) => {
    setChapters(p => p.map(ch => ch.id === chId
      ? { ...ch, subs: ch.subs.filter(s => s.id !== subId) }
      : ch
    ));
    if (activeSubId === subId) setActiveSubId(null);
  };

  const moveChapter = (chId, dir) => {
    setChapters(p => {
      const idx = p.findIndex(c => c.id === chId);
      if (idx < 0) return p;
      const next = [...p];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return p;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const updateContent = (val) => {
    setChapters(p => p.map(ch => {
      if (activeSubId) {
        if (ch.id !== activeChapterId) return ch;
        return { ...ch, subs: ch.subs.map(s => s.id === activeSubId ? { ...s, content: val } : s) };
      }
      return ch.id === activeChapterId ? { ...ch, content: val } : ch;
    }));
  };

  const startRename = (id, current) => { setEditingTitleId(id); setEditingTitleVal(current); };
  const commitRename = (chId, subId) => {
    const val = editingTitleVal.trim() || (subId ? "Untitled Section" : "Untitled Chapter");
    setChapters(p => p.map(ch => {
      if (subId) {
        if (ch.id !== chId) return ch;
        return { ...ch, subs: ch.subs.map(s => s.id === subId ? { ...s, title: val } : s) };
      }
      return ch.id === chId ? { ...ch, title: val } : ch;
    }));
    setEditingTitleId(null);
  };

  const activeChapter = chapters.find(c => c.id === activeChapterId);
  const activeSub = activeSubId ? activeChapter?.subs.find(s => s.id === activeSubId) : null;
  const activeContent = activeSub ? activeSub.content : (activeChapter?.content || "");
  const activeTitle = activeSub ? activeSub.title : (activeChapter?.title || "");
  const stripHtml = h => h.replace(/<[^>]*>/g, ' ').trim();
  const activeWordCount = activeContent ? stripHtml(activeContent).split(/\s+/).filter(Boolean).length : 0;

  const Sidebar = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#07090b" }}>
      <div style={{ padding:"14px 14px 10px", borderBottom:"1px solid #111", flexShrink:0 }}>
        <div style={{ fontSize:9, color:accent+"88", letterSpacing:1.2, textTransform:"uppercase", marginBottom:5 }}>
          {TYPE_META[ev.type]?.icon || "§"} {ev.type}
        </div>
        <div style={{ fontSize:12, fontWeight:700, color:"#aaa", lineHeight:1.4, marginBottom:8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.title}</div>
        <div style={{ height:2, background:"#111", borderRadius:1, overflow:"hidden", marginBottom:4 }}>
          <div style={{ width:`${progress}%`, height:"100%", background:accent, transition:"width 0.3s" }}/>
        </div>
        <div style={{ fontSize:9, color:"#333", display:"flex", justifyContent:"space-between" }}>
          <span>{totalWords}w · ~{readTime}m read</span>
          <span style={{ color: progress>=100 ? accent : "#333" }}>{progress}%</span>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
        <div style={{ padding:"6px 14px 4px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:9, color:"#2a2a2a", letterSpacing:1.1, textTransform:"uppercase" }}>Chapters</span>
          <div onClick={addChapter} style={{ fontSize:16, color:accent+"88", cursor:"pointer", lineHeight:1, padding:"0 2px" }} title="Add chapter">+</div>
        </div>

        {chapters.map((ch, ci) => {
          const chActive = activeChapterId === ch.id && !activeSubId;
          const expanded = expandedIds[ch.id];
          return (
            <div key={ch.id}>
              <div style={{ display:"flex", alignItems:"center", gap:0, padding:"0 8px 0 10px", cursor:"pointer", userSelect:"none",
                borderLeft:`2px solid ${chActive ? accent : "transparent"}`,
                background: chActive ? accent+"0d" : "transparent", transition:"all 0.12s", minHeight:36 }}>
                <div onClick={() => setExpandedIds(p => ({...p, [ch.id]: !p[ch.id]}))}
                  style={{ width:18, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", color:"#2a2a2a", fontSize:9 }}>
                  {ch.subs.length > 0 ? (
                    <svg width="9" height="9" viewBox="0 0 10 10" style={{ transform: expanded ? "rotate(90deg)" : "none", transition:"transform 0.15s" }}>
                      <path d="M3 2l4 3-4 3" stroke="#444" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : <span style={{width:9}}/>}
                </div>
                <span style={{ fontSize:9, color:accent+"44", width:18, flexShrink:0, fontWeight:700, textAlign:"center" }}>{ci+1}</span>
                <div style={{ flex:1, overflow:"hidden" }} onClick={() => { setActiveChapterId(ch.id); setActiveSubId(null); if(isMobile) setSidebarOpen(false); }}>
                  {editingTitleId === ch.id ? (
                    <input autoFocus value={editingTitleVal}
                      onChange={e => setEditingTitleVal(e.target.value)}
                      onBlur={() => commitRename(ch.id, null)}
                      onKeyDown={e => { if(e.key==="Enter"||e.key==="Escape") commitRename(ch.id, null); }}
                      onClick={e => e.stopPropagation()}
                      style={{ width:"100%", background:"transparent", border:"none", outline:`1px solid ${accent}44`, color:"#bbb", fontSize:11, padding:"1px 4px", fontFamily:"inherit" }}
                    />
                  ) : (
                    <span style={{ fontSize:11, fontWeight:chActive?600:400, color:chActive?accent:"#555",
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}
                      onDoubleClick={() => startRename(ch.id, ch.title)}
                    >{ch.title}</span>
                  )}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:2, flexShrink:0, opacity:0 }} className="ch-actions">
                  <div onClick={e=>{e.stopPropagation();addSub(ch.id);}} title="Add section"
                    style={{ width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:11, cursor:"pointer" }}>+</div>
                  <div onClick={e=>{e.stopPropagation();moveChapter(ch.id,-1);}} title="Move up"
                    style={{ width:16, height:18, display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:9, cursor:"pointer" }}>↑</div>
                  <div onClick={e=>{e.stopPropagation();moveChapter(ch.id,1);}} title="Move down"
                    style={{ width:16, height:18, display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:9, cursor:"pointer" }}>↓</div>
                  {chapters.length > 1 && (
                    <div onClick={e=>{e.stopPropagation();deleteChapter(ch.id);}} title="Delete chapter"
                      style={{ width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", color:"#ef5350", fontSize:10, cursor:"pointer" }}>×</div>
                  )}
                </div>
              </div>

              {expanded && ch.subs.map((sub, si) => {
                const subActive = activeChapterId === ch.id && activeSubId === sub.id;
                return (
                  <div key={sub.id}
                    style={{ display:"flex", alignItems:"center", gap:0, padding:"0 8px 0 30px", minHeight:30,
                      cursor:"pointer", userSelect:"none",
                      borderLeft:`2px solid ${subActive ? accent+"88" : "transparent"}`,
                      background: subActive ? accent+"08" : "transparent", transition:"all 0.12s" }}
                    onClick={() => { setActiveChapterId(ch.id); setActiveSubId(sub.id); if(isMobile) setSidebarOpen(false); }}
                  >
                    <span style={{ fontSize:8, color:"#2a2a2a", width:28, flexShrink:0 }}>{ci+1}.{si+1}</span>
                    {editingTitleId === sub.id ? (
                      <input autoFocus value={editingTitleVal}
                        onChange={e => setEditingTitleVal(e.target.value)}
                        onBlur={() => commitRename(ch.id, sub.id)}
                        onKeyDown={e => { if(e.key==="Enter"||e.key==="Escape") commitRename(ch.id, sub.id); }}
                        onClick={e => e.stopPropagation()}
                        style={{ flex:1, background:"transparent", border:"none", outline:`1px solid ${accent}44`, color:"#999", fontSize:10, padding:"1px 4px", fontFamily:"inherit" }}
                      />
                    ) : (
                      <span
                        style={{ flex:1, fontSize:10, color:subActive?accent+"cc":"#444", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}
                        onDoubleClick={e=>{e.stopPropagation(); startRename(sub.id, sub.title);}}
                      >{sub.title}</span>
                    )}
                    <div onClick={e=>{e.stopPropagation(); deleteSub(ch.id, sub.id);}}
                      style={{ width:16, height:20, display:"flex", alignItems:"center", justifyContent:"center", color:"#ef535033", fontSize:10, cursor:"pointer", flexShrink:0 }}>×</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {ev.tags && ev.tags.length > 0 && (
        <div style={{ padding:"12px 14px", borderTop:"1px solid #0f0f0f", flexShrink:0 }}>
          <div style={{ fontSize:9, color:"#222", letterSpacing:1.1, textTransform:"uppercase", marginBottom:6 }}>Tags</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {ev.tags.map(t => (
              <span key={t} style={{ fontSize:9, color:"#333", border:"1px solid #1a1a1a", padding:"2px 6px" }}>#{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {readMode && (
        <ReadMode
          chapters={chapters}
          ev={ev}
          accent={accent}
          onExit={() => setReadMode(false)}
        />
      )}

      <div onClick={e=>e.stopPropagation()} style={{
        position:"fixed", inset:0, zIndex:9999,
        background:"#06080a",
        display:"flex", flexDirection:"column",
        fontFamily:"'Courier New', Courier, monospace",
        animation:"docFadeIn 0.18s ease",
        visibility: readMode ? 'hidden' : 'visible',
      }}>
        <style>{`
          @keyframes docFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
          .doc-content-area::-webkit-scrollbar { width:3px; }
          .doc-content-area::-webkit-scrollbar-thumb { background:#1e1e1e; border-radius:2px; }
          .doc-sidebar-scroll::-webkit-scrollbar { width:2px; }
          .doc-sidebar-scroll::-webkit-scrollbar-thumb { background:#111; }
          .doc-editor-div::-webkit-scrollbar { display:none; }
          .doc-editor-div:empty:before { content: attr(data-placeholder); color: #1e1e1e; pointer-events:none; display:block; }
          .doc-editor-div:focus { outline:none; }
          .doc-editor-div p { margin: 0 0 12px; }
          .doc-editor-div h1 { font-size: 22px; font-weight: 700; color: #c0c0c4; margin: 20px 0 10px; letter-spacing: -0.3px; line-height: 1.25; font-family: Georgia, serif; }
          .doc-editor-div h2 { font-size: 16px; font-weight: 600; color: #888; margin: 18px 0 8px; line-height: 1.3; font-family: Georgia, serif; }
          .doc-editor-div ul { padding-left: 20px; margin: 0 0 12px; }
          .doc-editor-div li { margin-bottom: 4px; }
          .doc-editor-div strong { color: #c0c0c4; }
          .doc-editor-div em { color: #888; }
          .doc-editor-div blockquote { border-left: 2px solid #2a2a2a; margin: 12px 0; padding: 4px 16px; color: #666; font-style: italic; }
          .doc-editor-div pre { background: #0d0f11; border: 1px solid #1a1a1a; padding: 12px 16px; margin: 12px 0; font-size: 12px; color: #7a9a7a; overflow-x: auto; }
          .doc-editor-div h3 { font-size: 14px; font-weight: 600; color: #777; margin: 16px 0 6px; line-height: 1.3; font-family: Georgia, serif; }
          .doc-editor-div h4 { font-size: 12px; font-weight: 600; color: #666; margin: 14px 0 6px; text-transform: uppercase; letter-spacing: 0.8px; }
          .doc-editor-div s { color: #444; }
          .doc-editor-div ol { padding-left: 20px; margin: 0 0 12px; }
          .toolbar-scroll::-webkit-scrollbar { display: none; }
          .doc-mobile-overlay { animation:sideSlide 0.22s ease; }
          @keyframes sideSlide { from { transform:translateX(-100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
          div:hover > .ch-actions { opacity:1 !important; }
        `}</style>

        {/* ── TOP BAR ── */}
        <div style={{ display:"flex", alignItems:"center", height:44, borderBottom:"1px solid #111", background:"#07090b", flexShrink:0, zIndex:3 }}>
          <div onClick={() => setSidebarOpen(s=>!s)}
            style={{ width:44, height:44, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, cursor:"pointer", borderRight:"1px solid #111", flexShrink:0 }}>
            <div style={{ width:16, height:1.5, background:sidebarOpen?accent:"#444", transition:"all 0.2s", transform:sidebarOpen?"rotate(45deg) translate(2px, 4px)":"none" }}/>
            <div style={{ width:16, height:1.5, background:"#444", opacity:sidebarOpen?0:1, transition:"opacity 0.15s" }}/>
            <div style={{ width:16, height:1.5, background:sidebarOpen?accent:"#444", transition:"all 0.2s", transform:sidebarOpen?"rotate(-45deg) translate(2px, -4px)":"none" }}/>
          </div>

          <div style={{ flex:1, display:"flex", alignItems:"center", gap:6, padding:"0 12px", overflow:"hidden" }}>
            <span style={{ fontSize:11, color:accent, fontWeight:700, flexShrink:0 }}>{TYPE_META[ev.type]?.icon || "§"}</span>
            <span style={{ fontSize:11, color:"#333", flexShrink:0 }}>{ev.title}</span>
            {activeChapter && (<>
              <span style={{ fontSize:11, color:"#1e1e1e", flexShrink:0 }}>/</span>
              <span style={{ fontSize:11, color:"#666", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{activeChapter.title}</span>
            </>)}
            {activeSub && (<>
              <span style={{ fontSize:11, color:"#1e1e1e", flexShrink:0 }}>/</span>
              <span style={{ fontSize:11, color:"#444", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{activeSub.title}</span>
            </>)}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 12px", borderLeft:"1px solid #111", flexShrink:0 }}>
            <span style={{ fontSize:9, color:"#2a2a2a" }}>{activeWordCount}w</span>
            {/* Read mode toggle */}
            <div
              onClick={() => setReadMode(true)}
              title="Read mode"
              style={{ fontSize:9, color:"#333", cursor:"pointer", padding:"3px 10px", border:"1px solid #1a1a1a", userSelect:"none", letterSpacing:0.6, transition:"color 0.15s, border-color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = accent; e.currentTarget.style.borderColor = accent + '66'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#333'; e.currentTarget.style.borderColor = '#1a1a1a'; }}
            >Read</div>
            <div onClick={onClose} style={{ fontSize:11, color:"#444", cursor:"pointer", padding:"3px 8px", border:"1px solid #1a1a1a", userSelect:"none" }}>✕</div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ flex:1, display:"flex", overflow:"hidden", position:"relative" }}>

          {!isMobile && sidebarOpen && (
            <div className="doc-sidebar-scroll" style={{ width:220, flexShrink:0, borderRight:"1px solid #111", overflowY:"auto", display:"flex", flexDirection:"column" }}>
              <Sidebar/>
            </div>
          )}

          {isMobile && sidebarOpen && (
            <div style={{ position:"absolute", inset:0, zIndex:20, display:"flex" }}>
              <div className="doc-mobile-overlay" style={{ width:"80%", maxWidth:280, background:"#07090b", borderRight:`1px solid ${accent}22`, overflowY:"auto", display:"flex", flexDirection:"column", height:"100%" }}>
                <Sidebar/>
              </div>
              <div onClick={() => setSidebarOpen(false)} style={{ flex:1, background:"rgba(0,0,0,0.65)" }}/>
            </div>
          )}

          {/* ── EDITOR AREA ── */}
          <div className="doc-content-area" style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
            {activeChapter ? (
              <div style={{ flex:1, display:"flex", flexDirection:"column", padding: isMobile ? "20px 18px 40px" : "32px 40px 60px", maxWidth:760, width:"100%", boxSizing:"border-box" }}>

                {/* Header */}
                <div style={{ marginBottom:24, paddingBottom:16, borderBottom:`1px solid #0f0f0f` }}>
                  <div style={{ fontSize:9, color:accent+"55", letterSpacing:1.4, textTransform:"uppercase", marginBottom:8 }}>
                    {activeSub
                      ? `Ch. ${chapters.indexOf(activeChapter)+1} · Section ${activeChapter.subs.indexOf(activeSub)+1}`
                      : `Chapter ${chapters.indexOf(activeChapter)+1}`}
                  </div>
                  <input
                    value={activeTitle}
                    onChange={e => {
                      const val = e.target.value;
                      setChapters(p => p.map(ch => {
                        if (activeSub) {
                          if (ch.id !== activeChapterId) return ch;
                          return { ...ch, subs: ch.subs.map(s => s.id === activeSubId ? { ...s, title: val } : s) };
                        }
                        return ch.id === activeChapterId ? { ...ch, title: val } : ch;
                      }));
                    }}
                    style={{
                      width:"100%", background:"transparent", border:"none", outline:"none",
                      color:"#d4d4d8", fontSize: isMobile ? 22 : 28, fontWeight:700,
                      letterSpacing:-0.5, lineHeight:1.2, fontFamily:"inherit",
                      caretColor:accent, boxSizing:"border-box",
                    }}
                  />
                  {!activeSub && ev.prompt && (
                    <div style={{ fontSize:12, color:"#2a2a2a", marginTop:8, fontStyle:"italic", lineHeight:1.6 }}>{ev.prompt}</div>
                  )}
                  <div style={{ display:"flex", gap:14, marginTop:12, flexWrap:"wrap" }}>
                    {[
                      { label:"Words", value:`${activeWordCount}` },
                      { label:"Total", value:`${totalWords} / ${ev.wordGoal||500}` },
                      { label:"Chapters", value:chapters.length },
                      { label:"Progress", value:`${progress}%`, hi:progress>=100 },
                    ].map((s,i) => (
                      <div key={i} style={{ fontSize:9, color:"#2a2a2a" }}>
                        <span style={{ color:"#1e1e1e" }}>{s.label}: </span>
                        <span style={{ color:s.hi ? accent : "#333" }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── contentEditable writing area ── */}
                <div style={{ flex:1, position:"relative" }}>
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, width:2, background:`linear-gradient(to bottom, ${accent}44, transparent)` }}/>
                  <div
                    key={activeChapterId + '-' + activeSubId}
                    ref={editorRef}
                    className="doc-editor-div"
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                    data-placeholder={activeSub
                      ? `Write the content of "${activeTitle}" here…`
                      : `Begin writing Chapter ${chapters.indexOf(activeChapter)+1}…`}
                    dangerouslySetInnerHTML={{ __html: activeContent }}
                    onInput={() => {
                      if (editorRef.current) updateContent(editorRef.current.innerHTML);
                    }}
                    style={{
                      minHeight: isMobile ? 300 : 440,
                      color:"#9a9a9a", fontSize: isMobile ? 15 : 14, lineHeight:1.95,
                      fontFamily:"'Courier New', Courier, monospace",
                      padding:"0 0 0 16px", boxSizing:"border-box",
                      caretColor:accent,
                      WebkitTapHighlightColor:"transparent",
                    }}
                  />
                </div>

                {/* ── FORMATTING TOOLBAR (bottom) ── */}
                <FormattingToolbar
                  editorRef={editorRef}
                  accent={accent}
                  onUpdate={updateContent}
                />

                {/* Chapter navigation */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:20, marginTop:20, borderTop:"1px solid #0f0f0f" }}>
                  {(() => {
                    const ci = chapters.indexOf(activeChapter);
                    if (activeSub) {
                      const si = activeChapter.subs.indexOf(activeSub);
                      if (si > 0) {
                        const prev = activeChapter.subs[si-1];
                        return (<div onClick={() => setActiveSubId(prev.id)} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                          <span>{prev.title}</span></div>);
                      }
                      return (<div onClick={() => setActiveSubId(null)} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        <span>{activeChapter.title}</span></div>);
                    }
                    if (ci > 0) {
                      const prevCh = chapters[ci-1];
                      const lastSub = prevCh.subs[prevCh.subs.length-1];
                      return (<div onClick={() => { setActiveChapterId(prevCh.id); setActiveSubId(lastSub?.id || null); }} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        <span>{lastSub ? lastSub.title : prevCh.title}</span></div>);
                    }
                    return <div/>;
                  })()}
                  {(() => {
                    const ci = chapters.indexOf(activeChapter);
                    if (activeSub) {
                      const si = activeChapter.subs.indexOf(activeSub);
                      if (si < activeChapter.subs.length - 1) {
                        const next = activeChapter.subs[si+1];
                        return (<div onClick={() => setActiveSubId(next.id)} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                          <span>{next.title}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>);
                      }
                      if (ci < chapters.length - 1) {
                        const nextCh = chapters[ci+1];
                        return (<div onClick={() => { setActiveChapterId(nextCh.id); setActiveSubId(null); }} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                          <span>{nextCh.title}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>);
                      }
                      return <div/>;
                    }
                    if (activeChapter.subs.length > 0) {
                      const first = activeChapter.subs[0];
                      return (<div onClick={() => setActiveSubId(first.id)} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <span>{first.title}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>);
                    }
                    if (ci < chapters.length - 1) {
                      const nextCh = chapters[ci+1];
                      return (<div onClick={() => { setActiveChapterId(nextCh.id); setActiveSubId(null); }} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <span>{nextCh.title}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>);
                    }
                    return <div/>;
                  })()}
                </div>

                {/* Add section/chapter */}
                <div style={{ marginTop:24, display:"flex", gap:8 }}>
                  <div onClick={() => addSub(activeChapterId)}
                    style={{ fontSize:10, color:"#333", border:"1px solid #1a1a1a", padding:"6px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, userSelect:"none" }}>
                    <span style={{ color:accent+"66" }}>+</span> Add section to this chapter
                  </div>
                  <div onClick={addChapter}
                    style={{ fontSize:10, color:"#333", border:"1px solid #1a1a1a", padding:"6px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, userSelect:"none" }}>
                    <span style={{ color:accent+"66" }}>+</span> New chapter
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign:"center", padding:"80px 24px", color:"#222" }}>
                <div style={{ fontSize:32, marginBottom:12 }}>§</div>
                <div style={{ fontSize:13, fontStyle:"italic" }}>No chapters yet</div>
                <div onClick={addChapter} style={{ marginTop:20, fontSize:11, color:accent, border:`1px solid ${accent}44`, padding:"8px 20px", cursor:"pointer", display:"inline-block" }}>
                  + Add first chapter
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
