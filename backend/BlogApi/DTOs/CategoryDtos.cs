namespace BlogApi.DTOs;

public record CategoryDto(int Id, string Name);
public record CreateCategoryDto(string Name);
