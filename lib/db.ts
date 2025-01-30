import Dexie, { Table } from "dexie";

export interface Transaction {
  id?: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  installment: string;
  monthYear: string; // Adicionando a propriedade corretamente
}

class FinanceDatabase extends Dexie {
  transactions!: Table<Transaction>;

  constructor() {
    super("financeDB");

    this.version(2).stores({
      transactions: "++id, description, amount, date, category, monthYear", // Adicionando índice para monthYear
    });
  }
}

export const db = new FinanceDatabase();
