import React, { useState, useEffect } from 'react';
import warriosImg from "./../assets/warrios.png";
import { Link } from "react-router-dom";
import api from '../services/api';

/* ─── CSS injection ─── */
if (!document.getElementById('home-warriors-style')) {
  const s = document.createElement('style');
  s.id = 'home-warriors-style';
  s.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
    @keyframes twinkle { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
    @keyframes floatOrb { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} }
    @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.2)} }
    @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .home-anim-in { animation: fadeInUp 0.8s ease-out forwards; }
    .home-anim-in-delay { animation: fadeInUp 0.8s ease-out 0.5s forwards; opacity: 0; }
    .shimmer-box { animation: shimmer 1.6s ease-in-out infinite; }
  `;
  document.head.appendChild(s);
}

/* ─── API calls ─── */
const fetchProfessors = () => api.get('/professors').then(r => r.data);
const fetchEvents     = () => api.get('/events/upcoming').then(r => r.data);
const fetchStats      = () => api.get('/students/stats').then(r => r.data);
const fetchCourses    = () => api.get('/courses').then(r => r.data);

/* ─── Skeleton loader ─── */
const Skeleton = ({ w = '100%', h = '1rem', rounded = 'rounded-lg', className = '' }) => (
  <div
    className={`shimmer-box ${rounded} ${className}`}
    style={{ width: w, height: h, background: 'rgba(212,167,71,0.08)' }}
  />
);

/* ─── Professor Card ─── */
const BASE_URL = 'http://localhost:8080';

const ProfessorCard = ({ prof }) => {
  const hasPhoto = prof.avatarType === 'photo' && prof.photoUrl;
  const photoSrc = hasPhoto
    ? (prof.photoUrl.startsWith('http') ? prof.photoUrl : `${BASE_URL}/${prof.photoUrl}`)
    : null;

  return (
    <div
      className="relative bg-white/[0.03] backdrop-blur-xl border border-yellow-500/10 rounded-3xl p-10 transition-all duration-300 overflow-hidden group"
      style={{ transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s' }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
        e.currentTarget.style.borderColor = 'rgba(212,167,71,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(212,167,71,0.1)';
      }}
    >
      {/* Top stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4a747] to-[#f4d677] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

      <div className="flex justify-center mb-7">
        <div className="relative w-28 h-28 rounded-full border-[3px] border-yellow-500/30 group-hover:border-[#d4a747] group-hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#2a3f5f,#1a2942)', boxShadow: '0 0 0 0 rgba(212,167,71,0)' }}>
          {hasPhoto
            ? <img src={photoSrc} alt={prof.prenom} className="w-full h-full object-cover" />
            : <span className="text-5xl">{prof.avatarEmoji || '👨‍🏫'}</span>
          }
        </div>
        <span className="absolute bottom-0 right-0 px-3 py-1 bg-gradient-to-br from-[#d4a747] to-[#f4d677] text-[#0a1628] rounded-full text-[10px] font-bold tracking-wider">
          {prof.experienceLevel || 'Expert'}
        </span>
      </div>

      <div className="text-center">
        <h3 className="font-['Space_Grotesk'] text-xl font-bold mb-1 bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent">
          {prof.prenom} {prof.nom}
        </h3>
        <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-widest mb-4">
          {prof.specialite}
        </p>
        {prof.bio && (
          <p className="text-[#cbd5e1] text-sm leading-relaxed mb-5 line-clamp-3">{prof.bio}</p>
        )}
        {prof.matieres && prof.matieres.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {prof.matieres.slice(0, 3).map((m, i) => (
              <span key={i} className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[#f4d677] text-[10px] font-semibold">
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Event Card ─── */
const EventCard = ({ event }) => {
  const date = event.eventDate ? new Date(event.eventDate) : null;
  const day   = date ? date.getDate() : '??';
  const month = date ? date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase() : '???';

  return (
    <div
      className="relative bg-white/[0.03] backdrop-blur-xl border border-yellow-500/10 rounded-3xl p-10 mb-8 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-10 transition-all duration-250"
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(10px)'; e.currentTarget.style.borderColor = 'rgba(212,167,71,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = 'rgba(212,167,71,0.1)'; }}
    >
      <div className="bg-gradient-to-br from-[#d4a747] to-[#f4d677] rounded-xl p-5 text-center text-[#0a1628] flex flex-col justify-center items-center w-fit mx-auto md:mx-0">
        <div className="text-4xl font-black leading-none">{day}</div>
        <div className="text-sm font-bold uppercase tracking-wider mt-1">{month}</div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{event.coverEmoji || '📅'}</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-500/10 text-[#f4d677] border border-yellow-500/20">
            {event.eventType || 'Événement'}
          </span>
        </div>
        <h3 className="font-['Space_Grotesk'] text-xl font-bold mb-2 text-[#f4d677]">{event.title}</h3>
        {event.description && (
          <p className="text-[#cbd5e1] text-sm leading-relaxed line-clamp-2">{event.description}</p>
        )}
        <div className="flex flex-wrap gap-4 mt-3">
          {event.location && (
            <span className="text-xs text-[#94a3b8]">📍 {event.location}</span>
          )}
          {event.startTime && (
            <span className="text-xs text-[#94a3b8]">🕐 {event.startTime}</span>
          )}
          {event.maxParticipants && (
            <span className="text-xs text-[#94a3b8]">👥 {event.registeredCount || 0}/{event.maxParticipants} inscrits</span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════ */
/*  MAIN HOME COMPONENT                                      */
/* ══════════════════════════════════════════════════════════ */
const Home = () => {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [professors, setProfessors] = useState([]);
  const [events, setEvents]         = useState([]);
  const [courses, setCourses]       = useState([]);
  const [statsData, setStatsData]   = useState(null);
  const [loading, setLoading]       = useState({ professors: true, events: true, stats: true, courses: true });

  /* ── Scroll handler ── */
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 100);
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Fetch all data from backend ── */
  useEffect(() => {
    fetchProfessors()
      .then(res => {
        if (res.success) setProfessors(Array.isArray(res.data) ? res.data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(p => ({ ...p, professors: false })));

    fetchEvents()
      .then(res => {
        if (res.success) setEvents(Array.isArray(res.data) ? res.data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(p => ({ ...p, events: false })));

    fetchStats()
      .then(res => {
        if (res.success) setStatsData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(p => ({ ...p, stats: false })));

    fetchCourses()
      .then(res => {
        if (res.success) setCourses(Array.isArray(res.data) ? res.data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(p => ({ ...p, courses: false })));
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* ── Dynamic stats (from backend or fallback) ── */
  const HERO_STATS = [
    { number: statsData?.totalStudents ? `${statsData.totalStudents}+` : '500+', label: 'Étudiants Actifs' },
    { number: `${professors.length || '15'}+`,                                   label: 'Professeurs Experts' },
    { number: `${courses.length || '30'}+`,                                      label: 'Cours Disponibles' },
  ];

  /* ── Programs (built from real courses data, grouped by subject) ── */
  const PROGRAM_ICONS = { default: '📚', Mathématiques: '🔢', Physique: '⚛️', Chimie: '🧪', SVT: '🔬', Français: '📝', Anglais: '🌍', Histoire: '🏛️', Philosophie: '🧠', Informatique: '💻', Arabe: '📖' };
  const uniqueSubjects = [...new Set(courses.map(c => c.subject))].filter(Boolean).slice(0, 3);
  const programs = uniqueSubjects.length > 0
    ? uniqueSubjects.map(subject => ({
        icon: PROGRAM_ICONS[subject] || PROGRAM_ICONS.default,
        title: subject,
        description: `Formez-vous en ${subject} avec nos professeurs experts. Des cours adaptés à tous les niveaux.`,
        levels: [...new Set(courses.filter(c => c.subject === subject).map(c => c.level))].slice(0, 4),
      }))
    : [
        { icon: '👑', title: 'Leadership & Management', description: 'Développez vos compétences en gestion stratégique.', levels: ['Bac', 'Bac+1', 'Bac+2', 'Bac+3'] },
        { icon: '🔬', title: 'Sciences & Technologies',  description: 'Explorez les frontières de l\'innovation.', levels: ['Terminale', 'Première', 'Seconde'] },
        { icon: '🎨', title: 'Arts & Créativité',        description: 'Libérez votre potentiel artistique.', levels: ['Tous niveaux'] },
      ];

  /* ─────────────────────────────────────────── */
  return (
    <div className="relative min-h-screen bg-[#0a1628] text-white overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Animated background ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2942] to-[#0a1628]" />
        <div className="absolute inset-0 opacity-60" style={{
          animation: 'twinkle 15s ease-in-out infinite',
          backgroundImage: `radial-gradient(2px 2px at 20% 30%,white,transparent),radial-gradient(2px 2px at 60% 70%,white,transparent),radial-gradient(1px 1px at 50% 50%,white,transparent),radial-gradient(1px 1px at 80% 10%,white,transparent),radial-gradient(2px 2px at 90% 60%,#f4d677,transparent),radial-gradient(1px 1px at 33% 80%,#d4a747,transparent)`,
          backgroundSize: '250px 250px', backgroundRepeat: 'repeat',
        }} />
        <div className="absolute w-[500px] h-[500px] bg-[#d4a747] rounded-full -top-[10%] -left-[10%] blur-[80px] opacity-[0.12]" style={{ animation: 'floatOrb 20s ease-in-out infinite' }} />
        <div className="absolute w-[400px] h-[400px] bg-[#3b82f6] rounded-full -bottom-[10%] -right-[10%] blur-[80px] opacity-[0.12]" style={{ animation: 'floatOrb 20s ease-in-out infinite 5s' }} />
        <div className="absolute w-[350px] h-[350px] bg-[#f4d677] rounded-full top-[40%] right-[10%] blur-[80px] opacity-[0.12]" style={{ animation: 'floatOrb 20s ease-in-out infinite 10s' }} />
      </div>

      {/* ══ NAVBAR ══ */}
      <nav className={`fixed top-0 w-full z-[1000] transition-all duration-300 backdrop-blur-[20px] border-b border-yellow-500/10 ${
        isScrolled ? 'bg-[rgba(10,22,40,0.95)] shadow-lg py-3' : 'bg-[rgba(10,22,40,0.85)] py-4'
      }`}>
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
          <a href="#" className="flex items-center gap-4 no-underline hover:-translate-y-0.5 transition-transform duration-250">
            <img src={warriosImg} alt="Centre Warriors" className="h-[50px] w-auto drop-shadow-[0_4px_8px_rgba(212,167,71,0.3)]" />
            <span className="font-['Space_Grotesk'] text-xl font-bold bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent">
              Centre Warriors
            </span>
          </a>

          <ul className="hidden md:flex gap-10 list-none items-center m-0 p-0">
            {[
              { label: 'À Propos',    href: '#about' },
              { label: 'Professeurs', href: '#professeurs' },
              { label: 'Programmes',  href: '#programmes' },
              { label: 'Événements',  href: '#evenements' },
              { label: 'Contact',     href: '#contact' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href}
                  className="text-[#cbd5e1] no-underline font-medium text-[0.95rem] relative hover:text-white transition-colors duration-250"
                  style={{ '--underline': 'linear-gradient(90deg,#d4a747,#f4d677)' }}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <Link to="/login"
            className="hidden md:block px-7 py-2.5 bg-gradient-to-br from-[#d4a747] to-[#f4d677] text-[#0a1628] rounded-full font-bold text-[0.9rem] no-underline transition-all duration-250 shadow-[0_4px_12px_rgba(212,167,71,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(212,167,71,0.4)]">
            Connexion
          </Link>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center px-[5%] pt-[120px] pb-20 z-[1]">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-20 items-center">
          <div className="home-anim-in">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[#f4d677] text-[0.85rem] font-semibold tracking-wider mb-8">
              <span className="w-2 h-2 bg-[#d4a747] rounded-full" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              EXCELLENCE ÉDUCATIVE DEPUIS 2024
            </div>

            <h1 className="font-['Space_Grotesk'] text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
              <span className="block">Forgez Votre Avenir</span>
              <span className="block">Avec{' '}
                <span className="bg-gradient-to-br from-[#d4a747] via-[#f4d677] to-white bg-clip-text text-transparent"
                  style={{ backgroundSize: '200% 200%', animation: 'gradientShift 5s ease infinite' }}>
                  Centre Warriors
                </span>
              </span>
            </h1>

            <p className="text-lg text-[#cbd5e1] leading-relaxed max-w-[600px] mb-12">
              Transformez votre détermination en succès académique et professionnel dans un environnement d'excellence où chaque étudiant devient un guerrier prêt à conquérir les défis du monde moderne.
            </p>

            <div className="flex gap-5 flex-wrap mb-12">
              <a href="#programmes"
                className="px-8 py-4 rounded-full font-bold text-base no-underline inline-flex items-center gap-2 bg-gradient-to-br from-[#d4a747] to-[#f4d677] text-[#0a1628] shadow-[0_8px_20px_rgba(212,167,71,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(212,167,71,0.4)] transition-all duration-250">
                Découvrir nos Programmes <span>→</span>
              </a>
              <a href="#contact"
                className="px-8 py-4 rounded-full font-bold text-base no-underline inline-flex items-center gap-2 bg-white/5 text-white border-2 border-yellow-500/30 hover:bg-yellow-500/10 hover:border-[#d4a747] hover:-translate-y-1 transition-all duration-250">
                Prendre Rendez-vous
              </a>
            </div>

            {/* Dynamic stats */}
            <div className="grid grid-cols-3 gap-6">
              {HERO_STATS.map(({ number, label }) => (
                <div key={label} className="text-center p-5 bg-white/[0.03] border border-yellow-500/10 rounded-xl hover:bg-yellow-500/5 hover:border-yellow-500/30 hover:-translate-y-1 transition-all duration-250">
                  {loading.stats && loading.professors
                    ? <Skeleton h="2rem" className="mb-2" />
                    : <div className="font-['Space_Grotesk'] text-3xl font-extrabold bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent mb-1">{number}</div>
                  }
                  <div className="text-xs text-[#94a3b8] font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="home-anim-in-delay flex justify-center items-center">
            <img src={warriosImg} alt="Centre Warriors"
              className="w-full max-w-[480px] h-auto drop-shadow-[0_20px_40px_rgba(212,167,71,0.3)]"
              style={{ animation: 'floatOrb 6s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="relative px-[5%] py-24 z-[1]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[#f4d677] text-[0.85rem] font-semibold tracking-wider mb-6">NOTRE MISSION</div>
            <h2 className="font-['Space_Grotesk'] text-5xl font-extrabold mb-6">
              À Propos du <span className="bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent">Centre Warriors</span>
            </h2>
            <p className="text-lg text-[#cbd5e1] max-w-[700px] mx-auto leading-relaxed">
              Depuis plus de 15 ans, nous cultivons l'excellence éducative en transformant chaque étudiant en un guerrier académique doté des compétences et de la détermination nécessaires.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h3 className="font-['Space_Grotesk'] text-3xl font-bold mb-5 text-[#f4d677]">Notre Vision</h3>
              <p className="text-[#cbd5e1] leading-relaxed mb-5">
                Nous croyons fermement que chaque individu possède un potentiel unique qui ne demande qu'à être révélé. Notre approche pédagogique innovante combine rigueur académique, développement personnel et préparation professionnelle pour créer des leaders de demain.
              </p>
              <p className="text-[#cbd5e1] leading-relaxed">
                Au Centre Warriors, nous ne formons pas seulement des étudiants — nous forgeons des champions capables de relever les défis du XXIe siècle avec confiance, créativité et détermination.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-7">
              {[
                { icon: '🎯', title: 'Excellence Académique',       desc: 'Programmes certifiés et reconnus' },
                { icon: '💡', title: 'Innovation Pédagogique',      desc: 'Méthodes d\'enseignement modernes' },
                { icon: '🤝', title: 'Accompagnement Personnalisé', desc: 'Suivi individuel et coaching' },
                { icon: '🌍', title: 'Réseau International',        desc: 'Partenariats avec institutions mondiales' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-[#d4a747] to-[#f4d677] rounded-lg flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                  <div>
                    <h4 className="text-base font-bold mb-0.5 text-white">{title}</h4>
                    <p className="text-sm text-[#94a3b8] m-0">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROFESSORS ══ */}
      <section id="professeurs" className="relative px-[5%] py-24 z-[1]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[#f4d677] text-[0.85rem] font-semibold tracking-wider mb-6">NOTRE ÉQUIPE</div>
            <h2 className="font-['Space_Grotesk'] text-5xl font-extrabold mb-6">
              Nos <span className="bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent">Professeurs</span>
            </h2>
            <p className="text-lg text-[#cbd5e1] max-w-[700px] mx-auto leading-relaxed">
              Une équipe d'experts passionnés et dévoués à votre réussite académique et professionnelle
            </p>
          </div>

          {loading.professors ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/[0.02] border border-yellow-500/07 rounded-3xl p-10 space-y-4">
                  <Skeleton h="7rem" rounded="rounded-full" w="7rem" className="mx-auto" />
                  <Skeleton h="1.2rem" w="70%" className="mx-auto" />
                  <Skeleton h="0.8rem" w="50%" className="mx-auto" />
                  <Skeleton h="3rem" />
                </div>
              ))}
            </div>
          ) : professors.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block opacity-30">👨‍🏫</span>
              <p className="text-[#94a3b8]">Aucun professeur enregistré pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {professors.map((prof, i) => <ProfessorCard key={prof.id || i} prof={prof} />)}
            </div>
          )}
        </div>
      </section>

      {/* ══ PROGRAMS (built from real courses) ══ */}
      <section id="programmes" className="relative px-[5%] py-24 z-[1]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[#f4d677] text-[0.85rem] font-semibold tracking-wider mb-6">NOS PROGRAMMES</div>
            <h2 className="font-['Space_Grotesk'] text-5xl font-extrabold mb-6">
              Formations d'<span className="bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent">Excellence</span>
            </h2>
            <p className="text-lg text-[#cbd5e1] max-w-[700px] mx-auto leading-relaxed">
              {loading.courses
                ? 'Chargement des programmes...'
                : `${courses.length} cours disponibles répartis dans ${programs.length} domaines d'expertise`
              }
            </p>
          </div>

          {loading.courses ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/[0.02] border border-yellow-500/07 rounded-3xl p-10 space-y-4">
                  <Skeleton h="3rem" w="3rem" />
                  <Skeleton h="1.5rem" w="60%" />
                  <Skeleton h="4rem" />
                  {[...Array(4)].map((__, j) => <Skeleton key={j} h="1rem" />)}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {programs.map((prog, i) => (
                <div key={i}
                  className="relative bg-white/[0.03] backdrop-blur-xl border border-yellow-500/10 rounded-3xl p-10 transition-all duration-300 overflow-hidden group"
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = 'rgba(212,167,71,0.3)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,167,71,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4a747] to-[#f4d677] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  <div className="flex items-center gap-5 mb-7">
                    <span className="text-5xl drop-shadow-[0_4px_8px_rgba(212,167,71,0.3)]">{prog.icon}</span>
                    <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#f4d677] m-0">{prog.title}</h3>
                  </div>
                  <p className="text-[#cbd5e1] leading-relaxed mb-7 text-sm">{prog.description}</p>
                  <ul className="list-none flex flex-col gap-3 p-0 m-0">
                    {prog.levels.map((lvl, j) => (
                      <li key={j} className="flex items-center gap-3 text-[#cbd5e1] text-sm py-1.5">
                        <span className="w-5 h-5 bg-gradient-to-br from-[#d4a747] to-[#f4d677] rounded-full flex items-center justify-center flex-shrink-0 text-[10px] text-[#0a1628] font-black">✓</span>
                        {lvl}
                      </li>
                    ))}
                  </ul>
                  {/* Count courses for this subject */}
                  <div className="mt-5 pt-4 border-t border-yellow-500/10">
                    <span className="text-xs text-[#94a3b8]">
                      {courses.filter(c => c.subject === prog.title).length || '—'} cours disponibles
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ EVENTS ══ */}
      <section id="evenements" className="relative px-[5%] py-24 z-[1]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[#f4d677] text-[0.85rem] font-semibold tracking-wider mb-6">PROCHAINEMENT</div>
            <h2 className="font-['Space_Grotesk'] text-5xl font-extrabold mb-6">
              Événements à <span className="bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent">Venir</span>
            </h2>
            <p className="text-lg text-[#cbd5e1] max-w-[700px] mx-auto leading-relaxed">
              Participez à nos événements exclusifs et développez votre réseau professionnel
            </p>
          </div>

          <div className="max-w-[900px] mx-auto">
            {loading.events ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/[0.02] border border-yellow-500/07 rounded-3xl p-10 mb-7 grid grid-cols-[100px_1fr] gap-8">
                  <Skeleton h="5rem" rounded="rounded-xl" />
                  <div className="space-y-3">
                    <Skeleton h="1.2rem" w="60%" />
                    <Skeleton h="3rem" />
                  </div>
                </div>
              ))
            ) : events.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block opacity-30">📅</span>
                <p className="text-[#94a3b8]">Aucun événement à venir pour le moment.</p>
              </div>
            ) : (
              events.map((evt, i) => <EventCard key={evt.id || i} event={evt} />)
            )}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="relative px-[5%] py-24 z-[1]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[#f4d677] text-[0.85rem] font-semibold tracking-wider mb-6">CONTACTEZ-NOUS</div>
            <h2 className="font-['Space_Grotesk'] text-5xl font-extrabold mb-6">
              Rejoignez <span className="bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent">Notre Communauté</span>
            </h2>
            <p className="text-lg text-[#cbd5e1] max-w-[700px] mx-auto leading-relaxed">
              Notre équipe est à votre disposition pour vous accompagner dans votre parcours vers l'excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
  {[
    { 
      icon: '📧', 
      title: 'Email',     
      info: 'warriorslearning@gmail.com',
      link: 'mailto:warriorslearning@gmail.com'
    },
    { 
      icon: '📱', 
      title: 'Téléphone', 
      info: '+212 614-145517',
      link: 'tel:+212614145517'
    },
    { 
      icon: '📍', 
      title: 'Adresse',   
      info: 'Av. Moulay Rachid, Tanger',
      link: 'https://maps.app.goo.gl/9BCn1hfVzLBpHGFF6'
    },
  ].map(({ icon, title, info, link }) => (
    
    <a
      key={title}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white/[0.03] backdrop-blur-xl border border-yellow-500/10 rounded-3xl p-10 text-center transition-all duration-300 hover:-translate-y-2.5 hover:border-yellow-500/30 hover:bg-white/[0.05]"
    >
      
      <div className="w-16 h-16 bg-gradient-to-br from-[#d4a747] to-[#f4d677] rounded-xl flex items-center justify-center text-3xl mx-auto mb-5">
        {icon}
      </div>

      <h3 className="font-['Space_Grotesk'] text-lg font-bold mb-3 text-[#f4d677]">
        {title}
      </h3>

      <p className="text-[#cbd5e1] text-sm whitespace-pre-line">
        {info}
      </p>

    </a>
  ))}
</div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-[rgba(10,22,40,0.97)] border-t border-yellow-500/10 px-[5%] pt-20 pb-8 relative z-[1]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16 pb-16 border-b border-yellow-500/10">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 mb-2">
                <img src={warriosImg} alt="Centre Warriors" className="h-[48px] w-auto" />
                <span className="font-['Space_Grotesk'] text-xl font-bold bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent">Centre Warriors</span>
              </div>
              <p className="text-[#94a3b8] text-sm leading-relaxed">
                Excellence éducative et développement personnel depuis 2024. Transformez votre potentiel en réussite concrète.
              </p>
            </div>

            {[
              { title: 'Navigation',  items: ['À Propos', 'Professeurs', 'Programmes', 'Événements', 'Contact'] },
              
              { title: 'Programmes',  items: courses.slice(0, 4).map(c => c.title).filter(Boolean).concat(['Tous les cours']) },
              { title: 'Ressources',  items: ['Blog', 'Actualités', 'Témoignages', 'FAQ'] },
            ].map(({ title, items }) => (
              <div key={title}>
                <h4 className="font-['Space_Grotesk'] text-base font-bold mb-5 text-[#f4d677]">{title}</h4>
                <ul className="list-none flex flex-col gap-3 p-0 m-0">
                  {items.filter(Boolean).slice(0, 5).map(item => (
                    <li key={item}>
                      <a href="#" className="text-[#94a3b8] no-underline text-sm hover:text-[#f4d677] transition-colors duration-250">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-5 text-[#64748b] text-xs">
            <p className="m-0">© 2026 Centre Warriors. Tous droits réservés. Excellence et Détermination.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-[#d4a747] to-[#f4d677] border-none rounded-full text-[#0a1628] text-xl cursor-pointer transition-all duration-250 z-[999] shadow-xl hover:-translate-y-1 ${showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        ↑
      </button>
    </div>
  );
};

export default Home;