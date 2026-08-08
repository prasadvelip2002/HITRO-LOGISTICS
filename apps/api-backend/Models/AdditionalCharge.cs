using System;

namespace api_backend.Models
{
    public class AdditionalCharge
    {
        public int Id { get; set; }
        
        public int TripId { get; set; }
        public Trip? Trip { get; set; }

        public required string ChargeType { get; set; } // Detention, ExtraKM, Labour, Freight, Halting, ExtraDelivery, Hamali, Miscellaneous, Deduction
        public decimal Amount { get; set; }
        public string Status { get; set; } = "PendingApproval"; // PendingApproval, Approved, Rejected

        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
