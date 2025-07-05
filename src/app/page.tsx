"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Stats from "../components/Stats";
import SearchBar from "../components/SearchBar";
import InvoiceList from "../components/InvoiceList";
import Spinner from "../components/Spinner";
import { Invoice } from "../types/invoice";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = () => {
    setLoading(true);
    fetch("/api/invoices")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInvoices(data.invoices as Invoice[]);
          setError(null);
        } else {
          setError("Failed to fetch invoices");
        }
      })
      .catch(() => setError("Failed to fetch invoices"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDeleteInvoice = () => {
    fetchInvoices();
  };

  // Stats calculation
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const paidInvoices = invoices.filter((inv) => inv.status === "paid");
  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue");

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center font-sans">
      <Header />
      <Stats
        totalRevenue={`Rp ${totalRevenue.toLocaleString("id-ID")}`}
        totalInvoices={invoices.length}
        paidInvoices={{
          count: paidInvoices.length,
          amount: paidInvoices
            .reduce((sum, inv) => sum + (inv.total || 0), 0)
            .toLocaleString("id-ID"),
        }}
        overdue={{
          count: overdueInvoices.length,
          note: overdueInvoices.length > 0 ? "Needs attention" : "",
        }}
      />
      <div className="w-full max-w-5xl px-2 sm:px-0">
        <SearchBar
          onSearch={setSearch}
          status={status}
          onStatusChange={setStatus}
        />
      </div>
      <div className="w-full max-w-5xl px-2 sm:px-0">
        {loading ? (
          <div className="py-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <InvoiceList
            invoices={invoices}
            search={search}
            status={status}
            onDelete={handleDeleteInvoice}
          />
        )}
      </div>
    </div>
  );
}
