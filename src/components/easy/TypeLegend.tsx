import { TYPE_META } from '@/data/typeMeta';
import { OilDropIcon } from '@components/easy/OilDropIcon';

export function TypeLegend({ onClose }) {
  const entries = Object.entries(TYPE_META);
  return (
    <div style={{position:"absolute",inset:0,background:"#000",zIndex:100,overflowY:"auto",padding:"20px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontSize:18,fontWeight:700}}>Event Types</div>
        <div onClick={onClose} style={{cursor:"pointer",fontSize:26,color:"#555",lineHeight:1}}>×</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {entries.map(([key, m]) => {
          const isHabitType = key === "habit";
          const bc = isHabitType ? "#34a853" : m.badgeColor;
          const bb = isHabitType ? "#34a85355" : m.badgeBorder;
          const bbg = isHabitType ? "#34a85311" : m.badgeBg;
          const label = isHabitType ? "↻ daily / weekly" : key === "easy" ? "easy" : m.label({});
          const desc = { habit:"Recurring habit — tracked with streaks", task:"One-off to-do item", meeting:"Syncs, standups, demos, calls", reminder:"Personal nudges & check-ins", deadline:"Hard due dates & submissions", appointment:"External bookings & visits", focus:"Deep work blocks — DND mode", review:"Code, design & performance reviews", training:"Courses, learning & certifications", travel:"Flights, commutes & trips", medical:"Doctor, therapy & health visits", workout:"One-off gym sessions & sports", birthday:"Birthdays with gift & plan reminders", errand:"Quick real-world to-dos", social:"Dinners, parties & hangouts", goal:"Monthly / weekly goal checkpoints", blocklist:"Protected time — no interruptions", easy:"Easy essences station — shifts, restocks & client work", note:"Quick capture — ideas, quotes, observations", article:"Long-form writing — essays, posts, features", doc:"Technical documentation — specs, guides, references", journal:"Personal entries — reflection, feelings, daily log", draft:"Work in progress — any writing that needs finishing" };
          return (
            <div key={key} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 12px",background:isHabitType?"#0a0f0a":m.cardBg,borderLeft:`3px solid ${bc}`,fontFamily:m.writing?"'Courier New',monospace":"inherit"}}>
              <div style={{width:20,height:20,borderRadius:isHabitType?"50%":m.checkRadius,border:`2px solid ${bc}55`,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase",color:bc,border:`1px solid ${bb}`,padding:"1px 5px",borderRadius:isHabitType?8:2,background:bbg,display:"inline-flex",alignItems:"center",gap:3,marginBottom:3}}>
                {key==="easy"?<><OilDropIcon size={9} color="#f5c842" filled={true}/><span>easy</span></>:label}
              </div>
                <div style={{fontSize:11,color:"#666"}}>{desc[key]}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}