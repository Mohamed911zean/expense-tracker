import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/pathApi';

const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [acquisitions, setAcquisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Normalizers ────────────────────────────────────────────────────────────
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

  // ─── Fetchers ────────────────────────────────────────────────────────────────
  const fetchIncome = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      setIncome((res.data || []).map(normalizeIncome));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch income');
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      setExpenses((res.data || []).map(normalizeExpense));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expenses');
    }
  }, []);

  const fetchAcquisitions = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.ACQUISITIONS.GET_ALL);
      setAcquisitions(
        (res.data || []).map((item) => ({ ...item, id: item._id }))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch acquisitions');
    }
  }, []);

  // Fetch everything on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchIncome(), fetchExpenses(), fetchAcquisitions()]);
      setLoading(false);
    };
    fetchAll();
  }, [fetchIncome, fetchExpenses, fetchAcquisitions]);

  // ─── Income mutations ────────────────────────────────────────────────────────
  const addIncome = async (data) => {
    await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
      source: data.source,
      amount: parseFloat(data.amount),
      date: data.date || new Date().toISOString(),
    });
    await fetchIncome();
  };

  const deleteIncome = async (id) => {
    await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
    await fetchIncome();
  };

  const downloadIncome = async () => {
    const res = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'income.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  // ─── Expense mutations ───────────────────────────────────────────────────────
  const addExpense = async (data) => {
    await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
      category: data.category,
      amount: parseFloat(data.amount),
      date: data.date || new Date().toISOString(),
    });
    await fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
    await fetchExpenses();
  };

  const downloadExpense = async () => {
    const res = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expenses.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  // ─── Acquisition mutations ───────────────────────────────────────────────────
  const addAcquisition = async (data) => {
    await axiosInstance.post(API_PATHS.ACQUISITIONS.ADD, {
      name: data.name,
      target: parseFloat(data.target),
      saved: parseFloat(data.saved) || 0,
    });
    await fetchAcquisitions();
  };

  const deleteAcquisition = async (id) => {
    await axiosInstance.delete(API_PATHS.ACQUISITIONS.DELETE(id));
    await fetchAcquisitions();
  };

  // ─── Computed helpers (derived from real data) ───────────────────────────────
  const getAllTransactions = useCallback(
    () => [...income, ...expenses],
    [income, expenses]
  );

  const getIncome = useCallback(() => income, [income]);
  const getExpenses = useCallback(() => expenses, [expenses]);

  const getTotalIncome = useCallback(
    () => income.reduce((sum, t) => sum + t.amount, 0),
    [income]
  );

  const getTotalExpenses = useCallback(
    () => expenses.reduce((sum, t) => sum + t.amount, 0),
    [expenses]
  );

  const getBalance = useCallback(
    () => getTotalIncome() - getTotalExpenses(),
    [getTotalIncome, getTotalExpenses]
  );

  const getRecentTransactions = useCallback(
    (limit = 5) =>
      [...income, ...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit),
    [income, expenses]
  );

  const getCategoryBreakdown = useCallback(
    (type = 'expense') => {
      const list = type === 'income' ? income : expenses;
      const cats = {};
      list.forEach((t) => {
        cats[t.category] = (cats[t.category] || 0) + t.amount;
      });
      return Object.entries(cats)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
    },
    [income, expenses]
  );

  const getMonthlyData = useCallback(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => {
      const monthIncome = income
        .filter((t) => new Date(t.date).getMonth() === index)
        .reduce((s, t) => s + t.amount, 0);
      const monthExpense = expenses
        .filter((t) => new Date(t.date).getMonth() === index)
        .reduce((s, t) => s + t.amount, 0);
      return { month, income: monthIncome, expense: monthExpense };
    });
  }, [income, expenses]);

  return (
    <TransactionContext.Provider
      value={{
        income,
        expenses,
        acquisitions,
        loading,
        error,
        // Income
        addIncome,
        deleteIncome,
        downloadIncome,
        fetchIncome,
        // Expense
        addExpense,
        deleteExpense,
        downloadExpense,
        fetchExpenses,
        // Acquisitions
        addAcquisition,
        deleteAcquisition,
        fetchAcquisitions,
        // Computed
        getAllTransactions,
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
