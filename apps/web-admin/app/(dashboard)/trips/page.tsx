"use client";

import { useEffect, useState } from "react";
import { getIndents, getTrips, fetchApi } from "@/lib/api";
import { Panel, ProtoTable, Td, ProtoButton, Badge, RouteTrack } from "@/components/PrototypeUI";
import { IndentForm } from "@/components/IndentForm";
import { TripAssignmentForm } from "@/components/TripAssignmentForm";
import { MapPin } from "lucide-react";
import Link from "next/link";

function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-panel rounded-[10px] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-line">
        <div className="flex justify-between items-center px-[18px] py-[14px] border-b border-line sticky top-0 bg-panel z-10">
          <h2 className="font-disp text-[14.5px] font-semibold m-0">{title}</h2>
          <button onClick={onClose} className="text-muted-text hover:text-ink text-[16px]">&times;</button>
        </div>
        <div className="p-[16px]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function TripsPage() {
  const [indents, setIndents] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [isIndentModalOpen, setIsIndentModalOpen] = useState(false);
  const [assigningIndent, setAssigningIndent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'indents' | 'trips'>('indents');

  const loadData = () => {
    getIndents().then(setIndents).catch(console.error);
    getTrips().then(setTrips).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingIndents = indents.filter(i => i.status !== 'Assigned');

  const TRIP_STAGES = ['Indent', 'Confirmed', 'Assigned', 'Started', 'Delivered', 'POD', 'Approved', 'Paid'];
  const getStageIdx = (status: string) => {
    const map: Record<string, number> = {
      'Pending Assignment': 1, 'Assigned': 2, 'Started': 3, 'Delivered': 4, 'POD_Uploaded': 5, 'Approved': 6, 'Paid': 7
    };
    return map[status] ?? 0;
  };
  const getBadgeColor = (status: string) => {
    const map: Record<string, 'blue' | 'orange' | 'green' | 'red' | 'grey'> = {
      'Pending Assignment': 'orange', 'Assigned': 'blue', 'Started': 'blue', 'Delivered': 'orange', 'POD_Uploaded': 'blue', 'Approved': 'green', 'Paid': 'green'
    };
    return map[status] ?? 'grey';
  };

  const handleCreateOutboundLeg = async (tripId: number) => {
    if (!confirm("Generate Outbound Leg 2 (Warehouse -> OEM) for this Trip?")) return;
    try {
      await fetchApi(`/Trips/${tripId}/create-outbound-leg`, { method: "POST" });
      loadData();
    } catch (e) {
      console.error(e);
      alert("Failed to create outbound leg");
    }
  };

  const getLegBadge = (legType: string) => {
    if (legType === "InboundLeg1") return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold uppercase tracking-wider ml-2">Leg 1 (WHS)</span>;
    if (legType === "OutboundLeg2") return <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-[10px] font-bold uppercase tracking-wider ml-2">Leg 2 (OEM)</span>;
    return null;
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('indents')}
          className={`font-body font-semibold text-[13px] pb-2 border-b-[3px] transition-colors ${activeTab === 'indents' ? 'border-signal text-ink' : 'border-transparent text-muted-text hover:text-ink'}`}
        >
          Pending Indents ({pendingIndents.length})
        </button>
        <button 
          onClick={() => setActiveTab('trips')}
          className={`font-body font-semibold text-[13px] pb-2 border-b-[3px] transition-colors ${activeTab === 'trips' ? 'border-signal text-ink' : 'border-transparent text-muted-text hover:text-ink'}`}
        >
          Active Trips ({trips.length})
        </button>
      </div>

      {activeTab === 'indents' && (
        <Panel title="Pending Indents" hint="Awaiting trip assignment">
          <div className="px-[18px] py-[14px] border-b border-line bg-[#FAFBFD] flex justify-end">
            <ProtoButton onClick={() => setIsIndentModalOpen(true)}>+ Create Indent</ProtoButton>
          </div>
          <ProtoTable headers={["ID", "Customer", "Route", "Material", "Date", "Status", ""]}>
            {pendingIndents.length === 0 ? (
              <tr><Td className="text-center text-muted-text"><span className="col-span-7 block py-4">No pending indents.</span></Td></tr>
            ) : (
              pendingIndents.map(indent => (
                <tr key={indent.id} className="hover:bg-slate-50 transition-colors">
                  <Td className="font-mono">#{indent.id}</Td>
                  <Td>{indent.customer?.name}</Td>
                  <Td>{indent.source} &rarr; {indent.destination}</Td>
                  <Td>{indent.material} ({indent.weight}t)</Td>
                  <Td>{new Date(indent.loadingDate).toLocaleDateString()}</Td>
                  <Td><Badge color="orange">{indent.status}</Badge></Td>
                  <Td>
                    <ProtoButton variant="ghost" onClick={() => setAssigningIndent(indent)}>Assign Trip</ProtoButton>
                  </Td>
                </tr>
              ))
            )}
          </ProtoTable>
        </Panel>
      )}

      {activeTab === 'trips' && (
        <Panel title="Active Trips" hint="Currently assigned and running">
          <ProtoTable headers={["Trip ID", "Route", "Vehicle", "Driver", "Progress", "Status", "Actions"]}>
            {trips.length === 0 ? (
              <tr><Td className="text-center text-muted-text"><span className="col-span-7 block py-4">No active trips.</span></Td></tr>
            ) : (
              trips.map(trip => (
                <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                  <Td className="font-mono">
                    TRP-{trip.id}
                    {getLegBadge(trip.legType)}
                  </Td>
                  <Td>{trip.indent?.source} &rarr; {trip.indent?.destination}</Td>
                  <Td>{trip.vehicle?.vehicleNumber || "—"}</Td>
                  <Td>{trip.driver?.name || "—"}</Td>
                  <Td className="w-[200px]">
                    <RouteTrack stages={TRIP_STAGES} currentIdx={getStageIdx(trip.status)} />
                  </Td>
                  <Td><Badge color={getBadgeColor(trip.status)}>{trip.status}</Badge></Td>
                  <Td className="flex gap-2 items-center">
                    {(!trip.legType || trip.legType === "Direct") && (
                      <button 
                        onClick={() => handleCreateOutboundLeg(trip.id)}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-lg text-[11.5px] font-bold uppercase tracking-wide transition-colors"
                      >
                        + Forward to OEM
                      </button>
                    )}
                    {trip.legType === "OutboundLeg2" && (
                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">From TRP-{trip.parentTripId}</span>
                    )}
                    <Link href={`/trips/${trip.id}/tracking`}>
                      <button className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-1.5 rounded-lg text-[11.5px] font-bold uppercase tracking-wide transition-colors">
                        <MapPin className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                    <a 
                      href={`/trips/${trip.id}/lr`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-[11.5px] font-bold uppercase tracking-wide transition-colors ml-2"
                    >
                      Print LR
                    </a>
                  </Td>
                </tr>
              ))
            )}
          </ProtoTable>
        </Panel>
      )}

      {/* Modals */}
      <Modal isOpen={isIndentModalOpen} onClose={() => setIsIndentModalOpen(false)} title="Create New Indent">
        <IndentForm onSuccess={() => { setIsIndentModalOpen(false); loadData(); }} />
      </Modal>
      <Modal isOpen={!!assigningIndent} onClose={() => setAssigningIndent(null)} title={`Assign Trip — Indent #${assigningIndent?.id}`}>
        {assigningIndent && (
          <TripAssignmentForm indent={assigningIndent} onSuccess={() => { setAssigningIndent(null); loadData(); }} />
        )}
      </Modal>
    </div>
  );
}
