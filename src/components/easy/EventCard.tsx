import { useState } from 'react';
import { TYPE_META } from '@/data/typeMeta';
import { 
  isHabitDone, markHabit, 
  isSubtaskDone, markSubtask, allSubtasksDone,
  getAttachKey, attachmentStore 
} from '@/utils/eventUtils';
import { getContactKey, contactStore } from '@/utils/contactUtils';
import { Avatar } from '@/components/easy/Avatar';
import { OilDropIcon } from '@/components/icons/OilDropIcon';
import { ContactSection } from '@/components/easy/ContactSection';
import { AttachmentSection } from '@/components/easy/AttachmentSection';
import { HabitTracker } from '@/components/easy/HabitTracker';

let _openDetailScreen = null;
export function registerOpenDetail(fn) { _openDetailScreen = fn; }

export function openTaskDetail(ev, dateKey, year, month, bump) {
  if (_openDetailScreen) _openDetailScreen({ ev, dateKey, year, month, bump });
}

export function EventCard({ ev, dateKey, year, month, forceUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [, rerender] = useState(0);
  const bump = () => { rerender(n=>n+1); forceUpdate(n=>n+1); };
  const isHabit = ev.type === "habit";
  const hasSubtasks = ev.subtasks && ev.subtasks.length > 0;
  const meta = TYPE_META[ev.type] || TYPE_META.task;

  const habitDone = isHabit ? isHabitDone(ev.title, dateKey) : false;
  const subtasksDone = hasSubtasks ? allSubtasksDone(ev, dateKey) : false;
  const [taskDone, setTaskDone] = useState(false);

  const isDone = hasSubtasks ? subtasksDone : (isHabit ? habitDone : taskDone);
  const accentColor = isDone ? "#333" : ev.color;
  const badgeColor = isHabit ? ev.color : meta.badgeColor;
  const badgeBorder = isHabit ? ev.color+"55" : meta.badgeBorder;
  const badgeBg = isHabit ? ev.color+"11" : meta.badgeBg;

  const doneCount = hasSubtasks ? ev.subtasks.filter(st => isSubtaskDone(ev.title, dateKey, st.id)).length : 0;
  const totalCount = hasSubtasks ? ev.subtasks.length : 0;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const handleMainCheck = () => {
    if (hasSubtasks) {
      const allDone = allSubtasksDone(ev, dateKey);
      ev.subtasks.forEach(st => markSubtask(ev.title, dateKey, st.id, !allDone));
      bump();
    } else if (isHabit) {
      markHabit(ev.title, dateKey, !habitDone);
      bump();
    } else {
      setTaskDone(d=>!d);
    }
  };

  return (
    <div style={{background:meta.cardBg,borderLeft:`3px solid ${accentColor}`,animation:"fadeIn 0.15s ease",userSelect:"none",opacity:isDone?0.5:1,transition:"opacity 0.2s, border-color 0.2s",position:"relative",overflow:"hidden"}}>
      {isHabit&&!isDone&&<div style={{position:"absolute",top:0,right:0,width:36,height:36,background:`repeating-linear-gradient(45deg,transparent,transparent 3px,${ev.color}18 3px,${ev.color}18 6px)`,borderBottomLeftRadius:4}}/>}
      <div style={{position:"relative"}}>
        {/* Open detail button — top right corner */}
        <div onClick={e=>{e.stopPropagation();openTaskDetail(ev,dateKey,year,month,bump);}} style={{position:"absolute",top:0,right:0,padding:"5px 7px",cursor:"pointer",zIndex:2,opacity:0.5,lineHeight:1}} title="Open detail">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="#888" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="15 3 21 3 21 9" stroke="#888" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><line x1="10" y1="14" x2="21" y2="3" stroke="#888" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        {/* Chevron — bottom right corner of the header row */}
        <div onClick={()=>setExpanded(e=>!e)} style={{position:"absolute",bottom:0,right:0,padding:"5px 7px",cursor:"pointer",zIndex:2,lineHeight:1}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{display:"block",transform:expanded?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}><path d="M6 9l6 6 6-6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px"}}>
          {hasSubtasks ? (
            <div style={{width:22,height:22,flexShrink:0,cursor:"default"}} onClick={e=>e.stopPropagation()}>
              <svg width="22" height="22" viewBox="0 0 22 22">
                <circle cx="11" cy="11" r="9" fill="none" stroke="#222" strokeWidth="2.5"/>
                {isDone
                  ? <circle cx="11" cy="11" r="9" fill="none" stroke={ev.color} strokeWidth="2.5"/>
                  : progressPct > 0 && (
                    <circle cx="11" cy="11" r="9" fill="none"
                      stroke={ev.color} strokeWidth="2.5"
                      strokeDasharray={`${2*Math.PI*9}`}
                      strokeDashoffset={`${2*Math.PI*9*(1-progressPct/100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 11 11)"
                      style={{transition:"stroke-dashoffset 0.3s"}}
                    />
                  )
                }
                {isDone
                  ? <path d="M6.5 11.5l3 3 6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  : <text x="11" y="11" dominantBaseline="middle" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={progressPct>0?ev.color:"#444"} fontFamily="system-ui">{progressPct>0?`${progressPct}`:"·"}</text>
                }
              </svg>
            </div>
          ) : (
            <div onClick={e=>{e.stopPropagation(); handleMainCheck();}} style={{width:22,height:22,borderRadius:ev.type==="easy"?"50%":meta.checkRadius,border:`2px solid ${isDone?ev.color:"#333"}`,background:isDone?ev.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"background 0.15s, border-color 0.15s"}}>
              {isDone
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : ev.type==="easy" && <OilDropIcon size={13} color="#f5c842" filled={false}/>
              }
            </div>
          )}
          <div style={{flex:1,cursor:"pointer"}} onClick={()=>setExpanded(e=>!e)}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
              <div style={{fontSize:14,fontWeight:600,color:isDone?"#444":"#fff",textDecoration:isDone?"line-through":"none",transition:"color 0.2s"}}>{ev.title}</div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase",color:badgeColor,border:`1px solid ${badgeBorder}`,padding:"1px 5px",borderRadius:isHabit?8:2,background:badgeBg,flexShrink:0,display:"flex",alignItems:"center",gap:3}}>
                {ev.type==="easy"
                  ? <><OilDropIcon size={9} color="#f5c842" filled={true}/><span>easy</span></>
                  : meta.label(ev)
                }
              </div>
              {hasSubtasks && !isDone && (
                <div style={{fontSize:9,color:ev.color,background:ev.color+"11",border:`1px solid ${ev.color}33`,padding:"1px 6px",borderRadius:8,flexShrink:0}}>
                  {doneCount}/{totalCount}
                </div>
              )}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {ev.time
                ? <span style={{fontSize:12,color:"#555"}}>{ev.time}</span>
                : <span style={{fontSize:11,color:"#333",fontStyle:"italic",letterSpacing:0.2}}>anytime</span>
              }
              {ev.duration && ev.duration !== "—" && <>
                <span style={{color:"#2a2a2a",fontSize:10}}>|</span>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#555" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="#555" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span style={{fontSize:12,color:"#555"}}>{ev.duration}</span>
                </div>
              </>}
              {hasSubtasks && !isDone && doneCount > 0 && (
                <div style={{flex:1,height:2,background:"#1a1a1a",borderRadius:1,overflow:"hidden",maxWidth:60}}>
                  <div style={{width:`${progressPct}%`,height:"100%",background:ev.color,borderRadius:1,transition:"width 0.3s"}}/>
                </div>
              )}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
            {(()=>{const ck=getContactKey(ev.title,ev.type);const cc=(contactStore[ck]||[]);return cc.length>0?<div style={{display:"flex",alignItems:"center"}}>{cc.slice(0,4).map((c,i)=><div key={c.id} style={{marginLeft:i>0?-6:0,zIndex:4-i}}><Avatar contact={c} size={20}/></div>)}{cc.length>4&&<div style={{width:20,height:20,borderRadius:"50%",background:"#1a1a1a",border:"1px solid #333",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#555",marginLeft:-6}}>+{cc.length-4}</div>}</div>:null;})()}
            {(()=>{const k=getAttachKey(ev.title,ev.type);const cnt=(attachmentStore[k]||[]).length;return cnt>0?<div style={{fontSize:9,color:"#555",border:"1px solid #1e1e1e",padding:"1px 5px",borderRadius:2,display:"flex",alignItems:"center",gap:3}}><span>📎</span>{cnt}</div>:null;})()}
          </div>
        </div>
      </div>
      {expanded&&(
        <div style={{padding:"0 14px 14px 46px",display:"flex",flexDirection:"column",gap:14,borderTop:"1px solid #141414"}}>
          <div style={{height:2}}/>
          {ev.task&&<div><div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{meta.sectionLabel}</div><div style={{fontSize:13,color:"#bbb",lineHeight:1.5}}>→ {ev.task}</div></div>}
          {ev.why&&<div><div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Why this matters</div><div style={{fontSize:13,color:"#888",lineHeight:1.5}}>{ev.why}</div></div>}

          {hasSubtasks && (
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1}}>Steps — {doneCount}/{totalCount} done</div>
                {doneCount > 0 && doneCount < totalCount && (
                  <div style={{height:3,width:80,background:"#1a1a1a",borderRadius:2,overflow:"hidden"}}>
                    <div style={{width:`${progressPct}%`,height:"100%",background:ev.color,borderRadius:2,transition:"width 0.3s"}}/>
                  </div>
                )}
                {isDone && <div style={{fontSize:9,color:ev.color,fontWeight:700,letterSpacing:0.5}}>ALL DONE ✓</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                {ev.subtasks.map((st, i) => {
                  const stDone = isSubtaskDone(ev.title, dateKey, st.id);
                  return (
                    <div key={st.id}
                      onClick={()=>{ markSubtask(ev.title, dateKey, st.id, !stDone); bump(); }}
                      style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",background:stDone?"#0d0d0d":"#080808",borderLeft:`2px solid ${stDone?ev.color+"66":"#1a1a1a"}`,cursor:"pointer",transition:"all 0.15s",userSelect:"none"}}>
                      {/* Checkbox */}
                      <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${stDone?ev.color:"#2a2a2a"}`,background:stDone?ev.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all 0.15s"}}>
                        {stDone && <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,color:stDone?"#444":"#bbb",textDecoration:stDone?"line-through":"none",lineHeight:1.4,transition:"color 0.15s"}}>{st.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!hasSubtasks && ev.how&&ev.how.length>0&&<div><div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>How to do it right</div><div style={{display:"flex",flexDirection:"column",gap:5}}>{ev.how.map((step,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}><div style={{width:4,height:4,background:"#333",flexShrink:0,marginTop:5}}/><span style={{fontSize:13,color:"#888",lineHeight:1.5}}>{step}</span></div>)}</div></div>}
          {ev.tools&&<div><div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Tools needed</div><div style={{fontSize:13,color:"#888"}}>{ev.tools}</div></div>}
          {ev.youtube&&<div><div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Watch</div><div style={{position:"relative",width:"100%",paddingBottom:"56.25%",background:"#0a0a0a",border:"1px solid #1a1a1a"}}><iframe src={`https://www.youtube.com/embed/${ev.youtube}?rel=0&modestbranding=1`} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}/></div></div>}
          {isHabit&&<HabitTracker title={ev.title} color={ev.color} year={year} month={month}/>}
          <ContactSection evTitle={ev.title} evType={ev.type} accentColor={accentColor}/>
          <AttachmentSection evTitle={ev.title} evType={ev.type} accentColor={accentColor}/>
        </div>
      )}
    </div>
  );
}