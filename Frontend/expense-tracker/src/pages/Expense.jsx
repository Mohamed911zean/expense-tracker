import { useState } from 'react';
import { MdAdd, MdTrendingDown, MdLightbulb, MdDownload } from 'react-icons/md';
import { useTransactions } from '../context/TransactionContext';
import { StatCard } from '../components/ui/Cards';
import { TransactionList, TransactionSkeleton } from '../components/ui/TransactionList';
import { CategoryChart } from '../components/ui/Charts';
import { Modal, Button, Input, Select } from '../components/ui/FormElements';
import toast from 'react-hot-toast';
import moment from 'moment';

export default function Expense() {
  const {
    getExpenses, getTotalExpenses, getCategoryBreakdown,
    addExpense, deleteExpense, downloadExpense,
    loading,
  } = useTransactions();

  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Lifestyle',
    amount: '',
    date: moment().format('YYYY-MM-DD'),
  });

  const expenseList = getExpenses();
  const totalExpenses = getTotalExpenses();
  const avgExpense = expenseList.length ? (totalExpenses / expenseList.length) : 0;
  const categoryData = getCategoryBreakdown('expense');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await addExpense({
        category: formData.category,
        amount: formData.amount,
        date: new Date(formData.date).toISOString(),
      });
      toast.success('Expense recorded');
      setShowAddModal(false);
      setFormData({ category: 'Lifestyle', amount: '', date: moment().format('YYYY-MM-DD') });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this expense?')) return;
    try {
      await deleteExpense(id);
      toast.success('Expense removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleDownload = async () => {
    try {
      await downloadExpense();
      toast.success('Expense report downloaded');
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
            Expenses
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Total expenses this month
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
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<MdTrendingDown />}
        />
        <StatCard
          title="Transactions"
          value={expenseList.length}
          subtitle="This month"
        />
        <StatCard
          title="Average Spend"
          value={`$${avgExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="Per transaction"
        />
      </div>

      {/* Category breakdown + Curator Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <CategoryChart data={categoryData} />

        {/* Curator Insight Card */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-malachite overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-container/20" />
          <div className="relative p-6 z-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <MdLightbulb className="text-on-primary text-lg" />
              </div>
              <h3 className="text-on-surface text-base font-bold text-tracking-tight">Curator Insight</h3>
            </div>
            <p className="text-on-surface text-sm leading-relaxed font-medium">
              Your lifestyle spending is <span className="text-primary font-bold">12% higher</span> than
              last month. Consider reviewing your subscription services for potential savings.
            </p>
            <div className="mt-auto pt-6">
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
                <p className="text-on-surface-variant text-xs italic leading-relaxed">
                  "Intentionality is the new currency." — Your entertainment budget has increased by 22%,
                  primarily driven by streaming subscriptions. Verdant suggests consolidating services
                  to save $450 annually.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense list */}
      {loading ? (
        <TransactionSkeleton count={5} />
      ) : (
        <TransactionList
          transactions={expenseList}
          onDelete={handleDelete}
          title="Recent Expenses"
          emptyMessage="No expenses recorded yet."
        />
      )}

      {/* Global FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-20 right-4 md:bottom-12 md:right-12 w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-full gradient-primary text-on-primary shadow-malachite-lg flex items-center justify-center z-[90] transition-smooth hover:scale-105 active:scale-95 cursor-pointer"
        title="Add Expense"
      >
        <MdAdd className="text-2xl md:text-3xl" />
      </button>

      {/* Add Expense Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Expense">
        <form onSubmit={handleAdd} className="space-y-5">
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
              {submitting ? 'Saving...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
