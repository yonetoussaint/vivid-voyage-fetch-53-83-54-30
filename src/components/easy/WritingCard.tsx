import { useState } from 'react';
import { TYPE_META } from '@/data/typeMeta';
import { getAttachKey, attachmentStore } from '@/utils/attachmentUtils';
import { DocScreen } from '@/components/easy/DocScreen';
import { ContactSection } from '@/components/easy/ContactSection';
import { AttachmentSection } from '@/components/easy/AttachmentSection';

const writingStorage = {};

export function WritingCard({ ev }) {
  const meta = TYPE_META[ev.type];
  const accent = meta.accent;
  const storageKey = ev.title + "_" + ev.type;
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState(writingStorage[storageKey] || "");
  const [done, setDone] = useState(false);
  const [docOpen, setDocOpen] = useState(false);

  const isDoc = ev.type === "doc";

  const saveText = (val) => {
    setText(val);
    writingStorage[storageKey] = val;
  };

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const progress = Math.min(100, Math.round((wordCount / (ev.wordGoal || 200)) * 100));

  return (
    <>
      {docOpen && isDoc && (
        <DocScreen
          ev={ev}
          accent={accent}
          text={text}
          setText={saveText}
          onClose={() => setDocOpen(false)}
        />
      )}
    <div style={{
      background: meta.cardBg,
      border: `1px solid ${accent}22`,
      borderLeft: `3px solid ${expanded ? accent : accent + "66"}`,
      animation: "fadeIn 0.15s ease",
      fontFamily: "'Courier New', Courier, monospace",
      opacity: done ? 0.45 : 1,
      transition: "opacity 0.2s",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer" }} onClick={() => setExpanded(e => !e)}>
        {/* Done toggle */}
        <div
          onClick={e => { e.stopPropagation(); setDone(d => !d); }}
          style={{ width: 22, height: 22, border: `1.5px solid ${done ? accent : accent + "44"}`, background: done ? accent + "33" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all 0.15s" }}
        >
          <span style={{ fontFamily: "monospace", fontSize: 13, color: accent, lineHeight: 1 }}>{done ? "✓" : meta.icon}</span>
        </div>

        {/* Title + meta */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: done ? "#444" : "#d4d4d8", letterSpacing: 0.3, textDecoration: done ? "line-through" : "none" }}>{ev.title}</span>
            <span style={{ fontSize: 9, color: accent, border: `1px solid ${accent}44`, padding: "1px 5px", letterSpacing: 1, textTransform: "uppercase", background: accent + "0d" }}>{meta.label(ev)}</span>
            {ev.tags && ev.tags.map(t => (
              <span key={t} style={{ fontSize: 8, color: "#555", border: "1px solid #222", padding: "1px 4px", letterSpacing: 0.5 }}>#{t}</span>
            ))}
          </div>
          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 2, background: "#1a1a1a", position: "relative", maxWidth: 120 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${progress}%`, background: accent, opacity: 0.7, transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: 10, color: progress >= 100 ? accent : "#444", letterSpacing: 0.5 }}>
              {wordCount} / {ev.wordGoal || 200}w
            </span>
            <span style={{ color: "#222", fontSize: 10 }}>·</span>
            <span style={{ fontSize: 10, color: "#444" }}>{ev.time}</span>
            <span style={{ color: "#222", fontSize: 10 }}>·</span>
            <span style={{ fontSize: 10, color: "#444" }}>{ev.duration}</span>
          </div>
        </div>

        {/* Chevron + attachment count */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {(()=>{const k=getAttachKey(ev.title,ev.type);const cnt=(attachmentStore[k]||[]).length;return cnt>0?<div style={{fontSize:9,color:"#555",border:"1px solid #1e1e1e",padding:"1px 5px",borderRadius:2,display:"flex",alignItems:"center",gap:3,fontFamily:"inherit"}}><span>📎</span>{cnt}</div>:null;})()}
          {isDoc && (
            <div
              onClick={e => { e.stopPropagation(); setDocOpen(true); }}
              style={{
                fontSize: 9, color: accent, border: `1px solid ${accent}44`,
                padding: "2px 8px", letterSpacing: 0.8, cursor: "pointer",
                userSelect: "none", background: accent + "0a",
                fontFamily: "inherit",
              }}
            >
              open docs ↗
            </div>
          )}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ display: "block", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            <path d="M6 9l6 6 6-6" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${accent}1a` }}>
          {/* Prompt */}
          {ev.prompt && (
            <div style={{ padding: "10px 14px 0", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 11, color: accent + "88", flexShrink: 0, marginTop: 1 }}>//</span>
              <span style={{ fontSize: 11, color: "#555", lineHeight: 1.6, fontStyle: "italic" }}>{ev.prompt}</span>
            </div>
          )}
          {/* Editor area */}
          <div style={{ padding: "10px 14px 14px", position: "relative" }}>
            <textarea
              value={text}
              onChange={e => saveText(e.target.value)}
              onClick={e => e.stopPropagation()}
              placeholder={`Start writing here...

> ${ev.prompt || "What's on your mind?"}`}
              style={{
                width: "100%",
                minHeight: 140,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#a1a1aa",
                fontSize: 12,
                lineHeight: 1.8,
                fontFamily: "'Courier New', Courier, monospace",
                resize: "none",
                boxSizing: "border-box",
                caretColor: accent,
              }}
            />
            {/* Line numbers aesthetic strip */}
            <div style={{ position: "absolute", left: 0, top: 10, bottom: 14, width: 4, background: `linear-gradient(to bottom, ${accent}33, transparent)` }} />
          </div>
          {/* Footer bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 14px 10px", borderTop: `1px solid ${accent}11` }}>
            <span style={{ fontSize: 10, color: "#333", letterSpacing: 0.5 }}>
              {text.trim().split(/\n/).length} lines · ~{Math.ceil(wordCount / 200)} min read
            </span>
            <span style={{ fontSize: 10, color: progress >= 100 ? accent : "#333" }}>
              {progress >= 100 ? "✓ goal reached" : `${ev.wordGoal - wordCount > 0 ? ev.wordGoal - wordCount : 0}w to go`}
            </span>
          </div>
          {/* People + Attachments */}
          <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${accent}11` }}>
            <div style={{ height: 10 }} />
            <ContactSection evTitle={ev.title} evType={ev.type} accentColor={accent} />
            <div style={{ height: 14 }} />
            <AttachmentSection evTitle={ev.title} evType={ev.type} accentColor={accent} />
          </div>
        </div>
      )}
    </div>
    </>
  );
}