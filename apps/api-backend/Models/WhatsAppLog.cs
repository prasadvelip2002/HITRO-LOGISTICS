using System;

namespace api_backend.Models
{
    public class WhatsAppLog
    {
        public int Id { get; set; }
        
        public required string PhoneNumber { get; set; }
        public required string TemplateName { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Sent, Failed

        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
