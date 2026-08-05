import React, { useState } from "react";
import { Hash, Send, ChevronDown, ChevronRight, MoreHorizontal, X, Copy } from "lucide-react";

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

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Manrope', sans-serif; }
    .ff-body { font-family: 'Inter', sans-serif; }
    .ff-mono { font-family: 'IBM Plex Mono', monospace; }
  `}</style>
);

const CATEGORIES = [
  { id: "cat-general", name: "General" },
  { id: "cat-affiliation", name: "Affiliation casino" },
  { id: "cat-entraide", name: "Entraide" },
];
const CHANNELS = [
  { id: "annonces", name: "annonces", categoryId: "cat-general" },
  { id: "strategies", name: "strategies", categoryId: "cat-affiliation" },
  { id: "outils-trackers", name: "outils-trackers", categoryId: "cat-affiliation" },
  { id: "questions", name: "questions", categoryId: "cat-entraide" },
];

export default function Discussion() {
  const [active, setActive] = useState("strategies");
  const [collapsed, setCollapsed] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState({
    strategies: [
      { id: 1, author: "Marco", role: "admin", text: "Bienvenue sur le canal strategies, postez vos retours d'experience ici.", ts: Date.now() - 600000 },
      { id: 2, author: "Lina", role: "membre", text: "Merci, je commence a tester un premier lien cette semaine.", ts: Date.now() - 300000 },
    ],
  });
  const [input, setInput] = useState("");

  const chByCat = (id) => CHANNELS.filter((c) => c.categoryId === id);
  const activeChannel = CHANNELS.find((c) => c.id === active);
  const list = messages[active] || [];

  const send = () => {
    if (!input.trim()) return;
    const msg = { id: Date.now(), author: "Vous", role: "membre", text: input, ts: Date.now() };
    setMessages((m) => ({ ...m, [active]: [...(m[active] || []), msg] }));
    setInput("");
  };

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="ff-body" style={{ display: "flex", height: 560, background: BG, borderRadius: 14, overflow: "hidden", border: `1px solid ${BORDER}`, position: "relative" }}>
      {FONTS}
      <div style={{ width: 200, background: BG_ELEV, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 14px 10px", fontSize: 13, fontWeight: 700, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>Aphynix</div>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} style={{ marginBottom: 6 }}>
              <div onClick={() => setCollapsed((c) => ({ ...c, [cat.id]: !c[cat.id] }))} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 6px", cursor: "pointer", color: TEXT_SEC, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                {collapsed[cat.id] ? <ChevronRight size={12} /> : <ChevronDown size={12} />} {cat.name}
              </div>
              {!collapsed[cat.id] && chByCat(cat.id).map((ch) => (
                <div key={ch.id} onClick={() => setActive(ch.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", marginLeft: 6, borderRadius: 6, cursor: "pointer",
                    background: active === ch.id ? BG_HOVER : "transparent", borderLeft: active === ch.id ? `2px solid ${GOLD}` : "2px solid transparent",
                    color: active === ch.id ? TEXT : TEXT_SEC, fontSize: 13.5 }}>
                  <Hash size={13} /> {ch.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <Hash size={16} color={TEXT_SEC} />
          <span style={{ fontSize: 14.5, fontWeight: 700, color: TEXT }}>{activeChannel?.name}</span>
          <MoreHorizontal size={18} color={TEXT_SEC} style={{ cursor: "pointer", marginLeft: "auto" }} onClick={() => setShowInfo(true)} />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {list.map((m) => (
            <div key={m.id} style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: BG_ELEV2, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{m.author.charAt(0)}</div>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: TEXT }}>{m.author}</span>
                  {m.role !== "membre" && <span style={{ fontSize: 9.5, fontWeight: 700, color: GOLD, background: GOLD_BG, padding: "1px 6px", borderRadius: 4, textTransform: "uppercase" }}>{m.role}</span>}
                </div>
                <div style={{ fontSize: 13.5, color: "#DAD9D3", marginTop: 2 }}>{m.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 16, borderTop: `1px solid ${BORDER}`, display: "flex", gap: 8 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Message dans #${activeChannel?.name}`}
            style={{ flex: 1, padding: "10px 12px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: TEXT, fontFamily: "Inter" }} />
          <button onClick={send} style={{ background: GOLD, border: "none", borderRadius: 8, padding: "0 14px", cursor: "pointer" }}><Send size={15} color="#1A1305" /></button>
        </div>
      </div>

      {showInfo && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 320, background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ height: 56, background: `linear-gradient(135deg, ${GOLD_BG}, ${BG_ELEV2})`, display: "flex", alignItems: "flex-end", padding: "0 16px 10px", position: "relative" }}>
              <X size={16} color={TEXT_SEC} style={{ cursor: "pointer", position: "absolute", top: 10, right: 12 }} onClick={() => setShowInfo(false)} />
              <div style={{ color: TEXT, fontWeight: 800, fontSize: 14 }} className="ff-display">Aphynix</div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: "#DAD9D3", marginBottom: 12 }}>Communaute et formation dediee a l'affiliation casino.</div>
              <div className="ff-mono" style={{ fontSize: 10.5, color: TEXT_SEC, background: BG, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "7px 8px", marginBottom: 8 }}>aphynix.app/invite/x7f2a9</div>
              <button onClick={copyLink} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: GOLD, color: "#1A1305", border: "none", borderRadius: 6, padding: "7px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                <Copy size={12} /> {copied ? "Copie !" : "Copier le lien"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
