"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Panel, ProtoTable, Td, ProtoButton } from "@/components/PrototypeUI";

interface Vendor {
  id: number;
  name: string;
  gstin: string;
  panNumber: string;
  contactPerson: string;
  phone: string;
  routeRemarks: string;
  createdAt: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    gstin: "",
    panNumber: "",
    phone: "",
    email: "",
    address: "",
    contactPerson: "",
    routeRemarks: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadVendors = async () => {
    try {
      const data = await fetchApi("/Vendors");
      setVendors(data);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchApi("/Vendors", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setFormData({ name: "", gstin: "", panNumber: "", phone: "", email: "", address: "", contactPerson: "", routeRemarks: "" });
      loadVendors();
    } catch (error) {
      console.error(error);
      alert("Failed to save vendor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-[18px] items-start">
      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">Fleet Vendors</h3>
          <span className="text-[11.5px] text-muted-text">Includes route remarks history</span>
        </div>
        <ProtoTable headers={["Vendor", "PAN", "Phone", "Route Remarks"]}>
          {isLoading ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-4 block">Loading vendors...</span></Td>
            </tr>
          ) : vendors.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-4 block">No vendors found.</span></Td>
            </tr>
          ) : (
            vendors.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                <Td>{v.name}</Td>
                <Td className="font-mono text-[12px]">{v.panNumber}</Td>
                <Td className="font-mono text-[12px]">{v.phone}</Td>
                <Td className="text-muted-text text-[12px]">{v.routeRemarks || "—"}</Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </div>

      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">New Vendor</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-[16px]">
          <div className="mb-[12px]">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Vendor Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal"
              placeholder="e.g. Ramesh Transport" 
            />
          </div>
          <div className="mb-[12px] flex gap-3">
            <div className="flex-1">
              <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">GSTIN</label>
              <input 
                value={formData.gstin}
                onChange={e => setFormData({...formData, gstin: e.target.value})}
                className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal"
                placeholder="Optional" 
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">PAN</label>
              <input 
                required
                value={formData.panNumber}
                onChange={e => setFormData({...formData, panNumber: e.target.value})}
                className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal"
                placeholder="Required for TDS" 
              />
            </div>
          </div>
          <div className="mb-[12px]">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Phone</label>
            <input 
              required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal"
              placeholder="Phone number" 
            />
          </div>
          <div className="mb-[12px]">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Route Remarks</label>
            <textarea 
              value={formData.routeRemarks}
              onChange={e => setFormData({...formData, routeRemarks: e.target.value})}
              className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal h-[52px]"
              placeholder="e.g. Reliable on Blr-Mysore" 
            />
          </div>
          <ProtoButton variant="dark" style={{ width: '100%' }}>
            {isSubmitting ? "Saving..." : "Save Vendor"}
          </ProtoButton>
        </form>
      </div>
    </div>
  );
}
