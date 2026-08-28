// src/components/ProfessorsList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { professorAPI } from '../services/professorService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';
import {
  Mail, Phone, GraduationCap, Wallet, Calendar, BookOpen, Users,
  Pencil, Trash2, X, AlertTriangle, LayoutGrid, List, Plus, Check,
  ChevronLeft, ChevronRight, Search, RotateCcw, Camera, Smile,
  Sparkles, Eye, Circle,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════ */
/*  DESIGN TOKENS — shared with StudentsList, injected once      */
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

/* ─── Static data (unchanged) ─── */
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

// Flat, muted avatar palette shared with StudentsList
const AVATAR_COLORS = ['#8B93E8', '#C9A24D', '#5CADC2', '#D18BA0', '#5FAE83', '#C97A6B'];
const getAvatarColor = (id) => AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];

const STATUS_STYLE = {
  'Disponible':               { color: 'var(--sv-success)', soft: 'var(--sv-success-soft)', border: 'var(--sv-success-border)' },
  'Partiellement disponible': { color: 'var(--sv-warning)', soft: 'var(--sv-warning-soft)', border: 'var(--sv-warning-border)' },
  'Non disponible':           { color: 'var(--sv-danger)',  soft: 'var(--sv-danger-soft)',  border: 'var(--sv-danger-border)' },
};

const AvailDot = ({ status }) => {
  const st = STATUS_STYLE[status] || STATUS_STYLE['Non disponible'];
  return (
    <span className="inline-flex items-center gap-1.5">
      <Circle size={7} fill={st.color} strokeWidth={0} />
      <span className="text-[11.5px]" style={{ color: 'var(--sv-text-dim)' }}>{status}</span>
    </span>
  );
};

/* Person avatar — photo or emoji, flat consistent frame (feature preserved, visuals redesigned) */
const PersonAvatar = ({ professor, size = 56, textSize = 24 }) => {
  const c = getAvatarColor(professor?.id || 0);
  return (
    <div
      className="rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{ width: size, height: size, background: `${c}1E`, border: `1px solid ${c}40` }}
    >
      {professor?.avatarType === 'photo' && professor?.photoUrl ? (
        <img src={professor.photoUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span style={{ fontSize: textSize }}>{professor?.avatarEmoji || professor?.avatar || '👨‍🏫'}</span>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  PROFESSOR CARD (Grid view)                                   */
/* ══════════════════════════════════════════════════════════════ */
const ProfessorCard = ({ professor, onDetails, onEdit, onDelete, index }) => {
  const name = professor.fullName || `${professor.prenom} ${professor.nom}`;
  const matieres = professor.matieres || [];
  return (
    <div className="sv-card sv-in flex flex-col gap-3.5 p-4" style={{ animationDelay: `${index * 30}ms` }}>
      <div className="flex items-start gap-3">
        <PersonAvatar professor={professor} size={52} textSize={22} />
        <div className="flex-1 min-w-0">
          <h3 className="sv-heading font-semibold text-[13.5px] leading-snug truncate" style={{ color: 'var(--sv-text)' }}>{name}</h3>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--sv-accent)' }}>{professor.experienceLevel}</p>
          <div className="mt-1.5"><AvailDot status={professor.disponibilite} /></div>
        </div>
        {professor.revenuMensuelEstime != null && (
          <div className="text-right flex-shrink-0">
            <p className="sv-heading text-[13.5px] font-bold" style={{ color: 'var(--sv-accent)' }}>{professor.revenuMensuelEstime.toLocaleString('fr-FR')}</p>
            <p className="text-[9.5px]" style={{ color: 'var(--sv-text-faint)' }}>MAD/mois</p>
          </div>
        )}
      </div>

      <div className="h-px" style={{ background: 'var(--sv-border)' }} />

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Mail size={13} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)', flexShrink: 0 }} />
          <span className="text-[12px] truncate" style={{ color: 'var(--sv-text-dim)' }}>{professor.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={13} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)', flexShrink: 0 }} />
          <span className="text-[12px] truncate" style={{ color: 'var(--sv-text-dim)' }}>{professor.phoneNumber}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {matieres.slice(0, 3).map((m, i) => (
          <span key={i} className="sv-tag" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)', color: 'var(--sv-accent)' }}>{m}</span>
        ))}
        {matieres.length > 3 && (
          <span className="sv-tag" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--sv-border)', color: 'var(--sv-text-faint)' }}>+{matieres.length - 3}</span>
        )}
      </div>

      <div className="flex gap-2 mt-auto pt-3" style={{ borderTop: '1px solid var(--sv-border)' }}>
        <button onClick={() => onDetails(professor)} className="sv-btn sv-btn-info flex-1 py-2">
          <Eye size={13} strokeWidth={1.75} /> Détails
        </button>
        <button onClick={() => onEdit(professor)} className="sv-icon-btn"><Pencil size={13} strokeWidth={1.75} /></button>
        <button onClick={() => onDelete(professor)} className="sv-icon-btn danger"><Trash2 size={13} strokeWidth={1.75} /></button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  TABLE VIEW                                                   */
/* ══════════════════════════════════════════════════════════════ */
const TableView = ({ grouped, onDetails, onEdit, onDelete }) => (
  <div className="space-y-4">
    {Object.entries(grouped).map(([specialty, group], gi) => (
      <div key={specialty} className="sv-card sv-in overflow-hidden" style={{ animationDelay: `${gi * 40}ms` }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-4 rounded-full" style={{ background: 'var(--sv-accent)' }} />
            <h2 className="sv-heading text-[13.5px] font-semibold" style={{ color: 'var(--sv-text)' }}>{specialty}</h2>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--sv-text-faint)' }}>
            {group.length} professeur{group.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="overflow-x-auto sv-scroll">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--sv-border)' }}>
                {['Professeur', 'Contact', 'Expérience', 'Disponibilité', 'Matières', 'Revenu/mois', ''].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-[10.5px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.map((professor) => {
                const name = professor.fullName || `${professor.prenom} ${professor.nom}`;
                const matieres = professor.matieres || [];
                return (
                  <tr key={professor.id} className="sv-row" style={{ borderBottom: '1px solid var(--sv-border)' }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <PersonAvatar professor={professor} size={34} textSize={16} />
                        <p className="text-[13px] font-medium" style={{ color: 'var(--sv-text)' }}>{name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[12px]" style={{ color: 'var(--sv-text-dim)' }}>{professor.email}</p>
                      <p className="text-[11.5px]" style={{ color: 'var(--sv-text-faint)' }}>{professor.phoneNumber}</p>
                    </td>
                    <td className="px-5 py-3"><span className="text-[12.5px]" style={{ color: 'var(--sv-text-dim)' }}>{professor.experienceLevel}</span></td>
                    <td className="px-5 py-3"><AvailDot status={professor.disponibilite} /></td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {matieres.slice(0, 2).map((m, i) => (
                          <span key={i} className="sv-tag" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)', color: 'var(--sv-accent)' }}>{m}</span>
                        ))}
                        {matieres.length > 2 && (
                          <span className="sv-tag" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--sv-border)', color: 'var(--sv-text-faint)' }}>+{matieres.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[13px] font-semibold" style={{ color: 'var(--sv-accent)' }}>
                        {professor.revenuMensuelEstime != null ? `${professor.revenuMensuelEstime.toLocaleString('fr-FR')} MAD` : '—'}
                      </span>
                      <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{professor.tarifs?.length || 0} tarif{(professor.tarifs?.length || 0) > 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={() => onDetails(professor)} className="sv-icon-btn"><Eye size={13} strokeWidth={1.75} /></button>
                        <button onClick={() => onEdit(professor)} className="sv-icon-btn"><Pencil size={13} strokeWidth={1.75} /></button>
                        <button onClick={() => onDelete(professor)} className="sv-icon-btn danger"><Trash2 size={13} strokeWidth={1.75} /></button>
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
const NIVEAUX_PROF = ['Primaire','1ère Année collège','2ème Année collège','3ème Année collège','Tronc Commun','1ère Bac','2ème Bac'];

const FormModal = ({ professor, onSave, onClose, specialties, loading }) => {
  const isEdit = !!professor;
  const [formData, setFormData] = useState(() => professor ? {
    nom: professor.nom, prenom: professor.prenom, email: professor.email,
    phone: professor.phoneNumber, specialty: professor.specialite,
    experience: professor.experienceLevel, subjects: professor.matieres || [],
    diploma: professor.diplome, bio: professor.bio || '',
    availability: professor.disponibilite,
    tarifs: (professor.tarifs || []).map(t => ({ matiere: t.matiere, niveau: t.niveau, montant: String(t.montantParEtudiant) })),
    avatarType: professor.avatarType || 'emoji', avatarEmoji: professor.avatarEmoji || '👨‍🏫',
    photoUrl: professor.photoUrl || null,
  } : {
    nom:'', prenom:'', email:'', phone:'', specialty:'', experience:'',
    subjects:[], diploma:'', bio:'', availability:'Disponible',
    tarifs: [],
    avatarType:'emoji', avatarEmoji:'👨‍🏫', photoUrl:null,
  });
  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(professor?.photoUrl || null);
  const [activeSection, setActiveSection] = useState(0);
  const [newTarif, setNewTarif] = useState({ matiere: '', niveau: '', montant: '' });

  const sections = ['Avatar', 'Identité', 'Compétences', 'Tarifs', 'Biographie'];

  const ch = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const toggleSubject = s => setFormData(p => ({
    ...p,
    subjects: p.subjects.includes(s) ? p.subjects.filter(x => x !== s) : [...p.subjects, s],
  }));

  const addTarif = () => {
    if (!newTarif.matiere || !newTarif.niveau || !newTarif.montant) return;
    setFormData(p => ({ ...p, tarifs: [...p.tarifs, { ...newTarif }] }));
    setNewTarif({ matiere: '', niveau: '', montant: '' });
    if (errors.tarifs) setErrors(p => ({ ...p, tarifs: '' }));
  };

  const removeTarif = (idx) => setFormData(p => ({ ...p, tarifs: p.tarifs.filter((_, i) => i !== idx) }));

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
    if (formData.subjects.length === 0) e.subjects = 'Au moins une matière';
    if (formData.tarifs.length === 0) e.tarifs = 'Ajoutez au moins un tarif (matière + niveau + montant)';
    if (formData.avatarType === 'photo' && !photoFile && !formData.photoUrl) e.photo = 'Photo requise';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      ...formData, nom: formData.nom.trim(), prenom: formData.prenom.trim(),
      avatarEmoji: formData.avatarType === 'emoji' ? formData.avatarEmoji : null,
      photoUrl: formData.avatarType === 'photo' ? formData.photoUrl : null,
      tarifs: formData.tarifs.map(t => ({ matiere: t.matiere, niveau: t.niveau, montantParEtudiant: parseFloat(t.montant) })),
    }, photoFile);
  };

  const inputClass = (name) => `sv-input w-full px-3.5 py-2.5 text-[13.5px] ${errors[name] ? 'error' : ''}`;
  const FieldLabel = ({ name, label }) => (
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>{label}</label>
      {errors[name] && <span className="text-[11px]" style={{ color: 'var(--sv-danger)' }}>{errors[name]}</span>}
    </div>
  );

  const sectionContent = [
    /* 0 - Avatar */
    <div key="avatar" className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[['emoji', Smile, 'Emoji'], ['photo', Camera, 'Photo perso']].map(([type, Icon, label]) => (
          <button key={type} type="button"
            onClick={() => setFormData(p => ({ ...p, avatarType: type }))}
            className="p-4 rounded-lg text-center transition-all flex flex-col items-center gap-2"
            style={{
              background: formData.avatarType === type ? 'var(--sv-accent-soft)' : 'var(--sv-surface-2)',
              border: `1px solid ${formData.avatarType === type ? 'var(--sv-accent-border)' : 'var(--sv-border)'}`,
            }}>
            <Icon size={20} strokeWidth={1.75} style={{ color: formData.avatarType === type ? 'var(--sv-accent)' : 'var(--sv-text-faint)' }} />
            <span className="text-[12.5px] font-medium" style={{ color: formData.avatarType === type ? 'var(--sv-accent)' : 'var(--sv-text-dim)' }}>{label}</span>
          </button>
        ))}
      </div>

      {formData.avatarType === 'emoji' && (
        <div className="rounded-lg p-3.5 space-y-3" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
          <p className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>CHOISIR UN AVATAR</p>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map(av => (
              <button key={av} type="button" onClick={() => setFormData(p => ({ ...p, avatarEmoji: av }))}
                className="w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all"
                style={{
                  background: formData.avatarEmoji === av ? 'var(--sv-accent-soft)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${formData.avatarEmoji === av ? 'var(--sv-accent-border)' : 'var(--sv-border)'}`,
                }}>{av}</button>
            ))}
          </div>
        </div>
      )}

      {formData.avatarType === 'photo' && (
        <div>
          {errors.photo && <p className="text-[11px] mb-2" style={{ color: 'var(--sv-danger)' }}>{errors.photo}</p>}
          {!photoPreview ? (
            <label htmlFor="photo-upload"
              className="flex flex-col items-center justify-center gap-2.5 p-8 rounded-lg cursor-pointer transition-all"
              style={{ border: `1.5px dashed ${errors.photo ? 'var(--sv-danger-border)' : 'var(--sv-border-strong)'}`, background: 'var(--sv-surface-2)' }}>
              <Camera size={28} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)' }} />
              <span className="text-[13px] font-medium" style={{ color: 'var(--sv-text-dim)' }}>Cliquer pour télécharger</span>
              <span className="text-[11px]" style={{ color: 'var(--sv-text-faint)' }}>JPG · PNG · WebP — max 5MB</span>
              <input type="file" id="photo-upload" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
          ) : (
            <div className="flex items-center gap-4 p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
              <img src={photoPreview} alt="Aperçu" className="w-16 h-16 object-cover rounded-lg" style={{ border: '1px solid var(--sv-border-strong)' }} />
              <div className="flex gap-2">
                <label htmlFor="photo-upload" className="sv-btn sv-btn-info px-3 py-2 cursor-pointer">Changer</label>
                <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null); }} className="sv-btn px-3 py-2" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)', color: 'var(--sv-danger)' }}>Supprimer</button>
              </div>
              <input type="file" id="photo-upload" accept="image/*" onChange={handlePhoto} className="hidden" />
            </div>
          )}
        </div>
      )}
    </div>,

    /* 1 - Identité */
    <div key="identity" className="grid grid-cols-2 gap-3.5">
      {[
        { name:'nom', label:'NOM', col:1 },
        { name:'prenom', label:'PRÉNOM', col:1 },
        { name:'email', label:'EMAIL', col:2, type:'email' },
        { name:'phone', label:'TÉLÉPHONE', col:1, ph:'06XXXXXXXX' },
        { name:'availability', label:'DISPONIBILITÉ', col:1, isSelect:true },
      ].map(({ name, label, col, type='text', ph, isSelect }) => (
        <div key={name} className={col === 2 ? 'col-span-2' : ''}>
          <FieldLabel name={name} label={label} />
          {isSelect ? (
            <select name={name} value={formData[name]} onChange={ch} className={inputClass(name)} style={{ cursor:'pointer' }}>
              <option value="Disponible">Disponible</option>
              <option value="Partiellement disponible">Partiellement disponible</option>
              <option value="Non disponible">Non disponible</option>
            </select>
          ) : (
            <input type={type} name={name} value={formData[name]} onChange={ch} placeholder={ph} className={inputClass(name)} />
          )}
        </div>
      ))}
    </div>,

    /* 2 - Compétences */
    <div key="skills" className="space-y-4">
      <div className="grid grid-cols-2 gap-3.5">
        {[
          { name:'specialty', label:'SPÉCIALITÉ', options: specialties },
          { name:'experience', label:'EXPÉRIENCE', options: EXPERIENCE_LEVELS },
        ].map(({ name, label, options }) => (
          <div key={name}>
            <FieldLabel name={name} label={label} />
            <select name={name} value={formData[name]} onChange={ch} className={inputClass(name)} style={{ cursor:'pointer' }}>
              <option value="">Sélectionner…</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div className="col-span-2">
          <FieldLabel name="diploma" label="DIPLÔME" />
          <input type="text" name="diploma" value={formData.diploma} onChange={ch} placeholder="ex: Master en IA — ENSIAS" className={inputClass('diploma')} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>MATIÈRES ENSEIGNÉES</label>
          <span className="text-[11px]" style={{ color: errors.subjects ? 'var(--sv-danger)' : 'var(--sv-text-faint)' }}>
            {errors.subjects || `${formData.subjects.length} sélectionnées`}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3.5 rounded-lg sv-scroll overflow-y-auto max-h-48"
          style={{ background: 'var(--sv-surface-2)', border: `1px solid ${errors.subjects ? 'var(--sv-danger-border)' : 'var(--sv-border)'}` }}>
          {SUBJECTS.map(s => {
            const sel = formData.subjects.includes(s);
            return (
              <button key={s} type="button" onClick={() => toggleSubject(s)}
                className="flex items-center gap-2 py-2 px-2.5 rounded-md text-[12px] font-medium transition-all text-left"
                style={{
                  background: sel ? 'var(--sv-accent-soft)' : 'rgba(255,255,255,0.02)',
                  color: sel ? 'var(--sv-accent)' : 'var(--sv-text-dim)',
                  border: `1px solid ${sel ? 'var(--sv-accent-border)' : 'var(--sv-border)'}`,
                }}>
                {sel && <Check size={12} strokeWidth={2.5} className="flex-shrink-0" />}
                <span className="truncate">{s}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>,

    /* 3 - Tarifs */
    <div key="tarifs" className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>TARIF PAR ÉLÈVE, PAR MATIÈRE ET NIVEAU</p>
          {errors.tarifs && <span className="text-[11px]" style={{ color: 'var(--sv-danger)' }}>{errors.tarifs}</span>}
        </div>
        <p className="text-[12px] mb-3" style={{ color: 'var(--sv-text-faint)' }}>
          Ex : Mathématiques · 2ème Bac · 150 MAD/élève. Le revenu mensuel du professeur est calculé automatiquement à partir du nombre d'élèves inscrits dans chaque matière/niveau.
        </p>

        <div className="grid grid-cols-[1fr_1fr_110px_40px] gap-2 mb-3 p-3 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
          <select value={newTarif.matiere} onChange={e => setNewTarif(p => ({ ...p, matiere: e.target.value }))} className={inputClass('newTarifMatiere')} style={{ cursor:'pointer' }}>
            <option value="">Matière…</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={newTarif.niveau} onChange={e => setNewTarif(p => ({ ...p, niveau: e.target.value }))} className={inputClass('newTarifNiveau')} style={{ cursor:'pointer' }}>
            <option value="">Niveau…</option>
            {NIVEAUX_PROF.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <input type="number" min="0" step="0.01" value={newTarif.montant} onChange={e => setNewTarif(p => ({ ...p, montant: e.target.value }))} placeholder="MAD" className={inputClass('newTarifMontant')} />
          <button type="button" onClick={addTarif} className="sv-btn sv-btn-primary" style={{ padding: 0 }}>
            <Plus size={16} strokeWidth={2} />
          </button>
        </div>

        {formData.tarifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px dashed var(--sv-border-strong)' }}>
            <Wallet size={22} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', marginBottom: 6 }} />
            <p className="text-[12.5px]" style={{ color: 'var(--sv-text-faint)' }}>Aucun tarif ajouté</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {formData.tarifs.map((t, i) => (
              <div key={i} className="flex items-center justify-between px-3.5 py-2.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[12.5px] font-medium truncate" style={{ color: 'var(--sv-text)' }}>{t.matiere}</span>
                  <span className="text-[11px]" style={{ color: 'var(--sv-text-faint)' }}>·</span>
                  <span className="text-[12px] truncate" style={{ color: 'var(--sv-text-dim)' }}>{t.niveau}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--sv-accent)' }}>{Number(t.montant).toLocaleString('fr-FR')} MAD</span>
                  <button type="button" onClick={() => removeTarif(i)} className="sv-icon-btn danger" style={{ width: 26, height: 26 }}><X size={12} strokeWidth={2} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,

    /* 4 - Biographie */
    <div key="bio" className="space-y-3.5">
      <div>
        <FieldLabel name="bio" label="BIOGRAPHIE" />
        <textarea name="bio" value={formData.bio} onChange={ch} rows={6}
          placeholder="Présentez le parcours et l'expertise du professeur..."
          className="sv-input w-full px-3.5 py-2.5 text-[13.5px] resize-none" />
      </div>
      <div className="p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
        <p className="text-[10.5px] tracking-wide mb-2.5" style={{ color: 'var(--sv-text-faint)' }}>APERÇU</p>
        <div className="flex items-center gap-3">
          <PersonAvatar professor={{ id: professor?.id || 0, avatarType: formData.avatarType, avatarEmoji: formData.avatarEmoji, photoUrl: photoPreview }} size={40} textSize={18} />
          <div>
            <p className="sv-heading text-[13.5px] font-semibold" style={{ color: 'var(--sv-text)' }}>{formData.prenom || 'Prénom'} {formData.nom || 'Nom'}</p>
            <p className="text-[12px]" style={{ color: 'var(--sv-accent)' }}>{formData.specialty || 'Spécialité'}</p>
          </div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border-strong)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <div>
            <h2 className="sv-heading text-[15px] font-semibold" style={{ color: 'var(--sv-text)' }}>{isEdit ? 'Modifier le profil' : 'Nouveau professeur'}</h2>
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

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
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
                {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Ajouter le professeur'}
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
const DeleteModal = ({ professor, onConfirm, onClose, loading }) => {
  if (!professor) return null;
  const name = professor.fullName || `${professor.prenom} ${professor.nom}`;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-danger-border)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
            <AlertTriangle size={16} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
          </div>
          <div>
            <h3 className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text)' }}>Supprimer ce professeur ?</h3>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>Action irréversible</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
            <PersonAvatar professor={professor} size={40} textSize={18} />
            <div>
              <p className="sv-heading font-semibold text-[13px]" style={{ color: 'var(--sv-text)' }}>{name}</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{professor.specialite}</p>
            </div>
          </div>
          <p className="text-[12px]" style={{ color: 'var(--sv-text-dim)' }}>Toutes les données de ce professeur seront définitivement supprimées de la base.</p>
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
/*  DETAILS MODAL                                                */
/* ══════════════════════════════════════════════════════════════ */
const DetailsModal = ({ professor, onClose, onEdit }) => {
  if (!professor) return null;
  const name = professor.fullName || `${professor.prenom} ${professor.nom}`;
  const infoRows = [
    { icon: Mail, label: 'EMAIL', value: professor.email },
    { icon: Phone, label: 'TÉLÉPHONE', value: professor.phoneNumber },
    { icon: GraduationCap, label: 'DIPLÔME', value: professor.diplome },
    { icon: Calendar, label: 'RECRUTEMENT', value: new Date(professor.dateRecrutement).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }) },
  ];
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="sv-in w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border-strong)', boxShadow: 'var(--sv-shadow-md)' }}>
        <div className="px-6 py-4 flex-shrink-0 flex items-center justify-between" style={{ borderBottom: '1px solid var(--sv-border)' }}>
          <h2 className="sv-heading text-[15px] font-semibold" style={{ color: 'var(--sv-text)' }}>Profil du professeur</h2>
          <button onClick={onClose} className="sv-icon-btn"><X size={15} strokeWidth={1.75} /></button>
        </div>

        <div className="flex-1 overflow-y-auto sv-scroll p-6 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
            <PersonAvatar professor={professor} size={64} textSize={30} />
            <div className="flex-1">
              <h3 className="sv-heading text-[16px] font-bold" style={{ color: 'var(--sv-text)' }}>{name}</h3>
              <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--sv-accent)' }}>{professor.specialite}</p>
              <div className="flex flex-wrap items-center gap-2.5 mt-2.5">
                <AvailDot status={professor.disponibilite} />
                <span className="sv-tag" style={{ background: 'var(--sv-info-soft)', border: '1px solid var(--sv-info-border)', color: 'var(--sv-info)' }}>{professor.experienceLevel}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {infoRows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon size={13} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)' }} />
                  <span className="text-[10px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>{label}</span>
                </div>
                <p className="text-[12.5px] font-medium" style={{ color: 'var(--sv-text)' }}>{value}</p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-lg" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold tracking-wide" style={{ color: 'var(--sv-accent)' }}>TARIFS & REVENU MENSUEL ESTIMÉ</p>
              <p className="sv-heading text-[17px] font-bold" style={{ color: 'var(--sv-accent)' }}>
                {(professor.revenuMensuelEstime ?? 0).toLocaleString('fr-FR')} MAD
              </p>
            </div>
            {(professor.tarifs || []).length === 0 ? (
              <p className="text-[12px]" style={{ color: 'var(--sv-text-faint)' }}>Aucun tarif configuré.</p>
            ) : (
              <div className="space-y-1.5">
                {professor.tarifs.map((t, i) => (
                  <div key={t.id || i} className="flex items-center justify-between px-3 py-2 rounded-md" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border)' }}>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium truncate" style={{ color: 'var(--sv-text)' }}>{t.matiere} · {t.niveau}</p>
                      <p className="text-[10.5px]" style={{ color: 'var(--sv-text-faint)' }}>{t.montantParEtudiant} MAD × {t.nombreEtudiants} élève{t.nombreEtudiants > 1 ? 's' : ''}</p>
                    </div>
                    <span className="text-[13px] font-semibold flex-shrink-0" style={{ color: 'var(--sv-accent)' }}>{(t.revenuCalcule ?? 0).toLocaleString('fr-FR')} MAD</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
            <p className="text-[10px] font-semibold tracking-wide mb-2.5" style={{ color: 'var(--sv-text-faint)' }}>MATIÈRES ENSEIGNÉES</p>
            <div className="flex flex-wrap gap-1.5">
              {(professor.matieres || []).map((m, i) => (
                <span key={i} className="sv-tag" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)', color: 'var(--sv-accent)' }}>{m}</span>
              ))}
            </div>
          </div>

          {professor.bio && (
            <div className="p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
              <p className="text-[10px] font-semibold tracking-wide mb-2.5" style={{ color: 'var(--sv-text-faint)' }}>BIOGRAPHIE</p>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--sv-text-dim)' }}>{professor.bio}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 flex gap-3 flex-shrink-0" style={{ borderTop: '1px solid var(--sv-border)' }}>
          <button onClick={onClose} className="sv-btn sv-btn-ghost flex-1 py-2.5">Fermer</button>
          <button onClick={onEdit} className="sv-btn sv-btn-primary flex-1 py-2.5">Modifier le profil</button>
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
  const [viewMode, setViewMode] = useState('grid');
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
      const res = await professorAPI.createProfessor({ nom:data.nom, prenom:data.prenom, email:data.email, phoneNumber:data.phone, specialite:data.specialty, experienceLevel:data.experience, matieres:data.subjects, diplome:data.diploma, bio:data.bio, disponibilite:data.availability, tarifs:data.tarifs, avatarType:data.avatarType, avatarEmoji:data.avatarEmoji, photoUrl:data.photoUrl }, photoFile);
      if (res.success) { setProfessors(p => [...p, res.data]); setShowAddModal(false); await loadOptions(); }
      else alert(res.message || 'Erreur');
    } catch { alert('Erreur lors de l\'ajout'); } finally { setLoading(false); }
  };

  const handleEdit = async (data, photoFile) => {
    try {
      setLoading(true);
      const res = await professorAPI.updateProfessor(currentProfessor.id, { nom:data.nom, prenom:data.prenom, email:data.email, phoneNumber:data.phone, specialite:data.specialty, experienceLevel:data.experience, matieres:data.subjects, diplome:data.diploma, bio:data.bio, disponibilite:data.availability, tarifs:data.tarifs, avatarType:data.avatarType, avatarEmoji:data.avatarEmoji, photoUrl:data.photoUrl }, photoFile);
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
  const hasFilters = searchQuery || selectedSpecialty !== 'all';

  const statCards = [
    { label: 'Professeurs', value: stats.totalProfessors || professors.length, icon: Users },
    { label: 'Disponibles', value: professors.filter(p => p.disponibilite === 'Disponible').length, icon: Sparkles },
    { label: 'Spécialités', value: Object.keys(grouped).length, icon: BookOpen },
  ];

  return (
    <div className="sv-root min-h-screen" style={{ background: 'var(--sv-bg)' }}>
      <Sidebar activeItem="professors" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <main className="relative z-10 transition-all duration-300" style={{ marginLeft: `${sidebarW}px` }}>
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-8 h-16"
          style={{ background: 'rgba(10,15,28,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--sv-border)' }}
        >
          <div className="flex items-center gap-2 text-[12.5px]">
            <span style={{ color: 'var(--sv-text-faint)' }}>Admin</span>
            <span style={{ color: 'var(--sv-text-faint)' }}>/</span>
            <span className="sv-heading font-semibold" style={{ color: 'var(--sv-text)' }}>Professeurs</span>
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
            <button onClick={() => setShowAddModal(true)} disabled={loading} className="sv-btn sv-btn-primary px-4 py-2">
              <Plus size={15} strokeWidth={2} /> Ajouter un professeur
            </button>
          </div>
        </header>

        <div className="px-8 py-6 space-y-5">
          <div>
            <h1 className="sv-heading text-[22px] font-bold" style={{ color: 'var(--sv-text)' }}>Gestion des professeurs</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>
              {filteredProfessors.length} résultat{filteredProfessors.length !== 1 ? 's' : ''} · {Object.keys(grouped).length} spécialité{Object.keys(grouped).length !== 1 ? 's' : ''}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg sv-in" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
              <AlertTriangle size={15} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
              <span className="text-[13px]" style={{ color: '#F0A8A2' }}>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {statCards.map(({ label, value, icon: Icon }) => (
              <div key={label} className="sv-card sv-in flex items-center gap-3.5 p-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)' }}>
                  <Icon size={16} strokeWidth={1.75} style={{ color: 'var(--sv-accent)' }} />
                </div>
                <div>
                  <p className="sv-heading text-lg font-bold" style={{ color: 'var(--sv-text)' }}>{value}</p>
                  <p className="text-[11.5px]" style={{ color: 'var(--sv-text-faint)' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 p-3.5 rounded-xl sv-card">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sv-text-faint)' }} />
              <input
                type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher un professeur…"
                className="sv-input w-full pl-9 pr-3 py-2.5 text-[13px]"
              />
            </div>
            <select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)} className="sv-input px-3.5 py-2.5 text-[13px] min-w-[180px]" style={{ cursor:'pointer' }}>
              <option value="all">Toutes les spécialités</option>
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {hasFilters && (
              <button onClick={() => { setSearchQuery(''); setSelectedSpecialty('all'); }} className="sv-btn sv-btn-ghost px-3 py-2.5">
                <RotateCcw size={13} strokeWidth={1.75} /> Réinitialiser
              </button>
            )}
          </div>

          {loading && professors.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="sv-card p-4 space-y-3.5">
                  <div className="flex gap-3">
                    <div className="w-13 h-13 rounded-xl sv-shimmer" style={{ background: 'var(--sv-surface-2)', width: 52, height: 52 }} />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 rounded-full sv-shimmer" style={{ background: 'var(--sv-surface-2)', width:'70%' }} />
                      <div className="h-2.5 rounded-full sv-shimmer" style={{ background: 'var(--sv-surface-2)', width:'50%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 rounded-full sv-shimmer" style={{ background: 'var(--sv-surface-2)' }} />
                    <div className="h-2.5 rounded-full sv-shimmer" style={{ background: 'var(--sv-surface-2)', width:'80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProfessors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl sv-card">
              <Search size={32} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', marginBottom: 12 }} />
              <p className="sv-heading font-semibold text-[14px]" style={{ color: 'var(--sv-text-dim)' }}>Aucun résultat</p>
              <p className="text-[12.5px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>Essayez de modifier vos filtres</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="space-y-7">
              {Object.entries(grouped).map(([specialty, group], gi) => (
                <div key={specialty} className="sv-in" style={{ animationDelay: `${gi * 60}ms` }}>
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-1 h-4 rounded-full" style={{ background: 'var(--sv-accent)' }} />
                    <h2 className="sv-heading text-[13.5px] font-semibold" style={{ color: 'var(--sv-text)' }}>{specialty}</h2>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--sv-text-faint)' }}>{group.length}</span>
                    <div className="flex-1 h-px" style={{ background: 'var(--sv-border)' }} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {group.map((prof, idx) => (
                      <ProfessorCard
                        key={prof.id} professor={prof} index={idx}
                        onDetails={p => { setCurrentProfessor(p); setShowDetailsModal(true); }}
                        onEdit={p => { setCurrentProfessor(p); setShowEditModal(true); }}
                        onDelete={p => { setCurrentProfessor(p); setShowDeleteModal(true); }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <TableView
              grouped={grouped}
              onDetails={p => { setCurrentProfessor(p); setShowDetailsModal(true); }}
              onEdit={p => { setCurrentProfessor(p); setShowEditModal(true); }}
              onDelete={p => { setCurrentProfessor(p); setShowDeleteModal(true); }}
            />
          )}
        </div>
      </main>

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
