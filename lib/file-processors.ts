"use client";

import Papa from "papaparse";
import { Transaction } from "@/lib/db";

// Função para converter string de número para float
const parseCurrency = (value: string) => {
  return parseFloat(value.replace(",", "."));
};

// Função para converter data do CSV para DD/MM/YYYY
const parseDate = (dateStr: string) => {
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

export async function processCSV(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: (results) => {
        try {
          const transactions: Transaction[] = results.data
            .map((row: any, index: number) => {
              try {
                const amount = parseCurrency(row["Valor (em R$)"]) || 0;

                if (
                  row["Descrição"] === "Inclusao de Pagamento" ||
                  amount < 0
                ) {
                  return null;
                }

                return {
                  description: row["Descrição"] || "Sem descrição",
                  amount,
                  date:
                    parseDate(row["Data de Compra"]) ||
                    new Date().toISOString(),
                  category: row["Categoria"] || "Outros",
                  installment: row["Parcela"] || "Única",
                  paymentMethod: "Crédito", // ✅ NOVO CAMPO PADRÃO
                  monthYear: "",
                };
              } catch (err) {
                console.error(`Erro ao processar linha ${index + 1}:`, err);
                return null;
              }
            })
            .filter(Boolean);

          resolve(transactions);
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
