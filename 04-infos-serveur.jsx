import React, { useState } from "react";
import { Copy } from "lucide-react";

const BG = "#0E0E11";
const BG_ELEV = "#18181C";
const BG_ELEV2 = "#1F1F24";
const GOLD = "#D4AF37";
const GOLD_BG = "rgba(212,175,55,0.12)";
const TEXT = "#F1F0EA";
const TEXT_SEC = "#98979E";
const BORDER = "#2A2A30";

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400&display=swap');
    .ff-display { font-family: 'Manrope', sans-serif; }
    .ff-body { font-family: 'Inter', sans-serif; }
    .ff-mono { font-family: 'IBM Plex Mono', monospace; }
  `}</style>
);

export default function InfosServeur() {
  const [description, setDescription] = useState("Communaute et formation dediee a l'affiliation casino. Entraide, strategies et ressources pour progresser ensemble.");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(description);
  const [copied, setCopied] = useState(false);

  return (
    <div className="ff-body" style={{ background: "#0E0E11", borderRadius: 14, border: `1px solid ${BORDER}`, padding: 40, display: "flex", justifyContent: "center" }}>
      {FONTS}
      <div style={{ width: 320, background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ height: 60, background: `linear-gradient(135deg, ${GOLD_BG}, ${BG_ELEV2})`, display: "flex", alignItems: "flex-end", padding: "0 18px 12px" }}>
          <span className="ff-display" style={{ color: TEXT, fontWeight: 800, fontSize: 15 }}>Aphynix</span>
        </div>
        <div style={{ padding: 18 }}>
          <div style={{ fontSize: 10.5, color: TEXT_SEC, textTransform: "uppercase", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
            <span>A propos</span>
            {!editing && <span onClick={() => { setDraft(description); setEditing(true); }} style={{ color: GOLD, cursor: "pointer" }}>Modifier</span>}
          </div>
          {editing ? (
            <div style={{ marginBottom: 16 }}>
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3}
                style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT, fontFamily: "Inter" }} />
              <button onClick={() => { setDescription(draft); setEditing(false); }} style={{ marginTop: 6, background: GOLD, color: "#1A1305", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
            </div>
          ) : (
            <div style={{ fontSize: 12.5, color: "#DAD9D3", lineHeight: 1.5, marginBottom: 16 }}>{description}</div>
          )}
          <div style={{ fontSize: 10.5, color: TEXT_SEC, textTransform: "uppercase", marginBottom: 6 }}>Regles</div>
          <div style={{ fontSize: 12, color: "#DAD9D3", marginBottom: 3 }}><span style={{ color: GOLD }}>1.</span> Respect entre membres.</div>
          <div style={{ fontSize: 12, color: "#DAD9D3", marginBottom: 16 }}><span style={{ color: GOLD }}>2.</span> Pas de spam ni pub sauvage.</div>
          <div style={{ fontSize: 10.5, color: TEXT_SEC, textTransform: "uppercase", marginBottom: 6 }}>Inviter des membres</div>
          <div className="ff-mono" style={{ fontSize: 11, color: TEXT_SEC, background: BG, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 9px", marginBottom: 8 }}>aphynix.app/invite/x7f2a9</div>
          <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: GOLD, color: "#1A1305", border: "none", borderRadius: 6, padding: "8px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
            <Copy size={12} /> {copied ? "Copie !" : "Copier le lien"}
          </button>
        </div>
      </div>
    </div>
  );
}
