using System;
using System.Threading.Tasks;
using api_backend.Data;
using api_backend.Models;
using api_backend.Services.Interfaces;

namespace api_backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SendPushNotificationAsync(string title, string message, string type, int? relatedId)
        {
            var notification = new Notification
            {
                Title = title,
                Message = message,
                // Assuming we can add type and relatedId if we want, but for now we'll just log it
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task SendWhatsAppMessageAsync(string phoneNumber, string messageTemplate, string status)
        {
            var log = new WhatsAppLog
            {
                PhoneNumber = phoneNumber,
                TemplateName = messageTemplate,
                Status = status,
                SentAt = DateTime.UtcNow
            };

            _context.WhatsAppLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}
