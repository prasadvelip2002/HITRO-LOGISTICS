using System;

namespace api_backend.Models
{
    public class Payment
    {
        public int Id { get; set; }
        
        public int TripId { get; set; }
        public Trip? Trip { get; set; }

        public decimal Amount { get; set; }
        public required string Type { get; set; } // Advance, Final, Unloading, Incentive, CourierCharge
        public string? UTRNumber { get; set; }
        
        public string? BeneficiaryType { get; set; } // Vendor, Driver
        public int? DriverId { get; set; }
        public Driver? Driver { get; set; }
        public string? BankProofUrl { get; set; }
        
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending"; // Pending, Completed

        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
