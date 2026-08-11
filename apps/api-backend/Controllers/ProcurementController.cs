using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api_backend.Data;
using api_backend.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace api_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcurementController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProcurementController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Procurement/BroadcastRFQ
        [HttpPost("BroadcastRFQ/{indentId}")]
        [Authorize]
        public async Task<IActionResult> BroadcastRFQ(int indentId, [FromBody] List<int> vendorIds)
        {
            var indent = await _context.Indents.FindAsync(indentId);
            if (indent == null) return NotFound("Indent not found");

            foreach (var vendorId in vendorIds)
            {
                var quotation = new VendorQuotation
                {
                    IndentId = indentId,
                    VendorId = vendorId,
                    Status = "Pending"
                };
                _context.VendorQuotations.Add(quotation);
            }

            indent.RFQStatus = "Sent";
            _context.Entry(indent).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "RFQs sent successfully" });
        }

        // GET: api/Procurement/Quotations/{indentId}
        [HttpGet("Quotations/{indentId}")]
        [Authorize]
        public async Task<IActionResult> GetQuotations(int indentId)
        {
            var quotes = await _context.VendorQuotations
                .Include(q => q.Vendor)
                .Where(q => q.IndentId == indentId)
                .ToListAsync();
            return Ok(quotes);
        }

        // POST: api/Procurement/SubmitBid (Public endpoint for Magic Link)
        [HttpPost("SubmitBid/{token}")]
        [AllowAnonymous]
        public async Task<IActionResult> SubmitBid(string token, [FromBody] BidSubmissionRequest request)
        {
            var quote = await _context.VendorQuotations.FirstOrDefaultAsync(q => q.MagicLinkToken == token);
            if (quote == null) return NotFound("Invalid or expired RFQ link.");

            quote.QuotedRate = request.QuotedRate;
            quote.ProposedVehicleType = request.ProposedVehicleType;
            quote.Remarks = request.Remarks;
            quote.Status = "QuotationReceived";

            var indent = await _context.Indents.FindAsync(quote.IndentId);
            if (indent != null && indent.RFQStatus != "Approved")
            {
                indent.RFQStatus = "QuotationReceived";
                _context.Entry(indent).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Bid submitted successfully" });
        }

        // POST: api/Procurement/ApproveBid/{quotationId}
        [HttpPost("ApproveBid/{quotationId}")]
        [Authorize]
        public async Task<IActionResult> ApproveBid(int quotationId)
        {
            var quote = await _context.VendorQuotations
                .Include(q => q.Indent)
                .FirstOrDefaultAsync(q => q.Id == quotationId);

            if (quote == null) return NotFound("Quotation not found");

            // 1. Approve Quote
            quote.Status = "Approved";

            // Reject all other quotes for this Indent
            var otherQuotes = await _context.VendorQuotations
                .Where(q => q.IndentId == quote.IndentId && q.Id != quotationId)
                .ToListAsync();
            foreach(var other in otherQuotes) other.Status = "Rejected";

            quote.Indent.RFQStatus = "Approved";
            quote.Indent.Status = "Assigned";
            
            // 2. Auto-generate Trip
            var trip = new Trip
            {
                IndentId = quote.IndentId,
                VendorId = quote.VendorId,
                Status = "Assigned",
                BookingType = "Contract",
                SupplierRate = quote.QuotedRate
            };
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync(); // save to get TripId

            // 3. Auto-generate PO
            var po = new PurchaseOrder
            {
                PONumber = $"PO-{trip.Id.ToString().PadLeft(4, '0')}",
                TripId = trip.Id,
                VendorId = quote.VendorId,
                TotalAmount = quote.QuotedRate,
                Status = "Issued"
            };
            _context.PurchaseOrders.Add(po);
            await _context.SaveChangesAsync();

            return Ok(new { tripId = trip.Id, poNumber = po.PONumber, message = "Bid approved, Trip and PO generated successfully" });
        }

        // POST: api/Procurement/ReceiveGRPO/{poId}
        [HttpPost("ReceiveGRPO/{poId}")]
        [Authorize]
        public async Task<IActionResult> ReceiveGRPO(int poId, [FromBody] ReceiveGRPORequest request)
        {
            var po = await _context.PurchaseOrders.FindAsync(poId);
            if (po == null) return NotFound("PO not found");

            var grpo = new GRPO
            {
                GRPONumber = $"GR-{po.Id.ToString().PadLeft(4, '0')}",
                PurchaseOrderId = po.Id,
                ReceivedQuantity = request.ReceivedQuantity,
                DamagedQuantity = request.DamagedQuantity,
                Remarks = request.Remarks,
                PODDocumentUrl = request.PODDocumentUrl,
                Status = "Received"
            };
            
            _context.GRPOs.Add(grpo);
            
            po.Status = "Fulfilled";
            _context.Entry(po).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(grpo);
        }
    }

    public class BidSubmissionRequest
    {
        public decimal QuotedRate { get; set; }
        public string? ProposedVehicleType { get; set; }
        public string? Remarks { get; set; }
    }

    public class ReceiveGRPORequest
    {
        public decimal ReceivedQuantity { get; set; }
        public decimal DamagedQuantity { get; set; }
        public string? Remarks { get; set; }
        public string? PODDocumentUrl { get; set; }
    }
}
