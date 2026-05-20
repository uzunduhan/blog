using BlogApi.Data;
using BlogApi.DTOs;
using BlogApi.Models;
using BlogApi.Services.Results;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Services;

public class CommentService(ApplicationDbContext db) : ICommentService
{
    public async Task<ServiceResult<IEnumerable<CommentResponseDto>>> GetByPostAsync(int postId)
    {
        var postExists = await db.Posts.AnyAsync(p => p.Id == postId && p.IsApproved);
        if (!postExists) return ServiceResult<IEnumerable<CommentResponseDto>>.NotFound();

        var comments = await db.Comments
            .Where(c => c.PostId == postId)
            .Include(c => c.User)
            .OrderBy(c => c.CreatedDate)
            .Select(c => new CommentResponseDto(c.Id, c.Text, c.CreatedDate, c.User.UserName!))
            .ToListAsync();

        return ServiceResult<IEnumerable<CommentResponseDto>>.Ok(comments);
    }

    public async Task<ServiceResult<int>> CreateAsync(int postId, CreateCommentDto dto, string userId)
    {
        var postExists = await db.Posts.AnyAsync(p => p.Id == postId && p.IsApproved);
        if (!postExists) return ServiceResult<int>.NotFound();

        var comment = new Comment { PostId = postId, UserId = userId, Text = dto.Text };
        db.Comments.Add(comment);
        await db.SaveChangesAsync();
        return ServiceResult<int>.Ok(comment.Id);
    }

    public async Task<ServiceResult> DeleteAsync(int postId, int id, string userId, bool isAdmin)
    {
        var comment = await db.Comments.FirstOrDefaultAsync(c => c.Id == id && c.PostId == postId);
        if (comment is null) return ServiceResult.NotFound();
        if (comment.UserId != userId && !isAdmin) return ServiceResult.Forbidden();

        db.Comments.Remove(comment);
        await db.SaveChangesAsync();
        return ServiceResult.Ok();
    }
}
