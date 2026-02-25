export const attachmentStore = {};

export function getAttachKey(evTitle, evType) {
  return `${evType}::${evTitle}`;
}

export function detectFileType(url) {
  const u = url.toLowerCase();
  if (u.match(/\.(pdf)($|\?)/)) return "pdf";
  if (u.match(/\.(png|jpg|jpeg|gif|webp|svg|avif)($|\?)/)) return "image";
  if (u.match(/\.(mp4|mov|avi|webm|mkv)($|\?)/)) return "video";
  if (u.match(/\.(mp3|wav|ogg|m4a)($|\?)/)) return "audio";
  if (u.match(/\.(doc|docx)($|\?)/)) return "doc";
  if (u.match(/\.(xls|xlsx|csv)($|\?)/)) return "sheet";
  if (u.match(/\.(zip|rar|tar|gz)($|\?)/)) return "archive";
  if (u.includes("youtube.com") || u.includes("youtu.be") || u.includes("vimeo.com")) return "video";
  if (u.includes("figma.com")) return "figma";
  if (u.includes("github.com")) return "github";
  if (u.includes("notion.so")) return "notion";
  if (u.includes("drive.google.com") || u.includes("docs.google.com")) return "gdrive";
  return "link";
}

// Icon components
const AttachIcons = {
  figma: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 38 57" fill="none">
      <path d="M19 28.5A9.5 9.5 0 1 1 28.5 19 9.5 9.5 0 0 1 19 28.5z" fill={c}/>
      <path d="M9.5 57A9.5 9.5 0 0 0 19 47.5V38H9.5a9.5 9.5 0 0 0 0 19z" fill="#0acf83"/>
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#a259ff"/>
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#f24e1e"/>
      <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19z" fill="#ff7262"/>
    </svg>
  ),
  github: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  notion: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
    </svg>
  ),
  gdrive: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path d="M4.433 22.396l2-3.467H22l-2 3.467z" fill="#0066da"/>
      <path d="M12 1.604L2 19.037l2 3.359 10-17.33z" fill="#00ac47"/>
      <path d="M22 19.037H12L7.567 11.5l2-3.463L14 15.57h8z" fill="#ea4335"/>
      <path d="M2 19.037l2 3.359h8l-2-3.359z" fill="#00832d"/>
      <path d="M12 1.604l5 8.652-2 3.463-5-8.652z" fill="#2684fc"/>
      <path d="M22 19.037l-2-3.467H14l2 3.467z" fill="#ffba00"/>
    </svg>
  ),
  pdf: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="1" width="13" height="18" rx="1.5" fill={c} opacity=".15"/>
      <path d="M13 1v5h5" stroke={c} strokeWidth="1.5" fill="none"/>
      <path d="M3 1h10l5 5v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" stroke={c} strokeWidth="1.3" fill="none"/>
      <text x="4.5" y="20" fontSize="5.5" fill={c} fontFamily="monospace" fontWeight="700">PDF</text>
    </svg>
  ),
  image: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5" fill={c} stroke="none"/>
      <path d="M21 15l-5-5L5 21" strokeLinecap="round"/>
    </svg>
  ),
  video: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <rect x="2" y="5" width="15" height="14" rx="2"/>
      <path d="M17 9l5-3v12l-5-3V9z" strokeLinejoin="round"/>
    </svg>
  ),
  audio: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <path d="M9 18V5l12-2v13" strokeLinecap="round"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  doc: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round"/>
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round"/>
    </svg>
  ),
  sheet: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M3 15h18M9 3v18" strokeLinecap="round"/>
    </svg>
  ),
  archive: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  link: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round"/>
    </svg>
  ),
  youtube: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.03 0 12 0 12s0 3.97.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.45 20.5 12 20.5 12 20.5s7.55 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.97 24 12 24 12s0-3.97-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>
    </svg>
  ),
  // Add more icons as needed (loom, vimeo, etc.) – for brevity, we'll include essential ones
  // For missing icons, we can reuse existing ones as fallbacks
  loom: (c) => AttachIcons.video(c),
  vimeo: (c) => AttachIcons.video(c),
  slack: (c) => AttachIcons.link(c),
  zoom: (c) => AttachIcons.link(c),
  airtable: (c) => AttachIcons.sheet(c),
  typeform: (c) => AttachIcons.link(c),
  miro: (c) => AttachIcons.link(c),
  whimsical: (c) => AttachIcons.link(c),
  googledoc: (c) => AttachIcons.gdrive(c),
  googlesheet: (c) => AttachIcons.gdrive(c),
  googleslides: (c) => AttachIcons.gdrive(c),
  confluence: (c) => AttachIcons.doc(c),
  jira: (c) => AttachIcons.link(c),
  linear: (c) => AttachIcons.link(c),
  vercel: (c) => AttachIcons.link(c),
};

export const FILE_TYPE_META = {
  pdf:     { icon: (c) => AttachIcons.pdf(c),     color: "#ef5350", label: "PDF" },
  image:   { icon: (c) => AttachIcons.image(c),   color: "#4fc3f7", label: "Image" },
  video:   { icon: (c) => AttachIcons.video(c),   color: "#ce93d8", label: "Video" },
  audio:   { icon: (c) => AttachIcons.audio(c),   color: "#80cbc4", label: "Audio" },
  doc:     { icon: (c) => AttachIcons.doc(c),     color: "#90caf9", label: "Doc" },
  sheet:   { icon: (c) => AttachIcons.sheet(c),   color: "#a5d6a7", label: "Sheet" },
  archive: { icon: (c) => AttachIcons.archive(c), color: "#ffb74d", label: "Archive" },
  figma:   { icon: (c) => AttachIcons.figma(c),   color: "#a259ff", label: "Figma" },
  github:  { icon: (c) => AttachIcons.github(c),  color: "#e2e8f0", label: "GitHub" },
  notion:  { icon: (c) => AttachIcons.notion(c),  color: "#fff",    label: "Notion" },
  gdrive:  { icon: (c) => AttachIcons.gdrive(c),  color: "#4fc3f7", label: "Drive" },
  link:    { icon: (c) => AttachIcons.link(c),    color: "#888",    label: "Link" },
};

export const ATTACHMENT_PRESETS = [
  { group: "Design", items: [
    { label: "Figma File",      icon: (c) => AttachIcons.figma(c),      fileType: "figma",  placeholder: "https://figma.com/file/..." },
    { label: "Figma Prototype", icon: (c) => AttachIcons.figma(c),      fileType: "figma",  placeholder: "https://figma.com/proto/..." },
    { label: "Miro Board",      icon: (c) => AttachIcons.miro(c),       fileType: "link",   placeholder: "https://miro.com/app/board/..." },
    { label: "Whimsical",       icon: (c) => AttachIcons.whimsical(c),  fileType: "link",   placeholder: "https://whimsical.com/..." },
  ]},
  { group: "Docs", items: [
    { label: "Google Doc",      icon: (c) => AttachIcons.googledoc(c),    fileType: "gdrive", placeholder: "https://docs.google.com/..." },
    { label: "Google Sheet",    icon: (c) => AttachIcons.googlesheet(c),  fileType: "gdrive", placeholder: "https://docs.google.com/spreadsheets/..." },
    { label: "Google Slides",   icon: (c) => AttachIcons.googleslides(c), fileType: "gdrive", placeholder: "https://docs.google.com/presentation/..." },
    { label: "Notion Page",     icon: (c) => AttachIcons.notion(c),      fileType: "notion", placeholder: "https://notion.so/..." },
    { label: "Confluence",      icon: (c) => AttachIcons.confluence(c),   fileType: "doc",    placeholder: "https://confluence.atlassian.com/..." },
    { label: "PDF",             icon: (c) => AttachIcons.pdf(c),         fileType: "pdf",    placeholder: "https://..." },
  ]},
  { group: "Dev", items: [
    { label: "GitHub Repo",     icon: (c) => AttachIcons.github(c),    fileType: "github", placeholder: "https://github.com/..." },
    { label: "GitHub PR",       icon: (c) => AttachIcons.github(c),    fileType: "github", placeholder: "https://github.com/.../pull/..." },
    { label: "GitHub Issue",    icon: (c) => AttachIcons.github(c),    fileType: "github", placeholder: "https://github.com/.../issues/..." },
    { label: "Jira Ticket",     icon: (c) => AttachIcons.jira(c),      fileType: "link",   placeholder: "https://jira.atlassian.com/..." },
    { label: "Linear Issue",    icon: (c) => AttachIcons.linear(c),    fileType: "link",   placeholder: "https://linear.app/..." },
    { label: "Vercel Deploy",   icon: (c) => AttachIcons.vercel(c),    fileType: "link",   placeholder: "https://vercel.com/..." },
  ]},
  { group: "Media", items: [
    { label: "YouTube Video",   icon: (c) => AttachIcons.youtube(c),   fileType: "video",  placeholder: "https://youtube.com/watch?v=..." },
    { label: "Loom Recording",  icon: (c) => AttachIcons.loom(c),      fileType: "video",  placeholder: "https://loom.com/share/..." },
    { label: "Vimeo Video",     icon: (c) => AttachIcons.vimeo(c),     fileType: "video",  placeholder: "https://vimeo.com/..." },
    { label: "Image",           icon: (c) => AttachIcons.image(c),     fileType: "image",  placeholder: "https://..." },
    { label: "Audio File",      icon: (c) => AttachIcons.audio(c),     fileType: "audio",  placeholder: "https://..." },
  ]},
  { group: "Tools", items: [
    { label: "Slack Message",   icon: (c) => AttachIcons.slack(c),     fileType: "link",   placeholder: "https://app.slack.com/..." },
    { label: "Zoom Meeting",    icon: (c) => AttachIcons.zoom(c),      fileType: "link",   placeholder: "https://zoom.us/j/..." },
    { label: "Airtable Base",   icon: (c) => AttachIcons.airtable(c),  fileType: "sheet",  placeholder: "https://airtable.com/..." },
    { label: "Typeform",        icon: (c) => AttachIcons.typeform(c),  fileType: "link",   placeholder: "https://typeform.com/..." },
    { label: "Archive / ZIP",   icon: (c) => AttachIcons.archive(c),   fileType: "archive",placeholder: "https://..." },
    { label: "Custom Link",     icon: (c) => AttachIcons.link(c),      fileType: "link",   placeholder: "https://..." },
  ]},
];