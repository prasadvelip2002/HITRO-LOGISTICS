"use client";

import { Panel, ProtoTable, Td } from "@/components/PrototypeUI";

export default function NotificationsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="font-disp font-semibold text-[22px] text-ink">Notifications & WhatsApp</h1>
      </div>
      <Panel title="Communication Log" hint="History of automated WhatsApp messages and system alerts">
        <ProtoTable headers={["Date", "Recipient", "Type", "Message Preview", "Status"]}>
          <tr>
            <Td className="text-center text-muted-text py-8"><span className="col-span-5 block">No recent communications.</span></Td>
          </tr>
        </ProtoTable>
      </Panel>
    </div>
  );
}
