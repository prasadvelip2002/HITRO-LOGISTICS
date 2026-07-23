"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProtoTable, Td, ProtoButton } from "@/components/PrototypeUI";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    passwordHash: "",
    role: "Internal User"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await fetchApi("/Users");
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchApi("/Users", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          tenantId: 1 // hardcoded to first tenant for prototype
        }),
      });
      setFormData({ name: "", email: "", passwordHash: "", role: "Internal User" });
      loadUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to add user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetchApi(`/Users/${id}`, { method: "DELETE" });
      loadUsers();
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-[18px] items-start">
      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">Team & Users</h3>
          <span className="text-[11.5px] text-muted-text">Manage access and roles</span>
        </div>
        <ProtoTable headers={["ID", "NAME", "EMAIL", "ROLE", "ACTIONS"]}>
          {loading ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-5 block">Loading users...</span></Td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <Td className="text-center text-muted-text"><span className="col-span-5 block">No users found.</span></Td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                <Td className="font-mono font-semibold text-[12.5px]">{user.id}</Td>
                <Td className="font-semibold text-ink">{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <span className="px-[8px] py-[3px] bg-[#e0f2fe] text-[#075985] rounded-[6px] text-[11px] font-medium border border-[#bae6fd]">
                    {user.role}
                  </span>
                </Td>
                <Td>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-muted-text hover:text-alert text-[12px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </Td>
              </tr>
            ))
          )}
        </ProtoTable>
      </div>

      <div className="bg-panel border border-line rounded-[10px] overflow-hidden">
        <div className="px-[18px] py-[14px] border-b border-line">
          <h3 className="font-disp text-[14.5px] font-semibold m-0">Add New User</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-[16px] flex flex-col gap-[12px]">
          <div>
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="e.g. John Doe" />
          </div>
          <div>
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Email / Username</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Password</label>
            <input required type="password" value={formData.passwordHash} onChange={e => setFormData({...formData, passwordHash: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-[11.5px] font-semibold text-muted-text mb-[5px] uppercase tracking-[0.3px]">Role</label>
            <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-line rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#FAFBFD] text-ink font-body outline-none focus:border-signal">
              <option value="Internal User">Internal User</option>
              <option value="Accounts">Accounts</option>
              <option value="Manager">Manager</option>
              <option value="Tenant Admin">Tenant Admin</option>
            </select>
          </div>
          
          <div className="mt-2">
            <ProtoButton variant="dark" style={{ width: '100%' }}>
              {isSubmitting ? "Adding..." : "Add User"}
            </ProtoButton>
          </div>
        </form>
      </div>
    </div>
  );
}
