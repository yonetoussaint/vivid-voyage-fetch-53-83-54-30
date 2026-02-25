import { useState } from 'react';
import { TYPE_META } from '@/data/typeMeta';
import { 
  getEventOverride, setEventOverride, 
  isHabitDone, markHabit, 
  isSubtaskDone, markSubtask, allSubtasksDone 
} from '@/utils/eventUtils';
import { getContactKey, contactStore } from '@/utils/contactUtils';
import { getAttachKey, attachmentStore } from '@/utils/attachmentUtils';
import { HabitTracker } from '@/components/easy/HabitTracker';
import { ContactSection } from '@/components/easy/ContactSection';
import { AttachmentSection } from '@/components/easy/AttachmentSection';
import { OilDropIcon } from '@/components/easy/OilDropIcon';

export function TaskDetailScreen({ ev, dateKey, year, month, onClose, bump }) {
  const isHabit = ev.type === "habit";
  const hasSubtasks = ev.subtasks && ev.subtasks.length > 0;
  const meta = TYPE_META[ev.type] || TYPE_META.task;

  const [, rerender] = useState(0);
  const localBump = () => { rerender(n => n+1); bump && bump(); };

  const override = getEventOverride(ev.title, dateKey);
  const merged = { ...ev, ...override };

  const doneCount  = hasSubtasks ? ev.subtasks.filter(st => isSubtaskDone(ev.title, dateKey, st.id)).length : 0;
  const totalCount = hasSubtasks ? ev.subtasks.length : 0;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const habitDone = isHabit ? isHabitDone(ev.title, dateKey) : false;
  const isDone = hasSubtasks ? allSubtasksDone(ev, dateKey) : isHabit ? habitDone : !!(override.done);

  const handleMainCheck = () => {
    if (hasSubtasks) { 
      const allDone = allSubtasksDone(ev, dateKey); 
      ev.subtasks.forEach(st => markSubtask(ev.title, dateKey, st.id, !allDone)); 
    }
    else if (isHabit) { markHabit(ev.title, dateKey, !habitDone); }
    else { setEventOverride(ev.title, dateKey, { done: !override.done }); }
    localBump();
  };

  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");
  const startEdit = (field, current) => { setEditing(field); setDraft(current || ""); };
  const saveEdit  = (field) => { setEventOverride(ev.title, dateKey, { [field]: draft }); setEditing(null); localBump(); };
  const cancelEdit = () => setEditing(null);

  const accentColor = merged.color;
  const badgeColor  = isHabit ? merged.color : meta.badgeColor;
  const badgeBorder = isHabit ? merged.color + "55" : meta.badgeBorder;
  const badgeBg     = isHabit ? merged.color + "11" : meta.badgeBg;

  const inputStyle = { width:"100%", background:"#111", border:`1px solid ${accentColor}44`, color:"#ddd", fontSize:13, padding:"8px 10px", outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  const EditableField = ({ label, field, value, multiline, placeholder }) => {
    const isEd = editing === field;
    return (
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10, color:"#444", textTransform:"uppercase", letterSpacing:1, marginBottom:6, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span>{label}</span>
          {!isEd && <span onClick={() => startEdit(field, value)} style={{ fontSize:9, color:accentColor+"aa", cursor:"pointer", border:`1px solid ${accentColor}33`, padding:"1px 6px" }}>edit</span>}
        </div>
        {isEd ? (
          <div>
            {multiline
              ? <textarea value={draft} onChange={e=>setDraft(e.target.value)} autoFocus rows={4} style={{...inputStyle, resize:"vertical", lineHeight:1.6}}/>
              : <input value={draft} onChange={e=>setDraft(e.target.value)} autoFocus style={inputStyle}/>
            }
            <div style={{display:"flex",gap:8,marginTop:6}}>
              <span onClick={()=>saveEdit(field)} style={{fontSize:10,color:accentColor,cursor:"pointer",border:`1px solid ${accentColor}55`,padding:"3px 10px"}}>save</span>
              <span onClick={cancelEdit} style={{fontSize:10,color:"#444",cursor:"pointer",padding:"3px 6px"}}>cancel</span>
            </div>
          </div>
        ) : (
          <div onClick={() => startEdit(field, value)} style={{ fontSize:13, color:value?"#bbb":"#2a2a2a", lineHeight:1.6, cursor:"text", minHeight:20, fontStyle:value?"normal":"italic" }}>
            {value || (placeholder||"—")}
          </div>
        )}
      </div>
    );
  };

  const HowEditor = () => {
    const currentHow = merged.how || [];
    const [addingStep, setAddingStep] = useState(false);
    const [newStep, setNewStep] = useState("");
    const [editIdx, setEditIdx] = useState(null);
    const [editVal, setEditVal] = useState("");
    const saveStep = () => { if(!newStep.trim()){setAddingStep(false);return;} const u=[...currentHow,newStep.trim()]; setEventOverride(ev.title,dateKey,{how:u}); setNewStep("");setAddingStep(false);localBump(); };
    const updateStep = i => { const u=currentHow.map((s,idx)=>idx===i?editVal:s); setEventOverride(ev.title,dateKey,{how:u}); setEditIdx(null);localBump(); };
    const removeStep = i => { const u=currentHow.filter((_,idx)=>idx!==i); setEventOverride(ev.title,dateKey,{how:u}); localBump(); };
    return (
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span>How to do it right</span>
          <span onClick={()=>setAddingStep(true)} style={{fontSize:9,color:accentColor+"aa",cursor:"pointer",border:`1px solid ${accentColor}33`,padding:"1px 6px"}}>+ step</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {currentHow.map((step,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:accentColor+"18",border:`1px solid ${accentColor}44`,flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:9,color:accentColor,fontWeight:700}}>{i+1}</span>
              </div>
              {editIdx===i ? (
                <div style={{flex:1}}>
                  <input value={editVal} onChange={e=>setEditVal(e.target.value)} autoFocus style={{...inputStyle,fontSize:12,padding:"5px 8px"}}/>
                  <div style={{display:"flex",gap:8,marginTop:4}}>
                    <span onClick={()=>updateStep(i)} style={{fontSize:9,color:accentColor,cursor:"pointer"}}>save</span>
                    <span onClick={()=>setEditIdx(null)} style={{fontSize:9,color:"#444",cursor:"pointer"}}>cancel</span>
                    <span onClick={()=>removeStep(i)} style={{fontSize:9,color:"#ef5350",cursor:"pointer",marginLeft:"auto"}}>remove</span>
                  </div>
                </div>
              ):(
                <div style={{flex:1,display:"flex",gap:6,alignItems:"flex-start"}}>
                  <span style={{fontSize:13,color:"#888",lineHeight:1.5,flex:1}}>{step}</span>
                  <span onClick={()=>{setEditIdx(i);setEditVal(step);}} style={{fontSize:10,color:"#333",cursor:"pointer",flexShrink:0,marginTop:2}}>✎</span>
                </div>
              )}
            </div>
          ))}
          {addingStep&&(
            <div style={{display:"flex",gap:8,alignItems:"center",marginTop:2}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:accentColor+"18",border:`1px solid ${accentColor}44`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:9,color:accentColor}}>+</span>
              </div>
              <input value={newStep} onChange={e=>setNewStep(e.target.value)} autoFocus placeholder="Describe this step..." onKeyDown={e=>{if(e.key==="Enter")saveStep();if(e.key==="Escape")setAddingStep(false);}}
                style={{flex:1,background:"transparent",border:"none",borderBottom:`1px solid ${accentColor}33`,outline:"none",color:"#ddd",fontSize:13,padding:"4px 0",fontFamily:"inherit"}}/>
              <span onClick={saveStep} style={{fontSize:9,color:accentColor,cursor:"pointer",border:`1px solid ${accentColor}44`,padding:"2px 6px",flexShrink:0}}>add</span>
            </div>
          )}
          {currentHow.length===0&&!addingStep&&<div style={{fontSize:12,color:"#2a2a2a",fontStyle:"italic"}}>No steps yet</div>}
        </div>
      </div>
    );
  };

  const SubtaskEditor = () => {
    const [newLabel, setNewLabel] = useState("");
    const [addingNew, setAddingNew] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editVal, setEditVal] = useState("");
    const [dragIdx, setDragIdx] = useState(null);
    const [dragOverIdx, setDragOverIdx] = useState(null);
    const currentSubs = ev.subtasks || [];

    const addSub = () => { if(!newLabel.trim()){setAddingNew(false);return;} const n={id:`st_${Date.now()}`,label:newLabel.trim()}; ev.subtasks=[...currentSubs,n]; setNewLabel("");setAddingNew(false);localBump(); };
    const removeSub = id => { ev.subtasks=currentSubs.filter(s=>s.id!==id); localBump(); };
    const saveEdit = id => { ev.subtasks=currentSubs.map(s=>s.id===id?{...s,label:editVal}:s); setEditId(null); localBump(); };

    const onDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed="move"; };
    const onDragOver  = (e, idx) => { e.preventDefault(); setDragOverIdx(idx); };
    const onDrop      = (e, idx) => {
      e.preventDefault();
      if(dragIdx===null||dragIdx===idx) return;
      const arr=[...currentSubs];
      const [moved]=arr.splice(dragIdx,1);
      arr.splice(idx,0,moved);
      ev.subtasks=arr;
      setDragIdx(null); setDragOverIdx(null); localBump();
    };
    const onDragEnd   = () => { setDragIdx(null); setDragOverIdx(null); };

    return (
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span>Steps — {doneCount}/{currentSubs.length}</span>
          <span onClick={()=>setAddingNew(true)} style={{fontSize:9,color:accentColor+"aa",cursor:"pointer",border:`1px solid ${accentColor}33`,padding:"1px 6px"}}>+ step</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {currentSubs.map((st,idx)=>{
            const stDone=isSubtaskDone(ev.title,dateKey,st.id);
            const isEditing=editId===st.id;
            const isDragging=dragIdx===idx;
            const isOver=dragOverIdx===idx&&dragIdx!==idx;
            return(
              <div key={st.id}
                draggable={!isEditing}
                onDragStart={e=>onDragStart(e,idx)}
                onDragOver={e=>onDragOver(e,idx)}
                onDrop={e=>onDrop(e,idx)}
                onDragEnd={onDragEnd}
                style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:isDragging?"#0a0a0a":stDone?"#0d0d0d":"#080808",borderLeft:`2px solid ${isOver?accentColor:isEditing?accentColor+"88":stDone?accentColor+"66":"#1a1a1a"}`,opacity:isDragging?0.4:1,transition:"opacity 0.15s, border-color 0.15s",boxShadow:isOver?`inset 0 2px 0 ${accentColor}66`:"none"}}>
                {/* Drag handle */}
                {!isEditing && (
                  <div draggable={false} style={{display:"flex",flexDirection:"column",gap:2.5,flexShrink:0,cursor:"grab",padding:"2px 0",opacity:0.3}}>
                    {[0,1,2].map(i=><div key={i} style={{width:14,height:1.5,background:"#888",borderRadius:1}}/>)}
                  </div>
                )}
                <div onClick={()=>{if(!isEditing){markSubtask(ev.title,dateKey,st.id,!stDone);localBump();}}} style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${stDone?accentColor:"#2a2a2a"}`,background:stDone?accentColor:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",transition:"all 0.15s"}}>
                  {stDone&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                {isEditing ? (
                  <div style={{flex:1}}>
                    <input value={editVal} onChange={e=>setEditVal(e.target.value)} autoFocus
                      onKeyDown={e=>{if(e.key==="Enter")saveEdit(st.id);if(e.key==="Escape")setEditId(null);}}
                      style={{width:"100%",background:"transparent",border:"none",borderBottom:`1px solid ${accentColor}55`,outline:"none",color:"#ddd",fontSize:13,fontFamily:"inherit",padding:"0 0 2px",boxSizing:"border-box"}}/>
                    <div style={{display:"flex",gap:10,marginTop:6}}>
                      <span onClick={()=>saveEdit(st.id)} style={{fontSize:9,color:accentColor,cursor:"pointer",border:`1px solid ${accentColor}55`,padding:"2px 8px"}}>save</span>
                      <span onClick={()=>setEditId(null)} style={{fontSize:9,color:"#444",cursor:"pointer"}}>cancel</span>
                      <span onClick={()=>removeSub(st.id)} style={{fontSize:9,color:"#ef535066",cursor:"pointer",marginLeft:"auto"}}>remove</span>
                    </div>
                  </div>
                ) : (
                  <div onClick={()=>{setEditId(st.id);setEditVal(st.label);}} style={{flex:1,fontSize:13,color:stDone?"#444":"#bbb",textDecoration:stDone?"line-through":"none",lineHeight:1.5,cursor:"text"}}>{st.label}</div>
                )}
              </div>
            );
          })}
          {addingNew&&(
            <div style={{display:"flex",gap:10,alignItems:"center",padding:"8px 12px",background:"#0a0a0a",borderLeft:`2px solid ${accentColor}44`}}>
              <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${accentColor}44`,flexShrink:0}}/>
              <input value={newLabel} onChange={e=>setNewLabel(e.target.value)} autoFocus placeholder="Step description..." onKeyDown={e=>{if(e.key==="Enter")addSub();if(e.key==="Escape")setAddingNew(false);}}
                style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#ddd",fontSize:13,fontFamily:"inherit"}}/>
              <div onClick={addSub} style={{fontSize:9,color:accentColor,cursor:"pointer",border:`1px solid ${accentColor}44`,padding:"2px 6px",flexShrink:0}}>add</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ColorPicker = () => {
    const COLORS=["#34a853","#4285f4","#ea4335","#fbbc05","#9c27b0","#ff8a65","#4fc3f7","#69f0ae","#ef5350","#ffb74d","#ce93d8","#80cbc4","#f48fb1","#fff176","#a5d6a7","#90caf9","#ffe082","#ef9a9a","#546e7a","#fb923c"];
    const [open,setOpen]=useState(false);
    const cur=merged.color;
    return(
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Color</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div onClick={()=>setOpen(o=>!o)} style={{width:32,height:32,borderRadius:"50%",background:cur,cursor:"pointer",border:`3px solid ${cur}88`,boxShadow:open?`0 0 0 3px ${cur}44`:"none",transition:"box-shadow 0.15s"}}/>
          <span style={{fontSize:12,color:"#555",fontFamily:"monospace",letterSpacing:0.5}}>{cur}</span>
          <span style={{fontSize:10,color:"#444",cursor:"pointer",marginLeft:"auto"}} onClick={()=>setOpen(o=>!o)}>{open?"close":"change ↓"}</span>
        </div>
        {open&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:14,padding:"14px",background:"#0a0a0a",border:"1px solid #1a1a1a"}}>
            {COLORS.map(c=>(
              <div key={c} onClick={()=>{setEventOverride(ev.title,dateKey,{color:c});ev.color=c;setOpen(false);localBump();}}
                style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:`2.5px solid ${c===cur?"#fff":"transparent"}`,transition:"border 0.1s",boxShadow:c===cur?`0 0 0 2px ${c}88`:"none"}}/>
            ))}
          </div>
        )}
      </div>
    );
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{position:"absolute",inset:0,background:"#000",zIndex:200,display:"flex",flexDirection:"column",animation:"slideUp 0.22s ease"}} onClick={()=>menuOpen&&setMenuOpen(false)}>
      <style>{`@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* Clean header — back + three dots only */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",flexShrink:0,background:"#000"}}>
        <div onClick={onClose} style={{cursor:"pointer",padding:"4px 6px 4px 2px",display:"flex",alignItems:"center"}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{position:"relative"}}>
          <div onClick={e=>{e.stopPropagation();setMenuOpen(o=>!o);}} style={{cursor:"pointer",padding:"4px 6px",display:"flex",alignItems:"center",gap:3}}>
            {[0,1,2].map(i=><div key={i} style={{width:3.5,height:3.5,borderRadius:"50%",background:"#666"}}/>)}
          </div>
          {menuOpen&&(
            <div style={{position:"absolute",top:"100%",right:0,background:"#111",border:"1px solid #222",minWidth:160,zIndex:10,boxShadow:"0 4px 20px #000a"}}>
              {[
                {label:"Change color", action:()=>{setMenuOpen(false); startEdit("__colorpicker__","");}},
                {label:isDone?"Mark incomplete":"Mark complete", action:()=>{handleMainCheck();setMenuOpen(false);}},
                {label:"Edit title", action:()=>{setMenuOpen(false);startEdit("title",merged.title||ev.title);}},
              ].map(({label,action})=>(
                <div key={label} onClick={action} style={{padding:"11px 14px",fontSize:12,color:"#bbb",cursor:"pointer",borderBottom:"1px solid #1a1a1a"}}>{label}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{flex:1,overflowY:"auto",background:meta.cardBg}}>
        {/* Progress strip */}
        {hasSubtasks&&(
          <div style={{height:3,background:"#111",position:"relative",flexShrink:0}}>
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${progressPct}%`,background:accentColor,transition:"width 0.4s"}}/>
          </div>
        )}

        <div style={{padding:"20px 18px 0"}}>
          {/* Title block */}
          <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:16}}>
            {/* Checkbox / progress circle */}
            {hasSubtasks ? (
              <div style={{width:32,height:32,flexShrink:0,marginTop:2}}>
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="13" fill="none" stroke="#1e1e1e" strokeWidth="3"/>
                  {isDone ? <circle cx="16" cy="16" r="13" fill="none" stroke={accentColor} strokeWidth="3"/> : progressPct>0&&<circle cx="16" cy="16" r="13" fill="none" stroke={accentColor} strokeWidth="3" strokeDasharray={`${2*Math.PI*13}`} strokeDashoffset={`${2*Math.PI*13*(1-progressPct/100)}`} strokeLinecap="round" transform="rotate(-90 16 16)" style={{transition:"stroke-dashoffset 0.3s"}}/>}
                  {isDone ? <path d="M10 16.5l4.5 4.5 8-9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/> : <text x="16" y="16" dominantBaseline="middle" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={progressPct>0?accentColor:"#333"} fontFamily="system-ui">{progressPct>0?progressPct:"·"}</text>}
                </svg>
              </div>
            ) : (
              <div onClick={handleMainCheck} style={{width:32,height:32,borderRadius:meta.checkRadius==="50%"?"50%":meta.checkRadius,border:`2px solid ${isDone?accentColor:"#333"}`,background:isDone?accentColor:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,cursor:"pointer",transition:"all 0.15s"}}>
                {isDone&&<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {!isDone && ev.type==="easy" && <OilDropIcon size={16} color="#f5c842" filled={false}/>}
              </div>
            )}

            <div style={{flex:1,minWidth:0}}>
              {/* Editable title */}
              {editing==="title" ? (
                <div>
                  <input value={draft} onChange={e=>setDraft(e.target.value)} autoFocus
                    style={{width:"100%",background:"transparent",border:"none",borderBottom:`1px solid ${accentColor}66`,outline:"none",color:"#fff",fontSize:20,fontWeight:700,fontFamily:"inherit",padding:"0 0 4px",boxSizing:"border-box"}}
                    onKeyDown={e=>{if(e.key==="Enter")saveEdit("title");if(e.key==="Escape")cancelEdit();}}/>
                  <div style={{display:"flex",gap:8,marginTop:6}}>
                    <span onClick={()=>saveEdit("title")} style={{fontSize:10,color:accentColor,cursor:"pointer",border:`1px solid ${accentColor}55`,padding:"2px 8px"}}>save</span>
                    <span onClick={cancelEdit} style={{fontSize:10,color:"#444",cursor:"pointer"}}>cancel</span>
                  </div>
                </div>
              ) : (
                <div onClick={()=>startEdit("title",merged.title||ev.title)} style={{fontSize:20,fontWeight:700,color:isDone?"#555":"#fff",textDecoration:isDone?"line-through":"none",lineHeight:1.3,cursor:"text"}}>{merged.title||ev.title}</div>
              )}

              {/* Badge + time + duration row */}
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8,flexWrap:"wrap"}}>
                <span style={{fontSize:9,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase",color:badgeColor,border:`1px solid ${badgeBorder}`,padding:"2px 6px",borderRadius:isHabit?8:2,background:badgeBg}}>{meta.label(ev)}</span>
                {merged.time&&<span style={{fontSize:11,color:"#555"}}>{merged.time}</span>}
                {merged.duration&&merged.duration!=="—"&&<><span style={{color:"#2a2a2a",fontSize:10}}>·</span><span style={{fontSize:11,color:"#444"}}>{merged.duration}</span></>}
              </div>
            </div>
          </div>

          {/* Quick meta chips */}
          <div style={{display:"flex",gap:8,marginBottom:26,flexWrap:"wrap"}}>
            {[{label:"Time",field:"time",val:merged.time},{label:"Duration",field:"duration",val:merged.duration}].map(({label,field,val})=>(
              <div key={field} onClick={()=>startEdit(field,val||"")}
                style={{background:"#111",border:`1px solid ${editing===field?accentColor+"66":"#1a1a1a"}`,padding:"8px 12px",cursor:"text",flex:1,minWidth:80,transition:"border 0.15s"}}>
                <div style={{fontSize:9,color:"#444",letterSpacing:0.8,textTransform:"uppercase",marginBottom:4}}>{label}</div>
                {editing===field ? (
                  <input value={draft} onChange={e=>setDraft(e.target.value)} autoFocus onKeyDown={e=>{if(e.key==="Enter")saveEdit(field);if(e.key==="Escape")cancelEdit();}}
                    style={{width:"100%",background:"transparent",border:"none",outline:"none",color:"#ddd",fontSize:13,fontFamily:"inherit",padding:0}}/>
                ) : (
                  <div style={{fontSize:13,color:val?"#bbb":"#333",fontStyle:val?"normal":"italic"}}>{val||"tap to set"}</div>
                )}
              </div>
            ))}
          </div>

          <EditableField label={meta.sectionLabel} field="task" value={merged.task} multiline placeholder="What needs to be done?"/>
          <EditableField label="Why this matters" field="why" value={merged.why} multiline placeholder="What's the deeper reason?"/>
          {hasSubtasks ? <SubtaskEditor/> : <HowEditor/>}
          <EditableField label="Tools needed" field="tools" value={merged.tools} placeholder="Apps, equipment, resources..."/>
          <ColorPicker/>
          <EditableField label="Notes" field="notes" value={merged.notes} multiline placeholder="Extra context, reminders, ideas..."/>

          {isHabit&&<HabitTracker title={ev.title} color={accentColor} year={year} month={month}/>}

          {ev.youtube&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Watch</div>
              <div style={{position:"relative",width:"100%",paddingBottom:"56.25%",background:"#0a0a0a",border:"1px solid #1a1a1a"}}>
                <iframe src={`https://www.youtube.com/embed/${ev.youtube}?rel=0&modestbranding=1`} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}/>
              </div>
            </div>
          )}

          <div style={{borderTop:"1px solid #111",paddingTop:18,marginTop:4,display:"flex",flexDirection:"column",gap:18}}>
            <ContactSection evTitle={ev.title} evType={ev.type} accentColor={accentColor}/>
            <AttachmentSection evTitle={ev.title} evType={ev.type} accentColor={accentColor}/>
          </div>
          <div style={{height:40}}/>
        </div>
      </div>
    </div>
  );
}