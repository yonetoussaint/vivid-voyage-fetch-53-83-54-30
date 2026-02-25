import { useState, useEffect } from 'react';
import { CalendarTab } from '@/components/easy/CalendarTab';
import { NotesTab } from '@/components/easy/NotesTab';
import { MoneyTab } from '@/components/easy/MoneyTab';
import { TaskDetailScreen } from '@/components/easy/TaskDetailScreen';
import { registerOpenDetail } from '@/components/easy/EventCard';

export default function SamsungCalendar() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [detailCtx, setDetailCtx] = useState(null);

  useEffect(() => {
    registerOpenDetail((ctx) => setDetailCtx(ctx));
    return () => registerOpenDetail(null);
  }, []);

  const TABS = [
    {
      id: "notes",
      label: "Notes",
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#4285f4":"#555"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <line x1="9" y1="9" x2="15" y2="9"/>
          <line x1="9" y1="13" x2="13" y2="13"/>
        </svg>
      ),
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#4285f4":"#555"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      id: "money",
      label: "Money",
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#ef5350":"#555"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="13" rx="2"/>
          <path d="M2 10h20"/>
          <circle cx="12" cy="15" r="2"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"#1a1a1a",fontFamily:"'Roboto',sans-serif"}}>
      <div style={{width:390,height:844,background:"#000",overflow:"hidden",position:"relative",display:"flex",flexDirection:"column",color:"#fff"}}>

        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}} div::-webkit-scrollbar{display:none} input::-webkit-scrollbar{display:none}`}</style>

        {/* Allow scrolling inside the tab container */}
        <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>
          {activeTab === "notes"    && <NotesTab />}
          {activeTab === "calendar" && <CalendarTab />}
          {activeTab === "money"    && <MoneyTab />}
        </div>

        <div style={{ display:"flex", flexShrink:0, borderTop:"1px solid #111", background:"#000", paddingBottom:8 }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <div key={tab.id} onClick={()=>setActiveTab(tab.id)}
                style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, padding:"10px 0 6px", cursor:"pointer", userSelect:"none" }}
              >
                {tab.icon(active)}
                <span style={{ fontSize:10, color:active?"#4285f4":"#555", fontWeight:active?600:400, letterSpacing:0.3 }}>{tab.label}</span>
                {active && <div style={{ width:20, height:2, borderRadius:1, background:"#4285f4", marginTop:1 }}/>}
              </div>
            );
          })}
        </div>

        {detailCtx && <TaskDetailScreen ev={detailCtx.ev} dateKey={detailCtx.dateKey} year={detailCtx.year} month={detailCtx.month} onClose={()=>setDetailCtx(null)} bump={()=>detailCtx.bump&&detailCtx.bump()}/>}

      </div>
    </div>
  );
}