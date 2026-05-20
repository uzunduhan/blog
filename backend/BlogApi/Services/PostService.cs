using BlogApi.Data;
using BlogApi.DTOs;
using BlogApi.Models;
using BlogApi.Services.Results;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Services;

public class PostService(ApplicationDbContext db) : IPostService
{
    public async Task<IEnumerable<PostResponseDto>> GetAllApprovedAsync() =>
        await db.Posts
            .Where(p => p.IsApproved)
            .Include(p => p.Author)
            .OrderByDescending(p => p.CreatedDate)
            .Select(p => new PostResponseDto(p.Id, p.Title, p.Content, p.CreatedDate, p.IsApproved, p.Author.UserName!))
            .ToListAsync();

    public async Task<IEnumerable<PostResponseDto>> GetPendingAsync() =>
        await db.Posts
            .Where(p => !p.IsApproved)
            .Include(p => p.Author)
            .OrderByDescending(p => p.CreatedDate)
            .Select(p => new PostResponseDto(p.Id, p.Title, p.Content, p.CreatedDate, p.IsApproved, p.Author.UserName!))
            .ToListAsync();

    public async Task<ServiceResult<PostResponseDto>> GetByIdAsync(int id, bool isAdmin)
    {
        var post = await db.Posts
            .Include(p => p.Author)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post is null) return ServiceResult<PostResponseDto>.NotFound();
        if (!post.IsApproved && !isAdmin) return ServiceResult<PostResponseDto>.Forbidden();

        return ServiceResult<PostResponseDto>.Ok(
            new PostResponseDto(post.Id, post.Title, post.Content, post.CreatedDate, post.IsApproved, post.Author.UserName!));
    }

    public async Task<int> CreateAsync(CreatePostDto dto, string userId)
    {
        var post = new Post
        {
            Title = dto.Title,
            Content = dto.Content,
            AuthorId = userId,
            IsApproved = false
        };

        db.Posts.Add(post);
        await db.SaveChangesAsync();
        return post.Id;
    }

    public async Task<ServiceResult> UpdateAsync(int id, UpdatePostDto dto, string userId, bool isAdmin)
    {
        var post = await db.Posts.FindAsync(id);
        if (post is null) return ServiceResult.NotFound();
        if (post.AuthorId != userId && !isAdmin) return ServiceResult.Forbidden();

        post.Title = dto.Title;
        post.Content = dto.Content;
        post.IsApproved = false;
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
