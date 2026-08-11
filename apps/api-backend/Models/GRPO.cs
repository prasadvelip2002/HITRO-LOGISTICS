using System;

namespace api_backend.Models
{
    public class GRPO
    {
        public int Id { get; set; }

        public string GRPONumber { get; set; } = string.Empty; // e.g. GRPO-5001

        public int PurchaseOrderId { get; set; }
        public PurchaseOrder? PurchaseOrder { get; set; }

        public decimal ReceivedQuantity { get; set; }
        public decimal DamagedQuantity { get; set; }
        public string? Remarks { get; set; }

        public string? PODDocumentUrl { get; set; }

        public string Status { get; set; } = "Received"; // Received, Verified, Disputed

        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
