using BlogApi.Extensions;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddIdentityServices();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddCorsPolicy(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddOpenApiDocumentation();
builder.Services.AddControllers();

var app = builder.Build();

await app.SeedRolesAsync();

app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options.Title = "Blog API";
    options.AddHttpAuthentication("Bearer", bearer =>
    {
        bearer.Token = string.Empty;
    });
});

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

