"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Panel, ProtoTable, Td, Badge, ProtoButton } from "@/components/PrototypeUI";

export default function ConfirmationPage() {
  const [indents, setIndents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIndents = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/Indents");
      setIndents(data.filter((i: any) => i.status === 'Pending'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndents();
  }, []);

  const handleConfirm = async (id: number) => {
    try {
      await fetchApi(`/Indents/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Confirmed" }),
      });
      loadIndents();
    } catch (error) {
      console.error(error);
      alert("Failed to confirm indent");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="font-disp font-semibold text-[22px] text-ink">Trip Confirmation Sheet</h1>
      </div>

      <Panel title="Pending Confirmations" hint="Indents waiting to be confirmed into Trips">
        <ProtoTable headers={["ID", "Customer", "Source", "Destination", "Material", "Action"]}>
          {loading ? (
            <tr>
              <Td className="text-center text-muted-text py-8"><span className="col-span-6 block">Loading...</span></Td>
            </tr>
          ) : indents.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text py-8"><span className="col-span-6 block">No indents waiting for confirmation.</span></Td>
            </tr>
          ) : (
            indents.map(indent => (
              <tr key={indent.id} className="hover:bg-slate-50 transition-colors">
                <Td className="font-mono text-[12.8px]">IND-{1000 + indent.id}</Td>
                <Td>{indent.customer?.name || "Unknown"}</Td>
                <Td>{indent.source}</Td>
                <Td>{indent.destination}</Td>
                <Td>{indent.material}</Td>
                <Td>
                  <ProtoButton variant="primary" onClick={() => handleConfirm(indent.id)}>
                    Confirm
                  </ProtoButton>
                </Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </Panel>
    </div>
  );
}
