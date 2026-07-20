using System;
using System.Collections.Generic;

namespace api_backend.Models
{
    public class Trip
    {
        public int Id { get; set; }
        
        public int IndentId { get; set; }
        public Indent? Indent { get; set; }

        public int VendorId { get; set; }
        public Vendor? Vendor { get; set; }

        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        public int DriverId { get; set; }
        public Driver? Driver { get; set; }

        public decimal FreightCharges { get; set; }
        public decimal AdvanceAmount { get; set; }
        public decimal BalanceAmount { get; set; }
        public string? LRNumber { get; set; }
        
        public string BookingType { get; set; } = "Fixed"; // Fixed, PerTon
        public decimal RatePerTon { get; set; }
        public decimal FixedRate { get; set; }
        
        public string Status { get; set; } = "Assigned"; // Assigned, Accepted, Started, Delivered, Closed

        public ICollection<Payment>? Payments { get; set; }
        public ICollection<AdditionalCharge>? AdditionalCharges { get; set; }

        public DateTime? TripStartDate { get; set; }
        public DateTime? TripEndDate { get; set; }
        public decimal? StartingKM { get; set; }
        public decimal? EndingKM { get; set; }
        public string? EwayBillNumber { get; set; }
        public decimal? TollCharges { get; set; }
        public decimal? FuelAdvance { get; set; }

        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
