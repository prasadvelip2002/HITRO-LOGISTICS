using Microsoft.EntityFrameworkCore;
using api_backend.Models;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace api_backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IHttpContextAccessor httpContextAccessor)
            : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Indent> Indents { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<AdditionalCharge> AdditionalCharges { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<WhatsAppLog> WhatsAppLogs { get; set; }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<SupplierQuotation> SupplierQuotations { get; set; }
        public DbSet<TripEvent> TripEvents { get; set; }
        public DbSet<CustomerRateContract> CustomerRateContracts { get; set; }

        public int CurrentTenantId 
        { 
            get 
            {
                var tenantClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("TenantId")?.Value;
                if (int.TryParse(tenantClaim, out int tenantId))
                {
                    return tenantId;
                }
                return 0; // Default or no tenant
            } 
        }

        public DbSet<VendorQuotation> VendorQuotations { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<GRPO> GRPOs { get; set; }
        public DbSet<Invoice> Invoices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<Vendor>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<Branch>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<Driver>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<Vehicle>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<Indent>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<Trip>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<Payment>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<AdditionalCharge>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<Document>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<Notification>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<WhatsAppLog>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<SupplierQuotation>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<TripEvent>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<CustomerRateContract>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<VendorQuotation>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<PurchaseOrder>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<GRPO>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
            modelBuilder.Entity<Invoice>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var tenantId = CurrentTenantId;
            if (tenantId > 0)
            {
                foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Added || e.State == EntityState.Modified))
                {
                    // Check if the entity has a TenantId property
                    var property = entry.Properties.FirstOrDefault(p => p.Metadata.Name == "TenantId");
                    if (property != null && (entry.State == EntityState.Added || property.CurrentValue is int val && val == 0))
                    {
                        property.CurrentValue = tenantId;
                    }
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
