using BlogApi.Data;
using BlogApi.DTOs;
using BlogApi.Models;
using BlogApi.Services.Results;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Services;

public class CategoryService(ApplicationDbContext db) : ICategoryService
{
    public async Task<IEnumerable<CategoryDto>> GetAllAsync() =>
        await db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto(c.Id, c.Name))
            .ToListAsync();

    public async Task<ServiceResult<CategoryDto>> CreateAsync(CreateCategoryDto dto)
    {
        var name = dto.Name.Trim();
        if (string.IsNullOrWhiteSpace(name))
            return ServiceResult<CategoryDto>.NotFound();

        var exists = await db.Categories.AnyAsync(c => c.Name.ToLower() == name.ToLower());
        if (exists) return ServiceResult<CategoryDto>.Conflict();

        var category = new Category { Name = name };
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return ServiceResult<CategoryDto>.Ok(new CategoryDto(category.Id, category.Name));
    }

    public async Task<ServiceResult> DeleteAsync(int id)
    {
        var category = await db.Categories.FindAsync(id);
        if (category is null) return ServiceResult.NotFound();

        db.Categories.Remove(category);
        await db.SaveChangesAsync();
        return ServiceResult.Ok();
    }
}
