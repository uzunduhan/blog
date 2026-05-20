namespace BlogApi.DTOs;

public record CreateCommentDto(string Text);

public record CommentResponseDto(
    int Id,
    string Text,
    DateTime CreatedDate,
    string Username);
