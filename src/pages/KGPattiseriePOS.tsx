import { useState, useRef, useEffect } from "react";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfWeek(year, month) { const d = new Date(year, month, 1).getDay(); return (d + 6) % 7; }

// ─── TYPE REGISTRY ────────────────────────────────────────────────────────────
const TYPE_META = {
  habit:       { label: (ev) => `↻ ${ev.recurrence === "daily" ? "daily" : "weekly"}`, badgeColor: null,      badgeBorder: null,         badgeBg: null,          cardBg: "#0a0f0a", checkRadius: "50%",         sectionLabel: "Today's target" },
  task:        { label: () => "✓ task",        badgeColor: "#888",    badgeBorder: "#2a2a2a",    badgeBg: "transparent", cardBg: "#0d0d0d", checkRadius: "0",           sectionLabel: "Task" },
  meeting:     { label: () => "⊞ meeting",     badgeColor: "#4fc3f7", badgeBorder: "#4fc3f733",  badgeBg: "#4fc3f711",   cardBg: "#0a0c10", checkRadius: "3px",         sectionLabel: "Agenda" },
  reminder:    { label: () => "◎ reminder",    badgeColor: "#ffb74d", badgeBorder: "#ffb74d33",  badgeBg: "#ffb74d11",   cardBg: "#100d0a", checkRadius: "50%",         sectionLabel: "Reminder" },
  deadline:    { label: () => "⚑ deadline",    badgeColor: "#ef5350", badgeBorder: "#ef535033",  badgeBg: "#ef535011",   cardBg: "#100a0a", checkRadius: "0",           sectionLabel: "Deliverable" },
  appointment: { label: () => "✦ appt",        badgeColor: "#ce93d8", badgeBorder: "#ce93d833",  badgeBg: "#ce93d811",   cardBg: "#0a0a10", checkRadius: "50% 0 50% 0", sectionLabel: "Details" },
  focus:       { label: () => "◈ focus",       badgeColor: "#69f0ae", badgeBorder: "#69f0ae33",  badgeBg: "#69f0ae11",   cardBg: "#091009", checkRadius: "2px",         sectionLabel: "Focus goal" },
  review:      { label: () => "⊙ review",      badgeColor: "#80cbc4", badgeBorder: "#80cbc433",  badgeBg: "#80cbc411",   cardBg: "#090f0f", checkRadius: "50%",         sectionLabel: "Review scope" },
  training:    { label: () => "▷ training",    badgeColor: "#4db6ac", badgeBorder: "#4db6ac33",  badgeBg: "#4db6ac11",   cardBg: "#090e0d", checkRadius: "0 50% 50% 0", sectionLabel: "Learning goal" },
  travel:      { label: () => "→ travel",      badgeColor: "#90caf9", badgeBorder: "#90caf933",  badgeBg: "#90caf911",   cardBg: "#090b10", checkRadius: "50% 50% 0 0", sectionLabel: "Itinerary" },
  medical:     { label: () => "♥ medical",     badgeColor: "#ef9a9a", badgeBorder: "#ef9a9a33",  badgeBg: "#ef9a9a11",   cardBg: "#100909", checkRadius: "50%",         sectionLabel: "Visit details" },
  workout:     { label: () => "◉ workout",     badgeColor: "#a5d6a7", badgeBorder: "#a5d6a733",  badgeBg: "#a5d6a711",   cardBg: "#091009", checkRadius: "50%",         sectionLabel: "Today's session" },
  birthday:    { label: () => "★ birthday",    badgeColor: "#f48fb1", badgeBorder: "#f48fb133",  badgeBg: "#f48fb111",   cardBg: "#100a0c", checkRadius: "50%",         sectionLabel: "Celebration" },
  errand:      { label: () => "◻ errand",      badgeColor: "#ffe082", badgeBorder: "#ffe08233",  badgeBg: "#ffe08211",   cardBg: "#100f09", checkRadius: "0",           sectionLabel: "Errand" },
  social:      { label: () => "♦ social",      badgeColor: "#ff8a65", badgeBorder: "#ff8a6533",  badgeBg: "#ff8a6511",   cardBg: "#100b09", checkRadius: "50% 0",       sectionLabel: "Plan" },
  goal:        { label: () => "◆ goal",        badgeColor: "#fff176", badgeBorder: "#fff17633",  badgeBg: "#fff17611",   cardBg: "#0f0f09", checkRadius: "50%",         sectionLabel: "Goal check" },
  blocklist:   { label: () => "⊘ blocked",     badgeColor: "#546e7a", badgeBorder: "#546e7a55",  badgeBg: "#546e7a11",   cardBg: "#090a0b", checkRadius: "0",           sectionLabel: "Protected time" },
  easy:        { label: () => "easy",          badgeColor: "#f5c842", badgeBorder: "#f5c84255",  badgeBg: "#f5c84211",   cardBg: "#0f0d08", checkRadius: "50%", sectionLabel: "Shift details" },
  note:        { label: () => "§ note",        badgeColor: "#e2e8f0", badgeBorder: "#e2e8f033",  badgeBg: "#e2e8f008",   cardBg: "#0c0c0e", checkRadius: "2px", sectionLabel: "Capture", writing: true, accent: "#e2e8f0", icon: "§" },
  article:     { label: () => "¶ article",     badgeColor: "#93c5fd", badgeBorder: "#93c5fd33",  badgeBg: "#93c5fd08",   cardBg: "#080c12", checkRadius: "2px", sectionLabel: "Angle",   writing: true, accent: "#93c5fd", icon: "¶" },
  doc:         { label: () => "# doc",         badgeColor: "#86efac", badgeBorder: "#86efac33",  badgeBg: "#86efac08",   cardBg: "#080e0a", checkRadius: "2px", sectionLabel: "Scope",   writing: true, accent: "#86efac", icon: "#" },
  journal:     { label: () => "~ journal",     badgeColor: "#fca5a5", badgeBorder: "#fca5a533",  badgeBg: "#fca5a508",   cardBg: "#0e0808", checkRadius: "2px", sectionLabel: "Prompt",  writing: true, accent: "#fca5a5", icon: "~" },
  draft:       { label: () => "/ draft",       badgeColor: "#d8b4fe", badgeBorder: "#d8b4fe33",  badgeBg: "#d8b4fe08",   cardBg: "#0a0810", checkRadius: "2px", sectionLabel: "Draft",   writing: true, accent: "#d8b4fe", icon: "/" },
  project:     { label: () => "◎ project",    badgeColor: "#fb923c", badgeBorder: "#fb923c33",  badgeBg: "#fb923c08",   cardBg: "#0e0a07", checkRadius: "2px", sectionLabel: "Project", writing: false, accent: "#fb923c", icon: "◎" },
  spending:    { label: () => "$ spend",      badgeColor: "#ef5350", badgeBorder: "#ef535033",  badgeBg: "#ef535011",   cardBg: "#100a0a", checkRadius: "0",   sectionLabel: "Spend" },
  income_ev:   { label: () => "↑ income",     badgeColor: "#69f0ae", badgeBorder: "#69f0ae33",  badgeBg: "#69f0ae11",   cardBg: "#091009", checkRadius: "0",   sectionLabel: "Income" },
};

// ─── EVENT DATA ───────────────────────────────────────────────────────────────
const events = {
  16: {
    Morning: [
      { type: "habit", title: "Morning Run", color: "#34a853", duration: "45 min", youtube: "DsOTMcivYuo", task: "Run 5km along the riverside trail without stopping.", why: "Cardio first thing boosts metabolism, sharpens focus, and sets a disciplined tone for the entire day.", how: ["Lay out your running clothes the night before.", "Start slow for the first 5 minutes to warm up.", "Maintain a conversational pace.", "Stretch hamstrings and calves immediately after."], tools: "Running shoes, water bottle, GPS watch or phone" },
      { type: "focus", title: "Deep Work: Product Spec", time: "9:00 AM", color: "#69f0ae", duration: "2 hrs", task: "Write the full technical spec for the new notifications system — no interruptions.", why: "Complex thinking requires unbroken attention. Two focused hours outperform six scattered ones.", how: ["Phone on DND. Close Slack and email.", "Write the outline in the first 15 minutes before filling in details.", "Use the Pomodoro method: 50 min on, 10 min off.", "Don't stop to perfect — write first, edit after."], tools: "Notion, noise-cancelling headphones, water" },
    ],
    Afternoon: [
      { type: "errand", title: "Grocery Shopping", time: "1:00 PM", color: "#ffe082", duration: "1 hr", task: "Buy weekly groceries for healthy meal prep.", why: "Stocking the right food means you won't default to junk. Your diet is decided at the store, not at home.", how: ["Bring your pre-written list — no impulse buying.", "Shop the perimeter first (produce, protein, dairy).", "Avoid the middle aisles unless specifically needed.", "Check expiry dates on perishables."], tools: "Shopping list, reusable bags, loyalty card" },
      { type: "blocklist", title: "No Meetings Block", time: "2:00 PM", color: "#546e7a", duration: "2 hrs", task: "Protected time for solo work — decline any meeting invites during this window.", why: "Calendar fragmentation is the silent killer of deep work. Blocking time is the only way to guarantee it.", how: ["Mark as busy in Google Calendar with a clear title.", "Set auto-reply or Slack status: 'In focus mode until 4 PM'.", "Prepare your task list before the block starts.", "Do NOT check email until the block ends."], tools: "Calendar, Slack status" },
    ],
    Evening: [
      { type: "social", title: "Book Club", time: "7:00 PM", color: "#ff8a65", duration: "2 hrs", task: "Discuss 'Piranesi' by Susanna Clarke with the group.", why: "Deep reading and group discussion build critical thinking, empathy, and keep your mind sharp outside of work.", how: ["Finish reading chapters 8–12 before arriving.", "Prepare 2–3 talking points or questions.", "Listen actively before responding.", "Take notes on others' interpretations."], tools: "Book, notebook, pen" },
      { type: "note", title: "Book Club Takeaways", time: "9:00 PM", color: "#e2e8f0", duration: "15 min", wordGoal: 150, tags: ["reading", "ideas"], prompt: "What's the one idea from tonight's discussion I keep thinking about?", content: "" },
      { type: "journal", title: "Evening Reflection", time: "9:30 PM", color: "#fca5a5", duration: "20 min", wordGoal: 300, tags: ["personal", "daily"], prompt: "What made today worth it? What would I do differently?", content: "" },
    ],
  },
  17: {
    Morning: [
      { type: "easy", title: "Morning Shift — Easy", time: "8:00 AM", color: "#f5c842", duration: "4 hrs", task: "Open the station, set up the essence displays, and handle the morning client flow.", why: "The morning sets the tone for the entire store day. A clean, well-organized opening means smoother sales and happier clients.", how: ["Arrive 10 min early — unlock, lights on, music low.", "Restock any low bottles from last night's inventory sheet.", "Wipe down the tester strips and refill the scent blotter tray.", "Log opening stock counts before the first customer arrives."], tools: "Inventory sheet, cleaning cloth, stock log, POS system" },
      { type: "meeting", title: "Team Standup", time: "9:00 AM", color: "#4fc3f7", duration: "30 min", task: "Report yesterday's progress, today's plan, and current blockers.", why: "Alignment prevents duplicate work and surfaces blockers early.", how: ["Prepare your update before joining — don't wing it.", "Be specific: 'Finished auth PR, blocked on API keys from DevOps'.", "Flag blockers with an owner and deadline.", "Keep it under 2 minutes per person."], tools: "Zoom, Jira board, Slack" },
      { type: "review", title: "Code Review", time: "10:30 AM", color: "#80cbc4", duration: "1 hr", youtube: "TzudD0BPbSA", task: "Review Tom's dashboard redesign PR with focus on performance.", why: "Code review catches bugs, spreads knowledge, and maintains standards.", how: ["Pull the branch locally and run it first.", "Check for N+1 queries, unnecessary re-renders.", "Leave constructive comments with suggestions, not just problems.", "Approve only when you'd be comfortable owning that code."], tools: "GitHub, VS Code, Chrome DevTools" },
    ],
    Afternoon: [
      { type: "social", title: "Lunch with Alex", time: "12:30 PM", color: "#ff8a65", duration: "1 hr", task: "Catch up on the new project proposal over lunch.", why: "Relationships are built between meetings. Informal time creates trust.", how: ["Put your phone away.", "Ask about his perspective on the new proposal first.", "Listen more than you talk.", "Follow up with an email summary of any decisions made."], tools: "Notepad for key ideas" },
      { type: "meeting", title: "Product Demo", time: "3:00 PM", color: "#4fc3f7", duration: "1 hr", task: "Demo the new onboarding flow to stakeholders.", why: "Live demos build confidence and surface real feedback faster than written specs.", how: ["Test the demo environment 30 min before — never wing a live demo.", "Start with the problem, then show the solution.", "Pause for questions after each major section.", "End with a clear next step or decision needed."], tools: "Figma prototype, slide deck, screen share" },
    ],
    Evening: [
      { type: "habit", title: "Yoga Class", color: "#9c27b0", duration: "1 hr", youtube: "v7AYKMP6rOE", task: "Attend Vinyasa flow class at Zen Studio.", why: "Evening yoga down-regulates the nervous system and improves sleep quality.", how: ["Arrive 10 minutes early to settle in.", "Silence your phone completely.", "Focus on breath, not perfection of form.", "Stay for the full savasana — don't rush out."], tools: "Yoga mat, water bottle, comfortable clothes" },
    ],
  },
  18: {
    Morning: [
      { type: "travel", title: "Flight to NYC", time: "6:00 AM", color: "#90caf9", duration: "3 hrs", task: "Fly JFK — Gate B22. Boarding at 5:40 AM.", why: "Being on time for flights is non-negotiable. Missing a connection cascades into a ruined day.", how: ["Leave home by 4:00 AM latest.", "Check in online the night before.", "Bring laptop + charger in carry-on.", "Screenshot boarding pass — don't rely on internet."], tools: "Passport, boarding pass, carry-on bag" },
      { type: "appointment", title: "Dentist Appointment", time: "8:00 AM", color: "#ce93d8", duration: "1 hr", task: "Attend routine dental cleaning at Dr. Kim's office.", why: "Oral health is directly linked to heart health. A 1-hour appointment every 6 months prevents thousands in future costs.", how: ["Brush and floss before leaving home.", "Bring your insurance card and ID.", "Write down any tooth sensitivity or pain to mention.", "Ask about fluoride treatment options."], tools: "Insurance card, ID, list of concerns" },
    ],
    Afternoon: [
      { type: "review", title: "Design Review", time: "2:00 PM", color: "#80cbc4", duration: "1.5 hrs", task: "Review new component library — color system and spacing.", why: "Design consistency reduces decision fatigue and creates a coherent user experience.", how: ["Come with specific feedback — not just 'it looks off'.", "Reference the design system documentation.", "Focus on accessibility contrast ratios.", "Agree on a single source of truth before leaving."], tools: "Figma, Storybook, design token docs" },
      { type: "meeting", title: "Client Call", time: "4:30 PM", color: "#4fc3f7", duration: "45 min", task: "Q3 roadmap discussion with Acme Corp.", why: "Regular client alignment prevents scope creep.", how: ["Send agenda 24 hours in advance.", "Start with a recap of last call's action items.", "Use screen share if presenting the timeline.", "Confirm next steps and owners before hanging up."], tools: "Google Meet, timeline doc, Notion notes" },
    ],
    Evening: [],
  },
  19: {
    Morning: [
      { type: "meeting", title: "Sprint Planning", time: "9:00 AM", color: "#4fc3f7", duration: "2 hrs", task: "Plan and commit to the next two-week sprint scope.", why: "A well-planned sprint prevents mid-sprint chaos.", how: ["Pull last sprint's velocity before the meeting.", "Break every story into sub-tasks under 4 hours.", "Don't commit to more than 80% capacity.", "Assign owners to every ticket before closing."], tools: "Jira, velocity chart, team calendar" },
      { type: "article", title: "Write: The Future of Scent UX", time: "10:00 AM", color: "#93c5fd", duration: "1.5 hrs", wordGoal: 800, tags: ["UX", "fragrance", "product"], prompt: "How does smell change the way people experience digital products — and what can designers learn from essence stations?", content: "" },
      { type: "goal", title: "Q3 Goal Check-in", time: "11:00 AM", color: "#fff176", duration: "30 min", task: "Review Q3 OKRs — score progress on each key result.", why: "Goals without review are wishes. A monthly check-in is what separates intentions from outcomes.", how: ["Open your OKR doc and score each KR from 0.0 to 1.0.", "Write one sentence on what's blocking any KR below 0.7.", "Identify one action to unlock the most stuck KR.", "Share update with your manager before EOD."], tools: "OKR doc, Notion, calendar reminder for next check-in" },
    ],
    Afternoon: [
      { type: "easy", title: "Essence Restocking — Easy", time: "5:00 PM", color: "#f5c842", duration: "1 hr", task: "Restock the display shelves from the back inventory and update the stock log.", why: "Empty shelves and missing testers lose sales silently. A weekly restock keeps the floor looking premium.", how: ["Pull the low-stock report from the POS before starting.", "Bring out the new bottles from the storage room in order of fragrance family.", "Replace testers with fresh strips and re-label if needed.", "Update the stock log and flag any items that need to be ordered."], tools: "Stock log, POS system, labeler, cleaning cloth" },
      { type: "meeting", title: "1:1 with Manager", time: "2:00 PM", color: "#4fc3f7", duration: "30 min", task: "Discuss promotion timeline, last quarter feedback, and team dynamics.", why: "1:1s are your primary lever for career growth. Managers can't advocate for what they don't know.", how: ["Come with a written agenda — don't let it become a status update.", "Lead with the promotion conversation directly.", "Ask for specific, actionable feedback.", "End by confirming what she's going to do and what you're going to do."], tools: "Notes doc, list of accomplishments, questions prepared" },
      { type: "training", title: "System Design Course", time: "3:30 PM", color: "#4db6ac", duration: "1.5 hrs", task: "Complete Module 4: Distributed Systems & CAP Theorem.", why: "Structured learning compounds. One module a week puts you ahead of 90% of engineers who only learn on the job.", how: ["No multitasking — close all other tabs.", "Take notes in your own words, not copy-paste.", "Pause and replay any section you don't fully understand.", "Write a 3-sentence summary after the module ends."], tools: "Laptop, course platform, notebook" },
    ],
    Evening: [
      { type: "social", title: "Team Dinner", time: "7:30 PM", color: "#ff8a65", duration: "2 hrs", task: "Join team dinner at Nobu — reservation under 'Martinez'.", why: "Team culture is built outside the office. One good dinner creates more trust than months of Slack messages.", how: ["Arrive on time — it's rude to keep a group waiting.", "No work talk for at least the first hour.", "Pick up a round of drinks if budget allows.", "Thank the organizer publicly."], tools: "Smart-casual outfit, credit card" },
    ],
  },
  20: {
    Morning: [
      { type: "workout", title: "Leg Day", time: "7:00 AM", color: "#a5d6a7", duration: "1 hr", youtube: "IODxDxX7oi4", task: "Complete leg day: squats, lunges, deadlifts, cardio finisher.", why: "Consistent strength training improves energy, posture, metabolism, and mental resilience.", how: ["Warm up with 5 min light bike or treadmill.", "Squats: 4 sets x 8 reps at 70% max.", "Romanian deadlifts: 3 sets x 10.", "Finish with 10 min incline walk.", "Log it in your training app."], tools: "Gym bag, lifting belt, water bottle, training log" },
      { type: "doc", title: "API Auth Documentation", time: "8:00 AM", color: "#86efac", duration: "1 hr", wordGoal: 500, tags: ["engineering", "auth", "internal"], prompt: "Document the OAuth2 token flow for the new API — cover setup, refresh logic, and error handling.", content: "" },
      { type: "deadline", title: "Q3 Report Due", time: "11:59 PM", color: "#ef5350", duration: "—", task: "Submit the completed Q3 performance report to the executive team.", why: "Missing deadlines erodes trust faster than any other professional failure.", how: ["Final review at 10 AM sharp.", "Export from Looker as PDF.", "Send to exec-reports@company.com with a one-line summary.", "Confirm delivery receipt."], tools: "Looker, Google Docs, email" },
      { type: "task", title: "Weekly Report", time: "9:30 AM", color: "#4285f4", duration: "1 hr", task: "Compile weekly metrics from Looker and send to stakeholders by 11 AM.", why: "Visibility is currency. Stakeholders who don't see your output assume you're not producing.", how: ["Open last week's report as a template.", "Pull KPIs from Looker: DAU, retention, conversion.", "Write a 3-sentence executive summary at the top.", "Send by 11 AM sharp — late reports get ignored."], tools: "Looker, Google Docs, email" },
    ],
    Afternoon: [
      { type: "habit", title: "Lunch Break Walk", color: "#34a853", duration: "30 min", task: "Take a screen-free walk through City Park.", why: "A 30-minute walk mid-day reduces cortisol, restores attention, and prevents the 2 PM energy crash.", how: ["Leave your phone at your desk.", "Walk at a comfortable pace — this is recovery.", "Notice your surroundings intentionally.", "Return before your next meeting."], tools: "Comfortable shoes, nothing else" },
    ],
    Evening: [
      { type: "reminder", title: "Call Mom", time: "6:00 PM", color: "#ffb74d", duration: "30 min", task: "Check in for her post-surgery recovery update.", why: "Family health moments don't pause for your schedule. A 30-minute call means everything to her.", how: ["Call, don't text.", "Ask specific questions — 'how's the pain?' not 'how are you?'.", "Listen more than you reassure."], tools: "Phone" },
      { type: "task", title: "Movie Night", time: "8:00 PM", color: "#9c27b0", duration: "2.5 hrs", task: "Watch Dune Part Two — full film, no interruptions.", why: "Rest is productive. Fully switching off prevents burnout and keeps leisure actually restful.", how: ["Make popcorn before it starts — no pausing mid-film.", "Dim all lights for the full cinematic effect.", "No second screen. Phone face down.", "Go to bed within 30 min of finishing."], tools: "TV/projector, popcorn, blanket" },
    ],
  },
  21: {
    Morning: [
      { type: "birthday", title: "Dad's Birthday 🎂", time: "All day", color: "#f48fb1", duration: "—", task: "It's Dad's 62nd birthday. Call him, send the gift, and plan the dinner.", why: "Birthdays are one of the few moments where showing up fully — not just sending a text — actually matters.", how: ["Call at 9 AM before his day gets busy.", "Confirm the restaurant reservation for 7 PM.", "Pick up the card you forgot to mail.", "Make it about him — no work talk."], tools: "Phone, restaurant reservation, gift" },
      { type: "medical", title: "Blood Test", time: "8:30 AM", color: "#ef9a9a", duration: "30 min", task: "Fasting blood panel at LabCorp — annual checkup bloodwork.", why: "Annual bloodwork catches problems years before symptoms appear. This is the cheapest health insurance you have.", how: ["Fast for 12 hours beforehand — water only.", "Bring ID and insurance card.", "Request a printed copy of results.", "Follow up with Dr. Singh if anything is flagged."], tools: "ID, insurance card, lab order from Dr. Singh" },
    ],
    Afternoon: [
      { type: "draft", title: "Newsletter: October Edition", time: "12:00 PM", color: "#d8b4fe", duration: "1 hr", wordGoal: 600, tags: ["newsletter", "community"], prompt: "Start with what surprised you most this month — lead with a hook, not a summary.", content: "" },
      { type: "focus", title: "Deep Work: Architecture Docs", time: "1:00 PM", color: "#69f0ae", duration: "2 hrs", task: "Write the system architecture document for the new microservices migration.", why: "Architecture decisions made without documentation become tribal knowledge that breaks when people leave.", how: ["Start with a diagram before writing prose.", "Use C4 model: Context → Containers → Components.", "Link to all relevant ADRs.", "Get review from at least one other senior engineer before publishing."], tools: "Confluence, draw.io, headphones" },
      { type: "errand", title: "Post Office + Pharmacy", time: "3:30 PM", color: "#ffe082", duration: "45 min", task: "Mail the birthday package to Sarah and pick up prescription refill.", why: "Batching errands saves 30+ minutes vs doing them separately.", how: ["Print the shipping label before leaving.", "Bring the prescription number for the pharmacy.", "Pay with the card that has cashback on errands.", "Done by 4:15 PM to avoid rush hour."], tools: "Package, shipping label, prescription number" },
    ],
    Evening: [
      { type: "social", title: "Dad's Birthday Dinner", time: "7:00 PM", color: "#ff8a65", duration: "2.5 hrs", task: "Family dinner at Carbone — reservation for 6 under 'Martinez'.", why: "This is a milestone birthday. Be fully present — no work emergencies, no phone on the table.", how: ["Arrive 5 min early, not on time.", "Let Dad order first and choose the bottle of wine.", "Give the toast — you wrote it, use it.", "Pick up the bill without making it a moment."], tools: "Reservation confirmation, card, good attitude" },
    ],
  },
  22: {
    Morning: [
      { type: "workout", title: "Easy Run", time: "7:30 AM", color: "#a5d6a7", duration: "45 min", task: "Easy 5K recovery run at a comfortable pace.", why: "Weekend runs reset the week mentally and physically. No watch, no targets — just movement.", how: ["Leave the GPS watch at home.", "Run by feel — slow is fine.", "Take the scenic route through the park.", "Stretch for 10 min when you're back."], tools: "Running shoes, AirPods" },
    ],
    Afternoon: [],
    Evening: [
      { type: "goal", title: "Weekly Review", time: "5:00 PM", color: "#fff176", duration: "45 min", task: "Review the week: what shipped, what didn't, and what Monday's top 3 priorities are.", why: "Monday starts on Sunday. 45 minutes of structured review prevents the chaos that derails the first day.", how: ["Review your calendar for all of last week.", "Score each of your 3 priorities: done / partial / missed.", "Write Monday's top 3 before closing the laptop.", "Clear your inbox to inbox zero or flag what needs action."], tools: "Calendar, Notion, email" },
      { type: "blocklist", title: "No Screens After 9 PM", time: "9:00 PM", color: "#546e7a", duration: "Until sleep", task: "Protected wind-down time — no phone, no laptop, no TV after 9 PM.", why: "Blue light and stimulating content push sleep onset back by 1–2 hours. Protecting this window is the highest-leverage sleep intervention.", how: ["Put phone on night mode and face-down at 9 PM.", "Read physical book or journal instead.", "Dim all lights to 30% or lower.", "In bed by 10:30 PM."], tools: "Book, journal, pen, sleep mask" },
    ],
  },
};

// ─── HABITS ───────────────────────────────────────────────────────────────────
const HABITS = [
  {
    type: "habit", recurrence: "daily", title: "Self-Care Ritual", color: "#f48fb1", duration: "1h 30min", part: "Dawn",
    time: "3:00 AM",
    task: "Complete your full morning self-care ritual before the world wakes up.",
    why: "How you treat yourself in the first 90 minutes sets the tone for your entire day. This time belongs entirely to you.",
    subtasks: [
      { id:"sc1",  time:"3:00", label:"Wake up — drink a full glass of water immediately. No snooze." },
      { id:"sc2",  time:"3:05", label:"Wash face with cold water to fully wake up." },
      { id:"sc3",  time:"3:10", label:"Brush teeth & tongue scrape." },
      { id:"sc4",  time:"3:15", label:"Cleanser — wash face thoroughly." },
      { id:"sc5",  time:"3:20", label:"Toner — apply with cotton pad." },
      { id:"sc6",  time:"3:25", label:"Moisturizer — let it absorb for a minute." },
      { id:"sc7",  time:"3:30", label:"Shower — body wash, scrub, and condition hair." },
      { id:"sc8",  time:"3:50", label:"Body lotion — apply while skin is still damp." },
      { id:"sc9",  time:"4:00", label:"Hair care — comb, style, or wrap for the day." },
      { id:"sc10", time:"4:15", label:"Get dressed — clothes laid out the night before." },
      { id:"sc11", time:"4:25", label:"Final mirror check. You're ready." },
      { id:"sc12", time:"4:30", label:"Sit quietly. One moment of stillness before the day begins." },
    ],
    tools: "Skincare products, hairbrush, body lotion, fresh clothes",
  },
  {
    type: "habit", recurrence: "daily", title: "Night Self-Care Ritual", color: "#ce93d8", duration: "1h 30min", part: "Evening",
    time: "4:30 PM",
    task: "Wind down with your full night self-care ritual. In bed by 6 PM for a full 9-hour sleep before your 3 AM wake-up.",
    why: "Sleep is the foundation of everything. A proper wind-down ritual signals your nervous system to shift into recovery mode and protects the quality of your 9-hour sleep window.",
    subtasks: [
      { id:"ns1",  label:"Dim the lights and put your phone on Do Not Disturb." },
      { id:"ns2",  label:"Remove makeup fully — micellar water, then cleanser." },
      { id:"ns3",  label:"Exfoliate (2–3x per week) or rinse with lukewarm water." },
      { id:"ns4",  label:"Toner — apply gently with cotton pad or fingertips." },
      { id:"ns5",  label:"Serum — vitamin C or retinol depending on your rotation." },
      { id:"ns6",  label:"Eye cream — tap gently around the orbital bone." },
      { id:"ns7",  label:"Night moisturizer or sleeping mask — let it sink in." },
      { id:"ns8",  label:"Lip balm — hydrate overnight." },
      { id:"ns9",  label:"Body lotion — focus on hands, elbows, and knees." },
      { id:"ns10", label:"Brush teeth, floss, and mouthwash." },
      { id:"ns11", label:"Lay out tomorrow's clothes and prep your bag." },
      { id:"ns12", label:"In bed by 6 PM. No screens. Eyes closed." },
    ],
    tools: "Makeup remover, skincare routine products, lip balm, body lotion, toothbrush",
  },
  { type: "habit", recurrence: "daily", title: "Morning Run", color: "#34a853", duration: "45 min", part: "Morning", youtube: "DsOTMcivYuo", task: "Run 5km along the riverside trail without stopping.", why: "Cardio first thing boosts metabolism, sharpens focus, and sets a disciplined tone.", how: ["Lay out your running clothes the night before.", "Start slow for the first 5 minutes.", "Maintain a conversational pace.", "Stretch hamstrings and calves immediately after."], tools: "Running shoes, water bottle, GPS watch" },
  { type: "habit", recurrence: "daily", title: "Lunch Break Walk", color: "#34a853", duration: "30 min", part: "Afternoon", task: "Take a screen-free walk through City Park.", why: "A 30-minute walk mid-day reduces cortisol, restores attention, and prevents the 2 PM energy crash.", how: ["Leave your phone at your desk.", "Walk at a comfortable pace — this is recovery.", "Notice your surroundings intentionally.", "Return before your next meeting."], tools: "Comfortable shoes, nothing else" },
  { type: "habit", recurrence: "weekly", days: [1, 3, 5], title: "Gym", color: "#34a853", duration: "1 hr", part: "Morning", youtube: "IODxDxX7oi4", task: "Complete leg day: squats, lunges, deadlifts, cardio finisher.", why: "Consistent strength training improves energy, posture, metabolism, and mental resilience.", how: ["Warm up with 5 min light bike.", "Squats: 4x8 at 70% max.", "Romanian deadlifts: 3x10.", "Finish with 10 min incline walk.", "Log it."], tools: "Gym bag, lifting belt, water bottle, training log" },
  { type: "habit", recurrence: "weekly", days: [0, 6], title: "Weekly Review", color: "#4285f4", duration: "45 min", part: "Evening", task: "Review the week and set Monday's top 3 priorities.", why: "Monday starts on Sunday. Structured review prevents the chaos that derails the first day.", how: ["Review calendar for all of last week.", "Write Monday's top 3 priorities.", "Draft standup notes.", "Clear your inbox to inbox zero."], tools: "Calendar, Notion, email" },
  { type: "habit", recurrence: "weekly", days: [2, 4], title: "Yoga Class", color: "#9c27b0", duration: "1 hr", part: "Evening", youtube: "v7AYKMP6rOE", task: "Attend Vinyasa flow class at Zen Studio.", why: "Evening yoga down-regulates the nervous system and improves sleep quality.", how: ["Arrive 10 minutes early to settle in.", "Silence your phone completely.", "Focus on breath, not perfection of form.", "Stay for the full savasana."], tools: "Yoga mat, water bottle, comfortable clothes" },
  { type: "habit", recurrence: "weekly", days: [0, 1, 2, 3, 4, 6], title: "Moto to Work", color: "#ffb74d", duration: "commute", part: "Morning", task: "Pay 100 HTG moto to go to work, 100 HTG to get back. Total: 200 HTG/day.", why: "Daily commute cost. Track this consistently to monitor your monthly transport spending.", how: ["100 HTG going in the morning.", "100 HTG coming back in the evening.", "Total: 200 HTG per workday.", "Monthly estimate: ~5,200 HTG (26 workdays)."], tools: "200 HTG cash" },
];

// ─── DYNAMIC EVENT STORE ──────────────────────────────────────────────────────
const dynamicEvents = {};
function addDynamicEvent(year, month, day, part, ev) {
  const key = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  if (!dynamicEvents[key]) dynamicEvents[key] = { Dawn: [], Morning: [], Afternoon: [], Evening: [] };
  dynamicEvents[key][part].push(ev);
}

// ─── LOGIC ────────────────────────────────────────────────────────────────────
function getEventsForDay(year, month, day) {
  const dow = new Date(year, month, day).getDay();
  const base = events[day] || { Dawn: [], Morning: [], Afternoon: [], Evening: [] };
  const dateKey = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const dynDay = dynamicEvents[dateKey] || { Dawn: [], Morning: [], Afternoon: [], Evening: [] };
  const result = {
    Dawn:      [...(base.Dawn||[]),      ...(dynDay.Dawn||[])],
    Morning:   [...(base.Morning||[]),   ...(dynDay.Morning||[])],
    Afternoon: [...(base.Afternoon||[]), ...(dynDay.Afternoon||[])],
    Evening:   [...(base.Evening||[]),   ...(dynDay.Evening||[])],
  };
  HABITS.forEach(habit => {
    const applies = habit.recurrence === "daily" || (habit.recurrence === "weekly" && habit.days.includes(dow));
    if (applies && !result[habit.part].find(e => e.title === habit.title)) result[habit.part].push(habit);
  });
  // Inject money transactions for this day
  if (typeof txStore !== "undefined") {
    txStore.transactions.filter(tx => tx.isoDate === dateKey).forEach(tx => {
      const cat = (typeof SPEND_CATEGORIES !== "undefined") ? SPEND_CATEGORIES.find(c => c.id === tx.category) : null;
      const part = tx.part || "Afternoon";
      result[part].push({
        type: "spending",
        title: tx.label,
        color: cat ? cat.color : "#ef5350",
        amount: tx.amount,
        category: tx.category,
        _txId: tx.id,
        _cat: cat,
      });
    });
  }
  // Inject income entries for this day
  if (typeof incomeStore !== "undefined") {
    incomeStore.filter(e => e.isoDate === dateKey && e.sourceId !== "salary").forEach(entry => {
      const src = (typeof INCOME_SOURCES !== "undefined") ? INCOME_SOURCES.find(s => s.id === entry.sourceId) : null;
      const part = entry.part || "Morning";
      result[part].push({
        type: "income_ev",
        title: entry.label,
        color: src ? src.color : "#69f0ae",
        amount: entry.amount,
        sourceId: entry.sourceId,
        _src: src,
      });
    });
  }
  return Object.values(result).some(a => a.length > 0) ? result : null;
}

const habitCompletions = {};
function markHabit(title, dateKey, done) { if (done) habitCompletions[`${title}|${dateKey}`] = true; else delete habitCompletions[`${title}|${dateKey}`]; }
function isHabitDone(title, dateKey) { return !!habitCompletions[`${title}|${dateKey}`]; }

// ─── SUBTASK COMPLETIONS ─────────────────────────────────────────────────────
const subtaskCompletions = {};
function getSubtaskKey(evTitle, dateKey, subtaskId) { return `${evTitle}|${dateKey}|${subtaskId}`; }
function markSubtask(evTitle, dateKey, subtaskId, done) {
  const k = getSubtaskKey(evTitle, dateKey, subtaskId);
  if (done) subtaskCompletions[k] = true; else delete subtaskCompletions[k];
}
function isSubtaskDone(evTitle, dateKey, subtaskId) {
  return !!subtaskCompletions[getSubtaskKey(evTitle, dateKey, subtaskId)];
}
function allSubtasksDone(ev, dateKey) {
  if (!ev.subtasks || ev.subtasks.length === 0) return false;
  const allDone = ev.subtasks.every(st => isSubtaskDone(ev.title, dateKey, st.id));
  // Sync to habitCompletions for streak tracking
  if (allDone) habitCompletions[`${ev.title}|${dateKey}`] = true;
  else delete habitCompletions[`${ev.title}|${dateKey}`];
  return allDone;
}

// ─── OIL DROP ICON ───────────────────────────────────────────────────────────
function OilDropIcon({ size = 12, color = "#f5c842", filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3C12 3 5 11 5 15.5C5 19.09 8.13 22 12 22C15.87 22 19 19.09 19 15.5C19 11 12 3 12 3Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {!filled && (
        <path
          d="M9 14C9 12.5 10.2 11 11.5 10.5"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.6"
        />
      )}
    </svg>
  );
}

// ─── HABIT TRACKER ────────────────────────────────────────────────────────────
function HabitTracker({ title, color, year, month }) {
  const [tab, setTab] = useState("week");
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(startOfWeek); d.setDate(startOfWeek.getDate() + i); return d; });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  const currentYear = now.getFullYear();
  const yearMonths = Array.from({ length: 12 }, (_, m) => { const dIM = new Date(currentYear,m+1,0).getDate(); return Array.from({length:dIM},(_,d)=>new Date(currentYear,m,d+1)); });
  const toKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const DAY_SHORT = ["M","T","W","T","F","S","S"];
  const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const tabStyle = t => ({ fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", cursor: "pointer", padding: "3px 8px", fontWeight: 600, color: tab===t?"#fff":"#444", borderBottom: `1px solid ${tab===t?color:"transparent"}` });
  const weekDone = weekDays.filter(d => isHabitDone(title, toKey(d))).length;
  const monthDone = monthDays.filter(d => isHabitDone(title, toKey(d))).length;
  const yearDone = yearMonths.flat().filter(d => isHabitDone(title, toKey(d))).length;
  const yearTotal = yearMonths.flat().length;

  return (
    <div style={{marginTop:4}}>
      <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Completions</div>
      <div style={{display:"flex",gap:0,marginBottom:12,borderBottom:"1px solid #1a1a1a"}}>
        {["week","month","year"].map(t=><div key={t} style={tabStyle(t)} onClick={()=>setTab(t)}>{t}</div>)}
      </div>
      {tab==="week"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          {weekDays.map((d,i)=>{const key=toKey(d);const done=isHabitDone(title,key);const isToday=key===todayStr;return(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{fontSize:9,color:isToday?color:"#444"}}>{DAY_SHORT[i]}</div>
              <div style={{width:26,height:26,borderRadius:"50%",background:done?color:"#111",border:`1.5px solid ${isToday?color:done?color:"#222"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {done&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div style={{fontSize:9,color:"#333"}}>{d.getDate()}</div>
            </div>
          );})}
        </div>
        <div style={{fontSize:11,color:"#555",textAlign:"right"}}>{weekDone}/7 this week</div>
      </div>}
      {tab==="month"&&<div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
          {monthDays.map((d,i)=>{const key=toKey(d);const done=isHabitDone(title,key);const isToday=key===todayStr;return(
            <div key={i} style={{width:18,height:18,borderRadius:"50%",background:done?color:"#111",border:`1px solid ${isToday?color:done?color:"#1e1e1e"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {done&&<svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          );})}
        </div>
        <div style={{fontSize:11,color:"#555",textAlign:"right"}}>{monthDone}/{daysInMonth} this month · {Math.round(monthDone/daysInMonth*100)}%</div>
      </div>}
      {tab==="year"&&<div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {yearMonths.map((mDays,mi)=>{const mDone=mDays.filter(d=>isHabitDone(title,toKey(d))).length;const pct=mDays.length>0?mDone/mDays.length:0;return(
            <div key={mi} style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontSize:9,color:"#444",width:24,textAlign:"right",flexShrink:0}}>{MONTH_SHORT[mi]}</div>
              <div style={{flex:1,height:8,background:"#111",position:"relative"}}>
                <div style={{position:"absolute",top:0,left:0,bottom:0,width:`${pct*100}%`,background:color,opacity:0.3+pct*0.7,transition:"width 0.3s"}}/>
              </div>
              <div style={{fontSize:9,color:"#444",width:22,textAlign:"right",flexShrink:0}}>{mDone}</div>
            </div>
          );})}
        </div>
        <div style={{fontSize:11,color:"#555",textAlign:"right",marginTop:8}}>{yearDone}/{yearTotal} this year · {Math.round(yearDone/yearTotal*100)}%</div>
      </div>}
    </div>
  );
}

// ─── TYPE LEGEND ──────────────────────────────────────────────────────────────
function TypeLegend({ onClose }) {
  const entries = Object.entries(TYPE_META);
  return (
    <div style={{position:"absolute",inset:0,background:"#000",zIndex:100,overflowY:"auto",padding:"20px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontSize:18,fontWeight:700}}>Event Types</div>
        <div onClick={onClose} style={{cursor:"pointer",fontSize:26,color:"#555",lineHeight:1}}>×</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {entries.map(([key, m]) => {
          const isHabitType = key === "habit";
          const bc = isHabitType ? "#34a853" : m.badgeColor;
          const bb = isHabitType ? "#34a85355" : m.badgeBorder;
          const bbg = isHabitType ? "#34a85311" : m.badgeBg;
          const label = isHabitType ? "↻ daily / weekly" : key === "easy" ? "easy" : m.label({});
          const desc = { habit:"Recurring habit — tracked with streaks", task:"One-off to-do item", meeting:"Syncs, standups, demos, calls", reminder:"Personal nudges & check-ins", deadline:"Hard due dates & submissions", appointment:"External bookings & visits", focus:"Deep work blocks — DND mode", review:"Code, design & performance reviews", training:"Courses, learning & certifications", travel:"Flights, commutes & trips", medical:"Doctor, therapy & health visits", workout:"One-off gym sessions & sports", birthday:"Birthdays with gift & plan reminders", errand:"Quick real-world to-dos", social:"Dinners, parties & hangouts", goal:"Monthly / weekly goal checkpoints", blocklist:"Protected time — no interruptions", easy:"Easy essences station — shifts, restocks & client work", note:"Quick capture — ideas, quotes, observations", article:"Long-form writing — essays, posts, features", doc:"Technical documentation — specs, guides, references", journal:"Personal entries — reflection, feelings, daily log", draft:"Work in progress — any writing that needs finishing" };
          return (
            <div key={key} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 12px",background:isHabitType?"#0a0f0a":m.cardBg,borderLeft:`3px solid ${bc}`,fontFamily:m.writing?"'Courier New',monospace":"inherit"}}>
              <div style={{width:20,height:20,borderRadius:isHabitType?"50%":m.checkRadius,border:`2px solid ${bc}55`,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase",color:bc,border:`1px solid ${bb}`,padding:"1px 5px",borderRadius:isHabitType?8:2,background:bbg,display:"inline-flex",alignItems:"center",gap:3,marginBottom:3}}>
                {key==="easy"?<><OilDropIcon size={9} color="#f5c842" filled={true}/><span>easy</span></>:label}
              </div>
                <div style={{fontSize:11,color:"#666"}}>{desc[key]}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



// ─── ATTACHMENT SYSTEM ────────────────────────────────────────────────────────
const attachmentStore = {};

function getAttachKey(evTitle, evType) {
  return `${evType}::${evTitle}`;
}

function detectFileType(url) {
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

// ─── ATTACHMENT SVG ICONS ─────────────────────────────────────────────────────
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
  loom: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 13.75h-3.25l2.3 3.98-1.3.75-2.3-3.98-2.3 3.98-1.3-.75 2.3-3.98H8.4l-.75-1.3 3.98-2.3-3.98-2.3.75-1.3h3.25L9.35 2.57l1.3-.75L13 5.8l2.3-3.98 1.3.75-2.3 3.98h3.25l.75 1.3-3.98 2.3 3.98 2.3-.85 1.3z"/>
    </svg>
  ),
  miro: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <path d="M17.392 0H14.07l3.592 5.731L12 0H8.678l3.933 7.005L7.018 0H3.696l4.26 8.308L3.136 0H0l5.954 12L0 24h3.322l4.56-8.308L3.696 24h3.322l4.614-8.995L7.018 24h3.322l4.614-9.683L10.34 24h3.322l4.338-10.392L13.676 24H17l4.26-11.099L16.732 24h3.272L24 12 17.392 0z"/>
    </svg>
  ),
  confluence: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <path d="M.887 17.842c-.35.56-.744 1.215-.988 1.612a.985.985 0 0 0 .333 1.356l3.49 2.117a.99.99 0 0 0 1.364-.328c.215-.35.587-.965.99-1.632 1.322-2.152 2.656-1.895 5.051-.716l3.468 1.728a.988.988 0 0 0 1.318-.459l1.645-3.658a.988.988 0 0 0-.467-1.31c-.718-.337-2.148-1.04-3.44-1.699-4.755-2.392-8.81-2.103-12.764 2.989zM23.113 6.158c.35-.56.744-1.215.988-1.612a.985.985 0 0 0-.333-1.356L20.278 1.07a.99.99 0 0 0-1.364.328c-.215.35-.587.965-.99 1.632-1.322 2.152-2.656 1.895-5.051.716L9.405 2.018a.988.988 0 0 0-1.318.459L6.442 6.135a.988.988 0 0 0 .467 1.31c.718.337 2.148 1.04 3.44 1.699 4.767 2.392 8.822 2.116 12.764-2.986z"/>
    </svg>
  ),
  jira: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M11.975 0C9.2 5.538 9.737 9.64 12 12c2.263-2.36 2.8-6.462.025-12H11.975z" fill="#2684FF"/>
      <path d="M0 11.975C5.538 14.8 9.64 14.263 12 12 9.64 9.737 5.538 9.2 0 11.975z" fill="#2684FF" opacity=".7"/>
      <path d="M24 12.025C18.462 9.2 14.36 9.737 12 12c2.36 2.263 6.462 2.8 12-.025V12.025z" fill="#2684FF" opacity=".7"/>
      <path d="M12.025 24C14.8 18.462 14.263 14.36 12 12c-2.263 2.36-2.8 6.462.025 12h-.025 .025z" fill="#2684FF"/>
    </svg>
  ),
  linear: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 100 100" fill={c}>
      <path d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L37.3342 96.178c.6889.6889.0915 1.8189-.857 1.5964C19.0449 93.0249 6.47508 79.3214 1.22541 61.5228zM.00189135 46.8891c-.01764375.2833.08887465.5599.28957465.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465776 2.2686-.779696 4.5932-.927376 6.9624zM4.71361 27.2749c-.2string-.3654-.0539-.8092.2882-1.0039l4.1168-2.3778c.3421-.1947.7789-.1038 1.0125.2122l64.7518 87.9837c.2336.3159.1933.7576-.094 1.0202l-3.6086 3.3196c-.2873.2626-.7339.2672-1.0166.0098L4.71361 27.2749z"/>
    </svg>
  ),
  vercel: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <path d="M12 1L24 22H0L12 1z"/>
    </svg>
  ),
  slack: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
  ),
  zoom: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-6.465-4.875H7.125A1.125 1.125 0 0 0 6 8.25v6.375h11.41A1.125 1.125 0 0 0 18.535 13.5L18 8.25h-.465zM21 9.375l-2.25 1.875v1.5L21 14.625V9.375z"/>
    </svg>
  ),
  airtable: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <path d="M11.955.92L.587 5.313c-.42.165-.413.753.01.908l11.405 4.173a2.25 2.25 0 0 0 1.538 0l11.405-4.173c.422-.155.43-.743.01-.908L13.588.92a2.25 2.25 0 0 0-1.633 0zm10.545 7.8l-2.25.824v5.363l2.25-.855V8.72zM1.5 8.72v5.332l9.75 3.848V12.6L1.5 8.72zm10.5 3.88v5.298l9.75-3.712v-5.3l-9.75 3.714z"/>
    </svg>
  ),
  vimeo: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 13.4c-.924-3.588-1.94-5.082-2.713-5.082-.197 0-.887.415-2.064 1.239L0 9.557c.6-.413 1.497-1.037 2.684-1.87 1.243-.896 2.17-1.36 2.786-1.392 1.459-.139 2.359.855 2.696 2.985.364 2.297.616 3.725.757 4.286.42 1.897.88 2.843 1.382 2.843.39 0 .979-.616 1.768-1.847.787-1.232 1.209-2.168 1.268-2.812.112-1.064-.308-1.596-1.268-1.596-.451 0-.916.104-1.394.312 1.123-3.685 3.26-5.474 6.411-5.369 2.34.056 3.448 1.587 3.28 4.595z"/>
    </svg>
  ),
  whimsical: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={c} opacity=".2"/>
      <path d="M8 12l2.5 2.5L16 9" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  typeform: (c="currentColor") => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 6.5h-3v7h-3v-7h-3V7h9v1.5z"/>
    </svg>
  ),
  googledoc: () => (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path d="M14.727 0H3.27C2.219 0 1.364.856 1.364 1.909v20.182C1.364 23.144 2.22 24 3.273 24H20.73c1.053 0 1.908-.856 1.908-1.909V7.091L14.727 0z" fill="#4285f4"/>
      <path d="M14.727 0v7.091H22.64L14.727 0z" fill="#a1c2fa"/>
      <path d="M7.09 17.455h9.818v1.272H7.09zm0-2.546h9.818v1.273H7.09zm0-2.545h9.818v1.272H7.09zm0-2.546h5.455v1.273H7.09z" fill="#fff"/>
    </svg>
  ),
  googlesheet: () => (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path d="M14.727 0H3.27C2.219 0 1.364.856 1.364 1.909v20.182C1.364 23.144 2.22 24 3.273 24H20.73c1.053 0 1.908-.856 1.908-1.909V7.091L14.727 0z" fill="#0f9d58"/>
      <path d="M14.727 0v7.091H22.64L14.727 0z" fill="#87ceac"/>
      <path d="M7.09 10.364H12v1.272H7.09zm5.455 0H16.9v1.272h-4.355zM7.09 12.909H12v1.272H7.09zm5.455 0H16.9v1.272h-4.355zM7.09 15.455H12v1.272H7.09zm5.455 0H16.9v1.272h-4.355zM7.09 18H12v1.272H7.09zm5.455 0H16.9v1.272h-4.355z" fill="#fff"/>
    </svg>
  ),
  googleslides: () => (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path d="M14.727 0H3.27C2.219 0 1.364.856 1.364 1.909v20.182C1.364 23.144 2.22 24 3.273 24H20.73c1.053 0 1.908-.856 1.908-1.909V7.091L14.727 0z" fill="#f4b400"/>
      <path d="M14.727 0v7.091H22.64L14.727 0z" fill="#fce597"/>
      <rect x="6.5" y="9.5" width="11" height="7.5" rx="1" fill="#fff"/>
    </svg>
  ),
};

const FILE_TYPE_META = {
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

// ─── ATTACHMENT PRESETS ───────────────────────────────────────────────────────
const ATTACHMENT_PRESETS = [
  { group: "Design", items: [
    { label: "Figma File",      icon: (c) => AttachIcons.figma(c),      fileType: "figma",  placeholder: "https://figma.com/file/..." },
    { label: "Figma Prototype", icon: (c) => AttachIcons.figma(c),      fileType: "figma",  placeholder: "https://figma.com/proto/..." },
    { label: "Miro Board",      icon: (c) => AttachIcons.miro(c),       fileType: "link",   placeholder: "https://miro.com/app/board/..." },
    { label: "Whimsical",       icon: (c) => AttachIcons.whimsical(c),  fileType: "link",   placeholder: "https://whimsical.com/..." },
  ]},
  { group: "Docs", items: [
    { label: "Google Doc",      icon: () => AttachIcons.googledoc(),    fileType: "gdrive", placeholder: "https://docs.google.com/..." },
    { label: "Google Sheet",    icon: () => AttachIcons.googlesheet(),  fileType: "gdrive", placeholder: "https://docs.google.com/spreadsheets/..." },
    { label: "Google Slides",   icon: () => AttachIcons.googleslides(), fileType: "gdrive", placeholder: "https://docs.google.com/presentation/..." },
    { label: "Notion Page",     icon: (c) => AttachIcons.notion(c),     fileType: "notion", placeholder: "https://notion.so/..." },
    { label: "Confluence",      icon: (c) => AttachIcons.confluence(c), fileType: "doc",    placeholder: "https://confluence.atlassian.com/..." },
    { label: "PDF",             icon: (c) => AttachIcons.pdf(c),        fileType: "pdf",    placeholder: "https://..." },
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

function AttachmentSection({ evTitle, evType, accentColor }) {
  const key = getAttachKey(evTitle, evType);
  if (!attachmentStore[key]) attachmentStore[key] = [];

  const [attachments, setAttachments] = useState([...attachmentStore[key]]);
  const [adding, setAdding]           = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null); // { label, icon, fileType, placeholder }
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
      {/* Section header */}
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

      {/* ── ADD FORM ── */}
      {adding && (
        <div style={{ marginBottom: 10, background: "#0a0a0a", border: "1px solid #1a1a1a" }}>

          {!selectedPreset ? (
            /* Step 1: Pick a preset */
            <div>
              {/* Group tabs */}
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
              {/* Preset grid */}
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
            /* Step 2: Enter URL for selected preset */
            <div style={{ padding: "12px 12px 10px" }}>
              {/* Selected preset badge */}
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

              {/* URL input */}
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

      {/* Attachment list */}
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

// ─── DOC SCREEN ───────────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}


// ─── CHAPTER-BASED EBOOK EDITOR ───────────────────────────────────────────────
function generateId() {
  return "ch_" + Math.random().toString(36).slice(2, 9);
}

function DocScreen({ ev, accent, text, setText, onClose }) {
  const isMobile = useIsMobile();

  // Chapters are stored as array of { id, title, content, subs: [{id, title, content}] }
  const initChapters = () => {
    if (text && text.trim().startsWith("[CHAPTERS]")) {
      try { return JSON.parse(text.slice("[CHAPTERS]".length)); } catch(e) {}
    }
    // Legacy: try to import old markdown text
    if (text && text.trim()) {
      return [{ id: generateId(), title: "Chapter 1", content: text, subs: [] }];
    }
    return [{ id: generateId(), title: "Introduction", content: "", subs: [] }];
  };

  const [chapters, setChapters] = useState(initChapters);
  const [activeChapterId, setActiveChapterId] = useState(() => initChapters()[0]?.id || null);
  const [activeSubId, setActiveSubId] = useState(null); // null = chapter body
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitleVal, setEditingTitleVal] = useState("");
  const [expandedIds, setExpandedIds] = useState({});
  const textareaRef = useRef(null);

  // Sync chapters → parent text
  useEffect(() => {
    setText("[CHAPTERS]" + JSON.stringify(chapters));
  }, [chapters]);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeChapterId, activeSubId]);

  const totalWords = chapters.reduce((acc, ch) => {
    const cw = ch.content.trim() ? ch.content.trim().split(/\s+/).length : 0;
    const sw = ch.subs.reduce((a, s) => a + (s.content.trim() ? s.content.trim().split(/\s+/).length : 0), 0);
    return acc + cw + sw;
  }, 0);
  const progress = Math.min(100, Math.round((totalWords / (ev.wordGoal || 500)) * 100));
  const readTime = Math.max(1, Math.ceil(totalWords / 200));

  // ── Chapter mutations ──
  const addChapter = () => {
    const id = generateId();
    const num = chapters.length + 1;
    const ch = { id, title: `Chapter ${num}`, content: "", subs: [] };
    setChapters(p => [...p, ch]);
    setActiveChapterId(id);
    setActiveSubId(null);
    setExpandedIds(p => ({ ...p, [id]: true }));
  };

  const addSub = (chId) => {
    const id = generateId();
    setChapters(p => p.map(ch => ch.id === chId
      ? { ...ch, subs: [...ch.subs, { id, title: `Section ${ch.subs.length + 1}`, content: "" }] }
      : ch
    ));
    setActiveChapterId(chId);
    setActiveSubId(id);
    setExpandedIds(p => ({ ...p, [chId]: true }));
  };

  const deleteChapter = (chId) => {
    setChapters(p => {
      const next = p.filter(c => c.id !== chId);
      if (next.length === 0) {
        const fallback = { id: generateId(), title: "Chapter 1", content: "", subs: [] };
        setActiveChapterId(fallback.id);
        setActiveSubId(null);
        return [fallback];
      }
      if (activeChapterId === chId) {
        setActiveChapterId(next[0].id);
        setActiveSubId(null);
      }
      return next;
    });
  };

  const deleteSub = (chId, subId) => {
    setChapters(p => p.map(ch => ch.id === chId
      ? { ...ch, subs: ch.subs.filter(s => s.id !== subId) }
      : ch
    ));
    if (activeSubId === subId) setActiveSubId(null);
  };

  const moveChapter = (chId, dir) => {
    setChapters(p => {
      const idx = p.findIndex(c => c.id === chId);
      if (idx < 0) return p;
      const next = [...p];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return p;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const updateContent = (val) => {
    setChapters(p => p.map(ch => {
      if (activeSubId) {
        if (ch.id !== activeChapterId) return ch;
        return { ...ch, subs: ch.subs.map(s => s.id === activeSubId ? { ...s, content: val } : s) };
      }
      return ch.id === activeChapterId ? { ...ch, content: val } : ch;
    }));
  };

  const startRename = (id, current) => { setEditingTitleId(id); setEditingTitleVal(current); };
  const commitRename = (chId, subId) => {
    const val = editingTitleVal.trim() || (subId ? "Untitled Section" : "Untitled Chapter");
    setChapters(p => p.map(ch => {
      if (subId) {
        if (ch.id !== chId) return ch;
        return { ...ch, subs: ch.subs.map(s => s.id === subId ? { ...s, title: val } : s) };
      }
      return ch.id === chId ? { ...ch, title: val } : ch;
    }));
    setEditingTitleId(null);
  };

  const activeChapter = chapters.find(c => c.id === activeChapterId);
  const activeSub = activeSubId ? activeChapter?.subs.find(s => s.id === activeSubId) : null;
  const activeContent = activeSub ? activeSub.content : (activeChapter?.content || "");
  const activeTitle = activeSub ? activeSub.title : (activeChapter?.title || "");
  const activeWordCount = activeContent.trim() ? activeContent.trim().split(/\s+/).length : 0;

  const Sidebar = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#07090b" }}>
      {/* Book meta */}
      <div style={{ padding:"14px 14px 10px", borderBottom:"1px solid #111", flexShrink:0 }}>
        <div style={{ fontSize:9, color:accent+"88", letterSpacing:1.2, textTransform:"uppercase", marginBottom:5 }}>
          {TYPE_META[ev.type]?.icon || "§"} {ev.type}
        </div>
        <div style={{ fontSize:12, fontWeight:700, color:"#aaa", lineHeight:1.4, marginBottom:8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.title}</div>
        <div style={{ height:2, background:"#111", borderRadius:1, overflow:"hidden", marginBottom:4 }}>
          <div style={{ width:`${progress}%`, height:"100%", background:accent, transition:"width 0.3s" }}/>
        </div>
        <div style={{ fontSize:9, color:"#333", display:"flex", justifyContent:"space-between" }}>
          <span>{totalWords}w · ~{readTime}m read</span>
          <span style={{ color: progress>=100 ? accent : "#333" }}>{progress}%</span>
        </div>
      </div>

      {/* Chapter list */}
      <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
        <div style={{ padding:"6px 14px 4px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:9, color:"#2a2a2a", letterSpacing:1.1, textTransform:"uppercase" }}>Chapters</span>
          <div onClick={addChapter} style={{ fontSize:16, color:accent+"88", cursor:"pointer", lineHeight:1, padding:"0 2px" }} title="Add chapter">+</div>
        </div>

        {chapters.map((ch, ci) => {
          const chActive = activeChapterId === ch.id && !activeSubId;
          const expanded = expandedIds[ch.id];
          return (
            <div key={ch.id}>
              {/* Chapter row */}
              <div
                style={{ display:"flex", alignItems:"center", gap:0, padding:"0 8px 0 10px", cursor:"pointer", userSelect:"none",
                  borderLeft:`2px solid ${chActive ? accent : "transparent"}`,
                  background: chActive ? accent+"0d" : "transparent", transition:"all 0.12s",
                  minHeight:36,
                }}
              >
                {/* Expand toggle */}
                <div onClick={() => setExpandedIds(p => ({...p, [ch.id]: !p[ch.id]}))}
                  style={{ width:18, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", color:"#2a2a2a", fontSize:9 }}>
                  {ch.subs.length > 0 ? (
                    <svg width="9" height="9" viewBox="0 0 10 10" style={{ transform: expanded ? "rotate(90deg)" : "none", transition:"transform 0.15s" }}>
                      <path d="M3 2l4 3-4 3" stroke="#444" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : <span style={{width:9}}/>}
                </div>
                {/* Chapter number */}
                <span style={{ fontSize:9, color:accent+"44", width:18, flexShrink:0, fontWeight:700, textAlign:"center" }}>{ci+1}</span>
                {/* Title / rename input */}
                <div style={{ flex:1, overflow:"hidden" }} onClick={() => { setActiveChapterId(ch.id); setActiveSubId(null); if(isMobile) setSidebarOpen(false); }}>
                  {editingTitleId === ch.id ? (
                    <input
                      autoFocus value={editingTitleVal}
                      onChange={e => setEditingTitleVal(e.target.value)}
                      onBlur={() => commitRename(ch.id, null)}
                      onKeyDown={e => { if(e.key==="Enter"||e.key==="Escape") commitRename(ch.id, null); }}
                      onClick={e => e.stopPropagation()}
                      style={{ width:"100%", background:"transparent", border:"none", outline:`1px solid ${accent}44`, color:"#bbb", fontSize:11, padding:"1px 4px", fontFamily:"inherit" }}
                    />
                  ) : (
                    <span style={{ fontSize:11, fontWeight:chActive?600:400, color:chActive?accent:"#555",
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}
                      onDoubleClick={() => startRename(ch.id, ch.title)}
                    >{ch.title}</span>
                  )}
                </div>
                {/* Actions */}
                <div style={{ display:"flex", alignItems:"center", gap:2, flexShrink:0, opacity:0 }} className="ch-actions">
                  <div onClick={e=>{e.stopPropagation();addSub(ch.id);}} title="Add section"
                    style={{ width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:11, cursor:"pointer" }}>+</div>
                  <div onClick={e=>{e.stopPropagation();moveChapter(ch.id,-1);}} title="Move up"
                    style={{ width:16, height:18, display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:9, cursor:"pointer" }}>↑</div>
                  <div onClick={e=>{e.stopPropagation();moveChapter(ch.id,1);}} title="Move down"
                    style={{ width:16, height:18, display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:9, cursor:"pointer" }}>↓</div>
                  {chapters.length > 1 && (
                    <div onClick={e=>{e.stopPropagation();deleteChapter(ch.id);}} title="Delete chapter"
                      style={{ width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", color:"#ef5350", fontSize:10, cursor:"pointer" }}>×</div>
                  )}
                </div>
              </div>

              {/* Sub-chapters */}
              {expanded && ch.subs.map((sub, si) => {
                const subActive = activeChapterId === ch.id && activeSubId === sub.id;
                return (
                  <div key={sub.id}
                    style={{ display:"flex", alignItems:"center", gap:0, padding:"0 8px 0 30px", minHeight:30,
                      cursor:"pointer", userSelect:"none",
                      borderLeft:`2px solid ${subActive ? accent+"88" : "transparent"}`,
                      background: subActive ? accent+"08" : "transparent", transition:"all 0.12s",
                    }}
                    onClick={() => { setActiveChapterId(ch.id); setActiveSubId(sub.id); if(isMobile) setSidebarOpen(false); }}
                  >
                    <span style={{ fontSize:8, color:"#2a2a2a", width:28, flexShrink:0 }}>{ci+1}.{si+1}</span>
                    {editingTitleId === sub.id ? (
                      <input
                        autoFocus value={editingTitleVal}
                        onChange={e => setEditingTitleVal(e.target.value)}
                        onBlur={() => commitRename(ch.id, sub.id)}
                        onKeyDown={e => { if(e.key==="Enter"||e.key==="Escape") commitRename(ch.id, sub.id); }}
                        onClick={e => e.stopPropagation()}
                        style={{ flex:1, background:"transparent", border:"none", outline:`1px solid ${accent}44`, color:"#999", fontSize:10, padding:"1px 4px", fontFamily:"inherit" }}
                      />
                    ) : (
                      <span
                        style={{ flex:1, fontSize:10, color:subActive?accent+"cc":"#444", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}
                        onDoubleClick={e=>{e.stopPropagation(); startRename(sub.id, sub.title);}}
                      >{sub.title}</span>
                    )}
                    <div onClick={e=>{e.stopPropagation(); deleteSub(ch.id, sub.id);}}
                      style={{ width:16, height:20, display:"flex", alignItems:"center", justifyContent:"center", color:"#ef535033", fontSize:10, cursor:"pointer", flexShrink:0 }}>×</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Tags */}
      {ev.tags && ev.tags.length > 0 && (
        <div style={{ padding:"12px 14px", borderTop:"1px solid #0f0f0f", flexShrink:0 }}>
          <div style={{ fontSize:9, color:"#222", letterSpacing:1.1, textTransform:"uppercase", marginBottom:6 }}>Tags</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {ev.tags.map(t => (
              <span key={t} style={{ fontSize:9, color:"#333", border:"1px solid #1a1a1a", padding:"2px 6px" }}>#{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div onClick={e=>e.stopPropagation()} style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"#06080a",
      display:"flex", flexDirection:"column",
      fontFamily:"'Courier New', Courier, monospace",
      animation:"docFadeIn 0.18s ease",
    }}>
      <style>{`
        @keyframes docFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .doc-content-area::-webkit-scrollbar { width:3px; }
        .doc-content-area::-webkit-scrollbar-thumb { background:#1e1e1e; border-radius:2px; }
        .doc-sidebar-scroll::-webkit-scrollbar { width:2px; }
        .doc-sidebar-scroll::-webkit-scrollbar-thumb { background:#111; }
        .doc-textarea-full::-webkit-scrollbar { display:none; }
        .doc-textarea-full::placeholder { color:#1e1e1e; }
        .doc-textarea-full:focus { outline:none; }
        .doc-mobile-overlay { animation:sideSlide 0.22s ease; }
        @keyframes sideSlide { from { transform:translateX(-100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        div:hover > .ch-actions { opacity:1 !important; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ display:"flex", alignItems:"center", height:44, borderBottom:"1px solid #111", background:"#07090b", flexShrink:0, zIndex:3 }}>
        {/* Hamburger */}
        <div onClick={() => setSidebarOpen(s=>!s)}
          style={{ width:44, height:44, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, cursor:"pointer", borderRight:"1px solid #111", flexShrink:0 }}>
          <div style={{ width:16, height:1.5, background:sidebarOpen?accent:"#444", transition:"all 0.2s", transform:sidebarOpen?"rotate(45deg) translate(2px, 4px)":"none" }}/>
          <div style={{ width:16, height:1.5, background:"#444", opacity:sidebarOpen?0:1, transition:"opacity 0.15s" }}/>
          <div style={{ width:16, height:1.5, background:sidebarOpen?accent:"#444", transition:"all 0.2s", transform:sidebarOpen?"rotate(-45deg) translate(2px, -4px)":"none" }}/>
        </div>
        {/* Breadcrumb */}
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:6, padding:"0 12px", overflow:"hidden" }}>
          <span style={{ fontSize:11, color:accent, fontWeight:700, flexShrink:0 }}>{TYPE_META[ev.type]?.icon || "§"}</span>
          <span style={{ fontSize:11, color:"#333", flexShrink:0 }}>{ev.title}</span>
          {activeChapter && (
            <>
              <span style={{ fontSize:11, color:"#1e1e1e", flexShrink:0 }}>/</span>
              <span style={{ fontSize:11, color:"#666", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{activeChapter.title}</span>
            </>
          )}
          {activeSub && (
            <>
              <span style={{ fontSize:11, color:"#1e1e1e", flexShrink:0 }}>/</span>
              <span style={{ fontSize:11, color:"#444", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{activeSub.title}</span>
            </>
          )}
        </div>
        {/* Word count + close */}
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 12px", borderLeft:"1px solid #111", flexShrink:0 }}>
          <span style={{ fontSize:9, color:"#2a2a2a" }}>{activeWordCount}w</span>
          <div onClick={onClose} style={{ fontSize:11, color:"#444", cursor:"pointer", padding:"3px 8px", border:"1px solid #1a1a1a", userSelect:"none" }}>✕</div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", position:"relative" }}>

        {/* Desktop sidebar */}
        {!isMobile && sidebarOpen && (
          <div className="doc-sidebar-scroll" style={{ width:220, flexShrink:0, borderRight:"1px solid #111", overflowY:"auto", display:"flex", flexDirection:"column" }}>
            <Sidebar/>
          </div>
        )}

        {/* Mobile sidebar overlay */}
        {isMobile && sidebarOpen && (
          <div style={{ position:"absolute", inset:0, zIndex:20, display:"flex" }}>
            <div className="doc-mobile-overlay" style={{ width:"80%", maxWidth:280, background:"#07090b", borderRight:`1px solid ${accent}22`, overflowY:"auto", display:"flex", flexDirection:"column", height:"100%" }}>
              <Sidebar/>
            </div>
            <div onClick={() => setSidebarOpen(false)} style={{ flex:1, background:"rgba(0,0,0,0.65)" }}/>
          </div>
        )}

        {/* ── EDITOR AREA ── */}
        <div className="doc-content-area" style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>

          {activeChapter ? (
            <div style={{ flex:1, display:"flex", flexDirection:"column", padding: isMobile ? "20px 18px 40px" : "32px 40px 60px", maxWidth:760, width:"100%", boxSizing:"border-box" }}>

              {/* Chapter/Section header */}
              <div style={{ marginBottom:24, paddingBottom:16, borderBottom:`1px solid #0f0f0f` }}>
                <div style={{ fontSize:9, color:accent+"55", letterSpacing:1.4, textTransform:"uppercase", marginBottom:8 }}>
                  {activeSub
                    ? `Ch. ${chapters.indexOf(activeChapter)+1} · Section ${activeChapter.subs.indexOf(activeSub)+1}`
                    : `Chapter ${chapters.indexOf(activeChapter)+1}`}
                </div>
                {/* Editable title */}
                <input
                  value={activeTitle}
                  onChange={e => {
                    const val = e.target.value;
                    setChapters(p => p.map(ch => {
                      if (activeSub) {
                        if (ch.id !== activeChapterId) return ch;
                        return { ...ch, subs: ch.subs.map(s => s.id === activeSubId ? { ...s, title: val } : s) };
                      }
                      return ch.id === activeChapterId ? { ...ch, title: val } : ch;
                    }));
                  }}
                  style={{
                    width:"100%", background:"transparent", border:"none", outline:"none",
                    color:"#d4d4d8", fontSize: isMobile ? 22 : 28, fontWeight:700,
                    letterSpacing:-0.5, lineHeight:1.2, fontFamily:"inherit",
                    caretColor:accent, boxSizing:"border-box",
                  }}
                />
                {/* Prompt/hint */}
                {!activeSub && ev.prompt && (
                  <div style={{ fontSize:12, color:"#2a2a2a", marginTop:8, fontStyle:"italic", lineHeight:1.6 }}>{ev.prompt}</div>
                )}
                {/* Stats row */}
                <div style={{ display:"flex", gap:14, marginTop:12, flexWrap:"wrap" }}>
                  {[
                    { label:"Words", value:`${activeWordCount}` },
                    { label:"Total", value:`${totalWords} / ${ev.wordGoal||500}` },
                    { label:"Chapters", value:chapters.length },
                    { label:"Progress", value:`${progress}%`, hi:progress>=100 },
                  ].map((s,i) => (
                    <div key={i} style={{ fontSize:9, color:"#2a2a2a" }}>
                      <span style={{ color:"#1e1e1e" }}>{s.label}: </span>
                      <span style={{ color:s.hi ? accent : "#333" }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Writing area */}
              <div style={{ flex:1, position:"relative" }}>
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:2, background:`linear-gradient(to bottom, ${accent}44, transparent)` }}/>
                <textarea
                  ref={textareaRef}
                  className="doc-textarea-full"
                  value={activeContent}
                  onChange={e => updateContent(e.target.value)}
                  placeholder={activeSub
                    ? `Write the content of "${activeTitle}" here…`
                    : `Begin writing Chapter ${chapters.indexOf(activeChapter)+1}…\n\nYou can use plain prose here. Manage chapters and sections from the sidebar on the left.`}
                  style={{
                    width:"100%",
                    minHeight: isMobile ? 300 : 440,
                    background:"transparent", border:"none", outline:"none",
                    color:"#9a9a9a", fontSize: isMobile ? 15 : 14, lineHeight:1.95,
                    fontFamily:"'Courier New', Courier, monospace",
                    resize:"none", boxSizing:"border-box",
                    padding:"0 0 0 16px",
                    caretColor:accent,
                    WebkitTapHighlightColor:"transparent",
                  }}
                />
              </div>

              {/* Chapter navigation */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:20, marginTop:20, borderTop:"1px solid #0f0f0f" }}>
                {/* Prev */}
                {(() => {
                  const ci = chapters.indexOf(activeChapter);
                  if (activeSub) {
                    const si = activeChapter.subs.indexOf(activeSub);
                    if (si > 0) {
                      const prev = activeChapter.subs[si-1];
                      return (
                        <div onClick={() => setActiveSubId(prev.id)} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                          <span>{prev.title}</span>
                        </div>
                      );
                    }
                    return (
                      <div onClick={() => setActiveSubId(null)} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        <span>{activeChapter.title}</span>
                      </div>
                    );
                  }
                  if (ci > 0) {
                    const prevCh = chapters[ci-1];
                    const lastSub = prevCh.subs[prevCh.subs.length-1];
                    return (
                      <div onClick={() => { setActiveChapterId(prevCh.id); setActiveSubId(lastSub?.id || null); }} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        <span>{lastSub ? lastSub.title : prevCh.title}</span>
                      </div>
                    );
                  }
                  return <div/>;
                })()}
                {/* Next */}
                {(() => {
                  const ci = chapters.indexOf(activeChapter);
                  if (activeSub) {
                    const si = activeChapter.subs.indexOf(activeSub);
                    if (si < activeChapter.subs.length - 1) {
                      const next = activeChapter.subs[si+1];
                      return (
                        <div onClick={() => setActiveSubId(next.id)} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                          <span>{next.title}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                        </div>
                      );
                    }
                    if (ci < chapters.length - 1) {
                      const nextCh = chapters[ci+1];
                      return (
                        <div onClick={() => { setActiveChapterId(nextCh.id); setActiveSubId(null); }} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                          <span>{nextCh.title}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                        </div>
                      );
                    }
                    return <div/>;
                  }
                  // currently on chapter body
                  if (activeChapter.subs.length > 0) {
                    const first = activeChapter.subs[0];
                    return (
                      <div onClick={() => setActiveSubId(first.id)} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <span>{first.title}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                      </div>
                    );
                  }
                  if (ci < chapters.length - 1) {
                    const nextCh = chapters[ci+1];
                    return (
                      <div onClick={() => { setActiveChapterId(nextCh.id); setActiveSubId(null); }} style={{ fontSize:11, color:accent+"66", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <span>{nextCh.title}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                      </div>
                    );
                  }
                  return <div/>;
                })()}
              </div>

              {/* Add section button */}
              <div style={{ marginTop:24, display:"flex", gap:8 }}>
                <div onClick={() => addSub(activeChapterId)}
                  style={{ fontSize:10, color:"#333", border:"1px solid #1a1a1a", padding:"6px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, userSelect:"none" }}>
                  <span style={{ color:accent+"66" }}>+</span> Add section to this chapter
                </div>
                <div onClick={addChapter}
                  style={{ fontSize:10, color:"#333", border:"1px solid #1a1a1a", padding:"6px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, userSelect:"none" }}>
                  <span style={{ color:accent+"66" }}>+</span> New chapter
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"80px 24px", color:"#222" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>§</div>
              <div style={{ fontSize:13, fontStyle:"italic" }}>No chapters yet</div>
              <div onClick={addChapter} style={{ marginTop:20, fontSize:11, color:accent, border:`1px solid ${accent}44`, padding:"8px 20px", cursor:"pointer", display:"inline-block" }}>
                + Add first chapter
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ─── WRITING CARD ─────────────────────────────────────────────────────────────
const writingStorage = {};

function WritingCard({ ev }) {
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


// ─── CONTACT SYSTEM ───────────────────────────────────────────────────────────
const contactStore = {};
function getContactKey(evTitle, evType) { return `contacts::${evType}::${evTitle}`; }

const SOCIALS = [
  { key: "whatsapp",  label: "WhatsApp",  color: "#25D366", prefix: "https://wa.me/",                     icon: (c) => <svg viewBox="0 0 24 24" fill={c} width="14" height="14"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.862L.057 23.5l5.803-1.449A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.79 0-3.478-.47-4.948-1.294l-.355-.207-3.644.91.956-3.542-.232-.365A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg> },
  { key: "instagram", label: "Instagram", color: "#E1306C", prefix: "https://instagram.com/",              icon: (c) => <svg viewBox="0 0 24 24" fill={c} width="14" height="14"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { key: "linkedin",  label: "LinkedIn",  color: "#0A66C2", prefix: "https://linkedin.com/in/",            icon: (c) => <svg viewBox="0 0 24 24" fill={c} width="14" height="14"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { key: "twitter",   label: "X / Twitter", color: "#fff", prefix: "https://x.com/",                     icon: (c) => <svg viewBox="0 0 24 24" fill={c} width="14" height="14"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { key: "telegram",  label: "Telegram",  color: "#26A5E4", prefix: "https://t.me/",                     icon: (c) => <svg viewBox="0 0 24 24" fill={c} width="14" height="14"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
  { key: "snapchat",  label: "Snapchat",  color: "#FFFC00", prefix: "https://snapchat.com/add/",          icon: (c) => <svg viewBox="0 0 24 24" fill={c} width="14" height="14"><path d="M12.166.006C9.495-.139 7.035 1.204 5.67 3.404c-.606.955-.809 2.045-.77 3.16-.907.053-1.845-.171-2.626.35-.327.22-.572.634-.468 1.03.093.35.42.566.74.694.5.2 1.09.302 1.463.72.257.29.177.73.064 1.062-.407 1.199-1.33 2.085-2.15 2.975-.34.369-.498.87-.263 1.334.195.384.583.576.982.66.946.204 1.795.077 2.714.396.495.174.779.608 1.04 1.043.384.641.71 1.383 1.334 1.822 1.025.718 2.323.43 3.443.278.307-.042.616-.085.913-.035.37.062.716.27 1.057.422.794.353 1.716.535 2.556.227.68-.248 1.1-.893 1.437-1.516.263-.484.519-.99.985-1.28.857-.531 2.071-.256 3.019-.596.416-.15.82-.444.876-.914.046-.385-.179-.73-.452-1.001-.818-.806-1.623-1.613-2.03-2.688-.155-.408-.225-.901.033-1.28.378-.553 1.12-.59 1.722-.782.274-.088.584-.241.696-.527.161-.41-.133-.825-.462-1.044-.832-.55-1.89-.274-2.814-.358.038-1.014-.112-2.063-.555-2.974C16.9 1.17 14.7.14 12.166.006z"/></svg> },
];

function Avatar({ contact, size = 32 }) {
  const initials = contact.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const hue = (contact.name.charCodeAt(0) * 37 + contact.name.charCodeAt(1 % contact.name.length) * 13) % 360;
  const bg = `hsl(${hue}, 40%, 25%)`;
  const border = `hsl(${hue}, 60%, 45%)`;

  return contact.photo
    ? <img src={contact.photo} alt={contact.name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `2px solid ${border}`, flexShrink: 0 }} onError={e => { e.target.style.display="none"; }} />
    : <div style={{ width: size, height: size, borderRadius: "50%", background: bg, border: `2px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: size * 0.35, fontWeight: 700, color: `hsl(${hue}, 80%, 75%)`, letterSpacing: 0.5 }}>{initials}</div>;
}

function ContactCard({ contact, onRemove, accentColor }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", overflow: "hidden" }}>
      {/* Collapsed row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        <Avatar contact={contact} size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#d4d4d8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{contact.name}</div>
          <div style={{ fontSize: 11, color: "#555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{contact.role || contact.email || contact.phone || ""}</div>
        </div>
        {/* Social icons preview */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {SOCIALS.filter(s => contact[s.key]).slice(0, 3).map(s => (
            <div key={s.key} style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.7 }}>
              {s.icon(s.color)}
            </div>
          ))}
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}><path d="M6 9l6 6 6-6" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>

      {/* Expanded contact sheet */}
      {open && (
        <div style={{ borderTop: "1px solid #141414" }}>
          {/* Header band */}
          <div style={{ background: `linear-gradient(135deg, #111 0%, #0d0d0d 100%)`, padding: "16px 14px 12px", display: "flex", gap: 14, alignItems: "flex-end" }}>
            <Avatar contact={contact} size={52} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{contact.name}</div>
              {contact.role && <div style={{ fontSize: 11, color: "#666", letterSpacing: 0.3 }}>{contact.role}</div>}
            </div>
          </div>

          {/* Contact rows */}
          <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
            {contact.phone && (
              <a href={`tel:${contact.phone}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="#888"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#444", letterSpacing: 0.5, textTransform: "uppercase" }}>Phone</div>
                  <div style={{ fontSize: 13, color: "#bbb" }}>{contact.phone}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 10, color: accentColor, border: `1px solid ${accentColor}44`, padding: "2px 6px" }}>call</div>
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#888"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: "#444", letterSpacing: 0.5, textTransform: "uppercase" }}>Email</div>
                  <div style={{ fontSize: 13, color: "#bbb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{contact.email}</div>
                </div>
                <div style={{ fontSize: 10, color: accentColor, border: `1px solid ${accentColor}44`, padding: "2px 6px", flexShrink: 0 }}>mail</div>
              </a>
            )}

            {/* Socials */}
            {SOCIALS.filter(s => contact[s.key]).length > 0 && (
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Socials</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {SOCIALS.filter(s => contact[s.key]).map(s => (
                    <a key={s.key} href={s.prefix + contact[s.key].replace(/^@/, "")} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.color + "18", border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {s.icon(s.color)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, color: "#444", letterSpacing: 0.5, textTransform: "uppercase" }}>{s.label}</div>
                        <div style={{ fontSize: 13, color: "#bbb" }}>@{contact[s.key].replace(/^@/, "")}</div>
                      </div>
                      <div style={{ fontSize: 10, color: s.color, border: `1px solid ${s.color}44`, padding: "2px 6px", flexShrink: 0 }}>open ↗</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {contact.notes && (
              <div style={{ marginTop: 4, padding: "8px 10px", background: "#111", borderLeft: "2px solid #222" }}>
                <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Notes</div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{contact.notes}</div>
              </div>
            )}
          </div>

          {/* Remove */}
          <div style={{ padding: "6px 14px 10px", display: "flex", justifyContent: "flex-end" }}>
            <div onClick={onRemove} style={{ fontSize: 10, color: "#333", cursor: "pointer", border: "1px solid #1a1a1a", padding: "2px 8px", letterSpacing: 0.5 }}>remove</div>
          </div>
        </div>
      )}
    </div>
  );
}

const EMPTY_FORM = { name: "", role: "", photo: "", phone: "", email: "", notes: "", whatsapp: "", instagram: "", linkedin: "", twitter: "", telegram: "", snapchat: "" };

function ContactSection({ evTitle, evType, accentColor }) {
  const key = getContactKey(evTitle, evType);
  if (!contactStore[key]) contactStore[key] = [];

  const [contacts, setContacts] = useState([...contactStore[key]]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [tab, setTab] = useState("basic");

  const sync = (arr) => { contactStore[key] = arr; setContacts([...arr]); };
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleAdd = () => {
    if (!form.name.trim()) return;
    sync([...contactStore[key], { ...form, id: Date.now() }]);
    setForm({ ...EMPTY_FORM }); setAdding(false); setTab("basic");
  };

  const inputStyle = { background: "transparent", border: "none", borderBottom: "1px solid #1e1e1e", outline: "none", color: "#bbb", fontSize: 12, padding: "5px 0", width: "100%", boxSizing: "border-box" };
  const labelStyle = { fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 };
  const tabStyle = (t) => ({ fontSize: 10, padding: "4px 10px", cursor: "pointer", letterSpacing: 0.5, color: tab === t ? "#fff" : "#444", borderBottom: `1px solid ${tab === t ? accentColor : "transparent"}` });

  // Avatar row preview (collapsed)
  const avatarRow = contacts.slice(0, 5);

  return (
    <div onClick={e => e.stopPropagation()}>
      {/* Section header */}
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

      {/* Contacts list */}
      {!adding && contacts.length === 0 && <div style={{ fontSize: 11, color: "#2a2a2a", fontStyle: "italic" }}>No people attached yet</div>}
      {!adding && contacts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {contacts.map(c => (
            <ContactCard key={c.id} contact={c} accentColor={accentColor} onRemove={() => sync(contactStore[key].filter(x => x.id !== c.id))} />
          ))}
        </div>
      )}

      {/* Add form */}
      {adding && (
        <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", marginBottom: 4 }}>
            {["basic", "contact", "socials"].map(t => <div key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{t}</div>)}
          </div>

          {tab === "basic" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><div style={labelStyle}>Name *</div><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full name" style={inputStyle} /></div>
              <div><div style={labelStyle}>Role / Title</div><input value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. Product Manager" style={inputStyle} /></div>
              <div><div style={labelStyle}>Photo URL</div><input value={form.photo} onChange={e => set("photo", e.target.value)} placeholder="https://..." style={inputStyle} /></div>
              {form.photo && <img src={form.photo} alt="preview" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `2px solid ${accentColor}55`, alignSelf: "flex-start" }} onError={e => e.target.style.display="none"} />}
              <div><div style={labelStyle}>Notes</div><input value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="How you know them, context..." style={inputStyle} /></div>
            </div>
          )}

          {tab === "contact" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><div style={labelStyle}>Phone</div><input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+1 555 000 0000" style={inputStyle} /></div>
              <div><div style={labelStyle}>Email</div><input value={form.email} onChange={e => set("email", e.target.value)} placeholder="name@example.com" style={inputStyle} /></div>
            </div>
          )}

          {tab === "socials" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SOCIALS.map(s => (
                <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: s.color + "18", border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon(s.color)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={labelStyle}>{s.label}</div>
                    <input value={form[s.key]} onChange={e => set(s.key, e.target.value)} placeholder="username or handle" style={inputStyle} />
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

// ─── GLOBAL DETAIL SCREEN STATE ──────────────────────────────────────────────
let _openDetailScreen = null;
function registerOpenDetail(fn) { _openDetailScreen = fn; }
function openTaskDetail(ev, dateKey, year, month, bump) {
  if (_openDetailScreen) _openDetailScreen({ ev, dateKey, year, month, bump });
}

// ─── TASK DETAIL SCREEN ───────────────────────────────────────────────────────
function TaskDetailScreen({ ev, dateKey, year, month, onClose, bump }) {
  const isHabit = ev.type === "habit";
  const hasSubtasks = ev.subtasks && ev.subtasks.length > 0;
  const meta = TYPE_META[ev.type] || TYPE_META.task;

  const [, rerender] = useState(0);
  const localBump = () => { rerender(n => n+1); bump && bump(); };

  const override = getEventOverride(ev.title, dateKey);
  const merged = { ...ev, ...override };

  const doneCount  = hasSubtasks ? ev.subtasks.filter(st => isSubtaskDone(ev.title, dateKey, st.id)).length : 0;
  const totalCount = hasSubtasks ? ev.subtasks.length : 0;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const habitDone = isHabit ? isHabitDone(ev.title, dateKey) : false;
  const isDone = hasSubtasks ? allSubtasksDone(ev, dateKey) : isHabit ? habitDone : !!(override.done);

  const handleMainCheck = () => {
    if (hasSubtasks) { const allDone = allSubtasksDone(ev, dateKey); ev.subtasks.forEach(st => markSubtask(ev.title, dateKey, st.id, !allDone)); }
    else if (isHabit) { markHabit(ev.title, dateKey, !habitDone); }
    else { setEventOverride(ev.title, dateKey, { done: !override.done }); }
    localBump();
  };

  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");
  const startEdit = (field, current) => { setEditing(field); setDraft(current || ""); };
  const saveEdit  = (field) => { setEventOverride(ev.title, dateKey, { [field]: draft }); setEditing(null); localBump(); };
  const cancelEdit = () => setEditing(null);

  const accentColor = merged.color;
  const badgeColor  = isHabit ? merged.color : meta.badgeColor;
  const badgeBorder = isHabit ? merged.color + "55" : meta.badgeBorder;
  const badgeBg     = isHabit ? merged.color + "11" : meta.badgeBg;

  const inputStyle = { width:"100%", background:"#111", border:`1px solid ${accentColor}44`, color:"#ddd", fontSize:13, padding:"8px 10px", outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  const EditableField = ({ label, field, value, multiline, placeholder }) => {
    const isEd = editing === field;
    return (
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10, color:"#444", textTransform:"uppercase", letterSpacing:1, marginBottom:6, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span>{label}</span>
          {!isEd && <span onClick={() => startEdit(field, value)} style={{ fontSize:9, color:accentColor+"aa", cursor:"pointer", border:`1px solid ${accentColor}33`, padding:"1px 6px" }}>edit</span>}
        </div>
        {isEd ? (
          <div>
            {multiline
              ? <textarea value={draft} onChange={e=>setDraft(e.target.value)} autoFocus rows={4} style={{...inputStyle, resize:"vertical", lineHeight:1.6}}/>
              : <input value={draft} onChange={e=>setDraft(e.target.value)} autoFocus style={inputStyle}/>
            }
            <div style={{display:"flex",gap:8,marginTop:6}}>
              <span onClick={()=>saveEdit(field)} style={{fontSize:10,color:accentColor,cursor:"pointer",border:`1px solid ${accentColor}55`,padding:"3px 10px"}}>save</span>
              <span onClick={cancelEdit} style={{fontSize:10,color:"#444",cursor:"pointer",padding:"3px 6px"}}>cancel</span>
            </div>
          </div>
        ) : (
          <div onClick={() => startEdit(field, value)} style={{ fontSize:13, color:value?"#bbb":"#2a2a2a", lineHeight:1.6, cursor:"text", minHeight:20, fontStyle:value?"normal":"italic" }}>
            {value || (placeholder||"—")}
          </div>
        )}
      </div>
    );
  };

  const HowEditor = () => {
    const currentHow = merged.how || [];
    const [addingStep, setAddingStep] = useState(false);
    const [newStep, setNewStep] = useState("");
    const [editIdx, setEditIdx] = useState(null);
    const [editVal, setEditVal] = useState("");
    const saveStep = () => { if(!newStep.trim()){setAddingStep(false);return;} const u=[...currentHow,newStep.trim()]; setEventOverride(ev.title,dateKey,{how:u}); setNewStep("");setAddingStep(false);localBump(); };
    const updateStep = i => { const u=currentHow.map((s,idx)=>idx===i?editVal:s); setEventOverride(ev.title,dateKey,{how:u}); setEditIdx(null);localBump(); };
    const removeStep = i => { const u=currentHow.filter((_,idx)=>idx!==i); setEventOverride(ev.title,dateKey,{how:u}); localBump(); };
    return (
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span>How to do it right</span>
          <span onClick={()=>setAddingStep(true)} style={{fontSize:9,color:accentColor+"aa",cursor:"pointer",border:`1px solid ${accentColor}33`,padding:"1px 6px"}}>+ step</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {currentHow.map((step,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:accentColor+"18",border:`1px solid ${accentColor}44`,flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:9,color:accentColor,fontWeight:700}}>{i+1}</span>
              </div>
              {editIdx===i ? (
                <div style={{flex:1}}>
                  <input value={editVal} onChange={e=>setEditVal(e.target.value)} autoFocus style={{...inputStyle,fontSize:12,padding:"5px 8px"}}/>
                  <div style={{display:"flex",gap:8,marginTop:4}}>
                    <span onClick={()=>updateStep(i)} style={{fontSize:9,color:accentColor,cursor:"pointer"}}>save</span>
                    <span onClick={()=>setEditIdx(null)} style={{fontSize:9,color:"#444",cursor:"pointer"}}>cancel</span>
                    <span onClick={()=>removeStep(i)} style={{fontSize:9,color:"#ef5350",cursor:"pointer",marginLeft:"auto"}}>remove</span>
                  </div>
                </div>
              ):(
                <div style={{flex:1,display:"flex",gap:6,alignItems:"flex-start"}}>
                  <span style={{fontSize:13,color:"#888",lineHeight:1.5,flex:1}}>{step}</span>
                  <span onClick={()=>{setEditIdx(i);setEditVal(step);}} style={{fontSize:10,color:"#333",cursor:"pointer",flexShrink:0,marginTop:2}}>✎</span>
                </div>
              )}
            </div>
          ))}
          {addingStep&&(
            <div style={{display:"flex",gap:8,alignItems:"center",marginTop:2}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:accentColor+"18",border:`1px solid ${accentColor}44`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:9,color:accentColor}}>+</span>
              </div>
              <input value={newStep} onChange={e=>setNewStep(e.target.value)} autoFocus placeholder="Describe this step..." onKeyDown={e=>{if(e.key==="Enter")saveStep();if(e.key==="Escape")setAddingStep(false);}}
                style={{flex:1,background:"transparent",border:"none",borderBottom:`1px solid ${accentColor}33`,outline:"none",color:"#ddd",fontSize:13,padding:"4px 0",fontFamily:"inherit"}}/>
              <span onClick={saveStep} style={{fontSize:9,color:accentColor,cursor:"pointer",border:`1px solid ${accentColor}44`,padding:"2px 6px",flexShrink:0}}>add</span>
            </div>
          )}
          {currentHow.length===0&&!addingStep&&<div style={{fontSize:12,color:"#2a2a2a",fontStyle:"italic"}}>No steps yet</div>}
        </div>
      </div>
    );
  };

  const SubtaskEditor = () => {
    const [newLabel, setNewLabel] = useState("");
    const [addingNew, setAddingNew] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editVal, setEditVal] = useState("");
    const [dragIdx, setDragIdx] = useState(null);
    const [dragOverIdx, setDragOverIdx] = useState(null);
    const currentSubs = ev.subtasks || [];

    const addSub = () => { if(!newLabel.trim()){setAddingNew(false);return;} const n={id:`st_${Date.now()}`,label:newLabel.trim()}; ev.subtasks=[...currentSubs,n]; setNewLabel("");setAddingNew(false);localBump(); };
    const removeSub = id => { ev.subtasks=currentSubs.filter(s=>s.id!==id); localBump(); };
    const saveEdit = id => { ev.subtasks=currentSubs.map(s=>s.id===id?{...s,label:editVal}:s); setEditId(null); localBump(); };

    const onDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed="move"; };
    const onDragOver  = (e, idx) => { e.preventDefault(); setDragOverIdx(idx); };
    const onDrop      = (e, idx) => {
      e.preventDefault();
      if(dragIdx===null||dragIdx===idx) return;
      const arr=[...currentSubs];
      const [moved]=arr.splice(dragIdx,1);
      arr.splice(idx,0,moved);
      ev.subtasks=arr;
      setDragIdx(null); setDragOverIdx(null); localBump();
    };
    const onDragEnd   = () => { setDragIdx(null); setDragOverIdx(null); };

    return (
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span>Steps — {doneCount}/{currentSubs.length}</span>
          <span onClick={()=>setAddingNew(true)} style={{fontSize:9,color:accentColor+"aa",cursor:"pointer",border:`1px solid ${accentColor}33`,padding:"1px 6px"}}>+ step</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {currentSubs.map((st,idx)=>{
            const stDone=isSubtaskDone(ev.title,dateKey,st.id);
            const isEditing=editId===st.id;
            const isDragging=dragIdx===idx;
            const isOver=dragOverIdx===idx&&dragIdx!==idx;
            return(
              <div key={st.id}
                draggable={!isEditing}
                onDragStart={e=>onDragStart(e,idx)}
                onDragOver={e=>onDragOver(e,idx)}
                onDrop={e=>onDrop(e,idx)}
                onDragEnd={onDragEnd}
                style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:isDragging?"#0a0a0a":stDone?"#0d0d0d":"#080808",borderLeft:`2px solid ${isOver?accentColor:isEditing?accentColor+"88":stDone?accentColor+"66":"#1a1a1a"}`,opacity:isDragging?0.4:1,transition:"opacity 0.15s, border-color 0.15s",boxShadow:isOver?`inset 0 2px 0 ${accentColor}66`:"none"}}>
                {/* Drag handle */}
                {!isEditing && (
                  <div draggable={false} style={{display:"flex",flexDirection:"column",gap:2.5,flexShrink:0,cursor:"grab",padding:"2px 0",opacity:0.3}}>
                    {[0,1,2].map(i=><div key={i} style={{width:14,height:1.5,background:"#888",borderRadius:1}}/>)}
                  </div>
                )}
                <div onClick={()=>{if(!isEditing){markSubtask(ev.title,dateKey,st.id,!stDone);localBump();}}} style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${stDone?accentColor:"#2a2a2a"}`,background:stDone?accentColor:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",transition:"all 0.15s"}}>
                  {stDone&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                {isEditing ? (
                  <div style={{flex:1}}>
                    <input value={editVal} onChange={e=>setEditVal(e.target.value)} autoFocus
                      onKeyDown={e=>{if(e.key==="Enter")saveEdit(st.id);if(e.key==="Escape")setEditId(null);}}
                      style={{width:"100%",background:"transparent",border:"none",borderBottom:`1px solid ${accentColor}55`,outline:"none",color:"#ddd",fontSize:13,fontFamily:"inherit",padding:"0 0 2px",boxSizing:"border-box"}}/>
                    <div style={{display:"flex",gap:10,marginTop:6}}>
                      <span onClick={()=>saveEdit(st.id)} style={{fontSize:9,color:accentColor,cursor:"pointer",border:`1px solid ${accentColor}55`,padding:"2px 8px"}}>save</span>
                      <span onClick={()=>setEditId(null)} style={{fontSize:9,color:"#444",cursor:"pointer"}}>cancel</span>
                      <span onClick={()=>removeSub(st.id)} style={{fontSize:9,color:"#ef535066",cursor:"pointer",marginLeft:"auto"}}>remove</span>
                    </div>
                  </div>
                ) : (
                  <div onClick={()=>{setEditId(st.id);setEditVal(st.label);}} style={{flex:1,fontSize:13,color:stDone?"#444":"#bbb",textDecoration:stDone?"line-through":"none",lineHeight:1.5,cursor:"text"}}>{st.label}</div>
                )}
              </div>
            );
          })}
          {addingNew&&(
            <div style={{display:"flex",gap:10,alignItems:"center",padding:"8px 12px",background:"#0a0a0a",borderLeft:`2px solid ${accentColor}44`}}>
              <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${accentColor}44`,flexShrink:0}}/>
              <input value={newLabel} onChange={e=>setNewLabel(e.target.value)} autoFocus placeholder="Step description..." onKeyDown={e=>{if(e.key==="Enter")addSub();if(e.key==="Escape")setAddingNew(false);}}
                style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#ddd",fontSize:13,fontFamily:"inherit"}}/>
              <div onClick={addSub} style={{fontSize:9,color:accentColor,cursor:"pointer",border:`1px solid ${accentColor}44`,padding:"2px 6px",flexShrink:0}}>add</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ColorPicker = () => {
    const COLORS=["#34a853","#4285f4","#ea4335","#fbbc05","#9c27b0","#ff8a65","#4fc3f7","#69f0ae","#ef5350","#ffb74d","#ce93d8","#80cbc4","#f48fb1","#fff176","#a5d6a7","#90caf9","#ffe082","#ef9a9a","#546e7a","#fb923c"];
    const [open,setOpen]=useState(false);
    const cur=merged.color;
    return(
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Color</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div onClick={()=>setOpen(o=>!o)} style={{width:32,height:32,borderRadius:"50%",background:cur,cursor:"pointer",border:`3px solid ${cur}88`,boxShadow:open?`0 0 0 3px ${cur}44`:"none",transition:"box-shadow 0.15s"}}/>
          <span style={{fontSize:12,color:"#555",fontFamily:"monospace",letterSpacing:0.5}}>{cur}</span>
          <span style={{fontSize:10,color:"#444",cursor:"pointer",marginLeft:"auto"}} onClick={()=>setOpen(o=>!o)}>{open?"close":"change ↓"}</span>
        </div>
        {open&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:14,padding:"14px",background:"#0a0a0a",border:"1px solid #1a1a1a"}}>
            {COLORS.map(c=>(
              <div key={c} onClick={()=>{setEventOverride(ev.title,dateKey,{color:c});ev.color=c;setOpen(false);localBump();}}
                style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:`2.5px solid ${c===cur?"#fff":"transparent"}`,transition:"border 0.1s",boxShadow:c===cur?`0 0 0 2px ${c}88`:"none"}}/>
            ))}
          </div>
        )}
      </div>
    );
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{position:"absolute",inset:0,background:"#000",zIndex:200,display:"flex",flexDirection:"column",animation:"slideUp 0.22s ease"}} onClick={()=>menuOpen&&setMenuOpen(false)}>
      <style>{`@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* Clean header — back + three dots only */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",flexShrink:0,background:"#000"}}>
        <div onClick={onClose} style={{cursor:"pointer",padding:"4px 6px 4px 2px",display:"flex",alignItems:"center"}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{position:"relative"}}>
          <div onClick={e=>{e.stopPropagation();setMenuOpen(o=>!o);}} style={{cursor:"pointer",padding:"4px 6px",display:"flex",alignItems:"center",gap:3}}>
            {[0,1,2].map(i=><div key={i} style={{width:3.5,height:3.5,borderRadius:"50%",background:"#666"}}/>)}
          </div>
          {menuOpen&&(
            <div style={{position:"absolute",top:"100%",right:0,background:"#111",border:"1px solid #222",minWidth:160,zIndex:10,boxShadow:"0 4px 20px #000a"}}>
              {[
                {label:"Change color", action:()=>{setMenuOpen(false); startEdit("__colorpicker__","");}},
                {label:isDone?"Mark incomplete":"Mark complete", action:()=>{handleMainCheck();setMenuOpen(false);}},
                {label:"Edit title", action:()=>{setMenuOpen(false);startEdit("title",merged.title||ev.title);}},
              ].map(({label,action})=>(
                <div key={label} onClick={action} style={{padding:"11px 14px",fontSize:12,color:"#bbb",cursor:"pointer",borderBottom:"1px solid #1a1a1a"}}>{label}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{flex:1,overflowY:"auto",background:meta.cardBg}}>
        {/* Progress strip */}
        {hasSubtasks&&(
          <div style={{height:3,background:"#111",position:"relative",flexShrink:0}}>
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${progressPct}%`,background:accentColor,transition:"width 0.4s"}}/>
          </div>
        )}

        <div style={{padding:"20px 18px 0"}}>
          {/* Title block */}
          <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:16}}>
            {/* Checkbox / progress circle */}
            {hasSubtasks ? (
              <div style={{width:32,height:32,flexShrink:0,marginTop:2}}>
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="13" fill="none" stroke="#1e1e1e" strokeWidth="3"/>
                  {isDone ? <circle cx="16" cy="16" r="13" fill="none" stroke={accentColor} strokeWidth="3"/> : progressPct>0&&<circle cx="16" cy="16" r="13" fill="none" stroke={accentColor} strokeWidth="3" strokeDasharray={`${2*Math.PI*13}`} strokeDashoffset={`${2*Math.PI*13*(1-progressPct/100)}`} strokeLinecap="round" transform="rotate(-90 16 16)" style={{transition:"stroke-dashoffset 0.3s"}}/>}
                  {isDone ? <path d="M10 16.5l4.5 4.5 8-9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/> : <text x="16" y="16" dominantBaseline="middle" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={progressPct>0?accentColor:"#333"} fontFamily="system-ui">{progressPct>0?progressPct:"·"}</text>}
                </svg>
              </div>
            ) : (
              <div onClick={handleMainCheck} style={{width:32,height:32,borderRadius:meta.checkRadius==="50%"?"50%":meta.checkRadius,border:`2px solid ${isDone?accentColor:"#333"}`,background:isDone?accentColor:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,cursor:"pointer",transition:"all 0.15s"}}>
                {isDone&&<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            )}

            <div style={{flex:1,minWidth:0}}>
              {/* Editable title */}
              {editing==="title" ? (
                <div>
                  <input value={draft} onChange={e=>setDraft(e.target.value)} autoFocus
                    style={{width:"100%",background:"transparent",border:"none",borderBottom:`1px solid ${accentColor}66`,outline:"none",color:"#fff",fontSize:20,fontWeight:700,fontFamily:"inherit",padding:"0 0 4px",boxSizing:"border-box"}}
                    onKeyDown={e=>{if(e.key==="Enter")saveEdit("title");if(e.key==="Escape")cancelEdit();}}/>
                  <div style={{display:"flex",gap:8,marginTop:6}}>
                    <span onClick={()=>saveEdit("title")} style={{fontSize:10,color:accentColor,cursor:"pointer",border:`1px solid ${accentColor}55`,padding:"2px 8px"}}>save</span>
                    <span onClick={cancelEdit} style={{fontSize:10,color:"#444",cursor:"pointer"}}>cancel</span>
                  </div>
                </div>
              ) : (
                <div onClick={()=>startEdit("title",merged.title||ev.title)} style={{fontSize:20,fontWeight:700,color:isDone?"#555":"#fff",textDecoration:isDone?"line-through":"none",lineHeight:1.3,cursor:"text"}}>{merged.title||ev.title}</div>
              )}

              {/* Badge + time + duration row */}
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8,flexWrap:"wrap"}}>
                <span style={{fontSize:9,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase",color:badgeColor,border:`1px solid ${badgeBorder}`,padding:"2px 6px",borderRadius:isHabit?8:2,background:badgeBg}}>{meta.label(ev)}</span>
                {merged.time&&<span style={{fontSize:11,color:"#555"}}>{merged.time}</span>}
                {merged.duration&&merged.duration!=="—"&&<><span style={{color:"#2a2a2a",fontSize:10}}>·</span><span style={{fontSize:11,color:"#444"}}>{merged.duration}</span></>}
              </div>
            </div>
          </div>

          {/* Quick meta chips */}
          <div style={{display:"flex",gap:8,marginBottom:26,flexWrap:"wrap"}}>
            {[{label:"Time",field:"time",val:merged.time},{label:"Duration",field:"duration",val:merged.duration}].map(({label,field,val})=>(
              <div key={field} onClick={()=>startEdit(field,val||"")}
                style={{background:"#111",border:`1px solid ${editing===field?accentColor+"66":"#1a1a1a"}`,padding:"8px 12px",cursor:"text",flex:1,minWidth:80,transition:"border 0.15s"}}>
                <div style={{fontSize:9,color:"#444",letterSpacing:0.8,textTransform:"uppercase",marginBottom:4}}>{label}</div>
                {editing===field ? (
                  <input value={draft} onChange={e=>setDraft(e.target.value)} autoFocus onKeyDown={e=>{if(e.key==="Enter")saveEdit(field);if(e.key==="Escape")cancelEdit();}}
                    style={{width:"100%",background:"transparent",border:"none",outline:"none",color:"#ddd",fontSize:13,fontFamily:"inherit",padding:0}}/>
                ) : (
                  <div style={{fontSize:13,color:val?"#bbb":"#333",fontStyle:val?"normal":"italic"}}>{val||"tap to set"}</div>
                )}
              </div>
            ))}
          </div>

          <EditableField label={meta.sectionLabel} field="task" value={merged.task} multiline placeholder="What needs to be done?"/>
          <EditableField label="Why this matters" field="why" value={merged.why} multiline placeholder="What's the deeper reason?"/>
          {hasSubtasks ? <SubtaskEditor/> : <HowEditor/>}
          <EditableField label="Tools needed" field="tools" value={merged.tools} placeholder="Apps, equipment, resources..."/>
          <ColorPicker/>
          <EditableField label="Notes" field="notes" value={merged.notes} multiline placeholder="Extra context, reminders, ideas..."/>

          {isHabit&&<HabitTracker title={ev.title} color={accentColor} year={year} month={month}/>}

          {ev.youtube&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Watch</div>
              <div style={{position:"relative",width:"100%",paddingBottom:"56.25%",background:"#0a0a0a",border:"1px solid #1a1a1a"}}>
                <iframe src={`https://www.youtube.com/embed/${ev.youtube}?rel=0&modestbranding=1`} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}/>
              </div>
            </div>
          )}

          <div style={{borderTop:"1px solid #111",paddingTop:18,marginTop:4,display:"flex",flexDirection:"column",gap:18}}>
            <ContactSection evTitle={ev.title} evType={ev.type} accentColor={accentColor}/>
            <AttachmentSection evTitle={ev.title} evType={ev.type} accentColor={accentColor}/>
          </div>
          <div style={{height:40}}/>
        </div>
      </div>
    </div>
  );
}

// ─── EVENT OVERRIDES (customizations per event) ──────────────────────────────
const eventOverrides = {};
function getOverrideKey(title, dateKey) { return `${title}|${dateKey}`; }
function getEventOverride(title, dateKey) { return eventOverrides[getOverrideKey(title, dateKey)] || {}; }
function setEventOverride(title, dateKey, patch) {
  const k = getOverrideKey(title, dateKey);
  eventOverrides[k] = { ...(eventOverrides[k] || {}), ...patch };
}

// ─── EVENT CARD ───────────────────────────────────────────────────────────────
function EventCard({ ev, dateKey, year, month, forceUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [, rerender] = useState(0);
  const bump = () => { rerender(n=>n+1); forceUpdate(n=>n+1); };
  const isHabit = ev.type === "habit";
  const hasSubtasks = ev.subtasks && ev.subtasks.length > 0;
  const meta = TYPE_META[ev.type] || TYPE_META.task;

  // Completion logic
  const habitDone = isHabit ? isHabitDone(ev.title, dateKey) : false;
  const subtasksDone = hasSubtasks ? allSubtasksDone(ev, dateKey) : false;
  const [taskDone, setTaskDone] = useState(false);

  // For events with subtasks: done = all subtasks checked. For regular habits: done = markHabit. For tasks: local state.
  const isDone = hasSubtasks ? subtasksDone : (isHabit ? habitDone : taskDone);
  const accentColor = isDone ? "#333" : ev.color;
  const badgeColor = isHabit ? ev.color : meta.badgeColor;
  const badgeBorder = isHabit ? ev.color+"55" : meta.badgeBorder;
  const badgeBg = isHabit ? ev.color+"11" : meta.badgeBg;

  // Subtask progress
  const doneCount = hasSubtasks ? ev.subtasks.filter(st => isSubtaskDone(ev.title, dateKey, st.id)).length : 0;
  const totalCount = hasSubtasks ? ev.subtasks.length : 0;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const handleMainCheck = () => {
    if (hasSubtasks) {
      // Toggle all subtasks at once
      const allDone = allSubtasksDone(ev, dateKey);
      ev.subtasks.forEach(st => markSubtask(ev.title, dateKey, st.id, !allDone));
      bump();
    } else if (isHabit) {
      markHabit(ev.title, dateKey, !habitDone);
      bump();
    } else {
      setTaskDone(d=>!d);
    }
  };

  return (
    <div style={{background:meta.cardBg,borderLeft:`3px solid ${accentColor}`,animation:"fadeIn 0.15s ease",userSelect:"none",opacity:isDone?0.5:1,transition:"opacity 0.2s, border-color 0.2s",position:"relative",overflow:"hidden"}}>
      {isHabit&&!isDone&&<div style={{position:"absolute",top:0,right:0,width:36,height:36,background:`repeating-linear-gradient(45deg,transparent,transparent 3px,${ev.color}18 3px,${ev.color}18 6px)`,borderBottomLeftRadius:4}}/>}
      {/* Header row — self-contained with both corner buttons */}
      <div style={{position:"relative"}}>
        {/* Open detail button — top right corner */}
        <div onClick={e=>{e.stopPropagation();openTaskDetail(ev,dateKey,year,month,bump);}} style={{position:"absolute",top:0,right:0,padding:"5px 7px",cursor:"pointer",zIndex:2,opacity:0.5,lineHeight:1}} title="Open detail">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="#888" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="15 3 21 3 21 9" stroke="#888" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><line x1="10" y1="14" x2="21" y2="3" stroke="#888" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        {/* Chevron — bottom right corner of the header row */}
        <div onClick={()=>setExpanded(e=>!e)} style={{position:"absolute",bottom:0,right:0,padding:"5px 7px",cursor:"pointer",zIndex:2,lineHeight:1}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{display:"block",transform:expanded?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}><path d="M6 9l6 6 6-6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px"}}>
        {hasSubtasks ? (
          <div style={{width:22,height:22,flexShrink:0,cursor:"default"}} onClick={e=>e.stopPropagation()}>
            <svg width="22" height="22" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="9" fill="none" stroke="#222" strokeWidth="2.5"/>
              {isDone
                ? <circle cx="11" cy="11" r="9" fill="none" stroke={ev.color} strokeWidth="2.5"/>
                : progressPct > 0 && (
                  <circle cx="11" cy="11" r="9" fill="none"
                    stroke={ev.color} strokeWidth="2.5"
                    strokeDasharray={`${2*Math.PI*9}`}
                    strokeDashoffset={`${2*Math.PI*9*(1-progressPct/100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 11 11)"
                    style={{transition:"stroke-dashoffset 0.3s"}}
                  />
                )
              }
              {isDone
                ? <path d="M6.5 11.5l3 3 6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                : <text x="11" y="11" dominantBaseline="middle" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={progressPct>0?ev.color:"#444"} fontFamily="system-ui">{progressPct>0?`${progressPct}`:"·"}</text>
              }
            </svg>
          </div>
        ) : (
        <div onClick={e=>{e.stopPropagation(); handleMainCheck();}} style={{width:22,height:22,borderRadius:ev.type==="easy"?"50%":meta.checkRadius,border:`2px solid ${isDone?ev.color:"#333"}`,background:isDone?ev.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"background 0.15s, border-color 0.15s"}}>
          {isDone
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : ev.type==="easy" && <OilDropIcon size={13} color="#f5c842" filled={false}/>
          }
        </div>
        )}
        <div style={{flex:1,cursor:"pointer"}} onClick={()=>setExpanded(e=>!e)}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
            <div style={{fontSize:14,fontWeight:600,color:isDone?"#444":"#fff",textDecoration:isDone?"line-through":"none",transition:"color 0.2s"}}>{ev.title}</div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase",color:badgeColor,border:`1px solid ${badgeBorder}`,padding:"1px 5px",borderRadius:isHabit?8:2,background:badgeBg,flexShrink:0,display:"flex",alignItems:"center",gap:3}}>
              {ev.type==="easy"
                ? <><OilDropIcon size={9} color="#f5c842" filled={true}/><span>easy</span></>
                : meta.label(ev)
              }
            </div>
            {hasSubtasks && !isDone && (
              <div style={{fontSize:9,color:ev.color,background:ev.color+"11",border:`1px solid ${ev.color}33`,padding:"1px 6px",borderRadius:8,flexShrink:0}}>
                {doneCount}/{totalCount}
              </div>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {ev.time
              ? <span style={{fontSize:12,color:"#555"}}>{ev.time}</span>
              : <span style={{fontSize:11,color:"#333",fontStyle:"italic",letterSpacing:0.2}}>anytime</span>
            }
            {ev.duration && ev.duration !== "—" && <>
              <span style={{color:"#2a2a2a",fontSize:10}}>|</span>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#555" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="#555" strokeWidth="2" strokeLinecap="round"/></svg>
                <span style={{fontSize:12,color:"#555"}}>{ev.duration}</span>
              </div>
            </>}
            {hasSubtasks && !isDone && doneCount > 0 && (
              <div style={{flex:1,height:2,background:"#1a1a1a",borderRadius:1,overflow:"hidden",maxWidth:60}}>
                <div style={{width:`${progressPct}%`,height:"100%",background:ev.color,borderRadius:1,transition:"width 0.3s"}}/>
              </div>
            )}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
          {(()=>{const ck=getContactKey(ev.title,ev.type);const cc=(contactStore[ck]||[]);return cc.length>0?<div style={{display:"flex",alignItems:"center"}}>{cc.slice(0,4).map((c,i)=><div key={c.id} style={{marginLeft:i>0?-6:0,zIndex:4-i}}><Avatar contact={c} size={20}/></div>)}{cc.length>4&&<div style={{width:20,height:20,borderRadius:"50%",background:"#1a1a1a",border:"1px solid #333",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#555",marginLeft:-6}}>+{cc.length-4}</div>}</div>:null;})()}
          {(()=>{const k=getAttachKey(ev.title,ev.type);const cnt=(attachmentStore[k]||[]).length;return cnt>0?<div style={{fontSize:9,color:"#555",border:"1px solid #1e1e1e",padding:"1px 5px",borderRadius:2,display:"flex",alignItems:"center",gap:3}}><span>📎</span>{cnt}</div>:null;})()}
        </div>
      </div>
      {expanded&&(
        <div style={{padding:"0 14px 14px 46px",display:"flex",flexDirection:"column",gap:14,borderTop:"1px solid #141414"}}>
          <div style={{height:2}}/>
          {ev.task&&<div><div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{meta.sectionLabel}</div><div style={{fontSize:13,color:"#bbb",lineHeight:1.5}}>→ {ev.task}</div></div>}
          {ev.why&&<div><div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Why this matters</div><div style={{fontSize:13,color:"#888",lineHeight:1.5}}>{ev.why}</div></div>}

          {/* Subtasks */}
          {hasSubtasks && (
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1}}>Steps — {doneCount}/{totalCount} done</div>
                {doneCount > 0 && doneCount < totalCount && (
                  <div style={{height:3,width:80,background:"#1a1a1a",borderRadius:2,overflow:"hidden"}}>
                    <div style={{width:`${progressPct}%`,height:"100%",background:ev.color,borderRadius:2,transition:"width 0.3s"}}/>
                  </div>
                )}
                {isDone && <div style={{fontSize:9,color:ev.color,fontWeight:700,letterSpacing:0.5}}>ALL DONE ✓</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                {ev.subtasks.map((st, i) => {
                  const stDone = isSubtaskDone(ev.title, dateKey, st.id);
                  return (
                    <div key={st.id}
                      onClick={()=>{ markSubtask(ev.title, dateKey, st.id, !stDone); bump(); }}
                      style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",background:stDone?"#0d0d0d":"#080808",borderLeft:`2px solid ${stDone?ev.color+"66":"#1a1a1a"}`,cursor:"pointer",transition:"all 0.15s",userSelect:"none"}}>
                      {/* Checkbox */}
                      <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${stDone?ev.color:"#2a2a2a"}`,background:stDone?ev.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all 0.15s"}}>
                        {stDone && <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,color:stDone?"#444":"#bbb",textDecoration:stDone?"line-through":"none",lineHeight:1.4,transition:"color 0.15s"}}>{st.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!hasSubtasks && ev.how&&ev.how.length>0&&<div><div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>How to do it right</div><div style={{display:"flex",flexDirection:"column",gap:5}}>{ev.how.map((step,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}><div style={{width:4,height:4,background:"#333",flexShrink:0,marginTop:5}}/><span style={{fontSize:13,color:"#888",lineHeight:1.5}}>{step}</span></div>)}</div></div>}
          {ev.tools&&<div><div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Tools needed</div><div style={{fontSize:13,color:"#888"}}>{ev.tools}</div></div>}
          {ev.youtube&&<div><div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Watch</div><div style={{position:"relative",width:"100%",paddingBottom:"56.25%",background:"#0a0a0a",border:"1px solid #1a1a1a"}}><iframe src={`https://www.youtube.com/embed/${ev.youtube}?rel=0&modestbranding=1`} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}/></div></div>}
          {isHabit&&<HabitTracker title={ev.title} color={ev.color} year={year} month={month}/>}
          <ContactSection evTitle={ev.title} evType={ev.type} accentColor={accentColor}/>
          <AttachmentSection evTitle={ev.title} evType={ev.type} accentColor={accentColor}/>
        </div>
      )}
    </div>
  );
}

// ─── NOTES TAB DATA ───────────────────────────────────────────────────────────
const FIELDS = [
  { id:"all",         label:"All",          color:"#888",    icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { id:"finance",     label:"Finance",      color:"#4ade80", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round"/></svg> },
  { id:"economics",   label:"Economics",    color:"#38bdf8", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> },
  { id:"business",    label:"Business",     color:"#fb923c", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
  { id:"psychology",  label:"Psychology",   color:"#c084fc", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A6.5 6.5 0 0 1 16 8.5c0 2.5-1.5 4.7-3.5 5.8V17h-3v-2.7C7.5 13.2 6 11 6 8.5A6.5 6.5 0 0 1 9.5 2z"/><path d="M9 17h6v2H9zM10 19v2M14 19v2" strokeLinecap="round"/></svg> },
  { id:"philosophy",  label:"Philosophy",   color:"#fbbf24", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" strokeLinecap="round"/></svg> },
  { id:"science",     label:"Science",      color:"#34d399", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" strokeLinecap="round"/></svg> },
  { id:"technology",  label:"Technology",   color:"#86efac", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { id:"mathematics", label:"Mathematics",  color:"#93c5fd", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6l9 6-9 6" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id:"history",     label:"History",      color:"#f9a8d4", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round"/></svg> },
  { id:"literature",  label:"Literature",   color:"#d8b4fe", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { id:"law",         label:"Law",          color:"#fca5a5", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22V2M3 9l9-7 9 7M5 21h14M7 9l5 3 5-3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id:"medicine",    label:"Medicine",     color:"#f87171", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { id:"arts",        label:"Arts",         color:"#f472b6", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" strokeLinecap="round"/></svg> },
  { id:"sociology",   label:"Sociology",    color:"#fb923c", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/></svg> },
  { id:"politics",    label:"Politics",     color:"#67e8f9", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> },
  { id:"engineering", label:"Engineering",  color:"#a3e635", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> },
  { id:"personal",    label:"Personal",     color:"#fb7185", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

function guessField(ev) {
  const t = ((ev.title||"") + " " + (ev.prompt||"") + " " + (ev.tags||[]).join(" ")).toLowerCase();
  if (t.match(/finance|invest|stock|fund|budget|revenue|valuation|money|wealth|portfolio/)) return "finance";
  if (t.match(/econom|market|gdp|supply|demand|trade|macro|micro|inflation|recession/)) return "economics";
  if (t.match(/business|startup|product|strategy|brand|sales|client|customer|commerce|scent/)) return "business";
  if (t.match(/psycholog|mental|behavior|cognit|emotion|habit|mind|therapy|anxiety/)) return "psychology";
  if (t.match(/philosoph|ethic|logic|moral|exist|meaning|truth|stoic|virtue/)) return "philosophy";
  if (t.match(/science|physics|biology|chemistry|research|experiment|crispr|genome/)) return "science";
  if (t.match(/tech|software|api|code|auth|system|ai|ml|oauth|microservice|architect/)) return "technology";
  if (t.match(/math|calcul|algebra|statistic|probability|formula|bayes/)) return "mathematics";
  if (t.match(/histor|war|civiliz|empire|century|ancient|constantinople|byzantine/)) return "history";
  if (t.match(/literatur|novel|book|story|fiction|essay|piranesi|writing|narrative/)) return "literature";
  if (t.match(/law|legal|regulat|contract|right|court|policy|antitrust/)) return "law";
  if (t.match(/medicine|medic|health|doctor|treatment|diagnos|vo2|longevity/)) return "medicine";
  if (t.match(/art|design|music|film|creative|aesthetic|visual|bauhaus/)) return "arts";
  if (t.match(/social|society|community|culture|norms|group|dunbar/)) return "sociology";
  if (t.match(/politic|government|democra|power|elect|demagogu|republic/)) return "politics";
  if (t.match(/engineer|architect|system|build|infra|migration/)) return "engineering";
  return "personal";
}

const SAMPLE_NOTES = [
  { type:"article", title:"The Psychology of Money",     prompt:"How emotions sabotage investment decisions — and how to build systems that override them.",          tags:["finance","behavior"],       wordGoal:1200, color:"#93c5fd" },
  { type:"doc",     title:"Macro Econ Thesis Draft",     prompt:"Supply shock propagation in open economies — evidence from post-COVID commodity markets.",           tags:["economics","macro"],        wordGoal:3000, color:"#86efac" },
  { type:"note",    title:"The Double Bind Theory",      prompt:"Gregory Bateson's communication trap and its role in schizophrenia diagnosis.",                      tags:["psychology","therapy"],     wordGoal:400,  color:"#c084fc" },
  { type:"draft",   title:"On Stoic Acceptance",         prompt:"What Marcus Aurelius actually meant by amor fati — and why modern self-help gets it wrong.",         tags:["stoicism","philosophy"],    wordGoal:700,  color:"#fbbf24" },
  { type:"article", title:"CRISPR Ethics Landscape",     prompt:"The regulatory gap in human genome editing after the He Jiankui case.",                             tags:["science","bioethics"],      wordGoal:900,  color:"#34d399" },
  { type:"doc",     title:"OAuth2 Token Flow",           prompt:"Document the full OAuth2 authorization code grant with PKCE for our API.",                          tags:["engineering","auth"],       wordGoal:500,  color:"#86efac" },
  { type:"note",    title:"Bayes' Rule in Practice",     prompt:"Why updating priors matters more than picking the right prior to begin with.",                       tags:["math","probability"],       wordGoal:300,  color:"#93c5fd" },
  { type:"article", title:"Fall of Constantinople",      prompt:"How a 53-day siege ended 1100 years of Roman civilization in the East.",                            tags:["history","Byzantine"],      wordGoal:1500, color:"#f9a8d4" },
  { type:"journal", title:"October Dispatch",            prompt:"Start with what surprised you most this month — lead with a hook, not a summary.",                   tags:["newsletter"],               wordGoal:600,  color:"#fb7185" },
  { type:"draft",   title:"Piranesi Analysis",           prompt:"What Susanna Clarke is really saying about memory, identity, and captivity.",                       tags:["reading","fiction"],        wordGoal:800,  color:"#d8b4fe" },
  { type:"article", title:"Antitrust in Big Tech",       prompt:"Why existing antitrust doctrine is structurally unequipped to handle platform monopolies.",          tags:["law","tech"],               wordGoal:1000, color:"#fca5a5" },
  { type:"note",    title:"VO₂ Max & Longevity",         prompt:"Peter Attia's data on cardiorespiratory fitness as the single best longevity predictor.",            tags:["medicine","health"],        wordGoal:350,  color:"#f87171" },
  { type:"article", title:"Bauhaus & Modern UI",         prompt:"How Bauhaus principles of function-over-form shaped every interface you use today.",                 tags:["design","art","history"],   wordGoal:700,  color:"#f472b6" },
  { type:"draft",   title:"Network Effects Decay",       prompt:"Why Metcalfe's Law breaks down and how disruptors beat entrenched network effects.",                 tags:["economics","platforms"],    wordGoal:900,  color:"#38bdf8" },
  { type:"note",    title:"Dunbar's Number",             prompt:"150 and the hard limits of human social cognition in digital communities.",                          tags:["sociology","anthropology"], wordGoal:280,  color:"#fb923c" },
  { type:"article", title:"Democracy & Demagoguery",     prompt:"Plato's Republic warned us. Why do liberal democracies keep forgetting?",                           tags:["politics","history"],       wordGoal:1100, color:"#67e8f9" },
  { type:"doc",     title:"Microservices Migration",     prompt:"System architecture for the new microservices migration — C4 model approach.",                       tags:["engineering","architecture"],wordGoal:1200, color:"#a3e635" },
  { type:"article", title:"The Scent of Commerce",       prompt:"How ambient scent drives dwell time, recall, and conversion in retail environments.",                tags:["business","ux"],            wordGoal:800,  color:"#fb923c" },
  { type:"note",    title:"Prospect Theory Explained",   prompt:"Kahneman & Tversky: why losses loom twice as large as equivalent gains in decision-making.",         tags:["economics","psychology"],   wordGoal:420,  color:"#38bdf8" },
  { type:"draft",   title:"Effective Altruism Critique", prompt:"The philosophical holes in expected-value reasoning when applied to existential risk prioritization.", tags:["philosophy","ethics"],      wordGoal:950,  color:"#fbbf24" },
  { type:"project", title:"Product Rebrand 2025",        prompt:"Full brand overhaul from identity to launch.", tags:["business","design"], color:"#fb923c",
    status:"active", due:"2025-06-30", team:["Alex","Maria","Tom"],
    phases:[
      { id:"ph1", title:"Discovery", color:"#fb923c", status:"done",
        tasks:[
          { id:"t1", title:"Stakeholder interviews", done:true, due:"2025-01-15", priority:"high", assignee:"Alex" },
          { id:"t2", title:"Competitor audit", done:true, due:"2025-01-20", priority:"medium", assignee:"Maria" },
          { id:"t3", title:"Brand values workshop", done:true, due:"2025-01-28", priority:"high", assignee:"Alex" },
        ]},
      { id:"ph2", title:"Strategy", color:"#fbbf24", status:"done",
        tasks:[
          { id:"t4", title:"Define brand pillars", done:true, due:"2025-02-10", priority:"high", assignee:"Alex" },
          { id:"t5", title:"Positioning statement draft", done:true, due:"2025-02-15", priority:"high", assignee:"Maria" },
          { id:"t6", title:"Stakeholder sign-off", done:true, due:"2025-02-20", priority:"medium", assignee:"Alex" },
        ]},
      { id:"ph3", title:"Design", color:"#c084fc", status:"active",
        tasks:[
          { id:"t7", title:"Logo concepts (3 directions)", done:true, due:"2025-03-05", priority:"high", assignee:"Tom" },
          { id:"t8", title:"Color palette & typography", done:false, due:"2025-03-12", priority:"high", assignee:"Tom" },
          { id:"t9", title:"Brand guidelines v1", done:false, due:"2025-03-25", priority:"medium", assignee:"Tom" },
          { id:"t10", title:"Social media templates", done:false, due:"2025-04-01", priority:"low", assignee:"Maria" },
        ]},
      { id:"ph4", title:"Launch", color:"#34d399", status:"upcoming",
        tasks:[
          { id:"t11", title:"Website redesign", done:false, due:"2025-05-01", priority:"high", assignee:"Tom" },
          { id:"t12", title:"Press kit", done:false, due:"2025-05-15", priority:"medium", assignee:"Maria" },
          { id:"t13", title:"Internal announcement", done:false, due:"2025-06-01", priority:"medium", assignee:"Alex" },
          { id:"t14", title:"Public launch", done:false, due:"2025-06-30", priority:"high", assignee:"Alex" },
        ]},
    ]},
  { type:"project", title:"Mobile App MVP",              prompt:"Ship the v1 of the notes app to the App Store.", tags:["technology","engineering"], color:"#fb923c",
    status:"active", due:"2025-08-01", team:["Sam","Lin","Dev"],
    phases:[
      { id:"pa1", title:"Planning", color:"#fb923c", status:"done",
        tasks:[
          { id:"a1", title:"Define MVP scope", done:true, due:"2025-02-01", priority:"high", assignee:"Sam" },
          { id:"a2", title:"Technical architecture doc", done:true, due:"2025-02-10", priority:"high", assignee:"Dev" },
        ]},
      { id:"pa2", title:"Build", color:"#38bdf8", status:"active",
        tasks:[
          { id:"a3", title:"Auth flow", done:true, due:"2025-03-01", priority:"high", assignee:"Dev" },
          { id:"a4", title:"Core editor", done:false, due:"2025-04-15", priority:"high", assignee:"Dev" },
          { id:"a5", title:"Sync engine", done:false, due:"2025-05-01", priority:"high", assignee:"Dev" },
          { id:"a6", title:"UI polish pass", done:false, due:"2025-06-01", priority:"medium", assignee:"Lin" },
        ]},
      { id:"pa3", title:"Ship", color:"#34d399", status:"upcoming",
        tasks:[
          { id:"a7", title:"Beta testing", done:false, due:"2025-07-01", priority:"high", assignee:"Sam" },
          { id:"a8", title:"App Store submission", done:false, due:"2025-07-20", priority:"high", assignee:"Sam" },
        ]},
    ]},
];

function getAllNotes() {
  const writingTypes = new Set(["note","article","doc","journal","draft","project"]);
  const out = [];
  Object.entries(events).forEach(([, parts]) => {
    Object.values(parts).forEach(evList => {
      (evList||[]).forEach(ev => {
        if (writingTypes.has(ev.type)) out.push({ ...ev, field: guessField(ev) });
      });
    });
  });
  SAMPLE_NOTES.forEach(n => out.push({ ...n, field: guessField(n) }));
  return out;
}

const NOTE_TYPE_STYLE = {
  note:    { label:"note",    color:"#a1a1aa", bg:"#a1a1aa12" },
  article: { label:"article", color:"#93c5fd", bg:"#93c5fd12" },
  doc:     { label:"doc",     color:"#86efac", bg:"#86efac12" },
  journal: { label:"journal", color:"#f9a8d4", bg:"#f9a8d412" },
  draft:   { label:"draft",   color:"#d8b4fe", bg:"#d8b4fe12" },
  project: { label:"project", color:"#fb923c", bg:"#fb923c12" },
};

// ─── PROJECT SCREEN ───────────────────────────────────────────────────────────
const PHASE_COLORS = ["#fb923c","#fbbf24","#34d399","#4ade80","#38bdf8","#818cf8","#c084fc","#f472b6","#ef5350","#a3e635","#2dd4bf","#e879f9"];

function ProjectScreen({ ev, onClose }) {
  const accent = "#fb923c";
  const [phases, setPhases] = useState(() => (ev.phases || []).map(ph => ({
    ...ph,
    tasks: (ph.tasks || []).map(t => ({ ...t }))
  })));
  const [activePhaseId, setActivePhaseId] = useState(ev.phases?.[0]?.id || null);
  const [view, setView] = useState("board");
  const [addingTask, setAddingTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

  // Phase editor state
  const [phaseEditor, setPhaseEditor] = useState(null); // null | { phId } | { phId: "__new__" }
  const [editPhaseTitle, setEditPhaseTitle] = useState("");
  const [editPhaseColor, setEditPhaseColor] = useState(PHASE_COLORS[0]);
  const [editPhaseStatus, setEditPhaseStatus] = useState("upcoming");

  const projectContactKey = getContactKey(ev.title, "project");
  if (!contactStore[projectContactKey]) contactStore[projectContactKey] = [];
  const [teamContacts, setTeamContacts] = useState([...contactStore[projectContactKey]]);
  const [teamKey, setTeamKey] = useState(0);
  const refreshTeam = () => {
    setTeamContacts([...contactStore[projectContactKey]]);
    setTeamKey(k => k + 1);
  };

  const totalTasks = phases.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks  = phases.reduce((a, p) => a + p.tasks.filter(t => t.done).length, 0);
  const progress   = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const toggleTask = (phId, tId) => {
    setPhases(ps => ps.map(ph => ph.id !== phId ? ph : {
      ...ph, tasks: ph.tasks.map(t => t.id === tId ? { ...t, done: !t.done } : t)
    }));
  };

  const addTask = (phId) => {
    if (!newTaskTitle.trim()) return;
    const task = { id: "t_" + Date.now(), title: newTaskTitle.trim(), done: false, priority: newTaskPriority, assignee: newTaskAssignee.trim() || "—", due: "" };
    setPhases(ps => ps.map(ph => ph.id !== phId ? ph : { ...ph, tasks: [...ph.tasks, task] }));
    setNewTaskTitle(""); setNewTaskAssignee(""); setNewTaskPriority("medium"); setAddingTask(null);
  };

  const deleteTask = (phId, tId) => {
    setPhases(ps => ps.map(ph => ph.id !== phId ? ph : { ...ph, tasks: ph.tasks.filter(t => t.id !== tId) }));
  };

  // ── Phase mutations ──
  const openNewPhase = () => {
    setEditPhaseTitle("");
    setEditPhaseColor(PHASE_COLORS[phases.length % PHASE_COLORS.length]);
    setEditPhaseStatus("upcoming");
    setPhaseEditor({ phId: "__new__" });
  };

  const openEditPhase = (ph) => {
    setEditPhaseTitle(ph.title);
    setEditPhaseColor(ph.color || accent);
    setEditPhaseStatus(ph.status || "upcoming");
    setPhaseEditor({ phId: ph.id });
  };

  const savePhase = () => {
    if (!editPhaseTitle.trim()) return;
    if (phaseEditor.phId === "__new__") {
      const newPh = { id: "ph_" + Date.now(), title: editPhaseTitle.trim(), color: editPhaseColor, status: editPhaseStatus, tasks: [] };
      setPhases(ps => [...ps, newPh]);
      setActivePhaseId(newPh.id);
    } else {
      setPhases(ps => ps.map(ph => ph.id !== phaseEditor.phId ? ph : { ...ph, title: editPhaseTitle.trim(), color: editPhaseColor, status: editPhaseStatus }));
    }
    setPhaseEditor(null);
  };

  const deletePhase = (phId) => {
    setPhases(ps => {
      const next = ps.filter(p => p.id !== phId);
      if (activePhaseId === phId && next.length > 0) setActivePhaseId(next[0].id);
      return next;
    });
    setPhaseEditor(null);
  };

  const movePhase = (phId, dir) => {
    setPhases(ps => {
      const idx = ps.findIndex(p => p.id === phId);
      if (idx < 0) return ps;
      const next = [...ps];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return ps;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const PRIORITY_COLOR = { high:"#ef5350", medium:"#fbbf24", low:"#4ade80" };
  const STATUS_COLOR   = { done:"#34d399", active:accent, upcoming:"#555" };
  const STATUS_LABEL   = { done:"Done", active:"In Progress", upcoming:"Upcoming" };

  const activePhase = phases.find(p => p.id === activePhaseId);

  // ── Phase Editor Modal ──
  const PhaseEditorModal = () => {
    if (!phaseEditor) return null;
    const isNew = phaseEditor.phId === "__new__";
    const ph = isNew ? null : phases.find(p => p.id === phaseEditor.phId);
    return (
      <div style={{ position:"absolute", inset:0, zIndex:50, display:"flex", flexDirection:"column", justifyContent:"flex-end", background:"rgba(0,0,0,0.7)" }}
        onClick={e => { if (e.target === e.currentTarget) setPhaseEditor(null); }}>
        <div style={{ background:"#0d0d0d", borderTop:`2px solid ${editPhaseColor}`, padding:"20px 20px 32px", animation:"slideUp 0.22s ease" }}>
          <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

          {/* Header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#d4d4d8" }}>{isNew ? "New Phase" : "Edit Phase"}</div>
            <div onClick={() => setPhaseEditor(null)} style={{ fontSize:18, color:"#444", cursor:"pointer", lineHeight:1 }}>×</div>
          </div>

          {/* Title */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:9, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Phase Name</div>
            <input
              autoFocus
              value={editPhaseTitle}
              onChange={e => setEditPhaseTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") savePhase(); if (e.key === "Escape") setPhaseEditor(null); }}
              placeholder="e.g. Discovery, Build, Launch…"
              style={{ width:"100%", background:"transparent", border:"none", borderBottom:`1px solid ${editPhaseColor}55`, outline:"none", color:"#d4d4d8", fontSize:15, fontWeight:600, padding:"4px 0 8px", boxSizing:"border-box", caretColor:editPhaseColor }}
            />
          </div>

          {/* Status */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:9, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Status</div>
            <div style={{ display:"flex", gap:6 }}>
              {[["upcoming","Upcoming"],["active","In Progress"],["done","Done"]].map(([val, label]) => (
                <div key={val} onClick={() => setEditPhaseStatus(val)}
                  style={{ flex:1, padding:"7px 4px", textAlign:"center", fontSize:10, cursor:"pointer", userSelect:"none",
                    background: editPhaseStatus === val ? STATUS_COLOR[val]+"22" : "#111",
                    border: `1px solid ${editPhaseStatus === val ? STATUS_COLOR[val]+"88" : "#1a1a1a"}`,
                    color: editPhaseStatus === val ? STATUS_COLOR[val] : "#444",
                  }}>{label}</div>
              ))}
            </div>
          </div>

          {/* Color */}
          <div style={{ marginBottom:22 }}>
            <div style={{ fontSize:9, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Color</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {PHASE_COLORS.map(c => (
                <div key={c} onClick={() => setEditPhaseColor(c)}
                  style={{ width:26, height:26, borderRadius:"50%", background:c, cursor:"pointer", flexShrink:0,
                    border: editPhaseColor === c ? `2px solid #fff` : `2px solid transparent`,
                    boxShadow: editPhaseColor === c ? `0 0 0 1px ${c}` : "none",
                    transition:"all 0.12s",
                  }}/>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div onClick={savePhase}
              style={{ flex:1, padding:"10px", textAlign:"center", fontSize:12, fontWeight:600, cursor: editPhaseTitle.trim() ? "pointer" : "default",
                background: editPhaseTitle.trim() ? editPhaseColor+"22" : "#111",
                border: `1px solid ${editPhaseTitle.trim() ? editPhaseColor+"88" : "#1a1a1a"}`,
                color: editPhaseTitle.trim() ? editPhaseColor : "#333",
              }}>{isNew ? "Add Phase" : "Save Changes"}</div>
            {!isNew && (
              <div onClick={() => deletePhase(ph.id)}
                style={{ padding:"10px 14px", fontSize:12, cursor:"pointer", background:"#ef535011", border:"1px solid #ef535033", color:"#ef5350" }}>
                Delete
              </div>
            )}
          </div>

          {/* Reorder controls (edit only) */}
          {!isNew && ph && (
            <div style={{ display:"flex", gap:8, marginTop:10 }}>
              <div onClick={() => { movePhase(ph.id, -1); }}
                style={{ flex:1, padding:"7px", textAlign:"center", fontSize:11, color:"#444", border:"1px solid #1a1a1a", cursor:"pointer" }}>
                ↑ Move Earlier
              </div>
              <div onClick={() => { movePhase(ph.id, 1); }}
                style={{ flex:1, padding:"7px", textAlign:"center", fontSize:11, color:"#444", border:"1px solid #1a1a1a", cursor:"pointer" }}>
                ↓ Move Later
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── OVERVIEW ──
  const Overview = () => (
    <div style={{ padding:"24px 20px 60px", overflowY:"auto", flex:1 }}>
      {/* Header card */}
      <div style={{ background:"#0d0a07", border:`1px solid ${accent}22`, borderLeft:`4px solid ${accent}`, padding:"18px 18px 16px", marginBottom:20 }}>
        <div style={{ fontSize:9, color:accent+"88", letterSpacing:1.4, textTransform:"uppercase", marginBottom:6 }}>◎ project</div>
        <div style={{ fontSize:20, fontWeight:700, color:"#d4d4d8", marginBottom:6, lineHeight:1.3 }}>{ev.title}</div>
        <div style={{ fontSize:12, color:"#555", marginBottom:14, lineHeight:1.6 }}>{ev.prompt}</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ fontSize:10, color:STATUS_COLOR[ev.status||"active"], border:`1px solid ${STATUS_COLOR[ev.status||"active"]}44`, padding:"3px 10px" }}>{STATUS_LABEL[ev.status||"active"]}</div>
          {ev.due && <div style={{ fontSize:10, color:"#555", border:"1px solid #1a1a1a", padding:"3px 10px" }}>Due {ev.due}</div>}
          {(ev.tags||[]).map(t => <div key={t} style={{ fontSize:9, color:"#333", border:"1px solid #1a1a1a", padding:"3px 8px" }}>#{t}</div>)}
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom:20, padding:"14px 16px", background:"#0a0a0a", border:"1px solid #111" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:11, color:"#666" }}>Overall progress</span>
          <span style={{ fontSize:11, color: progress===100 ? "#34d399" : accent }}>{progress}%</span>
        </div>
        <div style={{ height:4, background:"#111", borderRadius:2, overflow:"hidden", marginBottom:10 }}>
          <div style={{ width:`${progress}%`, height:"100%", background: progress===100 ? "#34d399" : accent, transition:"width 0.4s" }}/>
        </div>
        <div style={{ display:"flex", gap:16 }}>
          {[{ label:"Total tasks", val:totalTasks }, { label:"Done", val:doneTasks }, { label:"Remaining", val:totalTasks-doneTasks }, { label:"Phases", val:phases.length }].map((s,i) => (
            <div key={i} style={{ fontSize:10, color:"#333" }}><span style={{ color:"#444" }}>{s.label}: </span><span style={{ color:"#777" }}>{s.val}</span></div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{ marginBottom:20 }} onClick={refreshTeam} key={teamKey}>
        <ContactSection evTitle={ev.title} evType="project" accentColor={accent} />
      </div>

      {/* Phase summary */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontSize:9, color:"#333", letterSpacing:1.2, textTransform:"uppercase" }}>Phases</div>
        <div onClick={openNewPhase}
          style={{ fontSize:9, color:accent, border:`1px solid ${accent}44`, padding:"2px 10px", cursor:"pointer", letterSpacing:0.5 }}>
          + Add Phase
        </div>
      </div>
      {phases.length === 0 && (
        <div style={{ textAlign:"center", padding:"30px 20px", color:"#222", fontSize:12, fontStyle:"italic" }}>
          No phases yet — add your first one above
        </div>
      )}
      {phases.map((ph, pi) => {
        const phDone = ph.tasks.filter(t=>t.done).length;
        const phTotal = ph.tasks.length;
        const pct = phTotal === 0 ? 0 : Math.round((phDone/phTotal)*100);
        return (
          <div key={ph.id} style={{ padding:"12px 14px", background:"#080808", border:`1px solid ${ph.color||accent}1a`, borderLeft:`3px solid ${ph.color||accent}`, marginBottom:6, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ flex:1, cursor:"pointer" }} onClick={() => { setActivePhaseId(ph.id); setView("board"); }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:9, color:ph.color||accent, border:`1px solid ${ph.color||accent}44`, padding:"1px 6px", textTransform:"uppercase", letterSpacing:0.8 }}>{STATUS_LABEL[ph.status||"upcoming"]}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:"#999" }}>{pi+1}. {ph.title}</span>
                </div>
                <span style={{ fontSize:10, color:"#333" }}>{phDone}/{phTotal}</span>
              </div>
              <div style={{ height:2, background:"#111", borderRadius:1, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:ph.color||accent }}/>
              </div>
            </div>
            {/* Edit button */}
            <div onClick={e => { e.stopPropagation(); openEditPhase(ph); }}
              style={{ width:28, height:28, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"1px solid #1a1a1a", borderRadius:2 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── BOARD (phase task list) ──
  const Board = () => {
    if (!activePhase) return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
        <div style={{ fontSize:13, color:"#222", fontStyle:"italic" }}>No phases yet</div>
        <div onClick={openNewPhase} style={{ fontSize:11, color:accent, border:`1px solid ${accent}44`, padding:"8px 20px", cursor:"pointer" }}>+ Add First Phase</div>
      </div>
    );
    const phDone = activePhase.tasks.filter(t=>t.done).length;
    const phTotal = activePhase.tasks.length;
    const pct = phTotal===0?0:Math.round((phDone/phTotal)*100);

    return (
      <div style={{ flex:1, overflowY:"auto", padding:"20px 16px 60px" }}>
        {/* Phase header */}
        <div style={{ marginBottom:16, padding:"12px 14px", background:"#0a0a0a", borderLeft:`3px solid ${activePhase.color||accent}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <div>
              <div style={{ fontSize:9, color:activePhase.color||accent, letterSpacing:1.2, textTransform:"uppercase", marginBottom:3 }}>Phase {phases.indexOf(activePhase)+1}</div>
              <div style={{ fontSize:17, fontWeight:700, color:"#d4d4d8" }}>{activePhase.title}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ fontSize:10, color:STATUS_COLOR[activePhase.status||"upcoming"], border:`1px solid ${STATUS_COLOR[activePhase.status||"upcoming"]}44`, padding:"3px 8px" }}>
                {STATUS_LABEL[activePhase.status||"upcoming"]}
              </div>
              <div onClick={() => openEditPhase(activePhase)}
                style={{ width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"1px solid #1a1a1a", borderRadius:2 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ flex:1, height:3, background:"#111", borderRadius:2, overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", background:activePhase.color||accent }}/>
            </div>
            <span style={{ fontSize:10, color:"#444", flexShrink:0 }}>{phDone}/{phTotal}</span>
          </div>
        </div>

        {/* Phase nav pills */}
        <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto", paddingBottom:4 }}>
          {phases.map((ph, pi) => (
            <div key={ph.id} onClick={() => setActivePhaseId(ph.id)}
              style={{ flexShrink:0, padding:"5px 12px", fontSize:10, cursor:"pointer", userSelect:"none",
                background: ph.id === activePhaseId ? (ph.color||accent)+"22" : "#0a0a0a",
                border: `1px solid ${ph.id === activePhaseId ? (ph.color||accent)+"88" : "#1a1a1a"}`,
                color: ph.id === activePhaseId ? (ph.color||accent) : "#444",
              }}>{pi+1}. {ph.title}</div>
          ))}
          <div onClick={openNewPhase}
            style={{ flexShrink:0, padding:"5px 10px", fontSize:10, cursor:"pointer", userSelect:"none", border:"1px dashed #1a1a1a", color:"#333" }}>+</div>
        </div>

        {/* Task list */}
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {activePhase.tasks.length === 0 && (
            <div style={{ textAlign:"center", padding:"40px 20px", color:"#222", fontSize:12, fontStyle:"italic" }}>No tasks yet — add one below</div>
          )}
          {activePhase.tasks.map((task) => (
            <div key={task.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"#080808", border:"1px solid #111", borderLeft:`2px solid ${task.done ? "#2a2a2a" : PRIORITY_COLOR[task.priority||"medium"]}` }}>
              <div onClick={() => toggleTask(activePhase.id, task.id)}
                style={{ width:18, height:18, border:`1.5px solid ${task.done ? "#333" : PRIORITY_COLOR[task.priority||"medium"]}`, background:task.done?"#1a1a1a":"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, transition:"all 0.15s" }}>
                {task.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, color:task.done?"#333":"#bbb", textDecoration:task.done?"line-through":"none", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{task.title}</div>
                <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontSize:9, color:PRIORITY_COLOR[task.priority||"medium"], border:`1px solid ${PRIORITY_COLOR[task.priority||"medium"]}33`, padding:"1px 5px", textTransform:"uppercase", letterSpacing:0.8 }}>{task.priority||"medium"}</span>
                  {task.assignee && task.assignee !== "—" && <span style={{ fontSize:9, color:"#444" }}>{task.assignee}</span>}
                  {task.due && <span style={{ fontSize:9, color:"#333" }}>{task.due}</span>}
                </div>
              </div>
              <div onClick={() => deleteTask(activePhase.id, task.id)} style={{ fontSize:12, color:"#222", cursor:"pointer", padding:"2px 4px", flexShrink:0 }}>×</div>
            </div>
          ))}
        </div>

        {/* Add task form */}
        {addingTask === activePhase.id ? (
          <div style={{ marginTop:10, padding:"12px 12px", background:"#090909", border:`1px solid ${accent}22` }}>
            <input autoFocus value={newTaskTitle} onChange={e=>setNewTaskTitle(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter") addTask(activePhase.id); if(e.key==="Escape") setAddingTask(null);}}
              placeholder="Task title…"
              style={{ width:"100%", background:"transparent", border:"none", borderBottom:`1px solid ${accent}33`, outline:"none", color:"#bbb", fontSize:13, padding:"4px 0 6px", marginBottom:10, boxSizing:"border-box", fontFamily:"inherit" }}/>
            <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
              {["high","medium","low"].map(p => (
                <div key={p} onClick={()=>setNewTaskPriority(p)}
                  style={{ fontSize:9, padding:"3px 10px", cursor:"pointer", border:`1px solid ${newTaskPriority===p ? PRIORITY_COLOR[p]+"88" : "#1a1a1a"}`, color:newTaskPriority===p ? PRIORITY_COLOR[p] : "#333", textTransform:"uppercase", letterSpacing:0.8 }}>{p}</div>
              ))}
            </div>
            <input value={newTaskAssignee} onChange={e=>setNewTaskAssignee(e.target.value)}
              placeholder="Assignee (optional)"
              style={{ width:"100%", background:"transparent", border:"none", borderBottom:"1px solid #1a1a1a", outline:"none", color:"#777", fontSize:11, padding:"3px 0 5px", marginBottom:10, boxSizing:"border-box", fontFamily:"inherit" }}/>
            <div style={{ display:"flex", gap:8 }}>
              <div onClick={()=>addTask(activePhase.id)} style={{ fontSize:10, color:accent, border:`1px solid ${accent}44`, padding:"5px 16px", cursor:"pointer" }}>Add task</div>
              <div onClick={()=>setAddingTask(null)} style={{ fontSize:10, color:"#333", border:"1px solid #1a1a1a", padding:"5px 12px", cursor:"pointer" }}>Cancel</div>
            </div>
          </div>
        ) : (
          <div onClick={()=>setAddingTask(activePhase.id)}
            style={{ marginTop:10, padding:"10px 12px", border:"1px dashed #1a1a1a", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:accent+"66", fontSize:16, lineHeight:1 }}>+</span>
            <span style={{ fontSize:11, color:"#333" }}>Add task to {activePhase.title}</span>
          </div>
        )}
      </div>
    );
  };

  // ── TIMELINE ──
  const Timeline = () => (
    <div style={{ flex:1, overflowY:"auto", padding:"20px 16px 60px" }}>
      <div style={{ fontSize:9, color:"#333", letterSpacing:1.2, textTransform:"uppercase", marginBottom:14 }}>All Tasks · Timeline View</div>
      {phases.map((ph, pi) => (
        <div key={ph.id} style={{ marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:ph.color||accent, flexShrink:0 }}/>
            <span style={{ fontSize:11, fontWeight:700, color:ph.color||accent }}>{pi+1}. {ph.title}</span>
            <div style={{ flex:1, height:1, background:"#111" }}/>
            <span style={{ fontSize:9, color:STATUS_COLOR[ph.status||"upcoming"], border:`1px solid ${STATUS_COLOR[ph.status||"upcoming"]}33`, padding:"1px 5px" }}>{STATUS_LABEL[ph.status||"upcoming"]}</span>
            <div onClick={() => openEditPhase(ph)}
              style={{ width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"1px solid #1a1a1a", borderRadius:2, flexShrink:0 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
          </div>
          {ph.tasks.map((task) => (
            <div key={task.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px 8px 20px", borderLeft:`1px solid ${ph.color||accent}33`, marginLeft:3, marginBottom:2 }}>
              <div onClick={() => toggleTask(ph.id, task.id)}
                style={{ width:14, height:14, border:`1.5px solid ${task.done?"#333":PRIORITY_COLOR[task.priority||"medium"]}`, background:task.done?"#1a1a1a":"transparent", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {task.done && <div style={{ width:6, height:6, background:"#333" }}/>}
              </div>
              <span style={{ flex:1, fontSize:12, color:task.done?"#333":"#888", textDecoration:task.done?"line-through":"none" }}>{task.title}</span>
              <span style={{ fontSize:9, color:PRIORITY_COLOR[task.priority||"medium"], flexShrink:0 }}>{task.priority}</span>
              {task.assignee && task.assignee !== "—" && <span style={{ fontSize:9, color:"#333", flexShrink:0 }}>{task.assignee}</span>}
              {task.due && <span style={{ fontSize:9, color:"#2a2a2a", flexShrink:0 }}>{task.due}</span>}
            </div>
          ))}
          {ph.tasks.length === 0 && <div style={{ padding:"6px 20px", fontSize:11, color:"#222", fontStyle:"italic" }}>No tasks</div>}
        </div>
      ))}
      <div onClick={openNewPhase}
        style={{ marginTop:4, padding:"10px 12px", border:"1px dashed #1a1a1a", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ color:accent+"66", fontSize:16, lineHeight:1 }}>+</span>
        <span style={{ fontSize:11, color:"#333" }}>Add phase</span>
      </div>
    </div>
  );

  return (
    <div onClick={e=>e.stopPropagation()} style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"#06080a", display:"flex", flexDirection:"column",
      fontFamily:"'Roboto',sans-serif", animation:"projectFadeIn 0.18s ease",
    }}>
      <style>{`
        @keyframes projectFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:2px;height:2px} ::-webkit-scrollbar-thumb{background:#1a1a1a}
      `}</style>

      {/* TOP BAR */}
      <div style={{ display:"flex", alignItems:"center", height:44, borderBottom:"1px solid #111", background:"#07090b", flexShrink:0 }}>
        <div onClick={onClose} style={{ width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", borderRight:"1px solid #111", cursor:"pointer", flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:6, padding:"0 12px", overflow:"hidden" }}>
          <span style={{ fontSize:11, color:accent, fontWeight:700, flexShrink:0 }}>◎</span>
          <span style={{ fontSize:11, color:"#333", flexShrink:0 }}>projects</span>
          <span style={{ fontSize:11, color:"#1e1e1e", flexShrink:0 }}>/</span>
          <span style={{ fontSize:11, color:"#666", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.title}</span>
        </div>
        <div style={{ padding:"0 12px", display:"flex", alignItems:"center", gap:8, borderLeft:"1px solid #111", flexShrink:0 }}>
          {teamContacts.length > 0 && (
            <div style={{ display:"flex", alignItems:"center" }}>
              {teamContacts.slice(0,4).map((c,i) => (
                <div key={c.id} style={{ marginLeft: i>0 ? -6 : 0, zIndex: 4-i }}>
                  <Avatar contact={c} size={22}/>
                </div>
              ))}
              {teamContacts.length > 4 && (
                <div style={{ marginLeft:-6, width:22, height:22, borderRadius:"50%", background:"#1a1a1a", border:"1px solid #333", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:"#555" }}>+{teamContacts.length-4}</div>
              )}
            </div>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ width:28, height:3, background:"#111", borderRadius:2, overflow:"hidden" }}>
              <div style={{ width:`${progress}%`, height:"100%", background: progress===100 ? "#34d399" : accent }}/>
            </div>
            <span style={{ fontSize:9, color: progress===100 ? "#34d399" : accent }}>{progress}%</span>
          </div>
        </div>
      </div>

      {/* VIEW TABS */}
      <div style={{ display:"flex", borderBottom:"1px solid #111", background:"#07090b", flexShrink:0 }}>
        {[["overview","◈ Overview"],["board","▦ Board"],["timeline","↕ Timeline"]].map(([id,label]) => (
          <div key={id} onClick={() => { setView(id); if (id === "overview") refreshTeam(); }}
            style={{ padding:"10px 16px", fontSize:11, cursor:"pointer", userSelect:"none",
              color: view===id ? accent : "#444",
              borderBottom: `2px solid ${view===id ? accent : "transparent"}`,
              transition:"all 0.12s", letterSpacing:0.3,
            }}>{label}</div>
        ))}
      </div>

      {/* CONTENT + PHASE EDITOR MODAL */}
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>
        {view === "overview" && <Overview/>}
        {view === "board"    && <Board/>}
        {view === "timeline" && <Timeline/>}
        <PhaseEditorModal/>
      </div>
    </div>
  );
}

// ─── NOTES SCREEN ─────────────────────────────────────────────────────────────
function NotesTab() {
  const [activeField, setActiveField] = useState("all");
  const [openNote, setOpenNote]       = useState(null);
  const [search, setSearch]           = useState("");
  const [searchOpen, setSearchOpen]   = useState(false);
  const [noteTexts, setNoteTexts]     = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allNotes = getAllNotes();

  const noteKey = (n) => n.title + "__" + n.type;

  const filtered = allNotes.filter(n => {
    const matchF = activeField === "all" || n.field === activeField;
    const q = search.toLowerCase();
    const matchS = !q || (n.title + (n.prompt||"") + (n.tags||[]).join(" ")).toLowerCase().includes(q);
    return matchF && matchS;
  });

  // Group by field only in "all" view
  const groups = activeField === "all"
    ? FIELDS.slice(1).reduce((acc, f) => {
        const ns = filtered.filter(n => n.field === f.id);
        if (ns.length) acc.push({ field: f, notes: ns });
        return acc;
      }, [])
    : [{ field: FIELDS.find(f => f.id === activeField) || FIELDS[0], notes: filtered }];

  if (openNote) {
    if (openNote.type === "project") {
      return <ProjectScreen ev={openNote} onClose={() => setOpenNote(null)} />;
    }
    const accent = TYPE_META[openNote.type]?.accent || openNote.color || "#86efac";
    const key = noteKey(openNote);
    return (
      <DocScreen
        ev={openNote}
        accent={accent}
        text={noteTexts[key] || ""}
        setText={val => setNoteTexts(p => ({ ...p, [key]: val }))}
        onClose={() => setOpenNote(null)}
      />
    );
  }

  const activeFieldObj = FIELDS.find(f => f.id === activeField) || FIELDS[0];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#000", color:"#fff", fontFamily:"'Roboto',sans-serif", overflow:"hidden", position:"relative" }}>
      <style>{`
        .note-row:active{background:#0d0d0d!important}
        @keyframes notesFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sidebarSlide{from{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes overlayFade{from{opacity:0}to{opacity:1}}
        .sidebar-field-row:active{background:#1a1a1a!important}
      `}</style>

      {/* SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)", zIndex:30, animation:"overlayFade 0.2s ease" }}
        />
      )}

      {/* SIDEBAR PANEL */}
      {sidebarOpen && (
        <div style={{
          position:"absolute", top:0, left:0, bottom:0, width:240,
          background:"#0a0a0a", borderRight:"1px solid #1a1a1a",
          zIndex:40, display:"flex", flexDirection:"column",
          animation:"sidebarSlide 0.22s ease",
        }}>
          {/* Sidebar header */}
          <div style={{ padding:"20px 20px 12px", borderBottom:"1px solid #111" }}>
            <div style={{ fontSize:13, fontWeight:700, letterSpacing:1.2, color:"#555", textTransform:"uppercase", marginBottom:2 }}>Fields</div>
            <div style={{ fontSize:10, color:"#2a2a2a" }}>{allNotes.length} total entries</div>
          </div>

          {/* Field list */}
          <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
            {FIELDS.map(f => {
              const active = activeField === f.id;
              const count = f.id === "all" ? allNotes.length : allNotes.filter(n => n.field === f.id).length;
              return (
                <div
                  key={f.id}
                  className="sidebar-field-row"
                  onClick={() => { setActiveField(f.id); setSidebarOpen(false); }}
                  style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"12px 20px", cursor:"pointer", userSelect:"none",
                    background: active ? f.color+"11" : "transparent",
                    borderLeft: `3px solid ${active ? f.color : "transparent"}`,
                    transition:"all 0.12s",
                  }}
                >
                  <span style={{ display:"flex", alignItems:"center", color: active ? f.color : "#444", fontSize:15 }}>{f.icon}</span>
                  <span style={{ flex:1, fontSize:13, fontWeight: active ? 600 : 400, color: active ? f.color : "#666", letterSpacing:0.2 }}>{f.label}</span>
                  <span style={{ fontSize:10, color: active ? f.color+"99" : "#2a2a2a", fontVariantNumeric:"tabular-nums" }}>{count}</span>
                </div>
              );
            })}
          </div>

          {/* Sidebar footer */}
          <div style={{ padding:"16px 20px", borderTop:"1px solid #111" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", background:"#4285f411", border:"1px solid #4285f422", borderRadius:4, cursor:"pointer" }}>
              <svg width="13" height="13" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#4285f4" strokeWidth="2.5" strokeLinecap="round"/></svg>
              <span style={{ fontSize:12, color:"#4285f4", fontWeight:600 }}>New Note</span>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ flexShrink:0, padding:"16px 20px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* Hamburger button */}
            <div
              onClick={() => setSidebarOpen(s => !s)}
              style={{ width:36, height:36, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, cursor:"pointer", flexShrink:0 }}
            >
              <div style={{ width:20, height:1.5, background:"#aaa", borderRadius:1 }}/>
              <div style={{ width:14, height:1.5, background:"#aaa", borderRadius:1 }}/>
              <div style={{ width:20, height:1.5, background:"#aaa", borderRadius:1 }}/>
            </div>
            <div>
              <div style={{ fontSize:24, fontWeight:700, letterSpacing:-0.5, display:"flex", alignItems:"center", gap:8 }}>
                {activeField !== "all" && <span style={{ color: activeFieldObj.color, fontSize:18 }}>{activeFieldObj.icon}</span>}
                {activeField === "all" ? "Notes" : activeFieldObj.label}
              </div>
              <div style={{ fontSize:11, color:"#444", marginTop:2 }}>
                {activeField === "all"
                  ? `${allNotes.length} entries across ${FIELDS.length - 1} fields`
                  : `${filtered.length} entries`}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div
              onClick={() => { setSearchOpen(s=>!s); if(searchOpen) setSearch(""); }}
              style={{ width:36, height:36, borderRadius:"50%", background:searchOpen?"#1e1e1e":"transparent", border:"1px solid #1e1e1e", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={searchOpen?"#fff":"#555"} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"#4285f4", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>

        {/* Search */}
        {searchOpen && (
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#0d0d0d", border:"1px solid #1e1e1e", padding:"8px 12px", marginBottom:10, animation:"notesFade 0.15s ease" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search notes, tags, topics…" style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#bbb", fontSize:13 }}/>
            {search && <div onClick={()=>setSearch("")} style={{ fontSize:16, color:"#333", cursor:"pointer", lineHeight:1 }}>×</div>}
          </div>
        )}
      </div>

      {/* NOTES LIST */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 24px", color:"#222" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" style={{ margin:"0 auto 12px", display:"block" }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <div style={{ fontSize:13 }}>No notes in this field yet</div>
          </div>
        )}

        {groups.map(({ field, notes }) => (
          <div key={field.id} style={{ marginBottom: activeField==="all" ? 8 : 0 }}>

            {/* Field section header — only in "all" view */}
            {activeField === "all" && (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"14px 20px 10px", background:"#000", position:"sticky", top:0, zIndex:2 }}>
                <span style={{ display:"flex", alignItems:"center", color:field.color }}>{field.icon}</span>
                <span style={{ fontSize:11, fontWeight:700, color:field.color, letterSpacing:0.8, textTransform:"uppercase" }}>{field.label}</span>
                <span style={{ fontSize:10, color:"#333" }}>{notes.length}</span>
                <div onClick={()=>setActiveField(field.id)} style={{ marginLeft:"auto", display:"flex", alignItems:"center", cursor:"pointer", padding:"4px", opacity:0.5 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={field.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
            )}

            {/* Note rows */}
            {notes.map((note, i) => {
              const ts  = NOTE_TYPE_STYLE[note.type] || NOTE_TYPE_STYLE.note;
              const fd  = FIELDS.find(f=>f.id===note.field) || FIELDS[0];
              const key = noteKey(note);
              const wc  = (noteTexts[key]||"").trim().split(/\s+/).filter(Boolean).length;
              const pct = Math.min(100, Math.round((wc / (note.wordGoal||300)) * 100));

              return (
                <div key={i} className="note-row" onClick={()=>setOpenNote(note)}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", cursor:"pointer",
                    borderLeft:`3px solid ${fd.color}${activeField==="all"?"33":"55"}`,
                    borderBottom:"1px solid #080808", background:"#000",
                    animation:`notesFade 0.15s ease ${i*0.03}s both`,
                  }}
                >
                  {/* Type icon box */}
                  <div style={{ width:36, height:36, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                    background:ts.bg, border:`1px solid ${ts.color}22` }}>
                    <span style={{ fontFamily:"'Courier New',monospace", fontSize:14, color:ts.color, lineHeight:1 }}>
                      {note.type==="note"?"§":note.type==="article"?"¶":note.type==="doc"?"#":note.type==="journal"?"~":note.type==="project"?"◎":"✎"}
                    </span>
                  </div>

                  {/* Text */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:"#d4d4d8", marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{note.title}</div>
                    <div style={{ fontSize:11, color:"#444", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:6 }}>{note.prompt||"No description"}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <span style={{ fontSize:9, color:ts.color, border:`1px solid ${ts.color}33`, padding:"1px 5px", letterSpacing:0.8, textTransform:"uppercase" }}>{ts.label}</span>
                      {activeField==="all" && (
                        <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:9, color:fd.color+"99" }}>
                          <span style={{ display:"flex", alignItems:"center", transform:"scale(0.7)", transformOrigin:"left" }}>{fd.icon}</span>
                          {fd.label}
                        </span>
                      )}
                      {(note.tags||[]).slice(0,2).map(t=>(
                        <span key={t} style={{ fontSize:9, color:"#333" }}>#{t}</span>
                      ))}
                      {wc > 0 && (
                        <>
                          <span style={{ fontSize:9, color:"#2a2a2a" }}>{wc}w</span>
                          <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                            <div style={{ width:32, height:2, background:"#111", borderRadius:1, overflow:"hidden" }}>
                              <div style={{ width:`${pct}%`, height:"100%", background:ts.color, opacity:0.7 }}/>
                            </div>
                            <span style={{ fontSize:8, color:"#2a2a2a" }}>{pct}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>
                    <path d="M9 18l6-6-6-6" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── ADD EVENT SHEET ──────────────────────────────────────────────────────────
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

function AddEventSheet({ year, month, day, onClose, onAdd }) {
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

  const MONTH_NAMES_S = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
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


// ─── MONEY EVENT CARD ─────────────────────────────────────────────────────────
function MoneyEventCard({ ev }) {
  const isSpend  = ev.type === "spending";
  const accent   = ev.color || (isSpend ? "#ef5350" : "#69f0ae");
  const sign     = isSpend ? "-" : "+";
  const evIcon   = isSpend ? IC.spend(accent, 16) : IC.income(accent, 16);
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

// ─── CALENDAR SCREEN ──────────────────────────────────────────────────────────
function CalendarTab() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [viewMode, setViewMode] = useState("week");
  const [showLegend, setShowLegend] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [, forceUpdate] = useState(0);
  const weekScrollRef = useRef(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(120);

  useEffect(() => {
    if (!headerRef.current) return;
    const obs = new ResizeObserver(() => setHeaderHeight(headerRef.current.offsetHeight));
    obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  const todayDate=now.getDate(), todayMonth=now.getMonth(), todayYear=now.getFullYear();
  const isCurrentMonth = month===todayMonth && year===todayYear;
  const totalDays = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);
  const allCells = [];
  for(let i=0;i<firstDow;i++) allCells.push(null);
  for(let d=1;d<=totalDays;d++) allCells.push(d);
  while(allCells.length%7!==0) allCells.push(null);
  const weeks = [];
  for(let i=0;i<allCells.length;i+=7) weeks.push(allCells.slice(i,i+7));

  const prevMonth = ()=>{ if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); setSelectedDay(1); };
  const nextMonth = ()=>{ if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); setSelectedDay(1); };

  useEffect(() => {
    if(viewMode==="week"&&weekScrollRef.current){
      const pi=weeks.findIndex(w=>w.includes(selectedDay));
      if(pi>=0) weekScrollRef.current.scrollTo({left:pi*weekScrollRef.current.offsetWidth,behavior:"smooth"});
    }
  }, [selectedDay, month, year, viewMode]);

  const dayEvents = getEventsForDay(year, month, selectedDay);

  const renderDayCell = (d, i) => {
    if(!d) return <div key={`e-${i}`} style={{height:40}}/>;
    const isToday=isCurrentMonth&&d===todayDate, isSelected=d===selectedDay, isSat=i===5;
    const bg=isToday?"#4285f4":isSelected?"#1e1e1e":"transparent";
    return (
      <div key={d} style={{textAlign:"center",padding:"3px 0",cursor:"pointer"}} onClick={()=>setSelectedDay(d)}>
        <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:34,height:34,borderRadius:"50%",background:bg,color:isToday?"#fff":"#fff",fontSize:15,fontWeight:isToday||isSelected?700:400,outline:isSelected&&!isToday?"1.5px solid #4285f4":"none",transition:"background 0.12s"}}>{d}</div>
      </div>
    );
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", background:"#000" }}>
      {showLegend && <TypeLegend onClose={()=>setShowLegend(false)}/>}

      <div ref={headerRef} style={{position:"absolute",top:0,left:0,right:0,zIndex:10,background:"#000"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px 8px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22,fontWeight:700}}>{MONTH_NAMES[month]}</span>
            <span style={{fontSize:16,color:"#555",fontWeight:400}}>{year}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <div onClick={prevMonth} style={{cursor:"pointer",padding:"6px 10px",color:"#aaa",fontSize:18,userSelect:"none"}}>‹</div>
            <div onClick={nextMonth} style={{cursor:"pointer",padding:"6px 10px",color:"#aaa",fontSize:18,userSelect:"none"}}>›</div>
            <div style={{marginLeft:6,display:"flex",gap:12,alignItems:"center"}}>
              <div onClick={()=>setViewMode(v=>v==="month"?"week":"month")} style={{cursor:"pointer",display:"flex"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="7" height="3" fill={viewMode==="month"?"#4285f4":"#aaa"}/>
                  <rect x="3" y="11" width="7" height="3" fill={viewMode==="month"?"#4285f4":"#aaa"}/>
                  <rect x="3" y="17" width="7" height="3" fill={viewMode==="month"?"#4285f4":"#aaa"}/>
                  <rect x="14" y="5" width="7" height="3" fill={viewMode==="month"?"#4285f4":"#aaa"}/>
                  <rect x="14" y="11" width="7" height="3" fill={viewMode==="month"?"#4285f4":"#aaa"}/>
                  <rect x="14" y="17" width="7" height="3" fill={viewMode==="month"?"#4285f4":"#aaa"}/>
                </svg>
              </div>
              <div onClick={()=>setShowLegend(true)} style={{display:"flex",flexDirection:"column",gap:3,cursor:"pointer",padding:"4px"}}>
                {[0,1,2].map(i=><div key={i} style={{width:3,height:3,borderRadius:"50%",background:"#aaa"}}/>)}
              </div>
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(7, 1fr)",padding:"0 6px",marginBottom:2}}>
          {DAY_LABELS.map((d,i)=><div key={d} style={{textAlign:"center",fontSize:11,color:"#666",fontWeight:500,padding:"2px 0",letterSpacing:0.3}}>{d}</div>)}
        </div>
        {viewMode==="week"&&<div style={{position:"relative",borderBottom:"1px solid #1a1a1a"}}>
          <div ref={weekScrollRef} style={{display:"flex",overflowX:"auto",overflowY:"hidden",scrollbarWidth:"none",scrollSnapType:"x mandatory",WebkitOverflowScrolling:"touch",padding:"0 0 8px"}}>
            {weeks.map((week,wi)=><div key={wi} style={{display:"grid",gridTemplateColumns:"repeat(7, 1fr)",minWidth:"100%",width:"100%",flexShrink:0,scrollSnapAlign:"start",padding:"0 6px",boxSizing:"border-box"}}>{week.map((d,i)=>renderDayCell(d,i))}</div>)}
          </div>
        </div>}
        {viewMode==="month"&&<div style={{padding:"0 6px 8px",borderBottom:"1px solid #1a1a1a"}}>
          {weeks.map((week,wi)=><div key={wi} style={{display:"grid",gridTemplateColumns:"repeat(7, 1fr)"}}>{week.map((d,i)=>renderDayCell(d,i))}</div>)}
        </div>}
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:dayEvents?"flex-start":"center",justifyContent:dayEvents?"flex-start":"center",overflowY:"auto",padding:"10px 16px",paddingTop:headerHeight}}>
        {dayEvents?(
          <div style={{width:"100%",display:"flex",flexDirection:"column",gap:20}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:11,color:"#555",letterSpacing:0.5,textTransform:"uppercase"}}>
                {DAY_LABELS[new Date(year,month,selectedDay).getDay()===0?6:new Date(year,month,selectedDay).getDay()-1]}, {MONTH_NAMES[month].slice(0,3)} {selectedDay}
              </div>
              {(() => {
                const dk = `${year}-${String(month+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`;
                const daySpent  = txStore.transactions.filter(t=>t.isoDate===dk).reduce((s,t)=>s+t.amount,0);
                const dayIncome = incomeStore.filter(e=>e.isoDate===dk&&e.sourceId!=="salary").reduce((s,e)=>s+e.amount,0);
                if (!daySpent && !dayIncome) return null;
                return (
                  <div style={{display:"flex",gap:8}}>
                    {dayIncome>0 && <div style={{fontSize:10,fontWeight:700,color:"#69f0ae"}}>+G {dayIncome.toLocaleString()}</div>}
                    {daySpent>0  && <div style={{fontSize:10,fontWeight:700,color:"#ef5350"}}>-G {daySpent.toLocaleString()}</div>}
                  </div>
                );
              })()}
            </div>
            {["Dawn","Morning","Afternoon","Evening"].map(part=>{
              const partEvents=dayEvents[part];
              if(!partEvents||partEvents.length===0) return null;
              const icons={Dawn:"🌑",Morning:"🌅",Afternoon:"☀️",Evening:"🌙"};
              const ranges={Dawn:"3:00 – 4:30",Morning:"6:00 – 12:00",Afternoon:"12:00 – 17:00",Evening:"17:00 – 22:00"};
              return (
                <div key={part}>
                  <div style={{fontSize:11,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:13}}>{icons[part]}</span>{part}
                    <span style={{color:"#333",fontWeight:400,letterSpacing:0.3,textTransform:"none",marginLeft:2}}>{ranges[part]}</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {partEvents.map((ev,i)=>{
                      const dateKey=`${year}-${String(month+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`;
                      const isWriting = TYPE_META[ev.type] && TYPE_META[ev.type].writing;
                      const isMoney = ev.type === "spending" || ev.type === "income_ev";
                      return isMoney
                        ? <MoneyEventCard key={i} ev={ev} />
                        : isWriting
                          ? <WritingCard key={i} ev={ev} />
                          : <EventCard key={i} ev={ev} dateKey={dateKey} year={year} month={month} forceUpdate={forceUpdate}/>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ):(
          <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
            <div style={{width:72,height:64,background:"#0d0d0d",border:"1px solid #222",display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{background:"#4285f4",height:18,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                {[0,1,2].map(i=><div key={i} style={{width:3,height:9,background:"#fff",marginTop:-4}}/>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:2,padding:5}}>
                {Array(12).fill(0).map((_,i)=><div key={i} style={{background:"#222",height:7}}/>)}
              </div>
            </div>
            <div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>You have a free day</div>
              <div style={{fontSize:13,color:"#555"}}>Take it easy</div>
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      <div
        onClick={() => setShowAddSheet(true)}
        style={{position:"absolute",bottom:16,right:20,width:48,height:48,borderRadius:"50%",background:"#4285f4",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 2px 8px rgba(66,133,244,0.4)",zIndex:10}}
      >
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
      </div>

      {/* ADD EVENT SHEET */}
      {showAddSheet && (
        <AddEventSheet
          year={year} month={month} day={selectedDay}
          onClose={() => setShowAddSheet(false)}
          onAdd={(part, ev) => {
            addDynamicEvent(year, month, selectedDay, part, ev);
            forceUpdate(n => n + 1);
          }}
        />
      )}
    </div>
  );
}



// ─── PAYROLL ALLOCATOR ────────────────────────────────────────────────────────
const DEFAULT_BUCKETS = [
  {
    id:"b1", label:"Savings", icon:(c,s)=>IC.piggy(c,s), color:"#a5d6a7", pct:20,
    description:"Forced mutual fund — monthly contribution",
    institution:{
      name:"Sol",
      type:"Mutual Fund",
      flag:(c,s)=>IC.handshake(c,s),
      color:"#a5d6a7",
      fixedAmount:5000,
      detail:"Tontine-style forced savings pool",
      accountName: null,
      note:"Fixed G 5,000 / month — automatic",
    },
  },
  {
    id:"b2", label:"Investments", icon:(c,s)=>IC.trendUp(c,s), color:"#69f0ae", pct:15,
    description:"Business account — long-term growth",
    institution:{
      name:"SogeBank",
      type:"Business Account",
      flag:(c,s)=>IC.bank(c,s),
      color:"#69f0ae",
      fixedAmount:null,
      detail:"Société Générale Haïtienne de Banque",
      accountName:"Les Entreprises Mima",
      note:"Invest monthly — stocks, capital, growth",
    },
  },
  {
    id:"b3", label:"Monthly Bills", icon:(c,s)=>IC.receipt(c,s), color:"#4fc3f7", pct:31,
    description:"Internet, cosmetics, clothes, haircuts",
    institution:{
      name:"MonCash",
      type:"Mobile Wallet",
      flag:(c,s)=>IC.phone(c,s),
      color:"#4fc3f7",
      fixedAmount:null,
      detail:"Digicel mobile money platform",
      accountName:null,
      note:"Pay all recurring bills from here",
    },
  },
  {
    id:"b4", label:"Food & Transport", icon:(c,s)=>IC.utensils(c,s), color:"#ffb74d", pct:20,
    description:"Daily meals and getting around",
    institution:null,
  },
  {
    id:"b5", label:"Personal", icon:(c,s)=>IC.target(c,s), color:"#ce93d8", pct:7,
    description:"Leisure, fun, unexpected",
    institution:null,
  },
  {
    id:"b6", label:"Buffer", icon:(c,s)=>IC.lock(c,s), color:"#fff176", pct:7,
    description:"Emergency cushion",
    institution:null,
  },
];
const bucketStore = DEFAULT_BUCKETS.map(b => ({...b}));

function PayrollView({ salary, refresh }) {
  const [buckets, setBuckets] = useState(bucketStore);
  const [editing, setEditing]   = useState(null); // bucket id being edited
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
    // sync to store
    const idx = bucketStore.findIndex(b => b.id === editing);
    if (idx > -1) { bucketStore[idx].pct = Math.round(pct*10)/10; bucketStore[idx].label = editLabel.trim() || bucketStore[idx].label; bucketStore[idx].description = editDesc.trim(); }
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

      {/* Header summary */}
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

      {/* Institution summary cards */}
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

      {/* Buckets */}
      <div style={{ margin:"12px 16px 0", display:"flex", flexDirection:"column", gap:6 }}>
        {buckets.map(b => {
          const amount = (b.pct / 100) * salary;
          const isEditing = editing === b.id;
          return (
            <div key={b.id} style={{ background:"#080808", borderLeft:`3px solid ${b.color}`, overflow:"hidden" }}>
              {/* Institution banner */}
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

              {/* Main row */}
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
                  {/* Mini bar */}
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

              {/* Inline editor */}
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

      {/* Unallocated warning */}
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

      {/* Add bucket */}
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


// ─── GOALS STORE ──────────────────────────────────────────────────────────────
const goalsStore = [
  {
    id:"g1", label:"Suzuki Grand Vitara", icon:(c,s)=>IC.car(c,s), color:"#69f0ae",
    targetUSD:5000, targetHTG:5000*130,
    savedHTG:0,
    note:"~5,000 USD · saving monthly from salary",
    usdRate:130,
  },
];
let goalIdCounter = 2;

function getGoalProgress(g) {
  const pct = Math.min(100, Math.round((g.savedHTG / g.targetHTG) * 100));
  const remaining = Math.max(0, g.targetHTG - g.savedHTG);
  return { pct, remaining };
}

// ─── MONEY TAB ────────────────────────────────────────────────────────────────
let SALARY = 15000; // HTG — editable

// ─── INCOME STORE ─────────────────────────────────────────────────────────────
const INCOME_SOURCE_ICONS = {
  salary:    (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
  family:    (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  hustle:    (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  gift:      (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  freelance: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  other:     (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};
const INCOME_SOURCES = [
  { id:"salary",   label:"Salary",      color:"#4285f4" },
  { id:"family",   label:"Family",      color:"#f48fb1" },
  { id:"hustle",   label:"Side Hustle", color:"#69f0ae" },
  { id:"gift",     label:"Gift",        color:"#ce93d8" },
  { id:"freelance",label:"Freelance",   color:"#ffb74d" },
  { id:"other",    label:"Other",       color:"#888"    },
];

const incomeStore = [];
let incomeIdCounter = 1;
// salaryReceivedThisMonth is tracked via React state in MoneyTab
let _salaryReceivedFlag = false;

function addIncome(entry) {
  const now = new Date();
  const isoDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const hour = now.getHours();
  const part = hour < 5 ? "Dawn" : hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
  const timeStr = now.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true});
  incomeStore.unshift({
    ...entry,
    id:"i"+(incomeIdCounter++),
    date: now.toLocaleDateString("en-US",{month:"short",day:"numeric"}),
    time: timeStr,
    isoDate,
    part,
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
  });
}

function getTotalIncome() {
  return incomeStore.reduce((s, e) => s + e.amount, 0);
}
function getTotalIncomeWithSalary(salaryReceived) {
  const base = incomeStore.filter(e => e.sourceId !== "salary").reduce((s, e) => s + e.amount, 0);
  return salaryReceived ? base + SALARY : base;
}

// ─── SVG ICON COMPONENTS ─────────────────────────────────────────────────────
const SvgIcon = ({ d, size=16, color="currentColor", viewBox="0 0 24 24", fill="none", strokeWidth=1.8 }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === "string" ? <path d={d}/> : d}
  </svg>
);

const IC = {
  food:      (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></>}/>,
  transport: (c,s=16) => <SvgIcon size={s} color={c} d={<><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M15 6H9l-3 8h12l-3-8z"/><path d="M9 6V4"/><path d="M3 8h18"/></>}/>,
  cosmetics: (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M12 2a4 4 0 0 1 4 4v1H8V6a4 4 0 0 1 4-4z"/><rect x="8" y="7" width="8" height="13" rx="1"/><line x1="10" y1="11" x2="14" y2="11"/><line x1="10" y1="15" x2="14" y2="15"/></>}/>,
  clothes:   (c,s=16) => <SvgIcon size={s} color={c} d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>,
  internet:  (c,s=16) => <SvgIcon size={s} color={c} d={<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>}/>,
  haircut:   (c,s=16) => <SvgIcon size={s} color={c} d={<><circle cx="6" cy="4" r="2"/><circle cx="18" cy="4" r="2"/><path d="M6 6c0 4 2 7 6 8s6-4 6-8"/><path d="M2 20l4-4"/><path d="M22 20l-4-4"/><path d="M12 14v8"/></>}/>,
  savings:   (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2z"/><path d="M2 9.5C1.06 9.5 1 10 1 10.5V15c0 .5.5 1 1 1"/><circle cx="16" cy="10" r="1"/></>}/>,
  other:     (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>}/>,
  // bucket icons
  piggy:     (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2z"/><path d="M2 9.5C1.06 9.5 1 10 1 10.5V15c0 .5.5 1 1 1"/><circle cx="16" cy="10" r="1"/></>}/>,
  trendUp:   (c,s=16) => <SvgIcon size={s} color={c} d={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>}/>,
  receipt:   (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></>}/>,
  utensils:  (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></>}/>,
  target:    (c,s=16) => <SvgIcon size={s} color={c} d={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>}/>,
  lock:      (c,s=16) => <SvgIcon size={s} color={c} d={<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}/>,
  phone:     (c,s=16) => <SvgIcon size={s} color={c} d={<><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>}/>,
  bank:      (c,s=16) => <SvgIcon size={s} color={c} d={<><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></>}/>,
  handshake: (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></>}/>,
  user:      (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}/>,
  // goal icons
  car:       (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2"/><rect x="9" y="11" width="8" height="10"/><circle cx="5" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M3 7h4"/></>}/>,
  home:      (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}/>,
  plane:     (c,s=16) => <SvgIcon size={s} color={c} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>,
  laptop:    (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></>}/>,
  grad:      (c,s=16) => <SvgIcon size={s} color={c} d={<><polyline points="22 10 12 5 2 10 12 15 22 10"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M22 10v6"/></>}/>,
  ring:      (c,s=16) => <SvgIcon size={s} color={c} d={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4m0 12v4m-7.07-2.93 2.83-2.83m8.48 0 2.83 2.83M2 12h4m12 0h4m-6.93-7.07-2.83 2.83"/></>}/>,
  ship:      (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M2 21c.6.5 1.2 1 2.5 1C7 22 7 20 9.5 20c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10v4"/><path d="M12 2v3"/></>}/>,
  dumbbell:  (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M6 5v14"/><path d="M18 5v14"/><path d="M2 9v6"/><path d="M22 9v6"/><line x1="6" y1="12" x2="18" y2="12"/><rect x="4" y="7" width="4" height="10" rx="1"/><rect x="16" y="7" width="4" height="10" rx="1"/><rect x="0" y="10" width="4" height="4" rx="1"/><rect x="20" y="10" width="4" height="4" rx="1"/></>}/>,
  guitar:    (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="m20.38 3.46-1.23 1.23a1.5 1.5 0 0 0 0 2.12l.65.65a1.5 1.5 0 0 1 0 2.12l-9.13 9.13a1.5 1.5 0 0 1-2.12 0l-.65-.65a1.5 1.5 0 0 0-2.12 0L3.54 19.2a1.5 1.5 0 0 0 0 2.12c1.17 1.17 3.07 1.17 4.24 0l1.41-1.41a3 3 0 0 1 4.24 0l.71.71a3 3 0 0 0 4.24 0l3.18-3.18a3 3 0 0 0 0-4.24l-.71-.71a3 3 0 0 1 0-4.24l1.41-1.41a3 3 0 0 0-2.12-5.12z"/><path d="m11 11 2.5-2.5"/></>}/>,
  spend:     (c,s=16) => <SvgIcon size={s} color={c} d={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>}/>,
  income:    (c,s=16) => <SvgIcon size={s} color={c} d={<><polyline points="16 8 12 4 8 8"/><line x1="12" y1="4" x2="12" y2="16"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/></>}/>,
  warn:      (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}/>,
  bulb:      (c,s=16) => <SvgIcon size={s} color={c} d={<><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></>}/>,
  celebrate: (c,s=16) => <SvgIcon size={s} color={c} d={<><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2z"/></>}/>,
};

const SPEND_CATEGORIES = [
  { id:"food",         label:"Food",         icon:(c,s)=>IC.food(c,s),      color:"#69f0ae", budget:3000 },
  { id:"transport",    label:"Transport",    icon:(c,s)=>IC.transport(c,s),  color:"#ffb74d", budget:5200 },
  { id:"cosmetics",    label:"Cosmetics",    icon:(c,s)=>IC.cosmetics(c,s),  color:"#f48fb1", budget:1500 },
  { id:"clothes",      label:"Clothes",      icon:(c,s)=>IC.clothes(c,s),    color:"#ce93d8", budget:2000 },
  { id:"internet",     label:"Internet",     icon:(c,s)=>IC.internet(c,s),   color:"#4fc3f7", budget:800  },
  { id:"haircut",      label:"Haircut",      icon:(c,s)=>IC.haircut(c,s),    color:"#fff176", budget:600  },
  { id:"savings",      label:"Savings",      icon:(c,s)=>IC.savings(c,s),    color:"#a5d6a7", budget:3000 },
  { id:"other",        label:"Other",        icon:(c,s)=>IC.other(c,s),      color:"#888",    budget:1000 },
];

// ─── RECURRING EXPENSES ───────────────────────────────────────────────────────
const recurringStore = [
  { id:"r1",  label:"Internet bill",   category:"internet",  amount:800,  day:1  },
  { id:"r2",  label:"Cosmetics",       category:"cosmetics", amount:1500, day:5  },
  { id:"r3",  label:"New clothes",     category:"clothes",   amount:2000, day:1  },
  { id:"r4",  label:"Haircut",         category:"haircut",   amount:300,  day:1  },
  { id:"r5",  label:"Haircut",         category:"haircut",   amount:300,  day:15 },
  { id:"r6",  label:"Moto transport (work)",  category:"transport", amount:5200, day:1  },
];
let recurringIdCounter = recurringStore.length + 1;

function getRecurringTotal() {
  return recurringStore.reduce((s, r) => s + r.amount, 0);
}

// ─── MONTHLY SPEND STORE ─────────────────────────────────────────────────────
// monthlySpends[month] = { categoryId: amount }
const monthlySpends = {};
function getMonthKey(month) {
  return `${new Date().getFullYear()}-${String(month+1).padStart(2,'0')}`;
}
function getMonthlySpend(month) {
  return monthlySpends[getMonthKey(month)] || {};
}
function setMonthlySpend(month, categoryId, amount) {
  const key = getMonthKey(month);
  if (!monthlySpends[key]) monthlySpends[key] = {};
  if (amount <= 0) delete monthlySpends[key][categoryId];
  else monthlySpends[key][categoryId] = amount;
}
// Legacy txStore kept empty for calendar compatibility
const txStore = { transactions: [] };

function getMonthTotals(month) {
  const totals = {};
  SPEND_CATEGORIES.forEach(c => totals[c.id] = 0);
  recurringStore.forEach(r => {
    if (totals[r.category] !== undefined) totals[r.category] += r.amount;
  });
  return totals;
}

function MoneyTab() {
  const [view, setView] = useState("overview");
  const [selectedMoneyMonth, setSelectedMoneyMonth] = useState(new Date().getMonth());
  const [salaryReceived, setSalaryReceived] = useState(false);
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n+1);

  // add form state


  const totals      = getMonthTotals(selectedMoneyMonth);
  const totalIncome = getTotalIncomeWithSalary(salaryReceived);
  const totalSpent  = SPEND_CATEGORIES.filter(c => c.id !== "savings").reduce((s,c) => s + (totals[c.id]||0), 0);
  const totalSaved  = totals["savings"] || 0;
  const remaining   = totalIncome - totalSpent - totalSaved;
  const spentPct    = Math.min(100, Math.round((totalSpent / totalIncome) * 100));
  const dangerMode  = remaining < 1000;




  // ── AUTOPILOT ──

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

  // ── RECURRING ──
  const Recurring = () => {
    const [addingRecurring, setAddingRecurring] = useState(false);
    const [rLabel,    setRLabel]    = useState("");
    const [rAmount,   setRAmount]   = useState("");
    const [rCat,      setRCat]      = useState("housing");
    const [rDay,      setRDay]      = useState("1");
    const [, localRefresh] = useState(0);

    const recurringTotal = getRecurringTotal();
    const sorted = [...recurringStore].sort((a,b) => a.day - b.day);

    const handleAddRecurring = () => {
      const amt = parseFloat(rAmount);
      if (!amt || !rLabel.trim()) return;
      recurringStore.push({ id:"r"+Date.now(), label:rLabel.trim(), category:rCat, amount:amt, day:parseInt(rDay)||1 });
      setRLabel(""); setRAmount(""); setRCat("housing"); setRDay("1");
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

        {/* Summary pill */}
        <div style={{ margin:"14px 0 12px", padding:"14px 16px", background:"#0a080f", border:"1px solid #ce93d833", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, color:"#ce93d8", letterSpacing:1, textTransform:"uppercase", marginBottom:2 }}>Monthly recurring</div>
            <div style={{ fontSize:28, fontWeight:800, color:"#fff" }}>G {recurringTotal.toLocaleString()}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:"#444", marginBottom:2 }}>{recurringStore.length} expenses</div>
            <div style={{ fontSize:11, color:"#555" }}>G {(SALARY - recurringTotal).toLocaleString()} left after</div>
          </div>
        </div>

        {/* List */}
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {sorted.map(r => {
            const cat = SPEND_CATEGORIES.find(c => c.id === r.category) || SPEND_CATEGORIES[8];
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

        {/* Add form */}
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


  // ── INCOME ──
  const Income = () => {
    const [adding, setAdding]       = useState(false);
    const [iAmount, setIAmount]     = useState("");
    const [iLabel,  setILabel]      = useState("");
    const [iSource, setISource]     = useState("family");
    const [iRecurring, setIRecurring] = useState(false);
    const [confirmed, setConfirmed] = useState(false); // show allocation summary
    const [, localRefresh]          = useState(0);
    const lr = () => { localRefresh(n=>n+1); refresh(); };

    // Compute allocation breakdown for a given amount using payroll buckets
    const getAllocation = (amt) => {
      if (!amt || isNaN(amt)) return [];
      return bucketStore.map(b => ({
        ...b,
        amount: Math.round((b.pct / 100) * amt),
      }));
    };

    const parsedAmount = parseFloat(iAmount) || 0;
    const allocation   = getAllocation(parsedAmount);

    const handleAdd = () => {
      const amt = parseFloat(iAmount);
      if (!amt || !iLabel.trim()) return;
      addIncome({ sourceId: iSource, label: iLabel.trim(), amount: amt, recurring: iRecurring });
      setIAmount(""); setILabel(""); setISource("family"); setIRecurring(false);
      setAdding(false); setConfirmed(false);
      lr();
    };

    const [editingId, setEditingId]       = useState(null);
    const [editAmount, setEditAmount]     = useState("");
    const [editLabel,  setEditLabel]      = useState("");
    const [editDate,   setEditDate]       = useState("");
    const [salaryEditing, setSalaryEditing] = useState(false);
    const [salaryInput,   setSalaryInput]   = useState(String(SALARY));

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
    const total = (monthSalary ? SALARY : 0) + nonSalaryTotal;
    const today = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});

    const handleReceiveSalary = () => {
      if (salaryReceived) return;
      setSalaryReceived(true);
      addIncome({ sourceId:"salary", label:"Monthly salary", amount:SALARY, recurring:false });
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
                  onKeyDown={e=>{ if(e.key==="Enter"){ const v=parseFloat(salaryInput); if(v>0){SALARY=v;} setSalaryEditing(false); lr(); }}}
                  style={{ flex:1, background:"transparent", border:"none", borderBottom:"1px solid #2a2a2a", outline:"none", color:"#fff", fontSize:22, fontWeight:800, fontFamily:"inherit", padding:"4px 0" }}/>
                <div onClick={()=>{ const v=parseFloat(salaryInput); if(v>0){SALARY=v;} setSalaryEditing(false); lr(); }}
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
                <div style={{ fontSize:10, color:"#444", marginTop:2 }}>G {SALARY.toLocaleString()} · {today}</div>
              </div>
              <div onClick={()=>{ setSalaryInput(String(SALARY)); setSalaryEditing(true); }}
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
                <div style={{ fontSize:10, color:"#444", marginTop:2 }}>G {SALARY.toLocaleString()} · not yet received</div>
              </div>
              <div onClick={()=>{ setSalaryInput(String(SALARY)); setSalaryEditing(true); }}
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
              <div style={{ fontSize:13, fontWeight:700, color:"#4285f4" }}>G {SALARY.toLocaleString()}</div>
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

            {/* Live allocation breakdown */}
            {parsedAmount > 0 && (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:9, color:"#69f0ae", letterSpacing:1, textTransform:"uppercase", marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
                  <span>↳ Where this goes</span>
                  <span style={{ color:"#333", fontWeight:400, textTransform:"none", letterSpacing:0 }}>based on your payroll split</span>
                </div>
                {/* Stacked bar */}
                <div style={{ height:6, background:"#111", borderRadius:3, overflow:"hidden", display:"flex", marginBottom:10 }}>
                  {allocation.map((b,i) => (
                    <div key={b.id} style={{ width:`${b.pct}%`, height:"100%", background:b.color, borderRight:i<allocation.length-1?"1px solid #000":"none" }}/>
                  ))}
                </div>
                {/* Bucket rows */}
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {allocation.map(b => (
                    <div key={b.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:b.color, flexShrink:0 }}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <span style={{ fontSize:12, color:"#888" }}>{b.label}</span>
                        {b.institution && (
                          <span style={{ fontSize:9, color:b.institution.color, marginLeft:5 }}>{b.institution.flag} {b.institution.name}</span>
                        )}
                      </div>
                      <span style={{ fontSize:10, color:"#444" }}>{b.pct}%</span>
                      <span style={{ fontSize:13, fontWeight:700, color:b.color, minWidth:70, textAlign:"right" }}>G {b.institution?.fixedAmount ?? b.amount}</span>
                    </div>
                  ))}
                </div>
                {/* Total check */}
                <div style={{ marginTop:10, paddingTop:8, borderTop:"1px solid #111", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:10, color:"#333" }}>Total allocated</span>
                  <span style={{ fontSize:13, fontWeight:800, color:"#fff" }}>G {allocation.reduce((s,b)=>s+b.amount,0).toLocaleString()}</span>
                </div>
              </div>
            )}

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
    const monthName = MONTH_NAMES[selectedMoneyMonth];
    const [billsOpen,       setBillsOpen]       = useState(false);
    const [addingBill,      setAddingBill]       = useState(false);
    const [editingBillId,   setEditingBillId]    = useState(null);
    const [rLabel,   setRLabel]   = useState("");
    const [rAmount,  setRAmount]  = useState("");
    const [rCat,     setRCat]     = useState("other");
    const [rDay,     setRDay]     = useState("1");
    const [, lr] = useState(0);
    const localRefresh = () => { lr(n=>n+1); refresh(); };

    const recurringTotal = getRecurringTotal();
    const grandTotal = recurringTotal;
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

    // ── Bills bottom sheet form ──
    const BillForm = ({ isEdit }) => {
      const cat = SPEND_CATEGORIES.find(c=>c.id===rCat) || SPEND_CATEGORIES[SPEND_CATEGORIES.length-1];
      return (
        <div style={{ padding:"20px 20px 28px", background:"#0d0d0d", borderTop:"1px solid #1a1a1a" }}>
          <div style={{ fontSize:10, color:"#ce93d8", letterSpacing:1, textTransform:"uppercase", marginBottom:16 }}>
            {isEdit ? "Edit bill" : "New recurring bill"}
          </div>

          {/* Label + Amount + Day */}
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

          {/* Category grid */}
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

          {/* Actions */}
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
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>

        {/* Scrollable content */}
        <div style={{ flex:1, overflowY:"auto", padding:"0 0 80px" }}>

          {/* Header card */}
          <div style={{ margin:"14px 16px 0", padding:"18px", background:"#100a0a", border:"1px solid #ef535033", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"#ef535008" }}/>
            <div style={{ fontSize:10, color:"#ef5350", letterSpacing:1.2, textTransform:"uppercase", marginBottom:6 }}>Total out — {monthName}</div>
            <div style={{ fontSize:38, fontWeight:900, letterSpacing:-1.5, color:"#fff", lineHeight:1 }}>G {grandTotal.toLocaleString()}</div>

            {/* Stats row */}
            <div style={{ marginTop:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:9, color:"#333", marginBottom:1 }}>Recurring bills</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#ce93d8" }}>{recurringStore.length} bills · G {recurringTotal.toLocaleString()}</div>
              </div>
              {/* Manage Bills button */}
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

            <div style={{ marginTop:12, height:4, background:"#111", borderRadius:2, overflow:"hidden" }}>
              <div style={{ width:"100%", height:"100%", background:"#ce93d8" }}/>
            </div>
          </div>

          {/* ── Bills manager panel ── */}
          {billsOpen && (
            <div style={{ margin:"10px 16px 0", background:"#0a0808", border:"1px solid #ce93d822", overflow:"hidden" }}>

              {/* Bill rows */}
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

              {/* Add new bill */}
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
              <div style={{ textAlign:"center", padding:"40px 0", color:"#222", fontSize:12 }}>No expenses for {monthName}</div>
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
      </div>
    );
  };

  // ── GOALS ──
  const Goals = () => {
    const [goals, setGoals]         = useState([...goalsStore]);
    const [adding, setAdding]       = useState(false);
    const [depositing, setDepositing] = useState(null); // goal id
    const [depositAmt, setDepositAmt] = useState("");
    const [newLabel,   setNewLabel]   = useState("");
    const [newTarget,  setNewTarget]  = useState("");
    const [newIcon,    setNewIcon]    = useState((c,s)=>IC.target(c,s));
    const [newColor,   setNewColor]   = useState("#69f0ae");
    const [newNote,    setNewNote]    = useState("");
    const [, lr] = useState(0);
    const localRefresh = () => lr(n=>n+1);

    const GOAL_COLORS  = ["#69f0ae","#4fc3f7","#ffb74d","#ce93d8","#ef9a9a","#ff8a65","#fff176","#f48fb1"];
    const GOAL_ICONS   = [
      { key:"car",      fn:(c,s)=>IC.car(c,s)      },
      { key:"home",     fn:(c,s)=>IC.home(c,s)     },
      { key:"plane",    fn:(c,s)=>IC.plane(c,s)    },
      { key:"laptop",   fn:(c,s)=>IC.laptop(c,s)   },
      { key:"phone",    fn:(c,s)=>IC.phone(c,s)    },
      { key:"grad",     fn:(c,s)=>IC.grad(c,s)     },
      { key:"ring",     fn:(c,s)=>IC.ring(c,s)     },
      { key:"ship",     fn:(c,s)=>IC.ship(c,s)     },
      { key:"target",   fn:(c,s)=>IC.target(c,s)   },
      { key:"dumbbell", fn:(c,s)=>IC.dumbbell(c,s) },
      { key:"clothes",  fn:(c,s)=>IC.clothes(c,s)  },
      { key:"guitar",   fn:(c,s)=>IC.guitar(c,s)   },
    ];
    const USD_RATE     = 130; // HTG per USD

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

        {/* Header */}
        <div style={{ margin:"14px 16px 0", padding:"18px", background:"#080e08", border:"1px solid #69f0ae22", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"#69f0ae06" }}/>
          <div style={{ fontSize:10, color:"#69f0ae", letterSpacing:1.2, textTransform:"uppercase", marginBottom:2 }}>Saving goals</div>
          <div style={{ fontSize:34, fontWeight:900, letterSpacing:-1, color:"#fff", lineHeight:1 }}>G {totalSavedHTG.toLocaleString()}</div>
          <div style={{ fontSize:11, color:"#444", marginTop:4 }}>across {goals.length} goal{goals.length!==1?"s":""}</div>
        </div>

        {/* Goal cards */}
        <div style={{ margin:"12px 16px 0", display:"flex", flexDirection:"column", gap:10 }}>
          {goals.map(g => {
            const { pct, remaining } = getGoalProgress(g);
            const isDepositing = depositing === g.id;
            const monthsNeeded = g.savedHTG < g.targetHTG
              ? Math.ceil(remaining / 3000) // assumes G 3000 saved/month
              : 0;
            const done = pct >= 100;

            return (
              <div key={g.id} style={{ background:"#080808", border:`1px solid ${done?"#69f0ae33":"#111"}`, overflow:"hidden" }}>

                {/* Card top */}
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

                  {/* Progress numbers */}
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

                  {/* Progress bar */}
                  <div style={{ height:8, background:"#111", borderRadius:4, overflow:"hidden", marginBottom:8 }}>
                    <div style={{ width:`${pct}%`, height:"100%", background: done ? "#69f0ae" : `linear-gradient(90deg, ${g.color}88, ${g.color})`, borderRadius:4, transition:"width 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}/>
                  </div>

                  {/* Stats row */}
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

                  {/* Deposit controls */}
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

        {/* Add goal */}
        {adding ? (
          <div style={{ margin:"10px 16px 0", padding:"16px", background:"#090909", border:"1px solid #1e1e1e" }}>
            <div style={{ fontSize:10, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>New goal</div>

            {/* Icon row */}
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

            {/* Color */}
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
          {/* Sidebar header */}
          <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid #111" }}>
            <div style={{ fontSize:11, color:"#333", letterSpacing:1.2, textTransform:"uppercase", marginBottom:10 }}>Money</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#fff", letterSpacing:-0.5 }}>G {totalIncomeSidebar.toLocaleString()}</div>
            <div style={{ fontSize:10, color:"#444", marginTop:2 }}>total income · {new Date().toLocaleDateString("en-US",{month:"long"})}</div>
          </div>

          {/* Nav items */}
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

          {/* Sidebar footer — salary badge */}
          <div style={{ padding:"14px 20px", borderTop:"1px solid #111" }}>
            <div style={{ fontSize:9, color:"#333", letterSpacing:0.8, textTransform:"uppercase", marginBottom:4 }}>Monthly salary</div>
            <div style={{ fontSize:16, fontWeight:800, color:"#4285f4" }}>G {SALARY.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ flexShrink:0, padding:"12px 16px", borderBottom:"1px solid #0d0d0d", display:"flex", alignItems:"center", gap:12 }}>
        {/* Hamburger */}
        <div onClick={() => setSidebarOpen(s=>!s)}
          style={{ width:36, height:36, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, cursor:"pointer", flexShrink:0 }}>
          <div style={{ width:20, height:1.5, background:"#aaa", borderRadius:1 }}/>
          <div style={{ width:14, height:1.5, background:"#aaa", borderRadius:1 }}/>
          <div style={{ width:20, height:1.5, background:"#aaa", borderRadius:1 }}/>
        </div>
        {/* Current view title */}
        <div style={{ flex:1 }}>
          <div style={{ fontSize:18, fontWeight:800, letterSpacing:-0.5, color:"#fff", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color: currentTab.color }}>{currentTab.icon}</span>
            {currentTab.label}
          </div>
          <div style={{ fontSize:10, color:"#444", marginTop:1 }}>{MONTH_NAMES[selectedMoneyMonth]} {new Date().getFullYear()}</div>
        </div>
        {/* Salary pill */}
        <div style={{ fontSize:10, color:"#4285f4", background:"#4285f411", border:"1px solid #4285f422", padding:"4px 10px", flexShrink:0 }}>
          G {SALARY.toLocaleString()}
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
        {view === "payroll"   && <PayrollView salary={SALARY} refresh={refresh} />}
        {view === "recurring" && <Recurring />}
        {view === "history"   && <History />}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
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

        {/* Tab content */}
        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          {activeTab === "notes"    && <NotesTab />}
          {activeTab === "calendar" && <CalendarTab />}
          {activeTab === "money"    && <MoneyTab />}
        </div>

        {/* Bottom tab bar */}
        <div style={{
          display:"flex", flexShrink:0,
          borderTop:"1px solid #111",
          background:"#000",
          paddingBottom:8,
        }}>
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

        {/* Detail screen — covers full app including nav bar */}
        {detailCtx && <TaskDetailScreen ev={detailCtx.ev} dateKey={detailCtx.dateKey} year={detailCtx.year} month={detailCtx.month} onClose={()=>setDetailCtx(null)} bump={()=>detailCtx.bump&&detailCtx.bump()}/>}

      </div>
    </div>
  );
}
