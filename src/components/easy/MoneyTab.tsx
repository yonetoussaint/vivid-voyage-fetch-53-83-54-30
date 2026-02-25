import { useState } from 'react';
import { MONTH_NAMES } from '@/utils/dateHelpers';
import { IC } from '@/components/easy/IconLibrary';
import { 
  getSalary, setSalary,
  incomeStore, recurringStore, goalsStore, bucketStore,
  addIncome, getTotalIncomeWithSalary, getRecurringTotal, 
  getMonthTotals, getGoalProgress, getNextGoalId   // <-- changed: removed goalIdCounter, added getNextGoalId
} from '@/stores/moneyStores';
import { SPEND_CATEGORIES, INCOME_SOURCES, INCOME_SOURCE_ICONS, 
         DEFAULT_BUCKETS, GOAL_ICONS, GOAL_COLORS } from '@/data/moneyData';
import { PayrollView } from '@/components/easy/PayrollView';

// Re-export for use in other components
export { SPEND_CATEGORIES, INCOME_SOURCES, INCOME_SOURCE_ICONS };

export function MoneyTab() {
  const [view, setView] = useState("overview");
  const [selectedMoneyMonth, setSelectedMoneyMonth] = useState(new Date().getMonth());
  const [salaryReceived, setSalaryReceived] = useState(false);
  const [salary, setSalaryState] = useState(getSalary()); // local copy for reactivity
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n+1);

  const totals      = getMonthTotals(selectedMoneyMonth);
  const totalIncome = getTotalIncomeWithSalary(salaryReceived);
  const totalSpent  = SPEND_CATEGORIES.filter(c => c.id !== "savings").reduce((s,c) => s + (totals[c.id]||0), 0);
  const totalSaved  = totals["savings"] || 0;
  const remaining   = totalIncome - totalSpent - totalSaved;
  const spentPct    = Math.min(100, Math.round((totalSpent / totalIncome) * 100));
  const dangerMode  = remaining < 1000;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const MONEY_TABS = [
    { id:"overview",  label:"Overview",   icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>, color:"#4285f4" },
    { id:"income",    label:"Income",     icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, color:"#69f0ae" },
    { id:"expenses",  label:"Expenses",   icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>, color:"#ef5350" },
    { id:"goals",     label:"Goals",      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, color:"#69f0ae" },
    { id:"recurring", label:"Bills",      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg>, color:"#ce93d8" },
    { id:"payroll",   label:"Payroll",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color:"#ffb74d" },
    { id:"history",   label:"History",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, color:"#888" },
  ];

  const currentTab = MONEY_TABS.find(t => t.id === view) || MONEY_TABS[0];
  const totalIncomeSidebar = getTotalIncomeWithSalary(salaryReceived);

  // ── OVERVIEW ──
  const Overview = () => (
    <div style={{ flex:1, overflowY:"auto", padding:"0 0 80px" }}>
      {/* Hero balance card */}
      <div style={{
        margin:"16px 16px 0",
        padding:"20px",
        background: dangerMode ? "#100808" : "#080f08",
        border: `1px solid ${dangerMode ? "#ef535033" : "#34a85333"}`,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background: dangerMode?"#ef535008":"#34a85308" }}/>
        <div style={{ fontSize:10, color: dangerMode?"#ef9a9a":"#69f0ae", letterSpacing:1.2, textTransform:"uppercase", marginBottom:4 }}>
          {dangerMode ? "⚠ Watch your spending" : "✓ On track"}
        </div>
        <div style={{ fontSize:11, color:"#444", marginBottom:2 }}>Remaining this month</div>
        <div style={{ fontSize:36, fontWeight:800, letterSpacing:-1, color: dangerMode?"#ef5350":"#fff", lineHeight:1.1 }}>
          G {remaining.toLocaleString()}
        </div>
        <div style={{ fontSize:11, color:"#333", marginTop:6 }}>of G {totalIncome.toLocaleString()} total income</div>

        {/* Progress bar */}
        <div style={{ marginTop:16, height:4, background:"#111", borderRadius:2, overflow:"hidden" }}>
          <div style={{
            height:"100%", borderRadius:2,
            width:`${spentPct}%`,
            background: spentPct > 80 ? "#ef5350" : spentPct > 60 ? "#ffb74d" : "#34a853",
            transition:"width 0.4s",
          }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
          <span style={{ fontSize:10, color:"#444" }}>G {totalSpent.toLocaleString()} spent</span>
          <span style={{ fontSize:10, color:"#444" }}>{spentPct}% of salary</span>
        </div>
      </div>

      {/* Quick stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, margin:"8px 16px 0" }}>
        <div style={{ padding:"10px 12px", background:"#0a0c12", border:"1px solid #4285f422" }}>
          <div style={{ fontSize:8, color:"#4285f4", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>Income</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>G {totalIncome.toLocaleString()}</div>
          <div style={{ fontSize:9, color:"#333" }}>{incomeStore.length} source{incomeStore.length!==1?"s":""}</div>
        </div>
        <div style={{ padding:"10px 12px", background:"#0a0f0a", border:"1px solid #34a85322" }}>
          <div style={{ fontSize:8, color:"#34a853", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>Saved</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#69f0ae" }}>G {totalSaved.toLocaleString()}</div>
          <div style={{ fontSize:9, color:"#333" }}>goal: G 3,000</div>
        </div>
        <div style={{ padding:"10px 12px", background:"#0f0d08", border:"1px solid #ffb74d22" }}>
          <div style={{ fontSize:8, color:"#ffb74d", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>Spent</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#ef5350" }}>G {totalSpent.toLocaleString()}</div>
          <div style={{ fontSize:9, color:"#333" }}>{recurringStore.length} bill{recurringStore.length!==1?"s":""}</div>
        </div>
      </div>

      {/* Category breakdown */}
      <div style={{ margin:"16px 16px 0" }}>
        <div style={{ fontSize:10, color:"#333", letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>Budget breakdown</div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {SPEND_CATEGORIES.map(cat => {
            const spent = totals[cat.id] || 0;
            const pct   = Math.min(100, Math.round((spent / cat.budget) * 100));
            const over  = spent > cat.budget;
            return (
              <div key={cat.id} style={{ padding:"10px 12px", background:"#080808", border:`1px solid ${over ? cat.color+"44":"#111"}`, borderLeft:`3px solid ${cat.color}` }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ display:"flex", alignItems:"center" }}>{cat.icon(cat.color, 15)}</span>
                    <span style={{ fontSize:13, color:"#bbb" }}>{cat.label}</span>
                    {over && <span style={{ fontSize:9, color:"#ef5350", border:"1px solid #ef535033", padding:"1px 5px" }}>OVER</span>}
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <span style={{ fontSize:13, fontWeight:700, color: over?"#ef5350":"#fff" }}>G {spent.toLocaleString()}</span>
                    <span style={{ fontSize:10, color:"#333" }}> / G {cat.budget.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ height:3, background:"#111", borderRadius:2, overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`, height:"100%", background: over?"#ef5350":cat.color, borderRadius:2, transition:"width 0.3s" }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── INCOME ──
  const Income = () => {
    const [adding, setAdding]       = useState(false);
    const [iAmount, setIAmount]     = useState("");
    const [iLabel,  setILabel]      = useState("");
    const [iSource, setISource]     = useState("family");
    const [iRecurring, setIRecurring] = useState(false);
    const [, localRefresh]          = useState(0);
    const lr = () => { localRefresh(n=>n+1); refresh(); };

    const [editingId, setEditingId]       = useState(null);
    const [editAmount, setEditAmount]     = useState("");
    const [editLabel,  setEditLabel]      = useState("");
    const [editDate,   setEditDate]       = useState("");
    const [salaryEditing, setSalaryEditing] = useState(false);
    const [salaryInput,   setSalaryInput]   = useState(String(salary));

    const handleDelete = (id) => {
      const entry = incomeStore.find(e => e.id === id);
      const idx = incomeStore.findIndex(e => e.id === id);
      if (idx > -1) incomeStore.splice(idx, 1);
      if (entry && entry.sourceId === "salary") setSalaryReceived(false);
      if (editingId === id) setEditingId(null);
      lr();
    };

    const handleEditOpen = (entry) => {
      setEditingId(entry.id);
      setEditAmount(String(entry.amount));
      setEditLabel(entry.label);
      setEditDate(entry.isoDate || "");
    };

    const handleEditSave = (id) => {
      const amt = parseFloat(editAmount);
      if (!amt || amt <= 0 || !editLabel.trim()) return;
      const idx = incomeStore.findIndex(e => e.id === id);
      if (idx > -1) {
        incomeStore[idx].amount  = amt;
        incomeStore[idx].label   = editLabel.trim();
        if (editDate) {
          incomeStore[idx].isoDate = editDate;
          const d = new Date(editDate + "T12:00:00");
          incomeStore[idx].date = d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
        }
      }
      setEditingId(null);
      lr();
    };

    const monthEntries = incomeStore.filter(e => e.month === selectedMoneyMonth);
    const monthSalary = monthEntries.find(e => e.sourceId === "salary");
    const nonSalary = monthEntries.filter(e => e.sourceId !== "salary");
    const nonSalaryTotal = nonSalary.reduce((s,e) => s+e.amount, 0);
    const total = (monthSalary ? salary : 0) + nonSalaryTotal;
    const today = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});

    const handleReceiveSalary = () => {
      if (salaryReceived) return;
      setSalaryReceived(true);
      addIncome({ sourceId:"salary", label:"Monthly salary", amount:salary, recurring:false });
      lr();
    };

    const handleSalaryUpdate = () => {
      const v = parseFloat(salaryInput);
      if (v > 0) {
        setSalary(v);
        setSalaryState(v);
      }
      setSalaryEditing(false);
      lr();
    };

    const handleAdd = () => {
      const amt = parseFloat(iAmount);
      if (!amt || !iLabel.trim()) return;
      addIncome({ sourceId: iSource, label: iLabel.trim(), amount: amt, recurring: iRecurring });
      setIAmount(""); setILabel(""); setISource("family"); setIRecurring(false);
      setAdding(false);
      lr();
    };

    return (
      <div style={{ flex:1, overflowY:"auto", padding:"0 0 80px" }}>
        {/* Salary receive button */}
        <div style={{ margin:"14px 16px 0" }}>
          {salaryEditing ? (
            <div style={{ padding:"14px 16px", background:"#0a0c12", border:"1px solid #4285f433" }}>
              <div style={{ fontSize:9, color:"#444", letterSpacing:0.8, textTransform:"uppercase", marginBottom:8 }}>Base salary (HTG)</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:16, color:"#4285f4" }}>G</span>
                <input autoFocus type="number" value={salaryInput} onChange={e=>setSalaryInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter") handleSalaryUpdate(); }}
                  style={{ flex:1, background:"transparent", border:"none", borderBottom:"1px solid #2a2a2a", outline:"none", color:"#fff", fontSize:22, fontWeight:800, fontFamily:"inherit", padding:"4px 0" }}/>
                <div onClick={handleSalaryUpdate}
                  style={{ fontSize:11, fontWeight:700, color:"#4285f4", background:"#4285f418", border:"1px solid #4285f433", padding:"6px 14px", cursor:"pointer", flexShrink:0 }}>Save</div>
                <div onClick={()=>setSalaryEditing(false)}
                  style={{ fontSize:11, color:"#444", padding:"6px 10px", border:"1px solid #1a1a1a", cursor:"pointer", flexShrink:0 }}>✕</div>
              </div>
            </div>
          ) : salaryReceived ? (
            <div style={{ padding:"14px 16px", background:"#080f08", border:"1px solid #34a85333", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"#34a85318", border:"1px solid #34a85333", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {INCOME_SOURCE_ICONS.salary("#34a853")}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, color:"#34a853", fontWeight:700, letterSpacing:0.3 }}>Salary received</div>
                <div style={{ fontSize:10, color:"#444", marginTop:2 }}>G {salary.toLocaleString()} · {today}</div>
              </div>
              <div onClick={()=>{ setSalaryInput(String(salary)); setSalaryEditing(true); }}
                style={{ fontSize:10, color:"#444", cursor:"pointer", padding:"3px 8px", border:"1px solid #1a1a1a", flexShrink:0 }}>edit</div>
              <span style={{ fontSize:16, color:"#34a853" }}>✓</span>
            </div>
          ) : (
            <div style={{ padding:"14px 16px", background:"#0a0c12", border:"1px solid #4285f433", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"#4285f418", border:"1px solid #4285f433", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {INCOME_SOURCE_ICONS.salary("#4285f4")}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, color:"#aaa", fontWeight:600 }}>Monthly salary</div>
                <div style={{ fontSize:10, color:"#444", marginTop:2 }}>G {salary.toLocaleString()} · not yet received</div>
              </div>
              <div onClick={()=>{ setSalaryInput(String(salary)); setSalaryEditing(true); }}
                style={{ fontSize:10, color:"#444", cursor:"pointer", padding:"3px 8px", border:"1px solid #1a1a1a", flexShrink:0 }}>edit</div>
              <div onClick={handleReceiveSalary}
                style={{ fontSize:11, fontWeight:700, color:"#4285f4", background:"#4285f418", border:"1px solid #4285f433", padding:"6px 12px", flexShrink:0, whiteSpace:"nowrap", cursor:"pointer" }}>
                Confirm
              </div>
            </div>
          )}
        </div>

        {/* Header card */}
        <div style={{ margin:"10px 16px 0", padding:"18px", background:"#080c10", border:"1px solid #4285f433", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"#4285f408" }}/>
          <div style={{ fontSize:10, color:"#4285f4", letterSpacing:1.2, textTransform:"uppercase", marginBottom:2 }}>Total income this month</div>
          <div style={{ fontSize:38, fontWeight:900, letterSpacing:-1.5, color:"#fff", lineHeight:1 }}>G {total.toLocaleString()}</div>
          <div style={{ marginTop:10, display:"flex", gap:16 }}>
            <div>
              <div style={{ fontSize:9, color:"#333", marginBottom:1 }}>Salary</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#4285f4" }}>G {salary.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize:9, color:"#333", marginBottom:1 }}>Other sources</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#69f0ae" }}>+G {nonSalaryTotal.toLocaleString()}</div>
            </div>
          </div>
          {/* Stacked bar */}
          <div style={{ marginTop:12, height:5, background:"#111", borderRadius:3, overflow:"hidden", display:"flex" }}>
            {incomeStore.map((e,i) => {
              const src = INCOME_SOURCES.find(s=>s.id===e.sourceId)||INCOME_SOURCES[5];
              return <div key={e.id} style={{ width:`${(e.amount/total)*100}%`, height:"100%", background:src.color, borderRight:i<incomeStore.length-1?"1px solid #000":"none", transition:"width 0.3s" }}/>;
            })}
          </div>
        </div>

        {/* Income list grouped by day */}
        <div style={{ margin:"12px 16px 0", display:"flex", flexDirection:"column", gap:16 }}>
          {(() => {
            const entries = incomeStore.filter(e => e.month === selectedMoneyMonth)
              .sort((a,b) => new Date(b.isoDate) - new Date(a.isoDate));
            if (entries.length === 0) return (
              <div style={{ textAlign:"center", padding:"24px 0", color:"#222", fontSize:12 }}>No income logged for {MONTH_NAMES[selectedMoneyMonth]}</div>
            );
            const groups = {};
            entries.forEach(e => {
              if (!groups[e.isoDate]) groups[e.isoDate] = [];
              groups[e.isoDate].push(e);
            });
            return Object.entries(groups).map(([isoDate, dayEntries]) => (
              <div key={isoDate}>
                <div style={{ fontSize:10, color:"#444", letterSpacing:0.8, textTransform:"uppercase", marginBottom:6 }}>
                  {new Date(isoDate+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {dayEntries.map(entry => {
                    const src = INCOME_SOURCES.find(s=>s.id===entry.sourceId)||INCOME_SOURCES[5];
                    const isEditing = editingId === entry.id;
                    return (
                      <div key={entry.id} style={{ background:"#080808", borderLeft:`3px solid ${src.color}`, overflow:"hidden" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 12px" }}>
                          <div style={{ width:30, height:30, borderRadius:"50%", background:`${src.color}18`, border:`1px solid ${src.color}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            {INCOME_SOURCE_ICONS[entry.sourceId]?.(src.color) || INCOME_SOURCE_ICONS.other(src.color)}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12, fontWeight:600, color:"#ccc", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{entry.label}</div>
                            <div style={{ fontSize:10, color:"#444", marginTop:1 }}>{src.label} · {entry.time || entry.date}</div>
                          </div>
                          <div style={{ fontSize:13, fontWeight:800, color:"#69f0ae", flexShrink:0 }}>+G {entry.amount.toLocaleString()}</div>
                          <div onClick={() => isEditing ? setEditingId(null) : handleEditOpen(entry)}
                            style={{ fontSize:10, color: isEditing?"#444":"#4285f4", cursor:"pointer", padding:"3px 8px", border:`1px solid ${isEditing?"#1a1a1a":"#4285f422"}`, flexShrink:0, marginLeft:4 }}>
                            {isEditing ? "✕" : "edit"}
                          </div>
                          <div onClick={() => handleDelete(entry.id)}
                            style={{ fontSize:14, color:"#2a2a2a", cursor:"pointer", lineHeight:1, flexShrink:0 }}>×</div>
                        </div>
                        {isEditing && (
                          <div style={{ padding:"12px 14px", display:"flex", flexDirection:"column", gap:12, borderTop:"1px solid #0f0f0f", background:"#050505" }}>
                            <div style={{ display:"flex", gap:10 }}>
                              <div style={{ flex:1 }}>
                                <div style={{ fontSize:9, color:"#444", letterSpacing:0.8, textTransform:"uppercase", marginBottom:5 }}>Amount</div>
                                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                                  <span style={{ fontSize:12, color:"#69f0ae" }}>G</span>
                                  <input autoFocus type="number" value={editAmount} onChange={e=>setEditAmount(e.target.value)}
                                    style={{ flex:1, background:"transparent", border:"none", borderBottom:"1px solid #2a2a2a", outline:"none", color:"#fff", fontSize:16, fontWeight:800, fontFamily:"inherit", padding:"2px 0" }}/>
                                </div>
                              </div>
                              <div style={{ flex:1 }}>
                                <div style={{ fontSize:9, color:"#444", letterSpacing:0.8, textTransform:"uppercase", marginBottom:5 }}>Date</div>
                                <input type="date" value={editDate} onChange={e=>setEditDate(e.target.value)}
                                  style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #2a2a2a", outline:"none", color:"#bbb", fontSize:12, fontFamily:"inherit", padding:"2px 0", colorScheme:"dark" }}/>
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize:9, color:"#444", letterSpacing:0.8, textTransform:"uppercase", marginBottom:5 }}>Label</div>
                              <input value={editLabel} onChange={e=>setEditLabel(e.target.value)}
                                style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #2a2a2a", outline:"none", color:"#bbb", fontSize:13, fontFamily:"inherit", padding:"2px 0" }}/>
                            </div>
                            <div onClick={() => handleEditSave(entry.id)}
                              style={{ padding:"9px", background:(parseFloat(editAmount)>0&&editLabel.trim())?"#4285f4":"#111", color:(parseFloat(editAmount)>0&&editLabel.trim())?"#fff":"#333", textAlign:"center", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                              Save
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </div>

        {/* Add form */}
        {adding ? (
          <div style={{ margin:"10px 16px 0", padding:"16px", background:"#090909", border:"1px solid #4285f422" }}>
            <div style={{ fontSize:10, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>Log income</div>

            {/* Amount */}
            <div style={{ textAlign:"center", marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                <span style={{ fontSize:24, color:"#69f0ae", fontWeight:300 }}>G</span>
                <input autoFocus type="number" value={iAmount} onChange={e=>setIAmount(e.target.value)}
                  placeholder="0"
                  style={{ fontSize:36, fontWeight:800, color:"#fff", background:"transparent", border:"none", outline:"none", width:140, textAlign:"center", fontFamily:"inherit" }}/>
              </div>
              <div style={{ width:"50%", height:1, background:"#1e1e1e", margin:"8px auto 0" }}/>
            </div>

            {/* Label */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:9, color:"#333", letterSpacing:0.8, textTransform:"uppercase", marginBottom:6 }}>Description</div>
              <input value={iLabel} onChange={e=>setILabel(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()}
                placeholder="e.g. Mom sent money, Client paid"
                style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #1e1e1e", outline:"none", color:"#bbb", fontSize:13, padding:"5px 0", fontFamily:"inherit" }}/>
            </div>

            {/* Source picker */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:9, color:"#333", letterSpacing:0.8, textTransform:"uppercase", marginBottom:8 }}>Source</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                {INCOME_SOURCES.filter(s=>s.id!=="salary").map(s => (
                  <div key={s.id} onClick={()=>setISource(s.id)}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", background:iSource===s.id?s.color+"18":"#0a0a0a", border:`1px solid ${iSource===s.id?s.color+"55":"#1a1a1a"}`, cursor:"pointer", transition:"all 0.1s" }}>
                    <span style={{ display:"flex", alignItems:"center" }}>{(INCOME_SOURCE_ICONS[s.id]||(INCOME_SOURCE_ICONS.other))(iSource===s.id?s.color:"#555")}</span>
                    <span style={{ fontSize:12, color:iSource===s.id?s.color:"#666" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recurring toggle */}
            <div onClick={()=>setIRecurring(r=>!r)} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, cursor:"pointer" }}>
              <div style={{ width:36, height:20, borderRadius:10, background:iRecurring?"#4285f4":"#1a1a1a", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
                <div style={{ position:"absolute", top:3, left:iRecurring?18:3, width:14, height:14, borderRadius:"50%", background:"#fff", transition:"left 0.2s" }}/>
              </div>
              <span style={{ fontSize:12, color:iRecurring?"#4285f4":"#444" }}>Repeats every month</span>
            </div>

            <div style={{ display:"flex", gap:8 }}>
              <div onClick={handleAdd} style={{ flex:1, padding:"11px", background:(iAmount&&iLabel.trim())?"#4285f4":"#111", color:(iAmount&&iLabel.trim())?"#fff":"#333", textAlign:"center", fontSize:13, fontWeight:700, cursor:(iAmount&&iLabel.trim())?"pointer":"default", transition:"all 0.15s" }}>
                Add income
              </div>
              <div onClick={()=>setAdding(false)} style={{ padding:"11px 16px", border:"1px solid #1e1e1e", color:"#444", fontSize:12, cursor:"pointer" }}>Cancel</div>
            </div>
          </div>
        ) : (
          <div onClick={()=>setAdding(true)} style={{ margin:"10px 16px 0", padding:"12px", border:"1px dashed #1a1a1a", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:"#4285f466", fontSize:18, lineHeight:1 }}>+</span>
            <span style={{ fontSize:11, color:"#333" }}>Log another income</span>
          </div>
        )}
      </div>
    );
  };

  // ── EXPENSES ──
  const Expenses = () => {
    const [billsOpen, setBillsOpen] = useState(false);
    const [addingBill, setAddingBill] = useState(false);
    const [editingBillId, setEditingBillId] = useState(null);
    const [rLabel, setRLabel] = useState("");
    const [rAmount, setRAmount] = useState("");
    const [rCat, setRCat] = useState("other");
    const [rDay, setRDay] = useState("1");
    const [, lr] = useState(0);
    const localRefresh = () => { lr(n=>n+1); refresh(); };

    const year = new Date().getFullYear();

    const getOrdinal = (n) => {
      const s = ["th","st","nd","rd"], v = n % 100;
      return n + (s[(v-20)%10] || s[v] || s[0]);
    };

    const getRecurringLabel = (day) => {
      const d = new Date(year, selectedMoneyMonth, day);
      const weekday = d.toLocaleDateString("en-US", { weekday:"long" });
      const occurrence = Math.ceil(day / 7);
      return `every ${getOrdinal(occurrence)} ${weekday}`;
    };

    const allEntries = recurringStore.map(r => {
      const cat = SPEND_CATEGORIES.find(c=>c.id===r.category) || SPEND_CATEGORIES[SPEND_CATEGORIES.length-1];
      return { id:r.id, label:r.label, amount:r.amount, color:cat.color, icon:cat.icon(cat.color, 15), recurringLabel: getRecurringLabel(r.day), day: r.day, category: r.category };
    });

    const sorted = [...allEntries].sort((a,b) => a.day - b.day);
    const groups = {};
    sorted.forEach(e => {
      const key = String(e.day);
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });

    const formatDayLabel = (day) => {
      const d = new Date(year, selectedMoneyMonth, parseInt(day));
      return d.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });
    };

    const openEdit = (r) => {
      setEditingBillId(r.id);
      setRLabel(r.label);
      setRAmount(String(r.amount));
      setRCat(r.category);
      setRDay(String(r.day));
      setAddingBill(false);
    };

    const handleSaveEdit = () => {
      const idx = recurringStore.findIndex(r => r.id === editingBillId);
      if (idx > -1) {
        recurringStore[idx].label    = rLabel.trim() || recurringStore[idx].label;
        recurringStore[idx].amount   = parseFloat(rAmount) || recurringStore[idx].amount;
        recurringStore[idx].category = rCat;
        recurringStore[idx].day      = parseInt(rDay) || recurringStore[idx].day;
      }
      setEditingBillId(null);
      localRefresh();
    };

    const handleDelete = (id) => {
      const idx = recurringStore.findIndex(r => r.id === id);
      if (idx > -1) recurringStore.splice(idx, 1);
      if (editingBillId === id) setEditingBillId(null);
      localRefresh();
    };

    const handleAddBill = () => {
      const amt = parseFloat(rAmount);
      if (!amt || !rLabel.trim()) return;
      recurringStore.push({ id:"r"+Date.now(), label:rLabel.trim(), category:rCat, amount:amt, day:parseInt(rDay)||1 });
      setRLabel(""); setRAmount(""); setRCat("other"); setRDay("1");
      setAddingBill(false);
      localRefresh();
    };

    const resetForm = () => { setRLabel(""); setRAmount(""); setRCat("other"); setRDay("1"); };

    const renderCard = (entry) => (
      <div key={entry.id} style={{ background:"#080808", borderLeft:`3px solid ${entry.color}`, display:"flex", alignItems:"center", gap:10, padding:"11px 12px" }}>
        <div style={{ width:30, height:30, borderRadius:"50%", background:`${entry.color}18`, border:`1px solid ${entry.color}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {entry.icon}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:600, color:"#ccc", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{entry.label}</div>
          <div style={{ fontSize:10, color:"#444", marginTop:1 }}>{entry.recurringLabel}</div>
        </div>
        <div style={{ fontSize:13, fontWeight:800, color:"#ef5350", flexShrink:0 }}>-G {entry.amount.toLocaleString()}</div>
      </div>
    );

    const BillForm = ({ isEdit }) => {
      const cat = SPEND_CATEGORIES.find(c=>c.id===rCat) || SPEND_CATEGORIES[SPEND_CATEGORIES.length-1];
      return (
        <div style={{ padding:"20px 20px 28px", background:"#0d0d0d", borderTop:"1px solid #1a1a1a" }}>
          <div style={{ fontSize:10, color:"#ce93d8", letterSpacing:1, textTransform:"uppercase", marginBottom:16 }}>
            {isEdit ? "Edit bill" : "New recurring bill"}
          </div>

          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            <div style={{ flex:3 }}>
              <div style={{ fontSize:9, color:"#444", marginBottom:5 }}>Name</div>
              <input autoFocus value={rLabel} onChange={e=>setRLabel(e.target.value)}
                placeholder="e.g. Netflix"
                style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:`1px solid ${cat.color}44`, outline:"none", color:"#ccc", fontSize:14, fontWeight:600, padding:"4px 0", fontFamily:"inherit" }}/>
            </div>
            <div style={{ flex:2 }}>
              <div style={{ fontSize:9, color:"#444", marginBottom:5 }}>Amount (G)</div>
              <input type="number" value={rAmount} onChange={e=>setRAmount(e.target.value)}
                placeholder="0"
                style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:`1px solid ${cat.color}44`, outline:"none", color:cat.color, fontSize:14, fontWeight:800, padding:"4px 0", fontFamily:"inherit" }}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9, color:"#444", marginBottom:5 }}>Day</div>
              <input type="number" min="1" max="31" value={rDay} onChange={e=>setRDay(e.target.value)}
                style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:`1px solid ${cat.color}44`, outline:"none", color:"#888", fontSize:14, fontWeight:700, padding:"4px 0", fontFamily:"inherit" }}/>
            </div>
          </div>

          <div style={{ fontSize:9, color:"#444", marginBottom:8 }}>Category</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:5, marginBottom:18 }}>
            {SPEND_CATEGORIES.map(c => (
              <div key={c.id} onClick={()=>setRCat(c.id)}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"9px 4px", background:rCat===c.id?c.color+"1a":"#0a0a0a", border:`1px solid ${rCat===c.id?c.color+"66":"#1a1a1a"}`, cursor:"pointer", borderRadius:4, transition:"all 0.1s" }}>
                <span style={{ display:"flex" }}>{c.icon(rCat===c.id?c.color:"#555", 15)}</span>
                <span style={{ fontSize:9, color:rCat===c.id?c.color:"#444", textAlign:"center", lineHeight:1.2 }}>{c.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:8 }}>
            <div onClick={isEdit ? handleSaveEdit : handleAddBill}
              style={{ flex:1, padding:"11px", background:(rLabel.trim()&&rAmount)?cat.color:"#1a1a1a", color:(rLabel.trim()&&rAmount)?"#000":"#333", textAlign:"center", fontSize:13, fontWeight:700, cursor:(rLabel.trim()&&rAmount)?"pointer":"default", borderRadius:2, transition:"all 0.15s" }}>
              {isEdit ? "Save changes" : "Add bill"}
            </div>
            {isEdit && (
              <div onClick={()=>handleDelete(editingBillId)}
                style={{ padding:"11px 16px", background:"#1a0808", border:"1px solid #ef535033", color:"#ef5350", fontSize:12, fontWeight:600, cursor:"pointer", borderRadius:2 }}>
                Delete
              </div>
            )}
            <div onClick={()=>{ setEditingBillId(null); setAddingBill(false); resetForm(); }}
              style={{ padding:"11px 14px", border:"1px solid #1e1e1e", color:"#444", fontSize:12, cursor:"pointer", borderRadius:2 }}>
              Cancel
            </div>
          </div>
        </div>
      );
    };

    return (
      <div style={{ flex:1, overflowY:"auto", padding:"0 0 80px" }}>
        {/* Header card */}
        <div style={{ margin:"14px 16px 0", padding:"18px", background:"#100a0a", border:"1px solid #ef535033", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"#ef535008" }}/>
          <div style={{ fontSize:10, color:"#ef5350", letterSpacing:1.2, textTransform:"uppercase", marginBottom:6 }}>Total out — {MONTH_NAMES[selectedMoneyMonth]}</div>
          <div style={{ fontSize:38, fontWeight:900, letterSpacing:-1.5, color:"#fff", lineHeight:1 }}>G {getRecurringTotal().toLocaleString()}</div>

          <div style={{ marginTop:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:9, color:"#333", marginBottom:1 }}>Recurring bills</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#ce93d8" }}>{recurringStore.length} bills · G {getRecurringTotal().toLocaleString()}</div>
            </div>
            <div onClick={()=>{ setBillsOpen(v=>!v); setEditingBillId(null); setAddingBill(false); resetForm(); }}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", background: billsOpen ? "#ce93d822" : "#111", border:`1px solid ${billsOpen?"#ce93d844":"#222"}`, cursor:"pointer", transition:"all 0.15s", flexShrink:0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={billsOpen?"#ce93d8":"#666"} strokeWidth="2" strokeLinecap="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              <span style={{ fontSize:11, fontWeight:600, color: billsOpen?"#ce93d8":"#666" }}>Manage bills</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={billsOpen?"#ce93d8":"#555"} strokeWidth="2.5" strokeLinecap="round">
                <polyline points={billsOpen?"18 15 12 9 6 15":"6 9 12 15 18 9"}/>
              </svg>
            </div>
          </div>
        </div>

        {/* Bills manager panel */}
        {billsOpen && (
          <div style={{ margin:"10px 16px 0", background:"#0a0808", border:"1px solid #ce93d822", overflow:"hidden" }}>
            <div style={{ display:"flex", flexDirection:"column" }}>
              {[...recurringStore].sort((a,b)=>a.day-b.day).map(r => {
                const cat = SPEND_CATEGORIES.find(c=>c.id===r.category) || SPEND_CATEGORIES[SPEND_CATEGORIES.length-1];
                const isEditing = editingBillId === r.id;
                return (
                  <div key={r.id}>
                    <div onClick={()=> isEditing ? (setEditingBillId(null), resetForm()) : openEdit(r)}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 14px", borderBottom:"1px solid #111", cursor:"pointer", background: isEditing ? cat.color+"0d" : "transparent", transition:"background 0.15s" }}>
                      <div style={{ width:32, height:32, borderRadius:6, background:cat.color+"18", border:`1px solid ${cat.color}${isEditing?"55":"22"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {cat.icon(cat.color, 15)}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color: isEditing ? "#fff" : "#bbb", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.label}</div>
                        <div style={{ fontSize:10, color:"#444", marginTop:1 }}>{cat.label} · {getRecurringLabel(r.day)}</div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <div style={{ fontSize:14, fontWeight:800, color:"#ef5350" }}>-G {r.amount.toLocaleString()}</div>
                        <div style={{ fontSize:9, color:"#333", marginTop:1 }}>/ month</div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isEditing?"#ce93d8":"#333"} strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0, marginLeft:4 }}>
                        {isEditing
                          ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                          : <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>}
                      </svg>
                    </div>
                    {isEditing && <BillForm isEdit={true}/>}
                  </div>
                );
              })}
            </div>

            {addingBill ? (
              <BillForm isEdit={false}/>
            ) : (
              <div onClick={()=>{ setAddingBill(true); setEditingBillId(null); resetForm(); }}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"13px 14px", cursor:"pointer", borderTop: recurringStore.length ? "1px solid #111" : "none" }}>
                <div style={{ width:32, height:32, borderRadius:6, background:"#ce93d811", border:"1px dashed #ce93d833", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ce93d855" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                <span style={{ fontSize:12, color:"#444" }}>Add a recurring bill</span>
              </div>
            )}
          </div>
        )}

        {/* Date-grouped expense list */}
        <div style={{ margin:"12px 16px 0", display:"flex", flexDirection:"column", gap:16 }}>
          {allEntries.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 0", color:"#222", fontSize:12 }}>No expenses for {MONTH_NAMES[selectedMoneyMonth]}</div>
          ) : (
            Object.entries(groups).map(([day, dayEntries]) => (
              <div key={day}>
                <div style={{ fontSize:10, color:"#444", letterSpacing:0.8, textTransform:"uppercase", marginBottom:6 }}>
                  {formatDayLabel(day)}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {dayEntries.map(renderCard)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // ── GOALS ──
  const Goals = () => {
    const [goals, setGoals]         = useState([...goalsStore]);
    const [adding, setAdding]       = useState(false);
    const [depositing, setDepositing] = useState(null);
    const [depositAmt, setDepositAmt] = useState("");
    const [newLabel,   setNewLabel]   = useState("");
    const [newTarget,  setNewTarget]  = useState("");
    const [newIcon,    setNewIcon]    = useState((c,s)=>IC.target(c,s));
    const [newColor,   setNewColor]   = useState("#69f0ae");
    const [newNote,    setNewNote]    = useState("");
    const [, lr] = useState(0);
    const localRefresh = () => lr(n=>n+1);

    const USD_RATE = 130;

    const handleDeposit = (g) => {
      const amt = parseFloat(depositAmt);
      if (!amt || amt <= 0) return;
      const idx = goalsStore.findIndex(x => x.id === g.id);
      if (idx > -1) goalsStore[idx].savedHTG = Math.min(goalsStore[idx].targetHTG, goalsStore[idx].savedHTG + amt);
      setGoals([...goalsStore]);
      setDepositing(null); setDepositAmt("");
      refresh();
    };

    const handleWithdraw = (g) => {
      const amt = parseFloat(depositAmt);
      if (!amt || amt <= 0) return;
      const idx = goalsStore.findIndex(x => x.id === g.id);
      if (idx > -1) goalsStore[idx].savedHTG = Math.max(0, goalsStore[idx].savedHTG - amt);
      setGoals([...goalsStore]);
      setDepositing(null); setDepositAmt("");
    };

    const handleAddGoal = () => {
      const targetHTG = parseFloat(newTarget);
      if (!targetHTG || !newLabel.trim()) return;
      const g = { id:"g"+(goalIdCounter++), label:newLabel.trim(), icon:newIcon, color:newColor, targetHTG, savedHTG:0, note:newNote.trim(), usdRate:USD_RATE };
      goalsStore.push(g);
      setGoals([...goalsStore]);
      setNewLabel(""); setNewTarget(""); setNewNote(""); setNewIcon((c,s)=>IC.target(c,s)); setNewColor("#69f0ae");
      setAdding(false);
    };

    const handleDelete = (id) => {
      const idx = goalsStore.findIndex(g => g.id === id);
      if (idx > -1) goalsStore.splice(idx, 1);
      setGoals([...goalsStore]);
    };

    const totalSavedHTG = goals.reduce((s,g) => s+g.savedHTG, 0);

    return (
      <div style={{ flex:1, overflowY:"auto", padding:"0 0 80px" }}>
        <div style={{ margin:"14px 16px 0", padding:"18px", background:"#080e08", border:"1px solid #69f0ae22", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"#69f0ae06" }}/>
          <div style={{ fontSize:10, color:"#69f0ae", letterSpacing:1.2, textTransform:"uppercase", marginBottom:2 }}>Saving goals</div>
          <div style={{ fontSize:34, fontWeight:900, letterSpacing:-1, color:"#fff", lineHeight:1 }}>G {totalSavedHTG.toLocaleString()}</div>
          <div style={{ fontSize:11, color:"#444", marginTop:4 }}>across {goals.length} goal{goals.length!==1?"s":""}</div>
        </div>

        <div style={{ margin:"12px 16px 0", display:"flex", flexDirection:"column", gap:10 }}>
          {goals.map(g => {
            const { pct, remaining } = getGoalProgress(g);
            const isDepositing = depositing === g.id;
            const monthsNeeded = g.savedHTG < g.targetHTG
              ? Math.ceil(remaining / 3000)
              : 0;
            const done = pct >= 100;

            return (
              <div key={g.id} style={{ background:"#080808", border:`1px solid ${done?"#69f0ae33":"#111"}`, overflow:"hidden" }}>
                <div style={{ padding:"14px 14px 12px", borderLeft:`4px solid ${g.color}` }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:40, height:40, borderRadius:8, background:g.color+"18", border:`1px solid ${g.color}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{g.icon(g.color, 20)}</div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{g.label}</div>
                        {g.note && <div style={{ fontSize:10, color:"#444", marginTop:2 }}>{g.note}</div>}
                      </div>
                    </div>
                    <div onClick={() => handleDelete(g.id)} style={{ fontSize:14, color:"#222", cursor:"pointer", padding:"2px 4px" }}>×</div>
                  </div>

                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
                    <div>
                      <span style={{ fontSize:22, fontWeight:900, color:g.color }}>G {g.savedHTG.toLocaleString()}</span>
                      <span style={{ fontSize:11, color:"#333" }}> / G {g.targetHTG.toLocaleString()}</span>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:18, fontWeight:800, color: done?"#69f0ae":"#fff" }}>{pct}%</div>
                      {g.usdRate && <div style={{ fontSize:9, color:"#333" }}>≈ ${Math.round(g.targetHTG/g.usdRate).toLocaleString()} USD</div>}
                    </div>
                  </div>

                  <div style={{ height:8, background:"#111", borderRadius:4, overflow:"hidden", marginBottom:8 }}>
                    <div style={{ width:`${pct}%`, height:"100%", background: done ? "#69f0ae" : `linear-gradient(90deg, ${g.color}88, ${g.color})`, borderRadius:4, transition:"width 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}/>
                  </div>

                  {!done && (
                    <div style={{ display:"flex", gap:12, marginBottom:8 }}>
                      <div>
                        <div style={{ fontSize:9, color:"#333" }}>Still needed</div>
                        <div style={{ fontSize:12, fontWeight:700, color:"#ef5350" }}>G {remaining.toLocaleString()}</div>
                      </div>
                      <div style={{ width:1, background:"#111" }}/>
                      <div>
                        <div style={{ fontSize:9, color:"#333" }}>Est. months</div>
                        <div style={{ fontSize:12, fontWeight:700, color:"#ffb74d" }}>{monthsNeeded} mo</div>
                      </div>
                      {g.usdRate && (
                        <>
                          <div style={{ width:1, background:"#111" }}/>
                          <div>
                            <div style={{ fontSize:9, color:"#333" }}>Saved in USD</div>
                            <div style={{ fontSize:12, fontWeight:700, color:"#4fc3f7" }}>${Math.round(g.savedHTG/g.usdRate).toLocaleString()}</div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {done && (
                    <div style={{ padding:"8px 12px", background:"#69f0ae18", border:"1px solid #69f0ae33", fontSize:12, color:"#69f0ae", textAlign:"center", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <span style={{display:"flex"}}>{IC.celebrate("#69f0ae",13)}</span> Goal reached! Time to make the purchase.
                    </div>
                  )}

                  {!done && (
                    isDepositing ? (
                      <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:4 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:13, color:"#69f0ae" }}>G</span>
                          <input autoFocus type="number" value={depositAmt} onChange={e=>setDepositAmt(e.target.value)}
                            onKeyDown={e=>e.key==="Enter"&&handleDeposit(g)}
                            placeholder="Amount to add"
                            style={{ flex:1, background:"transparent", border:"none", borderBottom:`1px solid ${g.color}55`, outline:"none", color:"#fff", fontSize:16, fontWeight:700, padding:"4px 0", fontFamily:"inherit" }}/>
                        </div>
                        <div style={{ display:"flex", gap:6 }}>
                          <div onClick={()=>handleDeposit(g)} style={{ flex:1, padding:"9px", background:depositAmt?g.color:"#111", color:depositAmt?"#000":"#333", textAlign:"center", fontSize:12, fontWeight:700, cursor:depositAmt?"pointer":"default", transition:"all 0.15s" }}>+ Add</div>
                          <div onClick={()=>handleWithdraw(g)} style={{ flex:1, padding:"9px", background:"transparent", border:"1px solid #ef535033", color:"#ef5350", textAlign:"center", fontSize:12, cursor:"pointer" }}>− Remove</div>
                          <div onClick={()=>{setDepositing(null);setDepositAmt("");}} style={{ padding:"9px 12px", border:"1px solid #1e1e1e", color:"#444", fontSize:12, cursor:"pointer" }}>✕</div>
                        </div>
                      </div>
                    ) : (
                      <div onClick={()=>{setDepositing(g.id);setDepositAmt("");}}
                        style={{ padding:"8px", background:g.color+"11", border:`1px solid ${g.color}33`, textAlign:"center", fontSize:12, color:g.color, cursor:"pointer", fontWeight:600 }}>
                        + Add money
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {adding ? (
          <div style={{ margin:"10px 16px 0", padding:"16px", background:"#090909", border:"1px solid #1e1e1e" }}>
            <div style={{ fontSize:10, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>New goal</div>

            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:9, color:"#333", marginBottom:6 }}>Icon</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {GOAL_ICONS.map(ic => (
                  <div key={ic.key} onClick={()=>setNewIcon(()=>ic.fn)}
                    style={{ width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", background:newIcon===ic.fn?"#1e1e1e":"transparent", border:`1px solid ${newIcon===ic.fn?"#444":"#111"}`, cursor:"pointer", borderRadius:4 }}>{ic.fn(newColor, 16)}</div>
                ))}
              </div>
            </div>

            <div style={{ display:"flex", gap:10, marginBottom:12 }}>
              <div style={{ flex:2 }}>
                <div style={{ fontSize:9, color:"#333", marginBottom:4 }}>Goal name</div>
                <input autoFocus value={newLabel} onChange={e=>setNewLabel(e.target.value)} placeholder="e.g. New laptop"
                  style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #1e1e1e", outline:"none", color:"#bbb", fontSize:13, padding:"4px 0", fontFamily:"inherit" }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9, color:"#333", marginBottom:4 }}>Target (G)</div>
                <input type="number" value={newTarget} onChange={e=>setNewTarget(e.target.value)} placeholder="650000"
                  style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #1e1e1e", outline:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"4px 0", fontFamily:"inherit" }}/>
              </div>
            </div>

            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:9, color:"#333", marginBottom:4 }}>Note (optional)</div>
              <input value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="e.g. Saving G 3,000/month"
                style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #1e1e1e", outline:"none", color:"#555", fontSize:12, padding:"4px 0", fontFamily:"inherit" }}/>
            </div>

            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:9, color:"#333", marginBottom:6 }}>Color</div>
              <div style={{ display:"flex", gap:8 }}>
                {GOAL_COLORS.map(c => (
                  <div key={c} onClick={()=>setNewColor(c)} style={{ width:26, height:26, borderRadius:"50%", background:c, cursor:"pointer", border:`3px solid ${newColor===c?"#fff":"transparent"}`, boxSizing:"border-box" }}/>
                ))}
              </div>
            </div>

            <div style={{ display:"flex", gap:8 }}>
              <div onClick={handleAddGoal} style={{ flex:1, padding:"10px", background:(newLabel.trim()&&newTarget)?newColor:"#111", color:(newLabel.trim()&&newTarget)?"#000":"#333", textAlign:"center", fontSize:12, fontWeight:700, cursor:(newLabel.trim()&&newTarget)?"pointer":"default", transition:"all 0.15s" }}>Add goal</div>
              <div onClick={()=>setAdding(false)} style={{ padding:"10px 16px", border:"1px solid #1e1e1e", color:"#444", fontSize:12, cursor:"pointer" }}>Cancel</div>
            </div>
          </div>
        ) : (
          <div onClick={()=>setAdding(true)} style={{ margin:"10px 16px 0", padding:"12px", border:"1px dashed #1a1a1a", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:"#69f0ae55", fontSize:18, lineHeight:1 }}>+</span>
            <span style={{ fontSize:11, color:"#333" }}>Add a new goal</span>
          </div>
        )}
      </div>
    );
  };

  // ── RECURRING (Bills) ──
  const Recurring = () => {
    const [addingRecurring, setAddingRecurring] = useState(false);
    const [rLabel,    setRLabel]    = useState("");
    const [rAmount,   setRAmount]   = useState("");
    const [rCat,      setRCat]      = useState("other");
    const [rDay,      setRDay]      = useState("1");
    const [, localRefresh] = useState(0);

    const recurringTotal = getRecurringTotal();
    const sorted = [...recurringStore].sort((a,b) => a.day - b.day);

    const handleAddRecurring = () => {
      const amt = parseFloat(rAmount);
      if (!amt || !rLabel.trim()) return;
      recurringStore.push({ id:"r"+Date.now(), label:rLabel.trim(), category:rCat, amount:amt, day:parseInt(rDay)||1 });
      setRLabel(""); setRAmount(""); setRCat("other"); setRDay("1");
      setAddingRecurring(false);
      localRefresh(n=>n+1);
      refresh();
    };

    const handleDelete = (id) => {
      const idx = recurringStore.findIndex(r => r.id === id);
      if (idx > -1) recurringStore.splice(idx, 1);
      localRefresh(n=>n+1);
      refresh();
    };

    return (
      <div style={{ flex:1, overflowY:"auto", padding:"0 16px 80px" }}>
        <div style={{ margin:"14px 0 12px", padding:"14px 16px", background:"#0a080f", border:"1px solid #ce93d833", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, color:"#ce93d8", letterSpacing:1, textTransform:"uppercase", marginBottom:2 }}>Monthly recurring</div>
            <div style={{ fontSize:28, fontWeight:800, color:"#fff" }}>G {recurringTotal.toLocaleString()}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:"#444", marginBottom:2 }}>{recurringStore.length} expenses</div>
            <div style={{ fontSize:11, color:"#555" }}>G {(salary - recurringTotal).toLocaleString()} left after</div> {/* use salary */}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {sorted.map(r => {
            const cat = SPEND_CATEGORIES.find(c => c.id === r.category) || SPEND_CATEGORIES[SPEND_CATEGORIES.length-1];
            return (
              <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 12px", background:"#080808", borderLeft:`3px solid ${cat.color}` }}>
                <span style={{ fontSize:16, flexShrink:0, display:"flex", alignItems:"center" }}>{cat.icon(cat.color, 16)}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, color:"#ccc", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.label}</div>
                  <div style={{ fontSize:10, color:"#444" }}>{cat.label} · every {r.day === 1 ? "1st" : r.day === 2 ? "2nd" : r.day === 3 ? "3rd" : `${r.day}th`}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#ef5350" }}>-G {r.amount.toLocaleString()}</div>
                  <div onClick={() => handleDelete(r.id)} style={{ fontSize:16, color:"#2a2a2a", cursor:"pointer", lineHeight:1, padding:"0 2px" }}>×</div>
                </div>
              </div>
            );
          })}
        </div>

        {addingRecurring ? (
          <div style={{ marginTop:12, padding:"16px", background:"#090909", border:"1px solid #ce93d822" }}>
            <div style={{ fontSize:10, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>New recurring expense</div>

            <div style={{ display:"flex", gap:10, marginBottom:12 }}>
              <div style={{ flex:2 }}>
                <div style={{ fontSize:9, color:"#333", marginBottom:4 }}>Label</div>
                <input autoFocus value={rLabel} onChange={e=>setRLabel(e.target.value)} placeholder="e.g. Rent"
                  style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #1e1e1e", outline:"none", color:"#bbb", fontSize:13, padding:"4px 0", fontFamily:"inherit" }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9, color:"#333", marginBottom:4 }}>Amount $</div>
                <input type="number" value={rAmount} onChange={e=>setRAmount(e.target.value)} placeholder="0"
                  style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #1e1e1e", outline:"none", color:"#bbb", fontSize:13, padding:"4px 0", fontFamily:"inherit" }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9, color:"#333", marginBottom:4 }}>Day</div>
                <input type="number" min="1" max="31" value={rDay} onChange={e=>setRDay(e.target.value)} placeholder="1"
                  style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #1e1e1e", outline:"none", color:"#bbb", fontSize:13, padding:"4px 0", fontFamily:"inherit" }}/>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginBottom:14 }}>
              {SPEND_CATEGORIES.map(cat => (
                <div key={cat.id} onClick={() => setRCat(cat.id)} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 10px", background:rCat===cat.id?cat.color+"18":"#0a0a0a", border:`1px solid ${rCat===cat.id?cat.color+"55":"#1a1a1a"}`, cursor:"pointer", transition:"all 0.1s" }}>
                  <span style={{ fontSize:12, display:"flex", alignItems:"center" }}>{cat.icon(rCat===cat.id?cat.color:"#555", 13)}</span>
                  <span style={{ fontSize:11, color:rCat===cat.id?cat.color:"#555" }}>{cat.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:8 }}>
              <div onClick={handleAddRecurring} style={{ flex:1, padding:"10px", background:(rLabel.trim()&&rAmount)?"#ce93d8":"#111", color:(rLabel.trim()&&rAmount)?"#000":"#333", textAlign:"center", fontSize:12, fontWeight:700, cursor:(rLabel.trim()&&rAmount)?"pointer":"default", transition:"all 0.15s" }}>Add</div>
              <div onClick={()=>setAddingRecurring(false)} style={{ padding:"10px 16px", background:"transparent", border:"1px solid #1e1e1e", color:"#444", fontSize:12, cursor:"pointer" }}>Cancel</div>
            </div>
          </div>
        ) : (
          <div onClick={() => setAddingRecurring(true)} style={{ marginTop:10, padding:"12px", border:"1px dashed #1a1a1a", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:"#ce93d866", fontSize:18, lineHeight:1 }}>+</span>
            <span style={{ fontSize:11, color:"#333" }}>Add recurring expense</span>
          </div>
        )}
      </div>
    );
  };

  // ── HISTORY ──
  const History = () => {
    const recurringTotal = getRecurringTotal();
    const incomeByMonth = MONTH_NAMES.map((name, i) => {
      const entries = incomeStore.filter(e => e.month === i);
      const total = entries.reduce((s,e) => s+e.amount, 0);
      return { name, i, entries, total };
    }).filter(m => m.total > 0);

    return (
      <div style={{ flex:1, overflowY:"auto", padding:"0 16px 80px" }}>
        {incomeByMonth.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#222", fontSize:13 }}>No history logged yet</div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:12 }}>
            {incomeByMonth.map(({ name, i, entries, total }) => (
              <div key={i} style={{ background:"#080808", border:"1px solid #111" }}>
                <div style={{ padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #111" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#ccc" }}>{name}</span>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:14, fontWeight:800, color:"#69f0ae" }}>+G {total.toLocaleString()}</div>
                    <div style={{ fontSize:9, color:"#333", marginTop:1 }}>-G {recurringTotal.toLocaleString()} bills</div>
                  </div>
                </div>
                <div style={{ padding:"8px 0" }}>
                  {entries.map(e => {
                    const src = INCOME_SOURCES.find(s=>s.id===e.sourceId)||INCOME_SOURCES[5];
                    return (
                      <div key={e.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 14px" }}>
                        <div style={{ width:6, height:6, borderRadius:"50%", background:src.color, flexShrink:0 }}/>
                        <span style={{ fontSize:12, color:"#666", flex:1 }}>{e.label}</span>
                        <span style={{ fontSize:12, fontWeight:700, color:"#69f0ae" }}>G {e.amount.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#000", color:"#fff", overflow:"hidden", position:"relative" }}>
      <style>{`
        @keyframes moneySlideIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes moneyFadeIn  { from{opacity:0} to{opacity:1} }
      `}</style>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)}
          style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.65)", zIndex:50, animation:"moneyFadeIn 0.2s ease" }}
        />
      )}

      {/* Sidebar panel */}
      {sidebarOpen && (
        <div style={{
          position:"absolute", top:0, left:0, bottom:0, width:230,
          background:"#080808", borderRight:"1px solid #161616",
          zIndex:51, display:"flex", flexDirection:"column",
          animation:"moneySlideIn 0.22s cubic-bezier(0.32,0.72,0,1)",
        }}>
          <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid #111" }}>
            <div style={{ fontSize:11, color:"#333", letterSpacing:1.2, textTransform:"uppercase", marginBottom:10 }}>Money</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#fff", letterSpacing:-0.5 }}>G {totalIncomeSidebar.toLocaleString()}</div>
            <div style={{ fontSize:10, color:"#444", marginTop:2 }}>total income · {new Date().toLocaleDateString("en-US",{month:"long"})}</div>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"10px 0" }}>
            {MONEY_TABS.map(tab => {
              const active = view === tab.id;
              return (
                <div key={tab.id}
                  onClick={() => { setView(tab.id); setSidebarOpen(false); }}
                  style={{
                    display:"flex", alignItems:"center", gap:14,
                    padding:"13px 20px", cursor:"pointer", userSelect:"none",
                    background: active ? tab.color+"12" : "transparent",
                    borderLeft: `3px solid ${active ? tab.color : "transparent"}`,
                    transition:"all 0.12s",
                  }}
                >
                  <span style={{ color: active ? tab.color : "#333", display:"flex", alignItems:"center", flexShrink:0 }}>{tab.icon}</span>
                  <span style={{ fontSize:13, fontWeight: active ? 700 : 400, color: active ? tab.color : "#555", letterSpacing:0.2 }}>{tab.label}</span>
                  {active && <div style={{ marginLeft:"auto", width:5, height:5, borderRadius:"50%", background:tab.color }}/>}
                </div>
              );
            })}
          </div>

          <div style={{ padding:"14px 20px", borderTop:"1px solid #111" }}>
            <div style={{ fontSize:9, color:"#333", letterSpacing:0.8, textTransform:"uppercase", marginBottom:4 }}>Monthly salary</div>
            <div style={{ fontSize:16, fontWeight:800, color:"#4285f4" }}>G {salary.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ flexShrink:0, padding:"12px 16px", borderBottom:"1px solid #0d0d0d", display:"flex", alignItems:"center", gap:12 }}>
        <div onClick={() => setSidebarOpen(s=>!s)}
          style={{ width:36, height:36, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, cursor:"pointer", flexShrink:0 }}>
          <div style={{ width:20, height:1.5, background:"#aaa", borderRadius:1 }}/>
          <div style={{ width:14, height:1.5, background:"#aaa", borderRadius:1 }}/>
          <div style={{ width:20, height:1.5, background:"#aaa", borderRadius:1 }}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:18, fontWeight:800, letterSpacing:-0.5, color:"#fff", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color: currentTab.color }}>{currentTab.icon}</span>
            {currentTab.label}
          </div>
          <div style={{ fontSize:10, color:"#444", marginTop:1 }}>{MONTH_NAMES[selectedMoneyMonth]} {new Date().getFullYear()}</div>
        </div>
        <div style={{ fontSize:10, color:"#4285f4", background:"#4285f411", border:"1px solid #4285f422", padding:"4px 10px", flexShrink:0 }}>
          G {salary.toLocaleString()}
        </div>
      </div>

      {/* Month strip */}
      <div style={{ flexShrink:0, borderBottom:"1px solid #0d0d0d", overflowX:"auto", overflowY:"hidden", scrollbarWidth:"none", WebkitOverflowScrolling:"touch", display:"flex", padding:"0 8px" }}>
        {MONTH_NAMES.map((m, i) => {
          const active = i === selectedMoneyMonth;
          return (
            <div key={m} onClick={() => setSelectedMoneyMonth(i)}
              style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"8px 10px", cursor:"pointer", userSelect:"none" }}>
              <span style={{ fontSize:11, fontWeight: active ? 700 : 400, color: active ? "#fff" : "#444", letterSpacing:0.3, whiteSpace:"nowrap" }}>{m.slice(0,3)}</span>
              {active && <div style={{ width:14, height:2, borderRadius:1, background: currentTab.color }}/>}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {view === "overview"  && <Overview />}
        {view === "income"    && <Income />}
        {view === "expenses"  && <Expenses />}
        {view === "goals"     && <Goals />}
        {view === "payroll"   && <PayrollView salary={salary} refresh={refresh} />}
        {view === "recurring" && <Recurring />}
        {view === "history"   && <History />}
      </div>
    </div>
  );
}