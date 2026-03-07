// src/components/ProfessorsList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { professorAPI } from '../services/professorService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';

/* ─── Font injection ─── */
if (!document.getElementById('warriors-fonts')) {
  const link = document.createElement('link');
  link.id = 'warriors-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap';
  document.head.appendChild(link);
}

/* ─── Static data ─── */
const SUBJECTS = ['Mathématiques','Physique-Chimie','SVT','Français','Anglais','Arabe','Histoire-Géographie','Philosophie','Économie','Comptabilité','Informatique','Leadership','Management','Marketing Digital','Design Graphique','UX/UI','Data Science','Machine Learning','Cybersécurité','Développement Web'];
const EXPERIENCE_LEVELS = ['Débutant (0-2 ans)','Intermédiaire (3-5 ans)','Confirmé (6-10 ans)','Senior (11-15 ans)','Expert (15+ ans)'];
const AVATARS = ['👨‍🏫','👩‍🏫','👨‍🔬','👩‍🔬','👨‍💻','👩‍💻','👨‍🎨','👩‍🎨','👨‍💼','👩‍💼'];
const DEFAULT_SPECIALTIES = ['Leadership & Management','Intelligence Artificielle','Cybersécurité','Design & Créativité','Entrepreneuriat','Communication & Marketing','Sciences','Langues','Mathématiques','Informatique'];

const SAMPLE = [
  { id:1, nom:'Benali', prenom:'Ahmed', fullName:'Dr. Ahmed Benali', email:'ahmed.benali@centrewarriors.fr', phoneNumber:'0612345678', specialite:'Leadership & Management', experienceLevel:'Expert (15+ ans)', matieres:['Leadership','Management','Stratégie'], diplome:'Doctorat - HEC Paris', bio:'20+ ans en stratégie d\'entreprise et formation de dirigeants.', disponibilite:'Disponible', salaire:8000, dateRecrutement:'2010-09-01', avatar:'👨‍🏫' },
  { id:2, nom:'El Amrani', prenom:'Sarah', fullName:'Dr. Sarah El Amrani', email:'sarah.elamrani@centrewarriors.fr', phoneNumber:'0623456789', specialite:'Intelligence Artificielle', experienceLevel:'Expert (15+ ans)', matieres:['Data Science','Machine Learning','Python','IA'], diplome:'PhD IA - MIT', bio:'Chercheuse renommée en IA et Machine Learning.', disponibilite:'Disponible', salaire:9000, dateRecrutement:'2012-01-15', avatar:'👩‍🔬' },
  { id:3, nom:'Tazi', prenom:'Youssef', fullName:'M. Youssef Tazi', email:'youssef.tazi@centrewarriors.fr', phoneNumber:'0634567890', specialite:'Cybersécurité', experienceLevel:'Confirmé (6-10 ans)', matieres:['Cybersécurité','Ethical Hacking','Cloud Security'], diplome:'Master Sécurité - ENSIAS', bio:'Expert en sécurité informatique.', disponibilite:'Partiellement disponible', salaire:7500, dateRecrutement:'2015-03-20', avatar:'👨‍💻' },
  { id:4, nom:'Mansouri', prenom:'Leila', fullName:'Dr. Leila Mansouri', email:'leila.mansouri@centrewarriors.fr', phoneNumber:'0645678901', specialite:'Design & Créativité', experienceLevel:'Senior (11-15 ans)', matieres:['Design Graphique','UX/UI','Branding'], diplome:'Master Design - ESAD', bio:'Directrice artistique primée.', disponibilite:'Disponible', salaire:7000, dateRecrutement:'2016-06-10', avatar:'👩‍🎨' },
];

/* ─── Shared CSS vars injected once ─── */
const style = document.createElement('style');
style.innerHTML = `
  :root {
    --gold: #c49630;
    --gold-light: #f0c84a;
    --gold-fade: rgba(196,150,48,0.1);
    --navy: #080f1e;
    --navy-card: rgba(10,18,35,0.8);
  }
  .warriors-font { font-family: 'Outfit', sans-serif; }
  .warriors-title { font-family: 'Sora', sans-serif; }
  .gold-gradient { background: linear-gradient(135deg, #c49630 0%, #f0c84a 60%, #c89a2e 100%); }
  .gold-text { background: linear-gradient(135deg, #c49630, #f0c84a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .card-hover { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
  .card-hover:hover { transform: translateY(-4px); border-color: rgba(196,150,48,0.4) !important; box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(196,150,48,0.15); }
  .btn-gold { background: linear-gradient(135deg, #c49630 0%, #f0c84a 100%); transition: all 0.2s; }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(196,150,48,0.35); }
  .input-warriors { background: rgba(255,255,255,0.04); border: 1px solid rgba(196,150,48,0.15); color: #e8eaf0; font-family: 'Outfit', sans-serif; transition: border-color 0.2s; }
  .input-warriors:focus { outline: none; border-color: rgba(196,150,48,0.55); box-shadow: 0 0 0 3px rgba(196,150,48,0.08); }
  .input-warriors::placeholder { color: rgba(148,163,184,0.4); }
  select.input-warriors option { background: #0d1c30; color: #e8eaf0; }
  .specialty-tag { background: rgba(196,150,48,0.1); border: 1px solid rgba(196,150,48,0.2); color: #f0c84a; font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 500; padding: 2px 9px; border-radius: 20px; }
  .scrollbar-warriors::-webkit-scrollbar { width: 4px; }
  .scrollbar-warriors::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
  .scrollbar-warriors::-webkit-scrollbar-thumb { background: rgba(196,150,48,0.2); border-radius: 4px; }
  @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .animate-in { animation: fadeInUp 0.35s ease forwards; }
  @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .shimmer { animation: shimmer 1.5s ease-in-out infinite; }
`;
if (!document.getElementById('warriors-style')) {
  style.id = 'warriors-style';
  document.head.appendChild(style);
}

/* ──────────────────────────────────────────────────────────── */
/*  SUB-COMPONENTS                                              */
/* ──────────────────────────────────────────────────────────── */

const AvailDot = ({ status }) => {
  const color = status === 'Disponible' ? '#22c55e' : status === 'Partiellement disponible' ? '#f59e0b' : '#ef4444';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span className="text-[11px] warriors-font" style={{ color: 'rgba(180,190,210,0.65)' }}>{status}</span>
    </span>
  );
};

const ProfessorCard = ({ professor, onDetails, onEdit, onDelete, index }) => {
  const name = professor.fullName || `${professor.prenom} ${professor.nom}`;
  return (
    <div
      className="card-hover animate-in rounded-2xl p-5 flex flex-col gap-4 cursor-default"
      style={{
        background: 'linear-gradient(145deg, rgba(13,24,44,0.95) 0%, rgba(8,15,30,0.9) 100%)',
        border: '1px solid rgba(196,150,48,0.12)',
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Top: avatar + name + status */}
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(196,150,48,0.25) 0%, rgba(240,200,74,0.15) 100%)',
              border: '1.5px solid rgba(196,150,48,0.3)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}>
            {professor.avatarType === 'photo' && professor.photoUrl
              ? <img src={professor.photoUrl} alt={name} className="w-full h-full object-cover" />
              : <span>{professor.avatarEmoji || professor.avatar || '👨‍🏫'}</span>
            }
          </div>
          {/* glow ring */}
          <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: '0 0 0 3px rgba(196,150,48,0.08)' }} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="warriors-title font-bold text-sm leading-tight truncate" style={{ color: '#e8eaf0' }}>{name}</h3>
          <p className="warriors-font text-[11px] mt-0.5 truncate" style={{ color: 'rgba(196,150,48,0.6)' }}>{professor.experienceLevel}</p>
          <div className="mt-2">
            <AvailDot status={professor.disponibilite} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,150,48,0.12), transparent)' }} />

      {/* Contact */}
      <div className="space-y-1.5">
        {[
          { icon: '✉', value: professor.email },
          { icon: '◌', value: professor.phoneNumber },
        ].map(({ icon, value }) => (
          <div key={icon} className="flex items-center gap-2">
            <span className="text-xs flex-shrink-0" style={{ color: 'rgba(196,150,48,0.5)' }}>{icon}</span>
            <span className="warriors-font text-[12px] truncate" style={{ color: 'rgba(180,190,210,0.55)' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Subjects */}
      <div className="flex flex-wrap gap-1.5">
        {(professor.matieres || []).slice(0, 3).map((m, i) => (
          <span key={i} className="specialty-tag">{m}</span>
        ))}
        {(professor.matieres || []).length > 3 && (
          <span className="specialty-tag">+{(professor.matieres || []).length - 3}</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onDetails(professor)}
          className="flex-1 py-2 rounded-xl text-[12px] font-semibold warriors-font transition-all duration-200"
          style={{
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.2)',
            color: '#60a5fa',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
        >Détails</button>

        <button
          onClick={() => onEdit(professor)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all duration-200 flex-shrink-0"
          style={{ background: 'rgba(196,150,48,0.1)', border: '1px solid rgba(196,150,48,0.2)', color: '#f0c84a' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,150,48,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(196,150,48,0.1)'}
        >✏</button>

        <button
          onClick={() => onDelete(professor)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all duration-200 flex-shrink-0"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
        >✕</button>
      </div>
    </div>
  );
};

/* ─── FORM MODAL ─── */
const FormModal = ({ professor, onSave, onClose, specialties, loading }) => {
  const isEdit = !!professor;
  const [formData, setFormData] = useState(() => professor ? {
    nom: professor.nom, prenom: professor.prenom, email: professor.email,
    phone: professor.phoneNumber, specialty: professor.specialite,
    experience: professor.experienceLevel, subjects: professor.matieres || [],
    diploma: professor.diplome, bio: professor.bio || '',
    availability: professor.disponibilite, salary: professor.salaire?.toString() || '',
    avatarType: professor.avatarType || 'emoji', avatarEmoji: professor.avatarEmoji || '👨‍🏫',
    photoUrl: professor.photoUrl || null,
  } : {
    nom:'', prenom:'', email:'', phone:'', specialty:'', experience:'',
    subjects:[], diploma:'', bio:'', availability:'Disponible', salary:'',
    avatarType:'emoji', avatarEmoji:'👨‍🏫', photoUrl:null,
  });
  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(professor?.photoUrl || null);
  const [activeSection, setActiveSection] = useState(0);

  const sections = ['Avatar', 'Identité', 'Compétences', 'Biographie'];

  const ch = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const toggleSubject = s => setFormData(p => ({
    ...p,
    subjects: p.subjects.includes(s) ? p.subjects.filter(x => x !== s) : [...p.subjects, s],
  }));

  const handlePhoto = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setErrors(p => ({ ...p, photo: 'Max 5MB' })); return; }
    if (!f.type.startsWith('image/')) { setErrors(p => ({ ...p, photo: 'Format invalide' })); return; }
    setPhotoFile(f);
    const r = new FileReader();
    r.onloadend = () => setPhotoPreview(r.result);
    r.readAsDataURL(f);
  };

  const validate = () => {
    const e = {};
    if (!formData.nom.trim()) e.nom = 'Requis';
    if (!formData.prenom.trim()) e.prenom = 'Requis';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Email invalide';
    if (!/^0[5-7][0-9]{8}$/.test(formData.phone)) e.phone = 'Format: 06XXXXXXXX';
    if (!formData.specialty) e.specialty = 'Requis';
    if (!formData.experience) e.experience = 'Requis';
    if (!formData.diploma.trim()) e.diploma = 'Requis';
    if (!formData.salary.trim()) e.salary = 'Requis';
    if (formData.subjects.length === 0) e.subjects = 'Au moins une matière';
    if (formData.avatarType === 'photo' && !photoFile && !formData.photoUrl) e.photo = 'Photo requise';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...formData, nom: formData.nom.trim(), prenom: formData.prenom.trim(), avatarEmoji: formData.avatarType === 'emoji' ? formData.avatarEmoji : null, photoUrl: formData.avatarType === 'photo' ? formData.photoUrl : null }, photoFile);
  };

  const inputClass = (name) =>
    `input-warriors w-full px-4 py-3 rounded-xl text-sm warriors-font ${errors[name] ? 'border-red-500/50' : ''}`;

  const sectionContent = [
    /* 0 - Avatar */
    <div key="avatar" className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {[['emoji','😊','Emoji Avatar'],['photo','📸','Photo Perso']].map(([type, icon, label]) => (
          <button key={type} type="button"
            onClick={() => setFormData(p => ({ ...p, avatarType: type }))}
            className="p-5 rounded-2xl text-center transition-all duration-200 space-y-2"
            style={{
              background: formData.avatarType === type ? 'rgba(196,150,48,0.12)' : 'rgba(255,255,255,0.02)',
              border: `2px solid ${formData.avatarType === type ? 'rgba(196,150,48,0.5)' : 'rgba(196,150,48,0.1)'}`,
              boxShadow: formData.avatarType === type ? '0 0 20px rgba(196,150,48,0.1)' : 'none',
            }}>
            <div className="text-4xl">{icon}</div>
            <div className="warriors-title text-sm font-semibold" style={{ color: formData.avatarType === type ? '#f0c84a' : 'rgba(180,190,210,0.55)' }}>{label}</div>
          </button>
        ))}
      </div>

      {formData.avatarType === 'emoji' && (
        <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
          <p className="text-[11px] font-semibold tracking-widest warriors-font" style={{ color: 'rgba(196,150,48,0.45)' }}>CHOISIR UN EMOJI</p>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map(av => (
              <button key={av} type="button" onClick={() => setFormData(p => ({ ...p, avatarEmoji: av }))}
                className="w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: formData.avatarEmoji === av ? 'linear-gradient(135deg, #c49630, #f0c84a)' : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${formData.avatarEmoji === av ? '#c49630' : 'transparent'}`,
                  transform: formData.avatarEmoji === av ? 'scale(1.12)' : 'scale(1)',
                  boxShadow: formData.avatarEmoji === av ? '0 4px 12px rgba(196,150,48,0.3)' : 'none',
                }}>{av}</button>
            ))}
          </div>
        </div>
      )}

      {formData.avatarType === 'photo' && (
        <div>
          {errors.photo && <p className="text-red-400 text-xs warriors-font mb-2">{errors.photo}</p>}
          {!photoPreview ? (
            <label htmlFor="photo-upload"
              className="flex flex-col items-center justify-center gap-3 p-10 rounded-2xl cursor-pointer transition-all duration-200"
              style={{ border: `2px dashed ${errors.photo ? 'rgba(239,68,68,0.5)' : 'rgba(196,150,48,0.2)'}`, background: 'rgba(255,255,255,0.02)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,150,48,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
              <span className="text-5xl">📸</span>
              <span className="warriors-font text-sm font-medium" style={{ color: 'rgba(180,190,210,0.5)' }}>Cliquer pour télécharger</span>
              <span className="warriors-font text-xs" style={{ color: 'rgba(130,145,170,0.4)' }}>JPG · PNG · WebP — max 5MB</span>
              <input type="file" id="photo-upload" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
          ) : (
            <div className="flex items-center gap-5 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.15)' }}>
              <img src={photoPreview} alt="Aperçu" className="w-20 h-20 object-cover rounded-2xl" style={{ border: '2px solid rgba(196,150,48,0.4)' }} />
              <div className="flex gap-2">
                <label htmlFor="photo-upload" className="px-3 py-2 rounded-xl text-xs font-medium warriors-font cursor-pointer transition-all"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>Changer</label>
                <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                  className="px-3 py-2 rounded-xl text-xs font-medium warriors-font transition-all"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>Supprimer</button>
              </div>
              <input type="file" id="photo-upload" accept="image/*" onChange={handlePhoto} className="hidden" />
            </div>
          )}
        </div>
      )}
    </div>,

    /* 1 - Identité */
    <div key="identity" className="grid grid-cols-2 gap-4">
      {[
        { name:'nom', label:'NOM', col:1 },
        { name:'prenom', label:'PRÉNOM', col:1 },
        { name:'email', label:'EMAIL', col:2, type:'email' },
        { name:'phone', label:'TÉLÉPHONE', col:1, ph:'06XXXXXXXX' },
        { name:'salary', label:'SALAIRE (MAD)', col:1, type:'number', ph:'7500' },
        { name:'availability', label:'DISPONIBILITÉ', col:2, isSelect:true },
      ].map(({ name, label, col, type='text', ph, isSelect }) => (
        <div key={name} className={col === 2 ? 'col-span-2' : ''}>
          <label className="block text-[10px] font-semibold tracking-[0.12em] warriors-font mb-2" style={{ color: 'rgba(196,150,48,0.45)' }}>{label}</label>
          {isSelect ? (
            <select name={name} value={formData[name]} onChange={ch} className={inputClass(name)} style={{ cursor:'pointer' }}>
              <option value="Disponible">Disponible</option>
              <option value="Partiellement disponible">Partiellement disponible</option>
              <option value="Non disponible">Non disponible</option>
            </select>
          ) : (
            <input type={type} name={name} value={formData[name]} onChange={ch} placeholder={ph}
              className={inputClass(name)} />
          )}
          {errors[name] && <p className="mt-1 text-red-400 text-[11px] warriors-font">{errors[name]}</p>}
        </div>
      ))}
    </div>,

    /* 2 - Compétences */
    <div key="skills" className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {[
          { name:'specialty', label:'SPÉCIALITÉ', options: specialties },
          { name:'experience', label:'EXPÉRIENCE', options: EXPERIENCE_LEVELS },
        ].map(({ name, label, options }) => (
          <div key={name}>
            <label className="block text-[10px] font-semibold tracking-[0.12em] warriors-font mb-2" style={{ color: 'rgba(196,150,48,0.45)' }}>{label}</label>
            <select name={name} value={formData[name]} onChange={ch} className={inputClass(name)} style={{ cursor:'pointer' }}>
              <option value="">Sélectionner...</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {errors[name] && <p className="mt-1 text-red-400 text-[11px] warriors-font">{errors[name]}</p>}
          </div>
        ))}
        <div className="col-span-2">
          <label className="block text-[10px] font-semibold tracking-[0.12em] warriors-font mb-2" style={{ color: 'rgba(196,150,48,0.45)' }}>DIPLÔME</label>
          <input type="text" name="diploma" value={formData.diploma} onChange={ch} placeholder="ex: Master en IA — ENSIAS" className={inputClass('diploma')} />
          {errors.diploma && <p className="mt-1 text-red-400 text-[11px] warriors-font">{errors.diploma}</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-semibold tracking-[0.12em] warriors-font" style={{ color: 'rgba(196,150,48,0.45)' }}>MATIÈRES ENSEIGNÉES</label>
          <span className="text-[10px] warriors-font" style={{ color: 'rgba(196,150,48,0.4)' }}>{formData.subjects.length} sélectionnées</span>
        </div>
        {errors.subjects && <p className="mb-2 text-red-400 text-[11px] warriors-font">{errors.subjects}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 rounded-2xl scrollbar-warriors overflow-y-auto max-h-48"
          style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${errors.subjects ? 'rgba(239,68,68,0.3)' : 'rgba(196,150,48,0.1)'}` }}>
          {SUBJECTS.map(s => {
            const sel = formData.subjects.includes(s);
            return (
              <button key={s} type="button" onClick={() => toggleSubject(s)}
                className="py-2 px-3 rounded-xl text-[11.5px] warriors-font font-medium transition-all duration-150 text-left"
                style={{
                  background: sel ? 'linear-gradient(135deg, #c49630, #f0c84a)' : 'rgba(255,255,255,0.04)',
                  color: sel ? '#0a1628' : 'rgba(180,190,210,0.55)',
                  border: sel ? 'none' : '1px solid rgba(196,150,48,0.1)',
                  fontWeight: sel ? 700 : 400,
                }}>{s}</button>
            );
          })}
        </div>
      </div>
    </div>,

    /* 3 - Biographie */
    <div key="bio" className="space-y-4">
      <div>
        <label className="block text-[10px] font-semibold tracking-[0.12em] warriors-font mb-2" style={{ color: 'rgba(196,150,48,0.45)' }}>BIOGRAPHIE</label>
        <textarea name="bio" value={formData.bio} onChange={ch} rows={6}
          placeholder="Présentez le parcours et l'expertise du professeur..."
          className="input-warriors w-full px-4 py-3 rounded-xl text-sm warriors-font resize-none" />
      </div>
      {/* Preview */}
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
        <p className="text-[10px] tracking-widest warriors-font mb-3" style={{ color: 'rgba(196,150,48,0.4)' }}>APERÇU</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(196,150,48,0.2), rgba(240,200,74,0.1))', border: '1px solid rgba(196,150,48,0.25)' }}>
            {formData.avatarType === 'photo' && photoPreview
              ? <img src={photoPreview} alt="" className="w-full h-full object-cover rounded-xl" />
              : <span>{formData.avatarEmoji}</span>
            }
          </div>
          <div>
            <p className="warriors-title text-sm font-bold" style={{ color: '#e8eaf0' }}>
              {formData.prenom || 'Prénom'} {formData.nom || 'Nom'}
            </p>
            <p className="warriors-font text-xs" style={{ color: 'rgba(196,150,48,0.55)' }}>{formData.specialty || 'Spécialité'}</p>
          </div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,9,20,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl animate-in"
        style={{ background: 'linear-gradient(145deg, #0d1c30 0%, #080f1e 100%)', border: '1px solid rgba(196,150,48,0.2)', boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(196,150,48,0.1)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(196,150,48,0.1)', background: 'rgba(196,150,48,0.03)' }}>
          <div>
            <h2 className="warriors-title text-lg font-bold" style={{ color: '#f0c84a' }}>
              {isEdit ? 'Modifier le profil' : 'Nouveau professeur'}
            </h2>
            <p className="warriors-font text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.45)' }}>
              Étape {activeSection + 1} sur {sections.length} — {sections[activeSection]}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 warriors-font"
            style={{ border: '1px solid rgba(196,150,48,0.15)', color: 'rgba(148,163,184,0.5)', background: 'rgba(255,255,255,0.02)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,150,48,0.1)'; e.currentTarget.style.color = '#f0c84a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = 'rgba(148,163,184,0.5)'; }}>
            ✕
          </button>
        </div>

        {/* Stepper */}
        <div className="flex px-7 pt-5 gap-2 flex-shrink-0">
          {sections.map((s, i) => (
            <button key={s} type="button" onClick={() => setActiveSection(i)}
              className="flex-1 flex flex-col items-center gap-1.5 group">
              <div className="w-full h-1 rounded-full transition-all duration-300"
                style={{ background: i <= activeSection ? 'linear-gradient(90deg, #c49630, #f0c84a)' : 'rgba(196,150,48,0.1)' }} />
              <span className="warriors-font text-[10px] font-medium transition-colors duration-200"
                style={{ color: i === activeSection ? '#f0c84a' : 'rgba(148,163,184,0.35)' }}>{s}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-warriors px-7 py-6">
            {sectionContent[activeSection]}
          </div>

          {/* Footer */}
          <div className="px-7 py-5 flex gap-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(196,150,48,0.1)', background: 'rgba(196,150,48,0.02)' }}>
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
                style={{ color: '#0a1628' }}>
                Suivant →
              </button>
            ) : (
              <button type="submit" disabled={loading}
                className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title btn-gold disabled:opacity-50"
                style={{ color: '#0a1628' }}>
                {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Ajouter le professeur'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── DELETE MODAL ─── */
const DeleteModal = ({ professor, onConfirm, onClose, loading }) => {
  if (!professor) return null;
  const name = professor.fullName || `${professor.prenom} ${professor.nom}`;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,9,20,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden animate-in"
        style={{ background: 'linear-gradient(145deg, #0d1c30, #080f1e)', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div className="px-7 py-5" style={{ background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(239,68,68,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)' }}>⚠</div>
            <div>
              <h3 className="warriors-title font-bold text-base" style={{ color: '#f87171' }}>Supprimer ce professeur ?</h3>
              <p className="warriors-font text-[11px] mt-0.5" style={{ color: 'rgba(148,163,184,0.45)' }}>Action irréversible</p>
            </div>
          </div>
        </div>
        <div className="p-7 space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
            <span className="text-3xl">{professor.avatarEmoji || professor.avatar || '👨‍🏫'}</span>
            <div>
              <p className="warriors-title font-bold text-sm" style={{ color: '#e8eaf0' }}>{name}</p>
              <p className="warriors-font text-xs mt-0.5" style={{ color: 'rgba(196,150,48,0.5)' }}>{professor.specialite}</p>
            </div>
          </div>
          <p className="warriors-font text-xs" style={{ color: 'rgba(248,113,113,0.65)' }}>
            Toutes les données de ce professeur seront définitivement supprimées de la base.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold warriors-font transition-all duration-200"
              style={{ border: '1px solid rgba(196,150,48,0.15)', color: 'rgba(180,190,210,0.55)', background: 'rgba(255,255,255,0.02)' }}>
              Annuler
            </button>
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #b91c1c, #ef4444)', color: '#fff' }}>
              {loading ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── DETAILS MODAL ─── */
const DetailsModal = ({ professor, onClose, onEdit }) => {
  if (!professor) return null;
  const name = professor.fullName || `${professor.prenom} ${professor.nom}`;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,9,20,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden animate-in"
        style={{ background: 'linear-gradient(145deg, #0d1c30, #080f1e)', border: '1px solid rgba(196,150,48,0.15)', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>

        {/* Header */}
        <div className="px-7 py-5 flex-shrink-0 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(196,150,48,0.1)', background: 'rgba(196,150,48,0.03)' }}>
          <h2 className="warriors-title text-lg font-bold" style={{ color: '#f0c84a' }}>Profil du professeur</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ border: '1px solid rgba(196,150,48,0.15)', color: 'rgba(148,163,184,0.5)', background: 'rgba(255,255,255,0.02)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,150,48,0.1)'; e.currentTarget.style.color = '#f0c84a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = 'rgba(148,163,184,0.5)'; }}>
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-warriors p-7 space-y-5">
          {/* Hero */}
          <div className="relative p-6 rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(196,150,48,0.12) 0%, rgba(240,200,74,0.04) 100%)', border: '1px solid rgba(196,150,48,0.2)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5"
              style={{ background: 'radial-gradient(circle, #f0c84a, transparent)', transform: 'translate(30%, -30%)' }} />
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl overflow-hidden flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(196,150,48,0.3), rgba(240,200,74,0.15))', border: '2px solid rgba(196,150,48,0.4)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                {professor.avatarType === 'photo' && professor.photoUrl
                  ? <img src={professor.photoUrl} alt={name} className="w-full h-full object-cover" />
                  : <span>{professor.avatarEmoji || professor.avatar || '👨‍🏫'}</span>
                }
              </div>
              <div className="flex-1">
                <h3 className="warriors-title text-xl font-black" style={{ color: '#e8eaf0' }}>{name}</h3>
                <p className="warriors-font text-sm mt-1" style={{ color: 'rgba(196,150,48,0.65)' }}>{professor.specialite}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <AvailDot status={professor.disponibilite} />
                  <span className="text-[11px] warriors-font px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>{professor.experienceLevel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon:'✉', label:'EMAIL', value: professor.email },
              { icon:'◌', label:'TÉLÉPHONE', value: professor.phoneNumber },
              { icon:'🎓', label:'DIPLÔME', value: professor.diplome },
              { icon:'◆', label:'SALAIRE', value: `${professor.salaire?.toLocaleString('fr-FR')} MAD` },
              { icon:'📅', label:'RECRUTEMENT', value: new Date(professor.dateRecrutement).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }) },
            ].map(({ icon, label, value }) => (
              <div key={label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs" style={{ color: 'rgba(196,150,48,0.45)' }}>{icon}</span>
                  <span className="warriors-font text-[9px] font-semibold tracking-[0.15em]" style={{ color: 'rgba(196,150,48,0.35)' }}>{label}</span>
                </div>
                <p className="warriors-font text-xs font-medium" style={{ color: '#c8d0e0' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Subjects */}
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
            <p className="warriors-font text-[9px] font-semibold tracking-[0.15em] mb-3" style={{ color: 'rgba(196,150,48,0.35)' }}>MATIÈRES ENSEIGNÉES</p>
            <div className="flex flex-wrap gap-1.5">
              {(professor.matieres || []).map((m, i) => <span key={i} className="specialty-tag">{m}</span>)}
            </div>
          </div>

          {/* Bio */}
          {professor.bio && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
              <p className="warriors-font text-[9px] font-semibold tracking-[0.15em] mb-3" style={{ color: 'rgba(196,150,48,0.35)' }}>BIOGRAPHIE</p>
              <p className="warriors-font text-sm leading-relaxed" style={{ color: 'rgba(180,190,210,0.6)' }}>{professor.bio}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-5 flex gap-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(196,150,48,0.1)', background: 'rgba(196,150,48,0.02)' }}>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold warriors-font transition-all duration-200"
            style={{ border: '1px solid rgba(196,150,48,0.15)', color: 'rgba(180,190,210,0.55)', background: 'rgba(255,255,255,0.02)' }}>
            Fermer
          </button>
          <button onClick={onEdit}
            className="flex-1 py-3 rounded-xl text-sm font-bold warriors-title btn-gold"
            style={{ color: '#0a1628' }}>
            Modifier le profil
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                    */
/* ══════════════════════════════════════════════════════════════ */
const ProfessorsList = () => {
  const navigate = useNavigate();
  const [professors, setProfessors] = useState([]);
  const [filteredProfessors, setFilteredProfessors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [stats, setStats] = useState({ totalProfessors: 0 });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentProfessor, setCurrentProfessor] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) { navigate('/login'); return; }
    loadProfessors();
    loadOptions();
  }, [navigate]);

  useEffect(() => { filterProfessors(); }, [selectedSpecialty, searchQuery, professors]);

  const loadProfessors = async () => {
    try {
      setLoading(true); setError('');
      const res = await professorAPI.getAllProfessors({ specialite: selectedSpecialty === 'all' ? '' : selectedSpecialty, search: searchQuery });
      if (res.success) setProfessors(res.data);
      else { setError(res.message || 'Erreur de chargement'); setProfessors(SAMPLE); }
    } catch { setError('Erreur de connexion'); setProfessors(SAMPLE); }
    finally { setLoading(false); }
  };

  const loadOptions = async () => {
    try {
      const [sRes, spRes] = await Promise.all([professorAPI.getStats(), professorAPI.getSpecialites()]);
      if (sRes.success) setStats(sRes.data);
      if (spRes.success) setSpecialties(spRes.data || []);
    } catch { setSpecialties(DEFAULT_SPECIALTIES); }
  };

  const filterProfessors = () => {
    let f = professors;
    if (selectedSpecialty !== 'all') f = f.filter(p => p.specialite === selectedSpecialty);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      f = f.filter(p =>
        (p.fullName || `${p.prenom} ${p.nom}`).toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) || p.phoneNumber.includes(searchQuery) ||
        p.specialite.toLowerCase().includes(q) || (p.matieres || []).some(m => m.toLowerCase().includes(q))
      );
    }
    setFilteredProfessors(f);
  };

  const handleAdd = async (data, photoFile) => {
    try {
      setLoading(true);
      const res = await professorAPI.createProfessor({ nom:data.nom, prenom:data.prenom, email:data.email, phoneNumber:data.phone, specialite:data.specialty, experienceLevel:data.experience, matieres:data.subjects, diplome:data.diploma, bio:data.bio, disponibilite:data.availability, salaire:data.salary, avatarType:data.avatarType, avatarEmoji:data.avatarEmoji, photoUrl:data.photoUrl }, photoFile);
      if (res.success) { setProfessors(p => [...p, res.data]); setShowAddModal(false); await loadOptions(); }
      else alert(res.message || 'Erreur');
    } catch { alert('Erreur lors de l\'ajout'); } finally { setLoading(false); }
  };

  const handleEdit = async (data, photoFile) => {
    try {
      setLoading(true);
      const res = await professorAPI.updateProfessor(currentProfessor.id, { nom:data.nom, prenom:data.prenom, email:data.email, phoneNumber:data.phone, specialite:data.specialty, experienceLevel:data.experience, matieres:data.subjects, diplome:data.diploma, bio:data.bio, disponibilite:data.availability, salaire:data.salary, avatarType:data.avatarType, avatarEmoji:data.avatarEmoji, photoUrl:data.photoUrl }, photoFile);
      if (res.success) { setProfessors(p => p.map(x => x.id === currentProfessor.id ? res.data : x)); setShowEditModal(false); setCurrentProfessor(null); }
      else alert(res.message || 'Erreur');
    } catch { alert('Erreur de modification'); } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await professorAPI.deleteProfessor(currentProfessor.id);
      if (res.success) { setProfessors(p => p.filter(x => x.id !== currentProfessor.id)); setShowDeleteModal(false); setCurrentProfessor(null); await loadOptions(); }
      else alert(res.message || 'Erreur');
    } catch { alert('Erreur de suppression'); } finally { setLoading(false); }
  };

  const grouped = filteredProfessors.reduce((acc, p) => {
    if (!acc[p.specialite]) acc[p.specialite] = [];
    acc[p.specialite].push(p);
    return acc;
  }, {});

  const sidebarW = sidebarCollapsed ? 72 : 240;

  const statCards = [
    { label: 'Professeurs', value: stats.totalProfessors || professors.length, color: '#f0c84a', bg: 'rgba(196,150,48,0.08)', border: 'rgba(196,150,48,0.15)', icon: '✦' },
    { label: 'Disponibles', value: professors.filter(p => p.disponibilite === 'Disponible').length, color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.15)', icon: '◎' },
    { label: 'Spécialités', value: Object.keys(grouped).length, color: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', icon: '◆' },
  ];

  return (
    <div className="min-h-screen warriors-font" style={{ background: 'linear-gradient(145deg, #080f1e 0%, #060c18 100%)' }}>
      {/* Ambient bg orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute rounded-full" style={{ width:'700px', height:'700px', background:'radial-gradient(circle, rgba(196,150,48,0.04) 0%, transparent 70%)', top:'-15%', left:'-10%', filter:'blur(40px)' }} />
        <div className="absolute rounded-full" style={{ width:'500px', height:'500px', background:'radial-gradient(circle, rgba(29,78,216,0.05) 0%, transparent 70%)', bottom:'-10%', right:'-5%', filter:'blur(40px)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0" style={{ backgroundImage:'linear-gradient(rgba(196,150,48,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(196,150,48,0.03) 1px, transparent 1px)', backgroundSize:'60px 60px' }} />
      </div>

      <Sidebar activeItem="professors" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <main className="relative z-10 transition-all duration-300" style={{ marginLeft: `${sidebarW}px` }}>

        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-[72px]"
          style={{ background: 'rgba(6,12,24,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(196,150,48,0.08)', boxShadow: '0 1px 0 rgba(196,150,48,0.05)' }}>
          <div className="flex items-center gap-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="warriors-font text-xs" style={{ color: 'rgba(148,163,184,0.35)' }}>Admin</span>
              <span style={{ color: 'rgba(196,150,48,0.25)' }}>›</span>
              <span className="warriors-title text-sm font-semibold" style={{ color: '#f0c84a' }}>Professeurs</span>
            </div>
          </div>

          {/* Stat pills */}
          <div className="flex items-center gap-2">
            {statCards.map(({ label, value, color, bg, border, icon }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: bg, border: `1px solid ${border}` }}>
                <span className="text-[11px]" style={{ color }}>{icon}</span>
                <span className="warriors-title text-sm font-bold" style={{ color }}>{value}</span>
                <span className="warriors-font text-[10px] font-medium tracking-wide" style={{ color: 'rgba(148,163,184,0.4)' }}>{label.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Page content */}
        <div className="px-8 py-7 space-y-6">

          {/* Page title */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="warriors-title text-3xl font-black" style={{ color: '#e8eaf0' }}>
                Gestion des <span className="gold-text">Professeurs</span>
              </h1>
              <p className="warriors-font text-sm mt-1" style={{ color: 'rgba(148,163,184,0.4)' }}>
                {filteredProfessors.length} résultat{filteredProfessors.length !== 1 ? 's' : ''} · {Object.keys(grouped).length} spécialité{Object.keys(grouped).length !== 1 ? 's' : ''}
              </p>
            </div>
            <button onClick={() => setShowAddModal(true)} disabled={loading}
              className="btn-gold flex items-center gap-2.5 px-5 py-3 rounded-2xl warriors-title text-sm font-bold disabled:opacity-50"
              style={{ color: '#0a1628', boxShadow: '0 4px 20px rgba(196,150,48,0.25)' }}>
              <span className="text-base font-black">+</span>
              Ajouter un professeur
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
          <div className="flex items-center gap-4 p-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.1)' }}>
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(196,150,48,0.4)' }}>⊕</span>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher un professeur..."
                className="input-warriors w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            {/* Specialty select */}
            <select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)}
              className="input-warriors px-4 py-2.5 rounded-xl text-sm" style={{ cursor:'pointer', minWidth: '200px' }}>
              <option value="all">Toutes les spécialités</option>
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {(searchQuery || selectedSpecialty !== 'all') && (
              <button onClick={() => { setSearchQuery(''); setSelectedSpecialty('all'); }}
                className="px-4 py-2.5 rounded-xl text-xs warriors-font font-medium transition-all"
                style={{ color: 'rgba(196,150,48,0.6)', border: '1px solid rgba(196,150,48,0.15)', background: 'rgba(196,150,48,0.05)' }}>
                Réinitialiser
              </button>
            )}
          </div>

          {/* Content */}
          {loading && professors.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196,150,48,0.08)' }}>
                  <div className="flex gap-3">
                    <div className="w-14 h-14 rounded-2xl shimmer" style={{ background: 'rgba(196,150,48,0.07)' }} />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 rounded-full shimmer" style={{ background: 'rgba(196,150,48,0.07)', width:'70%' }} />
                      <div className="h-2.5 rounded-full shimmer" style={{ background: 'rgba(196,150,48,0.05)', width:'50%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 rounded-full shimmer" style={{ background: 'rgba(255,255,255,0.04)' }} />
                    <div className="h-2.5 rounded-full shimmer" style={{ background: 'rgba(255,255,255,0.03)', width:'80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProfessors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl animate-in"
              style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(196,150,48,0.08)' }}>
              <span className="text-6xl mb-4 opacity-30">🔍</span>
              <p className="warriors-title font-bold text-lg" style={{ color: 'rgba(232,234,240,0.3)' }}>Aucun résultat</p>
              <p className="warriors-font text-sm mt-2" style={{ color: 'rgba(148,163,184,0.3)' }}>Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped).map(([specialty, group], gi) => (
                <div key={specialty} className="animate-in" style={{ animationDelay: `${gi * 80}ms` }}>
                  {/* Group header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #c49630, #f0c84a)' }} />
                      <h2 className="warriors-title text-base font-bold" style={{ color: '#c8a84a' }}>{specialty}</h2>
                      <span className="warriors-font text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(196,150,48,0.1)', border: '1px solid rgba(196,150,48,0.18)', color: 'rgba(196,150,48,0.6)' }}>
                        {group.length}
                      </span>
                    </div>
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(196,150,48,0.1), transparent)' }} />
                  </div>

                  {/* Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {group.map((prof, idx) => (
                      <ProfessorCard
                        key={prof.id}
                        professor={prof}
                        index={idx}
                        onDetails={p => { setCurrentProfessor(p); setShowDetailsModal(true); }}
                        onEdit={p => { setCurrentProfessor(p); setShowEditModal(true); }}
                        onDelete={p => { setCurrentProfessor(p); setShowDeleteModal(true); }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {(showAddModal || showEditModal) && (
        <FormModal
          professor={showEditModal ? currentProfessor : null}
          onSave={showEditModal ? handleEdit : handleAdd}
          onClose={() => { setShowAddModal(false); setShowEditModal(false); setCurrentProfessor(null); }}
          specialties={specialties} loading={loading}
        />
      )}
      {showDetailsModal && (
        <DetailsModal
          professor={currentProfessor}
          onClose={() => { setShowDetailsModal(false); setCurrentProfessor(null); }}
          onEdit={() => { setShowDetailsModal(false); setShowEditModal(true); }}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          professor={currentProfessor}
          onConfirm={handleDelete}
          onClose={() => { setShowDeleteModal(false); setCurrentProfessor(null); }}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ProfessorsList;