// src/components/CoursesList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/courseService';
import { professorAPI } from '../services/professorService';
import api, { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';
import { DistanceCourseManagerModal } from './DistanceCourseManager';

/* ─── API cours à distance (même endpoint que CoursDistance.js) ─── */
const fetchNiveaux = () => api.get('/api/cours/niveaux').then(r => r.data); 
const saveNiveaux = (data) =>
  api.post('/api/cours/niveaux/save', data).then(r => r.data);
/* ─── Warriors CSS (shared with ProfessorsList) ─── */
if (!document.getElementById('warriors-style')) {
  const s = document.createElement('style');
  s.id = 'warriors-style';
  s.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Outfit:wght@300;400;500;600;700&family=Syne:wght@500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
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

    /* ── Cours Distance styles (matching CoursDistance.js) ── */
    @keyframes cdFadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes cdGlow   { 0%,100%{box-shadow:0 0 0 0 rgba(212,167,71,.4)} 50%{box-shadow:0 0 0 12px rgba(212,167,71,0)} }
    @keyframes cdPulse  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.2);opacity:.5} }

    .cd-fade-in { animation: cdFadeIn .4s cubic-bezier(.22,1,.36,1) both; }
    .cd-no-scroll::-webkit-scrollbar{display:none}
    .cd-no-scroll{-ms-overflow-style:none;scrollbar-width:none}

    /* ── Lesson card (same as CoursDistance.js) ── */
    .cd-card {
      background: rgba(255,255,255,.025);
      border: 1px solid rgba(212,167,71,.09);
      border-radius: 22px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s, border-color .3s;
    }
    .cd-card:hover {
      transform: translateY(-7px);
      border-color: rgba(212,167,71,.25);
      box-shadow: 0 24px 48px rgba(0,0,0,.35);
    }
    .cd-thumb {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 150px;
      overflow: hidden;
    }
    .cd-thumb::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 50%, rgba(8,16,30,.85));
    }
    .cd-play {
      position: relative;
      z-index: 1;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      animation: cdGlow 2.5s ease-in-out infinite;
      transition: transform .25s;
    }
    .cd-card:hover .cd-play { transform: scale(1.12); }
    .cd-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 2;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .06em;
      padding: 4px 10px;
      border-radius: 50px;
      font-family: 'Inter', sans-serif;
      text-transform: uppercase;
    }
    .cd-badge-cours     { background: rgba(99,102,241,.18); color: #a5b4fc; border: 1px solid rgba(99,102,241,.25); }
    .cd-badge-exercices { background: rgba(212,167,71,.18); color: #fbbf24; border: 1px solid rgba(212,167,71,.3); }
    .cd-badge-td        { background: rgba(16,185,129,.18); color: #6ee7b7; border: 1px solid rgba(16,185,129,.3); }
    .cd-dur {
      position: absolute;
      bottom: 10px;
      right: 12px;
      z-index: 2;
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      background: rgba(0,0,0,.55);
      padding: 3px 9px;
      border-radius: 50px;
      font-family: 'Inter', sans-serif;
    }
    .cd-card-body { padding: 18px 20px 20px; display: flex; flex-direction: column; flex: 1; }
    .cd-card-title { font-family: 'Syne', sans-serif; font-size: .92rem; font-weight: 700; color: #f1f5f9; line-height: 1.35; margin-bottom: 4px; }
    .cd-card-sub { font-size: .76rem; font-weight: 600; margin-bottom: 10px; letter-spacing: .01em; }
    .cd-card-desc { font-size: .78rem; color: #64748b; line-height: 1.6; flex: 1; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .cd-btn-watch { display: block; text-align: center; padding: 10px 0; border-radius: 14px; font-size: .8rem; font-weight: 700; text-decoration: none; letter-spacing: .03em; transition: opacity .2s, transform .2s; font-family: 'Inter', sans-serif; }
    .cd-btn-watch:hover { opacity: .88; transform: translateY(-1px); }
    .cd-btn-locked { display: block; text-align: center; padding: 10px 0; border-radius: 14px; font-size: .78rem; font-weight: 500; color: #334155; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06); font-family: 'Inter', sans-serif; }

    /* ── Module pills (same as CoursDistance.js) ── */
    .cd-mod-pill { font-family: 'Inter', sans-serif; font-weight: 600; font-size: .8rem; padding: 7px 16px; border-radius: 50px; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 6px; transition: all .2s; white-space: nowrap; }
    .cd-mod-pill.idle { background: rgba(255,255,255,.035); color: #64748b; border: 1px solid rgba(255,255,255,.07); }
    .cd-mod-pill.idle:hover { background: rgba(212,167,71,.07); color: #c8a850; border-color: rgba(212,167,71,.2); }
    .cd-mod-pill.on { color: #0a1628; border: 1px solid transparent; }

    /* ── Matiere header ── */
    .cd-mat-head { display: flex; align-items: center; gap: 16px; padding: 20px 24px; margin-bottom: 22px; background: rgba(255,255,255,.022); border: 1px solid rgba(212,167,71,.09); border-radius: 18px; }

    /* ── Skeleton ── */
    @keyframes cdSkeleton { 0%{background-position:-300% 0} 100%{background-position:300% 0} }
    .cd-skel { background: linear-gradient(90deg, rgba(255,255,255,.03) 0%, rgba(212,167,71,.06) 50%, rgba(255,255,255,.03) 100%); background-size: 300% 100%; animation: cdSkeleton 2s linear infinite; border-radius: 12px; }

    /* ── Admin overlay badge ── */
    .cd-admin-overlay {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 3;
      display: flex;
      gap: 6px;
    }
    .cd-admin-btn {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      transition: all .2s;
      backdrop-filter: blur(8px);
    }
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



/* ─── Helpers ─── */
const statusConfig = (status) => ({
  'En cours': { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', color: '#4ade80', dot: '#22c55e' },
  'À venir':  { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', color: '#60a5fa', dot: '#3b82f6' },
  'Terminé':  { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)', color: '#94a3b8', dot: '#64748b' },
}[status] || {});

const enrollPct   = (enrolled, capacity) => Math.min(100, Math.round((enrolled / capacity) * 100));
const enrollColor = (pct) => pct >= 90 ? '#f87171' : pct >= 70 ? '#f0c84a' : '#4ade80';

/* ══════════════════════════════════════════════════════════════ */
/*  COURSE CARD (Présentiel — inchangé)                         */
/* ══════════════════════════════════════════════════════════════ */
const CourseCard = ({ course, onDetails, onEdit, onDelete, index }) => {
  const sc  = statusConfig(course.status);
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
      <div className="h-0.5 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,150,48,0.3), transparent)' }} />

      <div className="p-5 flex flex-col gap-4 flex-1">
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

        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,150,48,0.1), transparent)' }} />

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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="warriors-font text-[10px] font-medium" style={{ color: 'rgba(148,163,184,0.45)' }}>INSCRIPTIONS</span>
            <span className="warriors-font text-[11px] font-semibold" style={{ color: enrollColor(pct) }}>
              {course.enrolled}/{course.capacity}
              <span className="ml-1" style={{ color: 'rgba(148,163,184,0.35)' }}>({pct}%)</span>
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="progress-bar h-full rounded-full" style={{
              width: `${pct}%`,
              background: pct >= 90 ? 'linear-gradient(90deg, #dc2626, #f87171)' : pct >= 70 ? 'linear-gradient(90deg, #c49630, #f0c84a)' : 'linear-gradient(90deg, #16a34a, #4ade80)',
            }} />
          </div>
        </div>

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
/*  FORM MODAL (Présentiel — inchangé)                          */
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
    if (!formData.title?.trim())                                                         e.title      = 'Requis';
    if (!formData.subject)                                                               e.subject    = 'Requis';
    if (!formData.level)                                                                 e.level      = 'Requis';
    if (!formData.professorId)                                                           e.professorId= 'Requis';
    if (!formData.courseType)                                                            e.courseType = 'Requis';
    if (!formData.schedule?.trim())                                                      e.schedule   = 'Requis';
    if (!formData.time?.trim())                                                          e.time       = 'Requis';
    if (!formData.room?.trim())                                                          e.room       = 'Requis';
    if (!formData.capacity || parseInt(formData.capacity) < 1)                          e.capacity   = 'Min 1';
    if (!formData.price || parseFloat(formData.price) < 0)                              e.price      = 'Requis';
    if (!formData.startDate)                                                             e.startDate  = 'Requis';
    if (!formData.endDate)                                                               e.endDate    = 'Requis';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate))
                                                                                         e.endDate    = 'Après la date début';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      ...formData,
      title: formData.title.trim(), schedule: formData.schedule.trim(),
      time: formData.time.trim(), room: formData.room.trim(),
      professorId: parseInt(formData.professorId),
      capacity: parseInt(formData.capacity), price: parseFloat(formData.price),
      objectives: formData.objectives || [],
    });
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
    <div key="info" className="space-y-4">
      <div className="col-span-2">
        <LabelRow name="title" label="TITRE DU COURS" req />
        <input type="text" name="title" value={formData.title} onChange={ch}
          placeholder="ex: Mathématiques Bac Science" className={inp('title')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { name:'subject',     label:'MATIÈRE',       opts: subjects },
          { name:'level',       label:'NIVEAU',        opts: levels },
          { name:'professorId', label:'PROFESSEUR',    custom: professors.map(p => ({ v: p.id, l: `${p.prenom} ${p.nom}` })) },
          { name:'courseType',  label:'TYPE DE COURS', opts: COURSE_TYPES },
          { name:'status',      label:'STATUT',        opts: ['À venir','En cours','Terminé'] },
        ].map(({ name, label, opts, custom }) => (
          <div key={name}>
            <LabelRow name={name} label={label} req={name !== 'status'} />
            <select name={name} value={formData[name]} onChange={ch} className={inp(name)} style={{ cursor: 'pointer' }}>
              <option value="">Sélectionner...</option>
              {opts
                ? opts.map(o => <option key={o} value={o}>{o}</option>)
                : custom.map(({ v, l }) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>,

    <div key="schedule" className="grid grid-cols-2 gap-4">
      {[
        { name:'schedule', label:'JOURS',   ph:'ex: Lundi, Mercredi' },
        { name:'time',     label:'HORAIRE', ph:'ex: 14:00 - 16:00' },
        { name:'duration', label:'DURÉE',   ph:'ex: 2h', req: false },
        { name:'room',     label:'SALLE',   ph:'ex: Salle A1' },
      ].map(({ name, label, ph, req = true }) => (
        <div key={name}>
          <LabelRow name={name} label={label} req={req} />
          <input type="text" name={name} value={formData[name]} onChange={ch} placeholder={ph} className={inp(name)} />
        </div>
      ))}
    </div>,

    <div key="pricing" className="grid grid-cols-2 gap-4">
      {[
        { name:'capacity',  label:'CAPACITÉ (places)', ph:'ex: 25', type:'number' },
        { name:'price',     label:'PRIX (MAD/mois)',   ph:'ex: 500', type:'number' },
        { name:'startDate', label:'DATE DE DÉBUT',     type:'date' },
        { name:'endDate',   label:'DATE DE FIN',       type:'date' },
      ].map(({ name, label, ph, type = 'text' }) => (
        <div key={name}>
          <LabelRow name={name} label={label} req />
          <input type={type} name={name} value={formData[name]} onChange={ch} placeholder={ph}
            min={type === 'number' ? '0' : undefined} step={name === 'price' ? '0.01' : undefined}
            className={inp(name)} />
        </div>
      ))}
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
                <button type="button"
                  onClick={() => setFormData(p => ({ ...p, objectives: p.objectives.filter((_, idx) => idx !== i) }))}
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
/*  DETAILS MODAL (Présentiel — inchangé)                       */
/* ══════════════════════════════════════════════════════════════ */
const DetailsModal = ({ course, onClose, onEdit }) => {
  if (!course) return null;
  const sc  = statusConfig(course.status);
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

          <div className="grid grid-cols-2 gap-3">
            {[
              { label:'PROFESSEUR', value: course.professorName, icon:'✦' },
              { label:'SALLE',      value: course.room,          icon:'⊞' },
              { label:'JOURS',      value: course.schedule,      icon:'◷' },
              { label:'HORAIRE',    value: course.time,          icon:'⊕' },
              { label:'PRIX',       value: `${course.price} MAD/mois`, icon:'◆', gold: true },
              { label:'DURÉE',      value: course.duration || '—',     icon:'◌' },
              { label:'DATE DÉBUT', value: new Date(course.startDate).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }), icon:'▷' },
              { label:'DATE FIN',   value: new Date(course.endDate).toLocaleDateString('fr-FR',   { day:'numeric', month:'long', year:'numeric' }), icon:'▷' },
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

          {course.description && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.08)' }}>
              <p className="warriors-font text-[9px] font-semibold tracking-[0.15em] mb-3" style={{ color: 'rgba(196,150,48,0.35)' }}>DESCRIPTION</p>
              <p className="warriors-font text-sm leading-relaxed" style={{ color: 'rgba(180,190,210,0.6)' }}>{course.description}</p>
            </div>
          )}

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
/*  DELETE MODAL (Présentiel — inchangé)                        */
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
/*  DISTANCE — LESSON CARD (style identique à CoursDistance.js) */
/* ══════════════════════════════════════════════════════════════ */
const DistanceLessonCard = ({ lesson, color, delay = 0 }) => {
  const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const real = lesson.disponible && lesson.videoUrl;
  const type = lesson.typeSeance || 'cours';
  const imgSrc = lesson.imageUrl
    ? (lesson.imageUrl.startsWith('http') ? lesson.imageUrl : `${BASE}/${lesson.imageUrl}`)
    : null;

  return (
    <div className="cd-card cd-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="cd-thumb" style={{
        background: imgSrc ? undefined : `linear-gradient(135deg,${color}22 0%,rgba(8,16,30,.95) 100%)`,
      }}>
        {imgSrc && (
          <img src={imgSrc} alt={lesson.titre}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        <div className="cd-play"
          style={{ background: real ? `linear-gradient(135deg,${color},#f4d677)` : 'rgba(255,255,255,.06)', color: real ? '#0a1628' : '#334155' }}>
          {real ? '▶' : '🔒'}
        </div>
        <span className={`cd-badge cd-badge-${type}`}>
          {type === 'cours' ? 'Cours' : type === 'exercices' ? 'Exercices' : 'TD'}
        </span>
        {lesson.duree && <span className="cd-dur">{lesson.duree}</span>}
      </div>
      <div className="cd-card-body">
        <div className="cd-card-title">{lesson.titre}</div>
        {lesson.sousTitre && <div className="cd-card-sub" style={{ color }}>{lesson.sousTitre}</div>}
        {lesson.description && <div className="cd-card-desc">{lesson.description}</div>}
        {/* Disponibilité badge admin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
            background: real ? '#4ade80' : '#f87171',
            boxShadow: `0 0 6px ${real ? '#4ade80' : '#f87171'}`,
          }} />
          <span style={{ fontSize: 10, fontFamily: 'Inter,sans-serif', color: real ? '#4ade80' : '#f87171', fontWeight: 600 }}>
            {real ? 'Disponible' : 'Verrouillé'}
          </span>
        </div>
        {real
          ? <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer"
              className="cd-btn-watch" style={{ background: `linear-gradient(135deg,${color},#f4d677)`, color: '#0a1628' }}>
              ▶ &nbsp;Voir la vidéo
            </a>
          : <div className="cd-btn-locked">🔒 &nbsp;Bientôt disponible</div>
        }
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  DISTANCE — MATIERE SECTION (style identique CoursDistance)  */
/* ══════════════════════════════════════════════════════════════ */
const DistanceMatiereSection = ({ mat, color }) => {
  const [activeModId, setActiveModId] = useState(mat.modules?.[0]?.id);
  const mod = mat.modules?.find(m => m.id === activeModId) || mat.modules?.[0];
  const total = mat.modules?.reduce((a, m) => a + (m.seances?.length || 0), 0) || 0;

  return (
    <div className="cd-fade-in">
      {/* Matière header — identique à CoursDistance.js */}
      <div className="cd-mat-head">
        <div style={{ width: 48, height: 48, borderRadius: 16, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
          {mat.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#f1f5f9', fontSize: '1.05rem' }}>{mat.nom}</div>
          {mat.description && <div style={{ fontSize: '.78rem', color: '#64748b', marginTop: 2 }}>{mat.description}</div>}
        </div>
        <div style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 50, fontSize: '.75rem', fontWeight: 600,
          background: `${color}15`, color, border: `1px solid ${color}30`, fontFamily: 'Inter,sans-serif' }}>
          {total} séance{total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Module tabs — identiques à CoursDistance.js */}
      <div className="cd-no-scroll" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
        {mat.modules?.map(m => (
          <button key={m.id} onClick={() => setActiveModId(m.id)}
            className={`cd-mod-pill ${activeModId === m.id ? 'on' : 'idle'}`}
            style={activeModId === m.id ? {
              background: `linear-gradient(135deg,${color},#f4d677)`,
              boxShadow: `0 6px 20px -4px ${color}55`,
              border: '1px solid transparent'
            } : {}}>
            {m.icon && <span>{m.icon}</span>}
            {m.nom}
            <span style={{ fontSize: 10, opacity: .6, fontFamily: 'Inter,sans-serif' }}>({m.seances?.length || 0})</span>
          </button>
        ))}
      </div>

      {/* Grille de séances — identique à CoursDistance.js */}
      {mod && (
        <div key={mod.id} className="cd-fade-in"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {mod.seances?.length > 0
            ? mod.seances.map((s, i) => (
                <DistanceLessonCard key={s.id} lesson={s} color={color} delay={i * 60} />
              ))
            : <p style={{ color: '#475569', fontSize: '.9rem', gridColumn: '1/-1', padding: '32px 0' }}>
                Aucune séance pour ce module pour le moment.
              </p>
          }
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  DISTANCE — STATS BAR                                        */
/* ══════════════════════════════════════════════════════════════ */
const DistanceStatsBar = ({ distanceCourses }) => {
  const totalSeances = distanceCourses.reduce((a, l) =>
    a + (l.matieres || []).reduce((b, m) =>
      b + (m.modules || []).reduce((c, mo) => c + (mo.seances || []).length, 0), 0), 0);
  const totalDispo = distanceCourses.reduce((a, l) =>
    a + (l.matieres || []).reduce((b, m) =>
      b + (m.modules || []).reduce((c, mo) =>
        c + (mo.seances || []).filter(s => s.disponible && s.videoUrl).length, 0), 0), 0);
  const totalMatieres = distanceCourses.reduce((a, l) => a + (l.matieres || []).length, 0);

  return (
    <div style={{
      display: 'flex', gap: 0,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(212,167,71,0.09)',
      borderRadius: 18,
      padding: '14px 0',
      marginBottom: 28,
    }}>
      {[
        { n: String(totalSeances), l: 'Séances totales', c: '#d4a747' },        { n: String(distanceCourses.length), l: 'Niveaux', c: '#60a5fa' },
        { n: String(totalMatieres), l: 'Matières',        c: '#a78bfa' },
      ].map(({ n, l, c }, i, arr) => (
        <div key={l} style={{
          flex: 1, textAlign: 'center', padding: '0 20px',
          borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}>
          <div style={{
            fontFamily: 'Syne,sans-serif', fontSize: '1.8rem', fontWeight: 700,
            background: `linear-gradient(135deg,${c},#fff)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            lineHeight: 1,
          }}>{n}</div>
          <div style={{ fontSize: '.7rem', color: '#475569', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: 'Inter,sans-serif' }}>{l}</div>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                    */
/* ══════════════════════════════════════════════════════════════ */
const CoursesList = () => {
  const navigate = useNavigate();
  const [courses, setCourses]                     = useState([]);
  const [filteredCourses, setFilteredCourses]     = useState([]);
  const [selectedLevel, setSelectedLevel]         = useState('all');
  const [selectedSubject, setSelectedSubject]     = useState('all');
  const [selectedProfessor, setSelectedProfessor] = useState('all');
  const [searchQuery, setSearchQuery]             = useState('');
  const [levels, setLevels]                       = useState([]);
  const [subjects, setSubjects]                   = useState([]);
  const [professors, setProfessors]               = useState([]);
  const [stats, setStats]                         = useState({ totalCourses: 0 });
  const [sidebarCollapsed, setSidebarCollapsed]   = useState(false);
  const [loading, setLoading]                     = useState(true);
  const [error, setError]                         = useState('');
  const [showAddModal, setShowAddModal]           = useState(false);
  const [showEditModal, setShowEditModal]         = useState(false);
  const [showDeleteModal, setShowDeleteModal]     = useState(false);
  const [showDetailsModal, setShowDetailsModal]   = useState(false);
  const [currentCourse, setCurrentCourse]         = useState(null);
  const [courseMode, setCourseMode]               = useState('presentiel');

  // Distance state
  const [distanceLevelId, setDistanceLevelId]         = useState(null);
  const [distanceMatId, setDistanceMatId]             = useState(null);
  const [showDistanceManager, setShowDistanceManager] = useState(false);
  const [distanceCourses, setDistanceCourses]         = useState([]);
  const [distanceLoading, setDistanceLoading]         = useState(false);
  const [distanceError, setDistanceError]             = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) { navigate('/login'); return; }
    loadData();
    loadDistanceData();
  }, [navigate]);

  useEffect(() => { filterCourses(); }, [selectedLevel, selectedSubject, selectedProfessor, searchQuery, courses]);

  useEffect(() => {
    if (distanceCourses.length > 0 && !distanceLevelId) {
      setDistanceLevelId(distanceCourses[0].id);
    }
  }, [distanceCourses]);

  // Reset matière quand niveau change
  useEffect(() => { setDistanceMatId(null); }, [distanceLevelId]);

  /* ── Fetch des cours à distance depuis la même API que CoursDistance.js ── */
  const loadDistanceData = async () => {
    try {
      setDistanceLoading(true);
      setDistanceError(null);
      const res = await fetchNiveaux();
      if (res.success && Array.isArray(res.data)) {
        setDistanceCourses(res.data);
        if (res.data.length > 0) setDistanceLevelId(res.data[0].id);
      } else {
        setDistanceError('Données invalides reçues du serveur.');
      }
    } catch {
      setDistanceError('Impossible de charger les cours à distance.');
    } finally {
      setDistanceLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true); setError('');
      const [cRes, sRes, pRes] = await Promise.all([
        courseAPI.getAllCourses(),
        courseAPI.getStats(),
        professorAPI.getAllProfessors(),
      ]);
      if (cRes.success) setCourses(cRes.data);
      else setCourses(SAMPLE_COURSES);
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
    if (selectedLevel !== 'all')    f = f.filter(c => c.level === selectedLevel);
    if (selectedSubject !== 'all')  f = f.filter(c => c.subject === selectedSubject);
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

  const grouped   = filteredCourses.reduce((acc, c) => {
    if (!acc[c.subject]) acc[c.subject] = [];
    acc[c.subject].push(c);
    return acc;
  }, {});

  const sidebarW  = sidebarCollapsed ? 72 : 240;

  // Distance computed values
  const activeLvl    = distanceCourses.find(l => l.id === distanceLevelId) || distanceCourses[0];
  const effMatId     = distanceMatId || activeLvl?.matieres?.[0]?.id;
  const activeMat    = activeLvl?.matieres?.find(m => m.id === effMatId) || activeLvl?.matieres?.[0];
  const totalDistanceSeances = distanceCourses.reduce((a, l) =>
    a + (l.matieres || []).reduce((b, m) =>
      b + (m.modules || []).reduce((c, mo) => c + (mo.seances || []).length, 0), 0), 0);

  const statCards = [
    { label: 'Cours',    value: stats.totalCourses || courses.length,              color: '#f0c84a', bg: 'rgba(196,150,48,0.08)', border: 'rgba(196,150,48,0.15)', icon: '▣' },
    { label: 'En cours', value: courses.filter(c => c.status === 'En cours').length, color: '#4ade80', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.15)',  icon: '◎' },
    { label: 'À venir',  value: courses.filter(c => c.status === 'À venir').length,  color: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', icon: '◷' },
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

          {/* Page title + mode switcher */}
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCourseMode('presentiel')}
                className="px-4 py-2 rounded-xl text-sm font-semibold warriors-font transition-all"
                style={{
                  background: courseMode === 'presentiel' ? 'linear-gradient(135deg, #c49630, #f0c84a)' : 'rgba(255,255,255,0.03)',
                  color: courseMode === 'presentiel' ? '#0a1628' : '#c8d0e0',
                  border: courseMode === 'presentiel' ? '1px solid rgba(240,200,74,0.35)' : '1px solid rgba(196,150,48,0.12)',
                }}>
                 Cours présentiel
              </button>
              <button
                onClick={() => setCourseMode('distance')}
                className="px-4 py-2 rounded-xl text-sm font-semibold warriors-font transition-all"
                style={{
                  background: courseMode === 'distance' ? 'linear-gradient(135deg, #c49630, #f0c84a)' : 'rgba(255,255,255,0.03)',
                  color: courseMode === 'distance' ? '#0a1628' : '#c8d0e0',
                  border: courseMode === 'distance' ? '1px solid rgba(240,200,74,0.35)' : '1px solid rgba(196,150,48,0.12)',
                }}>
                Cours à distance
              </button>
            </div>

            <div>
              <h1 className="warriors-title text-3xl font-black" style={{ color: '#e8eaf0' }}>
                Gestion des <span className="gold-text">Cours</span>
              </h1>
              <p className="warriors-font text-sm mt-1" style={{ color: 'rgba(148,163,184,0.4)' }}>
                {courseMode === 'presentiel'
                  ? `${filteredCourses.length} cours · ${Object.keys(grouped).length} matière${Object.keys(grouped).length !== 1 ? 's' : ''}`
                  : `${distanceCourses.length} niveau(x) · ${totalDistanceSeances} séance(s)`
                }
              </p>
            </div>

            {courseMode === 'presentiel' ? (
              <button onClick={() => setShowAddModal(true)} disabled={loading}
                className="btn-gold flex items-center gap-2.5 px-5 py-3 rounded-2xl warriors-title text-sm font-bold disabled:opacity-50"
                style={{ color: '#0a1628', boxShadow: '0 4px 20px rgba(196,150,48,0.25)' }}>
                <span className="text-base font-black">+</span>
                Ajouter un cours
              </button>
            ) : (
              <button onClick={() => setShowDistanceManager(true)}
                className="btn-gold flex items-center gap-2.5 px-5 py-3 rounded-2xl warriors-title text-sm font-bold"
                style={{ color: '#0a1628', boxShadow: '0 4px 20px rgba(196,150,48,0.25)' }}>
                <span>⚙</span>
                Gérer les contenus
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl animate-in"
              style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <span style={{ color: '#f87171' }}>⚠</span>
              <span className="warriors-font text-sm" style={{ color: 'rgba(248,113,113,0.75)' }}>{error}</span>
            </div>
          )}

          {/* ── CONTENU ── */}
          {courseMode === 'presentiel' ? (
            /* ══════════════════ MODE PRÉSENTIEL (inchangé) ══════════════════ */
            <>
              <div className="flex flex-wrap items-center gap-3 p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
                <div className="relative flex-1 min-w-[200px]">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(196,150,48,0.4)' }}>⊕</span>
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Titre, salle, description..."
                    className="input-warriors w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" />
                </div>
                {[
                  { val: selectedLevel,    setter: setSelectedLevel,    opts: levels,     ph: 'Tous les niveaux',   label: 'Niveau' },
                  { val: selectedSubject,  setter: setSelectedSubject,  opts: subjects,   ph: 'Toutes les matières', label: 'Matière' },
                  { val: selectedProfessor,setter: setSelectedProfessor,opts: professors, ph: 'Tous les profs',     label: 'Professeur', isProf: true },
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

              {loading && courses.length === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-2xl p-5 space-y-4"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.07)' }}>
                      {[['70%','h-4'],['50%','h-3'],['100%','h-2.5'],['80%','h-2.5'],['100%','h-1.5']].map(([w, h], j) => (
                        <div key={j} className={`${h} rounded-full shimmer`} style={{ background: 'rgba(196,150,48,0.06)', width: w }} />
                      ))}
                    </div>
                  ))}
                </div>
              ) : Object.keys(grouped).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(196,150,48,0.07)' }}>
                  <span className="text-6xl mb-4 opacity-20">📚</span>
                  <p className="warriors-title font-bold text-lg" style={{ color: 'rgba(232,234,240,0.25)' }}>Aucun cours trouvé</p>
                  <p className="warriors-font text-sm mt-1" style={{ color: 'rgba(148,163,184,0.25)' }}>Modifiez vos filtres ou ajoutez un cours</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(grouped).map(([subject, group], gi) => (
                    <div key={subject} className="animate-in" style={{ animationDelay: `${gi * 80}ms` }}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #c49630, #f0c84a)' }} />
                          <h2 className="warriors-title text-base font-bold" style={{ color: '#c8a84a' }}>{subject}</h2>
                          <span className="warriors-font text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                            style={{ background: 'rgba(196,150,48,0.1)', border: '1px solid rgba(196,150,48,0.18)', color: 'rgba(196,150,48,0.6)' }}>
                            {group.length} cours
                          </span>
                        </div>
                        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(196,150,48,0.1), transparent)' }} />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {group.map((course, idx) => (
                          <CourseCard key={course.id} course={course} index={idx}
                            onDetails={c => { setCurrentCourse(c); setShowDetailsModal(true); }}
                            onEdit={c => { setCurrentCourse(c); setShowEditModal(true); }}
                            onDelete={c => { setCurrentCourse(c); setShowDeleteModal(true); }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* ══════════════════ MODE DISTANCE (style CoursDistance.js) ══════════════════ */
            <div className="cd-fade-in">
              {/* Erreur distance */}
              {distanceError && (
                <div style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 24, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div style={{ fontSize: 44, marginBottom: 12, opacity: .5 }}>⚠️</div>
                  <p style={{ color: '#f87171', marginBottom: 20, fontFamily: 'Inter,sans-serif' }}>{distanceError}</p>
                  <button onClick={loadDistanceData}
                    style={{ padding: '10px 24px', borderRadius: 50, background: 'linear-gradient(135deg,#d4a747,#f4d677)', color: '#0a1628', fontFamily: 'Syne,sans-serif', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    Réessayer
                  </button>
                </div>
              )}

              {/* Skeleton loading — identique à CoursDistance.js */}
              {distanceLoading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="cd-card" style={{ pointerEvents: 'none' }}>
                      <div className="cd-skel" style={{ height: 150, borderRadius: 0 }} />
                      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div className="cd-skel" style={{ height: '1rem', width: '60%' }} />
                        <div className="cd-skel" style={{ height: '.7rem', width: '80%' }} />
                        <div className="cd-skel" style={{ height: '3rem' }} />
                        <div className="cd-skel" style={{ height: '2.4rem', borderRadius: 14, marginTop: 6 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!distanceLoading && !distanceError && (
                <>
                  {distanceCourses.length === 0 ? (
                /* État vide */
                <div style={{ textAlign: 'center', padding: '80px 20px', borderRadius: 24, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(212,167,71,.07)' }}>
                  <div style={{ fontSize: 52, marginBottom: 16, opacity: .3 }}>🎬</div>
                  <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'rgba(232,234,240,0.25)', marginBottom: 8 }}>
                    Aucun cours à distance configuré
                  </p>
                  <p style={{ color: '#475569', fontSize: '.9rem', marginBottom: 28 }}>
                    Commencez par ajouter des niveaux et des séances vidéo.
                  </p>
                  <button onClick={() => setShowDistanceManager(true)}
                    style={{ padding: '12px 28px', borderRadius: 50, background: 'linear-gradient(135deg,#d4a747,#f4d677)', color: '#0a1628', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '.85rem', border: 'none', cursor: 'pointer' }}>
                    ⚙ Gérer les cours à distance
                  </button>
                </div>
              ) : (
                <>
                  {/* Stats bar — style CoursDistance hero stats */}
                  <DistanceStatsBar distanceCourses={distanceCourses} />

                  {/* ── Navbar niveaux (style CoursDistance navbar pills) ── */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}
                      className="cd-no-scroll">
                      {distanceCourses.map(lv => (
                        <button key={lv.id}
                          onClick={() => { setDistanceLevelId(lv.id); setDistanceMatId(null); }}
                          style={{
                            fontFamily: 'Syne,sans-serif',
                            fontWeight: 700,
                            fontSize: '.85rem',
                            padding: '9px 20px',
                            borderRadius: 50,
                            cursor: 'pointer',
                            border: '1.5px solid',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 7,
                            transition: 'all .25s cubic-bezier(.34,1.56,.64,1)',
                            ...(distanceLevelId === lv.id
                              ? {
                                  background: `linear-gradient(135deg,${lv.colorHex || '#d4a747'},#f4d677)`,
                                  color: '#0a1628',
                                  borderColor: 'transparent',
                                  boxShadow: `0 8px 22px -4px ${lv.colorHex || '#d4a747'}50`,
                                  transform: 'translateY(-2px)',
                                }
                              : {
                                  background: 'rgba(255,255,255,.04)',
                                  color: '#7c8fa8',
                                  borderColor: 'rgba(212,167,71,.1)',
                                }),
                          }}>
                          {lv.emoji && <span>{lv.emoji}</span>}
                          {lv.label}
                        </button>
                      ))}
                    </div>

                    {/* ── Sélecteur de matières ── */}
                    {activeLvl?.matieres && activeLvl.matieres.length > 1 && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
                        className="cd-no-scroll">
                        {activeLvl.matieres.map(m => (
                          <button key={m.id}
                            onClick={() => setDistanceMatId(m.id)}
                            className={`cd-mod-pill ${effMatId === m.id ? 'on' : 'idle'}`}
                            style={effMatId === m.id ? {
                              background: `linear-gradient(135deg,${m.color || activeLvl.colorHex || '#d4a747'},#f4d677)`,
                              boxShadow: `0 6px 20px -4px ${m.color || activeLvl.colorHex || '#d4a747'}55`,
                              border: '1px solid transparent',
                            } : {}}>
                            {m.icon && <span>{m.icon}</span>}
                            {m.nom}
                            <span style={{ fontSize: 10, opacity: .6 }}>
                              ({(m.modules || []).reduce((a, mo) => a + (mo.seances || []).length, 0)})
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── Contenu de la matière active (identique CoursDistance MatiereSection) ── */}
                  {activeLvl && activeMat ? (
                    <DistanceMatiereSection
                      key={`${distanceLevelId}-${activeMat.id}`}
                      mat={activeMat}
                      color={activeLvl.colorHex || '#d4a747'}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569', fontSize: '.9rem' }}>
                      Aucune matière pour ce niveau.
                    </div>
                  )}
                </>
              )}
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Modals présentiel ── */}
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

      {/* ── Modal distance manager ── */}
      {showDistanceManager && (
        <DistanceCourseManagerModal
          initialData={distanceCourses}
          onClose={() => setShowDistanceManager(false)}
          onSave={async (data) => {
            await saveNiveaux(data);   // laisse l’erreur remonter

            setDistanceCourses(data);
            if (data.length > 0) setDistanceLevelId(data[0].id);
            setDistanceMatId(null);
            setShowDistanceManager(false);
            await loadDistanceData();
          }}
        />
      )}
    </div>
  );
};

export default CoursesList;