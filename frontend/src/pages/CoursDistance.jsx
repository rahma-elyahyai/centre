import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import warriosImg from "./../assets/warrios.png";

/* ─────────────────────────────── STYLES ─────────────────────────────── */
if (!document.getElementById('cd-pro-style')) {
  const s = document.createElement('style');
  s.id = 'cd-pro-style';
  s.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; }

    @keyframes cdFadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes cdFadeIn   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes cdPulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.2);opacity:.5} }
    @keyframes cdFloat    { 0%,100%{transform:translateY(0)}       50%{transform:translateY(-20px)} }
    @keyframes cdGlow     { 0%,100%{box-shadow:0 0 0 0   rgba(212,167,71,.4)}
                             50%   {box-shadow:0 0 0 12px rgba(212,167,71,0)} }
    @keyframes cdBlink    { 0%,100%{opacity:.2} 50%{opacity:.55} }
    @keyframes cdSkeleton { 0%{background-position:-300% 0} 100%{background-position:300% 0} }

    .cd-fade-up   { animation: cdFadeUp  .7s cubic-bezier(.22,1,.36,1) both; }
    .cd-fade-in   { animation: cdFadeIn  .4s cubic-bezier(.22,1,.36,1) both; }

    .cd-root { font-family:'Inter',sans-serif; }
    .cd-font  { font-family:'Syne',sans-serif; }

    .cd-no-scroll::-webkit-scrollbar{display:none}
    .cd-no-scroll{-ms-overflow-style:none;scrollbar-width:none}

    /* ── Navbar ── */
    .cd-nav { position:fixed;top:0;left:0;right:0;z-index:1000;
              backdrop-filter:blur(20px) saturate(1.6);
              border-bottom:1px solid rgba(212,167,71,.1);
              transition:background .3s,padding .3s,box-shadow .3s; }
    .cd-nav.scrolled{ background:rgba(8,16,32,.97);
                       box-shadow:0 4px 32px rgba(0,0,0,.4);
                       padding-top:10px;padding-bottom:10px; }
    .cd-nav.top     { background:rgba(10,22,40,.82);padding-top:16px;padding-bottom:16px; }

    /* ── Dropdown ── */
    .cd-nav-item{position:relative;}
    .cd-dropdown{
      position:absolute;top:calc(100% + 14px);left:50%;
      transform:translateX(-50%) translateY(-10px);
      background:rgba(11,20,38,.98);backdrop-filter:blur(24px);
      border:1px solid rgba(212,167,71,.16);border-radius:20px;
      min-width:230px;padding:10px 0 12px;
      opacity:0;pointer-events:none;
      transition:opacity .2s,transform .2s;
      box-shadow:0 24px 56px rgba(0,0,0,.6);z-index:9999; }
    .cd-nav-item:hover .cd-dropdown,.cd-dropdown:hover{
      opacity:1;pointer-events:all;transform:translateX(-50%) translateY(0); }
    .cd-dropdown::before{
      content:'';position:absolute;top:-8px;left:50%;transform:translateX(-50%);
      border:8px solid transparent;border-bottom-color:rgba(11,20,38,.98);border-top:none; }
    .cd-drop-lbl{padding:8px 18px 6px;font-family:'Syne',sans-serif;
                  font-size:10px;font-weight:700;letter-spacing:.1em;
                  text-transform:uppercase;color:#475569;}
    .cd-drop-div{height:1px;background:rgba(212,167,71,.08);margin:8px 14px;}
    .cd-drop-item{
      display:flex;align-items:center;gap:10px;padding:10px 18px;cursor:pointer;
      font-family:'Inter',sans-serif;font-size:.9rem;font-weight:500;color:#94a3b8;
      transition:background .15s,color .15s,padding-left .15s; }
    .cd-drop-item:hover{background:rgba(212,167,71,.07);color:#f4d677;padding-left:22px;}
    .cd-drop-item.active{color:#f4d677;background:rgba(212,167,71,.1);font-weight:600;}
    .cd-drop-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;
                  background:rgba(212,167,71,.3);transition:background .15s;}
    .cd-drop-item:hover .cd-drop-dot,.cd-drop-item.active .cd-drop-dot{background:#d4a747;}

    /* ── Nav pills ── */
    .cd-nav-pill{font-family:'Syne',sans-serif;font-weight:700;font-size:.85rem;
                  padding:9px 20px;border-radius:50px;cursor:pointer;border:none;
                  display:inline-flex;align-items:center;gap:7px;
                  transition:all .25s cubic-bezier(.34,1.56,.64,1);}
    .cd-nav-pill.idle{background:rgba(255,255,255,.04);color:#7c8fa8;
                       border:1.5px solid rgba(212,167,71,.1);}
    .cd-nav-pill.idle:hover{background:rgba(212,167,71,.07);color:#d4a747;
                              border-color:rgba(212,167,71,.3);transform:translateY(-2px);}
    .cd-nav-pill.on{color:#0a1628;border:1.5px solid transparent;transform:translateY(-2px);}
    .cd-nav-pill .arr{font-size:9px;opacity:.6;transition:transform .2s;margin-left:-2px;}
    .cd-nav-item:hover .arr{transform:rotate(180deg);}

    /* ── Sticky mat bar ── */
    .cd-mat-bar{position:sticky;z-index:100;background:rgba(10,22,40,.94);
                 backdrop-filter:blur(18px);border-bottom:1px solid rgba(212,167,71,.07);
                 transition:top .3s;}

    /* ── Module pills ── */
    .cd-mod-pill{font-family:'Inter',sans-serif;font-weight:600;font-size:.8rem;
                  padding:7px 16px;border-radius:50px;cursor:pointer;border:none;
                  display:inline-flex;align-items:center;gap:6px;
                  transition:all .2s;white-space:nowrap;}
    .cd-mod-pill.idle{background:rgba(255,255,255,.035);color:#64748b;
                       border:1px solid rgba(255,255,255,.07);}
    .cd-mod-pill.idle:hover{background:rgba(212,167,71,.07);color:#c8a850;
                              border-color:rgba(212,167,71,.2);}
    .cd-mod-pill.on{color:#0a1628;border:1px solid transparent;}

    /* ── Lesson card ── */
    .cd-card{background:rgba(255,255,255,.025);border:1px solid rgba(212,167,71,.09);
              border-radius:22px;overflow:hidden;display:flex;flex-direction:column;
              transition:transform .3s cubic-bezier(.34,1.56,.64,1),
                          box-shadow .3s,border-color .3s;}
    .cd-card:hover{transform:translateY(-7px);border-color:rgba(212,167,71,.25);
                    box-shadow:0 24px 48px rgba(0,0,0,.35);}
    .cd-thumb{position:relative;display:flex;align-items:center;
               justify-content:center;height:150px;overflow:hidden;}
    .cd-thumb::after{content:'';position:absolute;inset:0;
                      background:linear-gradient(to bottom,transparent 50%,rgba(8,16,30,.85));}
    .cd-play{position:relative;z-index:1;width:52px;height:52px;border-radius:50%;
              display:flex;align-items:center;justify-content:center;font-size:1.1rem;
              animation:cdGlow 2.5s ease-in-out infinite;transition:transform .25s;}
    .cd-card:hover .cd-play{transform:scale(1.12);}
    .cd-badge{position:absolute;top:12px;left:12px;z-index:2;font-size:10px;font-weight:700;
               letter-spacing:.06em;padding:4px 10px;border-radius:50px;
               font-family:'Inter',sans-serif;text-transform:uppercase;}
    .cd-badge-cours    {background:rgba(99,102,241,.18);color:#a5b4fc;border:1px solid rgba(99,102,241,.25);}
    .cd-badge-exercices{background:rgba(212,167,71,.18);color:#fbbf24;border:1px solid rgba(212,167,71,.3);}
    .cd-badge-td       {background:rgba(16,185,129,.18);color:#6ee7b7;border:1px solid rgba(16,185,129,.3);}
    .cd-dur{position:absolute;bottom:10px;right:12px;z-index:2;font-size:10px;font-weight:600;
             color:#94a3b8;background:rgba(0,0,0,.55);padding:3px 9px;border-radius:50px;
             font-family:'Inter',sans-serif;}
    .cd-card-body{padding:18px 20px 20px;display:flex;flex-direction:column;flex:1;}
    .cd-card-title{font-family:'Syne',sans-serif;font-size:.92rem;font-weight:700;
                    color:#f1f5f9;line-height:1.35;margin-bottom:4px;}
    .cd-card-sub{font-size:.76rem;font-weight:600;margin-bottom:10px;letter-spacing:.01em;}
    .cd-card-desc{font-size:.78rem;color:#64748b;line-height:1.6;flex:1;margin-bottom:16px;
                   display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
    .cd-btn-watch{display:block;text-align:center;padding:10px 0;border-radius:14px;
                   font-size:.8rem;font-weight:700;text-decoration:none;letter-spacing:.03em;
                   transition:opacity .2s,transform .2s;font-family:'Inter',sans-serif;}
    .cd-btn-watch:hover{opacity:.88;transform:translateY(-1px);}
    .cd-btn-locked{display:block;text-align:center;padding:10px 0;border-radius:14px;
                    font-size:.78rem;font-weight:500;color:#334155;
                    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
                    font-family:'Inter',sans-serif;}

    /* ── Mat header ── */
    .cd-mat-head{display:flex;align-items:center;gap:16px;padding:20px 24px;margin-bottom:22px;
                  background:rgba(255,255,255,.022);border:1px solid rgba(212,167,71,.09);border-radius:18px;}

    /* ── Gradient text ── */
    .cd-hero-text,.cd-stat-num{
      background:linear-gradient(135deg,#d4a747 0%,#f4d677 40%,#fffbe6 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

    /* ── Stars ── */
    .cd-stars{animation:cdBlink 12s ease-in-out infinite;}

    /* ── Skeleton ── */
    .cd-skel{background:linear-gradient(90deg,rgba(255,255,255,.03) 0%,rgba(212,167,71,.06) 50%,rgba(255,255,255,.03) 100%);
              background-size:300% 100%;animation:cdSkeleton 2s linear infinite;border-radius:12px;}
  `;
  document.head.appendChild(s);
}

/* ─────────────────────────────── API ─────────────────────────────── */
const fetchNiveaux = () =>
  api.get('/api/cours/niveaux').then(r => r.data);

/* ─────────────────────────────── SKELETON ─────────────────────────────── */
const Skel = ({ w = '100%', h = '1rem', r = 12, style = {} }) => (
  <div className="cd-skel" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

const CardSkeleton = () => (
  <div className="cd-card" style={{ pointerEvents: 'none' }}>
    <Skel h={150} r={0} />
    <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Skel h="1rem" w="60%" />
      <Skel h=".7rem" w="80%" />
      <Skel h="3rem" />
      <Skel h="2.4rem" r={14} style={{ marginTop: 6 }} />
    </div>
  </div>
);

/* ─────────────────────────────── LESSON CARD ─────────────────────────────── */
const LessonCard = ({ lesson, color, delay = 0 }) => {
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
        <span className="cd-dur">{lesson.duree}</span>
      </div>
      <div className="cd-card-body">
        <div className="cd-card-title">{lesson.titre}</div>
        {lesson.sousTitre && <div className="cd-card-sub" style={{ color }}>{lesson.sousTitre}</div>}
        {lesson.description && <div className="cd-card-desc">{lesson.description}</div>}
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

/* ─────────────────────────────── MATIERE SECTION ─────────────────────────────── */
const MatiereSection = ({ mat, color }) => {
  const [activeModId, setActiveModId] = useState(mat.modules?.[0]?.id);
  const mod = mat.modules?.find(m => m.id === activeModId) || mat.modules?.[0];
  const total = mat.modules?.reduce((a, m) => a + (m.seances?.length || 0), 0) || 0;

  return (
    <div className="cd-fade-in">
      {/* Matiere header */}
      <div className="cd-mat-head">
        <div style={{ width: 48, height: 48, borderRadius: 16, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
          {mat.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="cd-font" style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1.05rem' }}>{mat.nom}</div>
          {mat.description && <div style={{ fontSize: '.78rem', color: '#64748b', marginTop: 2 }}>{mat.description}</div>}
        </div>
        <div style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 50, fontSize: '.75rem', fontWeight: 600,
          background: `${color}15`, color, border: `1px solid ${color}30`, fontFamily: 'Inter,sans-serif' }}>
          {total} séance{total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Module tabs */}
      <div className="cd-no-scroll" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
        {mat.modules?.map(m => (
          <button key={m.id} onClick={() => setActiveModId(m.id)}
            className={`cd-mod-pill ${activeModId === m.id ? 'on' : 'idle'}`}
            style={activeModId === m.id ? { background: `linear-gradient(135deg,${color},#f4d677)`, boxShadow: `0 6px 20px -4px ${color}55`, border: '1px solid transparent' } : {}}>
            {m.icon && <span>{m.icon}</span>}
            {m.nom}
            <span style={{ fontSize: 10, opacity: .6, fontFamily: 'Inter,sans-serif' }}>({m.seances?.length || 0})</span>
          </button>
        ))}
      </div>

      {/* Lessons grid */}
      {mod && (
        <div key={mod.id} className="cd-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {mod.seances?.length > 0
            ? mod.seances.map((s, i) => <LessonCard key={s.id} lesson={s} color={color} delay={i * 60} />)
            : <p style={{ color: '#475569', fontSize: '.9rem', gridColumn: '1/-1', padding: '32px 0' }}>Aucune séance pour ce module pour le moment.</p>
          }
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────── MAIN ─────────────────────────────── */
export default function CoursDistance() {
  const [niveaux,  setNiveaux]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [lvlId,    setLvlId]    = useState(null);
  const [matId,    setMatId]    = useState(null);
  const [scrolled, setScrolled] = useState(false);
  /* ── Fetch data ── */
  useEffect(() => {
    setLoading(true);
    fetchNiveaux()
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setNiveaux(res.data);
          if (res.data.length > 0) setLvlId(res.data[0].id);
        } else {
          setError('Données invalides reçues du serveur.');
        }
      })
      .catch(() => setError('Impossible de charger les cours. Veuillez réessayer.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setMatId(null); }, [lvlId]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 56);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const lvl    = niveaux.find(l => l.id === lvlId);
  const effMat = matId || lvl?.matieres?.[0]?.id;
  const mat    = lvl?.matieres?.find(m => m.id === effMat) || lvl?.matieres?.[0];

  return (
    <div className="cd-root relative min-h-screen bg-[#080f1e] text-white overflow-x-hidden">

      {/* ── Background ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#0c1a31 0%,#080f1e 55%,#050c18 100%)' }} />
        <div className="cd-stars" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(1.5px 1.5px at 10% 18%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 72% 62%,rgba(255,255,255,.5),transparent),radial-gradient(1.5px 1.5px at 88% 10%,rgba(244,214,119,.6),transparent),radial-gradient(1px 1px at 35% 82%,rgba(255,255,255,.4),transparent)',
          backgroundSize: '280px 280px', backgroundRepeat: 'repeat', opacity: .4,
        }} />
        <div style={{ position: 'absolute', width: 680, height: 680, top: '-20%', left: '-18%', background: '#d4a747', filter: 'blur(130px)', opacity: .055, animation: 'cdFloat 22s ease-in-out infinite', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, bottom: '-10%', right: '-12%', background: '#6366f1', filter: 'blur(110px)', opacity: .045, animation: 'cdFloat 27s ease-in-out infinite 9s', borderRadius: '50%' }} />
      </div>

      {/* ══ NAVBAR ══ */}  

      {/* ══ NAVBAR ══ */}
<nav className={`cd-nav ${scrolled ? 'scrolled' : 'top'}`}>
  <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
    <a href="#" className="flex items-center gap-3 no-underline">
      <img src={warriosImg} alt="Centre Warriors" style={{ height: 42, width: 'auto' }} />
      <span className="cd-font" style={{ fontSize: '1.1rem', fontWeight: 700, background: 'linear-gradient(135deg,#d4a747,#f4d677)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Centre Warriors
      </span>
    </a>

    {/* Desktop level pills — cachés sur mobile */}
    <div className="hidden md:flex items-center" style={{ gap: 4 }}>
      {loading
        ? [1,2,3].map(i => <Skel key={i} w={110} h={38} r={50} style={{ margin: '0 2px' }} />)
        : niveaux.map(lv => (
          <div key={lv.id} className="cd-nav-item">
            <button className={`cd-nav-pill ${lvlId === lv.id ? 'on' : 'idle'}`}
              onClick={() => { setLvlId(lv.id); setMatId(null); }}
              style={lvlId === lv.id ? { background: `linear-gradient(135deg,${lv.colorHex || '#d4a747'},#f4d677)`, color: '#0a1628', boxShadow: `0 8px 22px -4px ${lv.colorHex || '#d4a747'}50` } : {}}>
              {lv.emoji && <span>{lv.emoji}</span>}
              {lv.label}
              <span className="arr">▼</span>
            </button>
            <div className="cd-dropdown">
              <div className="cd-drop-lbl">{lv.fullLabel}</div>
              <div className="cd-drop-div" />
              {lv.matieres?.map(m => (
                <div key={m.id} className={`cd-drop-item ${lvlId === lv.id && effMat === m.id ? 'active' : ''}`}
                  onClick={() => { setLvlId(lv.id); setMatId(m.id); }}>
                  <span className="cd-drop-dot" />
                  {m.icon && <span style={{ fontSize: '1.1rem' }}>{m.icon}</span>}
                  {m.nom}
                </div>
              ))}
            </div>
          </div>
        ))
      }
    </div>

    {/* Droite : Accueil (desktop) + Connexion */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
      <Link to="/" 
        style={{ fontSize: '.85rem', fontWeight: 500, color: '#64748b', textDecoration: 'none' }}
        onMouseEnter={e => e.target.style.color = '#cbd5e1'}
        onMouseLeave={e => e.target.style.color = '#64748b'}>
        ← Accueil
      </Link>
      <Link to="/login" style={{ padding: '9px 20px', borderRadius: 50, fontWeight: 700, fontSize: '.82rem', textDecoration: 'none', color: '#0a1628', background: 'linear-gradient(135deg,#d4a747,#f4d677)', boxShadow: '0 4px 16px rgba(212,167,71,.3)', fontFamily: 'Syne,sans-serif', whiteSpace: 'nowrap' }}>
        Connexion
      </Link>
    </div>
  </div>
</nav>

      {/* ══ HERO ══ */}
<section className="cd-fade-up relative" style={{ 
  zIndex: 1, 
  padding: '160px 5% 80px', 
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}}>
  {/* Glow ambiance derrière le titre */}
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -60%)',
    width: 400,
    height: 200,
    background: 'radial-gradient(ellipse at center, rgba(212,167,71,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0
  }} />

  <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 1 }}>
    {/* Badge */}
    <div style={{ 
      display: 'inline-flex', alignItems: 'center', gap: 8, 
      padding: '8px 20px', borderRadius: 50, 
      background: 'rgba(212,167,71,0.1)', 
      border: '1px solid rgba(212,167,71,0.25)', 
      marginBottom: 36 
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d4a747', animation: 'cdPulse 2s ease-in-out infinite', display: 'inline-block' }} />
      <span className="cd-font" style={{ fontSize: 11, fontWeight: 600, color: '#d4a747', letterSpacing: '.12em', textTransform: 'uppercase' }}>
        Cours à Distance · Centre Warriors
      </span>
    </div>

    {/* Titre principal — beaucoup plus grand */}
    <h1 style={{ 
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 'clamp(2.5rem, 8vw, 6rem)',
      fontWeight: 200,
      lineHeight: 1.08,
      letterSpacing: '-0.05em',
      marginBottom: 18,
      color: '#fff'
    }}>
      <span style={{ display: 'block', marginBottom: 8 }}>غلب راسك تربح </span>
      <span style={{ display: 'block' }}>
        <span style={{
          background: 'linear-gradient(135deg, #d4a747 0%, #f4d677 50%, #fff 100%)',
          backgroundSize: '500% 500%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientShift 5s ease infinite'
        }}>
         كلشي 
        </span>
      </span>
    </h1>

    {/* Ligne décorative */}
    <div style={{
      width: 60,
      height: 2,
      background: 'linear-gradient(90deg, transparent, #d4a747, transparent)',
      margin: '0 auto 28px'
    }} />

{/* Description premium — accès réservé */}
<div style={{
  margin: '0 auto 48px',
  maxWidth: 680,
  padding: '28px 32px',
  background: 'rgba(8,16,30,0.6)',
  border: '1px solid rgba(212,167,71,0.2)',
  borderRadius: 24,
  backdropFilter: 'blur(12px)',
  position: 'relative',
  overflow: 'hidden'
}}>
  {/* Glow coin haut-droit */}
  <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: 'radial-gradient(circle, rgba(212,167,71,0.15), transparent 70%)', pointerEvents: 'none' }} />

  {/* Ligne icône + texte principal */}
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
    <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(212,167,71,0.12)', border: '1px solid rgba(212,167,71,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0, marginTop: 2 }}>
      🔐
    </div>
    <div style={{ textAlign: 'left' }}>
      <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>
        Les vidéos sont accessibles{' '}
        <span style={{ color: '#f4d677', fontWeight: 700 }}>uniquement aux élèves inscrits</span>.
        <br />
        <span style={{ color: '#64748b', fontSize: '.9rem' }}>Tu n'es pas encore inscrit ? Rejoins Centre Warriors dès maintenant — contacte-nous directement 👇</span>
      </p>
    </div>
  </div>

  {/* Divider */}
  <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,167,71,0.2), transparent)', marginBottom: 20 }} />

  {/* Boutons contact */}
  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>

    {/* WhatsApp */}
    <a href="https://wa.me/212772216268?text=Bonjour%20je%20veux%20des%20informations" target="_blank" rel="noopener noreferrer"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '12px 24px', borderRadius: 50, fontWeight: 700, fontSize: '.85rem', textDecoration: 'none', color: '#fff', background: 'linear-gradient(135deg,#25D366,#128C7E)', boxShadow: '0 8px 24px rgba(37,211,102,.3)', fontFamily: 'Inter,sans-serif', transition: 'transform .2s, box-shadow .2s', whiteSpace: 'nowrap' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(37,211,102,.4)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,.3)'; }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      WhatsApp
    </a>

    {/* Instagram */}
    <a href="https://instagram.com/profouhbi?igshid=YmMyMTA2M2Y%3D" target="_blank" rel="noopener noreferrer"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '12px 24px', borderRadius: 50, fontWeight: 700, fontSize: '.85rem', textDecoration: 'none', color: '#fff', background: 'linear-gradient(135deg,#833ab4 0%,#fd1d1d 50%,#fcb045 100%)', boxShadow: '0 8px 24px rgba(131,58,180,.3)', fontFamily: 'Inter,sans-serif', transition: 'transform .2s, box-shadow .2s', whiteSpace: 'nowrap' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(131,58,180,.45)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(131,58,180,.3)'; }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      Instagram
    </a>

    {/* Email */}
    
<Link to="/inscription"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '12px 24px', borderRadius: 50, fontWeight: 600, fontSize: '.85rem', textDecoration: 'none', color: '#f4d677', background: 'rgba(212,167,71,0.08)', border: '1.5px solid rgba(212,167,71,0.3)', fontFamily: 'Inter,sans-serif', transition: 'transform .2s, border-color .2s', whiteSpace: 'nowrap' }}   >   
                S'inscrire <span>→</span>
              </Link>
  </div>

  {/* Social proof micro-texte */}
  <p style={{ textAlign: 'center', fontSize: '.72rem', color: '#334155', marginTop: 16, marginBottom: 0, letterSpacing: '.04em' }}>
الاماكن جد محدودة  </p>
</div>

    {/* Stats — plus grandes avec séparateurs */}
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: 0,
      flexWrap: 'wrap',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20,
      padding: '14px 0',
      maxWidth: 720,
      margin: '0 auto'
    }}>
      {[
        { n: loading ? '…' : String(niveaux.reduce((a, l) => a + (l.matieres?.reduce((b, m) => b + (m.modules?.reduce((c, mo) => c + (mo.seances?.length || 0), 0) || 0), 0) || 0), 0)) + '+', l: 'Séances' },
        { n: loading ? '…' : `${niveaux.length}`, l: 'Niveaux' },
        { n: '∞', l: 'Accès libre' },
      ].map(({ n, l }, i, arr) => (
        <div key={l} style={{ 
          flex: 1,
          textAlign: 'center',
          padding: '0 22px',
          borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none'
        }}>
          <div className="cd-font cd-stat-num" style={{ 
            fontSize: '2.1rem', 
            fontWeight: 400, 
            lineHeight: 1,
            color: '#d4a747'
          }}>{n}</div>
          <div style={{ 
            fontSize: '.72rem', 
            color: '#475569', 
            marginTop: 4, 
            fontWeight: 400, 
            textTransform: 'uppercase', 
            letterSpacing: '.1em' 
          }}>{l}</div>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* ══ MOBILE NIVEAU + MATIERE SELECTOR ══ */}
{!loading && !error && (
  <div className="md:hidden" style={{ position: 'relative', zIndex: 10, padding: '0 5% 24px' }}>
    
    {/* Niveau pills */}
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 12 }}
      className="cd-no-scroll">
      {niveaux.map(lv => (
        <button key={lv.id}
          onClick={() => { setLvlId(lv.id); setMatId(null); }}
          style={{
            padding: '8px 18px', borderRadius: 50, fontWeight: 700, fontSize: '.82rem',
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Syne,sans-serif',
            flexShrink: 0, transition: 'all 0.2s',
            background: lvlId === lv.id
              ? `linear-gradient(135deg,${lv.colorHex || '#d4a747'},#f4d677)`
              : 'rgba(255,255,255,0.06)',
            color: lvlId === lv.id ? '#0a1628' : '#94a3b8',
            boxShadow: lvlId === lv.id ? `0 6px 18px -4px ${lv.colorHex || '#d4a747'}55` : 'none',
          }}>
          {lv.emoji} {lv.label}
        </button>
      ))}
    </div>

    {/* Matières list */}
    {lvl?.matieres && (
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}
        className="cd-no-scroll">
        {lvl.matieres.map(m => (
          <button key={m.id}
            onClick={() => setMatId(m.id)}
            style={{
              padding: '8px 16px', borderRadius: 50, fontWeight: 600, fontSize: '.8rem',
              border: '1px solid', cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'Inter,sans-serif', flexShrink: 0, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
              background: effMat === m.id ? 'rgba(212,167,71,0.12)' : 'rgba(255,255,255,0.03)',
              borderColor: effMat === m.id ? 'rgba(212,167,71,0.4)' : 'rgba(255,255,255,0.08)',
              color: effMat === m.id ? '#f4d677' : '#64748b',
            }}>
            {m.icon && <span>{m.icon}</span>}
            {m.nom}
          </button>
        ))}
      </div>
    )}
  </div>
)}

      {/* ══ CONTENT ══ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '36px 5% 24px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        {/* Error state */}
        {error && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <p style={{ color: '#ef4444', marginBottom: 20 }}>{error}</p>
            <button onClick={() => window.location.reload()}
              style={{ padding: '10px 24px', borderRadius: 50, background: 'linear-gradient(135deg,#d4a747,#f4d677)', color: '#0a1628', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Réessayer
            </button>
          </div>
        )}

        {/* Loading state — skeleton cards */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {/* Content */}
        {!loading && !error && lvl && mat && (
          <MatiereSection key={`${lvlId}-${mat.id}`} mat={mat} color={lvl.colorHex || '#d4a747'} />
        )}
      </section>

      {/* ══ CTA ══ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '12px 5% 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ borderRadius: 28, padding: '52px 40px', textAlign: 'center', background: 'linear-gradient(135deg,rgba(212,167,71,.09),rgba(212,167,71,.02))', border: '1px solid rgba(212,167,71,.14)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: .04, backgroundImage: 'radial-gradient(circle,#d4a747 1px,transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
            <h3 className="cd-font" style={{ fontSize: '1.7rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 12, position: 'relative' }}>Une question sur les cours ?</h3>
            <p style={{ color: '#475569', fontSize: '.9rem', marginBottom: 28, maxWidth: 380, margin: '0 auto 28px', position: 'relative' }}>Notre équipe pédagogique est disponible pour vous guider.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <a href="mailto:warriorslearning@gmail.com"
                style={{ padding: '11px 28px', borderRadius: 50, fontWeight: 700, fontSize: '.85rem', textDecoration: 'none', color: '#0a1628', background: 'linear-gradient(135deg,#d4a747,#f4d677)', boxShadow: '0 8px 22px rgba(212,167,71,.28)', fontFamily: 'Syne,sans-serif' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}>
                ✉ &nbsp;Nous écrire
              </a>
              <a href="tel:+212614145517"
                style={{ padding: '11px 28px', borderRadius: 50, fontWeight: 600, fontSize: '.85rem', textDecoration: 'none', color: '#94a3b8', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(212,167,71,.18)', fontFamily: 'Inter,sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,167,71,.4)'; e.currentTarget.style.color = '#f4d677'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,167,71,.18)'; e.currentTarget.style.color = '#94a3b8'; }}>
                📱 +212 614-145517
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ position: 'relative', zIndex: 1, padding: '22px 5%', borderTop: '1px solid rgba(212,167,71,.08)', background: 'rgba(5,10,20,.98)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '.75rem', color: '#334155', fontFamily: 'Inter,sans-serif' }}>© 2026 Centre Warriors · Tous droits réservés</span>
          <span style={{ fontSize: '.75rem', color: '#334155', fontFamily: 'Syne,sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>⚔ Excellence & Détermination</span>
        </div>
      </footer>

    </div>
  );
}