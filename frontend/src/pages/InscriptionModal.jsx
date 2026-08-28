// src/components/InscriptionModal.jsx
import React, { useState } from 'react';
import { inscriptionRequestAPI } from '../services/inscriptionRequestService';

const SUBJECTS = [
  'Mathématiques', 'Physique-Chimie', 'SVT', 'Français', 'Anglais',
  'Arabe', 'Histoire-Géographie', 'Philosophie', 'Économie', 'Comptabilité', 'Informatique',
];

const NIVEAUX = [
  'Primaire', '1ère Année collège', '2ème Année collège', '3ème Année collège',
  'Tronc Commun', '1ère Bac', '2ème Bac',
];

const FILIERES = ['Sciences Mathématiques', 'Physique-Chimie', 'SVT', 'Lettres', 'Économie'];

const LIENS_PARENTE = ['Père', 'Mère', 'Frère', 'Oncle', 'Autre'];

const inputClass = (hasErr) =>
  `w-full px-4 py-3 rounded-xl text-sm bg-white/[0.04] border ${hasErr ? 'border-red-500/60' : 'border-yellow-500/15'} text-white placeholder:text-[#64748b] focus:outline-none focus:border-yellow-500/50 transition-colors`;

const InscriptionModal = ({ onClose }) => {
  const [step, setStep] = useState(0); // 0 = ville, 1 = formulaire, 2 = succès
  const [modalite, setModalite] = useState(null); // "Présentiel" | "À distance"
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const [form, setForm] = useState({
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

  const chooseVille = (choice) => {
    setModalite(choice ? 'Présentiel' : 'À distance');
    setStep(1);
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
    if (Object.keys(errs).length) { setErrors(errs); return; }

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
        modalite,
      });
      if (res.success) {
        setStep(2);
      } else {
        setServerError(res.message || "Une erreur est survenue, réessayez.");
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "Impossible d'envoyer la demande. Réessayez plus tard.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" style={{ background: 'rgba(4,9,20,0.85)', backdropFilter: 'blur(10px)' }}>
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(145deg,#0d1c30 0%,#080f1e 100%)', border: '1px solid rgba(212,167,71,0.2)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(212,167,71,0.1)' }}>
          <h2 className="font-['Space_Grotesk'] text-lg font-bold bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent">
            S'inscrire au Centre Warriors
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">

          {/* ── ÉTAPE 0 : ville ── */}
          {step === 0 && (
            <div className="space-y-6">
              <p className="text-[#cbd5e1] text-sm leading-relaxed">
                Pour te proposer le bon format de cours, dis-nous d'abord où tu te trouves.
              </p>
              <p className="font-['Space_Grotesk'] text-xl font-bold text-white text-center">Es-tu à Tanger ?</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => chooseVille(true)}
                  className="py-6 rounded-2xl font-bold text-base bg-gradient-to-br from-[#d4a747] to-[#f4d677] text-[#0a1628] hover:-translate-y-1 transition-all duration-200 shadow-[0_8px_20px_rgba(212,167,71,0.25)]">
                  Oui, je suis à Tanger
                  <div className="text-xs font-medium mt-1 opacity-70">Cours en présentiel</div>
                </button>
                <button onClick={() => chooseVille(false)}
                  className="py-6 rounded-2xl font-bold text-base bg-white/5 border-2 border-yellow-500/25 text-white hover:border-[#d4a747] hover:-translate-y-1 transition-all duration-200">
                  Cours à distance
                  <div className="text-xs font-medium mt-1 text-[#94a3b8]">Cours à distance</div>
                </button>
              </div>
            </div>
          )}

          {/* ── ÉTAPE 1 : formulaire ── */}
          {step === 1 && (
            <form onSubmit={submit} className="space-y-4">
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: 'rgba(212,167,71,0.06)', border: '1px solid rgba(212,167,71,0.15)' }}>
                <span className="text-xs text-[#94a3b8]">Formule sélectionnée</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#f4d677]">{modalite}</span>
                  <button type="button" onClick={() => setStep(0)} className="text-[10px] text-[#94a3b8] hover:text-white underline">changer</button>
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
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                  {SUBJECTS.map(m => {
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

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(0)}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-[#cbd5e1] border border-yellow-500/15 hover:bg-white/5 transition-colors">
                  ← Retour
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-br from-[#d4a747] to-[#f4d677] text-[#0a1628] disabled:opacity-50 transition-all">
                  {submitting ? 'Envoi…' : 'Envoyer ma demande'}
                </button>
              </div>
            </form>
          )}

          {/* ── ÉTAPE 2 : succès ── */}
          {step === 2 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4a747] to-[#f4d677] flex items-center justify-center text-3xl mx-auto">✓</div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">Demande envoyée !</h3>
              <p className="text-[#cbd5e1] text-sm leading-relaxed max-w-sm mx-auto">
                Merci {form.prenom} ! Notre équipe va te contacter très prochainement au {form.telephone} pour finaliser ton inscription.
              </p>
              <button onClick={onClose}
                className="mt-4 px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-br from-[#d4a747] to-[#f4d677] text-[#0a1628]">
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InscriptionModal;
