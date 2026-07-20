"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function VehicleForm({ onClose, onSuccess }: Props) {
  const [vendors, setVendors] = useState<{id: number, name: string}[]>([]);
  const [formData, setFormData] = useState({
    registrationNumber: "",
    type: "Open Truck",
    capacityInTons: 10,
    vendorId: 0,
    rcExpiry: "",
    insuranceExpiry: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchApi("/Vendors").then(data => {
      setVendors(data);
      if(data.length > 0) setFormData(f => ({...f, vendorId: data[0].id}));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetchApi("/Vehicles", {
        method: "POST",
        body: JSON.stringify({
          registrationNumber: formData.registrationNumber,
          type: formData.type,
          capacityInTons: formData.capacityInTons,
          vendorId: formData.vendorId
        }),
      });
      
      const vehicleId = response.id;
      
      if (formData.rcExpiry) {
        await fetchApi("/Documents", {
          method: "POST",
          body: JSON.stringify({
            entityType: "Vehicle",
            entityId: vehicleId,
            documentType: "RC",
            fileUrl: "pending",
            expiryDate: new Date(formData.rcExpiry).toISOString()
          })
        });
      }

      if (formData.insuranceExpiry) {
        await fetchApi("/Documents", {
          method: "POST",
          body: JSON.stringify({
            entityType: "Vehicle",
            entityId: vehicleId,
            documentType: "Insurance",
            fileUrl: "pending",
            expiryDate: new Date(formData.insuranceExpiry).toISOString()
          })
        });
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to save vehicle or documents");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end transition-opacity backdrop-blur-sm">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add New Vehicle</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number *</label>
            <input 
              required
              autoFocus
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
              value={formData.registrationNumber}
              onChange={e => setFormData({...formData, registrationNumber: e.target.value})}
              placeholder="MH 04 AB 1234"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Type</label>
            <select 
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="Open Truck">Open Truck</option>
              <option value="Container">Container</option>
              <option value="Trailer">Trailer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Capacity (Tons)</label>
            <input 
              type="number"
              required
              min="1"
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.capacityInTons}
              onChange={e => setFormData({...formData, capacityInTons: parseInt(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vendor / Owner</label>
            <select 
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              value={formData.vendorId}
              onChange={e => setFormData({...formData, vendorId: parseInt(e.target.value)})}
              required
            >
              {vendors.length === 0 && <option value="">Loading vendors...</option>}
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Document Expiry Dates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">RC Expiry</label>
                <input 
                  type="date"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.rcExpiry}
                  onChange={e => setFormData({...formData, rcExpiry: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Expiry</label>
                <input 
                  type="date"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.insuranceExpiry}
                  onChange={e => setFormData({...formData, insuranceExpiry: e.target.value})}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting || vendors.length === 0}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Vehicle"}
          </button>
        </div>
      </div>
    </div>
  );
}
