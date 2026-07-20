"use client";

import { Panel, ProtoTable, Td } from "@/components/PrototypeUI";

export default function AdditionalChargesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="font-disp font-semibold text-[22px] text-ink">Additional Charges</h1>
      </div>
      <Panel title="Log Additional Charges" hint="Add tolls, loading/unloading, or detention charges">
        <ProtoTable headers={["Trip ID", "Charge Type", "Amount", "Description", "Action"]}>
          <tr>
            <Td className="text-center text-muted-text py-8"><span className="col-span-5 block">No additional charges logged.</span></Td>
          </tr>
        </ProtoTable>
      </Panel>
    </div>
  );
}
