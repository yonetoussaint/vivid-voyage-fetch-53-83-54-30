import { useState } from 'react';
import { isHabitDone } from '../utils/eventUtils';
import { DAY_SHORT, MONTH_SHORT, getTodayKey } from '../utils/dateHelpers';

export function HabitTracker({ title, color, year, month }) {
  const [tab, setTab] = useState("week");
  const now = new Date();
  const todayStr = getTodayKey();
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(startOfWeek); d.setDate(startOfWeek.getDate() + i); return d; });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  const currentYear = now.getFullYear();
  const yearMonths = Array.from({ length: 12 }, (_, m) => { const dIM = new Date(currentYear,m+1,0).getDate(); return Array.from({length:dIM},(_,d)=>new Date(currentYear,m,d+1)); });
  const toKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  const tabStyle = t => ({ fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", cursor: "pointer", padding: "3px 8px", fontWeight: 600, color: tab===t?"#fff":"#444", borderBottom: `1px solid ${tab===t?color:"transparent"}` });
  const weekDone = weekDays.filter(d => isHabitDone(title, toKey(d))).length;
  const monthDone = monthDays.filter(d => isHabitDone(title, toKey(d))).length;
  const yearDone = yearMonths.flat().filter(d => isHabitDone(title, toKey(d))).length;
  const yearTotal = yearMonths.flat().length;

  return (
    <div style={{marginTop:4}}>
      <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Completions</div>
      <div style={{display:"flex",gap:0,marginBottom:12,borderBottom:"1px solid #1a1a1a"}}>
        {["week","month","year"].map(t=><div key={t} style={tabStyle(t)} onClick={()=>setTab(t)}>{t}</div>)}
      </div>
      {tab==="week"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          {weekDays.map((d,i)=>{const key=toKey(d);const done=isHabitDone(title,key);const isToday=key===todayStr;return(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{fontSize:9,color:isToday?color:"#444"}}>{DAY_SHORT[i]}</div>
              <div style={{width:26,height:26,borderRadius:"50%",background:done?color:"#111",border:`1.5px solid ${isToday?color:done?color:"#222"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {done&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div style={{fontSize:9,color:"#333"}}>{d.getDate()}</div>
            </div>
          );})}
        </div>
        <div style={{fontSize:11,color:"#555",textAlign:"right"}}>{weekDone}/7 this week</div>
      </div>}
      {tab==="month"&&<div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
          {monthDays.map((d,i)=>{const key=toKey(d);const done=isHabitDone(title,key);const isToday=key===todayStr;return(
            <div key={i} style={{width:18,height:18,borderRadius:"50%",background:done?color:"#111",border:`1px solid ${isToday?color:done?color:"#1e1e1e"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {done&&<svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          );})}
        </div>
        <div style={{fontSize:11,color:"#555",textAlign:"right"}}>{monthDone}/{daysInMonth} this month · {Math.round(monthDone/daysInMonth*100)}%</div>
      </div>}
      {tab==="year"&&<div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {yearMonths.map((mDays,mi)=>{const mDone=mDays.filter(d=>isHabitDone(title,toKey(d))).length;const pct=mDays.length>0?mDone/mDays.length:0;return(
            <div key={mi} style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontSize:9,color:"#444",width:24,textAlign:"right",flexShrink:0}}>{MONTH_SHORT[mi]}</div>
              <div style={{flex:1,height:8,background:"#111",position:"relative"}}>
                <div style={{position:"absolute",top:0,left:0,bottom:0,width:`${pct*100}%`,background:color,opacity:0.3+pct*0.7,transition:"width 0.3s"}}/>
              </div>
              <div style={{fontSize:9,color:"#444",width:22,textAlign:"right",flexShrink:0}}>{mDone}</div>
            </div>
          );})}
        </div>
        <div style={{fontSize:11,color:"#555",textAlign:"right",marginTop:8}}>{yearDone}/{yearTotal} this year · {Math.round(yearDone/yearTotal*100)}%</div>
      </div>}
    </div>
  );
}