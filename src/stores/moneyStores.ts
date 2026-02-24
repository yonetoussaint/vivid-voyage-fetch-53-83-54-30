import { SPEND_CATEGORIES, INCOME_SOURCES, DEFAULT_BUCKETS, recurringStore as recurringData, SALARY as baseSalary } from '@/data/moneyData';
import { IC } from '@/components/easy/IconLibrary';

// Salary (editable)
export let SALARY = baseSalary;

// Income store
export const incomeStore = [];
export let incomeIdCounter = 1;

// Salary received flag
export let salaryReceived = false;

// Transaction store (for calendar compatibility)
export const txStore = { transactions: [] };

// Monthly spends
export const monthlySpends = {};

// Bucket store
export const bucketStore = DEFAULT_BUCKETS.map(b => ({...b}));

// Goals store
export let goalsStore = [
  {
    id:"g1", label:"Suzuki Grand Vitara", icon:(c,s)=>IC.car(c,s), color:"#69f0ae",
    targetUSD:5000, targetHTG:5000*130,
    savedHTG:0,
    note:"~5,000 USD · saving monthly from salary",
    usdRate:130,
  },
];
export let goalIdCounter = 2;

// Recurring expenses store (exported as a mutable array)
export const recurringStore = [...recurringData];
export let recurringIdCounter = recurringStore.length + 1;

// Helper functions
export function getMonthKey(month) {
  return `${new Date().getFullYear()}-${String(month+1).padStart(2,'0')}`;
}

export function getMonthlySpend(month) {
  return monthlySpends[getMonthKey(month)] || {};
}

export function setMonthlySpend(month, categoryId, amount) {
  const key = getMonthKey(month);
  if (!monthlySpends[key]) monthlySpends[key] = {};
  if (amount <= 0) delete monthlySpends[key][categoryId];
  else monthlySpends[key][categoryId] = amount;
}

export function getMonthTotals(month) {
  const totals = {};
  SPEND_CATEGORIES.forEach(c => totals[c.id] = 0);
  recurringStore.forEach(r => {
    if (totals[r.category] !== undefined) totals[r.category] += r.amount;
  });
  return totals;
}

export function addIncome(entry) {
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

export function getTotalIncome() {
  return incomeStore.reduce((s, e) => s + e.amount, 0);
}

export function getTotalIncomeWithSalary(salaryReceivedFlag) {
  const base = incomeStore.filter(e => e.sourceId !== "salary").reduce((s, e) => s + e.amount, 0);
  return salaryReceivedFlag ? base + SALARY : base;
}

export function getRecurringTotal() {
  return recurringStore.reduce((s, r) => s + r.amount, 0);
}

export function getGoalProgress(g) {
  const pct = Math.min(100, Math.round((g.savedHTG / g.targetHTG) * 100));
  const remaining = Math.max(0, g.targetHTG - g.savedHTG);
  return { pct, remaining };
}
