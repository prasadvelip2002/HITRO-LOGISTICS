using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using api_backend.Data;
using api_backend.Models;
using api_backend.Services.Interfaces;

namespace api_backend.Services
{
    public class TripService : ITripService
    {
        private readonly ApplicationDbContext _context;

        public TripService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Trip> AssignTripAsync(AssignTripRequest request)
        {
            var indent = await _context.Indents.FindAsync(request.IndentId);
            if (indent == null) throw new Exception("Indent not found.");

            // Calculate Freight
            decimal freightCharges = 0;
            if (request.BookingType == "PerTon")
            {
                freightCharges = indent.Weight * request.RatePerTon;
            }
            else
            {
                freightCharges = request.FixedRate;
            }

            var trip = new Trip
            {
                IndentId = request.IndentId,
                VendorId = request.VendorId,
                VehicleId = request.VehicleId,
                DriverId = request.DriverId,
                BookingType = request.BookingType,
                RatePerTon = request.RatePerTon,
                FixedRate = request.FixedRate,
                AdvanceAmount = request.AdvanceAmount,
                StartingKM = request.StartingKM,
                TripStartDate = request.TripStartDate,
                FreightCharges = freightCharges,
                BalanceAmount = freightCharges - request.AdvanceAmount, // balance is freight - advance
                Status = "Assigned",
                CreatedAt = DateTime.UtcNow
            };

            indent.Status = "Assigned";
            
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            return trip;
        }

        public async Task<Trip> UpdateTripStatusAsync(int tripId, string newStatus)
        {
            var trip = await _context.Trips.FindAsync(tripId);
            if (trip == null) throw new Exception("Trip not found.");

            trip.Status = newStatus;
            await _context.SaveChangesAsync();

            return trip;
        }

        public async Task<Trip> RecalculateBalanceAsync(int tripId)
        {
            var trip = await _context.Trips
                .Include(t => t.Payments)
                .Include(t => t.AdditionalCharges)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null) throw new Exception("Trip not found.");

            decimal totalPayments = trip.Payments?.Sum(p => p.Amount) ?? 0;
            decimal approvedExtraCharges = trip.AdditionalCharges?.Where(a => a.Status == "Approved").Sum(a => a.Amount) ?? 0;

            trip.BalanceAmount = trip.FreightCharges + approvedExtraCharges - totalPayments;
            
            await _context.SaveChangesAsync();

            return trip;
        }
    }
}
