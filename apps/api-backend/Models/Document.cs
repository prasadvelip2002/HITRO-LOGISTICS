using System;

namespace api_backend.Models
{
    public class Document
    {
        public int Id { get; set; }
        
        public required string EntityType { get; set; } // Vehicle, POD
        public int EntityId { get; set; }
        
        public required string DocumentType { get; set; } // RC, Insurance, FrontImage, BackImage
        public required string FileUrl { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
