import { useState } from 'react';
import { IC } from '@/components/icons/IconLibrary';
import { Avatar } from '@/components/easy/Avatar';
import { ContactSection } from '@/components/easy/ContactSection';
import { getContactKey, contactStore } from '@/utils/contactUtils';

const PHASE_COLORS = ["#fb923c","#fbbf24","#34d399","#4ade80","#38bdf8","#818cf8","#c084fc","#f472b6","#ef5350","#a3e635","#2dd4bf","#e879f9"];
const PRIORITY_COLOR = { high:"#ef5350", medium:"#fbbf24", low:"#4ade80" };
const STATUS_COLOR = { done:"#34d399", active:"#fb923c", upcoming:"#555" };
const STATUS_LABEL = { done:"Done", active:"In Progress", upcoming:"Upcoming" };

export function ProjectScreen({ ev, onClose }) {
  const accent = "#fb923c";
  const [phases, setPhases] = useState(() => (ev.phases || []).map(ph => ({
    ...ph,
    tasks: (ph.tasks || []).map(t => ({ ...t }))
  })));
  const [activePhaseId, setActivePhaseId] = useState(ev.phases?.[0]?.id || null);
  const [view, setView] = useState("board");
  const [addingTask, setAddingTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

  const [phaseEditor, setPhaseEditor] = useState(null);
  const [editPhaseTitle, setEditPhaseTitle] = useState("");
  const [editPhaseColor, setEditPhaseColor] = useState(PHASE_COLORS[0]);
  const [editPhaseStatus, setEditPhaseStatus] = useState("upcoming");

  const projectContactKey = getContactKey(ev.title, "project");
  if (!contactStore[projectContactKey]) contactStore[projectContactKey] = [];
  const [teamContacts, setTeamContacts] = useState([...contactStore[projectContactKey]]);
  const [teamKey, setTeamKey] = useState(0);
  const refreshTeam = () => {
    setTeamContacts([...contactStore[projectContactKey]]);
    setTeamKey(k => k + 1);
  };

  const totalTasks = phases.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks  = phases.reduce((a, p) => a + p.tasks.filter(t => t.done).length, 0);
  const progress   = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const toggleTask = (phId, tId) => {
    setPhases(ps => ps.map(ph => ph.id !== phId ? ph : {
      ...ph, tasks: ph.tasks.map(t => t.id === tId ? { ...t, done: !t.done } : t)
    }));
  };

  const addTask = (phId) => {
    if (!newTaskTitle.trim()) return;
    const task = { id: "t_" + Date.now(), title: newTaskTitle.trim(), done: false, priority: newTaskPriority, assignee: newTaskAssignee.trim() || "—", due: "" };
    setPhases(ps => ps.map(ph => ph.id !== phId ? ph : { ...ph, tasks: [...ph.tasks, task] }));
    setNewTaskTitle(""); setNewTaskAssignee(""); setNewTaskPriority("medium"); setAddingTask(null);
  };

  const deleteTask = (phId, tId) => {
    setPhases(ps => ps.map(ph => ph.id !== phId ? ph : { ...ph, tasks: ph.tasks.filter(t => t.id !== tId) }));
  };

  const openNewPhase = () => {
    setEditPhaseTitle("");
    setEditPhaseColor(PHASE_COLORS[phases.length % PHASE_COLORS.length]);
    setEditPhaseStatus("upcoming");
    setPhaseEditor({ phId: "__new__" });
  };

  const openEditPhase = (ph) => {
    setEditPhaseTitle(ph.title);
    setEditPhaseColor(ph.color || accent);
    setEditPhaseStatus(ph.status || "upcoming");
    setPhaseEditor({ phId: ph.id });
  };

  const savePhase = () => {
    if (!editPhaseTitle.trim()) return;
    if (phaseEditor.phId === "__new__") {
      const newPh = { id: "ph_" + Date.now(), title: editPhaseTitle.trim(), color: editPhaseColor, status: editPhaseStatus, tasks: [] };
      setPhases(ps => [...ps, newPh]);
      setActivePhaseId(newPh.id);
    } else {
      setPhases(ps => ps.map(ph => ph.id !== phaseEditor.phId ? ph : { ...ph, title: editPhaseTitle.trim(), color: editPhaseColor, status: editPhaseStatus }));
    }
    setPhaseEditor(null);
  };

  const deletePhase = (phId) => {
    setPhases(ps => {
      const next = ps.filter(p => p.id !== phId);
      if (activePhaseId === phId && next.length > 0) setActivePhaseId(next[0].id);
      return next;
    });
    setPhaseEditor(null);
  };

  const movePhase = (phId, dir) => {
    setPhases(ps => {
      const idx = ps.findIndex(p => p.id === phId);
      if (idx < 0) return ps;
      const next = [...ps];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return ps;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const activePhase = phases.find(p => p.id === activePhaseId);

  const PhaseEditorModal = () => {
    if (!phaseEditor) return null;
    const isNew = phaseEditor.phId === "__new__";
    const ph = isNew ? null : phases.find(p => p.id === phaseEditor.phId);
    return (
      <div style={{ position:"absolute", inset:0, zIndex:50, display:"flex", flexDirection:"column", justifyContent:"flex-end", background:"rgba(0,0,0,0.7)" }}
        onClick={e => { if (e.target === e.currentTarget) setPhaseEditor(null); }}>
        <div style={{ background:"#0d0d0d", borderTop:`2px solid ${editPhaseColor}`, padding:"20px 20px 32px", animation:"slideUp 0.22s ease" }}>
          <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#d4d4d8" }}>{isNew ? "New Phase" : "Edit Phase"}</div>
            <div onClick={() => setPhaseEditor(null)} style={{ fontSize:18, color:"#444", cursor:"pointer", lineHeight:1 }}>×</div>
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:9, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Phase Name</div>
            <input
              autoFocus
              value={editPhaseTitle}
              onChange={e => setEditPhaseTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") savePhase(); if (e.key === "Escape") setPhaseEditor(null); }}
              placeholder="e.g. Discovery, Build, Launch…"
              style={{ width:"100%", background:"transparent", border:"none", borderBottom:`1px solid ${editPhaseColor}55`, outline:"none", color:"#d4d4d8", fontSize:15, fontWeight:600, padding:"4px 0 8px", boxSizing:"border-box", caretColor:editPhaseColor }}
            />
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:9, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Status</div>
            <div style={{ display:"flex", gap:6 }}>
              {[["upcoming","Upcoming"],["active","In Progress"],["done","Done"]].map(([val, label]) => (
                <div key={val} onClick={() => setEditPhaseStatus(val)}
                  style={{ flex:1, padding:"7px 4px", textAlign:"center", fontSize:10, cursor:"pointer", userSelect:"none",
                    background: editPhaseStatus === val ? STATUS_COLOR[val]+"22" : "#111",
                    border: `1px solid ${editPhaseStatus === val ? STATUS_COLOR[val]+"88" : "#1a1a1a"}`,
                    color: editPhaseStatus === val ? STATUS_COLOR[val] : "#444",
                  }}>{label}</div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:22 }}>
            <div style={{ fontSize:9, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Color</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {PHASE_COLORS.map(c => (
                <div key={c} onClick={() => setEditPhaseColor(c)}
                  style={{ width:26, height:26, borderRadius:"50%", background:c, cursor:"pointer", flexShrink:0,
                    border: editPhaseColor === c ? `2px solid #fff` : `2px solid transparent`,
                    boxShadow: editPhaseColor === c ? `0 0 0 1px ${c}` : "none",
                    transition:"all 0.12s",
                  }}/>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div onClick={savePhase}
              style={{ flex:1, padding:"10px", textAlign:"center", fontSize:12, fontWeight:600, cursor: editPhaseTitle.trim() ? "pointer" : "default",
                background: editPhaseTitle.trim() ? editPhaseColor+"22" : "#111",
                border: `1px solid ${editPhaseTitle.trim() ? editPhaseColor+"88" : "#1a1a1a"}`,
                color: editPhaseTitle.trim() ? editPhaseColor : "#333",
              }}>{isNew ? "Add Phase" : "Save Changes"}</div>
            {!isNew && (
              <div onClick={() => deletePhase(ph.id)}
                style={{ padding:"10px 14px", fontSize:12, cursor:"pointer", background:"#ef535011", border:"1px solid #ef535033", color:"#ef5350" }}>
                Delete
              </div>
            )}
          </div>
          {!isNew && ph && (
            <div style={{ display:"flex", gap:8, marginTop:10 }}>
              <div onClick={() => { movePhase(ph.id, -1); }}
                style={{ flex:1, padding:"7px", textAlign:"center", fontSize:11, color:"#444", border:"1px solid #1a1a1a", cursor:"pointer" }}>
                ↑ Move Earlier
              </div>
              <div onClick={() => { movePhase(ph.id, 1); }}
                style={{ flex:1, padding:"7px", textAlign:"center", fontSize:11, color:"#444", border:"1px solid #1a1a1a", cursor:"pointer" }}>
                ↓ Move Later
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const Overview = () => (
    <div style={{ padding:"24px 20px 60px", overflowY:"auto", flex:1 }}>
      <div style={{ background:"#0d0a07", border:`1px solid ${accent}22`, borderLeft:`4px solid ${accent}`, padding:"18px 18px 16px", marginBottom:20 }}>
        <div style={{ fontSize:9, color:accent+"88", letterSpacing:1.4, textTransform:"uppercase", marginBottom:6 }}>◎ project</div>
        <div style={{ fontSize:20, fontWeight:700, color:"#d4d4d8", marginBottom:6, lineHeight:1.3 }}>{ev.title}</div>
        <div style={{ fontSize:12, color:"#555", marginBottom:14, lineHeight:1.6 }}>{ev.prompt}</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ fontSize:10, color:STATUS_COLOR[ev.status||"active"], border:`1px solid ${STATUS_COLOR[ev.status||"active"]}44`, padding:"3px 10px" }}>{STATUS_LABEL[ev.status||"active"]}</div>
          {ev.due && <div style={{ fontSize:10, color:"#555", border:"1px solid #1a1a1a", padding:"3px 10px" }}>Due {ev.due}</div>}
          {(ev.tags||[]).map(t => <div key={t} style={{ fontSize:9, color:"#333", border:"1px solid #1a1a1a", padding:"3px 8px" }}>#{t}</div>)}
        </div>
      </div>

      <div style={{ marginBottom:20, padding:"14px 16px", background:"#0a0a0a", border:"1px solid #111" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:11, color:"#666" }}>Overall progress</span>
          <span style={{ fontSize:11, color: progress===100 ? "#34d399" : accent }}>{progress}%</span>
        </div>
        <div style={{ height:4, background:"#111", borderRadius:2, overflow:"hidden", marginBottom:10 }}>
          <div style={{ width:`${progress}%`, height:"100%", background: progress===100 ? "#34d399" : accent, transition:"width 0.4s" }}/>
        </div>
        <div style={{ display:"flex", gap:16 }}>
          {[{ label:"Total tasks", val:totalTasks }, { label:"Done", val:doneTasks }, { label:"Remaining", val:totalTasks-doneTasks }, { label:"Phases", val:phases.length }].map((s,i) => (
            <div key={i} style={{ fontSize:10, color:"#333" }}><span style={{ color:"#444" }}>{s.label}: </span><span style={{ color:"#777" }}>{s.val}</span></div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:20 }} onClick={refreshTeam} key={teamKey}>
        <ContactSection evTitle={ev.title} evType="project" accentColor={accent} />
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontSize:9, color:"#333", letterSpacing:1.2, textTransform:"uppercase" }}>Phases</div>
        <div onClick={openNewPhase}
          style={{ fontSize:9, color:accent, border:`1px solid ${accent}44`, padding:"2px 10px", cursor:"pointer", letterSpacing:0.5 }}>
          + Add Phase
        </div>
      </div>
      {phases.length === 0 && (
        <div style={{ textAlign:"center", padding:"30px 20px", color:"#222", fontSize:12, fontStyle:"italic" }}>
          No phases yet — add your first one above
        </div>
      )}
      {phases.map((ph, pi) => {
        const phDone = ph.tasks.filter(t=>t.done).length;
        const phTotal = ph.tasks.length;
        const pct = phTotal === 0 ? 0 : Math.round((phDone/phTotal)*100);
        return (
          <div key={ph.id} style={{ padding:"12px 14px", background:"#080808", border:`1px solid ${ph.color||accent}1a`, borderLeft:`3px solid ${ph.color||accent}`, marginBottom:6, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ flex:1, cursor:"pointer" }} onClick={() => { setActivePhaseId(ph.id); setView("board"); }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:9, color:ph.color||accent, border:`1px solid ${ph.color||accent}44`, padding:"1px 6px", textTransform:"uppercase", letterSpacing:0.8 }}>{STATUS_LABEL[ph.status||"upcoming"]}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:"#999" }}>{pi+1}. {ph.title}</span>
                </div>
                <span style={{ fontSize:10, color:"#333" }}>{phDone}/{phTotal}</span>
              </div>
              <div style={{ height:2, background:"#111", borderRadius:1, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:ph.color||accent }}/>
              </div>
            </div>
            <div onClick={e => { e.stopPropagation(); openEditPhase(ph); }}
              style={{ width:28, height:28, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"1px solid #1a1a1a", borderRadius:2 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );

  const Board = () => {
    if (!activePhase) return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
        <div style={{ fontSize:13, color:"#222", fontStyle:"italic" }}>No phases yet</div>
        <div onClick={openNewPhase} style={{ fontSize:11, color:accent, border:`1px solid ${accent}44`, padding:"8px 20px", cursor:"pointer" }}>+ Add First Phase</div>
      </div>
    );
    const phDone = activePhase.tasks.filter(t=>t.done).length;
    const phTotal = activePhase.tasks.length;
    const pct = phTotal===0?0:Math.round((phDone/phTotal)*100);

    return (
      <div style={{ flex:1, overflowY:"auto", padding:"20px 16px 60px" }}>
        <div style={{ marginBottom:16, padding:"12px 14px", background:"#0a0a0a", borderLeft:`3px solid ${activePhase.color||accent}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <div>
              <div style={{ fontSize:9, color:activePhase.color||accent, letterSpacing:1.2, textTransform:"uppercase", marginBottom:3 }}>Phase {phases.indexOf(activePhase)+1}</div>
              <div style={{ fontSize:17, fontWeight:700, color:"#d4d4d8" }}>{activePhase.title}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ fontSize:10, color:STATUS_COLOR[activePhase.status||"upcoming"], border:`1px solid ${STATUS_COLOR[activePhase.status||"upcoming"]}44`, padding:"3px 8px" }}>
                {STATUS_LABEL[activePhase.status||"upcoming"]}
              </div>
              <div onClick={() => openEditPhase(activePhase)}
                style={{ width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"1px solid #1a1a1a", borderRadius:2 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ flex:1, height:3, background:"#111", borderRadius:2, overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", background:activePhase.color||accent }}/>
            </div>
            <span style={{ fontSize:10, color:"#444", flexShrink:0 }}>{phDone}/{phTotal}</span>
          </div>
        </div>

        <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto", paddingBottom:4 }}>
          {phases.map((ph, pi) => (
            <div key={ph.id} onClick={() => setActivePhaseId(ph.id)}
              style={{ flexShrink:0, padding:"5px 12px", fontSize:10, cursor:"pointer", userSelect:"none",
                background: ph.id === activePhaseId ? (ph.color||accent)+"22" : "#0a0a0a",
                border: `1px solid ${ph.id === activePhaseId ? (ph.color||accent)+"88" : "#1a1a1a"}`,
                color: ph.id === activePhaseId ? (ph.color||accent) : "#444",
              }}>{pi+1}. {ph.title}</div>
          ))}
          <div onClick={openNewPhase}
            style={{ flexShrink:0, padding:"5px 10px", fontSize:10, cursor:"pointer", userSelect:"none", border:"1px dashed #1a1a1a", color:"#333" }}>+</div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {activePhase.tasks.length === 0 && (
            <div style={{ textAlign:"center", padding:"40px 20px", color:"#222", fontSize:12, fontStyle:"italic" }}>No tasks yet — add one below</div>
          )}
          {activePhase.tasks.map((task) => (
            <div key={task.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"#080808", border:"1px solid #111", borderLeft:`2px solid ${task.done ? "#2a2a2a" : PRIORITY_COLOR[task.priority||"medium"]}` }}>
              <div onClick={() => toggleTask(activePhase.id, task.id)}
                style={{ width:18, height:18, border:`1.5px solid ${task.done ? "#333" : PRIORITY_COLOR[task.priority||"medium"]}`, background:task.done?"#1a1a1a":"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, transition:"all 0.15s" }}>
                {task.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, color:task.done?"#333":"#bbb", textDecoration:task.done?"line-through":"none", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{task.title}</div>
                <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontSize:9, color:PRIORITY_COLOR[task.priority||"medium"], border:`1px solid ${PRIORITY_COLOR[task.priority||"medium"]}33`, padding:"1px 5px", textTransform:"uppercase", letterSpacing:0.8 }}>{task.priority||"medium"}</span>
                  {task.assignee && task.assignee !== "—" && <span style={{ fontSize:9, color:"#444" }}>{task.assignee}</span>}
                  {task.due && <span style={{ fontSize:9, color:"#333" }}>{task.due}</span>}
                </div>
              </div>
              <div onClick={() => deleteTask(activePhase.id, task.id)} style={{ fontSize:12, color:"#222", cursor:"pointer", padding:"2px 4px", flexShrink:0 }}>×</div>
            </div>
          ))}
        </div>

        {addingTask === activePhase.id ? (
          <div style={{ marginTop:10, padding:"12px 12px", background:"#090909", border:`1px solid ${accent}22` }}>
            <input autoFocus value={newTaskTitle} onChange={e=>setNewTaskTitle(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter") addTask(activePhase.id); if(e.key==="Escape") setAddingTask(null);}}
              placeholder="Task title…"
              style={{ width:"100%", background:"transparent", border:"none", borderBottom:`1px solid ${accent}33`, outline:"none", color:"#bbb", fontSize:13, padding:"4px 0 6px", marginBottom:10, boxSizing:"border-box", fontFamily:"inherit" }}/>
            <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
              {["high","medium","low"].map(p => (
                <div key={p} onClick={()=>setNewTaskPriority(p)}
                  style={{ fontSize:9, padding:"3px 10px", cursor:"pointer", border:`1px solid ${newTaskPriority===p ? PRIORITY_COLOR[p]+"88" : "#1a1a1a"}`, color:newTaskPriority===p ? PRIORITY_COLOR[p] : "#333", textTransform:"uppercase", letterSpacing:0.8 }}>{p}</div>
              ))}
            </div>
            <input value={newTaskAssignee} onChange={e=>setNewTaskAssignee(e.target.value)}
              placeholder="Assignee (optional)"
              style={{ width:"100%", background:"transparent", border:"none", borderBottom:"1px solid #1a1a1a", outline:"none", color:"#777", fontSize:11, padding:"3px 0 5px", marginBottom:10, boxSizing:"border-box", fontFamily:"inherit" }}/>
            <div style={{ display:"flex", gap:8 }}>
              <div onClick={()=>addTask(activePhase.id)} style={{ fontSize:10, color:accent, border:`1px solid ${accent}44`, padding:"5px 16px", cursor:"pointer" }}>Add task</div>
              <div onClick={()=>setAddingTask(null)} style={{ fontSize:10, color:"#333", border:"1px solid #1a1a1a", padding:"5px 12px", cursor:"pointer" }}>Cancel</div>
            </div>
          </div>
        ) : (
          <div onClick={()=>setAddingTask(activePhase.id)}
            style={{ marginTop:10, padding:"10px 12px", border:"1px dashed #1a1a1a", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:accent+"66", fontSize:16, lineHeight:1 }}>+</span>
            <span style={{ fontSize:11, color:"#333" }}>Add task to {activePhase.title}</span>
          </div>
        )}
      </div>
    );
  };

  const Timeline = () => (
    <div style={{ flex:1, overflowY:"auto", padding:"20px 16px 60px" }}>
      <div style={{ fontSize:9, color:"#333", letterSpacing:1.2, textTransform:"uppercase", marginBottom:14 }}>All Tasks · Timeline View</div>
      {phases.map((ph, pi) => (
        <div key={ph.id} style={{ marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:ph.color||accent, flexShrink:0 }}/>
            <span style={{ fontSize:11, fontWeight:700, color:ph.color||accent }}>{pi+1}. {ph.title}</span>
            <div style={{ flex:1, height:1, background:"#111" }}/>
            <span style={{ fontSize:9, color:STATUS_COLOR[ph.status||"upcoming"], border:`1px solid ${STATUS_COLOR[ph.status||"upcoming"]}33`, padding:"1px 5px" }}>{STATUS_LABEL[ph.status||"upcoming"]}</span>
            <div onClick={() => openEditPhase(ph)}
              style={{ width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"1px solid #1a1a1a", borderRadius:2, flexShrink:0 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
          </div>
          {ph.tasks.map((task) => (
            <div key={task.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px 8px 20px", borderLeft:`1px solid ${ph.color||accent}33`, marginLeft:3, marginBottom:2 }}>
              <div onClick={() => toggleTask(ph.id, task.id)}
                style={{ width:14, height:14, border:`1.5px solid ${task.done?"#333":PRIORITY_COLOR[task.priority||"medium"]}`, background:task.done?"#1a1a1a":"transparent", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {task.done && <div style={{ width:6, height:6, background:"#333" }}/>}
              </div>
              <span style={{ flex:1, fontSize:12, color:task.done?"#333":"#888", textDecoration:task.done?"line-through":"none" }}>{task.title}</span>
              <span style={{ fontSize:9, color:PRIORITY_COLOR[task.priority||"medium"], flexShrink:0 }}>{task.priority}</span>
              {task.assignee && task.assignee !== "—" && <span style={{ fontSize:9, color:"#333", flexShrink:0 }}>{task.assignee}</span>}
              {task.due && <span style={{ fontSize:9, color:"#2a2a2a", flexShrink:0 }}>{task.due}</span>}
            </div>
          ))}
          {ph.tasks.length === 0 && <div style={{ padding:"6px 20px", fontSize:11, color:"#222", fontStyle:"italic" }}>No tasks</div>}
        </div>
      ))}
      <div onClick={openNewPhase}
        style={{ marginTop:4, padding:"10px 12px", border:"1px dashed #1a1a1a", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ color:accent+"66", fontSize:16, lineHeight:1 }}>+</span>
        <span style={{ fontSize:11, color:"#333" }}>Add phase</span>
      </div>
    </div>
  );

  return (
    <div onClick={e=>e.stopPropagation()} style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"#06080a", display:"flex", flexDirection:"column",
      fontFamily:"'Roboto',sans-serif", animation:"projectFadeIn 0.18s ease",
    }}>
      <style>{`
        @keyframes projectFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:2px;height:2px} ::-webkit-scrollbar-thumb{background:#1a1a1a}
      `}</style>

      <div style={{ display:"flex", alignItems:"center", height:44, borderBottom:"1px solid #111", background:"#07090b", flexShrink:0 }}>
        <div onClick={onClose} style={{ width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", borderRight:"1px solid #111", cursor:"pointer", flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:6, padding:"0 12px", overflow:"hidden" }}>
          <span style={{ fontSize:11, color:accent, fontWeight:700, flexShrink:0 }}>◎</span>
          <span style={{ fontSize:11, color:"#333", flexShrink:0 }}>projects</span>
          <span style={{ fontSize:11, color:"#1e1e1e", flexShrink:0 }}>/</span>
          <span style={{ fontSize:11, color:"#666", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.title}</span>
        </div>
        <div style={{ padding:"0 12px", display:"flex", alignItems:"center", gap:8, borderLeft:"1px solid #111", flexShrink:0 }}>
          {teamContacts.length > 0 && (
            <div style={{ display:"flex", alignItems:"center" }}>
              {teamContacts.slice(0,4).map((c,i) => (
                <div key={c.id} style={{ marginLeft: i>0 ? -6 : 0, zIndex: 4-i }}>
                  <Avatar contact={c} size={22}/>
                </div>
              ))}
              {teamContacts.length > 4 && (
                <div style={{ marginLeft:-6, width:22, height:22, borderRadius:"50%", background:"#1a1a1a", border:"1px solid #333", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:"#555" }}>+{teamContacts.length-4}</div>
              )}
            </div>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ width:28, height:3, background:"#111", borderRadius:2, overflow:"hidden" }}>
              <div style={{ width:`${progress}%`, height:"100%", background: progress===100 ? "#34d399" : accent }}/>
            </div>
            <span style={{ fontSize:9, color: progress===100 ? "#34d399" : accent }}>{progress}%</span>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", borderBottom:"1px solid #111", background:"#07090b", flexShrink:0 }}>
        {[["overview","◈ Overview"],["board","▦ Board"],["timeline","↕ Timeline"]].map(([id,label]) => (
          <div key={id} onClick={() => { setView(id); if (id === "overview") refreshTeam(); }}
            style={{ padding:"10px 16px", fontSize:11, cursor:"pointer", userSelect:"none",
              color: view===id ? accent : "#444",
              borderBottom: `2px solid ${view===id ? accent : "transparent"}`,
              transition:"all 0.12s", letterSpacing:0.3,
            }}>{label}</div>
        ))}
      </div>

      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>
        {view === "overview" && <Overview/>}
        {view === "board"    && <Board/>}
        {view === "timeline" && <Timeline/>}
        <PhaseEditorModal/>
      </div>
    </div>
  );
}