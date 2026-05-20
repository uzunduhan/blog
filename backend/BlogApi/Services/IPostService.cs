using BlogApi.DTOs;
using BlogApi.Services.Results;

namespace BlogApi.Services;

public interface IPostService
{
    Task<IEnumerable<PostResponseDto>> GetAllApprovedAsync();
    Task<IEnumerable<PostResponseDto>> GetPendingAsync();
    Task<ServiceResult<PostResponseDto>> GetByIdAsync(int id, bool isAdmin);
    Task<int> CreateAsync(CreatePostDto dto, string userId);
    Task<ServiceResult> UpdateAsync(int id, UpdatePostDto dto, string userId, bool isAdmin);
    Task<ServiceResult> DeleteAsync(int id, string userId, bool isAdmin);
    Task<ServiceResult> ApproveAsync(int id);
}
