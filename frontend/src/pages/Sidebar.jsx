// src/components/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/warrios.png';
const menuItems = [
  { id: 'dashboard', icon: '▦', label: 'Dashboard', path: '/admin/dashboard' },
  { id: 'students', icon: '◎', label: 'Étudiants', path: '/admin/students' },
  { id: 'professors', icon: '✦', label: 'Professeurs', path: '/admin/professors' },
  { id: 'courses', icon: '▣', label: 'Cours', path: '/admin/courses' },
  { id: 'events', icon: '◈', label: 'Événements', path: '/admin/events' },
  { id: 'finance', icon: '◆', label: 'Finances', path: '/admin/finance' },
  { id: 'settings', icon: '◉', label: 'Paramètres', path: '/admin/profil' },
];

const Sidebar = ({ activeItem = 'Dashboard ', collapsed, onToggle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <>
      {/* Inject custom font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <aside
        className={`fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-[240px]'}
        `}
        style={{
          background: 'linear-gradient(180deg, #080f1e 0%, #0a1628 60%, #0d1c30 100%)',
          borderRight: '1px solid rgba(196,150,48,0.12)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.5)',
          fontFamily: '"Outfit", sans-serif',
        }}
      >
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(196,150,48,0.5), transparent)' }} />

        {/* Logo */}
{/* Logo Header */}
<div
  className="relative border-b flex items-center px-4"
  style={{
    borderColor: 'rgba(196,150,48,0.1)',
    height: collapsed ? '90px' : '72px'
  }}
>

  {/* Hamburger */}
  <button
    onClick={onToggle}
    className={`
      absolute flex flex-col gap-1 transition-all duration-300
      ${collapsed ? 'top-4 left-1/2 -translate-x-1/2' : 'right-4'}
    `}
  >
    <span className="w-6 h-[2px] bg-[#f0c84a] rounded"></span>
    <span className="w-6 h-[2px] bg-[#f0c84a] rounded"></span>
    <span className="w-6 h-[2px] bg-[#f0c84a] rounded"></span>
  </button>

  {/* Logo + Texte */}
  <div
    className={`
      flex items-center gap-4 transition-all duration-300
      ${collapsed ? 'justify-center w-full mt-6' : 'pr-16'}
    `}
  >
    <img
      src={logo}
      alt="Warriors Logo"
      className="w-10 h-10 object-contain"
    />

    {!collapsed && (
      <div>
        <p
          className="font-black text-sm tracking-[0.12em]"
          style={{ color: '#f0c84a', fontFamily: '"Sora"' }}
        >
          CENTRE
        </p>
        <p
          className="text-[10px] tracking-[0.25em]"
          style={{ color: 'rgba(196,150,48,0.45)' }}
        >
          WARRIORS
        </p>
      </div>
    )}
  </div>
</div>
        {/* Section label */}
        {!collapsed && (
          <div className="px-4 pt-5 pb-2">
            <p className="text-[9px] font-semibold tracking-[0.2em]"
              style={{ color: 'rgba(196,150,48,0.35)' }}>NAVIGATION</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {menuItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => item.path !== '#' && navigate(item.path)}
                title={collapsed ? item.label : ''}
                className={`
                  w-full flex items-center gap-3 rounded-xl transition-all duration-200
                  ${collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'}
                  ${isActive
                    ? 'text-[#0a1628]'
                    : 'text-slate-400 hover:text-slate-200'
                  }
                `}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #c49630 0%, #f0c84a 100%)'
                    : 'transparent',
                  boxShadow: isActive ? '0 4px 15px rgba(196,150,48,0.25)' : 'none',
                  ...(isActive ? {} : {}),
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(196,150,48,0.07)';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className={`text-[15px] flex-shrink-0 ${isActive ? 'text-[#0a1628]' : ''}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className={`text-[13px] font-${isActive ? '700' : '400'} tracking-wide truncate`}>
                    {item.label}
                  </span>
                )}
                {!collapsed && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0a1628] opacity-50 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 my-2 h-[1px]" style={{ background: 'rgba(196,150,48,0.08)' }} />

        {/* Bottom Controls */}
        <div className="px-2 pb-4 space-y-1">
          

          <button
            onClick={handleLogout}
            title={collapsed ? 'Déconnexion' : ''}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 transition-all duration-200 text-xs font-medium"
            style={{
              color: 'rgba(248,113,113,0.6)',
              background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.1)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
          >
            <span className="text-base">↪</span>
            {!collapsed && <span style={{ fontFamily: '"Outfit"' }}>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;