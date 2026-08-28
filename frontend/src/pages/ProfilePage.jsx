// src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../services/profileService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';
import {
  Pencil, X, Phone, CheckCircle2, Clock, CalendarDays, LogOut, Save,
  Lock, Eye, EyeOff, Shield, Hash, AlertTriangle, Sun, Moon, ChevronRight,
  Check, Circle, Users, GraduationCap, BookOpen, User as UserIcon,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════ */
/*  DESIGN TOKENS — shared across the app, dark + light variants */
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
      --sv-violet:        #9E8FE0;
      --sv-violet-soft:   rgba(158,143,224,0.12);
      --sv-violet-border: rgba(158,143,224,0.30);
      --sv-radius-sm:     8px;
      --sv-radius:        10px;
      --sv-radius-lg:     14px;
      --sv-shadow:        0 1px 2px rgba(0,0,0,0.4);
      --sv-shadow-md:     0 8px 24px rgba(0,0,0,0.35);
    }

    /* ── Light theme override — activated via <html data-theme="light"> ── */
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
    .sv-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .sv-btn-ghost { background: transparent; border-color: var(--sv-border-strong); color: var(--sv-text-dim); }
    .sv-btn-ghost:hover { border-color: var(--sv-text-faint); color: var(--sv-text); background: rgba(128,128,128,0.06); }
    .sv-btn-info { background: var(--sv-info-soft); border-color: var(--sv-info-border); color: var(--sv-info); }
    .sv-btn-info:hover { background: rgba(106,163,217,0.22); }
    .sv-btn-danger-soft { background: var(--sv-danger-soft); border-color: var(--sv-danger-border); color: var(--sv-danger); }
    .sv-btn-danger-soft:hover { background: rgba(226,87,76,0.2); }
    .sv-icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: var(--sv-radius-sm);
      border: 1px solid var(--sv-border); background: transparent; color: var(--sv-text-dim);
      transition: background 0.15s, color 0.15s, border-color 0.15s; cursor: pointer;
    }
    .sv-icon-btn:hover { background: rgba(128,128,128,0.08); color: var(--sv-text); border-color: var(--sv-border-strong); }

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
    input.sv-input:disabled, select.sv-input:disabled, textarea.sv-input:disabled { opacity: 0.5; cursor: not-allowed; }
    select.sv-input option { background: var(--sv-surface); color: var(--sv-text); }
    :root[data-theme="light"] select.sv-input {
      background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%235B6475' stroke-width='1.75'%3E%3Cpath d='M6 8l4 4 4-4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    }

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
    @keyframes sv-spin { to { transform: rotate(360deg); } }
    .sv-spin { animation: sv-spin 0.8s linear infinite; }

    .sv-stat-btn { text-align: left; cursor: pointer; transition: border-color 0.15s, transform 0.15s; }
    .sv-stat-btn:hover { transform: translateY(-2px); border-color: var(--sv-border-strong); }

    .sv-theme-option { cursor: pointer; transition: border-color 0.15s, background 0.15s; }
    .sv-theme-option.active { border-color: var(--sv-accent-border) !important; background: var(--sv-accent-soft); }
  `;
}

/* ── Apply any previously saved theme immediately, on whichever page loads first ── */
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('sv-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}

/* ─── Constants ─── */
const AVATARS = [
  '👤','👨‍💼','👩‍💼','🧑‍💼','👨‍🏫','👩‍🏫','🧑‍💻','👨‍💻','👩‍💻',
  '🦁','🐯','🦊','🐺','🦅','🦋','⚡','🌟','🔥','💎','🏆','🎯','🚀',
];

const AVATAR_COLORS = ['#8B93E8', '#C9A24D', '#5CADC2', '#D18BA0', '#5FAE83', '#C97A6B'];
const getAvatarColor = (id) => AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];

const getStrength = (pw) => {
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[a-z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  return checks.filter(Boolean).length;
};
const STRENGTH_LABELS = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
const STRENGTH_TONE = ['', 'danger', 'danger', 'warning', 'info', 'success'];
const TONE_COLOR = { danger: 'var(--sv-danger)', warning: 'var(--sv-warning)', info: 'var(--sv-info)', success: 'var(--sv-success)' };

/* ══════════════════════════════════════════════════════════════ */
const LabelRow = ({ label, error }) => (
  <div className="flex items-center justify-between mb-1.5">
    <label className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>{label}</label>
    {error && <span className="text-[11px]" style={{ color: 'var(--sv-danger)' }}>{error}</span>}
  </div>
);

const inp = (hasErr) => `sv-input w-full px-3.5 py-2.5 text-[13.5px] ${hasErr ? 'error' : ''}`;

/* ══════════════════════════════════════════════════════════════ */
/*  AVATAR PICKER PANEL                                          */
/* ══════════════════════════════════════════════════════════════ */
const AvatarPicker = ({ current, onSelect, onClose }) => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 sv-in sv-card p-4" style={{ width: 260, boxShadow: 'var(--sv-shadow-md)' }}>
    <div className="flex items-center justify-between mb-2.5">
      <p className="text-[10.5px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>CHOISIR UN AVATAR</p>
      <button onClick={onClose} className="sv-icon-btn" style={{ width: 22, height: 22 }}><X size={11} strokeWidth={2} /></button>
    </div>
    <div className="grid grid-cols-7 gap-1.5">
      {AVATARS.map(a => (
        <button key={a} type="button" onClick={() => { onSelect(a); onClose(); }}
          className="w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all"
          style={{ background: current === a ? 'var(--sv-accent-soft)' : 'var(--sv-surface-2)', border: `1.5px solid ${current === a ? 'var(--sv-accent-border)' : 'var(--sv-border)'}` }}>
          {a}
        </button>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════ */
/*  STAT CARD                                                    */
/* ══════════════════════════════════════════════════════════════ */
const StatCard = ({ icon: Icon, label, val, tone, path, navigate, index }) => {
  const TONE = {
    info: { color: 'var(--sv-info)', soft: 'var(--sv-info-soft)', border: 'var(--sv-info-border)' },
    success: { color: 'var(--sv-success)', soft: 'var(--sv-success-soft)', border: 'var(--sv-success-border)' },
    violet: { color: 'var(--sv-violet)', soft: 'var(--sv-violet-soft)', border: 'var(--sv-violet-border)' },
    accent: { color: 'var(--sv-accent)', soft: 'var(--sv-accent-soft)', border: 'var(--sv-accent-border)' },
  }[tone];
  return (
    <button onClick={() => path && navigate(path)} className="sv-stat-btn sv-card sv-in p-4" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: TONE.soft, border: `1px solid ${TONE.border}` }}>
        <Icon size={15} strokeWidth={1.75} style={{ color: TONE.color }} />
      </div>
      <p className="sv-heading text-xl font-bold" style={{ color: 'var(--sv-text)' }}>{val ?? 0}</p>
      <p className="text-[11px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>{label}</p>
      <p className="flex items-center gap-0.5 text-[10.5px] mt-1.5" style={{ color: TONE.color }}>Voir <ChevronRight size={11} strokeWidth={2} /></p>
    </button>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                    */
/* ══════════════════════════════════════════════════════════════ */
const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('sv-theme')) || 'dark');

  const [form, setForm] = useState({ prenom: '', nom: '', email: '', phoneNumber: '', bio: '', avatarEmoji: '👤' });
  const [formErrors, setFormErrors] = useState({});

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [showPw, setShowPw] = useState({ cur: false, nw: false, conf: false });

  useEffect(() => {
    if (!getAuthToken()) { navigate('/login'); return; }
    loadProfile();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sv-theme', theme);
  }, [theme]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await profileAPI.getProfile();
      if (res.success) {
        setProfile(res.data);
        setForm({
          prenom:      res.data.prenom      || '',
          nom:         res.data.nom         || '',
          email:       res.data.email       || '',
          phoneNumber: res.data.phoneNumber || '',
          bio:         res.data.bio         || '',
          avatarEmoji: res.data.avatarEmoji || '👤',
        });
      }
    } catch { setError('Impossible de charger le profil.'); }
    finally { setLoading(false); }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors(p => ({ ...p, [name]: '' }));
  };

  const validateProfile = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = 'Requis';
    if (!form.nom.trim())    e.nom    = 'Requis';
    if (!form.email.trim())  e.email  = 'Requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    return e;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const errs = validateProfile();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    try {
      setSaving(true); setError(''); setSuccessMsg('');
      const res = await profileAPI.updateProfile(form);
      if (res.success) {
        setProfile(res.data);
        localStorage.setItem('userName', `${res.data.prenom} ${res.data.nom}`);
        showSuccess('Profil mis à jour avec succès !');
      } else { setError(res.message || 'Erreur'); }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally { setSaving(false); }
  };

  const validatePassword = () => {
    const e = {};
    if (!pwForm.currentPassword)        e.cur  = 'Requis';
    if (pwForm.newPassword.length < 8)  e.nw   = 'Minimum 8 caractères';
    if (pwForm.newPassword !== pwForm.confirmPassword) e.conf = 'Ne correspondent pas';
    return e;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const errs = validatePassword();
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    try {
      setSaving(true); setError('');
      const res = await profileAPI.changePassword(pwForm);
      if (res.success) {
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPwErrors({});
        showSuccess('Mot de passe modifié avec succès !');
      } else { setError(res.message || 'Erreur'); }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement.');
    } finally { setSaving(false); }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const getMembershipDuration = () => {
    if (!profile?.createdAt) return 'Membre';
    const days = Math.floor((new Date() - new Date(profile.createdAt)) / 86400000);
    if (days < 30)  return `Membre depuis ${days}j`;
    if (days < 365) return `Membre depuis ${Math.floor(days / 30)} mois`;
    return `Membre depuis ${Math.floor(days / 365)} an(s)`;
  };

  const sidebarW = sidebarCollapsed ? 72 : 240;
  const strength = getStrength(pwForm.newPassword);
  const strengthTone = STRENGTH_TONE[strength];
  const fullName = profile ? `${profile.prenom || ''} ${profile.nom || ''}`.trim() : '—';
  const avatarColor = getAvatarColor(profile?.id || 0);

  const TABS = [
    { key: 'info',     label: 'Informations', icon: UserIcon },
    { key: 'password', label: 'Mot de passe',  icon: Lock },
    { key: 'account',  label: 'Compte',        icon: Shield },
  ];

  if (loading) return (
    <div className="sv-root min-h-screen flex items-center justify-center" style={{ background: 'var(--sv-bg)' }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-[3px] mx-auto mb-3 sv-spin" style={{ borderColor: 'var(--sv-border-strong)', borderTopColor: 'var(--sv-accent)' }} />
        <p className="text-[13px]" style={{ color: 'var(--sv-text-faint)' }}>Chargement du profil…</p>
      </div>
    </div>
  );

  return (
    <div className="sv-root min-h-screen" style={{ background: 'var(--sv-bg)' }}>
      <Sidebar activeItem="settings" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <main className="relative z-10 transition-all duration-300" style={{ marginLeft: `${sidebarW}px` }}>
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-8 h-16"
          style={{ background: 'color-mix(in srgb, var(--sv-bg) 92%, transparent)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--sv-border)' }}
        >
          <div className="flex items-center gap-2 text-[12.5px]">
            <span style={{ color: 'var(--sv-text-faint)' }}>Admin</span>
            <span style={{ color: 'var(--sv-text-faint)' }}>/</span>
            <span className="sv-heading font-semibold" style={{ color: 'var(--sv-text)' }}>Mon profil</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[12px]" style={{ color: 'var(--sv-text-faint)' }}>{getMembershipDuration()}</span>
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="sv-icon-btn" title="Changer de thème">
              {theme === 'dark' ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
            </button>
            <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="sv-btn sv-btn-danger-soft px-3.5 py-2">
              <LogOut size={13} strokeWidth={1.75} /> <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        <div className="px-8 py-6 space-y-5">
          <div>
            <h1 className="sv-heading text-[22px] font-bold" style={{ color: 'var(--sv-text)' }}>Mon profil</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>Gérez vos informations personnelles et la sécurité de votre compte</p>
          </div>

          {successMsg && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg sv-in" style={{ background: 'var(--sv-success-soft)', border: '1px solid var(--sv-success-border)' }}>
              <CheckCircle2 size={16} strokeWidth={1.75} style={{ color: 'var(--sv-success)' }} />
              <span className="text-[13px] font-medium" style={{ color: 'var(--sv-success)' }}>{successMsg}</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg sv-in" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
              <AlertTriangle size={15} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
              <span className="text-[13px]" style={{ color: 'var(--sv-danger)' }}>{error}</span>
              <button onClick={() => setError('')} className="ml-auto sv-icon-btn" style={{ width: 22, height: 22 }}><X size={11} strokeWidth={2} /></button>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* ════ COLONNE GAUCHE ════ */}
            <div className="xl:col-span-1 space-y-4">

              {/* Hero card */}
              <div className="sv-card sv-in overflow-hidden">
                <div className="h-[3px]" style={{ background: 'var(--sv-accent)' }} />
                <div className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-4xl" style={{ background: `${avatarColor}22`, border: `1px solid ${avatarColor}40` }}>
                      {form.avatarEmoji}
                    </div>
                    <button type="button" onClick={() => setShowAvatarPicker(s => !s)}
                      className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--sv-accent)', color: 'var(--sv-accent-ink)' }}>
                      <Pencil size={12} strokeWidth={2} />
                    </button>
                    <div className="relative">
                      {showAvatarPicker && (
                        <AvatarPicker current={form.avatarEmoji} onSelect={a => setForm(p => ({ ...p, avatarEmoji: a }))} onClose={() => setShowAvatarPicker(false)} />
                      )}
                    </div>
                  </div>

                  <h2 className="sv-heading text-[16px] font-bold" style={{ color: 'var(--sv-text)' }}>{fullName}</h2>
                  <p className="text-[12.5px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>{profile?.email}</p>

                  <span className="sv-tag mt-3" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)', color: 'var(--sv-accent)' }}>
                    {profile?.role || 'ADMIN'}
                  </span>

                  {form.bio && (
                    <p className="mt-3.5 text-[12px] leading-relaxed italic" style={{ color: 'var(--sv-text-faint)' }}>"{form.bio}"</p>
                  )}
                </div>

                <div className="px-5 pb-5 space-y-0.5">
                  <div className="h-px mb-2" style={{ background: 'var(--sv-border)' }} />
                  {[
                    { icon: Phone, label: 'Téléphone', val: profile?.phoneNumber || 'Non renseigné' },
                    { icon: CheckCircle2, label: 'Statut', val: profile?.isEnabled ? 'Actif' : 'Inactif' },
                    { icon: Clock, label: 'Dernière connexion', val: profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString('fr-FR', { dateStyle: 'medium' }) : 'Inconnue' },
                    { icon: CalendarDays, label: 'Membre depuis', val: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'medium' }) : '—' },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="flex items-center gap-2.5 py-2" style={{ borderBottom: '1px solid var(--sv-border)' }}>
                      <Icon size={13} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)', flexShrink: 0 }} />
                      <span className="text-[11.5px] flex-1" style={{ color: 'var(--sv-text-faint)' }}>{label}</span>
                      <span className="text-[11.5px] font-medium truncate" style={{ color: 'var(--sv-text-dim)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats card */}
              <div className="sv-card sv-in p-4" style={{ animationDelay: '80ms' }}>
                <p className="text-[10.5px] font-semibold tracking-wide mb-3" style={{ color: 'var(--sv-text-faint)' }}>APERÇU DU CENTRE</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: Users,         label: 'Étudiants',   val: profile?.totalStudents,   tone: 'info',    path: '/admin/students' },
                    { icon: GraduationCap, label: 'Professeurs', val: profile?.totalProfessors, tone: 'violet',  path: '/admin/professors' },
                    { icon: BookOpen,      label: 'Cours',       val: profile?.totalCourses,    tone: 'success', path: '/admin/courses' },
                    { icon: CalendarDays,  label: 'Événements',  val: profile?.totalEvents,     tone: 'accent',  path: '/admin/events' },
                  ].map((s, i) => <StatCard key={s.label} {...s} navigate={navigate} index={i} />)}
                </div>
              </div>
            </div>

            {/* ════ COLONNE DROITE ════ */}
            <div className="xl:col-span-2 space-y-4">

              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-xl sv-card">
                {TABS.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12.5px] font-semibold transition-all"
                    style={activeTab === tab.key ? { background: 'var(--sv-accent)', color: 'var(--sv-accent-ink)' } : { color: 'var(--sv-text-faint)' }}>
                    <tab.icon size={13} strokeWidth={1.75} /> {tab.label}
                  </button>
                ))}
              </div>

              {/* ══ ONGLET INFORMATIONS ══ */}
              {activeTab === 'info' && (
                <form onSubmit={handleSaveProfile} className="sv-card sv-in p-6 space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="sv-heading font-semibold text-[14.5px]" style={{ color: 'var(--sv-text)' }}>Informations personnelles</h3>
                    <span className="sv-tag" style={{ background: 'rgba(128,128,128,0.08)', border: '1px solid var(--sv-border-strong)', color: 'var(--sv-text-faint)' }}>Modifiable</span>
                  </div>

                  <div className="flex items-center gap-4 p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: `${avatarColor}22`, border: `1px solid ${avatarColor}40` }}>
                      {form.avatarEmoji}
                    </div>
                    <div className="flex-1">
                      <p className="sv-heading font-semibold text-[13.5px]" style={{ color: 'var(--sv-text)' }}>{form.prenom || 'Prénom'} {form.nom || 'Nom'}</p>
                      <p className="text-[12px] mt-0.5" style={{ color: 'var(--sv-accent)' }}>{profile?.role || 'ADMIN'}</p>
                    </div>
                    <button type="button" onClick={() => setShowAvatarPicker(s => !s)} className="sv-btn sv-btn-ghost px-3 py-2">Changer l'icône</button>
                  </div>

                  {showAvatarPicker && (
                    <div className="p-3.5 rounded-lg sv-in" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
                      <div className="grid grid-cols-11 gap-1.5">
                        {AVATARS.map(a => (
                          <button key={a} type="button" onClick={() => { setForm(p => ({ ...p, avatarEmoji: a })); setShowAvatarPicker(false); }}
                            className="w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all"
                            style={{ background: form.avatarEmoji === a ? 'var(--sv-accent-soft)' : 'var(--sv-surface)', border: `1.5px solid ${form.avatarEmoji === a ? 'var(--sv-accent-border)' : 'var(--sv-border)'}` }}>
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <LabelRow label="PRÉNOM *" error={formErrors.prenom} />
                      <input name="prenom" value={form.prenom} onChange={handleFormChange} placeholder="Votre prénom…" className={inp(!!formErrors.prenom)} />
                    </div>
                    <div>
                      <LabelRow label="NOM *" error={formErrors.nom} />
                      <input name="nom" value={form.nom} onChange={handleFormChange} placeholder="Votre nom…" className={inp(!!formErrors.nom)} />
                    </div>
                    <div className="sm:col-span-2">
                      <LabelRow label="EMAIL *" error={formErrors.email} />
                      <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="votre@email.com" className={inp(!!formErrors.email)} />
                    </div>
                    <div className="sm:col-span-2">
                      <LabelRow label="TÉLÉPHONE" />
                      <input name="phoneNumber" value={form.phoneNumber} onChange={handleFormChange} placeholder="+212 6XX XXX XXX" className={inp(false)} />
                    </div>
                    <div className="sm:col-span-2">
                      <LabelRow label="BIO" />
                      <textarea name="bio" value={form.bio} onChange={handleFormChange} rows={3} placeholder="Quelques mots sur vous…" className={`${inp(false)} resize-none`} />
                      <p className="text-[11px] mt-1.5" style={{ color: 'var(--sv-text-faint)' }}>Apparaît sur votre carte de profil</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button type="submit" disabled={saving} className="sv-btn sv-btn-primary px-6 py-2.5">
                      {saving ? (<><span className="w-3.5 h-3.5 rounded-full border-2 sv-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'currentColor' }} /> Sauvegarde…</>) : (<><Save size={14} strokeWidth={1.75} /> Sauvegarder le profil</>)}
                    </button>
                  </div>
                </form>
              )}

              {/* ══ ONGLET MOT DE PASSE ══ */}
              {activeTab === 'password' && (
                <form onSubmit={handleChangePassword} className="sv-card sv-in p-6 space-y-4">
                  <h3 className="sv-heading font-semibold text-[14.5px]" style={{ color: 'var(--sv-text)' }}>Changer le mot de passe</h3>
                  <p className="text-[13px]" style={{ color: 'var(--sv-text-faint)' }}>Choisissez un mot de passe fort d'au moins 8 caractères.</p>

                  {pwForm.newPassword && (
                    <div className="p-3.5 rounded-lg sv-in" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10.5px] font-semibold tracking-wide" style={{ color: 'var(--sv-text-faint)' }}>FORCE DU MOT DE PASSE</p>
                        <p className="text-[11.5px] font-semibold" style={{ color: TONE_COLOR[strengthTone] }}>{STRENGTH_LABELS[strength]}</p>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{ background: i <= strength ? TONE_COLOR[strengthTone] : 'var(--sv-border-strong)' }} />
                        ))}
                      </div>
                    </div>
                  )}

                  {[
                    { key: 'cur', name: 'currentPassword', label: 'MOT DE PASSE ACTUEL', showKey: 'cur' },
                    { key: 'nw', name: 'newPassword', label: 'NOUVEAU MOT DE PASSE', showKey: 'nw' },
                    { key: 'conf', name: 'confirmPassword', label: 'CONFIRMER', showKey: 'conf' },
                  ].map(field => (
                    <div key={field.key}>
                      <LabelRow label={field.label} error={pwErrors[field.key]} />
                      <div className="relative">
                        <input
                          name={field.name}
                          type={showPw[field.showKey] ? 'text' : 'password'}
                          value={pwForm[field.name]}
                          onChange={e => { setPwForm(p => ({ ...p, [field.name]: e.target.value })); if (pwErrors[field.key]) setPwErrors(p => ({ ...p, [field.key]: '' })); }}
                          placeholder="••••••••"
                          className={`${inp(!!pwErrors[field.key])} pr-11`}
                        />
                        <button type="button" onClick={() => setShowPw(p => ({ ...p, [field.showKey]: !p[field.showKey] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sv-text-faint)' }}>
                          {showPw[field.showKey] ? <EyeOff size={15} strokeWidth={1.75} /> : <Eye size={15} strokeWidth={1.75} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-2 p-3.5 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
                    {[
                      { rule: pwForm.newPassword.length >= 8, label: '8 caractères min.' },
                      { rule: /[A-Z]/.test(pwForm.newPassword), label: 'Une majuscule' },
                      { rule: /[0-9]/.test(pwForm.newPassword), label: 'Un chiffre' },
                      { rule: /[^A-Za-z0-9]/.test(pwForm.newPassword), label: 'Caractère spécial' },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-[12px]" style={{ color: r.rule ? 'var(--sv-success)' : 'var(--sv-text-faint)' }}>
                        {r.rule ? <Check size={13} strokeWidth={2} /> : <Circle size={13} strokeWidth={1.75} />} {r.label}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button type="submit" disabled={saving} className="sv-btn sv-btn-info px-6 py-2.5">
                      {saving ? (<><span className="w-3.5 h-3.5 rounded-full border-2 sv-spin" style={{ borderColor: 'rgba(106,163,217,0.3)', borderTopColor: 'currentColor' }} /> Modification…</>) : (<><Lock size={14} strokeWidth={1.75} /> Changer le mot de passe</>)}
                    </button>
                  </div>
                </form>
              )}

              {/* ══ ONGLET COMPTE ══ */}
              {activeTab === 'account' && (
                <div className="space-y-4 sv-in">

                  {/* Apparence — theme switch */}
                  <div className="sv-card p-6">
                    <h3 className="sv-heading font-semibold text-[14.5px] mb-1" style={{ color: 'var(--sv-text)' }}>Apparence</h3>
                    <p className="text-[12.5px] mb-4" style={{ color: 'var(--sv-text-faint)' }}>Choisissez comment le site s'affiche pour vous.</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'dark', label: 'Sombre', icon: Moon, desc: 'Fond profond, contrastes doux' },
                        { key: 'light', label: 'Clair', icon: Sun, desc: 'Fond clair, contrastes nets' },
                      ].map(opt => (
                        <button key={opt.key} type="button" onClick={() => setTheme(opt.key)}
                          className={`sv-theme-option p-4 rounded-lg text-left ${theme === opt.key ? 'active' : ''}`}
                          style={{ border: '1px solid var(--sv-border)', background: 'var(--sv-surface-2)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <opt.icon size={18} strokeWidth={1.75} style={{ color: theme === opt.key ? 'var(--sv-accent)' : 'var(--sv-text-faint)' }} />
                            {theme === opt.key && <CheckCircle2 size={15} strokeWidth={1.75} style={{ color: 'var(--sv-accent)' }} />}
                          </div>
                          <p className="text-[13px] font-semibold" style={{ color: 'var(--sv-text)' }}>{opt.label}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Infos compte */}
                  <div className="sv-card p-6">
                    <h3 className="sv-heading font-semibold text-[14.5px] mb-4" style={{ color: 'var(--sv-text)' }}>Informations du compte</h3>
                    <div className="space-y-0.5">
                      {[
                        { icon: Hash, label: 'Identifiant', val: `#${profile?.id || '—'}` },
                        { icon: Shield, label: "Niveau d'accès", val: profile?.role || 'ADMIN' },
                        { icon: CheckCircle2, label: 'Statut du compte', val: profile?.isEnabled ? 'Actif et vérifié' : 'Inactif' },
                        { icon: CalendarDays, label: 'Compte créé le', val: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' }) : '—' },
                        { icon: Clock, label: 'Dernière connexion', val: profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : '—' },
                      ].map(({ icon: Icon, label, val }) => (
                        <div key={label} className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid var(--sv-border)' }}>
                          <Icon size={14} strokeWidth={1.75} style={{ color: 'var(--sv-text-faint)', flexShrink: 0 }} />
                          <span className="text-[13px] flex-1" style={{ color: 'var(--sv-text-faint)' }}>{label}</span>
                          <span className="text-[13px] font-medium" style={{ color: 'var(--sv-text)' }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Zone danger */}
                  <div className="sv-card p-6" style={{ borderColor: 'var(--sv-danger-border)' }}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
                        <AlertTriangle size={15} strokeWidth={1.75} style={{ color: 'var(--sv-danger)' }} />
                      </div>
                      <h3 className="sv-heading font-semibold text-[13.5px]" style={{ color: 'var(--sv-danger)' }}>Zone de danger</h3>
                    </div>
                    <p className="text-[12px] mb-4" style={{ color: 'var(--sv-text-faint)' }}>Ces actions sont irréversibles. Procédez avec précaution.</p>
                    <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="sv-btn sv-btn-danger-soft px-4 py-2.5">
                      <LogOut size={14} strokeWidth={1.75} /> Se déconnecter de toutes les sessions
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
