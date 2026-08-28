// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/Dashboardservice';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';
import {
  Users, GraduationCap, BookOpen, Wallet, TrendingUp, TrendingDown,
  RefreshCw, LogOut, ChevronRight, Plus, MapPin, CreditCard,
  MessageSquare, Award, CalendarDays, UserPlus, Bell, ArrowUpRight,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════ */
/*  DESIGN TOKENS — shared across the app                        */
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
    .sv-btn-ghost { background: transparent; border-color: var(--sv-border-strong); color: var(--sv-text-dim); }
    .sv-btn-ghost:hover { border-color: var(--sv-text-faint); color: var(--sv-text); background: rgba(255,255,255,0.02); }
    .sv-icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border-radius: var(--sv-radius-sm);
      border: 1px solid var(--sv-border); background: transparent; color: var(--sv-text-dim);
      transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.3s; cursor: pointer;
    }
    .sv-icon-btn:hover { background: rgba(255,255,255,0.04); color: var(--sv-text); border-color: var(--sv-border-strong); }
    .sv-icon-btn.spinning svg { animation: sv-spin 0.7s linear; }
    @keyframes sv-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .sv-card {
      background: var(--sv-surface); border: 1px solid var(--sv-border);
      border-radius: var(--sv-radius-lg); transition: border-color 0.15s;
    }
    .sv-card:hover { border-color: var(--sv-border-strong); }

    .sv-tag {
      display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600;
      padding: 3px 9px; border-radius: 6px; line-height: 1.4;
    }

    @keyframes sv-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .sv-in { animation: sv-in 0.22s ease forwards; }
    @keyframes sv-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
    .sv-shimmer { animation: sv-pulse 1.4s ease-in-out infinite; }

    .sv-row-item { transition: background 0.15s, border-color 0.15s; }
    .sv-row-item:hover { background: rgba(255,255,255,0.025); border-color: var(--sv-border-strong) !important; }

    .sv-tile { transition: transform 0.15s, border-color 0.15s; }
    .sv-tile:hover { transform: translateY(-2px); }

    .sv-avatar-stack > * { border: 2px solid var(--sv-surface); margin-left: -8px; }
    .sv-avatar-stack > *:first-child { margin-left: 0; }
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

const TONE = {
  info:    { color: 'var(--sv-info)',    soft: 'var(--sv-info-soft)',    border: 'var(--sv-info-border)' },
  violet:  { color: 'var(--sv-violet)',  soft: 'var(--sv-violet-soft)',  border: 'var(--sv-violet-border)' },
  success: { color: 'var(--sv-success)', soft: 'var(--sv-success-soft)', border: 'var(--sv-success-border)' },
  accent:  { color: 'var(--sv-accent)',  soft: 'var(--sv-accent-soft)',  border: 'var(--sv-accent-border)' },
  danger:  { color: 'var(--sv-danger)',  soft: 'var(--sv-danger-soft)',  border: 'var(--sv-danger-border)' },
};

/* Flat, muted avatar palette shared with the rest of the app */
const AVATAR_COLORS = ['#8B93E8', '#C9A24D', '#5CADC2', '#D18BA0', '#5FAE83', '#C97A6B'];
const getAvatarColor = (seed) => AVATAR_COLORS[(seed || 0) % AVATAR_COLORS.length];

/* ── Skeleton ── */
const Skeleton = ({ h = '2.5rem', w = '100%', radius = 'var(--sv-radius-sm)' }) => (
  <div className="sv-shimmer" style={{ height: h, width: w, borderRadius: radius, background: 'var(--sv-surface-2)' }} />
);

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, label, value, change, trend, tone, loading, delay = 0 }) => {
  const t = TONE[tone] || TONE.accent;
  return (
    <div className="sv-card sv-in p-5" style={{ animationDelay: `${delay}ms` }}>
      {loading ? (
        <div className="space-y-3">
          <Skeleton h="2.5rem" w="2.5rem" radius="var(--sv-radius)" />
          <Skeleton h="1.75rem" w="60%" />
          <Skeleton h="0.9rem" w="80%" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: t.soft, border: `1px solid ${t.border}` }}>
              <Icon size={19} strokeWidth={1.75} style={{ color: t.color }} />
            </div>
            {change != null && (
              <span className="sv-tag" style={{ background: trend === 'up' ? 'var(--sv-success-soft)' : 'var(--sv-danger-soft)', color: trend === 'up' ? 'var(--sv-success)' : 'var(--sv-danger)' }}>
                {trend === 'up' ? <TrendingUp size={11} strokeWidth={2} /> : <TrendingDown size={11} strokeWidth={2} />} {change}
              </span>
            )}
          </div>
          <p className="sv-heading text-[26px] font-bold leading-tight" style={{ color: 'var(--sv-text)' }}>{value}</p>
          <p className="text-[12.5px] mt-1" style={{ color: 'var(--sv-text-faint)' }}>{label}</p>
        </>
      )}
    </div>
  );
};

/* ── Avatar initiales ── */
const Avatar = ({ name, seed, size = 36, textSize = 13 }) => {
  const c = getAvatarColor(seed ?? (name ? name.charCodeAt(0) : 0));
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
  return (
    <div
      className="sv-heading font-bold flex items-center justify-center rounded-xl flex-shrink-0"
      style={{ width: size, height: size, fontSize: textSize, background: `${c}22`, color: c, border: `1px solid ${c}40` }}
    >
      {initials}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]     = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!getAuthToken()) { navigate('/login'); return; }
    setUserName(localStorage.getItem('userName') || 'Admin');
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardAPI.getDashboardData();
      console.log('Dashboard response:', res); // ← ajouter ici
      if (res.success) setData(res.data);
      else setError(res.message || 'Erreur de chargement');
    } catch (e) {
      console.error(e);
      setError('Impossible de charger le tableau de bord');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => { setRefreshing(true); loadDashboard(); };

  const stats = data ? [
    { icon: Users,         label:'Étudiants Actifs', value: data.stats.totalStudents,   change: data.stats.studentsChange,   trend: data.stats.studentsTrend,   tone:'info' },
    { icon: GraduationCap, label:'Professeurs',      value: data.stats.totalProfessors, change: data.stats.professorsChange, trend: data.stats.professorsTrend, tone:'violet' },
    { icon: BookOpen,      label:'Cours Actifs',     value: data.stats.totalCourses,    change: data.stats.coursesChange,    trend: data.stats.coursesTrend,    tone:'success' },
    { icon: Wallet,        label:'Revenus ce mois',  value: `${(data.stats.monthRevenue || 0).toLocaleString('fr-FR')} MAD`, change: data.stats.revenueChange, trend: data.stats.revenueTrend, tone:'accent' },
  ] : Array(4).fill({});

  const getStatusStyle = (status) => {
    if (!status) return {};
    const st = status.toLowerCase();
    if (st === 'actif' || st === 'active')    return { background:'var(--sv-success-soft)', color:'var(--sv-success)', border:'1px solid var(--sv-success-border)' };
    if (st === 'inactif' || st === 'inactive') return { background:'var(--sv-danger-soft)',  color:'var(--sv-danger)',  border:'1px solid var(--sv-danger-border)' };
    return { background:'var(--sv-warning-soft)', color:'var(--sv-warning)', border:'1px solid var(--sv-warning-border)' };
  };

  const ACTIVITY_ICONS = {
    INSCRIPTION: UserPlus,
    PAYMENT:     CreditCard,
    COURSE:      BookOpen,
    MESSAGE:     MessageSquare,
    CERTIFICATE: Award,
    EVENT:       CalendarDays,
  };
  const getActivityIcon = (type) => ACTIVITY_ICONS[type] || Bell;

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = (new Date() - new Date(dateStr)) / 1000;
    if (diff < 60)    return "À l'instant";
    if (diff < 3600)  return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return `Il y a ${Math.floor(diff / 86400)}j`;
  };

  const QUICK_ACTIONS = [
    { icon: UserPlus,     label:'Ajouter Étudiant', path:'/admin/students', tone:'info' },
    { icon: Wallet,       label:'Nouveau Paiement', path:'/admin/finance',  tone:'accent' },
    { icon: BookOpen,     label:'Créer un Cours',   path:'/admin/courses',  tone:'violet' },
    { icon: CalendarDays, label:'Nouvel Événement', path:'/admin/events',   tone:'success' },
  ];

  const recentStudents = data?.recentStudents || [];
  const recentActivities = data?.recentActivities || [];
  const upcomingEvents = data?.upcomingEvents || [];

  return (
    <div className="sv-root relative min-h-screen" style={{ background: 'var(--sv-bg)' }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userName={userName} />

      <div className={`relative z-10 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-8 h-16"
          style={{ background: 'rgba(10,15,28,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--sv-border)' }}
        >
          <div>
            <h1 className="sv-heading text-[18px] font-bold" style={{ color: 'var(--sv-text)' }}>Tableau de bord</h1>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>Bienvenue, {userName}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={handleRefresh} className={`sv-icon-btn ${refreshing ? 'spinning' : ''}`} title="Actualiser">
              <RefreshCw size={15} strokeWidth={1.75} />
            </button>
            <button onClick={() => navigate('/admin/profil')} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold" style={{ background: 'var(--sv-accent)', color: 'var(--sv-accent-ink)' }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && <span className="text-[12.5px] font-medium" style={{ color: 'var(--sv-text-dim)' }}>{userName}</span>}
            </button>
            <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="sv-btn px-3.5 py-2" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)', color: 'var(--sv-danger)' }}>
              <LogOut size={13} strokeWidth={1.75} /> <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        <div className="px-8 py-6 space-y-5">
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg sv-in" style={{ background: 'var(--sv-danger-soft)', border: '1px solid var(--sv-danger-border)' }}>
              <span style={{ color: 'var(--sv-danger)' }}>⚠</span>
              <span className="text-[13px]" style={{ color: '#F0A8A2' }}>{error}</span>
              <button onClick={loadDashboard} className="ml-auto text-[12px] font-semibold px-3 py-1 rounded-md" style={{ background: 'var(--sv-danger-soft)', color: 'var(--sv-danger)' }}>Réessayer</button>
            </div>
          )}

          {/* ── STATS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} loading={loading} delay={i * 50} />
            ))}
          </div>

          {/* ── BENTO GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Étudiants récents */}
            <div className="lg:col-span-2 sv-card sv-in p-5" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="sv-heading font-semibold text-[14.5px]" style={{ color: 'var(--sv-text)' }}>Étudiants récents</h2>
                  {!loading && recentStudents.length > 0 && (
                    <div className="sv-avatar-stack flex items-center">
                      {recentStudents.slice(0, 4).map((s, i) => (
                        <Avatar key={s.id || i} name={`${s.prenom} ${s.nom}`} seed={s.id} size={26} textSize={10} />
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => navigate('/admin/students')} className="flex items-center gap-1 text-[12.5px] font-semibold transition-colors" style={{ color: 'var(--sv-accent)' }}>
                  Voir tout <ChevronRight size={13} strokeWidth={2} />
                </button>
              </div>

              {loading ? (
                <div className="space-y-2.5">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-3.5 p-3 rounded-lg" style={{ background: 'var(--sv-surface-2)' }}>
                      <Skeleton h="2.5rem" w="2.5rem" radius="var(--sv-radius-sm)" />
                      <div className="flex-1 space-y-2"><Skeleton h="0.9rem" w="9rem" /><Skeleton h="0.7rem" w="6rem" /></div>
                      <Skeleton h="1.5rem" w="4rem" radius="999px" />
                    </div>
                  ))}
                </div>
              ) : recentStudents.length === 0 ? (
                <div className="py-10 text-center">
                  <Users size={28} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', margin: '0 auto 8px' }} />
                  <p className="text-[13px]" style={{ color: 'var(--sv-text-faint)' }}>Aucun étudiant récent</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentStudents.map((s, i) => (
                    <div key={s.id || i} className="sv-row-item flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
                      <div className="flex items-center gap-3">
                        <Avatar name={`${s.prenom} ${s.nom}`} seed={s.id} />
                        <div>
                          <p className="text-[13px] font-medium" style={{ color: 'var(--sv-text)' }}>{s.prenom} {s.nom}</p>
                          <p className="text-[11.5px]" style={{ color: 'var(--sv-text-faint)' }}>{s.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11.5px] mb-1" style={{ color: 'var(--sv-text-faint)' }}>{s.niveau} · {s.filiere}</p>
                        <span className="sv-tag" style={getStatusStyle(s.statut)}>{s.statut || 'Actif'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activités récentes — timeline */}
            <div className="sv-card sv-in p-5" style={{ animationDelay: '190ms' }}>
              <h2 className="sv-heading font-semibold text-[14.5px] mb-4" style={{ color: 'var(--sv-text)' }}>Activités récentes</h2>

              {loading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton h="2.25rem" w="2.25rem" radius="var(--sv-radius-sm)" />
                      <div className="flex-1 space-y-2 pt-0.5"><Skeleton h="0.8rem" w="7rem" /><Skeleton h="0.7rem" w="5rem" /></div>
                    </div>
                  ))}
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell size={28} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', margin: '0 auto 8px' }} />
                  <p className="text-[13px]" style={{ color: 'var(--sv-text-faint)' }}>Aucune activité</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-[17px] top-2 bottom-2 w-px" style={{ background: 'var(--sv-border)' }} />
                  <div className="space-y-4">
                    {recentActivities.map((act, i) => {
                      const Icon = getActivityIcon(act.type);
                      return (
                        <div key={i} className="flex gap-3 relative">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10" style={{ background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)' }}>
                            <Icon size={15} strokeWidth={1.75} style={{ color: 'var(--sv-accent)' }} />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className="text-[12.5px] font-medium truncate" style={{ color: 'var(--sv-text)' }}>{act.label}</p>
                            <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--sv-text-faint)' }}>{act.userName}</p>
                            <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--sv-text-faint)', opacity: 0.7 }}>{formatTimeAgo(act.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── ÉVÉNEMENTS À VENIR ── */}
          <div className="sv-card sv-in p-5" style={{ animationDelay: '230ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="sv-heading font-semibold text-[14.5px]" style={{ color: 'var(--sv-text)' }}>Événements à venir</h2>
              <button onClick={() => navigate('/admin/events')} className="sv-btn sv-btn-primary px-3.5 py-2">
                <Plus size={14} strokeWidth={2} /> Nouvel événement
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-4 rounded-lg space-y-3" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
                    <Skeleton h="1.5rem" w="2.5rem" radius="var(--sv-radius-sm)" />
                    <Skeleton h="0.9rem" w="10rem" />
                    <Skeleton h="0.7rem" w="6rem" />
                  </div>
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="py-10 text-center">
                <CalendarDays size={28} strokeWidth={1.5} style={{ color: 'var(--sv-text-faint)', margin: '0 auto 8px' }} />
                <p className="text-[13px]" style={{ color: 'var(--sv-text-faint)' }}>Aucun événement à venir</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {upcomingEvents.map((ev, i) => {
                  const d = ev.eventDate ? new Date(ev.eventDate) : null;
                  return (
                    <div key={ev.id || i} className="sv-row-item flex gap-3.5 p-4 rounded-lg" style={{ background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)' }}>
                      {/* Boarding-pass style date badge */}
                      <div className="flex flex-col items-center justify-center rounded-lg flex-shrink-0" style={{ width: 46, background: 'var(--sv-accent-soft)', border: '1px solid var(--sv-accent-border)' }}>
                        <span className="sv-heading text-[17px] font-bold leading-none" style={{ color: 'var(--sv-accent)' }}>{d ? d.getDate() : '—'}</span>
                        <span className="text-[9.5px] uppercase tracking-wide mt-0.5" style={{ color: 'var(--sv-accent)', opacity: 0.75 }}>
                          {d ? d.toLocaleDateString('fr-FR', { month: 'short' }) : ''}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-medium mb-1 line-clamp-2" style={{ color: 'var(--sv-text)' }}>{ev.title}</h3>
                        {ev.lieu && (
                          <p className="flex items-center gap-1 text-[11px] mb-1" style={{ color: 'var(--sv-text-faint)' }}>
                            <MapPin size={10} strokeWidth={1.75} /> {ev.lieu}
                          </p>
                        )}
                        <span className="sv-tag" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--sv-border-strong)', color: 'var(--sv-text-dim)' }}>
                          <Users size={10} strokeWidth={2} /> {ev.registeredCount ?? 0}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sv-in" style={{ animationDelay: '270ms' }}>
            {QUICK_ACTIONS.map((action, i) => {
              const t = TONE[action.tone];
              return (
                <button key={i} onClick={() => navigate(action.path)}
                  className="sv-tile sv-card flex flex-col items-center gap-2.5 p-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: t.soft, border: `1px solid ${t.border}` }}>
                    <action.icon size={19} strokeWidth={1.75} style={{ color: t.color }} />
                  </div>
                  <span className="text-[12.5px] font-medium text-center" style={{ color: 'var(--sv-text)' }}>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
