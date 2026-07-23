"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProtoTable, Td, ProtoButton } from "@/components/PrototypeUI";

interface Vehicle {
  id: number;
  registrationNumber: string;
  code: string;
  type: string;
  capacityInTons: number;
  ownerName: string;
  rcNumber: string;
  insuranceExpiry: string;
  permitExpiry: string;
  fitnessExpiry: string;
  vendorId: number;
  vendor?: { name: string };
  status: string;
}

interface Vendor {
  id: number;
  name: string;
}

const DEFAULT_FORM = {
  id: 0,
  registrationNumber: "",
  code: "",
  type: "",
  capacityInTons: "",
  ownerName: "",
  rcNumber: "",
  insuranceExpiry: "",
  permitExpiry: "",
  fitnessExpiry: "",
  vendorId: "",
  status: "Active"
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [vehData, venData] = await Promise.all([
        fetchApi("/Vehicles"),
        fetchApi("/Vendors")
      ]);
      setVehicles(vehData);
      setVendors(venData);
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
        capacityInTons: parseFloat(formData.capacityInTons),
        vendorId: parseInt(formData.vendorId)
      };

      if (formData.id > 0) {
        await fetchApi(`/Vehicles/${formData.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi("/Vehicles", {
          method: "POST",
          body: JSON.stringify({ ...payload, id: undefined }),
        });
      }
      setFormData(DEFAULT_FORM);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to save vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (v: Vehicle) => {
    setFormData({
      id: v.id,
      registrationNumber: v.registrationNumber || "",
      code: v.code || "",
      type: v.type || "",
      capacityInTons: v.capacityInTons?.toString() || "",
      ownerName: v.ownerName || "",
      rcNumber: v.rcNumber || "",
      insuranceExpiry: v.insuranceExpiry ? v.insuranceExpiry.split('T')[0] : "",
      permitExpiry: v.permitExpiry ? v.permitExpiry.split('T')[0] : "",
      fitnessExpiry: v.fitnessExpiry ? v.fitnessExpiry.split('T')[0] : "",
      vendorId: v.vendorId?.toString() || "",
      status: v.status || "Active"
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await fetchApi(`/Vehicles/${id}`, { method: "DELETE" });
      if (formData.id === id) setFormData(DEFAULT_FORM);
      loadData();
    } catch (error) {
      alert("Failed to delete vehicle");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Active") return <span className="px-[8px] py-[3px] bg-[#dcfce7] text-[#166534] rounded-[6px] text-[11px] font-medium border border-[#bbf7d0]">Active</span>;
    if (status === "Maintenance") return <span className="px-[8px] py-[3px] bg-[#fef9c3] text-[#a16207] rounded-[6px] text-[11px] font-medium border border-[#fef08a]">Maintenance</span>;
    return <span className="px-[8px] py-[3px] bg-gray-100 text-gray-700 rounded-[6px] text-[11px] font-medium border border-gray-200">{status || 'Draft'}</span>;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-[18px] items-start">
      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">Vehicles</h3>
        </div>
        <ProtoTable headers={["CODE", "REG. NUMBER", "TYPE", "CAPACITY", "VENDOR", "STATUS", "ACTIONS"]}>
          {isLoading ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-7 block">Loading vehicles...</span></Td>
            </tr>
          ) : vehicles.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-7 block">No vehicles found.</span></Td>
            </tr>
          ) : (
            vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => handleEdit(v)}>
                <Td className="font-mono text-[12px]">{v.code || "—"}</Td>
                <Td className="font-mono font-semibold">{v.registrationNumber}</Td>
                <Td>{v.type}</Td>
                <Td>{v.capacityInTons} Tons</Td>
                <Td className="text-[12px]">{v.vendor?.name || `Vendor #${v.vendorId}`}</Td>
                <Td>{getStatusBadge(v.status)}</Td>
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
            {formData.id > 0 ? "Edit Vehicle" : "New Vehicle"}
          </h3>
          {formData.id > 0 && (
            <button onClick={() => setFormData(DEFAULT_FORM)} className="text-[12px] text-route hover:underline">
              Clear
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-[16px] grid grid-cols-2 gap-[12px]">
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Reg. Number</label>
            <input required value={formData.registrationNumber} onChange={e => setFormData({...formData, registrationNumber: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal uppercase" placeholder="KA01AB1234" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Code</label>
            <input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal uppercase" placeholder="VEH-001" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Type</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
              <option value="">Select Type</option>
              <option value="Open Body">Open Body</option>
              <option value="Container">Container</option>
              <option value="Trailer">Trailer</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Capacity (Tons)</label>
            <input required type="number" step="0.5" value={formData.capacityInTons} onChange={e => setFormData({...formData, capacityInTons: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. 20" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Vendor</label>
            <select required value={formData.vendorId} onChange={e => setFormData({...formData, vendorId: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
              <option value="">Select Vendor</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Owner Name</label>
            <input value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="Vehicle Owner" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">RC Number</label>
            <input value={formData.rcNumber} onChange={e => setFormData({...formData, rcNumber: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="RC12345" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Insurance Expiry</label>
            <input type="date" value={formData.insuranceExpiry} onChange={e => setFormData({...formData, insuranceExpiry: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Permit Expiry</label>
            <input type="date" value={formData.permitExpiry} onChange={e => setFormData({...formData, permitExpiry: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Fitness Expiry</label>
            <input type="date" value={formData.fitnessExpiry} onChange={e => setFormData({...formData, fitnessExpiry: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" />
          </div>
          
          <div className="col-span-2 mt-2">
            <ProtoButton variant="dark" style={{ width: '100%' }}>
              {isSubmitting ? "Saving..." : (formData.id > 0 ? "Update Vehicle" : "Save Vehicle")}
            </ProtoButton>
          </div>
        </form>
      </div>
    </div>
  );
}
