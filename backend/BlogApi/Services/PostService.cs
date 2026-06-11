using BlogApi.Data;
using BlogApi.DTOs;
using BlogApi.Models;
using BlogApi.Services.Results;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Services;

public class PostService(ApplicationDbContext db) : IPostService
{
    public async Task<PagedResult<PostResponseDto>> GetAllApprovedAsync(PostsQueryDto query)
    {
        var q = db.Posts.Where(p => p.IsApproved);

        if (query.CategoryId.HasValue)
            q = q.Where(p => p.Categories.Any(c => c.Id == query.CategoryId));

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim().ToLower();
            q = q.Where(p => p.Title.ToLower().Contains(term) || p.Content.ToLower().Contains(term));
        }

        var totalCount = await q.CountAsync();
        var pageSize   = Math.Clamp(query.PageSize, 1, 50);
        var page       = Math.Max(query.Page, 1);

        var items = await q
            .OrderByDescending(p => p.CreatedDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PostResponseDto(
                p.Id, p.Title, p.Content, p.CreatedDate, p.IsApproved,
                p.Author.UserName!,
                p.Comments.Count,
                p.ImageUrl,
                p.Categories.Select(c => new CategoryDto(c.Id, c.Name)).ToList()))
            .ToListAsync();

        return new PagedResult<PostResponseDto>(items, totalCount, page, pageSize);
    }

    public async Task<IEnumerable<PostResponseDto>> GetPendingAsync() =>
        await db.Posts
            .Where(p => !p.IsApproved)
            .OrderByDescending(p => p.CreatedDate)
            .Select(p => new PostResponseDto(
                p.Id, p.Title, p.Content, p.CreatedDate, p.IsApproved,
                p.Author.UserName!,
                p.Comments.Count,
                p.ImageUrl,
                p.Categories.Select(c => new CategoryDto(c.Id, c.Name)).ToList()))
            .ToListAsync();

    public async Task<IEnumerable<PostResponseDto>> GetUserPostsAsync(string userId) =>
        await db.Posts
            .Where(p => p.AuthorId == userId)
            .OrderBy(p => p.IsApproved)
            .ThenByDescending(p => p.CreatedDate)
            .Select(p => new PostResponseDto(
                p.Id, p.Title, p.Content, p.CreatedDate, p.IsApproved,
                p.Author.UserName!,
                p.Comments.Count,
                p.ImageUrl,
                p.Categories.Select(c => new CategoryDto(c.Id, c.Name)).ToList()))
            .ToListAsync();

    public async Task<ServiceResult<PostResponseDto>> GetByIdAsync(int id, bool isAdmin, string? userId = null)
    {
        var post = await db.Posts
            .Include(p => p.Author)
            .Include(p => p.Comments)
            .Include(p => p.Categories)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post is null) return ServiceResult<PostResponseDto>.NotFound();
        if (!post.IsApproved && !isAdmin && post.AuthorId != userId) return ServiceResult<PostResponseDto>.Forbidden();

        return ServiceResult<PostResponseDto>.Ok(
            new PostResponseDto(
                post.Id, post.Title, post.Content, post.CreatedDate, post.IsApproved,
                post.Author.UserName!,
                post.Comments.Count,
                post.ImageUrl,
                post.Categories.Select(c => new CategoryDto(c.Id, c.Name)).ToList()));
    }

    public async Task<int> CreateAsync(CreatePostDto dto, string userId)
    {
        var post = new Post
        {
            Title = dto.Title,
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            AuthorId = userId,
            IsApproved = false
        };

        if (dto.CategoryIds is { Count: > 0 })
        {
            var cats = await db.Categories
                .Where(c => dto.CategoryIds.Contains(c.Id))
                .ToListAsync();
            foreach (var c in cats) post.Categories.Add(c);
        }

        db.Posts.Add(post);
        await db.SaveChangesAsync();
        return post.Id;
    }

    public async Task<ServiceResult> UpdateAsync(int id, UpdatePostDto dto, string userId, bool isAdmin)
    {
        var post = await db.Posts
            .Include(p => p.Categories)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post is null) return ServiceResult.NotFound();
        if (post.AuthorId != userId && !isAdmin) return ServiceResult.Forbidden();

        post.Title = dto.Title;
        post.Content = dto.Content;
        post.ImageUrl = dto.ImageUrl;
        post.IsApproved = false;

        post.Categories.Clear();
        if (dto.CategoryIds is { Count: > 0 })
        {
            var cats = await db.Categories
                .Where(c => dto.CategoryIds.Contains(c.Id))
                .ToListAsync();
            foreach (var c in cats) post.Categories.Add(c);
        }

        await db.SaveChangesAsync();
        return ServiceResult.Ok();
    }

    public async Task<ServiceResult> DeleteAsync(int id, string userId, bool isAdmin)
    {
        var post = await db.Posts.FindAsync(id);
        if (post is null) return ServiceResult.NotFound();
        if (post.AuthorId != userId && !isAdmin) return ServiceResult.Forbidden();

        db.Posts.Remove(post);
        await db.SaveChangesAsync();
        return ServiceResult.Ok();
    }

    public async Task<ServiceResult> ApproveAsync(int id)
    {
        var post = await db.Posts.FindAsync(id);
        if (post is null) return ServiceResult.NotFound();

        post.IsApproved = true;
        await db.SaveChangesAsync();
        return ServiceResult.Ok();
    }
}
