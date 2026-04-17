import { useState } from 'react';
import { MdAdd, MdTrendingUp } from 'react-icons/md';
import { useTransactions } from '../context/TransactionContext';
import { StatCard } from '../components/ui/Cards';
import { TransactionList } from '../components/ui/TransactionList';
import { Modal, Button, Input, Select } from '../components/ui/FormElements';
import toast from 'react-hot-toast';

export default function Income() {
  const { getIncome, getTotalIncome, addTransaction, deleteTransaction } = useTransactions();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', amount: '', category: 'Salary', description: '',
  });

  const incomeList = getIncome();
  const totalIncome = getTotalIncome();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      toast.error('Please fill in required fields');
      return;
    }
    addTransaction({ ...formData, type: 'income', amount: parseFloat(formData.amount), status: 'Completed' });
    toast.success('Income stream added');
    setShowAddModal(false);
    setFormData({ title: '', amount: '', category: 'Salary', description: '' });
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    toast.success('Income removed');
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
        <div className="hidden md:block">
          <Button onClick={() => setShowAddModal(true)}>
            <MdAdd className="text-lg" />
            Add Income
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<MdTrendingUp />}
          trend={{ positive: true, value: '8.3%' }}
          className="md:col-span-1"
          bgImage="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop"
        />
        <StatCard
          title="Income Sources"
          value={incomeList.length}
          subtitle="Active revenue streams"
        />
        <StatCard
          title="Average Per Source"
          value={`$${incomeList.length ? (totalIncome / incomeList.length).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}`}
          subtitle="Monthly average"
        />
      </div>

      {/* Income Streams */}
      <TransactionList
        transactions={incomeList}
        onDelete={handleDelete}
        title="Income Streams"
        emptyMessage="No income sources added yet. Start building your portfolio."
      />

      {/* Mobile FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 rounded-2xl gradient-primary text-on-primary shadow-malachite-lg flex items-center justify-center z-40 transition-smooth hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MdAdd className="text-2xl" />
      </button>

      {/* Add Income Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Income">
        <form onSubmit={handleAdd} className="space-y-5">
          <Input
            label="Source Name"
            placeholder="e.g., TechGlobal Industries"
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
              { value: 'Dividend', label: 'Dividend' },
              { value: 'Other', label: 'Other' },
            ]}
          />
          <Input
            label="Description"
            placeholder="e.g., Full-time • Senior Architect"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Income
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
