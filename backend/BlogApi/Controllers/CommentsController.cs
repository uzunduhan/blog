using System.Security.Claims;
using BlogApi.DTOs;
using BlogApi.Services;
using BlogApi.Services.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/posts/{postId:int}/comments")]
public class CommentsController(ICommentService commentService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetByPost(int postId)
    {
        var result = await commentService.GetByPostAsync(postId);
        return result.Status == ResultStatus.NotFound ? NotFound() : Ok(result.Data);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(int postId, [FromBody] CreateCommentDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await commentService.CreateAsync(postId, dto, userId);
        return result.Status == ResultStatus.NotFound
            ? NotFound()
            : StatusCode(201, new { id = result.Data });
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int postId, int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await commentService.DeleteAsync(postId, id, userId, User.IsInRole("Admin"));
        return result.Status switch
        {
            ResultStatus.NotFound => NotFound(),
            ResultStatus.Forbidden => Forbid(),
            _ => NoContent()
        };
    }
}
