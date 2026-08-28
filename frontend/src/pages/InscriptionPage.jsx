// src/pages/InscriptionPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import warriosImg from '../assets/warrios.png';
import { inscriptionRequestAPI } from '../services/inscriptionRequestService';

/* ─────────────────────────────────────────────────────────────
   VIDÉO TUTORIELLE — colle ton lien YouTube ici quand elle sera prête.
   Exemple : 'https://www.youtube.com/watch?v=XXXXXXXXXXX'
   Tant que c'est vide, un emplacement "Vidéo bientôt disponible" s'affiche.
───────────────────────────────────────────────────────────── */
const TUTORIAL_VIDEO_URL = '';

const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const SUBJECTS = [
  'Mathématiques', 'Physique-Chimie', 'SVT', 'Français', 'Anglais',
  'Arabe', 'Histoire-Géographie', 'Philosophie',
];
// À distance, seule la Physique-Chimie est proposée pour le moment
const DISTANCE_SUBJECTS = ['Physique-Chimie'];
const NIVEAUX = [
  'Primaire', '1ère Année collège', '2ème Année collège', '3ème Année collège',
  'Tronc Commun', '1ère Bac', '2ème Bac',
];
const FILIERES = ['Sciences Mathématiques', 'Physique-Chimie', 'SVT', 'Lettres', 'Économie'];
const LIENS_PARENTE = ['Père', 'Mère', 'Frère', 'Oncle', 'Autre'];

const inputClass = (hasErr) =>
  `w-full px-4 py-3 rounded-xl text-sm bg-white/[0.04] border ${hasErr ? 'border-red-500/60' : 'border-yellow-500/15'} text-white placeholder:text-[#64748b] focus:outline-none focus:border-yellow-500/50 transition-colors`;

const InscriptionPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    modalite: 'Présentiel',
    prenom: '', nom: '', telephone: '', telephoneParent: '',
    lienParente: '', lienParenteAutre: '',
    niveau: '', filiere: '', matieres: [],
  });

  const h = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const toggleMatiere = (m) => {
    setForm(p => ({
      ...p,
      matieres: p.matieres.includes(m) ? p.matieres.filter(x => x !== m) : [...p.matieres, m],
    }));
    if (errors.matieres) setErrors(p => ({ ...p, matieres: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = 'Requis';
    if (!form.nom.trim()) e.nom = 'Requis';
    if (!form.telephone.trim()) e.telephone = 'Requis';
    else if (!/^0[5-7][0-9]{8}$/.test(form.telephone)) e.telephone = 'Format invalide (ex: 0612345678)';
    if (!form.telephoneParent.trim()) e.telephoneParent = 'Requis';
    else if (!/^0[5-7][0-9]{8}$/.test(form.telephoneParent)) e.telephoneParent = 'Format invalide';
    if (!form.lienParente) e.lienParente = 'Requis';
    if (form.lienParente === 'Autre' && !form.lienParenteAutre.trim()) e.lienParenteAutre = 'Précisez le lien';
    if (!form.niveau) e.niveau = 'Requis';
    if (form.matieres.length === 0) e.matieres = 'Choisissez au moins une matière';
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      document.getElementById('form-inscription')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    try {
      setSubmitting(true);
      setServerError('');
      const res = await inscriptionRequestAPI.submit({
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        telephone: form.telephone.trim(),
        telephoneParent: form.telephoneParent.trim(),
        lienParente: form.lienParente === 'Autre' ? form.lienParenteAutre.trim() : form.lienParente,
        niveau: form.niveau,
        filiere: form.filiere || null,
        matieresSouhaitees: form.matieres,
        modalite: form.modalite,
      });
      if (res.success) setSubmitted(true);
      else setServerError(res.message || 'Une erreur est survenue, réessayez.');
    } catch (err) {
      setServerError(err.response?.data?.message || "Impossible d'envoyer la demande. Réessayez plus tard.");
    } finally {
      setSubmitting(false);
    }
  };

  const embedUrl = getYoutubeEmbedUrl(TUTORIAL_VIDEO_URL);

  return (
    <div className="relative min-h-screen bg-[#0a1628] text-white overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Animated starfield background (densifié) ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2942] to-[#0a1628]" />
        {/* Couche 1 — petites étoiles nombreuses, tuile serrée */}
        <div className="absolute inset-0 opacity-70" style={{
          animation: 'ip-twinkle 15s ease-in-out infinite',
          backgroundImage: `radial-gradient(1.5px 1.5px at 10% 20%,white,transparent),radial-gradient(1px 1px at 25% 65%,white,transparent),radial-gradient(1.5px 1.5px at 40% 15%,white,transparent),radial-gradient(1px 1px at 55% 80%,white,transparent),radial-gradient(1.5px 1.5px at 70% 35%,white,transparent),radial-gradient(1px 1px at 85% 55%,white,transparent),radial-gradient(1.5px 1.5px at 95% 90%,white,transparent),radial-gradient(1px 1px at 15% 90%,white,transparent),radial-gradient(1.5px 1.5px at 60% 5%,#f4d677,transparent),radial-gradient(1px 1px at 30% 40%,#d4a747,transparent)`,
          backgroundSize: '120px 120px', backgroundRepeat: 'repeat',
        }} />
        {/* Couche 2 — étoiles plus grosses et plus espacées, pour la profondeur */}
        <div className="absolute inset-0 opacity-60" style={{
          animation: 'ip-twinkle 12s ease-in-out infinite 3s',
          backgroundImage: `radial-gradient(2px 2px at 20% 30%,white,transparent),radial-gradient(2px 2px at 60% 70%,white,transparent),radial-gradient(2px 2px at 50% 50%,white,transparent),radial-gradient(2px 2px at 80% 10%,white,transparent),radial-gradient(2.5px 2.5px at 90% 60%,#f4d677,transparent),radial-gradient(2px 2px at 33% 80%,#d4a747,transparent),radial-gradient(2px 2px at 5% 55%,white,transparent),radial-gradient(2.5px 2.5px at 75% 85%,#f4d677,transparent)`,
          backgroundSize: '250px 250px', backgroundRepeat: 'repeat',
        }} />
        <div className="absolute w-[500px] h-[500px] bg-[#d4a747] rounded-full -top-[10%] -left-[10%] blur-[80px] opacity-[0.12]" style={{ animation: 'ip-floatOrb 20s ease-in-out infinite' }} />
        <div className="absolute w-[400px] h-[400px] bg-[#3b82f6] rounded-full -bottom-[10%] -right-[10%] blur-[80px] opacity-[0.12]" style={{ animation: 'ip-floatOrb 20s ease-in-out infinite 5s' }} />
      </div>
      <style>{`
        @keyframes ip-twinkle { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        @keyframes ip-floatOrb { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} }
      `}</style>
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 backdrop-blur-[20px] border-b border-yellow-500/10" style={{ background: 'rgba(10,22,40,0.9)' }}>
        <div className="max-w-[1300px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <img src={warriosImg} alt="Centre Warriors" className="h-10 w-auto" />
            <span className="font-['Space_Grotesk'] text-lg font-bold bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent">
              Centre Warriors
            </span>
          </Link>
          <button onClick={() => navigate('/')}
            className="px-4 py-2 rounded-full text-sm font-semibold border border-yellow-500/25 text-[#cbd5e1] hover:bg-white/5 hover:border-yellow-500/40 transition-colors">
            ← Retour à l'accueil
          </button>
        </div>
      </header>

      <div className="relative z-[1] max-w-[1300px] mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-block px-5 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[#f4d677] text-[0.85rem] font-semibold tracking-wider mb-6">
            REJOINS LE CENTRE WARRIORS
          </div>
          <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-extrabold mb-4">
            Formulaire <span className="bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent">d'inscription</span>
          </h1>
          <p className="text-[#cbd5e1] max-w-xl mx-auto">
💪 Travaille mieux, progresse plus vite, réussis davantage ! Complète le formulaire et rejoins Warriors Center pour bénéficier d'un accompagnement qui t'aide à viser l'excellence.
          </p>
        </div>

        {submitted ? (
          <div className="max-w-lg mx-auto text-center py-16 px-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,167,71,0.15)' }}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4a747] to-[#f4d677] flex items-center justify-center text-3xl mx-auto mb-5">✓</div>
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold mb-3">Demande envoyée !</h2>
            <p className="text-[#cbd5e1] leading-relaxed mb-6">
              Merci {form.prenom} ! Notre équipe va te contacter très prochainement au {form.telephone} pour finaliser ton inscription.
            </p>
            <button onClick={() => navigate('/')} className="px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-br from-[#d4a747] to-[#f4d677] text-[#0a1628]">
              Retour à l'accueil
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">

            {/* ── Vidéo (en haut) ── */}
            <div>
              <div className="rounded-3xl overflow-hidden border border-yellow-500/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="aspect-video w-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#12203a,#0a1628)' }}>
                  {embedUrl ? (
                    <iframe
                      className="w-full h-full"
                      src={embedUrl}
                      title="Comment remplir le formulaire d'inscription"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center px-8">
                      <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-3xl mx-auto mb-4">▶</div>
                      <p className="font-['Space_Grotesk'] font-bold text-[#f4d677] mb-1">Vidéo bientôt disponible</p>
                      <p className="text-[#94a3b8] text-sm">On t'explique très vite comment bien remplir le formulaire, étape par étape.</p>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#f4d677] mb-2">Comment remplir le formulaire ?</h3>
                  <p className="text-[#cbd5e1] text-sm leading-relaxed">
                    Cette courte vidéo te guide champ par champ : coordonnées, niveau, filière et matières de soutien. Regarde-la avant de commencer si c'est ta première inscription.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Formulaire (en dessous) ── */}
            <form id="form-inscription" onSubmit={submit} className="space-y-5 p-7 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,167,71,0.15)' }}>

              {/* Modalité */}
              <div>
                <label className="block text-[11px] font-semibold text-[#94a3b8] mb-2 tracking-wide">FORMULE</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Présentiel', 'À distance'].map(mod => (
                    <button key={mod} type="button" onClick={() => setForm(p => ({
                        ...p,
                        modalite: mod,
                        matieres: mod === 'À distance' ? p.matieres.filter(m => DISTANCE_SUBJECTS.includes(m)) : p.matieres,
                      }))}
                      className="py-3 rounded-xl font-semibold text-sm transition-all"
                      style={{
                        background: form.modalite === mod ? 'linear-gradient(135deg,#d4a747,#f4d677)' : 'rgba(255,255,255,0.04)',
                        color: form.modalite === mod ? '#0a1628' : '#cbd5e1',
                        border: form.modalite === mod ? 'none' : '1px solid rgba(212,167,71,0.15)',
                      }}>
                      {mod}
                    </button>
                  ))}
                </div>
              </div>

              {serverError && (
                <div className="px-4 py-3 rounded-xl text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {serverError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 tracking-wide">PRÉNOM *</label>
                  <input name="prenom" value={form.prenom} onChange={h} placeholder="Prénom" className={inputClass(errors.prenom)} />
                  {errors.prenom && <p className="text-[11px] text-red-400 mt-1">{errors.prenom}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 tracking-wide">NOM *</label>
                  <input name="nom" value={form.nom} onChange={h} placeholder="Nom" className={inputClass(errors.nom)} />
                  {errors.nom && <p className="text-[11px] text-red-400 mt-1">{errors.nom}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 tracking-wide">TON TÉLÉPHONE *</label>
                <input name="telephone" type="tel" value={form.telephone} onChange={h} placeholder="06XXXXXXXX" className={inputClass(errors.telephone)} />
                {errors.telephone && <p className="text-[11px] text-red-400 mt-1">{errors.telephone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 tracking-wide">TÉLÉPHONE DU PARENT *</label>
                  <input name="telephoneParent" type="tel" value={form.telephoneParent} onChange={h} placeholder="06XXXXXXXX" className={inputClass(errors.telephoneParent)} />
                  {errors.telephoneParent && <p className="text-[11px] text-red-400 mt-1">{errors.telephoneParent}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 tracking-wide">LIEN DE PARENTÉ *</label>
                  <select name="lienParente" value={form.lienParente} onChange={h} className={inputClass(errors.lienParente)} style={{ cursor: 'pointer' }}>
                    <option value="" className="bg-[#0d1c30]">Sélectionner…</option>
                    {LIENS_PARENTE.map(l => <option key={l} value={l} className="bg-[#0d1c30]">{l}</option>)}
                  </select>
                  {errors.lienParente && <p className="text-[11px] text-red-400 mt-1">{errors.lienParente}</p>}
                </div>
              </div>

              {form.lienParente === 'Autre' && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 tracking-wide">PRÉCISER LE LIEN *</label>
                  <input name="lienParenteAutre" value={form.lienParenteAutre} onChange={h} placeholder="Ex : Tuteur, Grand-père…" className={inputClass(errors.lienParenteAutre)} />
                  {errors.lienParenteAutre && <p className="text-[11px] text-red-400 mt-1">{errors.lienParenteAutre}</p>}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 tracking-wide">NIVEAU *</label>
                  <select name="niveau" value={form.niveau} onChange={h} className={inputClass(errors.niveau)} style={{ cursor: 'pointer' }}>
                    <option value="" className="bg-[#0d1c30]">Sélectionner…</option>
                    {NIVEAUX.map(n => <option key={n} value={n} className="bg-[#0d1c30]">{n}</option>)}
                  </select>
                  {errors.niveau && <p className="text-[11px] text-red-400 mt-1">{errors.niveau}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 tracking-wide">FILIÈRE</label>
                  <select name="filiere" value={form.filiere} onChange={h} className={inputClass(false)} style={{ cursor: 'pointer' }}>
                    <option value="" className="bg-[#0d1c30]">— Non concerné —</option>
                    {FILIERES.map(f => <option key={f} value={f} className="bg-[#0d1c30]">{f}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-semibold text-[#94a3b8] tracking-wide">MATIÈRES DE SOUTIEN SOUHAITÉES *</label>
                  {errors.matieres && <span className="text-[11px] text-red-400">{errors.matieres}</span>}
                </div>
                {form.modalite === 'À distance' && (
                  <p className="text-[11px] text-[#94a3b8] mb-2.5">Pour l'instant, seule la Physique-Chimie est disponible à distance.</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(form.modalite === 'À distance' ? DISTANCE_SUBJECTS : SUBJECTS).map(m => {
                    const sel = form.matieres.includes(m);
                    return (
                      <button key={m} type="button" onClick={() => toggleMatiere(m)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-all"
                        style={{
                          background: sel ? 'rgba(212,167,71,0.12)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${sel ? 'rgba(212,167,71,0.4)' : 'rgba(255,255,255,0.08)'}`,
                          color: sel ? '#f4d677' : '#cbd5e1',
                        }}>
                        <span className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 text-[9px] font-black"
                          style={{ background: sel ? '#d4a747' : 'transparent', border: sel ? 'none' : '1.5px solid rgba(255,255,255,0.2)', color: '#0a1628' }}>
                          {sel && '✓'}
                        </span>
                        <span className="truncate">{m}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-4 rounded-xl font-bold text-base bg-gradient-to-br from-[#d4a747] to-[#f4d677] text-[#0a1628] disabled:opacity-50 transition-all hover:-translate-y-0.5">
                {submitting ? 'Envoi…' : "Envoyer ma demande d'inscription"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InscriptionPage;