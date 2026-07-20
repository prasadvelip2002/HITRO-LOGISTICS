using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using api_backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using api_backend.Services.Interfaces;

namespace api_backend.Services
{
    public class DailySchedulerService : BackgroundService
    {
        private readonly ILogger<DailySchedulerService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public DailySchedulerService(ILogger<DailySchedulerService> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Daily Scheduler Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                var now = DateTime.Now;
                
                // Example logic to run at 6 AM
                // In a real app, you'd calculate time until 6 AM and Delay, but for demo we just run once a day or check periodically.
                // We will simulate it by running immediately on start, then sleeping for 24 hours.

                _logger.LogInformation($"Daily Scheduler Job is running at: {now}");

                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                        var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                        // Find trips that are delivered but waiting for Manager Approval or Final Payment
                        var pendingTrips = await context.Trips
                            .Where(t => t.Status == "Delivered")
                            .ToListAsync(stoppingToken);

                        if (pendingTrips.Any())
                        {
                            _logger.LogInformation($"Found {pendingTrips.Count} trips pending action. Sending alerts...");
                            
                            foreach(var trip in pendingTrips)
                            {
                                await notificationService.SendPushNotificationAsync(
                                    "Pending Manager Approval",
                                    $"Trip {trip.Id} requires approval.",
                                    "ApprovalNeeded",
                                    trip.Id);
                            }
                        }
                        
                        // Check for Pending Advances
                        var pendingAdvances = await context.Trips
                            .Where(t => t.Status == "Assigned" && t.AdvanceAmount == 0)
                            .ToListAsync(stoppingToken);
                        
                        foreach (var trip in pendingAdvances)
                        {
                            await notificationService.SendPushNotificationAsync(
                                "Pending Advance",
                                $"Trip {trip.Id} is assigned but advance is pending.",
                                "AdvanceNeeded",
                                trip.Id);
                        }

                        // Check for expiring Vehicle documents (e.g. within 7 days)
                        var nextWeek = DateTime.UtcNow.AddDays(7);
                        var expiringDocuments = await context.Documents
                            .Where(d => d.EntityType == "Vehicle" && d.ExpiryDate.HasValue && d.ExpiryDate.Value.Date <= nextWeek.Date)
                            .ToListAsync(stoppingToken);

                        foreach (var doc in expiringDocuments)
                        {
                            await notificationService.SendPushNotificationAsync(
                                "Document Expiring Soon",
                                $"Vehicle document '{doc.DocumentType}' is expiring on {doc.ExpiryDate?.ToShortDateString()}.",
                                "DocumentExpiry",
                                doc.EntityId);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while executing Daily Scheduler Job.");
                }

                // Sleep for 24 hours
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }

            _logger.LogInformation("Daily Scheduler Service is stopping.");
        }
    }
}
