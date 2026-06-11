using BlogApi.DTOs;
using BlogApi.Services.Results;

namespace BlogApi.Services;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<ServiceResult<CategoryDto>> CreateAsync(CreateCategoryDto dto);
    Task<ServiceResult> DeleteAsync(int id);
}
