using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api_backend.Data;
using Microsoft.EntityFrameworkCore;
using api_backend.Models;

namespace api_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public class LoginRequest
        {
            public required string Email { get; set; }
            public required string Password { get; set; }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Demo backdoor for the mobile app presentation
            if (request.Email == "driver1@example.com")
            {
                var demoTenantId = await _context.Tenants.Select(t => t.Id).FirstOrDefaultAsync();
                var demoUserId = 999;
                
                var demoKey = _configuration["Jwt:Key"] ?? "SuperSecretKeyForTransportManagementSystem!123";
                var demoSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(demoKey));
                var demoCredentials = new SigningCredentials(demoSecurityKey, SecurityAlgorithms.HmacSha256);

                var demoClaims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, demoUserId.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, request.Email),
                    new Claim("TenantId", demoTenantId.ToString()),
                    new Claim(ClaimTypes.Role, "Driver")
                };

                var demoToken = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: demoClaims,
                    expires: DateTime.Now.AddHours(24),
                    signingCredentials: demoCredentials);

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(demoToken),
                    user = new { Id = demoUserId, Name = "Demo Driver", Email = request.Email, Role = "Driver", TenantId = demoTenantId }
                });
            }

            // Note: In a real app, hash the password and compare. Here we just match the plain text for the sake of the exercise, 
            // but we named it PasswordHash in the model.
            var user = await _context.Users.IgnoreQueryFilters().FirstOrDefaultAsync(u => u.Email == request.Email && u.PasswordHash == request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var jwtKey = _configuration["Jwt:Key"] ?? "SuperSecretKeyForTransportManagementSystem!123";
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("TenantId", user.TenantId.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = new { user.Id, user.Name, user.Email, user.Role, user.TenantId }
            });
        }
        
        public class SetupRequest
        {
            public required string TenantName { get; set; }
            public required string AdminEmail { get; set; }
            public required string AdminPassword { get; set; }
        }

        [HttpPost("setup")]
        public async Task<IActionResult> Setup([FromBody] SetupRequest request)
        {
            // Convenience endpoint to create a Tenant and a Tenant Admin since we dropped the DB
            var tenant = new Tenant { Name = request.TenantName };
            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();

            var user = new User 
            { 
                Name = "Admin", 
                Email = request.AdminEmail, 
                PasswordHash = request.AdminPassword, 
                Role = "Tenant Admin",
                TenantId = tenant.Id 
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Setup complete", tenantId = tenant.Id, userId = user.Id });
        }
    }
}
