import { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const FIELDS = [
  { id: "all",          label: "All",          color: "#888",    icon: "◈" },
  { id: "technology",   label: "Technology",   color: "#38bdf8", icon: "⬡" },
  { id: "finance",      label: "Finance",      color: "#34d399", icon: "◎" },
  { id: "business",     label: "Business",     color: "#fb923c", icon: "▣" },
  { id: "psychology",   label: "Psychology",   color: "#c084fc", icon: "◍" },
  { id: "philosophy",   label: "Philosophy",   color: "#f9a8d4", icon: "◬" },
  { id: "science",      label: "Science",      color: "#67e8f9", icon: "⬡" },
  { id: "mathematics",  label: "Mathematics",  color: "#fbbf24", icon: "△" },
  { id: "history",      label: "History",      color: "#a78bfa", icon: "◫" },
  { id: "literature",   label: "Literature",   color: "#86efac", icon: "❡" },
  { id: "law",          label: "Law",          color: "#fca5a5", icon: "⊞" },
  { id: "medicine",     label: "Medicine",     color: "#6ee7b7", icon: "⊕" },
  { id: "arts",         label: "Arts",         color: "#f472b6", icon: "◈" },
  { id: "sociology",    label: "Sociology",    color: "#93c5fd", icon: "◉" },
  { id: "politics",     label: "Politics",     color: "#fde047", icon: "◆" },
  { id: "engineering",  label: "Engineering",  color: "#d1d5db", icon: "⬟" },
  { id: "personal",     label: "Personal",     color: "#e2e8f0", icon: "◌" },
  { id: "economics",    label: "Economics",    color: "#4ade80", icon: "◑" },
];

const NOTE_TYPE_STYLE = {
  note:    { label: "Note",    color: "#86efac", bg: "#86efac11" },
  article: { label: "Article", color: "#93c5fd", bg: "#93c5fd11" },
  doc:     { label: "Doc",     color: "#fbbf24", bg: "#fbbf2411" },
  journal: { label: "Journal", color: "#c084fc", bg: "#c084fc11" },
  draft:   { label: "Draft",   color: "#f97316", bg: "#f9731611" },
  project: { label: "Project", color: "#f472b6", bg: "#f472b611" },
};

const NOTE_TYPES = ["note", "article", "doc", "journal", "draft", "project"];
const TYPE_GLYPH = { note:"§", article:"¶", doc:"#", journal:"~", project:"◎", draft:"✎" };

const SAMPLE_NOTES = [
  { title:"OAuth 2.0 Deep Dive",    type:"doc",     field:"technology",  prompt:"Full breakdown of authorization flows",    tags:["oauth","auth","api"]         },
  { title:"Portfolio Rebalancing",  type:"note",    field:"finance",     prompt:"Quarterly rebalancing strategy notes",     tags:["portfolio","index"]          },
  { title:"Stoic Morning Ritual",   type:"journal", field:"philosophy",  prompt:"Daily Meditations practice log",           tags:["stoic","marcus","morning"]   },
  { title:"CRISPR Ethics",          type:"article", field:"science",     prompt:"Moral implications of gene editing",       tags:["crispr","bioethics"]         },
  { title:"Dunbar's Number",        type:"note",    field:"sociology",   prompt:"Social group size limits research",        tags:["social","cognition"]         },
  { title:"Bayes Theorem Apps",     type:"doc",     field:"mathematics", prompt:"Real world applications in ML systems",    tags:["bayes","probability","ml"]   },
  { title:"Piranesi Analysis",      type:"article", field:"literature",  prompt:"Themes of memory and labyrinthine space",  tags:["piranesi","clarke","fiction"] },
  { title:"VO2 Max Protocol",       type:"note",    field:"medicine",    prompt:"Zone 2 and high intensity training notes", tags:["health","vo2","longevity"]   },
  { title:"Byzantine History",      type:"article", field:"history",     prompt:"Fall of Constantinople deep research",     tags:["byzantine","ottoman"]        },
  { title:"Microservice Arch",      type:"project", field:"engineering", prompt:"Migration plan from monolith to services", tags:["system","microservice"]      },
  { title:"Brand Strategy",         type:"draft",   field:"business",    prompt:"Consumer perfume brand positioning",       tags:["brand","scent","strategy"]   },
  { title:"Antitrust Law 101",      type:"doc",     field:"law",         prompt:"Big tech regulatory landscape overview",   tags:["law","antitrust","tech"]     },
  { title:"Bauhaus Principles",     type:"note",    field:"arts",        prompt:"Form follows function design doctrine",    tags:["bauhaus","design","art"]     },
  { title:"Demagoguery Patterns",   type:"article", field:"politics",    prompt:"Historical patterns in populist rhetoric", tags:["politics","rhetoric"]        },
  { title:"Cognitive Biases",       type:"doc",     field:"psychology",  prompt:"Full catalog of known cognitive biases",   tags:["bias","cognition","heuristic"]},
  { title:"GDP Composition",        type:"note",    field:"economics",   prompt:"How national GDP figures are constructed", tags:["gdp","macro","economics"]    },
];

// ─── localStorage ─────────────────────────────────────────────────────────────
const LS_KEY = "custom_notes_v1";
function loadCustomNotes() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function saveCustomNotes(notes) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(notes)); } catch {}
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const labelSt = {
  fontSize:9, color:"#555", letterSpacing:1.2, textTransform:"uppercase",
  marginBottom:6, display:"block", fontWeight:700,
};
const inputSt = {
  width:"100%", boxSizing:"border-box",
  background:"#080808", border:"1px solid #1a1a1a",
  color:"#c8c8c8", fontSize:12, padding:"9px 11px",
  outline:"none", fontFamily:"'Courier New', monospace",
};

// ─── Add Note Modal ───────────────────────────────────────────────────────────
function AddNoteModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title:"", type:"note", field:"personal", prompt:"", tags:"" });
  const [error, setError] = useState("");
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  function handleSubmit() {
    if (!form.title.trim()) { setError("Title is required"); return; }
    onAdd({
      title: form.title.trim(),
      type: form.type,
      field: form.field,
      prompt: form.prompt.trim(),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      _custom: true,
      _id: Date.now(),
    });
    onClose();
  }

  const fieldObjs = FIELDS.filter(f => f.id !== "all");

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position:"absolute", inset:0, background:"rgba(0,0,0,0.82)",
        zIndex:50, backdropFilter:"blur(4px)", animation:"fadeOverlay 0.18s ease",
      }} />

      {/* Panel */}
      <div style={{
        position:"absolute", left:16, right:16, top:"50%", transform:"translateY(-50%)",
        background:"#0a0a0a", border:"1px solid #1c1c1c",
        zIndex:51, padding:22, display:"flex", flexDirection:"column", gap:17,
        animation:"slideUp 0.2s ease", maxHeight:"88%", overflowY:"auto",
      }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#e2e8f0", letterSpacing:-0.3 }}>New Note</div>
            <div style={{ fontSize:9, color:"#2a2a2a", marginTop:2, letterSpacing:1, textTransform:"uppercase" }}>Add to your collection</div>
          </div>
          <div onClick={onClose} style={{
            width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center",
            border:"1px solid #1a1a1a", cursor:"pointer", color:"#444", fontSize:16, flexShrink:0,
          }}>×</div>
        </div>

        {/* Title */}
        <div>
          <label style={labelSt}>Title *</label>
          <input
            autoFocus
            value={form.title}
            onChange={e => { set("title", e.target.value); setError(""); }}
            placeholder="Give your note a title…"
            style={inputSt}
          />
          {error && <div style={{ fontSize:10, color:"#f87171", marginTop:4 }}>{error}</div>}
        </div>

        {/* Type chips */}
        <div>
          <label style={labelSt}>Type</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {NOTE_TYPES.map(t => {
              const ts = NOTE_TYPE_STYLE[t];
              const active = form.type === t;
              return (
                <div key={t} onClick={() => set("type", t)} style={{
                  padding:"5px 11px", fontSize:10, cursor:"pointer", userSelect:"none",
                  border:`1px solid ${active ? ts.color : "#1e1e1e"}`,
                  background: active ? ts.bg : "transparent",
                  color: active ? ts.color : "#3a3a3a",
                  letterSpacing:0.8, textTransform:"uppercase",
                  fontWeight: active ? 700 : 400, transition:"all 0.1s",
                }}>
                  {TYPE_GLYPH[t]} {t}
                </div>
              );
            })}
          </div>
        </div>

        {/* Field chips */}
        <div>
          <label style={labelSt}>Field</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, maxHeight:108, overflowY:"auto" }}>
            {fieldObjs.map(f => {
              const active = form.field === f.id;
              return (
                <div key={f.id} onClick={() => set("field", f.id)} style={{
                  display:"flex", alignItems:"center", gap:4,
                  padding:"4px 9px", fontSize:10, cursor:"pointer", userSelect:"none",
                  border:`1px solid ${active ? f.color+"66" : "#1a1a1a"}`,
                  background: active ? f.color+"15" : "transparent",
                  color: active ? f.color : "#333",
                  transition:"all 0.1s",
                }}>
                  <span style={{ fontSize:11 }}>{f.icon}</span> {f.label}
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
            style={{ ...inputSt, resize:"none", lineHeight:1.6 }}
          />
        </div>

        {/* Tags */}
        <div>
          <label style={labelSt}>Tags <span style={{ color:"#2a2a2a", fontWeight:400 }}>(comma-separated)</span></label>
          <input
            value={form.tags}
            onChange={e => set("tags", e.target.value)}
            placeholder="strategy, reading, ideas"
            style={inputSt}
          />
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10, paddingTop:2 }}>
          <div onClick={onClose} style={{
            flex:1, padding:"11px 0", textAlign:"center",
            border:"1px solid #1e1e1e", color:"#444", fontSize:11,
            cursor:"pointer", userSelect:"none", letterSpacing:0.5,
          }}>Cancel</div>
          <div onClick={handleSubmit} style={{
            flex:2, padding:"11px 0", textAlign:"center",
            background:"#4285f4", color:"#fff", fontSize:11,
            fontWeight:700, cursor:"pointer", userSelect:"none",
            letterSpacing:0.5, boxShadow:"0 0 16px #4285f433",
          }}>Create Note →</div>
        </div>
      </div>
    </>
  );
}

// ─── Doc Screen ───────────────────────────────────────────────────────────────
function DocScreen({ note, text, setText, onClose }) {
  const ts = NOTE_TYPE_STYLE[note.type] || NOTE_TYPE_STYLE.note;
  const fd = FIELDS.find(f => f.id === note.field) || FIELDS[0];
  const wc = text.trim().split(/\s+/).filter(Boolean).length;
  const pct = Math.min(100, Math.round((wc / (note.wordGoal || 300)) * 100));

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#000", color:"#fff", fontFamily:"'Courier New',monospace" }}>
      <style>{`textarea:focus { outline: none !important; }`}</style>

      {/* Doc header */}
      <div style={{ flexShrink:0, padding:"14px 18px", borderBottom:"1px solid #0d0d0d" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <div onClick={onClose} style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer", color:"#333", fontSize:10, letterSpacing:0.8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            NOTES
          </div>
          <div style={{ flex:1 }} />
          <span style={{ fontSize:8, color:ts.color, border:`1px solid ${ts.color}33`, padding:"2px 7px", letterSpacing:1 }}>{ts.label.toUpperCase()}</span>
          <span style={{ fontSize:8, color:fd.color, border:`1px solid ${fd.color}33`, padding:"2px 7px", letterSpacing:1 }}>{fd.icon} {fd.label.toUpperCase()}</span>
        </div>
        <div style={{ fontSize:17, fontWeight:700, color:"#e2e8f0", letterSpacing:-0.4, marginBottom:3 }}>{note.title}</div>
        {note.prompt && <div style={{ fontSize:10, color:"#2a2a2a" }}>{note.prompt}</div>}
        {(note.tags||[]).length > 0 && (
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:7 }}>
            {note.tags.map(t => <span key={t} style={{ fontSize:8, color:"#222" }}>#{t}</span>)}
          </div>
        )}
      </div>

      {/* Word count */}
      <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:10, padding:"7px 18px", borderBottom:"1px solid #080808" }}>
        <span style={{ fontSize:8, color:"#2a2a2a", letterSpacing:1 }}>{wc} WORDS</span>
        <div style={{ flex:1, height:1, background:"#0d0d0d" }}>
          <div style={{ width:`${pct}%`, height:"100%", background:ts.color, opacity:0.5, transition:"width 0.3s" }} />
        </div>
        <span style={{ fontSize:8, color:"#1a1a1a" }}>GOAL {note.wordGoal || 300}</span>
      </div>

      {/* Editor */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={`Start writing your ${note.type}…\n\nType here…`}
        style={{
          flex:1, background:"#000", border:"none", color:"#555", fontSize:13,
          fontFamily:"'Courier New',monospace", lineHeight:1.8, padding:"20px",
          resize:"none", caretColor:"#4285f4",
        }}
      />
    </div>
  );
}

// ─── Notes Tab (main) ─────────────────────────────────────────────────────────
export default function NotesTab() {
  const [activeField, setActiveField] = useState("all");
  const [openNote,    setOpenNote]    = useState(null);
  const [search,      setSearch]      = useState("");
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [noteTexts,   setNoteTexts]   = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addOpen,     setAddOpen]     = useState(false);
  const [customNotes, setCustomNotes] = useState(() => loadCustomNotes());

  function handleAddNote(newNote) {
    const updated = [newNote, ...customNotes];
    setCustomNotes(updated);
    saveCustomNotes(updated);
  }

  const allNotes = [...customNotes, ...SAMPLE_NOTES];
  const noteKey  = n => n._id ? `custom_${n._id}` : `${n.title}__${n.type}`;

  const filtered = allNotes.filter(n => {
    const matchF = activeField === "all" || n.field === activeField;
    const q = search.toLowerCase();
    const matchS = !q || (n.title + (n.prompt||"") + (n.tags||[]).join(" ")).toLowerCase().includes(q);
    return matchF && matchS;
  });

  const groups = activeField === "all"
    ? FIELDS.slice(1).reduce((acc, f) => {
        const ns = filtered.filter(n => n.field === f.id);
        if (ns.length) acc.push({ field: f, notes: ns });
        return acc;
      }, [])
    : [{ field: FIELDS.find(f => f.id === activeField) || FIELDS[0], notes: filtered }];

  const activeFieldObj = FIELDS.find(f => f.id === activeField) || FIELDS[0];

  // ── Doc view ──
  if (openNote) {
    const key = noteKey(openNote);
    return (
      <DocScreen
        note={openNote}
        text={noteTexts[key] || ""}
        setText={val => setNoteTexts(p => ({ ...p, [key]: val }))}
        onClose={() => setOpenNote(null)}
      />
    );
  }

  return (
    <div style={{
      display:"flex", flexDirection:"column", height:"100%", background:"#000",
      color:"#fff", fontFamily:"'Roboto',sans-serif", overflow:"hidden", position:"relative",
    }}>
      <style>{`
        @keyframes notesFade    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sidebarSlide { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeOverlay  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp      { from{opacity:0;transform:translateY(-50%) translateY(12px)} to{opacity:1;transform:translateY(-50%)} }
        .note-row:active { background:#0a0a0a !important; }
        .sb-row:active   { background:#111 !important; }
        div::-webkit-scrollbar { display:none; }
      `}</style>

      {/* ── Sidebar overlay ── */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position:"absolute", inset:0, background:"rgba(0,0,0,0.7)",
          zIndex:30, animation:"fadeOverlay 0.18s ease",
        }} />
      )}

      {/* ── Sidebar panel ── */}
      {sidebarOpen && (
        <div style={{
          position:"absolute", top:0, left:0, bottom:0, width:228,
          background:"#070707", borderRight:"1px solid #111",
          zIndex:40, display:"flex", flexDirection:"column", animation:"sidebarSlide 0.2s ease",
        }}>
          <div style={{ padding:"20px 18px 12px", borderBottom:"1px solid #0d0d0d" }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, color:"#333", textTransform:"uppercase" }}>Fields</div>
            <div style={{ fontSize:10, color:"#1a1a1a", marginTop:3 }}>{allNotes.length} total entries</div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"6px 0" }}>
            {FIELDS.map(f => {
              const active = activeField === f.id;
              const count  = f.id === "all" ? allNotes.length : allNotes.filter(n => n.field === f.id).length;
              return (
                <div key={f.id} className="sb-row"
                  onClick={() => { setActiveField(f.id); setSidebarOpen(false); }}
                  style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"10px 18px", cursor:"pointer", userSelect:"none",
                    background: active ? f.color+"0d" : "transparent",
                    borderLeft:`2px solid ${active ? f.color : "transparent"}`,
                    transition:"all 0.1s",
                  }}>
                  <span style={{ fontSize:13, color: active ? f.color : "#2a2a2a" }}>{f.icon}</span>
                  <span style={{ flex:1, fontSize:12, fontWeight: active ? 600 : 400, color: active ? f.color : "#555" }}>{f.label}</span>
                  <span style={{ fontSize:9, color: active ? f.color+"88" : "#1a1a1a", fontVariantNumeric:"tabular-nums" }}>{count}</span>
                </div>
              );
            })}
          </div>
          <div style={{ padding:"14px 18px", borderTop:"1px solid #0d0d0d" }}>
            <div onClick={() => { setSidebarOpen(false); setAddOpen(true); }}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px",
                background:"#4285f40d", border:"1px solid #4285f422", cursor:"pointer" }}>
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="#4285f4" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize:11, color:"#4285f4", fontWeight:600 }}>New Note</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ flexShrink:0, padding:"16px 18px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Hamburger */}
            <div onClick={() => setSidebarOpen(s => !s)} style={{
              width:34, height:34, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:4.5, cursor:"pointer", flexShrink:0,
            }}>
              <div style={{ width:18, height:1.5, background:"#666", borderRadius:1 }} />
              <div style={{ width:12, height:1.5, background:"#666", borderRadius:1 }} />
              <div style={{ width:18, height:1.5, background:"#666", borderRadius:1 }} />
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:700, letterSpacing:-0.5, display:"flex", alignItems:"center", gap:7 }}>
                {activeField !== "all" && <span style={{ color: activeFieldObj.color, fontSize:16 }}>{activeFieldObj.icon}</span>}
                {activeField === "all" ? "Notes" : activeFieldObj.label}
              </div>
              <div style={{ fontSize:10, color:"#333", marginTop:1 }}>
                {activeField === "all"
                  ? `${allNotes.length} entries · ${FIELDS.length - 1} fields`
                  : `${filtered.length} entries`}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:7, alignItems:"center" }}>
            <div onClick={() => { setSearchOpen(s=>!s); if(searchOpen) setSearch(""); }} style={{
              width:34, height:34, borderRadius:"50%",
              background:searchOpen?"#181818":"transparent",
              border:"1px solid #181818", display:"flex", alignItems:"center",
              justifyContent:"center", cursor:"pointer",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={searchOpen?"#bbb":"#444"} strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            {/* ← ADD BUTTON */}
            <div onClick={() => setAddOpen(true)} style={{
              width:34, height:34, borderRadius:"50%", background:"#4285f4",
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", boxShadow:"0 0 14px #4285f455",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{
            display:"flex", alignItems:"center", gap:8, background:"#080808",
            border:"1px solid #181818", padding:"8px 12px", marginBottom:10,
            animation:"notesFade 0.15s ease",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search notes, tags, topics…"
              style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#bbb", fontSize:12, fontFamily:"'Courier New',monospace" }}
            />
            {search && <div onClick={() => setSearch("")} style={{ fontSize:15, color:"#333", cursor:"pointer" }}>×</div>}
          </div>
        )}
      </div>

      {/* ── Notes List ── */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 24px", color:"#1e1e1e" }}>
            <div style={{ fontSize:28, marginBottom:10 }}>◌</div>
            <div style={{ fontSize:12, letterSpacing:0.5 }}>No notes in this field yet</div>
            <div onClick={() => setAddOpen(true)} style={{
              marginTop:16, display:"inline-flex", alignItems:"center", gap:6,
              padding:"8px 16px", border:"1px solid #4285f433", color:"#4285f4", fontSize:11, cursor:"pointer",
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="#4285f4" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Add First Note
            </div>
          </div>
        )}

        {groups.map(({ field, notes }) => (
          <div key={field.id} style={{ marginBottom: activeField==="all" ? 4 : 0 }}>

            {/* Section header (all-view only) */}
            {activeField === "all" && (
              <div style={{
                display:"flex", alignItems:"center", gap:8, padding:"12px 18px 8px",
                background:"#000", position:"sticky", top:0, zIndex:2, borderBottom:"1px solid #060606",
              }}>
                <span style={{ color:field.color, fontSize:12 }}>{field.icon}</span>
                <span style={{ fontSize:9, fontWeight:700, color:field.color, letterSpacing:1.2, textTransform:"uppercase" }}>{field.label}</span>
                <span style={{ fontSize:9, color:"#222" }}>{notes.length}</span>
                <div onClick={() => setActiveField(field.id)} style={{ marginLeft:"auto", cursor:"pointer", opacity:0.35 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={field.color} strokeWidth="2" strokeLinecap="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </div>
            )}

            {/* Note rows */}
            {notes.map((note, i) => {
              const ts  = NOTE_TYPE_STYLE[note.type] || NOTE_TYPE_STYLE.note;
              const fd  = FIELDS.find(f => f.id === note.field) || FIELDS[0];
              const key = noteKey(note);
              const wc  = (noteTexts[key]||"").trim().split(/\s+/).filter(Boolean).length;
              const pct = Math.min(100, Math.round((wc / (note.wordGoal||300)) * 100));

              return (
                <div key={key} className="note-row" onClick={() => setOpenNote(note)} style={{
                  display:"flex", alignItems:"center", gap:11, padding:"11px 18px",
                  cursor:"pointer", background:"#000",
                  borderLeft:`2px solid ${fd.color}${activeField==="all"?"2a":"44"}`,
                  borderBottom:"1px solid #060606",
                  animation:`notesFade 0.15s ease ${Math.min(i,8)*0.03}s both`,
                }}>
                  {/* Glyph box */}
                  <div style={{
                    width:34, height:34, flexShrink:0, display:"flex", alignItems:"center",
                    justifyContent:"center", background:ts.bg, border:`1px solid ${ts.color}1a`,
                  }}>
                    <span style={{ fontFamily:"'Courier New',monospace", fontSize:14, color:ts.color }}>
                      {TYPE_GLYPH[note.type] || "✎"}
                    </span>
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {note._custom && (
                        <span style={{ fontSize:8, color:"#4285f4", border:"1px solid #4285f433", padding:"1px 4px", marginRight:5, letterSpacing:0.5 }}>NEW</span>
                      )}
                      {note.title}
                    </div>
                    <div style={{ fontSize:10, color:"#333", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:5, fontFamily:"'Courier New',monospace" }}>
                      {note.prompt || "No description"}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                      <span style={{ fontSize:8, color:ts.color, border:`1px solid ${ts.color}2a`, padding:"1px 5px", letterSpacing:0.8, textTransform:"uppercase" }}>{ts.label}</span>
                      {activeField === "all" && (
                        <span style={{ fontSize:8, color:fd.color+"88" }}>{fd.icon} {fd.label}</span>
                      )}
                      {(note.tags||[]).slice(0,2).map(t => (
                        <span key={t} style={{ fontSize:8, color:"#2a2a2a", fontFamily:"'Courier New',monospace" }}>#{t}</span>
                      ))}
                      {wc > 0 && (
                        <>
                          <span style={{ fontSize:8, color:"#222" }}>{wc}w</span>
                          <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                            <div style={{ width:28, height:1.5, background:"#0d0d0d", borderRadius:1, overflow:"hidden" }}>
                              <div style={{ width:`${pct}%`, height:"100%", background:ts.color, opacity:0.6 }} />
                            </div>
                            <span style={{ fontSize:7, color:"#1e1e1e" }}>{pct}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>
                    <path d="M9 18l6-6-6-6" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Add Note Modal ── */}
      {addOpen && <AddNoteModal onClose={() => setAddOpen(false)} onAdd={handleAddNote} />}
    </div>
  );
}
