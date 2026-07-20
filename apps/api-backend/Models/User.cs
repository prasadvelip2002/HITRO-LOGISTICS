using System;

namespace api_backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        
        public required string Role { get; set; } // Internal User, Accounts, Manager, Tenant Admin, Driver
        
        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
