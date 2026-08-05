import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare, GraduationCap, Send, Plus, Trash2, ChevronDown, ChevronRight,
  Hash, Settings, X, Loader2, ShieldCheck, VolumeX, UserMinus, Folder, LogIn,
  Lock, MoreHorizontal, Link as LinkIcon, Copy, PlayCircle, ArrowLeft, Crown, Upload
} from "lucide-react";

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Manrope', sans-serif; }
    .ff-body { font-family: 'Inter', sans-serif; }
    .ff-mono { font-family: 'IBM Plex Mono', monospace; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-thumb { background: #2E2E33; border-radius: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
  `}</style>
);

const BG = "#0E0E11";
const BG_ELEV = "#18181C";
const BG_ELEV2 = "#1F1F24";
const BG_HOVER = "#26262C";
const GOLD = "#D4AF37";
const GOLD_DIM = "#8C7A2E";
const GOLD_BG = "rgba(212,175,55,0.12)";
const TEXT = "#F1F0EA";
const TEXT_SEC = "#98979E";
const BORDER = "#2A2A30";
const DANGER = "#C0503F";
const ADMIN_PASSWORD = "290942";

const DEFAULT_CATEGORIES = [
  { id: "cat-general", name: "General" },
  { id: "cat-affiliation", name: "Affiliation casino" },
  { id: "cat-entraide", name: "Entraide" },
  { id: "cat-detente", name: "Off-topic" },
];

const DEFAULT_CHANNELS = [
  { id: "annonces", name: "annonces", categoryId: "cat-general" },
  { id: "presentation", name: "presentation", categoryId: "cat-general" },
  { id: "strategies", name: "strategies", categoryId: "cat-affiliation" },
  { id: "outils-trackers", name: "outils-trackers", categoryId: "cat-affiliation" },
  { id: "questions", name: "questions", categoryId: "cat-entraide" },
  { id: "ressources", name: "ressources", categoryId: "cat-entraide" },
  { id: "detente", name: "detente", categoryId: "cat-detente" },
];

const DEFAULT_COURSES = [
  { id: "c1", title: "Bienvenue sur Aphynix", description: "Comment fonctionne la formation et la communaute.", duree: "20 min", videoName: "", links: [] },
  { id: "c2", title: "Les bases de l'affiliation casino", description: "Vocabulaire, fonctionnement des programmes, premiers pas.", duree: "1h", videoName: "", links: [] },
];

function uid() { return Math.random().toString(36).slice(2, 10); }

async function sGet(key, shared) {
  try { const r = await window.storage.get(key, shared); return r ? JSON.parse(r.value) : null; }
  catch (e) { return null; }
}
async function sSet(key, value, shared) {
  try { await window.storage.set(key, JSON.stringify(value), shared); return true; }
  catch (e) { return false; }
}

export default function Aphynix() {
  const [loading, setLoading] = useState(true);
  const [profil, setProfil] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [saving, setSaving] = useState(false);

  const [view, setView] = useState("discussion");
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [channels, setChannels] = useState(DEFAULT_CHANNELS);
  const [collapsed, setCollapsed] = useState({});
  const [activeChannel, setActiveChannel] = useState("annonces");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", description: "", duree: "", links: [{ label: "", url: "" }] });
  const [newVideoFile, setNewVideoFile] = useState(null);
  const [videoPreviews, setVideoPreviews] = useState({});

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [adminTab, setAdminTab] = useState("membres");
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelCat, setNewChannelCat] = useState("cat-general");
  const [newCatName, setNewCatName] = useState("");
  const [promoteTarget, setPromoteTarget] = useState("");

  const [inviteCode, setInviteCode] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [serverDescription, setServerDescription] = useState("Communaute et formation dediee a l'affiliation casino. Entraide, strategies et ressources pour progresser ensemble.");
  const [editingDesc, setEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState("");

  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => {
      const p = await sGet("profil", false);
      const u = await sGet("users", true);
      const cats = await sGet("categories", true);
      const chans = await sGet("channels", true);
      const co = await sGet("courses", true);
      let inv = await sGet("invite-code", true);
      if (!inv) { inv = uid(); await sSet("invite-code", inv, true); }
      const desc = await sGet("server-description", true);
      if (u) setUsers(u);
      if (cats) setCategories(cats);
      if (chans) setChannels(chans);
      if (co) setCourses(co);
      if (p) setProfil(p);
      if (desc) setServerDescription(desc);
      setInviteCode(inv);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!profil) return;
    (async () => {
      const msgs = await sGet(`messages:${activeChannel}`, true);
      setMessages(msgs || []);
    })();
  }, [activeChannel, profil]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;
    setSaving(true);
    const existingUsers = (await sGet("users", true)) || [];
    const isFirst = existingUsers.length === 0;
    const newProfil = { name: nameInput.trim(), email: emailInput.trim() };
    const newUser = {
      id: uid(), name: newProfil.name, email: newProfil.email,
      role: isFirst ? "admin" : "membre", statut: "actif",
    };
    const updatedUsers = [...existingUsers, newUser];
    await sSet("users", updatedUsers, true);
    await sSet("profil", newProfil, false);
    if (!(await sGet("categories", true))) await sSet("categories", DEFAULT_CATEGORIES, true);
    if (!(await sGet("channels", true))) await sSet("channels", DEFAULT_CHANNELS, true);
    if (!(await sGet("courses", true))) await sSet("courses", DEFAULT_COURSES, true);
    setUsers(updatedUsers);
    setProfil(newProfil);
    setSaving(false);
  };

  const currentUser = users.find((u) => profil && u.email === profil.email);
  const role = currentUser?.role || "membre";
  const isAdmin = role === "admin";
  const isModo = role === "admin" || role === "sous-admin";
  const isMuted = currentUser?.statut === "muet";

  const sendMessage = async () => {
    if (!messageInput.trim() || !profil || isMuted) return;
    const msg = { id: uid(), author: profil.name, authorRole: role, text: messageInput.trim(), ts: Date.now() };
    const updated = [...messages, msg];
    setMessages(updated);
    setMessageInput("");
    await sSet(`messages:${activeChannel}`, updated, true);
  };
  const deleteMessage = async (msgId) => {
    const updated = messages.filter((m) => m.id !== msgId);
    setMessages(updated);
    await sSet(`messages:${activeChannel}`, updated, true);
  };

  const setUserRole = async (userId, newRole) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setUsers(updated);
    await sSet("users", updated, true);
  };
  const toggleMute = async (userId) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, statut: u.statut === "muet" ? "actif" : "muet" } : u));
    setUsers(updated);
    await sSet("users", updated, true);
  };
  const removeMember = async (userId) => {
    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    await sSet("users", updated, true);
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const updated = [...categories, { id: uid(), name: newCatName.trim() }];
    setCategories(updated);
    await sSet("categories", updated, true);
    setNewCatName("");
  };
  const addChannel = async () => {
    if (!newChannelName.trim()) return;
    const updated = [...channels, { id: uid(), name: newChannelName.trim().toLowerCase().replace(/\s+/g, "-"), categoryId: newChannelCat }];
    setChannels(updated);
    await sSet("channels", updated, true);
    setNewChannelName("");
  };
  const removeChannel = async (id) => {
    const updated = channels.filter((c) => c.id !== id);
    setChannels(updated);
    await sSet("channels", updated, true);
  };
  const removeCategory = async (id) => {
    const updatedCats = categories.filter((c) => c.id !== id);
    const updatedChans = channels.filter((c) => c.categoryId !== id);
    setCategories(updatedCats);
    setChannels(updatedChans);
    await sSet("categories", updatedCats, true);
    await sSet("channels", updatedChans, true);
  };

  const addCourse = async () => {
    if (!newCourse.title.trim()) return;
    const id = uid();
    const cleanLinks = newCourse.links
      .filter((l) => l.label.trim() || l.url.trim())
      .map((l) => ({ id: uid(), label: l.label.trim() || l.url.trim(), url: l.url.trim() }));
    const course = { id, title: newCourse.title, description: newCourse.description, duree: newCourse.duree, links: cleanLinks, videoName: newVideoFile ? newVideoFile.name : "" };
    const updated = [...courses, course];
    setCourses(updated);
    await sSet("courses", updated, true);
    if (newVideoFile) setVideoPreviews((v) => ({ ...v, [id]: URL.createObjectURL(newVideoFile) }));
    setNewCourse({ title: "", description: "", duree: "", links: [{ label: "", url: "" }] });
    setNewVideoFile(null);
    setShowAddCourse(false);
  };
  const updateLinkField = (idx, field, value) => {
    setNewCourse((c) => {
      const links = [...c.links];
      links[idx] = { ...links[idx], [field]: value };
      return { ...c, links };
    });
  };
  const addLinkRow = () => setNewCourse((c) => ({ ...c, links: [...c.links, { label: "", url: "" }] }));
  const removeLinkRow = (idx) => setNewCourse((c) => ({ ...c, links: c.links.filter((_, i) => i !== idx) }));
  const removeCourse = async (id) => {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    await sSet("courses", updated, true);
  };

  const openAdmin = () => {
    if (adminUnlocked) setAdminOpen(true);
    else { setPasswordPrompt(true); setPasswordInput(""); setPasswordError(false); }
  };
  const submitPassword = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setPasswordPrompt(false);
      setAdminOpen(true);
    } else {
      setPasswordError(true);
    }
  };

  const copyInvite = async () => {
    const link = `aphynix.app/invite/${inviteCode}`;
    try { await navigator.clipboard.writeText(link); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const saveDescription = async () => {
    setServerDescription(descDraft);
    await sSet("server-description", descDraft, true);
    setEditingDesc(false);
  };

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, background: BG }}><Loader2 className="animate-spin" color={GOLD} size={26} /></div>;
  }

  if (!profil) {
    return (
      <div className="ff-body" style={{ minHeight: 500, background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        {FONTS}
        <form onSubmit={handleRegister} style={{ background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "40px 36px", width: 380 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: GOLD_BG, border: `1px solid ${GOLD_DIM}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
            <span className="ff-display" style={{ color: GOLD, fontSize: 19, fontWeight: 800 }}>A</span>
          </div>
          <h1 className="ff-display" style={{ fontSize: 24, fontWeight: 800, color: TEXT, margin: "0 0 6px" }}>Aphynix</h1>
          <p style={{ color: TEXT_SEC, fontSize: 14, margin: "0 0 28px" }}>Formation et communaute affiliation casino. Rejoignez le serveur.</p>
          <label style={{ fontSize: 11, color: TEXT_SEC, textTransform: "uppercase", letterSpacing: 0.6 }}>Nom / pseudo</label>
          <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Votre pseudo"
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", margin: "6px 0 18px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, color: TEXT, fontFamily: "Inter" }} />
          <label style={{ fontSize: 11, color: TEXT_SEC, textTransform: "uppercase", letterSpacing: 0.6 }}>Email</label>
          <input value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="vous@exemple.fr" type="email"
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", margin: "6px 0 24px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, color: TEXT, fontFamily: "Inter" }} />
          <button type="submit" disabled={saving} style={{ width: "100%", padding: "12px 0", background: GOLD, color: "#1A1305", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <LogIn size={15} /> {saving ? "Connexion..." : "Rejoindre Aphynix"}
          </button>
          <p style={{ fontSize: 11.5, color: TEXT_SEC, marginTop: 14, marginBottom: 0 }}>Le premier inscrit devient administrateur principal.</p>
        </form>
      </div>
    );
  }

  const channelsByCat = (catId) => channels.filter((c) => c.categoryId === catId);
  const activeChannelObj = channels.find((c) => c.id === activeChannel);
  const sousAdmins = users.filter((u) => u.role === "sous-admin");
  const promotableMembers = users.filter((u) => u.role === "membre");

  return (
    <div className="ff-body" style={{ display: "flex", height: 640, background: BG, borderRadius: 14, overflow: "hidden", border: `1px solid ${BORDER}`, position: "relative" }}>
      {FONTS}

      <div style={{ width: 66, background: "#0A0A0C", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 10, flexShrink: 0 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: GOLD_BG, border: `1px solid ${GOLD_DIM}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="ff-display" style={{ color: GOLD, fontWeight: 800, fontSize: 17 }}>A</span>
        </div>
        <div style={{ width: 28, height: 1, background: BORDER, margin: "4px 0" }} />
        <div onClick={() => setView("discussion")} title="Discussion" style={{ width: 42, height: 42, borderRadius: 12, background: view === "discussion" ? GOLD_BG : BG_ELEV, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <MessageSquare size={19} color={view === "discussion" ? GOLD : TEXT_SEC} />
        </div>
        <div onClick={() => { setView("formations"); setSelectedCourse(null); }} title="Formations" style={{ width: 42, height: 42, borderRadius: 12, background: view === "formations" ? GOLD_BG : BG_ELEV, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <GraduationCap size={19} color={view === "formations" ? GOLD : TEXT_SEC} />
        </div>
      </div>

      {view === "discussion" && (
        <div style={{ width: 200, background: BG_ELEV, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "16px 14px 10px", fontSize: 13, fontWeight: 700, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>Aphynix</div>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
            {categories.map((cat) => (
              <div key={cat.id} style={{ marginBottom: 6 }}>
                <div onClick={() => setCollapsed((c) => ({ ...c, [cat.id]: !c[cat.id] }))} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 6px", cursor: "pointer", color: TEXT_SEC, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {collapsed[cat.id] ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                  {cat.name}
                </div>
                {!collapsed[cat.id] && channelsByCat(cat.id).map((ch) => (
                  <div key={ch.id} onClick={() => setActiveChannel(ch.id)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", marginLeft: 6, borderRadius: 6, cursor: "pointer",
                      background: activeChannel === ch.id ? BG_HOVER : "transparent",
                      borderLeft: activeChannel === ch.id ? `2px solid ${GOLD}` : "2px solid transparent",
                      color: activeChannel === ch.id ? TEXT : TEXT_SEC, fontSize: 13.5 }}>
                    <Hash size={13} /> {ch.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        {view === "discussion" && (
          <>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
              <Hash size={16} color={TEXT_SEC} />
              <span style={{ fontSize: 14.5, fontWeight: 700, color: TEXT }}>{activeChannelObj?.name}</span>
              <div style={{ marginLeft: "auto" }}>
                <MoreHorizontal size={18} color={TEXT_SEC} style={{ cursor: "pointer" }} onClick={() => { setDescDraft(serverDescription); setShowInvite(true); }} />
              </div>
            </div>
            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {messages.length === 0 && <div style={{ color: TEXT_SEC, fontSize: 13 }}>Aucun message. Lancez la discussion dans #{activeChannelObj?.name}.</div>}
              {messages.map((m) => (
                <div key={m.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: BG_ELEV2, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                    {m.author.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: TEXT }}>{m.author}</span>
                      {m.authorRole && m.authorRole !== "membre" && (
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: GOLD, background: GOLD_BG, padding: "1px 6px", borderRadius: 4, textTransform: "uppercase" }}>{m.authorRole}</span>
                      )}
                      <span className="ff-mono" style={{ fontSize: 10.5, color: TEXT_SEC }}>{new Date(m.ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                      {isModo && (
                        <Trash2 size={12} color={TEXT_SEC} style={{ cursor: "pointer", marginLeft: 4 }} onClick={() => deleteMessage(m.id)} />
                      )}
                    </div>
                    <div style={{ fontSize: 13.5, color: "#DAD9D3", marginTop: 2 }}>{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 16, borderTop: `1px solid ${BORDER}` }}>
              {isMuted ? (
                <div style={{ fontSize: 12.5, color: DANGER, background: "rgba(192,80,63,0.1)", border: `1px solid ${DANGER}`, borderRadius: 8, padding: "9px 12px" }}>
                  Vous etes actuellement en sourdine et ne pouvez pas envoyer de message.
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={`Message dans #${activeChannelObj?.name || ""}`}
                    style={{ flex: 1, padding: "10px 12px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: TEXT, fontFamily: "Inter" }} />
                  <button onClick={sendMessage} style={{ background: GOLD, border: "none", borderRadius: 8, padding: "0 14px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <Send size={15} color="#1A1305" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {view === "formations" && !selectedCourse && (
          <div style={{ padding: 28, overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 className="ff-display" style={{ fontSize: 21, fontWeight: 800, color: TEXT, margin: 0 }}>Formations</h2>
              {isAdmin && (
                <button onClick={() => setShowAddCourse((s) => !s)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "7px 12px", fontSize: 13, color: TEXT, cursor: "pointer" }}>
                  <Plus size={14} /> Ajouter une video
                </button>
              )}
            </div>
            {showAddCourse && (
              <div style={{ background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16, marginBottom: 18 }}>
                <input placeholder="Titre" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", marginBottom: 8, background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, color: TEXT, fontFamily: "Inter" }} />
                <textarea placeholder="Description / explication" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} rows={2}
                  style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", marginBottom: 8, background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, color: TEXT, fontFamily: "Inter", resize: "vertical" }} />
                <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: 8, background: BG_ELEV2, border: `1px dashed ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT_SEC, cursor: "pointer" }}>
                  <Upload size={14} color={GOLD} /> {newVideoFile ? newVideoFile.name : "Importer un fichier video"}
                  <input type="file" accept="video/*" onChange={(e) => setNewVideoFile(e.target.files[0] || null)} style={{ display: "none" }} />
                </label>
                <input placeholder="Duree (ex: 12 min)" value={newCourse.duree} onChange={(e) => setNewCourse({ ...newCourse, duree: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", marginBottom: 10, background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, color: TEXT, fontFamily: "Inter" }} />
                <div style={{ fontSize: 11, color: TEXT_SEC, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Liens (facultatif)</div>
                {newCourse.links.map((l, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <input placeholder="Intitule" value={l.label} onChange={(e) => updateLinkField(idx, "label", e.target.value)}
                      style={{ width: "38%", boxSizing: "border-box", padding: "7px 9px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT, fontFamily: "Inter" }} />
                    <input placeholder="https://..." value={l.url} onChange={(e) => updateLinkField(idx, "url", e.target.value)}
                      style={{ flex: 1, boxSizing: "border-box", padding: "7px 9px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT, fontFamily: "Inter" }} />
                    <Trash2 size={14} color={DANGER} style={{ cursor: "pointer", alignSelf: "center" }} onClick={() => removeLinkRow(idx)} />
                  </div>
                ))}
                <button onClick={addLinkRow} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: `1px solid ${BORDER}`, color: TEXT_SEC, borderRadius: 6, padding: "5px 10px", fontSize: 11.5, cursor: "pointer", marginBottom: 12 }}>
                  <Plus size={12} /> Ajouter un lien
                </button>
                <div>
                  <button onClick={addCourse} style={{ background: GOLD, color: "#1A1305", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Publier</button>
                </div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
              {courses.map((c) => (
                <div key={c.id} onClick={() => setSelectedCourse(c)} style={{ background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
                  <div style={{ height: 90, background: BG_ELEV2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PlayCircle size={30} color={GOLD} />
                  </div>
                  <div style={{ padding: 12 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{c.title}</div>
                    {c.duree && <div className="ff-mono" style={{ fontSize: 10.5, color: TEXT_SEC }}>{c.duree}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "formations" && selectedCourse && (
          <div style={{ padding: 28, overflowY: "auto" }}>
            <div onClick={() => setSelectedCourse(null)} style={{ display: "flex", alignItems: "center", gap: 6, color: TEXT_SEC, fontSize: 12.5, cursor: "pointer", marginBottom: 16 }}>
              <ArrowLeft size={14} /> Retour aux formations
            </div>
            <div style={{ background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", maxWidth: 520 }}>
              <div style={{ aspectRatio: "16/9", background: BG_ELEV2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {videoPreviews[selectedCourse.id] ? (
                  <video src={videoPreviews[selectedCourse.id]} controls style={{ width: "100%", height: "100%" }} />
                ) : selectedCourse.videoName ? (
                  <div style={{ textAlign: "center", color: TEXT_SEC, fontSize: 12 }}>
                    <PlayCircle size={34} color={GOLD} />
                    <div style={{ marginTop: 6 }}>{selectedCourse.videoName}</div>
                  </div>
                ) : (
                  <PlayCircle size={44} color={GOLD} />
                )}
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: TEXT }} className="ff-display">{selectedCourse.title}</div>
                {selectedCourse.duree && <div className="ff-mono" style={{ fontSize: 11, color: TEXT_SEC, marginTop: 4 }}>{selectedCourse.duree}</div>}
                <div style={{ fontSize: 13.5, color: "#DAD9D3", marginTop: 10, lineHeight: 1.5 }}>{selectedCourse.description}</div>
                {selectedCourse.links && selectedCourse.links.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
                    {selectedCourse.links.map((l) => (
                      <a key={l.id} href={l.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", color: GOLD, fontSize: 12.5, textDecoration: "none" }}>
                        <LinkIcon size={13} /> {l.label}
                      </a>
                    ))}
                  </div>
                )}
                {isAdmin && (
                  <button onClick={() => { removeCourse(selectedCourse.id); setSelectedCourse(null); }} style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${DANGER}`, color: DANGER, borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>
                    <Trash2 size={12} /> Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ position: "absolute", bottom: 14, right: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <div className="ff-mono" style={{ fontSize: 10.5, color: TEXT_SEC, background: BG_ELEV, padding: "5px 9px", borderRadius: 6, border: `1px solid ${BORDER}` }}>{profil.name} - {role}</div>
          {isModo && (
            <div onClick={openAdmin} title="Administration"
              style={{ width: 38, height: 38, borderRadius: 10, background: BG_ELEV, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Settings size={17} color={GOLD} />
            </div>
          )}
        </div>
      </div>

      {showInvite && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 15 }}>
          <div style={{ width: 340, background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ height: 64, background: `linear-gradient(135deg, ${GOLD_BG}, ${BG_ELEV2})`, display: "flex", alignItems: "flex-end", padding: "0 18px 12px", position: "relative" }}>
              <X size={16} color={TEXT_SEC} style={{ cursor: "pointer", position: "absolute", top: 10, right: 12 }} onClick={() => setShowInvite(false)} />
              <div style={{ width: 40, height: 40, borderRadius: 10, background: BG_ELEV, border: `1px solid ${GOLD_DIM}`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                <span className="ff-display" style={{ color: GOLD, fontWeight: 800, fontSize: 16 }}>A</span>
              </div>
              <div className="ff-display" style={{ color: TEXT, fontWeight: 800, fontSize: 15 }}>Aphynix</div>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ fontSize: 10.5, color: TEXT_SEC, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>A propos</span>
                {isAdmin && !editingDesc && <span onClick={() => setEditingDesc(true)} style={{ color: GOLD, cursor: "pointer", textTransform: "none" }}>Modifier</span>}
              </div>
              {editingDesc ? (
                <div style={{ marginBottom: 16 }}>
                  <textarea value={descDraft} onChange={(e) => setDescDraft(e.target.value)} rows={3}
                    style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT, fontFamily: "Inter", resize: "vertical" }} />
                  <button onClick={saveDescription} style={{ marginTop: 6, background: GOLD, color: "#1A1305", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
                </div>
              ) : (
                <div style={{ fontSize: 12.5, color: "#DAD9D3", lineHeight: 1.5, marginBottom: 16 }}>{serverDescription}</div>
              )}

              <div style={{ fontSize: 10.5, color: TEXT_SEC, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Regles</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 8, fontSize: 12, color: "#DAD9D3" }}><span style={{ color: GOLD }}>1.</span> Respect entre membres : pas d'insultes ni de harcelement.</div>
                <div style={{ display: "flex", gap: 8, fontSize: 12, color: "#DAD9D3" }}><span style={{ color: GOLD }}>2.</span> Pas de spam ni de publicite sauvage dans les canaux.</div>
              </div>

              <div style={{ fontSize: 10.5, color: TEXT_SEC, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Inviter des membres</div>
              <div className="ff-mono" style={{ fontSize: 11, color: TEXT_SEC, background: BG, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 9px", marginBottom: 8, wordBreak: "break-all" }}>
                aphynix.app/invite/{inviteCode}
              </div>
              <button onClick={copyInvite} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: GOLD, color: "#1A1305", border: "none", borderRadius: 6, padding: "8px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                <Copy size={12} /> {copied ? "Copie !" : "Copier le lien"}
              </button>
              <p style={{ fontSize: 10.5, color: TEXT_SEC, marginTop: 8, marginBottom: 0 }}>Ce lien donne acces au site et au serveur Aphynix. Partagez-le sur Snapchat ou toute autre application pour inviter du monde.</p>
            </div>
          </div>
        </div>
      )}

      {passwordPrompt && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
          <form onSubmit={submitPassword} style={{ width: 300, background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: TEXT, fontWeight: 700, fontSize: 14 }}><Lock size={15} color={GOLD} /> Acces admin</div>
              <X size={16} color={TEXT_SEC} style={{ cursor: "pointer" }} onClick={() => setPasswordPrompt(false)} />
            </div>
            <input type="password" autoFocus value={passwordInput} onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }} placeholder="Mot de passe"
              style={{ width: "100%", boxSizing: "border-box", padding: "9px 11px", background: BG_ELEV2, border: `1px solid ${passwordError ? DANGER : BORDER}`, borderRadius: 8, fontSize: 13, color: TEXT, fontFamily: "Inter", marginBottom: 10 }} />
            {passwordError && <div style={{ fontSize: 11.5, color: DANGER, marginBottom: 10 }}>Mot de passe incorrect.</div>}
            <button type="submit" style={{ width: "100%", padding: "9px 0", background: GOLD, color: "#1A1305", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Deverrouiller</button>
          </form>
        </div>
      )}

      {adminOpen && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
          <div style={{ width: 500, maxHeight: 520, background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: TEXT, fontWeight: 700, fontSize: 14 }}>
                <ShieldCheck size={16} color={GOLD} /> Administration
              </div>
              <X size={17} color={TEXT_SEC} style={{ cursor: "pointer" }} onClick={() => setAdminOpen(false)} />
            </div>
            <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, overflowX: "auto" }}>
              {[
                ["membres", "Membres"],
                ["sousadmins", "Sous-admins"],
                ...(isAdmin ? [["canaux", "Canaux"], ["formations", "Formations"]] : []),
              ].map(([id, label]) => (
                <div key={id} onClick={() => setAdminTab(id)} style={{ padding: "10px 16px", fontSize: 12.5, cursor: "pointer", whiteSpace: "nowrap", color: adminTab === id ? GOLD : TEXT_SEC, borderBottom: adminTab === id ? `2px solid ${GOLD}` : "2px solid transparent" }}>{label}</div>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
              {adminTab === "membres" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {users.map((u) => (
                    <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: BG_ELEV2, borderRadius: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: BG_HOVER, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontSize: 11, fontWeight: 700 }}>{u.name.charAt(0).toUpperCase()}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: TEXT, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: TEXT_SEC }}>{u.statut === "muet" ? "En sourdine" : "Actif"}</div>
                      </div>
                      {isAdmin ? (
                        <select value={u.role} onChange={(e) => setUserRole(u.id, e.target.value)} style={{ background: BG_ELEV, color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 6px", fontSize: 11.5, fontFamily: "Inter" }}>
                          <option value="membre">Membre</option>
                          <option value="sous-admin">Sous-admin</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span style={{ fontSize: 11, color: TEXT_SEC, textTransform: "capitalize", padding: "0 6px" }}>{u.role}</span>
                      )}
                      <VolumeX size={15} color={u.statut === "muet" ? DANGER : TEXT_SEC} style={{ cursor: "pointer" }} onClick={() => toggleMute(u.id)} />
                      {isAdmin && <UserMinus size={15} color={DANGER} style={{ cursor: "pointer" }} onClick={() => removeMember(u.id)} />}
                    </div>
                  ))}
                </div>
              )}

              {adminTab === "sousadmins" && (
                <div>
                  {isAdmin && (
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 11.5, color: TEXT_SEC, textTransform: "uppercase", marginBottom: 6 }}>Promouvoir un membre</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <select value={promoteTarget} onChange={(e) => setPromoteTarget(e.target.value)} style={{ flex: 1, background: BG_ELEV2, color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "7px 8px", fontSize: 12.5 }}>
                          <option value="">Choisir un membre</option>
                          {promotableMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <button onClick={() => { if (promoteTarget) { setUserRole(promoteTarget, "sous-admin"); setPromoteTarget(""); } }} style={{ background: GOLD, border: "none", borderRadius: 6, padding: "0 12px", cursor: "pointer" }}><Plus size={14} color="#1A1305" /></button>
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: 11.5, color: TEXT_SEC, textTransform: "uppercase", marginBottom: 6 }}>Equipe de moderation</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {sousAdmins.length === 0 && <div style={{ fontSize: 12.5, color: TEXT_SEC }}>Aucun sous-admin pour le moment.</div>}
                    {sousAdmins.map((u) => (
                      <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: BG_ELEV2, borderRadius: 8 }}>
                        <Crown size={14} color={GOLD} />
                        <div style={{ flex: 1, fontSize: 13, color: TEXT }}>{u.name}</div>
                        {isAdmin && (
                          <button onClick={() => setUserRole(u.id, "membre")} style={{ background: "none", border: `1px solid ${BORDER}`, color: TEXT_SEC, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>Retirer</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: TEXT_SEC, marginTop: 14 }}>Un sous-admin peut gerer les membres et supprimer des messages. Il ne peut ni creer/supprimer de canal, ni exclure un membre.</p>
                </div>
              )}

              {adminTab === "canaux" && isAdmin && (
                <div>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11.5, color: TEXT_SEC, textTransform: "uppercase", marginBottom: 6 }}>Nouvelle categorie</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Nom de la categorie"
                        style={{ flex: 1, padding: "7px 10px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT, fontFamily: "Inter" }} />
                      <button onClick={addCategory} style={{ background: GOLD, border: "none", borderRadius: 6, padding: "0 12px", cursor: "pointer" }}><Plus size={14} color="#1A1305" /></button>
                    </div>
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11.5, color: TEXT_SEC, textTransform: "uppercase", marginBottom: 6 }}>Nouveau canal</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} placeholder="nom-du-canal"
                        style={{ flex: 1, padding: "7px 10px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT, fontFamily: "Inter" }} />
                      <select value={newChannelCat} onChange={(e) => setNewChannelCat(e.target.value)} style={{ background: BG_ELEV2, color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "0 8px", fontSize: 12 }}>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <button onClick={addChannel} style={{ background: GOLD, border: "none", borderRadius: 6, padding: "0 12px", cursor: "pointer" }}><Plus size={14} color="#1A1305" /></button>
                    </div>
                  </div>
                  {categories.map((cat) => (
                    <div key={cat.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <Folder size={13} color={TEXT_SEC} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{cat.name}</span>
                        <Trash2 size={12} color={DANGER} style={{ cursor: "pointer", marginLeft: "auto" }} onClick={() => removeCategory(cat.id)} />
                      </div>
                      {channelsByCat(cat.id).map((ch) => (
                        <div key={ch.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px 4px 20px", fontSize: 12.5, color: TEXT_SEC }}>
                          <Hash size={11} /> {ch.name}
                          <Trash2 size={11} color={DANGER} style={{ cursor: "pointer", marginLeft: "auto" }} onClick={() => removeChannel(ch.id)} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {adminTab === "formations" && isAdmin && (
                <div>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11.5, color: TEXT_SEC, textTransform: "uppercase", marginBottom: 6 }}>Ajouter une video</div>
                    <input placeholder="Titre" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                      style={{ width: "100%", boxSizing: "border-box", padding: "7px 10px", marginBottom: 6, background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT, fontFamily: "Inter" }} />
                    <textarea placeholder="Description" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} rows={2}
                      style={{ width: "100%", boxSizing: "border-box", padding: "7px 10px", marginBottom: 6, background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT, fontFamily: "Inter", resize: "vertical" }} />
                    <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", marginBottom: 6, background: BG_ELEV2, border: `1px dashed ${BORDER}`, borderRadius: 6, fontSize: 12, color: TEXT_SEC, cursor: "pointer" }}>
                      <Upload size={13} color={GOLD} /> {newVideoFile ? newVideoFile.name : "Importer un fichier video"}
                      <input type="file" accept="video/*" onChange={(e) => setNewVideoFile(e.target.files[0] || null)} style={{ display: "none" }} />
                    </label>
                    <input placeholder="Duree (ex: 12 min)" value={newCourse.duree} onChange={(e) => setNewCourse({ ...newCourse, duree: e.target.value })}
                      style={{ width: "100%", boxSizing: "border-box", padding: "7px 10px", marginBottom: 8, background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT, fontFamily: "Inter" }} />
                    <div style={{ fontSize: 10.5, color: TEXT_SEC, textTransform: "uppercase", marginBottom: 5 }}>Liens (facultatif)</div>
                    {newCourse.links.map((l, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 5, marginBottom: 5 }}>
                        <input placeholder="Intitule" value={l.label} onChange={(e) => updateLinkField(idx, "label", e.target.value)}
                          style={{ width: "36%", boxSizing: "border-box", padding: "6px 8px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 11.5, color: TEXT, fontFamily: "Inter" }} />
                        <input placeholder="https://..." value={l.url} onChange={(e) => updateLinkField(idx, "url", e.target.value)}
                          style={{ flex: 1, boxSizing: "border-box", padding: "6px 8px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 11.5, color: TEXT, fontFamily: "Inter" }} />
                        <Trash2 size={13} color={DANGER} style={{ cursor: "pointer", alignSelf: "center" }} onClick={() => removeLinkRow(idx)} />
                      </div>
                    ))}
                    <button onClick={addLinkRow} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: `1px solid ${BORDER}`, color: TEXT_SEC, borderRadius: 6, padding: "4px 9px", fontSize: 10.5, cursor: "pointer", marginBottom: 10 }}>
                      <Plus size={11} /> Ajouter un lien
                    </button>
                    <div>
                      <button onClick={addCourse} style={{ background: GOLD, color: "#1A1305", border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>Publier</button>
                    </div>
                  </div>
                  <div style={{ fontSize: 11.5, color: TEXT_SEC, textTransform: "uppercase", marginBottom: 6 }}>Videos publiees</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {courses.map((c) => (
                      <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: BG_ELEV2, borderRadius: 6 }}>
                        <PlayCircle size={13} color={GOLD} />
                        <span style={{ flex: 1, fontSize: 12.5, color: TEXT }}>{c.title}</span>
                        <Trash2 size={12} color={DANGER} style={{ cursor: "pointer" }} onClick={() => removeCourse(c.id)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
