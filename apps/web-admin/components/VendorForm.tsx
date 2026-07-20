"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function VendorForm({ onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    gstin: "",
    panNumber: "",
    address: "",
    contactPerson: "",
    phone: "",
    accountNumber: "",
    ifscCode: "",
    routeRemarks: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetchApi("/Vendors", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to save vendor");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end transition-opacity backdrop-blur-sm">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add New Vendor</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Name *</label>
            <input 
              required
              autoFocus
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Fast Track Transport"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">GSTIN</label>
              <input 
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
                value={formData.gstin}
                onChange={e => setFormData({...formData, gstin: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PAN Number *</label>
              <input 
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
                value={formData.panNumber}
                onChange={e => setFormData({...formData, panNumber: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea 
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              rows={2}
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Route Remarks</label>
            <textarea 
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              rows={2}
              value={formData.routeRemarks}
              onChange={e => setFormData({...formData, routeRemarks: e.target.value})}
              placeholder="e.g. Primarily covers South India routes"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
              <input 
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.contactPerson}
                onChange={e => setFormData({...formData, contactPerson: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
              <input 
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Bank Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Account No</label>
                <input 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.accountNumber}
                  onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
                <input 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
                  value={formData.ifscCode}
                  onChange={e => setFormData({...formData, ifscCode: e.target.value})}
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
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Vendor"}
          </button>
        </div>
      </div>
    </div>
  );
}
