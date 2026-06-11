namespace BlogApi.DTOs;

public record CreatePostDto(string Title, string Content, string? ImageUrl, List<int>? CategoryIds);

public record UpdatePostDto(string Title, string Content, string? ImageUrl, List<int>? CategoryIds);

public record PostResponseDto(
    int Id,
    string Title,
    string Content,
    DateTime CreatedDate,
    bool IsApproved,
    string AuthorUsername,
    int CommentCount,
    string? ImageUrl,
    List<CategoryDto> Categories);

public record PostsQueryDto(
    int? CategoryId = null,
    string? Search = null,
    int Page = 1,
    int PageSize = 6);

public record PagedResult<T>(
    IEnumerable<T> Items,
    int TotalCount,
    int Page,
    int PageSize)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
