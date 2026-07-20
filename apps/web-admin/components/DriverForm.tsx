"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function DriverForm({ onClose, onSuccess }: Props) {
  const [vendors, setVendors] = useState<{id: number, name: string}[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    phone: "",
    vendorId: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchApi("/Vendors").then(data => {
      setVendors(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = { ...formData, vendorId: formData.vendorId || null };
      await fetchApi("/Drivers", {
        method: "POST",
        body: JSON.stringify(submitData),
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to save driver");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end transition-opacity backdrop-blur-sm">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add New Driver</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Driver Name *</label>
            <input 
              required
              autoFocus
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Rahul Sharma"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">License Number *</label>
            <input 
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
              value={formData.licenseNumber}
              onChange={e => setFormData({...formData, licenseNumber: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
            <input 
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Associated Vendor (Optional)</label>
            <select 
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              value={formData.vendorId}
              onChange={e => setFormData({...formData, vendorId: parseInt(e.target.value)})}
            >
              <option value={0}>Independent Driver</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
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
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Driver"}
          </button>
        </div>
      </div>
    </div>
  );
}
