"use client";

import { ArrowLeft, CreditCard, Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  invoiceNumber: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "paypal";
  last4?: string;
  brand?: string;
  email?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export default function BillingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    router.push("/settings/profile");
  }, [router]);

  // Mock data
  const currentPlan = {
    name: "Pro",
    price: "$29",
    billingCycle: "month",
    nextBillingDate: "April 8, 2026",
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: "1",
      type: "card",
      brand: "Visa",
      last4: "4242",
      expiryDate: "12/25",
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      brand: "Mastercard",
      last4: "5555",
      expiryDate: "08/26",
      isDefault: false,
    },
  ];

  const invoices: Invoice[] = [
    {
      id: "1",
      date: "Mar 8, 2026",
      amount: "$29.00",
      status: "paid",
      invoiceNumber: "INV-2026-03-001",
    },
    {
      id: "2",
      date: "Feb 8, 2026",
      amount: "$29.00",
      status: "paid",
      invoiceNumber: "INV-2026-02-001",
    },
    {
      id: "3",
      date: "Jan 8, 2026",
      amount: "$29.00",
      status: "paid",
      invoiceNumber: "INV-2026-01-001",
    },
  ];

  const handleUpgradePlan = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleAddPaymentMethod = () => {
    console.log("Add payment method");
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log("Download invoice:", invoiceId);
  };

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-900/30 border-green-800 text-green-400";
      case "pending":
        return "bg-yellow-900/30 border-yellow-800 text-yellow-400";
      case "failed":
        return "bg-red-900/30 border-red-800 text-red-400";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-400 hover:text-neutral-300 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-3xl font-semibold text-white mb-2">
            Billing Settings
          </h1>
          <p className="text-neutral-400">
            Manage your subscription and payment methods
          </p>
        </div>

        {/* Current Plan Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-white mb-1">
                Current Plan
              </h2>
              <p className="text-sm text-neutral-400">
                Your subscription details and usage
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-white">
                {currentPlan.price}
                <span className="text-sm text-neutral-400 font-normal">
                  /{currentPlan.billingCycle}
                </span>
              </div>
              <span className="inline-block mt-1 px-2 py-1 bg-blue-900/30 border border-blue-800 text-blue-400 text-xs rounded-full">
                {currentPlan.name}
              </span>
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-500 mb-1">
                  Next billing date
                </p>
                <p className="text-sm text-neutral-300">
                  {currentPlan.nextBillingDate}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Billing cycle</p>
                <p className="text-sm text-neutral-300">Monthly</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleUpgradePlan}
              disabled={isLoading}
              className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Upgrade Plan
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-md text-sm hover:bg-neutral-750 transition-colors"
            >
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white">Payment Methods</h2>
            <button
              type="button"
              onClick={handleAddPaymentMethod}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-md text-sm hover:bg-neutral-750 transition-colors"
            >
              Add Method
            </button>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-neutral-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-neutral-100">
                        {method.brand} •••• {method.last4}
                      </p>
                      {method.isDefault && (
                        <span className="px-2 py-0.5 bg-blue-900/30 border border-blue-800 text-blue-400 text-xs rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">
                      Expires {method.expiryDate}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!method.isDefault && (
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-300 transition-colors"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-4">
            Billing History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-neutral-800 hover:bg-neutral-850 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm text-neutral-300">
                      {invoice.date}
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-400">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-300 font-medium">
                      {invoice.amount}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 border rounded text-xs ${getStatusColor(invoice.status)}`}
                      >
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {invoices.length === 0 && (
            <div className="text-center py-8 text-neutral-500">
              <p>No billing history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
