"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProtoTable, Td, Badge, Panel } from "@/components/PrototypeUI";
import { Loader2, DollarSign, Wallet, CheckCircle } from "lucide-react";
import { Modal } from "@/components/Modal";
import Link from "next/link";

export default function VendorSettlementDashboard() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Settlement Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  
  const [utr, setUtr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/Finance/vendor-settlements");
      setTrips(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (trip: any) => {
    setSelectedTrip(trip);
    setUtr("");
    setIsModalOpen(true);
  };

  const handleSettle = async () => {
    if (!utr) return alert("Please enter the UTR / Ref Number");
    setSubmitting(true);
    
    // Calculate Final Balance
    const balance = (selectedTrip.supplierRate || 0) + (selectedTrip.tollCharges || 0) - (selectedTrip.advanceAmount || 0);

    try {
      await fetchApi(`/Finance/vendor-settlement/${selectedTrip.id}`, {
        method: "POST",
        body: JSON.stringify({ amount: balance, utrNumber: utr })
      });
      setIsModalOpen(false);
      loadData();
      alert("Vendor Settled Successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to settle vendor");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Vendor Settlements</h1>
          <p className="text-slate-500 text-sm mt-1">Settle the final balances for vendors after PODs are received.</p>
        </div>
      </div>

      <Panel>
        <ProtoTable 
          headers={["Trip ID", "Vendor", "Total Freight", "Advance Paid", "Balance Due", "Action"]}
        >
          {trips.map((trip) => {
            const balance = (trip.supplierRate || 0) + (trip.tollCharges || 0) - (trip.advanceAmount || 0);
            return (
              <tr key={trip.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <Td className="font-mono text-slate-500 font-medium">
                  <Link href={`/trips/${trip.id}/lr`} className="hover:text-blue-600 hover:underline">
                    TRP-{trip.id}
                  </Link>
                </Td>
                <Td>
                  <div className="font-bold text-slate-700">{trip.vendor?.name}</div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                    {trip.indent?.source} → {trip.indent?.destination}
                  </div>
                </Td>
                <Td className="font-semibold text-slate-700">₹{((trip.supplierRate || 0) + (trip.tollCharges || 0)).toLocaleString('en-IN')}</Td>
                <Td className="text-amber-600 font-semibold">₹{(trip.advanceAmount || 0).toLocaleString('en-IN')}</Td>
                <Td className="text-green-600 font-black text-[14px]">₹{balance.toLocaleString('en-IN')}</Td>
                <Td>
                  <button 
                    onClick={() => openModal(trip)}
                    className="bg-green-50 text-green-700 border border-green-200 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors flex items-center gap-1.5"
                  >
                    <Wallet className="w-3.5 h-3.5" /> Settle Account
                  </button>
                </Td>
              </tr>
            );
          })}
          {trips.length === 0 && (
            <tr><td colSpan={6} className="p-8 text-center text-slate-400">All vendor accounts are settled!</td></tr>
          )}
        </ProtoTable>
      </Panel>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Vendor Settlement">
        {selectedTrip && (
          <div className="space-y-5">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Final Calculation</div>
                <Badge color="green">Ready for Payout</Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Freight</span>
                  <span className="font-semibold">₹{(selectedTrip.supplierRate || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Toll & Extras</span>
                  <span className="font-semibold text-blue-600">+ ₹{(selectedTrip.tollCharges || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600">Less: Advance Paid</span>
                  <span className="font-semibold text-red-600">- ₹{(selectedTrip.advanceAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-800 font-bold">Total Balance Payable</span>
                  <span className="font-black text-green-600 text-lg">
                    ₹{((selectedTrip.supplierRate || 0) + (selectedTrip.tollCharges || 0) - (selectedTrip.advanceAmount || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bank Reference / UTR Number</label>
              <input 
                type="text" 
                value={utr}
                onChange={e => setUtr(e.target.value)}
                placeholder="e.g. HDFC000123456"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              onClick={handleSettle}
              disabled={submitting}
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors flex justify-center items-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Confirm Settlement</>}
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
}
