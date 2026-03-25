// ═══════════════════════════════════════════════════════════════════
//  DistanceCourseManagerSimplified.jsx
//  UX simplifiée : édition inline directement sur les cards
//  Remplace l'ancien modal complexe par des actions contextuelles
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect } from 'react';

/* ─── Constantes ─────────────────────────────────────────────────── */
const LEVEL_COLORS = [
  { label: 'Or',     value: '#d4a747' },
  { label: 'Bleu',   value: '#3b82f6' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Rose',   value: '#ec4899' },
  { label: 'Vert',   value: '#10b981' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Cyan',   value: '#06b6d4' },
  { label: 'Rouge',  value: '#ef4444' },
];

const EMOJIS        = ['📘','📗','📙','📕','🎯','⚡','🔬','🧮','📐','🎓','💡','🌍','🚀','🏆','🔑','🌟'];
const MODULE_ICONS  = ['📖','🔭','⚗️','🧲','🌊','💫','🔢','📊','🧪','🌱','🏛️','🎨','🔋','🧬','🖥️','🗂️'];
const SESSION_TYPES = ['cours', 'exercices', 'td'];
const SESSION_TYPE_LABELS = { cours: 'Cours', exercices: 'Exercices', td: 'TD' };
const SESSION_TYPE_COLORS = {
  cours:     { bg: 'rgba(99,102,241,.18)',  color: '#a5b4fc', border: 'rgba(99,102,241,.3)' },
  exercices: { bg: 'rgba(212,167,71,.18)',  color: '#fbbf24', border: 'rgba(212,167,71,.3)' },
  td:        { bg: 'rgba(16,185,129,.18)',  color: '#6ee7b7', border: 'rgba(16,185,129,.3)' },
};

const uid = () => '_' + Math.random().toString(36).slice(2, 9);

const emptySeance = () => ({
  id: null, tempId: uid(), titre: '', sousTitre: '', duree: '',
  videoUrl: '', imageUrl: '', description: '',
  typeSeance: 'cours', disponible: false,
});

const emptyModule  = () => ({ id: null, nom: '', icon: '📖', seances: [] });
const emptyMatiere = () => ({ id: null, nom: '', icon: '📘', color: '#d4a747', description: '', modules: [] });
const emptyNiveau  = () => ({ id: null, label: '', fullLabel: '', emoji: '📘', colorHex: '#d4a747', matieres: [] });

/* ─── Shared input style ─────────────────────────────────────────── */
const IS = (err = false) => ({
  width: '100%', padding: '9px 12px', borderRadius: 10,
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${err ? 'rgba(248,113,113,0.5)' : 'rgba(196,150,48,0.2)'}`,
  color: '#e8eaf0', fontSize: 12, fontFamily: 'Outfit,sans-serif',
  outline: 'none', boxSizing: 'border-box',
});

/* ─── Toggle ─────────────────────────────────────────────────────── */
const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)} style={{
    width: 36, height: 20, borderRadius: 10, cursor: 'pointer',
    position: 'relative', flexShrink: 0, transition: 'background .2s',
    background: value ? 'linear-gradient(135deg,#16a34a,#4ade80)' : 'rgba(255,255,255,0.1)',
    border: `1px solid ${value ? '#4ade80' : 'rgba(255,255,255,0.12)'}`,
  }}>
    <div style={{
      width: 14, height: 14, borderRadius: '50%', background: '#fff',
      position: 'absolute', top: 2, left: value ? 18 : 2,
      transition: 'left .2s cubic-bezier(.34,1.56,.64,1)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
    }} />
  </div>
);

/* ─── Color Dots ─────────────────────────────────────────────────── */
const ColorDots = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
    {LEVEL_COLORS.map(c => (
      <div key={c.value} onClick={() => onChange(c.value)} title={c.label} style={{
        width: 18, height: 18, borderRadius: '50%', cursor: 'pointer',
        background: c.value, border: value === c.value ? '2.5px solid #fff' : '2px solid transparent',
        boxShadow: value === c.value ? `0 0 8px ${c.value}88` : 'none',
        transform: value === c.value ? 'scale(1.2)' : 'scale(1)', transition: 'all .15s',
      }} />
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   SÉANCE EDIT FORM — Formulaire inline compact
═══════════════════════════════════════════════════════════════════ */
const SeanceEditForm = ({ seance, onSave, onCancel, color }) => {
  const [data, setData] = useState({ ...seance });
  const ch = (k, v) => setData(p => ({ ...p, [k]: v }));

  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden',
      border: `1px solid ${color}44`,
      background: 'rgba(8,15,30,0.98)',
      boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${color}22`,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px', borderBottom: `1px solid ${color}22`,
        background: `${color}0a`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 13, color: '#f1f5f9' }}>
          {seance.titre ? `✏ ${seance.titre}` : '✨ Nouvelle séance'}
        </span>
        <button onClick={onCancel} style={{
          width: 26, height: 26, borderRadius: '50%', border: 'none',
          background: 'rgba(239,68,68,0.12)', color: '#f87171',
          cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
      </div>

      {/* Body */}
      <div style={{ padding: 16, display: 'grid', gap: 10 }}>
        {/* Titre */}
        <div>
          <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: `${color}99`, fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>
            TITRE *
          </label>
          <input value={data.titre} onChange={e => ch('titre', e.target.value)}
            placeholder="ex : Les circuits RC" style={IS(!data.titre?.trim())} autoFocus />
        </div>

        {/* Sous-titre + Durée */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: `${color}99`, fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>
              SOUS-TITRE
            </label>
            <input value={data.sousTitre} onChange={e => ch('sousTitre', e.target.value)}
              placeholder="ex : Chapitre 1" style={IS()} />
          </div>
          <div>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: `${color}99`, fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>
              DURÉE
            </label>
            <input value={data.duree} onChange={e => ch('duree', e.target.value)}
              placeholder="ex : 1h 30min" style={IS()} />
          </div>
        </div>

        {/* URL Vidéo */}
        <div>
          <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: `${color}99`, fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>
            URL VIDÉO
          </label>
          <input value={data.videoUrl} onChange={e => ch('videoUrl', e.target.value)}
            placeholder="https://youtube.com/watch?v=..." style={IS()} />
        </div>

        {/* URL Image */}
        <div>
          <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: `${color}99`, fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>
            IMAGE (optionnel)
          </label>
          <input value={data.imageUrl} onChange={e => ch('imageUrl', e.target.value)}
            placeholder="https://..." style={IS()} />
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: `${color}99`, fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>
            DESCRIPTION
          </label>
          <textarea value={data.description} onChange={e => ch('description', e.target.value)}
            placeholder="Résumé du contenu…" rows={2}
            style={{ ...IS(), resize: 'vertical', lineHeight: 1.5 }} />
        </div>

        {/* Type + Disponible */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: `${color}88`, fontFamily: 'Outfit,sans-serif' }}>TYPE :</span>
          {SESSION_TYPES.map(t => {
            const c = SESSION_TYPE_COLORS[t];
            const active = data.typeSeance === t;
            return (
              <button key={t} onClick={() => ch('typeSeance', t)} style={{
                padding: '3px 10px', borderRadius: 50, fontSize: 10,
                fontFamily: 'Outfit,sans-serif', fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${active ? c.border : 'rgba(255,255,255,0.08)'}`,
                background: active ? c.bg : 'transparent',
                color: active ? c.color : 'rgba(148,163,184,0.4)',
              }}>
                {SESSION_TYPE_LABELS[t]}
              </button>
            );
          })}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontFamily: 'Outfit,sans-serif' }}>Disponible</span>
            <Toggle value={!!data.disponible} onChange={v => ch('disponible', v)} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '9px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
            color: 'rgba(148,163,184,0.55)', fontFamily: 'Outfit,sans-serif',
            fontWeight: 600, fontSize: 12, cursor: 'pointer',
          }}>Annuler</button>
          <button
            onClick={() => { if (!data.titre?.trim()) return; onSave(data); }}
            disabled={!data.titre?.trim()}
            style={{
              flex: 2, padding: '9px', borderRadius: 12, border: 'none',
              background: data.titre?.trim()
                ? `linear-gradient(135deg, ${color}, #f4d677)`
                : 'rgba(255,255,255,0.06)',
              color: data.titre?.trim() ? '#0a1628' : 'rgba(255,255,255,0.2)',
              fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 12,
              cursor: data.titre?.trim() ? 'pointer' : 'not-allowed',
            }}>
            💾 Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SÉANCE CARD
═══════════════════════════════════════════════════════════════════ */
const SeanceCard = ({ seance, color, onEdit, onDelete, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const real = seance.disponible && seance.videoUrl;
  const type = seance.typeSeance || 'cours';
  const tc = SESSION_TYPE_COLORS[type] || SESSION_TYPE_COLORS.cours;

  const BASE = typeof import.meta !== 'undefined' ? (import.meta.env?.VITE_API_URL || 'http://localhost:8080') : 'http://localhost:8080';
  const imgSrc = seance.imageUrl
    ? (seance.imageUrl.startsWith('http') ? seance.imageUrl : `${BASE}/${seance.imageUrl}`)
    : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 22, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,.025)',
        border: `1px solid ${hovered ? color + '33' : 'rgba(212,167,71,.09)'}`,
        transition: 'transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s, border-color .3s',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,.4), 0 0 0 1px ${color}22` : 'none',
        animationDelay: `${delay}ms`, position: 'relative',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        position: 'relative', height: 150, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: imgSrc ? undefined : `linear-gradient(135deg,${color}22 0%,rgba(8,16,30,.95) 100%)`,
      }}>
        {imgSrc && (
          <img src={imgSrc} alt={seance.titre}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(8,16,30,.85))' }} />
        <div style={{
          position: 'relative', zIndex: 1,
          width: 50, height: 50, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem',
          background: real ? `linear-gradient(135deg,${color},#f4d677)` : 'rgba(255,255,255,.06)',
          color: real ? '#0a1628' : '#334155',
          transition: 'transform .25s',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}>
          {real ? '▶' : '🔒'}
        </div>
        <span style={{
          position: 'absolute', top: 12, left: 12, zIndex: 2,
          fontSize: 10, fontWeight: 700, letterSpacing: '.06em',
          padding: '4px 10px', borderRadius: 50,
          fontFamily: 'Inter,sans-serif',
          background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
        }}>
          {SESSION_TYPE_LABELS[type]}
        </span>
        {seance.duree && (
          <span style={{
            position: 'absolute', bottom: 10, right: 12, zIndex: 2,
            fontSize: 10, fontWeight: 600, color: '#94a3b8',
            background: 'rgba(0,0,0,.55)', padding: '3px 9px', borderRadius: 50,
            fontFamily: 'Inter,sans-serif',
          }}>
            {seance.duree}
          </span>
        )}
        {/* ACTION OVERLAY */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: 'rgba(4,9,20,0.65)',
          backdropFilter: 'blur(4px)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity .2s',
          pointerEvents: hovered ? 'auto' : 'none',
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 50, border: 'none',
              background: `linear-gradient(135deg,${color},#f4d677)`,
              color: '#0a1628', fontFamily: 'Sora,sans-serif', fontWeight: 800,
              fontSize: 12, cursor: 'pointer',
              boxShadow: `0 4px 16px ${color}55`,
              transform: hovered ? 'translateY(0)' : 'translateY(6px)',
              transition: 'transform .25s .05s',
            }}
          >
            ✏ Modifier
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 50,
              border: '1px solid rgba(239,68,68,0.4)',
              background: 'rgba(239,68,68,0.15)', color: '#f87171',
              fontFamily: 'Sora,sans-serif', fontWeight: 800,
              fontSize: 12, cursor: 'pointer',
              transform: hovered ? 'translateY(0)' : 'translateY(6px)',
              transition: 'transform .25s .1s',
            }}
          >
            🗑 Supprimer
          </button>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#f1f5f9', fontSize: '.9rem', lineHeight: 1.35, marginBottom: 3 }}>
          {seance.titre}
        </div>
        {seance.sousTitre && (
          <div style={{ fontSize: '.75rem', fontWeight: 600, color, marginBottom: 10, letterSpacing: '.01em' }}>
            {seance.sousTitre}
          </div>
        )}
        {seance.description && (
          <div style={{
            fontSize: '.77rem', color: '#64748b', lineHeight: 1.6, flex: 1, marginBottom: 14,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {seance.description}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: real ? '#4ade80' : '#f87171',
            boxShadow: `0 0 6px ${real ? '#4ade80' : '#f87171'}`,
          }} />
          <span style={{ fontSize: 10, fontFamily: 'Inter,sans-serif', color: real ? '#4ade80' : '#f87171', fontWeight: 600 }}>
            {real ? 'Disponible' : 'Verrouillée'}
          </span>
        </div>
        {real
          ? <a href={seance.videoUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', textAlign: 'center', padding: '9px 0', borderRadius: 14,
              background: `linear-gradient(135deg,${color},#f4d677)`, color: '#0a1628',
              fontSize: '.78rem', fontWeight: 700, textDecoration: 'none',
              fontFamily: 'Inter,sans-serif', letterSpacing: '.03em',
            }}>▶ &nbsp;Voir la vidéo</a>
          : <div style={{
              display: 'block', textAlign: 'center', padding: '9px 0', borderRadius: 14,
              fontSize: '.77rem', color: '#334155',
              background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)',
              fontFamily: 'Inter,sans-serif',
            }}>🔒 &nbsp;Bientôt disponible</div>
        }
      </div>
    </div>
  );
};

/* ─── Add Card ────────────────────────────────────────────────────── */
const AddSeanceCard = ({ color, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        borderRadius: 22, minHeight: 260,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 14, cursor: 'pointer',
        border: `2px dashed ${hovered ? color : color + '44'}`,
        background: hovered ? `${color}0a` : 'rgba(255,255,255,.01)',
        transition: 'all .25s cubic-bezier(.34,1.56,.64,1)',
        transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
      }}
    >
      <div style={{
        width: 54, height: 54, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? `linear-gradient(135deg,${color},#f4d677)` : `${color}18`,
        border: `1.5px solid ${hovered ? 'transparent' : color + '33'}`,
        fontSize: 24, color: hovered ? '#0a1628' : color,
        transition: 'all .25s', boxShadow: hovered ? `0 8px 24px ${color}44` : 'none',
      }}>
        +
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 13, color: hovered ? '#f1f5f9' : 'rgba(148,163,184,0.4)', margin: 0 }}>
          Ajouter une séance
        </p>
        <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: hovered ? color : 'rgba(100,116,139,0.4)', margin: '3px 0 0' }}>
          Cliquez pour créer
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   DELETE CONFIRM
═══════════════════════════════════════════════════════════════════ */
const DeleteConfirm = ({ titre, onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 500,
    background: 'rgba(4,9,20,0.88)', backdropFilter: 'blur(12px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  }}>
    <div style={{
      width: '100%', maxWidth: 380, borderRadius: 24,
      background: 'linear-gradient(145deg,#0d1c30,#080f1e)',
      border: '1px solid rgba(239,68,68,0.2)',
      boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '20px 24px', background: 'rgba(239,68,68,0.07)', borderBottom: '1px solid rgba(239,68,68,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)' }}>⚠</div>
          <div>
            <p style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 15, color: '#f87171', margin: 0 }}>Supprimer ?</p>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: 'rgba(148,163,184,0.4)', margin: '2px 0 0' }}>Action irréversible</p>
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)', marginBottom: 18 }}>
          <p style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 13, color: '#e8eaf0', margin: 0 }}>{titre}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '10px', borderRadius: 12,
            border: '1px solid rgba(196,150,48,0.15)', background: 'rgba(255,255,255,0.02)',
            color: 'rgba(180,190,210,0.55)', fontFamily: 'Outfit,sans-serif',
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}>Annuler</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '10px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg,#b91c1c,#ef4444)',
            color: '#fff', fontFamily: 'Sora,sans-serif',
            fontWeight: 800, fontSize: 13, cursor: 'pointer',
          }}>🗑 Supprimer</button>
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MODULE SECTION
═══════════════════════════════════════════════════════════════════ */
const ModuleSection = ({ module, color, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [deletingSeance, setDeletingSeance] = useState(null);

  const saveSeance = (updated) => {
    const exists = module.seances.find(s => s.id === updated.id);
    const newSeances = exists
      ? module.seances.map(s => s.id === updated.id ? updated : s)
      : [...module.seances, updated];
    onUpdate({ ...module, seances: newSeances });
    setEditingId(null);
    setAddingNew(false);
  };

  const deleteSeance = (id) => {
    onUpdate({ ...module, seances: module.seances.filter(s => s.id !== id) });
    setDeletingSeance(null);
  };

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
        gap: 20,
      }}>
        {module.seances.map((s, i) => (
          editingId === s.id
            ? (
              <SeanceEditForm
                key={`edit-${s.id}`}
                seance={s}
                color={color}
                onSave={saveSeance}
                onCancel={() => setEditingId(null)}
              />
            )
            : (
              <SeanceCard
                key={s.id}
                seance={s}
                color={color}
                delay={i * 50}
                onEdit={() => setEditingId(s.id)}
                onDelete={() => setDeletingSeance(s)}
              />
            )
        ))}
        {addingNew && (
          <SeanceEditForm
            seance={emptySeance()}
            color={color}
            onSave={saveSeance}
            onCancel={() => setAddingNew(false)}
          />
        )}
        {!addingNew && (
          <AddSeanceCard color={color} onClick={() => setAddingNew(true)} />
        )}
      </div>
      {deletingSeance && (
        <DeleteConfirm
          titre={deletingSeance.titre}
          onConfirm={() => deleteSeance(deletingSeance.id)}
          onCancel={() => setDeletingSeance(null)}
        />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MATIÈRE SECTION
═══════════════════════════════════════════════════════════════════ */
const MatiereSection = ({ mat, colorHex, onUpdate }) => {
  const [activeModId, setActiveModId] = useState(mat.modules?.[0]?.id);
  const [editingModId, setEditingModId] = useState(null);
  const [addingModule, setAddingModule] = useState(false);
  const [newModNom, setNewModNom] = useState('');

  const activeMod = mat.modules?.find(m => m.id === activeModId) || mat.modules?.[0];
  const total = mat.modules?.reduce((a, m) => a + (m.seances?.length || 0), 0) || 0;
  const color = mat.color || colorHex || '#d4a747';

  const updateModule = (modId, data) => {
    onUpdate({ ...mat, modules: mat.modules.map(m => m.id === modId ? data : m) });
  };

  const addModule = () => {
    if (!newModNom.trim()) return;
    const m = { ...emptyModule(), nom: newModNom.trim() };
    onUpdate({ ...mat, modules: [...(mat.modules || []), m] });
    setNewModNom('');
    setAddingModule(false);
    setActiveModId(m.id);
  };

  const deleteModule = (modId) => {
    const remaining = mat.modules.filter(m => m.id !== modId);
    onUpdate({ ...mat, modules: remaining });
    if (activeModId === modId) setActiveModId(remaining[0]?.id);
  };

  return (
    <div>
      {/* Matière header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '18px 22px', marginBottom: 20,
        background: 'rgba(255,255,255,.022)',
        border: '1px solid rgba(212,167,71,.09)', borderRadius: 18,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
        }}>
          {mat.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>{mat.nom}</div>
          {mat.description && <div style={{ fontSize: '.76rem', color: '#64748b', marginTop: 2 }}>{mat.description}</div>}
        </div>
        <div style={{
          padding: '6px 14px', borderRadius: 50, fontSize: '.73rem', fontWeight: 600,
          background: `${color}15`, color, border: `1px solid ${color}30`,
          fontFamily: 'Inter,sans-serif', flexShrink: 0,
        }}>
          {total} séance{total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Tabs modules */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
        {mat.modules?.map(m => {
          const isActive = activeModId === m.id;
          const editing = editingModId === m.id;
          return (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {editing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 50, padding: '4px 10px' }}>
                  <input
                    value={m.nom}
                    onChange={e => updateModule(m.id, { ...m, nom: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingModId(null); }}
                    autoFocus
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: '#f1f5f9', fontFamily: 'Inter,sans-serif', fontSize: '.78rem', fontWeight: 600, width: 120 }}
                  />
                  <button onClick={() => setEditingModId(null)} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', fontSize: 12 }}>✓</button>
                  <button onClick={() => deleteModule(m.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 11 }}>✕</button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveModId(m.id)}
                  onDoubleClick={() => setEditingModId(m.id)}
                  title="Double-clic pour renommer"
                  style={{
                    fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: '.78rem',
                    padding: '7px 16px', borderRadius: 50, cursor: 'pointer',
                    border: isActive ? '1px solid transparent' : '1px solid rgba(255,255,255,.07)',
                    display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all .2s',
                    whiteSpace: 'nowrap',
                    background: isActive ? `linear-gradient(135deg,${color},#f4d677)` : 'rgba(255,255,255,.035)',
                    color: isActive ? '#0a1628' : '#64748b',
                    boxShadow: isActive ? `0 6px 20px -4px ${color}55` : 'none',
                  }}
                >
                  {m.icon && <span style={{ fontSize: 14 }}>{m.icon}</span>}
                  {m.nom}
                  <span style={{ fontSize: 10, opacity: .6 }}>({m.seances?.length || 0})</span>
                </button>
              )}
            </div>
          );
        })}

        {addingModule ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,150,48,0.3)', borderRadius: 50, padding: '4px 12px' }}>
            <input
              value={newModNom}
              onChange={e => setNewModNom(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addModule(); if (e.key === 'Escape') { setAddingModule(false); setNewModNom(''); } }}
              placeholder="Nom du module…"
              autoFocus
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e8eaf0', fontFamily: 'Inter,sans-serif', fontSize: '.78rem', width: 140 }}
            />
            <button onClick={addModule} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>✓</button>
            <button onClick={() => { setAddingModule(false); setNewModNom(''); }} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 11 }}>✕</button>
          </div>
        ) : (
          <button
            onClick={() => setAddingModule(true)}
            style={{
              fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: '.76rem',
              padding: '6px 14px', borderRadius: 50, cursor: 'pointer',
              border: '1px dashed rgba(196,150,48,0.3)',
              background: 'transparent', color: 'rgba(196,150,48,0.55)',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,150,48,0.08)'; e.currentTarget.style.color = '#f0c84a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(196,150,48,0.55)'; }}
          >
            + Module
          </button>
        )}
      </div>

      {mat.modules?.length > 0 && (
        <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 10, color: 'rgba(100,116,139,0.5)', marginBottom: 16, marginTop: -14 }}>
          
        </p>
      )}

      {activeMod
        ? <ModuleSection
            key={activeMod.id}
            module={activeMod}
            color={color}
            onUpdate={(data) => updateModule(activeMod.id, data)}
          />
        : mat.modules?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(100,116,139,0.5)', fontFamily: 'Outfit,sans-serif', fontSize: 13 }}>
            Créez un premier module ci-dessus pour commencer à ajouter des séances.
          </div>
        )
      }
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   NIVEAU EDIT PANEL
═══════════════════════════════════════════════════════════════════ */
const NiveauEditPanel = ({ niveau, onUpdate, onClose }) => {
  const [data, setData] = useState({ ...niveau });
  const ch = (k, v) => setData(p => ({ ...p, [k]: v }));

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'rgba(4,9,20,0.88)', backdropFilter: 'blur(14px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 440, borderRadius: 24,
        background: 'linear-gradient(145deg,#0d1c30,#080f1e)',
        border: `1px solid ${data.colorHex || '#d4a747'}44`,
        boxShadow: '0 40px 80px rgba(0,0,0,0.7)', overflow: 'hidden',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${data.colorHex || '#d4a747'}22`, background: `${data.colorHex || '#d4a747'}08`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 15, color: '#f0c84a' }}>
            ⚙ Configurer le niveau
          </span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(239,68,68,0.12)', color: '#f87171', cursor: 'pointer', fontSize: 13 }}>✕</button>
        </div>
        <div style={{ padding: 20, display: 'grid', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>EMOJI</label>
              <select value={data.emoji} onChange={e => ch('emoji', e.target.value)} style={{ ...IS(), width: '100%', padding: '9px 4px', textAlign: 'center', fontSize: 20, cursor: 'pointer' }}>
                {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>LABEL COURT *</label>
              <input value={data.label} onChange={e => ch('label', e.target.value)} placeholder="ex : 1ère Bac" style={IS(!data.label?.trim())} autoFocus />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>LABEL COMPLET</label>
            <input value={data.fullLabel} onChange={e => ch('fullLabel', e.target.value)} placeholder="ex : Première Baccalauréat" style={IS()} />
          </div>
          <div>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 8 }}>COULEUR</label>
            <ColorDots value={data.colorHex} onChange={v => ch('colorHex', v)} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(148,163,184,0.5)', fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Annuler</button>
            <button
              onClick={() => { if (!data.label?.trim()) return; onUpdate(data); onClose(); }}
              disabled={!data.label?.trim()}
              style={{
                flex: 2, padding: '10px', borderRadius: 12, border: 'none',
                background: data.label?.trim() ? `linear-gradient(135deg,${data.colorHex || '#c49630'},#f4d677)` : 'rgba(255,255,255,0.06)',
                color: data.label?.trim() ? '#0a1628' : 'rgba(255,255,255,0.2)',
                fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 13,
                cursor: data.label?.trim() ? 'pointer' : 'not-allowed',
              }}>
              ✓ Appliquer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MATIÈRE EDIT PANEL — inline edit (nom + icône + couleur + supprimer)
═══════════════════════════════════════════════════════════════════ */
const MatiereEditPanel = ({ mat, onUpdate, onDelete, onClose }) => {
  const [data, setData] = useState({ ...mat });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const ch = (k, v) => setData(p => ({ ...p, [k]: v }));

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'rgba(4,9,20,0.88)', backdropFilter: 'blur(14px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 420, borderRadius: 24,
        background: 'linear-gradient(145deg,#0d1c30,#080f1e)',
        border: `1px solid ${data.color || '#d4a747'}44`,
        boxShadow: '0 40px 80px rgba(0,0,0,0.7)', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${data.color || '#d4a747'}22`, background: `${data.color || '#d4a747'}08`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 15, color: '#f0c84a' }}>✏ Modifier la matière</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(239,68,68,0.12)', color: '#f87171', cursor: 'pointer', fontSize: 13 }}>✕</button>
        </div>
        <div style={{ padding: 18, display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>ICÔNE</label>
              <select value={data.icon} onChange={e => ch('icon', e.target.value)} style={{ ...IS(), padding: '9px 4px', textAlign: 'center', fontSize: 20, cursor: 'pointer' }}>
                {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>NOM *</label>
              <input value={data.nom} onChange={e => ch('nom', e.target.value)} placeholder="ex : Physique-Chimie" style={IS(!data.nom?.trim())} autoFocus />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>DESCRIPTION (optionnel)</label>
            <input value={data.description} onChange={e => ch('description', e.target.value)} placeholder="ex : Cours niveau 1ère Bac" style={IS()} />
          </div>
          <div>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 8 }}>COULEUR</label>
            <ColorDots value={data.color} onChange={v => ch('color', v)} />
          </div>

          {/* Zone suppression */}
          {confirmDelete ? (
            <div style={{ padding: '12px 14px', borderRadius: 14, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#f87171', margin: '0 0 10px', fontWeight: 600 }}>
                ⚠ Supprimer « {data.nom} » et tout son contenu ?
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, padding: '8px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(148,163,184,0.5)', fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Non</button>
                <button onClick={() => { onDelete(); onClose(); }} style={{ flex: 1, padding: '8px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#b91c1c,#ef4444)', color: '#fff', fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>Oui, supprimer</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={{
              padding: '8px', borderRadius: 12,
              border: '1px solid rgba(239,68,68,0.2)',
              background: 'rgba(239,68,68,0.06)', color: '#f87171',
              fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 12, cursor: 'pointer',
            }}>
              🗑 Supprimer cette matière
            </button>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(148,163,184,0.5)', fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Annuler</button>
            <button
              onClick={() => { if (!data.nom?.trim()) return; onUpdate(data); onClose(); }}
              disabled={!data.nom?.trim()}
              style={{
                flex: 2, padding: '10px', borderRadius: 12, border: 'none',
                background: data.nom?.trim() ? `linear-gradient(135deg,${data.color || '#c49630'},#f4d677)` : 'rgba(255,255,255,0.06)',
                color: data.nom?.trim() ? '#0a1628' : 'rgba(255,255,255,0.2)',
                fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 13,
                cursor: data.nom?.trim() ? 'pointer' : 'not-allowed',
              }}>✓ Appliquer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MATIÈRE ADD PANEL
═══════════════════════════════════════════════════════════════════ */
const MatiereAddPanel = ({ colorHex, onAdd, onClose }) => {
  const [data, setData] = useState(emptyMatiere());
  const ch = (k, v) => setData(p => ({ ...p, [k]: v }));

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'rgba(4,9,20,0.88)', backdropFilter: 'blur(14px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 420, borderRadius: 24,
        background: 'linear-gradient(145deg,#0d1c30,#080f1e)',
        border: '1px solid rgba(196,150,48,0.3)', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(196,150,48,0.15)', background: 'rgba(196,150,48,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 15, color: '#f0c84a' }}>✨ Nouvelle matière</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(239,68,68,0.12)', color: '#f87171', cursor: 'pointer', fontSize: 13 }}>✕</button>
        </div>
        <div style={{ padding: 18, display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>ICÔNE</label>
              <select value={data.icon} onChange={e => ch('icon', e.target.value)} style={{ ...IS(), padding: '9px 4px', textAlign: 'center', fontSize: 20, cursor: 'pointer' }}>
                {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>NOM *</label>
              <input value={data.nom} onChange={e => ch('nom', e.target.value)} placeholder="ex : Physique-Chimie" style={IS(!data.nom?.trim())} autoFocus />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 4 }}>DESCRIPTION (optionnel)</label>
            <input value={data.description} onChange={e => ch('description', e.target.value)} placeholder="ex : Cours niveau 1ère Bac" style={IS()} />
          </div>
          <div>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 8 }}>COULEUR</label>
            <ColorDots value={data.color} onChange={v => ch('color', v)} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(148,163,184,0.5)', fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Annuler</button>
            <button
              onClick={() => { if (!data.nom?.trim()) return; onAdd(data); onClose(); }}
              disabled={!data.nom?.trim()}
              style={{
                flex: 2, padding: '10px', borderRadius: 12, border: 'none',
                background: data.nom?.trim() ? 'linear-gradient(135deg,#c49630,#f4d677)' : 'rgba(255,255,255,0.06)',
                color: data.nom?.trim() ? '#0a1628' : 'rgba(255,255,255,0.2)',
                fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 13,
                cursor: data.nom?.trim() ? 'pointer' : 'not-allowed',
              }}>+ Ajouter</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
const DistanceCourseManagerSimplified = ({
  niveaux: initialNiveaux = [],
  onSave,
  saving = false,
  saveError = null,
}) => {
  const [niveaux, setNiveaux]           = useState(() => JSON.parse(JSON.stringify(initialNiveaux)));
  const [activeLvlId, setActiveLvlId]   = useState(initialNiveaux[0]?.id || null);
  const [activeMatId, setActiveMatId]   = useState(null);
  // Niveau double-click states
  const [editingNiveauId, setEditingNiveauId] = useState(null); // id niveau en cours d'édition inline (tab)
  const [editingNiveauPanel, setEditingNiveauPanel] = useState(null); // niveau ouvert dans le panel modal
  const [addingNiveau, setAddingNiveau] = useState(false);
  // Matière states
  const [addingMatiere, setAddingMatiere]   = useState(false);
  const [editingMatiereId, setEditingMatiereId] = useState(null); // id matière ouverte dans le panel
  const [saved, setSaved]               = useState(false);

  useEffect(() => {
    if (niveaux.length > 0 && !activeLvlId) setActiveLvlId(niveaux[0].id);
  }, [niveaux]);

  useEffect(() => { setActiveMatId(null); }, [activeLvlId]);

  const activeLvl  = niveaux.find(n => n.id === activeLvlId) || niveaux[0];
  const effMatId   = activeMatId || activeLvl?.matieres?.[0]?.id;
  const activeMat  = activeLvl?.matieres?.find(m => m.id === effMatId) || activeLvl?.matieres?.[0];
  const color      = activeLvl?.colorHex || '#d4a747';

  const updNiveau = (data) => setNiveaux(v => v.map(n => n.id === data.id ? data : n));
  const delNiveau = (id) => {
    const remaining = niveaux.filter(n => n.id !== id);
    setNiveaux(remaining);
    setActiveLvlId(remaining[0]?.id || null);
  };

  const updMatiere = (matData) => {
    setNiveaux(v => v.map(n => n.id === activeLvlId
      ? { ...n, matieres: n.matieres.map(m => m.id === matData.id ? matData : m) }
      : n
    ));
  };

  const addMatiere = (matData) => {
    setNiveaux(v => v.map(n => n.id === activeLvlId
      ? { ...n, matieres: [...(n.matieres || []), matData] }
      : n
    ));
    setActiveMatId(matData.id);
  };

  const delMatiere = (matId) => {
    setNiveaux(v => v.map(n => n.id === activeLvlId
      ? { ...n, matieres: n.matieres.filter(m => m.id !== matId) }
      : n
    ));
    if (effMatId === matId) setActiveMatId(null);
  };

  const totalSeances = niveaux.reduce((a, n) =>
    a + (n.matieres || []).reduce((b, m) =>
      b + (m.modules || []).reduce((c, mo) => c + (mo.seances || []).length, 0), 0), 0);
  const totalDispo = niveaux.reduce((a, n) =>
    a + (n.matieres || []).reduce((b, m) =>
      b + (m.modules || []).reduce((c, mo) =>
        c + (mo.seances || []).filter(s => s.disponible && s.videoUrl).length, 0), 0), 0);

  const handleSave = async () => {
    if (!onSave) return;
    try {
      await onSave(niveaux);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { /* error handled by parent */ }
  };

  // Editing niveau inline in the tab bar
  const editingNiveauData = niveaux.find(n => n.id === editingNiveauId);

  return (
    <div style={{ fontFamily: 'Outfit,sans-serif' }}>

      {/* ── TOP BAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            
          ].map(({ n, l, c }) => (
            <div key={l} style={{
              padding: '6px 14px', borderRadius: 50,
              background: `${c}12`, border: `1px solid ${c}25`,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 14, color: c }}>{n}</span>
              <span style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontWeight: 600, letterSpacing: '.06em' }}>{l.toUpperCase()}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '9px 22px', borderRadius: 50, border: 'none',
            background: saved
              ? 'linear-gradient(135deg,#16a34a,#4ade80)'
              : saving ? 'rgba(196,150,48,0.3)' : 'linear-gradient(135deg,#c49630,#f0c84a)',
            color: saving ? 'rgba(255,255,255,0.4)' : '#0a1628',
            fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 13,
            cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 4px 16px rgba(196,150,48,0.25)',
          }}
        >
          {saving ? '⟳ Enregistrement…' : saved ? '✓ Enregistré !' : ' Enregistrer'}
        </button>
      </div>

      {saveError && (
        <div style={{ padding: '10px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: '#f87171' }}>⚠ {saveError}</span>
        </div>
      )}

      {/* ── TABS NIVEAUX ── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 0,
        borderBottom: '1px solid rgba(196,150,48,0.08)',
        paddingBottom: 0, overflowX: 'auto', alignItems: 'flex-end',
      }}>
        {niveaux.map(n => {
          const isActive = activeLvlId === n.id;
          const isEditing = editingNiveauId === n.id;

          if (isEditing) {
            // ── Inline edit tab ──
            return (
              <div key={n.id} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px 8px',
                background: `${n.colorHex || '#d4a747'}18`,
                border: `1px solid ${n.colorHex || '#d4a747'}44`,
                borderBottom: 'none',
                borderRadius: '10px 10px 0 0',
              }}>
                <select
                  value={n.emoji}
                  onChange={e => updNiveau({ ...n, emoji: e.target.value })}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, cursor: 'pointer', color: '#f1f5f9' }}
                >
                  {EMOJIS.map(em => <option key={em} value={em}>{em}</option>)}
                </select>
                <input
                  value={n.label}
                  onChange={e => updNiveau({ ...n, label: e.target.value })}
                  onKeyDown={e => {
                    if (e.key === 'Enter') setEditingNiveauId(null);
                    if (e.key === 'Escape') setEditingNiveauId(null);
                  }}
                  autoFocus
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    color: '#f1f5f9', fontFamily: 'Outfit,sans-serif',
                    fontSize: '.78rem', fontWeight: 700, width: 90,
                  }}
                />
                {/* Color mini-dots */}
                <div style={{ display: 'flex', gap: 3 }}>
                  {LEVEL_COLORS.slice(0, 5).map(c => (
                    <div key={c.value} onClick={() => updNiveau({ ...n, colorHex: c.value })} style={{
                      width: 10, height: 10, borderRadius: '50%', cursor: 'pointer',
                      background: c.value,
                      border: n.colorHex === c.value ? '1.5px solid #fff' : '1px solid transparent',
                      transform: n.colorHex === c.value ? 'scale(1.3)' : 'scale(1)',
                      transition: 'all .12s',
                    }} />
                  ))}
                </div>
                <button onClick={() => setEditingNiveauId(null)} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', fontSize: 13, fontWeight: 700, padding: 0 }}>✓</button>
                <button onClick={() => { delNiveau(n.id); setEditingNiveauId(null); }} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12, padding: 0 }}>🗑</button>
              </div>
            );
          }

          return (
            <button
              key={n.id}
              onClick={() => setActiveLvlId(n.id)}
              onDoubleClick={() => { setActiveLvlId(n.id); setEditingNiveauId(n.id); }}
              title="Double-clic pour modifier"
              style={{
                padding: '9px 18px 11px', borderRadius: '12px 12px 0 0',
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 12,
                background: isActive ? `${n.colorHex || '#d4a747'}18` : 'transparent',
                color: isActive ? (n.colorHex || '#f0c84a') : 'rgba(148,163,184,0.4)',
                borderBottom: isActive ? `2px solid ${n.colorHex || '#f0c84a'}` : '2px solid transparent',
                transition: 'all .2s',
              }}
            >
              {n.emoji} {n.label || `Niveau`}
            </button>
          );
        })}

        <button onClick={() => setAddingNiveau(true)} style={{
          padding: '9px 14px 11px', borderRadius: '12px 12px 0 0',
          border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
          fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 12,
          background: 'transparent', color: 'rgba(196,150,48,0.4)',
          borderBottom: '2px solid transparent', transition: 'all .2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f0c84a'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(196,150,48,0.4)'; }}
        >
          ＋ Niveau
        </button>
      </div>

      {/* Tip niveaux */}
      {niveaux.length > 0 && (
        <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 10, color: 'rgba(100,116,139,0.4)', margin: '6px 0 0', paddingLeft: 4 }}>
          💡 Double-cliquez sur un niveau pour le modifier ou le supprimer
        </p>
      )}

      {/* ── NIVEAU CONTENT ── */}
      {niveaux.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 52, marginBottom: 14, opacity: .25 }}>🎬</div>
          <p style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16, color: 'rgba(232,234,240,0.22)', marginBottom: 8 }}>
            Aucun niveau configuré
          </p>
          <button onClick={() => setAddingNiveau(true)} style={{
            marginTop: 16, padding: '12px 28px', borderRadius: 50,
            background: 'linear-gradient(135deg,#c49630,#f0c84a)',
            color: '#0a1628', fontFamily: 'Sora,sans-serif', fontWeight: 700,
            fontSize: 13, border: 'none', cursor: 'pointer',
          }}>＋ Créer le premier niveau</button>
        </div>
      ) : activeLvl ? (
        <div style={{
          border: `1px solid ${color}20`, borderTop: 'none', borderRadius: '0 0 20px 20px',
          background: 'rgba(0,0,0,0.12)', padding: '20px 20px 24px',
        }}>

          {/* ── TABS MATIÈRES — double-clic pour éditer ── */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
            {activeLvl.matieres?.map(m => {
              const mc = m.color || color;
              const isActive = effMatId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMatId(m.id)}
                  onDoubleClick={() => { setActiveMatId(m.id); setEditingMatiereId(m.id); }}
                  title="Double-clic pour modifier"
                  style={{
                    padding: '8px 18px', borderRadius: 50, cursor: 'pointer',
                    border: '1.5px solid',
                    fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '.82rem',
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    transition: 'all .25s cubic-bezier(.34,1.56,.64,1)',
                    ...(isActive
                      ? { background: `linear-gradient(135deg,${mc},#f4d677)`, color: '#0a1628', borderColor: 'transparent', boxShadow: `0 6px 20px -4px ${mc}55`, transform: 'translateY(-2px)' }
                      : { background: 'rgba(255,255,255,.04)', color: '#7c8fa8', borderColor: 'rgba(212,167,71,.1)' }
                    ),
                  }}
                >
                  {m.icon} {m.nom}
                  <span style={{ fontSize: 10, opacity: .6 }}>
                    ({(m.modules || []).reduce((a, mo) => a + (mo.seances || []).length, 0)})
                  </span>
                </button>
              );
            })}

            {/* Ajouter matière */}
            <button onClick={() => setAddingMatiere(true)} style={{
              padding: '7px 16px', borderRadius: 50,
              border: '1px dashed rgba(196,150,48,0.3)',
              background: 'transparent', color: 'rgba(196,150,48,0.55)',
              fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,150,48,0.08)'; e.currentTarget.style.color = '#f0c84a'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(196,150,48,0.55)'; }}
            >
              + Matière
            </button>
          </div>

          {/* Tip matières */}
          {activeLvl.matieres?.length > 0 && (
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 10, color: 'rgba(100,116,139,0.45)', marginBottom: 20, marginTop: 0 }}>
            </p>
          )}

          {/* Section matière active */}
          {activeMat
            ? <MatiereSection
                key={`${activeLvlId}-${activeMat.id}`}
                mat={activeMat}
                colorHex={color}
                onUpdate={updMatiere}
              />
            : <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(100,116,139,0.45)', fontFamily: 'Outfit,sans-serif', fontSize: 13 }}>
                Ajoutez une matière pour commencer.
              </div>
          }
        </div>
      ) : null}

      {/* ── MODALS ── */}

      {/* Panel édition matière (double-clic) */}
      {editingMatiereId && activeLvl && (() => {
        const mat = activeLvl.matieres?.find(m => m.id === editingMatiereId);
        if (!mat) return null;
        return (
          <MatiereEditPanel
            mat={mat}
            onUpdate={(data) => { updMatiere(data); setEditingMatiereId(null); }}
            onDelete={() => { delMatiere(editingMatiereId); setEditingMatiereId(null); }}
            onClose={() => setEditingMatiereId(null)}
          />
        );
      })()}

      {/* Panel ajout matière */}
      {addingMatiere && (
        <MatiereAddPanel
          colorHex={color}
          onAdd={addMatiere}
          onClose={() => setAddingMatiere(false)}
        />
      )}

      {/* Panel ajout niveau */}
      {addingNiveau && (
        <NiveauEditPanel
          niveau={emptyNiveau()}
          onUpdate={(data) => {
            setNiveaux(v => [...v, data]);
            setActiveLvlId(data.id);
            setAddingNiveau(false);
          }}
          onClose={() => setAddingNiveau(false)}
        />
      )}
    </div>
  );
};

export { DistanceCourseManagerSimplified };
export default DistanceCourseManagerSimplified;