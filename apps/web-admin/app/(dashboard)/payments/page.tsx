"use client";

import { useEffect, useState } from "react";
import { getPayments, getTrips } from "@/lib/api";
import { Panel, ProtoTable, Td, ProtoButton, Badge, KpiCard } from "@/components/PrototypeUI";
import { PaymentForm } from "@/components/PaymentForm";

function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-panel rounded-[10px] shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-line">
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

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    getPayments().then(setPayments).catch(console.error);
    getTrips().then(setTrips).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalOutstanding = trips.reduce((acc, trip) => acc + (trip.balanceAmount || 0), 0);

  return (
    <div>
      <div className="flex justify-end mb-[14px]">
        <ProtoButton onClick={() => setIsModalOpen(true)}>+ Log New Payment</ProtoButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px] mb-[18px]">
        <KpiCard n={`₹${totalOutstanding.toLocaleString()}`} l="Total Outstanding Balance" dLabel="Pending" dType="warn" />
        <KpiCard n={`₹${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`} l="Total Paid" dLabel="Cleared" dType="up" />
        <KpiCard n={payments.length} l="Total Transactions" dLabel="Logged" dType="neutral" />
      </div>

      <Panel title="Recent Transactions" hint="History of all logged payments across trips">
        <ProtoTable headers={["Date", "Trip ID", "Type", "UTR Number", "Amount", "Status"]}>
          {payments.length === 0 ? (
            <tr><Td className="text-center text-muted-text"><span className="col-span-6 block py-4">No payments logged yet.</span></Td></tr>
          ) : (
            payments.sort((a,b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).map(payment => (
              <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                <Td>{new Date(payment.paymentDate).toLocaleDateString()}</Td>
                <Td className="font-mono text-[12.8px]">TRP-{payment.tripId}</Td>
                <Td><span className="text-[11.5px] uppercase tracking-[0.3px] font-semibold text-muted-text">{payment.type}</span></Td>
                <Td className="font-mono text-[12px]">{payment.utrNumber || "—"}</Td>
                <Td className="font-mono font-semibold text-depot">₹{payment.amount.toLocaleString()}</Td>
                <Td><Badge color={payment.status === 'Completed' ? 'green' : 'orange'}>{payment.status}</Badge></Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </Panel>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Payment">
        <PaymentForm onSuccess={() => { setIsModalOpen(false); loadData(); }} />
      </Modal>
    </div>
  );
}
