"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProtoTable, Td, ProtoButton } from "@/components/PrototypeUI";

interface Driver {
  id: number;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  aadhaar: string;
  experienceYears: number | null;
  currentStatus: string;
}

const DEFAULT_FORM = {
  id: 0,
  name: "",
  phone: "",
  licenseNumber: "",
  licenseExpiry: "",
  aadhaar: "",
  experienceYears: "",
  currentStatus: "Available"
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDrivers = async () => {
    try {
      const data = await fetchApi("/Drivers");
      setDrivers(data);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : null,
      };

      if (formData.id > 0) {
        await fetchApi(`/Drivers/${formData.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi("/Drivers", {
          method: "POST",
          body: JSON.stringify({ ...payload, id: undefined }),
        });
      }
      setFormData(DEFAULT_FORM);
      loadDrivers();
    } catch (error) {
      console.error(error);
      alert("Failed to save driver");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (d: Driver) => {
    setFormData({
      id: d.id,
      name: d.name || "",
      phone: d.phone || "",
      licenseNumber: d.licenseNumber || "",
      licenseExpiry: d.licenseExpiry ? d.licenseExpiry.split('T')[0] : "",
      aadhaar: d.aadhaar || "",
      experienceYears: d.experienceYears?.toString() || "",
      currentStatus: d.currentStatus || "Available"
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;
    try {
      await fetchApi(`/Drivers/${id}`, { method: "DELETE" });
      if (formData.id === id) setFormData(DEFAULT_FORM);
      loadDrivers();
    } catch (error) {
      alert("Failed to delete driver");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Available") return <span className="px-[8px] py-[3px] bg-[#dcfce7] text-[#166534] rounded-[6px] text-[11px] font-medium border border-[#bbf7d0]">Available</span>;
    if (status === "On Trip") return <span className="px-[8px] py-[3px] bg-[#e0e7ff] text-[#3730a3] rounded-[6px] text-[11px] font-medium border border-[#c7d2fe]">On Trip</span>;
    if (status === "On Leave") return <span className="px-[8px] py-[3px] bg-[#fee2e2] text-[#991b1b] rounded-[6px] text-[11px] font-medium border border-[#fecaca]">On Leave</span>;
    return <span className="px-[8px] py-[3px] bg-gray-100 text-gray-700 rounded-[6px] text-[11px] font-medium border border-gray-200">{status || 'Draft'}</span>;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-[18px] items-start">
      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">Driver Master</h3>
        </div>
        <ProtoTable headers={["DRIVER NAME", "PHONE", "LICENSE", "EXPIRY", "STATUS", "ACTIONS"]}>
          {isLoading ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-6 block">Loading drivers...</span></Td>
            </tr>
          ) : drivers.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-6 block">No drivers found.</span></Td>
            </tr>
          ) : (
            drivers.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => handleEdit(d)}>
                <Td className="font-medium text-ink">{d.name}</Td>
                <Td className="font-mono text-[12px]">{d.phone}</Td>
                <Td className="font-mono text-[12px]">{d.licenseNumber}</Td>
                <Td className="text-[12px]">
                  {d.licenseExpiry ? new Date(d.licenseExpiry).toLocaleDateString() : "—"}
                </Td>
                <Td>{getStatusBadge(d.currentStatus)}</Td>
                <Td>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(d.id); }}
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
            {formData.id > 0 ? "Edit Driver" : "New Driver"}
          </h3>
          {formData.id > 0 && (
            <button onClick={() => setFormData(DEFAULT_FORM)} className="text-[12px] text-route hover:underline">
              Clear
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-[16px] grid grid-cols-2 gap-[12px]">
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Driver Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. Ramesh Kumar" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Phone</label>
            <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="Mobile number" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">License Number</label>
            <input required value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="DL12345" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">License Expiry</label>
            <input type="date" value={formData.licenseExpiry} onChange={e => setFormData({...formData, licenseExpiry: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Aadhaar Number</label>
            <input value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="12-digit Aadhaar" />
          </div>
          <div className="col-span-1">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Experience (Years)</label>
            <input type="number" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. 5" />
          </div>
          <div className="col-span-2">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Current Status</label>
            <select value={formData.currentStatus} onChange={e => setFormData({...formData, currentStatus: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
          <div className="col-span-2 mt-2">
            <ProtoButton variant="dark" style={{ width: '100%' }}>
              {isSubmitting ? "Saving..." : (formData.id > 0 ? "Update Driver" : "Save Driver")}
            </ProtoButton>
          </div>
        </form>
      </div>
    </div>
  );
}
