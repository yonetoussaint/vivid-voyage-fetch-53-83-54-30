import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { TYPE_META, NOTE_TYPE_STYLE } from '@/data/typeMeta';
import { FIELDS } from '@/data/fieldsData';
import { DocScreen } from '@/components/easy/DocScreen';
import { ProjectScreen } from '@/components/easy/ProjectScreen';

interface Note {
  id: string;
  title: string;
  type: string;
  field: string;
  prompt?: string;
  tags: string[];
  content?: string;
  word_goal?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

function guessField(ev: any): string {
  const t = ((ev.title||"") + " " + (ev.prompt||"") + " " + (ev.tags||[]).join(" ")).toLowerCase();
  if (t.match(/finance|invest|stock|fund|budget|revenue|valuation|money|wealth|portfolio/)) return "finance";
  if (t.match(/econom|market|gdp|supply|demand|trade|macro|micro|inflation|recession/)) return "economics";
  if (t.match(/business|startup|product|strategy|brand|sales|client|customer|commerce|scent/)) return "business";
  if (t.match(/psycholog|mental|behavior|cognit|emotion|habit|mind|therapy|anxiety/)) return "psychology";
  if (t.match(/philosoph|ethic|logic|moral|exist|meaning|truth|stoic|virtue/)) return "philosophy";
  if (t.match(/science|physics|biology|chemistry|research|experiment|crispr|genome/)) return "science";
  if (t.match(/tech|software|api|code|auth|system|ai|ml|oauth|microservice|architect/)) return "technology";
  if (t.match(/math|calcul|algebra|statistic|probability|formula|bayes/)) return "mathematics";
  if (t.match(/histor|war|civiliz|empire|century|ancient|constantinople|byzantine/)) return "history";
  if (t.match(/literatur|novel|book|story|fiction|essay|piranesi|writing|narrative/)) return "literature";
  if (t.match(/law|legal|regulat|contract|right|court|policy|antitrust/)) return "law";
  if (t.match(/medicine|medic|health|doctor|treatment|diagnos|vo2|longevity/)) return "medicine";
  if (t.match(/art|design|music|film|creative|aesthetic|visual|bauhaus/)) return "arts";
  if (t.match(/social|society|community|culture|norms|group|dunbar/)) return "sociology";
  if (t.match(/politic|government|democra|power|elect|demagogu|republic/)) return "politics";
  if (t.match(/engineer|architect|system|build|infra|migration/)) return "engineering";
  return "personal";
}

const NOTE_TYPES = ["note","article","doc","journal","draft","project"];

// NoteFormModal Component
function NoteFormModal({ onClose, onAdd, onEdit, editNote, userId }: any) {
  const isEdit = !!editNote;
  const [form, setForm] = useState(isEdit ? {
    title: editNote.title,
    type:  editNote.type,
    field: editNote.field,
    prompt: editNote.prompt || "",
    tags: (editNote.tags || []).join(", "),
    word_goal: editNote.word_goal || 300,
  } : { title:"", type:"note", field:"personal", prompt:"", tags:"", word_goal:300 });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit() {
    if (!form.title.trim()) { 
      setError("Title is required"); 
      return; 
    }
    
    setIsSubmitting(true);
    
    const noteData = {
      title: form.title.trim(),
      type: form.type,
      field: form.field,
      prompt: form.prompt.trim(),
      tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      word_goal: form.word_goal,
    };

    try {
      if (isEdit) {
        const { data, error } = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', editNote.id)
          .select()
          .single();

        if (error) throw error;
        onEdit(data);
      } else {
        const { data, error } = await supabase
          .from('notes')
          .insert([{ ...noteData, user_id: userId }])
          .select()
          .single();

        if (error) throw error;
        onAdd(data);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldObjs = FIELDS.filter(f => f.id !== "all");

  const inputSt = {
    width:"100%", boxSizing:"border-box",
    background:"#0d0d0d", border:"1px solid #222",
    color:"#d4d4d8", fontSize:13, padding:"9px 11px",
    outline:"none", fontFamily:"'Roboto',sans-serif",
  };
  const labelSt = { fontSize:10, color:"#555", letterSpacing:0.8, textTransform:"uppercase", marginBottom:5, display:"block" };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:9998, animation:"overlayFade 0.2s ease" }}
      />
      <div style={{
        position:"fixed", left:0, right:0, bottom:0, top:"6%",
        background:"#0a0a0a", borderTop:"1px solid #1e1e1e",
        borderRadius:"14px 14px 0 0",
        zIndex:9999, padding:20, display:"flex", flexDirection:"column", gap:16,
        animation:"sheetUp 0.25s cubic-bezier(0.32,0.72,0,1)", overflowY:"auto",
      }}>
        <div style={{ display:"flex", justifyContent:"center", marginTop:-4, marginBottom:-4 }}>
          <div style={{ width:36, height:4, borderRadius:2, background:"#222" }} />
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#d4d4d8" }}>{isEdit ? "Edit Note" : "New Note"}</div>
          <div onClick={onClose} style={{ fontSize:20, color:"#555", cursor:"pointer", lineHeight:1, padding:"0 4px" }}>×</div>
        </div>

        <div>
          <label style={labelSt}>Title *</label>
          <input
            autoFocus
            value={form.title}
            onChange={e => { set("title", e.target.value); setError(""); }}
            placeholder="Note title…"
            style={inputSt}
          />
          {error && <div style={{ fontSize:11, color:"#ef5350", marginTop:4 }}>{error}</div>}
        </div>

        <div>
          <label style={labelSt}>Type</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {NOTE_TYPES.map(t => {
              const ts = NOTE_TYPE_STYLE[t] || NOTE_TYPE_STYLE.note;
              const active = form.type === t;
              return (
                <div key={t} onClick={() => set("type", t)} style={{
                  padding:"5px 11px", fontSize:11, cursor:"pointer", userSelect:"none",
                  border:`1px solid ${active ? ts.color : "#222"}`,
                  background: active ? ts.bg : "transparent",
                  color: active ? ts.color : "#555",
                  letterSpacing:0.5, textTransform:"uppercase", fontWeight: active ? 700 : 400,
                  transition:"all 0.12s",
                }}>
                  {t}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label style={labelSt}>Field</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, maxHeight:100, overflowY:"auto" }}>
            {fieldObjs.map((f: any) => {
              const active = form.field === f.id;
              return (
                <div key={f.id} onClick={() => set("field", f.id)} style={{
                  display:"flex", alignItems:"center", gap:5,
                  padding:"5px 10px", fontSize:11, cursor:"pointer", userSelect:"none",
                  border:`1px solid ${active ? f.color : "#222"}`,
                  background: active ? f.color+"18" : "transparent",
                  color: active ? f.color : "#555",
                  letterSpacing:0.4, transition:"all 0.12s",
                }}>
                  <span style={{ fontSize:12 }}>{f.icon}</span> {f.label}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label style={labelSt}>Prompt / Description</label>
          <textarea
            value={form.prompt}
            onChange={e => set("prompt", e.target.value)}
            placeholder="What is this note about?"
            rows={3}
            style={{ ...inputSt, resize:"none", lineHeight:1.5 }}
          />
        </div>

        <div>
          <label style={labelSt}>Word Goal</label>
          <input
            type="number"
            value={form.word_goal}
            onChange={e => set("word_goal", parseInt(e.target.value) || 300)}
            min={50}
            max={5000}
            style={inputSt}
          />
        </div>

        <div>
          <label style={labelSt}>Tags (comma-separated)</label>
          <input
            value={form.tags}
            onChange={e => set("tags", e.target.value)}
            placeholder="e.g. strategy, reading, ideas"
            style={inputSt}
          />
        </div>

        <div style={{ display:"flex", gap:10, marginTop:4 }}>
          <div onClick={onClose} style={{
            flex:1, padding:"11px 0", textAlign:"center",
            border:"1px solid #222", color:"#555", fontSize:13,
            cursor:"pointer", userSelect:"none",
          }}>
            Cancel
          </div>
          <div onClick={handleSubmit} style={{
            flex:2, padding:"11px 0", textAlign:"center",
            background:"#4285f4", color:"#fff", fontSize:13,
            fontWeight:700, cursor:"pointer", userSelect:"none",
            opacity: isSubmitting ? 0.5 : 1,
          }}>
            {isSubmitting ? "Saving..." : (isEdit ? "Save Changes" : "Create Note")}
          </div>
        </div>
      </div>
    </>
  );
}

// SwipeableRow Component
function SwipeableRow({ note, onEdit, onDelete, children }: any) {
  const ACTION_W = 160;
  const SNAP_AT = ACTION_W * 0.4;
  const startX = useRef<any>(null);
  const startY = useRef<any>(null);
  const dragging = useRef(false);
  const locked = useRef(false);
  const [offset, setOffset] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(true);

  const open = () => { setAnimate(true); setOffset(ACTION_W); setIsOpen(true); };
  const close = () => { setAnimate(true); setOffset(0); setIsOpen(false); };

  function onTouchStart(e: any) {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    dragging.current = true;
    locked.current = false;
    setAnimate(false);
  }

  function onTouchMove(e: any) {
    if (!dragging.current) return;
    const dx = startX.current - e.touches[0].clientX;
    const dy = Math.abs(e.touches[0].clientY - startY.current);

    if (!locked.current) {
      if (dy > Math.abs(dx) + 4) { dragging.current = false; setAnimate(true); return; }
      if (Math.abs(dx) > 6) locked.current = true;
    }
    if (!locked.current) return;

    e.preventDefault();

    const base = isOpen ? ACTION_W : 0;
    const raw = base + dx;
    if (raw <= 0) {
      setOffset(Math.max(raw * 0.15, -12));
    } else if (raw > ACTION_W) {
      setOffset(ACTION_W + (raw - ACTION_W) * 0.15);
    } else {
      setOffset(raw);
    }
  }

  function onTouchEnd() {
    if (!dragging.current) return;
    dragging.current = false;
    setAnimate(true);
    if (offset >= SNAP_AT) { open(); } else { close(); }
  }

  function onRowClick(e: any) {
    if (isOpen) { e.stopPropagation(); close(); }
  }

  return (
    <div style={{ position:"relative", overflow:"hidden" }}>
      <div style={{
        position:"absolute", top:0, right:0, bottom:0, width:ACTION_W,
        display:"flex", overflow:"hidden",
      }}>
        <div
          onClick={e => { e.stopPropagation(); close(); setTimeout(() => onEdit(note), 180); }}
          style={{
            flex:1, display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:5,
            background:"#0d2340",
            borderLeft:"1px solid #4285f422",
            cursor:"pointer", userSelect:"none",
            transition:"background 0.15s",
          }}
          onMouseDown={e => e.currentTarget.style.background = "#1a3a5c"}
          onMouseUp={e => e.currentTarget.style.background = "#0d2340"}
          onTouchStart={e => e.currentTarget.style.background = "#1a3a5c"}
          onTouchEnd={e => e.currentTarget.style.background = "#0d2340"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span style={{ fontSize:10, color:"#4285f4", letterSpacing:0.8, fontWeight:600 }}>Edit</span>
        </div>

        <div
          onClick={e => { e.stopPropagation(); close(); setTimeout(() => onDelete(note), 180); }}
          style={{
            flex:1, display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:5,
            background:"#2a0d0d",
            borderLeft:"1px solid #ef535022",
            cursor:"pointer", userSelect:"none",
            transition:"background 0.15s",
          }}
          onMouseDown={e => e.currentTarget.style.background = "#3d1212"}
          onMouseUp={e => e.currentTarget.style.background = "#2a0d0d"}
          onTouchStart={e => e.currentTarget.style.background = "#3d1212"}
          onTouchEnd={e => e.currentTarget.style.background = "#2a0d0d"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef5350" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          <span style={{ fontSize:10, color:"#ef5350", letterSpacing:0.8, fontWeight:600 }}>Delete</span>
        </div>
      </div>

      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onRowClick}
        style={{
          transform:`translateX(-${offset}px)`,
          transition: animate ? "transform 0.28s cubic-bezier(0.25,1,0.5,1)" : "none",
          willChange:"transform",
          boxShadow: isOpen ? "none" : "inset -3px 0 0 #ffffff08",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Main NotesTab Component
export function NotesTab() {
  const { user, isAuthenticated } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeField, setActiveField] = useState("all");
  const [openNote, setOpenNote] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [noteContents, setNoteContents] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editNote, setEditNote] = useState<any>(null);

  // Fetch notes from Supabase
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => setAddOpen(true);
  const closeAddModal = () => { setAddOpen(false); setEditNote(null); };

  async function handleAddNote(newNote: Note) {
    setNotes(prev => [newNote, ...prev]);
  }

  async function handleEditNote(updatedNote: Note) {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  }

  async function handleDeleteNote(note: Note) {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id);

      if (error) throw error;
      
      setNotes(prev => prev.filter(n => n.id !== note.id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  async function handleContentSave(noteId: string, content: string) {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ content })
        .eq('id', noteId);

      if (error) throw error;
      
      setNoteContents(prev => ({ ...prev, [noteId]: content }));
    } catch (error) {
      console.error('Error saving note content:', error);
    }
  }

  // Filter notes
  const filtered = notes.filter(n => {
    const matchF = activeField === "all" || n.field === activeField;
    const q = search.toLowerCase();
    const matchS = !q || (n.title + (n.prompt || "") + (n.tags || []).join(" ")).toLowerCase().includes(q);
    return matchF && matchS;
  });

  // Group by field
  const groups = activeField === "all"
    ? FIELDS.slice(1).reduce((acc: any[], f: any) => {
        const ns = filtered.filter(n => n.field === f.id);
        if (ns.length) acc.push({ field: f, notes: ns });
        return acc;
      }, [])
    : [{ field: FIELDS.find((f: any) => f.id === activeField) || FIELDS[0], notes: filtered }];

  if (!isAuthenticated) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", background:"#000", color:"#fff" }}>
        <div style={{ textAlign:"center" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" style={{ margin:"0 auto 16px", display:"block" }}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <div style={{ fontSize:16, fontWeight:600, color:"#666", marginBottom:8 }}>Sign in to view your notes</div>
          <div style={{ fontSize:13, color:"#333" }}>Your notes will appear here after login</div>
        </div>
      </div>
    );
  }

  if (openNote) {
    if (openNote.type === "project") {
      return <ProjectScreen ev={openNote} onClose={() => setOpenNote(null)} />;
    }
    const accent = TYPE_META[openNote.type]?.accent || openNote.color || "#86efac";
    return (
      <DocScreen
        ev={openNote}
        accent={accent}
        text={noteContents[openNote.id] || openNote.content || ""}
        setText={(val: string) => handleContentSave(openNote.id, val)}
        onClose={() => setOpenNote(null)}
      />
    );
  }

  const activeFieldObj = FIELDS.find((f: any) => f.id === activeField) || FIELDS[0];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#000", color:"#fff", fontFamily:"'Roboto',sans-serif", overflow:"hidden", position:"relative" }}>
      <style>{`
        .note-row:active{background:#0d0d0d!important}
        @keyframes notesFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sidebarSlide{from{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes overlayFade{from{opacity:0}to{opacity:1}}
        @keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .sidebar-field-row:active{background:#1a1a1a!important}
      `}</style>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)", zIndex:30, animation:"overlayFade 0.2s ease" }}
        />
      )}

      {sidebarOpen && (
        <div style={{
          position:"absolute", top:0, left:0, bottom:0, width:240,
          background:"#0a0a0a", borderRight:"1px solid #1a1a1a",
          zIndex:40, display:"flex", flexDirection:"column",
          animation:"sidebarSlide 0.22s ease",
        }}>
          <div style={{ padding:"20px 20px 12px", borderBottom:"1px solid #111" }}>
            <div style={{ fontSize:13, fontWeight:700, letterSpacing:1.2, color:"#555", textTransform:"uppercase", marginBottom:2 }}>Fields</div>
            <div style={{ fontSize:10, color:"#2a2a2a" }}>{notes.length} total entries</div>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
            {FIELDS.map((f: any) => {
              const active = activeField === f.id;
              const count = f.id === "all" ? notes.length : notes.filter(n => n.field === f.id).length;
              return (
                <div
                  key={f.id}
                  className="sidebar-field-row"
                  onClick={() => { setActiveField(f.id); setSidebarOpen(false); }}
                  style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"12px 20px", cursor:"pointer", userSelect:"none",
                    background: active ? f.color+"11" : "transparent",
                    borderLeft: `3px solid ${active ? f.color : "transparent"}`,
                    transition:"all 0.12s",
                  }}
                >
                  <span style={{ display:"flex", alignItems:"center", color: active ? f.color : "#444", fontSize:15 }}>{f.icon}</span>
                  <span style={{ flex:1, fontSize:13, fontWeight: active ? 600 : 400, color: active ? f.color : "#666", letterSpacing:0.2 }}>{f.label}</span>
                  <span style={{ fontSize:10, color: active ? f.color+"99" : "#2a2a2a", fontVariantNumeric:"tabular-nums" }}>{count}</span>
                </div>
              );
            })}
          </div>

          <div style={{ padding:"16px 20px", borderTop:"1px solid #111" }}>
            <div
              onClick={() => { setSidebarOpen(false); openAddModal(); }}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", background:"#4285f411", border:"1px solid #4285f422", borderRadius:4, cursor:"pointer" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#4285f4" strokeWidth="2.5" strokeLinecap="round"/></svg>
              <span style={{ fontSize:12, color:"#4285f4", fontWeight:600 }}>New Note</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ flexShrink:0, padding:"16px 20px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div
              onClick={() => setSidebarOpen(s => !s)}
              style={{ width:36, height:36, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, cursor:"pointer", flexShrink:0 }}
            >
              <div style={{ width:20, height:1.5, background:"#aaa", borderRadius:1 }}/>
              <div style={{ width:14, height:1.5, background:"#aaa", borderRadius:1 }}/>
              <div style={{ width:20, height:1.5, background:"#aaa", borderRadius:1 }}/>
            </div>
            <div>
              <div style={{ fontSize:24, fontWeight:700, letterSpacing:-0.5, display:"flex", alignItems:"center", gap:8 }}>
                {activeField !== "all" && <span style={{ color: activeFieldObj.color, fontSize:18 }}>{activeFieldObj.icon}</span>}
                {activeField === "all" ? "Notes" : activeFieldObj.label}
              </div>
              <div style={{ fontSize:11, color:"#444", marginTop:2 }}>
                {activeField === "all"
                  ? `${notes.length} entries across ${FIELDS.length - 1} fields`
                  : `${filtered.length} entries`}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div
              onClick={() => { setSearchOpen(s=>!s); if(searchOpen) setSearch(""); }}
              style={{ width:36, height:36, borderRadius:"50%", background:searchOpen?"#1e1e1e":"transparent", border:"1px solid #1e1e1e", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={searchOpen?"#fff":"#555"} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <div
              onClick={openAddModal}
              style={{ width:36, height:36, borderRadius:"50%", background:"#4285f4", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#0d0d0d", border:"1px solid #1e1e1e", padding:"8px 12px", marginBottom:10, animation:"notesFade 0.15s ease" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search notes, tags, topics…" style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#bbb", fontSize:13 }}/>
            {search && <div onClick={()=>setSearch("")} style={{ fontSize:16, color:"#333", cursor:"pointer", lineHeight:1 }}>×</div>}
          </div>
        )}
      </div>

      <div style={{ flex:1, overflowY:"auto" }}>
        {loading && (
          <div style={{ textAlign:"center", padding:"60px 24px", color:"#222" }}>
            <div style={{ fontSize:13 }}>Loading notes...</div>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 24px", color:"#222" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" style={{ margin:"0 auto 12px", display:"block" }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <div style={{ fontSize:13 }}>No notes in this field yet</div>
            <div 
              onClick={openAddModal}
              style={{ marginTop:16, fontSize:12, color:"#4285f4", cursor:"pointer" }}
            >
              + Create your first note
            </div>
          </div>
        )}

        {groups.map(({ field, notes }: any) => (
          <div key={field.id} style={{ marginBottom: activeField==="all" ? 8 : 0 }}>
            {activeField === "all" && (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"14px 20px 10px", background:"#000", position:"sticky", top:0, zIndex:2 }}>
                <span style={{ display:"flex", alignItems:"center", color:field.color }}>{field.icon}</span>
                <span style={{ fontSize:11, fontWeight:700, color:field.color, letterSpacing:0.8, textTransform:"uppercase" }}>{field.label}</span>
                <span style={{ fontSize:10, color:"#333" }}>{notes.length}</span>
                <div onClick={()=>setActiveField(field.id)} style={{ marginLeft:"auto", display:"flex", alignItems:"center", cursor:"pointer", padding:"4px", opacity:0.5 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={field.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
            )}

            {notes.map((note: Note, i: number) => {
              const ts = NOTE_TYPE_STYLE[note.type] || NOTE_TYPE_STYLE.note;
              const fd = FIELDS.find((f: any) => f.id === note.field) || FIELDS[0];
              const content = noteContents[note.id] || note.content || "";
              const wc = content.trim().split(/\s+/).filter(Boolean).length;
              const pct = Math.min(100, Math.round((wc / (note.word_goal || 300)) * 100));

              const rowContent = (
                <div key={note.id} className="note-row" onClick={() => setOpenNote(note)}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", cursor:"pointer",
                    borderLeft:`3px solid ${fd.color}${activeField==="all"?"33":"55"}`,
                    borderBottom:"1px solid #080808", background:"#000",
                    animation:`notesFade 0.15s ease ${i*0.03}s both`,
                  }}
                >
                  <div style={{ width:36, height:36, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                    background:ts.bg, border:`1px solid ${ts.color}22` }}>
                    <span style={{ fontFamily:"'Courier New',monospace", fontSize:14, color:ts.color, lineHeight:1 }}>
                      {note.type==="note"?"§":note.type==="article"?"¶":note.type==="doc"?"#":note.type==="journal"?"~":note.type==="project"?"◎":"✎"}
                    </span>
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:"#d4d4d8", marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {note.title}
                    </div>
                    <div style={{ fontSize:11, color:"#444", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:6 }}>
                      {note.prompt || "No description"}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <span style={{ fontSize:9, color:ts.color, border:`1px solid ${ts.color}33`, padding:"1px 5px", letterSpacing:0.8, textTransform:"uppercase" }}>{ts.label}</span>
                      {activeField==="all" && (
                        <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:9, color:fd.color+"99" }}>
                          <span style={{ display:"flex", alignItems:"center", transform:"scale(0.7)", transformOrigin:"left" }}>{fd.icon}</span>
                          {fd.label}
                        </span>
                      )}
                      {(note.tags || []).slice(0,2).map(t => (
                        <span key={t} style={{ fontSize:9, color:"#333" }}>#{t}</span>
                      ))}
                      {wc > 0 && (
                        <>
                          <span style={{ fontSize:9, color:"#2a2a2a" }}>{wc}w</span>
                          <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                            <div style={{ width:32, height:2, background:"#111", borderRadius:1, overflow:"hidden" }}>
                              <div style={{ width:`${pct}%`, height:"100%", background:ts.color, opacity:0.7 }}/>
                            </div>
                            <span style={{ fontSize:8, color:"#2a2a2a" }}>{pct}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>
                    <path d="M9 18l6-6-6-6" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              );

              return (
                <SwipeableRow
                  key={note.id}
                  note={note}
                  onEdit={(n: Note) => { setEditNote(n); setAddOpen(true); }}
                  onDelete={handleDeleteNote}
                >
                  {rowContent}
                </SwipeableRow>
              );
            })}
          </div>
        ))}
      </div>

      {addOpen && (
        <NoteFormModal
          onClose={closeAddModal}
          onAdd={handleAddNote}
          onEdit={handleEditNote}
          editNote={editNote}
          userId={user?.id}
        />
      )}
    </div>
  );
}