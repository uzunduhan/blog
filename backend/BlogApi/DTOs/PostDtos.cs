namespace BlogApi.DTOs;

public record CreatePostDto(string Title, string Content, string? ImageUrl);

public record UpdatePostDto(string Title, string Content, string? ImageUrl);

public record PostResponseDto(
    int Id,
    string Title,
    string Content,
    DateTime CreatedDate,
    bool IsApproved,
    string AuthorUsername,
    int CommentCount,
    string? ImageUrl);
