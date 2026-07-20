using System;
using System.Collections.Generic;

namespace api_backend.Models
{
    public class Driver
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Phone { get; set; }
        public string? LicenseNumber { get; set; }
        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Trip>? Trips { get; set; }
    }
}
