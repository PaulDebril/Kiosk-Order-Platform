using Microsoft.EntityFrameworkCore;
using Xunit;

namespace kiosk_backend.Tests.Services;

public class CategoryServiceTests
{
    private ApplicationDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllCategories()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var service = new CategoryService(context);

        var category1 = new Category { Id = Guid.NewGuid(), Name = "Burgers", Icon = "🍔" };
        var category2 = new Category { Id = Guid.NewGuid(), Name = "Pizzas", Icon = "🍕" };
        
        context.Categories.AddRange(category1, category2);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
        Assert.Contains(result, c => c.Name == "Burgers");
        Assert.Contains(result, c => c.Name == "Pizzas");
    }

    [Fact]
    public async Task CreateAsync_CreatesNewCategory()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var service = new CategoryService(context);
        
        var newCategory = new Category 
        { 
            Name = "Desserts", 
            Icon = "🍰" 
        };

        // Act
        var result = await service.CreateAsync(newCategory);

        // Assert
        Assert.NotNull(result);
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal("Desserts", result.Name);
        Assert.Equal("🍰", result.Icon);

        // Vérifier que la catégorie est bien en base
        var savedCategory = await context.Categories.FindAsync(result.Id);
        Assert.NotNull(savedCategory);
        Assert.Equal("Desserts", savedCategory.Name);
    }
}
