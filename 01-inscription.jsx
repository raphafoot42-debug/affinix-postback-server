import React, { useState } from "react";
import { LogIn, CheckCircle2 } from "lucide-react";

const BG = "#0E0E11";
const BG_ELEV = "#18181C";
const BG_ELEV2 = "#1F1F24";
const GOLD = "#D4AF37";
const GOLD_DIM = "#8C7A2E";
const GOLD_BG = "rgba(212,175,55,0.12)";
const TEXT = "#F1F0EA";
const TEXT_SEC = "#98979E";
const BORDER = "#2A2A30";

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600&display=swap');
    .ff-display { font-family: 'Manrope', sans-serif; }
    .ff-body { font-family: 'Inter', sans-serif; }
  `}</style>
);

export default function Inscription() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="ff-body" style={{ minHeight: 480, background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {FONTS}
        <div style={{ textAlign: "center" }}>
          <CheckCircle2 size={36} color={GOLD} />
          <div style={{ color: TEXT, fontSize: 16, fontWeight: 700, marginTop: 10 }}>Bienvenue, {name} !</div>
          <div style={{ color: TEXT_SEC, fontSize: 13, marginTop: 4 }}>Vous seriez maintenant redirige vers Aphynix.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ff-body" style={{ minHeight: 480, background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {FONTS}
      <form onSubmit={(e) => { e.preventDefault(); if (name.trim() && email.trim()) setDone(true); }}
        style={{ background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "40px 36px", width: 380 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: GOLD_BG, border: `1px solid ${GOLD_DIM}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          <span className="ff-display" style={{ color: GOLD, fontSize: 19, fontWeight: 800 }}>A</span>
        </div>
        <h1 className="ff-display" style={{ fontSize: 24, fontWeight: 800, color: TEXT, margin: "0 0 6px" }}>Aphynix</h1>
        <p style={{ color: TEXT_SEC, fontSize: 14, margin: "0 0 28px" }}>Formation et communaute affiliation casino. Rejoignez le serveur.</p>
        <label style={{ fontSize: 11, color: TEXT_SEC, textTransform: "uppercase", letterSpacing: 0.6 }}>Nom / pseudo</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre pseudo"
          style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", margin: "6px 0 18px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, color: TEXT, fontFamily: "Inter" }} />
        <label style={{ fontSize: 11, color: TEXT_SEC, textTransform: "uppercase", letterSpacing: 0.6 }}>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" type="email"
          style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", margin: "6px 0 24px", background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, color: TEXT, fontFamily: "Inter" }} />
        <button type="submit" style={{ width: "100%", padding: "12px 0", background: GOLD, color: "#1A1305", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <LogIn size={15} /> Rejoindre Aphynix
        </button>
        <p style={{ fontSize: 11.5, color: TEXT_SEC, marginTop: 14, marginBottom: 0 }}>Le premier inscrit devient administrateur principal.</p>
      </form>
    </div>
  );
}
