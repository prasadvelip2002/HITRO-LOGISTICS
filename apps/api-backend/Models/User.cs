using System;

namespace api_backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        
        public required string Role { get; set; } // Admin, Director/Operations Head, Operations Manager, Branch Supervisor, Finance, Driver

        public int? BranchId { get; set; }
        public Branch? Branch { get; set; }
        
        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
