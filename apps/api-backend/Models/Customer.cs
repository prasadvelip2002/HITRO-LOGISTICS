using System;

namespace api_backend.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? GSTIN { get; set; }
        public string? Address { get; set; }
        public string? ContactPerson { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
