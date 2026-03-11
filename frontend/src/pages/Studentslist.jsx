// src/components/StudentsList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../services/studentService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';

/* ─── Warriors CSS injection ─── */
if (!document.getElementById('warriors-students-style')) {
  const s = document.createElement('style');
  s.id = 'warriors-students-style';
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
    .checkbox-warriors { appearance:none; width:16px; height:16px; border-radius:4px; border:1.5px solid rgba(196,150,48,0.3); background:rgba(255,255,255,0.04); cursor:pointer; transition:all 0.15s; flex-shrink:0; }
    .checkbox-warriors:checked { background:linear-gradient(135deg,#c49630,#f0c84a); border-color:#c49630; background-image:url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%230a1628' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e"); }
    .row-hover { transition: background 0.15s; }
    .row-hover:hover { background: rgba(196,150,48,0.04); }
  `;
  document.head.appendChild(s);
}

/* ─── Constants ─── */
const SUBJECTS = [
  'Mathématiques','Physique-Chimie','SVT','Français','Anglais',
  'Arabe','Histoire-Géographie','Philosophie','Économie','Comptabilité','Informatique'
];

const SUBJECT_COLORS = {
  'Mathématiques':    { bg:'rgba(99,102,241,0.1)',  border:'rgba(99,102,241,0.2)',  color:'#818cf8' },
  'Physique-Chimie':  { bg:'rgba(59,130,246,0.1)',  border:'rgba(59,130,246,0.2)',  color:'#60a5fa' },
  'SVT':              { bg:'rgba(34,197,94,0.1)',   border:'rgba(34,197,94,0.2)',   color:'#4ade80' },
  'Français':         { bg:'rgba(236,72,153,0.1)',  border:'rgba(236,72,153,0.2)',  color:'#f472b6' },
  'Anglais':          { bg:'rgba(20,184,166,0.1)',  border:'rgba(20,184,166,0.2)',  color:'#2dd4bf' },
  'Arabe':            { bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.2)',  color:'#fbbf24' },
  'Histoire-Géographie':{ bg:'rgba(239,68,68,0.1)', border:'rgba(239,68,68,0.2)',  color:'#f87171' },
  'Philosophie':      { bg:'rgba(168,85,247,0.1)',  border:'rgba(168,85,247,0.2)',  color:'#c084fc' },
  'Économie':         { bg:'rgba(196,150,48,0.1)',  border:'rgba(196,150,48,0.2)',  color:'#f0c84a' },
  'Comptabilité':     { bg:'rgba(234,179,8,0.1)',   border:'rgba(234,179,8,0.2)',   color:'#facc15' },
  'Informatique':     { bg:'rgba(6,182,212,0.1)',   border:'rgba(6,182,212,0.2)',   color:'#22d3ee' },
};

const getSubjectStyle = (s) => SUBJECT_COLORS[s] || { bg:'rgba(148,163,184,0.08)', border:'rgba(148,163,184,0.15)', color:'#94a3b8' };

const getInitials = (student) => {
  const p = student.prenom || '';
  const n = student.nom || '';
  return `${p[0] || ''}${n[0] || ''}`.toUpperCase() || '?';
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

/* ══════════════════════════════════════════════════════════════ */
/*  STUDENT CARD (Grid View)                                     */
/* ══════════════════════════════════════════════════════════════ */
const StudentCard = ({ student, onEdit, onDelete, index }) => {
  const name = student.fullName || `${student.prenom || ''} ${student.nom || ''}`.trim();
  const matieres = student.matieres || [];

  return (
    <div
      className="card-hover animate-in rounded-2xl flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(13,24,44,0.95) 0%, rgba(8,15,30,0.9) 100%)',
        border: '1px solid rgba(196,150,48,0.1)',
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Gold stripe */}
      <div className="h-0.5 bg-gradient-to-r from-[#c49630] to-[#f0c84a]" />

      <div className="p-5 flex flex-col gap-3.5 flex-1">
        {/* Avatar + Info */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 warriors-title font-black text-sm"
            style={{ background: getAvatarGrad(student.id), color: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.35)' }}>
            {getInitials(student)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="warriors-title font-bold text-sm leading-snug truncate" style={{ color: '#e8eaf0' }}>{name}</h3>
            <p className="warriors-font text-[11px] mt-0.5" style={{ color: 'rgba(196,150,48,0.55)' }}>
              ID #{student.id}
            </p>
          </div>
        </div>

        {/* Level + Field badges */}
        <div className="flex flex-wrap gap-1.5">
          {student.niveau && (
            <span className="warriors-font text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}>
              🎓 {student.niveau}
            </span>
          )}
          {student.filiere && (
            <span className="warriors-font text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(196,150,48,0.08)', border: '1px solid rgba(196,150,48,0.18)', color: '#f0c84a' }}>
              {student.filiere}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(196,150,48,0.1),transparent)' }} />

        {/* Info rows */}
        <div className="space-y-1.5">
          {[
            { icon: '📞', val: student.phoneNumber || '—' },
            { icon: '👪', val: student.parentPhone || '—', label: 'Parent' },
            { icon: '🏫', val: student.etablissement || '—' },
            { icon: '◷', val: student.dateInscription ? new Date(student.dateInscription).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
          ].map(({ icon, val, label }) => (
            <div key={icon} className="flex items-center gap-2">
              <span className="text-[11px] flex-shrink-0 w-4 text-center" style={{ color: 'rgba(196,150,48,0.4)' }}>{icon}</span>
              <span className="warriors-font text-[12px] truncate" style={{ color: 'rgba(180,190,210,0.5)' }}>
                {label ? <span style={{ color: 'rgba(148,163,184,0.35)' }}>{label}: </span> : null}{val}
              </span>
            </div>
          ))}
        </div>

        {/* Subjects */}
        {matieres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {matieres.slice(0, 3).map(s => {
              const sc = getSubjectStyle(s);
              return (
                <span key={s} className="warriors-font text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                  {s}
                </span>
              );
            })}
            {matieres.length > 3 && (
              <span className="warriors-font text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(148,163,184,0.5)' }}>
                +{matieres.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t" style={{ borderColor: 'rgba(196,150,48,0.08)' }}>
          <button onClick={() => onEdit(student)}
            className="flex-1 py-2 rounded-xl text-[12px] font-semibold warriors-font transition-all duration-200"
            style={{ background: 'rgba(196,150,48,0.08)', border: '1px solid rgba(196,150,48,0.18)', color: '#f0c84a' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,150,48,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(196,150,48,0.08)'}>
            ✏ Modifier
          </button>
          <button onClick={() => onDelete(student)}
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
/*  TABLE ROW (Table View)                                       */
/* ══════════════════════════════════════════════════════════════ */
const TableView = ({ grouped, onEdit, onDelete }) => (
  <div className="space-y-5">
    {Object.entries(grouped).map(([group, students], gi) => (
      <div key={group} className="rounded-2xl overflow-hidden animate-in"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)', animationDelay: `${gi * 80}ms` }}>
        {/* Group header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(196,150,48,0.08)', background: 'rgba(196,150,48,0.03)' }}>
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg,#c49630,#f0c84a)' }} />
            <h2 className="warriors-title text-base font-bold" style={{ color: '#c8a84a' }}>📚 {group}</h2>
          </div>
          <span className="warriors-font text-[11px] px-2.5 py-0.5 rounded-full"
            style={{ background: 'rgba(196,150,48,0.1)', border: '1px solid rgba(196,150,48,0.18)', color: 'rgba(196,150,48,0.6)' }}>
            {students.length} étudiant{students.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-warriors">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(196,150,48,0.07)' }}>
                {['Étudiant', 'Téléphone', 'Tél. Parent', 'Lycée / Collège', 'Inscription', 'Matières', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left warriors-font text-[10px] font-semibold tracking-[0.1em]"
                    style={{ color: 'rgba(196,150,48,0.4)' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => {
                const name = student.fullName || `${student.prenom || ''} ${student.nom || ''}`.trim();
                const matieres = student.matieres || [];
                return (
                  <tr key={student.id} className="row-hover" style={{ borderBottom: '1px solid rgba(196,150,48,0.04)' }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center warriors-title font-black text-xs flex-shrink-0"
                          style={{ background: getAvatarGrad(student.id), color: '#fff' }}>
                          {getInitials(student)}
                        </div>
                        <div>
                          <p className="warriors-font text-sm font-semibold" style={{ color: '#e8eaf0' }}>{name}</p>
                          <p className="warriors-font text-[10px]" style={{ color: 'rgba(196,150,48,0.45)' }}>ID #{student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="warriors-font text-[12px]" style={{ color: 'rgba(180,190,210,0.6)' }}>{student.phoneNumber || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="warriors-font text-[12px]" style={{ color: 'rgba(180,190,210,0.6)' }}>{student.parentPhone || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="warriors-font text-[12px] truncate block max-w-[180px]" style={{ color: 'rgba(180,190,210,0.6)' }}>{student.etablissement || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="warriors-font text-[11px]" style={{ color: 'rgba(148,163,184,0.4)' }}>
                        {student.dateInscription ? new Date(student.dateInscription).toLocaleDateString('fr-FR') : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {matieres.slice(0, 2).map(s => {
                          const sc = getSubjectStyle(s);
                          return (
                            <span key={s} className="warriors-font text-[10px] px-2 py-0.5 rounded-full"
                              style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                              {s}
                            </span>
                          );
                        })}
                        {matieres.length > 2 && (
                          <span className="warriors-font text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(148,163,184,0.4)' }}>
                            +{matieres.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ opacity: 1 }}>
                        <button onClick={() => onEdit(student)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all"
                          style={{ background: 'rgba(196,150,48,0.08)', border: '1px solid rgba(196,150,48,0.15)', color: '#f0c84a' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,150,48,0.18)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(196,150,48,0.08)'}>✏</button>
                        <button onClick={() => onDelete(student)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all"
                          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>✕</button>
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
/*  STUDENT FORM MODAL                                           */
/* ══════════════════════════════════════════════════════════════ */
const FormModal = ({ student, onSave, onClose, levels, fields, loading }) => {
  const isEdit = !!student;
  const [activeSection, setActiveSection] = useState(0);
  const sections = ['Identité', 'Contact', 'Scolarité', 'Matières'];
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

  const sectionContent = [
    /* 0 — Identité */
    <div key="identity" className="space-y-5">
      {/* Avatar Preview */}
      <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center warriors-title font-black text-xl"
          style={{ background: getAvatarGrad(student?.id || 0), color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          {(form.prenom[0] || '?').toUpperCase()}{(form.nom[0] || '').toUpperCase()}
        </div>
        <div>
          <p className="warriors-title font-bold text-base" style={{ color: '#e8eaf0' }}>
            {form.prenom || 'Prénom'} {form.nom || 'Nom'}
          </p>
          <p className="warriors-font text-xs mt-0.5" style={{ color: 'rgba(196,150,48,0.5)' }}>
            {form.level || 'Niveau'} · {form.field || 'Filière'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
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

    /* 1 — Contact */
    <div key="contact" className="space-y-5">
      <div>
        <LabelRow name="phone" label="TÉLÉPHONE ÉTUDIANT" req />
        <input name="phone" type="tel" value={form.phone} onChange={h} placeholder="06XXXXXXXX" className={inp('phone')} />
      </div>
      <div>
        <LabelRow name="parentPhone" label="TÉLÉPHONE PARENT" req />
        <input name="parentPhone" type="tel" value={form.parentPhone} onChange={h} placeholder="06XXXXXXXX" className={inp('parentPhone')} />
      </div>
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(196,150,48,0.04)', border: '1px solid rgba(196,150,48,0.1)' }}>
        <p className="warriors-font text-xs" style={{ color: 'rgba(148,163,184,0.5)' }}>
          📞 Format marocain accepté : 06XXXXXXXX ou 07XXXXXXXX
        </p>
      </div>
    </div>,

    /* 2 — Scolarité */
    <div key="scolarite" className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
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

    /* 3 — Matières */
    <div key="matieres" className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-[0.12em] warriors-font" style={{ color: 'rgba(196,150,48,0.45)' }}>
          MATIÈRES DE SOUTIEN *
        </p>
        {errors.subjects && <span className="text-[10px] warriors-font" style={{ color: '#f87171' }}>{errors.subjects}</span>}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {SUBJECTS.map(s => {
          const selected = form.subjects.includes(s);
          const sc = getSubjectStyle(s);
          return (
            <button key={s} type="button" onClick={() => toggleSubject(s)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left"
              style={{
                background: selected ? sc.bg : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selected ? sc.border : 'rgba(255,255,255,0.06)'}`,
              }}>
              <div className="w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: selected ? 'linear-gradient(135deg,#c49630,#f0c84a)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${selected ? '#c49630' : 'rgba(196,150,48,0.2)'}`,
                }}>
                {selected && <span style={{ color: '#0a1628', fontSize: '9px', fontWeight: 900 }}>✓</span>}
              </div>
              <span className="warriors-font text-sm" style={{ color: selected ? sc.color : 'rgba(180,190,210,0.55)' }}>{s}</span>
            </button>
          );
        })}
      </div>
      {form.subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl" style={{ background: 'rgba(196,150,48,0.04)', border: '1px solid rgba(196,150,48,0.1)' }}>
          {form.subjects.map(s => {
            const sc = getSubjectStyle(s);
            return (
              <span key={s} className="warriors-font text-[10px] px-2.5 py-1 rounded-full"
                style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                {s}
              </span>
            );
          })}
        </div>
      )}
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center warriors-title font-black text-sm"
              style={{ background: getAvatarGrad(student?.id || 0), color: '#fff' }}>
              {isEdit ? getInitials(student) : '👤'}
            </div>
            <div>
              <h2 className="warriors-title text-lg font-bold" style={{ color: '#f0c84a' }}>
                {isEdit ? 'Modifier l\'étudiant' : 'Nouvel étudiant'}
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
                {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer l\'étudiant'}
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
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(4,9,20,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden animate-in"
        style={{ background: 'linear-gradient(145deg,#0d1c30,#080f1e)', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div className="px-7 py-5" style={{ background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(239,68,68,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)' }}>⚠</div>
            <div>
              <h3 className="warriors-title font-bold text-base" style={{ color: '#f87171' }}>Supprimer cet étudiant ?</h3>
              <p className="warriors-font text-[11px] mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>Action irréversible</p>
            </div>
          </div>
        </div>
        <div className="p-7 space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center warriors-title font-black text-sm"
              style={{ background: getAvatarGrad(student.id || 0), color: '#fff' }}>
              {getInitials(student)}
            </div>
            <div>
              <p className="warriors-title font-bold text-sm" style={{ color: '#e8eaf0' }}>{name}</p>
              <p className="warriors-font text-xs mt-0.5" style={{ color: 'rgba(196,150,48,0.5)' }}>
                {student.niveau} · {student.filiere} · {student.etablissement}
              </p>
            </div>
          </div>
          <p className="warriors-font text-xs" style={{ color: 'rgba(248,113,113,0.6)' }}>
            Cet étudiant et toutes ses données seront définitivement supprimés.
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
const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents]   = useState([]);
  const [stats, setStats]         = useState({ totalStudents: 0 });
  const [levels, setLevels]       = useState([]);
  const [fields, setFields]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode]   = useState('table');

  const [filterLevel, setFilterLevel] = useState('all');
  const [filterField, setFilterField] = useState('all');
  const [search, setSearch]           = useState('');

  const [showForm, setShowForm]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [current, setCurrent]       = useState(null);
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

  useEffect(() => {
    if (!getAuthToken()) { navigate('/login'); return; }
    loadAll();
  }, []);

const loadAll = async () => {
  try {
    setLoading(true);
    setError('');

    const [stRes, lvRes, fldRes, evRes] = await Promise.all([
      studentAPI.getStats(),
      studentAPI.getNiveaux(),
      studentAPI.getFilieres(),
      studentAPI.getAllStudents({ size: 100 }),
    ]);

    console.log('stRes:', stRes);
    console.log('lvRes:', lvRes);
    console.log('fldRes:', fldRes);
    console.log('evRes:', evRes);

    const studentsData = Array.isArray(evRes)
      ? evRes
      : Array.isArray(evRes?.content)
      ? evRes.content
      : Array.isArray(evRes?.data)
      ? evRes.data
      : Array.isArray(evRes?.data?.content)
      ? evRes.data.content
      : [];

    setStudents(studentsData);
    setStats(stRes || { totalStudents: 0 });
    setLevels(Array.isArray(lvRes) && lvRes.length > 0 ? lvRes : DEFAULT_LEVELS);
    setFields(Array.isArray(fldRes) && fldRes.length > 0 ? fldRes : DEFAULT_FIELDS);
  } catch (err) {
    console.error(err);
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
      const payload = {
        nom: data.nom, prenom: data.prenom, email: data.email,
        phoneNumber: data.phone, parentPhone: data.parentPhone,
        niveau: data.level, filiere: data.field, etablissement: data.lycee,
        matieres: data.subjects,
      };
      const res = current
        ? await studentAPI.updateStudent(current.id, payload)
        : await studentAPI.createStudent(payload);
      if (res.success) { await loadAll(); setShowForm(false); setCurrent(null); }
      else alert(res.message || 'Erreur');
    } catch { alert('Erreur lors de la sauvegarde'); } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await studentAPI.deleteStudent(current.id);
      if (res.success) { await loadAll(); setShowDelete(false); setCurrent(null); }
    } catch { alert('Erreur lors de la suppression'); } finally { setLoading(false); }
  };

  const openEdit   = s => { setCurrent(s); setShowForm(true); };
  const openDelete = s => { setCurrent(s); setShowDelete(true); };

  const sidebarW = sidebarCollapsed ? 72 : 240;
  const hasFilters = filterLevel !== 'all' || filterField !== 'all' || search;

  const statCards = [
    { label: 'Total',    val: stats.totalStudents || students.length, icon: '◈', color: '#f0c84a', bg: 'rgba(196,150,48,0.08)',  border: 'rgba(196,150,48,0.15)' },
    { label: 'Niveaux',  val: levels.length,                           icon: '🎓', color: '#c084fc', bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.15)' },
    { label: 'Filières', val: fields.length,                           icon: '📚', color: '#2dd4bf', bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.15)' },
  ];

  return (
    <div className="min-h-screen warriors-font" style={{ background: 'linear-gradient(145deg,#080f1e 0%,#060c18 100%)' }}>
      {/* Ambient bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute rounded-full" style={{ width: '700px', height: '700px', background: 'radial-gradient(circle,rgba(196,150,48,0.04),transparent 70%)', top: '-15%', left: '-10%', filter: 'blur(40px)' }} />
        <div className="absolute rounded-full" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(29,78,216,0.05),transparent 70%)', bottom: '-10%', right: '-5%', filter: 'blur(40px)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(196,150,48,0.04) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
      </div>

      <Sidebar activeItem="students" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <main className="relative z-10 transition-all duration-300" style={{ marginLeft: `${sidebarW}px` }}>

        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-[72px]"
          style={{ background: 'rgba(6,12,24,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(196,150,48,0.08)' }}>
          <div className="flex items-center gap-3">
            <span className="warriors-font text-xs" style={{ color: 'rgba(148,163,184,0.35)' }}>Admin</span>
            <span style={{ color: 'rgba(196,150,48,0.25)' }}>›</span>
            <span className="warriors-title text-sm font-semibold" style={{ color: '#f0c84a' }}>Étudiants</span>
          </div>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex p-1 rounded-xl gap-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,150,48,0.1)' }}>
              {[['grid', '⊞', 'Cartes'], ['table', '≡', 'Tableau']].map(([mode, icon, label]) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold warriors-font transition-all"
                  style={viewMode === mode
                    ? { background: 'linear-gradient(135deg,#c49630,#f0c84a)', color: '#0a1628' }
                    : { color: 'rgba(148,163,184,0.45)' }}>
                  {icon} <span className="hidden sm:inline ml-1">{label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => { setCurrent(null); setShowForm(true); }}
              className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-2xl warriors-title text-sm font-bold"
              style={{ color: '#0a1628', boxShadow: '0 4px 20px rgba(196,150,48,0.25)' }}>
              <span className="font-black text-base">+</span> Nouvel étudiant
            </button>
          </div>
        </header>

        <div className="px-8 py-7 space-y-6">

          {/* Page title */}
          <div>
            <h1 className="warriors-title text-3xl font-black" style={{ color: '#e8eaf0' }}>
              Gestion des <span className="gold-text">Étudiants</span>
            </h1>
            <p className="warriors-font text-sm mt-1" style={{ color: 'rgba(148,163,184,0.4)' }}>
              {filtered.length} étudiant{filtered.length !== 1 ? 's' : ''} · {Object.keys(grouped).length} groupe{Object.keys(grouped).length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl animate-in"
              style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <span style={{ color: '#f87171' }}>⚠</span>
              <span className="warriors-font text-sm" style={{ color: 'rgba(248,113,113,0.75)' }}>{error}</span>
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statCards.map(({ label, val, icon, color, bg, border }) => (
              <div key={label} className="p-4 rounded-2xl animate-in"
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid rgba(196,150,48,0.07)` }}>
                <span className="text-xl" style={{ color }}>{icon}</span>
                <p className="warriors-title text-2xl font-black mt-2" style={{ color: '#e8eaf0' }}>{val}</p>
                <p className="warriors-font text-[10px] mt-1 tracking-wide" style={{ color: 'rgba(148,163,184,0.4)' }}>{label.toUpperCase()}</p>
              </div>
            ))}
          </div>

          {/* Filters bar */}
          <div className="flex flex-wrap items-center gap-3 p-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(196,150,48,0.4)' }}>⊕</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Nom, téléphone, lycée…"
                className="input-warriors w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" />
            </div>
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
              className="input-warriors px-4 py-2.5 rounded-xl text-sm min-w-[160px]" style={{ cursor: 'pointer' }}>
              <option value="all">Tous les niveaux</option>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={filterField} onChange={e => setFilterField(e.target.value)}
              className="input-warriors px-4 py-2.5 rounded-xl text-sm min-w-[160px]" style={{ cursor: 'pointer' }}>
              <option value="all">Toutes les filières</option>
              {fields.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            {hasFilters && (
              <button onClick={() => { setFilterLevel('all'); setFilterField('all'); setSearch(''); }}
                className="px-4 py-2.5 rounded-xl text-xs warriors-font font-medium transition-all whitespace-nowrap"
                style={{ color: 'rgba(196,150,48,0.6)', border: '1px solid rgba(196,150,48,0.15)', background: 'rgba(196,150,48,0.05)' }}>
                Réinitialiser
              </button>
            )}
          </div>

          {/* ── GRID VIEW ── */}
          {viewMode === 'grid' && (
            loading && students.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.07)' }}>
                    {[['70%', 'h-4'], ['50%', 'h-3'], ['100%', 'h-2.5'], ['80%', 'h-2.5']].map(([w, h], j) => (
                      <div key={j} className={`${h} rounded-full shimmer`} style={{ background: 'rgba(196,150,48,0.06)', width: w }} />
                    ))}
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(196,150,48,0.07)' }}>
                <span className="text-6xl mb-4 opacity-20">👥</span>
                <p className="warriors-title font-bold text-lg" style={{ color: 'rgba(232,234,240,0.25)' }}>Aucun étudiant trouvé</p>
                <p className="warriors-font text-sm mt-1" style={{ color: 'rgba(148,163,184,0.25)' }}>Ajustez vos filtres ou ajoutez un étudiant</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((s, i) => (
                  <StudentCard key={s.id} student={s} index={i} onEdit={openEdit} onDelete={openDelete} />
                ))}
              </div>
            )
          )}

          {/* ── TABLE VIEW ── */}
          {viewMode === 'table' && (
            Object.keys(grouped).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(196,150,48,0.07)' }}>
                <span className="text-6xl mb-4 opacity-20">≡</span>
                <p className="warriors-title font-bold text-lg" style={{ color: 'rgba(232,234,240,0.25)' }}>Aucun groupe trouvé</p>
              </div>
            ) : (
              <TableView grouped={grouped} onEdit={openEdit} onDelete={openDelete} />
            )
          )}
        </div>
      </main>

      {/* Modals */}
      {showForm && (
        <FormModal
          student={current}
          loading={loading}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setCurrent(null); }}
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