import { useState } from 'react';
import { MdAdd, MdTrendingDown, MdLightbulb } from 'react-icons/md';
import { useTransactions } from '../context/TransactionContext';
import { StatCard } from '../components/ui/Cards';
import { TransactionList } from '../components/ui/TransactionList';
import { CategoryChart } from '../components/ui/Charts';
import { Modal, Button, Input, Select } from '../components/ui/FormElements';
import toast from 'react-hot-toast';

export default function Expense() {
  const { getExpenses, getTotalExpenses, addTransaction, deleteTransaction, getCategoryBreakdown } = useTransactions();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', amount: '', category: 'Lifestyle', description: '',
  });

  const expenseList = getExpenses();
  const totalExpenses = getTotalExpenses();
  const categoryData = getCategoryBreakdown('expense');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      toast.error('Please fill in required fields');
      return;
    }
    addTransaction({ ...formData, type: 'expense', amount: parseFloat(formData.amount), status: 'Personal' });
    toast.success('Expense recorded');
    setShowAddModal(false);
    setFormData({ title: '', amount: '', category: 'Lifestyle', description: '' });
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    toast.success('Expense removed');
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
        <div className="hidden md:block">
          <Button onClick={() => setShowAddModal(true)}>
            <MdAdd className="text-lg" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<MdTrendingDown />}
          trend={{ positive: false, value: '5.1%' }}
        />
        <StatCard
          title="Transactions"
          value={expenseList.length}
          subtitle="This month"
        />
        <StatCard
          title="Average Spend"
          value={`$${expenseList.length ? (totalExpenses / expenseList.length).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}`}
          subtitle="Per transaction"
        />
      </div>

      {/* Category breakdown + Curator Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <CategoryChart data={categoryData} />

        {/* Curator Insight Card */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-malachite overflow-hidden relative group">
          {/* Background Image Layer */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 transition-smooth duration-700 group-hover:scale-105"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/90 to-surface-container-lowest/40" />

          {/* Content Layer */}
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
              <div className="p-4 bg-surface-container-lowest/80 backdrop-blur-md rounded-xl border border-outline-variant/20 shadow-sm relative overflow-hidden">
                <p className="text-on-surface-variant text-xs italic leading-relaxed relative z-10">
                  "Intentionality is the new currency." — Your entertainment budget has increased by 22%,
                  primarily driven by streaming subscriptions. Verdant suggests consolidating three services
                  to save $450 annually without impacting your lifestyle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense list */}
      <TransactionList
        transactions={expenseList}
        onDelete={handleDelete}
        title="Recent Expenses"
        emptyMessage="No expenses recorded yet."
      />

      {/* Mobile FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 rounded-2xl gradient-primary text-on-primary shadow-malachite-lg flex items-center justify-center z-40 transition-smooth hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MdAdd className="text-2xl" />
      </button>

      {/* Add Expense Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Expense">
        <form onSubmit={handleAdd} className="space-y-5">
          <Input
            label="Title"
            placeholder="e.g., The Verdant Bistro"
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
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Expense
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
