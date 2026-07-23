"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProtoTable, Td, ProtoButton } from "@/components/PrototypeUI";

interface Customer {
  id: number;
  name: string;
  gstin: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pan: string;
  creditLimit: number;
  paymentTerms: string;
  code: string;
  rateContract: string;
  status: string;
  createdAt: string;
}

const DEFAULT_FORM = {
  id: 0,
  name: "",
  gstin: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pan: "",
  creditLimit: 0,
  paymentTerms: "Net 30",
  contactPerson: "",
  code: "",
  rateContract: "",
  status: "Active"
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCustomers = async () => {
    try {
      const data = await fetchApi("/Customers");
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData.id > 0) {
        // Edit
        await fetchApi(`/Customers/${formData.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        // Create
        await fetchApi("/Customers", {
          method: "POST",
          body: JSON.stringify({ ...formData, id: undefined }), // Let backend assign ID
        });
      }
      setFormData(DEFAULT_FORM);
      loadCustomers();
    } catch (error) {
      console.error(error);
      alert("Failed to save customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (c: Customer) => {
    setFormData({
      id: c.id,
      name: c.name || "",
      gstin: c.gstin || "",
      phone: c.phone || "",
      email: c.email || "",
      address: c.address || "",
      city: c.city || "",
      state: c.state || "",
      pan: c.pan || "",
      creditLimit: c.creditLimit || 0,
      paymentTerms: c.paymentTerms || "Net 30",
      contactPerson: c.contactPerson || "",
      code: c.code || "",
      rateContract: c.rateContract || "",
      status: c.status || "Active"
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await fetchApi(`/Customers/${id}`, { method: "DELETE" });
      if (formData.id === id) setFormData(DEFAULT_FORM);
      loadCustomers();
    } catch (error) {
      alert("Failed to delete customer");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Active") return <span className="px-[8px] py-[3px] bg-[#dcfce7] text-[#166534] rounded-[6px] text-[11px] font-medium border border-[#bbf7d0]">Active</span>;
    if (status === "Pending KYC") return <span className="px-[8px] py-[3px] bg-[#fef9c3] text-[#a16207] rounded-[6px] text-[11px] font-medium border border-[#fef08a]">Pending KYC</span>;
    if (status === "On Hold") return <span className="px-[8px] py-[3px] bg-[#fee2e2] text-[#991b1b] rounded-[6px] text-[11px] font-medium border border-[#fecaca]">On Hold</span>;
    return <span className="px-[8px] py-[3px] bg-gray-100 text-gray-700 rounded-[6px] text-[11px] font-medium border border-gray-200">{status || 'Draft'}</span>;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-[18px] items-start">
      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">Customers</h3>
        </div>
        <ProtoTable headers={["CODE", "CUSTOMER", "GSTIN", "RATE CONTRACT", "STATUS", "ACTIONS"]}>
          {isLoading ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-6 block">Loading customers...</span></Td>
            </tr>
          ) : customers.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-6 block">No customers found.</span></Td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => handleEdit(c)}>
                <Td className="font-mono text-[12px]">{c.code || "—"}</Td>
                <Td>{c.name}</Td>
                <Td className="font-mono text-[12px]">{c.gstin || "—"}</Td>
                <Td className="text-[12px] text-muted-text font-medium">{c.rateContract || "Draft"}</Td>
                <Td>{getStatusBadge(c.status)}</Td>
                <Td>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
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
            {formData.id > 0 ? "Edit Customer" : "New Customer"}
          </h3>
          {formData.id > 0 && (
            <button onClick={() => setFormData(DEFAULT_FORM)} className="text-[12px] text-route hover:underline">
              Clear
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-[16px] grid grid-cols-2 gap-[12px]">
          <div className="col-span-2">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Customer Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. ABC Cement Ltd" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Code</label>
            <input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. CUST-001" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">GSTIN</label>
            <input required value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="GST number" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Rate Contract</label>
            <input value={formData.rateContract} onChange={e => setFormData({...formData, rateContract: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. Active - FTL" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
              <option value="Active">Active</option>
              <option value="Pending KYC">Pending KYC</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Phone</label>
            <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="Phone number" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">City</label>
            <input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. Bangalore" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">State</label>
            <input value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. Karnataka" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">PAN Number</label>
            <input value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. ABCDE1234F" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Credit Limit (₹)</label>
            <input type="number" value={formData.creditLimit} onChange={e => setFormData({...formData, creditLimit: Number(e.target.value)})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. 500000" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Payment Terms</label>
            <select value={formData.paymentTerms} onChange={e => setFormData({...formData, paymentTerms: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
              <option value="Immediate">Immediate</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 60">Net 60</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Contact Person</label>
            <input value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. Ramesh" />
          </div>
          <div className="col-span-2">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Billing Address</label>
            <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal h-[52px]" placeholder="Full address" />
          </div>
          <div className="col-span-2 mt-2">
            <ProtoButton variant="dark" style={{ width: '100%' }}>
              {isSubmitting ? "Saving..." : (formData.id > 0 ? "Update Customer" : "Save Customer")}
            </ProtoButton>
          </div>
        </form>
      </div>
    </div>
  );
}
