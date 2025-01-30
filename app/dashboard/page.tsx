"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { Transaction } from "@/lib/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Registrando componentes do Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("2025-01");

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

  // Agrupar transações por categoria para o gráfico de pizza
  const categoryTotals = transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels = Object.keys(categoryTotals);
  const categoryData = Object.values(categoryTotals);

  // Agrupar transações por dia para o gráfico de barras
  const dailyTotals = transactions.reduce((acc, tx) => {
    const day = new Date(tx.date).getDate();
    acc[day] = (acc[day] || 0) + tx.amount;
    return acc;
  }, {} as Record<number, number>);

  const dailyLabels = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const dailyData = dailyLabels.map((day) => dailyTotals[Number(day)] || 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link href="/">Voltar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Visão Geral dos Gastos</h2>

        {/* Seleção de Mês */}
        <div className="mb-6">
          <Select onValueChange={setSelectedMonth} defaultValue={selectedMonth}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Selecione um mês..." />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Pizza */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gastos por Categoria</h3>
            <Pie
              data={{
                labels: categoryLabels,
                datasets: [
                  {
                    data: categoryData,
                    backgroundColor: [
                      "#ff6384",
                      "#36a2eb",
                      "#ffce56",
                      "#4bc0c0",
                      "#9966ff",
                      "#ff9f40",
                    ],
                  },
                ],
              }}
            />
          </Card>

          {/* Gráfico de Barras */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gastos Diários</h3>
            <Bar
              data={{
                labels: dailyLabels,
                datasets: [
                  {
                    label: "Gastos",
                    data: dailyData,
                    backgroundColor: "#36a2eb",
                  },
                ],
              }}
            />
          </Card>
        </div>
      </main>
    </div>
  );
}
