using BlogApi.DTOs;

namespace BlogApi.Services;

public interface IAuthService
{
    Task<(bool Success, IEnumerable<string> Errors)> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
}
