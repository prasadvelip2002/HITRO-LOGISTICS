"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProtoTable, Td, ProtoButton } from "@/components/PrototypeUI";

interface Indent {
  id: number;
  customerId: number;
  customer?: { name: string; gstin: string };
  source: string;
  destination: string;
  material: string;
  weight: number;
  vehicleType: string;
  loadingDate: string;
  status: string;
  destinationsJson?: string;
}

const DEFAULT_FORM = {
  id: 0,
  customerId: "",
  source: "",
  destination: "",
  material: "",
  weight: "",
  vehicleType: "",
  loadingDate: new Date().toISOString().split('T')[0],
  status: "New"
};

export default function IndentsPage() {
  const [indents, setIndents] = useState<Indent[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [indData, custData] = await Promise.all([
        fetchApi("/Indents"),
        fetchApi("/Customers")
      ]);
      setIndents(indData);
      setCustomers(custData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        customerId: parseInt(formData.customerId),
        weight: parseFloat(formData.weight),
        loadingDate: new Date(formData.loadingDate).toISOString(),
        destinationsJson: JSON.stringify([formData.destination])
      };

      if (formData.id > 0) {
        await fetchApi(`/Indents/${formData.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi("/Indents", {
          method: "POST",
          body: JSON.stringify({ ...payload, id: undefined }),
        });
      }
      setFormData(DEFAULT_FORM);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to save indent");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (ind: Indent) => {
    setFormData({
      id: ind.id,
      customerId: ind.customerId?.toString() || "",
      source: ind.source || "",
      destination: ind.destination || "",
      material: ind.material || "",
      weight: ind.weight?.toString() || "",
      vehicleType: ind.vehicleType || "",
      loadingDate: ind.loadingDate ? ind.loadingDate.split('T')[0] : "",
      status: ind.status || "New"
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this indent?")) return;
    try {
      await fetchApi(`/Indents/${id}`, { method: "DELETE" });
      if (formData.id === id) setFormData(DEFAULT_FORM);
      loadData();
    } catch (error) {
      alert("Failed to delete indent");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Assigned") return <span className="px-[8px] py-[3px] bg-[#dcfce7] text-[#166534] rounded-[6px] text-[11px] font-medium border border-[#bbf7d0]">Assigned</span>;
    if (status === "Pending") return <span className="px-[8px] py-[3px] bg-[#fef9c3] text-[#a16207] rounded-[6px] text-[11px] font-medium border border-[#fef08a]">Pending</span>;
    return <span className="px-[8px] py-[3px] bg-[#e0f2fe] text-[#075985] rounded-[6px] text-[11px] font-medium border border-[#bae6fd]">New</span>;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-[18px] items-start">
      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">Customer Indents</h3>
          <span className="text-[11.5px] text-muted-text">Manage customer requests</span>
        </div>
        <ProtoTable headers={["INDENT", "CUSTOMER", "ROUTE", "MATERIAL", "DATE", "STATUS", "ACTIONS"]}>
          {isLoading ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-7 block">Loading indents...</span></Td>
            </tr>
          ) : indents.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-7 block">No indents found.</span></Td>
            </tr>
          ) : (
            indents.map((ind) => (
              <tr key={ind.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => handleEdit(ind)}>
                <Td className="font-mono font-semibold text-[12.5px]">IND-{1000 + ind.id}</Td>
                <Td>{ind.customer?.name || `Customer #${ind.customerId}`}</Td>
                <Td className="text-[12px]">{ind.source} → {ind.destination}</Td>
                <Td className="text-[12px]">{ind.material} ({ind.weight}T)</Td>
                <Td className="text-[12px] whitespace-nowrap">{new Date(ind.loadingDate).toLocaleDateString()}</Td>
                <Td>{getStatusBadge(ind.status)}</Td>
                <Td>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(ind.id); }}
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
            {formData.id > 0 ? "Edit Indent" : "New Indent"}
          </h3>
          {formData.id > 0 && (
            <button onClick={() => setFormData(DEFAULT_FORM)} className="text-[12px] text-route hover:underline">
              Clear
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-[16px] grid grid-cols-2 gap-[12px]">
          <div className="col-span-2">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Customer</label>
            <select required value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Source</label>
            <input required value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. Mumbai" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Destination</label>
            <input required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. Pune" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Material</label>
            <input required value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. Auto Parts" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Weight (Tons)</label>
            <input required type="number" step="0.5" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. 20" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Vehicle Type Req.</label>
            <input required value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. 10 Wheeler" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Loading Date</label>
            <input required type="date" value={formData.loadingDate} onChange={e => setFormData({...formData, loadingDate: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" />
          </div>
          <div className="col-span-2">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
              <option value="New">New</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
            </select>
          </div>
          
          <div className="col-span-2 mt-2">
            <ProtoButton variant="dark" style={{ width: '100%' }}>
              {isSubmitting ? "Saving..." : (formData.id > 0 ? "Update Indent" : "Save Indent")}
            </ProtoButton>
          </div>
        </form>
      </div>
    </div>
  );
}
