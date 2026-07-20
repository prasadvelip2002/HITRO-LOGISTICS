using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api_backend.Data;
using api_backend.Models;

namespace api_backend.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ManagerApprovalsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ManagerApprovalsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ManagerApprovals/PendingCharges
        [HttpGet("PendingCharges")]
        public async Task<ActionResult<IEnumerable<AdditionalCharge>>> GetPendingCharges()
        {
            return await _context.AdditionalCharges
                .Include(c => c.Trip)
                .Where(c => c.Status == "PendingApproval")
                .ToListAsync();
        }

        // POST: api/ManagerApprovals/ApproveCharge/5
        [HttpPost("ApproveCharge/{id}")]
        public async Task<IActionResult> ApproveCharge(int id)
        {
            var charge = await _context.AdditionalCharges.FindAsync(id);

            if (charge == null)
            {
                return NotFound();
            }

            charge.Status = "Approved";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Charge approved successfully." });
        }

        // POST: api/ManagerApprovals/RejectCharge/5
        [HttpPost("RejectCharge/{id}")]
        public async Task<IActionResult> RejectCharge(int id)
        {
            var charge = await _context.AdditionalCharges.FindAsync(id);

            if (charge == null)
            {
                return NotFound();
            }

            charge.Status = "Rejected";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Charge rejected." });
        }
    }
}

