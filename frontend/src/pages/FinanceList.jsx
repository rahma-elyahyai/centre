// src/components/FinanceList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '../services/paymentService';
import { studentAPI } from '../services/studentService';
import { courseAPI } from '../services/courseService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';

/* ─── Warriors CSS injection ─── */
if (!document.getElementById('warriors-finance-style')) {
  const s = document.createElement('style');
  s.id = 'warriors-finance-style';
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
    .row-hover { transition: background 0.15s; }
    .row-hover:hover { background: rgba(196,150,48,0.03); }
    .tab-active { border-bottom: 2px solid #f0c84a; }
    .tab-inactive { border-bottom: 2px solid transparent; }
  `;
  document.head.appendChild(s);
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

const METHOD_ICONS = { 'Espèces':'💵', 'Virement':'🏦', 'Chèque':'📄', 'Mobile Pay':'📱' };

const STATUS_CFG = {
  'Payé':     { bg:'rgba(34,197,94,0.1)',   border:'rgba(34,197,94,0.2)',   color:'#4ade80', dot:'#22c55e', icon:'◉', label:'Payé' },
  'Non payé': { bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.2)',   color:'#f87171', dot:'#ef4444', icon:'◌', label:'Non payé' },
  'Partiel':  { bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.2)',  color:'#fbbf24', dot:'#f59e0b', icon:'◐', label:'Partiel' },
};

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.map(p => p[0] || '').join('').toUpperCase().slice(0, 2);
};

const getAvatarGrad = (id) => {
  const grads = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#c49630,#f0c84a)',
    'linear-gradient(135deg,#3b82f6,#06b6d4)',
    'linear-gradient(135deg,#ec4899,#f43f5e)',
    'linear-gradient(135deg,#10b981,#14b8a6)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
  ];
  return grads[(id || 0) % grads.length];
};

const fmtMAD = (v) => v != null ? `${Number(v).toLocaleString('fr-FR')} MAD` : '—';

/* ══════════════════════════════════════════════════════════════ */
/*  PAYMENT ROW                                                  */
/* ══════════════════════════════════════════════════════════════ */
const PaymentRow = ({ payment, onEdit, onDelete, onPay }) => {
  const sc = STATUS_CFG[payment.status] || STATUS_CFG['Non payé'];
  const effectiveAmount = payment.customPrice ?? payment.amount;

  return (
    <div className="row-hover grid items-center px-6 py-4 group"
      style={{
        gridTemplateColumns: '2.5fr 1.8fr 1fr 1fr 1fr 1.2fr 1fr auto',
        borderBottom: '1px solid rgba(196,150,48,0.04)',
      }}>

      {/* Étudiant */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center warriors-title font-black text-xs flex-shrink-0"
          style={{ background: getAvatarGrad(payment.studentId), color: '#fff' }}>
          {getInitials(payment.studentName)}
        </div>
        <div className="min-w-0">
          <p className="warriors-font text-sm font-semibold truncate" style={{ color: '#e8eaf0' }}>{payment.studentName || '—'}</p>
          <p className="warriors-font text-[10px]" style={{ color: 'rgba(196,150,48,0.4)' }}>ID #{payment.studentId}</p>
        </div>
      </div>

      {/* Cours */}
      <div className="min-w-0 pr-3">
        <p className="warriors-font text-[12px] truncate" style={{ color: 'rgba(180,190,210,0.5)' }}>
          {payment.courseTitle || <span style={{ color: 'rgba(148,163,184,0.25)' }}>—</span>}
        </p>
      </div>

      {/* Montant */}
      <div>
        <p className="warriors-font text-sm font-bold" style={{ color: '#f0c84a' }}>
          {Number(effectiveAmount || 0).toLocaleString('fr-FR')}
          <span className="text-[10px] font-normal ml-1" style={{ color: 'rgba(148,163,184,0.4)' }}>MAD</span>
        </p>
        {payment.customPrice && payment.customPrice !== payment.amount && (
          <p className="warriors-font text-[10px]" style={{ color: 'rgba(99,102,241,0.6)' }}>
            ✦ perso
          </p>
        )}
      </div>

      {/* Mois */}
      <div>
        <span className="warriors-font text-[11px] px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(148,163,184,0.4)' }}>
          {payment.paymentMonth || '—'}
        </span>
      </div>

      {/* Statut */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot flex-shrink-0" style={{ background: sc.dot }} />
          <span className="warriors-font text-[10px] font-semibold" style={{ color: sc.color }}>{sc.label}</span>
        </div>
      </div>

      {/* Date */}
      <div>
        {payment.paymentDate ? (
          <p className="warriors-font text-[11px]" style={{ color: 'rgba(180,190,210,0.45)' }}>
            {new Date(payment.paymentDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </p>
        ) : payment.dueDate ? (
          <p className="warriors-font text-[11px]" style={{ color: 'rgba(239,68,68,0.55)' }}>
            Éch. {new Date(payment.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </p>
        ) : (
          <span style={{ color: 'rgba(148,163,184,0.2)' }}>—</span>
        )}
      </div>

      {/* Méthode */}
      <div>
        {payment.paymentMethod ? (
          <span className="warriors-font text-[11px]" style={{ color: 'rgba(180,190,210,0.45)' }}>
            {METHOD_ICONS[payment.paymentMethod] || '◆'} {payment.paymentMethod}
          </span>
        ) : (
          <span style={{ color: 'rgba(148,163,184,0.2)', fontSize: '11px' }}>—</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
        {payment.status !== 'Payé' && (
          <button onClick={() => onPay(payment)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}
            title="Marquer payé">✓</button>
        )}
        <button onClick={() => onEdit(payment)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all"
          style={{ background: 'rgba(196,150,48,0.08)', border: '1px solid rgba(196,150,48,0.15)', color: '#f0c84a' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,150,48,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(196,150,48,0.08)'}>✏</button>
        <button onClick={() => onDelete(payment)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>✕</button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  PAYMENT CARD (card view)                                     */
/* ══════════════════════════════════════════════════════════════ */
const PaymentCard = ({ payment, onEdit, onDelete, onPay, index }) => {
  const sc = STATUS_CFG[payment.status] || STATUS_CFG['Non payé'];
  const effectiveAmount = payment.customPrice ?? payment.amount;

  return (
    <div className="card-hover animate-in rounded-2xl flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(145deg,rgba(13,24,44,0.95) 0%,rgba(8,15,30,0.9) 100%)',
        border: '1px solid rgba(196,150,48,0.1)',
        animationDelay: `${index * 50}ms`,
      }}>
      {/* Status stripe */}
      <div className="h-0.5" style={{ background: `linear-gradient(90deg,${sc.dot},transparent)` }} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Top */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center warriors-title font-black text-sm flex-shrink-0"
              style={{ background: getAvatarGrad(payment.studentId), color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.35)' }}>
              {getInitials(payment.studentName)}
            </div>
            <div>
              <p className="warriors-font text-sm font-bold" style={{ color: '#e8eaf0' }}>{payment.studentName || '—'}</p>
              <p className="warriors-font text-[10px]" style={{ color: 'rgba(196,150,48,0.45)' }}>ID #{payment.studentId}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: sc.dot }} />
            <span className="warriors-font text-[10px] font-semibold" style={{ color: sc.color }}>{sc.label}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: 'rgba(196,150,48,0.04)', border: '1px solid rgba(196,150,48,0.1)' }}>
          <div>
            <p className="warriors-font text-[9px] tracking-widest mb-0.5" style={{ color: 'rgba(196,150,48,0.4)' }}>MONTANT</p>
            <p className="warriors-title text-xl font-black" style={{ color: '#f0c84a' }}>
              {Number(effectiveAmount || 0).toLocaleString('fr-FR')}
              <span className="text-xs font-normal ml-1" style={{ color: 'rgba(148,163,184,0.5)' }}>MAD</span>
            </p>
          </div>
          {payment.customPrice && payment.customPrice !== payment.amount && (
            <div className="text-right">
              <p className="warriors-font text-[9px] tracking-widest mb-0.5" style={{ color: 'rgba(99,102,241,0.5)' }}>STANDARD</p>
              <p className="warriors-font text-xs" style={{ color: 'rgba(99,102,241,0.5)' }}>
                {Number(payment.amount || 0).toLocaleString('fr-FR')} MAD
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(196,150,48,0.1),transparent)' }} />

        {/* Info rows */}
        <div className="space-y-1.5">
          {[
            { icon: '📚', val: payment.courseTitle || '—' },
            { icon: '◷', val: payment.paymentMonth || 'Mois non défini' },
            { icon: '◆', val: payment.paymentMethod ? `${METHOD_ICONS[payment.paymentMethod] || ''} ${payment.paymentMethod}` : '—' },
            payment.paymentDate && { icon: '✓', val: `Payé le ${new Date(payment.paymentDate).toLocaleDateString('fr-FR')}` },
            payment.dueDate && !payment.paymentDate && { icon: '⏰', val: `Échéance ${new Date(payment.dueDate).toLocaleDateString('fr-FR')}`, red: true },
          ].filter(Boolean).map(({ icon, val, red }) => (
            <div key={icon} className="flex items-center gap-2">
              <span className="text-[11px] flex-shrink-0 w-4 text-center" style={{ color: 'rgba(196,150,48,0.4)' }}>{icon}</span>
              <span className="warriors-font text-[12px] truncate" style={{ color: red ? 'rgba(239,68,68,0.6)' : 'rgba(180,190,210,0.5)' }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t" style={{ borderColor: 'rgba(196,150,48,0.08)' }}>
          {payment.status !== 'Payé' && (
            <button onClick={() => onPay(payment)}
              className="flex-1 py-2 rounded-xl text-[12px] font-bold warriors-font transition-all"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.08)'}>
              ✓ Payer
            </button>
          )}
          <button onClick={() => onEdit(payment)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all flex-shrink-0"
            style={{ background: 'rgba(196,150,48,0.08)', border: '1px solid rgba(196,150,48,0.18)', color: '#f0c84a' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,150,48,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(196,150,48,0.08)'}>✏</button>
          <button onClick={() => onDelete(payment)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all flex-shrink-0"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#f87171' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>✕</button>
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

  const inp = (field) => `input-warriors w-full px-4 py-3 rounded-xl text-sm warriors-font ${errors[field] ? 'border-red-500/60' : ''}`;
  const LabelRow = ({ name, label, req }) => (
    <div className="flex items-center justify-between mb-2">
      <label className="text-[10px] font-semibold tracking-[0.12em] warriors-font" style={{ color: 'rgba(196,150,48,0.45)' }}>
        {label}{req && ' *'}
      </label>
      {errors[name] && <span className="text-[10px] warriors-font" style={{ color: '#f87171' }}>{errors[name]}</span>}
    </div>
  );

  const selectedStudent = students.find(s => String(s.id) === String(form.studentId));
  const effectivePreview = form.customPrice ? parseFloat(form.customPrice) : parseFloat(form.amount) || 0;

  const sectionContent = [
    /* 0 — Étudiant & Cours */
    <div key="student" className="space-y-5">
      {/* Preview */}
      {selectedStudent && (
        <div className="flex items-center gap-4 p-4 rounded-2xl animate-in"
          style={{ background: 'rgba(196,150,48,0.04)', border: '1px solid rgba(196,150,48,0.12)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center warriors-title font-black text-sm"
            style={{ background: getAvatarGrad(selectedStudent.id), color: '#fff' }}>
            {getInitials(`${selectedStudent.prenom} ${selectedStudent.nom}`)}
          </div>
          <div>
            <p className="warriors-title font-bold" style={{ color: '#e8eaf0' }}>{selectedStudent.prenom} {selectedStudent.nom}</p>
            <p className="warriors-font text-xs mt-0.5" style={{ color: 'rgba(196,150,48,0.5)' }}>
              {selectedStudent.niveau} · {selectedStudent.filiere}
            </p>
          </div>
        </div>
      )}
      <div>
        <LabelRow name="studentId" label="ÉTUDIANT" req />
        <select name="studentId" value={form.studentId} onChange={h} className={inp('studentId')} style={{ cursor: 'pointer' }}>
          <option value="">Sélectionner un étudiant…</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.prenom} {s.nom}</option>
          ))}
        </select>
      </div>
      <div>
        <LabelRow name="courseId" label="COURS ASSOCIÉ" />
        <select name="courseId" value={form.courseId} onChange={h} className={inp('courseId')} style={{ cursor: 'pointer' }}>
          <option value="">Aucun cours</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>
      <div>
        <LabelRow name="status" label="STATUT" />
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(STATUS_CFG).map(([key, sc]) => (
            <button key={key} type="button" onClick={() => setForm(p => ({ ...p, status: key }))}
              className="py-2.5 rounded-xl text-xs font-semibold warriors-font transition-all"
              style={{
                background: form.status === key ? sc.bg : 'rgba(255,255,255,0.02)',
                border: `1px solid ${form.status === key ? sc.border : 'rgba(255,255,255,0.06)'}`,
                color: form.status === key ? sc.color : 'rgba(148,163,184,0.4)',
              }}>
              {sc.icon} {sc.label}
            </button>
          ))}
        </div>
      </div>
    </div>,

    /* 1 — Montant */
    <div key="amount" className="space-y-5">
      <div>
        <LabelRow name="amount" label="MONTANT STANDARD (MAD)" req />
        <input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={h}
          placeholder="Ex : 500" className={inp('amount')} />
      </div>
      <div>
        <LabelRow name="customPrice" label="PRIX PERSONNALISÉ (MAD)" />
        <input name="customPrice" type="number" min="0" step="0.01" value={form.customPrice} onChange={h}
          placeholder="Laisser vide = prix standard" className={inp('customPrice')} />
        <p className="warriors-font text-[11px] mt-1.5" style={{ color: 'rgba(148,163,184,0.35)' }}>
          Le prix personnalisé remplace le montant standard pour cet étudiant.
        </p>
      </div>
      {/* Preview */}
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(196,150,48,0.04)', border: '1px solid rgba(196,150,48,0.1)' }}>
        <p className="warriors-font text-[9px] tracking-widest mb-2" style={{ color: 'rgba(196,150,48,0.4)' }}>APERÇU DU PAIEMENT</p>
        <div className="flex items-center justify-between">
          <span className="warriors-font text-sm" style={{ color: 'rgba(180,190,210,0.5)' }}>Montant effectif</span>
          <span className="warriors-title text-2xl font-black" style={{ color: '#f0c84a' }}>
            {effectivePreview.toLocaleString('fr-FR')} MAD
          </span>
        </div>
        {form.customPrice && (
          <p className="warriors-font text-[10px] mt-1" style={{ color: 'rgba(99,102,241,0.5)' }}>
            ✦ Prix personnalisé appliqué (standard : {parseFloat(form.amount || 0).toLocaleString('fr-FR')} MAD)
          </p>
        )}
      </div>
      <div>
        <LabelRow name="paymentMethod" label="MÉTHODE DE PAIEMENT" />
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map(m => (
            <button key={m} type="button" onClick={() => setForm(p => ({ ...p, paymentMethod: m }))}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm warriors-font transition-all"
              style={{
                background: form.paymentMethod === m ? 'rgba(196,150,48,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${form.paymentMethod === m ? 'rgba(196,150,48,0.3)' : 'rgba(255,255,255,0.06)'}`,
                color: form.paymentMethod === m ? '#f0c84a' : 'rgba(148,163,184,0.4)',
              }}>
              {METHOD_ICONS[m]} {m}
            </button>
          ))}
        </div>
      </div>
    </div>,

    /* 2 — Calendrier */
    <div key="calendar" className="space-y-5">
      <div>
        <LabelRow name="paymentMonth" label="MOIS CONCERNÉ" />
        <select name="paymentMonth" value={form.paymentMonth} onChange={h} className={inp('paymentMonth')} style={{ cursor: 'pointer' }}>
          <option value="">— Non défini —</option>
          {MONTHS.filter(m => m.value !== 'all').map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
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
    <div key="notes" className="space-y-5">
      <div>
        <LabelRow name="notes" label="NOTES / REMARQUES" />
        <textarea name="notes" value={form.notes} onChange={h} rows={6}
          placeholder="Informations complémentaires, accords spéciaux…"
          className="input-warriors w-full px-4 py-3 rounded-xl text-sm warriors-font resize-none" />
      </div>
      {/* Summary */}
      <div className="p-4 rounded-2xl space-y-2.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
        <p className="warriors-font text-[9px] tracking-widest mb-3" style={{ color: 'rgba(196,150,48,0.4)' }}>RÉCAPITULATIF</p>
        {[
          { label: 'Étudiant', val: selectedStudent ? `${selectedStudent.prenom} ${selectedStudent.nom}` : '—' },
          { label: 'Montant', val: `${effectivePreview.toLocaleString('fr-FR')} MAD` },
          { label: 'Statut', val: form.status },
          { label: 'Méthode', val: form.paymentMethod || '—' },
          { label: 'Mois', val: MONTHS.find(m => m.value === form.paymentMonth)?.label || '—' },
        ].map(({ label, val }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="warriors-font text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>{label}</span>
            <span className="warriors-font text-xs font-semibold" style={{ color: '#e8eaf0' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(4,9,20,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl animate-in"
        style={{ background: 'linear-gradient(145deg,#0d1c30 0%,#080f1e 100%)', border: '1px solid rgba(196,150,48,0.2)', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(196,150,48,0.1)', background: 'rgba(196,150,48,0.03)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'rgba(196,150,48,0.1)', border: '1px solid rgba(196,150,48,0.2)' }}>💰</div>
            <div>
              <h2 className="warriors-title text-lg font-bold" style={{ color: '#f0c84a' }}>
                {isEdit ? 'Modifier le paiement' : 'Nouveau paiement'}
              </h2>
              <p className="warriors-font text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>
                Étape {activeSection + 1} sur {sections.length} — {sections[activeSection]}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ border: '1px solid rgba(196,150,48,0.15)', color: 'rgba(148,163,184,0.5)', background: 'rgba(255,255,255,0.02)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,150,48,0.1)'; e.currentTarget.style.color = '#f0c84a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = 'rgba(148,163,184,0.5)'; }}>
            ✕
          </button>
        </div>

        {/* Stepper */}
        <div className="flex px-7 pt-5 gap-2 flex-shrink-0">
          {sections.map((s, i) => (
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
            style={{ borderTop: '1px solid rgba(196,150,48,0.1)', background: 'rgba(196,150,48,0.02)' }}>
            <button type="button"
              onClick={activeSection === 0 ? onClose : () => setActiveSection(p => p - 1)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold warriors-font transition-all"
              style={{ border: '1px solid rgba(196,150,48,0.15)', color: 'rgba(180,190,210,0.55)', background: 'rgba(255,255,255,0.02)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,150,48,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
              {activeSection === 0 ? 'Annuler' : '← Retour'}
            </button>
            {activeSection < sections.length - 1 ? (
              <button type="button" onClick={() => setActiveSection(p => p + 1)}
                className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title btn-gold"
                style={{ color: '#0a1628' }}>Suivant →</button>
            ) : (
              <button type="submit" disabled={loading}
                className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title btn-gold disabled:opacity-50"
                style={{ color: '#0a1628' }}>
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(4,9,20,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden animate-in"
        style={{ background: 'linear-gradient(145deg,#0d1c30,#080f1e)', border: '1px solid rgba(34,197,94,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div className="px-7 py-5" style={{ background: 'rgba(34,197,94,0.06)', borderBottom: '1px solid rgba(34,197,94,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.2)' }}>✓</div>
            <div>
              <h3 className="warriors-title font-bold text-base" style={{ color: '#4ade80' }}>Confirmer le paiement</h3>
              <p className="warriors-font text-[11px] mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>Marquer comme payé</p>
            </div>
          </div>
        </div>
        <div className="p-7 space-y-5">
          {/* Student info */}
          <div className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center warriors-title font-black text-sm flex-shrink-0"
              style={{ background: getAvatarGrad(payment.studentId || 0), color: '#fff' }}>
              {getInitials(payment.studentName)}
            </div>
            <div className="flex-1">
              <p className="warriors-title font-bold text-sm" style={{ color: '#e8eaf0' }}>{payment.studentName}</p>
              <p className="warriors-font text-xs mt-0.5" style={{ color: 'rgba(196,150,48,0.5)' }}>{payment.courseTitle || 'Sans cours'}</p>
            </div>
            <div className="text-right">
              <p className="warriors-title text-xl font-black" style={{ color: '#4ade80' }}>
                {Number(effectiveAmount || 0).toLocaleString('fr-FR')}
              </p>
              <p className="warriors-font text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>MAD</p>
            </div>
          </div>

          {/* Method selector */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] warriors-font mb-3" style={{ color: 'rgba(196,150,48,0.45)' }}>MÉTHODE DE PAIEMENT</p>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map(m => (
                <button key={m} type="button" onClick={() => setMethod(m)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm warriors-font transition-all"
                  style={{
                    background: method === m ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${method === m ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    color: method === m ? '#4ade80' : 'rgba(148,163,184,0.5)',
                  }}>
                  {METHOD_ICONS[m]} {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold warriors-font transition-all"
              style={{ border: '1px solid rgba(196,150,48,0.15)', color: 'rgba(180,190,210,0.55)', background: 'rgba(255,255,255,0.02)' }}>
              Annuler
            </button>
            <button onClick={() => onConfirm(payment, method)} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title transition-all"
              style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: '#fff' }}>
              {loading ? 'Traitement…' : '✓ Confirmer'}
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(4,9,20,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden animate-in"
        style={{ background: 'linear-gradient(145deg,#0d1c30,#080f1e)', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div className="px-7 py-5" style={{ background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(239,68,68,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)' }}>⚠</div>
            <div>
              <h3 className="warriors-title font-bold text-base" style={{ color: '#f87171' }}>Supprimer ce paiement ?</h3>
              <p className="warriors-font text-[11px] mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>Action irréversible</p>
            </div>
          </div>
        </div>
        <div className="p-7 space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center warriors-title font-black text-sm"
              style={{ background: getAvatarGrad(payment.studentId || 0), color: '#fff' }}>
              {getInitials(payment.studentName)}
            </div>
            <div>
              <p className="warriors-title font-bold text-sm" style={{ color: '#e8eaf0' }}>{payment.studentName}</p>
              <p className="warriors-font text-xs mt-0.5" style={{ color: 'rgba(196,150,48,0.5)' }}>
                {payment.courseTitle} · {Number((payment.customPrice ?? payment.amount) || 0).toLocaleString('fr-FR')} MAD
              </p>
            </div>
          </div>
          <p className="warriors-font text-xs" style={{ color: 'rgba(248,113,113,0.6)' }}>
            Ce paiement et toutes ses données seront définitivement supprimés.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold warriors-font transition-all"
              style={{ border: '1px solid rgba(196,150,48,0.15)', color: 'rgba(180,190,210,0.55)', background: 'rgba(255,255,255,0.02)' }}>
              Annuler
            </button>
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title transition-all"
              style={{ background: 'linear-gradient(135deg,#b91c1c,#ef4444)', color: '#fff' }}>
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
const FinanceList = () => {
  const navigate = useNavigate();
  const [payments, setPayments]   = useState([]);
  const [students, setStudents]   = useState([]);
  const [courses, setCourses]     = useState([]);
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

    const [paymentsRes, statsRes, studentsRes, coursesRes] = await Promise.all([
      paymentAPI.getAllPayments(),
      paymentAPI.getStats(),
      studentAPI ? studentAPI.getAllStudents({ size: 200 }) : Promise.resolve({ success: false }),
      courseAPI.getAllCourses(),
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
const openEdit   = p => { 
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
  const sidebarW = sidebarCollapsed ? 72 : 240;
  const hasFilters = filterStatus !== 'all' || filterMonth !== 'all' || search;

  const statCards = [
    { label:'Total Encaissé',     val: fmtMAD(stats.totalPaid),          icon:'◉', color:'#4ade80', sub:`${stats.countPaid || 0} paiement(s)` },
    { label:'Reste à Percevoir',  val: fmtMAD(stats.totalUnpaid),         icon:'◌', color:'#f87171', sub:`${stats.countUnpaid || 0} impayé(s)` },
    { label:'Partiels',           val: String(stats.countPartial || 0),   icon:'◐', color:'#fbbf24', sub:'étudiants' },
    { label:'Ce Mois',            val: fmtMAD(stats.currentMonthTotal),   icon:'◷', color:'#f0c84a', sub:'mois courant' },
    { label:'Total Paiements',    val: String(stats.total || payments.length), icon:'◈', color:'#60a5fa', sub:'enregistrés' },
  ];

  const TABS = [
    { key:'all',      label:'Tous',      count: filtered.length, color:'#e8eaf0' },
    { key:'Non payé', label:'Non payés', count: unpaid.length,   color:'#f87171' },
    { key:'Payé',     label:'Payés',     count: paid.length,     color:'#4ade80' },
    { key:'Partiel',  label:'Partiels',  count: partial.length,  color:'#fbbf24' },
  ];

  return (
    <div className="min-h-screen warriors-font" style={{ background: 'linear-gradient(145deg,#080f1e 0%,#060c18 100%)' }}>
      {/* Ambient bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute rounded-full" style={{ width:'700px',height:'700px',background:'radial-gradient(circle,rgba(196,150,48,0.04),transparent 70%)',top:'-15%',left:'-10%',filter:'blur(40px)' }} />
        <div className="absolute rounded-full" style={{ width:'500px',height:'500px',background:'radial-gradient(circle,rgba(34,197,94,0.04),transparent 70%)',bottom:'-10%',right:'-5%',filter:'blur(40px)' }} />
        <div className="absolute inset-0" style={{ backgroundImage:'radial-gradient(circle, rgba(196,150,48,0.04) 1px, transparent 1px)', backgroundSize:'42px 42px' }} />
      </div>

      <Sidebar activeItem="finance" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <main className="relative z-10 transition-all duration-300" style={{ marginLeft: `${sidebarW}px` }}>

        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-[72px]"
          style={{ background:'rgba(6,12,24,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(196,150,48,0.08)' }}>
          <div className="flex items-center gap-3">
            <span className="warriors-font text-xs" style={{ color:'rgba(148,163,184,0.35)' }}>Admin</span>
            <span style={{ color:'rgba(196,150,48,0.25)' }}>›</span>
            <span className="warriors-title text-sm font-semibold" style={{ color:'#f0c84a' }}>Finances</span>
          </div>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex p-1 rounded-xl gap-1" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(196,150,48,0.1)' }}>
              {[['table','≡','Tableau'],['grid','⊞','Cartes']].map(([mode,icon,label]) => (
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
              <span className="font-black text-base">+</span> Nouveau paiement
            </button>
          </div>
        </header>

        <div className="px-8 py-7 space-y-6">

          {/* Page title */}
          <div>
            <h1 className="warriors-title text-3xl font-black" style={{ color:'#e8eaf0' }}>
              Gestion <span className="gold-text">Financière</span>
            </h1>
            <p className="warriors-font text-sm mt-1" style={{ color:'rgba(148,163,184,0.4)' }}>
              {filtered.length} paiement{filtered.length !== 1 ? 's' : ''} · Ce mois : {fmtMAD(stats.currentMonthTotal)}
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

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statCards.map(({ label, val, icon, color, sub }) => (
              <div key={label} className="p-4 rounded-2xl animate-in"
                style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.07)' }}>
                <span className="text-xl" style={{ color }}>{icon}</span>
                <p className="warriors-title text-lg font-black mt-2 leading-tight" style={{ color:'#e8eaf0' }}>{val}</p>
                <p className="warriors-font text-[10px] mt-1" style={{ color:'rgba(148,163,184,0.4)' }}>{label.toUpperCase()}</p>
                <p className="warriors-font text-[10px]" style={{ color: 'rgba(148,163,184,0.25)' }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 p-5 rounded-2xl"
            style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.1)' }}>
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color:'rgba(196,150,48,0.4)' }}>⊕</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Nom étudiant, cours…"
                className="input-warriors w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" />
            </div>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
              className="input-warriors px-4 py-2.5 rounded-xl text-sm min-w-[170px]" style={{ cursor:'pointer' }}>
              {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            {hasFilters && (
              <button onClick={() => { setFilterStatus('all'); setFilterMonth('all'); setSearch(''); }}
                className="px-4 py-2.5 rounded-xl text-xs warriors-font font-medium transition-all whitespace-nowrap"
                style={{ color:'rgba(196,150,48,0.6)', border:'1px solid rgba(196,150,48,0.15)', background:'rgba(196,150,48,0.05)' }}>
                Réinitialiser
              </button>
            )}
          </div>

          {/* ── GRID VIEW ── */}
          {viewMode === 'grid' && (
            loading && payments.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_,i) => (
                  <div key={i} className="rounded-2xl p-5 space-y-4" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.07)' }}>
                    {[['70%','h-4'],['50%','h-3'],['100%','h-8'],['80%','h-2.5']].map(([w,h],j) => (
                      <div key={j} className={`${h} rounded-full shimmer`} style={{ background:'rgba(196,150,48,0.06)', width:w }} />
                    ))}
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
                style={{ background:'rgba(255,255,255,0.01)', border:'1px solid rgba(196,150,48,0.07)' }}>
                <span className="text-6xl mb-4 opacity-20">💸</span>
                <p className="warriors-title font-bold text-lg" style={{ color:'rgba(232,234,240,0.25)' }}>Aucun paiement trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {// Pareil pour PaymentCard :
filtered.map((p, i) => (
  <PaymentCard 
    key={p.id ?? `virtual-${p.studentId}`}   // ← ICI
    payment={p} 
    index={i} 
    onEdit={openEdit} 
    onDelete={openDelete} 
    onPay={openPay} 
  />
))}
              </div>
            )
          )}

          {/* ── TABLE VIEW ── */}
          {viewMode === 'table' && (
            <div className="rounded-2xl overflow-hidden"
              style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.1)' }}>

              {/* Tabs */}
              <div className="flex" style={{ borderBottom:'1px solid rgba(196,150,48,0.08)' }}>
                {TABS.map(tab => (
                  <button key={tab.key} onClick={() => setFilterStatus(tab.key)}
                    className={`flex items-center gap-2 px-6 py-4 text-xs font-semibold warriors-font transition-all ${filterStatus === tab.key ? 'tab-active' : 'tab-inactive'}`}
                    style={{ color: filterStatus === tab.key ? tab.color : 'rgba(100,116,139,0.6)' }}>
                    {tab.label}
                    <span className="px-2 py-0.5 rounded-full text-[10px]"
                      style={{ background: filterStatus === tab.key ? 'rgba(196,150,48,0.12)' : 'rgba(255,255,255,0.04)', color: filterStatus === tab.key ? '#f0c84a' : 'rgba(100,116,139,0.6)' }}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Table Header */}
              <div className="grid px-6 py-3"
                style={{
                  gridTemplateColumns: '2.5fr 1.8fr 1fr 1fr 1fr 1.2fr 1fr auto',
                  borderBottom: '1px solid rgba(196,150,48,0.06)',
                  background: 'rgba(255,255,255,0.01)',
                }}>
                {['ÉTUDIANT','COURS','MONTANT','MOIS','STATUT','DATE','MÉTHODE',''].map(h => (
                  <div key={h} className="warriors-font text-[10px] font-semibold tracking-[0.1em]"
                    style={{ color:'rgba(196,150,48,0.35)' }}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {loading && payments.length === 0 ? (
                <div className="space-y-2 p-4">
                  {[...Array(5)].map((_,i) => (
                    <div key={i} className="h-14 rounded-xl shimmer" style={{ background:'rgba(196,150,48,0.04)' }} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <span className="text-5xl mb-3 opacity-20">💸</span>
                  <p className="warriors-title font-bold" style={{ color:'rgba(232,234,240,0.2)' }}>Aucun paiement trouvé</p>
                </div>
              ) : (
                // Dans le map des PaymentRow et PaymentCard, remplace key={p.id} par :
filtered.map((p, i) => (
  <PaymentRow 
    key={p.id ?? `virtual-${p.studentId}`}   // ← ICI
    payment={p} 
    onEdit={openEdit} 
    onDelete={openDelete} 
    onPay={openPay} 
  />
))


              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
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
    </div>
  );
};

export default FinanceList;