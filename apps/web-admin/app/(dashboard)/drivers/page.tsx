"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Users, Plus } from "lucide-react";
import { DriverForm } from "@/components/DriverForm";

interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  phone: string;
  vendorId?: number;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-blue-500" /> Driver Master
          </h1>
          <p className="text-slate-500 mt-1">Manage driver details and licenses.</p>
        </div>
        
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Driver
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th className="p-4 font-medium">Driver Name</th>
              <th className="p-4 font-medium">License Number</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Vendor ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">Loading drivers...</td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">No drivers found. Click Add Driver to get started.</td>
              </tr>
            ) : (
              drivers.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{d.name}</td>
                  <td className="p-4 text-slate-600">{d.licenseNumber}</td>
                  <td className="p-4 text-slate-600">{d.phone}</td>
                  <td className="p-4 text-slate-600">{d.vendorId ? `#${d.vendorId}` : "Independent"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <DriverForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false);
            loadDrivers();
          }} 
        />
      )}
    </div>
  );
}
