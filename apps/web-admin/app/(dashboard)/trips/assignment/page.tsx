"use client";

import { useEffect, useState } from "react";
import { fetchApi, assignTrip } from "@/lib/api";
import { ProtoTable, Td, ProtoButton } from "@/components/PrototypeUI";

export default function AssignmentPage() {
  const [indents, setIndents] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedIndent, setSelectedIndent] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vendorId: "",
    vehicleId: "",
    driverId: "",
    bookingType: "Fixed",
    ratePerTon: "0",
    fixedRate: "0",
    advanceAmount: "0",
    startingKM: "",
    tripStartDate: new Date().toISOString().split('T')[0],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [indData, venData, vehData, drvData] = await Promise.all([
        fetchApi("/Indents"),
        fetchApi("/Vendors"),
        fetchApi("/Vehicles"),
        fetchApi("/Drivers")
      ]);
      setIndents(indData.filter((i: any) => i.status === 'New' || i.status === 'Pending'));
      setVendors(venData);
      setVehicles(vehData);
      setDrivers(drvData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIndent) return;
    
    setIsSubmitting(true);
    try {
      await assignTrip({
        indentId: selectedIndent.id,
        vendorId: parseInt(formData.vendorId),
        vehicleId: parseInt(formData.vehicleId),
        driverId: parseInt(formData.driverId),
        bookingType: formData.bookingType,
        ratePerTon: parseFloat(formData.ratePerTon),
        fixedRate: parseFloat(formData.fixedRate),
        advanceAmount: parseFloat(formData.advanceAmount),
        startingKM: formData.startingKM ? parseFloat(formData.startingKM) : null,
        tripStartDate: new Date(formData.tripStartDate).toISOString(),
      });
      setSelectedIndent(null);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to assign trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-[18px] items-start">
      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">Pending Indents</h3>
          <span className="text-[11.5px] text-muted-text">Select an indent to assign</span>
        </div>
        <ProtoTable headers={["INDENT", "CUSTOMER", "ROUTE", "REQ. TYPE", "STATUS"]}>
          {loading ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-5 block">Loading...</span></Td>
            </tr>
          ) : indents.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-5 block">No pending indents.</span></Td>
            </tr>
          ) : (
            indents.map((indent) => (
              <tr 
                key={indent.id} 
                className={`transition-colors cursor-pointer ${selectedIndent?.id === indent.id ? 'bg-[#f8fafc]' : 'hover:bg-slate-50'}`} 
                onClick={() => setSelectedIndent(indent)}
              >
                <Td className="font-mono text-[12.8px] font-semibold text-route">IND-{1000 + indent.id}</Td>
                <Td>{indent.customer?.name || "Unknown"}</Td>
                <Td className="text-[12px]">{indent.source} → {indent.destination}</Td>
                <Td className="text-[12px]">{indent.vehicleType}</Td>
                <Td>
                  <span className="px-[8px] py-[3px] bg-[#e0f2fe] text-[#075985] rounded-[6px] text-[11px] font-medium border border-[#bae6fd]">
                    {indent.status}
                  </span>
                </Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </div>

      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between bg-slate-50">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">
            {selectedIndent ? `Assigning IND-${1000 + selectedIndent.id}` : "Select an indent"}
          </h3>
          {selectedIndent && (
            <span className="text-[12px] font-semibold text-muted-text">
              {selectedIndent.material} ({selectedIndent.weight}T)
            </span>
          )}
        </div>
        
        {!selectedIndent ? (
          <div className="p-[40px] text-center text-muted-text text-[13px]">
            Please select an indent from the left to assign a vendor and vehicle.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-[16px] grid grid-cols-2 gap-[12px]">
            
            <div className="col-span-2">
              <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Fleet Vendor</label>
              <select required value={formData.vendorId} onChange={e => setFormData({...formData, vendorId: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
                <option value="">Select Fleet Vendor</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Vehicle</label>
              <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
                <option value="">Select Vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} ({v.capacityInTons}T)</option>)}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Driver</label>
              <select required value={formData.driverId} onChange={e => setFormData({...formData, driverId: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
                <option value="">Select Driver</option>
                {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div className="col-span-2 my-[8px] border-t border-line"></div>

            <div className="col-span-1">
              <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Booking Type</label>
              <select value={formData.bookingType} onChange={e => setFormData({...formData, bookingType: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
                <option value="Fixed">Fixed Rate</option>
                <option value="PerTon">Per Ton Rate</option>
              </select>
            </div>

            <div className="col-span-1">
              {formData.bookingType === "Fixed" ? (
                <>
                  <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Fixed Rate (₹)</label>
                  <input required type="number" value={formData.fixedRate} onChange={e => setFormData({...formData, fixedRate: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" />
                </>
              ) : (
                <>
                  <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Rate Per Ton (₹)</label>
                  <input required type="number" value={formData.ratePerTon} onChange={e => setFormData({...formData, ratePerTon: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" />
                </>
              )}
            </div>

            <div className="col-span-1">
              <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Advance Amount (₹)</label>
              <input required type="number" value={formData.advanceAmount} onChange={e => setFormData({...formData, advanceAmount: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" />
            </div>

            <div className="col-span-1">
              <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Starting KM</label>
              <input type="number" value={formData.startingKM} onChange={e => setFormData({...formData, startingKM: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" />
            </div>
            
            <div className="col-span-2 mt-2">
              <ProtoButton variant="dark" style={{ width: '100%' }}>
                {isSubmitting ? "Assigning..." : "Assign & Create Trip"}
              </ProtoButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
