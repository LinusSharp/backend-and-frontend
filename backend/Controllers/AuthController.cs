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
            else if (await _db.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email already exists." });
            }

            var hashedPassword = _passwordHasher.HashPassword(request.Password);

            var user = new User
            {
                Username = request.Username,
                PasswordHash = hashedPassword,
                Email = request.Email
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Signup successful." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == request.Username && u.Email == request.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid username or email." });

            var validPassword = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
            if (!validPassword)
                return Unauthorized(new { message = "Invalid password." });

            return Ok(new { message = "Login successful." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            if (string.IsNullOrEmpty(request.CurrentPassword))
            {
                return BadRequest(new { message = "Current password is required." });
            }
            
            var user = await _db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (!string.IsNullOrEmpty(request.CurrentPassword))
            {
                var validPassword = _passwordHasher.VerifyPassword(request.CurrentPassword, user.PasswordHash);
                if (!validPassword)
                {
                    return Unauthorized(new { message = "Current password is incorrect." });
                }
            }
            
            if (!string.IsNullOrEmpty(request.NewUsername))
            {
                bool usernameExists = await _db.Users.AnyAsync(u => u.Username == request.NewUsername && u.Id != id);
                if (usernameExists)
                {
                    return BadRequest(new { message = "New username is already in use." });
                }

                user.Username = request.NewUsername;
            }

            if (!string.IsNullOrEmpty(request.NewEmail))
            {
                bool emailExists = await _db.Users.AnyAsync(u => u.Email == request.NewEmail && u.Id != id);
                if (emailExists)
                {
                    return BadRequest(new { message = "New email is already in use." });
                }

                user.Email = request.NewEmail;
            }

            if (!string.IsNullOrEmpty(request.NewPassword))
            {
                user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
            }

            await _db.SaveChangesAsync();

            return Ok(new { message = "User updated successfully." });
        }
    }

    public class SignupRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Email { get; set; } = null!;
    }

    public class LoginRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Email { get; set; } = null!;
    }

    public class UpdateUserRequest
    {
        public string? NewUsername { get; set; }
        public string? NewEmail { get; set; }
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
    }

}
