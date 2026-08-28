// src/components/EventsList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/eventService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';
import {
  Mic, Wrench, Trophy, Bus, Handshake, GraduationCap, Bookmark,
  Clock, PlayCircle, CheckCircle2, XCircle, MapPin, User, Lock,
  Globe, Search, Plus, X, Pencil, Trash2, Eye, AlertTriangle,
  LayoutGrid, CalendarDays, RotateCcw, ChevronLeft, ChevronRight,
  Check, Tag, Calendar as CalendarIcon,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════ */
/*  DESIGN TOKENS — shared across the app                        */
/* ══════════════════════════════════════════════════════════════ */
{
  let s = document.getElementById('sv-design-tokens');
  if (!s) {
    s = document.createElement('style');
    s.id = 'sv-design-tokens';
    document.head.appendChild(s);
  }
  s.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

    :root {
      --sv-bg:            #0A0F1C;
      --sv-surface:       #10172A;
      --sv-surface-2:     #141C32;
      --sv-border:        rgba(255,255,255,0.07);
      --sv-border-strong: rgba(255,255,255,0.14);
      --sv-text:          #E7EAF0;
      --sv-text-dim:      #8B93A6;
      --sv-text-faint:    #5C6478;
      --sv-accent:        #C9A24D;
      --sv-accent-hover:  #D8B563;
      --sv-accent-ink:    #17130A;
      --sv-accent-soft:   rgba(201,162,77,0.12);
      --sv-accent-border: rgba(201,162,77,0.30);
      --sv-success:       #5FAE83;
      --sv-success-soft:  rgba(95,174,131,0.12);
      --sv-success-border:rgba(95,174,131,0.30);
      --sv-warning:       #C99A55;
      --sv-warning-soft:  rgba(201,154,85,0.12);
      --sv-warning-border:rgba(201,154,85,0.30);
      --sv-danger:        #E2574C;
      --sv-danger-soft:   rgba(226,87,76,0.10);
      --sv-danger-border: rgba(226,87,76,0.28);
      --sv-info:          #6AA3D9;
      --sv-info-soft:     rgba(106,163,217,0.12);
      --sv-info-border:   rgba(106,163,217,0.30);
      --sv-radius-sm:     8px;
      --sv-radius:        10px;
      --sv-radius-lg:     14px;
      --sv-shadow:        0 1px 2px rgba(0,0,0,0.4);
      --sv-shadow-md:     0 8px 24px rgba(0,0,0,0.35);
    }

    .sv-root { font-family: 'Inter', sans-serif; }
    .sv-heading { font-family: 'Manrope', sans-serif; letter-spacing: -0.01em; }
    .sv-accent-text { color: var(--sv-accent); }

    .sv-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13px;
      border-radius: var(--sv-radius-sm); border: 1px solid transparent;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
      cursor: pointer; white-space: nowrap;
    }
    .sv-btn-primary { background: var(--sv-accent); color: var(--sv-accent-ink); }
    .sv-btn-primary:hover { background: var(--sv-accent-hover); }
    .sv-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .sv-btn-ghost { background: transparent; border-color: var(--sv-border-strong); color: var(--sv-text-dim); }
    .sv-btn-ghost:hover { border-color: var(--sv-text-faint); color: var(--sv-text); background: rgba(255,255,255,0.02); }
    .sv-btn-info { background: var(--sv-info-soft); border-color: var(--sv-info-border); color: var(--sv-info); }
    .sv-btn-info:hover { background: rgba(106,163,217,0.2); }
    .sv-btn-danger { background: var(--sv-danger); color: #fff; }
    .sv-btn-danger:hover { background: #EB6B60; }
    .sv-btn-danger-soft { background: var(--sv-danger-soft); border-color: var(--sv-danger-border); color: var(--sv-danger); }
    .sv-btn-danger-soft:hover { background: rgba(226,87,76,0.2); }
    .sv-icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: var(--sv-radius-sm);
      border: 1px solid var(--sv-border); background: transparent; color: var(--sv-text-dim);
      transition: background 0.15s, color 0.15s, border-color 0.15s; cursor: pointer;
    }
    .sv-icon-btn:hover { background: rgba(255,255,255,0.04); color: var(--sv-text); border-color: var(--sv-border-strong); }
    .sv-icon-btn.danger:hover { background: var(--sv-danger-soft); color: var(--sv-danger); border-color: var(--sv-danger-border); }

    input.sv-input, select.sv-input, textarea.sv-input {
      background-color: var(--sv-surface-2) !important;
      border: 1px solid var(--sv-border) !important;
      color: var(--sv-text) !important;
      font-family: 'Inter', sans-serif; font-size: 13.5px;
      border-radius: var(--sv-radius-sm); transition: border-color 0.15s;
      appearance: none; -webkit-appearance: none; -moz-appearance: none;
    }
    select.sv-input {
      background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%238B93A6' stroke-width='1.75'%3E%3Cpath d='M6 8l4 4 4-4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
      padding-right: 34px !important;
    }
    input.sv-input::placeholder, textarea.sv-input::placeholder { color: var(--sv-text-faint) !important; }
    input.sv-input:focus, select.sv-input:focus, textarea.sv-input:focus { outline: none; border-color: var(--sv-accent-border) !important; }
    input.sv-input.error, textarea.sv-input.error { border-color: var(--sv-danger-border) !important; }
    select.sv-input option { background: var(--sv-surface); color: var(--sv-text); }
    :root[data-theme="light"] select.sv-input {
      background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%235B6475' stroke-width='1.75'%3E%3Cpath d='M6 8l4 4 4-4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    }

    .sv-card {
      background: var(--sv-surface); border: 1px solid var(--sv-border);
      border-radius: var(--sv-radius-lg); transition: border-color 0.15s;
    }
    .sv-card:hover { border-color: var(--sv-border-strong); }

    .sv-tag {
      display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600;
      padding: 3px 9px; border-radius: 6px; line-height: 1.4;
    }

    .sv-stat-btn { text-align: left; cursor: pointer; transition: border-color 0.15s, background 0.15s; }

    .sv-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
    .sv-scroll::-webkit-scrollbar-track { background: transparent; }
    .sv-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 4px; }

    @keyframes sv-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .sv-in { animation: sv-in 0.22s ease forwards; }
    @keyframes sv-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
    .sv-shimmer { animation: sv-pulse 1.4s ease-in-out infinite; }

    .sv-row:hover { background: rgba(255,255,255,0.02); }
    .sv-row .sv-row-actions { opacity: 0; transition: opacity 0.15s; }
    .sv-row:hover .sv-row-actions { opacity: 1; }

    .sv-toggle { position: relative; width: 38px; height: 21px; background: var(--sv-surface-2); border: 1px solid var(--sv-border-strong); border-radius: 11px; transition: background 0.2s, border-color 0.2s; cursor: pointer; }
    .sv-toggle.on { background: var(--sv-accent); border-color: var(--sv-accent); }
    .sv-toggle-thumb { position: absolute; top: 2px; left: 2px; width: 15px; height: 15px; background: #fff; border-radius: 50%; transition: transform 0.2s; }
    .sv-toggle.on .sv-toggle-thumb { transform: translateX(17px); background: var(--sv-accent-ink); }
  `;
}

/* ══════════════════════════════════════════════════════════════ */
/*  LIGHT THEME OVERRIDE — shared across the app                 */
/* ══════════════════════════════════════════════════════════════ */
{
  let sl = document.getElementById('sv-theme-light');
  if (!sl) {
    sl = document.createElement('style');
    sl.id = 'sv-theme-light';
    document.head.appendChild(sl);
  }
  sl.innerHTML = `
    :root[data-theme="light"] {
      --sv-bg:            #F1F2F6;
      --sv-surface:       #FFFFFF;
      --sv-surface-2:     #F6F7FA;
      --sv-border:        rgba(15,23,42,0.08);
      --sv-border-strong: rgba(15,23,42,0.16);
      --sv-text:          #171B26;
      --sv-text-dim:      #5B6475;
      --sv-text-faint:    #8A93A3;
      --sv-accent:        #B8873A;
      --sv-accent-hover:  #A67830;
      --sv-accent-ink:    #FFFFFF;
      --sv-accent-soft:   rgba(184,135,58,0.12);
      --sv-accent-border: rgba(184,135,58,0.35);
      --sv-success:       #3F8F68;
      --sv-success-soft:  rgba(63,143,104,0.12);
      --sv-success-border:rgba(63,143,104,0.32);
      --sv-warning:       #B07F2E;
      --sv-warning-soft:  rgba(176,127,46,0.12);
      --sv-warning-border:rgba(176,127,46,0.32);
      --sv-danger:        #C43D33;
      --sv-danger-soft:   rgba(196,61,51,0.10);
      --sv-danger-border: rgba(196,61,51,0.30);
      --sv-info:          #3E7FB8;
      --sv-info-soft:     rgba(62,127,184,0.12);
      --sv-info-border:   rgba(62,127,184,0.32);
      --sv-violet:        #7A6BC4;
      --sv-violet-soft:   rgba(122,107,196,0.12);
      --sv-violet-border: rgba(122,107,196,0.32);
      --sv-shadow:        0 1px 2px rgba(15,23,42,0.07);
      --sv-shadow-md:     0 8px 24px rgba(15,23,42,0.10);
    }
    :root[data-theme="light"] select.sv-input option { background: #FFFFFF; color: var(--sv-text); }
    :root[data-theme="light"] .sv-scroll::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.14); }
  `;
}

/* Apply any previously saved theme immediately, on whichever page loads first */
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('sv-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}

/* ─── Constants ─── */
// Stored values (`value`) are unchanged — only the display icon/color are new.
const EVENT_TYPES = [
  { value:'Conférence',  icon: Mic,          color:'#8B93E8' },
  { value:'Atelier',     icon: Wrench,       color:'#6AA3D9' },
  { value:'Compétition', icon: Trophy,       color:'#C99A55' },
  { value:'Sortie',      icon: Bus,          color:'#5FAE83' },
  { value:'Réunion',     icon: Handshake,    color:'#8B93A6' },
  { value:'Cérémonie',   icon: GraduationCap,color:'#C9A24D' },
  { value:'Autre',       icon: Bookmark,     color:'#5C6478' },
];

// Cover emoji is a per-event stored field the user picks explicitly — kept as emoji.
const COVER_EMOJIS = ['📅','🎤','🛠️','🏆','🚌','🤝','🎓','💻','🔒','🤖','🎨','📚','🌟','🎭','🎵','🏃','🌍','💡','🔬','🏅'];

const STATUS_CFG = {
  'Planifié': { color:'var(--sv-info)',    soft:'var(--sv-info-soft)',    border:'var(--sv-info-border)',    icon: Clock },
  'En cours': { color:'var(--sv-success)', soft:'var(--sv-success-soft)', border:'var(--sv-success-border)', icon: PlayCircle },
  'Terminé':  { color:'var(--sv-text-dim)',soft:'rgba(255,255,255,0.04)', border:'var(--sv-border-strong)',  icon: CheckCircle2 },
  'Annulé':   { color:'var(--sv-danger)',  soft:'var(--sv-danger-soft)',  border:'var(--sv-danger-border)',  icon: XCircle },
};

const getType = (type) => EVENT_TYPES.find(t => t.value === type) || EVENT_TYPES[6];

const fillColor = (pct) =>
  pct >= 90 ? 'var(--sv-danger)' : pct >= 70 ? 'var(--sv-accent)' : 'var(--sv-success)';

const daysUntil = (date) => Math.ceil((new Date(date) - new Date()) / 86400000);

const StatusBadge = ({ status }) => {
  const sc = STATUS_CFG[status] || STATUS_CFG['Planifié'];
  const Icon = sc.icon;
  return (
    <span className="sv-tag" style={{ background: sc.soft, border: `1px solid ${sc.border}`, color: sc.color }}>
      <Icon size={11} strokeWidth={2} /> {status}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  EVENT CARD                                                   */
/* ══════════════════════════════════════════════════════════════ */
const EventCard = ({ ev, onDetails, onEdit, onDelete, index }) => {
  const tc  = getType(ev.eventType);
  const pct = ev.maxParticipants ? Math.min(100, Math.round((ev.registeredCount / ev.maxParticipants) * 100)) : null;
  const days = daysUntil(ev.eventDate);
  const upcoming = days >= 0 && ev.status === 'Planifié';

  const eventDateObj = new Date(ev.eventDate);

  return (
    <div className="sv-card sv-in flex flex-col overflow-hidden cursor-pointer" style={{ animationDelay: `${index * 30}ms` }} onClick={() => onDetails(ev)}>

      {/* ── Cover banner ── */}
      <div className="relative h-[132px] flex-shrink-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${tc.color}30 0%, ${tc.color}0D 100%)` }}>
        {/* Oversized watermark icon, bleeding off the edge */}
        <tc.icon size={128} strokeWidth={1} style={{ color: tc.color, opacity: 0.14, position: 'absolute', right: -22, top: -22 }} />

        {/* Top-left: type tag */}
        <span className="sv-tag absolute left-4 top-4" style={{ background: 'rgba(10,15,28,0.55)', border: `1px solid ${tc.color}55`, color: tc.color, backdropFilter: 'blur(4px)' }}>
          <tc.icon size={11} strokeWidth={2} /> {ev.eventType}
        </span>

        {/* Top-right: status + countdown */}
        <div className="absolute right-4 top-4 flex flex-col items-end gap-1.5">
          <StatusBadge status={ev.status} />
          {upcoming && (
            <span className="sv-tag" style={{ background: 'rgba(10,15,28,0.55)', border: '1px solid var(--sv-border-strong)', color: 'var(--sv-text)', backdropFilter: 'blur(4px)' }}>
              {days === 0 ? "Aujourd'hui" : days === 1 ? 'Demain' : `dans ${days}j`}
            </span>
          )}
        </div>

        {/* Bottom-left: cover emoji medallion, sitting on the seam */}
        <div className="absolute left-4 -bottom-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: 'var(--sv-surface)', border: `1px solid ${tc.color}45`, boxShadow: 'var(--sv-shadow-md)' }}>
          {ev.coverEmoji || <tc.icon size={24} strokeWidth={1.75} style={{ color: tc.color }} />}
        </div>

        {/* Bottom-right: date block */}
        <div className="absolute right-4 bottom-3 text-right">
          <p className="sv-heading text-[22px] font-bold leading-none" style={{ color: 'var(--sv-text)' }}>{eventDateObj.getDate()}</p>
          <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--sv-text-dim)' }}>{eventDateObj.toLocaleDateString('fr-FR', { month: 'short' })}</p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-4 pt-8 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="sv-heading font-bold text-[16px] leading-snug line-clamp-2 mb-2" style={{ color: 'var(--sv-text)' }}>{ev.title}</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            {ev.entryFee > 0 && (
              <span className="sv-tag" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)', color: 'var(--sv-accent)' }}>{ev.entryFee} MAD</span>
            )}
            {!ev.isPublic && (
              <span className="sv-tag" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--sv-border-strong)', color: 'var(--sv-text-faint)' }}>
                <Lock size={10} strokeWidth={2} /> Privé
              </span>
            )}
            {ev.tags?.slice(0, 2).map(t => (
              <span key={t} className="sv-tag" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--sv-border)', color: 'var(--sv-text-faint)' }}>#{t}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)', flexShrink: 0 }} />
            <span className="text-[12.5px] truncate" style={{ color: 'var(--sv-text-dim)' }}>{ev.location}</span>
          </div>
          {ev.startTime && (
            <div className="flex items-center gap-1.5">
              <Clock size={13} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)', flexShrink: 0 }} />
              <span className="text-[12.5px]" style={{ color: 'var(--sv-text-dim)' }}>{ev.startTime}</span>
            </div>
          )}
          {ev.organizerName && (
            <div className="flex items-center gap-1.5">
              <User size={13} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)', flexShrink: 0 }} />
              <span className="text-[12.5px] truncate" style={{ color: 'var(--sv-text-dim)' }}>{ev.organizerName}</span>
            </div>
          )}
        </div>

        {pct !== null && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10.5px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>PARTICIPANTS</span>
              <span className="text-[11.5px] font-semibold" style={{ color: fillColor(pct) }}>
                {ev.registeredCount}/{ev.maxParticipants} <span style={{ color: 'var(--sv-text-faint)' }}>({pct}%)</span>
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--sv-surface-2)' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: fillColor(pct), transition: 'width 0.6s ease' }} />
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-3" style={{ borderTop: '1px solid var(--sv-border)' }} onClick={e => e.stopPropagation()}>
          <button onClick={() => onDetails(ev)} className="sv-btn sv-btn-info flex-1 py-2"><Eye size={13} strokeWidth={1.75} /> Détails</button>
          <button onClick={() => onEdit(ev)} className="sv-icon-btn"><Pencil size={13} strokeWidth={1.75} /></button>
          <button onClick={() => onDelete(ev)} className="sv-icon-btn danger"><Trash2 size={13} strokeWidth={1.75} /></button>
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
  const d  = new Date(ev.eventDate);
  return (
    <div className="sv-row flex items-center gap-4 px-6 py-3.5 cursor-pointer" style={{ borderBottom: '1px solid var(--sv-border)' }} onClick={() => onDetails(ev)}>
      <div className="w-11 text-center flex-shrink-0">
        <p className="sv-heading text-lg font-bold" style={{ color: 'var(--sv-text)' }}>{d.getDate()}</p>
        <p className="text-[9.5px] uppercase tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>{d.toLocaleDateString('fr-FR', { weekday: 'short' })}</p>
      </div>
      <div className="w-[3px] h-9 rounded-full flex-shrink-0" style={{ background: tc.color }} />
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: `${tc.color}1E`, border: `1px solid ${tc.color}40` }}>
        {ev.coverEmoji || <tc.icon size={15} strokeWidth={1.75} style={{ color: tc.color }} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="sv-heading text-[13.5px] font-semibold truncate" style={{ color: 'var(--sv-text)' }}>{ev.title}</p>
        <p className="text-[11.5px] truncate mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{ev.eventType} · {ev.location}{ev.startTime ? ` · ${ev.startTime}` : ''}</p>
      </div>
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="hidden sm:block"><StatusBadge status={ev.status} /></div>
        <div className="sv-row-actions flex gap-1.5" onClick={e => e.stopPropagation()}>
          <button onClick={() => onEdit(ev)} className="sv-icon-btn"><Pencil size={13} strokeWidth={1.75} /></button>
          <button onClick={() => onDelete(ev)} className="sv-icon-btn danger"><Trash2 size={13} strokeWidth={1.75} /></button>
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
  const sections = ['Identité', 'Dates & Lieu', 'Participants', 'Détails'];
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
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(p => ({ ...p, tags: [...p.tags, tagInput.trim()] }));
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

  const inp = (field) => `sv-input w-full px-3.5 py-2.5 text-[13.5px] ${errors[field] ? 'error' : ''}`;
  const LabelRow = ({ name, label, req }) => (
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>
        {label}{req && <span style={{ color: 'var(--sv-danger)' }}> *</span>}
      </label>
      {errors[name] && <span className="text-[11px]" style={{ color: 'var(--sv-danger)' }}>{errors[name]}</span>}
    </div>
  );

  const tc = getType(form.eventType);

  const sectionContent = [
    /* 0 — Identité */
    <div key="identity" className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold tracking-wide mb-2.5" style={{ color: 'var(--sv-text-faint)' }}>ICÔNE DE L'ÉVÉNEMENT</p>
        <div className="flex flex-wrap gap-2 p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
          {COVER_EMOJIS.map(em => (
            <button key={em} type="button" onClick={() => setForm(p => ({ ...p, coverEmoji: em }))}
              className="w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all"
              style={{ background: form.coverEmoji === em ? 'var(--sv-accent-soft)' : 'rgba(255,255,255,0.03)', border: `1.5px solid ${form.coverEmoji === em ? 'var(--sv-accent-border)' : 'var(--sv-border)'}` }}>
              {em}
            </button>
          ))}
        </div>
      </div>

      <div>
        <LabelRow name="title" label="TITRE" req />
        <input name="title" value={form.title} onChange={h} placeholder="Nom de l'événement…" className={inp('title')} />
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <LabelRow name="eventType" label="TYPE" req />
          <select name="eventType" value={form.eventType} onChange={h} className={inp('eventType')} style={{ cursor: 'pointer' }}>
            <option value="">Sélectionner…</option>
            {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.value}</option>)}
          </select>
        </div>
        <div>
          <LabelRow name="status" label="STATUT" />
          <select name="status" value={form.status} onChange={h} className={inp('status')} style={{ cursor: 'pointer' }}>
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
    <div key="dates" className="space-y-3.5">
      <div className="grid grid-cols-2 gap-3.5">
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
    <div key="participants" className="space-y-4">
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <LabelRow name="maxParticipants" label="CAPACITÉ MAX" />
          <input name="maxParticipants" type="number" min="1" value={form.maxParticipants} onChange={h} placeholder="Illimité si vide" className={inp('maxParticipants')} />
        </div>
        <div>
          <LabelRow name="entryFee" label="FRAIS D'ENTRÉE (MAD)" />
          <input name="entryFee" type="number" min="0" step="0.01" value={form.entryFee} onChange={h} placeholder="0 = gratuit" className={inp('entryFee')} />
        </div>
      </div>

      <div className="flex items-center justify-between p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
        <div className="flex items-center gap-2.5">
          {form.isPublic ? <Globe size={16} strokeWidth={1.75} style={{ color: 'var(--sv-text-dim)' }} /> : <Lock size={16} strokeWidth={1.75} style={{ color: 'var(--sv-text-dim)' }} />}
          <div>
            <p className="text-[13px] font-medium" style={{ color: 'var(--sv-text)' }}>{form.isPublic ? 'Événement public' : 'Événement privé'}</p>
            <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{form.isPublic ? 'Visible par tous les étudiants' : 'Accès restreint uniquement'}</p>
          </div>
        </div>
        <div className={`sv-toggle ${form.isPublic ? 'on' : ''}`} onClick={() => setForm(p => ({ ...p, isPublic: !p.isPublic }))}>
          <div className="sv-toggle-thumb" />
        </div>
      </div>
    </div>,

    /* 3 — Détails */
    <div key="details" className="space-y-4">
      <div>
        <LabelRow name="description" label="DESCRIPTION" />
        <textarea name="description" value={form.description} onChange={h} rows={5}
          placeholder="Décrivez le programme, les intervenants…"
          className="sv-input w-full px-3.5 py-2.5 text-[13.5px] resize-none" />
      </div>

      <div>
        <p className="text-[11px] font-semibold tracking-wide mb-2.5" style={{ color: 'var(--sv-text-faint)' }}>TAGS</p>
        <div className="flex gap-2 mb-2.5">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Ajouter un tag…"
            className="sv-input flex-1 px-3.5 py-2.5 text-[13px]" />
          <button type="button" onClick={addTag} className="sv-btn sv-btn-primary px-3.5 py-2.5 flex-shrink-0"><Plus size={14} strokeWidth={2} /></button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {form.tags.map(tag => (
              <div key={tag} className="sv-tag" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)', color: 'var(--sv-accent)' }}>
                #{tag}
                <button type="button" onClick={() => setForm(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }))} style={{ color: 'var(--sv-danger)', display: 'flex' }}>
                  <X size={10} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
        <p className="text-[10.5px] font-semibold tracking-wide mb-2.5" style={{ color: 'var(--sv-text-faint)' }}>APERÇU</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${tc.color}1E`, border: `1px solid ${tc.color}40` }}>
            {form.coverEmoji}
          </div>
          <div>
            <p className="sv-heading text-[13.5px] font-semibold" style={{ color: 'var(--sv-text)' }}>{form.title || "Titre de l'événement"}</p>
            <p className="text-[12px] mt-0.5" style={{ color: tc.color }}>{form.eventType || 'Type'} · {form.location || 'Lieu'}</p>
          </div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border-strong)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{form.coverEmoji}</span>
            <div>
              <h2 className="sv-heading text-[15px] font-semibold" style={{ color: 'var(--sv-text)' }}>{isEdit ? "Modifier l'événement" : 'Nouvel événement'}</h2>
              <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>Étape {activeSection + 1}/{sections.length} — {sections[activeSection]}</p>
            </div>
          </div>
          <button onClick={onClose} className="sv-icon-btn"><X size={15} strokeWidth={1.75} /></button>
        </div>

        <div className="flex px-6 pt-4 gap-2 flex-shrink-0">
          {sections.map((s, i) => (
            <button key={s} type="button" onClick={() => setActiveSection(i)} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full h-[3px] rounded-full transition-all" style={{ background: i <= activeSection ? 'var(--sv-accent)' : 'var(--sv-border)' }} />
              <span className="text-[10.5px] font-medium" style={{ color: i === activeSection ? 'var(--sv-accent)' : 'var(--sv-text-faint)' }}>{s}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto sv-scroll px-6 py-5">{sectionContent[activeSection]}</div>
          <div className="px-6 py-4 flex gap-3 flex-shrink-0" style={{ borderTop: '1px solid var(--sv-border)' }}>
            <button type="button" onClick={activeSection === 0 ? onClose : () => setActiveSection(p => p - 1)} className="sv-btn sv-btn-ghost flex-1 py-2.5">
              {activeSection === 0 ? 'Annuler' : (<><ChevronLeft size={14} strokeWidth={2} /> Retour</>)}
            </button>
            {activeSection < sections.length - 1 ? (
              <button type="button" onClick={() => setActiveSection(p => p + 1)} className="sv-btn sv-btn-primary flex-1 py-2.5">
                Suivant <ChevronRight size={14} strokeWidth={2} />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="sv-btn sv-btn-primary flex-1 py-2.5">
                {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : "Créer l'événement"}
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
  const pct = ev.maxParticipants ? Math.min(100, Math.round((ev.registeredCount / ev.maxParticipants) * 100)) : null;

  const infoRows = [
    { icon: MapPin, label: 'LIEU', val: ev.location },
    { icon: CalendarIcon, label: 'DATE', val: new Date(ev.eventDate).toLocaleDateString('fr-FR', { dateStyle: 'long' }) + (ev.endDate && ev.endDate !== ev.eventDate ? ` → ${new Date(ev.endDate).toLocaleDateString('fr-FR', { dateStyle: 'medium' })}` : '') },
    { icon: Clock, label: 'HORAIRE', val: ev.startTime ? `${ev.startTime}${ev.endTime ? ` → ${ev.endTime}` : ''}` : '—' },
    { icon: User, label: 'ORGANISATEUR', val: ev.organizerName || '—' },
    { icon: Tag, label: "FRAIS D'ENTRÉE", val: ev.entryFee > 0 ? `${ev.entryFee} MAD` : 'Gratuit', accent: true },
    { icon: ev.isPublic ? Globe : Lock, label: 'ACCÈS', val: ev.isPublic ? 'Public' : 'Privé' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border-strong)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="h-[3px] flex-shrink-0" style={{ background: tc.color }} />

        <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <h2 className="sv-heading text-[15px] font-semibold" style={{ color: 'var(--sv-text)' }}>Détails de l'événement</h2>
          <button onClick={onClose} className="sv-icon-btn"><X size={15} strokeWidth={1.75} /></button>
        </div>

        <div className="flex-1 overflow-y-auto sv-scroll p-6 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
            <div className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl flex-shrink-0" style={{ background: `${tc.color}1E`, border: `1px solid ${tc.color}40` }}>
              {ev.coverEmoji || <tc.icon size={26} strokeWidth={1.75} style={{ color: tc.color }} />}
            </div>
            <div className="flex-1">
              <h3 className="sv-heading text-[16px] font-bold" style={{ color: 'var(--sv-text)' }}>{ev.title}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="sv-tag" style={{ background: `${tc.color}1A`, border: `1px solid ${tc.color}40`, color: tc.color }}>
                  <tc.icon size={11} strokeWidth={2} /> {ev.eventType}
                </span>
                <StatusBadge status={ev.status} />
                {!ev.isPublic && (
                  <span className="sv-tag" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--sv-border-strong)', color: 'var(--sv-text-faint)' }}>
                    <Lock size={10} strokeWidth={2} /> Privé
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {infoRows.map(({ icon: Icon, label, val, accent }) => (
              <div key={label} className="p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon size={13} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)' }} />
                  <span className="text-[10px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>{label}</span>
                </div>
                <p className="text-[12.5px] font-medium" style={{ color: accent ? 'var(--sv-accent)' : 'var(--sv-text)' }}>{val}</p>
              </div>
            ))}
          </div>

          {pct !== null && (
            <div className="p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
              <p className="text-[10px] font-semibold tracking-wide mb-2.5" style={{ color: 'var(--sv-text-faint)' }}>PARTICIPANTS</p>
              <div className="flex items-center justify-between mb-2">
                <span className="sv-heading font-semibold text-[13px]" style={{ color: 'var(--sv-text)' }}>{ev.registeredCount} / {ev.maxParticipants} places</span>
                <span className="text-[12px] font-semibold" style={{ color: fillColor(pct) }}>{pct}% rempli</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--sv-surface)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: fillColor(pct), transition: 'width 0.6s ease' }} />
              </div>
            </div>
          )}

          {ev.description && (
            <div className="p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
              <p className="text-[10px] font-semibold tracking-wide mb-2.5" style={{ color: 'var(--sv-text-faint)' }}>DESCRIPTION</p>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--sv-text-dim)' }}>{ev.description}</p>
            </div>
          )}

          {ev.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ev.tags.map(tag => (
                <span key={tag} className="sv-tag" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)', color: 'var(--sv-accent)' }}>#{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 flex gap-3 flex-shrink-0" style={{ borderTop: '1px solid var(--sv-border)' }}>
          <button onClick={onClose} className="sv-btn sv-btn-ghost flex-1 py-2.5">Fermer</button>
          <button onClick={onDelete} className="sv-btn sv-btn-danger-soft px-5 py-2.5"><Trash2 size={13} strokeWidth={1.75} /> Supprimer</button>
          <button onClick={onEdit} className="sv-btn sv-btn-primary flex-1 py-2.5">Modifier</button>
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
  const tc = getType(ev.eventType);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-danger-border)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
            <AlertTriangle size={16} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
          </div>
          <div>
            <h3 className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text)' }}>Supprimer cet événement ?</h3>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>Action irréversible</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${tc.color}1E`, border: `1px solid ${tc.color}40` }}>
              {ev.coverEmoji || <tc.icon size={16} strokeWidth={1.75} style={{ color: tc.color }} />}
            </div>
            <div>
              <p className="sv-heading font-semibold text-[13px]" style={{ color: 'var(--sv-text)' }}>{ev.title}</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{ev.eventType} · {ev.location}</p>
            </div>
          </div>
          <p className="text-[12px]" style={{ color: 'var(--sv-text-dim)' }}>Cet événement et toutes ses données seront définitivement supprimés.</p>
          <div className="flex gap-3">
            <button onClick={onClose} disabled={loading} className="sv-btn sv-btn-ghost flex-1 py-2.5">Annuler</button>
            <button onClick={onConfirm} disabled={loading} className="sv-btn sv-btn-danger flex-1 py-2.5">{loading ? 'Suppression…' : 'Supprimer'}</button>
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
    const key = ev.eventDate?.substring(0, 7);
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
    { label:'Total',    val: stats.total,     key:'all',      icon: CalendarDays, tone: 'accent' },
    { label:'Planifié', val: stats.planned,   key:'Planifié', icon: Clock,        tone: 'info' },
    { label:'En cours', val: stats.ongoing,   key:'En cours', icon: PlayCircle,   tone: 'success' },
    { label:'Terminé',  val: stats.finished,  key:'Terminé',  icon: CheckCircle2, tone: 'neutral' },
    { label:'Annulé',   val: stats.cancelled, key:'Annulé',   icon: XCircle,      tone: 'danger' },
  ];

  const TONE_COLOR = { accent:'var(--sv-accent)', info:'var(--sv-info)', success:'var(--sv-success)', neutral:'var(--sv-text-dim)', danger:'var(--sv-danger)' };
  const TONE_SOFT  = { accent:'var(--sv-accent-soft)', info:'var(--sv-info-soft)', success:'var(--sv-success-soft)', neutral:'rgba(255,255,255,0.04)', danger:'var(--sv-danger-soft)' };
  const TONE_BORDER = { accent:'var(--sv-accent-border)', info:'var(--sv-info-border)', success:'var(--sv-success-border)', neutral:'var(--sv-border-strong)', danger:'var(--sv-danger-border)' };

  return (
    <div className="sv-root min-h-screen" style={{ background: 'var(--sv-bg)' }}>
      <Sidebar activeItem="events" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <main className="relative z-10 transition-all duration-300" style={{ marginLeft: `${sidebarW}px` }}>
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-8 h-16"
          style={{ background: 'rgba(10,15,28,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--sv-border)' }}
        >
          <div className="flex items-center gap-2 text-[12.5px]">
            <span style={{ color: 'var(--sv-text-faint)' }}>Admin</span>
            <span style={{ color: 'var(--sv-text-faint)' }}>/</span>
            <span className="sv-heading font-semibold" style={{ color: 'var(--sv-text)' }}>Événements</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex p-0.5 rounded-lg gap-0.5" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
              {[['grid', LayoutGrid, 'Grille'], ['calendar', CalendarDays, 'Calendrier']].map(([mode, Icon, label]) => (
                <button
                  key={mode} onClick={() => setViewMode(mode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all"
                  style={viewMode === mode ? { background: 'var(--sv-accent)', color: 'var(--sv-accent-ink)' } : { color: 'var(--sv-text-faint)' }}
                >
                  <Icon size={13} strokeWidth={1.75} /><span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => { setCurrent(null); setShowForm(true); }} className="sv-btn sv-btn-primary px-4 py-2">
              <Plus size={15} strokeWidth={2} /> Nouvel événement
            </button>
          </div>
        </header>

        <div className="px-8 py-6 space-y-5">
          <div>
            <h1 className="sv-heading text-[22px] font-bold" style={{ color: 'var(--sv-text)' }}>Gestion des événements</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>
              {filtered.length} événement{filtered.length !== 1 ? 's' : ''} · {stats.planned} planifié{stats.planned !== 1 ? 's' : ''}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg sv-in" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
              <AlertTriangle size={15} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
              <span className="text-[13px]" style={{ color: '#F0A8A2' }}>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statCards.map(({ label, val, key, icon: Icon, tone }) => {
              const active = filterStatus === key;
              return (
                <button key={key} onClick={() => setFilterStatus(active ? 'all' : key)}
                  className="sv-card sv-stat-btn sv-in p-4"
                  style={{ borderColor: active ? TONE_BORDER[tone] : undefined, background: active ? TONE_SOFT[tone] : undefined }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: TONE_SOFT[tone], border: `1px solid ${TONE_BORDER[tone]}` }}>
                    <Icon size={14} strokeWidth={1.75} style={{ color: TONE_COLOR[tone] }} />
                  </div>
                  <p className="sv-heading text-lg font-bold" style={{ color: active ? TONE_COLOR[tone] : 'var(--sv-text)' }}>{val}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{label}</p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 p-3.5 rounded-xl sv-card">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sv-text-faint)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Titre, lieu…" className="sv-input w-full pl-9 pr-3 py-2.5 text-[13px]" />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="sv-input px-3.5 py-2.5 text-[13px] min-w-[170px]" style={{ cursor: 'pointer' }}>
              <option value="all">Tous les types</option>
              {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.value}</option>)}
            </select>
            {hasFilters && (
              <button onClick={() => { setFilterStatus('all'); setFilterType('all'); setSearch(''); }} className="sv-btn sv-btn-ghost px-3 py-2.5">
                <RotateCcw size={13} strokeWidth={1.75} /> Réinitialiser
              </button>
            )}
          </div>

          {/* ── GRID VIEW ── */}
          {viewMode === 'grid' && (
            loading && events.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="sv-card overflow-hidden">
                    <div className="h-[132px] sv-shimmer" style={{ background: 'var(--sv-surface-2)' }} />
                    <div className="p-4 pt-8 space-y-3">
                      {[['70%', 'h-4'], ['50%', 'h-3'], ['100%', 'h-2.5']].map(([w, h], j) => (
                        <div key={j} className={`${h} rounded-full sv-shimmer`} style={{ background: 'var(--sv-surface-2)', width: w }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl sv-card">
                <CalendarDays size={32} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', marginBottom: 12 }} />
                <p className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text-dim)' }}>Aucun événement trouvé</p>
                <p className="text-[12.5px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>Ajustez vos filtres ou créez un événement</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((ev, i) => (
                  <EventCard key={ev.id} ev={ev} index={i} onDetails={openDetail} onEdit={openEdit} onDelete={openDelete} />
                ))}
              </div>
            )
          )}

          {/* ── CALENDAR VIEW ── */}
          {viewMode === 'calendar' && (
            Object.keys(byMonth).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl sv-card">
                <CalendarDays size={32} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', marginBottom: 12 }} />
                <p className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text-dim)' }}>Calendrier vide</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(byMonth).sort().map(([month, evs], gi) => {
                  const [year, m] = month.split('-');
                  const monthName = new Date(year, parseInt(m) - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                  return (
                    <div key={month} className="sv-card sv-in overflow-hidden" style={{ animationDelay: `${gi * 40}ms` }}>
                      <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--sv-border)' }}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-1 h-4 rounded-full" style={{ background: 'var(--sv-accent)' }} />
                          <h2 className="sv-heading text-[13.5px] font-semibold capitalize" style={{ color: 'var(--sv-text)' }}>{monthName}</h2>
                        </div>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--sv-text-faint)' }}>
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

      {showForm && (
        <FormModal event={current} loading={loading} onSave={handleSave} onClose={() => { setShowForm(false); setCurrent(null); }} />
      )}
      {showDetails && current && (
        <DetailsModal ev={current}
          onClose={() => { setShowDetails(false); setCurrent(null); }}
          onEdit={() => { setShowDetails(false); setShowForm(true); }}
          onDelete={() => { setShowDetails(false); setShowDelete(true); }} />
      )}
      {showDelete && current && (
        <DeleteModal ev={current} loading={loading} onConfirm={handleDelete} onClose={() => { setShowDelete(false); setCurrent(null); }} />
      )}
    </div>
  );
};

export default EventsList;
