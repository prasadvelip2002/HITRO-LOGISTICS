using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using api_backend.Data;
using api_backend.Models;
using api_backend.Services.Interfaces;

namespace api_backend.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IDocumentService _documentService;

        public DocumentsController(ApplicationDbContext context, IDocumentService documentService)
        {
            _context = context;
            _documentService = documentService;
        }

        // POST: api/Documents/Upload
        [HttpPost("Upload")]
        public async Task<ActionResult<Document>> UploadDocument([FromForm] IFormFile file, [FromForm] string entityType, [FromForm] int entityId, [FromForm] string documentType)
        {
            try
            {
                var doc = await _documentService.UploadDocumentAsync(file, entityType, entityId, documentType);
                return Ok(doc);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/Documents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Document>>> GetDocuments()
        {
            return await _context.Documents.ToListAsync();
        }

        // GET: api/Documents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Document>> GetDocument(int id)
        {
            var document = await _context.Documents.FindAsync(id);

            if (document == null)
            {
                return NotFound();
            }

            return document;
        }

        // POST: api/Documents
        [HttpPost]
        public async Task<ActionResult<Document>> PostDocument(Document document)
        {
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDocument), new { id = document.Id }, document);
        }

        // PUT: api/Documents/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDocument(int id, Document document)
        {
            if (id != document.Id)
            {
                return BadRequest();
            }

            _context.Entry(document).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocumentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Documents/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null)
            {
                return NotFound();
            }

            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DocumentExists(int id)
        {
            return _context.Documents.Any(e => e.Id == id);
        }
    }
}

