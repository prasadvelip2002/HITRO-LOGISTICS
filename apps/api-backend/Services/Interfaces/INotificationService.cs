using System.Threading.Tasks;

namespace api_backend.Services.Interfaces
{
    public interface INotificationService
    {
        Task SendPushNotificationAsync(string title, string message, string type, int? relatedId);
        Task SendWhatsAppMessageAsync(string phoneNumber, string messageTemplate, string status);
    }
}
