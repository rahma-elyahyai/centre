// src/components/InscriptionRequestsList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inscriptionRequestAPI } from '../services/inscriptionRequestService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';
import {
  Search, X, Trash2, AlertTriangle, RotateCcw, Phone, User,
  GraduationCap, MapPin, Laptop, Users, Inbox, Eye, Check,
  MessageSquareText, CheckCircle2, XCircle, Clock,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════ */
/*  DESIGN TOKENS — shared across the app                        */
/* ══════════════════════════════════════════════════════════════ */
if (!document.getElementById('sv-design-tokens')) {
  const s = document.createElement('style');
  s.id = 'sv-design-tokens';
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
      --sv-violet:        #9E8FE0;
      --sv-violet-soft:   rgba(158,143,224,0.12);
      --sv-violet-border: rgba(158,143,224,0.30);
      --sv-radius-sm:     8px;
      --sv-radius:        10px;
      --sv-radius-lg:     14px;
      --sv-shadow:        0 1px 2px rgba(0,0,0,0.4);
      --sv-shadow-md:     0 8px 24px rgba(0,0,0,0.35);
    }
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

    .sv-root { font-family: 'Inter', sans-serif; }
    .sv-heading { font-family: 'Manrope', sans-serif; letter-spacing: -0.01em; }

    .sv-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13px;
      border-radius: var(--sv-radius-sm); border: 1px solid transparent;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
      cursor: pointer; white-space: nowrap;
    }
    .sv-btn-primary { background: var(--sv-accent); color: var(--sv-accent-ink); }
    .sv-btn-primary:hover { background: var(--sv-accent-hover); }
    .sv-btn-ghost { background: transparent; border-color: var(--sv-border-strong); color: var(--sv-text-dim); }
    .sv-btn-ghost:hover { border-color: var(--sv-text-faint); color: var(--sv-text); background: rgba(128,128,128,0.06); }
    .sv-btn-danger { background: var(--sv-danger); color: #fff; }
    .sv-btn-danger:hover { background: #EB6B60; }
    .sv-icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: var(--sv-radius-sm);
      border: 1px solid var(--sv-border); background: transparent; color: var(--sv-text-dim);
      transition: background 0.15s, color 0.15s, border-color 0.15s; cursor: pointer;
    }
    .sv-icon-btn:hover { background: rgba(128,128,128,0.08); color: var(--sv-text); border-color: var(--sv-border-strong); }
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
      background-repeat: no-repeat; background-position: right 10px center; background-size: 16px;
      padding-right: 34px !important;
    }
    input.sv-input::placeholder, textarea.sv-input::placeholder { color: var(--sv-text-faint) !important; }
    input.sv-input:focus, select.sv-input:focus, textarea.sv-input:focus { outline: none; border-color: var(--sv-accent-border) !important; }
    select.sv-input option { background: var(--sv-surface); color: var(--sv-text); }

    .sv-card {
      background: var(--sv-surface); border: 1px solid var(--sv-border);
      border-radius: var(--sv-radius-lg); transition: border-color 0.15s;
    }
    .sv-tag {
      display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600;
      padding: 3px 9px; border-radius: 6px; line-height: 1.4;
    }
    .sv-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
    .sv-scroll::-webkit-scrollbar-track { background: transparent; }
    .sv-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 4px; }

    @keyframes sv-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .sv-in { animation: sv-in 0.22s ease forwards; }
    @keyframes sv-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
    .sv-shimmer { animation: sv-pulse 1.4s ease-in-out infinite; }
    .sv-row:hover { background: rgba(128,128,128,0.03); }
  `;
  document.head.appendChild(s);
}
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('sv-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.setAttribute('data-theme', savedTheme);
}

const STATUTS = ['Nouveau', 'Contacté', 'Inscrit', 'Refusé'];
const STATUT_CFG = {
  'Nouveau':  { color: 'var(--sv-info)',    soft: 'var(--sv-info-soft)',    border: 'var(--sv-info-border)',    icon: Inbox },
  'Contacté': { color: 'var(--sv-warning)', soft: 'var(--sv-warning-soft)', border: 'var(--sv-warning-border)', icon: Clock },
  'Inscrit':  { color: 'var(--sv-success)', soft: 'var(--sv-success-soft)', border: 'var(--sv-success-border)', icon: CheckCircle2 },
  'Refusé':   { color: 'var(--sv-danger)',  soft: 'var(--sv-danger-soft)',  border: 'var(--sv-danger-border)',  icon: XCircle },
};

const AVATAR_COLORS = ['#8B93E8', '#C9A24D', '#5CADC2', '#D18BA0', '#5FAE83', '#C97A6B'];
const getAvatarColor = (seed) => AVATAR_COLORS[(seed || 0) % AVATAR_COLORS.length];
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.map(p => p[0] || '').join('').toUpperCase().slice(0, 2);
};

const StatutBadge = ({ statut }) => {
  const cfg = STATUT_CFG[statut] || STATUT_CFG['Nouveau'];
  const Icon = cfg.icon;
  return (
    <span className="sv-tag" style={{ background: cfg.soft, border: `1px solid ${cfg.border}`, color: cfg.color }}>
      <Icon size={11} strokeWidth={2} /> {statut}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  DETAILS MODAL                                                */
/* ══════════════════════════════════════════════════════════════ */
const DetailsModal = ({ item, onClose, onChangeStatut, onSaveNotes, loading }) => {
  const [notes, setNotes] = useState(item?.notes || '');
  if (!item) return null;
  const name = item.fullName || `${item.prenom} ${item.nom}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border-strong)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <h2 className="sv-heading text-[15px] font-semibold" style={{ color: 'var(--sv-text)' }}>Demande d'inscription</h2>
          <button onClick={onClose} className="sv-icon-btn"><X size={15} strokeWidth={1.75} /></button>
        </div>

        <div className="flex-1 overflow-y-auto sv-scroll p-6 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
            <div className="sv-heading font-bold flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 52, height: 52, fontSize: 17, background: `${getAvatarColor(item.id)}22`, color: getAvatarColor(item.id), border: `1px solid ${getAvatarColor(item.id)}40` }}>
              {getInitials(name)}
            </div>
            <div className="flex-1">
              <h3 className="sv-heading text-[16px] font-bold" style={{ color: 'var(--sv-text)' }}>{name}</h3>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : ''}</p>
              <div className="flex items-center gap-2 mt-2">
                <StatutBadge statut={item.statut} />
                <span className="sv-tag" style={{ background: item.modalite === 'Présentiel' ? 'var(--sv-accent-soft)' : 'var(--sv-violet-soft)', border: `1px solid ${item.modalite === 'Présentiel' ? 'var(--sv-accent-border)' : 'var(--sv-violet-border)'}`, color: item.modalite === 'Présentiel' ? 'var(--sv-accent)' : 'var(--sv-violet)' }}>
                  {item.modalite === 'Présentiel' ? <MapPin size={11} strokeWidth={2} /> : <Laptop size={11} strokeWidth={2} />} {item.modalite}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Phone, label: 'TÉLÉPHONE', val: item.telephone },
              { icon: Users, label: `PARENT (${item.lienParente})`, val: item.telephoneParent },
              { icon: GraduationCap, label: 'NIVEAU', val: item.niveau },
              { icon: GraduationCap, label: 'FILIÈRE', val: item.filiere || '—' },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon size={13} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)' }} />
                  <span className="text-[10px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>{label}</span>
                </div>
                <p className="text-[12.5px] font-medium" style={{ color: 'var(--sv-text)' }}>{val}</p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
            <p className="text-[10px] font-semibold tracking-wide mb-2.5" style={{ color: 'var(--sv-text-faint)' }}>MATIÈRES SOUHAITÉES</p>
            <div className="flex flex-wrap gap-1.5">
              {(item.matieresSouhaitees || []).map((m, i) => (
                <span key={i} className="sv-tag" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)', color: 'var(--sv-accent)' }}>{m}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-wide mb-2" style={{ color: 'var(--sv-text-faint)' }}>CHANGER LE STATUT</p>
            <div className="grid grid-cols-4 gap-2">
              {STATUTS.map(s => {
                const cfg = STATUT_CFG[s];
                const Icon = cfg.icon;
                const sel = item.statut === s;
                return (
                  <button key={s} onClick={() => onChangeStatut(item, s)} disabled={loading}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-lg text-[11px] font-semibold transition-all"
                    style={{ background: sel ? cfg.soft : 'var(--sv-surface-2)', border: `1px solid ${sel ? cfg.border : 'var(--sv-border)'}`, color: sel ? cfg.color : 'var(--sv-text-faint)' }}>
                    <Icon size={14} strokeWidth={2} /> {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-wide mb-2" style={{ color: 'var(--sv-text-faint)' }}>NOTES INTERNES</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Notes de suivi (appel effectué, disponibilités, etc.)"
              className="sv-input w-full px-3.5 py-2.5 text-[13px] resize-none" />
            <div className="flex justify-end mt-2">
              <button onClick={() => onSaveNotes(item, notes)} disabled={loading} className="sv-btn sv-btn-ghost px-3.5 py-2">
                <MessageSquareText size={13} strokeWidth={1.75} /> Enregistrer les notes
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid var(--sv-border)' }}>
          <button onClick={onClose} className="sv-btn sv-btn-ghost w-full py-2.5">Fermer</button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  DELETE MODAL                                                 */
/* ══════════════════════════════════════════════════════════════ */
const DeleteModal = ({ item, onConfirm, onClose, loading }) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-danger-border)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
            <AlertTriangle size={16} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
          </div>
          <div>
            <h3 className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text)' }}>Supprimer cette demande ?</h3>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>Action irréversible</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-[12px]" style={{ color: 'var(--sv-text-dim)' }}>{item.fullName || `${item.prenom} ${item.nom}`}</p>
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
/*  ROW                                                          */
/* ══════════════════════════════════════════════════════════════ */
const RequestRow = ({ item, onView, onDelete }) => {
  const name = item.fullName || `${item.prenom} ${item.nom}`;
  const c = getAvatarColor(item.id);
  return (
    <div className="sv-row flex items-center justify-between px-5 py-3.5 cursor-pointer" style={{ borderBottom: '1px solid var(--sv-border)' }} onClick={() => onView(item)}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="sv-heading font-bold flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 36, height: 36, fontSize: 12, background: `${c}22`, color: c, border: `1px solid ${c}40` }}>
          {getInitials(name)}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium truncate" style={{ color: 'var(--sv-text)' }}>{name}</p>
          <p className="text-[11.5px] truncate" style={{ color: 'var(--sv-text-faint)' }}>{item.niveau}{item.filiere ? ` · ${item.filiere}` : ''} · {item.telephone}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="sv-tag hidden sm:inline-flex" style={{ background: item.modalite === 'Présentiel' ? 'var(--sv-accent-soft)' : 'var(--sv-violet-soft)', border: `1px solid ${item.modalite === 'Présentiel' ? 'var(--sv-accent-border)' : 'var(--sv-violet-border)'}`, color: item.modalite === 'Présentiel' ? 'var(--sv-accent)' : 'var(--sv-violet)' }}>
          {item.modalite === 'Présentiel' ? <MapPin size={10} strokeWidth={2} /> : <Laptop size={10} strokeWidth={2} />} {item.modalite}
        </span>
        <StatutBadge statut={item.statut} />
        <span className="text-[11px] hidden md:inline" style={{ color: 'var(--sv-text-faint)' }}>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : ''}
        </span>
        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          <button onClick={() => onView(item)} className="sv-icon-btn"><Eye size={13} strokeWidth={1.75} /></button>
          <button onClick={() => onDelete(item)} className="sv-icon-btn danger"><Trash2 size={13} strokeWidth={1.75} /></button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                    */
/* ══════════════════════════════════════════════════════════════ */
const InscriptionRequestsList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, countNouveau: 0, countContacte: 0, countInscrit: 0, countRefuse: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [filterStatut, setFilterStatut] = useState('all');
  const [filterModalite, setFilterModalite] = useState('all');
  const [search, setSearch] = useState('');

  const [current, setCurrent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!getAuthToken()) { navigate('/login'); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true); setError('');
      const [listRes, statsRes] = await Promise.all([
        inscriptionRequestAPI.getAll(),
        inscriptionRequestAPI.getStats(),
      ]);
      if (listRes.success) setItems(Array.isArray(listRes.data) ? listRes.data : []);
      if (statsRes.success) setStats(statsRes.data || {});
    } catch {
      setError('Impossible de charger les demandes.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter(it => {
    const okS = filterStatut === 'all' || it.statut === filterStatut;
    const okM = filterModalite === 'all' || it.modalite === filterModalite;
    const q = search.toLowerCase();
    const name = (it.fullName || `${it.prenom} ${it.nom}`).toLowerCase();
    const okQ = !q || name.includes(q) || (it.telephone || '').includes(q) || (it.telephoneParent || '').includes(q);
    return okS && okM && okQ;
  });

  const handleChangeStatut = async (item, statut) => {
    try {
      setActionLoading(true);
      const res = await inscriptionRequestAPI.updateStatut(item.id, statut);
      if (res.success) {
        await loadAll();
        setCurrent(res.data);
      }
    } catch { alert('Erreur lors de la mise à jour du statut'); } finally { setActionLoading(false); }
  };

  const handleSaveNotes = async (item, notes) => {
    try {
      setActionLoading(true);
      const res = await inscriptionRequestAPI.updateNotes(item.id, notes);
      if (res.success) { await loadAll(); setCurrent(res.data); }
    } catch { alert('Erreur lors de la sauvegarde des notes'); } finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      const res = await inscriptionRequestAPI.delete(current.id);
      if (res.success) { await loadAll(); setShowDelete(false); setCurrent(null); }
    } catch { alert('Erreur lors de la suppression'); } finally { setActionLoading(false); }
  };

  const openView = item => { setCurrent(item); setShowDetails(true); };
  const openDelete = item => { setCurrent(item); setShowDelete(true); };

  const sidebarW = sidebarCollapsed ? 72 : 240;
  const hasFilters = filterStatut !== 'all' || filterModalite !== 'all' || search;

  const statCards = [
    { label: 'Total',    val: stats.total,         key: 'all',      icon: Inbox,       tone: 'accent' },
    { label: 'Nouveau',  val: stats.countNouveau,  key: 'Nouveau',  icon: Inbox,       tone: 'info' },
    { label: 'Contacté', val: stats.countContacte, key: 'Contacté', icon: Clock,       tone: 'warning' },
    { label: 'Inscrit',  val: stats.countInscrit,  key: 'Inscrit',  icon: CheckCircle2,tone: 'success' },
    { label: 'Refusé',   val: stats.countRefuse,   key: 'Refusé',   icon: XCircle,     tone: 'danger' },
  ];
  const TONE_COLOR = { accent: 'var(--sv-accent)', info: 'var(--sv-info)', warning: 'var(--sv-warning)', success: 'var(--sv-success)', danger: 'var(--sv-danger)' };
  const TONE_SOFT  = { accent: 'var(--sv-accent-soft)', info: 'var(--sv-info-soft)', warning: 'var(--sv-warning-soft)', success: 'var(--sv-success-soft)', danger: 'var(--sv-danger-soft)' };
  const TONE_BORDER = { accent: 'var(--sv-accent-border)', info: 'var(--sv-info-border)', warning: 'var(--sv-warning-border)', success: 'var(--sv-success-border)', danger: 'var(--sv-danger-border)' };

  return (
    <div className="sv-root min-h-screen" style={{ background: 'var(--sv-bg)' }}>
      <Sidebar activeItem="inscriptions" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <main className="relative z-10 transition-all duration-300" style={{ marginLeft: `${sidebarW}px` }}>
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-16"
          style={{ background: 'rgba(10,15,28,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--sv-border)' }}>
          <div className="flex items-center gap-2 text-[12.5px]">
            <span style={{ color: 'var(--sv-text-faint)' }}>Admin</span>
            <span style={{ color: 'var(--sv-text-faint)' }}>/</span>
            <span className="sv-heading font-semibold" style={{ color: 'var(--sv-text)' }}>Demandes d'inscription</span>
          </div>
        </header>

        <div className="px-8 py-6 space-y-5">
          <div>
            <h1 className="sv-heading text-[22px] font-bold" style={{ color: 'var(--sv-text)' }}>Demandes d'inscription</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>
              Formulaire public du site vitrine — {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
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
              const active = filterStatut === key;
              return (
                <button key={key} onClick={() => setFilterStatut(active ? 'all' : key)}
                  className="sv-card sv-in p-4 text-left transition-all"
                  style={{ borderColor: active ? TONE_BORDER[tone] : undefined, background: active ? TONE_SOFT[tone] : undefined }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: TONE_SOFT[tone], border: `1px solid ${TONE_BORDER[tone]}` }}>
                    <Icon size={14} strokeWidth={1.75} style={{ color: TONE_COLOR[tone] }} />
                  </div>
                  <p className="sv-heading text-lg font-bold" style={{ color: active ? TONE_COLOR[tone] : 'var(--sv-text)' }}>{val ?? 0}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{label}</p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 p-3.5 rounded-xl sv-card">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sv-text-faint)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, téléphone…" className="sv-input w-full pl-9 pr-3 py-2.5 text-[13px]" />
            </div>
            <select value={filterModalite} onChange={e => setFilterModalite(e.target.value)} className="sv-input px-3.5 py-2.5 text-[13px] min-w-[160px]" style={{ cursor: 'pointer' }}>
              <option value="all">Toutes modalités</option>
              <option value="Présentiel">Présentiel</option>
              <option value="À distance">À distance</option>
            </select>
            {hasFilters && (
              <button onClick={() => { setFilterStatut('all'); setFilterModalite('all'); setSearch(''); }} className="sv-btn sv-btn-ghost px-3 py-2.5">
                <RotateCcw size={13} strokeWidth={1.75} /> Réinitialiser
              </button>
            )}
          </div>

          <div className="sv-card overflow-hidden">
            {loading && items.length === 0 ? (
              <div className="space-y-2 p-4">{[...Array(5)].map((_, i) => <div key={i} className="h-14 rounded-lg sv-shimmer" style={{ background: 'var(--sv-surface-2)' }} />)}</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Inbox size={32} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', marginBottom: 12 }} />
                <p className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text-dim)' }}>Aucune demande trouvée</p>
              </div>
            ) : (
              filtered.map(item => <RequestRow key={item.id} item={item} onView={openView} onDelete={openDelete} />)
            )}
          </div>
        </div>
      </main>

      {showDetails && current && (
        <DetailsModal
          item={current}
          loading={actionLoading}
          onChangeStatut={handleChangeStatut}
          onSaveNotes={handleSaveNotes}
          onClose={() => { setShowDetails(false); setCurrent(null); }}
        />
      )}
      {showDelete && current && (
        <DeleteModal
          item={current}
          loading={actionLoading}
          onConfirm={handleDelete}
          onClose={() => { setShowDelete(false); setCurrent(null); }}
        />
      )}
    </div>
  );
};

export default InscriptionRequestsList;
