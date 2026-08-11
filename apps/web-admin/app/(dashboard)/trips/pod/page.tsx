"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProtoTable, Td, Badge, Panel } from "@/components/PrototypeUI";
import { Loader2, Camera, CheckCircle, Smartphone, ExternalLink, XCircle } from "lucide-react";
import { Modal } from "@/components/Modal";
import Link from "next/link";

export default function AdminPODDashboard() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Verify Modal
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [tripDocuments, setTripDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/Trips");
      // Filter trips that are Assigned, Started, or Delivered (Waiting for POD review)
      const podTrips = data.filter((t: any) => 
        (t.status === "Assigned" || t.status === "Started" || t.status === "Delivered")
      );
      setTrips(podTrips);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openVerifyModal = async (trip: any) => {
    setSelectedTrip(trip);
    setIsVerifyModalOpen(true);
    setLoadingDocs(true);
    try {
      const data = await fetchApi(`/Documents/trip/${trip.id}`);
      setTripDocuments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleApprove = async (tripId: number) => {
    if (!confirm("Approve this POD? This will close the trip and mark it ready for final billing.")) return;
    try {
      await fetchApi(`/Documents/pod/approve/${tripId}`, { method: "POST" });
      setIsVerifyModalOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      alert("Failed to approve POD.");
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">POD Management</h1>
          <p className="text-slate-500 text-sm mt-1">Review and approve Proof of Delivery documents uploaded by drivers.</p>
        </div>
      </div>

      <Panel>
        <ProtoTable 
          headers={["Trip ID", "Customer & Route", "Driver & Vehicle", "Trip Status", "POD Status", "Actions"]}
        >
          {trips.map((trip) => (
            <tr key={trip.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <Td className="font-mono text-slate-500 font-medium">
                <Link href={`/trips/${trip.id}/lr`} className="hover:text-blue-600 hover:underline">
                  TRP-{trip.id}
                </Link>
              </Td>
              <Td>
                <div className="font-bold text-slate-700">{trip.indent?.customer?.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[150px]">
                  {trip.indent?.source} → {trip.indent?.destination}
                </div>
              </Td>
              <Td>
                <div className="font-semibold text-slate-700">{trip.driver?.name}</div>
                <div className="text-[11px] text-slate-500">{trip.vehicle?.vehicleNumber}</div>
              </Td>
              <Td><Badge color={trip.status === "Delivered" ? "green" : "blue"}>{trip.status}</Badge></Td>
              <Td>
                {trip.podReceivedDate ? (
                  <Badge color="green">Verified & Closed</Badge>
                ) : trip.podUploadedDate ? (
                  <Badge color="orange">Pending Review</Badge>
                ) : (
                  <Badge color="slate">Awaiting Upload</Badge>
                )}
              </Td>
              <Td>
                <div className="flex gap-2">
                  {!trip.podUploadedDate ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Driver Upload Link:</span>
                      <a 
                        href={`/pod/${trip.podMagicLinkToken}`} 
                        target="_blank"
                        className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5 w-max"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Open Mobile View
                      </a>
                    </div>
                  ) : !trip.podReceivedDate ? (
                    <button 
                      onClick={() => openVerifyModal(trip)}
                      className="bg-amber-50 text-amber-700 border border-amber-200 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 relative"
                    >
                      <Camera className="w-3.5 h-3.5" /> Review Image
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                    </button>
                  ) : (
                    <button className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-not-allowed opacity-70">
                      <CheckCircle className="w-3.5 h-3.5" /> Billing Ready
                    </button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
          {trips.length === 0 && (
            <tr><td colSpan={6} className="p-8 text-center text-slate-400">No active trips requiring PODs.</td></tr>
          )}
        </ProtoTable>
      </Panel>

      <Modal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)} title={`Review POD for TRP-${selectedTrip?.id}`}>
        {loadingDocs ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
        ) : (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-xl text-sm flex gap-3">
              <Camera className="w-5 h-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold mb-1">Driver Uploaded POD</p>
                <p className="text-amber-700/80">Please verify the image is clear and contains the required receiving signatures/stamps before approving.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {tripDocuments.length > 0 ? tripDocuments.map((doc: any) => (
                <div key={doc.id} className="border border-slate-200 rounded-xl overflow-hidden group">
                  <div className="bg-slate-100 flex items-center justify-center p-2 relative h-[300px]">
                    <img 
                      src={`http://localhost:5000${doc.fileUrl}`} 
                      alt="POD Document" 
                      className="max-h-full max-w-full object-contain drop-shadow-md rounded"
                    />
                    <a 
                      href={`http://localhost:5000${doc.fileUrl}`} 
                      target="_blank"
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-lg shadow-sm text-slate-600 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="p-3 bg-white border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Uploaded on</div>
                      <div className="text-sm font-semibold text-slate-700">{new Date(doc.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl">
                  <XCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 font-medium">No documents found.</p>
                </div>
              )}
            </div>

            {tripDocuments.length > 0 && (
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setIsVerifyModalOpen(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleApprove(selectedTrip.id)}
                  className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors shadow-sm flex justify-center items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Verify & Close Trip
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}
