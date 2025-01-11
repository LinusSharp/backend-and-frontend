using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebAPI.Data;
using MyWebAPI.Models;
using MyWebAPI.Services;

namespace MyWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IPasswordHasher _passwordHasher;

        public AuthController(AppDbContext db, IPasswordHasher passwordHasher)
        {
            _db = db;
            _passwordHasher = passwordHasher;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupRequest request)
        {
            if (await _db.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new { message = "Username already exists." });
            }

            var hashedPassword = _passwordHasher.HashPassword(request.Password);

            var user = new User
            {
                Username = request.Username,
                PasswordHash = hashedPassword,
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Signup successful." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == request.Username);
            if (user == null)
                return Unauthorized(new { message = "Invalid username or password." });

            var validPassword = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
            if (!validPassword)
                return Unauthorized(new { message = "Invalid username or password." });

            return Ok(new { message = "Login successful." });
        }
    }

    public class SignupRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class LoginRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
