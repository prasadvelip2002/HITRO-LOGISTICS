using System;

namespace api_backend.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public required string VehicleNumber { get; set; }
        public string? Type { get; set; }
        public decimal Capacity { get; set; }
        public string? OwnerName { get; set; }
        public string? RCNumber { get; set; }
        public DateTime? InsuranceExpiry { get; set; }
        public DateTime? PermitExpiry { get; set; }
        public DateTime? FitnessExpiry { get; set; }
        public string? Code { get; set; } // e.g. VEH-001
        public string? Status { get; set; } // e.g. Active, Maintenance
        
        public int? VendorId { get; set; }
        public Vendor? Vendor { get; set; }

        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
