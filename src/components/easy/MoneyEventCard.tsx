import { IC } from '@/components/icons/IconLibrary';

export function MoneyEventCard({ ev }) {
  const isSpend = ev.type === "spending";
  const accent = ev.color || (isSpend ? "#ef5350" : "#69f0ae");
  const sign = isSpend ? "-" : "+";
  
  const evIcon = isSpend 
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 8 12 4 8 8"/>
        <line x1="12" y1="4" x2="12" y2="16"/>
        <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/>
      </svg>;
  
  const catLabel = ev._cat ? ev._cat.label : (ev._src ? ev._src.label : "");

  return (
    <div style={{
      display:"flex", alignItems:"center", gap:10,
      padding:"10px 12px",
      background: isSpend ? "#100a0a" : "#091009",
      border:`1px solid ${accent}22`,
      borderLeft:`3px solid ${accent}`,
    }}>
      <span style={{ flexShrink:0, display:"flex", alignItems:"center" }}>{evIcon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#ccc", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.title}</div>
        {catLabel && (
          <div style={{ fontSize:10, color:"#444", marginTop:1 }}>{catLabel}</div>
        )}
      </div>
      <div style={{ fontSize:15, fontWeight:800, color:accent, flexShrink:0 }}>
        {sign}G {ev.amount?.toLocaleString()}
      </div>
    </div>
  );
}