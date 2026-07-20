using System;
using System.Collections.Generic;

namespace api_backend.Models
{
    public class Vendor
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? PAN { get; set; }
        public string? GSTIN { get; set; }
        public string? BankDetails { get; set; }
        public string? TDSInfo { get; set; }
        public string? Phone { get; set; }
        public string? RouteRemarks { get; set; }

        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Vehicle>? Vehicles { get; set; }
        public ICollection<Trip>? Trips { get; set; }
    }
}
