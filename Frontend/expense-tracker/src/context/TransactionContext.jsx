import { createContext, useContext, useState, useCallback } from 'react';

const TransactionContext = createContext(null);

const MOCK_TRANSACTIONS = [
  { id: '1', title: 'TechGlobal Industries', category: 'Salary', type: 'income', amount: 8500, date: '2024-10-28', description: 'Full-time • Senior Architect', status: 'Completed' },
  { id: '2', title: 'Studio Kinetic', category: 'Freelance', type: 'income', amount: 2100, date: '2024-10-15', description: 'Contract • Design Strategy', status: 'Completed' },
  { id: '3', title: 'Vanguard Real Estate', category: 'Investment', type: 'income', amount: 1200, date: '2024-10-02', description: 'Dividend • Quarterly Payout', status: 'Completed' },
  { id: '4', title: 'Private Consulting', category: 'Freelance', type: 'income', amount: 650, date: '2024-10-01', description: 'Contract • Advisory', status: 'Completed' },
  { id: '5', title: 'Artisan Coffee & Roastery', category: 'Lifestyle', type: 'expense', amount: 14.50, date: '2024-10-24', description: 'Dining & Drinks', status: 'Personal' },
  { id: '6', title: 'Premium Streaming Duo', category: 'Entertainment', type: 'expense', amount: 24.99, date: '2024-10-23', description: 'Entertainment', status: 'Fixed' },
  { id: '7', title: 'Luxury Flat Monthly Rent', category: 'Housing', type: 'expense', amount: 1250, date: '2024-10-01', description: 'Housing', status: 'Fixed' },
  { id: '8', title: 'The Verdant Bistro', category: 'Dining', type: 'expense', amount: 86.50, date: '2024-10-24', description: 'Dining & Lifestyle', status: 'Personal' },
  { id: '9', title: 'Nordic Design Lab', category: 'Home Decor', type: 'expense', amount: 340, date: '2024-10-23', description: 'Home Decor', status: 'Personal' },
  { id: '10', title: 'Tesla Supercharger', category: 'Transport', type: 'expense', amount: 32.50, date: '2024-10-22', description: 'Transport', status: 'Fixed' },
  { id: '11', title: 'Whole Foods Market', category: 'Groceries', type: 'expense', amount: 84.22, date: '2024-10-22', description: 'Groceries', status: 'Personal' },
  { id: '12', title: 'Figma Pro Annual', category: 'Subscriptions', type: 'expense', amount: 144, date: '2024-10-21', description: 'Subscriptions', status: 'Fixed' },
  { id: '13', title: 'Uber Technologies', category: 'Transport', type: 'expense', amount: 32.50, date: '2024-10-20', description: 'Transport', status: 'Personal' },
  { id: '14', title: 'Quarterly Dividend', category: 'Investment', type: 'income', amount: 1240, date: '2024-10-24', description: 'Investments', status: 'Completed' },
];

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: transaction.date || new Date().toISOString().split('T')[0],
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getIncome = useCallback(() => {
    return transactions.filter((t) => t.type === 'income');
  }, [transactions]);

  const getExpenses = useCallback(() => {
    return transactions.filter((t) => t.type === 'expense');
  }, [transactions]);

  const getTotalIncome = useCallback(() => {
    return getIncome().reduce((sum, t) => sum + t.amount, 0);
  }, [getIncome]);

  const getTotalExpenses = useCallback(() => {
    return getExpenses().reduce((sum, t) => sum + t.amount, 0);
  }, [getExpenses]);

  const getBalance = useCallback(() => {
    return getTotalIncome() - getTotalExpenses();
  }, [getTotalIncome, getTotalExpenses]);

  const getRecentTransactions = useCallback((limit = 5) => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }, [transactions]);

  const getCategoryBreakdown = useCallback((type = 'expense') => {
    const filtered = transactions.filter((t) => t.type === type);
    const categories = {};
    filtered.forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const getMonthlyData = useCallback(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => {
      const monthTransactions = transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === index;
      });
      const income = monthTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { month, income, expense };
    });
  }, [transactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        getIncome,
        getExpenses,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
        getRecentTransactions,
        getCategoryBreakdown,
        getMonthlyData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used within TransactionProvider');
  return context;
}
