// src/components/CoursesList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/courseService';
import { professorAPI } from '../services/professorService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';

/* ─── Warriors CSS (shared with ProfessorsList) ─── */
if (!document.getElementById('warriors-style')) {
  const s = document.createElement('style');
  s.id = 'warriors-style';
  s.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
    .warriors-font { font-family: 'Outfit', sans-serif; }
    .warriors-title { font-family: 'Sora', sans-serif; }
    .gold-text { background: linear-gradient(135deg, #c49630, #f0c84a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .card-hover { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(196,150,48,0.2); }
    .btn-gold { background: linear-gradient(135deg, #c49630 0%, #f0c84a 100%); transition: all 0.2s; }
    .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(196,150,48,0.35); }
    .input-warriors { background: rgba(255,255,255,0.04); border: 1px solid rgba(196,150,48,0.15); color: #e8eaf0; font-family: 'Outfit', sans-serif; transition: border-color 0.2s, box-shadow 0.2s; }
    .input-warriors:focus { outline: none; border-color: rgba(196,150,48,0.55); box-shadow: 0 0 0 3px rgba(196,150,48,0.08); }
    .input-warriors::placeholder { color: rgba(148,163,184,0.35); }
    select.input-warriors option { background: #0d1c30; color: #e8eaf0; }
    .scrollbar-warriors::-webkit-scrollbar { width: 4px; }
    .scrollbar-warriors::-webkit-scrollbar-track { background: transparent; }
    .scrollbar-warriors::-webkit-scrollbar-thumb { background: rgba(196,150,48,0.2); border-radius: 4px; }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
    .animate-in { animation: fadeInUp 0.35s ease forwards; }
    @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .shimmer { animation: shimmer 1.6s ease-in-out infinite; }
    .progress-bar { transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
  `;
  document.head.appendChild(s);
}

/* ─── Static data ─── */
const COURSE_TYPES = ['Cours régulier','Cours intensif','Cours de rattrapage','Cours particulier','Atelier','Séminaire','Préparation examen'];
const DEFAULT_LEVELS = ['1ère Année Collège','2ème Année Collège','3ème Année Collège','Tronc Commun','1ère Bac','2ème Bac'];
const DEFAULT_SUBJECTS = ['Mathématiques','Physique-Chimie','SVT','Français','Anglais','Arabe','Histoire-Géographie','Philosophie','Économie','Comptabilité','Informatique','Leadership','Management','Marketing Digital','Design Graphique','UX/UI','Data Science','Cybersécurité'];

const SAMPLE_COURSES = [
  { id:1, title:'Mathématiques Avancées', subject:'Mathématiques', level:'2ème Bac', professorId:1, professorName:'Dr. Ahmed Benali', courseType:'Cours régulier', schedule:'Lundi, Mercredi', time:'14:00 - 16:00', duration:'2h', room:'Salle A1', capacity:25, enrolled:18, price:500, startDate:'2024-09-01', endDate:'2025-06-30', description:'Cours de mathématiques niveau terminale.', objectives:['Maîtriser le calcul différentiel','Résoudre des équations complexes'], status:'En cours' },
  { id:2, title:'Physique-Chimie Terminale', subject:'Physique-Chimie', level:'2ème Bac', professorId:2, professorName:'Dr. Sarah El Amrani', courseType:'Cours intensif', schedule:'Mardi, Jeudi', time:'10:00 - 12:00', duration:'2h', room:'Salle B2', capacity:20, enrolled:20, price:600, startDate:'2024-09-15', endDate:'2025-05-31', description:'Préparation intensive au bac.', objectives:['Comprendre les lois physiques','Maîtriser la chimie organique'], status:'En cours' },
  { id:3, title:'Cybersécurité Fondamentaux', subject:'Cybersécurité', level:'Tronc Commun', professorId:3, professorName:'M. Youssef Tazi', courseType:'Atelier', schedule:'Samedi', time:'09:00 - 13:00', duration:'4h', room:'Labo Info', capacity:15, enrolled:8, price:800, startDate:'2025-01-10', endDate:'2025-07-10', description:'Initiation à la cybersécurité.', objectives:['Comprendre les menaces','Apprendre les outils de sécurité'], status:'À venir' },
];
const DISTANCE_COURSES = {
  '1ère Bac': [
    {
      id: 'd1',
      module: 'Ondes',
      title: 'Les ondes mécaniques progressives',
      image: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=VIDEO_ONDES_1',
      summary: 'Introduction aux ondes mécaniques, propagation, célérité, retard temporel et exemples simples.'
    },
    {
      id: 'd2',
      module: 'Mécanique',
      title: 'Travail et énergie',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=VIDEO_MECANIQUE_1',
      summary: 'Résumé sur le travail d’une force, l’énergie cinétique et le théorème de l’énergie cinétique.'
    }
  ],
  '2ème Bac': [
    {
      id: 'd3',
      module: 'Ondes',
      title: 'Ondes lumineuses et diffraction',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=VIDEO_ONDES_2',
      summary: 'Cours simplifié sur les ondes lumineuses, la diffraction et les applications de base.'
    },
    {
      id: 'd4',
      module: 'Mécanique',
      title: 'Mouvements dans un champ de pesanteur',
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=VIDEO_MECANIQUE_2',
      summary: 'Étude du mouvement vertical et parabolique avec rappels des équations horaires.'
    }
  ]
};
/* ─── Helpers ─── */
const statusConfig = (status) => ({
  'En cours': { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', color: '#4ade80', dot: '#22c55e' },
  'À venir': { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', color: '#60a5fa', dot: '#3b82f6' },
  'Terminé': { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)', color: '#94a3b8', dot: '#64748b' },
}[status] || {});

const enrollPct = (enrolled, capacity) => Math.min(100, Math.round((enrolled / capacity) * 100));
const enrollColor = (pct) => pct >= 90 ? '#f87171' : pct >= 70 ? '#f0c84a' : '#4ade80';

/* ══════════════════════════════════════════════════════════════ */
/*  COURSE CARD                                                  */
/* ══════════════════════════════════════════════════════════════ */
const CourseCard = ({ course, onDetails, onEdit, onDelete, index }) => {
  const sc = statusConfig(course.status);
  const pct = enrollPct(course.enrolled, course.capacity);

  return (
    <div
      className="card-hover animate-in rounded-2xl flex flex-col"
      style={{
        background: 'linear-gradient(145deg, rgba(13,24,44,0.95) 0%, rgba(8,15,30,0.9) 100%)',
        border: '1px solid rgba(196,150,48,0.12)',
        animationDelay: `${index * 55}ms`,
      }}
    >
      {/* Card top accent */}
      <div className="h-0.5 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,150,48,0.3), transparent)' }} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="warriors-title font-bold text-sm leading-snug" style={{ color: '#e8eaf0' }}>{course.title}</h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="warriors-font text-[11px]" style={{ color: 'rgba(196,150,48,0.55)' }}>{course.subject}</span>
              <span style={{ color: 'rgba(196,150,48,0.25)' }}>·</span>
              <span className="warriors-font text-[11px]" style={{ color: 'rgba(180,190,210,0.45)' }}>{course.level}</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.dot, boxShadow: `0 0 6px ${sc.dot}` }} />
            <span className="warriors-font text-[10px] font-semibold" style={{ color: sc.color }}>{course.status}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,150,48,0.1), transparent)' }} />

        {/* Info */}
        <div className="space-y-2">
          {[
            { icon: '✦', value: course.professorName },
            { icon: '◷', value: `${course.schedule} · ${course.time}` },
            { icon: '⊞', value: course.room },
          ].map(({ icon, value }) => (
            <div key={icon} className="flex items-center gap-2">
              <span className="text-[11px] flex-shrink-0 w-4 text-center" style={{ color: 'rgba(196,150,48,0.4)' }}>{icon}</span>
              <span className="warriors-font text-[12px] truncate" style={{ color: 'rgba(180,190,210,0.55)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Price + Type tags */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="warriors-title text-base font-black" style={{ color: '#f0c84a' }}>{course.price}</span>
            <span className="warriors-font text-[10px]" style={{ color: 'rgba(196,150,48,0.45)' }}>MAD/mois</span>
          </div>
          <span className="warriors-font text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(180,190,210,0.5)' }}>
            {course.courseType}
          </span>
        </div>

        {/* Enrollment bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="warriors-font text-[10px] font-medium" style={{ color: 'rgba(148,163,184,0.45)' }}>INSCRIPTIONS</span>
            <span className="warriors-font text-[11px] font-semibold" style={{ color: enrollColor(pct) }}>
              {course.enrolled}/{course.capacity}
              <span className="ml-1" style={{ color: 'rgba(148,163,184,0.35)' }}>({pct}%)</span>
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="progress-bar h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: pct >= 90
                  ? 'linear-gradient(90deg, #dc2626, #f87171)'
                  : pct >= 70
                  ? 'linear-gradient(90deg, #c49630, #f0c84a)'
                  : 'linear-gradient(90deg, #16a34a, #4ade80)',
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button onClick={() => onDetails(course)}
            className="flex-1 py-2 rounded-xl text-[12px] font-semibold warriors-font transition-all duration-200"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)', color: '#60a5fa' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.16)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.08)'}>
            Détails
          </button>
          <button onClick={() => onEdit(course)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all duration-200 flex-shrink-0"
            style={{ background: 'rgba(196,150,48,0.08)', border: '1px solid rgba(196,150,48,0.18)', color: '#f0c84a' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,150,48,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(196,150,48,0.08)'}>✏</button>
          <button onClick={() => onDelete(course)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all duration-200 flex-shrink-0"
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
const FormModal = ({ course, onSave, onClose, levels, subjects, professors, loading }) => {
  const isEdit = !!course;
  const [activeSection, setActiveSection] = useState(0);
  const sections = ['Informations', 'Horaires', 'Tarifs & Dates', 'Pédagogie'];
  const [objectiveInput, setObjectiveInput] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(() => course || {
    title:'', subject:'', level:'', professorId:'', courseType:'',
    schedule:'', time:'', duration:'', room:'', capacity:'', price:'',
    startDate:'', endDate:'', description:'', objectives:[], status:'À venir',
  });

  const ch = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const addObjective = () => {
    if (!objectiveInput.trim()) return;
    setFormData(p => ({ ...p, objectives: [...(p.objectives || []), objectiveInput.trim()] }));
    setObjectiveInput('');
  };

  const validate = () => {
    const e = {};
    if (!formData.title?.trim()) e.title = 'Requis';
    if (!formData.subject) e.subject = 'Requis';
    if (!formData.level) e.level = 'Requis';
    if (!formData.professorId) e.professorId = 'Requis';
    if (!formData.courseType) e.courseType = 'Requis';
    if (!formData.schedule?.trim()) e.schedule = 'Requis';
    if (!formData.time?.trim()) e.time = 'Requis';
    if (!formData.room?.trim()) e.room = 'Requis';
    if (!formData.capacity || parseInt(formData.capacity) < 1) e.capacity = 'Min 1';
    if (!formData.price || parseFloat(formData.price) < 0) e.price = 'Requis';
    if (!formData.startDate) e.startDate = 'Requis';
    if (!formData.endDate) e.endDate = 'Requis';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) e.endDate = 'Après la date début';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...formData, title: formData.title.trim(), schedule: formData.schedule.trim(), time: formData.time.trim(), room: formData.room.trim(), professorId: parseInt(formData.professorId), capacity: parseInt(formData.capacity), price: parseFloat(formData.price), objectives: formData.objectives || [] });
  };

  const inp = (name, extra = '') =>
    `input-warriors w-full px-4 py-3 rounded-xl text-sm warriors-font ${errors[name] ? 'border-red-500/60' : ''} ${extra}`;

  const LabelRow = ({ name, label, req }) => (
    <div className="flex items-center justify-between mb-2">
      <label className="text-[10px] font-semibold tracking-[0.12em] warriors-font" style={{ color: 'rgba(196,150,48,0.45)' }}>
        {label}{req && ' *'}
      </label>
      {errors[name] && <span className="text-[10px] warriors-font" style={{ color: '#f87171' }}>{errors[name]}</span>}
    </div>
  );

  const sectionContent = [
    /* 0 — Informations */
    <div key="info" className="space-y-4">
      <div className="col-span-2">
        <LabelRow name="title" label="TITRE DU COURS" req />
        <input type="text" name="title" value={formData.title} onChange={ch}
          placeholder="ex: Mathématiques Bac Science" className={inp('title')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { name:'subject', label:'MATIÈRE', opts: subjects },
          { name:'level', label:'NIVEAU', opts: levels },
          { name:'professorId', label:'PROFESSEUR', custom: professors.map(p => ({ v: p.id, l: `${p.prenom} ${p.nom}` })) },
          { name:'courseType', label:'TYPE DE COURS', opts: COURSE_TYPES },
          { name:'status', label:'STATUT', opts: ['À venir','En cours','Terminé'] },
        ].map(({ name, label, opts, custom }) => (
          <div key={name}>
            <LabelRow name={name} label={label} req={name !== 'status'} />
            <select name={name} value={formData[name]} onChange={ch} className={inp(name)} style={{ cursor: 'pointer' }}>
              <option value="">Sélectionner...</option>
              {opts ? opts.map(o => <option key={o} value={o}>{o}</option>)
                : custom.map(({ v, l }) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>,

    /* 1 — Horaires */
    <div key="schedule" className="grid grid-cols-2 gap-4">
      {[
        { name:'schedule', label:'JOURS', ph:'ex: Lundi, Mercredi' },
        { name:'time', label:'HORAIRE', ph:'ex: 14:00 - 16:00' },
        { name:'duration', label:'DURÉE', ph:'ex: 2h', req:false },
        { name:'room', label:'SALLE', ph:'ex: Salle A1' },
      ].map(({ name, label, ph, req = true }) => (
        <div key={name}>
          <LabelRow name={name} label={label} req={req} />
          <input type="text" name={name} value={formData[name]} onChange={ch} placeholder={ph} className={inp(name)} />
        </div>
      ))}
    </div>,

    /* 2 — Tarifs & Dates */
    <div key="pricing" className="grid grid-cols-2 gap-4">
      {[
        { name:'capacity', label:'CAPACITÉ (places)', ph:'ex: 25', type:'number' },
        { name:'price', label:'PRIX (MAD/mois)', ph:'ex: 500', type:'number' },
        { name:'startDate', label:'DATE DE DÉBUT', type:'date' },
        { name:'endDate', label:'DATE DE FIN', type:'date' },
      ].map(({ name, label, ph, type='text' }) => (
        <div key={name}>
          <LabelRow name={name} label={label} req />
          <input type={type} name={name} value={formData[name]} onChange={ch} placeholder={ph}
            min={type === 'number' ? '0' : undefined} step={name === 'price' ? '0.01' : undefined}
            className={inp(name)} />
        </div>
      ))}

      {/* Enrollment preview */}
      {isEdit && course.enrolled !== undefined && (
        <div className="col-span-2 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
          <p className="warriors-font text-[10px] tracking-widest mb-3" style={{ color: 'rgba(196,150,48,0.4)' }}>INSCRIPTIONS ACTUELLES</p>
          <div className="flex items-center justify-between mb-2">
            <span className="warriors-font text-sm font-semibold" style={{ color: '#e8eaf0' }}>{course.enrolled} / {formData.capacity || course.capacity} places</span>
            <span className="warriors-font text-xs" style={{ color: enrollColor(enrollPct(course.enrolled, formData.capacity || course.capacity)) }}>
              {enrollPct(course.enrolled, formData.capacity || course.capacity)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="progress-bar h-2 rounded-full" style={{
              width: `${enrollPct(course.enrolled, formData.capacity || course.capacity)}%`,
              background: 'linear-gradient(90deg, #c49630, #f0c84a)'
            }} />
          </div>
        </div>
      )}
    </div>,

    /* 3 — Pédagogie */
    <div key="pedagogy" className="space-y-5">
      <div>
        <LabelRow name="description" label="DESCRIPTION" />
        <textarea name="description" value={formData.description} onChange={ch} rows={4}
          placeholder="Décrivez le contenu du cours, les prérequis..."
          className="input-warriors w-full px-4 py-3 rounded-xl text-sm warriors-font resize-none" />
      </div>

      <div>
        <p className="text-[10px] font-semibold tracking-[0.12em] warriors-font mb-3" style={{ color: 'rgba(196,150,48,0.45)' }}>OBJECTIFS PÉDAGOGIQUES</p>
        <div className="flex gap-2 mb-3">
          <input type="text" value={objectiveInput} onChange={e => setObjectiveInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addObjective())}
            placeholder="Ajouter un objectif et appuyer sur Entrée..."
            className="input-warriors flex-1 px-4 py-2.5 rounded-xl text-sm warriors-font" />
          <button type="button" onClick={addObjective}
            className="btn-gold px-4 py-2.5 rounded-xl text-sm warriors-title font-bold flex-shrink-0"
            style={{ color: '#0a1628' }}>+</button>
        </div>

        {(formData.objectives || []).length > 0 && (
          <div className="space-y-2">
            {(formData.objectives || []).map((obj, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                style={{ background: 'rgba(196,150,48,0.06)', border: '1px solid rgba(196,150,48,0.1)' }}>
                <span className="text-sm flex-shrink-0" style={{ color: '#f0c84a' }}>✓</span>
                <span className="warriors-font text-sm flex-1" style={{ color: 'rgba(232,234,240,0.75)' }}>{obj}</span>
                <button type="button" onClick={() => setFormData(p => ({ ...p, objectives: p.objectives.filter((_, idx) => idx !== i) }))}
                  className="text-xs flex-shrink-0 transition-colors warriors-font"
                  style={{ color: 'rgba(248,113,113,0.5)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,113,113,0.5)'}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(4,9,20,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl animate-in"
        style={{ background: 'linear-gradient(145deg, #0d1c30 0%, #080f1e 100%)', border: '1px solid rgba(196,150,48,0.2)', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(196,150,48,0.1)', background: 'rgba(196,150,48,0.03)' }}>
          <div>
            <h2 className="warriors-title text-lg font-bold" style={{ color: '#f0c84a' }}>
              {isEdit ? 'Modifier le cours' : 'Nouveau cours'}
            </h2>
            <p className="warriors-font text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>
              Étape {activeSection + 1} sur {sections.length} — {sections[activeSection]}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
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
                style={{ background: i <= activeSection ? 'linear-gradient(90deg, #c49630, #f0c84a)' : 'rgba(196,150,48,0.1)' }} />
              <span className="warriors-font text-[10px] font-medium transition-colors duration-200"
                style={{ color: i === activeSection ? '#f0c84a' : 'rgba(148,163,184,0.3)' }}>{s}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-warriors px-7 py-6">
            {sectionContent[activeSection]}
          </div>
          <div className="px-7 py-5 flex gap-3 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(196,150,48,0.1)', background: 'rgba(196,150,48,0.02)' }}>
            <button type="button"
              onClick={activeSection === 0 ? onClose : () => setActiveSection(p => p - 1)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold warriors-font transition-all duration-200"
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
                {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le cours'}
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
const DetailsModal = ({ course, onClose, onEdit }) => {
  if (!course) return null;
  const sc = statusConfig(course.status);
  const pct = enrollPct(course.enrolled, course.capacity);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(4,9,20,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden animate-in"
        style={{ background: 'linear-gradient(145deg, #0d1c30, #080f1e)', border: '1px solid rgba(196,150,48,0.15)', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>

        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(196,150,48,0.1)', background: 'rgba(196,150,48,0.03)' }}>
          <h2 className="warriors-title text-lg font-bold" style={{ color: '#f0c84a' }}>Détails du cours</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ border: '1px solid rgba(196,150,48,0.15)', color: 'rgba(148,163,184,0.5)', background: 'rgba(255,255,255,0.02)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,150,48,0.1)'; e.currentTarget.style.color = '#f0c84a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = 'rgba(148,163,184,0.5)'; }}>
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-warriors p-7 space-y-5">
          {/* Hero */}
          <div className="relative p-6 rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(196,150,48,0.1) 0%, rgba(240,200,74,0.04) 100%)', border: '1px solid rgba(196,150,48,0.2)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full"
              style={{ background: 'radial-gradient(circle, #f0c84a, transparent)', transform: 'translate(30%,-30%)' }} />
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(196,150,48,0.25), rgba(240,200,74,0.1))', border: '1.5px solid rgba(196,150,48,0.3)' }}>
                📖
              </div>
              <div className="flex-1">
                <h3 className="warriors-title text-xl font-black" style={{ color: '#e8eaf0' }}>{course.title}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="warriors-font text-sm" style={{ color: 'rgba(196,150,48,0.6)' }}>{course.subject}</span>
                  <span style={{ color: 'rgba(196,150,48,0.25)' }}>·</span>
                  <span className="warriors-font text-sm" style={{ color: 'rgba(180,190,210,0.45)' }}>{course.level}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                    <span className="warriors-font text-[10px] font-semibold" style={{ color: sc.color }}>{course.status}</span>
                  </div>
                  <span className="warriors-font text-[11px] px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(180,190,210,0.5)' }}>
                    {course.courseType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label:'PROFESSEUR', value: course.professorName, icon:'✦' },
              { label:'SALLE', value: course.room, icon:'⊞' },
              { label:'JOURS', value: course.schedule, icon:'◷' },
              { label:'HORAIRE', value: course.time, icon:'⊕' },
              { label:'PRIX', value: `${course.price} MAD/mois`, icon:'◆', gold: true },
              { label:'DURÉE', value: course.duration || '—', icon:'◌' },
              { label:'DATE DÉBUT', value: new Date(course.startDate).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }), icon:'▷' },
              { label:'DATE FIN', value: new Date(course.endDate).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }), icon:'▷' },
            ].map(({ label, value, icon, gold }) => (
              <div key={label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.08)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px]" style={{ color: 'rgba(196,150,48,0.4)' }}>{icon}</span>
                  <span className="warriors-font text-[9px] font-semibold tracking-[0.15em]" style={{ color: 'rgba(196,150,48,0.3)' }}>{label}</span>
                </div>
                <p className="warriors-font text-sm font-medium" style={{ color: gold ? '#f0c84a' : '#c8d0e0' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Enrollment */}
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.08)' }}>
            <p className="warriors-font text-[9px] font-semibold tracking-[0.15em] mb-3" style={{ color: 'rgba(196,150,48,0.35)' }}>INSCRIPTIONS</p>
            <div className="flex items-center justify-between mb-2">
              <span className="warriors-title font-bold text-sm" style={{ color: '#e8eaf0' }}>{course.enrolled} / {course.capacity} places</span>
              <span className="warriors-font text-xs font-semibold" style={{ color: enrollColor(pct) }}>{pct}% rempli</span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="progress-bar h-full rounded-full" style={{
                width: `${pct}%`,
                background: pct >= 90 ? 'linear-gradient(90deg, #dc2626, #f87171)' : pct >= 70 ? 'linear-gradient(90deg, #c49630, #f0c84a)' : 'linear-gradient(90deg, #16a34a, #4ade80)'
              }} />
            </div>
          </div>

          {/* Description */}
          {course.description && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.08)' }}>
              <p className="warriors-font text-[9px] font-semibold tracking-[0.15em] mb-3" style={{ color: 'rgba(196,150,48,0.35)' }}>DESCRIPTION</p>
              <p className="warriors-font text-sm leading-relaxed" style={{ color: 'rgba(180,190,210,0.6)' }}>{course.description}</p>
            </div>
          )}

          {/* Objectives */}
          {course.objectives?.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.08)' }}>
              <p className="warriors-font text-[9px] font-semibold tracking-[0.15em] mb-3" style={{ color: 'rgba(196,150,48,0.35)' }}>OBJECTIFS PÉDAGOGIQUES</p>
              <div className="space-y-2">
                {course.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-sm flex-shrink-0 mt-0.5" style={{ color: '#f0c84a' }}>✓</span>
                    <span className="warriors-font text-sm" style={{ color: 'rgba(180,190,210,0.65)' }}>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-7 py-5 flex gap-3 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(196,150,48,0.1)', background: 'rgba(196,150,48,0.02)' }}>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold warriors-font transition-all"
            style={{ border: '1px solid rgba(196,150,48,0.15)', color: 'rgba(180,190,210,0.55)', background: 'rgba(255,255,255,0.02)' }}>
            Fermer
          </button>
          <button onClick={onEdit}
            className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title btn-gold"
            style={{ color: '#0a1628' }}>
            Modifier le cours
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  DELETE MODAL                                                 */
/* ══════════════════════════════════════════════════════════════ */
const DeleteModal = ({ course, onConfirm, onClose, loading }) => {
  if (!course) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(4,9,20,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden animate-in"
        style={{ background: 'linear-gradient(145deg, #0d1c30, #080f1e)', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div className="px-7 py-5" style={{ background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(239,68,68,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)' }}>⚠</div>
            <div>
              <h3 className="warriors-title font-bold text-base" style={{ color: '#f87171' }}>Supprimer ce cours ?</h3>
              <p className="warriors-font text-[11px] mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>Action irréversible</p>
            </div>
          </div>
        </div>
        <div className="p-7 space-y-5">
          <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
            <p className="warriors-title font-bold text-sm mb-1" style={{ color: '#e8eaf0' }}>{course.title}</p>
            <p className="warriors-font text-xs" style={{ color: 'rgba(196,150,48,0.5)' }}>{course.subject} · {course.level}</p>
          </div>
          {course.enrolled > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
              <span style={{ color: '#f87171', fontSize: '12px' }}>⚠</span>
              <p className="warriors-font text-xs" style={{ color: 'rgba(248,113,113,0.7)' }}>
                {course.enrolled} étudiant(s) inscrit(s) seront affectés par cette suppression.
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={onClose} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold warriors-font transition-all"
              style={{ border: '1px solid rgba(196,150,48,0.15)', color: 'rgba(180,190,210,0.55)', background: 'rgba(255,255,255,0.02)' }}>
              Annuler
            </button>
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title transition-all"
              style={{ background: 'linear-gradient(135deg, #b91c1c, #ef4444)', color: '#fff' }}>
              {loading ? 'Suppression...' : 'Supprimer'}
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
const DistanceCourseCard = ({ item, index }) => {
  return (
    <div
      className="card-hover animate-in rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(145deg, rgba(13,24,44,0.95) 0%, rgba(8,15,30,0.9) 100%)',
        border: '1px solid rgba(196,150,48,0.12)',
        animationDelay: `${index * 55}ms`,
      }}
    >
      <div className="h-48 w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="warriors-font text-[10px] font-semibold px-2 py-1 rounded-full"
              style={{
                background: 'rgba(196,150,48,0.1)',
                border: '1px solid rgba(196,150,48,0.2)',
                color: '#f0c84a',
              }}
            >
              {item.module}
            </span>
          </div>

          <h3
            className="warriors-title font-bold text-sm leading-snug"
            style={{ color: '#e8eaf0' }}
          >
            {item.title}
          </h3>
        </div>

        <p
          className="warriors-font text-sm leading-relaxed"
          style={{ color: 'rgba(180,190,210,0.6)' }}
        >
          {item.summary}
        </p>

        <a
          href={item.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto text-center py-3 rounded-xl text-sm font-bold warriors-title btn-gold"
          style={{ color: '#0a1628', textDecoration: 'none' }}
        >
          Voir la vidéo
        </a>
      </div>
    </div>
  );
};
const CoursesList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedProfessor, setSelectedProfessor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0 });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courseMode, setCourseMode] = useState('presentiel');
  const [distanceLevel, setDistanceLevel] = useState('1ère Bac');
  useEffect(() => {
    const token = getAuthToken();
    if (!token) { navigate('/login'); return; }
    loadData();
  }, [navigate]);

  useEffect(() => { filterCourses(); }, [selectedLevel, selectedSubject, selectedProfessor, searchQuery, courses]);

  const loadData = async () => {
    try {
      setLoading(true); setError('');
      const [cRes, sRes, pRes] = await Promise.all([
        courseAPI.getAllCourses(),
        courseAPI.getStats(),
        professorAPI.getAllProfessors(),
      ]);
      if (cRes.success) setCourses(cRes.data);
      else { setCourses(SAMPLE_COURSES); }
      if (sRes.success) {
        setStats(sRes.data);
        setLevels(sRes.data.levels?.length ? sRes.data.levels : DEFAULT_LEVELS);
        setSubjects(sRes.data.subjects?.length ? sRes.data.subjects : DEFAULT_SUBJECTS);
      } else {
        setLevels(DEFAULT_LEVELS);
        setSubjects(DEFAULT_SUBJECTS);
      }
      if (pRes.success) setProfessors(pRes.data);
    } catch {
      setError('Erreur de connexion au serveur');
      setCourses(SAMPLE_COURSES);
      setLevels(DEFAULT_LEVELS);
      setSubjects(DEFAULT_SUBJECTS);
    } finally { setLoading(false); }
  };

  const filterCourses = () => {
    let f = courses;
    if (selectedLevel !== 'all') f = f.filter(c => c.level === selectedLevel);
    if (selectedSubject !== 'all') f = f.filter(c => c.subject === selectedSubject);
    if (selectedProfessor !== 'all') f = f.filter(c => c.professorId === parseInt(selectedProfessor));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      f = f.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        c.room.toLowerCase().includes(q)
      );
    }
    setFilteredCourses(f);
  };

  const handleAdd = async (data) => {
    try {
      setLoading(true);
      const res = await courseAPI.createCourse(data);
      if (res.success) { await loadData(); setShowAddModal(false); }
      else alert(res.message || 'Erreur');
    } catch { alert('Erreur lors de la création'); } finally { setLoading(false); }
  };

  const handleEdit = async (data) => {
    try {
      setLoading(true);
      const res = await courseAPI.updateCourse(currentCourse.id, data);
      if (res.success) { await loadData(); setShowEditModal(false); setCurrentCourse(null); }
      else alert(res.message || 'Erreur');
    } catch { alert('Erreur lors de la modification'); } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await courseAPI.deleteCourse(currentCourse.id);
      if (res.success) { await loadData(); setShowDeleteModal(false); setCurrentCourse(null); }
      else alert(res.message || 'Erreur');
    } catch { alert('Erreur lors de la suppression'); } finally { setLoading(false); }
  };

  const grouped = filteredCourses.reduce((acc, c) => {
    if (!acc[c.subject]) acc[c.subject] = [];
    acc[c.subject].push(c);
    return acc;
  }, {});

  const sidebarW = sidebarCollapsed ? 72 : 240;

  const statCards = [
    { label: 'Cours', value: stats.totalCourses || courses.length, color: '#f0c84a', bg: 'rgba(196,150,48,0.08)', border: 'rgba(196,150,48,0.15)', icon: '▣' },
    { label: 'En cours', value: courses.filter(c => c.status === 'En cours').length, color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.15)', icon: '◎' },
    { label: 'À venir', value: courses.filter(c => c.status === 'À venir').length, color: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', icon: '◷' },
  ];

  const hasFilters = searchQuery || selectedLevel !== 'all' || selectedSubject !== 'all' || selectedProfessor !== 'all';

  return (
    <div className="min-h-screen warriors-font" style={{ background: 'linear-gradient(145deg, #080f1e 0%, #060c18 100%)' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute rounded-full" style={{ width:'700px', height:'700px', background:'radial-gradient(circle, rgba(196,150,48,0.04), transparent 70%)', top:'-15%', left:'-10%', filter:'blur(40px)' }} />
        <div className="absolute rounded-full" style={{ width:'500px', height:'500px', background:'radial-gradient(circle, rgba(29,78,216,0.05), transparent 70%)', bottom:'-10%', right:'-5%', filter:'blur(40px)' }} />
        <div className="absolute inset-0" style={{ backgroundImage:'linear-gradient(rgba(196,150,48,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(196,150,48,0.025) 1px, transparent 1px)', backgroundSize:'60px 60px' }} />
      </div>

      <Sidebar activeItem="courses" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <main className="relative z-10 transition-all duration-300" style={{ marginLeft: `${sidebarW}px` }}>

        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-[72px]"
          style={{ background: 'rgba(6,12,24,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(196,150,48,0.08)' }}>
          <div className="flex items-center gap-3">
            <span className="warriors-font text-xs" style={{ color: 'rgba(148,163,184,0.35)' }}>Admin</span>
            <span style={{ color: 'rgba(196,150,48,0.25)' }}>›</span>
            <span className="warriors-title text-sm font-semibold" style={{ color: '#f0c84a' }}>Cours</span>
          </div>
          <div className="flex items-center gap-2">
            {statCards.map(({ label, value, color, bg, border, icon }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: bg, border: `1px solid ${border}` }}>
                <span className="text-[11px]" style={{ color }}>{icon}</span>
                <span className="warriors-title text-sm font-bold" style={{ color }}>{value}</span>
                <span className="warriors-font text-[10px] tracking-wide" style={{ color: 'rgba(148,163,184,0.4)' }}>{label.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="px-8 py-7 space-y-6">

          {/* Page title */}
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-3">
  <button
    onClick={() => setCourseMode('presentiel')}
    className="px-4 py-2 rounded-xl text-sm font-semibold warriors-font transition-all"
    style={{
      background: courseMode === 'presentiel' ? 'linear-gradient(135deg, #c49630, #f0c84a)' : 'rgba(255,255,255,0.03)',
      color: courseMode === 'presentiel' ? '#0a1628' : '#c8d0e0',
      border: courseMode === 'presentiel'
        ? '1px solid rgba(240,200,74,0.35)'
        : '1px solid rgba(196,150,48,0.12)'
    }}
  >
    Cours présentiel
  </button>

  <button
    onClick={() => setCourseMode('distance')}
    className="px-4 py-2 rounded-xl text-sm font-semibold warriors-font transition-all"
    style={{
      background: courseMode === 'distance' ? 'linear-gradient(135deg, #c49630, #f0c84a)' : 'rgba(255,255,255,0.03)',
      color: courseMode === 'distance' ? '#0a1628' : '#c8d0e0',
      border: courseMode === 'distance'
        ? '1px solid rgba(240,200,74,0.35)'
        : '1px solid rgba(196,150,48,0.12)'
    }}
  >
    Cours à distance
  </button>
</div>
            <div>
              <h1 className="warriors-title text-3xl font-black" style={{ color: '#e8eaf0' }}>
                Gestion des <span className="gold-text">Cours</span>
              </h1>
              <p className="warriors-font text-sm mt-1" style={{ color: 'rgba(148,163,184,0.4)' }}>
                {filteredCourses.length} cours · {Object.keys(grouped).length} matière{Object.keys(grouped).length !== 1 ? 's' : ''}
              </p>
            </div>
            <button onClick={() => setShowAddModal(true)} disabled={loading}
              className="btn-gold flex items-center gap-2.5 px-5 py-3 rounded-2xl warriors-title text-sm font-bold disabled:opacity-50"
              style={{ color: '#0a1628', boxShadow: '0 4px 20px rgba(196,150,48,0.25)' }}>
              <span className="text-base font-black">+</span>
              Ajouter un cours
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl animate-in"
              style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <span style={{ color: '#f87171' }}>⚠</span>
              <span className="warriors-font text-sm" style={{ color: 'rgba(248,113,113,0.75)' }}>{error}</span>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 p-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(196,150,48,0.4)' }}>⊕</span>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Titre, salle, description..."
                className="input-warriors w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" />
            </div>

            {/* Select filters */}
            {[
              { val: selectedLevel, setter: setSelectedLevel, opts: levels, ph: 'Tous les niveaux', label: 'Niveau' },
              { val: selectedSubject, setter: setSelectedSubject, opts: subjects, ph: 'Toutes les matières', label: 'Matière' },
              { val: selectedProfessor, setter: setSelectedProfessor, opts: professors, ph: 'Tous les profs', label: 'Professeur', isProf: true },
            ].map(({ val, setter, opts, ph, isProf, label }) => (
              <select key={label} value={val} onChange={e => setter(e.target.value)}
                className="input-warriors px-4 py-2.5 rounded-xl text-sm min-w-[160px]" style={{ cursor: 'pointer' }}>
                <option value="all">{ph}</option>
                {opts.map(o => isProf
                  ? <option key={o.id} value={o.id}>{o.prenom} {o.nom}</option>
                  : <option key={o} value={o}>{o}</option>
                )}
              </select>
            ))}

            {hasFilters && (
              <button onClick={() => { setSearchQuery(''); setSelectedLevel('all'); setSelectedSubject('all'); setSelectedProfessor('all'); }}
                className="px-4 py-2.5 rounded-xl text-xs warriors-font font-medium transition-all whitespace-nowrap"
                style={{ color: 'rgba(196,150,48,0.6)', border: '1px solid rgba(196,150,48,0.15)', background: 'rgba(196,150,48,0.05)' }}>
                Réinitialiser
              </button>
            )}
          </div>

          {/* Content */}
          {courseMode === 'presentiel' ? (
  loading && courses.length === 0 ? (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 space-y-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.07)' }}
        >
          {[['70%','h-4'],['50%','h-3'],['100%','h-2.5'],['80%','h-2.5'],['100%','h-1.5']].map(([w, h], j) => (
            <div
              key={j}
              className={`${h} rounded-full shimmer`}
              style={{ background: 'rgba(196,150,48,0.06)', width: w }}
            />
          ))}
        </div>
      ))}
    </div>
  ) : Object.keys(grouped).length === 0 ? (
    <div
      className="flex flex-col items-center justify-center py-20 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(196,150,48,0.07)' }}
    >
      <span className="text-6xl mb-4 opacity-20">📚</span>
      <p className="warriors-title font-bold text-lg" style={{ color: 'rgba(232,234,240,0.25)' }}>
        Aucun cours trouvé
      </p>
      <p className="warriors-font text-sm mt-1" style={{ color: 'rgba(148,163,184,0.25)' }}>
        Modifiez vos filtres ou ajoutez un cours
      </p>
    </div>
  ) : (
    <div className="space-y-8">
      {Object.entries(grouped).map(([subject, group], gi) => (
        <div key={subject} className="animate-in" style={{ animationDelay: `${gi * 80}ms` }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #c49630, #f0c84a)' }} />
              <h2 className="warriors-title text-base font-bold" style={{ color: '#c8a84a' }}>{subject}</h2>
              <span
                className="warriors-font text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                style={{
                  background: 'rgba(196,150,48,0.1)',
                  border: '1px solid rgba(196,150,48,0.18)',
                  color: 'rgba(196,150,48,0.6)'
                }}
              >
                {group.length} cours
              </span>
            </div>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(196,150,48,0.1), transparent)' }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {group.map((course, idx) => (
              <CourseCard
                key={course.id}
                course={course}
                index={idx}
                onDetails={c => { setCurrentCourse(c); setShowDetailsModal(true); }}
                onEdit={c => { setCurrentCourse(c); setShowEditModal(true); }}
                onDelete={c => { setCurrentCourse(c); setShowDeleteModal(true); }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
) : (
  <div className="space-y-6">
    <div
      className="flex flex-wrap items-center gap-3 p-5 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}
    >
      <span className="warriors-font text-sm" style={{ color: '#c8d0e0' }}>
        Choisir le niveau :
      </span>

      {['1ère Bac', '2ème Bac'].map(level => (
        <button
          key={level}
          onClick={() => setDistanceLevel(level)}
          className="px-4 py-2 rounded-xl text-sm font-semibold warriors-font transition-all"
          style={{
            background: distanceLevel === level ? 'linear-gradient(135deg, #c49630, #f0c84a)' : 'rgba(255,255,255,0.03)',
            color: distanceLevel === level ? '#0a1628' : '#c8d0e0',
            border: distanceLevel === level
              ? '1px solid rgba(240,200,74,0.35)'
              : '1px solid rgba(196,150,48,0.12)'
          }}
        >
          {level}
        </button>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {(DISTANCE_COURSES[distanceLevel] || []).map((item, index) => (
        <DistanceCourseCard key={item.id} item={item} index={index} />
      ))}
    </div>
  </div>
)}
        </div>
      </main>

      {/* Modals */}
      {(showAddModal || showEditModal) && (
        <FormModal
          course={showEditModal ? currentCourse : null}
          onSave={showEditModal ? handleEdit : handleAdd}
          onClose={() => { setShowAddModal(false); setShowEditModal(false); setCurrentCourse(null); }}
          levels={levels} subjects={subjects} professors={professors} loading={loading}
        />
      )}
      {showDetailsModal && (
        <DetailsModal
          course={currentCourse}
          onClose={() => { setShowDetailsModal(false); setCurrentCourse(null); }}
          onEdit={() => { setShowDetailsModal(false); setShowEditModal(true); }}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          course={currentCourse}
          onConfirm={handleDelete}
          onClose={() => { setShowDeleteModal(false); setCurrentCourse(null); }}
          loading={loading}
        />
      )}
    </div>
  );
};

export default CoursesList;