"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { KpiCard, Panel, ProtoTable, Td, Badge, RouteTrack } from "@/components/PrototypeUI";

export default function DashboardPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const tripsData = await fetchApi("/Trips");
        setTrips(tripsData.slice(0, 5)); // Just take top 5 for recent
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
        <KpiCard n={trips.length} l="Active Trips" dLabel="▲ 2 today" dType="up" />
        <KpiCard n="17" l="Pending POD" dLabel="Needs upload" dType="warn" />
        <KpiCard n="9" l="Awaiting Approval" dLabel="Manager queue" dType="warn" />
        <KpiCard n="₹4.8L" l="Pending Settlements" dLabel="On schedule" dType="up" />
      </div>

      <Panel title="Recent Trips" hint="Auto-refreshed by 6 AM scheduler">
        <ProtoTable headers={["Trip No.", "Customer", "Route", "Vendor / Vehicle", "Progress", "Status"]}>
          {loading ? (
            <tr>
              <Td className="text-center text-muted-text py-8"><span className="col-span-6 block">Loading trips...</span></Td>
            </tr>
          ) : trips.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text py-8"><span className="col-span-6 block">No trips found.</span></Td>
            </tr>
          ) : (
            trips.map(trip => (
              <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                <Td className="font-mono text-[12.8px]">{`TRP-${1000 + trip.id}`}</Td>
                <Td>{trip.indent?.customer?.name || "Unknown"}</Td>
                <Td>{`${trip.indent?.source || ""} → ${trip.indent?.destination || ""}`}</Td>
                <Td>{`${trip.vendor?.name || "Unassigned"} · ${trip.vehicle?.registrationNumber || ""}`}</Td>
                <Td className="w-[200px]">
                  <RouteTrack stages={TRIP_STAGES} currentIdx={getStageIdx(trip.status)} />
                </Td>
                <Td>
                  <Badge color={getBadgeColor(trip.status)}>{trip.status}</Badge>
                </Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </Panel>
    </div>
  );
}
