"use client";

import { useEffect, useState } from "react";
import { getPendingCharges, approveCharge, rejectCharge } from "@/lib/api";
import { Panel, ProtoTable, Td, ProtoButton, Badge } from "@/components/PrototypeUI";

export default function ApprovalsPage() {
  const [charges, setCharges] = useState<any[]>([]);
  const [loading, setLoading] = useState<number | null>(null);

  const loadData = () => {
    getPendingCharges().then(setCharges).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: number) => {
    if (!confirm("Are you sure you want to approve this charge?")) return;
    setLoading(id);
    try {
      await approveCharge(id);
      loadData();
    } catch (e) {
      alert("Failed to approve");
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Are you sure you want to reject this charge?")) return;
    setLoading(id);
    try {
      await rejectCharge(id);
      loadData();
    } catch (e) {
      alert("Failed to reject");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="font-disp font-semibold text-[22px] text-ink">Manager Approvals</h1>
      </div>
      <Panel title="Pending Additional Charges" hint="Charges requested by drivers that require your approval before final settlement.">
        <ProtoTable headers={["Date", "Trip ID", "Type", "Amount", "Status", "Actions"]}>
          {charges.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text py-8"><span className="col-span-6 block">No pending approvals. All caught up!</span></Td>
            </tr>
          ) : (
            charges.map((charge) => (
              <tr key={charge.id} className="hover:bg-slate-50 transition-colors">
                <Td>{new Date(charge.createdAt).toLocaleDateString()}</Td>
                <Td className="font-mono text-[12.8px]">TRP-{charge.tripId}</Td>
                <Td>{charge.chargeType}</Td>
                <Td className="font-mono text-signal font-semibold">₹{charge.amount.toLocaleString()}</Td>
                <Td>
                  <Badge color="orange">{charge.status}</Badge>
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <ProtoButton 
                      variant="primary"
                      onClick={() => handleApprove(charge.id)}
                    >
                      {loading === charge.id ? "..." : "Approve"}
                    </ProtoButton>
                    <ProtoButton 
                      variant="ghost"
                      onClick={() => handleReject(charge.id)}
                    >
                      {loading === charge.id ? "..." : "Reject"}
                    </ProtoButton>
                  </div>
                </Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </Panel>
    </div>
  );
}
