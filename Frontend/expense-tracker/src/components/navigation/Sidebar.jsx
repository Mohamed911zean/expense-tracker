import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdDashboard, MdPayments, MdReceiptLong, MdLogout, MdOutlineWorkspacePremium, MdLanguage } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

const navItems = [
  { path: '/dashboard', key: 'dashboard', icon: MdDashboard },
  { path: '/income', key: 'income', icon: MdPayments },
  { path: '/expense', key: 'expense', icon: MdReceiptLong },
  { path: '/acquisitions', key: 'acquisitions', icon: MdOutlineWorkspacePremium },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed start-0 top-0 bg-surface-container-lowest z-40">
        {/* Logo */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 flex items-center justify-center bg-gradient-to-br from-primary to-primary-container text-white font-bold text-xl">
              V
            </div>
            <div>
              <h1 className="text-on-surface font-bold text-lg text-tracking-tight">Verdant</h1>
              <p className="text-on-surface-variant text-xs font-medium">The Curator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-smooth ${
                    isActive
                      ? 'bg-surface-container-high text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`
                }
              >
                <item.icon className="text-xl shrink-0" />
                <span>{t(`nav.${item.key}`)}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User section */}
        <div className="px-4 pb-6 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low">
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-outline-variant/20 flex items-center justify-center bg-surface-container-high text-on-surface-variant font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-on-surface text-sm font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-on-surface-variant text-xs truncate">{user?.email || ''}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-smooth flex-1 cursor-pointer"
            >
              <MdLanguage className="text-xl shrink-0" />
              <span>{i18n.language === 'en' ? 'العربية' : 'EN'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium text-error hover:bg-error-container transition-smooth flex-1 cursor-pointer"
            >
              <MdLogout className="text-xl shrink-0" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-outline-variant/10 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 flex items-center justify-center bg-gradient-to-br from-primary to-primary-container text-white font-bold text-lg">
              V
            </div>
            <h1 className="text-on-surface font-bold text-lg text-tracking-tight">Verdant</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLanguage} className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container text-on-surface-variant font-bold text-xs shadow-sm hover:text-primary transition-smooth cursor-pointer">
              {i18n.language === 'en' ? 'AR' : 'EN'}
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/20 flex items-center justify-center bg-surface-container-high text-on-surface-variant font-bold text-xs shadow-sm cursor-pointer" onClick={handleLogout}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-surface/95 backdrop-blur-lg flex border-t border-outline-variant/20 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pb-safe pt-2 px-2">
        <div className="flex items-center justify-around w-full overflow-x-auto no-scrollbar gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1.5 flex-1 min-w-[64px] py-2 px-1 rounded-2xl text-[11px] sm:text-xs font-semibold transition-all duration-300 ${
                  isActive ? 'text-primary bg-primary/10 shadow-sm scale-105' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest'
                }`
              }
            >
              <item.icon className="text-2xl shrink-0" />
              <span className="truncate w-full text-center px-0.5">{t(`nav.${item.key}`)}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
