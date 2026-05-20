using BlogApi.DTOs;
using BlogApi.Services.Results;

namespace BlogApi.Services;

public interface ICommentService
{
    Task<ServiceResult<IEnumerable<CommentResponseDto>>> GetByPostAsync(int postId);
    Task<ServiceResult<int>> CreateAsync(int postId, CreateCommentDto dto, string userId);
    Task<ServiceResult> DeleteAsync(int postId, int id, string userId, bool isAdmin);
}
