import React, { useState, useCallback, useRef } from "react";

// ─── Real project data ─────────────────────────────────────────────────────────
import staffDataRaw   from "../data/staff.json";
import blogDataRaw    from "../data/blog.json";
import resultsDataRaw from "../data/results.json";
import faqEnRaw       from "../data/faq.en.json";
import faqHyRaw       from "../data/faq.hy.json";
import faqRuRaw       from "../data/faq.ru.json";
import pricesEnRaw    from "../data/prices.en.json";
import pricesHyRaw    from "../data/prices.hy.json";
import pricesRuRaw    from "../data/prices.ru.json";
import servicesEnRaw  from "../data/services.en.json";
import servicesHyRaw  from "../data/services.hy.json";
import servicesRuRaw  from "../data/services.ru.json";
import enT            from "../locales/en/translation.json";
import hyT            from "../locales/hy/translation.json";
import ruT            from "../locales/ru/translation.json";

// ─── Constants ─────────────────────────────────────────────────────────────────
const LANGS   = ["en", "hy", "ru"];
const LANG_LABELS = { en: "English", hy: "Հայerен", ru: "Русский" };
const TRANSLATIONS = { en: enT, hy: hyT, ru: ruT };
const PRICES_RAW   = { en: pricesEnRaw, hy: pricesHyRaw, ru: pricesRuRaw };
const SERVICES_RAW = { en: servicesEnRaw, hy: servicesHyRaw, ru: servicesRuRaw };
const ICONS_LIST   = ["female","male","urology","gynecology","radiology","endocrinological"];

const BLUE  = "#1e2150";
const GREEN = "#9eba44";
const GRAY  = "#6b7280";
const LIGHT = "#f9fafb";

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Auth ──────────────────────────────────────────────────────────────────────
const DEMO_USERS = [
  { id:1, name:"Admin User",     email:"admin@fanarjyan.am",  password:"admin123",  role:"superadmin", createdAt:"2024-01-01" },
  { id:2, name:"Content Editor", email:"editor@fanarjyan.am", password:"editor123", role:"editor",     createdAt:"2024-03-15" },
  { id:3, name:"Viewer Account", email:"viewer@fanarjyan.am", password:"viewer123", role:"viewer",     createdAt:"2024-06-01" },
];
const ROLES = {
  superadmin: { label:"Super Admin", color:"#dc2626", pages:["dashboard","staff","services","blog","faq","prices","siteinfo","users","settings"] },
  editor:     { label:"Editor",      color:"#2563eb", pages:["dashboard","staff","services","blog","faq","prices"] },
  viewer:     { label:"Viewer",      color:"#16a34a", pages:["dashboard"] },
};

// ─── Data builders ─────────────────────────────────────────────────────────────
function buildStaff() {
  return staffDataRaw.map(d => {
    const i18n = {};
    LANGS.forEach(lang => {
      const t = TRANSLATIONS[lang].staff?.[d.key] || {};
      i18n[lang] = {
        name:       t.name       || "",
        profession: (t.profession || "").trim(),
        shortText:  (t.shortText  || "").trim(),
        modalTitle: (t.modalTitle || "").trim(),
        modalText:  (t.modalText  || "").trim(),
      };
    });
    return { id: d.id, key: d.key, image: d.key, active: true, i18n };
  });
}

function buildBlog() {
  return blogDataRaw.map(p => {
    const i18n = {};
    LANGS.forEach(lang => {
      const t = TRANSLATIONS[lang].blog_section?.posts?.[p.id] || {};
      i18n[lang] = {
        title:     t.title     || "",
        text:      t.text      || "",
        modalText: t.modalText || "",
      };
    });
    return { id: p.id, image: p.image || "", date: p.date, time: p.time || "", published: true, i18n };
  });
}

function buildServices() {
  return (servicesEnRaw.tabs || []).map(tab => {
    const i18n = {};
    LANGS.forEach(lang => {
      const found = (SERVICES_RAW[lang]?.tabs || []).find(t => t.id === tab.id);
      i18n[lang] = { title: found?.title || tab.title || "" };
    });
    return { id: tab.id, icon: tab.icon, active: true, i18n };
  });
}

function buildFaq() {
  const RAW = { en: faqEnRaw, hy: faqHyRaw, ru: faqRuRaw };
  // Group by index so each "item" is one FAQ entry with all languages
  const maxLen = Math.max(...LANGS.map(l => RAW[l].length));
  const items = [];
  for (let i = 0; i < maxLen; i++) {
    const i18n = {};
    LANGS.forEach(lang => {
      const q = RAW[lang][i] || {};
      i18n[lang] = { question: q.question || "", answer: q.answer || "" };
    });
    items.push({ id: `faq-${i}`, active: true, i18n });
  }
  return items;
}

function buildPrices() {
  // Build a flat list using EN as the source of truth; attach translations per item by index
  const items = [];
  (pricesEnRaw.categories || []).forEach((cat, ci) => {
    (cat.sections || []).forEach((sec, si) => {
      (sec.items || []).forEach((item, ii) => {
        const i18n = {};
        LANGS.forEach(lang => {
          const c = PRICES_RAW[lang]?.categories?.[ci];
          const s = c?.sections?.[si];
          const it = s?.items?.[ii];
          i18n[lang] = {
            categoryTitle: c?.title  || cat.title,
            sectionTitle:  s?.title  || sec.title,
            name:          it?.name  || item.name,
            price:         it?.price || item.price,
          };
        });
        items.push({ id: uid(), catIndex: ci, secIndex: si, itemIndex: ii, active: true, i18n });
      });
    });
  });
  return items;
}

const INITIAL_SITE = {
  phone:    enT.contact_section?.info?.phoneValue   || "+374 10 52 90 06",
  phone2:   enT.contact_section?.info?.phoneValue2  || "+374 94 52 90 06",
  email:    enT.contact_section?.info?.emailValue   || "fanarjyanclinic@gmail.com",
  address:  enT.contact_section?.info?.locationValue || "Yerevan, Sarmeni 90",
  instagram:"https://www.instagram.com/fanarjyan_clinic",
  facebook: "https://www.facebook.com/share/1XTPQsvasy/",
  linkedin: "https://www.linkedin.com/company/fanarjyan-clinic/",
  youtube:  "https://youtube.com/@fanarjyanclinic8413",
};
const INITIAL_STATS = {
  pregnancies: resultsDataRaw[0]?.stats?.story   || 1100,
  patients:    resultsDataRaw[0]?.stats?.clients  || 20000,
  surgeries:   resultsDataRaw[0]?.stats?.results  || 100,
  countries:   resultsDataRaw[0]?.stats?.awards   || 15,
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const S = {
  wrap:    { display:"flex", minHeight:"100vh", fontFamily:"'Segoe UI',system-ui,sans-serif", background:LIGHT },
  sidebar: (w) => ({ width:w, background:BLUE, display:"flex", flexDirection:"column", transition:"width .25s", flexShrink:0, height:"100vh", position:"sticky", top:0, overflow:"hidden" }),
  main:    { flex:1, overflowY:"auto" },
  content: { padding:32, maxWidth:1300, margin:"0 auto" },
  sHead:   { padding:"20px 16px", borderBottom:"1px solid rgba(255,255,255,.1)", display:"flex", alignItems:"center", justifyContent:"space-between" },
  logoBox: { width:38, height:38, borderRadius:10, background:GREEN, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:20, color:"#fff", flexShrink:0 },
  navBtn:  (a) => ({ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"12px 20px", border:"none", background:a?"rgba(158,186,68,.2)":"transparent", color:a?GREEN:"rgba(255,255,255,.75)", cursor:"pointer", fontSize:14, textAlign:"left", transition:"all .2s", borderRight:a?`3px solid ${GREEN}`:"3px solid transparent", whiteSpace:"nowrap" }),
  sFoot:   { borderTop:"1px solid rgba(255,255,255,.1)", padding:16, marginTop:"auto" },
  colBtn:  { background:"rgba(255,255,255,.1)", border:"none", color:"#fff", borderRadius:6, padding:"6px 10px", cursor:"pointer", fontSize:13, flexShrink:0 },
  ph:      { display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:12 },
  pt:      { fontSize:26, fontWeight:700, color:BLUE, margin:0 },
  ps:      { fontSize:14, color:GRAY, marginTop:4 },
  card:    { background:"#fff", borderRadius:12, padding:24, boxShadow:"0 1px 4px rgba(0,0,0,.06)", marginBottom:24 },
  cTitle:  { fontSize:16, fontWeight:700, color:BLUE, marginTop:0, marginBottom:16 },
  tWrap:   { background:"#fff", borderRadius:12, overflow:"auto", boxShadow:"0 1px 4px rgba(0,0,0,.06)", marginBottom:20 },
  table:   { width:"100%", borderCollapse:"collapse" },
  th:      { padding:"11px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:GRAY, background:"#f9fafb", borderBottom:"1px solid #e5e7eb", textTransform:"uppercase", letterSpacing:".05em", whiteSpace:"nowrap" },
  td:      { padding:"13px 16px", borderBottom:"1px solid #f0f0f0", fontSize:14, color:"#374151", verticalAlign:"middle" },
  trBg:    (i) => ({ background:i%2===0?"#fff":"#fafafa" }),
  btn:     (v) => {
    const base = { border:"none", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:14, padding:"9px 18px", transition:"all .2s", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:6 };
    const map  = { primary:{background:BLUE,color:"#fff"}, green:{background:GREEN,color:"#fff"}, ghost:{background:"transparent",color:GRAY,border:"1px solid #e5e7eb"}, danger:{background:"#dc2626",color:"#fff"}, secondary:{background:"#f0f0f5",color:BLUE}, sm:{padding:"6px 12px",fontSize:12} };
    return Object.assign({}, base, ...v.split(" ").map(k=>map[k]||{}));
  },
  label:   { display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:5 },
  input:   { display:"block", width:"100%", padding:"10px 14px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:14, color:"#374151", background:"#fff", outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9000, padding:20 },
  modal:   (w) => ({ background:"#fff", borderRadius:16, width:"100%", maxWidth:w||520, maxHeight:"90vh", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,.3)" }),
  mHead:   { padding:"20px 24px", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 },
  mBody:   { padding:24, overflowY:"auto", flex:1 },
  mFoot:   { padding:"16px 24px", borderTop:"1px solid #e5e7eb", display:"flex", justifyContent:"flex-end", gap:10, flexShrink:0 },
  xBtn:    { background:"none", border:"none", cursor:"pointer", fontSize:22, color:GRAY, lineHeight:1, padding:0 },
  badge:   (c) => ({ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600, background:c+"22", color:c, border:`1px solid ${c}44` }),
  pill:    (on) => ({ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", background:on?"#dcfce7":"#f3f4f6", color:on?"#16a34a":GRAY, border:`1px solid ${on?"#bbf7d0":"#e5e7eb"}` }),
  avatar:  (c) => ({ width:36, height:36, borderRadius:10, background:c||BLUE, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:16, flexShrink:0 }),
  langTab: (a) => ({ padding:"6px 14px", border:"none", borderRadius:6, cursor:"pointer", fontWeight:600, fontSize:13, background:a?"#1e2150":"#f0f0f5", color:a?"#fff":GRAY, fontFamily:"inherit" }),
  langBox: { background:"#f8f9ff", border:"1px solid #e0e7ff", borderRadius:10, padding:16, marginBottom:16 },
  row:     { display:"flex", gap:8, alignItems:"center" },
  fRow:    { marginBottom:14 },
  toastW:  { position:"fixed", bottom:24, right:24, display:"flex", flexDirection:"column", gap:8, zIndex:10000 },
  toast:   (t) => ({ padding:"12px 20px", borderRadius:10, color:"#fff", fontWeight:600, fontSize:14, boxShadow:"0 4px 20px rgba(0,0,0,.2)", background:t==="error"?"#dc2626":t==="warning"?"#d97706":GREEN }),
  sGrid:   { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:16, marginBottom:28 },
  sCard:   (c) => ({ background:"#fff", borderRadius:12, padding:"20px 24px", display:"flex", alignItems:"center", gap:16, boxShadow:"0 1px 4px rgba(0,0,0,.06)", borderLeft:`4px solid ${c}` }),
  imgPrev: { width:80, height:80, borderRadius:10, objectFit:"cover", border:"2px solid #e5e7eb" },
  imgPlaceholder: { width:80, height:80, borderRadius:10, background:"#f0f0f5", border:"2px dashed #d1d5db", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, color:GRAY },
  uploadBtn: { display:"inline-flex", alignItems:"center", gap:8, padding:"8px 14px", border:"1px dashed #9eba44", borderRadius:8, background:"#f0fdf4", color:"#16a34a", cursor:"pointer", fontSize:13, fontWeight:600 },
};

// ─── Shared UI ─────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return <div style={S.toastW}>{toasts.map(t=><div key={t.id} style={S.toast(t.type)}>{t.msg}</div>)}</div>;
}
function Confirm({ msg, onOk, onCancel }) {
  return (
    <div style={S.overlay} onClick={onCancel}>
      <div style={S.modal(380)} onClick={e=>e.stopPropagation()}>
        <div style={S.mHead}><h3 style={{margin:0,fontSize:18}}>Confirm</h3></div>
        <div style={S.mBody}><p style={{margin:0}}>{msg}</p></div>
        <div style={S.mFoot}>
          <button style={S.btn("ghost")}  onClick={onCancel}>Cancel</button>
          <button style={S.btn("danger")} onClick={onOk}>Delete</button>
        </div>
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return <div style={S.fRow}><label style={S.label}>{label}</label>{children}</div>;
}

// Language tab switcher used inside modals
function LangTabs({ lang, setLang }) {
  return (
    <div style={{ display:"flex", gap:6, marginBottom:16, padding:"4px", background:"#f0f0f5", borderRadius:8, width:"fit-content" }}>
      {LANGS.map(l => (
        <button key={l} style={S.langTab(lang===l)} onClick={()=>setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// Image upload with preview (base64 in-memory)
function ImageUpload({ value, onChange, label = "Photo" }) {
  const inputRef = useRef();
  const handleFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Max file size is 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div style={S.fRow}>
      <label style={S.label}>{label}</label>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        {value
          ? <img src={value} alt="preview" style={S.imgPrev} />
          : <div style={S.imgPlaceholder}>🖼️</div>
        }
        <div>
          <div style={S.uploadBtn} onClick={()=>inputRef.current.click()}>
            📁 {value ? "Change image" : "Upload image"}
          </div>
          <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
          {value && (
            <button style={{...S.btn("danger sm"), marginTop:6}} onClick={()=>onChange("")}>
              Remove
            </button>
          )}
          <div style={{fontSize:11,color:GRAY,marginTop:4}}>JPG, PNG, WebP · max 5 MB</div>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ──────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [err,   setErr]   = useState("");
  const [busy,  setBusy]  = useState(false);
  const submit = e => {
    e.preventDefault(); setBusy(true); setErr("");
    setTimeout(() => {
      const u = DEMO_USERS.find(u => u.email===email && u.password===pass);
      if (u) { onLogin(u); } else { setErr("Invalid email or password."); setBusy(false); }
    }, 600);
  };
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${BLUE} 0%,#2d3a8c 60%,${BLUE} 100%)`}}>
      <div style={{background:"#fff",borderRadius:16,padding:40,width:"100%",maxWidth:420,boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:32}}>
          <div style={S.logoBox}>F</div>
          <div>
            <div style={{fontWeight:700,fontSize:20,color:BLUE}}>Fanarjyan Clinic</div>
            <div style={{fontSize:13,color:GRAY}}>Admin Panel</div>
          </div>
        </div>
        <form onSubmit={submit}>
          <Field label="Email"><input style={S.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@fanarjyan.am" required/></Field>
          <Field label="Password"><input style={S.input} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" required/></Field>
          {err && <div style={{color:"#dc2626",fontSize:13,padding:"8px 12px",background:"#fef2f2",borderRadius:6,marginBottom:12}}>{err}</div>}
          <button style={{...S.btn("primary"),width:"100%",justifyContent:"center",marginTop:8}} disabled={busy}>{busy?"Signing in…":"Sign In"}</button>
        </form>
        <div style={{marginTop:20,padding:"12px 16px",background:"#f0f0f5",borderRadius:8,fontSize:12,color:GRAY,lineHeight:2}}>
          <strong>Demo accounts:</strong><br/>
          admin@fanarjyan.am / admin123 — Super Admin<br/>
          editor@fanarjyan.am / editor123 — Editor<br/>
          viewer@fanarjyan.am / viewer123 — Viewer
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ───────────────────────────────────────────────────────────────────
const NAV = [
  {key:"dashboard",icon:"📊",label:"Dashboard"},
  {key:"staff",    icon:"👨‍⚕️",label:"Staff"},
  {key:"services", icon:"🏥",label:"Services"},
  {key:"blog",     icon:"📝",label:"Blog"},
  {key:"faq",      icon:"❓",label:"FAQ"},
  {key:"prices",   icon:"💰",label:"Prices"},
  {key:"siteinfo", icon:"📞",label:"Site Info"},
  {key:"users",    icon:"👥",label:"Users"},
  {key:"settings", icon:"⚙️",label:"Settings"},
];
function Sidebar({ page, setPage, user, onLogout, collapsed, setCollapsed }) {
  const allowed = NAV.filter(n=>ROLES[user.role].pages.includes(n.key));
  return (
    <aside style={S.sidebar(collapsed?64:240)}>
      <div style={S.sHead}>
        {!collapsed && <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={S.logoBox}>F</div>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:"#fff"}}>Fanarjyan</div>
            <div style={{fontSize:11,color:GREEN}}>Admin Panel</div>
          </div>
        </div>}
        <button style={S.colBtn} onClick={()=>setCollapsed(!collapsed)}>{collapsed?"→":"←"}</button>
      </div>
      <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
        {allowed.map(n=>(
          <button key={n.key} style={S.navBtn(page===n.key)} onClick={()=>setPage(n.key)} title={collapsed?n.label:""}>
            <span style={{fontSize:18}}>{n.icon}</span>
            {!collapsed && <span>{n.label}</span>}
          </button>
        ))}
      </nav>
      <div style={S.sFoot}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={S.avatar(ROLES[user.role].color)}>{user.name[0]}</div>
          {!collapsed && <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
            <div style={{fontSize:11,color:GREEN}}>{ROLES[user.role].label}</div>
          </div>}
          <button style={S.colBtn} onClick={onLogout} title="Sign out">↩</button>
        </div>
      </div>
    </aside>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ data, user }) {
  const cards = [
    {label:"Staff Members",value:data.staff.length,         icon:"👨‍⚕️",color:BLUE},
    {label:"Services",     value:data.services.length,      icon:"🏥",color:"#7c3aed"},
    {label:"Blog Posts",   value:data.blog.length,          icon:"📝",color:"#2563eb"},
    {label:"FAQ Items",    value:data.faq.length,           icon:"❓",color:"#d97706"},
    {label:"Price Items",  value:data.prices.length,        icon:"💰",color:GREEN},
    {label:"Pregnancies",  value:data.stats.pregnancies.toLocaleString(),icon:"👶",color:"#dc2626"},
  ];
  return (
    <div>
      <div style={S.ph}>
        <div><h1 style={S.pt}>Dashboard</h1><p style={S.ps}>Welcome back, {user.name}</p></div>
        <span style={S.badge(ROLES[user.role].color)}>{ROLES[user.role].label}</span>
      </div>
      <div style={S.sGrid}>
        {cards.map((c,i)=>(
          <div key={i} style={S.sCard(c.color)}>
            <span style={{fontSize:32}}>{c.icon}</span>
            <div><div style={{fontSize:26,fontWeight:700,color:c.color}}>{c.value}</div><div style={{fontSize:13,color:GRAY}}>{c.label}</div></div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <div style={S.card}>
          <h3 style={S.cTitle}>Clinic Statistics</h3>
          {[["Pregnancies",data.stats.pregnancies],["Patients",data.stats.patients],["Surgeries/year",data.stats.surgeries],["Countries",data.stats.countries]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f0f0f0"}}>
              <span style={{fontSize:14,color:GRAY}}>{l}</span><strong style={{color:BLUE}}>{v.toLocaleString()}</strong>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <h3 style={S.cTitle}>Active Staff</h3>
          {data.staff.filter(d=>d.active).map(d=>(
            <div key={d.id} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:"1px solid #f0f0f0"}}>
              {d.image && d.image.startsWith("data:")
                ? <img src={d.image} alt={d.i18n.en.name} style={{...S.imgPrev,width:32,height:32,borderRadius:8}}/>
                : <div style={S.avatar(BLUE)}>{(d.i18n.en.name||"?")[0]}</div>}
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{d.i18n.en.name}</div>
                <div style={{fontSize:12,color:GRAY}}>{d.i18n.en.profession}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STAFF ─────────────────────────────────────────────────────────────────────
function StaffMgr({ data, setData, toast }) {
  const [form,    setForm]    = useState(null);   // null = closed
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [search,  setSearch]  = useState("");
  const [lang,    setLang]    = useState("en");

  const emptyForm = () => ({
    image: "",
    active: true,
    i18n: { en:{name:"",profession:"",shortText:"",modalTitle:"",modalText:""}, hy:{name:"",profession:"",shortText:"",modalTitle:"",modalText:""}, ru:{name:"",profession:"",shortText:"",modalTitle:"",modalText:""} },
  });

  const openNew  = () => { setForm(emptyForm()); setEditing(null); setLang("en"); };
  const openEdit = d => { setForm(JSON.parse(JSON.stringify(d))); setEditing(d.id); setLang("en"); };

  const setI18n = (l, field, val) =>
    setForm(f => ({ ...f, i18n: { ...f.i18n, [l]: { ...f.i18n[l], [field]: val } } }));

  const save = () => {
    if (!form.i18n.en.name.trim()) { toast("English name is required", "error"); return; }
    if (editing) {
      setData(p => ({ ...p, staff: p.staff.map(d => d.id===editing ? { ...d, ...form } : d) }));
      toast("Doctor updated");
    } else {
      setData(p => ({ ...p, staff: [...p.staff, { ...form, id: uid(), key: `doctor_${uid()}` }] }));
      toast("Doctor added");
    }
    setForm(null);
  };

  const toggle = id => { setData(p=>({...p,staff:p.staff.map(d=>d.id===id?{...d,active:!d.active}:d)})); toast("Status updated"); };
  const del    = ()  => { setData(p=>({...p,staff:p.staff.filter(d=>d.id!==confirm)})); toast("Doctor deleted","warning"); setConfirm(null); };

  const rows = data.staff.filter(d => d.i18n.en.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={S.ph}>
        <div><h1 style={S.pt}>Staff</h1><p style={S.ps}>{data.staff.length} members</p></div>
        <button style={S.btn("green")} onClick={openNew}>+ Add Doctor</button>
      </div>
      <input style={{...S.input,maxWidth:300,marginBottom:16}} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
      <div style={S.tWrap}>
        <table style={S.table}>
          <thead><tr>{["Photo","Name (EN)","Profession (EN)","Status","Actions"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((d,i)=>(
            <tr key={d.id} style={S.trBg(i)}>
              <td style={S.td}>
                {d.image && d.image.startsWith("data:")
                  ? <img src={d.image} alt={d.i18n.en.name} style={{width:42,height:42,borderRadius:8,objectFit:"cover",border:"2px solid #e5e7eb"}}/>
                  : <div style={S.avatar(BLUE)}>{(d.i18n.en.name||"?")[0]}</div>}
              </td>
              <td style={S.td}><strong>{d.i18n.en.name}</strong></td>
              <td style={S.td}>{d.i18n.en.profession}</td>
              <td style={S.td}><span style={S.pill(d.active)} onClick={()=>toggle(d.id)}>{d.active?"Active":"Inactive"}</span></td>
              <td style={S.td}><div style={S.row}><button style={S.btn("secondary sm")} onClick={()=>openEdit(d)}>Edit</button><button style={S.btn("danger sm")} onClick={()=>setConfirm(d.id)}>Delete</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {form!==null && (
        <div style={S.overlay} onClick={()=>setForm(null)}>
          <div style={S.modal(680)} onClick={e=>e.stopPropagation()}>
            <div style={S.mHead}>
              <h3 style={{margin:0}}>{editing?"Edit Doctor":"Add Doctor"}</h3>
              <button style={S.xBtn} onClick={()=>setForm(null)}>✕</button>
            </div>
            <div style={S.mBody}>
              <ImageUpload value={form.image} onChange={v=>setForm(f=>({...f,image:v}))} label="Doctor Photo"/>
              <div style={{borderTop:"1px solid #e5e7eb",margin:"16px 0 14px"}}/>
              <LangTabs lang={lang} setLang={setLang}/>
              <div style={S.langBox}>
                <div style={{fontWeight:700,color:BLUE,marginBottom:12,fontSize:13}}>{LANG_LABELS[lang]}</div>
                <Field label="Full Name *">
                  <input style={S.input} value={form.i18n[lang].name} onChange={e=>setI18n(lang,"name",e.target.value)}/>
                </Field>
                <Field label="Profession">
                  <input style={S.input} value={form.i18n[lang].profession} onChange={e=>setI18n(lang,"profession",e.target.value)}/>
                </Field>
                <Field label="Short Bio (card)">
                  <textarea style={{...S.input,height:70,resize:"vertical"}} value={form.i18n[lang].shortText} onChange={e=>setI18n(lang,"shortText",e.target.value)}/>
                </Field>
                <Field label="Modal Title">
                  <input style={S.input} value={form.i18n[lang].modalTitle} onChange={e=>setI18n(lang,"modalTitle",e.target.value)}/>
                </Field>
                <Field label="Full Bio (modal)">
                  <textarea style={{...S.input,height:120,resize:"vertical"}} value={form.i18n[lang].modalText} onChange={e=>setI18n(lang,"modalText",e.target.value)}/>
                </Field>
              </div>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                <input type="checkbox" checked={!!form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))}/> Active on website
              </label>
            </div>
            <div style={S.mFoot}>
              <button style={S.btn("ghost")} onClick={()=>setForm(null)}>Cancel</button>
              <button style={S.btn("primary")} onClick={save}>Save Doctor</button>
            </div>
          </div>
        </div>
      )}
      {confirm && <Confirm msg="Delete this doctor?" onOk={del} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ─── SERVICES ──────────────────────────────────────────────────────────────────
function ServicesMgr({ data, setData, toast }) {
  const [form,    setForm]    = useState(null);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [lang,    setLang]    = useState("en");

  const emptyForm = () => ({
    icon:"female", active:true,
    i18n: { en:{title:""}, hy:{title:""}, ru:{title:""} },
  });

  const openNew  = () => { setForm(emptyForm()); setEditing(null); setLang("en"); };
  const openEdit = s => { setForm(JSON.parse(JSON.stringify(s))); setEditing(s.id); setLang("en"); };
  const setI18n  = (l, field, val) => setForm(f=>({...f,i18n:{...f.i18n,[l]:{...f.i18n[l],[field]:val}}}));

  const save = () => {
    if (!form.i18n.en.title.trim()) { toast("English title required","error"); return; }
    if (editing) { setData(p=>({...p,services:p.services.map(s=>s.id===editing?{...s,...form}:s)})); toast("Service updated"); }
    else         { setData(p=>({...p,services:[...p.services,{...form,id:`svc-${uid()}`}]})); toast("Service added"); }
    setForm(null);
  };
  const toggle = id => { setData(p=>({...p,services:p.services.map(s=>s.id===id?{...s,active:!s.active}:s)})); toast("Status updated"); };
  const del    = ()  => { setData(p=>({...p,services:p.services.filter(s=>s.id!==confirm)})); toast("Deleted","warning"); setConfirm(null); };

  return (
    <div>
      <div style={S.ph}>
        <div><h1 style={S.pt}>Services</h1><p style={S.ps}>{data.services.length} services</p></div>
        <button style={S.btn("green")} onClick={openNew}>+ Add Service</button>
      </div>
      <div style={S.tWrap}><table style={S.table}>
        <thead><tr>{["Title (EN)","Title (HY)","Title (RU)","Icon","Status","Actions"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>{data.services.map((s,i)=>(
          <tr key={s.id} style={S.trBg(i)}>
            <td style={S.td}><strong>{s.i18n.en.title}</strong></td>
            <td style={{...S.td,color:GRAY,fontSize:13}}>{s.i18n.hy.title}</td>
            <td style={{...S.td,color:GRAY,fontSize:13}}>{s.i18n.ru.title}</td>
            <td style={S.td}><span style={{padding:"3px 10px",borderRadius:20,fontSize:12,background:"#f0fdf4",color:"#16a34a",border:"1px solid #bbf7d0"}}>{s.icon}</span></td>
            <td style={S.td}><span style={S.pill(s.active)} onClick={()=>toggle(s.id)}>{s.active?"Active":"Hidden"}</span></td>
            <td style={S.td}><div style={S.row}><button style={S.btn("secondary sm")} onClick={()=>openEdit(s)}>Edit</button><button style={S.btn("danger sm")} onClick={()=>setConfirm(s.id)}>Delete</button></div></td>
          </tr>
        ))}</tbody>
      </table></div>

      {form!==null && (
        <div style={S.overlay} onClick={()=>setForm(null)}>
          <div style={S.modal(600)} onClick={e=>e.stopPropagation()}>
            <div style={S.mHead}><h3 style={{margin:0}}>{editing?"Edit":"Add"} Service</h3><button style={S.xBtn} onClick={()=>setForm(null)}>✕</button></div>
            <div style={S.mBody}>
              <Field label="Icon Key">
                <select style={S.input} value={form.icon||"female"} onChange={e=>setForm(f=>({...f,icon:e.target.value}))}>
                  {ICONS_LIST.map(ic=><option key={ic} value={ic}>{ic}</option>)}
                </select>
              </Field>
              <div style={{borderTop:"1px solid #e5e7eb",margin:"14px 0"}}/>
              <LangTabs lang={lang} setLang={setLang}/>
              <div style={S.langBox}>
                <div style={{fontWeight:700,color:BLUE,marginBottom:12,fontSize:13}}>{LANG_LABELS[lang]}</div>
                <Field label={`Service Title${lang==="en"?" *":""}`}>
                  <input style={S.input} value={form.i18n[lang].title} onChange={e=>setI18n(lang,"title",e.target.value)}/>
                </Field>
              </div>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                <input type="checkbox" checked={!!form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))}/> Active / Visible
              </label>
            </div>
            <div style={S.mFoot}><button style={S.btn("ghost")} onClick={()=>setForm(null)}>Cancel</button><button style={S.btn("primary")} onClick={save}>Save</button></div>
          </div>
        </div>
      )}
      {confirm && <Confirm msg="Delete this service?" onOk={del} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ─── BLOG ──────────────────────────────────────────────────────────────────────
function BlogMgr({ data, setData, toast }) {
  const [form,    setForm]    = useState(null);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [search,  setSearch]  = useState("");
  const [lang,    setLang]    = useState("en");

  const emptyForm = () => ({
    image:"", date: new Date().toLocaleDateString("en-GB").replace(/\//g,"/"),
    time:"10:00", published:true,
    i18n: { en:{title:"",text:"",modalText:""}, hy:{title:"",text:"",modalText:""}, ru:{title:"",text:"",modalText:""} },
  });

  const openNew  = () => { setForm(emptyForm()); setEditing(null); setLang("en"); };
  const openEdit = p => { setForm(JSON.parse(JSON.stringify(p))); setEditing(p.id); setLang("en"); };
  const setI18n  = (l, field, val) => setForm(f=>({...f,i18n:{...f.i18n,[l]:{...f.i18n[l],[field]:val}}}));

  const save = () => {
    if (!form.i18n.en.title.trim()) { toast("English title required","error"); return; }
    if (editing) { setData(p=>({...p,blog:p.blog.map(b=>b.id===editing?{...b,...form}:b)})); toast("Post updated"); }
    else         { setData(p=>({...p,blog:[...p.blog,{...form,id:`post-${uid()}`}]})); toast("Post added"); }
    setForm(null);
  };
  const toggle = id => { setData(p=>({...p,blog:p.blog.map(b=>b.id===id?{...b,published:!b.published}:b)})); toast("Status updated"); };
  const del    = ()  => { setData(p=>({...p,blog:p.blog.filter(b=>b.id!==confirm)})); toast("Post deleted","warning"); setConfirm(null); };

  const rows = data.blog.filter(b=>b.i18n.en.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={S.ph}>
        <div><h1 style={S.pt}>Blog</h1><p style={S.ps}>{data.blog.length} posts</p></div>
        <button style={S.btn("green")} onClick={openNew}>+ New Post</button>
      </div>
      <input style={{...S.input,maxWidth:300,marginBottom:16}} placeholder="Search posts…" value={search} onChange={e=>setSearch(e.target.value)}/>
      <div style={S.tWrap}><table style={S.table}>
        <thead><tr>{["Image","Date","Title (EN)","Title (HY)","Title (RU)","Status","Actions"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((b,i)=>(
          <tr key={b.id} style={S.trBg(i)}>
            <td style={S.td}>
              {b.image && b.image.startsWith("data:")
                ? <img src={b.image} alt="" style={{width:48,height:48,borderRadius:6,objectFit:"cover",border:"1px solid #e5e7eb"}}/>
                : <div style={{width:48,height:48,borderRadius:6,background:"#f0f0f5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📄</div>}
            </td>
            <td style={{...S.td,whiteSpace:"nowrap",color:GRAY}}>{b.date}</td>
            <td style={S.td}><strong>{b.i18n.en.title}</strong></td>
            <td style={{...S.td,color:GRAY,fontSize:13,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.i18n.hy.title}</td>
            <td style={{...S.td,color:GRAY,fontSize:13,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.i18n.ru.title}</td>
            <td style={S.td}><span style={S.pill(b.published)} onClick={()=>toggle(b.id)}>{b.published?"Published":"Draft"}</span></td>
            <td style={S.td}><div style={S.row}><button style={S.btn("secondary sm")} onClick={()=>openEdit(b)}>Edit</button><button style={S.btn("danger sm")} onClick={()=>setConfirm(b.id)}>Delete</button></div></td>
          </tr>
        ))}</tbody>
      </table></div>

      {form!==null && (
        <div style={S.overlay} onClick={()=>setForm(null)}>
          <div style={S.modal(700)} onClick={e=>e.stopPropagation()}>
            <div style={S.mHead}><h3 style={{margin:0}}>{editing?"Edit Post":"New Post"}</h3><button style={S.xBtn} onClick={()=>setForm(null)}>✕</button></div>
            <div style={S.mBody}>
              <ImageUpload value={form.image} onChange={v=>setForm(f=>({...f,image:v}))} label="Cover Image"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,margin:"14px 0"}}>
                <Field label="Date">
                  <input style={S.input} value={form.date||""} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
                </Field>
                <Field label="Time">
                  <input style={S.input} value={form.time||""} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/>
                </Field>
              </div>
              <div style={{borderTop:"1px solid #e5e7eb",margin:"4px 0 14px"}}/>
              <LangTabs lang={lang} setLang={setLang}/>
              <div style={S.langBox}>
                <div style={{fontWeight:700,color:BLUE,marginBottom:12,fontSize:13}}>{LANG_LABELS[lang]}</div>
                <Field label={`Title${lang==="en"?" *":""}`}>
                  <input style={S.input} value={form.i18n[lang].title} onChange={e=>setI18n(lang,"title",e.target.value)}/>
                </Field>
                <Field label="Excerpt">
                  <textarea style={{...S.input,height:80,resize:"vertical"}} value={form.i18n[lang].text} onChange={e=>setI18n(lang,"text",e.target.value)}/>
                </Field>
                <Field label="Full Article (modal)">
                  <textarea style={{...S.input,height:130,resize:"vertical"}} value={form.i18n[lang].modalText} onChange={e=>setI18n(lang,"modalText",e.target.value)}/>
                </Field>
              </div>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                <input type="checkbox" checked={!!form.published} onChange={e=>setForm(f=>({...f,published:e.target.checked}))}/> Published
              </label>
            </div>
            <div style={S.mFoot}><button style={S.btn("ghost")} onClick={()=>setForm(null)}>Cancel</button><button style={S.btn("primary")} onClick={save}>Save Post</button></div>
          </div>
        </div>
      )}
      {confirm && <Confirm msg="Delete this post?" onOk={del} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────
function FaqMgr({ data, setData, toast }) {
  const [form,    setForm]    = useState(null);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [lang,    setLang]    = useState("all");
  const [editLang,setEditLang]= useState("en");

  const emptyForm = () => ({
    active:true,
    i18n:{ en:{question:"",answer:""}, hy:{question:"",answer:""}, ru:{question:"",answer:""} },
  });

  const openNew  = () => { setForm(emptyForm()); setEditing(null); setEditLang("en"); };
  const openEdit = f => { setForm(JSON.parse(JSON.stringify(f))); setEditing(f.id); setEditLang("en"); };
  const setI18n  = (l, field, val) => setForm(f=>({...f,i18n:{...f.i18n,[l]:{...f.i18n[l],[field]:val}}}));

  const save = () => {
    if (!form.i18n.en.question.trim()) { toast("English question required","error"); return; }
    if (editing) { setData(p=>({...p,faq:p.faq.map(f=>f.id===editing?{...f,...form}:f)})); toast("FAQ updated"); }
    else         { setData(p=>({...p,faq:[...p.faq,{...form,id:`faq-${uid()}`}]})); toast("FAQ added"); }
    setForm(null);
  };
  const toggle = id => { setData(p=>({...p,faq:p.faq.map(f=>f.id===id?{...f,active:!f.active}:f)})); toast("Status updated"); };
  const del    = ()  => { setData(p=>({...p,faq:p.faq.filter(f=>f.id!==confirm)})); toast("FAQ deleted","warning"); setConfirm(null); };

  // Filter: if a language is selected, only show items that have content in that language
  const rows = lang==="all" ? data.faq : data.faq.filter(f=>f.i18n[lang]?.question);

  return (
    <div>
      <div style={S.ph}>
        <div><h1 style={S.pt}>FAQ</h1><p style={S.ps}>{data.faq.length} items</p></div>
        <button style={S.btn("green")} onClick={openNew}>+ Add FAQ</button>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["all","en","hy","ru"].map(l=><button key={l} style={{...S.btn(lang===l?"primary":"ghost"),padding:"6px 14px"}} onClick={()=>setLang(l)}>{l==="all"?"All":l.toUpperCase()}</button>)}
      </div>
      {rows.map(f=>(
        <div key={f.id} style={{background:"#fff",borderRadius:10,padding:"16px 20px",boxShadow:"0 1px 4px rgba(0,0,0,.06)",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10,flexWrap:"wrap",marginBottom:8}}>
            <div style={{display:"flex",gap:4}}>
              {LANGS.map(l=><span key={l} style={{padding:"2px 7px",borderRadius:4,fontSize:11,fontWeight:700,background:f.i18n[l]?.question?"#dcfce7":"#f3f4f6",color:f.i18n[l]?.question?"#16a34a":GRAY,border:"1px solid #e5e7eb"}}>{l.toUpperCase()}</span>)}
            </div>
            <strong style={{flex:1,fontSize:14}}>{f.i18n.en.question || f.i18n.hy.question || f.i18n.ru.question}</strong>
            <span style={S.pill(f.active)} onClick={()=>toggle(f.id)}>{f.active?"Active":"Hidden"}</span>
            <div style={S.row}>
              <button style={S.btn("secondary sm")} onClick={()=>openEdit(f)}>Edit</button>
              <button style={S.btn("danger sm")} onClick={()=>setConfirm(f.id)}>Delete</button>
            </div>
          </div>
          {LANGS.filter(l=>f.i18n[l]?.answer).map(l=>(
            <div key={l} style={{fontSize:12,color:GRAY,marginTop:4}}>
              <span style={{fontWeight:700,color:BLUE,marginRight:6}}>{l.toUpperCase()}:</span>
              {f.i18n[l].answer.slice(0,120)}{f.i18n[l].answer.length>120?"…":""}
            </div>
          ))}
        </div>
      ))}
      {rows.length===0 && <p style={{color:GRAY,textAlign:"center",padding:40}}>No FAQ items.</p>}

      {form!==null && (
        <div style={S.overlay} onClick={()=>setForm(null)}>
          <div style={S.modal(660)} onClick={e=>e.stopPropagation()}>
            <div style={S.mHead}><h3 style={{margin:0}}>{editing?"Edit FAQ":"Add FAQ"}</h3><button style={S.xBtn} onClick={()=>setForm(null)}>✕</button></div>
            <div style={S.mBody}>
              <LangTabs lang={editLang} setLang={setEditLang}/>
              <div style={S.langBox}>
                <div style={{fontWeight:700,color:BLUE,marginBottom:12,fontSize:13}}>{LANG_LABELS[editLang]}</div>
                <Field label={`Question${editLang==="en"?" *":""}`}>
                  <input style={S.input} value={form.i18n[editLang].question} onChange={e=>setI18n(editLang,"question",e.target.value)}/>
                </Field>
                <Field label="Answer">
                  <textarea style={{...S.input,height:130,resize:"vertical"}} value={form.i18n[editLang].answer} onChange={e=>setI18n(editLang,"answer",e.target.value)}/>
                </Field>
              </div>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                <input type="checkbox" checked={!!form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))}/> Active
              </label>
            </div>
            <div style={S.mFoot}><button style={S.btn("ghost")} onClick={()=>setForm(null)}>Cancel</button><button style={S.btn("primary")} onClick={save}>Save FAQ</button></div>
          </div>
        </div>
      )}
      {confirm && <Confirm msg="Delete this FAQ?" onOk={del} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ─── PRICES ────────────────────────────────────────────────────────────────────
function PricesMgr({ data, setData, toast }) {
  const [form,    setForm]    = useState(null);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [search,  setSearch]  = useState("");
  const [catFilt, setCatFilt] = useState("all");
  const [lang,    setLang]    = useState("en");
  const [viewLang,setViewLang]= useState("en");

  const emptyForm = () => ({
    active:true,
    i18n:{ en:{categoryTitle:"",sectionTitle:"",name:"",price:""}, hy:{categoryTitle:"",sectionTitle:"",name:"",price:""}, ru:{categoryTitle:"",sectionTitle:"",name:"",price:""} },
  });

  const openNew  = () => { setForm(emptyForm()); setEditing(null); setLang("en"); };
  const openEdit = p => { setForm(JSON.parse(JSON.stringify(p))); setEditing(p.id); setLang("en"); };
  const setI18n  = (l, field, val) => setForm(f=>({...f,i18n:{...f.i18n,[l]:{...f.i18n[l],[field]:val}}}));

  const save = () => {
    if (!form.i18n.en.name.trim() || !form.i18n.en.price.trim()) { toast("English name & price required","error"); return; }
    if (editing) { setData(p=>({...p,prices:p.prices.map(pr=>pr.id===editing?{...pr,...form}:pr)})); toast("Price updated"); }
    else         { setData(p=>({...p,prices:[...p.prices,{...form,id:uid()}]})); toast("Price added"); }
    setForm(null);
  };
  const toggle = id => { setData(p=>({...p,prices:p.prices.map(pr=>pr.id===id?{...pr,active:!pr.active}:pr)})); toast("Status updated"); };
  const del    = ()  => { setData(p=>({...p,prices:p.prices.filter(pr=>pr.id!==confirm)})); toast("Deleted","warning"); setConfirm(null); };

  const cats = [...new Set(data.prices.map(p=>p.i18n.en.categoryTitle))];
  const rows = data.prices
    .filter(p=>catFilt==="all"||p.i18n.en.categoryTitle===catFilt)
    .filter(p=>p.i18n.en.name.toLowerCase().includes(search.toLowerCase())||p.i18n[viewLang]?.name.toLowerCase().includes(search.toLowerCase()));

  const grouped = rows.reduce((acc,p)=>{
    const cat = p.i18n[viewLang]?.categoryTitle || p.i18n.en.categoryTitle;
    const sec = p.i18n[viewLang]?.sectionTitle  || p.i18n.en.sectionTitle;
    if(!acc[cat])acc[cat]={};
    if(!acc[cat][sec])acc[cat][sec]=[];
    acc[cat][sec].push(p); return acc;
  },{});

  return (
    <div>
      <div style={S.ph}>
        <div><h1 style={S.pt}>Prices</h1><p style={S.ps}>{data.prices.length} items</p></div>
        <div style={S.row}>
          <div style={{display:"flex",gap:4,padding:4,background:"#f0f0f5",borderRadius:8}}>
            {LANGS.map(l=><button key={l} style={S.langTab(viewLang===l)} onClick={()=>setViewLang(l)}>{l.toUpperCase()}</button>)}
          </div>
          <button style={S.btn("green")} onClick={openNew}>+ Add Price</button>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        {["all",...cats].map(c=><button key={c} style={{...S.btn(catFilt===c?"primary":"ghost"),padding:"6px 12px",fontSize:13}} onClick={()=>setCatFilt(c)}>{c==="all"?"All":c}</button>)}
      </div>
      <input style={{...S.input,maxWidth:360,marginBottom:16}} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>

      {Object.entries(grouped).map(([cat,sections])=>(
        <div key={cat} style={{marginBottom:28}}>
          <h3 style={{fontSize:17,fontWeight:700,color:BLUE,margin:"0 0 12px",paddingBottom:8,borderBottom:`2px solid ${GREEN}`}}>{cat}</h3>
          {Object.entries(sections).map(([sec,items])=>(
            <div key={sec} style={{marginBottom:16}}>
              {sec&&<h4 style={{fontSize:13,fontWeight:700,color:GRAY,textTransform:"uppercase",letterSpacing:".05em",margin:"0 0 8px"}}>{sec}</h4>}
              <div style={S.tWrap}><table style={S.table}>
                <thead><tr>{["Service","Price","Status","Actions"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>{items.map((p,i)=>(
                  <tr key={p.id} style={S.trBg(i)}>
                    <td style={{...S.td,maxWidth:320}}>{p.i18n[viewLang]?.name||p.i18n.en.name}</td>
                    <td style={{...S.td,whiteSpace:"nowrap"}}><strong style={{color:BLUE}}>{p.i18n[viewLang]?.price||p.i18n.en.price}</strong></td>
                    <td style={S.td}><span style={S.pill(p.active)} onClick={()=>toggle(p.id)}>{p.active?"Active":"Hidden"}</span></td>
                    <td style={S.td}><div style={S.row}><button style={S.btn("secondary sm")} onClick={()=>openEdit(p)}>Edit</button><button style={S.btn("danger sm")} onClick={()=>setConfirm(p.id)}>Delete</button></div></td>
                  </tr>
                ))}</tbody>
              </table></div>
            </div>
          ))}
        </div>
      ))}
      {rows.length===0&&<p style={{color:GRAY,textAlign:"center",padding:40}}>No items found.</p>}

      {form!==null && (
        <div style={S.overlay} onClick={()=>setForm(null)}>
          <div style={S.modal(680)} onClick={e=>e.stopPropagation()}>
            <div style={S.mHead}><h3 style={{margin:0}}>{editing?"Edit":"Add"} Price</h3><button style={S.xBtn} onClick={()=>setForm(null)}>✕</button></div>
            <div style={S.mBody}>
              <LangTabs lang={lang} setLang={setLang}/>
              <div style={S.langBox}>
                <div style={{fontWeight:700,color:BLUE,marginBottom:12,fontSize:13}}>{LANG_LABELS[lang]}</div>
                <Field label={`Category${lang==="en"?" *":""}`}>
                  <input style={S.input} value={form.i18n[lang].categoryTitle} onChange={e=>setI18n(lang,"categoryTitle",e.target.value)}/>
                </Field>
                <Field label="Section">
                  <input style={S.input} value={form.i18n[lang].sectionTitle} onChange={e=>setI18n(lang,"sectionTitle",e.target.value)}/>
                </Field>
                <Field label={`Service Name${lang==="en"?" *":""}`}>
                  <textarea style={{...S.input,height:80,resize:"vertical"}} value={form.i18n[lang].name} onChange={e=>setI18n(lang,"name",e.target.value)}/>
                </Field>
                <Field label={`Price${lang==="en"?" *":""} (e.g. 40,000 AMD)`}>
                  <input style={S.input} value={form.i18n[lang].price} onChange={e=>setI18n(lang,"price",e.target.value)}/>
                </Field>
              </div>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                <input type="checkbox" checked={!!form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))}/> Active / Visible
              </label>
            </div>
            <div style={S.mFoot}><button style={S.btn("ghost")} onClick={()=>setForm(null)}>Cancel</button><button style={S.btn("primary")} onClick={save}>Save Price</button></div>
          </div>
        </div>
      )}
      {confirm && <Confirm msg="Delete this price item?" onOk={del} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ─── SITE INFO ─────────────────────────────────────────────────────────────────
function SiteInfoMgr({ data, setData, toast }) {
  const [info,  setInfo]  = useState({...data.siteInfo});
  const [stats, setStats] = useState({...data.stats});
  return (
    <div>
      <div style={S.ph}><h1 style={S.pt}>Site Information</h1></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <div style={S.card}>
          <h3 style={S.cTitle}>Contact Details</h3>
          {[["phone","Phone 1"],["phone2","Phone 2"],["email","Email"],["address","Address"]].map(([k,l])=>(
            <Field key={k} label={l}><input style={S.input} value={info[k]||""} onChange={e=>setInfo(p=>({...p,[k]:e.target.value}))}/></Field>
          ))}
          <h4 style={{color:BLUE,margin:"18px 0 12px",fontWeight:700}}>Social Links</h4>
          {[["instagram","Instagram"],["facebook","Facebook"],["linkedin","LinkedIn"],["youtube","YouTube"]].map(([k,l])=>(
            <Field key={k} label={l}><input style={S.input} value={info[k]||""} onChange={e=>setInfo(p=>({...p,[k]:e.target.value}))}/></Field>
          ))}
          <button style={S.btn("primary")} onClick={()=>{setData(p=>({...p,siteInfo:{...info}}));toast("Contact info saved");}}>Save</button>
        </div>
        <div style={S.card}>
          <h3 style={S.cTitle}>Clinic Statistics</h3>
          <p style={{fontSize:13,color:GRAY,marginBottom:16}}>Shown in the homepage Results section.</p>
          {[["pregnancies","Registered Pregnancies"],["patients","Treated Patients"],["surgeries","Surgeries per Year"],["countries","Countries"]].map(([k,l])=>(
            <Field key={k} label={l}><input style={S.input} type="number" value={stats[k]||0} onChange={e=>setStats(p=>({...p,[k]:+e.target.value}))}/></Field>
          ))}
          <button style={S.btn("primary")} onClick={()=>{setData(p=>({...p,stats:{...stats}}));toast("Statistics saved");}}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── USERS ─────────────────────────────────────────────────────────────────────
function UsersMgr({ users, setUsers, toast, currentUser }) {
  const [form,    setForm]    = useState(null);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const openNew  = () => { setForm({name:"",email:"",role:"editor",active:true}); setEditing(null); };
  const openEdit = u => { setForm({...u}); setEditing(u.id); };
  const save = () => {
    if(!form.name.trim()||!form.email.trim()){toast("Name and email required","error");return;}
    if(editing){setUsers(p=>p.map(u=>u.id===editing?{...u,...form}:u));toast("User updated");}
    else       {setUsers(p=>[...p,{...form,id:uid(),createdAt:new Date().toISOString().slice(0,10)}]);toast("User added");}
    setForm(null);
  };
  const toggle = id => {
    if(id===currentUser.id){toast("Cannot deactivate your own account","error");return;}
    setUsers(p=>p.map(u=>u.id===id?{...u,active:!u.active}:u));toast("Status updated");
  };
  const del = () => {
    if(confirm===currentUser.id){toast("Cannot delete your own account","error");setConfirm(null);return;}
    setUsers(p=>p.filter(u=>u.id!==confirm));toast("User deleted","warning");setConfirm(null);
  };

  return (
    <div>
      <div style={S.ph}><div><h1 style={S.pt}>Users</h1><p style={S.ps}>{users.length} accounts</p></div><button style={S.btn("green")} onClick={openNew}>+ Add User</button></div>
      <div style={S.tWrap}><table style={S.table}>
        <thead><tr>{["Name","Email","Role","Status","Created","Actions"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>{users.map((u,i)=>(
          <tr key={u.id} style={S.trBg(i)}>
            <td style={S.td}><div style={S.row}><div style={S.avatar(ROLES[u.role]?.color||GRAY)}>{u.name[0]}</div><div><div style={{fontWeight:600}}>{u.name}</div>{u.id===currentUser.id&&<div style={{fontSize:11,color:GREEN}}>● You</div>}</div></div></td>
            <td style={S.td}>{u.email}</td>
            <td style={S.td}><span style={S.badge(ROLES[u.role]?.color||GRAY)}>{ROLES[u.role]?.label}</span></td>
            <td style={S.td}><span style={S.pill(u.active)} onClick={()=>toggle(u.id)}>{u.active?"Active":"Inactive"}</span></td>
            <td style={{...S.td,color:GRAY,whiteSpace:"nowrap"}}>{u.createdAt||"—"}</td>
            <td style={S.td}><div style={S.row}><button style={S.btn("secondary sm")} onClick={()=>openEdit(u)}>Edit</button><button style={S.btn("danger sm")} disabled={u.id===currentUser.id} onClick={()=>setConfirm(u.id)}>Delete</button></div></td>
          </tr>
        ))}</tbody>
      </table></div>
      <div style={S.card}>
        <h3 style={S.cTitle}>Role Permissions</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {Object.entries(ROLES).map(([key,role])=>(
            <div key={key} style={{border:`1px solid ${role.color}44`,borderRadius:8,padding:16}}>
              <span style={{...S.badge(role.color),marginBottom:10,display:"inline-block"}}>{role.label}</span>
              <ul style={{margin:0,paddingLeft:18,fontSize:13,color:"#374151"}}>{role.pages.map(p=><li key={p}>{p}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      {form!==null && (
        <div style={S.overlay} onClick={()=>setForm(null)}>
          <div style={S.modal()} onClick={e=>e.stopPropagation()}>
            <div style={S.mHead}><h3 style={{margin:0}}>{editing?"Edit User":"Add User"}</h3><button style={S.xBtn} onClick={()=>setForm(null)}>✕</button></div>
            <div style={S.mBody}>
              <Field label="Full Name *"><input style={S.input} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></Field>
              <Field label="Email *"><input style={S.input} type="email" value={form.email||""} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></Field>
              <Field label="Role"><select style={S.input} value={form.role||"editor"} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>{Object.entries(ROLES).map(([k,r])=><option key={k} value={k}>{r.label}</option>)}</select></Field>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}><input type="checkbox" checked={!!form.active} onChange={e=>setForm(p=>({...p,active:e.target.checked}))}/> Active</label>
            </div>
            <div style={S.mFoot}><button style={S.btn("ghost")} onClick={()=>setForm(null)}>Cancel</button><button style={S.btn("primary")} onClick={save}>Save</button></div>
          </div>
        </div>
      )}
      {confirm && <Confirm msg="Delete this user?" onOk={del} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ─── SETTINGS ──────────────────────────────────────────────────────────────────
function SettingsMgr({ toast }) {
  return (
    <div>
      <div style={S.ph}><h1 style={S.pt}>Settings</h1></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <div style={S.card}>
          <h3 style={S.cTitle}>General</h3>
          {[["Site Name","Fanarjyan Clinic"],["Admin Email","fanarjyanclinic@gmail.com"],["Timezone","Asia/Yerevan"]].map(([l,v])=>(
            <Field key={l} label={l}><input style={S.input} defaultValue={v}/></Field>
          ))}
          <button style={S.btn("primary")} onClick={()=>toast("Settings saved")}>Save Settings</button>
        </div>
        <div style={S.card}>
          <h3 style={S.cTitle}>EmailJS Configuration</h3>
          <p style={{fontSize:13,color:GRAY,marginBottom:14}}>Used by the contact form on the website.</p>
          {[["Service ID","service_8gxyu3i"],["Template ID","template_zopip0z"],["Public Key","lJRqhRvZ…"]].map(([l,v])=>(
            <Field key={l} label={l}><input style={S.input} type="password" defaultValue={v}/></Field>
          ))}
          <button style={S.btn("primary")} onClick={()=>toast("EmailJS config saved")}>Save Config</button>
        </div>
        <div style={S.card}>
          <h3 style={S.cTitle}>Data Export</h3>
          <p style={{fontSize:13,color:GRAY,marginBottom:14}}>Download data files for backup or backend sync.</p>
          {["staff.json","services.en.json","blog.json","faq.en.json","faq.hy.json","faq.ru.json","prices.en.json","prices.hy.json","prices.ru.json"].map(f=>(
            <div key={f} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:LIGHT,borderRadius:6,border:"1px solid #e5e7eb",marginBottom:8}}>
              <span style={{fontFamily:"monospace",fontSize:13}}>{f}</span>
              <button style={S.btn("secondary sm")} onClick={()=>toast(`Exported ${f}`)}>Export</button>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <h3 style={S.cTitle}>Danger Zone</h3>
          <p style={{fontSize:13,color:GRAY,marginBottom:14}}>Irreversible — use with caution.</p>
          <button style={{...S.btn("danger"),width:"100%",justifyContent:"center",marginBottom:10}} onClick={()=>toast("Cache cleared","warning")}>Clear Cache</button>
          <button style={{...S.btn("danger"),width:"100%",justifyContent:"center",opacity:.4}} disabled>Reset to Defaults</button>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [user,      setUser]   = useState(null);
  const [page,      setPage]   = useState("dashboard");
  const [collapsed, setCol]    = useState(false);
  const [toasts,    setToasts] = useState([]);
  const [users,     setUsers]  = useState(DEMO_USERS);

  const [data, setData] = useState(() => ({
    staff:    buildStaff(),
    services: buildServices(),
    blog:     buildBlog(),
    faq:      buildFaq(),
    prices:   buildPrices(),
    siteInfo: INITIAL_SITE,
    stats:    INITIAL_STATS,
  }));

  const toast = useCallback((msg, type="success") => {
    const id = uid();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)), 3000);
  }, []);

  if (!user) {
    return (
      <>
        <Login onLogin={u=>{ setUser(u); toast(`Welcome back, ${u.name}!`); }}/>
        <Toast toasts={toasts}/>
      </>
    );
  }

  const allowed  = ROLES[user.role].pages;
  const safePage = allowed.includes(page) ? page : "dashboard";

  const pages = {
    dashboard: <Dashboard   data={data} user={user}/>,
    staff:     <StaffMgr    data={data} setData={setData} toast={toast}/>,
    services:  <ServicesMgr data={data} setData={setData} toast={toast}/>,
    blog:      <BlogMgr     data={data} setData={setData} toast={toast}/>,
    faq:       <FaqMgr      data={data} setData={setData} toast={toast}/>,
    prices:    <PricesMgr   data={data} setData={setData} toast={toast}/>,
    siteinfo:  <SiteInfoMgr data={data} setData={setData} toast={toast}/>,
    users:     <UsersMgr    users={users} setUsers={setUsers} toast={toast} currentUser={user}/>,
    settings:  <SettingsMgr toast={toast}/>,
  };

  return (
    <div style={S.wrap}>
      <Sidebar
        page={safePage} setPage={p=>{ if(allowed.includes(p)) setPage(p); }}
        user={user} onLogout={()=>{ setUser(null); setPage("dashboard"); }}
        collapsed={collapsed} setCollapsed={setCol}
      />
      <main style={S.main}>
        <div style={S.content}>{pages[safePage]}</div>
      </main>
      <Toast toasts={toasts}/>
    </div>
  );
}
