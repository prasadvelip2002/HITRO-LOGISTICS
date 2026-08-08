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
    if (status === "Confirmed") return <span className="px-[8px] py-[3px] bg-[#dcfce7] text-[#166534] rounded-[6px] text-[11px] font-medium border border-[#bbf7d0]">Confirmed</span>;
    if (status === "Pending" || status === "Open") return <span className="px-[8px] py-[3px] bg-[#ffedd5] text-[#c2410c] rounded-[6px] text-[11px] font-medium border border-[#fdba74]">Open</span>;
    return <span className="px-[8px] py-[3px] bg-[#e0f2fe] text-[#075985] rounded-[6px] text-[11px] font-medium border border-[#bae6fd]">New</span>;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6 items-start max-w-[1600px] mx-auto pb-10">
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[16px] text-slate-900 m-0 tracking-tight">Customer Indents</h3>
            <p className="text-[12.5px] font-medium text-slate-500 mt-1">Manage and track customer requests</p>
          </div>
        </div>
        <ProtoTable headers={["INDENT #", "CUSTOMER", "ROUTE", "VEHICLE TYPE", "PICKUP", "STATUS"]}>
          {isLoading ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-6 block">Loading indents...</span></Td>
            </tr>
          ) : indents.length === 0 ? (
            <>
              <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                <Td className="font-mono font-semibold text-[12.5px]">IND-5521</Td>
                <Td>ACME Logistics</Td>
                <Td className="text-[12px]">Mumbai → Pune</Td>
                <Td className="text-[12px]">32ft MXL</Td>
                <Td className="text-[12px] whitespace-nowrap">07 Jul</Td>
                <Td>{getStatusBadge("Assigned")}</Td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                <Td className="font-mono font-semibold text-[12.5px]">IND-5522</Td>
                <Td>BlueDart Movers</Td>
                <Td className="text-[12px]">Delhi → Jaipur</Td>
                <Td className="text-[12px]">20ft SXL</Td>
                <Td className="text-[12px] whitespace-nowrap">07 Jul</Td>
                <Td>{getStatusBadge("Open")}</Td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                <Td className="font-mono font-semibold text-[12.5px]">IND-5523</Td>
                <Td>Sterling Freight</Td>
                <Td className="text-[12px]">Chennai → Blr</Td>
                <Td className="text-[12px]">Container</Td>
                <Td className="text-[12px] whitespace-nowrap">08 Jul</Td>
                <Td>{getStatusBadge("Open")}</Td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                <Td className="font-mono font-semibold text-[12.5px]">IND-5524</Td>
                <Td>Orbit Traders</Td>
                <Td className="text-[12px]">Kolkata → Patna</Td>
                <Td className="text-[12px]">14ft</Td>
                <Td className="text-[12px] whitespace-nowrap">08 Jul</Td>
                <Td>{getStatusBadge("Confirmed")}</Td>
              </tr>
            </>
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

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[16px] text-slate-900 m-0 tracking-tight">
              {formData.id > 0 ? "Edit Indent" : "New Indent"}
            </h3>
            <p className="text-[12.5px] font-medium text-slate-500 mt-1">
              {formData.id > 0 ? "Update indent details" : "Create a new indent record"}
            </p>
          </div>
          {formData.id > 0 && (
            <button onClick={() => setFormData(DEFAULT_FORM)} className="text-[12px] font-semibold text-yellow-600 hover:text-yellow-700 bg-yellow-50 hover:bg-yellow-100 px-3 py-1.5 rounded-lg transition-colors">
              Clear Form
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-[11.5px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Customer</label>
            <select required value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13.5px] bg-white text-slate-800 font-medium outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all shadow-sm">
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Source</label>
            <input required value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13.5px] bg-white text-slate-800 font-medium outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all shadow-sm" placeholder="e.g. Mumbai" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Destination</label>
            <input required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13.5px] bg-white text-slate-800 font-medium outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all shadow-sm" placeholder="e.g. Pune" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Material</label>
            <input required value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13.5px] bg-white text-slate-800 font-medium outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all shadow-sm" placeholder="e.g. Auto Parts" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Weight (Tons)</label>
            <input required type="number" step="0.5" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13.5px] bg-white text-slate-800 font-medium outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all shadow-sm" placeholder="e.g. 20" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Vehicle Type Req.</label>
            <input required value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13.5px] bg-white text-slate-800 font-medium outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all shadow-sm" placeholder="e.g. 10 Wheeler" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Loading Date</label>
            <input required type="date" value={formData.loadingDate} onChange={e => setFormData({...formData, loadingDate: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13.5px] bg-white text-slate-800 font-medium outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all shadow-sm" />
          </div>
          <div className="col-span-2">
            <label className="block text-[11.5px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13.5px] bg-white text-slate-800 font-medium outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all shadow-sm">
              <option value="New">New</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
            </select>
          </div>
          
          <div className="col-span-2 mt-4">
            <button 
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-[14px] py-3 rounded-xl shadow-sm transition-colors"
            >
              {isSubmitting ? "Saving..." : (formData.id > 0 ? "Update Indent" : "Save Indent")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
