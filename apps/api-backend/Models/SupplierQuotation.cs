using System;

namespace api_backend.Models
{
    public class SupplierQuotation
    {
        public int Id { get; set; }
        
        public int IndentId { get; set; }
        public Indent? Indent { get; set; }

        public int VendorId { get; set; }
        public Vendor? Vendor { get; set; }

        public decimal QuotedRate { get; set; }
        
        public string? VehicleNumber { get; set; }
        public string? DriverName { get; set; }
        
        public string Status { get; set; } = "Submitted"; // Submitted, Accepted, Rejected
        public bool IsPreferred { get; set; }

        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
