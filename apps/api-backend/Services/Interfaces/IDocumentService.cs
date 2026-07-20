using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using api_backend.Models;

namespace api_backend.Services.Interfaces
{
    public interface IDocumentService
    {
        Task<Document> UploadDocumentAsync(IFormFile file, string entityType, int entityId, string documentType);
    }
}
