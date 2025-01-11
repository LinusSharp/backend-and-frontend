using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyWebAPI.Models
{
    public class Post
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)] // or whatever max length you prefer
        public string Title { get; set; } = null!;

        [Required]
        public string Text { get; set; } = null!;

        // (Optional) If you want to link posts to a user:
        public int? UserId { get; set; } 
        public User? User { get; set; }
    }
}
