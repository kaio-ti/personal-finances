"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { processCSV } from "@/lib/file-processors";
import { db } from "@/lib/db";
import { Transaction } from "@/lib/db";

export function FileImport() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!selectedMonth) {
        toast.error(
          "Por favor, selecione um mês de referência antes de importar."
        );
        return;
      }

      setProcessing(true);
      setProgress(0);

      try {
        for (const file of acceptedFiles) {
          const transactions: Transaction[] = await processCSV(file);

          const transactionsWithMonth = transactions.map((tx) => ({
            ...tx,
            monthYear: selectedMonth,
          }));

          await db.transactions.bulkAdd(transactionsWithMonth);

          setProgress(100);
          toast.success("Arquivo importado com sucesso!");
          setUploaded(true);
        }
      } catch (error) {
        toast.error("Erro ao processar arquivo.");
      } finally {
        setProcessing(false);
      }
    },
    [selectedMonth]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Botão de voltar para a página inicial */}
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à Página Inicial
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Importar Transações</h1>

      <div className="mb-4">
        <label className="text-sm font-medium">Mês de Referência</label>
        <Select onValueChange={setSelectedMonth}>
          <SelectTrigger className="mt-1 w-full">
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

      <Card
        {...getRootProps()}
        className="mt-4 p-6 border-dashed border-2 text-center cursor-pointer hover:bg-gray-100"
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mx-auto text-gray-500" />
        <p className="mt-2 text-gray-700">
          Arraste e solte um arquivo CSV ou clique para selecionar
        </p>
      </Card>

      {processing && <Progress value={progress} className="mt-4" />}

      {uploaded && (
        <div className="mt-4">
          <Button onClick={() => (window.location.href = "/")}>
            Voltar à Página Inicial
          </Button>
        </div>
      )}
    </div>
  );
}
