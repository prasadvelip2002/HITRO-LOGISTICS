"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProtoTable, Td, ProtoButton } from "@/components/PrototypeUI";

export default function AdvancePaymentPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/Trips");
      // Filter for trips that have an advance amount setup but might not be fully paid yet
      setTrips(data.filter((t: any) => t.advanceAmount > 0));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !utrNumber) return;
    
    setIsSubmitting(true);
    try {
      await fetchApi("/Payments", {
        method: "POST",
        body: JSON.stringify({
          tripId: selectedTrip.id,
          amount: selectedTrip.advanceAmount,
          type: "Advance",
          utrNumber: utrNumber,
          status: "Completed",
          paymentDate: new Date().toISOString()
        }),
      });
      alert("Advance payment processed successfully!");
      setUtrNumber("");
      setSelectedTrip(null);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to process payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-[18px] items-start">
      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">Pending Advance Payments</h3>
          <span className="text-[11.5px] text-muted-text">Trips requiring advance payment to vendor</span>
        </div>
        <ProtoTable headers={["TRIP ID", "VENDOR", "ADVANCE REQ.", "STATUS", "ACTION"]}>
          {loading ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-5 block">Loading...</span></Td>
            </tr>
          ) : trips.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-5 block">No advance payments pending.</span></Td>
            </tr>
          ) : (
            trips.map(trip => (
              <tr 
                key={trip.id} 
                className={`transition-colors cursor-pointer ${selectedTrip?.id === trip.id ? 'bg-[#f8fafc]' : 'hover:bg-slate-50'}`}
                onClick={() => setSelectedTrip(trip)}
              >
                <Td className="font-mono text-[12.8px] font-semibold text-route">TRP-{1000 + trip.id}</Td>
                <Td className="text-[12px]">{trip.vendor?.name || `Vendor #${trip.vendorId}`}</Td>
                <Td className="font-semibold text-alert">₹{trip.advanceAmount?.toLocaleString()}</Td>
                <Td>
                  <span className="px-[8px] py-[3px] bg-[#fef9c3] text-[#a16207] rounded-[6px] text-[11px] font-medium border border-[#fef08a]">Pending Payment</span>
                </Td>
                <Td>
                  <button className="text-route hover:underline text-[12px] font-medium" onClick={() => setSelectedTrip(trip)}>Process</button>
                </Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </div>

      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between bg-slate-50">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">
            {selectedTrip ? `Process TRP-${1000 + selectedTrip.id}` : "Select a Trip"}
          </h3>
          {selectedTrip && (
            <span className="text-[12px] font-semibold text-alert">
              ₹{selectedTrip.advanceAmount?.toLocaleString()}
            </span>
          )}
        </div>
        
        {!selectedTrip ? (
          <div className="p-[40px] text-center text-muted-text text-[13px]">
            Please select a trip from the left to process its advance payment.
          </div>
        ) : (
          <form onSubmit={handlePayment} className="p-[16px] grid grid-cols-1 gap-[12px]">
            <div className="bg-[#f8fafc] p-[12px] rounded-[8px] border border-line mb-[10px]">
              <div className="flex justify-between mb-2">
                <span className="text-[12px] text-muted-text">Vendor:</span>
                <span className="text-[12px] font-semibold text-ink">{selectedTrip.vendor?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[12px] text-muted-text">Bank Details:</span>
                <span className="text-[12px] font-medium text-ink">{selectedTrip.vendor?.bankDetails || "N/A"}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 mt-2">
                <span className="text-[13px] font-semibold text-ink">Amount to Pay:</span>
                <span className="text-[14px] font-bold text-alert">₹{selectedTrip.advanceAmount?.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Bank Reference / UTR Number</label>
              <input 
                required 
                value={utrNumber} 
                onChange={e => setUtrNumber(e.target.value)} 
                className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal font-mono uppercase" 
                placeholder="e.g. HDFC123456789" 
              />
            </div>
            
            <div className="mt-2">
              <ProtoButton variant="primary" style={{ width: '100%', backgroundColor: '#22c55e', borderColor: '#16a34a' }}>
                {isSubmitting ? "Processing..." : "Confirm Payment"}
              </ProtoButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
