import { useState, useEffect, useRef, useCallback } from "react";

const GITHUB_API = "https://api.github.com";

// Minimal syntax highlighting
function highlight(code, lang) {
  if (!code) return "";
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const keywords = /\b(const|let|var|function|return|if|else|for|while|class|import|export|default|from|async|await|new|this|typeof|null|undefined|true|false|void|try|catch|finally|throw|extends|super|static|of|in|do|switch|case|break|continue|yield|delete)\b/g;
  const strings = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
  const comments = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
  const numbers = /\b(\d+\.?\d*)\b/g;

  return escaped
    .replace(comments, '<span class="cm">$1</span>')
    .replace(strings, '<span class="cs">$1</span>')
    .replace(keywords, '<span class="ck">$1</span>')
    .replace(numbers, '<span class="cn">$1</span>');
}

function FileTree({ tree, onSelect, selected, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2);
  const dirs = tree.filter(n => n.type === "tree" || n.type === "dir");
  const files = tree.filter(n => n.type === "blob" || n.type === "file");

  return (
    <div style={{ paddingLeft: depth > 0 ? 14 : 0 }}>
      {dirs.map(d => (
        <DirNode key={d.path} node={d} onSelect={onSelect} selected={selected} depth={depth} />
      ))}
      {files.map(f => (
        <div
          key={f.path}
          onClick={() => onSelect(f)}
          style={{
            padding: "3px 8px",
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            color: selected === f.path ? "#e2c97e" : "#9ca3b0",
            background: selected === f.path ? "rgba(226,201,126,0.08)" : "transparent",
            borderRadius: 3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {getFileIcon(f.name)} {f.name}
        </div>
      ))}
    </div>
  );
}

function DirNode({ node, onSelect, selected, depth }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: "3px 8px",
          cursor: "pointer",
          fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace",
          color: "#c8ccd4",
          display: "flex",
          alignItems: "center",
          gap: 4,
          borderRadius: 3,
        }}
      >
        <span style={{ fontSize: 9 }}>{open ? "▼" : "▶"}</span>
        📁 {node.name || node.path.split("/").pop()}
      </div>
      {open && node.children && (
        <FileTree tree={node.children} onSelect={onSelect} selected={selected} depth={depth + 1} />
      )}
    </div>
  );
}

function getFileIcon(name) {
  const ext = name.split(".").pop()?.toLowerCase();
  const map = { js: "🟨", jsx: "⚛️", ts: "🔷", tsx: "⚛️", css: "🎨", html: "🌐", json: "📋", md: "📝", py: "🐍", sh: "🐚", yml: "⚙️", yaml: "⚙️", gitignore: "🔒" };
  return map[ext] || "📄";
}

function buildTree(items) {
  const root = [];
  const map = {};
  items.forEach(item => {
    const parts = item.path.split("/");
    item.name = parts[parts.length - 1];
    map[item.path] = { ...item, children: [] };
  });
  items.forEach(item => {
    const parts = item.path.split("/");
    if (parts.length === 1) {
      root.push(map[item.path]);
    } else {
      const parentPath = parts.slice(0, -1).join("/");
      if (map[parentPath]) {
        map[parentPath].children.push(map[item.path]);
      }
    }
  });
  return root;
}

export default function GitHub() {
  const [token, setToken] = useState(() => localStorage.getItem("gh_token") || "");
  const [repoInput, setRepoInput] = useState(() => localStorage.getItem("gh_repo") || "");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [repoInfo, setRepoInfo] = useState(null);
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState("");
  const [tree, setTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [fileSha, setFileSha] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [commitMsg, setCommitMsg] = useState("");
  const [showCommit, setShowCommit] = useState(false);
  const [lineNums, setLineNums] = useState([]);
  const editorRef = useRef(null);
  const preRef = useRef(null);
  const textareaRef = useRef(null);

  const headers = useCallback((tok = token) => ({
    Authorization: `token ${tok}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  }), [token]);

  // Auto-reconnect on mount if credentials are saved
  useEffect(() => {
    if (token && repoInput) {
      connect(token, repoInput);
    }
  }, []); // eslint-disable-line

  async function connect(tok = token, repo = repoInput) {
    setLoading(true);
    setError("");
    try {
      const [owner, repoName] = repo.trim()
        .replace("https://github.com/", "")
        .replace(/\.git$/, "")
        .split("/");
      const r = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}`, { headers: headers(tok) });
      if (!r.ok) throw new Error(r.status === 401 ? "Invalid token — check it has 'repo' scope" : r.status === 404 ? "Repo not found — check the URL and token permissions" : `GitHub error ${r.status}`);
      const info = await r.json();
      setRepoInfo(info);

      const br = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}/branches`, { headers: headers(tok) });
      const bData = await br.json();
      setBranches(bData);
      const def = info.default_branch;
      setCurrentBranch(def);
      await loadTree(owner, repoName, def);

      // Save credentials only on successful connect
      localStorage.setItem("gh_token", tok);
      localStorage.setItem("gh_repo", repo.trim());
      setConnected(true);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function loadTree(owner, repo, branch) {
    const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers: headers() });
    const data = await r.json();
    const items = (data.tree || []).filter(i => i.type === "blob");
    setTree(buildTree(data.tree || []));
  }

  async function openFile(file) {
    if (!repoInfo) return;
    setLoading(true);
    try {
      const [owner, repo] = repoInfo.full_name.split("/");
      const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${file.path}?ref=${currentBranch}`, { headers: headers() });
      const data = await r.json();
      const decoded = atob(data.content.replace(/\n/g, ""));
      setContent(decoded);
      setOriginalContent(decoded);
      setFileSha(data.sha);
      setSelectedFile(file);
      updateLineNums(decoded);
    } catch (e) {
      setError("Failed to load file: " + e.message);
    }
    setLoading(false);
  }

  function updateLineNums(text) {
    const lines = text.split("\n");
    setLineNums(Array.from({ length: lines.length }, (_, i) => i + 1));
  }

  function handleEdit(e) {
    const val = e.target.value;
    setContent(val);
    updateLineNums(val);
    // sync scroll
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }

  function syncScroll() {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }

  async function saveFile() {
    if (!selectedFile || !repoInfo) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const [owner, repo] = repoInfo.full_name.split("/");
      const encoded = btoa(unescape(encodeURIComponent(content)));
      const body = {
        message: commitMsg || `Update ${selectedFile.name}`,
        content: encoded,
        sha: fileSha,
        branch: currentBranch,
      };
      const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${selectedFile.path}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d.message);
      }
      const data = await r.json();
      setFileSha(data.content.sha);
      setOriginalContent(content);
      setSaveMsg("✓ Saved");
      setShowCommit(false);
      setCommitMsg("");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e) {
      setSaveMsg("✗ " + e.message);
    }
    setSaving(false);
  }

  const isDirty = content !== originalContent;
  const ext = selectedFile?.name?.split(".").pop() || "txt";

  if (!connected) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0d1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600&family=Syne:wght@400;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0d1117; }
          input { outline: none; }
          input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #161b22 inset !important; -webkit-text-fill-color: #c8ccd4 !important; }
        `}</style>
        <div style={{ width: 480, padding: 48 }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#e2c97e", textTransform: "uppercase", marginBottom: 12 }}>GitHub Code Editor</div>
            <div style={{ fontSize: 36, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#e6edf3", lineHeight: 1.1, marginBottom: 8 }}>
              Connect Your<br />Repository
            </div>
            <div style={{ fontSize: 12, color: "#6e7681" }}>Browse, edit, and commit directly from your browser</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, color: "#6e7681", letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>GitHub Token</label>
              <input
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "#161b22", border: "1px solid #30363d",
                  borderRadius: 6, color: "#c8ccd4", fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
              <div style={{ fontSize: 11, color: "#484f58", marginTop: 6 }}>
                Needs <code style={{ color: "#e2c97e" }}>repo</code> scope. Create at github.com/settings/tokens
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, color: "#6e7681", letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Repository</label>
              <input
                value={repoInput}
                onChange={e => setRepoInput(e.target.value)}
                placeholder="owner/repo or full URL"
                onKeyDown={e => e.key === "Enter" && connect()}
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "#161b22", border: "1px solid #30363d",
                  borderRadius: 6, color: "#c8ccd4", fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
            </div>

            {error && <div style={{ color: "#f85149", fontSize: 12, padding: "10px 14px", background: "rgba(248,81,73,0.1)", borderRadius: 6, border: "1px solid rgba(248,81,73,0.2)" }}>{error}</div>}

            <button
              onClick={connect}
              disabled={loading || !token || !repoInput}
              style={{
                padding: "13px 24px",
                background: loading ? "#21262d" : "linear-gradient(135deg, #e2c97e, #c9a227)",
                border: "none", borderRadius: 6,
                color: loading ? "#6e7681" : "#0d1117",
                fontSize: 13, fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: 1,
              }}
            >
              {loading ? "Connecting..." : "Connect →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleFileSelect(file) {
    openFile(file);
    setSidebarOpen(false);
  }

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "#0d1117", fontFamily: "'JetBrains Mono', monospace", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600&family=Syne:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
        textarea { outline: none; resize: none; }
        .ck { color: #ff7b72; } .cs { color: #a5d6ff; }
        .cm { color: #8b949e; font-style: italic; } .cn { color: #79c0ff; }
        select { outline: none; }
        .sidebar-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.6); z-index: 40;
        }
        .sidebar-drawer {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: 80vw; max-width: 300px;
          background: #161b22; border-right: 1px solid #21262d;
          overflow-y: auto; z-index: 50; padding: 12px 0;
          transform: translateX(-100%); transition: transform 0.22s ease;
        }
        .sidebar-static {
          width: 220px; background: #161b22;
          border-right: 1px solid #21262d;
          overflow: auto; flex-shrink: 0; padding: 12px 0;
        }
        .file-path-short { display: none; }
        @media (max-width: 640px) {
          .sidebar-static { display: none !important; }
          .sidebar-drawer { transform: var(--drawer-transform, translateX(-100%)); }
          .sidebar-overlay { display: var(--overlay-display, none); }
          .topbar-repo, .topbar-stars, .branch-label, .disconnect-btn { display: none !important; }
          .file-path-full { display: none !important; }
          .file-path-short { display: inline !important; }
          .line-numbers, .status-bar { display: none !important; }
          .commit-bar-flex { flex-wrap: wrap; }
        }
        @media (min-width: 641px) {
          .mobile-menu-btn { display: none !important; }
          .file-path-short { display: none !important; }
        }
      `}</style>

      {/* Mobile sidebar overlay */}
      <div
        className="sidebar-overlay"
        style={{ "--overlay-display": sidebarOpen ? "block" : "none" }}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Mobile sidebar drawer */}
      <div
        className="sidebar-drawer"
        style={{ "--drawer-transform": sidebarOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        <div style={{ padding: "0 12px 10px", fontSize: 10, color: "#484f58", textTransform: "uppercase", letterSpacing: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Files</span>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "transparent", border: "none", color: "#6e7681", fontSize: 20, cursor: "pointer", lineHeight: 1, padding: "4px 8px" }}>✕</button>
        </div>
        <FileTree tree={tree} onSelect={handleFileSelect} selected={selectedFile?.path} />
      </div>

      {/* Top bar */}
      <div style={{ height: 48, background: "#161b22", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", padding: "0 12px", gap: 10, flexShrink: 0 }}>
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(o => !o)}
          style={{ background: "transparent", border: "1px solid #30363d", borderRadius: 6, color: "#c8ccd4", width: 38, height: 38, cursor: "pointer", fontSize: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
        >☰</button>
        <div style={{ fontSize: 11, color: "#e2c97e", letterSpacing: 2, textTransform: "uppercase", flexShrink: 0 }}>⬡</div>
        <div className="topbar-repo" style={{ fontSize: 12, color: "#c8ccd4", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{repoInfo?.full_name}</div>
        <div className="topbar-stars" style={{ fontSize: 11, padding: "2px 8px", background: "#21262d", borderRadius: 10, color: "#6e7681", flexShrink: 0 }}>⭐ {repoInfo?.stargazers_count}</div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <label className="branch-label" style={{ fontSize: 11, color: "#6e7681" }}>Branch:</label>
          <select
            value={currentBranch}
            onChange={async e => {
              setCurrentBranch(e.target.value);
              setSelectedFile(null); setContent("");
              const [o, r] = repoInfo.full_name.split("/");
              await loadTree(o, r, e.target.value);
            }}
            style={{ background: "#21262d", border: "1px solid #30363d", borderRadius: 4, color: "#c8ccd4", fontSize: 12, padding: "5px 8px", fontFamily: "'JetBrains Mono', monospace", maxWidth: 130 }}
          >
            {branches.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
          </select>
          <button className="disconnect-btn" onClick={() => { setConnected(false); localStorage.removeItem("gh_token"); localStorage.removeItem("gh_repo"); }} style={{ padding: "5px 10px", background: "transparent", border: "1px solid #30363d", borderRadius: 4, color: "#6e7681", fontSize: 11, cursor: "pointer" }}>
            Disconnect
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar (desktop only) */}
        <div className="sidebar-static">
          <div style={{ padding: "0 12px 10px", fontSize: 10, color: "#484f58", textTransform: "uppercase", letterSpacing: 2 }}>Files</div>
          <FileTree tree={tree} onSelect={openFile} selected={selectedFile?.path} />
        </div>

        {/* Editor area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          {selectedFile ? (
            <>
              {/* File tab bar */}
              <div style={{ height: 40, background: "#161b22", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", padding: "0 12px", gap: 8, flexShrink: 0, minWidth: 0 }}>
                <span className="file-path-short" style={{ fontSize: 12, color: "#c8ccd4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  {getFileIcon(selectedFile.name)} {selectedFile.name}
                </span>
                <span className="file-path-full" style={{ fontSize: 12, color: "#c8ccd4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  {getFileIcon(selectedFile.name)} {selectedFile.path}
                </span>
                {isDirty && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#e2c97e", display: "inline-block", flexShrink: 0 }} />}
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                  {saveMsg && <span style={{ fontSize: 11, color: saveMsg.startsWith("✓") ? "#3fb950" : "#f85149" }}>{saveMsg}</span>}
                  {isDirty && !showCommit && (
                    <button onClick={() => setShowCommit(true)} style={{ padding: "5px 14px", background: "linear-gradient(135deg, #e2c97e, #c9a227)", border: "none", borderRadius: 4, color: "#0d1117", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>
                      Commit
                    </button>
                  )}
                </div>
              </div>

              {/* Commit bar */}
              {showCommit && (
                <div className="commit-bar-flex" style={{ padding: "10px 12px", background: "#161b22", borderBottom: "1px solid #21262d", display: "flex", gap: 8 }}>
                  <input
                    value={commitMsg}
                    onChange={e => setCommitMsg(e.target.value)}
                    placeholder={`Update ${selectedFile.name}`}
                    onKeyDown={e => e.key === "Enter" && saveFile()}
                    style={{ flex: 1, minWidth: 0, padding: "8px 12px", background: "#0d1117", border: "1px solid #30363d", borderRadius: 4, color: "#c8ccd4", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}
                  />
                  <button onClick={saveFile} disabled={saving} style={{ padding: "8px 14px", background: "#238636", border: "none", borderRadius: 4, color: "#fff", fontSize: 12, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>
                    {saving ? "Saving..." : "Commit & Push"}
                  </button>
                  <button onClick={() => setShowCommit(false)} style={{ padding: "8px 12px", background: "transparent", border: "1px solid #30363d", borderRadius: 4, color: "#6e7681", fontSize: 12, cursor: "pointer" }}>✕</button>
                </div>
              )}

              {/* Editor */}
              <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
                {/* Line numbers (desktop only) */}
                <div className="line-numbers" style={{ width: 48, background: "#0d1117", borderRight: "1px solid #161b22", overflow: "hidden", padding: "16px 0", flexShrink: 0, fontSize: 12, lineHeight: "21px", color: "#484f58", textAlign: "right", paddingRight: 10, userSelect: "none" }}>
                  {lineNums.map(n => <div key={n}>{n}</div>)}
                </div>
                {/* Code area */}
                <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                  <pre ref={preRef} style={{ position: "absolute", inset: 0, padding: "16px 16px 16px 12px", margin: 0, overflow: "auto", fontSize: 13, lineHeight: "21px", fontFamily: "'JetBrains Mono', monospace", background: "#0d1117", color: "#c8ccd4", pointerEvents: "none", whiteSpace: "pre", tabSize: 2 }}
                    dangerouslySetInnerHTML={{ __html: highlight(content, ext) + "\n" }}
                  />
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleEdit}
                    onScroll={syncScroll}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                    style={{ position: "absolute", inset: 0, padding: "16px 16px 16px 12px", fontSize: 13, lineHeight: "21px", fontFamily: "'JetBrains Mono', monospace", background: "transparent", color: "transparent", caretColor: "#e2c97e", border: "none", resize: "none", whiteSpace: "pre", tabSize: 2, WebkitOverflowScrolling: "touch" }}
                  />
                </div>
              </div>

              {/* Status bar (desktop only) */}
              <div className="status-bar" style={{ height: 24, background: "#161b22", borderTop: "1px solid #21262d", display: "flex", alignItems: "center", padding: "0 16px", gap: 16, flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: "#484f58" }}>{lineNums.length} lines</span>
                <span style={{ fontSize: 10, color: "#484f58" }}>{ext.toUpperCase()}</span>
                <span style={{ fontSize: 10, color: "#484f58" }}>UTF-8</span>
                {isDirty && <span style={{ fontSize: 10, color: "#e2c97e" }}>● Modified</span>}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#484f58" }}>
              {loading ? (
                <div style={{ fontSize: 13 }}>Loading...</div>
              ) : (
                <>
                  <div style={{ fontSize: 32 }}>⬡</div>
                  <div style={{ fontSize: 13 }}>Tap ☰ to browse files</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
