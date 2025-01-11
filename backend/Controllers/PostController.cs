using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebAPI.Data;
using MyWebAPI.Models;
using System.Threading.Tasks;

namespace MyWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PostsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("createPost")]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request)
        {
            if (request.UserId != null)
            {
                var user = await _db.Users.FindAsync(request.UserId.Value);
                if (user == null)
                {
                    return BadRequest(new { message = "User does not exist." });
                }
            }
            else{
                return BadRequest(new { message = "UserId is required." });
            }

            if(string.IsNullOrEmpty(request.Title) || string.IsNullOrEmpty(request.Text)){
                return BadRequest(new { message = "Title and Text are required." });
            }

            var post = new Post
            {
                Title = request.Title,
                Text = request.Text,
                UserId = request.UserId
            };

            _db.Posts.Add(post);
            await _db.SaveChangesAsync();

            return Ok(new { 
                message = "Post created successfully.", 
                postId = post.Id 
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _db.Posts.FindAsync(id);
            if (post == null)
                return NotFound();

            return Ok(post);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _db.Posts.ToListAsync();
            return Ok(posts);
        }
    }

    public class CreatePostRequest
    {
        public string Title { get; set; } = null!;
        public string Text { get; set; } = null!;
        public int? UserId { get; set; }
    }
}
