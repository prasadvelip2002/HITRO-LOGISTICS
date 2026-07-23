"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { KpiCard, Panel, ProtoTable, Td, Badge, RouteTrack } from "@/components/PrototypeUI";

export default function DashboardPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic calculations
  const [metrics, setMetrics] = useState({
    activeTrips: 0,
    pendingPod: 0,
    awaitingApproval: 0,
    pendingSettlements: 0
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const tripsData = await fetchApi("/Trips");
        
        // Calculate dynamic metrics
        const active = tripsData.filter((t: any) => !['Paid', 'Cancelled'].includes(t.status)).length;
        const pendingPod = tripsData.filter((t: any) => t.status === 'Delivered').length;
        const awaitingApproval = tripsData.filter((t: any) => t.status === 'POD_Uploaded').length;
        const settlements = tripsData.filter((t: any) => t.status === 'Approved').reduce((acc: number, t: any) => {
           const finalAmt = t.fixedRate > 0 ? t.fixedRate : (t.ratePerTon * (t.indent?.weight || 0));
           return acc + (finalAmt - t.advanceAmount);
        }, 0);

        setMetrics({
          activeTrips: active,
          pendingPod,
          awaitingApproval,
          pendingSettlements: settlements
        });

        setTrips(tripsData.slice(0, 10)); // Take top 10 for recent
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const TRIP_STAGES = ['Indent', 'Confirmed', 'Assigned', 'Started', 'Delivered', 'POD', 'Approved', 'Paid'];

  const getStageIdx = (status: string) => {
    const map: Record<string, number> = {
      'Pending Assignment': 1,
      'Assigned': 2,
      'Started': 3,
      'Delivered': 4,
      'POD_Uploaded': 5,
      'Approved': 6,
      'Paid': 7
    };
    return map[status] ?? 0;
  };

  const getBadgeColor = (status: string) => {
    const map: Record<string, 'blue' | 'orange' | 'green' | 'red' | 'grey'> = {
      'Pending Assignment': 'orange',
      'Assigned': 'blue',
      'Started': 'blue',
      'Delivered': 'orange',
      'POD_Uploaded': 'blue',
      'Approved': 'green',
      'Paid': 'green'
    };
    return map[status] ?? 'grey';
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px] mb-[20px]">
        <KpiCard n={metrics.activeTrips} l="Active Trips" dLabel="Real-time" dType="up" />
        <KpiCard n={metrics.pendingPod} l="Pending POD" dLabel="Awaiting driver upload" dType={metrics.pendingPod > 0 ? "warn" : "neutral"} />
        <KpiCard n={metrics.awaitingApproval} l="Awaiting Approval" dLabel="Manager queue" dType={metrics.awaitingApproval > 0 ? "warn" : "neutral"} />
        <KpiCard n={`₹${metrics.pendingSettlements.toLocaleString()}`} l="Pending Settlements" dLabel="To be paid out" dType="up" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[20px]">
        <div className="xl:col-span-2">
          <Panel title="Recent Trips" hint="Real-time tracking of active shipments">
            <ProtoTable headers={["Trip No.", "Customer", "Route", "Vendor / Vehicle", "Status"]}>
              {loading ? (
                <tr>
                  <Td className="text-center text-muted-text py-8"><span className="col-span-5 block">Loading trips...</span></Td>
                </tr>
              ) : trips.length === 0 ? (
                <tr>
                  <Td className="text-center text-muted-text py-8"><span className="col-span-5 block">No trips found in the database.</span></Td>
                </tr>
              ) : (
                trips.map(trip => (
                  <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                    <Td className="font-mono text-[12.8px] font-semibold text-route">{`TRP-${1000 + trip.id}`}</Td>
                    <Td>{trip.indent?.customer?.name || "Unknown"}</Td>
                    <Td className="text-[12px]">{`${trip.indent?.source || ""} → ${trip.indent?.destination || ""}`}</Td>
                    <Td className="text-[12px]">{`${trip.vendor?.name || "Unassigned"}`}<br/><span className="text-muted-text font-mono text-[11px]">{trip.vehicle?.registrationNumber || ""}</span></Td>
                    <Td>
                      <Badge color={getBadgeColor(trip.status)}>{trip.status}</Badge>
                    </Td>
                  </tr>
                ))
              )}
            </ProtoTable>
          </Panel>
        </div>

        <div className="xl:col-span-1">
          <Panel title="Trip Progress Tracker" hint="Status across all recent trips">
            <div className="p-4 space-y-6">
              {loading ? (
                <div className="text-center text-muted-text py-4">Loading tracker...</div>
              ) : trips.length === 0 ? (
                <div className="text-center text-muted-text py-4">No trips to track.</div>
              ) : (
                trips.slice(0, 4).map(trip => (
                  <div key={trip.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[12px] font-bold text-ink">TRP-{1000 + trip.id}</span>
                      <span className="text-[11px] text-muted-text">{trip.indent?.customer?.name}</span>
                    </div>
                    <RouteTrack stages={['Indent', 'Assigned', 'InTransit', 'Delivered']} currentIdx={Math.min(getStageIdx(trip.status), 3)} />
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
