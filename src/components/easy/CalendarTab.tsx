import { useState, useEffect, useRef } from 'react';
import { MONTH_NAMES, DAY_LABELS, getDaysInMonth, getFirstDayOfWeek, formatDateKey } from '@/utils/dateHelpers';
import { events, dynamicEvents, addDynamicEvent, getEventsForDay } from '@/utils/eventUtils';
import { TYPE_META } from '@/data/typeMeta'; // <-- added missing import
import { TypeLegend } from '@/components/easy/TypeLegend';
import { EventCard } from '@/components/easy/EventCard';
import { WritingCard } from '@/components/easy/WritingCard';
import { MoneyEventCard } from '@/components/easy/MoneyEventCard';
import { AddEventSheet } from '@/components/easy/AddEventSheet';
import { txStore, incomeStore } from '@/stores/moneyStores';

export function CalendarTab() {
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

  const todayDate = now.getDate(), todayMonth = now.getMonth(), todayYear = now.getFullYear();
  const isCurrentMonth = month === todayMonth && year === todayYear;
  const totalDays = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);
  const allCells = [];
  for (let i = 0; i < firstDow; i++) allCells.push(null);
  for (let d = 1; d <= totalDays; d++) allCells.push(d);
  while (allCells.length % 7 !== 0) allCells.push(null);
  const weeks = [];
  for (let i = 0; i < allCells.length; i += 7) weeks.push(allCells.slice(i, i + 7));

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(1);
  };

  useEffect(() => {
    if (viewMode === "week" && weekScrollRef.current) {
      const pi = weeks.findIndex(w => w.includes(selectedDay));
      if (pi >= 0) weekScrollRef.current.scrollTo({ left: pi * weekScrollRef.current.offsetWidth, behavior: "smooth" });
    }
  }, [selectedDay, month, year, viewMode]);

  const dayEvents = getEventsForDay(year, month, selectedDay);

  const renderDayCell = (d: number | null, i: number) => {
    if (!d) return <div key={`e-${i}`} style={{ height: 40 }} />;
    const isToday = isCurrentMonth && d === todayDate, isSelected = d === selectedDay;
    const bg = isToday ? "#4285f4" : isSelected ? "#1e1e1e" : "transparent";
    return (
      <div key={d} style={{ textAlign: "center", padding: "3px 0", cursor: "pointer" }} onClick={() => setSelectedDay(d)}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 34, height: 34, borderRadius: "50%", background: bg,
          color: isToday ? "#fff" : "#fff", fontSize: 15,
          fontWeight: isToday || isSelected ? 700 : 400,
          outline: isSelected && !isToday ? "1.5px solid #4285f4" : "none",
          transition: "background 0.12s"
        }}>{d}</div>
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", background: "#000" }}>
      {showLegend && <TypeLegend onClose={() => setShowLegend(false)} />}

      <div ref={headerRef} style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, background: "#000" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22, fontWeight: 700 }}>{MONTH_NAMES[month]}</span>
            <span style={{ fontSize: 16, color: "#555", fontWeight: 400 }}>{year}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div onClick={prevMonth} style={{ cursor: "pointer", padding: "6px 10px", color: "#aaa", fontSize: 18, userSelect: "none" }}>‹</div>
            <div onClick={nextMonth} style={{ cursor: "pointer", padding: "6px 10px", color: "#aaa", fontSize: 18, userSelect: "none" }}>›</div>
            <div style={{ marginLeft: 6, display: "flex", gap: 12, alignItems: "center" }}>
              <div onClick={() => setViewMode(v => v === "month" ? "week" : "month")} style={{ cursor: "pointer", display: "flex" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="7" height="3" fill={viewMode === "month" ? "#4285f4" : "#aaa"} />
                  <rect x="3" y="11" width="7" height="3" fill={viewMode === "month" ? "#4285f4" : "#aaa"} />
                  <rect x="3" y="17" width="7" height="3" fill={viewMode === "month" ? "#4285f4" : "#aaa"} />
                  <rect x="14" y="5" width="7" height="3" fill={viewMode === "month" ? "#4285f4" : "#aaa"} />
                  <rect x="14" y="11" width="7" height="3" fill={viewMode === "month" ? "#4285f4" : "#aaa"} />
                  <rect x="14" y="17" width="7" height="3" fill={viewMode === "month" ? "#4285f4" : "#aaa"} />
                </svg>
              </div>
              <div onClick={() => setShowLegend(true)} style={{ display: "flex", flexDirection: "column", gap: 3, cursor: "pointer", padding: "4px" }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "#aaa" }} />)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 6px", marginBottom: 2 }}>
          {DAY_LABELS.map((d, i) => <div key={d} style={{ textAlign: "center", fontSize: 11, color: "#666", fontWeight: 500, padding: "2px 0", letterSpacing: 0.3 }}>{d}</div>)}
        </div>
        {viewMode === "week" && (
          <div style={{ position: "relative", borderBottom: "1px solid #1a1a1a" }}>
            <div ref={weekScrollRef} style={{ display: "flex", overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", padding: "0 0 8px" }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", minWidth: "100%", width: "100%", flexShrink: 0, scrollSnapAlign: "start", padding: "0 6px", boxSizing: "border-box" }}>
                  {week.map((d, i) => renderDayCell(d, i))}
                </div>
              ))}
            </div>
          </div>
        )}
        {viewMode === "month" && (
          <div style={{ padding: "0 6px 8px", borderBottom: "1px solid #1a1a1a" }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
                {week.map((d, i) => renderDayCell(d, i))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: dayEvents ? "flex-start" : "center",
        justifyContent: dayEvents ? "flex-start" : "center",
        overflowY: "auto", padding: "10px 16px", paddingTop: headerHeight
      }}>
        {dayEvents ? (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: 0.5, textTransform: "uppercase" }}>
                {DAY_LABELS[new Date(year, month, selectedDay).getDay() === 0 ? 6 : new Date(year, month, selectedDay).getDay() - 1]}, {MONTH_NAMES[month].slice(0, 3)} {selectedDay}
              </div>
              {(() => {
                const dk = formatDateKey(year, month, selectedDay);
                const daySpent = txStore.transactions.filter(t => t.isoDate === dk).reduce((s, t) => s + t.amount, 0);
                const dayIncome = incomeStore.filter(e => e.isoDate === dk && e.sourceId !== "salary").reduce((s, e) => s + e.amount, 0);
                if (!daySpent && !dayIncome) return null;
                return (
                  <div style={{ display: "flex", gap: 8 }}>
                    {dayIncome > 0 && <div style={{ fontSize: 10, fontWeight: 700, color: "#69f0ae" }}>+G {dayIncome.toLocaleString()}</div>}
                    {daySpent > 0 && <div style={{ fontSize: 10, fontWeight: 700, color: "#ef5350" }}>-G {daySpent.toLocaleString()}</div>}
                  </div>
                );
              })()}
            </div>
            {["Dawn", "Morning", "Afternoon", "Evening"].map(part => {
              const partEvents = dayEvents[part];
              if (!partEvents || partEvents.length === 0) return null;
              const icons = { Dawn: "🌑", Morning: "🌅", Afternoon: "☀️", Evening: "🌙" };
              const ranges = { Dawn: "3:00 – 4:30", Morning: "6:00 – 12:00", Afternoon: "12:00 – 17:00", Evening: "17:00 – 22:00" };
              return (
                <div key={part}>
                  <div style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{icons[part]}</span>{part}
                    <span style={{ color: "#333", fontWeight: 400, letterSpacing: 0.3, textTransform: "none", marginLeft: 2 }}>{ranges[part]}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {partEvents.map((ev, i) => {
                      const dateKey = formatDateKey(year, month, selectedDay);
                      const isWriting = TYPE_META[ev.type] && TYPE_META[ev.type].writing;
                      const isMoney = ev.type === "spending" || ev.type === "income_ev";
                      return isMoney ? (
                        <MoneyEventCard key={i} ev={ev} />
                      ) : isWriting ? (
                        <WritingCard key={i} ev={ev} />
                      ) : (
                        <EventCard key={i} ev={ev} dateKey={dateKey} year={year} month={month} forceUpdate={forceUpdate} />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 72, height: 64, background: "#0d0d0d", border: "1px solid #222", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ background: "#4285f4", height: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 3, height: 9, background: "#fff", marginTop: -4 }} />)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, padding: 5 }}>
                {Array(12).fill(0).map((_, i) => <div key={i} style={{ background: "#222", height: 7 }} />)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>You have a free day</div>
              <div style={{ fontSize: 13, color: "#555" }}>Take it easy</div>
            </div>
          </div>
        )}
      </div>

      <div
        onClick={() => setShowAddSheet(true)}
        style={{
          position: "absolute", bottom: 16, right: 20, width: 48, height: 48, borderRadius: "50%",
          background: "#4285f4", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 2px 8px rgba(66,133,244,0.4)", zIndex: 10
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

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