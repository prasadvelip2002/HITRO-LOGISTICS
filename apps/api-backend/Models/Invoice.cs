using System;
using System.Collections.Generic;

namespace api_backend.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty; // e.g. INV-2026-001

        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public decimal TotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal GrandTotal { get; set; }

        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; }

        public string Status { get; set; } = "Unpaid"; // Unpaid, PartiallyPaid, Paid

        public ICollection<Trip>? Trips { get; set; }

        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
