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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto">
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
        <SearchBar
          onSearch={setSearch}
          status={status}
          onStatusChange={setStatus}
        />
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Error loading invoices
            </h3>
            <p className="text-red-500">{error}</p>
          </div>
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
