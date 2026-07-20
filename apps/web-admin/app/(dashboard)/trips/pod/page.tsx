"use client";

import { Panel, ProtoTable, Td } from "@/components/PrototypeUI";

export default function PodReviewPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="font-disp font-semibold text-[22px] text-ink">POD Review</h1>
      </div>
      <Panel title="Proof of Delivery Review" hint="Review and approve POD documents">
        <ProtoTable headers={["Trip ID", "Customer", "Delivery Date", "Document", "Action"]}>
          <tr>
            <Td className="text-center text-muted-text py-8"><span className="col-span-5 block">No PODs pending review.</span></Td>
          </tr>
        </ProtoTable>
      </Panel>
    </div>
  );
}
