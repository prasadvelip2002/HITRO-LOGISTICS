"use client";

import { useState, useEffect } from "react";
import { postPayment, getTrips } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    tripId: "",
    amount: "",
    type: "Advance",
    utrNumber: "",
  });

  useEffect(() => {
    getTrips().then(data => setTrips(data.filter((t: any) => t.status !== 'Closed'))).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postPayment({
        tripId: parseInt(formData.tripId),
        amount: parseFloat(formData.amount),
        type: formData.type,
        utrNumber: formData.utrNumber,
        status: "Completed",
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Select Trip</Label>
        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formData.tripId}
          onChange={e => setFormData({...formData, tripId: e.target.value})}
          required
        >
          <option value="">Select an active trip...</option>
          {trips.map(t => (
            <option key={t.id} value={t.id}>TRP-{t.id} (Balance: ₹{t.balanceAmount})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Payment Type</Label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
            required
          >
            <option value="Advance">Advance Payment</option>
            <option value="Final">Final Payment</option>
            <option value="Unloading">Unloading Charges</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Amount (₹)</Label>
          <Input 
            type="number" 
            required 
            value={formData.amount}
            onChange={e => setFormData({...formData, amount: e.target.value})}
            placeholder="e.g. 5000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>UTR / Reference Number</Label>
        <Input 
          type="text" 
          required 
          value={formData.utrNumber}
          onChange={e => setFormData({...formData, utrNumber: e.target.value})}
          placeholder="e.g. UTR123456789"
        />
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
          {loading ? "Processing..." : "Log Payment"}
        </Button>
      </div>
    </form>
  );
}
