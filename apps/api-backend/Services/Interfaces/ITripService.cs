using System.Threading.Tasks;
using api_backend.Models;

namespace api_backend.Services.Interfaces
{
    public interface ITripService
    {
        Task<Trip> AssignTripAsync(AssignTripRequest request);
        Task<Trip> UpdateTripStatusAsync(int tripId, string newStatus);
        Task<Trip> RecalculateBalanceAsync(int tripId);
    }
}
