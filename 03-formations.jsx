import React, { useState } from "react";
import { PlayCircle, ArrowLeft, Plus, Upload, Trash2, Link as LinkIcon } from "lucide-react";

const BG_ELEV = "#18181C";
const BG_ELEV2 = "#1F1F24";
const GOLD = "#D4AF37";
const TEXT = "#F1F0EA";
const TEXT_SEC = "#98979E";
const BORDER = "#2A2A30";
const DANGER = "#C0503F";

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Manrope', sans-serif; }
    .ff-body { font-family: 'Inter', sans-serif; }
    .ff-mono { font-family: 'IBM Plex Mono', monospace; }
  `}</style>
);

const INIT_COURSES = [
  { id: "c1", title: "Bienvenue sur Aphynix", description: "Comment fonctionne la formation et la communaute.", duree: "20 min", links: [] },
  { id: "c2", title: "Les bases de l'affiliation casino", description: "Vocabulaire, fonctionnement des programmes, premiers pas.", duree: "1h", links: [{ id: "l1", label: "Programme recommande", url: "#" }, { id: "l2", label: "Outil de tracking", url: "#" }] },
];

export default function Formations() {
  const [courses, setCourses] = useState(INIT_COURSES);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ title: "", description: "", duree: "", videoName: "" });

  const addCourse = () => {
    if (!draft.title.trim()) return;
    setCourses((c) => [...c, { id: Date.now().toString(), ...draft, links: [] }]);
    setDraft({ title: "", description: "", duree: "", videoName: "" });
    setShowAdd(false);
  };

  if (selected) {
    return (
      <div className="ff-body" style={{ background: "#0E0E11", borderRadius: 14, border: `1px solid ${BORDER}`, padding: 28, minHeight: 400 }}>
        {FONTS}
        <div onClick={() => setSelected(null)} style={{ display: "flex", alignItems: "center", gap: 6, color: TEXT_SEC, fontSize: 12.5, cursor: "pointer", marginBottom: 16 }}>
          <ArrowLeft size={14} /> Retour aux formations
        </div>
        <div style={{ background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", maxWidth: 480 }}>
          <div style={{ aspectRatio: "16/9", background: BG_ELEV2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PlayCircle size={44} color={GOLD} />
          </div>
          <div style={{ padding: 18 }}>
            <div className="ff-display" style={{ fontSize: 17, fontWeight: 800, color: TEXT }}>{selected.title}</div>
            {selected.duree && <div className="ff-mono" style={{ fontSize: 11, color: TEXT_SEC, marginTop: 4 }}>{selected.duree}</div>}
            <div style={{ fontSize: 13.5, color: "#DAD9D3", marginTop: 10, lineHeight: 1.5 }}>{selected.description}</div>
            {selected.links?.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
                {selected.links.map((l) => (
                  <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", color: GOLD, fontSize: 12.5 }}>
                    <LinkIcon size={13} /> {l.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ff-body" style={{ background: "#0E0E11", borderRadius: 14, border: `1px solid ${BORDER}`, padding: 28, minHeight: 400 }}>
      {FONTS}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="ff-display" style={{ fontSize: 21, fontWeight: 800, color: TEXT, margin: 0 }}>Formations</h2>
        <button onClick={() => setShowAdd((s) => !s)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "7px 12px", fontSize: 13, color: TEXT, cursor: "pointer" }}>
          <Plus size={14} /> Ajouter une video
        </button>
      </div>
      {showAdd && (
        <div style={{ background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16, marginBottom: 18 }}>
          <input placeholder="Titre" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", marginBottom: 8, background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, color: TEXT, fontFamily: "Inter" }} />
          <textarea placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={2}
            style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", marginBottom: 8, background: BG_ELEV2, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, color: TEXT, fontFamily: "Inter" }} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: 10, background: BG_ELEV2, border: `1px dashed ${BORDER}`, borderRadius: 6, fontSize: 12.5, color: TEXT_SEC, cursor: "pointer" }}>
            <Upload size={14} color={GOLD} /> {draft.videoName || "Importer un fichier video"}
            <input type="file" accept="video/*" onChange={(e) => setDraft({ ...draft, videoName: e.target.files[0]?.name || "" })} style={{ display: "none" }} />
          </label>
          <button onClick={addCourse} style={{ background: GOLD, color: "#1A1305", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Publier</button>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
        {courses.map((c) => (
          <div key={c.id} onClick={() => setSelected(c)} style={{ background: BG_ELEV, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
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
  );
}
