using BlogApi.DTOs;
using BlogApi.Services;
using BlogApi.Services.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await categoryService.GetAllAsync());

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var result = await categoryService.CreateAsync(dto);
        return result.Status switch
        {
            ResultStatus.Conflict => Conflict(new { message = "Bu kategori zaten mevcut." }),
            ResultStatus.NotFound => BadRequest(new { message = "Geçersiz kategori adı." }),
            _ => StatusCode(201, result.Data)
        };
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await categoryService.DeleteAsync(id);
        return result.Status == ResultStatus.NotFound ? NotFound() : NoContent();
    }
}
