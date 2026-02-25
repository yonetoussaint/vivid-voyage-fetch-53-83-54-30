import { useState } from 'react';
import { IC } from '@/components/easy/IconLibrary';
import { bucketStore } from '@/stores/moneyStores';

export function PayrollView({ salary, refresh }) {
  const [buckets, setBuckets] = useState(bucketStore);
  const [editing, setEditing]   = useState(null);
  const [editPct, setEditPct]   = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editDesc, setEditDesc]   = useState("");
  const [addingBucket, setAddingBucket] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDesc,  setNewDesc]  = useState("");
  const [newPct,   setNewPct]   = useState("");
  const [newColor, setNewColor] = useState("#4fc3f7");

  const totalPct = buckets.reduce((s,b) => s + b.pct, 0);
  const remaining = 100 - totalPct;
  const balanced  = totalPct === 100;

  const BUCKET_COLORS = ["#4fc3f7","#69f0ae","#ffb74d","#ce93d8","#ef9a9a","#ff8a65","#fff176","#a5d6a7","#80cbc4","#f48fb1"];

  const startEdit = (b) => {
    setEditing(b.id);
    setEditPct(String(b.pct));
    setEditLabel(b.label);
    setEditDesc(b.description || "");
  };

  const commitEdit = () => {
    const pct = parseFloat(editPct);
    if (!pct || pct <= 0) return;
    setBuckets(bs => bs.map(b => b.id === editing
      ? { ...b, pct: Math.round(pct * 10) / 10, label: editLabel.trim() || b.label, description: editDesc.trim() }
      : b
    ));
    const idx = bucketStore.findIndex(b => b.id === editing);
    if (idx > -1) { 
      bucketStore[idx].pct = Math.round(pct*10)/10; 
      bucketStore[idx].label = editLabel.trim() || bucketStore[idx].label; 
      bucketStore[idx].description = editDesc.trim(); 
    }
    setEditing(null);
  };

  const deleteBucket = (id) => {
    setBuckets(bs => bs.filter(b => b.id !== id));
    const idx = bucketStore.findIndex(b => b.id === id);
    if (idx > -1) bucketStore.splice(idx, 1);
  };

  const addBucket = () => {
    const pct = parseFloat(newPct);
    if (!pct || !newLabel.trim()) return;
    const b = { id:"b_"+Date.now(), label:newLabel.trim(), icon:(c,s)=>IC.other(c,s), color:newColor, pct, description:newDesc.trim() };
    setBuckets(bs => [...bs, b]);
    bucketStore.push({...b});
    setNewLabel(""); setNewDesc(""); setNewPct(""); setNewColor("#4fc3f7");
    setAddingBucket(false);
  };

  const fmt = (n) => "G " + Math.round(n).toLocaleString();

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"0 0 80px" }}>
      <div style={{ margin:"14px 16px 0", padding:"18px", background:"#080c10", border:"1px solid #4fc3f733", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"#4fc3f708" }}/>
        <div style={{ fontSize:10, color:"#4fc3f7", letterSpacing:1.2, textTransform:"uppercase", marginBottom:2 }}>Monthly payroll</div>
        <div style={{ fontSize:38, fontWeight:900, letterSpacing:-1.5, color:"#fff", lineHeight:1 }}>{fmt(salary)}</div>
        <div style={{ marginTop:14, display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ flex:1, height:6, background:"#111", borderRadius:3, overflow:"hidden", display:"flex" }}>
            {buckets.map((b,i) => (
              <div key={b.id} style={{ width:`${b.pct}%`, height:"100%", background:b.color, transition:"width 0.3s", borderRight: i < buckets.length-1 ? "1px solid #000" : "none" }}/>
            ))}
          </div>
          <div style={{ fontSize:11, color: balanced?"#69f0ae":remaining<0?"#ef5350":"#ffb74d", fontWeight:700, flexShrink:0 }}>
            {balanced ? "✓ balanced" : remaining > 0 ? `${remaining}% unallocated` : `${Math.abs(remaining)}% over`}
          </div>
        </div>
        <div style={{ fontSize:10, color:"#333", marginTop:6 }}>{totalPct}% allocated across {buckets.length} buckets</div>
      </div>

      <div style={{ margin:"12px 16px 0", display:"flex", flexDirection:"column", gap:6 }}>
        <div style={{ fontSize:10, color:"#333", letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Accounts & Institutions</div>
        {buckets.filter(b => b.institution).map(b => (
          <div key={b.id} style={{
            display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
            background: b.institution.color + "0a",
            border:`1px solid ${b.institution.color}22`,
            borderLeft:`3px solid ${b.institution.color}`,
          }}>
            <div style={{ width:36, height:36, borderRadius:8, background:b.institution.color+"18", border:`1px solid ${b.institution.color}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {b.institution.flag(b.institution.color, 18)}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                <span style={{ fontSize:13, fontWeight:700, color:b.institution.color }}>{b.institution.name}</span>
                <span style={{ fontSize:9, color:"#444", background:"#111", padding:"1px 5px" }}>{b.institution.type}</span>
              </div>
              {b.institution.accountName && (
                <div style={{ fontSize:10, color:"#555", marginBottom:1, display:"flex", alignItems:"center", gap:4 }}><span style={{display:"flex"}}>{IC.user("#555",10)}</span> {b.institution.accountName}</div>
              )}
              <div style={{ fontSize:10, color:"#333" }}>{b.institution.detail}</div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontSize:14, fontWeight:800, color:b.institution.color }}>
                {b.institution.fixedAmount ? `G ${b.institution.fixedAmount.toLocaleString()}` : fmt((b.pct/100)*salary)}
              </div>
              <div style={{ fontSize:9, color:"#333" }}>{b.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ margin:"12px 16px 0", display:"flex", flexDirection:"column", gap:6 }}>
        {buckets.map(b => {
          const amount = (b.pct / 100) * salary;
          const isEditing = editing === b.id;
          return (
            <div key={b.id} style={{ background:"#080808", borderLeft:`3px solid ${b.color}`, overflow:"hidden" }}>
              {b.institution && (
                <div style={{
                  display:"flex", alignItems:"center", gap:8,
                  padding:"7px 14px",
                  background: b.institution.color + "0d",
                  borderBottom:`1px solid ${b.institution.color}18`,
                }}>
                  <span style={{ fontSize:13, display:"flex", alignItems:"center" }}>{b.institution.flag(b.institution.color, 13)}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <span style={{ fontSize:11, fontWeight:700, color: b.institution.color }}>{b.institution.name}</span>
                    <span style={{ fontSize:9, color:"#444", marginLeft:6 }}>{b.institution.type}</span>
                    {b.institution.accountName && (
                      <span style={{ fontSize:9, color:"#333", marginLeft:6 }}>· {b.institution.accountName}</span>
                    )}
                  </div>
                  {b.institution.fixedAmount
                    ? <span style={{ fontSize:10, fontWeight:700, color:b.institution.color, flexShrink:0 }}>G {b.institution.fixedAmount.toLocaleString()} fixed</span>
                    : <span style={{ fontSize:9, color:"#333", flexShrink:0 }}>variable</span>
                  }
                </div>
              )}

              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px" }}>
                <span style={{ flexShrink:0, display:"flex", alignItems:"center" }}>{b.icon(b.color, 18)}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:2 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:"#ccc" }}>{b.label}</span>
                    <span style={{ fontSize:10, color:"#444" }}>{b.pct}%</span>
                  </div>
                  {b.description && <div style={{ fontSize:10, color:"#333", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.description}</div>}
                  {b.institution?.note && (
                    <div style={{ fontSize:9, color:"#2a2a2a", fontStyle:"italic", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.institution.note}</div>
                  )}
                  <div style={{ marginTop:6, height:2, background:"#111", borderRadius:1, overflow:"hidden", width:"100%" }}>
                    <div style={{ width:`${Math.min(100,b.pct)}%`, height:"100%", background:b.color, borderRadius:1 }}/>
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:16, fontWeight:800, color:b.color }}>{fmt(b.institution?.fixedAmount ?? amount)}</div>
                  <div style={{ fontSize:9, color:"#333" }}>/ month</div>
                </div>
                <div onClick={() => isEditing ? setEditing(null) : startEdit(b)} style={{ color:"#2a2a2a", cursor:"pointer", padding:"0 2px", fontSize:14, lineHeight:1 }}>
                  {isEditing ? "×" : "✎"}
                </div>
              </div>

              {isEditing && (
                <div style={{ padding:"0 14px 14px 14px", borderTop:"1px solid #111", display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ display:"flex", gap:10, marginTop:10 }}>
                    <div style={{ flex:2 }}>
                      <div style={{ fontSize:9, color:"#333", letterSpacing:0.8, textTransform:"uppercase", marginBottom:4 }}>Label</div>
                      <input autoFocus value={editLabel} onChange={e=>setEditLabel(e.target.value)}
                        style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:`1px solid ${b.color}44`, outline:"none", color:"#bbb", fontSize:13, padding:"3px 0", fontFamily:"inherit" }}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:9, color:"#333", letterSpacing:0.8, textTransform:"uppercase", marginBottom:4 }}>% of salary</div>
                      <input type="number" value={editPct} onChange={e=>setEditPct(e.target.value)} onKeyDown={e=>e.key==="Enter"&&commitEdit()}
                        style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:`1px solid ${b.color}44`, outline:"none", color:b.color, fontSize:16, fontWeight:700, padding:"3px 0", fontFamily:"inherit" }}/>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:9, color:"#333", letterSpacing:0.8, textTransform:"uppercase", marginBottom:4 }}>Description</div>
                    <input value={editDesc} onChange={e=>setEditDesc(e.target.value)}
                      style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #1a1a1a", outline:"none", color:"#555", fontSize:12, padding:"3px 0", fontFamily:"inherit" }}/>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <div onClick={commitEdit} style={{ padding:"7px 18px", background:b.color, color:"#000", fontSize:11, fontWeight:700, cursor:"pointer" }}>Save</div>
                    <div onClick={() => deleteBucket(b.id)} style={{ padding:"7px 12px", border:"1px solid #1e1e1e", color:"#ef5350", fontSize:11, cursor:"pointer" }}>Delete</div>
                    <div style={{ fontSize:11, color:"#333", marginLeft:"auto" }}>{fmt((parseFloat(editPct)||0)/100*salary)} / mo</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!balanced && (
        <div style={{ margin:"10px 16px 0", padding:"10px 14px", background: remaining < 0 ? "#100808" : "#0f0f08", border:`1px solid ${remaining < 0 ? "#ef535033":"#ffb74d33"}`, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:14, display:"flex", alignItems:"center" }}>{remaining < 0 ? IC.warn(remaining<0?"#ef5350":"#ffb74d",14) : IC.bulb("#ffb74d",14)}</span>
          <span style={{ fontSize:12, color: remaining < 0 ? "#ef9a9a":"#ffb74d" }}>
            {remaining < 0
              ? `${Math.abs(remaining)}% over-allocated — reduce some buckets by ${fmt(Math.abs(remaining)/100*salary)}`
              : `${remaining}% unallocated — ${fmt(remaining/100*salary)} not assigned to any bucket`}
          </span>
        </div>
      )}

      {addingBucket ? (
        <div style={{ margin:"10px 16px 0", padding:"16px", background:"#090909", border:"1px solid #1e1e1e" }}>
          <div style={{ fontSize:10, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>New bucket</div>
          <div style={{ display:"flex", gap:10, marginBottom:12 }}>
            <div style={{ flex:2 }}>
              <div style={{ fontSize:9, color:"#333", marginBottom:4 }}>Name</div>
              <input autoFocus value={newLabel} onChange={e=>setNewLabel(e.target.value)} placeholder="e.g. Vacation Fund"
                style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #1e1e1e", outline:"none", color:"#bbb", fontSize:13, padding:"4px 0", fontFamily:"inherit" }}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9, color:"#333", marginBottom:4 }}>% of salary</div>
              <input type="number" value={newPct} onChange={e=>setNewPct(e.target.value)} placeholder="5"
                style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #1e1e1e", outline:"none", color:"#fff", fontSize:14, fontWeight:700, padding:"4px 0", fontFamily:"inherit" }}/>
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:9, color:"#333", marginBottom:4 }}>Description (optional)</div>
            <input value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder="What is this bucket for?"
              style={{ width:"100%", boxSizing:"border-box", background:"transparent", border:"none", borderBottom:"1px solid #1e1e1e", outline:"none", color:"#555", fontSize:12, padding:"4px 0", fontFamily:"inherit" }}/>
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:9, color:"#333", marginBottom:6 }}>Color</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {BUCKET_COLORS.map(c => (
                <div key={c} onClick={()=>setNewColor(c)} style={{ width:24, height:24, borderRadius:"50%", background:c, cursor:"pointer", border:`3px solid ${newColor===c?"#fff":"transparent"}`, boxSizing:"border-box", transition:"border 0.1s" }}/>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <div onClick={addBucket} style={{ flex:1, padding:"10px", background:(newLabel.trim()&&newPct)?"#4fc3f7":"#111", color:(newLabel.trim()&&newPct)?"#000":"#333", textAlign:"center", fontSize:12, fontWeight:700, cursor:(newLabel.trim()&&newPct)?"pointer":"default", transition:"all 0.15s" }}>Add bucket</div>
            <div onClick={()=>setAddingBucket(false)} style={{ padding:"10px 16px", border:"1px solid #1e1e1e", color:"#444", fontSize:12, cursor:"pointer" }}>Cancel</div>
          </div>
        </div>
      ) : (
        <div onClick={()=>setAddingBucket(true)} style={{ margin:"10px 16px 0", padding:"12px", border:"1px dashed #1a1a1a", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:"#4fc3f766", fontSize:18, lineHeight:1 }}>+</span>
          <span style={{ fontSize:11, color:"#333" }}>Add allocation bucket</span>
        </div>
      )}
    </div>
  );
}