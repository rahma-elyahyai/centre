// ═══════════════════════════════════════════════════════════════════
//  DistanceCourseManager.js
//  Gestion complète des cours à distance (admin)
//  Compatible avec /api/cours/niveaux (GET + POST)
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
  cours:     { bg: 'rgba(99,102,241,.15)',  color: '#a5b4fc', border: 'rgba(99,102,241,.3)' },
  exercices: { bg: 'rgba(212,167,71,.15)',  color: '#fbbf24', border: 'rgba(212,167,71,.3)' },
  td:        { bg: 'rgba(16,185,129,.15)',  color: '#6ee7b7', border: 'rgba(16,185,129,.3)' },
};

/* ─── Helpers ────────────────────────────────────────────────────── */
const uid = () => '_' + Math.random().toString(36).slice(2, 9);

const emptySeance = () => ({
  id: null, titre: '', sousTitre: '', duree: '',
  videoUrl: '', imageUrl: '', description: '',
  typeSeance: 'cours', disponible: false,
  tempId: uid(),
});

const emptyModule = () => ({ id: null,tempId: uid(), nom: '', icon: '📖', seances: [] });

const emptyMatiere = () => ({
  id: null,tempId: uid(), nom: '', icon: '📘', color: '#d4a747',
  description: '', modules: [],
});

const emptyNiveau = () => ({
  id: null,tempId: uid(), label: '', fullLabel: '',
  emoji: '📘', colorHex: '#d4a747', matieres: [],
});

/* ─── Styles partagés ───────────────────────────────────────────── */
const IS = (err = false) => ({
  width: '100%', padding: '10px 14px', borderRadius: 12,
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${err ? 'rgba(248,113,113,0.55)' : 'rgba(196,150,48,0.18)'}`,
  color: '#e8eaf0', fontSize: 13, fontFamily: 'Outfit,sans-serif',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color .2s',
});

/* ─── Micro-composants ───────────────────────────────────────────── */

const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    role="switch" aria-checked={value}
    style={{
      width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
      position: 'relative', flexShrink: 0, transition: 'background .25s',
      background: value ? 'linear-gradient(135deg,#16a34a,#4ade80)' : 'rgba(255,255,255,0.08)',
      border: `1px solid ${value ? '#4ade80' : 'rgba(255,255,255,0.12)'}`,
      boxShadow: value ? '0 0 10px rgba(74,222,128,0.3)' : 'none',
    }}
  >
    <div style={{
      width: 16, height: 16, borderRadius: '50%', background: '#fff',
      position: 'absolute', top: 2,
      left: value ? 20 : 2,
      transition: 'left .2s cubic-bezier(.34,1.56,.64,1)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
    }} />
  </div>
);

const TypeTag = ({ type, active, onClick }) => {
  const c = SESSION_TYPE_COLORS[type] || SESSION_TYPE_COLORS.cours;
  return (
    <button type="button" onClick={onClick} style={{
      padding: '4px 12px', borderRadius: 50, fontSize: 11,
      fontFamily: 'Outfit,sans-serif', fontWeight: 700, cursor: 'pointer',
      border: `1px solid ${active ? c.border : 'rgba(196,150,48,0.15)'}`,
      background: active ? c.bg : 'rgba(255,255,255,0.03)',
      color: active ? c.color : 'rgba(148,163,184,0.45)',
      transition: 'all .15s',
    }}>
      {SESSION_TYPE_LABELS[type]}
    </button>
  );
};

const IconPicker = ({ value, onChange, options, size = 18 }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{ ...IS(), width: 52, padding: '8px 4px', textAlign: 'center', fontSize: size, cursor: 'pointer' }}
  >
    {options.map(e => <option key={e} value={e}>{e}</option>)}
  </select>
);

const ColorDots = ({ value, onChange, colors = LEVEL_COLORS }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
    {colors.map(c => (
      <div
        key={c.value}
        onClick={() => onChange(c.value)}
        title={c.label}
        style={{
          width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
          background: c.value, flexShrink: 0, transition: 'all .15s',
          border: value === c.value ? '3px solid #fff' : '2px solid transparent',
          boxShadow: value === c.value ? `0 0 10px ${c.value}88` : 'none',
          transform: value === c.value ? 'scale(1.15)' : 'scale(1)',
        }}
      />
    ))}
  </div>
);

const FieldLabel = ({ label, error, required }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.45)', fontFamily: 'Outfit,sans-serif' }}>
      {label}{required && ' *'}
    </span>
    {error && (
      <span style={{ fontSize: 10, color: '#f87171', fontFamily: 'Outfit,sans-serif', display: 'flex', alignItems: 'center', gap: 3 }}>
        ⚠ {error}
      </span>
    )}
  </div>
);

const SectionDivider = ({ label, count }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 10px' }}>
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.35)', fontFamily: 'Outfit,sans-serif', whiteSpace: 'nowrap' }}>
      {label} {count !== undefined && `(${count})`}
    </span>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(196,150,48,0.15), transparent)' }} />
  </div>
);

const AddBtn = ({ onClick, label, dashed = true }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      width: '100%', padding: '9px', borderRadius: 12,
      border: `1px ${dashed ? 'dashed' : 'solid'} rgba(196,150,48,0.22)`,
      background: 'rgba(196,150,48,0.04)', color: 'rgba(196,150,48,0.65)',
      fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
      fontWeight: 600, transition: 'all .15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,150,48,0.1)'; e.currentTarget.style.borderColor = 'rgba(196,150,48,0.45)'; e.currentTarget.style.color = '#f0c84a'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(196,150,48,0.04)'; e.currentTarget.style.borderColor = 'rgba(196,150,48,0.22)'; e.currentTarget.style.color = 'rgba(196,150,48,0.65)'; }}
  >
    + {label}
  </button>
);

const DangerBtn = ({ onClick, label = 'Supprimer', small = false }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: small ? '4px 10px' : '7px 14px',
      borderRadius: small ? 7 : 10,
      border: '1px solid rgba(239,68,68,0.22)',
      background: 'rgba(239,68,68,0.07)', color: '#f87171',
      fontSize: small ? 11 : 12, cursor: 'pointer',
      fontFamily: 'Outfit,sans-serif', flexShrink: 0,
      transition: 'all .15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.16)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.22)'; }}
  >
    {label}
  </button>
);

/* ══════════════════════════════════════════════════════════════════
   SÉANCE FORM
══════════════════════════════════════════════════════════════════ */
const SeanceForm = ({ seance, index, onChange, onRemove }) => {
  const [open, setOpen] = useState(true);
  const ch = (k, v) => onChange({ ...seance, [k]: v });

  const typeC = SESSION_TYPE_COLORS[seance.typeSeance] || SESSION_TYPE_COLORS.cours;
  const isValid = seance.titre?.trim();

  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden', marginBottom: 8,
      border: `1px solid ${open ? 'rgba(196,150,48,0.18)' : 'rgba(196,150,48,0.1)'}`,
      background: 'rgba(255,255,255,0.02)',
      transition: 'border-color .2s',
    }}>
      {/* Header cliquable */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
          cursor: 'pointer', background: open ? 'rgba(196,150,48,0.04)' : 'transparent',
          borderBottom: open ? '1px solid rgba(196,150,48,0.1)' : 'none',
          transition: 'background .2s',
        }}
      >
        {/* Type badge */}
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '.06em', padding: '3px 8px',
          borderRadius: 50, fontFamily: 'Outfit,sans-serif', flexShrink: 0,
          background: typeC.bg, color: typeC.color, border: `1px solid ${typeC.border}`,
        }}>
          {SESSION_TYPE_LABELS[seance.typeSeance] || 'Cours'}
        </span>

        {/* Titre ou placeholder */}
        <span style={{
          flex: 1, fontSize: 12, fontFamily: 'Outfit,sans-serif', fontWeight: 600,
          color: isValid ? '#e8eaf0' : 'rgba(148,163,184,0.35)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {seance.titre?.trim() || `Séance ${index + 1} — sans titre`}
        </span>

        {/* Dispo dot */}
        <span style={{
          width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
          background: (seance.disponible && seance.videoUrl) ? '#4ade80' : '#f87171',
          boxShadow: `0 0 5px ${(seance.disponible && seance.videoUrl) ? '#4ade80' : '#f87171'}`,
        }} />

        <span style={{ color: 'rgba(196,150,48,0.4)', fontSize: 10, transform: open ? 'rotate(180deg)' : '', transition: 'transform .2s' }}>▼</span>

        {/* Supprimer (stoppe la propagation) */}
        <div onClick={e => { e.stopPropagation(); onRemove(); }}>
          <DangerBtn label="✕" small />
        </div>
      </div>

      {/* Corps */}
      {open && (
        <div style={{ padding: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {/* Titre */}
            <div style={{ gridColumn: '1/-1' }}>
              <FieldLabel label="TITRE" required />
              <input
                value={seance.titre || ''}
                onChange={e => ch('titre', e.target.value)}
                placeholder="ex : Les ondes mécaniques progressives"
                style={IS(!seance.titre?.trim())}
              />
            </div>

            {/* Sous-titre */}
            <div>
              <FieldLabel label="SOUS-TITRE" />
              <input value={seance.sousTitre || ''} onChange={e => ch('sousTitre', e.target.value)} placeholder="ex : Chapitre 1" style={IS()} />
            </div>

            {/* Durée */}
            <div>
              <FieldLabel label="DURÉE" />
              <input value={seance.duree || ''} onChange={e => ch('duree', e.target.value)} placeholder="ex : 45 min" style={IS()} />
            </div>

            {/* URL vidéo */}
            <div style={{ gridColumn: '1/-1' }}>
              <FieldLabel label="URL VIDÉO" />
              <input
                value={seance.videoUrl || ''}
                onChange={e => ch('videoUrl', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                style={IS()}
              />
              {seance.videoUrl && !/^https?:\/\/.+/.test(seance.videoUrl) && (
                <p style={{ fontSize: 10, color: '#fbbf24', marginTop: 4, fontFamily: 'Outfit,sans-serif' }}>
                  ⚠ L'URL doit commencer par https://
                </p>
              )}
            </div>

            {/* URL image */}
            <div style={{ gridColumn: '1/-1' }}>
              <FieldLabel label="URL IMAGE (optionnel)" />
              <input value={seance.imageUrl || ''} onChange={e => ch('imageUrl', e.target.value)} placeholder="https://..." style={IS()} />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1/-1' }}>
              <FieldLabel label="DESCRIPTION (optionnel)" />
              <textarea
                value={seance.description || ''}
                onChange={e => ch('description', e.target.value)}
                placeholder="Résumé du contenu de la séance…"
                rows={2}
                style={{ ...IS(), resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>
          </div>

          {/* Type + Disponible */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            <span style={{ fontSize: 10, color: 'rgba(196,150,48,0.4)', fontWeight: 700, letterSpacing: '.08em', fontFamily: 'Outfit,sans-serif' }}>TYPE :</span>
            {SESSION_TYPES.map(t => (
              <TypeTag key={t} type={t} active={seance.typeSeance === t} onClick={() => ch('typeSeance', t)} />
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.5)', fontFamily: 'Outfit,sans-serif' }}>Disponible</span>
              <Toggle value={!!seance.disponible} onChange={v => ch('disponible', v)} />
            </div>
          </div>

          {/* Aperçu lien si disponible */}
          {seance.disponible && seance.videoUrl && /^https?:\/\/.+/.test(seance.videoUrl) && (
            <a
              href={seance.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
                fontSize: 11, color: '#60a5fa', fontFamily: 'Outfit,sans-serif',
                textDecoration: 'none', opacity: .8,
              }}
            >
              🔗 Voir la vidéo
            </a>
          )}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MODULE FORM
══════════════════════════════════════════════════════════════════ */
const ModuleForm = ({ module, index, onChange, onRemove }) => {
  const [open, setOpen] = useState(true);
  const ch = (k, v) => onChange({ ...module, [k]: v });

  const addSeance    = () => ch('seances', [...(module.seances || []), emptySeance()]);
  const updSeance    = (id, data) => ch('seances', module.seances.map(s => s.id === id ? data : s));
  const delSeance    = (id) => ch('seances', module.seances.filter(s => s.id !== id));
  const seanceCount  = (module.seances || []).length;
  const dispoCount   = (module.seances || []).filter(s => s.disponible && s.videoUrl).length;

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden', marginBottom: 10,
      border: '1px solid rgba(196,150,48,0.14)',
      background: 'rgba(255,255,255,0.015)',
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
          cursor: 'pointer', transition: 'background .2s',
          background: open ? 'rgba(196,150,48,0.05)' : 'transparent',
          borderBottom: open ? '1px solid rgba(196,150,48,0.1)' : 'none',
        }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>{module.icon || '📖'}</span>
        <span style={{
          flex: 1, fontSize: 13, fontWeight: 700, fontFamily: 'Sora,sans-serif',
          color: module.nom?.trim() ? '#e8eaf0' : 'rgba(148,163,184,0.3)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {module.nom?.trim() || `Module ${index + 1} — sans nom`}
        </span>

        {/* Compteurs */}
        <span style={{ fontSize: 10, color: 'rgba(196,150,48,0.5)', fontFamily: 'Outfit,sans-serif', flexShrink: 0 }}>
          {seanceCount} séance{seanceCount !== 1 ? 's' : ''}
          {seanceCount > 0 && (
            <span style={{ color: '#4ade80', marginLeft: 4 }}>· {dispoCount} dispo</span>
          )}
        </span>

        <span style={{ color: 'rgba(196,150,48,0.4)', fontSize: 10, transform: open ? 'rotate(180deg)' : '', transition: 'transform .2s' }}>▼</span>

        <div onClick={e => { e.stopPropagation(); onRemove(); }}>
          <DangerBtn label="✕" small />
        </div>
      </div>

      {open && (
        <div style={{ padding: 14 }}>
          {/* Nom + Icône */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <IconPicker value={module.icon || '📖'} onChange={v => ch('icon', v)} options={MODULE_ICONS} />
            <div style={{ flex: 1 }}>
              <FieldLabel label="NOM DU MODULE" required />
              <input
                value={module.nom || ''}
                onChange={e => ch('nom', e.target.value)}
                placeholder="ex : Mécanique, Ondes, Chimie organique…"
                style={IS(!module.nom?.trim())}
              />
            </div>
          </div>

          {/* Séances */}
          <SectionDivider label="SÉANCES" count={seanceCount} />
          {(module.seances || []).map((s, i) => (
            <SeanceForm
              key={s.id}
              seance={s}
              index={i}
              onChange={data => updSeance(s.id, data)}
              onRemove={() => delSeance(s.id)}
            />
          ))}
          <AddBtn onClick={addSeance} label="Ajouter une séance" />
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MATIÈRE FORM
══════════════════════════════════════════════════════════════════ */
const MatiereForm = ({ mat, index, onChange, onRemove }) => {
  const [open, setOpen] = useState(true);
  const ch = (k, v) => onChange({ ...mat, [k]: v });

  const addModule    = () => ch('modules', [...(mat.modules || []), emptyModule()]);
  const updModule    = (id, data) => ch('modules', mat.modules.map(m => m.id === id ? data : m));
  const delModule    = (id) => ch('modules', mat.modules.filter(m => m.id !== id));
  const totalSeances = (mat.modules || []).reduce((a, m) => a + (m.seances || []).length, 0);
  const moduleCount  = (mat.modules || []).length;

  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden', marginBottom: 12,
      border: `1px solid ${mat.color ? mat.color + '28' : 'rgba(196,150,48,0.14)'}`,
      background: 'rgba(255,255,255,0.01)',
    }}>
      {/* Header matière */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
          cursor: 'pointer', transition: 'background .2s',
          background: open ? `${mat.color || '#d4a747'}0a` : 'transparent',
          borderBottom: open ? `1px solid ${mat.color ? mat.color + '22' : 'rgba(196,150,48,0.1)'}` : 'none',
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: `${mat.color || '#d4a747'}18`,
          border: `1px solid ${mat.color || '#d4a747'}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>
          {mat.icon || '📘'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 700, fontFamily: 'Sora,sans-serif',
            color: mat.nom?.trim() ? '#f1f5f9' : 'rgba(148,163,184,0.3)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {mat.nom?.trim() || `Matière ${index + 1} — sans nom`}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.4)', fontFamily: 'Outfit,sans-serif', marginTop: 2 }}>
            {moduleCount} module{moduleCount !== 1 ? 's' : ''} · {totalSeances} séance{totalSeances !== 1 ? 's' : ''}
          </div>
        </div>

        <div style={{
          padding: '3px 12px', borderRadius: 50, fontSize: 10, fontWeight: 700,
          background: `${mat.color || '#d4a747'}18`,
          color: mat.color || '#d4a747',
          border: `1px solid ${mat.color || '#d4a747'}30`,
          fontFamily: 'Outfit,sans-serif', flexShrink: 0,
        }}>
          {totalSeances} séances
        </div>

        <span style={{ color: 'rgba(196,150,48,0.4)', fontSize: 10, transform: open ? 'rotate(180deg)' : '', transition: 'transform .2s' }}>▼</span>

        <div onClick={e => { e.stopPropagation(); onRemove(); }}>
          <DangerBtn label="✕" small />
        </div>
      </div>

      {open && (
        <div style={{ padding: 16 }}>
          {/* Icône + Nom + Couleur */}
          <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 10, marginBottom: 10 }}>
            <IconPicker value={mat.icon || '📘'} onChange={v => ch('icon', v)} options={EMOJIS} size={20} />
            <div>
              <FieldLabel label="NOM DE LA MATIÈRE" required />
              <input
                value={mat.nom || ''}
                onChange={e => ch('nom', e.target.value)}
                placeholder="ex : Physique-Chimie, Mathématiques…"
                style={IS(!mat.nom?.trim())}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 12 }}>
            <FieldLabel label="DESCRIPTION (optionnel)" />
            <input
              value={mat.description || ''}
              onChange={e => ch('description', e.target.value)}
              placeholder="ex : Cours de Physique-Chimie niveau 1ère Bac"
              style={IS()}
            />
          </div>

          {/* Couleur */}
          <div style={{ marginBottom: 16 }}>
            <FieldLabel label="COULEUR D'ACCENT" />
            <ColorDots value={mat.color} onChange={v => ch('color', v)} />
          </div>

          {/* Modules */}
          <SectionDivider label="MODULES" count={moduleCount} />
          {(mat.modules || []).map((m, i) => (
            <ModuleForm
              key={m.id}
              module={m}
              index={i}
              onChange={data => updModule(m.id, data)}
              onRemove={() => delModule(m.id)}
            />
          ))}
          <AddBtn onClick={addModule} label="Ajouter un module" />
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   NIVEAU CONFIG PANEL
══════════════════════════════════════════════════════════════════ */
const NiveauPanel = ({ niveau, onUpdate, onDelete, onAddMatiere }) => {
  const ch = (k, v) => onUpdate({ ...niveau, [k]: v });
  const totalSeances = (niveau.matieres || []).reduce((a, mat) =>
    a + (mat.modules || []).reduce((b, m) => b + (m.seances || []).length, 0), 0);
  const matiereCount = (niveau.matieres || []).length;

  const updMatiere = (id, data) =>
    onUpdate({ ...niveau, matieres: niveau.matieres.map(m => m.id === id ? data : m) });
  const delMatiere = (id) =>
    onUpdate({ ...niveau, matieres: niveau.matieres.filter(m => m.id !== id) });

  return (
    <div>
      {/* ─── Config niveau ─── */}
      <div style={{
        background: 'rgba(196,150,48,0.05)', borderRadius: 18, padding: 18,
        border: '1px solid rgba(196,150,48,0.14)', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(196,150,48,0.45)', fontFamily: 'Outfit,sans-serif' }}>
            CONFIGURATION DU NIVEAU
          </span>
          <DangerBtn onClick={onDelete} label="🗑 Supprimer ce niveau" />
        </div>

        {/* Emoji + Labels */}
        <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 1fr', gap: 10, marginBottom: 14 }}>
          <IconPicker value={niveau.emoji || '📘'} onChange={v => ch('emoji', v)} options={EMOJIS} size={20} />
          <div>
            <FieldLabel label="LABEL COURT" required />
            <input
              value={niveau.label || ''}
              onChange={e => ch('label', e.target.value)}
              placeholder="ex : 1ère Bac"
              style={IS(!niveau.label?.trim())}
            />
          </div>
          <div>
            <FieldLabel label="LABEL COMPLET" />
            <input
              value={niveau.fullLabel || ''}
              onChange={e => ch('fullLabel', e.target.value)}
              placeholder="ex : Première Baccalauréat"
              style={IS()}
            />
          </div>
        </div>

        {/* Couleur */}
        <div>
          <FieldLabel label="COULEUR DU NIVEAU" />
          <ColorDots value={niveau.colorHex} onChange={v => ch('colorHex', v)} />
        </div>

        {/* Résumé */}
        <div style={{
          marginTop: 14, padding: '10px 14px', borderRadius: 12,
          background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(196,150,48,0.1)',
          display: 'flex', gap: 20,
        }}>
          {[
            { n: matiereCount,  l: 'matière(s)',  c: niveau.colorHex || '#d4a747' },
            { n: totalSeances,  l: 'séance(s)',   c: '#4ade80' },
          ].map(({ n, l, c }) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: c, fontFamily: 'Sora,sans-serif' }}>{n}</span>
              <span style={{ fontSize: 10, color: 'rgba(148,163,184,0.45)', fontFamily: 'Outfit,sans-serif' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Matières ─── */}
      <SectionDivider label="MATIÈRES" count={matiereCount} />
      {(niveau.matieres || []).length === 0 && (
        <div style={{
          textAlign: 'center', padding: '24px 0', borderRadius: 14,
          border: '1px dashed rgba(196,150,48,0.15)', marginBottom: 10,
        }}>
          <p style={{ color: 'rgba(148,163,184,0.3)', fontSize: 12, fontFamily: 'Outfit,sans-serif' }}>
            Aucune matière — ajoutez-en une ci-dessous
          </p>
        </div>
      )}
      {(niveau.matieres || []).map((mat, i) => (
        <MatiereForm
          key={mat.id}
          mat={mat}
          index={i}
          onChange={data => updMatiere(mat.id, data)}
          onRemove={() => delMatiere(mat.id)}
        />
      ))}
      <AddBtn onClick={onAddMatiere} label="Ajouter une matière à ce niveau" dashed />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   VALIDATION
══════════════════════════════════════════════════════════════════ */
const validateNiveaux = (niveaux) => {
  const errors = [];
  niveaux.forEach((n, ni) => {
    if (!n.label?.trim()) errors.push(`Niveau ${ni + 1} : label manquant`);
    (n.matieres || []).forEach((m, mi) => {
      if (!m.nom?.trim()) errors.push(`Niveau "${n.label || ni + 1}" › Matière ${mi + 1} : nom manquant`);
      (m.modules || []).forEach((mo, moi) => {
        if (!mo.nom?.trim()) errors.push(`"${n.label || ''}" › "${m.nom || ''}" › Module ${moi + 1} : nom manquant`);
        (mo.seances || []).forEach((s, si) => {
          if (!s.titre?.trim()) errors.push(`Module "${mo.nom || ''}" › Séance ${si + 1} : titre manquant`);
        });
      });
    });
  });
  return errors;
};

/* ══════════════════════════════════════════════════════════════════
   MODAL PRINCIPAL
══════════════════════════════════════════════════════════════════ */
export const DistanceCourseManagerModal = ({ onClose, onSave, initialData = [] }) => {
  const [niveaux, setNiveaux]       = useState(() => JSON.parse(JSON.stringify(initialData)));
  const [activeTab, setActiveTab]   = useState(0);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [saveError, setSaveError]   = useState(null);
  const [validErrors, setValidErrors] = useState([]);
  const [showValidPanel, setShowValidPanel] = useState(false);
  const bodyRef = useRef(null);

  // Reset scroll quand on change d'onglet
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  /* ─── CRUD niveaux ─── */
  const addNiveau = () => {
    const n = emptyNiveau();
    setNiveaux(v => [...v, n]);
    setActiveTab(niveaux.length);
  };

  const updNiveau    = (id, data) => setNiveaux(v => v.map(n => n.id === id ? data : n));
  const delNiveau    = (id) => {
    setNiveaux(v => v.filter(n => n.id !== id));
    setActiveTab(prev => Math.max(0, prev - 1));
  };
  const addMatiere   = (nid) => setNiveaux(v => v.map(n =>
    n.id === nid ? { ...n, matieres: [...(n.matieres || []), emptyMatiere()] } : n
  ));

  /* ─── Stats globales ─── */
  const totalSeancesAll = niveaux.reduce((a, n) =>
    a + (n.matieres || []).reduce((b, m) =>
      b + (m.modules || []).reduce((c, mo) => c + (mo.seances || []).length, 0), 0), 0);
  const totalDispoAll = niveaux.reduce((a, n) =>
    a + (n.matieres || []).reduce((b, m) =>
      b + (m.modules || []).reduce((c, mo) =>
        c + (mo.seances || []).filter(s => s.disponible && s.videoUrl).length, 0), 0), 0);

  /* ─── Save ─── */
  const handleSave = async () => {
    const errs = validateNiveaux(niveaux);
    if (errs.length > 0) {
      setValidErrors(errs);
      setShowValidPanel(true);
      return;
    }
    setValidErrors([]);
    setShowValidPanel(false);
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(niveaux);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err?.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  const lvl = niveaux[activeTab];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(4,9,20,0.93)', backdropFilter: 'blur(18px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 900, maxHeight: '96vh',
        display: 'flex', flexDirection: 'column', borderRadius: 28, overflow: 'hidden',
        background: 'linear-gradient(145deg, #0d1c30 0%, #080f1e 100%)',
        border: '1px solid rgba(196,150,48,0.22)',
        boxShadow: '0 50px 120px rgba(0,0,0,0.85)',
      }}>

        {/* ══ HEADER ══ */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid rgba(196,150,48,0.1)',
          background: 'rgba(196,150,48,0.03)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 17, fontWeight: 800, color: '#f0c84a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              🎬 Cours à Distance — Administration
            </h2>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: 'rgba(148,163,184,0.4)', margin: '3px 0 0', display: 'flex', gap: 14 }}>
              <span>{niveaux.length} niveau(x)</span>
              <span>·</span>
              <span>{totalSeancesAll} séance(s)</span>
              <span>·</span>
              <span style={{ color: totalDispoAll > 0 ? '#4ade80' : 'rgba(148,163,184,0.3)' }}>{totalDispoAll} disponible(s)</span>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Validation warning */}
            {validErrors.length > 0 && (
              <button
                type="button"
                onClick={() => setShowValidPanel(v => !v)}
                style={{
                  padding: '6px 12px', borderRadius: 10, border: '1px solid rgba(251,191,36,0.3)',
                  background: 'rgba(251,191,36,0.08)', color: '#fbbf24',
                  fontSize: 11, cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                ⚠ {validErrors.length} erreur{validErrors.length > 1 ? 's' : ''}
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(196,150,48,0.18)',
                background: 'rgba(255,255,255,0.02)', color: 'rgba(148,163,184,0.5)',
                cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = 'rgba(148,163,184,0.5)'; }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ══ VALIDATION PANEL ══ */}
        {showValidPanel && validErrors.length > 0 && (
          <div style={{
            background: 'rgba(251,191,36,0.06)', borderBottom: '1px solid rgba(251,191,36,0.15)',
            padding: '12px 24px', flexShrink: 0,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', fontFamily: 'Outfit,sans-serif', marginBottom: 6 }}>
              ⚠ Champs obligatoires manquants — corrigez avant de sauvegarder :
            </p>
            <ul style={{ margin: 0, padding: '0 0 0 16px', listStyle: 'disc' }}>
              {validErrors.map((e, i) => (
                <li key={i} style={{ fontSize: 11, color: 'rgba(251,191,36,0.75)', fontFamily: 'Outfit,sans-serif', marginBottom: 2 }}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ══ LEVEL TABS ══ */}
        <div style={{
          display: 'flex', gap: 4, padding: '12px 24px 0', flexShrink: 0,
          borderBottom: '1px solid rgba(196,150,48,0.08)',
          overflowX: 'auto', background: 'rgba(0,0,0,0.18)',
        }}
          className="cd-no-scroll"
        >
          {niveaux.map((n, i) => {
            const isActive = activeTab === i;
            const hasError = validateNiveaux([n]).length > 0;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setActiveTab(i)}
                style={{
                  padding: '8px 16px 10px', borderRadius: '12px 12px 0 0',
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 12,
                  transition: 'all .2s',
                  background: isActive ? `${n.colorHex || '#d4a747'}18` : 'transparent',
                  color: isActive ? (n.colorHex || '#f0c84a') : 'rgba(148,163,184,0.4)',
                  borderBottom: isActive ? `2px solid ${n.colorHex || '#f0c84a'}` : '2px solid transparent',
                  position: 'relative',
                }}
              >
                {n.emoji} {n.label || `Niveau ${i + 1}`}
                {hasError && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 6, height: 6, borderRadius: '50%', background: '#fbbf24',
                  }} />
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={addNiveau}
            style={{
              padding: '8px 14px 10px', borderRadius: '12px 12px 0 0',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 12,
              background: 'transparent',
              color: 'rgba(196,150,48,0.4)',
              borderBottom: '2px solid transparent', transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f0c84a'; e.currentTarget.style.background = 'rgba(196,150,48,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(196,150,48,0.4)'; e.currentTarget.style.background = 'transparent'; }}
          >
            ＋ Niveau
          </button>
        </div>

        {/* ══ BODY ══ */}
        <div
          ref={bodyRef}
          style={{ flex: 1, overflowY: 'auto', padding: '22px 24px' }}
          className="scrollbar-warriors"
        >
          {niveaux.length === 0 ? (
            /* État vide */
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 56, marginBottom: 14, opacity: .25 }}>📭</div>
              <p style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16, color: 'rgba(232,234,240,0.22)', marginBottom: 8 }}>
                Aucun niveau configuré
              </p>
              <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: 'rgba(148,163,184,0.25)', marginBottom: 28 }}>
                Commencez par créer un niveau (ex : 1ère Bac, 2ème Bac…)
              </p>
              <button
                type="button"
                onClick={addNiveau}
                style={{
                  padding: '12px 28px', borderRadius: 50,
                  background: 'linear-gradient(135deg, #c49630, #f0c84a)',
                  color: '#0a1628', fontFamily: 'Sora,sans-serif', fontWeight: 700,
                  fontSize: 13, border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(196,150,48,0.3)',
                }}
              >
                ＋ Créer le premier niveau
              </button>
            </div>
          ) : lvl ? (
            <NiveauPanel
              key={lvl.id}
              niveau={lvl}
              onUpdate={(data) => updNiveau(lvl.id, data)}
              onDelete={() => delNiveau(lvl.id)}
              onAddMatiere={() => addMatiere(lvl.id)}
            />
          ) : null}
        </div>

        {/* ══ FOOTER ══ */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid rgba(196,150,48,0.1)',
          background: 'rgba(196,150,48,0.02)', display: 'flex', gap: 10,
          flexShrink: 0, alignItems: 'center',
        }}>
          {/* Erreur sauvegarde */}
          {saveError && (
            <span style={{ flex: 1, fontSize: 11, color: '#f87171', fontFamily: 'Outfit,sans-serif' }}>
              ⚠ {saveError}
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1, padding: '11px', borderRadius: 14,
              border: '1px solid rgba(196,150,48,0.15)', background: 'rgba(255,255,255,0.02)',
              color: 'rgba(180,190,210,0.55)', fontFamily: 'Outfit,sans-serif',
              fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,150,48,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 2, padding: '11px', borderRadius: 14, border: 'none',
              background: saved
                ? 'linear-gradient(135deg, #16a34a, #4ade80)'
                : saving
                  ? 'rgba(196,150,48,0.3)'
                  : 'linear-gradient(135deg, #c49630, #f0c84a)',
              color: saving ? 'rgba(255,255,255,0.5)' : '#0a1628',
              fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 13,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all .3s',
              boxShadow: saved ? '0 4px 20px rgba(74,222,128,0.25)' : '0 4px 20px rgba(196,150,48,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
          >
            {saving ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: 14 }}>⟳</span>
                Enregistrement…
              </>
            ) : saved ? (
              <>✓ Enregistré avec succès !</>
            ) : (
              <>💾 Enregistrer</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .cd-no-scroll::-webkit-scrollbar { display: none; }
        .cd-no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-warriors::-webkit-scrollbar { width: 4px; }
        .scrollbar-warriors::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-warriors::-webkit-scrollbar-thumb { background: rgba(196,150,48,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default DistanceCourseManagerModal;