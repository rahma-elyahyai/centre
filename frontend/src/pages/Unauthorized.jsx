// src/pages/Unauthorized.js
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#d4a747] mb-4">403</h1>
        <p className="text-xl mb-8">Accès non autorisé</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-br from-[#d4a747] to-[#f4d677] text-[#0a1628] rounded-xl font-bold"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;