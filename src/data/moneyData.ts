import { IC } from '../components/icons/IconLibrary';

export const SPEND_CATEGORIES = [
  { id:"food",         label:"Food",         icon:(c,s)=>IC.food(c,s),      color:"#69f0ae", budget:3000 },
  { id:"transport",    label:"Transport",    icon:(c,s)=>IC.transport(c,s),  color:"#ffb74d", budget:5200 },
  { id:"cosmetics",    label:"Cosmetics",    icon:(c,s)=>IC.cosmetics(c,s),  color:"#f48fb1", budget:1500 },
  { id:"clothes",      label:"Clothes",      icon:(c,s)=>IC.clothes(c,s),    color:"#ce93d8", budget:2000 },
  { id:"internet",     label:"Internet",     icon:(c,s)=>IC.internet(c,s),   color:"#4fc3f7", budget:800  },
  { id:"haircut",      label:"Haircut",      icon:(c,s)=>IC.haircut(c,s),    color:"#fff176", budget:600  },
  { id:"savings",      label:"Savings",      icon:(c,s)=>IC.savings(c,s),    color:"#a5d6a7", budget:3000 },
  { id:"other",        label:"Other",        icon:(c,s)=>IC.other(c,s),      color:"#888",    budget:1000 },
];

export const INCOME_SOURCES = [
  { id:"salary",   label:"Salary",      color:"#4285f4" },
  { id:"family",   label:"Family",      color:"#f48fb1" },
  { id:"hustle",   label:"Side Hustle", color:"#69f0ae" },
  { id:"gift",     label:"Gift",        color:"#ce93d8" },
  { id:"freelance",label:"Freelance",   color:"#ffb74d" },
  { id:"other",    label:"Other",       color:"#888"    },
];

export const INCOME_SOURCE_ICONS = {
  salary:    (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
  family:    (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  hustle:    (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  gift:      (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  freelance: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  other:     (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

export const DEFAULT_BUCKETS = [
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

export const GOAL_ICONS = [
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

export const GOAL_COLORS = ["#69f0ae","#4fc3f7","#ffb74d","#ce93d8","#ef9a9a","#ff8a65","#fff176","#f48fb1"];

export const recurringStore = [
  { id:"r1",  label:"Internet bill",   category:"internet",  amount:800,  day:1  },
  { id:"r2",  label:"Cosmetics",       category:"cosmetics", amount:1500, day:5  },
  { id:"r3",  label:"New clothes",     category:"clothes",   amount:2000, day:1  },
  { id:"r4",  label:"Haircut",         category:"haircut",   amount:300,  day:1  },
  { id:"r5",  label:"Haircut",         category:"haircut",   amount:300,  day:15 },
  { id:"r6",  label:"Moto transport (work)",  category:"transport", amount:5200, day:1  },
];

export let SALARY = 15000;

export const goalsStore = [
  {
    id:"g1", label:"Suzuki Grand Vitara", icon:(c,s)=>IC.car(c,s), color:"#69f0ae",
    targetUSD:5000, targetHTG:5000*130,
    savedHTG:0,
    note:"~5,000 USD · saving monthly from salary",
    usdRate:130,
  },
];