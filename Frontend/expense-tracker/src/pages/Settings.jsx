import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdLogout, MdEmail } from 'react-icons/md';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-2xl mx-auto pb-24 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-on-surface text-2xl md:text-3xl font-bold text-tracking-tight">
          {t('nav.settings', 'Settings')}
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          {t('settings.subtitle', 'Manage your account and preferences')}
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-malachite border border-outline-variant/10">
        <h2 className="text-lg font-bold text-on-surface mb-6">{t('settings.userInfo', 'User Information')}</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-on-surface-variant text-xs uppercase tracking-wider font-semibold mb-1">{t('settings.name', 'Name')}</p>
              <p className="text-on-surface font-semibold">{user?.name || 'User'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-xl shadow-sm shrink-0">
              <MdEmail />
            </div>
            <div className="min-w-0">
              <p className="text-on-surface-variant text-xs uppercase tracking-wider font-semibold mb-1">{t('settings.email', 'Email Address')}</p>
              <p className="text-on-surface font-semibold truncate">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Option at the bottom */}
      <div className="mt-12 pt-8 border-t border-outline-variant/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-base font-bold text-error bg-error-container/50 hover:bg-error-container transition-smooth cursor-pointer"
        >
          <MdLogout className="text-xl shrink-0" />
          {t('common.logout', 'Log Out')}
        </button>
      </div>
    </div>
  );
}
