"use client";

import { Panel, KpiCard } from "@/components/PrototypeUI";

export default function ReportsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="font-disp font-semibold text-[22px] text-ink">System Reports</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px] mb-[20px]">
        <KpiCard n="1,245" l="Total Trips This Month" dLabel="+15%" dType="up" />
        <KpiCard n="₹42.5L" l="Total Revenue" dLabel="On track" dType="up" />
        <KpiCard n="98%" l="On-time Delivery" dLabel="Target: 95%" dType="up" />
        <KpiCard n="12" l="Delayed Trips" dLabel="Needs attention" dType="warn" />
      </div>
      <Panel title="Detailed Reports" hint="Download tabular reports for deeper analysis">
        <div className="p-8 text-center text-muted-text">
          Report generation engine will be available here.
        </div>
      </Panel>
    </div>
  );
}
