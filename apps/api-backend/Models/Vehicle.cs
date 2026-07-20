using System;

namespace api_backend.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public required string VehicleNumber { get; set; }
        public string? Type { get; set; }
        public decimal Capacity { get; set; }
        
        public int? VendorId { get; set; }
        public Vendor? Vendor { get; set; }

        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
