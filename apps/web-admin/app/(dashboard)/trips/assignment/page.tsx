"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Panel, ProtoTable, Td, ProtoButton } from "@/components/PrototypeUI";
import { TripAssignmentForm } from "@/components/TripAssignmentForm";

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

export default function AssignmentPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndentId, setSelectedIndentId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/Indents");
      setTrips(data.filter((i: any) => i.status === 'Confirmed' || i.status === 'Assigned'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="font-disp font-semibold text-[22px] text-ink">Trip Assignment</h1>
      </div>

      <Panel title="Assign Fleet & Vehicle" hint="Select a confirmed indent to assign a vendor and vehicle">
        <ProtoTable headers={["ID", "Customer", "Route", "Material", "Status", "Action"]}>
          {loading ? (
            <tr>
              <Td className="text-center text-muted-text py-8"><span className="col-span-6 block">Loading...</span></Td>
            </tr>
          ) : trips.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text py-8"><span className="col-span-6 block">No confirmed indents waiting for assignment.</span></Td>
            </tr>
          ) : (
            trips.map(indent => (
              <tr key={indent.id} className="hover:bg-slate-50 transition-colors">
                <Td className="font-mono text-[12.8px]">IND-{1000 + indent.id}</Td>
                <Td>{indent.customer?.name || "Unknown"}</Td>
                <Td>{indent.source} → {indent.destination}</Td>
                <Td>{indent.material}</Td>
                <Td>{indent.status}</Td>
                <Td>
                  <ProtoButton variant="primary" onClick={() => {
                    setSelectedIndentId(indent.id);
                    setIsModalOpen(true);
                  }}>
                    Assign Trip
                  </ProtoButton>
                </Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </Panel>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedIndentId(null); }} title="Assign Vendor & Vehicle">
        {selectedIndentId && (
          <TripAssignmentForm indentId={selectedIndentId} onSuccess={() => {
            setIsModalOpen(false);
            setSelectedIndentId(null);
            loadData();
          }} />
        )}
      </Modal>
    </div>
  );
}
