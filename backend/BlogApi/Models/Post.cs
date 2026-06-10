namespace BlogApi.Models;

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public bool IsApproved { get; set; } = false;
    public string? ImageUrl { get; set; }

    public string AuthorId { get; set; } = string.Empty;
    public ApplicationUser Author { get; set; } = null!;

    public ICollection<Comment> Comments { get; set; } = [];
}
