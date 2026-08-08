using System;

namespace api_backend.Models
{
    public class Indent
    {
        public int Id { get; set; }
        
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public required string Source { get; set; }
        public required string Destination { get; set; }
        public string? Material { get; set; }
        public decimal Weight { get; set; }
        public string? VehicleType { get; set; }
        public DateTime LoadingDate { get; set; }
        
        public string Status { get; set; } = "New"; // New, Pending, Assigned

        public string? PricingModel { get; set; } // AnnualContract, CaseToCase
        public decimal? CustomerRate { get; set; }
        public string RFQStatus { get; set; } = "Pending"; // Pending, Sent, QuotationReceived, Approved, Rejected

        public string? DestinationsJson { get; set; }
        public bool RequiresWhatsAppShare { get; set; }

        public int? BranchId { get; set; }
        public Branch? Branch { get; set; }

        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
