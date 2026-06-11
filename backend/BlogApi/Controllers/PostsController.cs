using System.Security.Claims;
using BlogApi.DTOs;
using BlogApi.Services;
using BlogApi.Services.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController(IPostService postService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PostsQueryDto query) =>
        Ok(await postService.GetAllApprovedAsync(query));

    [HttpGet("pending")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetPending() =>
        Ok(await postService.GetPendingAsync());

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMy()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        return Ok(await postService.GetUserPostsAsync(userId));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var result = await postService.GetByIdAsync(id, User.IsInRole("Admin"), userId);
        return result.Status switch
        {
            ResultStatus.NotFound => NotFound(),
            ResultStatus.Forbidden => Forbid(),
            _ => Ok(result.Data)
        };
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreatePostDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var postId = await postService.CreateAsync(dto, userId);
        return StatusCode(201, new { postId, message = "Post submitted for approval." });
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePostDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await postService.UpdateAsync(id, dto, userId, User.IsInRole("Admin"));
        return result.Status switch
        {
            ResultStatus.NotFound => NotFound(),
            ResultStatus.Forbidden => Forbid(),
            _ => NoContent()
        };
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await postService.DeleteAsync(id, userId, User.IsInRole("Admin"));
        return result.Status switch
        {
            ResultStatus.NotFound => NotFound(),
            ResultStatus.Forbidden => Forbid(),
            _ => NoContent()
        };
    }

    [HttpPost("{id:int}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Approve(int id)
    {
        var result = await postService.ApproveAsync(id);
        return result.Status == ResultStatus.NotFound
            ? NotFound()
            : Ok(new { message = "Post approved." });
    }
}
