// src/components/FinanceList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '../services/paymentService';
import { studentAPI } from '../services/studentService';
import { courseAPI } from '../services/courseService';
import { professorPayoutAPI } from '../services/professorPayoutService';
import { staffPaymentAPI } from '../services/staffPaymentService';
import { equipmentAPI } from '../services/equipmentService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';
import {
  CheckCircle2, AlertCircle, Clock, Calendar, Receipt, Search,
  Plus, X, Pencil, Trash2, Check, AlertTriangle, LayoutGrid, List,
  RotateCcw, Banknote, Landmark, FileText, Smartphone, Sparkles,
  ChevronLeft, ChevronRight, Wallet, BookOpen, User, GraduationCap,
  Users, Package, Scale, TrendingUp, TrendingDown, Briefcase,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════ */
/*  DESIGN TOKENS — shared with StudentsList / ProfessorsList    */
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
    .sv-btn-success { background: var(--sv-success-soft); border-color: var(--sv-success-border); color: var(--sv-success); }
    .sv-btn-success:hover { background: rgba(95,174,131,0.22); }
    .sv-btn-success-solid { background: var(--sv-success); color: #0A1A12; }
    .sv-btn-success-solid:hover { background: #6FBF93; }
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
    .sv-icon-btn.success:hover { background: var(--sv-success-soft); color: var(--sv-success); border-color: var(--sv-success-border); }

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

    .sv-tab { border-bottom: 2px solid transparent; }
    .sv-tab.active { border-bottom: 2px solid var(--sv-accent); }
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
const MONTHS = [
  { value:'all',     label:'Tous les mois' },
  { value:'2026-01', label:'Janvier 2026' },
  { value:'2026-02', label:'Février 2026' },
  { value:'2026-03', label:'Mars 2026' },
  { value:'2026-04', label:'Avril 2026' },
  { value:'2026-05', label:'Mai 2026' },
  { value:'2026-06', label:'Juin 2026' },
  { value:'2026-07', label:'Juillet 2026' },
  { value:'2026-08', label:'Août 2026' },
  { value:'2026-09', label:'Septembre 2026' },
  { value:'2026-10', label:'Octobre 2026' },
  { value:'2026-11', label:'Novembre 2026' },
  { value:'2026-12', label:'Décembre 2026' },
];

const PAYMENT_METHODS = ['Espèces','Virement','Chèque','Mobile Pay'];
const METHOD_ICONS = { 'Espèces': Banknote, 'Virement': Landmark, 'Chèque': FileText, 'Mobile Pay': Smartphone };

const STATUS_CFG = {
  'Payé':     { color:'var(--sv-success)', soft:'var(--sv-success-soft)', border:'var(--sv-success-border)', icon: CheckCircle2, label:'Payé' },
  'Non payé': { color:'var(--sv-danger)',  soft:'var(--sv-danger-soft)',  border:'var(--sv-danger-border)',  icon: AlertCircle,  label:'Non payé' },
  'Partiel':  { color:'var(--sv-warning)', soft:'var(--sv-warning-soft)', border:'var(--sv-warning-border)', icon: Clock,        label:'Partiel' },
};

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.map(p => p[0] || '').join('').toUpperCase().slice(0, 2);
};

// Flat, muted avatar palette shared with StudentsList / ProfessorsList
const AVATAR_COLORS = ['#8B93E8', '#C9A24D', '#5CADC2', '#D18BA0', '#5FAE83', '#C97A6B'];
const getAvatarColor = (id) => AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];

const fmtMAD = (v) => v != null ? `${Number(v).toLocaleString('fr-FR')} MAD` : '—';

const Avatar = ({ id, name, size = 36, textSize = 12 }) => {
  const c = getAvatarColor(id);
  return (
    <div
      className="sv-heading font-bold flex items-center justify-center rounded-lg flex-shrink-0"
      style={{ width: size, height: size, fontSize: textSize, background: `${c}22`, color: c, border: `1px solid ${c}40` }}
    >
      {getInitials(name)}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const sc = STATUS_CFG[status] || STATUS_CFG['Non payé'];
  const Icon = sc.icon;
  return (
    <span className="sv-tag" style={{ background: sc.soft, border: `1px solid ${sc.border}`, color: sc.color }}>
      <Icon size={11} strokeWidth={2} /> {sc.label}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  PAYMENT ROW (table view)                                     */
/* ══════════════════════════════════════════════════════════════ */
const PaymentRow = ({ payment, onEdit, onDelete, onPay }) => {
  const effectiveAmount = payment.customPrice ?? payment.amount;
  const MethodIcon = payment.paymentMethod ? METHOD_ICONS[payment.paymentMethod] : null;

  return (
    <div className="sv-row grid items-center px-6 py-3.5"
      style={{ gridTemplateColumns: '2.5fr 1.8fr 1fr 1fr 1fr 1.2fr 1fr auto', borderBottom: '1px solid var(--sv-border)' }}>

      <div className="flex items-center gap-3 min-w-0">
        <Avatar id={payment.studentId} name={payment.studentName} size={34} textSize={11} />
        <div className="min-w-0">
          <p className="text-[13px] font-medium truncate" style={{ color: 'var(--sv-text)' }}>{payment.studentName || '—'}</p>
          <p className="text-[10.5px]" style={{ color: 'var(--sv-text-faint)' }}>#{payment.studentId}</p>
        </div>
      </div>

      <div className="min-w-0 pr-3">
        <p className="text-[12px] truncate" style={{ color: 'var(--sv-text-dim)' }}>
          {payment.courseTitle || <span style={{ color: 'var(--sv-text-faint)' }}>—</span>}
        </p>
      </div>

      <div>
        <p className="text-[13.5px] font-semibold" style={{ color: 'var(--sv-accent)' }}>
          {Number(effectiveAmount || 0).toLocaleString('fr-FR')}
          <span className="text-[10px] font-normal ml-1" style={{ color: 'var(--sv-text-faint)' }}>MAD</span>
        </p>
        {payment.customPrice && payment.customPrice !== payment.amount && (
          <p className="text-[10px]" style={{ color: 'var(--sv-info)' }}>Prix perso</p>
        )}
      </div>

      <div>
        <span className="sv-tag" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--sv-border-strong)', color: 'var(--sv-text-faint)' }}>
          {payment.paymentMonth || '—'}
        </span>
      </div>

      <div><StatusBadge status={payment.status} /></div>

      <div>
        {payment.paymentDate ? (
          <p className="text-[11.5px]" style={{ color: 'var(--sv-text-faint)' }}>
            {new Date(payment.paymentDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </p>
        ) : payment.dueDate ? (
          <p className="text-[11.5px]" style={{ color: 'var(--sv-danger)' }}>
            Éch. {new Date(payment.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </p>
        ) : (
          <span style={{ color: 'var(--sv-text-faint)' }}>—</span>
        )}
      </div>

      <div>
        {payment.paymentMethod ? (
          <span className="flex items-center gap-1.5 text-[11.5px]" style={{ color: 'var(--sv-text-dim)' }}>
            {MethodIcon && <MethodIcon size={12} strokeWidth={1.75} />} {payment.paymentMethod}
          </span>
        ) : (
          <span style={{ color: 'var(--sv-text-faint)', fontSize: '11.5px' }}>—</span>
        )}
      </div>

      <div className="sv-row-actions flex items-center gap-1.5 justify-end">
        {payment.status !== 'Payé' && (
          <button onClick={() => onPay(payment)} className="sv-icon-btn success" title="Marquer payé">
            <Check size={13} strokeWidth={2} />
          </button>
        )}
        <button onClick={() => onEdit(payment)} className="sv-icon-btn"><Pencil size={13} strokeWidth={1.75} /></button>
        <button onClick={() => onDelete(payment)} className="sv-icon-btn danger"><Trash2 size={13} strokeWidth={1.75} /></button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  PAYMENT CARD (grid view)                                     */
/* ══════════════════════════════════════════════════════════════ */
const PaymentCard = ({ payment, onEdit, onDelete, onPay, index }) => {
  const effectiveAmount = payment.customPrice ?? payment.amount;
  const rows = [
    { icon: BookOpen, val: payment.courseTitle || '—' },
    { icon: Calendar, val: payment.paymentMonth || 'Mois non défini' },
    payment.paymentMethod && { icon: METHOD_ICONS[payment.paymentMethod] || Wallet, val: payment.paymentMethod },
    payment.paymentDate && { icon: CheckCircle2, val: `Payé le ${new Date(payment.paymentDate).toLocaleDateString('fr-FR')}` },
    payment.dueDate && !payment.paymentDate && { icon: Clock, val: `Échéance ${new Date(payment.dueDate).toLocaleDateString('fr-FR')}`, danger: true },
  ].filter(Boolean);

  return (
    <div className="sv-card sv-in flex flex-col overflow-hidden" style={{ animationDelay: `${index * 30}ms` }}>
      <div className="p-4 flex flex-col gap-3.5 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar id={payment.studentId} name={payment.studentName} size={42} textSize={14} />
            <div>
              <p className="sv-heading text-[13.5px] font-semibold" style={{ color: 'var(--sv-text)' }}>{payment.studentName || '—'}</p>
              <p className="text-[10.5px]" style={{ color: 'var(--sv-text-faint)' }}>#{payment.studentId}</p>
            </div>
          </div>
          <StatusBadge status={payment.status} />
        </div>

        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
          <div>
            <p className="text-[10px] font-semibold tracking-wide mb-0.5" style={{ color: 'var(--sv-text-faint)' }}>MONTANT</p>
            <p className="sv-heading text-lg font-bold" style={{ color: 'var(--sv-accent)' }}>
              {Number(effectiveAmount || 0).toLocaleString('fr-FR')}
              <span className="text-[11px] font-normal ml-1" style={{ color: 'var(--sv-text-faint)' }}>MAD</span>
            </p>
          </div>
          {payment.customPrice && payment.customPrice !== payment.amount && (
            <div className="text-right">
              <p className="text-[10px] font-semibold tracking-wide mb-0.5" style={{ color: 'var(--sv-info)' }}>STANDARD</p>
              <p className="text-[11.5px]" style={{ color: 'var(--sv-info)' }}>{Number(payment.amount || 0).toLocaleString('fr-FR')} MAD</p>
            </div>
          )}
        </div>

        <div className="h-px" style={{ background: 'var(--sv-border)' }} />

        <div className="space-y-1.5">
          {rows.map(({ icon: Icon, val, danger }, i) => (
            <div key={i} className="flex items-center gap-2">
              <Icon size={13} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)', flexShrink: 0 }} />
              <span className="text-[12px] truncate" style={{ color: danger ? 'var(--sv-danger)' : 'var(--sv-text-dim)' }}>{val}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-auto pt-3" style={{ borderTop: '1px solid var(--sv-border)' }}>
          {payment.status !== 'Payé' && (
            <button onClick={() => onPay(payment)} className="sv-btn sv-btn-success flex-1 py-2">
              <Check size={13} strokeWidth={2} /> Payer
            </button>
          )}
          <button onClick={() => onEdit(payment)} className="sv-icon-btn"><Pencil size={13} strokeWidth={1.75} /></button>
          <button onClick={() => onDelete(payment)} className="sv-icon-btn danger"><Trash2 size={13} strokeWidth={1.75} /></button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  FORM MODAL                                                   */
/* ══════════════════════════════════════════════════════════════ */
const FormModal = ({ payment, students, courses, loading, onSave, onClose }) => {
  const isEdit = !!payment;
  const [activeSection, setActiveSection] = useState(0);
  const sections = ['Étudiant & Cours', 'Montant', 'Calendrier', 'Notes'];
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState(() => ({
    studentId:     payment?.studentId || '',
    courseId:      payment?.courseId || '',
    amount:        payment?.amount || '',
    customPrice:   payment?.customPrice || '',
    status:        payment?.status || 'Non payé',
    paymentDate:   payment?.paymentDate || '',
    dueDate:       payment?.dueDate || '',
    paymentMonth:  payment?.paymentMonth || '',
    paymentMethod: payment?.paymentMethod || '',
    notes:         payment?.notes || '',
  }));

  const h = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.studentId) e.studentId = 'Requis';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) < 0) e.amount = 'Montant valide requis';
    return e;
  };

  const submit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      studentId:     parseInt(form.studentId),
      courseId:      form.courseId ? parseInt(form.courseId) : null,
      amount:        parseFloat(form.amount),
      customPrice:   form.customPrice ? parseFloat(form.customPrice) : null,
      status:        form.status,
      paymentDate:   form.paymentDate || null,
      dueDate:       form.dueDate || null,
      paymentMonth:  form.paymentMonth || null,
      paymentMethod: form.paymentMethod || null,
      notes:         form.notes || null,
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

  const selectedStudent = students.find(s => String(s.id) === String(form.studentId));
  const effectivePreview = form.customPrice ? parseFloat(form.customPrice) : parseFloat(form.amount) || 0;

  const sectionContent = [
    /* 0 — Étudiant & Cours */
    <div key="student" className="space-y-4">
      {selectedStudent && (
        <div className="flex items-center gap-3.5 p-3.5 rounded-lg sv-in" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
          <Avatar id={selectedStudent.id} name={`${selectedStudent.prenom} ${selectedStudent.nom}`} size={44} textSize={15} />
          <div>
            <p className="sv-heading font-semibold text-[13.5px]" style={{ color: 'var(--sv-text)' }}>{selectedStudent.prenom} {selectedStudent.nom}</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{selectedStudent.niveau} · {selectedStudent.filiere}</p>
          </div>
        </div>
      )}
      <div>
        <LabelRow name="studentId" label="ÉTUDIANT" req />
        <select name="studentId" value={form.studentId} onChange={h} className={inp('studentId')} style={{ cursor: 'pointer' }}>
          <option value="">Sélectionner un étudiant…</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.prenom} {s.nom}</option>)}
        </select>
      </div>
      <div>
        <LabelRow name="courseId" label="COURS ASSOCIÉ" />
        <select name="courseId" value={form.courseId} onChange={h} className={inp('courseId')} style={{ cursor: 'pointer' }}>
          <option value="">Aucun cours</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      <div>
        <LabelRow name="status" label="STATUT" />
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(STATUS_CFG).map(([key, sc]) => {
            const Icon = sc.icon;
            const sel = form.status === key;
            return (
              <button key={key} type="button" onClick={() => setForm(p => ({ ...p, status: key }))}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-semibold transition-all"
                style={{ background: sel ? sc.soft : 'var(--sv-surface-2)', border: `1px solid ${sel ? sc.border : 'var(--sv-border)'}`, color: sel ? sc.color : 'var(--sv-text-faint)' }}>
                <Icon size={13} strokeWidth={2} /> {sc.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>,

    /* 1 — Montant */
    <div key="amount" className="space-y-4">
      <div>
        <LabelRow name="amount" label="MONTANT STANDARD (MAD)" req />
        <input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={h} placeholder="Ex : 500" className={inp('amount')} />
      </div>
      <div>
        <LabelRow name="customPrice" label="PRIX PERSONNALISÉ (MAD)" />
        <input name="customPrice" type="number" min="0" step="0.01" value={form.customPrice} onChange={h} placeholder="Laisser vide = prix standard" className={inp('customPrice')} />
        <p className="text-[11.5px] mt-1.5" style={{ color: 'var(--sv-text-faint)' }}>Le prix personnalisé remplace le montant standard pour cet étudiant.</p>
      </div>
      <div className="p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
        <p className="text-[10.5px] font-semibold tracking-wide mb-2" style={{ color: 'var(--sv-text-faint)' }}>APERÇU DU PAIEMENT</p>
        <div className="flex items-center justify-between">
          <span className="text-[13px]" style={{ color: 'var(--sv-text-dim)' }}>Montant effectif</span>
          <span className="sv-heading text-xl font-bold" style={{ color: 'var(--sv-accent)' }}>{effectivePreview.toLocaleString('fr-FR')} MAD</span>
        </div>
        {form.customPrice && (
          <p className="text-[11px] mt-1" style={{ color: 'var(--sv-info)' }}>
            Prix personnalisé appliqué (standard : {parseFloat(form.amount || 0).toLocaleString('fr-FR')} MAD)
          </p>
        )}
      </div>
      <div>
        <LabelRow name="paymentMethod" label="MÉTHODE DE PAIEMENT" />
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map(m => {
            const Icon = METHOD_ICONS[m];
            const sel = form.paymentMethod === m;
            return (
              <button key={m} type="button" onClick={() => setForm(p => ({ ...p, paymentMethod: m }))}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] transition-all"
                style={{ background: sel ? 'var(--sv-accent-soft)' : 'var(--sv-surface-2)', border: `1px solid ${sel ? 'var(--sv-accent-border)' : 'var(--sv-border)'}`, color: sel ? 'var(--sv-accent)' : 'var(--sv-text-dim)' }}>
                <Icon size={14} strokeWidth={1.75} /> {m}
              </button>
            );
          })}
        </div>
      </div>
    </div>,

    /* 2 — Calendrier */
    <div key="calendar" className="space-y-4">
      <div>
        <LabelRow name="paymentMonth" label="MOIS CONCERNÉ" />
        <select name="paymentMonth" value={form.paymentMonth} onChange={h} className={inp('paymentMonth')} style={{ cursor: 'pointer' }}>
          <option value="">— Non défini —</option>
          {MONTHS.filter(m => m.value !== 'all').map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>
      <div>
        <LabelRow name="dueDate" label="DATE D'ÉCHÉANCE" />
        <input name="dueDate" type="date" value={form.dueDate} onChange={h} className={inp('dueDate')} />
      </div>
      {(form.status === 'Payé' || form.status === 'Partiel') && (
        <div>
          <LabelRow name="paymentDate" label="DATE DE PAIEMENT" />
          <input name="paymentDate" type="date" value={form.paymentDate} onChange={h} className={inp('paymentDate')} />
        </div>
      )}
    </div>,

    /* 3 — Notes */
    <div key="notes" className="space-y-4">
      <div>
        <LabelRow name="notes" label="NOTES / REMARQUES" />
        <textarea name="notes" value={form.notes} onChange={h} rows={6}
          placeholder="Informations complémentaires, accords spéciaux…"
          className="sv-input w-full px-3.5 py-2.5 text-[13.5px] resize-none" />
      </div>
      <div className="p-3.5 rounded-lg space-y-2" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
        <p className="text-[10.5px] font-semibold tracking-wide mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>RÉCAPITULATIF</p>
        {[
          { label: 'Étudiant', val: selectedStudent ? `${selectedStudent.prenom} ${selectedStudent.nom}` : '—' },
          { label: 'Montant', val: `${effectivePreview.toLocaleString('fr-FR')} MAD` },
          { label: 'Statut', val: form.status },
          { label: 'Méthode', val: form.paymentMethod || '—' },
          { label: 'Mois', val: MONTHS.find(m => m.value === form.paymentMonth)?.label || '—' },
        ].map(({ label, val }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-[12px]" style={{ color: 'var(--sv-text-faint)' }}>{label}</span>
            <span className="text-[12px] font-medium" style={{ color: 'var(--sv-text)' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border-strong)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <div>
            <h2 className="sv-heading text-[15px] font-semibold" style={{ color: 'var(--sv-text)' }}>{isEdit ? 'Modifier le paiement' : 'Nouveau paiement'}</h2>
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
            <button type="button" onClick={activeSection === 0 ? onClose : () => setActiveSection(p => p - 1)} className="sv-btn sv-btn-ghost flex-1 py-2.5">
              {activeSection === 0 ? 'Annuler' : (<><ChevronLeft size={14} strokeWidth={2} /> Retour</>)}
            </button>
            {activeSection < sections.length - 1 ? (
              <button type="button" onClick={() => setActiveSection(p => p + 1)} className="sv-btn sv-btn-primary flex-1 py-2.5">
                Suivant <ChevronRight size={14} strokeWidth={2} />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="sv-btn sv-btn-primary flex-1 py-2.5">
                {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer le paiement'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  MARK PAID MODAL                                              */
/* ══════════════════════════════════════════════════════════════ */
const MarkPaidModal = ({ payment, loading, onConfirm, onClose }) => {
  const [method, setMethod] = useState('Espèces');
  const effectiveAmount = payment.customPrice ?? payment.amount;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-success-border)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sv-success-soft)', border: '1px solid var(--sv-success-border)' }}>
            <CheckCircle2 size={16} strokeWidth={1.75} style={{ color: 'var(--sv-success)' }} />
          </div>
          <div>
            <h3 className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text)' }}>Confirmer le paiement</h3>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>Marquer comme payé</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
            <Avatar id={payment.studentId} name={payment.studentName} size={42} textSize={14} />
            <div className="flex-1">
              <p className="sv-heading font-semibold text-[13px]" style={{ color: 'var(--sv-text)' }}>{payment.studentName}</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{payment.courseTitle || 'Sans cours'}</p>
            </div>
            <div className="text-right">
              <p className="sv-heading text-lg font-bold" style={{ color: 'var(--sv-success)' }}>{Number(effectiveAmount || 0).toLocaleString('fr-FR')}</p>
              <p className="text-[10px]" style={{ color: 'var(--sv-text-faint)' }}>MAD</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-wide mb-2.5" style={{ color: 'var(--sv-text-faint)' }}>MÉTHODE DE PAIEMENT</p>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map(m => {
                const Icon = METHOD_ICONS[m];
                const sel = method === m;
                return (
                  <button key={m} type="button" onClick={() => setMethod(m)}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] transition-all"
                    style={{ background: sel ? 'var(--sv-success-soft)' : 'var(--sv-surface-2)', border: `1px solid ${sel ? 'var(--sv-success-border)' : 'var(--sv-border)'}`, color: sel ? 'var(--sv-success)' : 'var(--sv-text-dim)' }}>
                    <Icon size={14} strokeWidth={1.75} /> {m}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} disabled={loading} className="sv-btn sv-btn-ghost flex-1 py-2.5">Annuler</button>
            <button onClick={() => onConfirm(payment, method)} disabled={loading} className="sv-btn sv-btn-success-solid flex-1 py-2.5">
              {loading ? 'Traitement…' : (<><Check size={14} strokeWidth={2} /> Confirmer</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  DELETE MODAL                                                 */
/* ══════════════════════════════════════════════════════════════ */
const DeleteModal = ({ payment, onConfirm, onClose, loading }) => {
  if (!payment) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-danger-border)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
            <AlertTriangle size={16} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
          </div>
          <div>
            <h3 className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text)' }}>Supprimer ce paiement ?</h3>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>Action irréversible</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
            <Avatar id={payment.studentId} name={payment.studentName} size={40} textSize={13} />
            <div>
              <p className="sv-heading font-semibold text-[13px]" style={{ color: 'var(--sv-text)' }}>{payment.studentName}</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>
                {payment.courseTitle} · {Number((payment.customPrice ?? payment.amount) || 0).toLocaleString('fr-FR')} MAD
              </p>
            </div>
          </div>
          <p className="text-[12px]" style={{ color: 'var(--sv-text-dim)' }}>Ce paiement et toutes ses données seront définitivement supprimés.</p>
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
/*  ONGLET — REVENUS PROFESSEURS (payable, comme Personnel)      */
/* ══════════════════════════════════════════════════════════════ */
const ProfessorPayoutRow = ({ item, onPay, onEditNote }) => (
  <div className="sv-row px-5 py-3.5" style={{ borderBottom: '1px solid var(--sv-border)' }}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar id={item.professorId} name={item.professorName} size={34} textSize={11} />
        <div className="min-w-0">
          <p className="text-[13px] font-medium truncate" style={{ color: 'var(--sv-text)' }}>{item.professorName}</p>
          <p className="text-[11.5px] truncate" style={{ color: 'var(--sv-text-faint)' }}>{item.mois}{item.virtual ? ' · estimé automatiquement' : ''}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="text-[13.5px] font-semibold" style={{ color: 'var(--sv-accent)' }}>{Number(item.montant || 0).toLocaleString('fr-FR')} MAD</span>
        <span className="sv-tag" style={{ background: item.statut === 'Payé' ? 'var(--sv-success-soft)' : 'var(--sv-danger-soft)', border: `1px solid ${item.statut === 'Payé' ? 'var(--sv-success-border)' : 'var(--sv-danger-border)'}`, color: item.statut === 'Payé' ? 'var(--sv-success)' : 'var(--sv-danger)' }}>
          {item.statut === 'Payé' ? <CheckCircle2 size={11} strokeWidth={2} /> : <AlertCircle size={11} strokeWidth={2} />} {item.statut}
        </span>
        {item.statut !== 'Payé' && (
          <button onClick={() => onPay(item)} className="sv-btn sv-btn-success px-3 py-1.5">
            <Check size={12} strokeWidth={2} /> Marquer payé
          </button>
        )}
      </div>
    </div>
  </div>
);

const ProfessorPayoutsTab = ({ payouts, loading, onPay }) => {
  if (loading && payouts.length === 0) {
    return <div className="space-y-2.5">{[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-lg sv-shimmer" style={{ background: 'var(--sv-surface-2)' }} />)}</div>;
  }
  if (payouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-xl sv-card">
        <GraduationCap size={32} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', marginBottom: 12 }} />
        <p className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text-dim)' }}>Aucun professeur</p>
      </div>
    );
  }
  return (
    <div className="sv-card overflow-hidden">
      {payouts.map((item, i) => (
        <ProfessorPayoutRow key={item.id ?? `virtual-${item.professorId}`} item={item} onPay={onPay} />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  ONGLET — PERSONNEL (staff payments)                          */
/* ══════════════════════════════════════════════════════════════ */
const POSTES_STAFF = ['Secrétaire', 'Femme de ménage', 'Gardien', 'Comptable', 'Agent de sécurité', 'Autre'];

const StaffRow = ({ item, onEdit, onDelete, onPay }) => (
  <div className="sv-row flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--sv-border)' }}>
    <div className="flex items-center gap-3 min-w-0">
      <Avatar id={item.id} name={item.nomEmploye} size={34} textSize={11} />
      <div className="min-w-0">
        <p className="text-[13px] font-medium truncate" style={{ color: 'var(--sv-text)' }}>{item.nomEmploye}</p>
        <p className="text-[11.5px] truncate" style={{ color: 'var(--sv-text-faint)' }}>{item.poste} · {item.periodicite}</p>
      </div>
    </div>
    <div className="flex items-center gap-4 flex-shrink-0">
      <span className="text-[13.5px] font-semibold" style={{ color: 'var(--sv-accent)' }}>{Number(item.montant || 0).toLocaleString('fr-FR')} MAD</span>
      <span className="sv-tag" style={{ background: item.statut === 'Payé' ? 'var(--sv-success-soft)' : 'var(--sv-danger-soft)', border: `1px solid ${item.statut === 'Payé' ? 'var(--sv-success-border)' : 'var(--sv-danger-border)'}`, color: item.statut === 'Payé' ? 'var(--sv-success)' : 'var(--sv-danger)' }}>
        {item.statut === 'Payé' ? <CheckCircle2 size={11} strokeWidth={2} /> : <AlertCircle size={11} strokeWidth={2} />} {item.statut}
      </span>
      <div className="flex items-center gap-1.5">
        {item.statut !== 'Payé' && <button onClick={() => onPay(item)} className="sv-icon-btn success" title="Marquer payé"><Check size={13} strokeWidth={2} /></button>}
        <button onClick={() => onEdit(item)} className="sv-icon-btn"><Pencil size={13} strokeWidth={1.75} /></button>
        <button onClick={() => onDelete(item)} className="sv-icon-btn danger"><Trash2 size={13} strokeWidth={1.75} /></button>
      </div>
    </div>
  </div>
);

const StaffFormModal = ({ item, loading, onSave, onClose }) => {
  const isEdit = !!item;
  const [form, setForm] = useState({
    nomEmploye: item?.nomEmploye || '', poste: item?.poste || '', montant: item?.montant?.toString() || '',
    periodicite: item?.periodicite || 'Mensuel', paymentMonth: item?.paymentMonth || '', statut: item?.statut || 'Non payé', notes: item?.notes || '',
  });
  const [errors, setErrors] = useState({});
  const h = e => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); if (errors[name]) setErrors(p => ({ ...p, [name]: '' })); };
  const inp = (f) => `sv-input w-full px-3.5 py-2.5 text-[13.5px] ${errors[f] ? 'error' : ''}`;

  const submit = e => {
    e.preventDefault();
    const errs = {};
    if (!form.nomEmploye.trim()) errs.nomEmploye = 'Requis';
    if (!form.poste.trim()) errs.poste = 'Requis';
    if (!form.montant || isNaN(form.montant) || Number(form.montant) < 0) errs.montant = 'Montant valide requis';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, montant: parseFloat(form.montant) });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border-strong)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <h2 className="sv-heading text-[15px] font-semibold" style={{ color: 'var(--sv-text)' }}>{isEdit ? 'Modifier le paiement' : 'Nouveau paiement personnel'}</h2>
          <button onClick={onClose} className="sv-icon-btn"><X size={15} strokeWidth={1.75} /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>NOM DE L'EMPLOYÉ *</label>
              <input name="nomEmploye" value={form.nomEmploye} onChange={h} placeholder="Ex : Fatima Zahra" className={inp('nomEmploye')} />
              {errors.nomEmploye && <p className="text-[11px] mt-1" style={{ color: 'var(--sv-danger)' }}>{errors.nomEmploye}</p>}
            </div>
            <div>
              <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>POSTE *</label>
              <select name="poste" value={form.poste} onChange={h} className={inp('poste')} style={{ cursor: 'pointer' }}>
                <option value="">Sélectionner…</option>
                {POSTES_STAFF.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.poste && <p className="text-[11px] mt-1" style={{ color: 'var(--sv-danger)' }}>{errors.poste}</p>}
            </div>
            <div>
              <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>MONTANT (MAD) *</label>
              <input name="montant" type="number" min="0" step="0.01" value={form.montant} onChange={h} placeholder="3000" className={inp('montant')} />
              {errors.montant && <p className="text-[11px] mt-1" style={{ color: 'var(--sv-danger)' }}>{errors.montant}</p>}
            </div>
            <div>
              <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>PÉRIODICITÉ</label>
              <select name="periodicite" value={form.periodicite} onChange={h} className={inp('periodicite')} style={{ cursor: 'pointer' }}>
                <option value="Mensuel">Mensuel</option>
                <option value="Ponctuel">Ponctuel</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>MOIS CONCERNÉ</label>
              <select name="paymentMonth" value={form.paymentMonth} onChange={h} className={inp('paymentMonth')} style={{ cursor: 'pointer' }}>
                <option value="">— Non défini —</option>
                {MONTHS.filter(m => m.value !== 'all').map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>STATUT</label>
              <select name="statut" value={form.statut} onChange={h} className={inp('statut')} style={{ cursor: 'pointer' }}>
                <option value="Non payé">Non payé</option>
                <option value="Payé">Payé</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>NOTES</label>
            <textarea name="notes" value={form.notes} onChange={h} rows={3} placeholder="Informations complémentaires…" className="sv-input w-full px-3.5 py-2.5 text-[13.5px] resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="sv-btn sv-btn-ghost flex-1 py-2.5">Annuler</button>
            <button type="submit" disabled={loading} className="sv-btn sv-btn-primary flex-1 py-2.5">{loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  ONGLET — ÉQUIPEMENT                                          */
/* ══════════════════════════════════════════════════════════════ */
const CATEGORIES_EQUIP = ['Mobilier', 'Informatique', 'Fournitures', 'Pédagogique', 'Autre'];

const EquipmentRow = ({ item, onEdit, onDelete }) => (
  <div className="sv-row flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--sv-border)' }}>
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sv-warning-soft)', border: '1px solid var(--sv-warning-border)' }}>
        <Package size={15} strokeWidth={1.75} style={{ color: 'var(--sv-warning)' }} />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-medium truncate" style={{ color: 'var(--sv-text)' }}>{item.libelle} {item.quantite > 1 ? `× ${item.quantite}` : ''}</p>
        <p className="text-[11.5px] truncate" style={{ color: 'var(--sv-text-faint)' }}>
          {item.categorie}{item.fournisseur ? ` · ${item.fournisseur}` : ''} · {item.dateAchat ? new Date(item.dateAchat).toLocaleDateString('fr-FR') : '—'}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-4 flex-shrink-0">
      <span className="text-[13.5px] font-semibold" style={{ color: 'var(--sv-accent)' }}>{Number((item.montant || 0) * (item.quantite || 1)).toLocaleString('fr-FR')} MAD</span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onEdit(item)} className="sv-icon-btn"><Pencil size={13} strokeWidth={1.75} /></button>
        <button onClick={() => onDelete(item)} className="sv-icon-btn danger"><Trash2 size={13} strokeWidth={1.75} /></button>
      </div>
    </div>
  </div>
);

const EquipmentFormModal = ({ item, loading, onSave, onClose }) => {
  const isEdit = !!item;
  const [form, setForm] = useState({
    libelle: item?.libelle || '', categorie: item?.categorie || '', montant: item?.montant?.toString() || '',
    quantite: item?.quantite?.toString() || '1', fournisseur: item?.fournisseur || '',
    dateAchat: item?.dateAchat || new Date().toISOString().slice(0, 10), notes: item?.notes || '',
  });
  const [errors, setErrors] = useState({});
  const h = e => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); if (errors[name]) setErrors(p => ({ ...p, [name]: '' })); };
  const inp = (f) => `sv-input w-full px-3.5 py-2.5 text-[13.5px] ${errors[f] ? 'error' : ''}`;

  const submit = e => {
    e.preventDefault();
    const errs = {};
    if (!form.libelle.trim()) errs.libelle = 'Requis';
    if (!form.categorie.trim()) errs.categorie = 'Requis';
    if (!form.montant || isNaN(form.montant) || Number(form.montant) < 0) errs.montant = 'Montant valide requis';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, montant: parseFloat(form.montant), quantite: parseInt(form.quantite) || 1 });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border-strong)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <h2 className="sv-heading text-[15px] font-semibold" style={{ color: 'var(--sv-text)' }}>{isEdit ? "Modifier l'équipement" : 'Nouvel achat équipement'}</h2>
          <button onClick={onClose} className="sv-icon-btn"><X size={15} strokeWidth={1.75} /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>LIBELLÉ *</label>
            <input name="libelle" value={form.libelle} onChange={h} placeholder="Ex : Tables, Chaises, Tableau blanc…" className={inp('libelle')} />
            {errors.libelle && <p className="text-[11px] mt-1" style={{ color: 'var(--sv-danger)' }}>{errors.libelle}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>CATÉGORIE *</label>
              <select name="categorie" value={form.categorie} onChange={h} className={inp('categorie')} style={{ cursor: 'pointer' }}>
                <option value="">Sélectionner…</option>
                {CATEGORIES_EQUIP.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.categorie && <p className="text-[11px] mt-1" style={{ color: 'var(--sv-danger)' }}>{errors.categorie}</p>}
            </div>
            <div>
              <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>QUANTITÉ</label>
              <input name="quantite" type="number" min="1" value={form.quantite} onChange={h} className={inp('quantite')} />
            </div>
            <div>
              <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>PRIX UNITAIRE (MAD) *</label>
              <input name="montant" type="number" min="0" step="0.01" value={form.montant} onChange={h} placeholder="500" className={inp('montant')} />
              {errors.montant && <p className="text-[11px] mt-1" style={{ color: 'var(--sv-danger)' }}>{errors.montant}</p>}
            </div>
            <div>
              <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>DATE D'ACHAT</label>
              <input name="dateAchat" type="date" value={form.dateAchat} onChange={h} className={inp('dateAchat')} />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>FOURNISSEUR</label>
              <input name="fournisseur" value={form.fournisseur} onChange={h} placeholder="Optionnel" className={inp('fournisseur')} />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold tracking-wide block mb-1.5" style={{ color: 'var(--sv-text-faint)' }}>NOTES</label>
            <textarea name="notes" value={form.notes} onChange={h} rows={3} placeholder="Informations complémentaires…" className="sv-input w-full px-3.5 py-2.5 text-[13.5px] resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="sv-btn sv-btn-ghost flex-1 py-2.5">Annuler</button>
            <button type="submit" disabled={loading} className="sv-btn sv-btn-primary flex-1 py-2.5">{loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  MODALE DE SUPPRESSION GÉNÉRIQUE (personnel / équipement)     */
/* ══════════════════════════════════════════════════════════════ */
const GenericDeleteModal = ({ title, subtitle, onConfirm, onClose, loading }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
    <div className="sv-in w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-danger-border)', boxShadow: 'var(--sv-shadow-md)' }}>
      <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--sv-border)' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
          <AlertTriangle size={16} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
        </div>
        <div>
          <h3 className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text)' }}>{title}</h3>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{subtitle}</p>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-[12px]" style={{ color: 'var(--sv-text-dim)' }}>Cette action est irréversible.</p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="sv-btn sv-btn-ghost flex-1 py-2.5">Annuler</button>
          <button onClick={onConfirm} disabled={loading} className="sv-btn sv-btn-danger flex-1 py-2.5">{loading ? 'Suppression…' : 'Supprimer'}</button>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                    */
/* ══════════════════════════════════════════════════════════════ */
const FinanceList = () => {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState('payments');
  const [payments, setPayments]   = useState([]);
  const [students, setStudents]   = useState([]);
  const [courses, setCourses]     = useState([]);
  const [professorPayouts, setProfessorPayouts] = useState([]);
  const [professorPayoutStats, setProfessorPayoutStats] = useState({ totalPaid: 0, totalUnpaid: 0, currentMonthTotal: 0, totalEstimeMoisCourant: 0 });
  const [staffPayments, setStaffPayments] = useState([]);
  const [staffStats, setStaffStats] = useState({ totalPaid: 0, totalUnpaid: 0, currentMonthTotal: 0 });
  const [equipment, setEquipment] = useState([]);
  const [equipmentStats, setEquipmentStats] = useState({ totalMontant: 0 });
  const [stats, setStats]         = useState({ totalPaid:0, totalUnpaid:0, countPaid:0, countUnpaid:0, countPartial:0, total:0, currentMonthTotal:0 });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode]   = useState('table');

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth]   = useState('all');
  const [search, setSearch]             = useState('');

  const [showForm, setShowForm]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showPay, setShowPay]       = useState(false);
  const [current, setCurrent]       = useState(null);

  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showStaffDelete, setShowStaffDelete] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  const [showEquipForm, setShowEquipForm] = useState(false);
  const [showEquipDelete, setShowEquipDelete] = useState(false);
  const [currentEquip, setCurrentEquip] = useState(null);

  useEffect(() => {
    if (!getAuthToken()) { navigate('/login'); return; }
    loadAll();
  }, []);

  // ── REMPLACEMENT de la fonction loadAll dans FinanceList.js ──
  // Le bug : paymentsRes.data peut être directement un tableau []
  // au lieu de { content: [], ... } selon la réponse backend

  const loadAll = async () => {
    try {
      setLoading(true);
      setError('');

      const [paymentsRes, statsRes, studentsRes, coursesRes, payoutsRes, payoutStatsRes, staffRes, staffStatsRes, equipRes, equipStatsRes] = await Promise.all([
        paymentAPI.getAllPayments(),
        paymentAPI.getStats(),
        studentAPI ? studentAPI.getAllStudents({ size: 200 }) : Promise.resolve({ success: false }),
        courseAPI.getAllCourses(),
        professorPayoutAPI.getAllPayouts(),
        professorPayoutAPI.getStats(),
        staffPaymentAPI.getAllStaffPayments(),
        staffPaymentAPI.getStats(),
        equipmentAPI.getAllEquipment(),
        equipmentAPI.getStats(),
      ]);

      console.log('=== DEBUG loadAll ===');
      console.log('paymentsRes:', paymentsRes);
      console.log('statsRes:', statsRes);
      console.log('studentsRes:', studentsRes);

      // ✅ Payments — le backend retourne { success, data: [...] }
      // data est directement un tableau (pas paginé)
      if (paymentsRes.success) {
        const pData = paymentsRes.data;
        // Gère les 2 cas : tableau direct ou objet paginé
        if (Array.isArray(pData)) {
          setPayments(pData);
        } else if (pData?.content) {
          setPayments(pData.content);
        } else {
          setPayments([]);
        }
        console.log('✅ Payments chargés:', Array.isArray(pData) ? pData.length : pData?.content?.length);
      } else {
        console.warn('❌ paymentsRes.success = false:', paymentsRes);
      }

      // ✅ Stats
      if (statsRes.success) {
        setStats(statsRes.data || {});
      }

      // ✅ Students
      if (studentsRes.success) {
        const sData = studentsRes.data;
        if (Array.isArray(sData)) {
          setStudents(sData);
        } else if (sData?.content) {
          setStudents(sData.content);
        } else {
          setStudents([]);
        }
      }

      // ✅ Courses
      if (coursesRes.success) {
        const cData = coursesRes.data;
        setCourses(Array.isArray(cData) ? cData : cData?.content || []);
      }

      // ✅ Professeurs (revenu calculé côté backend via les tarifs)
      // ✅ Revenus profs (paiements réels + lignes virtuelles calculées automatiquement)
      if (payoutsRes.success) {
        setProfessorPayouts(Array.isArray(payoutsRes.data) ? payoutsRes.data : []);
      }
      if (payoutStatsRes.success) {
        setProfessorPayoutStats(payoutStatsRes.data || {});
      }

      // ✅ Personnel
      if (staffRes.success) {
        setStaffPayments(Array.isArray(staffRes.data) ? staffRes.data : []);
      }
      if (staffStatsRes.success) {
        setStaffStats(staffStatsRes.data || {});
      }

      // ✅ Équipement
      if (equipRes.success) {
        setEquipment(Array.isArray(equipRes.data) ? equipRes.data : []);
      }
      if (equipStatsRes.success) {
        setEquipmentStats(equipStatsRes.data || {});
      }

    } catch (err) {
      console.error('loadAll error:', err);
      setError('Impossible de charger les données financières.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = payments.filter(p => {
    const okS = filterStatus === 'all' || p.status === filterStatus;
    const okM = filterMonth === 'all' || p.paymentMonth === filterMonth;
    const q = search.toLowerCase();
    const okQ = !q || (p.studentName || '').toLowerCase().includes(q) || (p.courseTitle || '').toLowerCase().includes(q);
    return okS && okM && okQ;
  });

  const paid    = filtered.filter(p => p.status === 'Payé');
  const unpaid  = filtered.filter(p => p.status === 'Non payé');
  const partial = filtered.filter(p => p.status === 'Partiel');

  // Remplace handleSave par ceci :
  const handleSave = async (data) => {
    try {
      setLoading(true);
      // ✅ Vérifie que l'id existe ET n'est pas undefined/null
      const res = (current && current.id)
        ? await paymentAPI.updatePayment(current.id, data)
        : await paymentAPI.createPayment(data);
      if (res.success) { await loadAll(); setShowForm(false); setCurrent(null); }
      else alert(res.message || 'Erreur');
    } catch { alert('Erreur lors de la sauvegarde'); } finally { setLoading(false); }
  };

  const handleMarkPaid = async (payment, method) => {
    try {
      setLoading(true);
      const res = await paymentAPI.markAsPaid(payment.id, method);
      if (res.success) { await loadAll(); setShowPay(false); setCurrent(null); }
      else alert(res.message);
    } catch { alert('Erreur lors du paiement'); } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await paymentAPI.deletePayment(current.id);
      if (res.success) { await loadAll(); setShowDelete(false); setCurrent(null); }
    } catch { alert('Erreur lors de la suppression'); } finally { setLoading(false); }
  };

  // Remplace openEdit et openDelete
  const openEdit = p => {
    if (!p.id) {
      // Étudiant sans paiement → ouvre le formulaire de création avec l'étudiant pré-sélectionné
      setCurrent({ studentId: p.studentId, studentName: p.studentName, status: 'Non payé' });
      setShowForm(true);
      return;
    }
    setCurrent(p);
    setShowForm(true);
  };

  const openDelete = p => {
    if (!p.id) return; // pas de suppression pour les virtuels
    setCurrent(p);
    setShowDelete(true);
  };

  const openPay = p => {
    if (!p.id) {
      // Crée d'abord le paiement, puis marque payé
      setCurrent({ studentId: p.studentId, studentName: p.studentName, status: 'Non payé', amount: 0 });
      setShowForm(true);
      return;
    }
    setCurrent(p);
    setShowPay(true);
  };

  // ── Revenus profs ──
  const handlePayProfessor = async (item) => {
    try {
      setLoading(true);
      const res = item.id
        ? await professorPayoutAPI.markAsPaid(item.id)
        : await professorPayoutAPI.markAsPaidForProfessor(item.professorId, item.montant);
      if (res.success) await loadAll();
      else alert(res.message);
    } catch { alert('Erreur lors du paiement'); } finally { setLoading(false); }
  };

  // ── Personnel ──
  const handleSaveStaff = async (data) => {
    try {
      setLoading(true);
      const res = currentStaff
        ? await staffPaymentAPI.updateStaffPayment(currentStaff.id, data)
        : await staffPaymentAPI.createStaffPayment(data);
      if (res.success) { await loadAll(); setShowStaffForm(false); setCurrentStaff(null); }
      else alert(res.message || 'Erreur');
    } catch { alert('Erreur lors de la sauvegarde'); } finally { setLoading(false); }
  };

  const handleMarkStaffPaid = async (item) => {
    try {
      setLoading(true);
      const res = await staffPaymentAPI.markAsPaid(item.id);
      if (res.success) await loadAll();
      else alert(res.message);
    } catch { alert('Erreur lors du paiement'); } finally { setLoading(false); }
  };

  const handleDeleteStaff = async () => {
    try {
      setLoading(true);
      const res = await staffPaymentAPI.deleteStaffPayment(currentStaff.id);
      if (res.success) { await loadAll(); setShowStaffDelete(false); setCurrentStaff(null); }
    } catch { alert('Erreur lors de la suppression'); } finally { setLoading(false); }
  };

  const openStaffEdit = item => { setCurrentStaff(item); setShowStaffForm(true); };
  const openStaffDelete = item => { setCurrentStaff(item); setShowStaffDelete(true); };

  // ── Équipement ──
  const handleSaveEquipment = async (data) => {
    try {
      setLoading(true);
      const res = currentEquip
        ? await equipmentAPI.updateEquipment(currentEquip.id, data)
        : await equipmentAPI.createEquipment(data);
      if (res.success) { await loadAll(); setShowEquipForm(false); setCurrentEquip(null); }
      else alert(res.message || 'Erreur');
    } catch { alert('Erreur lors de la sauvegarde'); } finally { setLoading(false); }
  };

  const handleDeleteEquipment = async () => {
    try {
      setLoading(true);
      const res = await equipmentAPI.deleteEquipment(currentEquip.id);
      if (res.success) { await loadAll(); setShowEquipDelete(false); setCurrentEquip(null); }
    } catch { alert('Erreur lors de la suppression'); } finally { setLoading(false); }
  };

  const openEquipEdit = item => { setCurrentEquip(item); setShowEquipForm(true); };
  const openEquipDelete = item => { setCurrentEquip(item); setShowEquipDelete(true); };

  const sidebarW = sidebarCollapsed ? 72 : 240;
  const hasFilters = filterStatus !== 'all' || filterMonth !== 'all' || search;

  const statCards = [
    { label:'Total Encaissé',     val: fmtMAD(stats.totalPaid),                icon: CheckCircle2, tone:'success', sub:`${stats.countPaid || 0} paiement(s)` },
    { label:'Reste à Percevoir',  val: fmtMAD(stats.totalUnpaid),              icon: AlertCircle,  tone:'danger',  sub:`${stats.countUnpaid || 0} impayé(s)` },
    { label:'Partiels',           val: String(stats.countPartial || 0),        icon: Clock,        tone:'warning', sub:'étudiants' },
    { label:'Ce Mois',            val: fmtMAD(stats.currentMonthTotal),        icon: Calendar,      tone:'accent',  sub:'mois courant' },
    { label:'Total Paiements',    val: String(stats.total || payments.length), icon: Receipt,       tone:'info',    sub:'enregistrés' },
  ];

  const TONE_COLOR = {
    success: 'var(--sv-success)', danger: 'var(--sv-danger)', warning: 'var(--sv-warning)',
    accent: 'var(--sv-accent)', info: 'var(--sv-info)',
  };
  const TONE_SOFT = {
    success: 'var(--sv-success-soft)', danger: 'var(--sv-danger-soft)', warning: 'var(--sv-warning-soft)',
    accent: 'var(--sv-accent-soft)', info: 'var(--sv-info-soft)',
  };
  const TONE_BORDER = {
    success: 'var(--sv-success-border)', danger: 'var(--sv-danger-border)', warning: 'var(--sv-warning-border)',
    accent: 'var(--sv-accent-border)', info: 'var(--sv-info-border)',
  };

  const TABS = [
    { key:'all',      label:'Tous',      count: filtered.length, color:'var(--sv-text)' },
    { key:'Non payé', label:'Non payés', count: unpaid.length,   color:'var(--sv-danger)' },
    { key:'Payé',     label:'Payés',     count: paid.length,     color:'var(--sv-success)' },
    { key:'Partiel',  label:'Partiels',  count: partial.length,  color:'var(--sv-warning)' },
  ];

  // ── Bilan global ──
  const totalRevenus = stats.totalPaid || 0;
  const totalProfsPayes = professorPayoutStats.totalPaid || 0;
  const totalDepensesReelles = totalProfsPayes + (staffStats.totalPaid || 0) + (equipmentStats.totalMontant || 0);
  const totalProfsEstime = professorPayoutStats.totalEstimeMoisCourant || 0;
  const soldeNet = totalRevenus - totalDepensesReelles;

  const MAIN_TABS = [
    { key: 'payments',   label: 'Paiements étudiants', icon: Receipt },
    { key: 'professors', label: 'Revenus profs',       icon: GraduationCap },
    { key: 'staff',      label: 'Personnel',           icon: Briefcase },
    { key: 'equipment',  label: 'Équipement',          icon: Package },
  ];

  const equipFiltered = equipment.filter(e => !search || e.libelle.toLowerCase().includes(search.toLowerCase()) || (e.fournisseur || '').toLowerCase().includes(search.toLowerCase()));
  const staffFiltered = staffPayments.filter(s => !search || s.nomEmploye.toLowerCase().includes(search.toLowerCase()) || s.poste.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="sv-root min-h-screen" style={{ background: 'var(--sv-bg)' }}>
      <Sidebar activeItem="finance" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <main className="relative z-10 transition-all duration-300" style={{ marginLeft: `${sidebarW}px` }}>
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-8 h-16"
          style={{ background: 'rgba(10,15,28,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--sv-border)' }}
        >
          <div className="flex items-center gap-2 text-[12.5px]">
            <span style={{ color: 'var(--sv-text-faint)' }}>Admin</span>
            <span style={{ color: 'var(--sv-text-faint)' }}>/</span>
            <span className="sv-heading font-semibold" style={{ color: 'var(--sv-text)' }}>Finances</span>
          </div>
          <div className="flex items-center gap-2.5">
            {activeMainTab === 'payments' && (
              <>
                <div className="flex p-0.5 rounded-lg gap-0.5" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
                  {[['table', List, 'Tableau'], ['grid', LayoutGrid, 'Cartes']].map(([mode, Icon, label]) => (
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
                  <Plus size={15} strokeWidth={2} /> Nouveau paiement
                </button>
              </>
            )}
            {activeMainTab === 'staff' && (
              <button onClick={() => { setCurrentStaff(null); setShowStaffForm(true); }} className="sv-btn sv-btn-primary px-4 py-2">
                <Plus size={15} strokeWidth={2} /> Ajouter un paiement
              </button>
            )}
            {activeMainTab === 'equipment' && (
              <button onClick={() => { setCurrentEquip(null); setShowEquipForm(true); }} className="sv-btn sv-btn-primary px-4 py-2">
                <Plus size={15} strokeWidth={2} /> Ajouter un achat
              </button>
            )}
          </div>
        </header>

        <div className="px-8 py-6 space-y-5">
          <div>
            <h1 className="sv-heading text-[22px] font-bold" style={{ color: 'var(--sv-text)' }}>Gestion financière</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>Vue d'ensemble des revenus et dépenses du centre</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg sv-in" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
              <AlertTriangle size={15} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
              <span className="text-[13px]" style={{ color: '#F0A8A2' }}>{error}</span>
            </div>
          )}

          {/* ── BILAN GLOBAL ── */}
          <div className="sv-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Scale size={15} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)' }} />
              <p className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>BILAN DU CENTRE</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={12} strokeWidth={2} style={{ color: 'var(--sv-success)' }} />
                  <span className="text-[10.5px] font-medium" style={{ color: 'var(--sv-text-faint)' }}>REVENUS ENCAISSÉS</span>
                </div>
                <p className="sv-heading text-[19px] font-bold" style={{ color: 'var(--sv-success)' }}>{fmtMAD(totalRevenus)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingDown size={12} strokeWidth={2} style={{ color: 'var(--sv-danger)' }} />
                  <span className="text-[10.5px] font-medium" style={{ color: 'var(--sv-text-faint)' }}>DÉPENSES RÉELLES</span>
                </div>
                <p className="sv-heading text-[19px] font-bold" style={{ color: 'var(--sv-danger)' }}>{fmtMAD(totalDepensesReelles)}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>Personnel payé + équipement</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <GraduationCap size={12} strokeWidth={2} style={{ color: 'var(--sv-info)' }} />
                  <span className="text-[10.5px] font-medium" style={{ color: 'var(--sv-text-faint)' }}>PROFS (RESTE À PAYER)</span>
                </div>
                <p className="sv-heading text-[19px] font-bold" style={{ color: 'var(--sv-info)' }}>{fmtMAD(Math.max(0, totalProfsEstime - totalProfsPayes))}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>Estimé ce mois, non encore versé</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Scale size={12} strokeWidth={2} style={{ color: soldeNet >= 0 ? 'var(--sv-accent)' : 'var(--sv-danger)' }} />
                  <span className="text-[10.5px] font-medium" style={{ color: 'var(--sv-text-faint)' }}>SOLDE NET</span>
                </div>
                <p className="sv-heading text-[19px] font-bold" style={{ color: soldeNet >= 0 ? 'var(--sv-accent)' : 'var(--sv-danger)' }}>{fmtMAD(soldeNet)}</p>
              </div>
            </div>
          </div>

          {/* ── NAV ONGLETS ── */}
          <div className="flex gap-1 p-1 rounded-xl sv-card" style={{ width: 'fit-content' }}>
            {MAIN_TABS.map(tab => (
              <button key={tab.key} onClick={() => { setActiveMainTab(tab.key); setSearch(''); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12.5px] font-semibold transition-all"
                style={activeMainTab === tab.key ? { background: 'var(--sv-accent)', color: 'var(--sv-accent-ink)' } : { color: 'var(--sv-text-faint)' }}>
                <tab.icon size={14} strokeWidth={1.75} /> {tab.label}
              </button>
            ))}
          </div>

          {/* ══════════════════ ONGLET PAIEMENTS ÉTUDIANTS ══════════════════ */}
          {activeMainTab === 'payments' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {statCards.map(({ label, val, icon: Icon, tone, sub }) => (
                  <div key={label} className="sv-card sv-in p-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: TONE_SOFT[tone], border: `1px solid ${TONE_BORDER[tone]}` }}>
                      <Icon size={14} strokeWidth={1.75} style={{ color: TONE_COLOR[tone] }} />
                    </div>
                    <p className="sv-heading text-[15px] font-bold leading-tight" style={{ color: 'var(--sv-text)' }}>{val}</p>
                    <p className="text-[10.5px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>{label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--sv-text-faint)', opacity: 0.7 }}>{sub}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 p-3.5 rounded-xl sv-card">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sv-text-faint)' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom étudiant, cours…" className="sv-input w-full pl-9 pr-3 py-2.5 text-[13px]" />
                </div>
                <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="sv-input px-3.5 py-2.5 text-[13px] min-w-[170px]" style={{ cursor:'pointer' }}>
                  {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                {hasFilters && (
                  <button onClick={() => { setFilterStatus('all'); setFilterMonth('all'); setSearch(''); }} className="sv-btn sv-btn-ghost px-3 py-2.5">
                    <RotateCcw size={13} strokeWidth={1.75} /> Réinitialiser
                  </button>
                )}
              </div>

              {viewMode === 'grid' && (
                loading && payments.length === 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="sv-card p-4 space-y-3.5">
                        {[['70%', 'h-3.5'], ['50%', 'h-3'], ['100%', 'h-9'], ['80%', 'h-2.5']].map(([w, h], j) => (
                          <div key={j} className={`${h} rounded-full sv-shimmer`} style={{ background: 'var(--sv-surface-2)', width: w }} />
                        ))}
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 rounded-xl sv-card">
                    <Receipt size={32} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', marginBottom: 12 }} />
                    <p className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text-dim)' }}>Aucun paiement trouvé</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((p, i) => (
                      <PaymentCard key={p.id ?? `virtual-${p.studentId}`} payment={p} index={i} onEdit={openEdit} onDelete={openDelete} onPay={openPay} />
                    ))}
                  </div>
                )
              )}

              {viewMode === 'table' && (
                <div className="sv-card overflow-hidden">
                  <div className="flex px-2" style={{ borderBottom: '1px solid var(--sv-border)' }}>
                    {TABS.map(tab => (
                      <button key={tab.key} onClick={() => setFilterStatus(tab.key)}
                        className={`sv-tab flex items-center gap-2 px-5 py-3.5 text-[12.5px] font-semibold transition-all ${filterStatus === tab.key ? 'active' : ''}`}
                        style={{ color: filterStatus === tab.key ? tab.color : 'var(--sv-text-faint)' }}>
                        {tab.label}
                        <span className="text-[10.5px] px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: filterStatus === tab.key ? tab.color : 'var(--sv-text-faint)' }}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="grid px-6 py-2.5" style={{ gridTemplateColumns: '2.5fr 1.8fr 1fr 1fr 1fr 1.2fr 1fr auto', borderBottom: '1px solid var(--sv-border)' }}>
                    {['ÉTUDIANT','COURS','MONTANT','MOIS','STATUT','DATE','MÉTHODE',''].map(h => (
                      <div key={h} className="text-[10.5px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>{h}</div>
                    ))}
                  </div>

                  {loading && payments.length === 0 ? (
                    <div className="space-y-2 p-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 rounded-lg sv-shimmer" style={{ background: 'var(--sv-surface-2)' }} />
                      ))}
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Receipt size={32} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', marginBottom: 12 }} />
                      <p className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text-dim)' }}>Aucun paiement trouvé</p>
                    </div>
                  ) : (
                    filtered.map((p) => (
                      <PaymentRow key={p.id ?? `virtual-${p.studentId}`} payment={p} onEdit={openEdit} onDelete={openDelete} onPay={openPay} />
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {/* ══════════════════ ONGLET REVENUS PROFS ══════════════════ */}
          {activeMainTab === 'professors' && (
            <ProfessorPayoutsTab payouts={professorPayouts} loading={loading} onPay={handlePayProfessor} />
          )}

          {/* ══════════════════ ONGLET PERSONNEL ══════════════════ */}
          {activeMainTab === 'staff' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sv-card p-4">
                  <p className="text-[10.5px] font-semibold tracking-wide mb-1" style={{ color: 'var(--sv-text-faint)' }}>TOTAL PAYÉ</p>
                  <p className="sv-heading text-[17px] font-bold" style={{ color: 'var(--sv-success)' }}>{fmtMAD(staffStats.totalPaid)}</p>
                </div>
                <div className="sv-card p-4">
                  <p className="text-[10.5px] font-semibold tracking-wide mb-1" style={{ color: 'var(--sv-text-faint)' }}>RESTE À PAYER</p>
                  <p className="sv-heading text-[17px] font-bold" style={{ color: 'var(--sv-danger)' }}>{fmtMAD(staffStats.totalUnpaid)}</p>
                </div>
                <div className="sv-card p-4">
                  <p className="text-[10.5px] font-semibold tracking-wide mb-1" style={{ color: 'var(--sv-text-faint)' }}>CE MOIS-CI</p>
                  <p className="sv-heading text-[17px] font-bold" style={{ color: 'var(--sv-accent)' }}>{fmtMAD(staffStats.currentMonthTotal)}</p>
                </div>
              </div>

              <div className="relative">
                <Search size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sv-text-faint)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, poste…" className="sv-input w-full max-w-xs pl-9 pr-3 py-2.5 text-[13px]" />
              </div>

              <div className="sv-card overflow-hidden">
                {loading && staffPayments.length === 0 ? (
                  <div className="space-y-2 p-4">{[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-lg sv-shimmer" style={{ background: 'var(--sv-surface-2)' }} />)}</div>
                ) : staffFiltered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Briefcase size={32} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', marginBottom: 12 }} />
                    <p className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text-dim)' }}>Aucun paiement personnel</p>
                  </div>
                ) : (
                  staffFiltered.map(item => (
                    <StaffRow key={item.id} item={item} onEdit={openStaffEdit} onDelete={openStaffDelete} onPay={handleMarkStaffPaid} />
                  ))
                )}
              </div>
            </div>
          )}

          {/* ══════════════════ ONGLET ÉQUIPEMENT ══════════════════ */}
          {activeMainTab === 'equipment' && (
            <div className="space-y-4">
              <div className="sv-card p-4" style={{ maxWidth: 280 }}>
                <p className="text-[10.5px] font-semibold tracking-wide mb-1" style={{ color: 'var(--sv-text-faint)' }}>TOTAL DÉPENSÉ</p>
                <p className="sv-heading text-[17px] font-bold" style={{ color: 'var(--sv-warning)' }}>{fmtMAD(equipmentStats.totalMontant)}</p>
              </div>

              <div className="relative">
                <Search size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sv-text-faint)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Libellé, fournisseur…" className="sv-input w-full max-w-xs pl-9 pr-3 py-2.5 text-[13px]" />
              </div>

              <div className="sv-card overflow-hidden">
                {loading && equipment.length === 0 ? (
                  <div className="space-y-2 p-4">{[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-lg sv-shimmer" style={{ background: 'var(--sv-surface-2)' }} />)}</div>
                ) : equipFiltered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Package size={32} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', marginBottom: 12 }} />
                    <p className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text-dim)' }}>Aucun équipement enregistré</p>
                  </div>
                ) : (
                  equipFiltered.map(item => (
                    <EquipmentRow key={item.id} item={item} onEdit={openEquipEdit} onDelete={openEquipDelete} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <FormModal
          payment={current} students={students} courses={courses}
          loading={loading} onSave={handleSave}
          onClose={() => { setShowForm(false); setCurrent(null); }} />
      )}
      {showPay && current && (
        <MarkPaidModal
          payment={current} loading={loading}
          onConfirm={handleMarkPaid}
          onClose={() => { setShowPay(false); setCurrent(null); }} />
      )}
      {showDelete && current && (
        <DeleteModal
          payment={current} loading={loading}
          onConfirm={handleDelete}
          onClose={() => { setShowDelete(false); setCurrent(null); }} />
      )}

      {showStaffForm && (
        <StaffFormModal item={currentStaff} loading={loading} onSave={handleSaveStaff} onClose={() => { setShowStaffForm(false); setCurrentStaff(null); }} />
      )}
      {showStaffDelete && currentStaff && (
        <GenericDeleteModal
          title="Supprimer ce paiement ?" subtitle={currentStaff.nomEmploye}
          loading={loading} onConfirm={handleDeleteStaff}
          onClose={() => { setShowStaffDelete(false); setCurrentStaff(null); }} />
      )}

      {showEquipForm && (
        <EquipmentFormModal item={currentEquip} loading={loading} onSave={handleSaveEquipment} onClose={() => { setShowEquipForm(false); setCurrentEquip(null); }} />
      )}
      {showEquipDelete && currentEquip && (
        <GenericDeleteModal
          title="Supprimer cet équipement ?" subtitle={currentEquip.libelle}
          loading={loading} onConfirm={handleDeleteEquipment}
          onClose={() => { setShowEquipDelete(false); setCurrentEquip(null); }} />
      )}
    </div>
  );
};

export default FinanceList;
