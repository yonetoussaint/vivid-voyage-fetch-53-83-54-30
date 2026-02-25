import { useState } from 'react';
import { ATTACHMENT_PRESETS, FILE_TYPE_META, getAttachKey, attachmentStore, detectFileType } from '@/utils/attachmentUtils';

export function AttachmentSection({ evTitle, evType, accentColor }) {
  const key = getAttachKey(evTitle, evType);
  if (!attachmentStore[key]) attachmentStore[key] = [];

  const [attachments, setAttachments] = useState([...attachmentStore[key]]);
  const [adding, setAdding]           = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [newUrl, setNewUrl]           = useState("");
  const [urlError, setUrlError]       = useState(false);
  const [activeGroup, setActiveGroup] = useState(ATTACHMENT_PRESETS[0].group);

  const sync = (arr) => { attachmentStore[key] = arr; setAttachments([...arr]); };

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setNewUrl("");
    setUrlError(false);
  };

  const handleAdd = () => {
    const trimUrl = newUrl.trim();
    if (!trimUrl || !selectedPreset) { setUrlError(true); return; }
    try { new URL(trimUrl.startsWith("http") ? trimUrl : "https://" + trimUrl); } catch { setUrlError(true); return; }
    const fullUrl = trimUrl.startsWith("http") ? trimUrl : "https://" + trimUrl;
    const fileType = detectFileType(fullUrl) !== "link" ? detectFileType(fullUrl) : selectedPreset.fileType;
    const attach = { id: Date.now(), title: selectedPreset.label, url: fullUrl, fileType };
    sync([...attachmentStore[key], attach]);
    setNewUrl(""); setAdding(false); setSelectedPreset(null); setUrlError(false);
  };

  const handleCancel = () => { setAdding(false); setSelectedPreset(null); setNewUrl(""); setUrlError(false); };

  const handleRemove = (id) => sync(attachmentStore[key].filter(a => a.id !== id));

  return (
    <div onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>
          Attachments {attachments.length > 0 && <span style={{ color: accentColor, marginLeft: 4 }}>{attachments.length}</span>}
        </div>
        <div
          onClick={() => adding ? handleCancel() : setAdding(true)}
          style={{ fontSize: 9, color: adding ? "#555" : accentColor, cursor: "pointer", letterSpacing: 0.5, border: `1px solid ${adding ? "#222" : accentColor + "55"}`, padding: "2px 7px", borderRadius: 2, userSelect: "none" }}
        >
          {adding ? "cancel" : "+ add"}
        </div>
      </div>

      {adding && (
        <div style={{ marginBottom: 10, background: "#0a0a0a", border: "1px solid #1a1a1a" }}>
          {!selectedPreset ? (
            <div>
              <div style={{ display: "flex", borderBottom: "1px solid #141414", overflowX: "auto" }}>
                {ATTACHMENT_PRESETS.map(g => (
                  <div key={g.group} onClick={() => setActiveGroup(g.group)} style={{
                    padding: "7px 12px", fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase",
                    color: activeGroup === g.group ? accentColor : "#333",
                    borderBottom: `2px solid ${activeGroup === g.group ? accentColor : "transparent"}`,
                    cursor: "pointer", userSelect: "none", flexShrink: 0, whiteSpace: "nowrap",
                    transition: "color 0.12s",
                  }}>
                    {g.group}
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, padding: 1 }}>
                {ATTACHMENT_PRESETS.find(g => g.group === activeGroup)?.items.map((preset, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "9px 11px", background: "#0d0d0d",
                      cursor: "pointer", userSelect: "none",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = accentColor + "0f"}
                    onMouseLeave={e => e.currentTarget.style.background = "#0d0d0d"}
                  >
                    <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{preset.icon("#888")}</span>
                    <span style={{ fontSize: 11, color: "#666" }}>{preset.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: "12px 12px 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 9px", background: accentColor + "0f", border: `1px solid ${accentColor}33` }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>{selectedPreset.icon(accentColor)}</span>
                  <span style={{ fontSize: 11, color: accentColor }}>{selectedPreset.label}</span>
                </div>
                <div
                  onClick={() => setSelectedPreset(null)}
                  style={{ fontSize: 9, color: "#333", cursor: "pointer", letterSpacing: 0.5, border: "1px solid #1e1e1e", padding: "3px 6px", userSelect: "none" }}
                >
                  ← change
                </div>
              </div>

              <input
                autoFocus
                value={newUrl}
                onChange={e => { setNewUrl(e.target.value); setUrlError(false); }}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder={selectedPreset.placeholder}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "transparent", border: "none",
                  borderBottom: `1px solid ${urlError ? "#ef5350" : "#222"}`,
                  outline: "none", color: urlError ? "#ef5350" : "#bbb",
                  fontSize: 12, padding: "5px 0",
                }}
              />
              {urlError && <div style={{ fontSize: 10, color: "#ef5350", marginTop: 4 }}>Enter a valid URL</div>}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                <div
                  onClick={handleAdd}
                  style={{ fontSize: 10, color: newUrl.trim() ? accentColor : "#333", cursor: newUrl.trim() ? "pointer" : "default", border: `1px solid ${newUrl.trim() ? accentColor + "55" : "#1e1e1e"}`, padding: "3px 12px", letterSpacing: 0.5, userSelect: "none", transition: "all 0.15s" }}
                >
                  attach →
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {attachments.length === 0 && !adding && (
        <div style={{ fontSize: 11, color: "#2a2a2a", fontStyle: "italic" }}>No attachments yet</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {attachments.map(att => {
          const ftm = FILE_TYPE_META[att.fileType] || FILE_TYPE_META.link;
          return (
            <div key={att.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#0d0d0d", border: `1px solid #1a1a1a`, borderLeft: `2px solid ${ftm.color}55` }}>
              <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{ftm.icon(ftm.color)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  onClick={() => window.open(att.url, "_blank")}
                  style={{ fontSize: 12, color: "#bbb", cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  title={att.url}
                >
                  {att.title}
                </div>
                <div style={{ fontSize: 10, color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{att.url}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div
                  onClick={() => window.open(att.url, "_blank")}
                  style={{ fontSize: 9, color: ftm.color, cursor: "pointer", border: `1px solid ${ftm.color}44`, padding: "2px 6px", letterSpacing: 0.5, userSelect: "none" }}
                >
                  open ↗
                </div>
                <div onClick={() => handleRemove(att.id)} style={{ fontSize: 12, color: "#333", cursor: "pointer", lineHeight: 1, padding: "0 2px" }}>×</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}