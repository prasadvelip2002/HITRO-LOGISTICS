"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Panel, ProtoButton } from "@/components/PrototypeUI";

interface Vehicle {
  id: number;
  registrationNumber: string;
  type: string;
  capacityInTons: number;
  vendorId: number;
  vendor?: { name: string };
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    registrationNumber: "",
    type: "",
    capacityInTons: "",
    vendorId: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadVehicles = async () => {
    try {
      const data = await fetchApi("/Vehicles");
      setVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchApi("/Vehicles", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          capacityInTons: parseInt(formData.capacityInTons),
          vendorId: parseInt(formData.vendorId)
        }),
      });
      setFormData({ registrationNumber: "", type: "", capacityInTons: "", vendorId: "" });
      loadVehicles();
    } catch (error) {
      console.error(error);
      alert("Failed to save vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDocStatus = (num: number) => num % 3 === 0 ? 'warn' : 'ok'; // Mock logic for docs

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-[18px] items-start">
      <div>
        <h2 className="font-disp text-[18px] font-semibold mb-4">Vehicles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
          {isLoading ? (
            <div className="text-muted-text">Loading vehicles...</div>
          ) : vehicles.length === 0 ? (
            <div className="text-muted-text">No vehicles found.</div>
          ) : (
            vehicles.map((v, i) => (
              <Panel key={v.id} className="!mb-0">
                <div className="px-[18px] py-[14px] border-b border-line">
                  <h3 className="font-mono text-[14.5px] font-semibold m-0">{v.registrationNumber}</h3>
                </div>
                <div className="p-[14px]">
                  <div className="text-[12.5px] text-muted-text mb-[8px]">
                    {v.type} · {v.capacityInTons}T · {v.vendor?.name || `Vendor #${v.vendorId}`}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {['RC', 'Insurance', 'Permit', 'Fitness', 'Tax'].map(doc => {
                      const state = getDocStatus(v.id + doc.length + i);
                      return (
                        <span key={doc} className={`inline-flex items-center gap-[5px] font-mono text-[10.5px] px-[8px] py-[4px] rounded-[5px] mt-[2px] mr-[4px] ${state === 'ok' ? 'bg-depot-soft text-depot' : 'bg-signal-soft text-[#B8501E]'}`}>
                          {doc} {state === 'ok' ? '✓' : '!'}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </Panel>
            ))
          )}
        </div>
      </div>

      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">New Vehicle</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-[16px]">
          <div className="mb-[12px]">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Registration No.</label>
            <input 
              required
              value={formData.registrationNumber}
              onChange={e => setFormData({...formData, registrationNumber: e.target.value})}
              className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal"
              placeholder="e.g. KA01AB1234" 
            />
          </div>
          <div className="mb-[12px] flex gap-3">
            <div className="flex-1">
              <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Type</label>
              <input 
                required
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal"
                placeholder="e.g. Open Body" 
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Capacity (Tons)</label>
              <input 
                required
                type="number"
                value={formData.capacityInTons}
                onChange={e => setFormData({...formData, capacityInTons: e.target.value})}
                className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal"
                placeholder="e.g. 20" 
              />
            </div>
          </div>
          <div className="mb-[12px]">
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Vendor ID</label>
            <input 
              required
              type="number"
              value={formData.vendorId}
              onChange={e => setFormData({...formData, vendorId: e.target.value})}
              className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal"
              placeholder="e.g. 1" 
            />
          </div>
          <ProtoButton variant="dark" style={{ width: '100%' }}>
            {isSubmitting ? "Saving..." : "Save Vehicle"}
          </ProtoButton>
        </form>
      </div>
    </div>
  );
}
