import { Outlet } from 'react-router-dom';
import { TransactionProvider } from '../../context/TransactionContext';
import Sidebar from '../navigation/Sidebar';

export default function DashboardLayout() {
  return (
    <TransactionProvider>
      <div className="min-h-screen bg-surface">
        <Sidebar />
        {/* Main content area */}
        <main className="lg:ml-64 min-h-screen">
          {/* Mobile top padding for header */}
          <div className="lg:hidden h-14" />
          <div className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
            <Outlet />
          </div>
          {/* Mobile bottom padding for nav */}
          <div className="lg:hidden h-16" />
        </main>
      </div>
    </TransactionProvider>
  );
}
