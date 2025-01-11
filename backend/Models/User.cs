using System.ComponentModel.DataAnnotations;

namespace MyWebAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;
        public string Email { get; set; } = null!;
        
    }
}
