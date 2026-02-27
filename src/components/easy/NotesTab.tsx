import { useState, useRef, useEffect } from 'react';
import { TYPE_META, NOTE_TYPE_STYLE } from '@/data/typeMeta';
import { SAMPLE_NOTES } from '@/data/notesData';
import { events } from '@/data/eventsData';
import { FIELDS } from '@/data/fieldsData';
import { DocScreen } from '@/components/easy/DocScreen';
import { ProjectScreen } from '@/components/easy/ProjectScreen';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Note {
  id: string;
  title: string;
  content?: string;
  type: string;
  field: string;
  prompt?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  is_custom?: boolean;
}

function guessField(ev) {
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

// Storage for note content (you might want to move this to Supabase too)
const writingStorage: Record<string, string> = {};

const NOTE_TYPES = ["note","article","doc","journal","draft","project"];

// NoteFormModal component
function NoteFormModal({ onClose, onAdd, onEdit, editNote }) {
  const isEdit = !!editNote;
  const [form, setForm] = useState(isEdit ? {
    title: editNote.title,
    type:  editNote.type,
    field: editNote.field,
    prompt: editNote.prompt || "",
    tags: (editNote.tags || []).join(", "),
  } : { title:"", type:"note", field:"personal", prompt:"", tags:"" });
  const [error, setError] = useState("");
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  function handleSubmit() {
    if (!form.title.trim()) { setError("Title is required"); return; }
    const data = {
      title:  form.title.trim(),
      type:   form.type,
      field:  form.field,
      prompt: form.prompt.trim(),
      tags:   form.tags.split(",").map(t => t.trim()).filter(Boolean),
      is_custom: true,
    };
    if (isEdit) {
      onEdit({ ...editNote, ...data });
    } else {
      onAdd({ ...data });
    }
    onClose();
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
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:9998, animation:"overlayFade 0.2s ease" }}
      />
      {/* Panel */}
      <div style={{
        position:"fixed", left:0, right:0, bottom:0, top:"6%",
        background:"#0a0a0a", borderTop:"1px solid #1e1e1e",
        borderRadius:"14px 14px 0 0",
        zIndex:9999, padding:20, display:"flex", flexDirection:"column", gap:16,
        animation:"sheetUp 0.25s cubic-bezier(0.32,0.72,0,1)", overflowY:"auto",
      }}>
        {/* Drag handle */}
        <div style={{ display:"flex", justifyContent:"center", marginTop:-4, marginBottom:-4 }}>
          <div style={{ width:36, height:4, borderRadius:2, background:"#222" }} />
        </div>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#d4d4d8" }}>{isEdit ? "Edit Note" : "New Note"}</div>
          <div onClick={onClose} style={{ fontSize:20, color:"#555", cursor:"pointer", lineHeight:1, padding:"0 4px" }}>×</div>
        </div>

        {/* Title */}
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

        {/* Type */}
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

        {/* Field */}
        <div>
          <label style={labelSt}>Field</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, maxHeight:100, overflowY:"auto" }}>
            {fieldObjs.map(f => {
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

        {/* Prompt */}
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

        {/* Tags */}
        <div>
          <label style={labelSt}>Tags (comma-separated)</label>
          <input
            value={form.tags}
            onChange={e => set("tags", e.target.value)}
            placeholder="e.g. strategy, reading, ideas"
            style={inputSt}
          />
        </div>

        {/* Actions */}
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
          }}>
            {isEdit ? "Save Changes" : "Create Note"}
          </div>
        </div>
      </div>
    </>
  );
}

// SwipeableRow component
function SwipeableRow({ note, onEdit, onDelete, children }) {
  const ACTION_W   = 160;
  const SNAP_AT    = ACTION_W * 0.4;
  const startX     = useRef(null);
  const startY     = useRef(null);
  const dragging   = useRef(false);
  const locked     = useRef(false);
  const [offset, setOffset]     = useState(0);
  const [isOpen,  setIsOpen]    = useState(false);
  const [animate, setAnimate]   = useState(true);

  const open  = () => { setAnimate(true); setOffset(ACTION_W); setIsOpen(true); };
  const close = () => { setAnimate(true); setOffset(0);        setIsOpen(false); };

  function onTouchStart(e) {
    startX.current  = e.touches[0].clientX;
    startY.current  = e.touches[0].clientY;
    dragging.current = true;
    locked.current   = false;
    setAnimate(false);
  }

  function onTouchMove(e) {
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
    const raw  = base + dx;
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

  function onRowClick(e) {
    if (isOpen) { e.stopPropagation(); close(); }
  }

  return (
    <div style={{ position:"relative", overflow:"hidden" }}>
      {/* Action strip behind the row */}
      <div style={{
        position:"absolute", top:0, right:0, bottom:0, width:ACTION_W,
        display:"flex", overflow:"hidden",
      }}>
        {/* Edit */}
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="1.5">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
          <span style={{ fontSize:10, color:"#4285f4" }}>Edit</span>
        </div>
        {/* Delete */}
        <div
          onClick={e => { e.stopPropagation(); close(); setTimeout(() => onDelete(note.id), 180); }}
          style={{
            flex:1, display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:5,
            background:"#2d1a1a",
            cursor:"pointer", userSelect:"none",
            transition:"background 0.15s",
          }}
          onMouseDown={e => e.currentTarget.style.background = "#4d2a2a"}
          onMouseUp={e => e.currentTarget.style.background = "#2d1a1a"}
          onTouchStart={e => e.currentTarget.style.background = "#4d2a2a"}
          onTouchEnd={e => e.currentTarget.style.background = "#2d1a1a"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef5350" strokeWidth="1.5">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0h12M10 11v5M14 11v5"/>
          </svg>
          <span style={{ fontSize:10, color:"#ef5350" }}>Delete</span>
        </div>
      </div>

      {/* Content */}
      <div
        onClick={onRowClick}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={{
          transform: `translateX(-${offset}px)`,
          transition: animate ? 'transform 0.2s cubic-bezier(0.2,0.9,0.3,1)' : 'none',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          background: '#0a0a0a',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Main NotesTab component
export function NotesTab() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [migrating, setMigrating] = useState(false);

  // Load notes from Supabase
  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
      } else {
        setNotes(data || []);
      }
      setLoading(false);
    };

    fetchNotes();
  }, [user]);

  // Migrate localStorage data to Supabase
  const migrateLocalStorageData = async () => {
    if (!user || migrating) return;

    try {
      setMigrating(true);
      const localNotes = JSON.parse(localStorage.getItem('custom_notes_v1') || '[]');
      
      if (localNotes.length === 0) return;

      const notesToMigrate = localNotes.map(note => ({
        ...note,
        user_id: user.id,
        content: writingStorage[note._id] || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('notes')
        .insert(notesToMigrate);

      if (error) {
        console.error('Error migrating notes:', error);
      } else {
        localStorage.removeItem('custom_notes_v1');
        // Refresh notes
        const { data } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setNotes(data || []);
      }
    } catch (error) {
      console.error('Migration error:', error);
    } finally {
      setMigrating(false);
    }
  };

  // Show migration prompt if there's localStorage data
  useEffect(() => {
    if (user && notes.length === 0 && !migrating) {
      const localNotes = localStorage.getItem('custom_notes_v1');
      if (localNotes && JSON.parse(localNotes).length > 0) {
        if (window.confirm('Found existing notes in local storage. Would you like to import them?')) {
          migrateLocalStorageData();
        }
      }
    }
  }, [user, notes.length]);

  const handleAddNote = async (noteData) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .insert([{
        ...noteData,
        user_id: user.id,
        content: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
    } else {
      setNotes(prev => [data, ...prev]);
      setSelectedNote(data);
    }
  };

  const handleEditNote = async (updatedNote) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .update({
        title: updatedNote.title,
        type: updatedNote.type,
        field: updatedNote.field,
        prompt: updatedNote.prompt,
        tags: updatedNote.tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', updatedNote.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
    } else {
      setNotes(prev => prev.map(n => n.id === data.id ? data : n));
      setEditingNote(null);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting note:', error);
    } else {
      setNotes(prev => prev.filter(n => n.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  const handleCloseDoc = () => {
    setSelectedNote(null);
  };

  const fieldObjs = FIELDS.filter(f => f.id !== "all");
  const getField = (fieldId: string) => fieldObjs.find(f => f.id === fieldId) || fieldObjs[0];

  // If a note is selected, show DocScreen
  if (selectedNote) {
    return (
      <DocScreen
        noteId={selectedNote.id}
        initialTitle={selectedNote.title}
        initialContent={selectedNote.content}
        onTitleChange={(title) => {
          setNotes(prev => prev.map(n => 
            n.id === selectedNote.id ? { ...n, title } : n
          ));
        }}
      />
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000' }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #111',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: '#fff' }}>Notes</h2>
        <button
          onClick={() => setShowFormModal(true)}
          style={{
            background: '#4285f4',
            border: 'none',
            color: '#fff',
            width: 36,
            height: 36,
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 20,
          }}
        >
          +
        </button>
      </div>

      {/* Notes list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#555', padding: 20 }}>Loading notes...</div>
        ) : notes.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#555', padding: 40 }}>
            <p>No notes yet</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Tap + to create your first note</p>
          </div>
        ) : (
          notes.map(note => {
            const field = getField(note.field);
            const typeStyle = NOTE_TYPE_STYLE[note.type] || NOTE_TYPE_STYLE.note;
            
            return (
              <SwipeableRow
                key={note.id}
                note={note}
                onEdit={setEditingNote}
                onDelete={handleDeleteNote}
              >
                <div
                  onClick={() => handleNoteClick(note)}
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #111',
                    background: '#0a0a0a',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 14 }}>{field?.icon}</span>
                    <span style={{
                      fontSize: 11,
                      color: typeStyle.color,
                      background: typeStyle.bg,
                      padding: '2px 8px',
                      borderRadius: 12,
                      textTransform: 'uppercase',
                    }}>
                      {note.type}
                    </span>
                    {note.tags && note.tags.length > 0 && (
                      <span style={{ fontSize: 10, color: '#555' }}>
                        {note.tags.slice(0, 2).join(', ')}
                        {note.tags.length > 2 && '...'}
                      </span>
                    )}
                  </div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 500, color: '#fff' }}>
                    {note.title}
                  </h3>
                  {note.prompt && (
                    <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.4 }}>
                      {note.prompt.length > 100 ? note.prompt.slice(0, 100) + '...' : note.prompt}
                    </p>
                  )}
                </div>
              </SwipeableRow>
            );
          })
        )}
      </div>

      {/* Note Form Modal */}
      {showFormModal && (
        <NoteFormModal
          onClose={() => setShowFormModal(false)}
          onAdd={handleAddNote}
          onEdit={handleEditNote}
        />
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <NoteFormModal
          editNote={editingNote}
          onClose={() => setEditingNote(null)}
          onAdd={handleAddNote}
          onEdit={handleEditNote}
        />
      )}
    </div>
  );
}