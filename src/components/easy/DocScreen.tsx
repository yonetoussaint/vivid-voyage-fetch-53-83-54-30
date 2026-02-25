import { useState, useEffect, useRef } from 'react';
import { TYPE_META } from '@/data/typeMeta';
import { useIsMobile } from '@/hooks/useMobile';
import { Avatar } from '@/components/easy/Avatar';
import { ContactSection } from '@/components/easy/ContactSection';
import { AttachmentSection } from '@/components/easy/AttachmentSection';

function generateId() {
  return "ch_" + Math.random().toString(36).slice(2, 9);
}

// ── Formatting toolbar (bottom, markdown-based) ──────────────────────────────
function FormattingToolbar({ textareaRef, accent, onUpdate, value }) {
  const applyFormat = (type) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const before = value.slice(0, start);
    const after = value.slice(end);

    let insert = selected;
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        insert = `**${selected || 'bold text'}**`;
        cursorOffset = selected ? insert.length : 2;
        break;
      case 'italic':
        insert = `*${selected || 'italic text'}*`;
        cursorOffset = selected ? insert.length : 1;
        break;
      case 'underline':
        // Markdown has no underline; use HTML-style comment hint or <u> tag
        insert = `<u>${selected || 'underlined text'}</u>`;
        cursorOffset = selected ? insert.length : 3;
        break;
      case 'h1': {
        // Apply to start of the current line
        const lineStart = before.lastIndexOf('\n') + 1;
        const lineContent = value.slice(lineStart, end);
        const stripped = lineContent.replace(/^#{1,6}\s*/, '');
        const newContent = `# ${stripped}`;
        const newValue = value.slice(0, lineStart) + newContent + value.slice(end);
        onUpdate(newValue);
        setTimeout(() => {
          el.focus();
          const pos = lineStart + newContent.length;
          el.setSelectionRange(pos, pos);
        }, 0);
        return;
      }
      case 'h2': {
        const lineStart = before.lastIndexOf('\n') + 1;
        const lineContent = value.slice(lineStart, end);
        const stripped = lineContent.replace(/^#{1,6}\s*/, '');
        const newContent = `## ${stripped}`;
        const newValue = value.slice(0, lineStart) + newContent + value.slice(end);
        onUpdate(newValue);
        setTimeout(() => {
          el.focus();
          const pos = lineStart + newContent.length;
          el.setSelectionRange(pos, pos);
        }, 0);
        return;
      }
      case 'bullet': {
        // Prefix each selected line with "- "
        const lineStart = before.lastIndexOf('\n') + 1;
        const selectionText = value.slice(lineStart, end);
        const bulleted = selectionText
          .split('\n')
          .map(line => line.startsWith('- ') ? line.slice(2) : `- ${line}`)
          .join('\n');
        const newValue = value.slice(0, lineStart) + bulleted + value.slice(end);
        onUpdate(newValue);
        setTimeout(() => {
          el.focus();
          const pos = lineStart + bulleted.length;
          el.setSelectionRange(pos, pos);
        }, 0);
        return;
      }
      default:
        return;
    }

    const newValue = before + insert + after;
    onUpdate(newValue);

    // Restore cursor / selection
    setTimeout(() => {
      el.focus();
      if (selected) {
        el.setSelectionRange(start, start + insert.length);
      } else {
        const cur = start + cursorOffset;
        el.setSelectionRange(cur, cur);
      }
    }, 0);
  };

  const buttons = [
    { type: 'bold',      label: 'B',  title: 'Bold (** **)',    style: { fontWeight: 700 } },
    { type: 'italic',    label: 'I',  title: 'Italic (* *)',    style: { fontStyle: 'italic' } },
    { type: 'underline', label: 'U',  title: 'Underline (<u>)', style: { textDecoration: 'underline' } },
    { type: 'h1',        label: 'H1', title: 'Heading 1',       style: { fontSize: 10, letterSpacing: 0.5 } },
    { type: 'h2',        label: 'H2', title: 'Heading 2',       style: { fontSize: 10, letterSpacing: 0.5 } },
    { type: 'bullet',    label: '≡',  title: 'Bullet list',     style: { fontSize: 15, lineHeight: 1 } },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      padding: '6px 0',
      borderTop: '1px solid #111',
      marginTop: 12,
      flexWrap: 'wrap',
    }}>
      {buttons.map(btn => (
        <button
          key={btn.type}
          title={btn.title}
          onMouseDown={e => {
            e.preventDefault(); // don't blur textarea
            applyFormat(btn.type);
          }}
          style={{
            background: 'transparent',
            border: '1px solid #1a1a1a',
            color: '#444',
            fontSize: 11,
            fontFamily: "'Courier New', Courier, monospace",
            width: 28,
            height: 26,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            transition: 'border-color 0.12s, color 0.12s',
            ...btn.style,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = accent + '66';
            e.currentTarget.style.color = accent;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#1a1a1a';
            e.currentTarget.style.color = '#444';
          }}
        >
          {btn.label}
        </button>
      ))}
      <span style={{ marginLeft: 4, fontSize: 9, color: '#1e1e1e' }}>md</span>
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

export function DocScreen({ ev, accent, text, setText, onClose }) {
  const isMobile = useIsMobile();

  // Chapters are stored as array of { id, title, content, subs: [{id, title, content}] }
  const initChapters = () => {
    if (text && text.trim().startsWith("[CHAPTERS]")) {
      try { return JSON.parse(text.slice("[CHAPTERS]".length)); } catch(e) {}
    }
    // Legacy: try to import old markdown text
    if (text && text.trim()) {
      return [{ id: generateId(), title: "Chapter 1", content: text, subs: [] }];
    }
    return [{ id: generateId(), title: "Introduction", content: "", subs: [] }];
  };

  const [chapters, setChapters] = useState(initChapters);
  const [activeChapterId, setActiveChapterId] = useState(() => initChapters()[0]?.id || null);
  const [activeSubId, setActiveSubId] = useState(null); // null = chapter body
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitleVal, setEditingTitleVal] = useState("");
  const [expandedIds, setExpandedIds] = useState({});
  const textareaRef = useRef(null);

  // Sync chapters → parent text
  useEffect(() => {
    setText("[CHAPTERS]" + JSON.stringify(chapters));
  }, [chapters]);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeChapterId, activeSubId]);

  const totalWords = chapters.reduce((acc, ch) => {
    const cw = ch.content.trim() ? ch.content.trim().split(/\s+/).length : 0;
    const sw = ch.subs.reduce((a, s) => a + (s.content.trim() ? s.content.trim().split(/\s+/).length : 0), 0);
    return acc + cw + sw;
  }, 0);
  const progress = Math.min(100, Math.round((totalWords / (ev.wordGoal || 500)) * 100));
  const readTime = Math.max(1, Math.ceil(totalWords / 200));

  // ── Chapter mutations ──
  const addChapter = () => {
    const id = generateId();
    const num = chapters.length + 1;
    const ch = { id, title: `Chapter ${num}`, content: "", subs: [] };
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
  const activeWordCount = activeContent.trim() ? activeContent.trim().split(/\s+/).length : 0;

  const Sidebar = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#07090b" }}>
      {/* Book meta */}
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

      {/* Chapter list */}
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
              {/* Chapter row */}
              <div
                style={{ display:"flex", alignItems:"center", gap:0, padding:"0 8px 0 10px", cursor:"pointer", userSelect:"none",
                  borderLeft:`2px solid ${chActive ? accent : "transparent"}`,
                  background: chActive ? accent+"0d" : "transparent", transition:"all 0.12s",
                  minHeight:36,
                }}
              >
                {/* Expand toggle */}
                <div onClick={() => setExpandedIds(p => ({...p, [ch.id]: !p[ch.id]}))}
                  style={{ width:18, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", color:"#2a2a2a", fontSize:9 }}>
                  {ch.subs.length > 0 ? (
                    <svg width="9" height="9" viewBox="0 0 10 10" style={{ transform: expanded ? "rotate(90deg)" : "none", transition:"transform 0.15s" }}>
                      <path d="M3 2l4 3-4 3" stroke="#444" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : <span style={{width:9}}/>}
                </div>
                {/* Chapter number */}
                <span style={{ fontSize:9, color:accent+"44", width:18, flexShrink:0, fontWeight:700, textAlign:"center" }}>{ci+1}</span>
                {/* Title / rename input */}
                <div style={{ flex:1, overflow:"hidden" }} onClick={() => { setActiveChapterId(ch.id); setActiveSubId(null); if(isMobile) setSidebarOpen(false); }}>
                  {editingTitleId === ch.id ? (
                    <input
                      autoFocus value={editingTitleVal}
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
                {/* Actions */}
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

              {/* Sub-chapters */}
              {expanded && ch.subs.map((sub, si) => {
                const subActive = activeChapterId === ch.id && activeSubId === sub.id;
                return (
                  <div key={sub.id}
                    style={{ display:"flex", alignItems:"center", gap:0, padding:"0 8px 0 30px", minHeight:30,
                      cursor:"pointer", userSelect:"none",
                      borderLeft:`2px solid ${subActive ? accent+"88" : "transparent"}`,
                      background: subActive ? accent+"08" : "transparent", transition:"all 0.12s",
                    }}
                    onClick={() => { setActiveChapterId(ch.id); setActiveSubId(sub.id); if(isMobile) setSidebarOpen(false); }}
                  >
                    <span style={{ fontSize:8, color:"#2a2a2a", width:28, flexShrink:0 }}>{ci+1}.{si+1}</span>
                    {editingTitleId === sub.id ? (
                      <input
                        autoFocus value={editingTitleVal}
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

      {/* Tags */}
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
    <div onClick={e=>e.stopPropagation()} style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"#06080a",
      display:"flex", flexDirection:"column",
      fontFamily:"'Courier New', Courier, monospace",
      animation:"docFadeIn 0.18s ease",
    }}>
      <style>{`
        @keyframes docFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .doc-content-area::-webkit-scrollbar { width:3px; }
        .doc-content-area::-webkit-scrollbar-thumb { background:#1e1e1e; border-radius:2px; }
        .doc-sidebar-scroll::-webkit-scrollbar { width:2px; }
        .doc-sidebar-scroll::-webkit-scrollbar-thumb { background:#111; }
        .doc-textarea-full::-webkit-scrollbar { display:none; }
        .doc-textarea-full::placeholder { color:#1e1e1e; }
        .doc-textarea-full:focus { outline:none; }
        .doc-mobile-overlay { animation:sideSlide 0.22s ease; }
        @keyframes sideSlide { from { transform:translateX(-100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        div:hover > .ch-actions { opacity:1 !important; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ display:"flex", alignItems:"center", height:44, borderBottom:"1px solid #111", background:"#07090b", flexShrink:0, zIndex:3 }}>
        {/* Hamburger */}
        <div onClick={() => setSidebarOpen(s=>!s)}
          style={{ width:44, height:44, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, cursor:"pointer", borderRight:"1px solid #111", flexShrink:0 }}>
          <div style={{ width:16, height:1.5, background:sidebarOpen?accent:"#444", transition:"all 0.2s", transform:sidebarOpen?"rotate(45deg) translate(2px, 4px)":"none" }}/>
          <div style={{ width:16, height:1.5, background:"#444", opacity:sidebarOpen?0:1, transition:"opacity 0.15s" }}/>
          <div style={{ width:16, height:1.5, background:sidebarOpen?accent:"#444", transition:"all 0.2s", transform:sidebarOpen?"rotate(-45deg) translate(2px, -4px)":"none" }}/>
        </div>
        {/* Breadcrumb */}
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:6, padding:"0 12px", overflow:"hidden" }}>
          <span style={{ fontSize:11, color:accent, fontWeight:700, flexShrink:0 }}>{TYPE_META[ev.type]?.icon || "§"}</span>
          <span style={{ fontSize:11, color:"#333", flexShrink:0 }}>{ev.title}</span>
          {activeChapter && (
            <>
              <span style={{ fontSize:11, color:"#1e1e1e", flexShrink:0 }}>/</span>
              <span style={{ fontSize:11, color:"#666", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{activeChapter.title}</span>
            </>
          )}
          {activeSub && (
            <>
              <span style={{ fontSize:11, color:"#1e1e1e", flexShrink:0 }}>/</span>
              <span style={{ fontSize:11, color:"#444", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{activeSub.title}</span>
            </>
          )}
        </div>
        {/* Word count + close */}
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 12px", borderLeft:"1px solid #111", flexShrink:0 }}>
          <span style={{ fontSize:9, color:"#2a2a2a" }}>{activeWordCount}w</span>
          <div onClick={onClose} style={{ fontSize:11, color:"#444", cursor:"pointer", padding:"3px 8px", border:"1px solid #1a1a1a", userSelect:"none" }}>✕</div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", position:"relative" }}>

        {/* Desktop sidebar */}
        {!isMobile && sidebarOpen && (
          <div className="doc-sidebar-scroll" style={{ width:220, flexShrink:0, borderRight:"1px solid #111", overflowY:"auto", display:"flex", flexDirection:"column" }}>
            <Sidebar/>
          </div>
        )}

        {/* Mobile sidebar overlay */}
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

              {/* Chapter/Section header */}
              <div style={{ marginBottom:24, paddingBottom:16, borderBottom:`1px solid #0f0f0f` }}>
                <div style={{ fontSize:9, color:accent+"55", letterSpacing:1.4, textTransform:"uppercase", marginBottom:8 }}>
                  {activeSub
                    ? `Ch. ${chapters.indexOf(activeChapter)+1} · Section ${activeChapter.subs.indexOf(activeSub)+1}`
                    : `Chapter ${chapters.indexOf(activeChapter)+1}`}
                </div>
                {/* Editable title */}
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
                {/* Prompt/hint */}
                {!activeSub && ev.prompt && (
                  <div style={{ fontSize:12, color:"#2a2a2a", marginTop:8, fontStyle:"italic", lineHeight:1.6 }}>{ev.prompt}</div>
                )}
                {/* Stats row */}
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

              {/* Writing area */}
              <div style={{ flex:1, position:"relative" }}>
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:2, background:`linear-gradient(to bottom, ${accent}44, transparent)` }}/>
                <textarea
                  ref={textareaRef}
                  className="doc-textarea-full"
                  value={activeContent}
                  onChange={e => updateContent(e.target.value)}
                  placeholder={activeSub
                    ? `Write the content of "${activeTitle}" here…`
                    : `Begin writing Chapter ${chapters.indexOf(activeChapter)+1}…\n\nYou can use plain prose here. Manage chapters and sections from the sidebar on the left.`}
                  style={{
                    width:"100%",
                    minHeight: isMobile ? 300 : 440,
                    background:"transparent", border:"none", outline:"none",
                    color:"#9a9a9a", fontSize: isMobile ? 15 : 14, lineHeight:1.95,
                    fontFamily:"'Courier New', Courier, monospace",
                    resize:"none", boxSizing:"border-box",
                    padding:"0 0 0 16px",
                    caretColor:accent,
                    WebkitTapHighlightColor:"transparent",
                  }}
                />
              </div>

              {/* ── FORMATTING TOOLBAR (bottom) ── */}
              <FormattingToolbar
                textareaRef={textareaRef}
                accent={accent}
                value={activeContent}
                onUpdate={updateContent}
              />

              {/* Chapter navigation */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:20, marginTop:20, borderTop:"1px solid #0f0f0f" }}>
                {/* Prev */}
                {(() => {
                  const ci = chapters.indexOf(activeChapter);
                  if (activeSub) {
                    const si = activeChapter.subs.indexOf(activeSub);
                    if (si > 0) {
                      const prev = activeChapter.subs[si-1];
                      return (
                        <div onClick={() => setActiveSubId(prev.id)} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                          <span>{prev.title}</span>
                        </div>
                      );
                    }
                    return (
                      <div onClick={() => setActiveSubId(null)} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        <span>{activeChapter.title}</span>
                      </div>
                    );
                  }
                  if (ci > 0) {
                    const prevCh = chapters[ci-1];
                    const lastSub = prevCh.subs[prevCh.subs.length-1];
                    return (
                      <div onClick={() => { setActiveChapterId(prevCh.id); setActiveSubId(lastSub?.id || null); }} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        <span>{lastSub ? lastSub.title : prevCh.title}</span>
                      </div>
                    );
                  }
                  return <div/>;
                })()}
                {/* Next */}
                {(() => {
                  const ci = chapters.indexOf(activeChapter);
                  if (activeSub) {
                    const si = activeChapter.subs.indexOf(activeSub);
                    if (si < activeChapter.subs.length - 1) {
                      const next = activeChapter.subs[si+1];
                      return (
                        <div onClick={() => setActiveSubId(next.id)} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                          <span>{next.title}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                        </div>
                      );
                    }
                    if (ci < chapters.length - 1) {
                      const nextCh = chapters[ci+1];
                      return (
                        <div onClick={() => { setActiveChapterId(nextCh.id); setActiveSubId(null); }} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                          <span>{nextCh.title}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                        </div>
                      );
                    }
                    return <div/>;
                  }
                  // currently on chapter body
                  if (activeChapter.subs.length > 0) {
                    const first = activeChapter.subs[0];
                    return (
                      <div onClick={() => setActiveSubId(first.id)} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <span>{first.title}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                      </div>
                    );
                  }
                  if (ci < chapters.length - 1) {
                    const nextCh = chapters[ci+1];
                    return (
                      <div onClick={() => { setActiveChapterId(nextCh.id); setActiveSubId(null); }} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <span>{nextCh.title}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                      </div>
                    );
                  }
                  return <div/>;
                })()}
              </div>

              {/* Add section button */}
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
  );
}
