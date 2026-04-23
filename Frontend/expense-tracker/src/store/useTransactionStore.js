import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/pathApi';

const normalizeIncome = (item) => ({
  id: item._id,
  title: item.source,
  type: 'income',
  amount: item.amount,
  date: item.date,
  category: item.source,
  description: item.source,
  status: 'Completed',
});

const normalizeExpense = (item) => ({
  id: item._id,
  title: item.category,
  type: 'expense',
  amount: item.amount,
  date: item.date,
  category: item.category,
  description: item.category,
  status: 'Personal',
});

const useTransactionStore = create(
  persist(
    (set, get) => ({
      income: [],
      expenses: [],
      acquisitions: [],
      dashData: null,
      loading: false,
      error: null,
      dashLoading: false,

      // Fetchers
      fetchIncome: async () => {
        try {
          const res = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
          set({ income: (res.data || []).map(normalizeIncome) });
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to fetch income' });
        }
      },
      fetchExpenses: async () => {
        try {
          const res = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
          set({ expenses: (res.data || []).map(normalizeExpense) });
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to fetch expenses' });
        }
      },
      fetchAcquisitions: async () => {
        try {
          const res = await axiosInstance.get(API_PATHS.ACQUISITIONS.GET_ALL);
          set({ acquisitions: (res.data || []).map((item) => ({ ...item, id: item._id })) });
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to fetch acquisitions' });
        }
      },
      fetchDashboard: async () => {
        try {
          set({ dashLoading: true });
          const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
          set({ dashData: res.data, dashLoading: false });
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to fetch dashboard data', dashLoading: false });
        }
      },
      fetchAll: async (force = false) => {
        const { income, expenses, acquisitions, dashData } = get();
        if (!force && (income.length > 0 || expenses.length > 0 || acquisitions.length > 0 || dashData)) {
          // If we already have data, we just return early
          // You can modify this to fetch in the background if desired
          return;
        }
        set({ loading: true });
        await Promise.all([
          get().fetchIncome(),
          get().fetchExpenses(),
          get().fetchAcquisitions(),
          get().fetchDashboard()
        ]);
        set({ loading: false });
      },

      // Income mutations
      addIncome: async (data) => {
        await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
          source: data.source,
          amount: parseFloat(data.amount),
          date: data.date || new Date().toISOString(),
        });
        await get().fetchIncome();
        await get().fetchDashboard();
      },
      deleteIncome: async (id) => {
        await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
        await get().fetchIncome();
        await get().fetchDashboard();
      },
      downloadIncome: async () => {
        const income = get().income;
        const data = income.map((item) => ({
            Source: item.title || item.source || item.category,
            Amount: item.amount,
            Date: new Date(item.date).toLocaleDateString()
        }));
        const xlsx = await import('xlsx');
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "income_details.xlsx");
      },

      // Expense mutations
      addExpense: async (data) => {
        await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
          category: data.category,
          amount: parseFloat(data.amount),
          date: data.date || new Date().toISOString(),
        });
        await get().fetchExpenses();
        await get().fetchDashboard();
      },
      deleteExpense: async (id) => {
        await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
        await get().fetchExpenses();
        await get().fetchDashboard();
      },
      downloadExpense: async () => {
        const expenses = get().expenses;
        const data = expenses.map((item) => ({
            Category: item.title || item.category || item.source,
            Amount: item.amount,
            Date: new Date(item.date).toLocaleDateString()
        }));
        const xlsx = await import('xlsx');
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, "expense_details.xlsx");
      },

      // Acquisition mutations
      addAcquisition: async (data) => {
        await axiosInstance.post(API_PATHS.ACQUISITIONS.ADD, {
          name: data.name,
          target: parseFloat(data.target),
          saved: parseFloat(data.saved) || 0,
        });
        await get().fetchAcquisitions();
      },
      deleteAcquisition: async (id) => {
        await axiosInstance.delete(API_PATHS.ACQUISITIONS.DELETE(id));
        await get().fetchAcquisitions();
      },

      deleteTransaction: async (id) => {
        // Find transaction
        const { income, expenses } = get();
        const inc = income.find(t => t.id === id);
        if (inc) return get().deleteIncome(id);
        const exp = expenses.find(t => t.id === id);
        if (exp) return get().deleteExpense(id);
      },

      // Computed helpers
      getAllTransactions: () => [...get().income, ...get().expenses],
      getIncome: () => get().income,
      getExpenses: () => get().expenses,
      getTotalIncome: () => get().income.reduce((sum, t) => sum + t.amount, 0),
      getTotalExpenses: () => get().expenses.reduce((sum, t) => sum + t.amount, 0),
      getBalance: () => get().getTotalIncome() - get().getTotalExpenses(),
      getRecentTransactions: (limit = 5) =>
        [...get().income, ...get().expenses]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, limit),
      getCategoryBreakdown: (type = 'expense') => {
        const list = type === 'income' ? get().income : get().expenses;
        const cats = {};
        list.forEach((t) => {
          cats[t.category] = (cats[t.category] || 0) + t.amount;
        });
        return Object.entries(cats)
          .map(([name, amount]) => ({ name, amount }))
          .sort((a, b) => b.amount - a.amount);
      },
      getMonthlyData: () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map((month, index) => {
          const monthIncome = get().income
            .filter((t) => new Date(t.date).getMonth() === index)
            .reduce((s, t) => s + t.amount, 0);
          const monthExpense = get().expenses
            .filter((t) => new Date(t.date).getMonth() === index)
            .reduce((s, t) => s + t.amount, 0);
          return { month, income: monthIncome, expense: monthExpense };
        });
      },
    }),
    {
      name: 'transaction-storage',
      partialize: (state) => ({
        income: state.income,
        expenses: state.expenses,
        acquisitions: state.acquisitions,
        dashData: state.dashData,
      }), // only persist data
    }
  )
);

export default useTransactionStore;
