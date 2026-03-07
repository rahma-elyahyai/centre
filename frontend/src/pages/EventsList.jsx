// src/components/EventsList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/eventService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';

/* ─── Warriors CSS injection ─── */
if (!document.getElementById('warriors-style')) {
  const s = document.createElement('style');
  s.id = 'warriors-style';
  s.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
    .warriors-font  { font-family: 'Outfit', sans-serif; }
    .warriors-title { font-family: 'Sora', sans-serif; }
    .gold-text { background: linear-gradient(135deg,#c49630,#f0c84a); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .card-hover { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(196,150,48,0.18); }
    .btn-gold { background: linear-gradient(135deg,#c49630 0%,#f0c84a 100%); transition: all 0.2s; }
    .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(196,150,48,0.35); }
    .input-warriors { background: rgba(255,255,255,0.04); border: 1px solid rgba(196,150,48,0.15); color: #e8eaf0; font-family:'Outfit',sans-serif; transition: border-color 0.2s, box-shadow 0.2s; }
    .input-warriors:focus { outline:none; border-color:rgba(196,150,48,0.55); box-shadow:0 0 0 3px rgba(196,150,48,0.08); }
    .input-warriors::placeholder { color:rgba(148,163,184,0.35); }
    select.input-warriors option { background:#0d1c30; color:#e8eaf0; }
    .scrollbar-warriors::-webkit-scrollbar { width:4px; }
    .scrollbar-warriors::-webkit-scrollbar-track { background:transparent; }
    .scrollbar-warriors::-webkit-scrollbar-thumb { background:rgba(196,150,48,0.2); border-radius:4px; }
    @keyframes fadeInUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }
    .animate-in { animation: fadeInUp 0.35s ease forwards; }
    @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .shimmer { animation: shimmer 1.6s ease-in-out infinite; }
    @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.4);opacity:0.7;} }
    .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
    .toggle-track { position:relative; width:40px; height:22px; background:rgba(255,255,255,0.08); border-radius:11px; transition:background 0.2s; cursor:pointer; }
    .toggle-track.on { background:linear-gradient(135deg,#c49630,#f0c84a); }
    .toggle-thumb { position:absolute; top:3px; left:3px; width:16px; height:16px; background:#fff; border-radius:50%; transition:transform 0.2s; box-shadow:0 1px 4px rgba(0,0,0,0.3); }
    .toggle-track.on .toggle-thumb { transform:translateX(18px); }
  `;
  document.head.appendChild(s);
}

/* ─── Constants ─── */
const EVENT_TYPES = [
  { value:'Conférence',  emoji:'🎤', grad:'from-violet-500 to-purple-600',  raw:'rgba(139,92,246,' },
  { value:'Atelier',     emoji:'🛠️', grad:'from-blue-500 to-cyan-500',      raw:'rgba(59,130,246,' },
  { value:'Compétition', emoji:'🏆', grad:'from-yellow-400 to-orange-500',  raw:'rgba(234,179,8,'  },
  { value:'Sortie',      emoji:'🚌', grad:'from-green-400 to-emerald-500',  raw:'rgba(34,197,94,'  },
  { value:'Réunion',     emoji:'🤝', grad:'from-slate-400 to-slate-600',    raw:'rgba(100,116,139,'},
  { value:'Cérémonie',   emoji:'🎓', grad:'from-[#c49630] to-[#f0c84a]',   raw:'rgba(196,150,48,' },
  { value:'Autre',       emoji:'📌', grad:'from-gray-400 to-gray-600',      raw:'rgba(156,163,175,'},
];

const COVER_EMOJIS = ['📅','🎤','🛠️','🏆','🚌','🤝','🎓','💻','🔒','🤖','🎨','📚','🌟','🎭','🎵','🏃','🌍','💡','🔬','🏅'];

const STATUS_CFG = {
  'Planifié': { bg:'rgba(59,130,246,0.1)',  border:'rgba(59,130,246,0.2)',  color:'#60a5fa', dot:'#3b82f6' },
  'En cours': { bg:'rgba(34,197,94,0.1)',   border:'rgba(34,197,94,0.2)',   color:'#4ade80', dot:'#22c55e' },
  'Terminé':  { bg:'rgba(100,116,139,0.1)', border:'rgba(100,116,139,0.2)', color:'#94a3b8', dot:'#64748b' },
  'Annulé':   { bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.2)',   color:'#f87171', dot:'#ef4444' },
};

const getType = (type) => EVENT_TYPES.find(t => t.value === type) || EVENT_TYPES[6];

const fillColor = (pct) =>
  pct >= 90 ? 'linear-gradient(90deg,#b91c1c,#ef4444)'
  : pct >= 70 ? 'linear-gradient(90deg,#c49630,#f0c84a)'
  : 'linear-gradient(90deg,#16a34a,#4ade80)';

const daysUntil = (date) => Math.ceil((new Date(date) - new Date()) / 86400000);

/* ══════════════════════════════════════════════════════════════ */
/*  EVENT CARD                                                   */
/* ══════════════════════════════════════════════════════════════ */
const EventCard = ({ ev, onDetails, onEdit, onDelete, index }) => {
  const tc  = getType(ev.eventType);
  const sc  = STATUS_CFG[ev.status] || STATUS_CFG['Planifié'];
  const pct = ev.maxParticipants ? Math.min(100, Math.round((ev.registeredCount / ev.maxParticipants) * 100)) : null;
  const days = daysUntil(ev.eventDate);
  const upcoming = days >= 0 && ev.status === 'Planifié';

  return (
    <div
      className="card-hover animate-in rounded-2xl flex flex-col overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(145deg, rgba(13,24,44,0.95) 0%, rgba(8,15,30,0.9) 100%)',
        border: '1px solid rgba(196,150,48,0.1)',
        animationDelay: `${index * 55}ms`,
      }}
      onClick={() => onDetails(ev)}
    >
      {/* Color stripe */}
      <div className={`h-0.5 bg-gradient-to-r ${tc.grad}`} />

      <div className="p-5 flex flex-col gap-3.5 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          {/* Emoji */}
          <div className="w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${tc.raw}0.12)`, border: `1.5px solid ${tc.raw}0.25)` }}>
            {ev.coverEmoji || tc.emoji}
          </div>

          {/* Status + countdown */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot flex-shrink-0" style={{ background: sc.dot }} />
              <span className="warriors-font text-[10px] font-semibold" style={{ color: sc.color }}>{ev.status}</span>
            </div>
            {upcoming && (
              <span className="warriors-font text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(180,190,210,0.4)' }}>
                {days === 0 ? "Aujourd'hui" : days === 1 ? 'Demain' : `dans ${days}j`}
              </span>
            )}
          </div>
        </div>

        {/* Title + type */}
        <div>
          <h3 className="warriors-title font-bold text-sm leading-snug line-clamp-2 mb-2" style={{ color: '#e8eaf0' }}>{ev.title}</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="warriors-font text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${tc.raw}0.1)`, border: `1px solid ${tc.raw}0.2)`, color: `${tc.raw}0.9)` }}>
              {tc.emoji} {ev.eventType}
            </span>
            {ev.entryFee > 0 && (
              <span className="warriors-font text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(196,150,48,0.1)', border: '1px solid rgba(196,150,48,0.2)', color: '#f0c84a' }}>
                {ev.entryFee} MAD
              </span>
            )}
            {!ev.isPublic && (
              <span className="warriors-font text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(148,163,184,0.45)' }}>
                🔒 Privé
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(196,150,48,0.1),transparent)' }} />

        {/* Info rows */}
        <div className="space-y-1.5">
          {[
            { icon: '📍', val: ev.location },
            { icon: '◷', val: new Date(ev.eventDate).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }) + (ev.startTime ? ` · ${ev.startTime}` : '') },
            ...(ev.organizerName ? [{ icon: '✦', val: ev.organizerName }] : []),
          ].map(({ icon, val }) => (
            <div key={icon} className="flex items-center gap-2">
              <span className="text-[11px] flex-shrink-0 w-4 text-center" style={{ color: 'rgba(196,150,48,0.4)' }}>{icon}</span>
              <span className="warriors-font text-[12px] truncate" style={{ color: 'rgba(180,190,210,0.5)' }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Fill bar */}
        {pct !== null && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="warriors-font text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>PARTICIPANTS</span>
              <span className="warriors-font text-[11px] font-semibold" style={{ color: pct >= 90 ? '#f87171' : pct >= 70 ? '#f0c84a' : '#4ade80' }}>
                {ev.registeredCount}/{ev.maxParticipants} <span style={{ color:'rgba(148,163,184,0.3)' }}>({pct}%)</span>
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
              <div className="h-full rounded-full" style={{ width:`${pct}%`, background: fillColor(pct), transition:'width 0.6s ease' }} />
            </div>
          </div>
        )}

        {/* Tags */}
        {ev.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {ev.tags.slice(0,3).map(t => (
              <span key={t} className="warriors-font text-[10px] px-2 py-0.5 rounded-full"
                style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', color:'rgba(148,163,184,0.4)' }}>
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t" style={{ borderColor:'rgba(196,150,48,0.08)' }}
          onClick={e => e.stopPropagation()}>
          <button onClick={() => onDetails(ev)}
            className="flex-1 py-2 rounded-xl text-[12px] font-semibold warriors-font transition-all duration-200"
            style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.18)', color:'#60a5fa' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(59,130,246,0.16)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(59,130,246,0.08)'}>
            Détails
          </button>
          <button onClick={() => onEdit(ev)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all flex-shrink-0"
            style={{ background:'rgba(196,150,48,0.08)', border:'1px solid rgba(196,150,48,0.18)', color:'#f0c84a' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(196,150,48,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(196,150,48,0.08)'}>✏</button>
          <button onClick={() => onDelete(ev)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all flex-shrink-0"
            style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.18)', color:'#f87171' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}>✕</button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  CALENDAR ROW                                                 */
/* ══════════════════════════════════════════════════════════════ */
const CalendarRow = ({ ev, onDetails, onEdit, onDelete }) => {
  const tc = getType(ev.eventType);
  const sc = STATUS_CFG[ev.status] || STATUS_CFG['Planifié'];
  const d  = new Date(ev.eventDate);
  return (
    <div className="flex items-center gap-4 px-6 py-4 cursor-pointer group transition-all duration-200"
      style={{ borderBottom:'1px solid rgba(196,150,48,0.05)' }}
      onClick={() => onDetails(ev)}
      onMouseEnter={e => e.currentTarget.style.background='rgba(196,150,48,0.03)'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
      {/* Day number */}
      <div className="w-12 text-center flex-shrink-0">
        <p className="warriors-title text-xl font-black transition-colors" style={{ color:'#e8eaf0' }}>{d.getDate()}</p>
        <p className="warriors-font text-[10px] uppercase tracking-widest" style={{ color:'rgba(196,150,48,0.4)' }}>
          {d.toLocaleDateString('fr-FR',{ weekday:'short' })}
        </p>
      </div>
      {/* Color bar */}
      <div className={`w-0.5 h-10 rounded-full bg-gradient-to-b ${tc.grad} flex-shrink-0`} />
      {/* Emoji */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background:`${tc.raw}0.1)`, border:`1px solid ${tc.raw}0.2)` }}>
        {ev.coverEmoji || tc.emoji}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="warriors-title text-sm font-bold truncate transition-colors" style={{ color:'#e8eaf0' }}>{ev.title}</p>
        <p className="warriors-font text-[11px] truncate mt-0.5" style={{ color:'rgba(180,190,210,0.4)' }}>
          {tc.emoji} {ev.eventType} · {ev.location}{ev.startTime ? ` · ${ev.startTime}` : ''}
        </p>
      </div>
      {/* Status + actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background:sc.bg, border:`1px solid ${sc.border}` }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background:sc.dot }} />
          <span className="warriors-font text-[10px] font-semibold" style={{ color:sc.color }}>{ev.status}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          <button onClick={() => onEdit(ev)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all"
            style={{ background:'rgba(196,150,48,0.08)', border:'1px solid rgba(196,150,48,0.15)', color:'#f0c84a' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(196,150,48,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(196,150,48,0.08)'}>✏</button>
          <button onClick={() => onDelete(ev)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all"
            style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)', color:'#f87171' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}>✕</button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  FORM MODAL                                                   */
/* ══════════════════════════════════════════════════════════════ */
const FormModal = ({ event, loading, onSave, onClose }) => {
  const isEdit = !!event;
  const [activeSection, setActiveSection] = useState(0);
  const sections = ['Identité','Dates & Lieu','Participants','Détails'];
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(() => ({
    title:           event?.title || '',
    description:     event?.description || '',
    eventType:       event?.eventType || '',
    eventDate:       event?.eventDate || '',
    endDate:         event?.endDate || '',
    startTime:       event?.startTime || '',
    endTime:         event?.endTime || '',
    location:        event?.location || '',
    maxParticipants: event?.maxParticipants || '',
    status:          event?.status || 'Planifié',
    isPublic:        event?.isPublic !== false,
    entryFee:        event?.entryFee || 0,
    organizerName:   event?.organizerName || '',
    coverEmoji:      event?.coverEmoji || '📅',
    tags:            event?.tags || [],
  }));

  const h = e => {
    const { name, value, type: t, checked } = e.target;
    setForm(p => ({ ...p, [name]: t === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]:'' }));
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(p => ({ ...p, tags:[...p.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Requis';
    if (!form.eventType) e.eventType = 'Requis';
    if (!form.eventDate) e.eventDate = 'Requis';
    if (!form.location.trim()) e.location = 'Requis';
    return e;
  };

  const submit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : null, entryFee: parseFloat(form.entryFee) || 0, endDate: form.endDate || null, startTime: form.startTime || null, endTime: form.endTime || null });
  };

  const inp = (field) => `input-warriors w-full px-4 py-3 rounded-xl text-sm warriors-font ${errors[field] ? 'border-red-500/60' : ''}`;

  const LabelRow = ({ name, label, req }) => (
    <div className="flex items-center justify-between mb-2">
      <label className="text-[10px] font-semibold tracking-[0.12em] warriors-font" style={{ color:'rgba(196,150,48,0.45)' }}>
        {label}{req && ' *'}
      </label>
      {errors[name] && <span className="text-[10px] warriors-font" style={{ color:'#f87171' }}>{errors[name]}</span>}
    </div>
  );

  const tc = getType(form.eventType);

  const sectionContent = [
    /* 0 — Identité */
    <div key="identity" className="space-y-5">
      {/* Emoji picker */}
      <div>
        <p className="text-[10px] font-semibold tracking-[0.12em] warriors-font mb-3" style={{ color:'rgba(196,150,48,0.45)' }}>ICÔNE DE L'ÉVÉNEMENT</p>
        <div className="flex flex-wrap gap-2 p-4 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.1)' }}>
          {COVER_EMOJIS.map(em => (
            <button key={em} type="button" onClick={() => setForm(p => ({ ...p, coverEmoji:em }))}
              className="w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all duration-150"
              style={{
                background: form.coverEmoji === em ? 'linear-gradient(135deg,#c49630,#f0c84a)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${form.coverEmoji === em ? '#c49630' : 'transparent'}`,
                transform: form.coverEmoji === em ? 'scale(1.12)' : 'scale(1)',
                boxShadow: form.coverEmoji === em ? '0 4px 12px rgba(196,150,48,0.3)' : 'none',
              }}>{em}</button>
          ))}
        </div>
      </div>

      <div>
        <LabelRow name="title" label="TITRE" req />
        <input name="title" value={form.title} onChange={h} placeholder="Nom de l'événement…" className={inp('title')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <LabelRow name="eventType" label="TYPE" req />
          <select name="eventType" value={form.eventType} onChange={h} className={inp('eventType')} style={{ cursor:'pointer' }}>
            <option value="">Sélectionner…</option>
            {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.value}</option>)}
          </select>
        </div>
        <div>
          <LabelRow name="status" label="STATUT" />
          <select name="status" value={form.status} onChange={h} className={inp('status')} style={{ cursor:'pointer' }}>
            {Object.keys(STATUS_CFG).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <LabelRow name="organizerName" label="ORGANISATEUR" />
        <input name="organizerName" value={form.organizerName} onChange={h} placeholder="Nom de l'organisateur" className={inp('organizerName')} />
      </div>
    </div>,

    /* 1 — Dates & Lieu */
    <div key="dates" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <LabelRow name="eventDate" label="DATE DÉBUT" req />
          <input name="eventDate" type="date" value={form.eventDate} onChange={h} className={inp('eventDate')} />
        </div>
        <div>
          <LabelRow name="endDate" label="DATE FIN" />
          <input name="endDate" type="date" value={form.endDate} onChange={h} className={inp('endDate')} />
        </div>
        <div>
          <LabelRow name="startTime" label="HEURE DÉBUT" />
          <input name="startTime" type="time" value={form.startTime} onChange={h} className={inp('startTime')} />
        </div>
        <div>
          <LabelRow name="endTime" label="HEURE FIN" />
          <input name="endTime" type="time" value={form.endTime} onChange={h} className={inp('endTime')} />
        </div>
      </div>
      <div>
        <LabelRow name="location" label="LIEU" req />
        <input name="location" value={form.location} onChange={h} placeholder="Salle, adresse, lien…" className={inp('location')} />
      </div>
    </div>,

    /* 2 — Participants */
    <div key="participants" className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <LabelRow name="maxParticipants" label="CAPACITÉ MAX" />
          <input name="maxParticipants" type="number" min="1" value={form.maxParticipants} onChange={h} placeholder="Illimité si vide" className={inp('maxParticipants')} />
        </div>
        <div>
          <LabelRow name="entryFee" label="FRAIS D'ENTRÉE (MAD)" />
          <input name="entryFee" type="number" min="0" step="0.01" value={form.entryFee} onChange={h} placeholder="0 = gratuit" className={inp('entryFee')} />
        </div>
      </div>

      {/* Toggle public/privé */}
      <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.1)' }}>
        <div>
          <p className="warriors-font text-sm font-semibold" style={{ color:'#e8eaf0' }}>{form.isPublic ? '🌐 Événement public' : '🔒 Événement privé'}</p>
          <p className="warriors-font text-xs mt-0.5" style={{ color:'rgba(148,163,184,0.4)' }}>
            {form.isPublic ? 'Visible par tous les étudiants' : 'Accès restreint uniquement'}
          </p>
        </div>
        <div className={`toggle-track ${form.isPublic ? 'on' : ''}`}
          onClick={() => setForm(p => ({ ...p, isPublic: !p.isPublic }))}>
          <div className="toggle-thumb" />
        </div>
      </div>
    </div>,

    /* 3 — Détails */
    <div key="details" className="space-y-5">
      <div>
        <LabelRow name="description" label="DESCRIPTION" />
        <textarea name="description" value={form.description} onChange={h} rows={5}
          placeholder="Décrivez le programme, les intervenants…"
          className="input-warriors w-full px-4 py-3 rounded-xl text-sm warriors-font resize-none" />
      </div>

      <div>
        <p className="text-[10px] font-semibold tracking-[0.12em] warriors-font mb-3" style={{ color:'rgba(196,150,48,0.45)' }}>TAGS</p>
        <div className="flex gap-2 mb-3">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Ajouter un tag…"
            className="input-warriors flex-1 px-4 py-2.5 rounded-xl text-sm warriors-font" />
          <button type="button" onClick={addTag}
            className="btn-gold px-4 py-2.5 rounded-xl text-sm warriors-title font-bold flex-shrink-0"
            style={{ color:'#0a1628' }}>+</button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.tags.map(tag => (
              <div key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ background:'rgba(196,150,48,0.08)', border:'1px solid rgba(196,150,48,0.15)' }}>
                <span className="warriors-font text-xs" style={{ color:'rgba(196,150,48,0.7)' }}>#{tag}</span>
                <button type="button" onClick={() => setForm(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }))}
                  className="text-[10px] warriors-font transition-colors"
                  style={{ color:'rgba(248,113,113,0.5)' }}
                  onMouseEnter={e => e.currentTarget.style.color='#f87171'}
                  onMouseLeave={e => e.currentTarget.style.color='rgba(248,113,113,0.5)'}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview card */}
      <div className="p-4 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.1)' }}>
        <p className="warriors-font text-[10px] tracking-widest mb-3" style={{ color:'rgba(196,150,48,0.4)' }}>APERÇU</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background:`${tc.raw}0.12)`, border:`1px solid ${tc.raw}0.25)` }}>
            {form.coverEmoji}
          </div>
          <div>
            <p className="warriors-title text-sm font-bold" style={{ color:'#e8eaf0' }}>{form.title || 'Titre de l\'événement'}</p>
            <p className="warriors-font text-xs mt-0.5" style={{ color:'rgba(196,150,48,0.5)' }}>
              {form.eventType || 'Type'} · {form.location || 'Lieu'}
            </p>
          </div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background:'rgba(4,9,20,0.9)', backdropFilter:'blur(16px)' }}>
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl animate-in"
        style={{ background:'linear-gradient(145deg,#0d1c30 0%,#080f1e 100%)', border:'1px solid rgba(196,150,48,0.2)', boxShadow:'0 40px 100px rgba(0,0,0,0.7)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0"
          style={{ borderBottom:'1px solid rgba(196,150,48,0.1)', background:'rgba(196,150,48,0.03)' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{form.coverEmoji}</span>
            <div>
              <h2 className="warriors-title text-lg font-bold" style={{ color:'#f0c84a' }}>
                {isEdit ? 'Modifier l\'événement' : 'Nouvel événement'}
              </h2>
              <p className="warriors-font text-xs mt-0.5" style={{ color:'rgba(148,163,184,0.4)' }}>
                Étape {activeSection+1} sur {sections.length} — {sections[activeSection]}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ border:'1px solid rgba(196,150,48,0.15)', color:'rgba(148,163,184,0.5)', background:'rgba(255,255,255,0.02)' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(196,150,48,0.1)'; e.currentTarget.style.color='#f0c84a'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.color='rgba(148,163,184,0.5)'; }}>
            ✕
          </button>
        </div>

        {/* Stepper */}
        <div className="flex px-7 pt-5 gap-2 flex-shrink-0">
          {sections.map((s,i) => (
            <button key={s} type="button" onClick={() => setActiveSection(i)} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full h-1 rounded-full transition-all duration-300"
                style={{ background: i <= activeSection ? 'linear-gradient(90deg,#c49630,#f0c84a)' : 'rgba(196,150,48,0.1)' }} />
              <span className="warriors-font text-[10px] font-medium"
                style={{ color: i === activeSection ? '#f0c84a' : 'rgba(148,163,184,0.3)' }}>{s}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-warriors px-7 py-6">
            {sectionContent[activeSection]}
          </div>
          <div className="px-7 py-5 flex gap-3 flex-shrink-0"
            style={{ borderTop:'1px solid rgba(196,150,48,0.1)', background:'rgba(196,150,48,0.02)' }}>
            <button type="button"
              onClick={activeSection === 0 ? onClose : () => setActiveSection(p => p-1)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold warriors-font transition-all"
              style={{ border:'1px solid rgba(196,150,48,0.15)', color:'rgba(180,190,210,0.55)', background:'rgba(255,255,255,0.02)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(196,150,48,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}>
              {activeSection === 0 ? 'Annuler' : '← Retour'}
            </button>
            {activeSection < sections.length - 1 ? (
              <button type="button" onClick={() => setActiveSection(p => p+1)}
                className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title btn-gold"
                style={{ color:'#0a1628' }}>Suivant →</button>
            ) : (
              <button type="submit" disabled={loading}
                className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title btn-gold disabled:opacity-50"
                style={{ color:'#0a1628' }}>
                {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer l\'événement'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  DETAILS MODAL                                                */
/* ══════════════════════════════════════════════════════════════ */
const DetailsModal = ({ ev, onClose, onEdit, onDelete }) => {
  if (!ev) return null;
  const tc  = getType(ev.eventType);
  const sc  = STATUS_CFG[ev.status] || STATUS_CFG['Planifié'];
  const pct = ev.maxParticipants ? Math.min(100, Math.round((ev.registeredCount / ev.maxParticipants) * 100)) : null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background:'rgba(4,9,20,0.9)', backdropFilter:'blur(16px)' }}>
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden animate-in"
        style={{ background:'linear-gradient(145deg,#0d1c30,#080f1e)', border:'1px solid rgba(196,150,48,0.15)', boxShadow:'0 40px 100px rgba(0,0,0,0.7)' }}>

        {/* Color stripe */}
        <div className={`h-0.5 bg-gradient-to-r ${tc.grad} flex-shrink-0`} />

        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom:'1px solid rgba(196,150,48,0.1)', background:'rgba(196,150,48,0.03)' }}>
          <h2 className="warriors-title text-lg font-bold" style={{ color:'#f0c84a' }}>Détails de l'événement</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ border:'1px solid rgba(196,150,48,0.15)', color:'rgba(148,163,184,0.5)', background:'rgba(255,255,255,0.02)' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(196,150,48,0.1)'; e.currentTarget.style.color='#f0c84a'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.color='rgba(148,163,184,0.5)'; }}>
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-warriors p-7 space-y-5">
          {/* Hero */}
          <div className="relative p-6 rounded-2xl overflow-hidden"
            style={{ background:`linear-gradient(135deg,${tc.raw}0.1) 0%,transparent 100%)`, border:`1px solid ${tc.raw}0.2)` }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5"
              style={{ background:'radial-gradient(circle,#f0c84a,transparent)', transform:'translate(30%,-30%)' }} />
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                style={{ background:`${tc.raw}0.2)`, border:`2px solid ${tc.raw}0.35)`, boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}>
                {ev.coverEmoji || tc.emoji}
              </div>
              <div className="flex-1">
                <h3 className="warriors-title text-xl font-black" style={{ color:'#e8eaf0' }}>{ev.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="warriors-font text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background:`${tc.raw}0.12)`, border:`1px solid ${tc.raw}0.25)`, color:`${tc.raw}0.9)` }}>
                    {tc.emoji} {ev.eventType}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background:sc.bg, border:`1px solid ${sc.border}` }}>
                    <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background:sc.dot }} />
                    <span className="warriors-font text-[10px] font-semibold" style={{ color:sc.color }}>{ev.status}</span>
                  </div>
                  {!ev.isPublic && <span className="warriors-font text-[10px] px-2 py-0.5 rounded-full" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(148,163,184,0.5)' }}>🔒 Privé</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon:'📍', label:'LIEU',            val: ev.location },
              { icon:'◷',  label:'DATE',            val: new Date(ev.eventDate).toLocaleDateString('fr-FR',{ dateStyle:'long' }) + (ev.endDate && ev.endDate !== ev.eventDate ? ` → ${new Date(ev.endDate).toLocaleDateString('fr-FR',{ dateStyle:'medium' })}` : '') },
              { icon:'🕐', label:'HORAIRE',         val: ev.startTime ? `${ev.startTime}${ev.endTime ? ` → ${ev.endTime}` : ''}` : '—' },
              { icon:'✦',  label:'ORGANISATEUR',    val: ev.organizerName || '—' },
              { icon:'◆',  label:"FRAIS D'ENTRÉE",  val: ev.entryFee > 0 ? `${ev.entryFee} MAD` : 'Gratuit', gold: true },
              { icon:'⊞',  label:'ACCÈS',           val: ev.isPublic ? 'Public' : 'Privé' },
            ].map(({ icon, label, val, gold }) => (
              <div key={label} className="p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.08)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px]" style={{ color:'rgba(196,150,48,0.4)' }}>{icon}</span>
                  <span className="warriors-font text-[9px] font-semibold tracking-[0.15em]" style={{ color:'rgba(196,150,48,0.3)' }}>{label}</span>
                </div>
                <p className="warriors-font text-sm font-medium" style={{ color: gold ? '#f0c84a' : '#c8d0e0' }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Fill bar */}
          {pct !== null && (
            <div className="p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.08)' }}>
              <p className="warriors-font text-[9px] font-semibold tracking-widest mb-3" style={{ color:'rgba(196,150,48,0.35)' }}>PARTICIPANTS</p>
              <div className="flex items-center justify-between mb-2">
                <span className="warriors-title font-bold text-sm" style={{ color:'#e8eaf0' }}>{ev.registeredCount} / {ev.maxParticipants} places</span>
                <span className="warriors-font text-xs font-semibold" style={{ color: pct >= 90 ? '#f87171' : pct >= 70 ? '#f0c84a' : '#4ade80' }}>{pct}% rempli</span>
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full" style={{ width:`${pct}%`, background: fillColor(pct), transition:'width 0.6s ease' }} />
              </div>
            </div>
          )}

          {/* Description */}
          {ev.description && (
            <div className="p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.08)' }}>
              <p className="warriors-font text-[9px] font-semibold tracking-widest mb-3" style={{ color:'rgba(196,150,48,0.35)' }}>DESCRIPTION</p>
              <p className="warriors-font text-sm leading-relaxed" style={{ color:'rgba(180,190,210,0.6)' }}>{ev.description}</p>
            </div>
          )}

          {/* Tags */}
          {ev.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ev.tags.map(tag => (
                <span key={tag} className="warriors-font text-[11px] px-3 py-1 rounded-full"
                  style={{ background:'rgba(196,150,48,0.08)', border:'1px solid rgba(196,150,48,0.15)', color:'rgba(196,150,48,0.6)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="px-7 py-5 flex gap-3 flex-shrink-0"
          style={{ borderTop:'1px solid rgba(196,150,48,0.1)', background:'rgba(196,150,48,0.02)' }}>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold warriors-font transition-all"
            style={{ border:'1px solid rgba(196,150,48,0.15)', color:'rgba(180,190,210,0.55)', background:'rgba(255,255,255,0.02)' }}>
            Fermer
          </button>
          <button onClick={onDelete}
            className="px-5 py-3 rounded-xl text-sm font-semibold warriors-font transition-all"
            style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.18)', color:'#f87171' }}>
            Supprimer
          </button>
          <button onClick={onEdit}
            className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title btn-gold"
            style={{ color:'#0a1628' }}>
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  DELETE MODAL                                                 */
/* ══════════════════════════════════════════════════════════════ */
const DeleteModal = ({ ev, onConfirm, onClose, loading }) => {
  if (!ev) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background:'rgba(4,9,20,0.9)', backdropFilter:'blur(16px)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden animate-in"
        style={{ background:'linear-gradient(145deg,#0d1c30,#080f1e)', border:'1px solid rgba(239,68,68,0.2)', boxShadow:'0 40px 80px rgba(0,0,0,0.6)' }}>
        <div className="px-7 py-5" style={{ background:'rgba(239,68,68,0.06)', borderBottom:'1px solid rgba(239,68,68,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.2)' }}>⚠</div>
            <div>
              <h3 className="warriors-title font-bold text-base" style={{ color:'#f87171' }}>Supprimer cet événement ?</h3>
              <p className="warriors-font text-[11px] mt-0.5" style={{ color:'rgba(148,163,184,0.4)' }}>Action irréversible</p>
            </div>
          </div>
        </div>
        <div className="p-7 space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.1)' }}>
            <span className="text-3xl">{ev.coverEmoji || '📅'}</span>
            <div>
              <p className="warriors-title font-bold text-sm" style={{ color:'#e8eaf0' }}>{ev.title}</p>
              <p className="warriors-font text-xs mt-0.5" style={{ color:'rgba(196,150,48,0.5)' }}>{ev.eventType} · {ev.location}</p>
            </div>
          </div>
          <p className="warriors-font text-xs" style={{ color:'rgba(248,113,113,0.6)' }}>
            Cet événement et toutes ses données seront définitivement supprimés.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold warriors-font transition-all"
              style={{ border:'1px solid rgba(196,150,48,0.15)', color:'rgba(180,190,210,0.55)', background:'rgba(255,255,255,0.02)' }}>
              Annuler
            </button>
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title transition-all"
              style={{ background:'linear-gradient(135deg,#b91c1c,#ef4444)', color:'#fff' }}>
              {loading ? 'Suppression…' : 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                    */
/* ══════════════════════════════════════════════════════════════ */
const EventsList = () => {
  const navigate = useNavigate();
  const [events, setEvents]   = useState([]);
  const [stats, setStats]     = useState({ total:0, planned:0, ongoing:0, finished:0, cancelled:0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType]     = useState('all');
  const [search, setSearch]             = useState('');

  const [showForm, setShowForm]       = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete]   = useState(false);
  const [current, setCurrent]         = useState(null);

  useEffect(() => {
    if (!getAuthToken()) { navigate('/login'); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true); setError('');
      const [evRes, stRes] = await Promise.all([eventAPI.getAllEvents(), eventAPI.getStats()]);
      if (evRes.success) setEvents(evRes.data);
      if (stRes.success) setStats(stRes.data);
    } catch { setError('Impossible de charger les événements.'); }
    finally { setLoading(false); }
  };

  const filtered = events.filter(e => {
    const okS = filterStatus === 'all' || e.status === filterStatus;
    const okT = filterType   === 'all' || e.eventType === filterType;
    const okQ = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase());
    return okS && okT && okQ;
  });

  const byMonth = filtered.reduce((acc, ev) => {
    const key = ev.eventDate?.substring(0,7);
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  const handleSave = async (data) => {
    try {
      setLoading(true);
      const res = current ? await eventAPI.updateEvent(current.id, data) : await eventAPI.createEvent(data);
      if (res.success) { await loadAll(); setShowForm(false); setCurrent(null); }
      else alert(res.message || 'Erreur');
    } catch { alert('Erreur lors de la sauvegarde'); } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await eventAPI.deleteEvent(current.id);
      if (res.success) { await loadAll(); setShowDelete(false); setCurrent(null); }
    } catch { alert('Erreur lors de la suppression'); } finally { setLoading(false); }
  };

  const openEdit   = ev => { setCurrent(ev); setShowForm(true); };
  const openDetail = ev => { setCurrent(ev); setShowDetails(true); };
  const openDelete = ev => { setCurrent(ev); setShowDelete(true); };

  const sidebarW = sidebarCollapsed ? 72 : 240;
  const hasFilters = filterStatus !== 'all' || filterType !== 'all' || search;

  const statCards = [
    { label:'Total',    val: stats.total,     key:'all',      color:'#f0c84a', bg:'rgba(196,150,48,0.08)',  border:'rgba(196,150,48,0.15)',  icon:'◈' },
    { label:'Planifié', val: stats.planned,   key:'Planifié', color:'#60a5fa', bg:'rgba(59,130,246,0.08)',  border:'rgba(59,130,246,0.15)',  icon:'◷' },
    { label:'En cours', val: stats.ongoing,   key:'En cours', color:'#4ade80', bg:'rgba(34,197,94,0.08)',   border:'rgba(34,197,94,0.15)',   icon:'◎' },
    { label:'Terminé',  val: stats.finished,  key:'Terminé',  color:'#94a3b8', bg:'rgba(100,116,139,0.08)', border:'rgba(100,116,139,0.15)', icon:'◌' },
    { label:'Annulé',   val: stats.cancelled, key:'Annulé',   color:'#f87171', bg:'rgba(239,68,68,0.08)',   border:'rgba(239,68,68,0.15)',   icon:'✕' },
  ];

  return (
    <div className="min-h-screen warriors-font" style={{ background:'linear-gradient(145deg,#080f1e 0%,#060c18 100%)' }}>
      {/* Ambient bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute rounded-full" style={{ width:'700px',height:'700px',background:'radial-gradient(circle,rgba(196,150,48,0.04),transparent 70%)',top:'-15%',left:'-10%',filter:'blur(40px)' }} />
        <div className="absolute rounded-full" style={{ width:'500px',height:'500px',background:'radial-gradient(circle,rgba(29,78,216,0.05),transparent 70%)',bottom:'-10%',right:'-5%',filter:'blur(40px)' }} />
        <div className="absolute inset-0" style={{ backgroundImage:'radial-gradient(circle, rgba(196,150,48,0.04) 1px, transparent 1px)', backgroundSize:'42px 42px' }} />
      </div>

      <Sidebar activeItem="events" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <main className="relative z-10 transition-all duration-300" style={{ marginLeft:`${sidebarW}px` }}>

        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-[72px]"
          style={{ background:'rgba(6,12,24,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(196,150,48,0.08)' }}>
          <div className="flex items-center gap-3">
            <span className="warriors-font text-xs" style={{ color:'rgba(148,163,184,0.35)' }}>Admin</span>
            <span style={{ color:'rgba(196,150,48,0.25)' }}>›</span>
            <span className="warriors-title text-sm font-semibold" style={{ color:'#f0c84a' }}>Événements</span>
          </div>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex p-1 rounded-xl gap-1" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(196,150,48,0.1)' }}>
              {[['grid','⊞','Grille'],['calendar','◫','Calendrier']].map(([mode,icon,label]) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold warriors-font transition-all"
                  style={viewMode === mode
                    ? { background:'linear-gradient(135deg,#c49630,#f0c84a)', color:'#0a1628' }
                    : { color:'rgba(148,163,184,0.45)' }}>
                  {icon} <span className="hidden sm:inline ml-1">{label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => { setCurrent(null); setShowForm(true); }}
              className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-2xl warriors-title text-sm font-bold"
              style={{ color:'#0a1628', boxShadow:'0 4px 20px rgba(196,150,48,0.25)' }}>
              <span className="font-black text-base">+</span> Nouvel événement
            </button>
          </div>
        </header>

        <div className="px-8 py-7 space-y-6">

          {/* Page title */}
          <div>
            <h1 className="warriors-title text-3xl font-black" style={{ color:'#e8eaf0' }}>
              Gestion des <span className="gold-text">Événements</span>
            </h1>
            <p className="warriors-font text-sm mt-1" style={{ color:'rgba(148,163,184,0.4)' }}>
              {filtered.length} événement{filtered.length !== 1 ? 's' : ''} · {stats.planned} planifié{stats.planned !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl animate-in"
              style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.15)' }}>
              <span style={{ color:'#f87171' }}>⚠</span>
              <span className="warriors-font text-sm" style={{ color:'rgba(248,113,113,0.75)' }}>{error}</span>
            </div>
          )}

          {/* Stat cards (clickable filters) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statCards.map(({ label, val, key, color, bg, border, icon }) => {
              const active = filterStatus === key;
              return (
                <button key={key} onClick={() => setFilterStatus(active ? 'all' : key)}
                  className="p-4 rounded-2xl text-left transition-all duration-200 animate-in"
                  style={{
                    background: active ? bg : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${active ? border : 'rgba(196,150,48,0.07)'}`,
                    transform: active ? 'translateY(-2px)' : 'none',
                    boxShadow: active ? `0 8px 24px ${bg}` : 'none',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background='rgba(255,255,255,0.02)'; }}>
                  <span className="text-xl" style={{ color }}>{icon}</span>
                  <p className="warriors-title text-2xl font-black mt-2" style={{ color: active ? color : '#e8eaf0' }}>{val}</p>
                  <p className="warriors-font text-[10px] mt-1 tracking-wide" style={{ color:'rgba(148,163,184,0.4)' }}>{label.toUpperCase()}</p>
                </button>
              );
            })}
          </div>

          {/* Filters bar */}
          <div className="flex flex-wrap items-center gap-3 p-5 rounded-2xl"
            style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.1)' }}>
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color:'rgba(196,150,48,0.4)' }}>⊕</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Titre, lieu…"
                className="input-warriors w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="input-warriors px-4 py-2.5 rounded-xl text-sm min-w-[170px]" style={{ cursor:'pointer' }}>
              <option value="all">Tous les types</option>
              {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.value}</option>)}
            </select>
            {hasFilters && (
              <button onClick={() => { setFilterStatus('all'); setFilterType('all'); setSearch(''); }}
                className="px-4 py-2.5 rounded-xl text-xs warriors-font font-medium transition-all whitespace-nowrap"
                style={{ color:'rgba(196,150,48,0.6)', border:'1px solid rgba(196,150,48,0.15)', background:'rgba(196,150,48,0.05)' }}>
                Réinitialiser
              </button>
            )}
          </div>

          {/* ── GRID VIEW ── */}
          {viewMode === 'grid' && (
            loading && events.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_,i) => (
                  <div key={i} className="rounded-2xl p-5 space-y-4" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.07)' }}>
                    {[['70%','h-4'],['50%','h-3'],['100%','h-2.5'],['80%','h-2.5'],['100%','h-1.5']].map(([w,h],j) => (
                      <div key={j} className={`${h} rounded-full shimmer`} style={{ background:'rgba(196,150,48,0.06)', width:w }} />
                    ))}
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
                style={{ background:'rgba(255,255,255,0.01)', border:'1px solid rgba(196,150,48,0.07)' }}>
                <span className="text-6xl mb-4 opacity-20">📅</span>
                <p className="warriors-title font-bold text-lg" style={{ color:'rgba(232,234,240,0.25)' }}>Aucun événement trouvé</p>
                <p className="warriors-font text-sm mt-1" style={{ color:'rgba(148,163,184,0.25)' }}>Ajustez vos filtres ou créez un événement</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((ev, i) => (
                  <EventCard key={ev.id} ev={ev} index={i} onDetails={openDetail} onEdit={openEdit} onDelete={openDelete} />
                ))}
              </div>
            )
          )}

          {/* ── CALENDAR VIEW ── */}
          {viewMode === 'calendar' && (
            Object.keys(byMonth).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
                style={{ background:'rgba(255,255,255,0.01)', border:'1px solid rgba(196,150,48,0.07)' }}>
                <span className="text-6xl mb-4 opacity-20">◫</span>
                <p className="warriors-title font-bold text-lg" style={{ color:'rgba(232,234,240,0.25)' }}>Calendrier vide</p>
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(byMonth).sort().map(([month, evs], gi) => {
                  const [year, m] = month.split('-');
                  const monthName = new Date(year, parseInt(m)-1).toLocaleDateString('fr-FR',{ month:'long', year:'numeric' });
                  return (
                    <div key={month} className="rounded-2xl overflow-hidden animate-in" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.1)', animationDelay:`${gi*80}ms` }}>
                      {/* Month header */}
                      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:'1px solid rgba(196,150,48,0.08)', background:'rgba(196,150,48,0.03)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-6 rounded-full" style={{ background:'linear-gradient(180deg,#c49630,#f0c84a)' }} />
                          <h2 className="warriors-title text-base font-bold capitalize" style={{ color:'#c8a84a' }}>◫ {monthName}</h2>
                        </div>
                        <span className="warriors-font text-[11px] px-2.5 py-0.5 rounded-full"
                          style={{ background:'rgba(196,150,48,0.1)', border:'1px solid rgba(196,150,48,0.18)', color:'rgba(196,150,48,0.6)' }}>
                          {evs.length} événement{evs.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      {evs.map(ev => (
                        <CalendarRow key={ev.id} ev={ev} onDetails={openDetail} onEdit={openEdit} onDelete={openDelete} />
                      ))}
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </main>

      {/* Modals */}
      {showForm && (
        <FormModal event={current} loading={loading} onSave={handleSave}
          onClose={() => { setShowForm(false); setCurrent(null); }} />
      )}
      {showDetails && current && (
        <DetailsModal ev={current}
          onClose={() => { setShowDetails(false); setCurrent(null); }}
          onEdit={() => { setShowDetails(false); setShowForm(true); }}
          onDelete={() => { setShowDetails(false); setShowDelete(true); }} />
      )}
      {showDelete && current && (
        <DeleteModal ev={current} loading={loading} onConfirm={handleDelete}
          onClose={() => { setShowDelete(false); setCurrent(null); }} />
      )}
    </div>
  );
};

export default EventsList;