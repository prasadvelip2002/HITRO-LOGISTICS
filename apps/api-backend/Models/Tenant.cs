using System;
using System.Collections.Generic;

namespace api_backend.Models
{
    public class Tenant
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<User>? Users { get; set; }
    }
}
