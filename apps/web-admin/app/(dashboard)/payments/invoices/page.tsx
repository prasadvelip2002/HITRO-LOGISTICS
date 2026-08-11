"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProtoTable, Td, Badge, Panel } from "@/components/PrototypeUI";
import { Loader2, FileText, CheckSquare, Square, FilePlus } from "lucide-react";

export default function CustomerInvoicingDashboard() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection state
  const [selectedCustomer, setSelectedCustomer] = useState<number | "">("");
  const [unbilledTrips, setUnbilledTrips] = useState<any[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<number[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadBaseData();
  }, []);

  const loadBaseData = async () => {
    setLoading(true);
    try {
      const [custData, invData] = await Promise.all([
        fetchApi("/Customers"),
        fetchApi("/Finance/invoices")
      ]);
      setCustomers(custData);
      setInvoices(invData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      loadUnbilledTrips(selectedCustomer as number);
    } else {
      setUnbilledTrips([]);
      setSelectedTrips([]);
    }
  }, [selectedCustomer]);

  const loadUnbilledTrips = async (custId: number) => {
    try {
      const data = await fetchApi(`/Finance/unbilled-trips/${custId}`);
      setUnbilledTrips(data);
      setSelectedTrips([]); // reset selection
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTripSelection = (tripId: number) => {
    if (selectedTrips.includes(tripId)) {
      setSelectedTrips(selectedTrips.filter(id => id !== tripId));
    } else {
      setSelectedTrips([...selectedTrips, tripId]);
    }
  };

  const toggleAll = () => {
    if (selectedTrips.length === unbilledTrips.length) {
      setSelectedTrips([]);
    } else {
      setSelectedTrips(unbilledTrips.map(t => t.id));
    }
  };

  const handleGenerateInvoice = async () => {
    if (selectedTrips.length === 0) return alert("Select at least one trip to invoice.");
    setGenerating(true);
    try {
      await fetchApi("/Finance/invoice", {
        method: "POST",
        body: JSON.stringify({ tripIds: selectedTrips })
      });
      alert("Invoice generated successfully!");
      // Reload everything
      loadUnbilledTrips(selectedCustomer as number);
      loadBaseData();
    } catch (e) {
      console.error(e);
      alert("Failed to generate invoice");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Customer Invoicing</h1>
          <p className="text-slate-500 text-sm mt-1">Group closed trips and generate formal tax invoices for your clients.</p>
        </div>
      </div>

      {/* Invoice Generator Section */}
      <Panel title="Generate New Invoice" className="border-blue-200">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-end gap-4">
          <div className="flex-1 max-w-sm">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Customer to Bill</label>
            <select 
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value ? Number(e.target.value) : "")}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>
          
          {selectedCustomer && unbilledTrips.length > 0 && (
            <button 
              onClick={handleGenerateInvoice}
              disabled={selectedTrips.length === 0 || generating}
              className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FilePlus className="w-5 h-5" />}
              Generate Invoice for {selectedTrips.length} Trips
            </button>
          )}
        </div>

        {selectedCustomer ? (
          unbilledTrips.length > 0 ? (
            <ProtoTable headers={["Select", "Trip ID", "Route & Date", "Freight Amount", "Status"]}>
              <tr>
                <Td className="bg-slate-50">
                  <button onClick={toggleAll} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    {selectedTrips.length === unbilledTrips.length ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4" />}
                    Select All
                  </button>
                </Td>
                <td colSpan={4} className="bg-slate-50"></td>
              </tr>
              {unbilledTrips.map(trip => (
                <tr key={trip.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <Td>
                    <button onClick={() => toggleTripSelection(trip.id)}>
                      {selectedTrips.includes(trip.id) ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>
                  </Td>
                  <Td className="font-mono text-slate-500 font-medium">TRP-{trip.id}</Td>
                  <Td>
                    <div className="font-bold text-slate-700">{trip.indent?.source} → {trip.indent?.destination}</div>
                    <div className="text-[11px] text-slate-500">Delivered: {new Date(trip.podReceivedDate).toLocaleDateString()}</div>
                  </Td>
                  <Td className="font-semibold text-slate-700">₹{(trip.freightCharges + (trip.tollCharges || 0)).toLocaleString('en-IN')}</Td>
                  <Td><Badge color="green">Ready for Billing</Badge></Td>
                </tr>
              ))}
            </ProtoTable>
          ) : (
            <div className="p-8 text-center text-slate-400">
              No unbilled closed trips found for this customer.
            </div>
          )
        ) : (
          <div className="p-8 text-center text-slate-400">
            Select a customer above to view their unbilled trips.
          </div>
        )}
      </Panel>

      {/* Invoice History Section */}
      <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">Past Invoices</h2>
      <Panel>
        <ProtoTable headers={["Invoice No", "Date", "Customer", "Amount (inc. Tax)", "Status", "Action"]}>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <Td className="font-mono text-slate-500 font-medium">{inv.invoiceNumber}</Td>
              <Td className="text-slate-600">{new Date(inv.invoiceDate).toLocaleDateString()}</Td>
              <Td className="font-bold text-slate-700">{inv.customer?.name}</Td>
              <Td className="font-black text-slate-800">₹{inv.grandTotal.toLocaleString('en-IN')}</Td>
              <Td>
                <Badge color={inv.status === "Paid" ? "green" : inv.status === "Unpaid" ? "red" : "orange"}>
                  {inv.status}
                </Badge>
              </Td>
              <Td>
                <a 
                  href={`/invoices/${inv.id}/pdf`}
                  target="_blank"
                  className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5 w-max"
                >
                  <FileText className="w-3.5 h-3.5" /> View PDF
                </a>
              </Td>
            </tr>
          ))}
          {invoices.length === 0 && (
            <tr><td colSpan={6} className="p-8 text-center text-slate-400">No invoices generated yet.</td></tr>
          )}
        </ProtoTable>
      </Panel>

    </div>
  );
}
