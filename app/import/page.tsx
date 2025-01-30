"use client";

import { FileImport } from "@/components/file-import";

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Import Transactions</h1>
          <p className="text-muted-foreground mt-1">
            Import your transactions from CSV or PDF files
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <FileImport />
      </main>
    </div>
  );
}