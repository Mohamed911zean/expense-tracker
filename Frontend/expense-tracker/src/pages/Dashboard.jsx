import { useState, useEffect } from 'react';
import { MdAdd, MdTrendingUp, MdDownload } from 'react-icons/md';
import useTransactionStore from '../store/useTransactionStore';
import { BalanceCard, StatCard } from '../components/ui/Cards';
import { TransactionList, TransactionSkeleton } from '../components/ui/TransactionList';
import { SpendingChart, CategoryChart } from '../components/ui/Charts';
import { Modal, Button, Input, Select } from '../components/ui/FormElements';
import toast from 'react-hot-toast';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  const {
    getBalance, getTotalIncome, getTotalExpenses,
    getCategoryBreakdown, getMonthlyData,
    addIncome, addExpense, deleteIncome, deleteExpense,
    downloadIncome, downloadExpense,
    loading, dashData, dashLoading, fetchDashboard
  } = useTransactionStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    source: '',
    category: 'Lifestyle',
    amount: '',
    date: moment().format('YYYY-MM-DD'),
  });

  const categoryData = getCategoryBreakdown('expense');
  const monthlyData = getMonthlyData();

  const balance = dashData?.totalBalance ?? getBalance();
  const totalIncome = dashData?.totalIncome ?? getTotalIncome();
  const totalExpense = dashData?.totalExpense ?? getTotalExpenses();

  // Normalise the recent transactions from dashboard endpoint
  const recentTransactions = (dashData?.recentTransactions || []).map((t) => ({
    id: t._id,
    title: t.type === 'income' ? t.source : t.category,
    type: t.type,
    amount: t.amount,
    date: t.date,
    category: t.type === 'income' ? (t.source || 'Income') : t.category,
    description: t.type === 'income' ? t.source : t.category,
    status: t.type === 'income' ? 'Completed' : 'Personal',
  }));

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      if (formData.type === 'income') {
        if (!formData.source) { toast.error('Source is required'); return; }
        await addIncome({
          source: formData.source,
          amount: formData.amount,
          date: new Date(formData.date).toISOString(),
        });
      } else {
        await addExpense({
          category: formData.category,
          amount: formData.amount,
          date: new Date(formData.date).toISOString(),
        });
      }
      toast.success('Transaction added successfully');
      setShowAddModal(false);
      setFormData({ type: 'expense', source: '', category: 'Lifestyle', amount: '', date: moment().format('YYYY-MM-DD') });
      // Refresh dashboard data
      await fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Remove this transaction?')) return;
    try {
      if (type === 'income') await deleteIncome(id);
      else await deleteExpense(id);
      toast.success('Transaction removed');
      await fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleDownload = async (type) => {
    try {
      if (type === 'income') await downloadIncome();
      else await downloadExpense();
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} report downloaded`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Download failed');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-on-surface text-2xl md:text-3xl font-bold text-tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload('income')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant text-xs font-medium hover:text-primary transition-smooth cursor-pointer"
          >
            <MdDownload className="text-base" /> {t('nav.income')}
          </button>
          <button
            onClick={() => handleDownload('expense')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant text-xs font-medium hover:text-primary transition-smooth cursor-pointer"
          >
            <MdDownload className="text-base" /> {t('nav.expense')}
          </button>
        </div>
      </div>

      {/* Balance + Stats row */}
      {dashLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-2xl p-6 h-36 skeleton" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <BalanceCard balance={balance} income={totalIncome} expenses={totalExpense} />
          <StatCard
            title={t('dashboard.totalIncome')}
            value={`$${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon={<MdTrendingUp />}
          />
          <StatCard
            title={t('dashboard.totalExpense')}
            value={`$${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon={<span className="text-base">📉</span>}
          />
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <SpendingChart data={monthlyData} />
        <CategoryChart data={categoryData} />
      </div>

      {/* Recent Transactions */}
      {loading ? (
        <TransactionSkeleton count={5} />
      ) : (
        <TransactionList
          transactions={recentTransactions}
          onDelete={(id) => {
            const t = recentTransactions.find((r) => r.id === id);
            if (t) handleDelete(id, t.type);
          }}
          title={t('dashboard.recentTransactions')}
          emptyMessage="No transactions yet. Start by adding income or expenses."
        />
      )}

      {/* Global FAB */}
      <div className="fixed bottom-24 start-0 end-0 flex justify-center pointer-events-none z-[90] md:bottom-12 md:end-12 md:start-auto md:justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full gradient-primary text-on-primary shadow-malachite-lg flex items-center justify-center pointer-events-auto transition-smooth hover:scale-105 active:scale-95 cursor-pointer"
          title={t('dashboard.addTransaction')}
        >
          <MdAdd className="text-2xl md:text-3xl" />
        </button>
      </div>

      {/* Add Transaction Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t('dashboard.addTransaction')}>
        <form onSubmit={handleAddTransaction} className="space-y-5">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-3">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={`py-3 rounded-xl text-sm font-semibold transition-smooth capitalize cursor-pointer ${
                  formData.type === t
                    ? 'gradient-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {formData.type === 'income' ? (
            <Input
              label="Source"
              placeholder="e.g., TechGlobal Industries"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            />
          ) : (
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Lifestyle', label: 'Lifestyle' },
                { value: 'Entertainment', label: 'Entertainment' },
                { value: 'Housing', label: 'Housing' },
                { value: 'Dining', label: 'Dining' },
                { value: 'Transport', label: 'Transport' },
                { value: 'Groceries', label: 'Groceries' },
                { value: 'Subscriptions', label: 'Subscriptions' },
                { value: 'Home Decor', label: 'Home Decor' },
              ]}
            />
          )}

          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1 cursor-pointer">
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="flex-1 cursor-pointer" disabled={submitting}>
              {submitting ? 'Saving...' : t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
