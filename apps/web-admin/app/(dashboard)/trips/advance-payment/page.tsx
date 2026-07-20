"use client";

import { Panel, ProtoTable, Td } from "@/components/PrototypeUI";

export default function AdvancePaymentPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="font-disp font-semibold text-[22px] text-ink">Advance Payment</h1>
      </div>
      <Panel title="Pending Advance Payments" hint="Trips awaiting advance payment to vendor">
        <ProtoTable headers={["Trip ID", "Vendor", "Total Payable", "Advance Pending", "Action"]}>
          <tr>
            <Td className="text-center text-muted-text py-8"><span className="col-span-5 block">No advance payments pending.</span></Td>
          </tr>
        </ProtoTable>
      </Panel>
    </div>
  );
}
