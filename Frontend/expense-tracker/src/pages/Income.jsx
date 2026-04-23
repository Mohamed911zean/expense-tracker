import { useState } from 'react';
import { MdAdd, MdTrendingUp, MdDownload } from 'react-icons/md';
import useTransactionStore from '../store/useTransactionStore';
import { StatCard } from '../components/ui/Cards';
import { TransactionList, TransactionSkeleton } from '../components/ui/TransactionList';
import { Modal, Button, Input, Select } from '../components/ui/FormElements';
import toast from 'react-hot-toast';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function Income() {
  const { t } = useTranslation();
  const {
    getIncome, getTotalIncome,
    addIncome, deleteIncome, downloadIncome,
    loading,
  } = useTransactionStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: moment().format('YYYY-MM-DD'),
  });

  const incomeList = getIncome();
  const totalIncome = getTotalIncome();
  const avgIncome = incomeList.length ? (totalIncome / incomeList.length) : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.source || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await addIncome({
        source: formData.source,
        amount: formData.amount,
        date: new Date(formData.date).toISOString(),
      });
      toast.success('Income stream added');
      setShowAddModal(false);
      setFormData({ source: '', amount: '', date: moment().format('YYYY-MM-DD') });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this income record?')) return;
    try {
      await deleteIncome(id);
      toast.success('Income removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleDownload = async () => {
    try {
      await downloadIncome();
      toast.success('Income report downloaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Download failed');
    }
  };

  return (
    <>
      <div className="space-y-6 md:space-y-8 animate-fade-in pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-on-surface text-2xl md:text-3xl font-bold text-tracking-tight">
            {t('income.title')}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {t('income.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant text-xs font-medium hover:text-primary transition-smooth cursor-pointer"
          >
            <MdDownload className="text-base" /> {t('dashboard.export')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title={t('dashboard.totalIncome')}
          value={`$${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<MdTrendingUp />}
          className="md:col-span-1"
        />
        <StatCard
          title={t('income.sources')}
          value={incomeList.length}
          subtitle={t('income.activeStreams')}
        />
        <StatCard
          title={t('income.avgPerSource')}
          value={`$${avgIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle={t('income.monthlyAvg')}
        />
      </div>

      {/* Income Streams */}
      {loading ? (
        <TransactionSkeleton count={5} />
      ) : (
        <TransactionList
          transactions={incomeList}
          onDelete={handleDelete}
          title={t('income.sources')}
          emptyMessage={t('income.empty')}
        />
      )}

      </div>

      {/* Global FAB */}
     <div className="fixed bottom-24 end-6 z-[90] pointer-events-none">
  <button
    onClick={() => setShowAddModal(true)}
    className="w-14 h-14 md:w-16 md:h-16 rounded-full gradient-primary text-on-primary shadow-malachite-lg flex items-center justify-center pointer-events-auto transition-smooth hover:scale-105 active:scale-95 cursor-pointer"
    title={t('dashboard.addTransaction')}
  >
    <MdAdd className="text-2xl md:text-3xl" />
  </button>
</div>

      {/* Add Income Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t('income.addIncome')}>
        <form onSubmit={handleAdd} className="space-y-5">
          <Input
            label="Source"
            placeholder="e.g., TechGlobal Industries"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          />
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
    </>
  );
}
