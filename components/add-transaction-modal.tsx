"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/db";

export function AddTransactionModal({
  onTransactionAdded,
}: {
  onTransactionAdded: () => void;
}) {
  const [form, setForm] = useState({
    date: "",
    description: "",
    amount: "",
    category: "",
    installment: "Única",
    paymentMethod: "Crédito", // Valor padrão
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTransaction = {
      description: form.description,
      amount: parseFloat(form.amount),
      date: form.date,
      category: form.category,
      installment: form.installment,
      paymentMethod: form.paymentMethod,
      monthYear: form.date.slice(0, 7), // Pega "YYYY-MM"
    };

    await db.transactions.add(newTransaction);
    onTransactionAdded(); // Atualiza a lista de transações
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Add Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Data</Label>
            <Input type="date" name="date" required onChange={handleChange} />
          </div>
          <div>
            <Label>Descrição</Label>
            <Input
              type="text"
              name="description"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Valor</Label>
            <Input
              type="number"
              name="amount"
              step="0.01"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Categoria</Label>
            <Input
              type="text"
              name="category"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Parcela</Label>
            <Input
              type="text"
              name="installment"
              defaultValue="Única"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Forma de Pagamento</Label>
            <Select
              name="paymentMethod"
              onValueChange={(value) =>
                setForm({ ...form, paymentMethod: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Boleto">Boleto</SelectItem>
                <SelectItem value="Pix">Pix</SelectItem>
                <SelectItem value="Crédito">Crédito</SelectItem>
                <SelectItem value="Débito">Débito</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Salvar Transação
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
