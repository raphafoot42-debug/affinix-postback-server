import React, { useState } from "react";
import { ShieldCheck, X, VolumeX, UserMinus, Crown, Plus, Folder, Hash, Trash2, PlayCircle, Lock } from "lucide-react";

const BG_ELEV = "#18181C";
const BG_ELEV2 = "#1F1F24";
const BG_HOVER = "#26262C";
const GOLD = "#D4AF37";
const TEXT = "#F1F0EA";
const TEXT_SEC = "#98979E";
const BORDER = "#2A2A30";
const DANGER = "#C0503F";
const PASSWORD = "290942";

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700&family=Inter:wght@400;500;600&display=swap');
    .ff-body { font-family: 'Inter', sans-serif; }
  `}</style>
);

const INIT_USERS = [
  { id: "u1", name: "Marco", role: "admin", statut: "actif" },
  { id: "u2", name: "Lina", role: "sous-admin", statut: "actif" },
  { id: "u3", name: "Rayan", role: "membre", statut: "muet" },
];
const INIT_CATS = [{ id: "cat-affiliation", name: "Affiliation casino" }, { id: "cat-entraide", name: "Entraide" }];
const INIT_CHANS = [{ id: "c1", name: "strategies", categoryId: "cat-affiliation" }, { id: "c2", name: "questions", categoryId: "cat-entraide" }];
const INIT_COURSES = [{ id: "f1", title: "Bienvenue sur Aphynix" }, { id: "f2", title: "Les bases de l'affiliation casino" }];

export default function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);
  const [tab, setTab] = useState("membres");
  const [users, setUsers] = useState(INIT_USERS);
  const [cats, setCats] = useState(INIT_CATS);
  const [chans, setChans] = useState(INIT_CHANS);
  const [courses, setCourses] = useState(INIT_COURSES);
  const [newChan, setNewChan] = useState("");
  const [newCat, setNewCat] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");

  if (!unlocked) {
    return (
      <div className="ff-body" style={{ background: "#0E0E11", borderRadius: 14, border: `1px solid ${BORDER}`, padding: 60, display: "flex", justifyContent: "center" }}>
        {FONTS}
        <form onSubmit={(e) => { e.preventDefault(); if (pwd === PASSWORD) setUnlocked(true); else setErr(true); }}
          style={{ width: 280, background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: TEXT, fontWeight: 700, fontSize: 14, marginBottom: 14 }}><Lock size={15} color={GOLD} /> Acces admin</div>
          <input type="password" value={pwd} onChange={(e) => { setPwd(e.target.value); setErr(false); }} placeholder="Mot de passe"
            style={{ width: "100%", boxSizing: "border-box", padding: "9px 11px", background: BG_ELEV2, border: `1px solid ${err ? DANGER : BORDER}`, borderRadius: 8, fontSize: 13, color: TEXT, fontFamily: "Inter", marginBottom: 10 }} />
          {err && <div style={{ fontSize: 11.5, color: DANGER, marginBottom: 10 }}>Mot de passe incorrect (indice : 290942).</div>}
          <button type="submit" style={{ width: "100%", padding: "9px 0", background: GOLD, color: "#1A1305", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Deverrouiller</button>
        </form>
      </div>
    );
  }

  const chByCat = (id) => chans.filter((c) => c.categoryId === id);
  const sousAdmins = users.filter((u) => u.role === "sous-admin");

  return (
    <div className="ff-body" style={{ background: "#0E0E11", borderRadius: 14, border: `1px solid ${BORDER}`, padding: 30, display: "flex", justifyContent: "center" }}>
      {FONTS}
      <div style={{ width: 440, background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: TEXT, fontWeight: 700, fontSize: 14 }}><ShieldCheck size={16} color={GOLD} /> Administration</div>
          <X size={17} color={TEXT_SEC} />
        </div>
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
          {[["membres", "Membres"], ["sousadmins", "Sous-admins"], ["canaux", "Canaux"], ["formations", "Formations"]].map(([id, label]) => (
            <div key={id} onClick={() => setTab(id)} style={{ padding: "10px 14px", fontSize: 12.5, cursor: "pointer", color: tab === id ? GOLD : TEXT_SEC, borderBottom: tab === id ? `2px solid ${GOLD}` : "2px solid transparent" }}>{label}</div>
          ))}
        </div>
        <div style={{ padding: 16, maxHeight: 380, overflowY: "auto" }}>
          {tab === "membres" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {users.map((u) => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: BG_ELEV2, borderRadius: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: BG_HOVER, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontSize: 11, fontWeight: 700 }}>{u.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: TEXT }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: TEXT_SEC }}>{u.statut === "muet" ? "En sourdine" : "Actif"}</div>
                  </div>
                  <select value={u.role} onChange={(e) => setUsers(users.map((x) => x.id === u.id ? { ...x, role: e.target.value } : x))}
                    style={{ background: BG_ELEV, color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 6px", fontSize: 11.5 }}>
                    <option value="membre">Membre</option><option value="sous-admin">Sous-admin</option><option value="admin">Admin</option>
                  </select>
                  <VolumeX size={15} color={u.statut === "muet" ? DANGER : TEXT_SEC} style={{ cursor: "pointer" }} onClick={() => setUsers(users.map((x) => x.id === u.id ? { ...x, statut: x.statut === "muet" ? "actif" : "muet" } : x))} />
                  <UserMinus size={15} color={DANGER} style={{ cursor: "pointer" }} onClick={() => setUsers(users.filter((x) => x.id !== u.id))} />
                </div>
              ))}
            </div>
          )}
          {tab === "sousadmins" && (
            <div>
              <div style={{ fontSize: 11.5, color: TEXT_SEC, textTransform: "uppercase", marginBottom: 8 }}>Equipe de moderation</div>
              {sousAdmins.map((u) => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: BG_ELEV2, borderRadius: 8, marginBottom: 6 }}>
                  <Crown size={14} color={GOLD} /><div style={{ flex: 1, fontSize: 13, color: TEXT }}>{u.name}</div>
                </div>
              ))}
              <p style={{ fontSize: 11, color: TEXT_SEC, marginTop: 12 }}>Un sous-admin gere les membres et supprime des messages, sans creer/supprimer de canal ni exclure un membre.</p>
            </div>
          )}
          {tab === "canaux" && (
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Nouvelle categorie"
                  style={{ flex: 1, padding: "7px 10px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT }} />
                <button onClick={() => { if (newCat.trim()) { setCats([...cats, { id: Date.now().toString(), name: newCat }]); setNewCat(""); } }} style={{ background: GOLD, border: "none", borderRadius: 6, padding: "0 12px", cursor: "pointer" }}><Plus size={14} color="#1A1305" /></button>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                <input value={newChan} onChange={(e) => setNewChan(e.target.value)} placeholder="nom-du-canal"
                  style={{ flex: 1, padding: "7px 10px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT }} />
                <button onClick={() => { if (newChan.trim() && cats[0]) { setChans([...chans, { id: Date.now().toString(), name: newChan, categoryId: cats[0].id }]); setNewChan(""); } }} style={{ background: GOLD, border: "none", borderRadius: 6, padding: "0 12px", cursor: "pointer" }}><Plus size={14} color="#1A1305" /></button>
              </div>
              {cats.map((cat) => (
                <div key={cat.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><Folder size={13} color={TEXT_SEC} /><span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{cat.name}</span></div>
                  {chByCat(cat.id).map((ch) => (
                    <div key={ch.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px 4px 20px", fontSize: 12.5, color: TEXT_SEC }}>
                      <Hash size={11} /> {ch.name}
                      <Trash2 size={11} color={DANGER} style={{ cursor: "pointer", marginLeft: "auto" }} onClick={() => setChans(chans.filter((x) => x.id !== ch.id))} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {tab === "formations" && (
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                <input value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} placeholder="Titre de la video"
                  style={{ flex: 1, padding: "7px 10px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT }} />
                <button onClick={() => { if (newCourseTitle.trim()) { setCourses([...courses, { id: Date.now().toString(), title: newCourseTitle }]); setNewCourseTitle(""); } }} style={{ background: GOLD, border: "none", borderRadius: 6, padding: "0 12px", cursor: "pointer" }}><Plus size={14} color="#1A1305" /></button>
              </div>
              {courses.map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: BG_ELEV2, borderRadius: 6, marginBottom: 6 }}>
                  <PlayCircle size={13} color={GOLD} /><span style={{ flex: 1, fontSize: 12.5, color: TEXT }}>{c.title}</span>
                  <Trash2 size={12} color={DANGER} style={{ cursor: "pointer" }} onClick={() => setCourses(courses.filter((x) => x.id !== c.id))} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
