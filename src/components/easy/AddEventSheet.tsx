import { useState, useEffect, useRef } from 'react';
import { MONTH_NAMES, DAY_LABELS } from '@/utils/dateHelpers';
import { OilDropIcon } from '@/components/easy/OilDropIcon';

const ADD_TYPE_OPTIONS = [
  { type:"task",        label:"Task",        icon:"✓",  color:"#888"    },
  { type:"meeting",     label:"Meeting",     icon:"⊞",  color:"#4fc3f7" },
  { type:"habit",       label:"Habit",       icon:"↻",  color:"#34a853" },
  { type:"focus",       label:"Focus",       icon:"◈",  color:"#69f0ae" },
  { type:"workout",     label:"Workout",     icon:"◉",  color:"#a5d6a7" },
  { type:"reminder",    label:"Reminder",    icon:"◎",  color:"#ffb74d" },
  { type:"social",      label:"Social",      icon:"♦",  color:"#ff8a65" },
  { type:"deadline",    label:"Deadline",    icon:"⚑",  color:"#ef5350" },
  { type:"errand",      label:"Errand",      icon:"◻",  color:"#ffe082" },
  { type:"appointment", label:"Appt",        icon:"✦",  color:"#ce93d8" },
  { type:"review",      label:"Review",      icon:"⊙",  color:"#80cbc4" },
  { type:"training",    label:"Training",    icon:"▷",  color:"#4db6ac" },
  { type:"travel",      label:"Travel",      icon:"→",  color:"#90caf9" },
  { type:"medical",     label:"Medical",     icon:"♥",  color:"#ef9a9a" },
  { type:"birthday",    label:"Birthday",    icon:"★",  color:"#f48fb1" },
  { type:"note",        label:"Note",        icon:"§",  color:"#e2e8f0" },
  { type:"goal",        label:"Goal",        icon:"◆",  color:"#fff176" },
  { type:"blocklist",   label:"Block",       icon:"⊘",  color:"#546e7a" },
];

const DAYPART_OPTIONS = ["Dawn","Morning","Afternoon","Evening"];

const PRESET_COLORS = [
  "#4285f4","#34a853","#ef5350","#69f0ae","#ffb74d","#ce93d8",
  "#ff8a65","#4fc3f7","#a5d6a7","#fff176","#ef9a9a","#80cbc4",
];

const MONTH_NAMES_S = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export function AddEventSheet({ year, month, day, onClose, onAdd }) {
  const [step, setStep] = useState("type"); // "type" | "details"
  const [selectedType, setSelectedType] = useState(null);
  const [title, setTitle] = useState("");
  const [part, setPart] = useState("Morning");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [color, setColor] = useState("");
  const [task, setTask] = useState("");
  const titleRef = useRef(null);

  useEffect(() => {
    if (step === "details" && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 120);
    }
  }, [step]);

  const selectType = (t) => {
    setSelectedType(t);
    setColor(t.color);
    setStep("details");
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    const ev = {
      type: selectedType.type,
      title: title.trim(),
      color,
      duration: duration.trim() || undefined,
      task: task.trim() || undefined,
    };
    if (time.trim()) ev.time = time.trim();
    onAdd(part, ev);
    onClose();
  };

  const dateLabel = `${DOW[new Date(year,month,day).getDay()]}, ${MONTH_NAMES_S[month]} ${day}`;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:"absolute", inset:0, background:"rgba(0,0,0,0.7)",
          zIndex:100, animation:"sheetFadeIn 0.2s ease",
        }}
      />

      {/* Sheet */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0,
        background:"#0a0a0a", borderTop:"1px solid #1e1e1e",
        borderRadius:"16px 16px 0 0",
        zIndex:101, display:"flex", flexDirection:"column",
        maxHeight:"85%", animation:"sheetSlideUp 0.25s cubic-bezier(0.32,0.72,0,1)",
      }}>
        <style>{`
          @keyframes sheetFadeIn { from{opacity:0} to{opacity:1} }
          @keyframes sheetSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        `}</style>

        {/* Handle */}
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 4px", flexShrink:0 }}>
          <div style={{ width:36, height:4, borderRadius:2, background:"#222" }}/>
        </div>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 20px 12px", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>
              {step === "type" ? "Add to calendar" : `New ${selectedType?.label}`}
            </div>
            <div style={{ fontSize:11, color:"#444", marginTop:2 }}>{dateLabel}</div>
          </div>
          {step === "details" && (
            <div onClick={() => setStep("type")} style={{ fontSize:11, color:"#4285f4", cursor:"pointer", padding:"4px 8px", border:"1px solid #4285f422" }}>
              ← type
            </div>
          )}
        </div>

        {/* ── STEP 1: Type picker ── */}
        {step === "type" && (
          <div style={{ overflowY:"auto", padding:"0 16px 24px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {ADD_TYPE_OPTIONS.map(t => (
                <div
                  key={t.type}
                  onClick={() => selectType(t)}
                  style={{
                    display:"flex", alignItems:"center",
                    gap:10, padding:"12px 14px",
                    background:"#0f0f0f", border:`1px solid #1e1e1e`,
                    cursor:"pointer", userSelect:"none",
                    transition:"all 0.12s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.color+"11"; e.currentTarget.style.borderColor = t.color+"44"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#0f0f0f"; e.currentTarget.style.borderColor = "#1e1e1e"; }}
                >
                  <span style={{ fontSize:16, color:t.color, lineHeight:1, width:20, textAlign:"center", flexShrink:0 }}>{t.icon}</span>
                  <span style={{ fontSize:12, color:"#888", letterSpacing:0.3 }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Details form ── */}
        {step === "details" && selectedType && (
          <div style={{ overflowY:"auto", padding:"0 20px 32px", display:"flex", flexDirection:"column", gap:16 }}>

            {/* Title */}
            <div>
              <div style={{ fontSize:10, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Title *</div>
              <input
                ref={titleRef}
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder={`e.g. ${selectedType.label} title…`}
                style={{
                  width:"100%", boxSizing:"border-box",
                  background:"transparent", border:"none",
                  borderBottom:`1px solid ${color}55`,
                  outline:"none", color:"#fff",
                  fontSize:16, padding:"6px 0",
                  fontFamily:"inherit",
                }}
              />
            </div>

            {/* Daypart */}
            <div>
              <div style={{ fontSize:10, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Daypart</div>
              <div style={{ display:"flex", gap:8 }}>
                {DAYPART_OPTIONS.map(p => (
                  <div
                    key={p}
                    onClick={() => setPart(p)}
                    style={{
                      flex:1, textAlign:"center", padding:"8px 4px",
                      fontSize:11, letterSpacing:0.5,
                      background: part===p ? color+"22" : "#0f0f0f",
                      border: `1px solid ${part===p ? color+"66" : "#1e1e1e"}`,
                      color: part===p ? color : "#555",
                      cursor:"pointer", userSelect:"none",
                      transition:"all 0.12s",
                    }}
                  >
                    {p==="Morning"?"🌅":p==="Afternoon"?"☀️":"🌙"} {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Time + Duration row */}
            <div style={{ display:"flex", gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Time <span style={{ color:"#2a2a2a", fontWeight:400 }}>(optional)</span></div>
                <input
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  placeholder="e.g. 9:00 AM"
                  style={{
                    width:"100%", boxSizing:"border-box",
                    background:"transparent", border:"none",
                    borderBottom:"1px solid #1e1e1e",
                    outline:"none", color:"#bbb",
                    fontSize:13, padding:"5px 0", fontFamily:"inherit",
                  }}
                />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Duration</div>
                <input
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="e.g. 1 hr"
                  style={{
                    width:"100%", boxSizing:"border-box",
                    background:"transparent", border:"none",
                    borderBottom:"1px solid #1e1e1e",
                    outline:"none", color:"#bbb",
                    fontSize:13, padding:"5px 0", fontFamily:"inherit",
                  }}
                />
              </div>
            </div>

            {/* Task / description */}
            <div>
              <div style={{ fontSize:10, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Description</div>
              <input
                value={task}
                onChange={e => setTask(e.target.value)}
                placeholder="What needs to happen?"
                style={{
                  width:"100%", boxSizing:"border-box",
                  background:"transparent", border:"none",
                  borderBottom:"1px solid #1e1e1e",
                  outline:"none", color:"#bbb",
                  fontSize:13, padding:"5px 0", fontFamily:"inherit",
                }}
              />
            </div>

            {/* Color picker */}
            <div>
              <div style={{ fontSize:10, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Color</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {PRESET_COLORS.map(c => (
                  <div
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      width:28, height:28, borderRadius:"50%", background:c,
                      cursor:"pointer", border:`3px solid ${color===c ? "#fff" : "transparent"}`,
                      boxSizing:"border-box", transition:"border 0.1s",
                      flexShrink:0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <div
              onClick={handleAdd}
              style={{
                marginTop:4,
                padding:"14px",
                background: title.trim() ? color : "#111",
                color: title.trim() ? "#000" : "#333",
                textAlign:"center",
                fontSize:14, fontWeight:700,
                cursor: title.trim() ? "pointer" : "default",
                transition:"all 0.15s",
                letterSpacing:0.5,
              }}
            >
              Add to {part}
            </div>
          </div>
        )}
      </div>
    </>
  );
}