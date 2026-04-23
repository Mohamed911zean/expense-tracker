import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdDashboard, MdPayments, MdReceiptLong, MdLogout, MdOutlineWorkspacePremium } from 'react-icons/md';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { path: '/income', label: 'Income', icon: MdPayments },
  { path: '/expense', label: 'Expense', icon: MdReceiptLong },
  { path: '/acquisitions', label: 'Acquisitions', icon: MdOutlineWorkspacePremium },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface-container-lowest z-40">
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
                <item.icon className="text-xl" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User section */}
        <div className="px-4 pb-6">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low mb-2">
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-outline-variant/20 flex items-center justify-center bg-surface-container-high text-on-surface-variant font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-on-surface text-sm font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-on-surface-variant text-xs truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-error transition-smooth w-full"
          >
            <MdLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-outline-variant/20 flex items-center justify-center bg-gradient-to-br from-primary to-primary-container text-white font-bold text-base">
              V
            </div>
            <h1 className="text-on-surface font-bold text-base">Verdant</h1>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20 flex items-center justify-center bg-surface-container-high text-on-surface-variant font-bold text-xs" onClick={handleLogout}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-surface flex border-t border-outline-variant/30 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between px-1 py-1.5 w-full overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 flex-1 min-w-[60px] py-1.5 rounded-xl text-[10px] sm:text-xs font-medium transition-smooth ${
                  isActive ? 'text-primary bg-primary/5' : 'text-on-surface-variant'
                }`
              }
            >
              <item.icon className="text-[22px]" />
              <span className="truncate w-full text-center px-0.5">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-1 flex-1 min-w-[60px] py-1.5 rounded-xl text-[10px] sm:text-xs font-medium text-on-surface-variant hover:text-error transition-smooth"
          >
            <MdLogout className="text-[22px]" />
            <span className="truncate w-full text-center px-0.5">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
