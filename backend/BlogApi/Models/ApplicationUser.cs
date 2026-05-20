using Microsoft.AspNetCore.Identity;

namespace BlogApi.Models;

public class ApplicationUser : IdentityUser
{
    public ICollection<Post> Posts { get; set; } = [];
    public ICollection<Comment> Comments { get; set; } = [];
}
