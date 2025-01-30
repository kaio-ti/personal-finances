"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { AddTransactionModal } from "@/components/add-transaction-modal";
import { db } from "@/lib/db";
import { Transaction } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Upload } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const months = [
    { name: "Janeiro", value: "2025-01" },
    { name: "Fevereiro", value: "2025-02" },
    { name: "Março", value: "2025-03" },
    { name: "Abril", value: "2025-04" },
    { name: "Maio", value: "2025-05" },
    { name: "Junho", value: "2025-06" },
    { name: "Julho", value: "2025-07" },
    { name: "Agosto", value: "2025-08" },
    { name: "Setembro", value: "2025-09" },
    { name: "Outubro", value: "2025-10" },
    { name: "Novembro", value: "2025-11" },
    { name: "Dezembro", value: "2025-12" },
  ];

  useEffect(() => {
    async function fetchTransactions() {
      if (!selectedMonth) return;
      const storedTransactions = await db.transactions
        .where("monthYear")
        .equals(selectedMonth)
        .toArray();
      setTransactions(storedTransactions);
    }
    fetchTransactions();
  }, [selectedMonth]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Personal Finance Manager</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <AddTransactionModal
                onTransactionAdded={() => window.location.reload()}
              />
              <Button className="w-full" variant="outline" asChild>
                <Link href="/import">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Transactions
                </Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {transactions.length > 0 ? (
              <ul className="space-y-2">
                {transactions.slice(0, 5).map((tx, index) => (
                  <li key={index} className="flex justify-between text-sm">
                    <span>{tx.description}</span>
                    <span className="font-semibold">
                      R$ {tx.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                Nenhuma transação para este mês
              </p>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold">R$ 0.00</p>{" "}
                {/* TODO: Implementar cálculo de saldo futuro */}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  This Month&apos;s Expenses
                </p>
                <p className="text-2xl font-bold">
                  R${" "}
                  {transactions
                    .reduce((total, tx) => total + tx.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtro de Mês */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            View Transactions by Month
          </h2>
          <Select onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Select a month..." />
            </SelectTrigger>
            <SelectContent>
              {months.map(({ name, value }) => (
                <SelectItem key={value} value={value}>
                  {name} 2025
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Listagem de Transações */}
        <div className="mt-6">
          {transactions.length > 0 ? (
            <DataTable data={transactions} />
          ) : (
            <p className="text-muted-foreground text-center">
              {selectedMonth
                ? "Nenhuma transação encontrada para este mês."
                : "Selecione um mês para visualizar as transações."}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
