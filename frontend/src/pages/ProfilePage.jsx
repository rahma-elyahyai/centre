// src/components/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../services/profileService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';

/* ─── Warriors CSS injection ─── */
if (!document.getElementById('warriors-profile-style')) {
  const s = document.createElement('style');
  s.id = 'warriors-profile-style';
  s.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
    .warriors-font  { font-family: 'Outfit', sans-serif; }
    .warriors-title { font-family: 'Sora', sans-serif; }
    .gold-text { background: linear-gradient(135deg,#c49630,#f0c84a); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .btn-gold { background: linear-gradient(135deg,#c49630 0%,#f0c84a 100%); transition: all 0.2s; }
    .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(196,150,48,0.35); }
    .input-warriors { background: rgba(255,255,255,0.04); border: 1px solid rgba(196,150,48,0.15); color: #e8eaf0; font-family:'Outfit',sans-serif; transition: border-color 0.2s, box-shadow 0.2s; }
    .input-warriors:focus { outline:none; border-color:rgba(196,150,48,0.55); box-shadow:0 0 0 3px rgba(196,150,48,0.08); }
    .input-warriors::placeholder { color:rgba(148,163,184,0.35); }
    .input-warriors:disabled { opacity:0.4; cursor:not-allowed; }
    select.input-warriors option { background:#0d1c30; color:#e8eaf0; }
    .scrollbar-warriors::-webkit-scrollbar { width:4px; }
    .scrollbar-warriors::-webkit-scrollbar-track { background:transparent; }
    .scrollbar-warriors::-webkit-scrollbar-thumb { background:rgba(196,150,48,0.2); border-radius:4px; }
    @keyframes fadeInUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }
    .animate-in { animation: fadeInUp 0.35s ease forwards; }
    @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .shimmer { animation: shimmer 1.6s ease-in-out infinite; }
    @keyframes pulse-gold { 0%,100%{box-shadow:0 0 0 0 rgba(196,150,48,0.3);} 50%{box-shadow:0 0 0 8px rgba(196,150,48,0);} }
    .pulse-gold { animation: pulse-gold 2s ease-in-out infinite; }
    @keyframes spin-slow { to{transform:rotate(360deg);} }
    .spin-slow { animation: spin-slow 1.2s linear infinite; }
  `;
  document.head.appendChild(s);
}

/* ─── Constants ─── */
const AVATARS = [
  '👤','👨‍💼','👩‍💼','🧑‍💼','👨‍🏫','👩‍🏫','🧑‍💻','👨‍💻','👩‍💻',
  '🦁','🐯','🦊','🐺','🦅','🦋','⚡','🌟','🔥','💎','🏆','🎯','🚀',
];

const getAvatarGrad = (id) => {
  const grads = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#c49630,#f0c84a)',
    'linear-gradient(135deg,#3b82f6,#06b6d4)',
    'linear-gradient(135deg,#ec4899,#f43f5e)',
    'linear-gradient(135deg,#10b981,#14b8a6)',
  ];
  return grads[(id || 0) % grads.length];
};

/* ── Password strength ── */
const getStrength = (pw) => {
  const checks = [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[a-z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ];
  return checks.filter(Boolean).length;
};
const STRENGTH_LABELS = ['','Très faible','Faible','Moyen','Fort','Très fort'];
const STRENGTH_COLORS = ['','#ef4444','#f97316','#f0c84a','#60a5fa','#4ade80'];

/* ══════════════════════════════════════════════════════════════ */
/*  LABEL ROW helper                                             */
/* ══════════════════════════════════════════════════════════════ */
const LabelRow = ({ label, error }) => (
  <div className="flex items-center justify-between mb-2">
    <label className="text-[10px] font-semibold tracking-[0.12em] warriors-font"
      style={{ color: 'rgba(196,150,48,0.45)' }}>{label}</label>
    {error && <span className="text-[10px] warriors-font" style={{ color: '#f87171' }}>{error}</span>}
  </div>
);

const inp = (hasErr) =>
  `input-warriors w-full px-4 py-3 rounded-xl text-sm warriors-font ${hasErr ? 'border-red-500/60' : ''}`;

/* ══════════════════════════════════════════════════════════════ */
/*  AVATAR PICKER PANEL                                          */
/* ══════════════════════════════════════════════════════════════ */
const AvatarPicker = ({ current, onSelect, onClose }) => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 animate-in"
    style={{ background: 'linear-gradient(145deg,#0d1c30,#080f1e)', border: '1px solid rgba(196,150,48,0.2)', borderRadius: '20px', padding: '16px', width: '280px', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
    <div className="flex items-center justify-between mb-3">
      <p className="warriors-font text-[10px] font-semibold tracking-widest" style={{ color: 'rgba(196,150,48,0.5)' }}>CHOISIR UN AVATAR</p>
      <button onClick={onClose} className="warriors-font text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>✕</button>
    </div>
    <div className="grid grid-cols-7 gap-1.5">
      {AVATARS.map(a => (
        <button key={a} type="button" onClick={() => { onSelect(a); onClose(); }}
          className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
          style={{
            background: current === a ? 'linear-gradient(135deg,#c49630,#f0c84a)' : 'rgba(255,255,255,0.04)',
            border: `1.5px solid ${current === a ? '#c49630' : 'transparent'}`,
            transform: current === a ? 'scale(1.1)' : 'scale(1)',
          }}>
          {a}
        </button>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════ */
/*  STAT CARD                                                    */
/* ══════════════════════════════════════════════════════════════ */
const StatCard = ({ icon, label, val, color, border, textColor, path, navigate, index }) => (
  <button onClick={() => path && navigate(path)}
    className="p-5 rounded-2xl text-left transition-all duration-200 animate-in hover:-translate-y-1 group"
    style={{
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${border}`,
      animationDelay: `${index * 60}ms`,
    }}>
    <span className="text-2xl">{icon}</span>
    <p className="warriors-title text-3xl font-black mt-3" style={{ color: textColor }}>{val ?? 0}</p>
    <p className="warriors-font text-[10px] mt-1 tracking-widest" style={{ color: 'rgba(148,163,184,0.4)' }}>{label.toUpperCase()}</p>
    <p className="warriors-font text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: textColor }}>→ Voir</p>
  </button>
);

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

  /* ── Profil form ── */
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', phoneNumber: '', bio: '', avatarEmoji: '👤',
  });
  const [formErrors, setFormErrors] = useState({});

  /* ── Password form ── */
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [showPw, setShowPw]     = useState({ cur: false, nw: false, conf: false });

  useEffect(() => {
    if (!getAuthToken()) { navigate('/login'); return; }
    loadProfile();
  }, []);

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
    finally   { setLoading(false); }
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
  const fullName = profile ? `${profile.prenom || ''} ${profile.nom || ''}`.trim() : '—';

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen warriors-font flex items-center justify-center"
      style={{ background: 'linear-gradient(145deg,#080f1e,#060c18)' }}>
      <div className="text-center">
        <div className="w-14 h-14 rounded-full border-4 mx-auto mb-4 spin-slow"
          style={{ borderColor: 'rgba(196,150,48,0.15)', borderTopColor: '#f0c84a' }} />
        <p className="warriors-font text-sm" style={{ color: 'rgba(196,150,48,0.6)' }}>Chargement du profil…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen warriors-font" style={{ background: 'linear-gradient(145deg,#080f1e 0%,#060c18 100%)' }}>

      {/* ── Ambient bg ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute rounded-full" style={{ width:'700px',height:'700px',background:'radial-gradient(circle,rgba(196,150,48,0.04),transparent 70%)',top:'-15%',left:'-10%',filter:'blur(40px)' }} />
        <div className="absolute rounded-full" style={{ width:'500px',height:'500px',background:'radial-gradient(circle,rgba(99,102,241,0.04),transparent 70%)',bottom:'-10%',right:'-5%',filter:'blur(40px)' }} />
        <div className="absolute inset-0" style={{ backgroundImage:'radial-gradient(circle,rgba(196,150,48,0.04) 1px,transparent 1px)',backgroundSize:'42px 42px' }} />
      </div>

      <Sidebar activeItem="settings" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <main className="relative z-10 transition-all duration-300" style={{ marginLeft: `${sidebarW}px` }}>

        {/* ── Top Bar ── */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-[72px]"
          style={{ background:'rgba(6,12,24,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(196,150,48,0.08)' }}>
          <div className="flex items-center gap-3">
            <span className="warriors-font text-xs" style={{ color:'rgba(148,163,184,0.35)' }}>Admin</span>
            <span style={{ color:'rgba(196,150,48,0.25)' }}>›</span>
            <span className="warriors-title text-sm font-semibold" style={{ color:'#f0c84a' }}>Mon Profil</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="warriors-font text-xs" style={{ color:'rgba(148,163,184,0.3)' }}>{getMembershipDuration()}</span>
            <button onClick={() => { localStorage.clear(); navigate('/login'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs warriors-font transition-all"
              style={{ border:'1px solid rgba(239,68,68,0.2)',color:'rgba(248,113,113,0.5)',background:'rgba(239,68,68,0.06)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.06)'}>
              🚪 <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        <div className="px-8 py-7 space-y-6">

          {/* ── Page title ── */}
          <div>
            <h1 className="warriors-title text-3xl font-black" style={{ color:'#e8eaf0' }}>
              Mon <span className="gold-text">Profil</span>
            </h1>
            <p className="warriors-font text-sm mt-1" style={{ color:'rgba(148,163,184,0.4)' }}>
              Gérez vos informations personnelles et la sécurité de votre compte
            </p>
          </div>

          {/* ── Notifications ── */}
          {successMsg && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl animate-in"
              style={{ background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)' }}>
              <span style={{ color:'#4ade80',fontSize:'18px' }}>✓</span>
              <span className="warriors-font text-sm font-semibold" style={{ color:'#4ade80' }}>{successMsg}</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl animate-in"
              style={{ background:'rgba(239,68,68,0.07)',border:'1px solid rgba(239,68,68,0.15)' }}>
              <span style={{ color:'#f87171' }}>⚠</span>
              <span className="warriors-font text-sm" style={{ color:'rgba(248,113,113,0.8)' }}>{error}</span>
              <button onClick={() => setError('')} className="ml-auto warriors-font text-xs" style={{ color:'rgba(248,113,113,0.4)' }}>✕</button>
            </div>
          )}

          {/* ── Layout ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* ════ COLONNE GAUCHE ════ */}
            <div className="xl:col-span-1 space-y-5">

              {/* Hero card */}
              <div className="relative rounded-3xl overflow-hidden animate-in"
                style={{ background:'linear-gradient(145deg,rgba(13,24,44,0.98),rgba(8,15,30,0.95))',border:'1px solid rgba(196,150,48,0.12)' }}>
                {/* Gold stripe top */}
                <div className="h-0.5 bg-gradient-to-r from-[#c49630] via-[#f0c84a] to-transparent" />
                {/* Ambient glow */}
                <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                  style={{ background:'radial-gradient(ellipse at 50% -10%,rgba(196,150,48,0.12),transparent 70%)' }} />

                <div className="relative p-7 text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-5">
                    <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-5xl pulse-gold"
                      style={{ background:`${getAvatarGrad(profile?.id || 0)}`, boxShadow:'0 12px 40px rgba(0,0,0,0.5)' }}>
                      {form.avatarEmoji}
                    </div>
                    <button type="button" onClick={() => setShowAvatarPicker(s => !s)}
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl btn-gold flex items-center justify-center text-xs font-black shadow-lg"
                      style={{ color:'#0a1628' }}>
                      ✏
                    </button>
                    {/* Avatar picker dropdown */}
                    <div className="relative">
                      {showAvatarPicker && (
                        <AvatarPicker
                          current={form.avatarEmoji}
                          onSelect={a => setForm(p => ({ ...p, avatarEmoji: a }))}
                          onClose={() => setShowAvatarPicker(false)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Name + role */}
                  <h2 className="warriors-title text-xl font-black" style={{ color:'#e8eaf0' }}>{fullName}</h2>
                  <p className="warriors-font text-sm mt-1" style={{ color:'rgba(148,163,184,0.4)' }}>{profile?.email}</p>

                  <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full"
                    style={{ background:'rgba(196,150,48,0.08)',border:'1px solid rgba(196,150,48,0.2)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background:'#f0c84a' }} />
                    <span className="warriors-font text-[11px] font-bold" style={{ color:'#f0c84a' }}>{profile?.role || 'ADMIN'}</span>
                  </div>

                  {form.bio && (
                    <p className="mt-4 warriors-font text-xs leading-relaxed italic"
                      style={{ color:'rgba(148,163,184,0.35)' }}>"{form.bio}"</p>
                  )}
                </div>

                {/* Info rapide */}
                <div className="px-7 pb-7 space-y-2">
                  <div className="h-px mb-4" style={{ background:'linear-gradient(90deg,transparent,rgba(196,150,48,0.15),transparent)' }} />
                  {[
                    { icon:'📞', label:'Téléphone', val: profile?.phoneNumber || 'Non renseigné' },
                    { icon:'✅', label:'Statut',    val: profile?.isEnabled ? 'Actif' : 'Inactif' },
                    { icon:'🕐', label:'Dernière connexion',
                      val: profile?.lastLogin
                        ? new Date(profile.lastLogin).toLocaleDateString('fr-FR', { dateStyle:'medium' })
                        : 'Inconnue' },
                    { icon:'📅', label:'Membre depuis',
                      val: profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { dateStyle:'medium' })
                        : '—' },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="flex items-center gap-3 py-2"
                      style={{ borderBottom:'1px solid rgba(196,150,48,0.05)' }}>
                      <span className="text-sm w-5 text-center flex-shrink-0" style={{ color:'rgba(196,150,48,0.45)' }}>{icon}</span>
                      <span className="warriors-font text-[11px] flex-1" style={{ color:'rgba(148,163,184,0.4)' }}>{label}</span>
                      <span className="warriors-font text-[11px] font-semibold truncate" style={{ color:'rgba(200,210,225,0.7)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats card */}
              <div className="rounded-3xl p-5 animate-in"
                style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(196,150,48,0.08)',animationDelay:'100ms' }}>
                <p className="warriors-font text-[10px] font-semibold tracking-widest mb-4" style={{ color:'rgba(196,150,48,0.4)' }}>APERÇU DU CENTRE</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon:'👥', label:'Étudiants',   val: profile?.totalStudents,   textColor:'#60a5fa', border:'rgba(59,130,246,0.2)',  path:'/admin/students' },
                    { icon:'👨‍🏫', label:'Professeurs', val: profile?.totalProfessors, textColor:'#4ade80', border:'rgba(34,197,94,0.2)',   path:'/admin/professors' },
                    { icon:'📚', label:'Cours',        val: profile?.totalCourses,    textColor:'#c084fc', border:'rgba(168,85,247,0.2)',  path:'/admin/courses' },
                    { icon:'📅', label:'Événements',  val: profile?.totalEvents,     textColor:'#f0c84a', border:'rgba(196,150,48,0.2)', path:'/admin/events' },
                  ].map((s, i) => (
                    <StatCard key={s.label} {...s} navigate={navigate} index={i} />
                  ))}
                </div>
              </div>
            </div>

            {/* ════ COLONNE DROITE ════ */}
            <div className="xl:col-span-2 space-y-5">

              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-2xl"
                style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(196,150,48,0.1)' }}>
                {[
                  { key:'info',     label:'👤 Informations' },
                  { key:'password', label:'🔒 Mot de passe' },
                  { key:'account',  label:'🛡️ Compte' },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold warriors-font transition-all"
                    style={activeTab === tab.key
                      ? { background:'linear-gradient(135deg,#c49630,#f0c84a)',color:'#0a1628' }
                      : { color:'rgba(148,163,184,0.45)' }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ══ ONGLET INFORMATIONS ══ */}
              {activeTab === 'info' && (
                <form onSubmit={handleSaveProfile} className="rounded-3xl p-7 animate-in space-y-5"
                  style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(196,150,48,0.1)' }}>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="warriors-title font-bold text-base" style={{ color:'#e8eaf0' }}>Informations personnelles</h3>
                    <span className="warriors-font text-[10px] px-2.5 py-1 rounded-full"
                      style={{ background:'rgba(196,150,48,0.08)',border:'1px solid rgba(196,150,48,0.18)',color:'rgba(196,150,48,0.6)' }}>
                      Modifiable
                    </span>
                  </div>

                  {/* Avatar section dans le form */}
                  <div className="flex items-center gap-5 p-4 rounded-2xl"
                    style={{ background:'rgba(196,150,48,0.03)',border:'1px solid rgba(196,150,48,0.1)' }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                      style={{ background: getAvatarGrad(profile?.id || 0), boxShadow:'0 4px 20px rgba(0,0,0,0.35)' }}>
                      {form.avatarEmoji}
                    </div>
                    <div className="flex-1">
                      <p className="warriors-title font-bold text-sm" style={{ color:'#e8eaf0' }}>
                        {form.prenom || 'Prénom'} {form.nom || 'Nom'}
                      </p>
                      <p className="warriors-font text-xs mt-0.5" style={{ color:'rgba(196,150,48,0.5)' }}>{profile?.role || 'ADMIN'}</p>
                    </div>
                    <button type="button" onClick={() => setShowAvatarPicker(s => !s)}
                      className="px-3 py-2 rounded-xl warriors-font text-xs font-semibold transition-all"
                      style={{ background:'rgba(196,150,48,0.08)',border:'1px solid rgba(196,150,48,0.2)',color:'#f0c84a' }}>
                      Changer l'icône
                    </button>
                  </div>

                  {/* Inline avatar picker in form */}
                  {showAvatarPicker && (
                    <div className="p-4 rounded-2xl animate-in"
                      style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(196,150,48,0.1)' }}>
                      <div className="grid grid-cols-11 gap-1.5">
                        {AVATARS.map(a => (
                          <button key={a} type="button"
                            onClick={() => { setForm(p => ({ ...p, avatarEmoji: a })); setShowAvatarPicker(false); }}
                            className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
                            style={{
                              background: form.avatarEmoji === a ? 'linear-gradient(135deg,#c49630,#f0c84a)' : 'rgba(255,255,255,0.04)',
                              border: `1.5px solid ${form.avatarEmoji === a ? '#c49630' : 'transparent'}`,
                              transform: form.avatarEmoji === a ? 'scale(1.1)' : 'scale(1)',
                            }}>
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Champs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <LabelRow label="PRÉNOM *" error={formErrors.prenom} />
                      <input name="prenom" value={form.prenom} onChange={handleFormChange}
                        placeholder="Votre prénom…" className={inp(!!formErrors.prenom)} />
                    </div>
                    <div>
                      <LabelRow label="NOM *" error={formErrors.nom} />
                      <input name="nom" value={form.nom} onChange={handleFormChange}
                        placeholder="Votre nom…" className={inp(!!formErrors.nom)} />
                    </div>
                    <div className="sm:col-span-2">
                      <LabelRow label="EMAIL *" error={formErrors.email} />
                      <input name="email" type="email" value={form.email} onChange={handleFormChange}
                        placeholder="votre@email.com" className={inp(!!formErrors.email)} />
                    </div>
                    <div className="sm:col-span-2">
                      <LabelRow label="TÉLÉPHONE" />
                      <input name="phoneNumber" value={form.phoneNumber} onChange={handleFormChange}
                        placeholder="+212 6XX XXX XXX" className={inp(false)} />
                    </div>
                    <div className="sm:col-span-2">
                      <LabelRow label="BIO" />
                      <textarea name="bio" value={form.bio} onChange={handleFormChange} rows={3}
                        placeholder="Quelques mots sur vous…"
                        className={`${inp(false)} resize-none`} />
                      <p className="warriors-font text-[10px] mt-1.5" style={{ color:'rgba(148,163,184,0.3)' }}>
                        Apparaît sur votre carte de profil
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={saving}
                      className="btn-gold flex items-center gap-2 px-8 py-3 rounded-xl warriors-title text-sm font-bold disabled:opacity-50"
                      style={{ color:'#0a1628' }}>
                      {saving ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-[#0a1628]/30 border-t-[#0a1628] spin-slow" />
                          Sauvegarde…
                        </>
                      ) : '💾 Sauvegarder le profil'}
                    </button>
                  </div>
                </form>
              )}

              {/* ══ ONGLET MOT DE PASSE ══ */}
              {activeTab === 'password' && (
                <form onSubmit={handleChangePassword} className="rounded-3xl p-7 animate-in space-y-5"
                  style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(196,150,48,0.1)' }}>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="warriors-title font-bold text-base" style={{ color:'#e8eaf0' }}>Changer le mot de passe</h3>
                  </div>
                  <p className="warriors-font text-sm" style={{ color:'rgba(148,163,184,0.4)' }}>
                    Choisissez un mot de passe fort d'au moins 8 caractères.
                  </p>

                  {/* Indicateur de force */}
                  {pwForm.newPassword && (
                    <div className="p-4 rounded-2xl animate-in"
                      style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(196,150,48,0.1)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="warriors-font text-[10px] tracking-widest" style={{ color:'rgba(148,163,184,0.4)' }}>FORCE DU MOT DE PASSE</p>
                        <p className="warriors-font text-[11px] font-bold" style={{ color: STRENGTH_COLORS[strength] }}>
                          {STRENGTH_LABELS[strength]}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                            style={{ background: i <= strength ? STRENGTH_COLORS[strength] : 'rgba(255,255,255,0.07)' }} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Champs mot de passe */}
                  {[
                    { key:'cur',  name:'currentPassword', label:'MOT DE PASSE ACTUEL',  showKey:'cur' },
                    { key:'nw',   name:'newPassword',      label:'NOUVEAU MOT DE PASSE', showKey:'nw'  },
                    { key:'conf', name:'confirmPassword',  label:'CONFIRMER',            showKey:'conf' },
                  ].map(field => (
                    <div key={field.key}>
                      <LabelRow label={field.label} error={pwErrors[field.key]} />
                      <div className="relative">
                        <input
                          name={field.name}
                          type={showPw[field.showKey] ? 'text' : 'password'}
                          value={pwForm[field.name]}
                          onChange={e => {
                            setPwForm(p => ({ ...p, [field.name]: e.target.value }));
                            if (pwErrors[field.key]) setPwErrors(p => ({ ...p, [field.key]: '' }));
                          }}
                          placeholder="••••••••"
                          className={`${inp(!!pwErrors[field.key])} pr-12`}
                        />
                        <button type="button"
                          onClick={() => setShowPw(p => ({ ...p, [field.showKey]: !p[field.showKey] }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 warriors-font text-sm transition-colors"
                          style={{ color:'rgba(148,163,184,0.3)' }}
                          onMouseEnter={e => e.currentTarget.style.color='rgba(196,150,48,0.6)'}
                          onMouseLeave={e => e.currentTarget.style.color='rgba(148,163,184,0.3)'}>
                          {showPw[field.showKey] ? '🙈' : '👁'}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Règles */}
                  <div className="grid grid-cols-2 gap-2 p-4 rounded-2xl"
                    style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(196,150,48,0.08)' }}>
                    {[
                      { rule: pwForm.newPassword.length >= 8,          label:'8 caractères min.' },
                      { rule: /[A-Z]/.test(pwForm.newPassword),         label:'Une majuscule' },
                      { rule: /[0-9]/.test(pwForm.newPassword),         label:'Un chiffre' },
                      { rule: /[^A-Za-z0-9]/.test(pwForm.newPassword),  label:'Caractère spécial' },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center gap-2 warriors-font text-xs transition-colors"
                        style={{ color: r.rule ? '#4ade80' : 'rgba(148,163,184,0.3)' }}>
                        <span>{r.rule ? '✓' : '○'}</span>
                        <span>{r.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={saving}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl warriors-title text-sm font-bold disabled:opacity-50 transition-all"
                      style={{ background:'linear-gradient(135deg,#1d4ed8,#3b82f6)',color:'#fff',boxShadow:'0 4px 20px rgba(59,130,246,0.25)' }}>
                      {saving ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white spin-slow" />
                          Modification…
                        </>
                      ) : '🔒 Changer le mot de passe'}
                    </button>
                  </div>
                </form>
              )}

              {/* ══ ONGLET COMPTE ══ */}
              {activeTab === 'account' && (
                <div className="space-y-5 animate-in">
                  {/* Infos compte */}
                  <div className="rounded-3xl p-7"
                    style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(196,150,48,0.1)' }}>
                    <h3 className="warriors-title font-bold text-base mb-6" style={{ color:'#e8eaf0' }}>Informations du Compte</h3>
                    <div className="space-y-1">
                      {[
                        { icon:'🏷️', label:'Identifiant',         val:`#${profile?.id || '—'}` },
                        { icon:'🛡️', label:"Niveau d'accès",      val: profile?.role || 'ADMIN' },
                        { icon:'✅', label:'Statut du compte',      val: profile?.isEnabled ? 'Actif et vérifié' : 'Inactif' },
                        { icon:'📅', label:'Compte créé le',        val: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR',{dateStyle:'long'}) : '—' },
                        { icon:'🕐', label:'Dernière connexion',    val: profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString('fr-FR',{dateStyle:'medium',timeStyle:'short'}) : '—' },
                      ].map(({ icon, label, val }) => (
                        <div key={label} className="flex items-center gap-4 py-3"
                          style={{ borderBottom:'1px solid rgba(196,150,48,0.06)' }}>
                          <span className="text-base w-6 text-center flex-shrink-0">{icon}</span>
                          <span className="warriors-font text-sm flex-1" style={{ color:'rgba(148,163,184,0.45)' }}>{label}</span>
                          <span className="warriors-font text-sm font-semibold" style={{ color:'rgba(200,210,225,0.7)' }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Zone danger */}
                  <div className="rounded-3xl p-7"
                    style={{ background:'rgba(239,68,68,0.04)',border:'1px solid rgba(239,68,68,0.12)' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.2)' }}>⚠</div>
                      <h3 className="warriors-title font-bold text-sm" style={{ color:'rgba(248,113,113,0.8)' }}>Zone de danger</h3>
                    </div>
                    <p className="warriors-font text-xs mb-5" style={{ color:'rgba(148,163,184,0.35)' }}>
                      Ces actions sont irréversibles. Procédez avec précaution.
                    </p>
                    <button onClick={() => { localStorage.clear(); navigate('/login'); }}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl warriors-font text-sm font-bold transition-all"
                      style={{ background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',color:'#f87171' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.16)'}
                      onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}>
                      🚪 Se déconnecter de toutes les sessions
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