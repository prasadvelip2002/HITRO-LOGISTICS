"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Plus } from "lucide-react";
import { Panel, ProtoTable, Td, ProtoButton } from "@/components/PrototypeUI";

interface Customer {
  id: number;
  name: string;
  gstin: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    gstin: "",
    phone: "",
    email: "",
    address: "",
    contactPerson: ""
  });
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
      await fetchApi("/Customers", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setFormData({ name: "", gstin: "", phone: "", email: "", address: "", contactPerson: "" });
      loadCustomers();
    } catch (error) {
      console.error(error);
      alert("Failed to save customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-[18px] items-start">
      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">Customers</h3>
        </div>
        <ProtoTable headers={["Customer", "GSTIN", "Phone", "Contact", "Created At"]}>
          {isLoading ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-5 block">Loading customers...</span></Td>
            </tr>
          ) : customers.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-5 block">No customers found.</span></Td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <Td>{c.name}</Td>
                <Td className="font-mono text-[12px]">{c.gstin}</Td>
                <Td className="font-mono text-[12px]">{c.phone}</Td>
                <Td>{c.contactPerson || "—"}</Td>
                <Td className="text-muted-text text-[12px]">{new Date(c.createdAt).toLocaleDateString()}</Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </div>

      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">New Customer</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-[16px]">
          <div className="mb-[12px]">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Customer Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal"
              placeholder="e.g. ABC Cement Ltd" 
            />
          </div>
          <div className="mb-[12px]">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">GSTIN</label>
            <input 
              required
              value={formData.gstin}
              onChange={e => setFormData({...formData, gstin: e.target.value})}
              className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal"
              placeholder="Search by GST number" 
            />
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
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Contact Person</label>
            <input 
              value={formData.contactPerson}
              onChange={e => setFormData({...formData, contactPerson: e.target.value})}
              className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal"
              placeholder="e.g. Ramesh" 
            />
          </div>
          <div className="mb-[12px]">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Billing Address</label>
            <textarea 
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal h-[52px]"
              placeholder="Full address" 
            />
          </div>
          <ProtoButton variant="dark" style={{ width: '100%' }}>
            {isSubmitting ? "Saving..." : "Save Customer"}
          </ProtoButton>
        </form>
      </div>
    </div>
  );
}
