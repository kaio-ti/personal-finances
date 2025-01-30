import { create } from 'zustand';
import { Transaction } from './db';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface FinanceStore {
  dateRange: DateRange;
  selectedCategories: string[];
  setDateRange: (range: DateRange) => void;
  setSelectedCategories: (categories: string[]) => void;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  dateRange: {
    from: undefined,
    to: undefined,
  },
  selectedCategories: [],
  setDateRange: (range) => set({ dateRange: range }),
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
}));

export const TRANSACTION_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Health',
  'Education',
  'Shopping',
  'Bills',
  'Investment',
  'Salary',
  'Other',
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];