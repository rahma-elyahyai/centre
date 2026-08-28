// src/components/StudentsList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../services/studentService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';
import {
  GraduationCap, Phone, Users, Building2, Calendar, BookOpen,
  Pencil, Trash2, X, AlertTriangle, LayoutGrid, List, Plus,
  Check, ChevronLeft, ChevronRight, Search, RotateCcw, Hash, Wallet,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════ */
/*  DESIGN TOKENS — injected once                                */
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
      --sv-danger:        #E2574C;
      --sv-danger-soft:   rgba(226,87,76,0.10);
      --sv-danger-border: rgba(226,87,76,0.28);
      --sv-radius-sm:     8px;
      --sv-radius:        10px;
      --sv-radius-lg:     14px;
      --sv-shadow:        0 1px 2px rgba(0,0,0,0.4);
      --sv-shadow-md:     0 8px 24px rgba(0,0,0,0.35);
    }

    .sv-root { font-family: 'Inter', sans-serif; }
    .sv-heading { font-family: 'Manrope', sans-serif; letter-spacing: -0.01em; }

    .sv-accent-text { color: var(--sv-accent); }

    /* Buttons */
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
    .sv-btn-danger { background: var(--sv-danger); color: #fff; }
    .sv-btn-danger:hover { background: #EB6B60; }
    .sv-icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: var(--sv-radius-sm);
      border: 1px solid var(--sv-border); background: transparent; color: var(--sv-text-dim);
      transition: background 0.15s, color 0.15s, border-color 0.15s; cursor: pointer;
    }
    .sv-icon-btn:hover { background: rgba(255,255,255,0.04); color: var(--sv-text); border-color: var(--sv-border-strong); }
    .sv-icon-btn.danger:hover { background: var(--sv-danger-soft); color: var(--sv-danger); border-color: var(--sv-danger-border); }

    /* Inputs */
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
      display: inline-flex; align-items: center; font-size: 11px; font-weight: 600;
      padding: 3px 9px; border-radius: 6px; line-height: 1.4;
    }

    .sv-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
    .sv-scroll::-webkit-scrollbar-track { background: transparent; }
    .sv-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 4px; }

    @keyframes sv-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .sv-in { animation: sv-in 0.22s ease forwards; }
    @keyframes sv-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
    .sv-shimmer { animation: sv-pulse 1.4s ease-in-out infinite; }

    .sv-row:hover { background: rgba(255,255,255,0.02); }

    .sv-checkbox {
      appearance: none; width: 16px; height: 16px; border-radius: 4px;
      border: 1.5px solid var(--sv-border-strong); background: transparent;
      cursor: pointer; flex-shrink: 0; transition: all 0.15s; position: relative;
    }
    .sv-checkbox:checked { background: var(--sv-accent); border-color: var(--sv-accent); }
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
const SUBJECTS = [
  'Mathématiques','Physique-Chimie','SVT','Français','Anglais',
  'Arabe','Histoire-Géographie','Philosophie','Économie','Comptabilité','Informatique'
];

// Muted, consistent-saturation palette — no neon, no per-subject gradients.
const SUBJECT_COLORS = {
  'Mathématiques':       '#8B93E8',
  'Physique-Chimie':     '#6AA3D9',
  'SVT':                 '#5FAE83',
  'Français':            '#D18BA0',
  'Anglais':             '#4FB0A6',
  'Arabe':               '#C99A55',
  'Histoire-Géographie': '#C97A6B',
  'Philosophie':         '#A088CC',
  'Économie':            '#B99548',
  'Comptabilité':        '#B7A25A',
  'Informatique':        '#5CADC2',
};

const DEFAULT_LEVELS = [
  'Primaire',
  '1ère Année collège',
  '2ème Année collège',
  '3ème Année collège',
  'Tronc Commun',
  '1ère Bac',
  '2ème Bac'
];

const DEFAULT_FIELDS = [
  'Sciences Mathématiques',
  'Physique-Chimie',
  'SVT',
  'Lettres',
  'Économie'
];

// Flat, muted avatar palette (no gradients) — one solid color per hash bucket.
const AVATAR_COLORS = ['#8B93E8', '#C9A24D', '#5CADC2', '#D18BA0', '#5FAE83', '#C97A6B'];

const getSubjectColor = (s) => SUBJECT_COLORS[s] || '#8B93A6';

const getInitials = (student) => {
  const p = student.prenom || '';
  const n = student.nom || '';
  return `${p[0] || ''}${n[0] || ''}`.toUpperCase() || '?';
};

const getAvatarColor = (id) => AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];

/* Small helper: colored dot + label chip used for subjects */
const SubjectChip = ({ subject, size = 'sm' }) => {
  const c = getSubjectColor(subject);
  return (
    <span
      className="sv-tag"
      style={{
        background: `${c}1A`,
        border: `1px solid ${c}40`,
        color: c,
        fontSize: size === 'sm' ? 11 : 12,
      }}
    >
      {subject}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  STUDENT CARD (Grid View)                                     */
/* ══════════════════════════════════════════════════════════════ */
const StudentCard = ({ student, onEdit, onDelete, index }) => {
  const name = student.fullName || `${student.prenom || ''} ${student.nom || ''}`.trim();
  const matieres = student.matieres || [];
  const avatarColor = getAvatarColor(student.id);

  const details = [
    { icon: Phone, val: student.phoneNumber || '—' },
    { icon: Users, val: student.parentPhone || '—', label: 'Parent' },
    { icon: Building2, val: student.etablissement || '—' },
    { icon: Calendar, val: student.dateInscription ? new Date(student.dateInscription).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
  ];

  return (
    <div className="sv-card sv-in flex flex-col overflow-hidden" style={{ animationDelay: `${index * 30}ms` }}>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 sv-heading font-bold text-xs"
            style={{ background: `${avatarColor}22`, color: avatarColor, border: `1px solid ${avatarColor}40` }}
          >
            {getInitials(student)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="sv-heading font-semibold text-[13.5px] leading-snug truncate" style={{ color: 'var(--sv-text)' }}>{name}</h3>
            <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--sv-text-faint)' }}>
              <Hash size={10} strokeWidth={2} />{student.id}
            </p>
          </div>
          {student.abonnementMensuel != null && (
            <span className="sv-tag flex-shrink-0" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)', color: 'var(--sv-accent)' }}>
              <Wallet size={10} strokeWidth={2} /> {Number(student.abonnementMensuel).toLocaleString('fr-FR')} MAD/mois
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {student.niveau && (
            <span className="sv-tag" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--sv-border-strong)', color: 'var(--sv-text-dim)' }}>
              <GraduationCap size={11} strokeWidth={2} className="mr-1" />{student.niveau}
            </span>
          )}
          {student.filiere && (
            <span className="sv-tag" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)', color: 'var(--sv-accent)' }}>
              {student.filiere}
            </span>
          )}
        </div>

        <div className="h-px" style={{ background: 'var(--sv-border)' }} />

        <div className="space-y-1.5">
          {details.map(({ icon: Icon, val, label }, i) => (
            <div key={i} className="flex items-center gap-2">
              <Icon size={13} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)', flexShrink: 0 }} />
              <span className="text-[12px] truncate" style={{ color: 'var(--sv-text-dim)' }}>
                {label ? <span style={{ color: 'var(--sv-text-faint)' }}>{label}: </span> : null}{val}
              </span>
            </div>
          ))}
        </div>

        {matieres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {matieres.slice(0, 3).map(s => <SubjectChip key={s} subject={s} />)}
            {matieres.length > 3 && (
              <span className="sv-tag" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--sv-border)', color: 'var(--sv-text-faint)' }}>
                +{matieres.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-3" style={{ borderTop: '1px solid var(--sv-border)' }}>
          <button onClick={() => onEdit(student)} className="sv-btn sv-btn-ghost flex-1 py-2">
            <Pencil size={13} strokeWidth={1.75} /> Modifier
          </button>
          <button onClick={() => onDelete(student)} className="sv-icon-btn danger">
            <Trash2 size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  TABLE VIEW                                                   */
/* ══════════════════════════════════════════════════════════════ */
const TableView = ({ grouped, onEdit, onDelete }) => (
  <div className="space-y-4">
    {Object.entries(grouped).map(([group, students], gi) => (
      <div key={group} className="sv-card sv-in overflow-hidden" style={{ animationDelay: `${gi * 40}ms` }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-4 rounded-full" style={{ background: 'var(--sv-accent)' }} />
            <h2 className="sv-heading text-[13.5px] font-semibold" style={{ color: 'var(--sv-text)' }}>{group}</h2>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--sv-text-faint)' }}>
            {students.length} étudiant{students.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="overflow-x-auto sv-scroll">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--sv-border)' }}>
                {['Étudiant', 'Téléphone', 'Tél. Parent', 'Établissement', 'Abonnement', 'Matières', ''].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-[10.5px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const name = student.fullName || `${student.prenom || ''} ${student.nom || ''}`.trim();
                const matieres = student.matieres || [];
                const avatarColor = getAvatarColor(student.id);
                return (
                  <tr key={student.id} className="sv-row" style={{ borderBottom: '1px solid var(--sv-border)' }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center sv-heading font-bold text-[11px] flex-shrink-0"
                          style={{ background: `${avatarColor}22`, color: avatarColor, border: `1px solid ${avatarColor}40` }}
                        >
                          {getInitials(student)}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium" style={{ color: 'var(--sv-text)' }}>{name}</p>
                          <p className="text-[10.5px]" style={{ color: 'var(--sv-text-faint)' }}>#{student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className="text-[12.5px]" style={{ color: 'var(--sv-text-dim)' }}>{student.phoneNumber || '—'}</span></td>
                    <td className="px-5 py-3"><span className="text-[12.5px]" style={{ color: 'var(--sv-text-dim)' }}>{student.parentPhone || '—'}</span></td>
                    <td className="px-5 py-3"><span className="text-[12.5px] truncate block max-w-[180px]" style={{ color: 'var(--sv-text-dim)' }}>{student.etablissement || '—'}</span></td>
                    <td className="px-5 py-3">
                      <span className="text-[13px] font-semibold" style={{ color: 'var(--sv-accent)' }}>
                        {student.abonnementMensuel != null ? `${Number(student.abonnementMensuel).toLocaleString('fr-FR')} MAD` : '—'}
                      </span>
                      {student.fraisInscription > 0 && (
                        <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>+ {Number(student.fraisInscription).toLocaleString('fr-FR')} MAD inscription</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {matieres.slice(0, 2).map(s => <SubjectChip key={s} subject={s} />)}
                        {matieres.length > 2 && (
                          <span className="sv-tag" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--sv-border)', color: 'var(--sv-text-faint)' }}>
                            +{matieres.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={() => onEdit(student)} className="sv-icon-btn"><Pencil size={13} strokeWidth={1.75} /></button>
                        <button onClick={() => onDelete(student)} className="sv-icon-btn danger"><Trash2 size={13} strokeWidth={1.75} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════ */
/*  FORM MODAL                                                   */
/* ══════════════════════════════════════════════════════════════ */
const FormModal = ({ student, onSave, onClose, levels, fields, loading }) => {
  const isEdit = !!student;
  const [activeSection, setActiveSection] = useState(0);
  const sections = ['Identité', 'Contact', 'Scolarité', 'Facturation', 'Matières'];
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState(() => ({
    nom:         student?.nom || '',
    prenom:      student?.prenom || '',
    email:       student?.email || '',
    phone:       student?.phoneNumber || '',
    parentPhone: student?.parentPhone || '',
    level:       student?.niveau || '',
    field:       student?.filiere || '',
    lycee:       student?.etablissement || '',
    subjects:    student?.matieres || [],
    registrationFee: student?.fraisInscription != null ? String(student.fraisInscription) : '',
    monthlyFee:      student?.abonnementMensuel != null ? String(student.abonnementMensuel) : '',
  }));

  const h = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const toggleSubject = (s) => {
    setForm(p => ({
      ...p,
      subjects: p.subjects.includes(s) ? p.subjects.filter(x => x !== s) : [...p.subjects, s],
    }));
    if (errors.subjects) setErrors(p => ({ ...p, subjects: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = 'Requis';
    if (!form.prenom.trim()) e.prenom = 'Requis';
    if (!form.phone.trim()) e.phone = 'Requis';
    else if (!/^0[5-7][0-9]{8}$/.test(form.phone)) e.phone = 'Format invalide (ex: 0612345678)';
    if (!form.parentPhone.trim()) e.parentPhone = 'Requis';
    else if (!/^0[5-7][0-9]{8}$/.test(form.parentPhone)) e.parentPhone = 'Format invalide';
    if (!form.level) e.level = 'Requis';
    if (!form.field) e.field = 'Requis';
    if (!form.lycee.trim()) e.lycee = 'Requis';
    if (form.monthlyFee === '' || isNaN(form.monthlyFee) || Number(form.monthlyFee) < 0) e.monthlyFee = 'Montant mensuel valide requis';
    if (form.registrationFee !== '' && (isNaN(form.registrationFee) || Number(form.registrationFee) < 0)) e.registrationFee = 'Montant invalide';
    if (form.subjects.length === 0) e.subjects = 'Sélectionnez au moins une matière';
    return e;
  };

  const submit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      nom: form.nom, prenom: form.prenom,
      email: form.email || `${form.prenom.toLowerCase()}.${form.nom.toLowerCase()}@email.com`,
      phone: form.phone, parentPhone: form.parentPhone,
      level: form.level, field: form.field, lycee: form.lycee, subjects: form.subjects,
      registrationFee: form.registrationFee !== '' ? parseFloat(form.registrationFee) : 0,
      monthlyFee: parseFloat(form.monthlyFee) || 0,
    });
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

  const avatarColor = getAvatarColor(student?.id || 0);

  const sectionContent = [
    <div key="identity" className="space-y-4">
      <div className="flex items-center gap-3.5 p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center sv-heading font-bold text-base flex-shrink-0"
          style={{ background: `${avatarColor}22`, color: avatarColor, border: `1px solid ${avatarColor}40` }}
        >
          {(form.prenom[0] || '?').toUpperCase()}{(form.nom[0] || '').toUpperCase()}
        </div>
        <div>
          <p className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text)' }}>{form.prenom || 'Prénom'} {form.nom || 'Nom'}</p>
          <p className="text-[12px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{form.level || 'Niveau'} · {form.field || 'Filière'}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <LabelRow name="prenom" label="PRÉNOM" req />
          <input name="prenom" value={form.prenom} onChange={h} placeholder="Prénom…" className={inp('prenom')} />
        </div>
        <div>
          <LabelRow name="nom" label="NOM" req />
          <input name="nom" value={form.nom} onChange={h} placeholder="Nom…" className={inp('nom')} />
        </div>
      </div>
      <div>
        <LabelRow name="email" label="EMAIL" />
        <input name="email" type="email" value={form.email} onChange={h} placeholder="email@exemple.com (optionnel)" className={inp('email')} />
      </div>
    </div>,

    <div key="contact" className="space-y-4">
      <div>
        <LabelRow name="phone" label="TÉLÉPHONE ÉTUDIANT" req />
        <input name="phone" type="tel" value={form.phone} onChange={h} placeholder="06XXXXXXXX" className={inp('phone')} />
      </div>
      <div>
        <LabelRow name="parentPhone" label="TÉLÉPHONE PARENT" req />
        <input name="parentPhone" type="tel" value={form.parentPhone} onChange={h} placeholder="06XXXXXXXX" className={inp('parentPhone')} />
      </div>
      <div className="flex items-start gap-2.5 p-3 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
        <Phone size={14} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)', marginTop: 1 }} />
        <p className="text-[12px]" style={{ color: 'var(--sv-text-dim)' }}>Format marocain accepté : 06XXXXXXXX ou 07XXXXXXXX</p>
      </div>
    </div>,

    <div key="scolarite" className="space-y-4">
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <LabelRow name="level" label="NIVEAU" req />
          <select name="level" value={form.level} onChange={h} className={inp('level')} style={{ cursor: 'pointer' }}>
            <option value="">Sélectionner…</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <LabelRow name="field" label="FILIÈRE" req />
          <select name="field" value={form.field} onChange={h} className={inp('field')} style={{ cursor: 'pointer' }}>
            <option value="">Sélectionner…</option>
            {fields.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>
      <div>
        <LabelRow name="lycee" label="LYCÉE / COLLÈGE" req />
        <input name="lycee" value={form.lycee} onChange={h} placeholder="Nom de l'établissement…" className={inp('lycee')} />
      </div>
    </div>,

    <div key="facturation" className="space-y-4">
      <div>
        <LabelRow name="monthlyFee" label="ABONNEMENT MENSUEL (MAD)" req />
        <input name="monthlyFee" type="number" min="0" step="0.01" value={form.monthlyFee} onChange={h} placeholder="Ex : 400" className={inp('monthlyFee')} />
        <p className="text-[11.5px] mt-1.5" style={{ color: 'var(--sv-text-faint)' }}>Montant payé chaque mois par l'étudiant, tous cours confondus.</p>
      </div>
      <div>
        <LabelRow name="registrationFee" label="FRAIS D'INSCRIPTION (MAD)" />
        <input name="registrationFee" type="number" min="0" step="0.01" value={form.registrationFee} onChange={h} placeholder="Ex : 100 (0 si aucun)" className={inp('registrationFee')} />
        <p className="text-[11.5px] mt-1.5" style={{ color: 'var(--sv-text-faint)' }}>Payé une seule fois, à l'inscription — ne se répète pas les mois suivants.</p>
      </div>
      {(form.monthlyFee || form.registrationFee) && (
        <div className="p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
          <p className="text-[10.5px] font-semibold tracking-wide mb-2" style={{ color: 'var(--sv-text-faint)' }}>APERÇU</p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12.5px]" style={{ color: 'var(--sv-text-dim)' }}>Ce mois-ci</span>
            <span className="sv-heading font-bold text-[15px]" style={{ color: 'var(--sv-accent)' }}>
              {(parseFloat(form.monthlyFee || 0) + parseFloat(form.registrationFee || 0)).toLocaleString('fr-FR')} MAD
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12.5px]" style={{ color: 'var(--sv-text-dim)' }}>Mois suivants</span>
            <span className="text-[13px] font-medium" style={{ color: 'var(--sv-text)' }}>{parseFloat(form.monthlyFee || 0).toLocaleString('fr-FR')} MAD</span>
          </div>
        </div>
      )}
    </div>,

    <div key="matieres" className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>MATIÈRES DE SOUTIEN *</p>
        {errors.subjects && <span className="text-[11px]" style={{ color: 'var(--sv-danger)' }}>{errors.subjects}</span>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SUBJECTS.map(s => {
          const selected = form.subjects.includes(s);
          const c = getSubjectColor(s);
          return (
            <button
              key={s} type="button" onClick={() => toggleSubject(s)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all"
              style={{
                background: selected ? `${c}14` : 'var(--sv-surface-2)',
                border: `1px solid ${selected ? `${c}45` : 'var(--sv-border)'}`,
              }}
            >
              <div
                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: selected ? c : 'transparent', border: `1.5px solid ${selected ? c : 'var(--sv-border-strong)'}` }}
              >
                {selected && <Check size={10} strokeWidth={3} color="#0A0F1C" />}
              </div>
              <span className="text-[12.5px] truncate" style={{ color: selected ? c : 'var(--sv-text-dim)' }}>{s}</span>
            </button>
          );
        })}
      </div>
      {form.subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-3 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
          {form.subjects.map(s => <SubjectChip key={s} subject={s} />)}
        </div>
      )}
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border-strong)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <div>
            <h2 className="sv-heading text-[15px] font-semibold" style={{ color: 'var(--sv-text)' }}>{isEdit ? "Modifier l'étudiant" : 'Nouvel étudiant'}</h2>
            <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>Étape {activeSection + 1}/{sections.length} — {sections[activeSection]}</p>
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
            <button
              type="button"
              onClick={activeSection === 0 ? onClose : () => setActiveSection(p => p - 1)}
              className="sv-btn sv-btn-ghost flex-1 py-2.5"
            >
              {activeSection === 0 ? 'Annuler' : (<><ChevronLeft size={14} strokeWidth={2} /> Retour</>)}
            </button>
            {activeSection < sections.length - 1 ? (
              <button type="button" onClick={() => setActiveSection(p => p + 1)} className="sv-btn sv-btn-primary flex-1 py-2.5">
                Suivant <ChevronRight size={14} strokeWidth={2} />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="sv-btn sv-btn-primary flex-1 py-2.5">
                {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : "Créer l'étudiant"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  DELETE MODAL                                                 */
/* ══════════════════════════════════════════════════════════════ */
const DeleteModal = ({ student, onConfirm, onClose, loading }) => {
  if (!student) return null;
  const name = student.fullName || `${student.prenom || ''} ${student.nom || ''}`.trim();
  const avatarColor = getAvatarColor(student.id || 0);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-danger-border)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
            <AlertTriangle size={16} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
          </div>
          <div>
            <h3 className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text)' }}>Supprimer cet étudiant ?</h3>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>Action irréversible</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center sv-heading font-bold text-xs flex-shrink-0"
              style={{ background: `${avatarColor}22`, color: avatarColor, border: `1px solid ${avatarColor}40` }}
            >
              {getInitials(student)}
            </div>
            <div>
              <p className="sv-heading font-semibold text-[13px]" style={{ color: 'var(--sv-text)' }}>{name}</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>
                {student.niveau} · {student.filiere} · {student.etablissement}
              </p>
            </div>
          </div>
          <p className="text-[12px]" style={{ color: 'var(--sv-text-dim)' }}>
            Cet étudiant et toutes ses données seront définitivement supprimés.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} disabled={loading} className="sv-btn sv-btn-ghost flex-1 py-2.5">Annuler</button>
            <button onClick={onConfirm} disabled={loading} className="sv-btn sv-btn-danger flex-1 py-2.5">
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
const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents]         = useState([]);
  const [stats, setStats]               = useState({ totalStudents: 0 });
  const [levels, setLevels]             = useState([]);
  const [fields, setFields]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode]         = useState('table');
  const [filterLevel, setFilterLevel]   = useState('all');
  const [filterField, setFilterField]   = useState('all');
  const [search, setSearch]             = useState('');
  const [showForm, setShowForm]         = useState(false);
  const [showDelete, setShowDelete]     = useState(false);
  const [current, setCurrent]           = useState(null);
  const [saveError, setSaveError]       = useState('');

  useEffect(() => {
    if (!getAuthToken()) { navigate('/login'); return; }
    loadAll();
  }, []);

  // ─── Helper : unwrap { success, message, data } envelope ───
  const unwrap = (res) => {
    if (res && typeof res === 'object' && 'data' in res) return res.data;
    return res;
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      setError('');

      const [stRes, evRes] = await Promise.all([
        studentAPI.getStats(),
        studentAPI.getAllStudents({ size: 100 }),
      ]);

      const statsData   = unwrap(stRes);
      const studentsRaw = unwrap(evRes);

      const studentsData = Array.isArray(studentsRaw)
        ? studentsRaw
        : Array.isArray(studentsRaw?.content)
        ? studentsRaw.content
        : [];

      setStudents(studentsData);
      setStats(statsData || { totalStudents: 0 });
      setLevels(DEFAULT_LEVELS);
      setFields(DEFAULT_FIELDS);

    } catch (err) {
      console.error('loadAll error:', err);
      setError('Impossible de charger les étudiants.');
      setStudents([]);
      setLevels(DEFAULT_LEVELS);
      setFields(DEFAULT_FIELDS);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(s => {
    const okL = filterLevel === 'all' || s.niveau === filterLevel;
    const okF = filterField === 'all' || s.filiere === filterField;
    const q = search.toLowerCase();
    const okQ = !q
      || (s.fullName || '').toLowerCase().includes(q)
      || (s.nom || '').toLowerCase().includes(q)
      || (s.prenom || '').toLowerCase().includes(q)
      || (s.phoneNumber || '').includes(q)
      || (s.parentPhone || '').includes(q)
      || (s.etablissement || '').toLowerCase().includes(q);
    return okL && okF && okQ;
  });

  const grouped = filtered.reduce((acc, s) => {
    const key = `${s.niveau || '—'} · ${s.filiere || '—'}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  const handleSave = async (data) => {
    try {
      setLoading(true);
      setSaveError('');

      const payload = {
        nom:          data.nom,
        prenom:       data.prenom,
        email:        data.email,
        phoneNumber:  data.phone,
        parentPhone:  data.parentPhone,
        niveau:       data.level,
        filiere:      data.field,
        etablissement: data.lycee,
        matieres:     data.subjects,
        fraisInscription:   data.registrationFee,
        abonnementMensuel:  data.monthlyFee,
      };

      const rawRes = current
        ? await studentAPI.updateStudent(current.id, payload)
        : await studentAPI.createStudent(payload);

      const res = rawRes && typeof rawRes === 'object' && 'success' in rawRes
        ? rawRes
        : { success: true, data: rawRes };

      if (res.success) {
        await loadAll();
        setShowForm(false);
        setCurrent(null);
      } else {
        setSaveError(res.message || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      const backendError = err.response?.data;
      const msg = backendError?.message
        || (typeof backendError === 'string' ? backendError : null)
        || err.message
        || 'Erreur inconnue';
      console.error('Backend error:', backendError);
      setSaveError(`Erreur: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const rawRes = await studentAPI.deleteStudent(current.id);
      const res = rawRes && typeof rawRes === 'object' && 'success' in rawRes
        ? rawRes
        : { success: true };
      if (res.success) {
        await loadAll();
        setShowDelete(false);
        setCurrent(null);
      } else {
        alert(res.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la suppression';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const openEdit   = s => { setCurrent(s); setSaveError(''); setShowForm(true); };
  const openDelete = s => { setCurrent(s); setShowDelete(true); };

  const sidebarW  = sidebarCollapsed ? 72 : 240;
  const hasFilters = filterLevel !== 'all' || filterField !== 'all' || search;

  const statCards = [
    { label: 'Total étudiants', val: stats.totalStudents || students.length, icon: Users },
    { label: 'Niveaux',         val: levels.length,                          icon: GraduationCap },
    { label: 'Filières',        val: fields.length,                          icon: BookOpen },
  ];

  return (
    <div className="sv-root min-h-screen" style={{ background: 'var(--sv-bg)' }}>
      <Sidebar activeItem="students" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <main className="relative z-10 transition-all duration-300" style={{ marginLeft: `${sidebarW}px` }}>
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-8 h-16"
          style={{ background: 'rgba(10,15,28,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--sv-border)' }}
        >
          <div className="flex items-center gap-2 text-[12.5px]">
            <span style={{ color: 'var(--sv-text-faint)' }}>Admin</span>
            <span style={{ color: 'var(--sv-text-faint)' }}>/</span>
            <span className="sv-heading font-semibold" style={{ color: 'var(--sv-text)' }}>Étudiants</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex p-0.5 rounded-lg gap-0.5" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
              {[['grid', LayoutGrid, 'Cartes'], ['table', List, 'Tableau']].map(([mode, Icon, label]) => (
                <button
                  key={mode} onClick={() => setViewMode(mode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all"
                  style={viewMode === mode ? { background: 'var(--sv-accent)', color: 'var(--sv-accent-ink)' } : { color: 'var(--sv-text-faint)' }}
                >
                  <Icon size={13} strokeWidth={1.75} /><span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => { setCurrent(null); setSaveError(''); setShowForm(true); }} className="sv-btn sv-btn-primary px-4 py-2">
              <Plus size={15} strokeWidth={2} /> Nouvel étudiant
            </button>
          </div>
        </header>

        <div className="px-8 py-6 space-y-5">
          <div>
            <h1 className="sv-heading text-[22px] font-bold" style={{ color: 'var(--sv-text)' }}>Gestion des étudiants</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>
              {filtered.length} étudiant{filtered.length !== 1 ? 's' : ''} · {Object.keys(grouped).length} groupe{Object.keys(grouped).length !== 1 ? 's' : ''}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg sv-in" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
              <AlertTriangle size={15} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
              <span className="text-[13px]" style={{ color: '#F0A8A2' }}>{error}</span>
            </div>
          )}

          {saveError && (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg sv-in" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={15} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
                <span className="text-[13px]" style={{ color: '#F0A8A2' }}>{saveError}</span>
              </div>
              <button onClick={() => setSaveError('')} className="sv-icon-btn" style={{ width: 24, height: 24 }}><X size={12} /></button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {statCards.map(({ label, val, icon: Icon }) => (
              <div key={label} className="sv-card sv-in flex items-center gap-3.5 p-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)' }}>
                  <Icon size={16} strokeWidth={1.75} style={{ color: 'var(--sv-accent)' }} />
                </div>
                <div>
                  <p className="sv-heading text-lg font-bold" style={{ color: 'var(--sv-text)' }}>{val}</p>
                  <p className="text-[11.5px]" style={{ color: 'var(--sv-text-faint)' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 p-3.5 rounded-xl sv-card">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sv-text-faint)' }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Nom, téléphone, établissement…"
                className="sv-input w-full pl-9 pr-3 py-2.5 text-[13px]"
              />
            </div>
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="sv-input px-3.5 py-2.5 text-[13px] min-w-[160px]" style={{ cursor: 'pointer' }}>
              <option value="all">Tous les niveaux</option>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={filterField} onChange={e => setFilterField(e.target.value)} className="sv-input px-3.5 py-2.5 text-[13px] min-w-[160px]" style={{ cursor: 'pointer' }}>
              <option value="all">Toutes les filières</option>
              {fields.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            {hasFilters && (
              <button onClick={() => { setFilterLevel('all'); setFilterField('all'); setSearch(''); }} className="sv-btn sv-btn-ghost px-3 py-2.5">
                <RotateCcw size={13} strokeWidth={1.75} /> Réinitialiser
              </button>
            )}
          </div>

          {viewMode === 'grid' && (
            loading && students.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="sv-card p-4 space-y-3.5">
                    {[['70%', 'h-3.5'], ['50%', 'h-3'], ['100%', 'h-2.5'], ['80%', 'h-2.5']].map(([w, h], j) => (
                      <div key={j} className={`${h} rounded-full sv-shimmer`} style={{ background: 'var(--sv-surface-2)', width: w }} />
                    ))}
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl sv-card">
                <Users size={36} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', marginBottom: 12 }} />
                <p className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text-dim)' }}>Aucun étudiant trouvé</p>
                <p className="text-[12.5px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>Ajustez vos filtres ou ajoutez un étudiant</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((s, i) => <StudentCard key={s.id} student={s} index={i} onEdit={openEdit} onDelete={openDelete} />)}
              </div>
            )
          )}

          {viewMode === 'table' && (
            Object.keys(grouped).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl sv-card">
                <List size={36} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', marginBottom: 12 }} />
                <p className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text-dim)' }}>Aucun groupe trouvé</p>
              </div>
            ) : (
              <TableView grouped={grouped} onEdit={openEdit} onDelete={openDelete} />
            )
          )}
        </div>
      </main>

      {showForm && (
        <FormModal
          student={current}
          loading={loading}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setCurrent(null); setSaveError(''); }}
          levels={levels}
          fields={fields}
        />
      )}
      {showDelete && current && (
        <DeleteModal
          student={current}
          loading={loading}
          onConfirm={handleDelete}
          onClose={() => { setShowDelete(false); setCurrent(null); }}
        />
      )}
    </div>
  );
};

export default StudentsList;
