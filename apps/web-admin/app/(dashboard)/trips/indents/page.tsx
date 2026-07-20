"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Panel, ProtoTable, Td, Badge, ProtoButton } from "@/components/PrototypeUI";
import { IndentForm } from "@/components/IndentForm";

export default function IndentsPage() {
  const [indents, setIndents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadIndents = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/Indents");
      setIndents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndents();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="font-disp font-semibold text-[22px] text-ink">Indent Management</h1>
        <ProtoButton variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Indent"}
        </ProtoButton>
      </div>

      {showForm && (
        <Panel title="Create New Indent" className="mb-[20px]">
          <div className="p-4">
            <IndentForm onSuccess={() => {
              setShowForm(false);
              loadIndents();
            }} />
          </div>
        </Panel>
      )}

      <Panel title="All Indents">
        <ProtoTable headers={["ID", "Customer", "Source", "Destination", "Material", "Status"]}>
          {loading ? (
            <tr>
              <Td className="text-center text-muted-text py-8"><span className="col-span-6 block">Loading...</span></Td>
            </tr>
          ) : indents.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text py-8"><span className="col-span-6 block">No indents found.</span></Td>
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
                  <Badge color={indent.status === 'Pending' ? 'orange' : 'blue'}>{indent.status}</Badge>
                </Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </Panel>
    </div>
  );
}
