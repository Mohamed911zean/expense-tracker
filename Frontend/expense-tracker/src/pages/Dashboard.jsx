import { useState } from 'react';
import { MdAdd, MdTrendingUp } from 'react-icons/md';
import { useTransactions } from '../context/TransactionContext';
import { BalanceCard, StatCard } from '../components/ui/Cards';
import { TransactionList } from '../components/ui/TransactionList';
import { SpendingChart, CategoryChart } from '../components/ui/Charts';
import { Modal, Button, Input, Select } from '../components/ui/FormElements';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const {
    getBalance, getTotalIncome, getTotalExpenses,
    getRecentTransactions, deleteTransaction,
    getCategoryBreakdown, getMonthlyData, addTransaction,
  } = useTransactions();

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', amount: '', category: 'Lifestyle', type: 'expense', description: '',
  });

  const balance = getBalance();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const recent = getRecentTransactions(5);
  const categoryData = getCategoryBreakdown('expense');
  const monthlyData = getMonthlyData();

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      toast.error('Please fill in required fields');
      return;
    }
    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    toast.success('Transaction curated successfully');
    setShowAddModal(false);
    setFormData({ title: '', amount: '', category: 'Lifestyle', type: 'expense', description: '' });
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    toast.success('Transaction removed');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-on-surface text-2xl md:text-3xl font-bold text-tracking-tight">
            Dashboard
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Your financial overview at a glance
          </p>
        </div>
        <div className="hidden md:block">
          <Button onClick={() => setShowAddModal(true)}>
            <MdAdd className="text-lg" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Balance + Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <BalanceCard balance={balance} income={income} expenses={expenses} />
        <StatCard
          title="Total Income"
          value={`$${income.toLocaleString()}`}
          icon={<MdTrendingUp />}
          trend={{ positive: true, value: '12.5%' }}
          bgImage="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
        />
        <StatCard
          title="Total Expenses"
          value={`$${expenses.toLocaleString()}`}
          icon={<span className="text-base">📉</span>}
          trend={{ positive: false, value: '3.2%' }}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <SpendingChart data={monthlyData} />
        <CategoryChart data={categoryData} />
      </div>

      {/* Recent Transactions */}
      <TransactionList
        transactions={recent}
        onDelete={handleDelete}
        title="Recent Transactions"
      />

      {/* Mobile FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 rounded-2xl gradient-primary text-on-primary shadow-malachite-lg flex items-center justify-center z-40 transition-smooth hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MdAdd className="text-2xl" />
      </button>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Transaction"
      >
        <form onSubmit={handleAddTransaction} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`py-3 rounded-xl text-sm font-semibold transition-smooth cursor-pointer ${
                formData.type === 'expense'
                  ? 'gradient-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={`py-3 rounded-xl text-sm font-semibold transition-smooth cursor-pointer ${
                formData.type === 'income'
                  ? 'gradient-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              Income
            </button>
          </div>

          <Input
            label="Title"
            placeholder="e.g., Artisan Coffee"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'Salary', label: 'Salary' },
              { value: 'Freelance', label: 'Freelance' },
              { value: 'Investment', label: 'Investment' },
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
            label="Description"
            placeholder="Optional note..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Transaction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
