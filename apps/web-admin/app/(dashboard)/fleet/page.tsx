"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProtoTable, Td, ProtoButton } from "@/components/PrototypeUI";

interface Vendor {
  id: number;
  name: string;
  code: string;
  gstin: string;
  panNumber: string; // PAN is named panNumber in original form, wait let's check API. Ah, Vendor.cs has PAN. The original UI mapped it to panNumber maybe? I'll use pan.
  pan: string;
  bankDetails: string;
  tdsInfo: string;
  contactPerson: string;
  email: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  routeRemarks: string;
  status: string;
  createdAt: string;
}

const DEFAULT_FORM = {
  id: 0,
  name: "",
  code: "",
  gstin: "",
  pan: "",
  bankDetails: "",
  tdsInfo: "",
  contactPerson: "",
  email: "",
  address: "",
  city: "",
  state: "",
  phone: "",
  routeRemarks: "",
  status: "Active"
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState(DEFAULT_FORM);
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
      if (formData.id > 0) {
        await fetchApi(`/Vendors/${formData.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        await fetchApi("/Vendors", {
          method: "POST",
          body: JSON.stringify({ ...formData, id: undefined }),
        });
      }
      setFormData(DEFAULT_FORM);
      loadVendors();
    } catch (error) {
      console.error(error);
      alert("Failed to save vendor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (v: Vendor) => {
    setFormData({
      id: v.id,
      name: v.name || "",
      code: v.code || "",
      gstin: v.gstin || "",
      pan: v.pan || "",
      bankDetails: v.bankDetails || "",
      tdsInfo: v.tdsInfo || "",
      contactPerson: v.contactPerson || "",
      email: v.email || "",
      address: v.address || "",
      city: v.city || "",
      state: v.state || "",
      phone: v.phone || "",
      routeRemarks: v.routeRemarks || "",
      status: v.status || "Active"
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await fetchApi(`/Vendors/${id}`, { method: "DELETE" });
      if (formData.id === id) setFormData(DEFAULT_FORM);
      loadVendors();
    } catch (error) {
      alert("Failed to delete vendor");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Active") return <span className="px-[8px] py-[3px] bg-[#dcfce7] text-[#166534] rounded-[6px] text-[11px] font-medium border border-[#bbf7d0]">Active</span>;
    if (status === "Blacklisted") return <span className="px-[8px] py-[3px] bg-[#fee2e2] text-[#991b1b] rounded-[6px] text-[11px] font-medium border border-[#fecaca]">Blacklisted</span>;
    return <span className="px-[8px] py-[3px] bg-gray-100 text-gray-700 rounded-[6px] text-[11px] font-medium border border-gray-200">{status || 'Draft'}</span>;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-[18px] items-start">
      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">Fleet Vendors</h3>
          <span className="text-[11.5px] text-muted-text">Vendor management</span>
        </div>
        <ProtoTable headers={["CODE", "VENDOR", "PAN", "STATUS", "REMARKS", "ACTIONS"]}>
          {isLoading ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-6 block">Loading vendors...</span></Td>
            </tr>
          ) : vendors.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-6 block">No vendors found.</span></Td>
            </tr>
          ) : (
            vendors.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => handleEdit(v)}>
                <Td className="font-mono text-[12px]">{v.code || "—"}</Td>
                <Td>{v.name}</Td>
                <Td className="font-mono text-[12px]">{v.pan}</Td>
                <Td>{getStatusBadge(v.status)}</Td>
                <Td className="text-muted-text text-[12px] max-w-[120px] truncate" title={v.routeRemarks}>{v.routeRemarks || "—"}</Td>
                <Td>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(v.id); }}
                    className="text-muted-text hover:text-alert text-[12px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </div>

      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">
            {formData.id > 0 ? "Edit Vendor" : "New Vendor"}
          </h3>
          {formData.id > 0 && (
            <button onClick={() => setFormData(DEFAULT_FORM)} className="text-[12px] text-route hover:underline">
              Clear
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-[16px] grid grid-cols-2 gap-[12px]">
          <div className="col-span-2">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Vendor Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. Ramesh Transport" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Code</label>
            <input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. VEND-001" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
              <option value="Active">Active</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">PAN Number</label>
            <input required value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="Required for TDS" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">GSTIN</label>
            <input value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="Optional" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Phone</label>
            <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="Phone number" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Contact Person</label>
            <input value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. Ramesh" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="Vendor email" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">City</label>
            <input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. Mumbai" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">State</label>
            <input value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. Maharashtra" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">TDS Info</label>
            <input value={formData.tdsInfo} onChange={e => setFormData({...formData, tdsInfo: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. 2%" />
          </div>
          <div className="col-span-2">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Office Address</label>
            <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal h-[52px]" placeholder="Full address" />
          </div>
          <div className="col-span-2">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Bank Details</label>
            <textarea value={formData.bankDetails} onChange={e => setFormData({...formData, bankDetails: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal h-[52px]" placeholder="Account & IFSC" />
          </div>
          <div className="col-span-2">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Route Remarks</label>
            <textarea value={formData.routeRemarks} onChange={e => setFormData({...formData, routeRemarks: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal h-[52px]" placeholder="e.g. Reliable on Blr-Mysore" />
          </div>
          <div className="col-span-2 mt-2">
            <ProtoButton variant="dark" style={{ width: '100%' }}>
              {isSubmitting ? "Saving..." : (formData.id > 0 ? "Update Vendor" : "Save Vendor")}
            </ProtoButton>
          </div>
        </form>
      </div>
    </div>
  );
}
