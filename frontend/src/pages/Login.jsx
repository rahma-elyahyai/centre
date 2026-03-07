// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI, setAuthToken, setUserInfo, isAuthenticated } from '../services/api';
import warriorsImg from './../assets/warrios.png';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '', // PAS D'EMAIL PAR DÉFAUT - l'utilisateur doit le saisir
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin/dashboard');
    }
    
    // Vérifier la connexion au backend
    checkBackendConnection();
    
    // Vérifier si redirection après expiration de session
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('session') === 'expired') {
      setApiError('Votre session a expiré. Veuillez vous reconnecter.');
    }
  }, [navigate, location]);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok || response.status === 0) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
        setApiError('Le serveur backend ne répond pas. Assurez-vous qu\'il est démarré.');
      }
    } catch (error) {
      setConnectionStatus('error');
      console.error('Backend connection check failed:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Le mot de passe doit contenir au moins 3 caractères';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setApiError('');
    
    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      // Stocker le token et les infos utilisateur
      setAuthToken(response.token);
      setUserInfo(response);
      
      // Rediriger selon le rôle
      if (response.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Login error details:', error);
      
      let errorMessage = 'Erreur de connexion';
      
      if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur http://localhost:8080';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'La requête a expiré. Le serveur met trop de temps à répondre.';
      } else if (error.message.includes('401') || error.message.includes('incorrect')) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else {
        errorMessage = error.message || 'Erreur lors de la connexion';
      }
      
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      });
      
      if (response.status !== 401 && response.status !== 400) {
        setConnectionStatus('connected');
        setApiError('');
        alert('Connexion au serveur réussie !');
      } else {
        setConnectionStatus('connected');
        setApiError('');
        alert('Serveur accessible mais identifiants incorrects (c\'est normal pour ce test)');
      }
    } catch (error) {
      setConnectionStatus('error');
      setApiError('Erreur de connexion au serveur: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a1628] text-white overflow-hidden font-['Inter'] flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-br from-[#1a2942] to-[#0a1628]"></div>
        <div className="absolute w-[500px] h-[500px] bg-[#d4a747] rounded-full -top-[10%] -left-[10%] blur-[80px] opacity-10"></div>
        <div className="absolute w-[400px] h-[400px] bg-[#3b82f6] rounded-full -bottom-[10%] -right-[10%] blur-[80px] opacity-10"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md px-6">
  {/* Bouton retour accueil - haut gauche */}
  <button
    onClick={() => navigate('/')}
    className="fixed top-6 left-6 flex items-center gap-2 text-[#94a3b8] hover:text-[#d4a747] transition-colors duration-250 text-sm group"
  >
    <span className="group-hover:-translate-x-1 transition-transform duration-250">←</span>
    Retour à l'accueil
  </button>
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={warriorsImg} alt="Centre Warriors Logo" className="h-20 w-auto drop-shadow-[0_8px_16px_rgba(212,167,71,0.4)]" />
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold mb-2">
            <span className="bg-gradient-to-br from-[#d4a747] to-[#f4d677] bg-clip-text text-transparent">
              Centre Warriors
            </span>
          </h1>
          <p className="text-[#cbd5e1] text-sm">Espace Administration</p>
        </div>

        {/* Login Card */}
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(212,167,71,0.2)] rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
          <div className="mb-8">
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold mb-2 text-white">Connexion</h2>
            <p className="text-[#94a3b8] text-sm">Accédez à votre tableau de bord administrateur</p>
            
          </div>

          {/* Informations de connexion depuis la base de données */}
          

          {apiError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <p className="font-semibold">Erreur de connexion</p>
                  <p>{apiError}</p>
                  {apiError.includes('backend') && (
                    <button
                      onClick={handleTestConnection}
                      className="mt-2 text-blue-400 hover:text-blue-300 underline text-xs"
                    >
                      Cliquez ici pour vérifier la connexion
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#cbd5e1] mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-[#94a3b8] text-lg">📧</span>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-[rgba(255,255,255,0.05)] border ${
                    errors.email ? 'border-red-500' : 'border-[rgba(212,167,71,0.2)]'
                  } rounded-xl text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4a747] focus:ring-2 focus:ring-[rgba(212,167,71,0.2)] transition-all duration-250`}
                  placeholder="email@exemple.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <span>⚠️</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#cbd5e1] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-[#94a3b8] text-lg">🔒</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 bg-[rgba(255,255,255,0.05)] border ${
                    errors.password ? 'border-red-500' : 'border-[rgba(212,167,71,0.2)]'
                  } rounded-xl text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4a747] focus:ring-2 focus:ring-[rgba(212,167,71,0.2)] transition-all duration-250`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94a3b8] hover:text-[#d4a747] transition-colors duration-250"
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <span>⚠️</span> {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-base transition-all duration-250 ${
                isLoading
                  ? 'bg-[#94a3b8] cursor-not-allowed'
                  : 'bg-gradient-to-br from-[#d4a747] to-[#f4d677] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(212,167,71,0.4)]'
              } text-[#0a1628] shadow-[0_8px_20px_rgba(212,167,71,0.3)] flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default Login;