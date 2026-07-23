"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProtoTable, Td, ProtoButton } from "@/components/PrototypeUI";

export default function AutomationPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/Notifications");
      setLogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-[18px] items-start">
      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <div>
            <h3 className="font-disp text-[14.5px] font-semibold m-0">Daily Scheduler & Automation Logs</h3>
            <span className="text-[11.5px] text-muted-text">Real-time view of background worker activities (e.g., WhatsApp Reminders, Trip Approvals)</span>
          </div>
          <ProtoButton variant="primary" onClick={loadData}>Refresh Logs</ProtoButton>
        </div>
        <ProtoTable headers={["TIMESTAMP", "CATEGORY", "TITLE", "MESSAGE", "ENTITY ID", "STATUS"]}>
          {loading && logs.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-6 block">Loading logs...</span></Td>
            </tr>
          ) : logs.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-6 block">No automation logs found.</span></Td>
            </tr>
          ) : (
            logs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <Td className="font-mono text-[11px] text-muted-text">
                  {new Date(log.createdAt).toLocaleString()}
                </Td>
                <Td>
                  <span className="px-[6px] py-[2px] bg-gray-100 text-gray-700 rounded-[4px] text-[10px] font-bold uppercase tracking-wider">
                    {log.type}
                  </span>
                </Td>
                <Td className="font-semibold text-[13px]">{log.title}</Td>
                <Td className="text-[12px] max-w-[300px] truncate" title={log.message}>{log.message}</Td>
                <Td className="font-mono text-[12px]">{log.entityId ? `#${log.entityId}` : '—'}</Td>
                <Td>
                  {log.isRead ? (
                    <span className="text-green-600 font-medium text-[12px]">Processed ✓</span>
                  ) : (
                    <span className="text-amber-600 font-medium text-[12px]">Pending ⏳</span>
                  )}
                </Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </div>
    </div>
  );
}
