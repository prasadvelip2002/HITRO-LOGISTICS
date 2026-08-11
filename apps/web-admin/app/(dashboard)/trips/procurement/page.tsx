"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProtoTable, Td, Badge, Panel } from "@/components/PrototypeUI";
import { Loader2, Users, Send, CheckCircle, Truck, DollarSign } from "lucide-react";
import { Modal } from "@/components/Modal";

export default function ProcurementDashboard() {
  const [indents, setIndents] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // RFQ Broadcast State
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<any>(null);
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);
  
  // View Bids State
  const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);
  const [bids, setBids] = useState<any[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [indentsData, vendorsData] = await Promise.all([
        fetchApi("/Indents"),
        fetchApi("/Vendors")
      ]);
      // Only show indents that are New/Pending or have active RFQs
      setIndents(indentsData.filter((i: any) => i.status === "New" || i.status === "Pending" || i.status === "Assigned"));
      setVendors(vendorsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openRfqModal = (indent: any) => {
    setSelectedIndent(indent);
    setSelectedVendors([]);
    setIsRfqModalOpen(true);
  };

  const handleSendRfq = async () => {
    if (selectedVendors.length === 0) return alert("Select at least one vendor");
    try {
      await fetchApi(`/Procurement/BroadcastRFQ/${selectedIndent.id}`, {
        method: "POST",
        body: JSON.stringify(selectedVendors),
      });
      setIsRfqModalOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      alert("Failed to send RFQ");
    }
  };

  const openBidsModal = async (indent: any) => {
    setSelectedIndent(indent);
    setIsBidsModalOpen(true);
    setLoadingBids(true);
    try {
      const data = await fetchApi(`/Procurement/Quotations/${indent.id}`);
      setBids(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBids(false);
    }
  };

  const handleApproveBid = async (quotationId: number) => {
    if (!confirm("Are you sure you want to approve this rate? It will generate a Trip and Purchase Order automatically.")) return;
    try {
      const res = await fetchApi(`/Procurement/ApproveBid/${quotationId}`, { method: "POST" });
      alert(`Success! Generated Trip #${res.tripId} and ${res.poNumber}`);
      setIsBidsModalOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      alert("Failed to approve bid");
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Procurement & Bidding</h1>
          <p className="text-slate-500 text-sm mt-1">Manage vendor RFQs, compare bids, and generate POs.</p>
        </div>
      </div>

      <Panel>
        <ProtoTable 
          headers={["ID", "Customer", "Route", "Material", "Indent Status", "RFQ Status", "Actions"]}
        >
          {indents.map((indent) => (
            <tr key={indent.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <Td className="font-mono text-slate-500">IND-{indent.id}</Td>
              <Td className="font-bold text-slate-700">{indent.customer?.name}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-[120px]">{indent.source}</span>
                  <span className="text-slate-300">→</span>
                  <span className="truncate max-w-[120px]">{indent.destination}</span>
                </div>
              </Td>
              <Td>
                <div className="text-[13px]">{indent.material}</div>
                <div className="text-[11px] text-slate-400">{indent.weight} Tons • {indent.vehicleType}</div>
              </Td>
              <Td><Badge color={indent.status === "Assigned" ? "green" : "slate"}>{indent.status}</Badge></Td>
              <Td>
                <Badge 
                  color={
                    indent.rfqStatus === "Pending" ? "slate" :
                    indent.rfqStatus === "Sent" ? "blue" :
                    indent.rfqStatus === "QuotationReceived" ? "yellow" :
                    "green"
                  }
                >
                  {indent.rfqStatus}
                </Badge>
              </Td>
              <Td>
                <div className="flex gap-2">
                  {indent.rfqStatus === "Pending" && (
                    <button 
                      onClick={() => openRfqModal(indent)}
                      className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" /> Broadcast RFQ
                    </button>
                  )}
                  {(indent.rfqStatus === "Sent" || indent.rfqStatus === "QuotationReceived") && (
                    <button 
                      onClick={() => openBidsModal(indent)}
                      className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 relative"
                    >
                      <DollarSign className="w-3 h-3" /> View Bids
                      {indent.rfqStatus === "QuotationReceived" && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </button>
                  )}
                  {indent.rfqStatus === "Approved" && (
                    <button className="bg-slate-100 text-slate-400 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3" /> PO Generated
                    </button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
          {indents.length === 0 && (
            <tr><td colSpan={7} className="p-8 text-center text-slate-400">No active indents found.</td></tr>
          )}
        </ProtoTable>
      </Panel>

      {/* RFQ Broadcast Modal */}
      <Modal isOpen={isRfqModalOpen} onClose={() => setIsRfqModalOpen(false)} title="Broadcast RFQ to Vendors">
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm">
            You are requesting a vehicle for <strong>{selectedIndent?.source} → {selectedIndent?.destination}</strong>.
            <br/>Required: <strong>{selectedIndent?.vehicleType}</strong> ({selectedIndent?.weight} Tons)
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Select Vendors to invite</label>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {vendors.map(v => (
                <label key={v.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedVendors.includes(v.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedVendors([...selectedVendors, v.id]);
                      else setSelectedVendors(selectedVendors.filter(id => id !== v.id));
                    }}
                  />
                  <div>
                    <div className="font-semibold text-slate-700 text-sm">{v.name}</div>
                    <div className="text-xs text-slate-500">{v.city}, {v.state}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleSendRfq}
            className="w-full bg-slate-900 text-white rounded-xl py-3 font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Send RFQ to {selectedVendors.length} Vendors
          </button>
        </div>
      </Modal>

      {/* View Bids Modal */}
      <Modal isOpen={isBidsModalOpen} onClose={() => setIsBidsModalOpen(false)} title={`Vendor Bids - IND-${selectedIndent?.id}`}>
        {loadingBids ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {bids.map(bid => (
                <div key={bid.id} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{bid.vendor?.name}</h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <Truck className="w-3 h-3" /> {bid.proposedVehicleType || "Vehicle TBD"}
                      </div>
                    </div>
                    <Badge color={bid.status === "Pending" ? "slate" : bid.status === "Approved" ? "green" : bid.status === "Rejected" ? "red" : "blue"}>
                      {bid.status}
                    </Badge>
                  </div>
                  
                  {bid.status !== "Pending" ? (
                    <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Quoted Rate</div>
                        <div className="text-lg font-black text-slate-800">₹{bid.quotedRate?.toLocaleString('en-IN')}</div>
                      </div>
                      
                      {bid.status === "QuotationReceived" && (
                        <button 
                          onClick={() => handleApproveBid(bid.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
                        >
                          Approve & Generate PO
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-slate-400 italic bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                      Waiting for vendor to submit bid...
                    </div>
                  )}
                  
                  {/* Magic Link For Demo Purposes */}
                  {bid.status === "Pending" && (
                    <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                      <span>Vendor Magic Link (For Demo):</span>
                      <a href={`/bidding/${bid.magicLinkToken}`} target="_blank" className="text-blue-500 hover:underline truncate max-w-[200px]">
                        /bidding/{bid.magicLinkToken}
                      </a>
                    </div>
                  )}
                </div>
              ))}
              
              {bids.length === 0 && (
                <div className="text-center p-6 text-slate-400 text-sm">No RFQs sent for this indent yet.</div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
