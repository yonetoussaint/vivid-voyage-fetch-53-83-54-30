import { useState } from 'react';
import { SOCIALS, contactStore, getContactKey } from '../utils/contactUtils';
import { Avatar } from './Avatar';

const EMPTY_FORM = { name: "", role: "", photo: "", phone: "", email: "", notes: "", whatsapp: "", instagram: "", linkedin: "", twitter: "", telegram: "", snapchat: "" };

export function ContactSection({ evTitle, evType, accentColor }) {
  const key = getContactKey(evTitle, evType);
  if (!contactStore[key]) contactStore[key] = [];

  const [contacts, setContacts] = useState([...contactStore[key]]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [tab, setTab] = useState("basic");

  const sync = (arr) => { contactStore[key] = arr; setContacts([...arr]); };
  const setField = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleAdd = () => {
    if (!form.name.trim()) return;
    sync([...contactStore[key], { ...form, id: Date.now() }]);
    setForm({ ...EMPTY_FORM }); setAdding(false); setTab("basic");
  };

  const inputStyle = { background: "transparent", border: "none", borderBottom: "1px solid #1e1e1e", outline: "none", color: "#bbb", fontSize: 12, padding: "5px 0", width: "100%", boxSizing: "border-box" };
  const labelStyle = { fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 };
  const tabStyle = (t) => ({ fontSize: 10, padding: "4px 10px", cursor: "pointer", letterSpacing: 0.5, color: tab === t ? "#fff" : "#444", borderBottom: `1px solid ${tab === t ? accentColor : "transparent"}` });

  const avatarRow = contacts.slice(0, 5);

  return (
    <div onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: contacts.length > 0 ? 10 : 8 }}>
        <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 8 }}>
          People
          {contacts.length > 0 && <span style={{ color: accentColor }}>{contacts.length}</span>}
        </div>
        <div
          onClick={() => { setAdding(a => !a); setTab("basic"); setForm({ ...EMPTY_FORM }); }}
          style={{ fontSize: 9, color: adding ? "#555" : accentColor, cursor: "pointer", letterSpacing: 0.5, border: `1px solid ${adding ? "#222" : accentColor + "55"}`, padding: "2px 7px", borderRadius: 2, userSelect: "none" }}
        >
          {adding ? "cancel" : "+ person"}
        </div>
      </div>

      {!adding && contacts.length === 0 && <div style={{ fontSize: 11, color: "#2a2a2a", fontStyle: "italic" }}>No people attached yet</div>}
      {!adding && contacts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {contacts.map(c => (
            <ContactCard key={c.id} contact={c} accentColor={accentColor} onRemove={() => sync(contactStore[key].filter(x => x.id !== c.id))} />
          ))}
        </div>
      )}

      {adding && (
        <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", marginBottom: 4 }}>
            {["basic", "contact", "socials"].map(t => <div key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{t}</div>)}
          </div>

          {tab === "basic" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><div style={labelStyle}>Name *</div><input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="Full name" style={inputStyle} /></div>
              <div><div style={labelStyle}>Role / Title</div><input value={form.role} onChange={e => setField("role", e.target.value)} placeholder="e.g. Product Manager" style={inputStyle} /></div>
              <div><div style={labelStyle}>Photo URL</div><input value={form.photo} onChange={e => setField("photo", e.target.value)} placeholder="https://..." style={inputStyle} /></div>
              {form.photo && <img src={form.photo} alt="preview" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `2px solid ${accentColor}55`, alignSelf: "flex-start" }} onError={e => e.target.style.display="none"} />}
              <div><div style={labelStyle}>Notes</div><input value={form.notes} onChange={e => setField("notes", e.target.value)} placeholder="How you know them, context..." style={inputStyle} /></div>
            </div>
          )}

          {tab === "contact" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><div style={labelStyle}>Phone</div><input value={form.phone} onChange={e => setField("phone", e.target.value)} placeholder="+1 555 000 0000" style={inputStyle} /></div>
              <div><div style={labelStyle}>Email</div><input value={form.email} onChange={e => setField("email", e.target.value)} placeholder="name@example.com" style={inputStyle} /></div>
            </div>
          )}

          {tab === "socials" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SOCIALS.map(s => (
                <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: s.color + "18", border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon(s.color)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={labelStyle}>{s.label}</div>
                    <input value={form[s.key]} onChange={e => setField(s.key, e.target.value)} placeholder="username or handle" style={inputStyle} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
            {tab !== "basic" && <div onClick={() => setTab(tab === "socials" ? "contact" : "basic")} style={{ fontSize: 10, color: "#444", cursor: "pointer" }}>← back</div>}
            {tab !== "socials"
              ? <div onClick={() => setTab(tab === "basic" ? "contact" : "socials")} style={{ fontSize: 10, color: accentColor, cursor: "pointer", marginLeft: "auto" }}>next →</div>
              : <div onClick={handleAdd} style={{ fontSize: 10, color: !form.name.trim() ? "#333" : accentColor, cursor: form.name.trim() ? "pointer" : "default", border: `1px solid ${!form.name.trim() ? "#1a1a1a" : accentColor + "55"}`, padding: "3px 12px", letterSpacing: 0.5, marginLeft: "auto" }}>save contact →</div>
            }
          </div>
        </div>
      )}
    </div>
  );
}