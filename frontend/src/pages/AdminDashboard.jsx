// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/dashboardService';
import { getAuthToken } from '../services/api';
import Sidebar from './Sidebar';


/* ── Skeleton ── */
const Skeleton = ({ h = 'h-10', w = 'w-full', rounded = 'rounded-xl' }) => (
  <div className={`${h} ${w} ${rounded} shimmer`} style={{ background: 'rgba(196,150,48,0.06)' }} />
);

/* ── Stat Card ── */
const StatCard = ({ icon, label, value, change, trend, loading, delay = 0 }) => (
  <div className="card-hover rounded-2xl p-6 animate-in"
    style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.1)', animationDelay:`${delay}ms` }}>
    {loading ? (
      <div className="space-y-3">
        <Skeleton h="h-12" w="w-12" rounded="rounded-xl" />
        <Skeleton h="h-8" w="w-24" />
        <Skeleton h="h-4" w="w-32" />
      </div>
    ) : (
      <>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background:'linear-gradient(135deg,rgba(196,150,48,0.15),rgba(240,200,74,0.08))', border:'1px solid rgba(196,150,48,0.2)' }}>
            {icon}
          </div>
          <span className="dash-font text-xs font-bold px-2 py-1 rounded-lg"
            style={{ background: trend === 'up' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: trend === 'up' ? '#4ade80' : '#f87171' }}>
            {change}
          </span>
        </div>
        <p className="dash-title text-3xl font-black mb-1" style={{ color:'#e8eaf0' }}>{value}</p>
        <p className="dash-font text-xs" style={{ color:'rgba(148,163,184,0.55)' }}>{label}</p>
      </>
    )}
  </div>
);

/* ── Avatar initiales ── */
const Avatar = ({ name, size = 'w-9 h-9', textSize = 'text-sm' }) => {
  const grads = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#c49630,#f0c84a)',
    'linear-gradient(135deg,#3b82f6,#06b6d4)',
    'linear-gradient(135deg,#ec4899,#f43f5e)',
    'linear-gradient(135deg,#10b981,#14b8a6)',
  ];
  const idx = name ? name.charCodeAt(0) % grads.length : 0;
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
  return (
    <div className={`${size} rounded-xl flex items-center justify-center ${textSize} font-black flex-shrink-0`}
      style={{ background: grads[idx], color: '#fff' }}>
      {initials}
    </div>
  );
};

/* ══════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
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
      if (res.success) setData(res.data);
      else setError(res.message || 'Erreur de chargement');
    } catch {
      setError('Impossible de charger le tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  const stats = data ? [
    { icon:'👥', label:'Étudiants Actifs', value: data.stats.totalStudents,   change: data.stats.studentsChange,   trend: data.stats.studentsTrend   },
    { icon:'👨‍🏫', label:'Professeurs',     value: data.stats.totalProfessors, change: data.stats.professorsChange, trend: data.stats.professorsTrend },
    { icon:'📚', label:'Cours Actifs',      value: data.stats.totalCourses,    change: data.stats.coursesChange,    trend: data.stats.coursesTrend    },
    { icon:'💰', label:'Revenus ce mois',   value: `${(data.stats.monthRevenue || 0).toLocaleString('fr-FR')} MAD`, change: data.stats.revenueChange, trend: data.stats.revenueTrend },
  ] : Array(4).fill({});

  const getStatusStyle = (status) => {
    if (!status) return {};
    const s = status.toLowerCase();
    if (s === 'actif' || s === 'active')    return { background:'rgba(34,197,94,0.1)',  color:'#4ade80',  border:'1px solid rgba(34,197,94,0.2)'  };
    if (s === 'inactif' || s === 'inactive') return { background:'rgba(239,68,68,0.1)',  color:'#f87171',  border:'1px solid rgba(239,68,68,0.2)'  };
    return { background:'rgba(234,179,8,0.1)', color:'#facc15', border:'1px solid rgba(234,179,8,0.2)' };
  };

  const getActivityIcon = (type) => ({
    INSCRIPTION: '✅',
    PAYMENT:     '💳',
    COURSE:      '📖',
    MESSAGE:     '💬',
    CERTIFICATE: '🎓',
    EVENT:       '📅',
  }[type] || '📌');

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = (new Date() - new Date(dateStr)) / 1000;
    if (diff < 60)   return 'À l\'instant';
    if (diff < 3600) return `Il y a ${Math.floor(diff/60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff/3600)}h`;
    return `Il y a ${Math.floor(diff/86400)}j`;
  };

  return (
    <div className="relative min-h-screen dash-font" style={{ background:'linear-gradient(145deg,#080f1e,#060c18)' }}>

      {/* Ambient bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute" style={{ width:'600px',height:'600px',background:'radial-gradient(circle,rgba(196,150,48,0.05),transparent 70%)',top:'-15%',left:'-8%',filter:'blur(40px)' }} />
        <div className="absolute" style={{ width:'500px',height:'500px',background:'radial-gradient(circle,rgba(59,130,246,0.04),transparent 70%)',bottom:'-10%',right:'-5%',filter:'blur(40px)' }} />
        <div className="absolute inset-0" style={{ backgroundImage:'radial-gradient(circle,rgba(196,150,48,0.04) 1px,transparent 1px)',backgroundSize:'44px 44px' }} />
      </div>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
      />
      {/* ── Main ── */}
      <div className={`relative z-10 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>

        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-[72px]"
          style={{ background:'rgba(6,12,24,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(196,150,48,0.08)' }}>
          <div>
            <h1 className="dash-title text-xl font-black" style={{ color:'#e8eaf0' }}>
              Tableau de <span className="gold-text">Bord</span>
            </h1>
            <p className="dash-font text-xs mt-0.5" style={{ color:'rgba(148,163,184,0.4)' }}>Bienvenue, {userName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadDashboard}
              className="p-2.5 rounded-xl dash-font text-sm transition-all"
              style={{ background:'rgba(196,150,48,0.06)', border:'1px solid rgba(196,150,48,0.12)', color:'rgba(196,150,48,0.6)' }}
              title="Actualiser">
              🔄
            </button>
            <button onClick={() => navigate('/admin/profil')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(196,150,48,0.1)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
                style={{ background:'linear-gradient(135deg,#c49630,#f0c84a)', color:'#080f1e' }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && <span className="dash-font text-xs font-semibold" style={{ color:'rgba(200,210,225,0.7)' }}>{userName}</span>}
            </button>
            <button onClick={() => { localStorage.clear(); navigate('/login'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl dash-font text-xs font-semibold transition-all"
              style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', color:'rgba(248,113,113,0.6)' }}>
              🚪 <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        <div className="px-8 py-7 space-y-6">

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl animate-in"
              style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.15)' }}>
              <span style={{ color:'#f87171' }}>⚠</span>
              <span className="dash-font text-sm" style={{ color:'rgba(248,113,113,0.8)' }}>{error}</span>
              <button onClick={loadDashboard} className="ml-auto dash-font text-xs px-3 py-1 rounded-lg"
                style={{ background:'rgba(239,68,68,0.1)', color:'#f87171' }}>Réessayer</button>
            </div>
          )}

          {/* ── STATS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} loading={loading} delay={i * 60} />
            ))}
          </div>

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Étudiants récents */}
            <div className="lg:col-span-2 rounded-2xl p-6 animate-in"
              style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.1)', animationDelay:'200ms' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="dash-title font-bold text-base" style={{ color:'#e8eaf0' }}>Étudiants Récents</h2>
                <button onClick={() => navigate('/admin/students')}
                  className="dash-font text-xs font-semibold transition-colors" style={{ color:'rgba(196,150,48,0.6)' }}>
                  Voir tout →
                </button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.02)' }}>
                      <Skeleton h="h-10" w="w-10" rounded="rounded-xl" />
                      <div className="flex-1 space-y-2"><Skeleton h="h-4" w="w-36" /><Skeleton h="h-3" w="w-24" /></div>
                      <Skeleton h="h-6" w="w-16" rounded="rounded-full" />
                    </div>
                  ))}
                </div>
              ) : data?.recentStudents?.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-4xl mb-2 opacity-30">👥</div>
                  <p className="dash-font text-sm" style={{ color:'rgba(148,163,184,0.4)' }}>Aucun étudiant récent</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(data?.recentStudents || []).map((s, i) => (
                    <div key={s.id || i} className="flex items-center justify-between p-3.5 rounded-xl transition-all card-hover"
                      style={{ background:'rgba(255,255,255,0.015)', border:'1px solid rgba(196,150,48,0.05)' }}>
                      <div className="flex items-center gap-3">
                        <Avatar name={`${s.prenom} ${s.nom}`} />
                        <div>
                          <p className="dash-font text-sm font-semibold" style={{ color:'#e8eaf0' }}>{s.prenom} {s.nom}</p>
                          <p className="dash-font text-xs" style={{ color:'rgba(148,163,184,0.45)' }}>{s.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="dash-font text-xs mb-1.5" style={{ color:'rgba(148,163,184,0.5)' }}>{s.niveau} · {s.filiere}</p>
                        <span className="dash-font text-[10px] font-bold px-2.5 py-1 rounded-full" style={getStatusStyle(s.statut)}>
                          {s.statut || 'Actif'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activités récentes */}
            <div className="rounded-2xl p-6 animate-in"
              style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.1)', animationDelay:'250ms' }}>
              <h2 className="dash-title font-bold text-base mb-5" style={{ color:'#e8eaf0' }}>Activités Récentes</h2>

              {loading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton h="h-10" w="w-10" rounded="rounded-xl" />
                      <div className="flex-1 space-y-2 pt-1"><Skeleton h="h-4" w="w-28" /><Skeleton h="h-3" w="w-20" /></div>
                    </div>
                  ))}
                </div>
              ) : !data?.recentActivities?.length ? (
                <div className="py-12 text-center">
                  <div className="text-4xl mb-2 opacity-30">📋</div>
                  <p className="dash-font text-sm" style={{ color:'rgba(148,163,184,0.4)' }}>Aucune activité</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(data?.recentActivities || []).map((act, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                        style={{ background:'rgba(196,150,48,0.08)', border:'1px solid rgba(196,150,48,0.12)' }}>
                        {getActivityIcon(act.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="dash-font text-xs font-semibold truncate" style={{ color:'#e8eaf0' }}>{act.label}</p>
                        <p className="dash-font text-[11px] truncate" style={{ color:'rgba(148,163,184,0.5)' }}>{act.userName}</p>
                        <p className="dash-font text-[10px] mt-0.5" style={{ color:'rgba(148,163,184,0.3)' }}>{formatTimeAgo(act.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── ÉVÉNEMENTS À VENIR ── */}
          <div className="rounded-2xl p-6 animate-in"
            style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.1)', animationDelay:'300ms' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="dash-title font-bold text-base" style={{ color:'#e8eaf0' }}>Événements à Venir</h2>
              <button onClick={() => navigate('/admin/events')}
                className="btn-gold dash-font text-xs font-bold px-4 py-2 rounded-xl" style={{ color:'#080f1e' }}>
                ➕ Nouvel événement
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-5 rounded-xl space-y-3" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(196,150,48,0.06)' }}>
                    <Skeleton h="h-6" w="w-10" rounded="rounded-lg" />
                    <Skeleton h="h-4" w="w-40" />
                    <Skeleton h="h-3" w="w-24" />
                  </div>
                ))}
              </div>
            ) : !data?.upcomingEvents?.length ? (
              <div className="py-10 text-center">
                <div className="text-4xl mb-2 opacity-30">📅</div>
                <p className="dash-font text-sm" style={{ color:'rgba(148,163,184,0.4)' }}>Aucun événement à venir</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(data?.upcomingEvents || []).map((ev, i) => (
                  <div key={ev.id || i} className="p-5 rounded-xl card-hover"
                    style={{ background:'rgba(255,255,255,0.015)', border:'1px solid rgba(196,150,48,0.08)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">📅</span>
                      <span className="dash-font text-[10px] font-bold px-2 py-1 rounded-full"
                        style={{ background:'rgba(196,150,48,0.1)', border:'1px solid rgba(196,150,48,0.2)', color:'#f0c84a' }}>
                        {ev.nbParticipants ?? 0} participants
                      </span>
                    </div>
                    <h3 className="dash-font text-sm font-semibold mb-1.5 line-clamp-2" style={{ color:'#e8eaf0' }}>{ev.title}</h3>
                    <p className="dash-font text-xs" style={{ color:'rgba(148,163,184,0.45)' }}>
                      {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString('fr-FR', { dateStyle:'medium' }) : '—'}
                    </p>
                    {ev.lieu && <p className="dash-font text-[11px] mt-1" style={{ color:'rgba(148,163,184,0.35)' }}>📍 {ev.lieu}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in" style={{ animationDelay:'350ms' }}>
            {[
              { icon:'➕', label:'Ajouter Étudiant',  path:'/admin/students',   grad:'linear-gradient(135deg,#1d4ed8,#3b82f6)' },
              { icon:'💰', label:'Nouveau Paiement',   path:'/admin/finance',    grad:'linear-gradient(135deg,#c49630,#f0c84a)' },
              { icon:'📚', label:'Créer un Cours',     path:'/admin/courses',    grad:'linear-gradient(135deg,#7c3aed,#a855f7)' },
              { icon:'📅', label:'Nouvel Événement',   path:'/admin/events',     grad:'linear-gradient(135deg,#059669,#10b981)' },
            ].map((action, i) => (
              <button key={i} onClick={() => navigate(action.path)}
                className="p-5 rounded-2xl flex flex-col items-center gap-3 transition-all hover:-translate-y-1"
                style={{ background: action.grad, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
                <span className="text-3xl">{action.icon}</span>
                <span className="dash-font text-xs font-bold text-white">{action.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;