namespace BlogApi.DTOs;

public record CreatePostDto(string Title, string Content);

public record UpdatePostDto(string Title, string Content);

public record PostResponseDto(
    int Id,
    string Title,
    string Content,
    DateTime CreatedDate,
    bool IsApproved,
    string AuthorUsername);
