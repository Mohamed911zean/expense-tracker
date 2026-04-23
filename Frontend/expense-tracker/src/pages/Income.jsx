import { useState } from 'react';
import { MdAdd, MdTrendingUp, MdDownload } from 'react-icons/md';
import { useTransactions } from '../context/TransactionContext';
import { StatCard } from '../components/ui/Cards';
import { TransactionList, TransactionSkeleton } from '../components/ui/TransactionList';
import { Modal, Button, Input, Select } from '../components/ui/FormElements';
import toast from 'react-hot-toast';
import moment from 'moment';

export default function Income() {
  const {
    getIncome, getTotalIncome,
    addIncome, deleteIncome, downloadIncome,
    loading,
  } = useTransactions();

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
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-on-surface text-2xl md:text-3xl font-bold text-tracking-tight">
            Portfolio Yield
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Monthly recurring revenue overview
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant text-xs font-medium hover:text-primary transition-smooth cursor-pointer"
          >
            <MdDownload className="text-base" /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<MdTrendingUp />}
          className="md:col-span-1"
        />
        <StatCard
          title="Income Sources"
          value={incomeList.length}
          subtitle="Active revenue streams"
        />
        <StatCard
          title="Average Per Source"
          value={`$${avgIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="Monthly average"
        />
      </div>

      {/* Income Streams */}
      {loading ? (
        <TransactionSkeleton count={5} />
      ) : (
        <TransactionList
          transactions={incomeList}
          onDelete={handleDelete}
          title="Income Streams"
          emptyMessage="No income sources added yet. Start building your portfolio."
        />
      )}

      {/* Global FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-20 right-4 md:bottom-12 md:right-12 w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-full gradient-primary text-on-primary shadow-malachite-lg flex items-center justify-center z-[90] transition-smooth hover:scale-105 active:scale-95 cursor-pointer"
        title="Add Income"
      >
        <MdAdd className="text-2xl md:text-3xl" />
      </button>

      {/* Add Income Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Income">
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
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Income'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
